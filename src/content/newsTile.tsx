import * as React from "react";

import { Scrollbars } from 'react-custom-scrollbars';

import { loadJsonFile } from "../utils";
import styled from "../../node_modules/styled-components";
import { Colors } from "../artwork";

interface INewsFile {
  entries: INews[];
}

interface INews {
  date: string;
  caption: string;
  description: string;
}

const NewsEntryContainer = styled.div`
  padding: 20px;
`;

const NewsEntryText = styled.div`
  padding: 20px;
`;

const NewsEntryCaption = styled.div`
  border-bottom: 1px solid ${Colors.CaptionUnderlineColor};
  display: flex;
  justify-content:space-between;
  align-items: center;
  padding: 20px;
`;

const NewsEntryCaptionText = styled.div`
font-size: 1.5em;
&::first-letter {
  color: ${Colors.HighlightColor};
  font-weight: bold;
}
`;

const NewsEntryCaptionDate = styled.div`
font-size: 0.8em;
`;

let newsPromise: Promise<INewsFile>;
try {
  newsPromise = loadJsonFile<INewsFile>("data/news.json");

} catch (e) {
  console.log(e);
}

export class NewsTile extends React.Component<INewsTileProps, INewsTileState> {
  constructor(props: NewsTile["props"]) {
    super(props);
    this.state = {
      content: []
    };

    newsPromise.then(news => {
      console.log(news);
      this.setState({ content: news.entries });
    });
  }

  private sortLambda = (a: INews, b: INews) => {
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
      <Scrollbars style={{
        padding: "20px",
        height: "calc(100% - 97px)",
        width: "100%"
      }} >
        {sortedEntries.map(entry => {
          // parse date info
          const date = new Date(entry.date);
          const dateInCaption = ("0" + date.getDate()).slice(-2) + "." + ("0" + date.getMonth()).slice(-2) + "." + date.getFullYear();
          return (
            <NewsEntryContainer key={entry.date}>
              <NewsEntryCaption>
                <NewsEntryCaptionText>{entry.caption}</NewsEntryCaptionText>
                <NewsEntryCaptionDate>{dateInCaption}</NewsEntryCaptionDate>
              </NewsEntryCaption>
              <NewsEntryText><div dangerouslySetInnerHTML={{ __html: entry.description }}></div></NewsEntryText>
            </NewsEntryContainer>
          )
        })}
      </Scrollbars >
    );
  }
}

export default NewsTile;

export interface INewsTileProps { }

interface INewsTileState {
  content: INews[];
}
