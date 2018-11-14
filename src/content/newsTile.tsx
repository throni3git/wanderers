import * as React from "react";

import {
	loadJsonFile,
	IJsonFile,
	IHeadedParagraphSection,
	joinParagraphs
} from "../utils";
import {
	UnitEntryContainer,
	NewsEntryContent,
	UnitEntryCaption,
	UnitEntryCaptionText,
	UnitEntryCaptionDate,
	ScrollComponent,
	UnitEntryImage
} from "./tileComponents";

interface INewsSection extends IHeadedParagraphSection {
	date: string;
	imageUrl?: string;
}

let newsFilePromise: Promise<IJsonFile<INewsSection>>;
try {
	newsFilePromise = loadJsonFile<IJsonFile<INewsSection>>("data/news.json");
} catch (e) {
	console.log(e);
}

export class NewsTile extends React.Component<INewsTileProps, INewsTileState> {
	constructor(props: NewsTile["props"]) {
		super(props);
		this.state = {
			content: []
		};

		newsFilePromise.then(newsFile => {
			console.log(newsFile);
			this.setState({ content: newsFile.entries });
		});
	}

	private sortLambda = (a: INewsSection, b: INewsSection) => {
		const dateA = new Date(a.date);
		const dateB = new Date(b.date);
		if (dateA < dateB) {
			return 1;
		} else if (dateA > dateB) {
			return -1;
		}
		return 0;
	};

	public render() {
		const sortedEntries = this.state.content.sort(this.sortLambda);

		return (
			<ScrollComponent>
				{sortedEntries.map(entry => {
					// parse date info
					const date = new Date(entry.date);
					const dateInCaption = date.toLocaleDateString();
					return (
						<UnitEntryContainer key={entry.date}>
							<UnitEntryCaption>
								<UnitEntryCaptionText>
									{entry.caption}
								</UnitEntryCaptionText>
								<UnitEntryCaptionDate>
									{dateInCaption}
								</UnitEntryCaptionDate>
							</UnitEntryCaption>
							<NewsEntryContent>
								<div
									dangerouslySetInnerHTML={{
										__html: joinParagraphs(entry.paragraphs)
									}}
									style={{ flex: 3 }}
								/>
								{entry.imageUrl && (
									<UnitEntryImage
										url={entry.imageUrl}
										style={{ flex: 1 }}
									>
										<img
											src={"data/img/" + entry.imageUrl}
											style={{
												maxWidth: "100%",
												maxHeight: "100%"
											}}
										/>
									</UnitEntryImage>
								)}
							</NewsEntryContent>
						</UnitEntryContainer>
					);
				})}
			</ScrollComponent>
		);
	}
}

export interface INewsTileProps {}

interface INewsTileState {
	content: INewsSection[];
}
