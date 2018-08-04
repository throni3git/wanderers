import * as React from "react";
import styled from "styled-components";

import { SceneManager } from "./sceneManager";

const ArtworkContainer = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
`;

const SiteContainer = styled.div`
  width: 600px;
  height: 100%;
  position: absolute;
  background: rgba(255, 255, 255, 0.6);
  // display: table;
  margin: 0 auto;
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
    return <div style={{width: "100%"}}>
      <ArtworkContainer innerRef={ref => (this._baseElement = ref)} />
      {!this._hideSite && <SiteContainer>BLABLABLA</SiteContainer>}
    </div>;
  }
}

export default Container;

export interface ICanvasProps { }

interface ICanvasState { }
