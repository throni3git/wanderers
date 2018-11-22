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

import { Colors } from "../constants";

const ImpressumEntryCaption = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 20px;
`;

const ImpressumCaptionText = styled.div`
	font-size: 2em;
	&::first-letter {
		color: ${Colors.HighlightColor};
		font-weight: bold;
	}
`;

let impressumFilePromise: Promise<IJsonFile<IHeadedParagraphSection>>;
try {
	impressumFilePromise = loadJsonFile<IJsonFile<IHeadedParagraphSection>>(
		"data/impressum.json"
	);
} catch (e) {
	console.log(e);
}

export class ImpressumTile extends React.Component<
	IImpressumTileProps,
	IImpressumTileState
> {
	constructor(props: ImpressumTile["props"]) {
		super(props);
		this.state = { content: [] };

		impressumFilePromise.then(impressumFile => {
			console.log(impressumFile);
			this.setState({ content: impressumFile.entries });
		});
	}

	public render() {
		return (
			<ScrollComponent>
				<UnitEntryContainer>
					<ImpressumEntryCaption>
						<ImpressumCaptionText>Impressum</ImpressumCaptionText>
					</ImpressumEntryCaption>
				</UnitEntryContainer>
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

export interface IImpressumTileProps {}

interface IImpressumTileState {
	content: IHeadedParagraphSection[];
}
