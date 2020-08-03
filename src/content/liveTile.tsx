import * as React from "react";

import styled from "styled-components";

import { IJsonFile, loadJsonFile } from "../utils";
import {
	ScrollComponent,
	UnitEntryContainer,
	UnitEntryCaptionDate
} from "./tileComponents";

import { Colors, BORDER } from "../constants";

declare var IS_PRODUCTION: boolean;

const GigEntryCityText = styled.div`
	flex: 1;
	font-size: 1.5em;
	&::first-letter {
		color: ${Colors.HighlightColor};
		font-weight: bold;
	}
`;

const GigEntryLocationText = styled.div`
	font-size: 1.2em;
`;

const GigEntryContent = styled(UnitEntryCaptionDate)`
	flex: 1;
	text-align: right;
`;

const GigEntrySubLineText = styled.div`
	font-size: 1em;
`;

const GigEntry = styled.div`
	border-bottom: ${BORDER + "px"} solid ${Colors.CaptionUnderlineColor};
`;

const GigEntryMainLine = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 10px 20px;
`;
const GigEntrySubLine = styled.div`
	display: flex;
	justify-content: space-around;
	align-items: center;
	padding: 10px 20px;
`;

const HeadingEntryCaption = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 10px 20px;
`;

const YearCaptionText = styled.div`
	font-size: 2em;
	&::first-letter {
		color: ${Colors.HighlightColor};
		font-weight: bold;
	}
`;

export const GigEntryCaption = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 10px 20px;
`;

interface ILiveGigMetaData {
	date: string;
	city: string;
	location: string;
	topic?: string;
	with?: string;
}

let liveGigMetaDataFilePromise: Promise<IJsonFile<ILiveGigMetaData>>;
try {
	liveGigMetaDataFilePromise = loadJsonFile<IJsonFile<ILiveGigMetaData>>(
		IS_PRODUCTION ? "data/live.json" : "data/dev/live.json"
	);
} catch (e) {
	console.log(e);
}
export class LiveTile extends React.Component<ILiveTileProps, ILiveTileState> {
	constructor(props: ILiveTileProps) {
		super(props);
		this.state = {
			content: []
		};

		liveGigMetaDataFilePromise.then((jsonFile) => {
			if (!IS_PRODUCTION) {
				console.log(jsonFile);
			}

			this.setState({ content: jsonFile.entries });
		});
	}

	private sortLambda = (a: ILiveGigMetaData, b: ILiveGigMetaData) => {
		const dateA = new Date(a.date);
		const dateB = new Date(b.date);
		if (dateA < dateB) {
			return 1;
		} else if (dateA > dateB) {
			return -1;
		}
		return 0;
	};

	private makeGigEntry(entry: ILiveGigMetaData): JSX.Element {
		// parse date info
		const date = new Date(entry.date);
		const dateInCaption = date.toLocaleDateString();

		return (
			<UnitEntryContainer key={entry.date}>
				<GigEntry>
					<GigEntryMainLine>
						<GigEntryCityText>{entry.city}</GigEntryCityText>
						<GigEntryLocationText>
							{entry.topic ? entry.topic + " // " : null}
							{entry.location}
						</GigEntryLocationText>
						<GigEntryContent>{dateInCaption}</GigEntryContent>
					</GigEntryMainLine>
					<GigEntrySubLine>
						<GigEntrySubLineText>{entry.with}</GigEntrySubLineText>
					</GigEntrySubLine>
				</GigEntry>
			</UnitEntryContainer>
		);
	}

	public render() {
		const sortedEntries = this.state.content.sort(this.sortLambda);
		const futureGigsIdx = sortedEntries.findIndex(
			(entry) => new Date(entry.date) < new Date()
		);
		const futureGigs = sortedEntries.slice(0, futureGigsIdx);
		const futureGigsContainer = (
			<>{futureGigs.map((entry) => this.makeGigEntry(entry))}</>
		);

		const pastGigs = sortedEntries.slice(futureGigsIdx);
		const yearMapping = new Map<number, ILiveGigMetaData[]>();

		for (const gigEntry of pastGigs) {
			const date = new Date(gigEntry.date);
			const year = date.getFullYear();
			if (!yearMapping.has(year)) {
				yearMapping.set(year, []);
			}
			yearMapping.get(year).push(gigEntry);
		}

		const pastGigContainers = new Array<JSX.Element>();
		yearMapping.forEach((gigEntries, year) => {
			const result = (
				<div key={year}>
					{/* <UnitEntryContainer>
						<YearCaptionText>{year}</YearCaptionText>
					</UnitEntryContainer> */}
					{gigEntries.map((entry) => this.makeGigEntry(entry))}
				</div>
			);
			pastGigContainers.push(result);
		});

		return (
			<ScrollComponent>
				<HeadingEntryCaption>
					<YearCaptionText>Future Shows</YearCaptionText>
				</HeadingEntryCaption>
				{futureGigsContainer}
				<HeadingEntryCaption>
					<YearCaptionText>Past Shows</YearCaptionText>
				</HeadingEntryCaption>
				{pastGigContainers}
			</ScrollComponent>
		);
	}
}

export interface ILiveTileProps {}

interface ILiveTileState {
	content: ILiveGigMetaData[];
}
