import * as React from "react";
import { SiteMenu, MenuEntryNames } from "./SiteMenu";

export class SiteContent extends React.Component<
  ISiteContentProps,
  ISiteContentState
  > {
  constructor(props: SiteContent["props"]) {
    super(props);
    this.state = {
      activeContent: MenuEntryNames.News as keyof typeof MenuEntryNames
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
      case MenuEntryNames.Contact: {
        return <div>Contact</div>;
        break;
      }
      case MenuEntryNames.Gallery: {
        return <div>Gallery</div>;
        break;
      }
      case MenuEntryNames.Info: {
        return <div>Info</div>;
        break;
      }
      case MenuEntryNames.Links: {
        return <div>Links</div>;
        break;
      }
      case MenuEntryNames.Live: {
        return <div>Live</div>;
        break;
      }
      case MenuEntryNames.News: {
        return <div>News</div>;
        break;
      }
    }
    return <div></div>;
  }
}

export default SiteContent;

export interface ISiteContentProps { }

interface ISiteContentState {
  activeContent: keyof typeof MenuEntryNames;
}
