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