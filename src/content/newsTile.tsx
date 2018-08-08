import * as React from "react";

import { loadJsonFile } from "../utils";
import styled from "../../node_modules/styled-components";
import { Colors } from "../artwork";

interface INewsFile {
  entries: INews[];
}

interface INews {
  date: number;
  caption: string;
  text: string;
}

const NewsEntryContainer = styled.div`
padding: 20px;
`;

const NewsEntryText = styled.div`
padding: 20px;
`;

const NewsEntryCaption = styled.div`
font-size: 1.5em;
border-bottom: 1px solid ${Colors.CaptionUnderlineColor};
padding: 20px;
`;

export class NewsTile extends React.Component<INewsTileProps, INewsTileState> {
  constructor(props: NewsTile["props"]) {
    super(props);
    this.state = {
      content: []
    }

    try {
      loadJsonFile<INewsFile>("data/news.json").then(news => {
        console.log(news);
        this.setState({ content: news.entries })
      });
    }
    catch (e) {
      console.log(e);
    }
  }

  private sortLambda = (a: INews, b: INews) => {
    if (a.date < b.date) {
      return 1;
    } else if (a.date > b.date) {
      return -1;
    }
    return 0;
  }

  public render() {
    const sortedEntries = this.state.content.sort(this.sortLambda);

    return (
      <div>
        {sortedEntries.map(entry => (
          <NewsEntryContainer key={entry.date}>
            <NewsEntryCaption>
              <span>{entry.date}</span>
              <span> - </span>
              <span>{entry.caption}</span>
            </NewsEntryCaption>
            <NewsEntryText>{entry.text}</NewsEntryText>
          </NewsEntryContainer>
        ))}
      </div>
    );
  }
}

export default NewsTile;

export interface INewsTileProps { }

interface INewsTileState {
  content: INews[];
}
