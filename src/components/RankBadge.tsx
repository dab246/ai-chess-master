import React from 'react';
import { getRankTierByElo, RankTier } from '../services/ranks';
import {
  Shield,
  Swords,
  Award,
  Zap,
  Flame,
  Crown,
  Sparkles,
  Trophy,
} from 'lucide-react';

interface RankBadgeProps {
  elo?: number;
  tier?: RankTier;
  size?: 'sm' | 'md' | 'lg';
  showElo?: boolean;
  className?: string;
}

export const RankBadge: React.FC<RankBadgeProps> = ({
  elo,
  tier: propTier,
  size = 'md',
  showElo = false,
  className = '',
}) => {
  const tier = propTier || (elo !== undefined ? getRankTierByElo(elo) : getRankTierByElo(1500));

  const renderIcon = (iconSize: string) => {
    switch (tier.iconName) {
      case 'shield':
        return <Shield className={iconSize} />;
      case 'swords':
        return <Swords className={iconSize} />;
      case 'award':
        return <Award className={iconSize} />;
      case 'zap':
        return <Zap className={iconSize} />;
      case 'flame':
        return <Flame className={iconSize} />;
      case 'crown':
        return <Crown className={iconSize} />;
      case 'sparkles':
        return <Sparkles className={iconSize} />;
      case 'trophy':
        return <Trophy className={iconSize} />;
      default:
        return <Award className={iconSize} />;
    }
  };

  if (size === 'sm') {
    return (
      <span
        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold border backdrop-blur-sm ${tier.theme.badgeBg} ${className}`}
        title={`${tier.name} (Bậc ${tier.level})`}
      >
        {renderIcon('w-3 h-3 shrink-0')}
        <span className="truncate">{tier.name}</span>
        {showElo && elo !== undefined && (
          <span className="opacity-80 font-mono font-normal">({elo})</span>
        )}
      </span>
    );
  }

  if (size === 'lg') {
    return (
      <div
        className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl border-2 shadow-lg backdrop-blur-md ${tier.theme.badgeBg} ${tier.theme.ring} ring-2 ${className}`}
      >
        <div className="p-1.5 rounded-lg bg-black/30 border border-white/10 shadow-inner">
          {renderIcon('w-5 h-5 text-current animate-pulse')}
        </div>
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-black uppercase tracking-wider">{tier.name}</span>
            <span className="text-[9px] px-1 py-0.2 rounded bg-black/40 font-mono font-bold">
              Bậc {tier.level}
            </span>
          </div>
          {showElo && elo !== undefined ? (
            <span className="text-[11px] font-mono opacity-90 font-bold">{elo} Elo</span>
          ) : (
            <span className="text-[10px] opacity-75 font-medium">{tier.description}</span>
          )}
        </div>
      </div>
    );
  }

  // Medium (standard for player card)
  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[11px] font-bold border shadow-sm backdrop-blur-md transition-transform hover:scale-105 ${tier.theme.badgeBg} ${className}`}
      title={`${tier.name} - ${tier.description}`}
    >
      {renderIcon('w-3.5 h-3.5 shrink-0')}
      <span className="tracking-wide font-extrabold">{tier.name}</span>
      {showElo && elo !== undefined && (
        <span className="font-mono text-[10px] opacity-80 border-l border-current/30 pl-1">
          {elo}
        </span>
      )}
    </div>
  );
};
