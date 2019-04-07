import { svgDeezer } from "./deezer";
import { svgAtomino } from "./atomino";
import { svgBaracke } from "./baracke";
import { svgColdSkinStudio } from "./coldSkinStudio";
import { svgFuzzmatazz } from "./fuzzmatazz";
import { svgPonk } from "./ponk";
import { svgRama } from "./rama";
import { svgNateHill } from "./nateHill";
import { svgDkm } from "./dkm";

export const allTsxLogos: Record<string, JSX.Element> = {
	deezer: svgDeezer,
	atomino: svgAtomino,
	baracke: svgBaracke,
	coldSkinStudio: svgColdSkinStudio,
	fuzzmatazz: svgFuzzmatazz,
	ponk: svgPonk,
  rama: svgRama,
  nateHill: svgNateHill,
  dkm: svgDkm
};
