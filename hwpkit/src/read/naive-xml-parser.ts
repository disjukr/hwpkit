export type Node = Element | Text;
export interface NodeBase<TType extends NodeType> {
  type: TType;
}
export interface Element extends NodeBase<NodeType.Element> {
  tagName: string;
  attrs: Attrs;
  children: Node[];
}
export interface Text extends NodeBase<NodeType.Text> {
  text: string;
}
export const enum NodeType {
  Text,
  Element,
}
export interface Attrs {
  [key: string]: string
}

export function parse(xml: string, debug = false): Element {
  let cnt = 0;
  let loc = 0;
  accept(/^\s*/);
  accept(/^<\?.+?\?>\s*/);
  accept(/^<!.+?>\s*/);
  return parseElement();
  function accept(pattern: string | RegExp): string | null {
    ++cnt;
    if (cnt > xml.length * 5) throw 'maybe in an infinite loop';
    if (typeof pattern === 'string') return acceptString(pattern);
    return acceptRegex(pattern);
  }
  function expect(pattern: string | RegExp): string {
    const result = accept(pattern);
    if (result == null) throw `error. expected "${pattern}". but "${xml.slice(loc, 10)}"`;
    return result;
  }
  function acceptString(pattern: string): string | null {
    if (xml.substr(loc, pattern.length) !== pattern) return null;
    loc += pattern.length;
    debug && console.log(pattern);
    return pattern;
  }
  function acceptRegex(regex: RegExp): string | null {
    const execArray = regex.exec(xml.substr(loc));
    if (execArray == null) return null;
    const [primary, secondary] = execArray;
    loc += execArray.index + primary.length;
    debug && console.log(primary);
    if (secondary) return secondary;
    return primary;
  }
  function parseElement(): Element {
    expect(/^<\s*/);
    return parseElement2();
  }
  function parseElement2(): Element {
    const tagName = expect(/^([a-zA-Z]+)\s*/);
    const attrs = parseAttrs();
    if (accept('/>')) {
      return {
        type: NodeType.Element,
        tagName,
        attrs,
        children: [],
      };
    }
    expect('>');
    const children = parseChildren();
    expect(tagName);
    expect(/^\s*>\s*/);
    return {
      type: NodeType.Element,
      tagName,
      attrs,
      children,
    };
  }
  function parseAttrs() {
    const result: Attrs = {};
    while (true) {
      const key = accept(/^([a-zA-Z][a-zA-Z0-9]*)\s*/);
      if (key == null) break;
      expect(/^=\s*/);
      result[key] = expect(/^"(.+?)"\s*/);
    }
    return result;
  }
  function parseChildren() {
    const result: Node[] = [];
    while (true) {
      const text = accept(/^[^<]+/);
      if (text != null) {
        result.push({
          type: NodeType.Text,
          text,
        });
        continue;
      }
      if (accept(/^<\/\s*/) != null) break;
      if (accept(/^<\s*/)) {
        result.push(parseElement2());
        continue;
      }
      break;
    }
    return result;
  }
}
