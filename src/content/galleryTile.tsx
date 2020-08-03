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

import { SingleImage } from "./SingleImage";
import { ActiveImage } from "./ActiveImage";
import { MEDIA_FOLDER } from "../constants";

declare var IS_PRODUCTION: boolean;

const GalleryImageSection = styled.div`
	padding: 10px 0;
	display: flex;
	flex-wrap: wrap;
`;

/** typing for a universal section with a caption */
interface IImageSection {
	caption: string;
	date?: string;
	imageList: string[];
	folder: string;
}

let imagesFilePromise: Promise<IJsonFile<IImageSection>>;
try {
	imagesFilePromise = loadJsonFile<IJsonFile<IImageSection>>(
		IS_PRODUCTION ? "data/gallery.json" : "data/dev/gallery.json"
	);
} catch (e) {
	console.log(e);
}

export class GalleryTile extends React.Component<
	IGalleryTileProps,
	IGalleryTileState
> {
	private imageMapping: Map<number, Map<number, string>>;

	constructor(props: GalleryTile["props"]) {
		super(props);
		this.state = {
			imageContent: []
		};

		imagesFilePromise.then((jsonFile) => {
			if (!IS_PRODUCTION) {
				console.log("images");
				console.log(jsonFile.entries);
			}

			this.imageMapping = new Map<number, Map<number, string>>();
			jsonFile.entries.map(
				(imageSection: IImageSection, imageSectionIdx: number) => {
					const imageSectionMap = new Map();
					this.imageMapping.set(imageSectionIdx, imageSectionMap);

					imageSection.imageList.map(
						(imgUrl: string, imageIdx: number) => {
							imageSectionMap.set(imageIdx, imgUrl);
						}
					);
				}
			);

			this.setState({ imageContent: jsonFile.entries });
		});
	}

	private clickSingleImage = (imageSectionIdx, imageIdx) => {
		console.log(imageSectionIdx);
		console.log(imageIdx);
		this.setState({
			activeImage: {
				imageSectionIdx,
				imageIdx
			}
		});
	};
	private gotoNextImage = () => {
		const activeImage = this.state.activeImage;

		let newImageIdx: number;
		let newSectionIdx: number;
		const currentSection = this.imageMapping.get(
			activeImage.imageSectionIdx
		);
		if (currentSection.has(activeImage.imageIdx + 1)) {
			newImageIdx = activeImage.imageIdx + 1;
			newSectionIdx = activeImage.imageSectionIdx;
		} else {
			newImageIdx = 0;

			if (this.imageMapping.has(activeImage.imageSectionIdx + 1)) {
				newSectionIdx = activeImage.imageSectionIdx + 1;
			} else {
				newSectionIdx = 0;
			}
		}

		this.setState({
			activeImage: {
				imageSectionIdx: newSectionIdx,
				imageIdx: newImageIdx
			}
		});
	};
	private gotoPreviousImage = () => {
		const activeImage = this.state.activeImage;

		let newImageIdx: number;
		let newSectionIdx: number;
		const currentSection = this.imageMapping.get(
			activeImage.imageSectionIdx
		);
		if (currentSection.has(activeImage.imageIdx - 1)) {
			newImageIdx = activeImage.imageIdx - 1;
			newSectionIdx = activeImage.imageSectionIdx;
		} else {
			if (this.imageMapping.has(activeImage.imageSectionIdx - 1)) {
				newSectionIdx = activeImage.imageSectionIdx - 1;
			} else {
				newSectionIdx = this.imageMapping.size - 1;
			}
			newImageIdx = this.imageMapping.get(newSectionIdx).size - 1;
		}

		this.setState({
			activeImage: {
				imageSectionIdx: newSectionIdx,
				imageIdx: newImageIdx
			}
		});
	};

	private exitActiveImage = () => {
		this.setState({ activeImage: undefined });
	};

	public render() {
		const activeImage = this.state.activeImage;

		return (
			<>
				<ScrollComponent>
					{this.state.imageContent.map(
						(
							imageSection: IImageSection,
							imageSectionIdx: number
						) => {
							let dateInCaption: string;
							if (imageSection.date) {
								const date = new Date(imageSection.date);
								dateInCaption = date.toLocaleDateString();
							}
							const imageSectionFolder =
								MEDIA_FOLDER + imageSection.folder + "/";
							return (
								<UnitEntryContainer key={imageSectionIdx}>
									<UnitEntryCaption>
										<UnitEntryCaptionText
											dangerouslySetInnerHTML={{
												__html: imageSection.caption
											}}
										/>
										<UnitEntryCaptionDate>
											{dateInCaption}
										</UnitEntryCaptionDate>
									</UnitEntryCaption>
									<GalleryImageSection>
										{imageSection.imageList.map(
											(
												imgUrl: string,
												imageIdx: number
											) => {
												return (
													<SingleImage
														key={imageIdx}
														folder={
															imageSectionFolder
														}
														imageUrl={imgUrl}
														// imageSectionIdx={
														// 	imageSectionIdx
														// }
														// imageIdx={imageIdx}
														clickHandler={() =>
															this.clickSingleImage(
																imageSectionIdx,
																imageIdx
															)
														}
													/>
												);
											}
										)}
									</GalleryImageSection>
								</UnitEntryContainer>
							);
						}
					)}
				</ScrollComponent>
				{activeImage && (
					<ActiveImage
						url={
							MEDIA_FOLDER +
							this.state.imageContent[activeImage.imageSectionIdx]
								.folder +
							"/" +
							this.imageMapping
								.get(activeImage.imageSectionIdx)
								.get(activeImage.imageIdx)
						}
						nextImageClickHandler={this.gotoNextImage}
						previousImageClickHandler={this.gotoPreviousImage}
						exitClickHandler={this.exitActiveImage}
					/>
				)}
			</>
		);
	}
}

export default GalleryTile;

export interface IGalleryTileProps {}

interface IGalleryTileState {
	imageContent?: IImageSection[];
	activeImage?: {
		imageSectionIdx: number;
		imageIdx: number;
	};
}
