import * as THREE from 'three';
import type { PatternId } from '../data/carpets';

interface RugTextureColors {
  field: string;
  fieldDeep: string;
  borderOuter: string;
  borderInner: string;
  medallion: string;
  accent: string;
  ivory: string;
  motif: 'medallion' | 'geometric' | 'afshan' | 'pictorial' | 'boteh' | 'dome' | 'floral';
}

const TEXTURE_PALETTES: Record<PatternId, RugTextureColors> = {
  p1: {
    field: '#7A1C26',
    fieldDeep: '#561018',
    borderOuter: '#2B1B15',
    borderInner: '#D6B16B',
    medallion: '#1F2F46',
    accent: '#D6B16B',
    ivory: '#F3E7D2',
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
    motif: 'floral',
  },
};

export function createCarpetTexture(
  pattern: PatternId,
  maxAnisotropy: number
): THREE.CanvasTexture {
  const pal = TEXTURE_PALETTES[pattern];
  const w = 512;
  const h = 768;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  // Base outer border
  ctx.fillStyle = pal.borderOuter;
  ctx.fillRect(0, 0, w, h);

  // Outer guard stripe
  ctx.strokeStyle = pal.borderInner;
  ctx.lineWidth = 6;
  ctx.strokeRect(18, 18, w - 36, h - 36);

  // Ornamental border dots
  ctx.fillStyle = pal.ivory;
  for (let x = 28; x <= w - 28; x += 22) {
    ctx.beginPath();
    ctx.arc(x, 30, 3, 0, Math.PI * 2);
    ctx.arc(x, h - 30, 3, 0, Math.PI * 2);
    ctx.fill();
  }
  for (let y = 28; y <= h - 28; y += 22) {
    ctx.beginPath();
    ctx.arc(30, y, 3, 0, Math.PI * 2);
    ctx.arc(w - 30, y, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  // Inner guard band
  ctx.fillStyle = pal.fieldDeep;
  ctx.fillRect(42, 42, w - 84, h - 84);

  // Main field
  ctx.fillStyle = pal.field;
  ctx.fillRect(56, 56, w - 112, h - 112);

  ctx.strokeStyle = pal.ivory;
  ctx.lineWidth = 2.5;
  ctx.strokeRect(56, 56, w - 112, h - 112);

  // Corner Spandrels (Lachak)
  const drawSpandrel = (cx: number, cy: number, sx: number, sy: number) => {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(sx, sy);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(105, 0);
    ctx.quadraticCurveTo(50, 50, 0, 105);
    ctx.closePath();
    ctx.fillStyle = pal.medallion;
    ctx.fill();
    ctx.strokeStyle = pal.accent;
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.restore();
  };
  drawSpandrel(56, 56, 1, 1);
  drawSpandrel(w - 56, 56, -1, 1);
  drawSpandrel(56, h - 56, 1, -1);
  drawSpandrel(w - 56, h - 56, -1, -1);

  const cx = w / 2;
  const cy = h / 2;

  if (pal.motif === 'medallion') {
    ctx.strokeStyle = pal.accent;
    ctx.globalAlpha = 0.35;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(115, 160);
    ctx.lineTo(cx, 95);
    ctx.lineTo(w - 115, 160);
    ctx.lineTo(w - 115, h - 160);
    ctx.lineTo(cx, h - 95);
    ctx.lineTo(115, h - 160);
    ctx.closePath();
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Pendants
    [175, h - 175].forEach((py) => {
      ctx.beginPath();
      ctx.ellipse(cx, py, 24, 34, 0, 0, Math.PI * 2);
      ctx.fillStyle = pal.medallion;
      ctx.fill();
      ctx.strokeStyle = pal.accent;
      ctx.lineWidth = 2.5;
      ctx.stroke();
    });

    // Central Toranj
    ctx.beginPath();
    ctx.moveTo(cx, cy - 138);
    ctx.bezierCurveTo(cx + 68, cy - 95, cx + 92, cy - 45, cx + 92, cy);
    ctx.bezierCurveTo(cx + 92, cy + 45, cx + 68, cy + 95, cx, cy + 138);
    ctx.bezierCurveTo(cx - 68, cy + 95, cx - 92, cy + 45, cx - 92, cy);
    ctx.bezierCurveTo(cx - 92, cy - 45, cx - 68, cy - 95, cx, cy - 138);
    ctx.closePath();
    ctx.fillStyle = pal.medallion;
    ctx.fill();
    ctx.strokeStyle = pal.accent;
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, 48, 0, Math.PI * 2);
    ctx.fillStyle = pal.fieldDeep;
    ctx.fill();
    ctx.strokeStyle = pal.ivory;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4;
      const r = i % 2 === 0 ? 32 : 15;
      const px = cx + Math.cos(angle) * r;
      const py = cy + Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fillStyle = pal.accent;
    ctx.fill();
  } else if (pal.motif === 'geometric') {
    const drawDiamond = (rx: number, ry: number, fill: string | null, stroke: string, lw: number) => {
      ctx.beginPath();
      ctx.moveTo(cx, cy - ry);
      ctx.lineTo(cx + rx, cy);
      ctx.lineTo(cx, cy + ry);
      ctx.lineTo(cx - rx, cy);
      ctx.closePath();
      if (fill) {
        ctx.fillStyle = fill;
        ctx.fill();
      }
      ctx.strokeStyle = stroke;
      ctx.lineWidth = lw;
      ctx.stroke();
    };
    drawDiamond(130, 210, null, pal.ivory, 4);
    drawDiamond(95, 155, pal.medallion, pal.accent, 4);
    drawDiamond(58, 95, pal.fieldDeep, pal.ivory, 3);
    drawDiamond(24, 38, pal.accent, pal.ivory, 2);
  } else if (pal.motif === 'afshan') {
    for (let row = 0; row < 5; row++) {
      const ry = 140 + row * 120;
      const offset = row % 2 === 0 ? 0 : 38;
      [145 + offset, w - 145 - offset].forEach((rx) => {
        ctx.beginPath();
        ctx.arc(rx, ry, 28, 0, Math.PI * 2);
        ctx.strokeStyle = pal.medallion;
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(rx, ry, 10, 0, Math.PI * 2);
        ctx.fillStyle = pal.accent;
        ctx.fill();
      });
      ctx.beginPath();
      ctx.arc(cx, ry, 14, 0, Math.PI * 2);
      ctx.fillStyle = pal.medallion;
      ctx.fill();
    }
  } else if (pal.motif === 'pictorial') {
    ctx.fillStyle = pal.fieldDeep;
    ctx.fillRect(92, 115, w - 184, h - 230);
    ctx.strokeStyle = pal.accent;
    ctx.lineWidth = 3;
    ctx.strokeRect(92, 115, w - 184, h - 230);

    [155, w - 155].forEach((tx) => {
      [220, 500].forEach((ty) => {
        ctx.beginPath();
        ctx.moveTo(tx, ty - 58);
        ctx.quadraticCurveTo(tx - 28, ty + 18, tx, ty + 52);
        ctx.quadraticCurveTo(tx + 28, ty + 18, tx, ty - 58);
        ctx.fillStyle = pal.medallion;
        ctx.fill();
        ctx.strokeStyle = pal.accent;
        ctx.lineWidth = 2;
        ctx.stroke();
      });
    });

    ctx.beginPath();
    ctx.arc(cx, cy, 46, 0, Math.PI * 2);
    ctx.fillStyle = pal.medallion;
    ctx.fill();
    ctx.strokeStyle = pal.ivory;
    ctx.lineWidth = 3;
    ctx.stroke();
  } else if (pal.motif === 'boteh') {
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 3; c++) {
        const bx = 148 + c * 108;
        const by = 145 + r * 118;
        ctx.beginPath();
        ctx.moveTo(bx, by - 28);
        ctx.bezierCurveTo(bx + 22, by - 14, bx + 24, by + 22, bx, by + 28);
        ctx.bezierCurveTo(bx - 24, by + 22, bx - 16, by - 8, bx, by - 28);
        ctx.fillStyle = (r + c) % 2 === 0 ? pal.accent : pal.medallion;
        ctx.fill();
        ctx.strokeStyle = pal.ivory;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }
  } else if (pal.motif === 'dome') {
    ctx.beginPath();
    ctx.arc(cx, cy, 138, 0, Math.PI * 2);
    ctx.strokeStyle = pal.accent;
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, 102, 0, Math.PI * 2);
    ctx.fillStyle = pal.medallion;
    ctx.fill();
    ctx.strokeStyle = pal.ivory;
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, 56, 0, Math.PI * 2);
    ctx.fillStyle = pal.fieldDeep;
    ctx.fill();
    ctx.strokeStyle = pal.accent;
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, 20, 0, Math.PI * 2);
    ctx.fillStyle = pal.ivory;
    ctx.fill();
  } else {
    // Floral Shah Abbasi / Gol-Farang
    ctx.beginPath();
    ctx.ellipse(cx, cy, 98, 165, 0, 0, Math.PI * 2);
    ctx.fillStyle = pal.fieldDeep;
    ctx.fill();
    ctx.strokeStyle = pal.accent;
    ctx.lineWidth = 4;
    ctx.stroke();

    [cy - 105, cy, cy + 105].forEach((fy) => {
      ctx.beginPath();
      ctx.arc(cx, fy, 30, 0, Math.PI * 2);
      ctx.fillStyle = pal.medallion;
      ctx.fill();
      ctx.strokeStyle = pal.accent;
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, fy, 11, 0, Math.PI * 2);
      ctx.fillStyle = pal.accent;
      ctx.fill();
    });
  }

  // Subtle woven knot grain across entire canvas
  ctx.fillStyle = 'rgba(0,0,0,0.06)';
  for (let y = 0; y < h; y += 4) {
    ctx.fillRect(0, y, w, 1);
  }
  ctx.fillStyle = 'rgba(255,255,255,0.03)';
  for (let x = 0; x < w; x += 4) {
    ctx.fillRect(x, 0, 1, h);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = maxAnisotropy;
  texture.needsUpdate = true;
  return texture;
}

