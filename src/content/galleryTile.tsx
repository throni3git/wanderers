import * as React from "react";

export class GalleryTile extends React.Component <IGalleryTileProps, IGalleryTileState> {
   constructor(props: GalleryTile["props"]) {
     super(props);
  }

  public render() {
    return (
      <div>
        GalleryTile
      </div>
    );
  }
}

export default GalleryTile;

 export interface IGalleryTileProps {}

 interface IGalleryTileState {}
