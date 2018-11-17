import * as React from "react";

import { Scrollbars } from "react-custom-scrollbars";

import styled from "styled-components";

import { Colors, BORDER } from "../constants";

export const UnitEntryContainer = styled.div`
	padding: 10px 20px;
`;

export const UnitEntryImageContainer = styled.div`
	/* padding-left: 20px; */
	line-height: 0;
	flex: 1;
`;

export const UnitEntryImage = styled.img`
	width: 100%;
	/* max-height: 100%; */
`;

export const UnitEntryContent = styled.div`
	text-align: justify;
	padding: 10px 20px;
`;

export const NewsEntryContent = styled.div`
	text-align: justify;
	padding: 10px 20px;
	display: flex;
	& > * {
		padding-left: 20px;
	}
	& > :first-child {
		padding-left: 0;
		/* background: red; */
	}
`;

export const UnitEntryCaption = styled.div`
	border-bottom: ${BORDER + "px"} solid ${Colors.CaptionUnderlineColor};
	display: flex;
	justify-content: space-between;
	align-items: center;
	/* padding: 10px 20px; */
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

export interface IScrollComponentProps {}
