import { detectWebGL } from "./utils";

declare var IS_PRODUCTION: boolean;

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
	useLightTheme: boolean;
}

export interface IDebugging {
	debugCamera: boolean;
	debugOrbiting: boolean;
	debugContact: boolean;
	hideSite: boolean;
	startupTile: string;
}

export interface State {
	contact: IContact;
	artwork: IArtwork;
	debug: IDebugging;
}

const isWebGLAvailable = detectWebGL();
// const isWebGLAvailable = false;
let show3DArtwork =
	isWebGLAvailable && screen.width > 640 && screen.height > 640;
// show3DArtwork = false;
// show3DArtwork = true;

const url = new URL(window.location.href);
const debugCamera = url.searchParams.get("debugCamera") != null;
const debugOrbiting = url.searchParams.get("debugOrbiting") != null;
const debugContact = url.searchParams.get("debugContact") != null;
const hideSite = url.searchParams.get("hideSite") != null;
const startupTile = url.searchParams.get("startupTile") || "News";
const urlParamDarkTheme = url.searchParams.get("dark") != null;
const urlParamLightTheme = url.searchParams.get("light") != null;

export const INITIAL_CONTACT: IContact = {
	mail: "",
	name: "",
	acceptsDSGVO: false,
	isHuman: false,
	message: "",
	sendCopy: true
};

if (debugContact && !IS_PRODUCTION) {
	INITIAL_CONTACT.name = "Test";
	INITIAL_CONTACT.mail = "throni3@gmx.de";
	INITIAL_CONTACT.message = "Wir testen und wir testen";
	INITIAL_CONTACT.acceptsDSGVO = true;
	INITIAL_CONTACT.isHuman = true;
}

const now = new Date();
let useLightTheme = now.getHours() >= 8 && now.getHours() <= 20;
useLightTheme = useLightTheme && !urlParamDarkTheme;
useLightTheme = useLightTheme || urlParamLightTheme;

let currentState: State = {
	contact: INITIAL_CONTACT,
	artwork: {
		isWebGLAvailable,
		show3DArtwork,
		timesContextLost: 0,
		useLightTheme
	},
	debug: {
		debugCamera,
		debugOrbiting,
		debugContact,
		hideSite,
		startupTile
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
