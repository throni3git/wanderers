import * as ReactDOM from "react-dom";
import * as React from "react";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faStroopwafel } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";

library.add(faStroopwafel);
library.add(fab);

import { Container } from "./container";

const body = document.getElementsByTagName("body")[0];

const content = document.createElement("div");
content.style.width = "100%";
content.style.height = "100%";
content.style.overflow = "hidden";

body.appendChild(content);

ReactDOM.render(React.createElement(Container), content);
