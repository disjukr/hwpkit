type Node = Element | Text;
interface NodeBase<TType extends NodeType> {
  type: TType;
}
interface Element extends NodeBase<NodeType.Element> {
  tagName: string;
  attrs: Attrs;
  children: Node[];
}
interface Text extends NodeBase<NodeType.Text> {
  text: string;
}
const enum NodeType {
  Text,
  Element,
}
interface Attrs {
  [key: string]: string
}

export function parse(xml: string): Element {
  // remove xml decl
  if (xml.slice(0, 2) === '<?') xml = xml.slice(xml.indexOf('>') + 1);
  // remove doctype decl
  if (xml.slice(0, 2) === '<!') xml = xml.slice(xml.indexOf('>') + 1);
  let cnt = 0;
  let loc = 0;
  accept(/^\s*/g);
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
    return pattern;
  }
  function acceptRegex(regex: RegExp): string | null {
    const execArray = regex.exec(xml.substr(loc));
    if (execArray == null) return null;
    const [primary, secondary] = execArray;
    loc += execArray.index + primary.length;
    if (secondary) return secondary;
    return primary;
  }
  function parseElement(): Element {
    expect(/^<\s*/g);
    return parseElement2();
  }
  function parseElement2(): Element {
    const tagName = expect(/^([a-zA-Z]+)\s*/g);
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
    expect(/^\s*>\s*/g);
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
      const key = accept(/^([a-zA-Z]+)\s*/g);
      if (key == null) break;
      expect(/^=\s*/g);
      result[key] = expect(/^"(.+?)"\s*/g);
    }
    return result;
  }
  function parseChildren() {
    const result: Node[] = [];
    while (true) {
      const text = accept(/^[^<]+/g);
      if (text != null) {
        result.push({
          type: NodeType.Text,
          text,
        });
        continue;
      }
      if (accept(/^<\/\s*/g) != null) break;
      if (accept(/^<\s*/g)) {
        result.push(parseElement2());
        continue;
      }
      break;
    }
    return result;
  }
}
