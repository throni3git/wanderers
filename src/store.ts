import { detectWebGL } from "./utils";

export interface IContact {
	mail: string;
	name: string;
	acceptsDSGVO: boolean;
	isHuman: boolean;
	message: string;
	sendCopy: boolean;
}

export interface IArtwork {
	isWebGLAvailable: boolean;
	show3DArtwork: boolean;
	timesContextLost: number;
}

export const INITIAL_CONTACT: IContact = {
	mail: "",
	name: "",
	acceptsDSGVO: false,
	isHuman: false,
	message: "",
	sendCopy: true
};

export interface State {
	contact: IContact;
	artwork: IArtwork;
}

const isWebGLAvailable = detectWebGL();
// const isWebGLAvailable = false;
const show3DArtwork =
	isWebGLAvailable && screen.width > 640 && screen.height > 640;
// const show3DArtwork = false

export let DBG_CAMERA = false;
export let DBG_ORBITING = false;
export let DBG_CONTACT_TILE = false;
export let HIDE_SITE = false;
export let STARTUP_TILE = "News";

const url = new URL(window.location.href);
const dbgCamera = url.searchParams.get("debugCamera");
if (dbgCamera != null) {
	DBG_CAMERA = true;
	console.log("DBG_CAMERA active");
}

const dbgOrbiting = url.searchParams.get("debugOrbiting");
if (dbgOrbiting != null) {
	DBG_ORBITING = true;
	console.log("DBG_ORBITING active");
}

const dbgContact = url.searchParams.get("debugContact");
if (dbgContact != null) {
	DBG_CONTACT_TILE = true;
	console.log("DBG_CONTACT_TILE active");
}

const hideSite = url.searchParams.get("hideSite");
if (hideSite != null) {
	HIDE_SITE = true;
	console.log("HIDE_SITE active");
}

const tileToBeActivated = url.searchParams.get("tile");
if (tileToBeActivated != null) {
	STARTUP_TILE = tileToBeActivated;
	console.log("STARTUP_TILE active");
}

if (DBG_CONTACT_TILE) {
	INITIAL_CONTACT.name = "Test";
	INITIAL_CONTACT.mail = "throni3@gmx.de";
	INITIAL_CONTACT.message = "Wir testen und wir testen";
	INITIAL_CONTACT.acceptsDSGVO = true;
	INITIAL_CONTACT.isHuman = true;
}

let currentState: State = {
	contact: INITIAL_CONTACT,
	artwork: {
		isWebGLAvailable,
		show3DArtwork,
		timesContextLost: 0
	}
};

/**
 * Subscription
 */
export type Subscriber = () => void;

const subscribers: Subscriber[] = [];

export const subscribe = (cb: Subscriber) => {
	subscribers.push(cb);

	return () => {
		const index = subscribers.indexOf(cb);

		if (index > -1) {
			subscribers.splice(index, 1);
		}
	};
};

const update = () => {
	for (const subscription of subscribers) {
		subscription();
	}
};

/**
 * Getter and Setters
 */
export const getState = () => currentState;

export const setState = <K extends keyof State>(key: K, value: State[K]) => {
	currentState = {
		...currentState,
		[key]: value
	};

	update();
};

export const setContactState = <K extends keyof IContact>(
	key: K,
	value: IContact[K]
) => {
	const currentContactState = getState().contact;
	setState("contact", { ...currentContactState, [key]: value });
};

export const setArtworkState = <K extends keyof IArtwork>(
	key: K,
	value: IArtwork[K]
) => {
	const currentArtworkState = getState().artwork;
	setState("artwork", { ...currentArtworkState, [key]: value });
};
