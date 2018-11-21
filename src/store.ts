export type State = {
	manufacturer: "Flexo" | "Bauhaus" | "Globus";
};

export type Subscriber = () => void;

let currentState: State = { manufacturer: "Flexo" };

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
