import * as React from "react";

import { Scrollbars } from "react-custom-scrollbars";

import styled from "styled-components";

import { Colors } from "../artwork";

export const UnitEntryContainer = styled.div`
  padding: 10px 20px;
`;

interface IUnitEntryImageProps {
  url: string;
}
export const UnitEntryImage = styled.div<IUnitEntryImageProps>`
// max-width: 200px;
// height: 150px;
// background: url(${props => "data/img/" + props.url});
// background-size: contain;
// background-repeat: no-repeat;
// float: right;
padding: 0px 0 00px 20px;
`;

export const UnitEntryContent = styled.div`
  text-align: justify;
  padding: 10px 20px;
`;

export const NewsEntryContent = styled.div`
  text-align: justify;
  padding: 10px 20px;
  display: flex;
`;

export const UnitEntryCaption = styled.div`
  border-bottom: 1px solid ${Colors.CaptionUnderlineColor};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
`;

export const UnitEntryCaptionText = styled.div`
  font-size: 1.5em;
  &::first-letter {
    color: ${Colors.HighlightColor};
    font-weight: bold;
  }
`;

export const UnitEntryCaptionDate = styled.div`
  color: ${Colors.LightTextColor};
  font-size: 0.9em;
`;

export const ScrollComponent: React.SFC<IScrollComponentProps> = props => (
  <Scrollbars
    style={{
      padding: "20px",
      height: "calc(100% - 57px - 100px)",
      width: "100%"
    }}
  >
    {props.children}
  </Scrollbars>
);

ScrollComponent.displayName = "ScrollComponent";

export default ScrollComponent;

export interface IScrollComponentProps { }
