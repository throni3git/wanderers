import * as React from "react";

import styled from "styled-components";

import { loadJsonFile, IJsonFile } from "../utils";

import {
	ScrollComponent,
	UnitEntryContainer,
	UnitEntryCaption,
	UnitEntryCaptionText,
	UnitEntryCaptionDate
} from "./tileComponents";

const GalleryImageSection = styled.div`
	display: flex;
`;

const SingleImageContainer = styled.div(props => ({
	background: "url(" + props.src + ")",
	padding: "10px",
	width: "25%",
	height: "180px"
}));

interface IImageUrl {
	imageUrl: string;
	thumbUrl?: string;
}

/** typing for a universal section with a caption */
interface IImageSection {
	caption: string;
	date?: string;
	imageList: IImageUrl[];
	folder: string;
}

let imagesFilePromise: Promise<IJsonFile<IImageSection>>;
try {
	imagesFilePromise = loadJsonFile<IJsonFile<IImageSection>>(
		"data/images.json"
	);
} catch (e) {
	console.log(e);
}

export class GalleryTile extends React.Component<
	IGalleryTileProps,
	IGalleryTileState
> {
	constructor(props: GalleryTile["props"]) {
		super(props);
		this.state = {
			imageContent: []
		};

		imagesFilePromise.then(jsonFile => {
			console.log("images");
			console.log(jsonFile.entries);
			this.setState({ imageContent: jsonFile.entries });
		});
	}

	public render() {
		return (
			<ScrollComponent>
				{this.state.imageContent.map(
					(imageSection: IImageSection, idx: number) => (
						<UnitEntryContainer key={idx}>
							<UnitEntryCaption>
								<UnitEntryCaptionText>
									{imageSection.caption}
								</UnitEntryCaptionText>
								<UnitEntryCaptionDate>
									{imageSection.date}
								</UnitEntryCaptionDate>
							</UnitEntryCaption>
							<GalleryImageSection>
								{imageSection.imageList.map(
									(imgUrl: IImageUrl, idx: number) => (
										<SingleImageContainer
											key={idx}
											src={
												"media/" +
												imageSection.folder +
												"/" +
												imgUrl.thumbUrl
											}
										/>
									)
								)}
							</GalleryImageSection>
						</UnitEntryContainer>
					)
				)}
			</ScrollComponent>
		);
	}
}

export default GalleryTile;

export interface IGalleryTileProps {}

interface IGalleryTileState {
	imageContent?: IImageSection[];
}
