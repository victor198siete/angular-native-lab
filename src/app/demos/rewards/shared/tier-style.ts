import type { RewardCategory, TierName } from '../core/models/index.ts';

export const TIER_COLOR: Record<TierName, string> = {
  Bronce: '#C98A5B',
  Plata: '#B8C0D0',
  Oro: '#F2C14E',
  Platino: '#8FD3F4',
};

/** Literal class names so the stylesheet keeps them; the gradients live in styles.css. */
export const CATEGORY_GRADIENT: Record<RewardCategory, string> = {
  Viajes: 'grad-viajes',
  Gastronomía: 'grad-gastronomia',
  Tecnología: 'grad-tecnologia',
  Experiencias: 'grad-experiencias',
  Bienestar: 'grad-bienestar',
};
