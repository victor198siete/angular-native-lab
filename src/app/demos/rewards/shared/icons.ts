import { provideIcons } from '@ng-icons/core';
import {
  lucideAperture, lucideArmchair, lucideArrowDownLeft, lucideBalloon, lucideBatteryCharging,
  lucideBike, lucideBrain, lucideCamera, lucideCandy, lucideCar, lucideCheck, lucideChefHat,
  lucideClapperboard, lucideCoffee, lucideDrama, lucideDumbbell, lucideFish, lucideFlame,
  lucideFlower, lucideGift, lucideGoal, lucideHandHeart, lucideHeadphones, lucideHistory,
  lucideHotel, lucideKeyboard, lucideLandmark, lucideLeaf, lucideMapPin, lucideMic, lucideMonitor,
  lucideMoon, lucideMountain, lucideMusic, lucidePalmtree, lucidePersonStanding, lucidePlane,
  lucidePopcorn, lucideSalad, lucideSandwich, lucideSearchX, lucideShieldCheck, lucideShip,
  lucideCroissant, lucideSpeaker, lucideStethoscope, lucideSun, lucideSunrise, lucideTablet,
  lucideTentTree, lucideThermometerSun, lucideUtensils, lucideWatch, lucideWaves, lucideWind,
  lucideWine, lucideLock, lucideScanFace, lucideEye, lucideTicket,
} from '@ng-icons/lucide';
import type { RewardIcon } from '../core/models/index.ts';

/** Reward icon key -> the name it is provided under. Every reward carries exactly one key. */
export const REWARD_ICON_NAME: Record<RewardIcon, string> = {
  palmtree: 'lucidePalmtree', hotel: 'lucideHotel', plane: 'lucidePlane', armchair: 'lucideArmchair',
  ship: 'lucideShip', car: 'lucideCar', 'tent-tree': 'lucideTentTree', mountain: 'lucideMountain',
  leaf: 'lucideLeaf', 'shield-check': 'lucideShieldCheck',
  utensils: 'lucideUtensils', croissant: 'lucideCroissant', sandwich: 'lucideSandwich',
  coffee: 'lucideCoffee', fish: 'lucideFish', 'chef-hat': 'lucideChefHat', wine: 'lucideWine',
  flame: 'lucideFlame', bike: 'lucideBike', candy: 'lucideCandy',
  headphones: 'lucideHeadphones', watch: 'lucideWatch', tablet: 'lucideTablet',
  speaker: 'lucideSpeaker', camera: 'lucideCamera', keyboard: 'lucideKeyboard',
  'battery-charging': 'lucideBatteryCharging', monitor: 'lucideMonitor', 'map-pin': 'lucideMapPin',
  clapperboard: 'lucideClapperboard',
  mic: 'lucideMic', popcorn: 'lucidePopcorn', wind: 'lucideWind', goal: 'lucideGoal',
  balloon: 'lucideBalloon', drama: 'lucideDrama', aperture: 'lucideAperture', waves: 'lucideWaves',
  landmark: 'lucideLandmark', music: 'lucideMusic',
  'hand-heart': 'lucideHandHeart', 'person-standing': 'lucidePersonStanding',
  dumbbell: 'lucideDumbbell', 'thermometer-sun': 'lucideThermometerSun', salad: 'lucideSalad',
  moon: 'lucideMoon', stethoscope: 'lucideStethoscope', flower: 'lucideFlower', brain: 'lucideBrain',
  sunrise: 'lucideSunrise',
};

/** Providers for every reward icon. Put them in the `providers` of any component that draws one. */
export const provideRewardIcons = () =>
  provideIcons({
    lucidePalmtree, lucideHotel, lucidePlane, lucideArmchair, lucideShip, lucideCar, lucideTentTree,
    lucideMountain, lucideLeaf, lucideShieldCheck, lucideUtensils, lucideCroissant, lucideSandwich,
    lucideCoffee, lucideFish, lucideChefHat, lucideWine, lucideFlame, lucideBike, lucideCandy,
    lucideHeadphones, lucideWatch, lucideTablet, lucideSpeaker, lucideCamera, lucideKeyboard,
    lucideBatteryCharging, lucideMonitor, lucideMapPin, lucideClapperboard, lucideMic, lucidePopcorn,
    lucideWind, lucideGoal, lucideBalloon, lucideDrama, lucideAperture, lucideWaves, lucideLandmark,
    lucideMusic, lucideHandHeart, lucidePersonStanding, lucideDumbbell, lucideThermometerSun,
    lucideSalad, lucideMoon, lucideStethoscope, lucideFlower, lucideBrain, lucideSunrise,
  });

/** Icons for the UI chrome (toggle, quick actions, movements, states). */
export const provideUiIcons = () =>
  provideIcons({
    lucideArrowDownLeft, lucideCheck, lucideGift, lucideHistory, lucideMoon, lucideSearchX, lucideSun,
    lucideLock, lucideScanFace, lucideEye, lucideTicket,
  });

/** Icon colours per scheme; the icon takes `color` as an input, not a CSS class. */
export const ICON_COLOR = {
  ink: { light: '#12131a', dark: '#f4f5fa' },
  gain: { light: '#047857', dark: '#34d399' },
  brand: { light: '#be123c', dark: '#ff6b85' },
  muted: { light: '#5b6075', dark: '#a3a9bd' },
  white: { light: '#ffffff', dark: '#ffffff' },
} as const;
