import type { PatternId } from '../data/carpets';

interface RugPalette {
  field: string;
  fieldDeep: string;
  borderOuter: string;
  borderInner: string;
  medallion: string;
  accent: string;
  ivory: string;
  fringe: string;
  motif: 'medallion' | 'geometric' | 'afshan' | 'pictorial' | 'boteh' | 'dome' | 'floral';
}

const PALETTES: Record<PatternId, RugPalette> = {
  p1: {
    field: '#7A1C26',
    fieldDeep: '#561018',
    borderOuter: '#2B1B15',
    borderInner: '#D6B16B',
    medallion: '#1F2F46',
    accent: '#D6B16B',
    ivory: '#F3E7D2',
    fringe: '#E6DAC5',
    motif: 'medallion',
  },
  p2: {
    field: '#8F2430',
    fieldDeep: '#651620',
    borderOuter: '#1D293B',
    borderInner: '#CFA863',
    medallion: '#EEDEC0',
    accent: '#CFA863',
    ivory: '#F5EBD7',
    fringe: '#E8DEC9',
    motif: 'floral',
  },
  p3: {
    field: '#9C522E',
    fieldDeep: '#6D351B',
    borderOuter: '#212B38',
    borderInner: '#DFC086',
    medallion: '#1D2D44',
    accent: '#E3C38A',
    ivory: '#F1E4CD',
    fringe: '#E2D4BC',
    motif: 'geometric',
  },
  p4: {
    field: '#E5D6BC',
    fieldDeep: '#CEBC9D',
    borderOuter: '#7A3B2E',
    borderInner: '#9D7743',
    medallion: '#7A3B2E',
    accent: '#2F465E',
    ivory: '#FAF3E7',
    fringe: '#EFE4D0',
    motif: 'afshan',
  },
  p5: {
    field: '#172A45',
    fieldDeep: '#0F1C30',
    borderOuter: '#6D1D26',
    borderInner: '#D6B472',
    medallion: '#7A1F2A',
    accent: '#D6B472',
    ivory: '#F2E5CD',
    fringe: '#E6D8C0',
    motif: 'medallion',
  },
  p6: {
    field: '#947B53',
    fieldDeep: '#6E5838',
    borderOuter: '#3F241D',
    borderInner: '#DFC58F',
    medallion: '#532F25',
    accent: '#E2C994',
    ivory: '#F3E8D3',
    fringe: '#E5D8C1',
    motif: 'pictorial',
  },
  p7: {
    field: '#6C3725',
    fieldDeep: '#4B2417',
    borderOuter: '#2A1B16',
    borderInner: '#D5B879',
    medallion: '#264E5C',
    accent: '#D5B879',
    ivory: '#F2E5CE',
    fringe: '#E3D5BD',
    motif: 'boteh',
  },
  p8: {
    field: '#1E3C4C',
    fieldDeep: '#132733',
    borderOuter: '#2C221C',
    borderInner: '#D7BC82',
    medallion: '#2B6678',
    accent: '#E4CA91',
    ivory: '#F1E6D2',
    fringe: '#E7DCC8',
    motif: 'dome',
  },
  p9: {
    field: '#8A392B',
    fieldDeep: '#62261B',
    borderOuter: '#2D201B',
    borderInner: '#E0C187',
    medallion: '#F2E3C9',
    accent: '#E0C187',
    ivory: '#F6EBD7',
    fringe: '#E6DAC4',
    motif: 'floral',
  },
};

interface PersianRugVisualProps {
  pattern: PatternId;
  className?: string;
  showFringe?: boolean;
}

