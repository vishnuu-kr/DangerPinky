import { SnakeState, Collectible, GameMode, SnakeSkin, BoardTheme } from '../types/game';
import { ParticleSystem } from './particles';
import { SNAKE_SKIN_PALETTES, SPECIAL_ITEMS, BOARD_THEMES } from './constants';

export interface RenderContext {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  gridSize: number;
  snake: SnakeState;
  food: Collectible | null;
  particles: ParticleSystem;
  gameMode: GameMode;
  realFileMode?: boolean;
  time: number;
  snakeSkin?: SnakeSkin;
  digestionProgress?: number;
  boardTheme?: BoardTheme;
  comboCount?: number;
  isSpeedSurging?: boolean;
  isNearMiss?: boolean;
}

interface WeatherParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  rot: number;
  vRot: number;
  char?: string;
}

export class GameRenderer {
  private weatherParticles: WeatherParticle[] = [];
  private lastWeatherTheme: BoardTheme | null = null;

  public render(params: RenderContext) {
    const { ctx, width, height, gridSize, snake, food, particles, gameMode, realFileMode, time, snakeSkin, digestionProgress, boardTheme = 'MEADOW', comboCount, isSpeedSurging, isNearMiss } = params;
    const cellSize = width / gridSize;

    // 1. Clear background
    ctx.clearRect(0, 0, width, height);

    // 2. Draw Checkered grid with Theme
    this.drawGrid(ctx, gridSize, cellSize, boardTheme);

    // 3. Draw ambient environmental weather particles (Meadow blossoms, Cyber code, Synth embers)
    this.drawWeather(ctx, width, height, boardTheme, time);

    // 4. Draw border frame
    this.drawBorder(ctx, width, height, gameMode, boardTheme);

    // 5. Draw predictive ghost direction indicator (zero-perceived-latency)
    this.drawGhostDirection(ctx, snake, cellSize, gridSize, snakeSkin, gameMode);

    // 6. Draw Collectible Fruit
    if (food) {
      this.drawFruit(ctx, food, cellSize, time, width, height, realFileMode);
    }

    // 8. Draw Anatomical Snake with scales, belly plates, viper head & expressive faces
    this.drawSnake(ctx, snake, cellSize, time, food, realFileMode, snakeSkin, digestionProgress, isNearMiss, comboCount);

    // 9. Draw arcade radial speed streaks if combo streak is high
    if ((comboCount && comboCount >= 4) || isSpeedSurging) {
      this.drawSpeedStreaks(ctx, width, height, time);
    }

    // 10. Draw Particles
    particles.render(ctx);
  }

  private drawGrid(
    ctx: CanvasRenderingContext2D,
    gridSize: number,
    cellSize: number,
    boardTheme: BoardTheme = 'MEADOW'
  ) {
    const theme = BOARD_THEMES[boardTheme] || BOARD_THEMES.MEADOW;

    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        ctx.fillStyle = (x + y) % 2 === 0 ? theme.tileA : theme.tileB;
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);

