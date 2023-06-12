// wheelElements.ts

import type { tContour } from '$lib/geom/figure';
//import { contour, contourCircle, point } from '$lib/geom/figure';
import { contourCircle } from '$lib/geom/figure';

function axisTorque(
	cx: number,
	cy: number,
	axisRadius: number,
	ribNb: number,
	ribWidth: number,
	ribHeight: number,
	ribRound1: number,
	ribRound2: number
): tContour {
	const rCtr = contourCircle(cx, cy, axisRadius);
	return rCtr;
}

function hollowStraight(
	cx: number,
	cy: number,
	hollowExt: number,
	hollowInt: number,
	spokeNb: number,
	spokeWidth: number,
	spokeRound: number
): Array<tContour> {
	const rACtr = [contourCircle(cx, cy, hollowExt), contourCircle(cx, cy, hollowInt)];
	return rACtr;
}
function hollowStraightArea(
	cx: number,
	cy: number,
	hollowExt: number,
	hollowInt: number,
	spokeNb: number,
	spokeWidth: number,
	spokeRound: number
): number {
	const rArea = cx + cy + hollowExt + hollowInt + spokeNb + spokeWidth + spokeRound;
	return rArea;
}

export { axisTorque, hollowStraight, hollowStraightArea };
