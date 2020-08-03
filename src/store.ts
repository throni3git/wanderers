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

// Url Parameter handling
const url = new URL(window.location.href);
const paramDebugCamera = url.searchParams.get("debugCamera") != null;
const paramDebugOrbiting = url.searchParams.get("debugOrbiting") != null;
const paramDebugContact = url.searchParams.get("debugContact") != null;
const paramHideSite = url.searchParams.get("hideSite") != null;
const paramStartupTile = url.searchParams.get("startupTile") || "News";
const paramDarkTheme = url.searchParams.get("dark") != null;
const paramLightTheme = url.searchParams.get("light") != null;

export const INITIAL_CONTACT: IContact = {
	mail: "",
	name: "",
	acceptsDSGVO: false,
	isHuman: false,
	message: "",
	sendCopy: true
};

if (paramDebugContact && !IS_PRODUCTION) {
	INITIAL_CONTACT.name = "Test";
	INITIAL_CONTACT.mail = "throni3@gmx.de";
	INITIAL_CONTACT.message = "Wir testen und wir testen";
	INITIAL_CONTACT.acceptsDSGVO = true;
	INITIAL_CONTACT.isHuman = true;
}

const isWebGLAvailable = detectWebGL();
// const isWebGLAvailable = false;
let show3DArtwork =
	isWebGLAvailable && screen.width > 640 && screen.height > 640;
// show3DArtwork = false;
// show3DArtwork = true;

const hours = new Date().getHours();
let isDayTime = hours >= 8 && hours <= 20;
let useLightTheme = isDayTime && !paramDarkTheme;
useLightTheme = useLightTheme || paramLightTheme;

let currentState: State = {
	contact: INITIAL_CONTACT,
	artwork: {
		isWebGLAvailable,
		show3DArtwork,
		timesContextLost: 0,
		useLightTheme
	},
	debug: {
		debugCamera: paramDebugCamera,
		debugOrbiting: paramDebugOrbiting,
		debugContact: paramDebugContact,
		hideSite: paramHideSite,
		startupTile: paramStartupTile
	}
};

// Subscription
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

// Getter and Setters
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
