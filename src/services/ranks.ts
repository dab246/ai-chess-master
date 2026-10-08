export interface RankTier {
  id: string;
  name: string; // e.g. "Tập Sự", "Kỳ Sĩ", "Kỳ Thủ", "Cao Thủ", "Danh Thủ", "Kiện Tướng", "Quốc Tế Đại Sư", "Đặc Cấp Đại Sư"
  shortName: string;
  level: number;
  minElo: number;
  maxElo: number;
  iconName: 'shield' | 'swords' | 'award' | 'zap' | 'flame' | 'crown' | 'sparkles' | 'trophy';
  theme: {
    bgGradient: string;
    border: string;
    text: string;
    ring: string;
    glow: string;
    badgeBg: string;
  };
  description: string;
}

export const RANK_TIERS: RankTier[] = [
  {
    id: 'tap_su',
    name: 'Tập Sự',
    shortName: 'Tập Sự',
    level: 1,
    minElo: 0,
    maxElo: 1199,
    iconName: 'shield',
    theme: {
      bgGradient: 'from-amber-900/60 via-stone-800 to-stone-900',
      border: 'border-amber-700/60',
      text: 'text-amber-300',
      ring: 'ring-amber-700/30',
      glow: 'shadow-amber-900/40',
      badgeBg: 'bg-amber-950/80 border-amber-700/70 text-amber-200',
    },
    description: 'Kỳ thủ mới nhập môn, đang học hỏi các thế cờ căn bản.',
  },
  {
    id: 'ky_si',
    name: 'Kỳ Sĩ',
    shortName: 'Kỳ Sĩ',
    level: 2,
    minElo: 1200,
    maxElo: 1399,
    iconName: 'swords',
    theme: {
      bgGradient: 'from-slate-700/60 via-stone-800 to-stone-900',
      border: 'border-slate-500/60',
      text: 'text-slate-200',
      ring: 'ring-slate-500/30',
      glow: 'shadow-slate-700/40',
      badgeBg: 'bg-slate-900/90 border-slate-500/70 text-slate-200',
    },
    description: 'Nắm vững luật cờ và cách phối hợp quân căn bản.',
  },
  {
    id: 'ky_thu',
    name: 'Kỳ Thủ',
    shortName: 'Kỳ Thủ',
    level: 3,
    minElo: 1400,
    maxElo: 1599,
    iconName: 'award',
    theme: {
      bgGradient: 'from-amber-600/30 via-yellow-900/30 to-stone-900',
      border: 'border-amber-500/60',
      text: 'text-amber-400',
      ring: 'ring-amber-500/30',
      glow: 'shadow-amber-500/30',
      badgeBg: 'bg-amber-950/80 border-amber-500/70 text-amber-300',
    },
    description: 'Thực chiến phong phú, khai cuộc vững vàng.',
  },
  {
    id: 'cao_thu',
    name: 'Cao Thủ',
    shortName: 'Cao Thủ',
    level: 4,
    minElo: 1600,
    maxElo: 1799,
    iconName: 'zap',
    theme: {
      bgGradient: 'from-emerald-700/40 via-stone-900 to-stone-950',
      border: 'border-emerald-500/60',
      text: 'text-emerald-300',
      ring: 'ring-emerald-500/30',
      glow: 'shadow-emerald-600/30',
      badgeBg: 'bg-emerald-950/80 border-emerald-500/70 text-emerald-300',
    },
    description: 'Công thủ biến ảo, tính toán sâu các thế trung cuộc.',
  },
  {
    id: 'danh_thu',
    name: 'Danh Thủ',
    shortName: 'Danh Thủ',
    level: 5,
    minElo: 1800,
    maxElo: 1999,
    iconName: 'flame',
    theme: {
      bgGradient: 'from-blue-700/40 via-cyan-950 to-stone-950',
      border: 'border-cyan-500/60',
      text: 'text-cyan-300',
      ring: 'ring-cyan-500/30',
      glow: 'shadow-cyan-500/30',
      badgeBg: 'bg-cyan-950/80 border-cyan-500/70 text-cyan-300',
    },
    description: 'Danh xưng vang dội, kỳ nghệ lão luyện.',
  },
  {
    id: 'kien_tuong',
    name: 'Kiện Tướng',
    shortName: 'Kiện Tướng',
    level: 6,
    minElo: 2000,
    maxElo: 2299,
    iconName: 'crown',
    theme: {
      bgGradient: 'from-rose-700/40 via-red-950 to-stone-950',
      border: 'border-rose-500/60',
      text: 'text-rose-300',
      ring: 'ring-rose-500/30',
      glow: 'shadow-rose-500/30',
      badgeBg: 'bg-rose-950/80 border-rose-500/70 text-rose-300',
    },
    description: 'Kỳ lực thượng thừa cấp quốc gia, chiêu thức hiểm hóc.',
  },
  {
    id: 'quoc_te_dai_su',
    name: 'Quốc Tế Đại Sư',
    shortName: 'Đại Sư',
    level: 7,
    minElo: 2300,
    maxElo: 2599,
    iconName: 'sparkles',
    theme: {
      bgGradient: 'from-purple-700/50 via-violet-950 to-stone-950',
      border: 'border-purple-500/70',
      text: 'text-purple-300',
      ring: 'ring-purple-500/40',
      glow: 'shadow-purple-500/40',
      badgeBg: 'bg-purple-950/90 border-purple-500/80 text-purple-200',
    },
    description: 'Đại sư tầm vóc quốc tế, công phá mọi trận địa.',
  },
  {
    id: 'dac_cap_dai_su',
    name: 'Đặc Cấp Đại Sư',
    shortName: 'Kỳ Vương',
    level: 8,
    minElo: 2600,
    maxElo: 9999,
    iconName: 'trophy',
    theme: {
      bgGradient: 'from-amber-500/40 via-rose-900/40 to-yellow-950',
      border: 'border-amber-400',
      text: 'text-amber-300',
      ring: 'ring-amber-400/50',
      glow: 'shadow-amber-500/50',
      badgeBg: 'bg-gradient-to-r from-amber-950 via-red-950 to-amber-950 border-amber-400 text-amber-200',
    },
    description: 'Huyền thoại tối thượng, đệ nhất cao thủ thiên hạ.',
  },
];

export function getRankTierByElo(elo: number): RankTier {
  for (let i = RANK_TIERS.length - 1; i >= 0; i--) {
    if (elo >= RANK_TIERS[i].minElo) {
      return RANK_TIERS[i];
    }
  }
  return RANK_TIERS[0];
}

export function getRankProgress(elo: number): {
  currentTier: RankTier;
  nextTier: RankTier | null;
  progressPercent: number;
  pointsNeeded: number;
} {
  const currentTier = getRankTierByElo(elo);
  const nextTierIndex = RANK_TIERS.findIndex(t => t.id === currentTier.id) + 1;
  const nextTier = nextTierIndex < RANK_TIERS.length ? RANK_TIERS[nextTierIndex] : null;

  if (!nextTier) {
    return {
      currentTier,
      nextTier: null,
      progressPercent: 100,
      pointsNeeded: 0,
    };
  }

  const range = nextTier.minElo - currentTier.minElo;
  const gained = elo - currentTier.minElo;
  const progressPercent = Math.min(100, Math.max(0, Math.round((gained / range) * 100)));
  const pointsNeeded = Math.max(0, nextTier.minElo - elo);

  return {
    currentTier,
    nextTier,
    progressPercent,
    pointsNeeded,
  };
}
