export const REWARD_CATEGORIES = [
  'Viajes',
  'Gastronomía',
  'Tecnología',
  'Experiencias',
  'Bienestar',
] as const;

export type RewardCategory = (typeof REWARD_CATEGORIES)[number];

/** Icon key per product; resolved to a Lucide icon in shared/icons.ts. */
export type RewardIcon =
  | 'palmtree'
  | 'hotel'
  | 'plane'
  | 'armchair'
  | 'ship'
  | 'car'
  | 'tent-tree'
  | 'mountain'
  | 'leaf'
  | 'shield-check'
  | 'utensils'
  | 'croissant'
  | 'sandwich'
  | 'coffee'
  | 'fish'
  | 'chef-hat'
  | 'wine'
  | 'flame'
  | 'bike'
  | 'candy'
  | 'headphones'
  | 'watch'
  | 'tablet'
  | 'speaker'
  | 'camera'
  | 'keyboard'
  | 'battery-charging'
  | 'monitor'
  | 'map-pin'
  | 'clapperboard'
  | 'mic'
  | 'popcorn'
  | 'wind'
  | 'goal'
  | 'balloon'
  | 'drama'
  | 'aperture'
  | 'waves'
  | 'landmark'
  | 'music'
  | 'hand-heart'
  | 'person-standing'
  | 'dumbbell'
  | 'thermometer-sun'
  | 'salad'
  | 'moon'
  | 'stethoscope'
  | 'flower'
  | 'brain'
  | 'sunrise';

export interface Reward {
  readonly id: string;
  readonly title: string;
  readonly partner: string;
  readonly category: RewardCategory;
  readonly costPoints: number;
  readonly description: string;
  /** Icon used as the visual until real images exist. */
  readonly icon: RewardIcon;
  /** Units left. `undefined` means unlimited. */
  readonly stock?: number;
}
