import * as THREE from "three";

import {
	displacmentVertexShader,
	displacmentFragmentShader
} from "./shaders/landscapeShader";

import { loadTexture } from "./utils";
import * as Store from "./store"

const sunSize = 1.5;
const orbitSize = sunSize * 0.98;
const orbitResolution = 256;
const orbitFactor = 1.16;
const extraOrbitSize = 0.17;
const planetSize = 0.08;
const extraPlanetSize = 0.03;

interface IOrbit {
	speed: number;
	lineObject: THREE.Object3D;
}

export class Artwork {
	private _orbits: IOrbit[] = [];
	private _lastUpdateTime = Date.now();
	private _startTime = Date.now();
	private _matLandscape: THREE.ShaderMaterial;
	private _textures: Record<string, THREE.Texture> = {};
	private _scene: THREE.Scene;

	constructor(scene: THREE.Scene) {
		this._scene = scene;
		this._loadAssets();
	}

	private async _loadAssets(): Promise<void> {
		const texturePromises = [
			loadTexture("assets/sun/sun_map.jpg"),
			loadTexture("assets/sun/sun_alpha.jpg")
		];
		const textureRessources = await Promise.all(texturePromises);
		for (const tr of textureRessources) {
			this._textures[tr.name] = tr.texture;
		}

		this._setupScene();
	}

	private async _setupScene(): Promise<void> {
		// add sun
		const texMapSun = this._textures["assets/sun/sun_map.jpg"];
		const texAlphaSun = this._textures["assets/sun/sun_alpha.jpg"];
		const geoSun = new THREE.PlaneGeometry(2 * sunSize, 2 * sunSize);
		const matSun = new THREE.MeshBasicMaterial({
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
		this._orbits.push({
			speed: -outerOrbitSpeed,
			lineObject: outerMoonOrbit
		});
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
		const meshOuterExtraPlanet = new THREE.Mesh(
			geoOuterExtraPlanet,
			matPlanet
		);
		meshOuterExtraPlanet.position.y = extraOrbitSize;
		outerMoonSupport.add(meshOuterExtraPlanet);

		// create wobbling landscape
		// first, try example from https://www.clicktorelease.com/blog/vertex-displacement-noise-3d-webgl-glsl-three-js/
		this._matLandscape = new THREE.ShaderMaterial({
			uniforms: {
				time: { value: 0.0 },
				vpw: { value: 100.0 },
				vph: { value: 100.0 },
				offset: { value: new THREE.Vector2(0, 0.0) },
				pitch: { value: new THREE.Vector2(50, 50) },
				lineWidth: { value: 0.02 },
				lineDistance: { value: 0.1 }
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
		this._scene.add(meshLandscape);
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

		const line = new THREE.Line(geometry, material);
		if (material instanceof THREE.LineDashedMaterial) {
			line.computeLineDistances();
		}
		return line;
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
				(0.004 * (Date.now() - this._startTime)) / 1000;
		}
	}
}
