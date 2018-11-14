import * as THREE from "three";

import * as LightSetup from "./LightSetup";
import {
  displacmentVertexShader,
  displacmentFragmentShader
} from "./shaders/landscapeShader";

import { DBG_CAMERA } from "./sceneManager";

export const Colors = {
  DefaultTextColor: "#333333",
  LightTextColor: "#666666",
  LinkColor: "#000000",
  LinkHoverColor: "#856234",
  HighlightColor: "#856234",
  ActiveMenuColor: "#888888",
  CaptionUnderlineColor: "#888888",
  RulerColor: "#444444"
};

interface ITextureRessource {
  name: string;
  texture: THREE.Texture;
}

const textureLoader = new THREE.TextureLoader();

async function loadTexture(url: string): Promise<ITextureRessource> {
  const result = new Promise<ITextureRessource>((resolve, reject) => {
    textureLoader.load(
      url,
      texture => {
        resolve({ name: url, texture });
      },
      error => {
        reject(error);
      }
    );
  });
  return result;
}

export class Artwork {
  private _orbits: { speed: number; lineObject: THREE.Object3D }[] = [];
  private _lastUpdateTime = Date.now();
  private _startTime = Date.now();
  private _matLandscape: THREE.ShaderMaterial;
  private _textures: Record<string, THREE.Texture> = {};

  constructor(
    private _scene: THREE.Scene,
    private _renderer: THREE.WebGLRenderer
  ) {
    this._setupLights();

    this._loadAssets();
  }

  private async _loadAssets(): Promise<void> {
    const texturePromises = [
      loadTexture("assets/black/grain2.jpg"),
      loadTexture("assets/white/sun_map.jpg"),
      loadTexture("assets/white/sun_alpha.jpg")
    ];
    const textureRessources = await Promise.all(texturePromises);
    for (const tr of textureRessources) {
      this._textures[tr.name] = tr.texture;
    }

    this._setupScene();
  }

