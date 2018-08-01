import * as THREE from "three";

function polarToCartRad(
  azimuthRad: number,
  elevationRad: number,
  radius: number = 1
): THREE.Vector3 {
  const result = {
    x: Math.sin(azimuthRad) * Math.cos(elevationRad) * radius,
    y: Math.sin(elevationRad) * radius,
    z: Math.cos(azimuthRad) * Math.cos(elevationRad) * radius
  } as THREE.Vector3;

  return result;
}

function polarToCartDeg(
  azimuthDeg: number,
  elevationDeg: number,
  radius: number
): THREE.Vector3 {
  return polarToCartRad(
    (azimuthDeg / 180) * Math.PI,
    (elevationDeg / 180) * Math.PI,
    radius
  );
}

function cartToPolarRad(
  direction: THREE.Vector3
): { azimuth: number; elevation: number; radius: number } {
  const length = Math.sqrt(
    direction.x * direction.x +
      direction.y * direction.y +
      direction.z * direction.z
  );
  if (length === 0) {
    return {
      azimuth: 0,
      elevation: 0,
      radius: 0
    };
  }
  const normDir = {
    x: direction.x / length,
    y: direction.y / length,
    z: direction.z / length
  };
  const xzLength =
    Math.sqrt(normDir.x * normDir.x + normDir.z * normDir.z) + 1e-8;
  const elevation = Math.asin(normDir.y);
  const azimuth = Math.atan2(normDir.x, normDir.z);

  return {
    azimuth: azimuth,
    elevation: elevation,
    radius: length
  };
}

function cartToPolarDeg(
  direction: THREE.Vector3
): { azimuth: number; elevation: number; radius: number } {
  const resultRad = cartToPolarRad(direction);
  const resultDeg = {
    azimuth: (resultRad.azimuth * 180) / Math.PI,
    elevation: (resultRad.elevation * 180) / Math.PI,
    radius: resultRad.radius
  };
  return resultDeg;
}

async function getLightDescription(url: string): Promise<ILightSetup> {
  const promise = new Promise<ILightSetup>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    xhr.onreadystatechange = (bla: Event) => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        const parsed = xhr.response as ILightSetup;
        resolve(parsed);
      }
    };
    xhr.open("GET", url);
    xhr.send();
  });
  return promise;
}

const DEBUG = true;

export type LightType =
  | "AmbientLight"
  | "DirectionalLight"
  | "SpotLight"
  | "PointLight"
  | "HemisphereLight";

export interface ILightDescription {
  Type: LightType;

  // positioning
  PositionCartesian: { X: number; Y: number; Z: number };
  PositionPolarDeg: { Azimuth: number; Elevation: number; Radius: number };
  PositionPolarRad: { Azimuth: number; Elevation: number; Radius: number };

  // color
  Intensity: number; // 0..1
  ColorHex: string; // e.g. "#ffffff" for white

  // extra options for specific types
  SpotLightLooktAt?: THREE.Vector3;
  SpotLightAngleDeg: number;
  SpotLightPenumbra: number;
  HemisphereLightColorGroundHex: string;

  // shadow camera options
  IsCastingShadow: boolean;
  ShadowCameraNearClipping: number;
  ShadowCameraFarClipping: number;
  ShadowCameraOrthographicLeft: number;
  ShadowCameraOrthographicRight: number;
  ShadowCameraOrthographicTop: number;
  ShadowCameraOrthographicBottom: number;
  ShadowBias: number;
}

export interface ILightSetup {
  [key: string]: ILightDescription;
}

export interface ILightSetupOptions {
  // show helpers
  DEBUG?: boolean;

  // print infos to console
  verbose?: boolean;
}

export async function loadAndReplaceLightSetup(
  url: string,
  scene: THREE.Scene,
  renderer: THREE.WebGLRenderer,
  options?: ILightSetupOptions
): Promise<void> {
  try {
    const lightSetup = await getLightDescription(url);
    replaceLightSetup(lightSetup, scene, renderer, options);
  } catch (e) {
    console.warn("LightSetup: file " + url + " could not be loaded.");
  }
}

let helpers: THREE.Object3D[];
const HELPER_SCALE = 2;