export function createRollSpiralTexture(
  pattern: PatternId,
  maxAnisotropy: number
): THREE.CanvasTexture {
  const pal = TEXTURE_PALETTES[pattern];
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#2A1D15';
  ctx.fillRect(0, 0, size, size);

  const cx = size / 2;
  const cy = size / 2;
  const colors = [pal.field, pal.ivory, pal.accent, pal.medallion, pal.borderOuter];

  for (let r = 118; r >= 16; r -= 10) {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = colors[Math.floor(r / 10) % colors.length];
    ctx.fill();
    ctx.strokeStyle = 'rgba(15,10,8,0.65)';
    ctx.lineWidth = 2.5;
    ctx.stroke();
  }

  ctx.beginPath();
  ctx.arc(cx, cy, 18, 0, Math.PI * 2);
  ctx.fillStyle = '#150E0A';
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = maxAnisotropy;
  texture.needsUpdate = true;
  return texture;
}

export function createWeaveBumpTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, size, size);

  for (let y = 0; y < size; y += 4) {
    for (let x = 0; x < size; x += 4) {
      const v = (x + y) % 8 === 0 ? 200 : 95;
      ctx.fillStyle = `rgb(${v},${v},${v})`;
      ctx.fillRect(x, y, 3, 3);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(8, 12);
  texture.anisotropy = maxAnisotropy;
  texture.needsUpdate = true;
  return texture;
}

export function createWoodFloorTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#31231B';
  ctx.fillRect(0, 0, size, size);

  const plankHeight = 64;
  for (let row = 0; row < size / plankHeight; row++) {
    const y = row * plankHeight;
    const toneShift = (row % 3) * 6;
    ctx.fillStyle = `rgb(${54 + toneShift}, ${38 + toneShift}, ${29 + toneShift})`;
    ctx.fillRect(0, y + 2, size, plankHeight - 3);

    // Subtle wood grain
    ctx.strokeStyle = 'rgba(20, 12, 8, 0.25)';
    ctx.lineWidth = 1.5;
    for (let g = 0; g < 6; g++) {
      ctx.beginPath();
      const gy = y + 10 + g * 9;
      ctx.moveTo(0, gy);
      ctx.bezierCurveTo(size * 0.3, gy + 2, size * 0.7, gy - 2, size, gy);
      ctx.stroke();
    }

    // Plank seam
    ctx.fillStyle = '#1D140F';
    ctx.fillRect(0, y, size, 2);
    const seamX = ((row * 173) % (size - 80)) + 40;
    ctx.fillRect(seamX, y, 2, plankHeight);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  texture.anisotropy = maxAnisotropy;
  texture.needsUpdate = true;
  return texture;
}
