import { SavedGameState, PlayerStats, LeaderboardEntry, AILevel, GameResult } from '../types/chess';
import { getRankTierByElo } from './ranks';

const STORAGE_GAME_KEY = 'kyvuong_saved_game_state';
const STORAGE_STATS_KEY = 'kyvuong_player_stats';
const STORAGE_LEADERBOARD_KEY = 'kyvuong_leaderboard_data';

const DEFAULT_STATS: PlayerStats = {
  id: 'user_player',
  name: 'Kỳ Thủ Vô Danh',
  elo: 1500,
  wins: 0,
  losses: 0,
  draws: 0,
  title: 'Kỳ Thủ',
  avatar: '🏮',
  highestElo: 1500,
  streak: 0,
  rankBadge: 'Bậc III',
};

const DEFAULT_LEADERBOARD: LeaderboardEntry[] = [
  { id: 'gm_1', rank: 1, name: 'Lại Lý Huynh', title: 'Đặc Cấp Đại Sư', elo: 2795, wins: 412, losses: 38, winRate: 91.5, avatar: '👑' },
  { id: 'gm_2', rank: 2, name: 'Nguyễn Thành Bảo', title: 'Đặc Cấp Đại Sư', elo: 2710, wins: 389, losses: 54, winRate: 87.8, avatar: '⚡' },
  { id: 'gm_3', rank: 3, name: 'Uông Dương Bắc', title: 'Quốc Tế Đại Sư', elo: 2620, wins: 334, losses: 71, winRate: 82.4, avatar: '🔥' },
  { id: 'gm_4', rank: 4, name: 'Vũ Hữu Cường', title: 'Quốc Tế Đại Sư', elo: 2530, wins: 298, losses: 85, winRate: 77.8, avatar: '🛡️' },
  { id: 'gm_5', rank: 5, name: 'Đặng Cửu Tùng Lân', title: 'Kiện Tướng', elo: 2450, wins: 260, losses: 92, winRate: 73.8, avatar: '⚔️' },
  { id: 'gm_6', rank: 6, name: 'Tôn Thất Nhật Tân', title: 'Kiện Tướng', elo: 2390, wins: 240, losses: 104, winRate: 69.7, avatar: '🐉' },
  { id: 'gm_7', rank: 7, name: 'Hà Văn Tiến', title: 'Kiện Tướng', elo: 2340, wins: 215, losses: 110, winRate: 66.1, avatar: '🐅' },
  { id: 'gm_8', rank: 8, name: 'Trần Văn Ninh', title: 'Kiện Tướng', elo: 2280, wins: 198, losses: 115, winRate: 63.2, avatar: '🦅' },
  { id: 'gm_9', rank: 9, name: 'Nguyễn Minh Nhật Quang', title: 'Kiện Tướng', elo: 2210, wins: 180, losses: 120, winRate: 60.0, avatar: '🎋' },
];

export function getRankTitle(elo: number): { title: string; badge: string } {
  const tier = getRankTierByElo(elo);
  return { title: tier.name, badge: `Bậc ${tier.level}` };
}

// Save active game
export function saveGameState(state: SavedGameState): void {
  try {
    localStorage.setItem(STORAGE_GAME_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Failed to save game state to localStorage:', e);
  }
}

// Load active game
export function loadGameState(): SavedGameState | null {
  try {
    const raw = localStorage.getItem(STORAGE_GAME_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to parse saved game state:', e);
    return null;
  }
}

// Clear saved game
export function clearSavedGameState(): void {
  try {
    localStorage.removeItem(STORAGE_GAME_KEY);
  } catch {
    // ignore
  }
}

// Player stats
export function getPlayerStats(): PlayerStats {
  try {
    const raw = localStorage.getItem(STORAGE_STATS_KEY);
    if (!raw) return { ...DEFAULT_STATS };
    return { ...DEFAULT_STATS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_STATS };
  }
}

export function savePlayerStats(stats: PlayerStats): void {
  try {
    localStorage.setItem(STORAGE_STATS_KEY, JSON.stringify(stats));
  } catch (e) {
    console.warn('Failed to save player stats:', e);
  }
}

// Update stats after game
export function recordGameResult(
  result: GameResult,
  level: AILevel,
  isAiMode: boolean
): { eloDelta: number; newStats: PlayerStats } {
  const current = getPlayerStats();
  let eloDelta = 0;

  if (isAiMode) {
    const levelMultipliers: Record<AILevel, number> = {
      easy: 8,
      medium: 16,
      hard: 26,
      expert: 40,
    };

    if (result === 'red_win') {
      // Player won (as Red)
      eloDelta = levelMultipliers[level];
      current.wins += 1;
      current.streak = current.streak >= 0 ? current.streak + 1 : 1;
    } else if (result === 'black_win') {
      // Player lost
      eloDelta = Math.max(-15, -Math.round(levelMultipliers[level] * 0.5));
      current.losses += 1;
      current.streak = current.streak <= 0 ? current.streak - 1 : -1;
    } else if (result === 'draw') {
      eloDelta = Math.round(levelMultipliers[level] * 0.2);
      current.draws += 1;
      current.streak = 0;
    }
  }

  current.elo = Math.max(1000, current.elo + eloDelta);
  current.highestElo = Math.max(current.highestElo, current.elo);

  const { title, badge } = getRankTitle(current.elo);
  current.title = title;
  current.rankBadge = badge;

  savePlayerStats(current);
  updateLeaderboardWithUser(current);

  return { eloDelta, newStats: current };
}

// Leaderboard
export function getLeaderboard(): LeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_LEADERBOARD_KEY);
    let entries: LeaderboardEntry[] = raw ? JSON.parse(raw) : [...DEFAULT_LEADERBOARD];

    const user = getPlayerStats();
    const totalGames = user.wins + user.losses + user.draws;
    const winRate = totalGames > 0 ? Math.round((user.wins / totalGames) * 1000) / 10 : 50;

    // Remove existing user entry if present
    entries = entries.filter(e => !e.isUser);

    // Insert user
    entries.push({
      id: user.id,
      rank: 0,
      name: `${user.name} (Bạn)`,
      title: user.title,
      elo: user.elo,
      wins: user.wins,
      losses: user.losses,
      winRate,
      avatar: user.avatar || '🏮',
      isUser: true,
    });

    // Sort descending by Elo
    entries.sort((a, b) => b.elo - a.elo);

    // Reassign ranks
    entries.forEach((e, index) => {
      e.rank = index + 1;
    });

    return entries;
  } catch {
    return DEFAULT_LEADERBOARD;
  }
}

export function updateLeaderboardWithUser(user: PlayerStats): void {
  try {
    const entries = getLeaderboard();
    localStorage.setItem(STORAGE_LEADERBOARD_KEY, JSON.stringify(entries.filter(e => !e.isUser)));
  } catch (e) {
    console.warn('Failed to update leaderboard:', e);
  }
}