export function replaceLightSetup(
  lightSetup: ILightSetup,
  scene: THREE.Scene,
  renderer: THREE.WebGLRenderer,
  options?: ILightSetupOptions
): void {
  if (options == null) {
    options = {
      DEBUG: false,
      verbose: false
    };
  }
  // remove lights from scene
  const lightsInScene = [];
  scene.traverse((obj: THREE.Object3D) => {
    if (obj instanceof THREE.Light) {
      lightsInScene.push(obj);
    }
  });
  for (let i = 0; i < lightsInScene.length; i++) {
    if (options.verbose) {
      console.log(lightsInScene[i]);
    }
    scene.remove(lightsInScene[i]);
  }

  if (helpers != null) {
    for (let iHelpers = 0; iHelpers < helpers.length; iHelpers++) {
      scene.remove(helpers[iHelpers]);
    }
  }
  helpers = [];

  // does the scene require shadowing?
  let usesShadows = false;

  if (lightSetup == null) {
    return;
  }

  // parse lightSetup
  for (const lightKeyName in lightSetup) {
    if (lightSetup.hasOwnProperty(lightKeyName)) {
      const lightDescription = lightSetup[lightKeyName];
      let light: THREE.Light;
      let helper: THREE.Object3D;
      switch (lightDescription.Type) {
        case "AmbientLight": {
          light = new THREE.AmbientLight();
          break;
        }
        case "DirectionalLight": {
          light = new THREE.DirectionalLight();
          helper = new THREE.DirectionalLightHelper(
            light as THREE.DirectionalLight,
            HELPER_SCALE
          );
          break;
        }
        case "SpotLight": {
          light = new THREE.SpotLight();
          helper = new THREE.SpotLightHelper(light);

          if (lightDescription.SpotLightLooktAt != null) {
            console.log("todo: SpotLightLooktAt");
          }

          if (lightDescription.SpotLightAngleDeg != null) {
            (light as THREE.SpotLight).angle =
              (lightDescription.SpotLightAngleDeg * Math.PI) / 180;
          }

          if (lightDescription.SpotLightPenumbra != null) {
            (light as THREE.SpotLight).penumbra =
              lightDescription.SpotLightPenumbra;
          }
          break;
        }
        case "PointLight": {
          light = new THREE.PointLight();
          helper = new THREE.PointLightHelper(
            light as THREE.PointLight,
            HELPER_SCALE
          );
          break;
        }
        case "HemisphereLight": {
          light = new THREE.HemisphereLight(0xffffff, 0xffffff, 1);
          helper = new THREE.HemisphereLightHelper(
            light as THREE.HemisphereLight,
            HELPER_SCALE
          );

          if (lightDescription.HemisphereLightColorGroundHex != null) {
            (light as THREE.HemisphereLight).groundColor = new THREE.Color(
              lightDescription.HemisphereLightColorGroundHex
            );
          }
          break;
        }
        default: {
          console.warn(
            "applyLightSetup: " + lightDescription.Type + " not supported"
          );
          break;
        }
      }

      // in case of failure
      if (light == null) {
        continue;
      }

      light.name = lightKeyName;

      if (lightDescription.PositionCartesian != null) {
        light.position.set(
          lightDescription.PositionCartesian.X,
          lightDescription.PositionCartesian.Y,
          lightDescription.PositionCartesian.Z
        );
      }

      if (lightDescription.PositionPolarDeg != null) {
        const tPosition = polarToCartDeg(
          lightDescription.PositionPolarDeg.Azimuth,
          lightDescription.PositionPolarDeg.Elevation,
          lightDescription.PositionPolarDeg.Radius
        );
        light.position.set(tPosition.x, tPosition.y, tPosition.z);
      }

      if (lightDescription.PositionPolarRad != null) {
        const tPosition = polarToCartRad(
          lightDescription.PositionPolarRad.Azimuth,
          lightDescription.PositionPolarRad.Elevation,
          lightDescription.PositionPolarRad.Radius
        );
        light.position.set(tPosition.x, tPosition.y, tPosition.z);
      }

      if (lightDescription.ColorHex != null) {
        light.color = new THREE.Color(lightDescription.ColorHex);
      }

      if (lightDescription.Intensity != null) {
        light.intensity = lightDescription.Intensity;
      }

      if (lightDescription.IsCastingShadow != null) {
        light.castShadow = lightDescription.IsCastingShadow;
        light.shadow.bias = 0.001;

        if (lightDescription.ShadowBias != null) {
          light.shadow.bias = lightDescription.ShadowBias;
        }

        (light.shadow.camera as
          | THREE.OrthographicCamera
          | THREE.PerspectiveCamera).updateProjectionMatrix();

        if (usesShadows) {
          console.warn(
            "applyLightSetup: more than one light to cast shadows, using only the first one"
          );
        }

        usesShadows = true;
      }

      if (light != null) {
        scene.add(light);
        light.updateMatrixWorld(false);

        if (helper != null && options.DEBUG === true) {
          (helper as
            | THREE.DirectionalLightHelper
            | THREE.PointLightHelper
            | THREE.SpotLightHelper).update();
          scene.add(helper);
          helpers.push(helper);
        }

        if (options.verbose) {
          console.log(light);
        }
      }
    }
  }

  //if (usesShadows) {
  renderer.shadowMap.needsUpdate = true;
  //}

  // apply to materials
  scene.traverse((obj: THREE.Object3D) => {
    if (obj instanceof THREE.Mesh) {
      if (obj.material instanceof THREE.Material) {
        if (obj.receiveShadow === true) {
          obj.material.needsUpdate = true;
        }
      }
    }
  });
}
