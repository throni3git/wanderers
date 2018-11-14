/**
 * utilities
 * @author Thomas Thron
 */

/**
 * helper to yield a json with a specific format
 * @param url file location
 */

export async function loadJsonFile<T>(url: string): Promise<T> {
	const promise = new Promise<T>((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.responseType = "json";
		xhr.onreadystatechange = (bla: Event) => {
			if (xhr.readyState === 4 && xhr.status === 200) {
				const parsed = xhr.response as T;
				resolve(parsed);
			}
		};
		xhr.onerror = () => reject(xhr.statusText);
		xhr.open("GET", url);
		xhr.send();
	});
	return promise;
}

/** general json file typing needed since the info/news/... entries must be the value of a key */
export interface IJsonFile<T> {
	entries: T[];
}

/** typing for a universal section with a caption */
export interface IHeadedParagraphSection {
	caption: string;
	paragraphs: string[];
	htmlTag?: string;
	outerHtmlTag?: string;
}

function openHtmlTag(tagName: string): string {
	return "<" + tagName + ">";
}

function closeHtmlTag(tagName: string): string {
	return "</" + tagName + ">";
}

/** joins string snippets to HTML <ul> elements */
export function joinParagraphs(
	paragraphs: string[],
	htmlTag: string = "p",
	outerHtmlTag?: string
): string {
	const middle = paragraphs
		.map(para => openHtmlTag(htmlTag) + para + closeHtmlTag(htmlTag))
		.join("");
	if (!outerHtmlTag) return middle;
	const tagOpen = openHtmlTag(outerHtmlTag);
	const tagClose = closeHtmlTag(outerHtmlTag);
	return tagOpen + middle + tagClose;
}

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
