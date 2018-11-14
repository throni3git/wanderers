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

let infoFilePromise: Promise<IJsonFile<IHeadedParagraphSection>>;
try {
	infoFilePromise = loadJsonFile<IJsonFile<IHeadedParagraphSection>>(
		"data/info.json"
	);
} catch (e) {
	console.log(e);
}

export class InfoTile extends React.Component<IInfoTileProps, IInfoTileState> {
	constructor(props: InfoTile["props"]) {
		super(props);
		this.state = {
			content: []
		};

		infoFilePromise.then(jsonFile => {
			console.log(jsonFile);
			this.setState({ content: jsonFile.entries });
		});
	}

	public render() {
		return (
			<ScrollComponent>
				{this.state.content.map(
					(entry: IHeadedParagraphSection, index: number) => {
						// parse date info
						return (
							<UnitEntryContainer key={index}>
								<UnitEntryCaption>
									<UnitEntryCaptionText>
										{entry.caption}
									</UnitEntryCaptionText>
								</UnitEntryCaption>
								<UnitEntryContent
									dangerouslySetInnerHTML={{
										__html: joinParagraphs(entry.paragraphs)
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

export interface IInfoTileProps {}

interface IInfoTileState {
	content: IHeadedParagraphSection[];
}
