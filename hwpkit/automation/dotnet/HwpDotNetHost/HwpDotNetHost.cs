using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Reflection;
using System.Runtime.InteropServices;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.JavaScript.NodeApi;

namespace HwpDotNetHost;

public static class Exports
{
    private static readonly Lazy<StaComRunner> _runner = new(() => new StaComRunner());

    [JSExport]
    public static string run(string cmdJson)
    {
        if (string.IsNullOrWhiteSpace(cmdJson))
        {
            return JsonSerializer.Serialize(new { ok = false, error = "empty cmd" });
        }

        try
        {
            return _runner.Value.Run(cmdJson);
        }
        catch (Exception ex)
        {
            return JsonSerializer.Serialize(new { ok = false, error = ex.Message });
        }
    }
}

internal sealed class StaComRunner
{
    private readonly BlockingCollection<(string cmdJson, TaskCompletionSource<string> tcs)> _queue = new();
    private readonly Thread _thread;

    public StaComRunner()
    {
        _thread = new Thread(ThreadMain)
        {
            IsBackground = true,
            Name = "HwpDotNetHost.STA",
        };
        _thread.SetApartmentState(ApartmentState.STA);
        _thread.Start();
    }

    public string Run(string cmdJson)
    {
        var tcs = new TaskCompletionSource<string>(TaskCreationOptions.RunContinuationsAsynchronously);
        _queue.Add((cmdJson, tcs));
        return tcs.Task.GetAwaiter().GetResult();
    }

    private void ThreadMain()
    {
        foreach (var (cmdJson, tcs) in _queue.GetConsumingEnumerable())
        {
            try
            {
                tcs.SetResult(Handle(cmdJson));
            }
            catch (Exception ex)
            {
                tcs.SetResult(JsonSerializer.Serialize(new { ok = false, error = ex.Message }));
            }
        }
    }

    private static string Handle(string cmdJson)
    {
        using var doc = JsonDocument.Parse(cmdJson);
        var root = doc.RootElement;

        var cmd = root.GetProperty("cmd").GetString() ?? "";
        dynamic hwp = NewHwp();

        try
        {
            object result = cmd switch
            {
                "meta" => new { ok = true, data = new { methods = Array.Empty<string>(), properties = Array.Empty<string>() } },
                "call" => Call(hwp, root),
                "get" => Get(hwp, root),
                "set" => Set(hwp, root),
                "batch" => Batch(hwp, root),
                _ => new { ok = false, error = $"unknown cmd: {cmd}" },
            };

            return JsonSerializer.Serialize(result, new JsonSerializerOptions { WriteIndented = false });
        }
        finally
        {
            QuitWithTempSave(hwp);
        }
    }

   
    private static void QuitWithTempSave(dynamic hwp)
    {
        // Workaround: some HWP versions show an un-dismissible save-confirm dialog.
        // Always save to a temp file at the end of each command.
        try { hwp.SetMessageBoxMode(0x00000001); } catch { }

        var tmp = System.IO.Path.Combine(System.IO.Path.GetTempPath(), $"hwp-automation-{DateTime.Now:yyyyMMdd-HHmmss}-{Guid.NewGuid():N}.hwp");

        // Best-effort SaveAs with common signatures.
        try { hwp.SaveAs(tmp); } catch { }
        try { hwp.SaveAs(tmp, "HWP", ""); } catch { }
        try { hwp.SaveAs(tmp, "HWP", "", ""); } catch { }

        QuitNoSave(hwp);
    }
    private static void QuitNoSave(dynamic hwp)
    {
        // Best-effort: suppress message boxes and close without saving.
        try { hwp.SetMessageBoxMode(0x00000001); } catch { }

        // Try closing the active document first.
        try { hwp.HAction.Run("FileClose"); } catch { }

        // Some versions expose overloads that accept a "save changes" flag.
        try { hwp.Quit(false); return; } catch { }
        try { hwp.Quit(0); return; } catch { }

        // Fallback quit.
        try { hwp.Quit(); } catch { }

        // Last resort: click "저장 안 함" on the save-confirm dialog if it appears.
        try { DismissHwpDialogs(); } catch { }
    }

    private static void DismissHwpDialogs()
{
    for (int i = 0; i < 30; i++)
    {
        bool clickedAny = false;

        Native.EnumWindows((hWnd, _l) =>
        {
            if (Native.GetClassName(hWnd) != "#32770") return true;

            IntPtr btn = IntPtr.Zero;
            while (true)
            {
                btn = Native.FindWindowEx(hWnd, btn, "Button", null);
                if (btn == IntPtr.Zero) break;

                var t = Native.GetWindowText(btn);

                if (t.Contains("\uC800\uC7A5") && t.Contains("\uC548"))
                {
                    Native.PostMessage(btn, Native.BM_CLICK, IntPtr.Zero, IntPtr.Zero);
                    clickedAny = true;
                    return true;
                }
                if (t.StartsWith("\uC544\uB2C8\uC624") || t.Equals("No") || t.StartsWith("No"))
                {
                    Native.PostMessage(btn, Native.BM_CLICK, IntPtr.Zero, IntPtr.Zero);
                    clickedAny = true;
                    return true;
                }
                if (t.StartsWith("\uD655\uC778") || t.Equals("OK") || t.StartsWith("OK"))
                {
                    Native.PostMessage(btn, Native.BM_CLICK, IntPtr.Zero, IntPtr.Zero);
                    clickedAny = true;
                    return true;
                }
            }

            return true;
        }, IntPtr.Zero);

        if (!clickedAny) break;
        Thread.Sleep(50);
    }
}
private static dynamic NewHwp()
    {
        var t = Type.GetTypeFromProgID("HWPFrame.HwpObject", throwOnError: true);
        dynamic hwp = Activator.CreateInstance(t)!;
        try { hwp.RegisterModule("FilePathCheckDLL", "FilePathCheckerModuleExample"); } catch { }
        try { hwp.SetMessageBoxMode(0x00000001); } catch { }
        return hwp;
    }

