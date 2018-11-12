import * as React from "react";
import styled from "styled-components";
import { createGlobalStyle } from "styled-components";

import { SceneManager } from "./sceneManager";
import { SiteContent } from "./siteContent";

import { Colors } from "./artwork";

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
  background: rgba(255, 255, 255, 0.86);
  overflow: hidden;
  box-shadow: #444444 0 0 10px;
  position: absolute;
  margin: auto;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
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
}

/* @font-face {
	font-family: 'genome';
	src: url("data/genome.woff") format("woff");
} */

html, body {
	width: 100%;
	height: 100%;
	margin: 0;
	padding: 0;
	color: ${Colors.DefaultTextColor};
	/* font-family: 'genome', sans-serif; */
	font-family: sans-serif;
}

a {
	color: ${Colors.LinkColor};
	&:hover {
		color: ${Colors.LinkHoverColor};
	}
}
`;

export class Container extends React.Component<ICanvasProps, ICanvasState> {
  private _baseElement: HTMLDivElement;
  private _sceneManager: SceneManager;
  private _hideSite = false;

  constructor(props: Container["props"]) {
    super(props);

    // TODO 2018-08-04 check for browser compatibility
    const url = new URL(window.location.href);
    const hideSite = url.searchParams.get("hideSite");
    if (hideSite != null) {
      this._hideSite = true;
    }
  }

  public componentDidMount() {
    this._sceneManager = new SceneManager(this._baseElement);
  }

  public render() {
    return (
      <div style={{ width: "100%" }}>
        <ArtworkContainer ref={ref => (this._baseElement = ref)} />
        {!this._hideSite && (
          <SiteContainer>
            <SiteHeading />
            <SiteContent />
          </SiteContainer>
        )}
        <GlobalStyle />
      </div>
    );
  }
}

export default Container;

export interface ICanvasProps {}

interface ICanvasState {}
