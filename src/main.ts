import { TowerOfHanoi } from "./game";
import githubIcon from "./icon/github.svg";

window.addEventListener("load", () => {
  const canvas = document.getElementById("game") as HTMLCanvasElement;
  new TowerOfHanoi(canvas);

  const githubLink = document.querySelector("#github-link") as HTMLDivElement;
  githubLink.innerHTML = `
    <a href="https://github.com/pocikode/tower-of-hanoi" target="_blank">
      <img src="${githubIcon}" alt="Github Logo" class="github-icon w-10" />
    </a>
  `;
});
