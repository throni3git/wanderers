import * as React from "react";

import { loadJsonFile } from "../utils";

interface INewsFile {
  entries: INews[];
}

interface INews {
  date: number;
  caption: string;
  text: string;
}

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
    catch(e) {
      console.log(e);
    }
  }

  private sortLambda = (a: INews, b:INews) => {
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
        {sortedEntries.map(newsEntry => (
          <div>
            <div>
              <span>{newsEntry.date}</span>
              <span>{newsEntry.caption}</span>
            </div>
            <div>{newsEntry.text}</div>
          </div>
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
