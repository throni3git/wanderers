import * as React from "react";
import styled from "styled-components";
import { Colors } from "./artwork";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ActiveContentTypes } from "./SiteMenu";

const FooterContainer = styled.div`
	height: 100px;
	width: 100%;
	border-top: 1px solid ${Colors.RulerColor};
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	position: absolute;
	bottom: 0;
`;

const FooterIcon = styled.a`
	font-size: 40px;
	line-height: 50px;
	text-align: center;
	height: 50px;
	width: 50px;
	margin: auto 20px;
	cursor: pointer;
`;

const ImpressumLink = styled.a`
	font-size: 0.8em;
	position: absolute;
	bottom: 3px;
	right: 3px;
	cursor: pointer;
`;

export const SiteFooter: React.SFC<ISiteFooterProps> = props => (
	<FooterContainer>
		<FooterIcon href="https://www.facebook.com/sojus3000" target="_blank">
			<FontAwesomeIcon icon={["fab", "facebook"]} />
		</FooterIcon>
		<FooterIcon
			href="https://www.youtube.com/user/sojus3000"
			target="_blank"
		>
			<FontAwesomeIcon icon={["fab", "youtube"]} />
		</FooterIcon>
		{/* <FooterIcon href="https://soundcloud.com/sojus3000/" target="_blank" ><FontAwesomeIcon icon={['fab', "soundcloud"]} /></FooterIcon> */}
		<FooterIcon
			href="https://open.spotify.com/artist/29i6nmTanReeRZDPwUayI6"
			target="_blank"
		>
			<FontAwesomeIcon icon={["fab", "spotify"]} />
		</FooterIcon>
		<FooterIcon href="https://instagram.com/sojus3000music" target="_blank">
			<FontAwesomeIcon icon={["fab", "instagram"]} />
		</FooterIcon>
		<FooterIcon href="https://sojus3000.bandcamp.com/" target="_blank">
			<FontAwesomeIcon icon={["fab", "bandcamp"]} />
		</FooterIcon>
		<ImpressumLink onClick={() => props.setActiveContent("Impressum")}>
			Impressum
		</ImpressumLink>
	</FooterContainer>
);

SiteFooter.displayName = "SiteFooter";

export default SiteFooter;

export interface ISiteFooterProps {
	setActiveContent: (name: ActiveContentTypes) => void;
}
