import * as React from "react";
import styled from "styled-components";

import { SceneManager } from "./sceneManager";
import { SiteContent } from "./siteContent";

const ArtworkContainer = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  background: url(assets/bg_white.jpg);
  background-size: cover;
  background-position: center;
  overflow: hidden;
`;

const SiteContainer = styled.div`
  width: 900px;
  height: 95vh;
  background: rgba(255, 255, 255, 0.7);
  overflow: hidden;
  box-shadow: #444444 0 0 10px;
  position: absolute;
  margin: auto;
  left:0;
  right:0;
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

export class Container extends React.Component<ICanvasProps, ICanvasState> {
  private _baseElement: HTMLDivElement;
  private _sceneManager: SceneManager;
  private _hideSite = true;

  constructor(props: Container["props"]) {
    super(props);

    // TODO 2018-08-04 check for browser compatibility
    const url = new URL(window.location.href);
    const showSite = url.searchParams.get("showSite");
    if (showSite != null) {
      this._hideSite = false;
    }
  }

  public componentDidMount() {
    this._sceneManager = new SceneManager(this._baseElement);
  }

  public render() {
    return <div style={{ width: "100%" }}>
      <ArtworkContainer innerRef={ref => (this._baseElement = ref)} />
      {!this._hideSite &&
        <SiteContainer>
          <SiteHeading />
          <SiteContent />
        </SiteContainer>
      }
    </div>;
  }
}

export default Container;

export interface ICanvasProps { }

interface ICanvasState { }
