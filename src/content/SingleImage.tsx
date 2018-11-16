import * as React from "react";

import styled from "styled-components";

const SingleImageContainer = styled.div`
	padding: 2px;
	width: 25%;
	height: 160px;
`;

const Thumbnail = styled.div`
	background: url(${props => props.url});
	background-size: cover;
	background-position: center;
	transition: 0.1s ease-in-out;
	width: 100%;
	height: 100%;
	:hover {
		opacity: 0.85;
	}
`;
export class SingleImage extends React.Component<
	ISingleImageProps,
	ISingleImageState
> {
	constructor(props: ISingleImageProps) {
		super(props);
	}

	public render() {
		return (
			<SingleImageContainer onClick={this.props.clickHandler}>
				<Thumbnail
					url={this.props.folder + "thumbs/" + this.props.imageUrl}
				/>
			</SingleImageContainer>
		);
	}
}


export interface ISingleImageProps {
	imageUrl: string;
  folder: string;
  clickHandler: () => void;
}

interface ISingleImageState {}