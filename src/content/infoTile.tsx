import * as React from "react";

import { loadJsonFile } from "../utils";
import {
  UnitEntryContainer,
  UnitEntryContent,
  UnitEntryCaption,
  UnitEntryCaptionText,
  UnitEntryCaptionDate,
  ScrollComponent
} from "./tileComponents";

interface IInfoFile {
  entries: IInfo[];
}

interface IInfo {
  caption: string;
  description: string[];
}

let infoFilePromise: Promise<IInfoFile>;
try {
  infoFilePromise = loadJsonFile<IInfoFile>("data/info.json");

} catch (e) {
  console.log(e);
}

export class InfoTile extends React.Component<IInfoTileProps, IInfoTileState> {
  constructor(props: InfoTile["props"]) {
    super(props);
    this.state = {
      content: []
    }

    infoFilePromise.then(newsFile => {
      console.log(newsFile);
      this.setState({ content: newsFile.entries });
    });
  }

  public render() {
    return (
      <ScrollComponent>
        {this.state.content.map((entry: IInfo, index: number) => {
          // parse date info
          return (
            <UnitEntryContainer key={index}>
              <UnitEntryCaption>
                <UnitEntryCaptionText>{entry.caption}</UnitEntryCaptionText>
              </UnitEntryCaption>
              <UnitEntryContent dangerouslySetInnerHTML={{__html:entry.description.join("")}}></UnitEntryContent>
            </UnitEntryContainer>
          )
        })}
      </ScrollComponent>
    );
  }
}

export default InfoTile;

export interface IInfoTileProps { }

interface IInfoTileState {
  content: IInfo[];
}
