import * as React from "react";
import styled from "styled-components";

import { SceneManager } from "./SceneManager";

const ContainerDiv = styled.div`
  width: 100%;
  height: 100%;
`;

export class Container extends React.Component<ICanvasProps, ICanvasState> {
  private _baseElement: HTMLDivElement;
  private _sceneManager: SceneManager;

  constructor(props: Container["props"]) {
    super(props);
  }

  public componentDidMount() {
    this._sceneManager = new SceneManager(this._baseElement);
  }

  public render() {
    return <ContainerDiv innerRef={ref => (this._baseElement = ref)} />;
  }
}

export default Container;

export interface ICanvasProps {}

interface ICanvasState {}
