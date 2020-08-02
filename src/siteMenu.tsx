import * as React from "react";
import styled from "styled-components";

import { Colors } from "./constants";

export const MenuEntryNames = {
	News: "News",
	Gallery: "Gallery",
	Info: "Info",
	Live: "Live",
	Contact: "Contact",
	Links: "Links"
};

export type ActiveContentTypes = keyof typeof MenuEntryNames | "Impressum";

const LHC = Colors.LinkHoverColor;
const AMC = Colors.ActiveMenuColor;

const MenuEntry = styled.span<{ active: boolean }>`
	font-size: 2em;
	font-weight: bold;
	cursor: pointer;
	/* Set up the hover */
	/* If you aren't using autoprefix, remember to prefix the gradient for other browsers */
	background-size: 0 2px, auto;
	background-repeat: no-repeat;
	background-position: center bottom;
	transition: all 0.2s ease-out;
	&:hover {
		color: ${LHC}; /* The following line makes the underline only as wide as the text */ /* background-size: calc(100% - 2em) 2px, auto; */
		background-image: linear-gradient(${LHC}, ${LHC});
		background-size: 100% 2px, auto;
	}

	${(props) =>
		props.active &&
		`
	color: ${AMC};
	background-image: linear-gradient(${AMC}, ${AMC});
	background-size: 100% 2px, auto;
	`}
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
		const allContentNames = Object.keys(
			MenuEntryNames
		) as (keyof typeof MenuEntryNames)[];

		return (
			<MenuContainer>
				{allContentNames.map((name) => (
					<MenuEntry
						onClick={() => this.props.setActiveContent(name)}
						key={name}
						active={this.props.activeContent === name}
					>
						{name}
					</MenuEntry>
				))}
			</MenuContainer>
		);
	}
}

export interface ISiteMenuProps {
	setActiveContent: (name: ActiveContentTypes) => void;
	activeContent: ActiveContentTypes;
}

interface ISiteMenuState {}
