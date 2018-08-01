import * as THREE from "three";

/**
 * clamps input number to min and max
 * @param input value to clamp
 * @param min
 * @param max
 */
export function clamp(input: number, min: number, max: number): number {
  if (min > max) {
    console.warn("MathUtils.clamp: min(" + min + ") > max(" + max + ")");
    const tmp = max;
    max = min;
    min = tmp;
  }
  return Math.min(Math.max(input, min), max);
}

/**
 * converts azimuth (-pi...pi) and elevation (-pi/2...pi/2) to direction vector
 * @param azimuthRad angle from z-axis around y-axis (0 means from front)
 * @param elevationRad angle from z-axis around x-axis (0 means y=0)
 * @param radius radius of polar coordinate (default 1)
 */
export function polarToCartRad(
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

/**
 * converts azimuth (-180...180) and elevation (-90...90) to direction vector
 * @param azimuthRad angle from z-axis around y-axis (0 means from front)
 * @param elevationRad angle from z-axis around x-axis (0 means y=0)
 * @param radius radius of polar coordinate (default 1)
 */
export function polarToCartDeg(
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

/**
 * converts direction vector to azimuth (-180...180) and elevation (-90...90)
 * @param azimuthRad angle from z-axis around y-axis (0 means from front)
 * @param elevationRad angle from z-axis around x-axis (0 means y=0)
 * @param radius radius of polar coordinate (default 1)
 */
export function cartToPolarRad(
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

/**
 * converts direction vector to azimuth (-pi...pi) and elevation (-pi/2...pi/2)
 * @param azimuthRad angle from z-axis around y-axis (0 means from front)
 * @param elevationRad angle from z-axis around x-axis (0 means y=0)
 * @param radius radius of polar coordinate (default 1)
 */
export function cartToPolarDeg(
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
