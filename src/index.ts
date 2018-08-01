import * as ReactDOM from "react-dom";
import * as React from "react";
import { injectGlobal } from "styled-components";

import { Container } from "./container";

const body = document.getElementsByTagName("body")[0];

const content = document.createElement("div");
content.style.width = "100%";
content.style.height = "100%";
content.style.overflow = "hidden";

body.appendChild(content);

injectGlobal`
html, body {
	width: 100%;
	height: 100%;
	margin: 0;
	padding: 0;
}
`;

ReactDOM.render(React.createElement(Container), content);
