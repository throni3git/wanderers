import * as React from "react";

export class LinksTile extends React.Component <ILinksTileProps, ILinksTileState> {
   constructor(props: LinksTile["props"]) {
     super(props);
  }

  public render() {
    return (
      <div>
        LinksTile
      </div>
    );
  }
}

export default LinksTile;

 export interface ILinksTileProps {}

 interface ILinksTileState {}
