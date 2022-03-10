import * as ReactDOM from "react-dom";
import * as React from "react";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
	faArrowLeft,
	faArrowRight,
	faTimes
} from "@fortawesome/free-solid-svg-icons";
import {
	faBandcamp,
	faDeezer,
	faFacebook,
	faInstagram,
	faSpotify,
	faYoutube
} from "@fortawesome/free-brands-svg-icons";

library.add(
	faBandcamp,
	faDeezer,
	faFacebook,
	faInstagram,
	faSpotify,
	faYoutube
);
library.add(faArrowLeft, faArrowRight, faTimes);

import { Container } from "./container";

declare var BUILD_TIMESTAMP: string;
console.log("SOJUS3000 Wanderers Homepage " + BUILD_TIMESTAMP);

declare var IS_PRODUCTION: boolean;
if (!IS_PRODUCTION) {
	console.log("Development mode");
}

const content = document.createElement("div");
content.style.width = "100%";
content.style.height = "100%";
content.style.overflow = "hidden";

const body = document.getElementsByTagName("body")[0];
body.appendChild(content);

ReactDOM.render(React.createElement(Container), content);
