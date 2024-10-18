import { TowerOfHanoi } from "./game";

window.addEventListener("load", () => {
	const canvas = document.getElementById("game") as HTMLCanvasElement;
	new TowerOfHanoi(canvas);
});
