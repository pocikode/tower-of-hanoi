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
  public size = 10;
  public color = "#2A2B5F";
  public discs: Disc[] = [];

  public draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.roundRect(this.x, this.y + this.height, this.width, this.size, 10);
    ctx.roundRect(
      this.x + this.width / 2 - 5,
      this.y + this.height,
      this.size,
      this.height - 280,
      [0, 0, 10, 10],
    );
    ctx.fill();
    ctx.strokeStyle = "black";
    ctx.stroke();
  }

  public addDisc(disc: Disc) {
    this.discs.push(disc);
  }

  public isAllowedDrop(disc: Disc): boolean {
    return (
      this.discs.length === 0 ||
      this.discs[this.discs.length - 1].width > disc.width
    );
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

  public isOnTop() {
    return this.rod.discs[this.rod.discs.length - 1] === this;
  }

  public moveTo(rod: Rod) {
    let i = 0;
    for (i = 0; i < rod.discs.length; i++) {
      if (rod.discs[i] === this) {
        break;
      }
    }

    if (this.rod !== rod) {
      this.rod.discs = this.rod.discs.slice(0, this.rod.discs.length - 1);
      this.rod = rod;
      this.rod.addDisc(this);
    }

    this.x = rod.x + (rod.width - this.width) / 2;
    this.y =
      rod.y + rod.height - this.height - this.height * (rod.discs.length - 1);
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
  private discTotal = 3;
  private totalMoves = 0;
  private rods: Rod[] = [];
  private discs: Disc[] = [];
  private discColors: string[] = ["#FFEB55", "#EE66A6", "#D91656", "#640D5F"];
  private selectedDisc: Disc | null = null;
  private offsetX = 0;
  private offsetY = 0;
  private isDone = false;

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
    this.isDone = false;
    this.totalMoves = 0;
    this.discs = [];
    this.rods = [
      new Rod(20, this.canvas.height - 200, 160, 140),
      new Rod(210, this.canvas.height - 200, 160, 140),
      new Rod(400, this.canvas.height - 200, 160, 140),
    ];

    for (let i = 0; i < this.discTotal; i++) {
      const height = 15;
      const width = 30 + 20 * (this.discTotal - i - 1);
      const x =
        this.rods[0].x +
        this.rods[0].width / 2 -
        this.rods[0].size * (this.discTotal - i) -
        5;
      const y = this.rods[0].y + this.rods[0].height - height - height * i;
      const color = this.discColors[i % this.discColors.length];

      this.discs.push(new Disc(this.rods[0], x, y, width, 15, color));
    }

    this.rods[0].discs = this.discs;
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

    this.ctx.font = "bold 20px Arial";
    this.ctx.fillStyle = "blue";
    this.ctx.fillText(`Moves: ${this.totalMoves}`, 250, 32);

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
    if (disc && !this.isDone) {
      if (disc.isOnTop()) {
        this.selectedDisc = disc;
        this.offsetX = mouseX - disc.x;
        this.offsetY = mouseY - disc.y;
      }
    }

    if (this.incrementBtn.isInside(mouseX, mouseY)) {
      this.incrementDisc();
    }

    if (this.decrementBtn.isInside(mouseX, mouseY)) {
      this.decrementDisc();
    }
  }

  private onMouseMove(e: MouseEvent) {
    const mouseX = e.offsetX;
    const mouseY = e.offsetY;

    if (this.selectedDisc) {
      this.selectedDisc.x = mouseX - this.offsetX;
      this.selectedDisc.y = mouseY - this.offsetY;
      this.draw();
    }
  }

  private onMouseUp(e: MouseEvent) {
    const mouseX = e.offsetX;
    const mouseY = e.offsetY;

    if (this.selectedDisc) {
      this.selectedDisc.x = mouseX - this.offsetX;
      this.selectedDisc.y = mouseY - this.offsetY;

      const rod = this.rods.find(
        (rod) => rod !== this.selectedDisc?.rod && rod.isInside(mouseX, mouseY),
      );
      if (rod) {
        if (rod.isAllowedDrop(this.selectedDisc)) {
          this.totalMoves++;
          this.selectedDisc.moveTo(rod);
          this.isDone = this.rods[2].discs.length === this.discTotal;
        } else {
          this.selectedDisc.moveTo(this.selectedDisc.rod);
        }
      } else {
        this.selectedDisc.moveTo(this.selectedDisc.rod);
      }

      this.draw();
    }

    if (this.isDone) {
      this.drawCongratulation();
    }

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

  private drawCongratulation() {
    this.ctx.font = "700 35px Arial";
    this.ctx.fillStyle = "#FFEB55";
    this.ctx.fillText("Well Done!", 200, 80);
  }
}
