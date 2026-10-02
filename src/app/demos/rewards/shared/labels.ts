import type { RewardCategory, TierName } from '../core/models/index.ts';

// Display names for values that live in the data as keys. Functions, not constants: $localize at
// module level runs on import, before the translations load, and would stay in English.

export function tierLabel(name: TierName): string {
  switch (name) {
    case 'bronze':
      return $localize`:@@tier.bronze:Bronze`;
    case 'silver':
      return $localize`:@@tier.silver:Silver`;
    case 'gold':
      return $localize`:@@tier.gold:Gold`;
    case 'platinum':
      return $localize`:@@tier.platinum:Platinum`;
  }
}

export function categoryLabel(category: RewardCategory): string {
  switch (category) {
    case 'travel':
      return $localize`:@@category.travel:Travel`;
    case 'dining':
      return $localize`:@@category.dining:Dining`;
    case 'tech':
      return $localize`:@@category.tech:Tech`;
    case 'experiences':
      return $localize`:@@category.experiences:Experiences`;
    case 'wellness':
      return $localize`:@@category.wellness:Wellness`;
  }
}
