import * as React from "react";
import { SiteMenu, MenuEntryNames } from "./SiteMenu";

export class SiteContent extends React.Component<
  ISiteContentProps,
  ISiteContentState
> {
  constructor(props: SiteContent["props"]) {
    super(props);
    this.state = {
      activeContent: "News"
    };
  }

  public render() {
    return (
      <div>
        <SiteMenu
          setActiveContent={name => {
            this.setState({ activeContent: name });
          }}
          activeContent={this.state.activeContent}
        />
        <div>{this.getCurrentContent()}</div>
      </div>
    );
  }

  private getCurrentContent() {
    switch (this.state.activeContent) {
      case "Gallery": {
        return <div>GALLERY</div>;
        break;
      }
      case "Links": {
        return <div>LINKS</div>;
        break;
      }
    }
    return <div>blaaa</div>;
  }
}

export default SiteContent;

export interface ISiteContentProps {}

interface ISiteContentState {
  activeContent: string;
}
