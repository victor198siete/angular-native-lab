import type { RewardCategory, TierName } from '../core/models/index.ts';

export const TIER_COLOR: Record<TierName, string> = {
  bronze: '#C98A5B',
  silver: '#B8C0D0',
  gold: '#F2C14E',
  platinum: '#8FD3F4',
};

/** Literal class names so the stylesheet keeps them; the gradients live in styles.css. */
export const CATEGORY_GRADIENT: Record<RewardCategory, string> = {
  travel: 'grad-travel',
  dining: 'grad-dining',
  tech: 'grad-tech',
  experiences: 'grad-experiences',
  wellness: 'grad-wellness',
};