        // Grid line outline
        ctx.strokeStyle = theme.gridLine;
        ctx.lineWidth = 0.5;
        ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }

    // Cyber CRT scanlines if Cyber Terminal theme
    if (boardTheme === 'CYBER_NEON') {
      ctx.fillStyle = 'rgba(6, 182, 212, 0.022)';
      for (let y = 0; y < gridSize * cellSize; y += 4) {
        ctx.fillRect(0, y, gridSize * cellSize, 2);
      }
    }
  }

  private drawWeather(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    boardTheme: BoardTheme,
    time: number
  ) {
    if (this.lastWeatherTheme !== boardTheme || this.weatherParticles.length === 0) {
      this.lastWeatherTheme = boardTheme;
      this.weatherParticles = [];
      const count = 22;
      for (let i = 0; i < count; i++) {
        const isCherry = boardTheme === 'MEADOW';
        this.weatherParticles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: isCherry ? 0.3 + Math.random() * 0.4 : (Math.random() - 0.5) * 0.3,
          vy: boardTheme === 'SYNTH_DUSK' ? -(0.3 + Math.random() * 0.5) : (0.3 + Math.random() * 0.6),
          size: isCherry ? 3 + Math.random() * 3.5 : 2 + Math.random() * 3,
          alpha: 0.22 + Math.random() * 0.35,
          rot: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.04,
          char: Math.random() > 0.5 ? '1' : '0'
        });
      }
    }

    ctx.save();
    for (const p of this.weatherParticles) {
      if (boardTheme === 'MEADOW') {
        p.x += p.vx + Math.sin(time * 0.002 + p.y * 0.05) * 0.35;
        p.y += p.vy;
      } else if (boardTheme === 'SYNTH_DUSK') {
        p.y += p.vy;
        p.x += Math.sin(time * 0.003 + p.y * 0.08) * 0.25;
      } else {
        p.x += p.vx;
        p.y += p.vy;
      }
      p.rot += p.vRot;

      if (p.x < -10) p.x = width + 10;
      else if (p.x > width + 10) p.x = -10;
      if (p.y < -10) p.y = height + 10;
      else if (p.y > height + 10) p.y = -10;

      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);

      if (boardTheme === 'MEADOW') {
        ctx.fillStyle = '#fbcfe8';
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size, p.size * 0.55, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (boardTheme === 'CYBER_NEON') {
        ctx.fillStyle = '#22d3ee';
        ctx.font = 'bold 9px monospace';
        ctx.fillText(p.char || '1', 0, 0);
      } else if (boardTheme === 'SYNTH_DUSK') {
        ctx.fillStyle = '#f0abfc';
        ctx.beginPath();
        ctx.arc(0, 0, p.size * 0.6, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      }
      ctx.restore();
    }
    ctx.restore();
  }

  private drawBorder(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    _gameMode: GameMode,
    boardTheme: BoardTheme = 'MEADOW'
  ) {
    const theme = BOARD_THEMES[boardTheme] || BOARD_THEMES.MEADOW;
    ctx.save();
    ctx.strokeStyle = theme.outerBorder;
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, width - 4, height - 4);
    ctx.restore();
  }

  private drawGhostDirection(
    ctx: CanvasRenderingContext2D,
    snake: SnakeState,
    cellSize: number,
    gridSize: number,
    snakeSkin?: SnakeSkin,
    gameMode: GameMode = 'WRAP'
  ) {
    if (!snake.isAlive || snake.body.length === 0) return;
    if (snake.nextDirection === snake.direction) return; // Only show when a turn flick is queued!

    const head = snake.body[0];
    let gx = head.x;
    let gy = head.y;

    if (snake.nextDirection === 'UP') gy -= 1;
    else if (snake.nextDirection === 'DOWN') gy += 1;
    else if (snake.nextDirection === 'LEFT') gx -= 1;
    else if (snake.nextDirection === 'RIGHT') gx += 1;

    // Handle wrap boundaries for ghost
    if (gameMode === 'WRAP') {
      if (gx < 0) gx = gridSize - 1;
      else if (gx >= gridSize) gx = 0;
      if (gy < 0) gy = gridSize - 1;
      else if (gy >= gridSize) gy = 0;
    } else {
      if (gx < 0 || gx >= gridSize || gy < 0 || gy >= gridSize) return;
    }

    const cx = gx * cellSize + cellSize / 2;
    const cy = gy * cellSize + cellSize / 2;
    const r = cellSize * 0.42;

    const palette = SNAKE_SKIN_PALETTES[snakeSkin || 'CANDY_PINK'] || SNAKE_SKIN_PALETTES.CANDY_PINK;

    ctx.save();
    ctx.strokeStyle = palette.highlight;
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.fillStyle = palette.main;
    ctx.globalAlpha = 0.38;

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Direction arrow inside ghost head
    ctx.globalAlpha = 0.75;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    const arrowSize = cellSize * 0.18;
    if (snake.nextDirection === 'UP') {
      ctx.moveTo(cx, cy - arrowSize);
      ctx.lineTo(cx - arrowSize * 0.7, cy + arrowSize * 0.5);
      ctx.lineTo(cx + arrowSize * 0.7, cy + arrowSize * 0.5);
    } else if (snake.nextDirection === 'DOWN') {
      ctx.moveTo(cx, cy + arrowSize);
      ctx.lineTo(cx - arrowSize * 0.7, cy - arrowSize * 0.5);
      ctx.lineTo(cx + arrowSize * 0.7, cy - arrowSize * 0.5);
    } else if (snake.nextDirection === 'LEFT') {
      ctx.moveTo(cx - arrowSize, cy);
      ctx.lineTo(cx + arrowSize * 0.5, cy - arrowSize * 0.7);
      ctx.lineTo(cx + arrowSize * 0.5, cy + arrowSize * 0.7);
    } else if (snake.nextDirection === 'RIGHT') {
      ctx.moveTo(cx + arrowSize, cy);
      ctx.lineTo(cx - arrowSize * 0.5, cy - arrowSize * 0.7);
      ctx.lineTo(cx - arrowSize * 0.5, cy + arrowSize * 0.7);
    }
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  private drawSpeedStreaks(ctx: CanvasRenderingContext2D, width: number, height: number, time: number) {
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 1.5;
    const streakCount = 6;
    for (let i = 0; i < streakCount; i++) {
      const offset = ((time * 0.35 + i * 40) % 80) / 80;
      const len = 25 + offset * 35;
      // Top-left corner
      ctx.beginPath();
      ctx.moveTo(offset * 35, offset * 35);
      ctx.lineTo(offset * 35 + len, offset * 35 + len);
      ctx.stroke();

      // Top-right corner
      ctx.beginPath();
      ctx.moveTo(width - offset * 35, offset * 35);
      ctx.lineTo(width - offset * 35 - len, offset * 35 + len);
      ctx.stroke();

      // Bottom-left corner
      ctx.beginPath();
      ctx.moveTo(offset * 35, height - offset * 35);
      ctx.lineTo(offset * 35 + len, height - offset * 35 - len);
      ctx.stroke();

      // Bottom-right corner
      ctx.beginPath();
      ctx.moveTo(width - offset * 35, height - offset * 35);
      ctx.lineTo(width - offset * 35 - len, height - offset * 35 - len);
      ctx.stroke();
    }
    ctx.restore();
  }

  private drawFruit(
    ctx: CanvasRenderingContext2D,
    food: Collectible,
    cellSize: number,
    time: number,
    boardWidth: number,
    boardHeight: number,
    realFileMode?: boolean
  ) {
    const cx = food.position.x * cellSize + cellSize / 2;
    const cy = food.position.y * cellSize + cellSize / 2;

    // Pop animation on spawn (0-180ms) + subtle natural breathing
    const age = time - food.spawnTime;
    let scale = 1;
    if (age >= 0 && age < 180) {
      const p = age / 180;
      scale = Math.sin(p * Math.PI * 0.5) * 1.18;
      if (scale > 1) scale = 1 + (scale - 1) * 0.5;
    } else {
      scale = 1 + Math.sin(time * 0.005) * 0.035;
    }

    // Dynamic vertical sine-wave bobbing
    const bobOffset = Math.sin(time * 0.005) * (cellSize * 0.07);
    const fruitCy = cy + bobOffset;

    // Larger, juicy fruit radius (0.44 * cellSize instead of 0.36)
    const r = (cellSize * 0.44) * scale;
    const fruit = food.fruitType || 'apple';

    ctx.save();

    // Soft colored ambient drop shadow under the fruit (ground level)
    const shadowScale = 1 - (bobOffset / (cellSize * 0.07)) * 0.18;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
    ctx.beginPath();
    ctx.ellipse(cx, cy + r * 0.88, r * 0.78 * shadowScale, r * 0.26 * shadowScale, 0, 0, Math.PI * 2);
    ctx.fill();

    switch (fruit) {
      case 'apple':
        this.renderApple(ctx, cx, fruitCy, r);
        break;
      case 'orange':
        this.renderOrange(ctx, cx, fruitCy, r);
        break;
      case 'grape':
        this.renderGrape(ctx, cx, fruitCy, r);
        break;
      case 'strawberry':
        this.renderStrawberry(ctx, cx, fruitCy, r);
        break;
      case 'watermelon':
        this.renderWatermelon(ctx, cx, fruitCy, r);
        break;
      case 'cherry':
        this.renderCherry(ctx, cx, fruitCy, r);
        break;
      default:
        this.renderApple(ctx, cx, fruitCy, r);
        break;
    }

    // Special wildcard power-up halo
    if (food.specialType && SPECIAL_ITEMS[food.specialType]) {
      const specialMeta = SPECIAL_ITEMS[food.specialType];
      ctx.save();
      ctx.strokeStyle = specialMeta.color;
      ctx.lineWidth = 2.5;
      ctx.shadowColor = specialMeta.color;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(cx, fruitCy, r * 1.32, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    ctx.restore();

    // Draw cartoon file badge above the fruit displaying actual file name
    if (food.file && food.file.name) {
      this.drawFruitFileBadge(ctx, food.file.name, cx, fruitCy, r, cellSize, boardWidth, boardHeight, realFileMode, food.specialType);
    }
  }

  private drawFruitFileBadge(
    ctx: CanvasRenderingContext2D,
    filename: string,
    cx: number,
    cy: number,
    r: number,
    cellSize: number,
    boardWidth: number,
    boardHeight: number,
    realFileMode?: boolean,
    specialType?: import('../types/game').SpecialItemType
  ) {
    ctx.save();

    // Clean truncate for crisp legibility or show special badge
    let display = filename;
    if (specialType && SPECIAL_ITEMS[specialType]) {
      display = `${SPECIAL_ITEMS[specialType].emoji} ${SPECIAL_ITEMS[specialType].name}`;
    } else if (display.length > 15) {
      const ext = display.includes('.') ? '.' + display.split('.').pop() : '';
      display = display.slice(0, 11) + '…' + ext;
    }

    const fontSize = Math.max(9, Math.min(11, Math.round(cellSize * 0.28)));
    ctx.font = `bold ${fontSize}px 'Fredoka', -apple-system, BlinkMacSystemFont, sans-serif`;
    const textWidth = ctx.measureText(display).width;
    const paddingX = 6;
    const badgeHeight = fontSize + 6;
    const badgeWidth = textWidth + paddingX * 2;

    // Place badge above fruit if room, else below
    let badgeY = cy - r - badgeHeight - 4;
    if (badgeY < 4) {
      badgeY = cy + r + 5;
    }
    if (badgeY + badgeHeight > boardHeight - 4) {
      badgeY = boardHeight - badgeHeight - 4;
    }

    // Keep badge completely within canvas horizontal bounds
    const badgeX = Math.max(4, Math.min(boardWidth - badgeWidth - 4, cx - badgeWidth / 2));

    // Background pill with candy style drop shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.beginPath();
    ctx.roundRect(badgeX, badgeY + 1.5, badgeWidth, badgeHeight, badgeHeight / 2);
    ctx.fill();

    ctx.fillStyle = realFileMode ? 'rgba(35, 12, 12, 0.92)' : 'rgba(25, 23, 48, 0.88)';
    ctx.strokeStyle = realFileMode ? '#ff0033' : 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 1.5;

    ctx.beginPath();
    ctx.roundRect(badgeX, badgeY, badgeWidth, badgeHeight, badgeHeight / 2);
    ctx.fill();
    ctx.stroke();

    // Label text centered inside the pill
    ctx.fillStyle = realFileMode ? '#ffd1d9' : '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(display, badgeX + badgeWidth / 2, badgeY + badgeHeight / 2);

    ctx.restore();
  }

  private renderApple(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
    // Stem
    ctx.strokeStyle = '#4e2a14';
    ctx.lineWidth = Math.max(2, r * 0.16);
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cx, cy - r * 0.55);
    ctx.quadraticCurveTo(cx - r * 0.15, cy - r * 1.15, cx - r * 0.35, cy - r * 1.35);
    ctx.stroke();

    // Leaf
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.ellipse(cx + r * 0.36, cy - r * 0.95, r * 0.42, r * 0.2, Math.PI / 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#86efac';
    ctx.beginPath();
    ctx.ellipse(cx + r * 0.32, cy - r * 0.98, r * 0.24, r * 0.08, Math.PI / 4.5, 0, Math.PI * 2);
    ctx.fill();

    // Apple body (rich 3D candy red gradient)
    const grad = ctx.createRadialGradient(cx - r * 0.32, cy - r * 0.35, r * 0.08, cx, cy, r * 1.05);
    grad.addColorStop(0, '#ff758c');
    grad.addColorStop(0.35, '#ff2a55');
    grad.addColorStop(0.75, '#d90429');
    grad.addColorStop(1, '#7a0019');
    ctx.fillStyle = grad;

    ctx.beginPath();
    ctx.arc(cx - r * 0.26, cy, r * 0.84, 0, Math.PI * 2);
    ctx.arc(cx + r * 0.26, cy, r * 0.84, 0, Math.PI * 2);
    ctx.arc(cx, cy + r * 0.14, r * 0.88, 0, Math.PI * 2);
    ctx.fill();

    // Specular shine primary (glossy arc)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.beginPath();
    ctx.ellipse(cx - r * 0.38, cy - r * 0.38, r * 0.25, r * 0.12, -Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();

    // Specular shine secondary spot
    ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.beginPath();
    ctx.arc(cx - r * 0.24, cy - r * 0.52, r * 0.09, 0, Math.PI * 2);
    ctx.fill();
  }

  private renderOrange(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
    // Leaf
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.ellipse(cx + r * 0.32, cy - r * 0.85, r * 0.36, r * 0.18, Math.PI / 4.8, 0, Math.PI * 2);
    ctx.fill();

    // Stem
    ctx.fillStyle = '#5d4037';
    ctx.beginPath();
    ctx.arc(cx, cy - r * 0.82, r * 0.13, 0, Math.PI * 2);
    ctx.fill();

    // Orange body
    const grad = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, r * 0.08, cx, cy, r * 1.05);
    grad.addColorStop(0, '#fef08a');
    grad.addColorStop(0.3, '#fb923c');
    grad.addColorStop(0.75, '#ea580c');
    grad.addColorStop(1, '#9a3412');
    ctx.fillStyle = grad;

    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.92, 0, Math.PI * 2);
    ctx.fill();

    // Glossy Specular shine
    ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
    ctx.beginPath();
    ctx.ellipse(cx - r * 0.34, cy - r * 0.34, r * 0.26, r * 0.13, -Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.beginPath();
    ctx.arc(cx - r * 0.22, cy - r * 0.5, r * 0.08, 0, Math.PI * 2);
    ctx.fill();
  }

  private renderGrape(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
    // Stem
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = Math.max(2, r * 0.13);
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cx, cy - r * 0.62);
    ctx.lineTo(cx, cy - r * 1.15);
    ctx.stroke();

    // Little leaf on stem
    ctx.fillStyle = '#4ade80';
    ctx.beginPath();
    ctx.ellipse(cx + r * 0.22, cy - r * 0.95, r * 0.22, r * 0.1, Math.PI / 5, 0, Math.PI * 2);
    ctx.fill();

    // Grape globes
    const grapeR = r * 0.38;
    const offsets = [
      { dx: -r * 0.35, dy: -r * 0.35 },
      { dx: r * 0.35, dy: -r * 0.35 },
      { dx: 0, dy: -r * 0.32 },
      { dx: -r * 0.24, dy: r * 0.16 },
      { dx: r * 0.24, dy: r * 0.16 },
      { dx: 0, dy: r * 0.58 },
    ];

    for (const off of offsets) {
      const gX = cx + off.dx;
      const gY = cy + off.dy;
      const grad = ctx.createRadialGradient(gX - grapeR * 0.3, gY - grapeR * 0.3, 1, gX, gY, grapeR);
      grad.addColorStop(0, '#e9d5ff');
      grad.addColorStop(0.35, '#c084fc');
      grad.addColorStop(0.75, '#9333ea');
      grad.addColorStop(1, '#4c0519');
      ctx.fillStyle = grad;

      ctx.beginPath();
      ctx.arc(gX, gY, grapeR, 0, Math.PI * 2);
      ctx.fill();

      // Shiny glossy specular highlight
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.beginPath();
      ctx.arc(gX - grapeR * 0.32, gY - grapeR * 0.32, grapeR * 0.26, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  private renderStrawberry(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
    // Crown leaves
    ctx.fillStyle = '#22c55e';
    for (let i = -1; i <= 1; i++) {
      ctx.beginPath();
      ctx.ellipse(cx + i * r * 0.32, cy - r * 0.76, r * 0.25, r * 0.13, (i * Math.PI) / 5.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Berry body (cone/heart shape)
    const grad = ctx.createRadialGradient(cx - r * 0.26, cy - r * 0.25, 1, cx, cy, r * 1.12);
    grad.addColorStop(0, '#fda4af');
    grad.addColorStop(0.35, '#fb7185');
    grad.addColorStop(0.7, '#e11d48');
    grad.addColorStop(1, '#881337');
    ctx.fillStyle = grad;

    ctx.beginPath();
    ctx.moveTo(cx - r * 0.74, cy - r * 0.45);
    ctx.quadraticCurveTo(cx - r * 0.9, cy + r * 0.25, cx, cy + r * 0.98);
    ctx.quadraticCurveTo(cx + r * 0.9, cy + r * 0.25, cx + r * 0.74, cy - r * 0.45);
    ctx.quadraticCurveTo(cx, cy - r * 0.65, cx - r * 0.74, cy - r * 0.45);
    ctx.closePath();
    ctx.fill();

    // Specular gloss shine
    ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.beginPath();
    ctx.ellipse(cx - r * 0.34, cy - r * 0.25, r * 0.22, r * 0.1, -Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();

    // Yellow seeds
    ctx.fillStyle = '#fef08a';
    const seeds = [
      { x: -0.3, y: -0.15 }, { x: 0.3, y: -0.15 }, { x: 0, y: -0.1 },
      { x: -0.24, y: 0.25 }, { x: 0.24, y: 0.25 }, { x: 0, y: 0.45 },
      { x: 0, y: 0.72 }
    ];
    for (const s of seeds) {
      ctx.beginPath();
      ctx.arc(cx + s.x * r, cy + s.y * r, Math.max(1.3, r * 0.055), 0, Math.PI * 2);
      ctx.fill();
    }
  }

  private renderWatermelon(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
    // Outer green rind
    ctx.fillStyle = '#15803d';
    ctx.beginPath();
    ctx.arc(cx, cy - r * 0.1, r * 0.98, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.lineTo(cx, cy - r * 0.1);
    ctx.closePath();
    ctx.fill();

    // Inner pale rind
    ctx.fillStyle = '#dcfce7';
    ctx.beginPath();
    ctx.arc(cx, cy - r * 0.1, r * 0.86, 0.17 * Math.PI, 0.83 * Math.PI);
    ctx.lineTo(cx, cy - r * 0.1);
    ctx.closePath();
    ctx.fill();

    // Red flesh with juicy gradient
    const fleshGrad = ctx.createRadialGradient(cx, cy + r * 0.3, 1, cx, cy + r * 0.3, r * 0.75);
    fleshGrad.addColorStop(0, '#f87171');
    fleshGrad.addColorStop(0.7, '#ef4444');
    fleshGrad.addColorStop(1, '#b91c1c');
    ctx.fillStyle = fleshGrad;
    ctx.beginPath();
    ctx.arc(cx, cy - r * 0.1, r * 0.76, 0.18 * Math.PI, 0.82 * Math.PI);
    ctx.lineTo(cx, cy - r * 0.1);
    ctx.closePath();
    ctx.fill();

    // Black seeds
    ctx.fillStyle = '#0f172a';
    const seeds = [
      { x: -0.32, y: 0.25 },
      { x: 0, y: 0.35 },
      { x: 0.32, y: 0.25 }
    ];
    for (const s of seeds) {
      ctx.beginPath();
      ctx.ellipse(cx + s.x * r, cy + s.y * r, r * 0.065, r * 0.11, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Specular shine along the watermelon cut edge
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.beginPath();
    ctx.ellipse(cx - r * 0.2, cy - r * 0.08, r * 0.3, r * 0.05, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  private renderCherry(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
    // Stem joining
    ctx.strokeStyle = '#5d4037';
    ctx.lineWidth = Math.max(2, r * 0.13);
    ctx.lineCap = 'round';

    const joinX = cx + r * 0.1;
    const joinY = cy - r * 1.0;
    const c1X = cx - r * 0.44;
    const c1Y = cy + r * 0.34;
    const c2X = cx + r * 0.44;
    const c2Y = cy + r * 0.24;

    ctx.beginPath();
    ctx.moveTo(c1X, c1Y - r * 0.32);
    ctx.quadraticCurveTo(cx - r * 0.22, cy - r * 0.52, joinX, joinY);
    ctx.moveTo(c2X, c2Y - r * 0.32);
    ctx.quadraticCurveTo(cx + r * 0.32, cy - r * 0.52, joinX, joinY);
    ctx.stroke();

    // Leaf
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.ellipse(joinX + r * 0.24, joinY - r * 0.1, r * 0.3, r * 0.15, -Math.PI / 6, 0, Math.PI * 2);
    ctx.fill();

    // Cherries
    const cherryR = r * 0.44;
    for (const pos of [{ x: c1X, y: c1Y }, { x: c2X, y: c2Y }]) {
      const grad = ctx.createRadialGradient(pos.x - cherryR * 0.3, pos.y - cherryR * 0.3, 1, pos.x, pos.y, cherryR);
      grad.addColorStop(0, '#fda4af');
      grad.addColorStop(0.3, '#f43f5e');
      grad.addColorStop(0.7, '#be123c');
      grad.addColorStop(1, '#500724');
      ctx.fillStyle = grad;

      ctx.beginPath();
      ctx.arc(pos.x, pos.y, cherryR, 0, Math.PI * 2);
      ctx.fill();

      // Specular shine
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.beginPath();
      ctx.arc(pos.x - cherryR * 0.32, pos.y - cherryR * 0.32, cherryR * 0.28, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  private drawSnake(
    ctx: CanvasRenderingContext2D,
    snake: SnakeState,
    cellSize: number,
    time: number,
    food?: Collectible | null,
    realFileMode?: boolean,
    snakeSkin?: SnakeSkin,
    digestionProgress?: number,
    isNearMiss?: boolean,
    comboCount?: number
  ) {
    if (snake.body.length === 0) return;

    ctx.save();

    const skinPalette = SNAKE_SKIN_PALETTES[snakeSkin || 'CANDY_PINK'] || SNAKE_SKIN_PALETTES.CANDY_PINK;
    const isDangerMode = !!realFileMode;
    const snakeMain = isDangerMode ? '#ff002f' : skinPalette.main;
    const snakeMouthInterior = isDangerMode ? '#450a0a' : skinPalette.headBottom;
    const segDiameter = cellSize * 0.82;
    const segRadius = segDiameter / 2;

    // 1. Soft Drop Shadow Underneath Entire Snake
    ctx.save();
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.lineWidth = segDiameter;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const shadowOffsetY = cellSize * 0.08;

    if (snake.body.length > 1) {
      ctx.beginPath();
      for (let i = snake.body.length - 1; i >= 0; i--) {
        const seg = snake.body[i];
        const sx = seg.x * cellSize + cellSize / 2;
        const sy = seg.y * cellSize + cellSize / 2 + shadowOffsetY;
        if (i === snake.body.length - 1) {
          ctx.moveTo(sx, sy);
        } else {
          const prev = snake.body[i + 1];
          const dist = Math.hypot(seg.x - prev.x, seg.y - prev.y);
          if (dist > 1.5) {
            ctx.moveTo(sx, sy);
          } else {
            ctx.lineTo(sx, sy);
          }
        }
      }
      ctx.stroke();
    } else {
      const head = snake.body[0];
      ctx.beginPath();
      ctx.arc(head.x * cellSize + cellSize / 2, head.y * cellSize + cellSize / 2 + shadowOffsetY, segRadius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // 2. Smooth Continuous Capsule Body (Google Snake Style)
    ctx.save();
    ctx.strokeStyle = snakeMain;
    ctx.fillStyle = snakeMain;
    ctx.lineWidth = segDiameter;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (snake.body.length > 1) {
      ctx.beginPath();
      for (let i = snake.body.length - 1; i >= 0; i--) {
        const seg = snake.body[i];
        const cx = seg.x * cellSize + cellSize / 2;
        const cy = seg.y * cellSize + cellSize / 2;
        if (i === snake.body.length - 1) {
          ctx.moveTo(cx, cy);
        } else {
          const prev = snake.body[i + 1];
          const dist = Math.hypot(seg.x - prev.x, seg.y - prev.y);
          if (dist > 1.5) {
            ctx.moveTo(cx, cy);
          } else {
            ctx.lineTo(cx, cy);
          }
        }
      }
      ctx.stroke();

      // Ensure rounded tail cap is clean
      const tail = snake.body[snake.body.length - 1];
      ctx.beginPath();
      ctx.arc(tail.x * cellSize + cellSize / 2, tail.y * cellSize + cellSize / 2, segRadius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // 2b. Glossy Highlight Stripe (Google Snake's signature shiny pill look)
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
    ctx.lineWidth = segDiameter * 0.28;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    const highlightOffset = segDiameter * 0.18;

    if (snake.body.length > 1) {
      ctx.beginPath();
      for (let i = snake.body.length - 1; i >= 0; i--) {
        const seg = snake.body[i];
        // Offset highlight toward top-left for 3D gloss
        const cx = seg.x * cellSize + cellSize / 2 - highlightOffset * 0.4;
        const cy = seg.y * cellSize + cellSize / 2 - highlightOffset;
        if (i === snake.body.length - 1) {
          ctx.moveTo(cx, cy);
        } else {
          const prev = snake.body[i + 1];
          const dist = Math.hypot(seg.x - prev.x, seg.y - prev.y);
          if (dist > 1.5) {
            ctx.moveTo(cx, cy);
          } else {
            ctx.lineTo(cx, cy);
          }
        }
      }
      ctx.stroke();
    }
    ctx.restore();

    // 3. Digestion Wave (Smooth Subtle Bulge)
    if (digestionProgress !== undefined && digestionProgress >= 0 && digestionProgress <= 1 && snake.body.length > 1) {
      const bulgeIndex = Math.min(snake.body.length - 1, Math.floor(digestionProgress * (snake.body.length - 1)));
      const seg = snake.body[bulgeIndex];
      ctx.save();
      ctx.fillStyle = snakeMain;
      ctx.beginPath();
      ctx.arc(seg.x * cellSize + cellSize / 2, seg.y * cellSize + cellSize / 2, segRadius * 1.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 4. Draw Google Snake Head
    const head = snake.body[0];
    const hx = head.x * cellSize + cellSize / 2;
    const hy = head.y * cellSize + cellSize / 2;

    this.drawGoogleSnakeHead(
      ctx,
      hx,
      hy,
      segDiameter,
      snake,
      cellSize,
      time,
      food,
      snakeMain,
      snakeMouthInterior,
      skinPalette,
      comboCount
    );

    ctx.restore();

    // 5. Overhead Micro-Emotions (Knockout stars or near-miss sweat drop)
    if (!snake.isAlive) {
      this.drawOrbitingStars(ctx, hx, hy, segDiameter, time);
    } else if (isNearMiss) {
      this.drawSweatDrop(ctx, hx, hy, segDiameter, time);
    }
  }

  private drawGoogleSnakeHead(
    ctx: CanvasRenderingContext2D,
    hx: number,
    hy: number,
    segDiameter: number,
    snake: SnakeState,
    cellSize: number,
    time: number,
    food: Collectible | null | undefined,
    snakeMain: string,
    snakeMouthInterior: string,
    skinPalette: import('./constants').SnakeSkinPalette,
    comboCount?: number
  ) {
    ctx.save();
    ctx.translate(hx, hy);

    let angle = 0;
    if (snake.direction === 'DOWN') angle = Math.PI / 2;
    else if (snake.direction === 'LEFT') angle = Math.PI;
    else if (snake.direction === 'UP') angle = -Math.PI / 2;
    ctx.rotate(angle);

    const r = segDiameter / 2;
    const head = snake.body[0];

    // ONLY chomp when food is directly 1 cell ahead on the EXACT SAME LINE in the direction of movement
    const delta = {
      UP: { x: 0, y: -1 },
      DOWN: { x: 0, y: 1 },
      LEFT: { x: -1, y: 0 },
      RIGHT: { x: 1, y: 0 }
    }[snake.direction];
    const isFacingFood = !!(food && head.x + delta.x === food.position.x && head.y + delta.y === food.position.y);
    const isChomping = snake.isAlive && isFacingFood;

    // Animate mouth angle: oscillates between 5% and 35% of PI when chomping
    const chompCycle = isChomping ? (Math.sin(time * 0.018) * 0.5 + 0.5) : 0;
    const mouthOpenAngle = isChomping ? (0.08 + chompCycle * 0.27) : 0;

    if (isChomping) {
      // --- ANIMATED CHOMP (Google Snake Style: open/close rhythmically) ---

      // 1. Dark Mouth Cavity
      ctx.fillStyle = snakeMouthInterior;
      ctx.beginPath();
      ctx.arc(r * 0.1, 0, r * 0.95, -Math.PI * mouthOpenAngle, Math.PI * mouthOpenAngle);
      ctx.lineTo(r * 0.05, 0);
      ctx.closePath();
      ctx.fill();

      // 2. White Fangs (only show when mouth is open enough)
      if (mouthOpenAngle > 0.15) {
        const fangScale = (mouthOpenAngle - 0.15) / 0.2;
        ctx.fillStyle = '#ffffff';
        // Upper fang
        ctx.beginPath();
        ctx.moveTo(r * 0.45, -r * mouthOpenAngle * 1.5);
        ctx.lineTo(r * 0.42, -r * mouthOpenAngle * 0.4);
        ctx.lineTo(r * 0.7, -r * mouthOpenAngle * 0.9);
        ctx.closePath();
        ctx.globalAlpha = Math.min(1, fangScale * 2);
        ctx.fill();
        // Lower fang
        ctx.beginPath();
        ctx.moveTo(r * 0.45, r * mouthOpenAngle * 1.5);
        ctx.lineTo(r * 0.42, r * mouthOpenAngle * 0.4);
        ctx.lineTo(r * 0.7, r * mouthOpenAngle * 0.9);
        ctx.closePath();
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // 3. Smooth Upper & Lower Jaws
      ctx.fillStyle = snakeMain;
      // Base back rounded hemisphere
      ctx.beginPath();
      ctx.arc(0, 0, r, Math.PI / 2, -Math.PI / 2);
      ctx.arc(r * 0.2, 0, r, -Math.PI / 2, -Math.PI * mouthOpenAngle);
      ctx.lineTo(r * 0.05, 0);
      ctx.arc(r * 0.2, 0, r, Math.PI * mouthOpenAngle, Math.PI / 2);
      ctx.closePath();
      ctx.fill();

      // Rounded Jaw Caps
      const jawY = r * mouthOpenAngle * 1.6;
      ctx.beginPath();
      ctx.arc(r * 0.75, -jawY, r * 0.18, 0, Math.PI * 2);
      ctx.arc(r * 0.75, jawY, r * 0.18, 0, Math.PI * 2);
      ctx.fill();

      // Nostrils on upper/lower jaw
      ctx.fillStyle = skinPalette.eyeColor;
      ctx.beginPath();
      ctx.arc(r * 0.8, -jawY * 0.8, r * 0.07, 0, Math.PI * 2);
      ctx.arc(r * 0.8, jawY * 0.8, r * 0.07, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // --- NORMAL SMOOTH ROUNDED SNOUT (Google Snake: media_1789963374300.png) ---

      // Solid rounded pill head extending forward
      ctx.fillStyle = snakeMain;
      ctx.beginPath();
      ctx.arc(0, 0, r, Math.PI / 2, -Math.PI / 2); // back half
      ctx.arc(r * 0.25, 0, r, -Math.PI / 2, Math.PI / 2); // front rounded snout
      ctx.closePath();
      ctx.fill();

      // Two cute dark nostril dots on the rounded nose
      ctx.fillStyle = skinPalette.eyeColor;
      ctx.beginPath();
      ctx.arc(r * 0.92, -r * 0.2, r * 0.08, 0, Math.PI * 2);
      ctx.arc(r * 0.92, r * 0.2, r * 0.08, 0, Math.PI * 2);
      ctx.fill();
    }

    // --- PROTRUDING CARTOON EYES (Google Snake Signature) ---
    this.drawGoogleSnakeEyes(
      ctx,
      r,
      snake,
      food,
      hx,
      hy,
      angle,
      cellSize,
      snakeMain,
      skinPalette,
      comboCount
    );

    ctx.restore();
  }

  private drawGoogleSnakeEyes(
    ctx: CanvasRenderingContext2D,
    r: number,
    snake: SnakeState,
    food: Collectible | null | undefined,
    hx: number,
    hy: number,
    headAngle: number,
    cellSize: number,
    snakeMain: string,
    skinPalette: import('./constants').SnakeSkinPalette,
    comboCount?: number
  ) {
    const eyeX = -r * 0.04;
    const eyeY1 = -r * 0.85;
    const eyeY2 = r * 0.85;
    const eyeR = r * 0.44;
    const pupilR = eyeR * 0.54;

    // 1. Protruding Blue Eye Sockets / Rims
    ctx.fillStyle = snakeMain;
    ctx.beginPath();
    ctx.arc(eyeX, eyeY1, eyeR * 1.14, 0, Math.PI * 2);
    ctx.arc(eyeX, eyeY2, eyeR * 1.14, 0, Math.PI * 2);
    ctx.fill();

    // 2. Crisp Solid White Eye Spheres
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(eyeX, eyeY1, eyeR, 0, Math.PI * 2);
    ctx.arc(eyeX, eyeY2, eyeR, 0, Math.PI * 2);
    ctx.fill();

    // A. DEAD STATE: Knockout Cross Eyes (x_x)
    if (!snake.isAlive) {
      ctx.save();
      ctx.strokeStyle = skinPalette.eyeColor;
      ctx.lineWidth = 2.4;
      ctx.lineCap = 'round';
      for (const ey of [eyeY1, eyeY2]) {
        const d = eyeR * 0.55;
        ctx.beginPath();
        ctx.moveTo(eyeX - d, ey - d);
        ctx.lineTo(eyeX + d, ey + d);
        ctx.moveTo(eyeX + d, ey - d);
        ctx.lineTo(eyeX - d, ey + d);
        ctx.stroke();
      }
      ctx.restore();
      return;
    }

    // B. GOLDEN VIP: Cool Retro Sunglasses 😎
    if (skinPalette && skinPalette.name === 'Golden VIP') {
      ctx.save();
      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.8;

      ctx.beginPath();
      ctx.roundRect(eyeX - eyeR * 0.9, eyeY1 - eyeR * 0.9, eyeR * 1.8, eyeR * 1.8, 3);
      ctx.roundRect(eyeX - eyeR * 0.9, eyeY2 - eyeR * 0.9, eyeR * 1.8, eyeR * 1.8, 3);
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(eyeX, eyeY1 + eyeR * 0.8);
      ctx.lineTo(eyeX, eyeY2 - eyeR * 0.8);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(eyeX - eyeR * 0.6, eyeY1 - eyeR * 0.6);
      ctx.lineTo(eyeX + eyeR * 0.3, eyeY1 + eyeR * 0.6);
      ctx.moveTo(eyeX - eyeR * 0.6, eyeY2 - eyeR * 0.6);
      ctx.lineTo(eyeX + eyeR * 0.3, eyeY2 + eyeR * 0.6);
      ctx.stroke();

      ctx.restore();
      return;
    }

    // C. LIVING EYE TRACKING & PUPILS
    let pupilDx = pupilR * 0.35; // Default looking forward
    let pupilDy = 0;

    if (food) {
      const foodWorldX = food.position.x * cellSize + cellSize / 2;
      const foodWorldY = food.position.y * cellSize + cellSize / 2;
      const worldDx = foodWorldX - hx;
      const worldDy = foodWorldY - hy;
      const foodAngle = Math.atan2(worldDy, worldDx) - headAngle;
      const maxOffset = (eyeR - pupilR) * 0.85;
      pupilDx = Math.cos(foodAngle) * maxOffset;
      pupilDy = Math.sin(foodAngle) * maxOffset;
    }

    const currentPupilR = (comboCount && comboCount >= 3) ? pupilR * 1.12 : pupilR;
    const pupilColor = (comboCount && comboCount >= 3) ? '#f59e0b' : skinPalette.eyeColor;

    for (const ey of [eyeY1, eyeY2]) {
      ctx.fillStyle = pupilColor;
      ctx.beginPath();
      ctx.arc(eyeX + pupilDx, ey + pupilDy, currentPupilR, 0, Math.PI * 2);
      ctx.fill();

      // Specular shine dot
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(
        eyeX + pupilDx - currentPupilR * 0.3,
        ey + pupilDy - currentPupilR * 0.3,
        currentPupilR * 0.32,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
  }

  private drawSweatDrop(ctx: CanvasRenderingContext2D, hx: number, hy: number, headSize: number, time: number) {
    ctx.save();
    const bounce = Math.sin(time * 0.02) * 2;
    const sx = hx - headSize * 0.48;
    const sy = hy - headSize * 0.52 + bounce;

    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.moveTo(sx, sy - 7);
    ctx.quadraticCurveTo(sx + 5, sy - 1, sx + 5, sy + 4);
    ctx.arc(sx, sy + 4, 5, 0, Math.PI);
    ctx.quadraticCurveTo(sx - 5, sy - 1, sx, sy - 7);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(sx - 1.5, sy + 2, 1.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  private drawOrbitingStars(ctx: CanvasRenderingContext2D, hx: number, hy: number, headSize: number, time: number) {
    ctx.save();
    const orbitR = headSize * 0.72;
    for (let k = 0; k < 3; k++) {
      const angle = time * 0.005 + (k * Math.PI * 2) / 3;
      const starX = hx + Math.cos(angle) * orbitR;
      const starY = hy + Math.sin(angle) * (orbitR * 0.5) - headSize * 0.2;

      ctx.save();
      ctx.translate(starX, starY);
      ctx.rotate(time * 0.01 + k);
      ctx.fillStyle = '#fde047';

      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        const a = (i * Math.PI) / 2;
        ctx.lineTo(Math.cos(a) * 5.5, Math.sin(a) * 5.5);
        ctx.lineTo(Math.cos(a + Math.PI / 4) * 2, Math.sin(a + Math.PI / 4) * 2);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
    ctx.restore();
  }
}
