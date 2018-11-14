import * as React from "react";

import styled from "styled-components";

import { IJsonFile, loadJsonFile } from "../utils";
import { ScrollComponent, UnitEntryContainer, UnitEntryCaption, UnitEntryCaptionDate } from "./tileComponents";

import { Colors } from "../artwork";

const GigCityCaptionText = styled.div`
  font-size: 1.0em;
  &::first-letter {
    color: ${Colors.HighlightColor};
    font-weight: bold;
  }
`;

const GigLocationCaptionText = styled.div`
  font-size: 1.0em;
`;



const YearCaptionText = styled.div`
  font-size: 2em;
  &::first-letter {
    color: ${Colors.HighlightColor};
    font-weight: bold;
  }
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
  liveGigMetaDataFilePromise = loadJsonFile<IJsonFile<ILiveGigMetaData>>("data/live.json");
} catch (e) {
  console.log(e);
}
export class LiveTile extends React.Component<ILiveTileProps, ILiveTileState> {
  constructor(props: ILiveTileProps) {
    super(props);
    this.state = {
      content: []
    };

    liveGigMetaDataFilePromise.then(jsonFile => {
      console.log(jsonFile);
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
        <UnitEntryCaption>
          <GigCityCaptionText>{entry.city}</GigCityCaptionText>
          <GigLocationCaptionText>{entry.location}</GigLocationCaptionText>
          {/* <GigLocationCaptionText>{entry.topic}</GigLocationCaptionText>
          <GigLocationCaptionText>{entry.with}</GigLocationCaptionText> */}
          <UnitEntryCaptionDate>{dateInCaption}</UnitEntryCaptionDate>
        </UnitEntryCaption>
      </UnitEntryContainer>
    );

  }

  public render() {
    const sortedEntries = this.state.content.sort(this.sortLambda);
    const futureGigsIdx = sortedEntries.findIndex(entry =>
      new Date(entry.date) < new Date()
    );
    const futureGigs = sortedEntries.slice(0, futureGigsIdx);
    const futureGigsContainer = <>{futureGigs.map(entry => this.makeGigEntry(entry))}</>;

    const pastGigs = sortedEntries.slice(futureGigsIdx);
    const yearMapping = new Map<number, ILiveGigMetaData[]>();

    for (const gigEntry of pastGigs) {
      const date = new Date(gigEntry.date);
      const year = date.getFullYear();
      if (!yearMapping.has(year)) {
        yearMapping.set(year, [])
      }
      yearMapping.get(year).push(gigEntry);
    }

    const pastGigContainers = new Array<JSX.Element>();
    yearMapping.forEach((gigEntries, year) => {
      const result = (<YearCaptionText key={year}>
        {year}
        {gigEntries.map(entry => this.makeGigEntry(entry))}
      </YearCaptionText>);
      pastGigContainers.push(result);
    })

    return (
      <ScrollComponent>
        <YearCaptionText>Future Shows</YearCaptionText>
        {futureGigsContainer}
        <YearCaptionText>Past Shows</YearCaptionText>
        {pastGigContainers}
      </ScrollComponent>
    );
  }
}

export default LiveTile;

export interface ILiveTileProps { }

interface ILiveTileState {
  content: ILiveGigMetaData[];
}
