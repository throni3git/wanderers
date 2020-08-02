import { DBG_CONTACT_TILE } from "./urlParams";

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

if (DBG_CONTACT_TILE) {
	INITIAL_CONTACT.name = "Test";
	INITIAL_CONTACT.mail = "throni3@gmx.de";
	INITIAL_CONTACT.message = "Wir testen und wir testen";
	INITIAL_CONTACT.acceptsDSGVO = true;
	INITIAL_CONTACT.isHuman = true;
}

export interface State {
	contact: IContact;
	artwork: IArtwork;
}

export type Subscriber = () => void;

const isWebGLAvailable = detectWebGL();
// const isWebGLAvailable = false;
const show3DArtwork =
	isWebGLAvailable && screen.width > 640 && screen.height > 640;
// const show3DArtwork = false

let currentState: State = {
	contact: INITIAL_CONTACT,
	artwork: {
		isWebGLAvailable,
		show3DArtwork,
		timesContextLost: 0
	}
};

const subscribers: Subscriber[] = [];

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
