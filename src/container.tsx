import * as React from "react";
import styled from "styled-components";
import { createGlobalStyle } from "styled-components";

import { SceneManager } from "./sceneManager";
import { SiteContent } from "./siteContent";

import { Colors, BORDER_RADIUS } from "./constants";

import * as Store from "./store";

const ArtworkContainer = styled.div`
	width: 100%;
	height: 100%;
	position: absolute;
	background: url(assets/white/grain.jpg);
	background-size: cover;
	background-position: center;
	overflow: hidden;
`;

const SiteContainer = styled.div`
	width: 900px;
	height: 95vh;
	background: rgba(255, 255, 255, 0.9);
	overflow: hidden;
	box-shadow: ${Colors.ShadowColor} 0 0 10px;
	position: absolute;
	margin: auto;
	left: 0;
	right: 0;
	bottom: 0;
	top: 0;
	border-radius: ${BORDER_RADIUS};
`;

const SiteHeading = styled.div`
	background: url(assets/logo_heading.svg);
	background-position: center;
	background-repeat: no-repeat;
	height: 8vh;
	background-size: contain;
	margin: 3vh 3vw;
`;

const GlobalStyle = createGlobalStyle`
* {
	box-sizing: border-box;
	// TODO this overwrites too much (arrows in gallery)
	// color: ${Colors.DefaultTextColor};
	font-family: sans-serif;
}

html, body {
	// color: ${Colors.DefaultTextColor};
	width: 100%;
	height: 100%;
	margin: 0;
	padding: 0;
}

div, span {
	/* color: ${Colors.DefaultTextColor}; */
}

a {
	color: ${Colors.DefaultTextColor};
	&:hover {
		color: ${Colors.LinkHoverColor};
	}
}

li {
  padding: 3px 0;
}
`;

const ArtworkImage = styled.div`
	width: 100%;
	height: 100%;
	position: absolute;
	background: url(assets/bg_white_cover.jpg);
	background-size: cover;
	background-position: center;
	overflow: hidden;
`;

export class Container extends React.Component<ICanvasProps, ICanvasState> {
	private _baseElement: HTMLDivElement;
	private _sceneManager: SceneManager;
	private _hideSite = false;

	constructor(props: Container["props"]) {
		super(props);

		this._hideSite = Store.getState().debug.hideSite;

		this.state = { initialPage: Store.getState().debug.startupTile };

		Store.subscribe(() => this.setState({}));
	}

	public componentDidMount() {
		if (Store.getState().artwork.show3DArtwork) {
			this._sceneManager = new SceneManager(this._baseElement);
		}
	}

	public render() {
		const show3DArtwork = Store.getState().artwork.show3DArtwork;
		return (
			<div style={{ width: "100%" }}>
				{show3DArtwork && (
					<ArtworkContainer
						ref={(ref) => (this._baseElement = ref)}
					/>
				)}
				{!show3DArtwork && <ArtworkImage />}
				{!this._hideSite && (
					<SiteContainer>
						<SiteHeading />
						<SiteContent initialPage={this.state.initialPage} />
					</SiteContainer>
				)}
				<GlobalStyle />
			</div>
		);
	}
}

export interface ICanvasProps {}

interface ICanvasState {
	initialPage: string;
}