  private async _setupScene(): Promise<void> {
    const sunSize = 1.5;
    const orbitSize = sunSize * 0.98;
    const orbitResolution = 256;
    const orbitFactor = 1.16;
    const extraOrbitSize = 0.17;
    const planetSize = 0.08;
    const extraPlanetSize = 0.03;
    const LINE_RESOLUTION = 100;
    const LINE_AMOUNT = 200;
    const LINE_WIDTH = 0.01;
    const FIELD_WIDTH = 20;

    const matWireframe = new THREE.MeshBasicMaterial({
      color: 0x444444,
      wireframe: true
    });

    // add background of white grain
    const texWhiteGrain = this._textures["assets/black/grain2.jpg"];
    texWhiteGrain.repeat.set(3, 3);
    texWhiteGrain.wrapS = texWhiteGrain.wrapT = THREE.RepeatWrapping;
    const geoGrain = new THREE.PlaneGeometry(32, 32);
    const matWhiteGrain = new THREE.MeshBasicMaterial({
      color: 0x000000,
      alphaMap: texWhiteGrain,
      transparent: true
    });
    const meshWhiteGrain = new THREE.Mesh(geoGrain, matWhiteGrain);
    // this._scene.add(meshWhiteGrain);
    meshWhiteGrain.position.z = -4;
    if (DBG_CAMERA) {
      const meshSurrounding = new THREE.Mesh(geoGrain, matWireframe);
      meshWhiteGrain.add(meshSurrounding);
    }

    // add second background of white grain
    const texWhiteGrain2 = texWhiteGrain.clone();
    texWhiteGrain2.repeat.set(3, 3);
    texWhiteGrain2.rotation = 1; // avoid correlation between noise textures
    texWhiteGrain2.wrapS = texWhiteGrain2.wrapT = THREE.RepeatWrapping;
    texWhiteGrain2.needsUpdate = true;
    const matWhiteGrain2 = new THREE.MeshBasicMaterial({
      color: 0x000000,
      alphaMap: texWhiteGrain2,
      transparent: true
    });
    const meshWhiteGrain2 = new THREE.Mesh(geoGrain, matWhiteGrain2);
    // this._scene.add(meshWhiteGrain2);
    meshWhiteGrain2.position.z = -7;
    if (DBG_CAMERA) {
      const meshSurrounding = new THREE.Mesh(geoGrain, matWireframe);
      meshWhiteGrain2.add(meshSurrounding);
    }

    // add sun
    const texMapSun = this._textures["assets/white/sun_map.jpg"];
    const texAlphaSun = this._textures["assets/white/sun_alpha.jpg"];
    const geoSun = new THREE.PlaneGeometry(2 * sunSize, 2 * sunSize);
    const matSun = new THREE.MeshPhongMaterial({
      map: texMapSun,
      alphaMap: texAlphaSun,
      transparent: true
    });
    const meshSun = new THREE.Mesh(geoSun, matSun);
    this._scene.add(meshSun);

    this._lastUpdateTime = Date.now();

    // inner orbit
    const matOrbit = new THREE.LineBasicMaterial({ color: 0x000000 });
    const innerOrbit = this.createOrbitLine(
      orbitSize * orbitFactor,
      orbitResolution,
      matOrbit
    );
    innerOrbit.rotation.z = Math.random() * Math.PI * 2;
    this._orbits.push({ speed: 1 / 20, lineObject: innerOrbit });
    this._scene.add(innerOrbit);

    const matPlanet = new THREE.MeshBasicMaterial({
      color: 0x000000,
      side: THREE.DoubleSide
    });
    const geoInnerPlanet = new THREE.CircleBufferGeometry(planetSize, 20);
    const meshInnerPlanet = new THREE.Mesh(geoInnerPlanet, matPlanet);
    meshInnerPlanet.position.y = orbitSize * orbitFactor;
    innerOrbit.add(meshInnerPlanet);

    // middle orbit
    const middleOrbit = this.createOrbitLine(
      orbitSize * orbitFactor * orbitFactor,
      orbitResolution,
      matOrbit
    );
    middleOrbit.rotation.z = Math.random() * Math.PI * 2;
    this._orbits.push({ speed: -1 / 30, lineObject: middleOrbit });
    this._scene.add(middleOrbit);

    const geoMiddlePlanet = new THREE.CircleBufferGeometry(
      planetSize * orbitFactor,
      20
    );
    const meshMiddlePlanet = new THREE.Mesh(geoMiddlePlanet, matPlanet);
    meshMiddlePlanet.position.y = orbitSize * orbitFactor * orbitFactor;
    middleOrbit.add(meshMiddlePlanet);

    // outer orbit
    const outerOrbitSpeed = 1 / 24;
    const outerOrbit = this.createOrbitLine(
      orbitSize * orbitFactor * orbitFactor * orbitFactor,
      orbitResolution,
      matOrbit
    );
    outerOrbit.rotation.z = Math.random() * Math.PI * 2;
    this._orbits.push({ speed: outerOrbitSpeed, lineObject: outerOrbit });
    this._scene.add(outerOrbit);

    const geoOuterPlanet = new THREE.CircleBufferGeometry(
      planetSize * orbitFactor * orbitFactor,
      20
    );
    const meshOuterPlanet = new THREE.Mesh(geoOuterPlanet, matPlanet);
    meshOuterPlanet.position.y =
      orbitSize * orbitFactor * orbitFactor * orbitFactor;
    outerOrbit.add(meshOuterPlanet);

    // extra orbit in outer orbit
    const matMoonOrbit = new THREE.LineDashedMaterial({
      color: 0x000000,
      gapSize: 0.02,
      dashSize: 0.03
    });
    const outerMoonOrbit = this.createOrbitLine(
      extraOrbitSize,
      orbitResolution,
      matMoonOrbit
    );
    outerMoonOrbit.rotation.z = Math.random();
    outerMoonOrbit.position.y = meshOuterPlanet.position.y;
    this._orbits.push({ speed: -outerOrbitSpeed, lineObject: outerMoonOrbit });
    outerOrbit.add(outerMoonOrbit);

    const outerMoonSupport = new THREE.Object3D();
    outerMoonSupport.rotation.z = Math.random();
    outerMoonSupport.position.y = meshOuterPlanet.position.y;
    this._orbits.push({ speed: 1 / 5, lineObject: outerMoonSupport });
    outerOrbit.add(outerMoonSupport);

    const geoOuterExtraPlanet = new THREE.CircleBufferGeometry(
      extraPlanetSize,
      20
    );
    const meshOuterExtraPlanet = new THREE.Mesh(geoOuterExtraPlanet, matPlanet);
    meshOuterExtraPlanet.position.y = extraOrbitSize;
    outerMoonSupport.add(meshOuterExtraPlanet);

    // create wobbling landscape
    // first, try example from https://www.clicktorelease.com/blog/vertex-displacement-noise-3d-webgl-glsl-three-js/
    this._matLandscape = new THREE.ShaderMaterial({
      uniforms: {
        time: {
          type: "f",
          value: 0.0
        },
        vpw: {
          type: "f",
          value: 100.0
        },
        vph: {
          type: "f",
          value: 100.0
        },
        offset: {
          type: "v2",
          value: new THREE.Vector2(0, 0.0)
        },
        pitch: {
          type: "v2",
          value: new THREE.Vector2(50, 50)
        },
        lineWidth: {
          type: "f",
          value: 0.02
        },
        lineDistance: {
          type: "f",
          value: 0.1
        }
      },
      vertexShader: displacmentVertexShader,
      fragmentShader: displacmentFragmentShader,
      transparent: true,
      side: THREE.DoubleSide
    });
    this._matLandscape.extensions.derivatives = true;

    const geoLandscape = new THREE.PlaneBufferGeometry(1, 1, 120, 120);
    const meshLandscape = new THREE.Mesh(geoLandscape, this._matLandscape);
    meshLandscape.position.set(-2, -1, 2);
    meshLandscape.rotation.x = -Math.PI / 2;
    meshLandscape.rotation.z = 0.1;
    meshLandscape.scale.set(10, 10, 2);
    meshLandscape.position.set(0, -0.25, 5.5);
    // meshLandscape.rotation.x = 0.1;
    const useLines = false;
    if (!useLines) {
      this._scene.add(meshLandscape);
    }

    let geoLineLandscape = new THREE.Geometry();
    for (let lineIdx = 0; lineIdx < LINE_AMOUNT; lineIdx++) {
      let oldHeight = 0;
      const alpha = 0.1;

      for (let j = 0; j < LINE_RESOLUTION; j++) {
        const height = -j / LINE_RESOLUTION + Math.random();
        const filteredHeight = height * alpha + (1 - alpha) * oldHeight;
        const v = new THREE.Vector3(
          lineIdx / LINE_AMOUNT,
          filteredHeight,
          j / LINE_RESOLUTION
        );
        oldHeight = filteredHeight;
        if (j !== 0 && j !== LINE_RESOLUTION - 1) {
          geoLineLandscape.vertices.push(v);
        }
        geoLineLandscape.vertices.push(v);
      }
    }

    // var meshLineLandscape = new MeshLine();
    // meshLineLandscape.setGeometry(geoLineLandscape);
    // const matMeshLineLandscape = new MeshLineMaterial({ color: new THREE.Color(0x0), lineWidth: LINE_WIDTH, sizeAttenuation: 1 });
    // const meshMeshLineLandscape = new THREE.Mesh(meshLineLandscape.geometry, matMeshLineLandscape);
    // meshAllLines.add(meshMeshLineLandscape);

    const meshAllLines = new THREE.LineSegments(geoLineLandscape, matOrbit);
    meshAllLines.scale.set(FIELD_WIDTH, 0.5, 8);
    meshAllLines.position.set(-FIELD_WIDTH / 2, -0.5, 2);
    meshAllLines.rotation.x = 0.1;
    meshAllLines.rotation.y = 0.03;
    if (useLines) {
      this._scene.add(meshAllLines);
    }
  }

