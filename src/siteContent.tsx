import * as React from "react";
import { SiteMenu } from "./SiteMenu";

export class SiteContent extends React.Component <ISiteContentProps, ISiteContentState> {
   constructor(props: SiteContent["props"]) {
     super(props);
  }

  public render() {
    return (
      <div>
        <SiteMenu />
        <div>
          </div>
      </div>
    );
  }
}

export default SiteContent;

 export interface ISiteContentProps {}

 interface ISiteContentState {}
