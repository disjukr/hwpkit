export function getErrorMessage(error: unknown): string {
  const err = error as Error;
  const stack = err.stack?.toString();
  if (stack) return stack;
  const message = err.message?.toString();
  if (message) return message;
  return err?.toString?.() ?? 'error';
}