  private createOrbitLine(
    radius: number,
    resolution: number,
    material: THREE.LineBasicMaterial | THREE.LineDashedMaterial
  ): THREE.Line {
    const geometry = new THREE.Geometry();
    for (let i = 0; i <= resolution; i++) {
      const radian = (i / resolution) * Math.PI * 2;
      geometry.vertices.push(
        new THREE.Vector3(
          radius * Math.cos(radian),
          radius * Math.sin(radian),
          0
        )
      );
    }

    const line = new THREE.Line(geometry, material as any);
    if (material instanceof THREE.LineDashedMaterial) {
      line.computeLineDistances();
    }
    return line;
  }

  private async _setupLights(): Promise<void> {
    LightSetup.loadAndReplaceLightSetup(
      "assets/lightsetup.json",
      this._scene,
      this._renderer
    );
  }
  public update(): void {
    const now = Date.now();
    const deltaT = now - this._lastUpdateTime;
    for (const orbit of this._orbits) {
      orbit.lineObject.rotation.z +=
        (deltaT * orbit.speed * Math.PI) / 2 / 1000;
    }
    this._lastUpdateTime = now;

    if (this._matLandscape) {
      this._matLandscape.uniforms["time"].value =
        (0.005 * (Date.now() - this._startTime)) / 1000;
    }
  }
}
