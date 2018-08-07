import * as React from "react";
import styled from "styled-components";
import { Colors } from "./artwork";

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
    return (
      <MenuContainer>
        <MenuEntry>News</MenuEntry>
        <MenuEntry>Info</MenuEntry>
        <MenuEntry>Gallery</MenuEntry>
        <MenuEntry>Live</MenuEntry>
        <MenuEntry>Contact</MenuEntry>
        <MenuEntry>Links</MenuEntry>
      </MenuContainer>
    );
  }
}

export default SiteMenu;

export interface ISiteMenuProps { }

interface ISiteMenuState { }
