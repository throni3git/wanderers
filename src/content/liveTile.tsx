import * as React from "react";

export class LiveTile extends React.Component <ILiveTileProps, ILiveTileState> {
   constructor(props: LiveTile["props"]) {
     super(props);
  }

  public render() {
    return (
      <div>
        LiveTile
      </div>
    );
  }
}

export default LiveTile;

 export interface ILiveTileProps {}

 interface ILiveTileState {}
