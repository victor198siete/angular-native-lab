import { render } from '@ng-native/testing';
import { expect, it } from 'vitest';
import { MOCK_REWARDS } from '../../core/mocks/index.ts';
import { RewardRow } from './reward-row.ts';

interface Node {
  viewName: string;
  children: Node[];
}
const find = (nodes: readonly Node[], name: string): Node[] =>
  nodes.flatMap((n) => [...(n.viewName === name ? [n] : []), ...find(n.children, name)]);

it('draws the reward icon as native svg shapes', async () => {
  const { fabric } = await render(RewardRow, { inputs: { reward: MOCK_REWARDS[0]!, balance: 100_000 } });
  const tree = fabric.committed as unknown as Node[];

  const svgs = find(tree, 'RNSVGSvgView');
  expect(svgs).toHaveLength(1);
  expect(svgs[0]!.children.length).toBeGreaterThan(0);
});

it('has an icon for every mock reward and no emoji in any text', () => {
  const emoji = /\p{Extended_Pictographic}/u;
  for (const r of MOCK_REWARDS) {
    expect(r.icon).toBeTruthy();
    expect(emoji.test(`${r.title}${r.partner}${r.description}`)).toBe(false);
  }
});
