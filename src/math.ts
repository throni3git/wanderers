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