export function PersianRugVisual({
  pattern,
  className = '',
  showFringe = true,
}: PersianRugVisualProps) {
  const pal = PALETTES[pattern];
  const uid = `rug-${pattern}`;

  return (
    <div className={`relative select-none ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 240 330"
        className="w-full h-full drop-shadow-[0_10px_22px_rgba(26,21,18,0.22)]"
        role="presentation"
      >
        <defs>
          <linearGradient id={`${uid}-sheen`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.12" />
            <stop offset="45%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.16" />
          </linearGradient>
          <pattern id={`${uid}-weave`} width="6" height="6" patternUnits="userSpaceOnUse">
            <path d="M0 3h6M3 0v6" stroke="#000000" strokeOpacity="0.06" strokeWidth="0.7" />
          </pattern>
        </defs>

        {/* Top & bottom silk/cotton fringes */}
        {showFringe && (
          <g stroke={pal.fringe} strokeWidth="1.4" strokeLinecap="round">
            {Array.from({ length: 34 }).map((_, i) => {
              const x = 18 + i * 6.2;
              return (
                <g key={i}>
                  <line x1={x} y1="2" x2={x} y2="13" />
                  <line x1={x} y1="317" x2={x} y2="328" />
                </g>
              );
            })}
          </g>
        )}

        {/* Main rug frame */}
        <rect
          x="10"
          y="12"
          width="220"
          height="306"
          rx="2"
          fill={pal.borderOuter}
          stroke={pal.borderInner}
          strokeWidth="2"
        />

        {/* Guard border ornament */}
        <rect
          x="20"
          y="22"
          width="200"
          height="286"
          fill="none"
          stroke={pal.borderInner}
          strokeWidth="1.5"
          strokeDasharray="4 3"
        />
        <rect
          x="28"
          y="30"
          width="184"
          height="270"
          fill={pal.field}
          stroke={pal.ivory}
          strokeWidth="1.2"
        />

        {/* Corner spandrels (Lachak) */}
        <g fill={pal.medallion} stroke={pal.accent} strokeWidth="1">
          <path d="M28 30 L70 30 Q48 52 28 74 Z" />
          <path d="M212 30 L170 30 Q192 52 212 74 Z" />
          <path d="M28 300 L70 300 Q48 278 28 256 Z" />
          <path d="M212 300 L170 300 Q192 278 212 256 Z" />
        </g>

        {/* Inner field pattern by school motif */}
        {pal.motif === 'medallion' && (
          <g>
            {/* Subtle trellis */}
            <g stroke={pal.accent} strokeOpacity="0.3" strokeWidth="0.9" fill="none">
              <path d="M52 75 L120 46 L188 75 L188 255 L120 284 L52 255 Z" />
              <circle cx="120" cy="84" r="10" />
              <circle cx="120" cy="246" r="10" />
            </g>
            {/* Central Toranj Medallion */}
            <path
              d="M120 96 C142 114, 158 136, 158 165 C158 194, 142 216, 120 234 C98 216, 82 194, 82 165 C82 136, 98 114, 120 96 Z"
              fill={pal.medallion}
              stroke={pal.accent}
              strokeWidth="2"
            />
            <circle cx="120" cy="165" r="24" fill={pal.fieldDeep} stroke={pal.ivory} strokeWidth="1.3" />
            <polygon
              points="120,145 127,158 140,165 127,172 120,185 113,172 100,165 113,158"
              fill={pal.accent}
            />
          </g>
        )}

        {pal.motif === 'geometric' && (
          <g>
            <polygon
              points="120,76 174,165 120,254 66,165"
              fill="none"
              stroke={pal.ivory}
              strokeWidth="2"
            />
            <polygon
              points="120,98 158,165 120,232 82,165"
              fill={pal.medallion}
              stroke={pal.accent}
              strokeWidth="2"
            />
            <polygon
              points="120,124 142,165 120,206 98,165"
              fill={pal.fieldDeep}
              stroke={pal.ivory}
              strokeWidth="1.5"
            />
            <rect x="112" y="157" width="16" height="16" transform="rotate(45 120 165)" fill={pal.accent} />
          </g>
        )}

        {pal.motif === 'afshan' && (
          <g fill="none" stroke={pal.medallion} strokeWidth="1.3">
            {[78, 122, 165, 208, 252].map((cy, idx) => (
              <g key={cy}>
                <circle cx={idx % 2 === 0 ? 84 : 100} cy={cy} r="13" strokeOpacity="0.85" />
                <circle cx={idx % 2 === 0 ? 156 : 140} cy={cy} r="13" strokeOpacity="0.85" />
                <circle cx="120" cy={cy} r="7" fill={pal.accent} fillOpacity="0.6" stroke="none" />
              </g>
            ))}
          </g>
        )}

        {pal.motif === 'pictorial' && (
          <g>
            <rect x="46" y="56" width="148" height="218" fill={pal.fieldDeep} stroke={pal.accent} strokeWidth="1.2" />
            {/* Stylized Cypress Trees & Symmetrical Motifs */}
            {[78, 162].map((cx) => (
              <g key={cx}>
                <path d={`M${cx} 92 Q${cx - 14} 130 ${cx} 152 Q${cx + 14} 130 ${cx} 92 Z`} fill={pal.medallion} stroke={pal.accent} strokeWidth="1" />
                <path d={`M${cx} 182 Q${cx - 14} 220 ${cx} 242 Q${cx + 14} 220 ${cx} 182 Z`} fill={pal.medallion} stroke={pal.accent} strokeWidth="1" />
              </g>
            ))}
            <circle cx="120" cy="165" r="24" fill={pal.medallion} stroke={pal.ivory} strokeWidth="1.5" />
            <circle cx="120" cy="165" r="10" fill={pal.accent} />
          </g>
        )}

        {pal.motif === 'boteh' && (
          <g>
            {[74, 120, 166, 212, 256].map((cy, rIdx) =>
              [72, 120, 168].map((cx, cIdx) => (
                <path
                  key={`${rIdx}-${cIdx}`}
                  d={`M${cx} ${cy - 13} C${cx + 10} ${cy - 7}, ${cx + 11} ${cy + 10}, ${cx} ${cy + 13} C${cx - 11} ${cy + 10}, ${cx - 8} ${cy - 4}, ${cx} ${cy - 13} Z`}
                  fill={(rIdx + cIdx) % 2 === 0 ? pal.accent : pal.medallion}
                  stroke={pal.ivory}
                  strokeWidth="0.9"
                />
              ))
            )}
          </g>
        )}

        {pal.motif === 'dome' && (
          <g>
            <circle cx="120" cy="165" r="64" fill="none" stroke={pal.accent} strokeWidth="1.5" strokeDasharray="3 3" />
            <circle cx="120" cy="165" r="46" fill={pal.medallion} stroke={pal.ivory} strokeWidth="1.6" />
            <circle cx="120" cy="165" r="26" fill={pal.fieldDeep} stroke={pal.accent} strokeWidth="1.5" />
            {[0, 45, 90, 135].map((deg) => (
              <line
                key={deg}
                x1="120"
                y1="119"
                x2="120"
                y2="211"
                stroke={pal.accent}
                strokeOpacity="0.55"
                strokeWidth="1"
                transform={`rotate(${deg} 120 165)`}
              />
            ))}
            <circle cx="120" cy="165" r="9" fill={pal.ivory} />
          </g>
        )}

        {pal.motif === 'floral' && (
          <g>
            <ellipse cx="120" cy="165" rx="44" ry="68" fill={pal.fieldDeep} stroke={pal.accent} strokeWidth="1.8" />
            {[115, 165, 215].map((cy) => (
              <g key={cy}>
                <circle cx="120" cy={cy} r="14" fill={pal.medallion} fillOpacity="0.9" stroke={pal.accent} strokeWidth="1.2" />
                <circle cx="120" cy={cy} r="5" fill={pal.accent} />
              </g>
            ))}
            {[82, 158].map((cx) => (
              <g key={cx}>
                <circle cx={cx} cy="92" r="9" fill="none" stroke={pal.ivory} strokeWidth="1.2" />
                <circle cx={cx} cy="238" r="9" fill="none" stroke={pal.ivory} strokeWidth="1.2" />
              </g>
            ))}
          </g>
        )}

        {/* Woven texture overlay */}
        <rect x="28" y="30" width="184" height="270" fill={`url(#${uid}-weave)`} />
        <rect x="10" y="12" width="220" height="306" fill={`url(#${uid}-sheen)`} />
      </svg>
    </div>
  );
}

export function RolledRugVisual({
  pattern,
  rollNumber,
  isSelected,
}: {
  pattern: PatternId;
  rollNumber: string;
  isSelected: boolean;
}) {
  const pal = PALETTES[pattern];

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-end">
      {/* Top spiral cap */}
      <div
        className="w-full h-7 rounded-[50%] border border-[#D6B16B]/60 relative z-10 shadow-inner"
        style={{
          background: `radial-gradient(ellipse at 50% 50%, #E7D2A8 0% 16%, #4A3122 17% 28%, ${pal.accent} 29% 40%, #241610 41% 55%, ${pal.field} 56% 72%, #1B110C 73%)`,
        }}
      />
      {/* Cylinder body */}
      <div
        className={`w-[92%] flex-1 -mt-3 rounded-b-xl relative overflow-hidden transition-all ${
          isSelected ? 'ring-2 ring-[#D6B16B]' : ''
        }`}
        style={{
          background: `linear-gradient(90deg, ${pal.fieldDeep} 0%, ${pal.field} 38%, ${pal.borderOuter} 78%, ${pal.fieldDeep} 100%)`,
          boxShadow: 'inset 8px 0 14px rgba(0,0,0,0.38), inset -8px 0 14px rgba(0,0,0,0.45)',
        }}
      >
        {/* Woven horizontal bands on the rolled carpet */}
        <div
          className="absolute inset-x-0 top-6 h-3 opacity-80"
          style={{
            background: `repeating-linear-gradient(90deg, ${pal.accent} 0 6px, ${pal.ivory} 6px 10px, transparent 10px 14px)`,
          }}
        />
        <div
          className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-16 opacity-30"
          style={{
            background: `repeating-linear-gradient(45deg, ${pal.accent} 0 3px, transparent 3px 12px)`,
          }}
        />
        <div
          className="absolute inset-x-0 bottom-10 h-3 opacity-80"
          style={{
            background: `repeating-linear-gradient(90deg, ${pal.ivory} 0 5px, ${pal.accent} 5px 11px, transparent 11px 15px)`,
          }}
        />
        {/* Number tag */}
        <span
          className={`absolute bottom-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-md text-xs font-semibold tabular-nums border ${
            isSelected
              ? 'bg-[#D6B16B] text-[#191411] border-[#FFF3D6]'
              : 'bg-[#191411]/85 text-[#F6EBDA] border-[#D6B16B]/60'
          }`}
        >
          {rollNumber}
        </span>
      </div>
    </div>
  );
}
