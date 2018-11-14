import * as React from "react";

import {
  UnitEntryContainer,
  UnitEntryContent,
  UnitEntryCaption,
  UnitEntryCaptionText,
  UnitEntryCaptionDate,
  ScrollComponent,
  UnitEntryImage
} from "./tileComponents";

export class ContactTile extends React.Component<
  IContactTileProps,
  IContactTileState
  > {
  constructor(props: ContactTile["props"]) {
    super(props);
    this.state = { name: '', mail: '', text: '', acceptsDSGVO: false }

  }

  private handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const changedValue = event.target.value;
    const changedEntry = event.target.name;
    this.setState({ [changedEntry]: changedValue });
  }

  private onSubmit = (event) => {
    console.log(event);
    event.preventDefault();
  }

  public render() {
    return (
      <ScrollComponent>
        <UnitEntryContainer>
          <form onSubmit={this.onSubmit}>
            <label>
              Name
            <input type="text" name="name" value={this.state.name} onChange={this.handleChange} />
            </label>
            <input type="submit" value="Submit" />
          </form>
        </UnitEntryContainer>
      </ScrollComponent>
    );
  }
}

export default ContactTile;

export interface IContactTileProps { }

interface IContactTileState {
  mail?: string;
  name?: string;
  acceptsDSGVO?: boolean;
  text?: string;
}
