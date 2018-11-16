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

const LinkPatch = styled.div`
	width: 50%;
	height: 80px;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const LinkSection = styled.div`
	display: flex;
	flex-wrap: wrap;
`;

const LinkIcon = styled.span`
	font-size: 40px;
	line-height: 50px;
	text-align: center;
	height: 50px;
	width: 50px;
	margin: auto 10px;
	cursor: pointer;
	& > * {
		font-size: 40px;
		line-height: 50px;
		height: 50px;
		/* width: 50px; */
	}
`;

interface ILinkEntry {
	url: string;
	name: string;
	logoUrl?: string;
	logoFontawesomeTag?: [string, string];
}

export interface ILinksSection {
	caption: string;
	linkEntries: ILinkEntry[];
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

	public render() {
		return (
			<ScrollComponent>
				{this.state.content.map(
					(linksSection: ILinksSection, index: number) => {
						// const linksSection = joinParagraphs(
						// 	entry.linkEntries,
						// 	"li",
						// 	"ul"
						// );
						return (
							<UnitEntryContainer key={index}>
								<UnitEntryCaption>
									<UnitEntryCaptionText>
										{linksSection.caption}
									</UnitEntryCaptionText>
								</UnitEntryCaption>
								<LinkSection>
									{linksSection.linkEntries.map(
										(linkEntry, index) => (
											<LinkPatch key={index}>
												{linkEntry.logoUrl && (
													<a
														href={linkEntry.url}
														target="_blank"
													>
														<LinkIcon>
															<img
																src={
																	linkEntry.logoUrl
																}
															/>
														</LinkIcon>
													</a>
												)}
												{linkEntry.logoFontawesomeTag && (
													<a
														href={linkEntry.url}
														target="_blank"
													>
														<LinkIcon>
															<FontAwesomeIcon
																icon={
																	[
																		linkEntry
																			.logoFontawesomeTag[0],
																		linkEntry
																			.logoFontawesomeTag[1]
																	] as any
																}
															/>
														</LinkIcon>
													</a>
												)}
												<a
													href={linkEntry.url}
													target="_blank"
												>
													<span>
														{linkEntry.name}
													</span>
												</a>
											</LinkPatch>
										)
									)}
								</LinkSection>
							</UnitEntryContainer>
						);
					}
				)}
			</ScrollComponent>
		);
	}
}

export interface ILinksTileProps {}

interface ILinksTileState {
	content: ILinksSection[];
}
