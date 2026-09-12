import { SnakeState, Collectible, GameMode } from '../types/game';
import { ParticleSystem } from './particles';

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
}

export class GameRenderer {
  public render(params: RenderContext) {
    const { ctx, width, height, gridSize, snake, food, particles, gameMode, realFileMode, time } = params;
    const cellSize = width / gridSize;

    // 1. Clear background
    ctx.clearRect(0, 0, width, height);

    // 2. Draw Google-Snake inspired checkered grid
    this.drawGrid(ctx, gridSize, cellSize);

    // 3. Draw border frame
    this.drawBorder(ctx, width, height, gameMode);

    // 4. Draw Collectible Fruit
    if (food) {
      this.drawFruit(ctx, food, cellSize, time, width, height, realFileMode);
    }

    // 5. Draw Snake
    this.drawSnake(ctx, snake, cellSize, time, food, realFileMode);

    // 6. Draw Particles
    particles.render(ctx);
  }

  private drawGrid(ctx: CanvasRenderingContext2D, gridSize: number, cellSize: number) {
    // Google Snake inspired two-tone subtle green checkerboard
    const colorA = '#a2d149'; // Clean lawn green
    const colorB = '#aad751'; // Alternating soft green

    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        ctx.fillStyle = (x + y) % 2 === 0 ? colorA : colorB;
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }
  }

  private drawBorder(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    _gameMode: GameMode
  ) {
    ctx.save();
    // Natural garden border frame
    ctx.strokeStyle = '#4a752c';
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, width - 4, height - 4);
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

    // Larger, juicy fruit radius (0.44 * cellSize instead of 0.36)
    const r = (cellSize * 0.44) * scale;
    const fruit = food.fruitType || 'apple';

    ctx.save();

    // Soft colored ambient drop shadow under the fruit
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.beginPath();
    ctx.ellipse(cx, cy + r * 0.88, r * 0.78, r * 0.26, 0, 0, Math.PI * 2);
    ctx.fill();

    switch (fruit) {
      case 'apple':
        this.renderApple(ctx, cx, cy, r);
        break;
      case 'orange':
        this.renderOrange(ctx, cx, cy, r);
        break;
      case 'grape':
        this.renderGrape(ctx, cx, cy, r);
        break;
      case 'strawberry':
        this.renderStrawberry(ctx, cx, cy, r);
        break;
      case 'watermelon':
        this.renderWatermelon(ctx, cx, cy, r);
        break;
      case 'cherry':
        this.renderCherry(ctx, cx, cy, r);
        break;
      default:
        this.renderApple(ctx, cx, cy, r);
        break;
    }

    ctx.restore();

    // Draw cartoon file badge above the fruit displaying actual file name
    if (food.file && food.file.name) {
      this.drawFruitFileBadge(ctx, food.file.name, cx, cy, r, cellSize, boardWidth, boardHeight, realFileMode);
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
    realFileMode?: boolean
  ) {
    ctx.save();

    // Clean truncate for crisp legibility
    let display = filename;
    if (display.length > 15) {
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
    realFileMode?: boolean
  ) {
    if (snake.body.length === 0) return;

    ctx.save();

    // Danger Mode: Vibrant hot danger red (#FF002F / #FF0011)
    // Demo Mode: Cute DangerPinky candy pink (#ff3b94)
    const isDangerMode = !!realFileMode;
    const snakeMain = isDangerMode ? '#ff002f' : '#ff3b94';
    const snakeDark = isDangerMode ? '#b3001e' : '#d80064';
    const snakeHighlight = isDangerMode ? '#ff4d6d' : '#ff7bb9';
    const snakeHeadTop = isDangerMode ? '#ff6685' : '#ff90c6';
    const snakeHeadBottom = isDangerMode ? '#990014' : '#c70057';

    // 1. Draw body segments (from tail to neck)
    for (let i = snake.body.length - 1; i > 0; i--) {
      const seg = snake.body[i];
      const prevSeg = snake.body[i - 1];

      const segSize = cellSize * 0.86;
      const cx = seg.x * cellSize + cellSize / 2;
      const cy = seg.y * cellSize + cellSize / 2;

      // Soft drop shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.14)';
      ctx.beginPath();
      ctx.ellipse(cx, cy + cellSize * 0.08, segSize * 0.5, segSize * 0.44, 0, 0, Math.PI * 2);
      ctx.fill();

      // Main Segment Body
      const bodyGrad = ctx.createRadialGradient(
        cx - segSize * 0.2,
        cy - segSize * 0.2,
        segSize * 0.1,
        cx,
        cy,
        segSize * 0.65
      );
      bodyGrad.addColorStop(0, snakeHighlight);
      bodyGrad.addColorStop(0.55, snakeMain);
      bodyGrad.addColorStop(1, snakeDark);

      ctx.fillStyle = bodyGrad;
      ctx.beginPath();
      ctx.roundRect(
        cx - segSize / 2,
        cy - segSize / 2,
        segSize,
        segSize,
        segSize * 0.45
      );
      ctx.fill();

      // Specular Top Shine (Glossy Candy Finish)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.42)';
      ctx.beginPath();
      ctx.ellipse(
        cx - segSize * 0.12,
        cy - segSize * 0.18,
        segSize * 0.26,
        segSize * 0.12,
        -Math.PI / 6,
        0,
        Math.PI * 2
      );
      ctx.fill();

      // Connect segment with adjacent segment for continuous smooth snake body
      const nextCx = prevSeg.x * cellSize + cellSize / 2;
      const nextCy = prevSeg.y * cellSize + cellSize / 2;
      const dist = Math.hypot(nextCx - cx, nextCy - cy);

      // Only connect if adjacent (don't connect across wrap-around boundaries!)
      if (dist < cellSize * 1.5) {
        ctx.beginPath();
        ctx.lineWidth = segSize * 0.94;
        ctx.strokeStyle = snakeMain;
        ctx.lineCap = 'round';
        ctx.moveTo(cx, cy);
        ctx.lineTo(nextCx, nextCy);
        ctx.stroke();

        // Connect spine highlight
        ctx.beginPath();
        ctx.lineWidth = segSize * 0.22;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.lineCap = 'round';
        ctx.moveTo(cx - segSize * 0.08, cy - segSize * 0.12);
        ctx.lineTo(nextCx - segSize * 0.08, nextCy - segSize * 0.12);
        ctx.stroke();
      }
    }

    // 2. Draw Head
    const head = snake.body[0];
    const headSize = cellSize * 0.94;
    const hx = head.x * cellSize + cellSize / 2;
    const hy = head.y * cellSize + cellSize / 2;

    // Connect head to neck segment cleanly
    if (snake.body.length > 1) {
      const neck = snake.body[1];
      const neckCx = neck.x * cellSize + cellSize / 2;
      const neckCy = neck.y * cellSize + cellSize / 2;
      const dist = Math.hypot(neckCx - hx, neckCy - hy);
      if (dist < cellSize * 1.5) {
        ctx.beginPath();
        ctx.lineWidth = headSize * 0.92;
        ctx.strokeStyle = snakeMain;
        ctx.lineCap = 'round';
        ctx.moveTo(hx, hy);
        ctx.lineTo(neckCx, neckCy);
        ctx.stroke();
      }
    }

    // Animated Forked Tongue
    this.drawSnakeTongue(ctx, hx, hy, headSize, snake.direction, time);

    // Head Drop Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
    ctx.beginPath();
    ctx.ellipse(hx, hy + cellSize * 0.09, headSize * 0.52, headSize * 0.46, 0, 0, Math.PI * 2);
    ctx.fill();

    // Head Sphere with Candy Radial Gradient
    const headGrad = ctx.createRadialGradient(
      hx - headSize * 0.22,
      hy - headSize * 0.22,
      headSize * 0.1,
      hx,
      hy,
      headSize * 0.68
    );
    headGrad.addColorStop(0, snakeHeadTop);
    headGrad.addColorStop(0.5, snakeMain);
    headGrad.addColorStop(1, snakeHeadBottom);

    ctx.fillStyle = headGrad;
    ctx.beginPath();
    ctx.arc(hx, hy, headSize / 2, 0, Math.PI * 2);
    ctx.fill();

    // Head Specular Crown Highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.48)';
    ctx.beginPath();
    ctx.ellipse(
      hx - headSize * 0.14,
      hy - headSize * 0.2,
      headSize * 0.24,
      headSize * 0.13,
      -Math.PI / 5,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Snake Cute Cartoon Eyes with Kawaii Catchlights
    const foodCoord = food
      ? { x: food.position.x * cellSize + cellSize / 2, y: food.position.y * cellSize + cellSize / 2 }
      : null;
    this.drawSnakeEyes(ctx, hx, hy, headSize, snake.direction, foodCoord);

    ctx.restore();
  }

  private drawSnakeTongue(
    ctx: CanvasRenderingContext2D,
    hx: number,
    hy: number,
    headSize: number,
    direction: SnakeState['direction'],
    time: number
  ) {
    // Gentle periodic tongue flicking
    const flick = Math.sin(time * 0.018);
    if (flick < 0.2) return; // Only flick periodically

    const tongueLen = (headSize * 0.38) * (flick * 0.8 + 0.2);
    let startX = hx, startY = hy;
    let endX = hx, endY = hy;
    let fork1X = 0, fork1Y = 0;
    let fork2X = 0, fork2Y = 0;

    const forkSize = headSize * 0.12;

    switch (direction) {
      case 'UP':
        startY = hy - headSize * 0.45;
        endY = startY - tongueLen;
        fork1X = endX - forkSize; fork1Y = endY - forkSize * 0.8;
        fork2X = endX + forkSize; fork2Y = endY - forkSize * 0.8;
        break;
      case 'DOWN':
        startY = hy + headSize * 0.45;
        endY = startY + tongueLen;
        fork1X = endX - forkSize; fork1Y = endY + forkSize * 0.8;
        fork2X = endX + forkSize; fork2Y = endY + forkSize * 0.8;
        break;
      case 'LEFT':
        startX = hx - headSize * 0.45;
        endX = startX - tongueLen;
        fork1X = endX - forkSize * 0.8; fork1Y = endY - forkSize;
        fork2X = endX - forkSize * 0.8; fork2Y = endY + forkSize;
        break;
      case 'RIGHT':
        startX = hx + headSize * 0.45;
        endX = startX + tongueLen;
        fork1X = endX + forkSize * 0.8; fork1Y = endY - forkSize;
        fork2X = endX + forkSize * 0.8; fork2Y = endY + forkSize;
        break;
    }

    ctx.save();
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = Math.max(1.8, headSize * 0.06);
    ctx.lineCap = 'round';

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.lineTo(fork1X, fork1Y);
    ctx.moveTo(endX, endY);
    ctx.lineTo(fork2X, fork2Y);
    ctx.stroke();
    ctx.restore();
  }

  private drawSnakeEyes(
    ctx: CanvasRenderingContext2D,
    hx: number,
    hy: number,
    headSize: number,
    direction: SnakeState['direction'],
    foodCoord?: { x: number; y: number } | null
  ) {
    ctx.save();
    ctx.shadowBlur = 0;

    let eye1X = 0, eye1Y = 0;
    let eye2X = 0, eye2Y = 0;
    let pupilDx = 0, pupilDy = 0;

    const eyeOffset = headSize * 0.28;
    const eyeForward = headSize * 0.19;
    const eyeRadius = headSize * 0.21;
    const pupilRadius = headSize * 0.12;

    switch (direction) {
      case 'UP':
        eye1X = hx - eyeOffset; eye1Y = hy - eyeForward;
        eye2X = hx + eyeOffset; eye2Y = hy - eyeForward;
        pupilDy = -pupilRadius * 0.5;
        break;
      case 'DOWN':
        eye1X = hx - eyeOffset; eye1Y = hy + eyeForward;
        eye2X = hx + eyeOffset; eye2Y = hy + eyeForward;
        pupilDy = pupilRadius * 0.5;
        break;
      case 'LEFT':
        eye1X = hx - eyeForward; eye1Y = hy - eyeOffset;
        eye2X = hx - eyeForward; eye2Y = hy + eyeOffset;
        pupilDx = -pupilRadius * 0.5;
        break;
      case 'RIGHT':
        eye1X = hx + eyeForward; eye1Y = hy - eyeOffset;
        eye2X = hx + eyeForward; eye2Y = hy + eyeOffset;
        pupilDx = pupilRadius * 0.5;
        break;
    }

    // Glance toward food if within range
    if (foodCoord) {
      const fdx = foodCoord.x - hx;
      const fdy = foodCoord.y - hy;
      const fdist = Math.hypot(fdx, fdy);
      if (fdist > 0 && fdist < headSize * 6) {
        pupilDx = (pupilDx * 0.4) + (fdx / fdist) * pupilRadius * 0.6;
        pupilDy = (pupilDy * 0.4) + (fdy / fdist) * pupilRadius * 0.6;
      }
    }

    // Eye outline ring for crisp cartoon pop
    ctx.fillStyle = 'rgba(139, 0, 61, 0.35)';
    ctx.beginPath();
    ctx.arc(eye1X, eye1Y, eyeRadius + 1.2, 0, Math.PI * 2);
    ctx.arc(eye2X, eye2Y, eyeRadius + 1.2, 0, Math.PI * 2);
    ctx.fill();

    // White eye sclera
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(eye1X, eye1Y, eyeRadius, 0, Math.PI * 2);
    ctx.arc(eye2X, eye2Y, eyeRadius, 0, Math.PI * 2);
    ctx.fill();

    // Dark berry pupils looking at food
    ctx.fillStyle = '#260417';
    ctx.beginPath();
    ctx.arc(eye1X + pupilDx, eye1Y + pupilDy, pupilRadius, 0, Math.PI * 2);
    ctx.arc(eye2X + pupilDx, eye2Y + pupilDy, pupilRadius, 0, Math.PI * 2);
    ctx.fill();

    // Primary bright specular catchlight (top-left of pupil)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(
      eye1X + pupilDx - pupilRadius * 0.35,
      eye1Y + pupilDy - pupilRadius * 0.35,
      pupilRadius * 0.44,
      0,
      Math.PI * 2
    );
    ctx.arc(
      eye2X + pupilDx - pupilRadius * 0.35,
      eye2Y + pupilDy - pupilRadius * 0.35,
      pupilRadius * 0.44,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Secondary smaller cute catchlight (bottom-right of pupil for anime/kawaii sparkle)
    ctx.beginPath();
    ctx.arc(
      eye1X + pupilDx + pupilRadius * 0.38,
      eye1Y + pupilDy + pupilRadius * 0.38,
      pupilRadius * 0.22,
      0,
      Math.PI * 2
    );
    ctx.arc(
      eye2X + pupilDx + pupilRadius * 0.38,
      eye2Y + pupilDy + pupilRadius * 0.38,
      pupilRadius * 0.22,
      0,
      Math.PI * 2
    );
    ctx.fill();

    ctx.restore();
  }
}
