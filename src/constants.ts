import * as Store from "./store";

interface IColorTheme {
	Background: string;
	HeadingLogoUrl: string;
	DefaultTextColor: string;
	LightTextColor: string;
	LinkColor: string;
	LinkHoverColor: string;
	HighlightColor: string;
	ActiveMenuColor: string;
	CaptionUnderlineColor: string;
	RulerColor: string;
	GalleryArrayColor: string;
	ShadowColor: string;
}

export const LightTheme: IColorTheme = {
	Background: "#ffffffdd",
	HeadingLogoUrl: "assets/logo_light.svg",
	DefaultTextColor: "#333333",
	LightTextColor: "#333333bb",
	LinkColor: "#000000",
	LinkHoverColor: "#ab854f",
	HighlightColor: "#ab854f",
	ActiveMenuColor: "#8c6c40",
	CaptionUnderlineColor: "#888888",
	RulerColor: "#666666",
	GalleryArrayColor: "#cccccc",
	ShadowColor: "#444444"
};

export const DarkTheme: IColorTheme = {
	Background: "#00000099",
	HeadingLogoUrl: "assets/logo_dark.svg",
	DefaultTextColor: "#cccccc",
	LightTextColor: "#ccccccbb",
	LinkColor: "#cccccc",
	LinkHoverColor: "#ab854f",
	HighlightColor: "#ab854f",
	ActiveMenuColor: "#8c6c40",
	CaptionUnderlineColor: "#888888",
	RulerColor: "#999999",
	GalleryArrayColor: "#cccccc",
	ShadowColor: "#444444"
};

export const DebugTheme: IColorTheme = {
	Background: "yellow",
	HeadingLogoUrl: "assets/logo_dark.svg",
	DefaultTextColor: "red",
	LightTextColor: "pink",
	LinkColor: "purple",
	LinkHoverColor: "orange",
	HighlightColor: "green",
	ActiveMenuColor: "gold",
	CaptionUnderlineColor: "blue",
	RulerColor: "aquamarine",
	GalleryArrayColor: "yellow",
	ShadowColor: "cyan"
};

export let Colors: IColorTheme = LightTheme;
if (!Store.getState().artwork.useLightTheme) {
	Colors = DarkTheme;
}

export const NEWS_IMAGE_FOLDER = "data/news_images/";
export const MEDIA_FOLDER = "media/";

export const BORDER = 1;
export const BORDER_RADIUS = 3 * BORDER;
