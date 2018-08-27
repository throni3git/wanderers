import * as React from "react";

import { loadJsonFile } from "../utils";
import {
  UnitEntryContainer,
  UnitEntryContent,
  UnitEntryCaption,
  UnitEntryCaptionText,
  UnitEntryCaptionDate,
  ScrollComponent,
  UnitEntryImage
} from "./tileComponents";

interface INewsFile {
  entries: INews[];
}

interface INews {
  date: string;
  caption: string;
  description: string;
  imageUrl?: string;
}

let newsFilePromise: Promise<INewsFile>;
try {
  newsFilePromise = loadJsonFile<INewsFile>("data/news.json");

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
      <ScrollComponent>
        {sortedEntries.map(entry => {
          // parse date info
          const date = new Date(entry.date);
          const dateInCaption = ("0" + date.getDate()).slice(-2) + "." + ("0" + date.getMonth()).slice(-2) + "." + date.getFullYear();
          return (
            <UnitEntryContainer key={entry.date}>
              <UnitEntryCaption>
                <UnitEntryCaptionText>{entry.caption}</UnitEntryCaptionText>
                <UnitEntryCaptionDate>{dateInCaption}</UnitEntryCaptionDate>
              </UnitEntryCaption>
              <UnitEntryContent>
                <div dangerouslySetInnerHTML={{ __html: entry.description }} style={{flex: 3}}></div>
                {
                  entry.imageUrl && <UnitEntryImage url={entry.imageUrl} style={{flex: 1}} >
                    <img src={"data/img/" + entry.imageUrl} style={{maxWidth: "100%",maxHeight: "100%"}}></img>
                  </UnitEntryImage>
                }
              </UnitEntryContent>
            </UnitEntryContainer>
          )
        })}
      </ScrollComponent >
    );
  }
}

export default NewsTile;

export interface INewsTileProps { }

interface INewsTileState {
  content: INews[];
}
