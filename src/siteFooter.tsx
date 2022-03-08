import * as React from "react";
import styled from "styled-components";
import { Colors, BORDER } from "./constants";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ActiveContentTypes } from "./siteMenu";

const FooterContainer = styled.div`
	height: 82px;
	width: 100%;
	border-top: ${BORDER + "px"} solid ${Colors.RulerColor};
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	position: absolute;
	bottom: 0;
`;

const FooterIcon = styled.a`
	font-size: 40px;
	line-height: 40px;
	text-align: center;
	/* height: 50px; */
	/* width: 50px; */
	margin: 20px;
	cursor: pointer;
`;

const ImpressumLink = styled.a`
	font-size: 0.8em;
	position: absolute;
	bottom: 3px;
	right: 3px;
	cursor: pointer;
`;

export const SiteFooter: React.FunctionComponent<ISiteFooterProps> = props => (
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
			Impressum/DSGVO
		</ImpressumLink>
	</FooterContainer>
);

SiteFooter.displayName = "SiteFooter";

export interface ISiteFooterProps {
	setActiveContent: (name: ActiveContentTypes) => void;
}
