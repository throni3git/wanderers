import * as React from "react";

export class InfoTile extends React.Component <IInfoTileProps, IInfoTileState> {
   constructor(props: InfoTile["props"]) {
     super(props);
  }

  public render() {
    return (
      <div>
        InfoTile
      </div>
    );
  }
}

export default InfoTile;

 export interface IInfoTileProps {}

 interface IInfoTileState {}
