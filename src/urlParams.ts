export let DBG_CAMERA = false;
export let DBG_ORBITING = false;
export let DBG_CONTACT_TILE = false;
export let HIDE_SITE = false;
export let STARTUP_TILE = "News";

const url = new URL(window.location.href);
const dbgCamera = url.searchParams.get("debugCamera");
if (dbgCamera != null) {
	DBG_CAMERA = true;
	console.log("DBG_CAMERA active");
}

const dbgOrbiting = url.searchParams.get("debugOrbiting");
if (dbgOrbiting != null) {
	DBG_ORBITING = true;
	console.log("DBG_ORBITING active");
}

const dbgContact = url.searchParams.get("debugContact");
if (dbgContact != null) {
	DBG_CONTACT_TILE = true;
	console.log("DBG_CONTACT_TILE active");
}

const hideSite = url.searchParams.get("hideSite");
if (hideSite != null) {
	HIDE_SITE = true;
	console.log("HIDE_SITE active");
}

const tileToBeActivated = url.searchParams.get("tile");
if (tileToBeActivated != null) {
	STARTUP_TILE = tileToBeActivated;
	console.log("STARTUP_TILE active");
}
