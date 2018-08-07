import * as React from "react";
import styled from "styled-components";
import { Colors } from "./artwork";

export const MenuEntryNames = ["News", "Gallery", "Info", "Live", "Contact", "Links"]

const MenuEntry = styled.span`
font-size: 2em;
font-weight: bold;
cursor: pointer;
&:hover {
  color: ${Colors.LinkHoverColor}
  // text-shadow: ${Colors.LinkShadowColor} 0 0 3px;
}
`;

const MenuContainer = styled.div`
  padding-top: 10px;
  padding-bottom: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
`;

export class SiteMenu extends React.Component<ISiteMenuProps, ISiteMenuState> {
  constructor(props: SiteMenu["props"]) {
    super(props);
  }

  public render() {
    const allContents = MenuEntryNames;
    return (
      <MenuContainer>
        {allContents.map(name => (
          <MenuEntry
            onClick={() => this.props.setActiveContent(name)}
            key={name}
            style={{color: this.props.activeContent === name ? "green" : "red"}}
          >
            {name}
          </MenuEntry>
        ))}
      </MenuContainer>
    );
  }
}

export default SiteMenu;

export interface ISiteMenuProps {
  setActiveContent: (name: string) => void;
  activeContent: string;
}

interface ISiteMenuState {}
