import * as React from "react";

import { Scrollbars } from 'react-custom-scrollbars';

import styled from "../../node_modules/styled-components";

import { Colors } from "../artwork";

export const UnitEntryContainer = styled.div`
padding: 20px;
`;

export const UnitEntryText = styled.div`
padding: 20px;
`;

export const UnitEntryCaption = styled.div`
border-bottom: 1px solid ${Colors.CaptionUnderlineColor};
display: flex;
justify-content:space-between;
align-items: center;
padding: 20px;
`;

export const UnitEntryCaptionText = styled.div`
font-size: 1.5em;
&::first-letter {
color: ${Colors.HighlightColor};
font-weight: bold;
}
`;

export const UnitEntryCaptionDate = styled.div`
font-size: 0.8em;
`;


export const ScrollComponent: React.SFC<IScrollComponentProps> = props => (
  <Scrollbars style={{
    padding: "20px",
    height: "calc(100% - 57px - 100px)",
    width: "100%"
  }}>
    {props.children}
  </Scrollbars>
);

ScrollComponent.displayName = "ScrollComponent";

export default ScrollComponent;

export interface IScrollComponentProps { }