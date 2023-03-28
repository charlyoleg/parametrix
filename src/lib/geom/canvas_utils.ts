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

const color = {
	point: 'grey',
	origin: 'red',
	reference: 'blue',
	mouse: 'yellow'
};

function point2canvas(px: number, py: number, cAdjust: tCanvasAdjust): [number, number] {
	const cx2 = cAdjust.shiftX + (px - cAdjust.xMin) * cAdjust.scaleX;
	const cy2 = cAdjust.shiftY + (py - cAdjust.yMin) * cAdjust.scaleY;
	return [cx2, cy2];
}

function canvas2point(cx: number, cy: number, cAdjust: tCanvasAdjust): [number, number] {
	const px2 = (cx - cAdjust.shiftX) / cAdjust.scaleX + cAdjust.xMin;
	const py2 = (cy - cAdjust.shiftY) / cAdjust.scaleY + cAdjust.yMin;
	return [px2, py2];
}

export type { tCanvasAdjust };
export { color, point2canvas, canvas2point };
