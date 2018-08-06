import * as THREE from "three";

import { OrbitControls } from "./orbitControls/";
import { Artwork } from "./artwork";

function detectWebGL(): boolean {
  try {
    var canvas = document.createElement("canvas");
    return !!(
      (window as any).WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch (e) {
    return false;
  }
}

export let DBG_CAMERA = false;

export class SceneManager {
  private _renderer: THREE.WebGLRenderer;
  private _canvas: HTMLCanvasElement;
  private _containerElement: HTMLDivElement;
  private _camera: THREE.OrthographicCamera | THREE.PerspectiveCamera;
  private _cameraHelper: THREE.CameraHelper;
  private _cameraDBG: THREE.PerspectiveCamera;

  private _controls: THREE.OrbitControls;
  private _scene: THREE.Scene;
  private _artwork: Artwork;

  private _mouseX = 0;
  private _mouseY = 0;
  private _windowHalfX;
  private _windowHalfY;

  private _cameraVelocity = 0.01;
  private _cameraRotationRadius = 0.5;

  constructor(containerElement: HTMLDivElement) {
    // TODO 2018-08-04 check for browser compatibility
    const url = new URL(window.location.href);
    const dbgCamera = url.searchParams.get("debugCamera");
    if (dbgCamera != null) {
      DBG_CAMERA = true;
    }

    const isWebGLAvailable = detectWebGL();
    if (!isWebGLAvailable) {
      return;
    }

    this._renderer = new THREE.WebGLRenderer({ antialias: true });
    this._renderer.setClearColor(new THREE.Color(0xffffff));
    this._renderer.setPixelRatio(window.devicePixelRatio || 1);

    this._containerElement = containerElement;
    containerElement.appendChild(this._renderer.domElement);

    this._canvas = this._renderer.domElement;

    window.addEventListener("resize", this.resizeCanvas, false);
    document.addEventListener("mousemove", this.onDocumentMouseMove, false);

    this._scene = new THREE.Scene();

    this.setupCamera();

    this._artwork = new Artwork(this._scene, this._renderer);

    if (DBG_CAMERA) {
      this._controls = new OrbitControls(
        this._cameraDBG,
        this._renderer.domElement
      ) as any;
    }

    this.render();
  }

  private onDocumentMouseMove = event => {
    this._mouseX =
      ((event.clientX - this._windowHalfX) / window.innerWidth) *
      2 *
      this._cameraRotationRadius;
    this._mouseY =
      ((event.clientY - this._windowHalfY) / window.innerHeight) *
      2 *
      this._cameraRotationRadius;
  };

  private setupCamera(): void {
    this._camera = new THREE.PerspectiveCamera(45, 1, 0.1, 20);
    this._camera.position.set(0, 0, 10);

    if (DBG_CAMERA) {
      this._cameraHelper = new THREE.CameraHelper(this._camera);
      this._scene.add(this._camera);
      this._scene.add(this._cameraHelper);

      this._cameraDBG = this._camera.clone();
      this._cameraDBG.far = 1000;
      this._cameraDBG.updateProjectionMatrix();
    }

    this.resizeCanvas();
  }

  private resizeCanvas = (): void => {
    const containerStyle = getComputedStyle(this._containerElement);
    const containerWidth = parseInt(
      containerStyle.getPropertyValue("width"),
      10
    );
    const containerHeight = parseInt(
      containerStyle.getPropertyValue("height"),
      10
    );

    const width = Math.max(containerWidth, 1);
    const height = Math.max(containerHeight, 1);
    this._windowHalfX = width / 2;
    this._windowHalfY = height / 2;

    this._canvas.width = width;
    this._canvas.height = height;
    const newAR = width / height;

    if (this._camera instanceof THREE.PerspectiveCamera) {
      this._camera.aspect = newAR;
    } else if (this._camera instanceof THREE.OrthographicCamera) {
      let oldWidthWorldSpace = this._camera.right - this._camera.left;
      let oldHeightWorldSpace = this._camera.top - this._camera.bottom;

      let newWidthWorldSpace = oldHeightWorldSpace * newAR;
      let widthDiff = newWidthWorldSpace - oldWidthWorldSpace;
      this._camera.left -= widthDiff / 2;
      this._camera.right += widthDiff / 2;
    }

    this._camera.updateProjectionMatrix();

    if (DBG_CAMERA) {
      this._cameraDBG.aspect = newAR;
      this._cameraDBG.updateProjectionMatrix();
    }

    this._renderer.setSize(width, height);
  };

  private render = (): void => {
    requestAnimationFrame(this.render);

    this._camera.position.x +=
      (this._mouseX - this._camera.position.x) * this._cameraVelocity;
    this._camera.position.y +=
      (-this._mouseY - this._camera.position.y) * this._cameraVelocity;

    const MAX_CAM_OFFSET = 3;
    this._camera.position.x = Math.min(
      MAX_CAM_OFFSET,
      Math.max(-MAX_CAM_OFFSET, this._camera.position.x)
    );
    this._camera.position.y = Math.min(
      MAX_CAM_OFFSET,
      Math.max(-MAX_CAM_OFFSET, this._camera.position.y)
    );
    this._camera.lookAt(this._scene.position);

    this._artwork.update();
    if (DBG_CAMERA) {
      this._controls.update();
      this._cameraHelper.update();
      this._renderer.render(this._scene, this._cameraDBG);
    } else {
      this._renderer.render(this._scene, this._camera);
    }
  };
}
