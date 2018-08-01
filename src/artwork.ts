import * as THREE from "three";

import * as LightSetup from "./LightSetup";

export class Artwork {
  constructor(
    private _scene: THREE.Scene,
    private _renderer: THREE.WebGLRenderer
  ) {
    this._setupLights();

    this._setupScene();
  }

  private _setupScene() {
    const boxGeo = new THREE.BoxGeometry(10, 10, 10);
    const boxMat = new THREE.MeshPhongMaterial({ color: 0x22ff22 });
    const boxMesh = new THREE.Mesh(boxGeo, boxMat);
    this._scene.add(boxMesh);

    const sphereGeo = new THREE.SphereGeometry(10, 10, 10);
    const sphereMat = new THREE.MeshPhongMaterial({ color: 0xf22f22 });
    const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    this._scene.add(sphereMesh);
    sphereMesh.position.x = Math.random() * 10;
  }

  private async _setupLights(): Promise<void> {
    LightSetup.loadAndReplaceLightSetup(
      "assets/lightsetup.json",
      this._scene,
      this._renderer
    );
  }
  public update(): void {}
}
