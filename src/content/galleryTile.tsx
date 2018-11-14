import * as React from "react";
import { ScrollComponent, UnitEntryContainer } from "./tileComponents";

export class GalleryTile extends React.Component<
	IGalleryTileProps,
	IGalleryTileState
> {
	constructor(props: GalleryTile["props"]) {
		super(props);
	}

	public render() {
		return (
			<ScrollComponent>
				<UnitEntryContainer>GalleryTile</UnitEntryContainer>
			</ScrollComponent>
		);
	}
}

export default GalleryTile;

export interface IGalleryTileProps {}

interface IGalleryTileState {}
