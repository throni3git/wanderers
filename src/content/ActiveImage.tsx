import * as React from "react";

import styled from "styled-components";

const Overlay = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	display: flex;
	background: rgba(0, 0, 0, 0.6);
	z-index: 10;
`;

const MainImageContainer = styled.div`
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
`;

const MainImage = styled.img`
	max-width: 100%;
	max-height: 100%;
`;

const MainImageCenter = styled.div`
	/* background: url(${props => props.url});
	background-size: cover;
	background-position: center; */
	/* transition: 0.1s ease-in-out; */
	/* max-width: 100%; */
	/* max-height: 100%; */
  padding: 50px;
	/* :hover { */
	/* opacity: 0.85; */
	/* } */
`;

const PreviousImageButton = styled.div`
	width: 100px;
	height: 100%;
	background: red;
`;

const NextImageButton = styled.div`
	width: 100px;
	height: 100%;
	background: green;
`;

export class ActiveImage extends React.Component<
	IActiveImageProps,
	IActiveImageState
> {
	constructor(props: ActiveImage["props"]) {
		super(props);
	}

	public render() {
		return (
			<Overlay>
				<PreviousImageButton
					onClick={this.props.nextImageClickHandler}
				/>
				<MainImageContainer>
					<MainImageCenter>
						<MainImage src={this.props.url} />
					</MainImageCenter>
				</MainImageContainer>
				<NextImageButton
					onClick={this.props.previousImageClickHandler}
				/>
			</Overlay>
		);
	}
}

export interface IActiveImageProps {
	url: string;
	nextImageClickHandler: () => void;
	previousImageClickHandler: () => void;
}

interface IActiveImageState {}
