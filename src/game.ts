abstract class BaseElement {
  constructor(
    public x: number,
    public y: number,
    public width: number,
    public height: number,
  ) {}

  public isInside(mouseX: number, mouseY: number) {
    return (
      mouseX >= this.x &&
      mouseX <= this.x + this.width &&
      mouseY >= this.y &&
      mouseY <= this.y + this.height
    );
  }
}

class Rod extends BaseElement {
  public color = "#2A2B5F";

  public draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.roundRect(this.x, this.y, this.width, this.height, [10, 10, 0, 0]);
    ctx.roundRect(this.x - 75, this.y + this.height, 160, this.width, 10);
    ctx.fill();
  }
}

class Disc extends BaseElement {
  constructor(
    public rod: Rod,
    public x: number,
    public y: number,
    public width: number,
    public height: number,
    public color: string,
  ) {
    super(x, y, width, height);
  }

  public draw(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = "black";
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.roundRect(this.x, this.y, this.width, this.height, [7]);
    ctx.fill();
    ctx.stroke();
  }
}

class Button extends BaseElement {
  constructor(
    public x: number,
    public y: number,
    public width: number,
    public height: number,
    public color: string,
    public strokeColor: string | null = null,
    public lineWidth = 1,
    public borderRadius = 10,
  ) {
    super(x, y, width, height);
  }

  public draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.roundRect(this.x, this.y, this.width, this.height, this.borderRadius);
    ctx.fill();

    if (this.strokeColor != null) {
      ctx.strokeStyle = this.strokeColor;
      ctx.lineWidth = this.lineWidth;
      ctx.stroke();
    }
  }
}

export class TowerOfHanoi {
  private ctx: CanvasRenderingContext2D;
  private rods: Rod[] = [];
  private discs: Disc[] = [];
  private discColors: string[] = ["#FFEB55", "#EE66A6", "#D91656", "#640D5F"];
  private selectedDisc: Disc | null = null;
  private offsetX = 0;
  private offsetY = 0;

  private discTotal = 4;
  private incrementBtn: Button;
  private decrementBtn: Button;

  constructor(private canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Canvas not supported");
    }

    this.ctx = ctx;

    this.incrementBtn = new Button(110, 13, 30, 27, "#2A2B5F", "blue");
    this.decrementBtn = new Button(142, 13, 30, 27, "#2A2B5F", "blue");

    this.initGame();
    this.draw();
    this.registerEvents();
  }

  private initGame() {
    this.discs = [];
    this.rods = [
      new Rod(100, this.canvas.height - 210, 10, 140),
      new Rod(290, this.canvas.height - 210, 10, 140),
      new Rod(480, this.canvas.height - 210, 10, 140),
    ];

    for (let i = 0; i < this.discTotal; i++) {
      const height = 15;
      const width = 30 + 20 * (this.discTotal - i - 1);
      const x = this.rods[0].x - this.rods[0].width * (this.discTotal - i);
      const y = this.rods[0].y + this.rods[0].height - height - height * i;
      const color = this.discColors[i % this.discColors.length];

      this.discs.push(new Disc(this.rods[0], x, y, width, 15, color));
    }
  }

  private draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.rods.forEach((rod, _) => rod.draw(this.ctx));
    this.discs.forEach((disc, _) => disc.draw(this.ctx));
    this.drawConfig();
  }

  private drawConfig() {
    this.ctx.fillStyle = "#2A2B5F";
    this.ctx.beginPath();
    this.ctx.roundRect(60, 10, 45, 30, [10]);
    this.ctx.fill();

    this.ctx.font = "20px Arial";
    this.ctx.fillStyle = "white";
    this.ctx.fillText("Disc:", 10, 32);
    this.ctx.fillText(`${this.discTotal}`, 76, 32);
    this.ctx.font = "16px Arial";
    this.ctx.fillText(
      `Minimum Moves: ${2 ** this.discTotal - 1}`,
      this.canvas.width - 155,
      this.canvas.height - 10,
    );

    this.incrementBtn.draw(this.ctx);
    this.decrementBtn.draw(this.ctx);

    this.ctx.fillStyle = "white";
    this.ctx.beginPath();
    this.ctx.moveTo(this.incrementBtn.x + 8, this.incrementBtn.y + 20);
    this.ctx.lineTo(this.incrementBtn.x + 22, this.incrementBtn.y + 20);
    this.ctx.lineTo(this.incrementBtn.x + 15, this.incrementBtn.y + 7);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.beginPath();
    this.ctx.moveTo(this.decrementBtn.x + 8, this.decrementBtn.y + 7);
    this.ctx.lineTo(this.decrementBtn.x + 22, this.decrementBtn.y + 7);
    this.ctx.lineTo(this.decrementBtn.x + 15, this.decrementBtn.y + 20);
    this.ctx.closePath();
    this.ctx.fill();
  }

  private registerEvents() {
    this.canvas.addEventListener("mousedown", this.onMouseDown.bind(this));
    this.canvas.addEventListener("mousemove", this.onMouseMove.bind(this));
    this.canvas.addEventListener("mouseup", this.onMouseUp.bind(this));
  }

  private onMouseDown(e: MouseEvent) {
    const mouseX = e.offsetX;
    const mouseY = e.offsetY;

    const disc = this.discs.find((disc) => disc.isInside(mouseX, mouseY));
    if (disc) {
      this.selectedDisc = disc;
      this.offsetX = mouseX - disc.x;
      this.offsetY = mouseY - disc.y;
    }

    if (this.incrementBtn.isInside(mouseX, mouseY)) {
      this.incrementDisc();
    }

    if (this.decrementBtn.isInside(mouseX, mouseY)) {
      this.decrementDisc();
    }
  }

  private onMouseMove(e: MouseEvent) {
    if (this.selectedDisc) {
      this.selectedDisc.x = e.offsetX - this.offsetX;
      this.selectedDisc.y = e.offsetY - this.offsetY;
      this.draw();
    }
  }

  private onMouseUp() {
    this.selectedDisc = null;
  }

  private incrementDisc() {
    if (this.discTotal < 8) {
      this.discTotal++;
      this.initGame();
      this.draw();
    }
  }

  private decrementDisc() {
    if (this.discTotal > 3) {
      this.discTotal--;
      this.initGame();
      this.draw();
    }
  }
}
