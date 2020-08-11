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
	overflow: hidden;
`;

const SiteContainer = styled.div`
	width: 900px;
	height: 95vh;
	background: ${Colors.Background};
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
	background-position: center;
	background-repeat: no-repeat;
	height: 8vh;
	background-size: contain;
	margin: 3vh 3vw;
`;

const AllContainer = styled.div`
	width: 100%;
	height: 100%;
	background-size: cover;
	background-position: center;
`;

const GlobalStyle = createGlobalStyle`
* {
	box-sizing: border-box;
	font-family: sans-serif;
}

html, body {
	color: ${Colors.DefaultTextColor};
	background-color: ${Colors.LoadingBackground};
	width: 100%;
	height: 100%;
	margin: 0;
	padding: 0;
}

a {
	color: ${Colors.LinkColor};
	&:hover {
		color: ${Colors.LinkHoverColor};
	}
}

li {
  padding: 3px 0;
}
`;

export class Container extends React.Component<ICanvasProps, ICanvasState> {
	private _baseElement?: HTMLDivElement;
	private _sceneManager?: SceneManager;
	private _hideSite = false;

	constructor(props: Container["props"]) {
		super(props);

		this._hideSite = Store.getState().debug.hideSite;

		this.state = { initialPage: Store.getState().debug.startupTile };

		Store.subscribe(() => this.setState({}));
	}

	public componentDidMount() {
		if (Store.getState().artwork.show3DArtwork) {
			this._sceneManager = new SceneManager(this._baseElement!);
		}
	}

	public render() {
		const show3DArtwork = Store.getState().artwork.show3DArtwork;
		const useLightTheme = Store.getState().artwork.useLightTheme;
		const backgroundUrlFallback = useLightTheme
			? "bg_fallback_light.jpg"
			: "bg_fallback_dark.jpg";
		const backgroundUrl3D = useLightTheme
			? "bg_grain_light.jpg"
			: "bg_grain_dark.jpg";
		const bgImage = show3DArtwork ? backgroundUrl3D : backgroundUrlFallback;
		const bgUrl = "url(assets/" + bgImage + ")";
		const logoUrl = "url(" + Colors.HeadingLogoUrl + ")";

		return (
			<AllContainer style={{ backgroundImage: bgUrl }}>
				{show3DArtwork && (
					<ArtworkContainer
						ref={(ref) => (this._baseElement = ref!)}
					/>
				)}
				{!this._hideSite && (
					<SiteContainer>
						<SiteHeading style={{ backgroundImage: logoUrl }} />
						<SiteContent initialPage={this.state.initialPage} />
					</SiteContainer>
				)}
				<GlobalStyle />
			</AllContainer>
		);
	}
}

export interface ICanvasProps {}

interface ICanvasState {
	initialPage: string;
}
