class Rod {
  public color = "#2A2B5F";

  constructor(
    public x: number,
    public y: number,
    public width: number,
    public height: number,
  ) {}

  public draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.roundRect(this.x, this.y, this.width, this.height, [10, 10, 0, 0]);
    ctx.fill();
  }
}

class Disc {
  constructor(
    public rod: Rod,
    public x: number,
    public y: number,
    public width: number,
    public height: number,
    public color: string,
  ) {}

  public draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;

    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.roundRect(this.x, this.y, this.width, this.height, [7]);
    ctx.fill();
    ctx.stroke();
  }

  public isInside(mouseX: number, mouseY: number) {
    return (
      mouseX >= this.x &&
      mouseX <= this.x + this.width &&
      mouseY >= this.y &&
      mouseY <= this.y + this.height
    );
  }
}

class Button {
  constructor(
    public x: number,
    public y: number,
    public width: number,
    public height: number,
    public color: string,
  ) {}

  public draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.roundRect(this.x, this.y, this.width, this.height, [10]);
    ctx.fill();
  }
}

class Config {
  discTotal = 5;

  public draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "#2A2B5F";
    ctx.beginPath();
    ctx.roundRect(70, 10, 40, 30, [10]);
    ctx.fill();

    ctx.font = "23px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Disc:", 10, 32);
    ctx.fillText(`${this.discTotal}`, 83, 33);
  }
}

export class TowerOfHanoi {
  private ctx: CanvasRenderingContext2D;
  private config = new Config();
  private rods: Rod[] = [];
  private discs: Disc[] = [];
  private discColors: string[] = ["#FFEB55", "#EE66A6", "#D91656", "#640D5F"];
  private selectedDisc: Disc | null = null;
  private offsetX = 0;
  private offsetY = 0;

  constructor(private canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Canvas not supported");
    }

    this.ctx = ctx;
    this.initGame();
    this.draw();
    this.registerEvents();
  }

  private initGame() {
    this.discs = [];
    this.rods = [
      new Rod(175, this.canvas.height - 200, 15, 200),
      new Rod(330, this.canvas.height - 200, 15, 200),
      new Rod(510, this.canvas.height - 200, 15, 200),
    ];

    for (let i = 0; i < this.config.discTotal; i++) {
      const height = 15;
      const width = 35 + 20 * (this.config.discTotal - i - 1);
      const x = this.rods[0].x - 10 * (this.config.discTotal - i);
      const y = this.canvas.height - height - height * i;
      const color = this.discColors[i % this.discColors.length];

      this.discs.push(new Disc(this.rods[0], x, y, width, 15, color));
    }
  }

  private draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.config.draw(this.ctx);
    this.rods.forEach((rod, _) => rod.draw(this.ctx));
    this.discs.forEach((disc, _) => disc.draw(this.ctx));
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
}
