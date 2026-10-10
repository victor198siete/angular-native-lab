import { screen } from '@ng-native/testing';

interface Node {
  viewName: string;
  props: Record<string, unknown>;
  children: Node[];
}

const textIn = (node: Node): string =>
  node.viewName === 'RawText' ? String(node.props['text'] ?? '') : node.children.map(textIn).join('');

/** The text a screen reader would read from the element with this test id. */
export const textOf = (id: string): string => textIn(screen.getByTestId(id) as unknown as Node);
