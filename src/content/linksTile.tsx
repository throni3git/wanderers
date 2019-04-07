import * as React from "react";

import styled from "styled-components";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { loadJsonFile, IJsonFile } from "../utils";

import {
	UnitEntryContainer,
	UnitEntryCaption,
	UnitEntryCaptionText,
	ScrollComponent
} from "./tileComponents";
import { allTsxLogos } from "./logos";
import { Colors } from "../constants";

const LinkPatchTwoColumns = styled.div`
	width: 50%;
	height: 80px;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const LinkPatchAllInARow = styled.div`
	width: 80px;
	height: 80px;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const LinkSection = styled.div`
	display: flex;
	flex-wrap: wrap;
	padding-top: 10px;
	justify-content: space-evenly;
`;

const LinkIcon = styled.span`
	font-size: 40px;
	line-height: 0;
	margin: 0 10px;
	cursor: pointer;
	& > * {
		height: 50px;
	}
	& > svg{
		fill: ${Colors.DefaultTextColor}
	}
	&:hover > svg{
		fill: ${Colors.LinkHoverColor}
	}
`;

interface ILinkEntry {
	url: string;
	name: string;
	logoUrl?: string;
	logoFontawesomeTag?: [string, string];
	logoTsxName?: string;
}

interface ILinksSection {
	caption: string;
	linkEntries: ILinkEntry[];
	onlyDisplayLogos?: boolean;
}

let linksFilePromise: Promise<IJsonFile<ILinksSection>>;
try {
	linksFilePromise = loadJsonFile<IJsonFile<ILinksSection>>(
		"data/links.json"
	);
} catch (e) {
	console.log(e);
}

export class LinksTile extends React.Component<
	ILinksTileProps,
	ILinksTileState
> {
	constructor(props: LinksTile["props"]) {
		super(props);
		this.state = {
			content: []
		};

		linksFilePromise.then(jsonFile => {
			console.log(jsonFile);
			this.setState({ content: jsonFile.entries });
		});
	}

	private renderLinkEntryWithName = (
		linkEntry: ILinkEntry,
		index: number
	): JSX.Element => {
		return (
			<LinkPatchTwoColumns key={index}>
				{linkEntry.logoUrl && (
					<a href={linkEntry.url} target="_blank">
						<LinkIcon>
							<img src={linkEntry.logoUrl} />
						</LinkIcon>
					</a>
				)}
				{linkEntry.logoFontawesomeTag && (
					<a href={linkEntry.url} target="_blank">
						<LinkIcon>
							<FontAwesomeIcon
								icon={
									[
										linkEntry.logoFontawesomeTag[0],
										linkEntry.logoFontawesomeTag[1]
									] as any
								}
							/>
						</LinkIcon>
					</a>
				)}
				<a href={linkEntry.url} target="_blank">
					<span>{linkEntry.name}</span>
				</a>
			</LinkPatchTwoColumns>
		);
	};

	private renderLinkEntryOnlyLogo = (
		linkEntry: ILinkEntry,
		index: number
	): JSX.Element => {
		return (
			<LinkPatchAllInARow key={index}>
				{linkEntry.logoUrl && (
					<a href={linkEntry.url} target="_blank">
						<LinkIcon>
							<img src={linkEntry.logoUrl} />
						</LinkIcon>
					</a>
				)}
				{linkEntry.logoTsxName && (
					<a href={linkEntry.url} target="_blank">
						<LinkIcon>
							{allTsxLogos[linkEntry.logoTsxName]
								? allTsxLogos[linkEntry.logoTsxName]
								: null}
						</LinkIcon>
					</a>
				)}
				{linkEntry.logoFontawesomeTag && (
					<a href={linkEntry.url} target="_blank">
						<LinkIcon>
							<FontAwesomeIcon
								icon={
									[
										linkEntry.logoFontawesomeTag[0],
										linkEntry.logoFontawesomeTag[1]
									] as any
								}
							/>
						</LinkIcon>
					</a>
				)}
			</LinkPatchAllInARow>
		);
	};

	private renderLinksSection = (
		linksSection: ILinksSection,
		index: number
	): JSX.Element => {
		return (
			<UnitEntryContainer key={index}>
				<UnitEntryCaption>
					<UnitEntryCaptionText>
						{linksSection.caption}
					</UnitEntryCaptionText>
				</UnitEntryCaption>
				<LinkSection>
					{linksSection.onlyDisplayLogos &&
						linksSection.linkEntries.map(
							this.renderLinkEntryOnlyLogo
						)}
					{!linksSection.onlyDisplayLogos &&
						linksSection.linkEntries.map(
							this.renderLinkEntryWithName
						)}
				</LinkSection>
			</UnitEntryContainer>
		);
	};

	public render() {
		return (
			<ScrollComponent>
				{this.state.content.map(this.renderLinksSection)}
			</ScrollComponent>
		);
	}
}

export interface ILinksTileProps {}

interface ILinksTileState {
	content: ILinksSection[];
}
