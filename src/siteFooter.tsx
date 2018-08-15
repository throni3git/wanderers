import * as React from "react";
import styled from "styled-components";
import { Colors } from "./artwork";
import { ProgressPlugin } from "../node_modules/@types/webpack";

const FooterContainer = styled.div`
  height: 100px;
  border-top: 1px solid ${Colors.RulerColor};
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

interface IFooterProps {
  imageUrl: string;
}
const FooterIcon = styled.a<IFooterProps>`
  background: url(${props => props.imageUrl});
  background-repeat: no-repeat;
  height: 50px;
  width: 50px;
  margin: auto 20px;
  cursor: pointer;
`;

export const SiteFooter: React.SFC<ISiteFooterProps> = props => (
<FooterContainer>
  <FooterIcon imageUrl="assets/logos/facebook.svg" href="https://www.facebook.com/sojus3000" target="_blank" />
  <FooterIcon imageUrl="assets/logos/facebook.svg" href="https://www.facebook.com/sojus3000" target="_blank" />
</FooterContainer>
);

SiteFooter.displayName = "SiteFooter";

export default SiteFooter;

export interface ISiteFooterProps {}