    private static object Meta(dynamic hwp)
    {
        var type = ((object)hwp).GetType();
        var methods = new List<string>();
        var props = new List<string>();

        foreach (var m in type.GetMembers())
        {
            if (m.MemberType == MemberTypes.Method) methods.Add(m.Name);
            if (m.MemberType == MemberTypes.Property) props.Add(m.Name);
        }

        methods.Sort(StringComparer.Ordinal);
        props.Sort(StringComparer.Ordinal);

        return new { ok = true, data = new { methods, properties = props } };
    }

    private static object Call(dynamic hwp, JsonElement root)
    {
        var method = root.GetProperty("method").GetString() ?? "";
        var args = root.TryGetProperty("args", out var a) ? JsonToArgs(a) : Array.Empty<object?>();
        var ret = InvokeMember((object)hwp, method, BindingFlags.InvokeMethod, args);
        return new { ok = true, data = new { @return = ToJsonFriendly(ret) } };
    }

    private static object Get(dynamic hwp, JsonElement root)
    {
        var prop = root.GetProperty("prop").GetString() ?? "";
        var val = InvokeMember((object)hwp, prop, BindingFlags.GetProperty, Array.Empty<object?>());
        return new { ok = true, data = new { value = ToJsonFriendly(val) } };
    }

    private static object Set(dynamic hwp, JsonElement root)
    {
        var prop = root.GetProperty("prop").GetString() ?? "";
        var val = root.GetProperty("value");
        InvokeMember((object)hwp, prop, BindingFlags.SetProperty, new object?[] { JsonToObject(val) });
        return new { ok = true, data = new { ok = true } };
    }

    private static object Batch(dynamic hwp, JsonElement root)
    {
        var results = new List<object?>();
        foreach (var op in root.GetProperty("ops").EnumerateArray())
        {
            var kind = op.GetProperty("op").GetString() ?? "";
            switch (kind)
            {
                case "call":
                {
                    var method = op.GetProperty("method").GetString() ?? "";
                    var args = op.TryGetProperty("args", out var a) ? JsonToArgs(a) : Array.Empty<object?>();
                    var ret = InvokeMember((object)hwp, method, BindingFlags.InvokeMethod, args);
                    results.Add(new { op = "call", method, @return = ToJsonFriendly(ret) });
                    break;
                }
                case "get":
                {
                    var prop = op.GetProperty("prop").GetString() ?? "";
                    var val = InvokeMember((object)hwp, prop, BindingFlags.GetProperty, Array.Empty<object?>());
                    results.Add(new { op = "get", prop, value = ToJsonFriendly(val) });
                    break;
                }
                case "set":
                {
                    var prop = op.GetProperty("prop").GetString() ?? "";
                    var value = JsonToObject(op.GetProperty("value"));
                    InvokeMember((object)hwp, prop, BindingFlags.SetProperty, new object?[] { value });
                    results.Add(new { op = "set", prop, ok = true });
                    break;
                }
                case "runAction":
                {
                    var action = op.GetProperty("action").GetString() ?? "";
                    // Mirror PS: $hwp.HAction.Run($name)
                    hwp.HAction.Run(action);
                    results.Add(new { op = "runAction", action, ok = true });
                    break;
                }
                case "getTextFile":
                {
                    var format = op.GetProperty("format").GetString() ?? "";
                    var option = op.GetProperty("option").GetString() ?? "";
                    string txt = hwp.GetTextFile(format, option);
                    results.Add(new { op = "getTextFile", format, option, text = txt });
                    break;
                }
                case "action":
                {
                    var action = op.GetProperty("action").GetString() ?? "";
                    var pset = op.GetProperty("parameterSet");
                    var runtimeId = pset.GetProperty("runtimeId").GetString() ?? "";
                    var fields = pset.TryGetProperty("fields", out var f) && f.ValueKind == JsonValueKind.Object ? f : default;
                    RunHwpAction(hwp, action, runtimeId, fields);
                    results.Add(new { op = "action", action, runtimeId, ok = true });
                    break;
                }
                default:
                    throw new Exception($"unknown op: {kind}");
            }
        }

        return new { ok = true, data = new { results } };
    }

