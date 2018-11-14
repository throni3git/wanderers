import * as React from "react";

import {
	loadJsonFile,
	IJsonFile,
	IHeadedParagraphSection,
	joinParagraphs
} from "../utils";

import {
	UnitEntryContainer,
	UnitEntryContent,
	UnitEntryCaption,
	UnitEntryCaptionText,
	ScrollComponent
} from "./tileComponents";

let linksFilePromise: Promise<IJsonFile<IHeadedParagraphSection>>;
try {
	linksFilePromise = loadJsonFile<IJsonFile<IHeadedParagraphSection>>(
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
					(entry: IHeadedParagraphSection, index: number) => {
						const linksSection = joinParagraphs(
							entry.paragraphs,
							"li",
							"ul"
						);
						return (
							<UnitEntryContainer key={index}>
								<UnitEntryCaption>
									<UnitEntryCaptionText>
										{entry.caption}
									</UnitEntryCaptionText>
								</UnitEntryCaption>
								<UnitEntryContent
									dangerouslySetInnerHTML={{
										__html: linksSection
									}}
								/>
							</UnitEntryContainer>
						);
					}
				)}
			</ScrollComponent>
		);
	}
}

export default LinksTile;

export interface ILinksTileProps {}

interface ILinksTileState {
	content: IHeadedParagraphSection[];
}
