import * as React from "react";

import styled from "styled-components";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Colors } from "../constants";

const Overlay = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	display: flex;
	background: rgba(0, 0, 0, 0.7);
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

const PreviousImageButtonContainer = styled.div`
	width: 100px;
	height: 100%;
	/* background: red; */
	display: flex;
	align-items: center;
`;

const PreviousImageButton = styled.div`
	width: 100%;
	height: 100px;
	/* background: blue; */
	text-align: center;
	line-height: 100px;
	font-size: 80px;
`;

const NextImageButtonContainer = styled.div`
	width: 100px;
	height: 100%;
	/* background: green; */
	display: flex;
	align-items: center;
`;

const NextImageButton = styled.div`
	width: 100%;
	height: 100px;
	/* background: blue; */
	text-align: center;
	line-height: 100px;
	font-size: 80px;
`;

const ExitButton = styled.div`
	position: absolute;
	width: 100px;
	height: 100px;
	text-align: center;
	line-height: 100px;
	font-size: 80px;
	top: 0;
	right: 0;
`;

const IconWithHoverEffect = styled(FontAwesomeIcon)`
	color: ${Colors.galleryArrayColor};
	&:hover {
		color: ${Colors.HighlightColor};
	}
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
				<PreviousImageButtonContainer
					onClick={this.props.nextImageClickHandler}
				>
					<PreviousImageButton>
						<IconWithHoverEffect icon={["fas", "arrow-left"]} />
					</PreviousImageButton>
				</PreviousImageButtonContainer>
				<MainImageContainer>
					<MainImageCenter>
						<MainImage src={this.props.url} />
					</MainImageCenter>
				</MainImageContainer>
				<NextImageButtonContainer
					onClick={this.props.previousImageClickHandler}
				>
					<NextImageButton>
						<IconWithHoverEffect icon={["fas", "arrow-right"]} />
					</NextImageButton>
				</NextImageButtonContainer>
				<ExitButton onClick={this.props.exitClickHandler}>
					<IconWithHoverEffect icon={["fas", "times"]} />
				</ExitButton>
			</Overlay>
		);
	}
}

export interface IActiveImageProps {
	url: string;
	nextImageClickHandler: () => void;
	previousImageClickHandler: () => void;
	exitClickHandler: () => void;
}

interface IActiveImageState {}
