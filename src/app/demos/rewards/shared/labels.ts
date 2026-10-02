import type { RewardCategory, TierName } from '../core/models/index.ts';

// Display names for values that live in the data as keys. Functions, not constants: $localize at
// module level runs on import, before the translations load, and would stay in English.

export function tierLabel(name: TierName): string {
  switch (name) {
    case 'Bronce':
      return $localize`:@@tier.bronze:Bronze`;
    case 'Plata':
      return $localize`:@@tier.silver:Silver`;
    case 'Oro':
      return $localize`:@@tier.gold:Gold`;
    case 'Platino':
      return $localize`:@@tier.platinum:Platinum`;
  }
}

export function categoryLabel(category: RewardCategory): string {
  switch (category) {
    case 'Viajes':
      return $localize`:@@category.travel:Travel`;
    case 'Gastronomía':
      return $localize`:@@category.dining:Dining`;
    case 'Tecnología':
      return $localize`:@@category.tech:Tech`;
    case 'Experiencias':
      return $localize`:@@category.experiences:Experiences`;
    case 'Bienestar':
      return $localize`:@@category.wellness:Wellness`;
  }
}
