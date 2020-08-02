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
	UnitEntryImageContainer,
	UnitEntryImage
} from "./tileComponents";
import { NEWS_IMAGE_FOLDER } from "../constants";

declare var IS_PRODUCTION: boolean;

interface INewsSection extends IHeadedParagraphSection {
	date: string;
	imageUrl?: string;
}

let newsFilePromise: Promise<IJsonFile<INewsSection>>;
try {
	newsFilePromise = loadJsonFile<IJsonFile<INewsSection>>(
		IS_PRODUCTION ? "data/news.json" : "data/dev/news.json"
	);
} catch (e) {
	console.log(e);
}

export class NewsTile extends React.Component<INewsTileProps, INewsTileState> {
	constructor(props: NewsTile["props"]) {
		super(props);
		this.state = {
			content: []
		};

		newsFilePromise.then((newsFile) => {
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
				{sortedEntries.map((entry, idx) => {
					// parse date info
					const date = new Date(entry.date);
					const dateInCaption = date.toLocaleDateString();
					const img = entry.imageUrl && (
						<UnitEntryImageContainer>
							<UnitEntryImage
								src={NEWS_IMAGE_FOLDER + entry.imageUrl}
							/>
						</UnitEntryImageContainer>
					);
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
								{idx % 2 === 1 && img}
								<div
									dangerouslySetInnerHTML={{
										__html: joinParagraphs(entry.paragraphs)
									}}
									style={{ flex: 3 }}
								/>
								{idx % 2 === 0 && img}
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
