import * as ReactDOM from "react-dom";
import * as React from "react";
import { injectGlobal } from "styled-components";

import { Container } from "./container";
import { Colors } from "./artwork";

const body = document.getElementsByTagName("body")[0];

const content = document.createElement("div");
content.style.width = "100%";
content.style.height = "100%";
content.style.overflow = "hidden";

body.appendChild(content);

injectGlobal`
* {
	box-sizing: border-box;
}

html, body {
	width: 100%;
	height: 100%;
	margin: 0;
	padding: 0;
	color: ${Colors.DefaultTextColor};
	font-family: sans-serif;
}

a {
	color: ${Colors.LinkColor};
	&:hover {
		color: ${Colors.LinkHoverColor};
	}
}
`;

ReactDOM.render(React.createElement(Container), content);
