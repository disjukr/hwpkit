import { NodeType, Element } from '../naive-xml-parser';

export function el2obj<T extends {} = any>(element: Element): T {
  const result: any = {
    ...element.attrs,
  };
  for (const child of element.children) {
    if (child.type === NodeType.Text) continue;
    result[child.tagName] = child;
  }
  return result;
}
