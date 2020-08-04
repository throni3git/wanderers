// Url Parameter handling
const url = new URL(window.location.href.toLowerCase());
export const debugCamera = url.searchParams.get("debugcamera") != null;
export const debugOrbiting = url.searchParams.get("debugorbiting") != null;
export const debugContact = url.searchParams.get("debugcontact") != null;
export const hideSite = url.searchParams.get("hidesite") != null;
export const startupTile = url.searchParams.get("startuptile") || "News";
export const darkTheme = url.searchParams.get("dark") != null;
export const lightTheme = url.searchParams.get("light") != null;
export const background2D = url.searchParams.get("2d") != null;
