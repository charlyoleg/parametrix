// canvas_utils.ts
// helper interfaces and functions to work with HtmlCanvas
// used by euclid2d.ts, segment.ts, contour.ts and assemblage.ts

type tCanvasAdjust = {
	init: number;
	xMin: number;
	yMin: number;
	xyDiff: number;
	shiftX: number;
	shiftY: number;
	scaleX: number;
	scaleY: number;
};

const colorCanvasPoint = 'grey';

export type { tCanvasAdjust };
export { colorCanvasPoint };
