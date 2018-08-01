import * as THREE from "three";

// import { OrbitControls } from "./OrbitControls";
import { OrbitControls } from "./orbitControls/";
// import { OrbitControls } from "orbit-controls-es6";
// import { OrbitControls } from "three-orbitcontrols-ts";

import { Artwork } from "./artwork";

export class SceneManager {
  private _renderer: THREE.WebGLRenderer;
  private _canvas: HTMLCanvasElement;
  private _camera: THREE.OrthographicCamera | THREE.PerspectiveCamera;
  private _controls: THREE.OrbitControls;
  private _scene: THREE.Scene;
  private _artwork: Artwork;

  constructor(containerElement: HTMLDivElement) {
    this._renderer = new THREE.WebGLRenderer({ antialias: true });
    this._renderer.setClearColor(new THREE.Color(0xffffff));
    this._renderer.setPixelRatio(window.devicePixelRatio || 1);
    containerElement.appendChild(this._renderer.domElement);

    this._canvas = this._renderer.domElement;
    this._canvas.style.width = "100%";
    this._canvas.style.height = "100%";

    window.addEventListener("resize", this.resizeCanvas, false);

    this._scene = new THREE.Scene();

    this.setupCamera();

    this._artwork = new Artwork(this._scene, this._renderer);

    this._controls = new OrbitControls(
      this._camera,
      this._renderer.domElement
    ) as any;

    this.render();
  }

  private setupCamera(): void {
    this._camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    this._camera.position.set(0, 0, 20);
    // this._camera.lookAt(0, 0, 0);
    this._camera.updateProjectionMatrix();
    this.resizeCanvas();
  }

  private resizeCanvas = (): void => {
    const width = Math.max(this._renderer.domElement.offsetWidth, 1);
    const height = Math.max(this._renderer.domElement.offsetHeight, 1);

    this._canvas.width = width;
    this._canvas.height = height;
    const tNewAR = width / height;

    if (this._camera instanceof THREE.PerspectiveCamera) {
      this._camera.aspect = tNewAR;
    } else if (this._camera instanceof THREE.OrthographicCamera) {
      let oldWidthWorldSpace = this._camera.right - this._camera.left;
      let oldHeightWorldSpace = this._camera.top - this._camera.bottom;

      let newWidthWorldSpace = oldHeightWorldSpace * tNewAR;
      let widthDiff = newWidthWorldSpace - oldWidthWorldSpace;
      this._camera.left -= widthDiff / 2;
      this._camera.right += widthDiff / 2;
    }

    this._camera.updateProjectionMatrix();

    this._renderer.setSize(width, height);
  };

  private render = (): void => {
    requestAnimationFrame(this.render);

    this._controls.update();

    this._artwork.update();
    this._renderer.render(this._scene, this._camera);
  };
}
