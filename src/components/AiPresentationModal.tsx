import React, { useState, useEffect } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Copy,
  Check,
  Brain,
  Code2,
  GitBranch,
  Database,
  Cpu,
  Layers,
  Sparkles,
  Trophy,
} from 'lucide-react';

interface AiPresentationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  category: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

export const AiPresentationModal: React.FC<AiPresentationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [copied, setCopied] = useState(false);

  const slides: Slide[] = [
    {
      id: 1,
      title: 'TỔNG QUAN ĐỀ TÀI & KIẾN TRÚC HỆ THỐNG',
      subtitle: 'Đồ Án Môn Học: Trí Tuệ Nhân Tạo (Artificial Intelligence)',
      category: '1. Kiến Trúc Tổng Quan',
      icon: <Brain className="w-6 h-6 text-amber-400" />,
      content: (
        <div className="space-y-4">
          <div className="p-3.5 bg-stone-900/90 rounded-xl border border-stone-800">
            <h4 className="text-sm font-bold text-amber-300 mb-1">Mục Tiêu Đề Tài</h4>
            <p className="text-xs text-stone-300 leading-relaxed">
              Thiết kế và cài đặt chương trình trò chơi Cờ Tướng (Xiangqi) tích hợp engine trí tuệ nhân tạo sử dụng thuật toán tìm kiếm đối kháng Alpha-Beta Pruning, kết hợp các kỹ thuật tối ưu hóa hiện đại nhằm đạt hiệu năng thời gian thực trên nền tảng Web và thiết bị di động.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-stone-900/70 rounded-xl border border-amber-600/30">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5 mb-1">
                <Layers className="w-4 h-4" /> Kiến Trúc Đa Tầng (Layered Architecture)
              </span>
              <ul className="text-[11px] text-stone-300 space-y-1 list-disc list-inside">
                <li><strong className="text-stone-100">Presentation Layer:</strong> React 19 + SVG Vector 2D GPU Acceleration.</li>
                <li><strong className="text-stone-100">Game Rules Engine:</strong> Move generator, In-check detector, Flying General validator.</li>
                <li><strong className="text-stone-100">AI Core Engine:</strong> Iterative Deepening Negamax Alpha-Beta Search.</li>
                <li><strong className="text-stone-100">Memory & Cache:</strong> Zobrist Hash Transposition Table & LocalStorage.</li>
              </ul>
            </div>

            <div className="p-3 bg-stone-900/70 rounded-xl border border-emerald-600/30">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mb-1">
                <Cpu className="w-4 h-4" /> Điểm Nổi Bật Của Hệ Thống
              </span>
              <ul className="text-[11px] text-stone-300 space-y-1 list-disc list-inside">
                <li>Thuật toán không chặn luồng chính (Non-blocking async time-slicing).</li>
                <li>Gợi ý nước đi chiến thuật thông minh theo thời gian thực (Tactical Hint).</li>
                <li>Hệ thống phân cấp ELO 8 bậc chuẩn quốc gia và quốc tế.</li>
                <li>Âm thanh tổng hợp tự động qua Web Audio API (Zero external assets).</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      title: 'MÔ HÌNH HÓA KHÔNG GIAN TRẠNG THÁI (STATE-SPACE)',
      subtitle: 'Biểu Diễn Bàn Cờ & Luật Di Chuyển Phức Hợp Của Cờ Tướng',
      category: '2. Không Gian Trạng Thái',
      icon: <Database className="w-6 h-6 text-cyan-400" />,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2.5 bg-stone-900 rounded-xl border border-stone-800">
              <div className="text-lg font-black font-mono text-cyan-400">90 Ô</div>
              <div className="text-[10px] text-stone-400">Bàn cờ 10 hàng x 9 cột</div>
            </div>
            <div className="p-2.5 bg-stone-900 rounded-xl border border-stone-800">
              <div className="text-lg font-black font-mono text-amber-400">b ≈ 38 - 42</div>
              <div className="text-[10px] text-stone-400">Hệ số rẽ nhánh trung bình</div>
            </div>
            <div className="p-2.5 bg-stone-900 rounded-xl border border-stone-800">
              <div className="text-lg font-black font-mono text-emerald-400">10⁴⁸</div>
              <div className="text-[10px] text-stone-400">Số lượng trạng thái khả dĩ</div>
            </div>
          </div>

          <div className="p-3 bg-stone-900/80 rounded-xl border border-stone-800 space-y-2">
            <h4 className="text-xs font-bold text-stone-200">Đặc Thù Mô Hình Cờ Tướng so với Cờ Vua:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-stone-300">
              <div className="p-2 bg-stone-950/60 rounded-lg border border-stone-800/80">
                <span className="font-bold text-amber-400">1. Cản Chân Mã & Mắt Tượng:</span>
                <p className="text-stone-400 mt-0.5">Kiểm tra ô cản trực giao $O(1)$ trước khi duyệt 8 hướng nhảy của Mã và 4 hướng nhảy của Tượng.</p>
              </div>
              <div className="p-2 bg-stone-950/60 rounded-lg border border-stone-800/80">
                <span className="font-bold text-amber-400">2. Cơ Chế Bắn Pháo (Cannon Screen):</span>
                <p className="text-stone-400 mt-0.5">Di chuyển tự do như Xe, nhưng bắt quân bắt buộc phải nhảy qua đúng 1 quân đệm (ngòi pháo).</p>
              </div>
              <div className="p-2 bg-stone-950/60 rounded-lg border border-stone-800/80">
                <span className="font-bold text-amber-400">3. Cung Tướng & Đối Mặt Tướng:</span>
                <p className="text-stone-400 mt-0.5">Tướng và Sĩ bị giới hạn trong cửu cung 3x3. Hai Tướng không được trực diện trên cùng cột lộ thông.</p>
              </div>
              <div className="p-2 bg-stone-950/60 rounded-lg border border-stone-800/80">
                <span className="font-bold text-amber-400">4. Binh/Tốt Qua Sông:</span>
                <p className="text-stone-400 mt-0.5">Trước sông chỉ tiến 1 ô; sau khi qua sông mở rộng thêm 2 hướng đi ngang (trái/phải), không được lùi.</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      title: 'THUẬT TOÁN ALPHA-BETA PRUNING & NEGAMAX',
      subtitle: 'Tối Ưu Hóa Tìm Kiếm Đối Kháng & Cắt Tỉa Không Gian Tìm Kiếm',
      category: '3. Cốt Lõi Thuật Toán',
      icon: <GitBranch className="w-6 h-6 text-purple-400" />,
      content: (
        <div className="space-y-3.5">
          <div className="p-3 bg-purple-950/30 rounded-xl border border-purple-500/40">
            <h4 className="text-xs font-bold text-purple-300 font-mono mb-1">Negamax Formulation:</h4>
            <div className="font-mono text-[11px] text-purple-200 bg-stone-950/80 p-2 rounded-lg border border-purple-900/50">
              {'V(s) = max_{m ∈ Moves(s)} [ -V(result(s, m)) ]'}
            </div>
            <p className="text-[11px] text-stone-300 mt-1">
              Negamax tinh giản hàm Minimax bằng cách tận dụng tính chất đối xứng 0-sum của trò chơi: điểm của người này là nghịch đảo của người kia.
            </p>
          </div>

          <div className="p-3 bg-stone-900 rounded-xl border border-stone-800">
            <h4 className="text-xs font-bold text-stone-200 mb-1 flex items-center justify-between">
              <span>Định Lý Knuth-Moore & Hiệu Quả Cắt Tỉa:</span>
              <span className="text-amber-400 font-mono text-[11px]">O(b^d) → O(b^(d/2))</span>
            </h4>
            <div className="grid grid-cols-2 gap-2 mt-2 text-[11px]">
              <div className="p-2 bg-stone-950 rounded border border-stone-800">
                <span className="text-red-400 font-bold block mb-1">Minimax Thuần:</span>
                <span className="text-stone-400">Độ sâu 4 (b=40): ~2.560.000 nút. Trình duyệt đóng băng!</span>
              </div>
              <div className="p-2 bg-stone-950 rounded border border-stone-800">
                <span className="text-emerald-400 font-bold block mb-1">Alpha-Beta Tối Ưu:</span>
                <span className="text-stone-400">Độ sâu 4 (b=40): ~1.600 nút. Giảm 99.9% số phép tính!</span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 4,
      title: 'BẢNG BĂM ZOBRIST HASHING & TRANSPOSITION TABLE',
      subtitle: 'Khử Trùng Lặp Trạng Thái Trò Chơi với Độ Phức Tạp O(1)',
      category: '4. Bảng Băm Zobrist',
      icon: <Database className="w-6 h-6 text-emerald-400" />,
      content: (
        <div className="space-y-3.5">
          <div className="p-3 bg-emerald-950/30 rounded-xl border border-emerald-500/40">
            <h4 className="text-xs font-bold text-emerald-300 mb-1">Cơ Chế Băm XOR Vi Phân (Differential XOR Hashing)</h4>
            <p className="text-[11px] text-stone-300">
              Khởi tạo trước ma trận ngẫu nhiên $90 \times 14$ số nguyên 32-bit cho từng vị trí ô và loại quân cờ. Khi thực hiện nước đi từ $(from)$ tới $(to)$:
            </p>
            <div className="mt-2 p-2 bg-stone-950 font-mono text-[11px] text-emerald-300 rounded border border-emerald-900/60">
              hash' = hash ⊕ Z[from][piece] ⊕ Z[to][piece] ⊕ Z[to][captured] ⊕ SideKey
            </div>
          </div>

          <div className="p-3 bg-stone-900 rounded-xl border border-stone-800 space-y-2">
            <h4 className="text-xs font-bold text-stone-200">Cấu Trúc Phần Tử Transposition Table (TT Entry):</h4>
            <div className="grid grid-cols-3 gap-2 text-[10px] text-center font-mono">
              <div className="p-2 bg-stone-950 rounded border border-stone-800">
                <span className="text-amber-400 font-bold block">EXACT</span>
                <span className="text-stone-400">Điểm số chính xác trong khoảng (α, β)</span>
              </div>
              <div className="p-2 bg-stone-950 rounded border border-stone-800">
                <span className="text-cyan-400 font-bold block">LOWERBOUND</span>
                <span className="text-stone-400">Thất bại mức cao (Score ≥ β, gây cắt tỉa)</span>
              </div>
              <div className="p-2 bg-stone-950 rounded border border-stone-800">
                <span className="text-rose-400 font-bold block">UPPERBOUND</span>
                <span className="text-stone-400">Thất bại mức thấp (Score ≤ α)</span>
              </div>
            </div>
            <p className="text-[10px] text-stone-400 italic">
              Kích thước bảng băm: 65.536 mục với cơ chế xóa dọn rác tự động khi đầy, tránh tràn RAM trên điện thoại.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 5,
      title: 'KỸ THUẬT SẮP XẾP NƯỚC ĐI (MOVE ORDERING HEURISTICS)',
      subtitle: 'Tối Đa Hóa Khả Năng Cắt Tỉa Nhánh Của Cây Tìm Kiếm',
      category: '5. Sắp Xếp Nước Đi',
      icon: <Layers className="w-6 h-6 text-amber-400" />,
      content: (
        <div className="space-y-3">
          <p className="text-xs text-stone-300">
            Hiệu quả của Alpha-Beta phụ thuộc 90% vào việc duyệt nước đi tốt nhất trước tiên. Chúng tôi áp dụng cơ chế sắp xếp phân cấp 5 tầng:
          </p>

          <div className="space-y-1.5 text-[11px]">
            <div className="p-2 bg-stone-900 rounded-lg border border-amber-500/40 flex items-center justify-between">
              <span className="font-bold text-amber-300">1. TT Best Move</span>
              <span className="text-stone-400 text-[10px]">Nước đi tốt nhất lưu trong bảng băm từ lượt tìm kiếm trước</span>
            </div>

            <div className="p-2 bg-stone-900 rounded-lg border border-rose-500/40 flex items-center justify-between">
              <span className="font-bold text-rose-300">2. MVV-LVA (Most Valuable Victim)</span>
              <span className="text-stone-400 text-[10px]">Score = 100 × VictimVal - AttackerVal (Ăn Xe bằng Tốt ưu tiên trước)</span>
            </div>

            <div className="p-2 bg-stone-900 rounded-lg border border-cyan-500/40 flex items-center justify-between">
              <span className="font-bold text-cyan-300">3. Killer Move Heuristic</span>
              <span className="text-stone-400 text-[10px]">Lưu 2 nước cờ không ăn quân gây beta-cutoff tại cùng tầng độ sâu</span>
            </div>

            <div className="p-2 bg-stone-900 rounded-lg border border-emerald-500/40 flex items-center justify-between">
              <span className="font-bold text-emerald-300">4. History Heuristic Table</span>
              <span className="text-stone-400 text-[10px]">Ma trận 10×9×10×9 cộng điểm d² mỗi khi nước đi gây cutoff</span>
            </div>

            <div className="p-2 bg-stone-900 rounded-lg border border-stone-700 flex items-center justify-between">
              <span className="font-bold text-stone-300">5. Check & Quiet Moves</span>
              <span className="text-stone-400 text-[10px]">Các nước chiếu tướng và nước di chuyển thông thường</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 6,
      title: 'HÀM LƯỢNG GIÁ THẾ TRẬN (PIECE-SQUARE TABLES)',
      subtitle: 'Định Lượng Giá Trị Quân Cờ & Vị Trí Chiến Lược Trên Bàn Cờ',
      category: '6. Hàm Lượng Giá',
      icon: <Sparkles className="w-6 h-6 text-yellow-400" />,
      content: (
        <div className="space-y-3.5">
          <div className="p-3 bg-stone-900 rounded-xl border border-stone-800">
            <h4 className="text-xs font-bold text-amber-300 mb-1">Công Thức Đánh Giá Tổng Hợp:</h4>
            <div className="font-mono text-[11px] text-amber-200 bg-stone-950 p-2 rounded border border-stone-800">
              Eval(s) = ∑ PieceValue(p) + ∑ PST(p, r, c) + MobilityBonus - KingDanger
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="p-2.5 bg-stone-900/80 rounded-xl border border-stone-800">
              <span className="font-bold text-red-400 block mb-1">Giá Trị Căn Bản (Base Values):</span>
              <ul className="text-stone-300 space-y-0.5 text-[10px]">
                <li>• <strong>Xe (Rook):</strong> 950 điểm (Quân chủ lực)</li>
                <li>• <strong>Pháo (Cannon):</strong> 500 điểm (Kiểm soát lộ)</li>
                <li>• <strong>Mã (Horse):</strong> 450 điểm (Công thủ linh hoạt)</li>
                <li>• <strong>Sĩ / Tượng:</strong> 220 điểm (Hộ cung)</li>
                <li>• <strong>Tốt (Pawn):</strong> 120 điểm → 250+ sau khi qua sông</li>
              </ul>
            </div>

            <div className="p-2.5 bg-stone-900/80 rounded-xl border border-stone-800">
              <span className="font-bold text-amber-400 block mb-1">Quy Tắc Vị Trí PST (Xiangqi Heuristics):</span>
              <ul className="text-stone-300 space-y-0.5 text-[10px]">
                <li>• <strong>Pháo đầu:</strong> Thưởng điểm cao khi kiểm soát cột 4, 5.</li>
                <li>• <strong>Mã ngọa tào / Bàn hà:</strong> Thưởng điểm áp sát cung.</li>
                <li>• <strong>Xe thông lộ 2, 8:</strong> Chiếm tuyến kiểm soát then chốt.</li>
                <li>• <strong>Phạt Mã cản chân:</strong> Trừ điểm nếu bị khống chế.</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 7,
      title: 'QUIESCENCE SEARCH & HIỆU ỨNG CHÂN TRỜI (HORIZON EFFECT)',
      subtitle: 'Khắc Phục Điểm Yếu Cố Hữu Của Thuật Toán Tìm Kiếm Giới Hạn Sâu',
      category: '7. Quiescence Search',
      icon: <Code2 className="w-6 h-6 text-rose-400" />,
      content: (
        <div className="space-y-3.5">
          <div className="p-3 bg-rose-950/30 rounded-xl border border-rose-500/40">
            <h4 className="text-xs font-bold text-rose-300 mb-1">Hiệu Ứng Chân Trời (Horizon Effect) Là Gì?</h4>
            <p className="text-[11px] text-stone-300 leading-relaxed">
              Xảy ra khi cây tìm kiếm chạm độ sâu cố định (ví dụ $d = 4$) đúng lúc một nước cờ ăn quân lớn đang diễn ra (ví dụ Xe ăn Pháo, nhưng lượt tiếp theo Tốt đối phương sẽ ăn lại Xe). Thuật toán ngộ nhận mình đang có lợi lớn vì không nhìn thấy nước trả đòn ngay sau chân trời!
            </p>
          </div>

          <div className="p-3 bg-stone-900 rounded-xl border border-stone-800 space-y-2">
            <h4 className="text-xs font-bold text-stone-200">Giải Pháp: Quiescence Search + Delta Pruning</h4>
            <p className="text-[11px] text-stone-300">
              Tại các nút lá ($depth = 0$), thuật toán không đánh giá tĩnh ngay mà tiếp tục mở rộng tìm kiếm chỉ trên các <strong>nước cờ ăn quân (Capture Moves)</strong> cho đến khi đạt được vị thế ổn định (Quiet Position).
            </p>
            <div className="p-2 bg-stone-950 text-emerald-300 font-mono text-[10px] rounded border border-emerald-900/50">
              Delta Pruning: Nếu StandPat + MaxPieceVal (950) &lt; α → Cắt tỉa ngay lập tức!
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 8,
      title: 'TÌM KIẾM SÂU DẦN & ĐÁNH GIÁ THỰC NGHIỆM',
      subtitle: 'Iterative Deepening, Hệ Thống Elo & Kết Luận Đề Tài',
      category: '8. Thực Nghiệm & Kết Luận',
      icon: <Trophy className="w-6 h-6 text-amber-400" />,
      content: (
        <div className="space-y-3.5">
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="p-3 bg-stone-900 rounded-xl border border-amber-600/30">
              <span className="font-bold text-amber-400 block mb-1">Iterative Deepening (ID):</span>
              <p className="text-stone-300 text-[10px]">
                Tìm kiếm tăng dần độ sâu: $d = 1 \rightarrow 2 \rightarrow 3 \rightarrow 4 \rightarrow 5$. Nhờ đó bảng băm luôn được làm ấm với nước đi tốt nhất của độ sâu trước, giúp độ sâu sau cắt tỉa vượt trội.
              </p>
            </div>
            <div className="p-3 bg-stone-900 rounded-xl border border-emerald-600/30">
              <span className="font-bold text-emerald-400 block mb-1">Time Budgeting:</span>
              <p className="text-stone-300 text-[10px]">
                Tự động kiểm tra thời hạn (Deadline: 350ms - 1500ms). Dừng lại an toàn và trả về nước đi tốt nhất hiện có nếu sắp vượt ngưỡng thời gian, giữ vững 60 FPS.
              </p>
            </div>
          </div>

          <div className="p-3 bg-stone-900/90 rounded-xl border border-stone-800">
            <h4 className="text-xs font-bold text-stone-200 mb-1">Kết Quả Đạt Được Của Đồ Án:</h4>
            <ul className="text-[11px] text-stone-300 space-y-1 list-disc list-inside">
              <li>Hoàn thành hệ thống Cờ Tướng trí tuệ nhân tạo toàn diện theo tiêu chuẩn đồ án môn AI.</li>
              <li>Tốc độ duyệt nhánh: ~40.000 - 80.000 nodes/giây trên JavaScript V8 engine mà không lag UI.</li>
              <li>Gợi ý nước cờ chính xác, hỗ trợ người chơi luyện tập và nâng cao kỳ nghệ.</li>
            </ul>
          </div>
        </div>
      ),
    },
  ];

  const current = slides[currentSlide];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentSlide]);

  const handleCopySummary = () => {
    const text = `BÁO CÁO TỔNG QUAN ĐỒ ÁN TRÍ TUỆ NHÂN TẠO:
Đề tài: Hệ Thống Cờ Tướng Thông Minh (Xiangqi AI Engine)
1. Thuật toán chính: Negamax Alpha-Beta Pruning.
2. Tìm kiếm sâu dần: Iterative Deepening với giới hạn thời gian (Time Budgeting).
3. Bảng băm trạng thái: Zobrist Hashing 32-bit XOR vi phân O(1) & Transposition Table 65.536 mục.
4. Chiến lược sắp xếp nước đi (Move Ordering): TT Best Move, MVV-LVA, Killer Moves, History Heuristic.
5. Giải quyết hiệu ứng chân trời: Quiescence Search kết hợp Delta Pruning.
6. Hàm lượng giá thế trận: Piece-Square Tables (PST) tối ưu cho đặc thù cờ tướng.
7. Giao diện: SVG 2D Vector GPU-accelerated mượt mà trên di động.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`relative w-full ${
          isFullScreen ? 'max-w-[98vw] h-[96vh]' : 'max-w-3xl max-h-[90vh]'
        } mat-surface-card border border-stone-800/80 rounded-2xl mat-elevation-5 overflow-hidden flex flex-col transition-all duration-300`}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-stone-800/80 bg-stone-900/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/20 rounded-xl border border-amber-500/30 mat-elevation-1">
              {current.icon}
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400">
                {current.category}
              </span>
              <h3 className="text-sm sm:text-base font-black text-stone-100 font-cinzel">
                SLIDE BÁO CÁO ĐỒ ÁN AI
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCopySummary}
              title="Sao chép tóm tắt đồ án"
              className="mat-btn flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Đã chép</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Chép tóm tắt</span>
                </>
              )}
            </button>

            <button
              onClick={() => setIsFullScreen(!isFullScreen)}
              title={isFullScreen ? 'Thu nhỏ' : 'Toàn màn hình'}
              className="mat-btn p-1.5 text-stone-400 hover:text-stone-200 hover:bg-stone-800 rounded-lg cursor-pointer"
            >
              {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              title="Đóng slide"
              className="mat-btn p-1.5 text-stone-400 hover:text-stone-200 hover:bg-stone-800 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Slide Body */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-3.5 sm:p-6 space-y-3 sm:space-y-4 bg-gradient-to-b from-stone-900/40 to-stone-950">
          {/* Slide Title */}
          <div className="break-words">
            <h2 className="text-sm sm:text-lg font-black text-stone-100 tracking-tight break-words">
              {current.title}
            </h2>
            <p className="text-[11px] sm:text-xs text-amber-400/90 font-medium mt-0.5 break-words">
              {current.subtitle}
            </p>
          </div>

          {/* Slide Main Content */}
          <div className="pt-1 sm:pt-2 overflow-x-hidden">{current.content}</div>
        </div>

        {/* Slide Navigation & Footer */}
        <div className="px-4 sm:px-6 py-3 border-t border-stone-800/80 bg-stone-900/80 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrev}
              disabled={currentSlide === 0}
              className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 disabled:opacity-30 disabled:hover:bg-stone-800 text-stone-200 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <span className="text-xs font-mono font-bold text-stone-400 px-2">
              Slide {currentSlide + 1} / {slides.length}
            </span>

            <button
              onClick={handleNext}
              disabled={currentSlide === slides.length - 1}
              className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 disabled:opacity-30 disabled:hover:bg-stone-800 text-stone-200 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Quick thumbnail dots */}
          <div className="flex items-center gap-1.5">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrentSlide(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  idx === currentSlide
                    ? 'w-6 bg-amber-500 shadow-sm shadow-amber-500/50'
                    : 'bg-stone-700 hover:bg-stone-500'
                }`}
                title={`Chuyển tới slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
