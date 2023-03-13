// canvas_utils.ts
// helper interfaces and functions to work with HtmlCanvas
// used by euclid2d.ts, segment.ts, contour.ts and assemblage.ts

interface CanvasAdjust {
	oX: number;
	oY: number;
	scaleX: number;
	scaleY: number;
}

const colorCanvasPoint = 'grey';

export type { CanvasAdjust };
export { colorCanvasPoint };
