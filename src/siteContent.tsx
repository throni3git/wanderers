import * as React from "react";
import { SiteMenu, MenuEntryNames } from "./SiteMenu";
import { ContactTile } from "./content/contactTile";
import { GalleryTile } from "./content/galleryTile";
import { InfoTile } from "./content/infoTile";
import { LinksTile } from "./content/linksTile";
import { LiveTile } from "./content/liveTile";
import { NewsTile } from "./content/newsTile";

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
        return <ContactTile>Contact</ContactTile>;
      }
      case MenuEntryNames.Gallery: {
        return <GalleryTile>Gallery</GalleryTile>;
      }
      case MenuEntryNames.Info: {
        return <InfoTile>Info</InfoTile>;
      }
      case MenuEntryNames.Links: {
        return <LinksTile>Links</LinksTile>;
      }
      case MenuEntryNames.Live: {
        return <LiveTile>Live</LiveTile>;
      }
      case MenuEntryNames.News: {
        return <NewsTile>News</NewsTile>;
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