    private static void RunHwpAction(dynamic hwp, string action, string runtimeId, JsonElement fields)
    {
        // PS:
        // $ps = $hwp.HParameterSet.$runtimeId
        // $null = $hwp.HAction.GetDefault($action, $ps.HSet)
        // foreach field => $ps.$k = $fields.$k
        // $null = $hwp.HAction.Execute($action, $ps.HSet)

        object hParamSet = hwp.HParameterSet;
        object ps = InvokeMember(hParamSet, runtimeId, BindingFlags.GetProperty, Array.Empty<object?>())!;

        var hSet = InvokeMember(ps, "HSet", BindingFlags.GetProperty, Array.Empty<object?>());
        hwp.HAction.GetDefault(action, hSet);

        if (fields.ValueKind == JsonValueKind.Object)
        {
            foreach (var prop in fields.EnumerateObject())
            {
                try
                {
                    InvokeMember(ps, prop.Name, BindingFlags.SetProperty, new object?[] { JsonToObject(prop.Value) });
                }
                catch (Exception ex)
                {
                    throw new Exception($"failed to set parameter field [{prop.Name}] on [{runtimeId}]: {ex.Message}");
                }
            }
        }

        hwp.HAction.Execute(action, hSet);
    }

    private static object? InvokeMember(object target, string name, BindingFlags flags, object?[] args)
    {
        return target.GetType().InvokeMember(name, flags, binder: null, target, args);
    }

    private static object?[] JsonToArgs(JsonElement arr)
    {
        if (arr.ValueKind != JsonValueKind.Array) return Array.Empty<object?>();
        var list = new List<object?>();
        foreach (var el in arr.EnumerateArray()) list.Add(JsonToObject(el));
        return list.ToArray();
    }

    private static object? JsonToObject(JsonElement el)
    {
        return el.ValueKind switch
        {
            JsonValueKind.String => el.GetString(),
            JsonValueKind.Number => el.TryGetInt64(out var i) ? i : el.GetDouble(),
            JsonValueKind.True => true,
            JsonValueKind.False => false,
            JsonValueKind.Null => null,
            JsonValueKind.Array => JsonArrayToList(el),
            JsonValueKind.Object => JsonObjectToDict(el),
            _ => null,
        };
    }

    private static List<object?> JsonArrayToList(JsonElement el)
    {
        var list = new List<object?>();
        foreach (var item in el.EnumerateArray()) list.Add(JsonToObject(item));
        return list;
    }

    private static Dictionary<string, object?> JsonObjectToDict(JsonElement el)
    {
        var dict = new Dictionary<string, object?>(StringComparer.Ordinal);
        foreach (var p in el.EnumerateObject()) dict[p.Name] = JsonToObject(p.Value);
        return dict;
    }

    private static object? ToJsonFriendly(object? value)
    {
        if (value == null) return null;

        // COM objects can't be serialized; match PowerShell behavior by returning empty object.
        try
        {
            if (Marshal.IsComObject(value))
            {
                return new Dictionary<string, object?>();
            }
        }
        catch { }

        if (value is string or bool) return value;
        if (value is int or long or double or float or decimal) return value;

        // Try to handle COM variants (arrays etc.)
        if (value is Array a)
        {
            var list = new List<object?>();
            foreach (var item in a) list.Add(ToJsonFriendly(item));
            return list;
        }

        // Fallback: ToString()
        return value.ToString();
    }
}




internal static class Native
{
    [DllImport("user32.dll", SetLastError = true, CharSet = CharSet.Unicode)]
    public static extern IntPtr FindWindow(string? lpClassName, string? lpWindowName);

    [DllImport("user32.dll", SetLastError = true, CharSet = CharSet.Unicode)]
    public static extern IntPtr FindWindowEx(IntPtr hwndParent, IntPtr hwndChildAfter, string? lpszClass, string? lpszWindow);

    [DllImport("user32.dll", SetLastError = true)]
    public static extern bool PostMessage(IntPtr hWnd, uint Msg, IntPtr wParam, IntPtr lParam);

    [DllImport("user32.dll", SetLastError = true, CharSet = CharSet.Unicode)]
    private static extern int GetWindowTextW(IntPtr hWnd, System.Text.StringBuilder lpString, int nMaxCount);

    public static string GetWindowText(IntPtr hWnd)
    {
        var sb = new System.Text.StringBuilder(256);
        _ = GetWindowTextW(hWnd, sb, sb.Capacity);
        return sb.ToString();
    }

    public delegate bool EnumWindowsProc(IntPtr hWnd, IntPtr lParam);

    [DllImport("user32.dll", SetLastError = true)]
    public static extern bool EnumWindows(EnumWindowsProc lpEnumFunc, IntPtr lParam);

    [DllImport("user32.dll", SetLastError = true, CharSet = CharSet.Unicode)]
    private static extern int GetClassNameW(IntPtr hWnd, System.Text.StringBuilder lpClassName, int nMaxCount);

    public static string GetClassName(IntPtr hWnd)
    {
        var sb = new System.Text.StringBuilder(256);
        _ = GetClassNameW(hWnd, sb, sb.Capacity);
        return sb.ToString();
    }

    public const uint BM_CLICK = 0x00F5;
}


