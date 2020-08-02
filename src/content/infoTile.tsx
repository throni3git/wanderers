import * as React from "react";

import styled from "styled-components";

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
import { MEDIA_FOLDER } from "../constants";

let infoFilePromise: Promise<IJsonFile<IHeadedParagraphSection>>;
try {
	infoFilePromise = loadJsonFile<IJsonFile<IHeadedParagraphSection>>(
		"data/info.json"
	);
} catch (e) {
	console.log(e);
}

const Bandfoto = styled.div`
	background: url(${MEDIA_FOLDER + "Bandfotos/HD_SOJUS3000_001.jpg"});
	background-size: contain;
	background-position: center;
	background-repeat: no-repeat;
	height: 500px;
	margin: 20px;
`;

export class InfoTile extends React.Component<IInfoTileProps, IInfoTileState> {
	constructor(props: InfoTile["props"]) {
		super(props);
		this.state = {
			content: []
		};

		infoFilePromise.then((jsonFile) => {
			console.log(jsonFile);
			this.setState({ content: jsonFile.entries });
		});
	}

	public render() {
		return (
			<ScrollComponent>
				<Bandfoto />
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
