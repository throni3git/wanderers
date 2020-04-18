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
	isWebGLAvailable: boolean;
	show3DArtwork: boolean;
}

export type Subscriber = () => void;

const isWebGLAvailable = detectWebGL();
// const isWebGLAvailable = false;
const show3DArtwork =
	isWebGLAvailable && screen.width > 640 && screen.height > 640;
// const show3DArtwork = false

let currentState: State = {
	contact: INITIAL_CONTACT,
	isWebGLAvailable,
	show3DArtwork
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

// export const changeState = (cb: (currentState: State) => void) => {
// 	currentState = produce(currentState, cb);

// 	update();
// };

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
