import * as React from "react";

export class Gallery extends React.Component <IGalleryProps, IGalleryState> {
   constructor(props: IGalleryProps) {
     super(props);
  }

  public render() {
    return (
      <div>
      </div>
    );
  }
}

export default Gallery;

 export interface IGalleryProps {}

 interface IGalleryState {

  images; //: this.props.images,
  thumbnails; //: [],
  lightboxIsOpen: boolean; //: this.props.isOpen,
  currentImage; //: this.props.currentImage,
  containerWidth: number; //: 0
 }

