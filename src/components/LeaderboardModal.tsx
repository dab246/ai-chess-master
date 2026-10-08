import React, { useState } from 'react';
import { LeaderboardEntry, PlayerStats } from '../types/chess';
import { Trophy, Award, Medal, Crown, User, X, Check, Flame, ChevronRight } from 'lucide-react';
import { savePlayerStats, getLeaderboard } from '../services/storage';
import { getRankProgress, RANK_TIERS } from '../services/ranks';
import { RankBadge } from './RankBadge';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerStats: PlayerStats;
  onStatsUpdate: (stats: PlayerStats) => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  playerStats,
  onStatsUpdate,
}) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>(() => getLeaderboard());
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'profile' | 'ranks'>('leaderboard');
  const [editName, setEditName] = useState(playerStats.name);
  const [isEditing, setIsEditing] = useState(false);

  if (!isOpen) return null;

  const handleSaveName = () => {
    if (!editName.trim()) return;
    const updated = { ...playerStats, name: editName.trim() };
    savePlayerStats(updated);
    onStatsUpdate(updated);
    setEntries(getLeaderboard());
    setIsEditing(false);
  };

  const totalGames = playerStats.wins + playerStats.losses + playerStats.draws;
  const winRate = totalGames > 0 ? Math.round((playerStats.wins / totalGames) * 1000) / 10 : 0;
  const progress = getRankProgress(playerStats.elo);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg mat-surface-card border border-stone-800/80 rounded-2xl mat-elevation-5 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-800/80 bg-stone-950/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl mat-elevation-1 border border-amber-500/30">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-100">Bảng Xếp Hạng & Cấp Bậc</h2>
              <p className="text-xs text-stone-400">Hệ thống phân hạng Elo Kỳ Vương Việt Nam</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="mat-btn p-1.5 text-stone-400 hover:text-stone-200 hover:bg-stone-800 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab selection */}
        <div className="grid grid-cols-3 p-1.5 bg-stone-950/60 border-b border-stone-800/80 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`mat-btn py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'leaderboard'
                ? 'bg-amber-600 text-white mat-elevation-1'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Medal className="w-3.5 h-3.5" />
            <span>Kỳ Đài</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`mat-btn py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-amber-600 text-white mat-elevation-1'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Hồ Sơ</span>
          </button>

          <button
            onClick={() => setActiveTab('ranks')}
            className={`mat-btn py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'ranks'
                ? 'bg-amber-600 text-white mat-elevation-1'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Cấp Bậc</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {activeTab === 'leaderboard' ? (
            <div className="space-y-2">
              {entries.map(entry => {
                const isUser = entry.isUser;
                const isTop1 = entry.rank === 1;
                const isTop2 = entry.rank === 2;
                const isTop3 = entry.rank === 3;

                return (
                  <div
                    key={entry.id}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                      isUser
                        ? 'bg-amber-950/40 border-amber-500/70 shadow-md ring-1 ring-amber-500/30'
                        : 'bg-stone-900/80 border-stone-800/80 hover:bg-stone-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {/* Rank badge */}
                      <div className="w-6 text-center font-bold font-mono">
                        {isTop1 ? (
                          <Crown className="w-5 h-5 text-amber-400 mx-auto" />
                        ) : isTop2 ? (
                          <Medal className="w-5 h-5 text-stone-300 mx-auto" />
                        ) : isTop3 ? (
                          <Medal className="w-5 h-5 text-amber-600 mx-auto" />
                        ) : (
                          <span className="text-xs text-stone-400">#{entry.rank}</span>
                        )}
                      </div>

                      {/* Avatar */}
                      <span className="text-base">{entry.avatar}</span>

                      {/* Info */}
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-xs sm:text-sm font-bold ${
                              isUser ? 'text-amber-300' : 'text-stone-100'
                            }`}
                          >
                            {entry.name}
                          </span>
                        </div>
                        <div className="mt-0.5">
                          <RankBadge elo={entry.elo} size="sm" />
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-3 text-right">
                      <div>
                        <div className="text-xs font-mono font-bold text-amber-400">
                          {entry.elo} Elo
                        </div>
                        <div className="text-[10px] text-stone-400">
                          {entry.wins}T / {entry.losses}B ({entry.winRate}%)
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : activeTab === 'profile' ? (
            <div className="space-y-4">
              {/* Profile Card */}
              <div className="p-4 bg-gradient-to-br from-amber-950/50 via-stone-900 to-stone-950 rounded-2xl border border-amber-600/30 flex flex-col items-center text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-500/60 flex items-center justify-center text-3xl shadow-lg">
                  {playerStats.avatar}
                </div>

                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      maxLength={20}
                      className="px-2.5 py-1 bg-stone-800 text-stone-100 text-sm font-bold rounded-lg border border-amber-500 outline-none"
                    />
                    <button
                      onClick={handleSaveName}
                      className="p-1.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-white cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-stone-100">{playerStats.name}</h3>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-[10px] text-amber-400 hover:underline cursor-pointer"
                    >
                      Đổi tên
                    </button>
                  </div>
                )}

                {/* Big Rank Badge */}
                <RankBadge elo={playerStats.elo} size="lg" showElo={true} />

                {/* Rank Progression Bar */}
                {progress.nextTier ? (
                  <div className="w-full pt-2">
                    <div className="flex items-center justify-between text-[11px] text-stone-400 mb-1">
                      <span>Tiến trình thăng hạng:</span>
                      <span className="text-amber-400 font-bold">
                        Còn {progress.pointsNeeded} Elo lên {progress.nextTier.name}
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-stone-800 overflow-hidden border border-stone-700">
                      <div
                        className="h-full bg-gradient-to-r from-amber-600 to-yellow-400 transition-all duration-300"
                        style={{ width: `${progress.progressPercent}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-amber-400 font-bold">
                    Đã đạt đẳng cấp tối thượng: {progress.currentTier.name}!
                  </div>
                )}
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-3 bg-stone-950/60 rounded-xl border border-stone-800">
                  <div className="text-lg font-bold text-emerald-400">{playerStats.wins}</div>
                  <div className="text-[11px] text-stone-400">Chiến thắng</div>
                </div>

                <div className="p-3 bg-stone-950/60 rounded-xl border border-stone-800">
                  <div className="text-lg font-bold text-red-400">{playerStats.losses}</div>
                  <div className="text-[11px] text-stone-400">Thất bại</div>
                </div>

                <div className="p-3 bg-stone-950/60 rounded-xl border border-stone-800">
                  <div className="text-lg font-bold text-amber-400">{winRate}%</div>
                  <div className="text-[11px] text-stone-400">Tỷ lệ thắng</div>
                </div>
              </div>

              {/* Badges and records */}
              <div className="p-3 bg-stone-950/60 rounded-xl border border-stone-800 flex items-center justify-between text-xs">
                <span className="text-stone-400 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-orange-500" />
                  Chuỗi thắng hiện tại:
                </span>
                <span className="font-bold text-stone-200">
                  {playerStats.streak > 0 ? `${playerStats.streak} trận liên tiếp` : '0'}
                </span>
              </div>

              <div className="p-3 bg-stone-950/60 rounded-xl border border-stone-800 flex items-center justify-between text-xs">
                <span className="text-stone-400 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-500" />
                  Elo cao nhất đạt được:
                </span>
                <span className="font-bold text-amber-400 font-mono">
                  {playerStats.highestElo} Elo
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-stone-300 mb-2">
                Hệ thống 8 cấp bậc danh hiệu cờ tướng chuẩn hóa theo chỉ số ELO:
              </p>

              {RANK_TIERS.map(tier => {
                const isCurrent = progress.currentTier.id === tier.id;
                return (
                  <div
                    key={tier.id}
                    className={`p-2.5 rounded-xl border flex items-center justify-between transition-all ${
                      isCurrent
                        ? 'bg-amber-950/50 border-amber-500 shadow-md ring-1 ring-amber-500/40'
                        : 'bg-stone-900/60 border-stone-800/80 opacity-85'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <RankBadge tier={tier} size="sm" />
                      <div>
                        <div className="text-xs font-bold text-stone-100 flex items-center gap-1">
                          {tier.name}
                          {isCurrent && (
                            <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500 text-stone-950 font-bold">
                              Hiện tại
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-stone-400">{tier.description}</div>
                      </div>
                    </div>

                    <div className="text-right font-mono text-xs text-amber-400 font-bold shrink-0">
                      {tier.minElo} - {tier.maxElo > 5000 ? '∞' : tier.maxElo} Elo
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-stone-800 bg-stone-950/90 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold text-xs transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
