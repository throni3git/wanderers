// Url Parameter handling
const url = new URL(window.location.href);
export const debugCamera = url.searchParams.get("debugCamera") != null;
export const debugOrbiting = url.searchParams.get("debugOrbiting") != null;
export const debugContact = url.searchParams.get("debugContact") != null;
export const hideSite = url.searchParams.get("hideSite") != null;
export const startupTile = url.searchParams.get("startupTile") || "News";
export const darkTheme = url.searchParams.get("dark") != null;
export const lightTheme = url.searchParams.get("light") != null;
export const background2D = url.searchParams.get("2d") != null;
