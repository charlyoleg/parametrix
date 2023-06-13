// wheelElements.ts

import type { tContour } from '$lib/geom/figure';
import { contour, contourCircle, point, ffix } from '$lib/geom/figure';

function axisTorque(
	cx: number,
	cy: number,
	axisRadius: number,
	ribNb: number,
	ribWidth: number,
	ribHeight: number,
	ribRound1: number,
	ribRound2: number,
	initAngle: number
): tContour {
	let rCtr: tContour = contourCircle(cx, cy, axisRadius);
	if (ribNb > 0) {
		if (ribWidth > 2 * axisRadius) {
			throw `err383: axisTorque ribWidth ${ffix(ribWidth)} larger than 2x axisRadius ${ffix(
				axisRadius
			)}`;
		}
		const aRibW2 = Math.asin(ribWidth / (2 * axisRadius));
		const aPeriod = (2 * Math.PI) / ribNb;
		if (aPeriod - 2.5 * aRibW2 < 0) {
			throw `err384: axisTorque ribWidth ${ffix(ribWidth)} or ribNb ${ribNb} are too large`;
		}
		if (ribRound1 > ribWidth / 2) {
			throw `err385: axisTorque ribRound1 ${ffix(
				ribRound1
			)} too large compare to ribWidth ${ffix(ribWidth)}`;
		}
		if (ribRound1 + ribRound2 > ribHeight) {
			throw `err386: axisTorque ribRound12 ${ffix(ribRound1)} ${ffix(
				ribRound2
			)} too large compare to ribHeight ${ffix(ribWidth)}`;
		}
		const arcLarge = aPeriod - 2 * aRibW2 > Math.PI ? true : false;
		const pt0 = point(cx, cy);
		const pt0z = pt0.translatePolar(initAngle, axisRadius + ribHeight);
		const pt0b = pt0z.translatePolar(initAngle + Math.PI / 2, ribWidth / 2);
		rCtr = contour(pt0b.cx, pt0b.cy);
		for (let i = 0; i < ribNb; i++) {
			const ribDir1 = initAngle + i * aPeriod;
			const ribDir2 = initAngle + (i + 1) * aPeriod;
			const pt2 = pt0.translatePolar(ribDir1 + aRibW2, axisRadius);
			const pt3 = pt0.translatePolar(ribDir2 - aRibW2, axisRadius);
			const pt1z = pt0.translatePolar(ribDir1, axisRadius + ribHeight);
			const pt1 = pt1z.translatePolar(ribDir1 + Math.PI / 2, ribWidth / 2);
			const pt4z = pt0.translatePolar(ribDir2, axisRadius + ribHeight);
			const pt4 = pt4z.translatePolar(ribDir2 - Math.PI / 2, ribWidth / 2);
			rCtr.addSegStrokeA(pt1.cx, pt1.cy).addCornerRounded(ribRound1);
			rCtr.addSegStrokeA(pt2.cx, pt2.cy).addCornerRounded(ribRound2);
			rCtr.addPointA(pt3.cx, pt3.cy)
				.addSegArc(axisRadius, arcLarge, true)
				.addCornerRounded(ribRound2);
			rCtr.addSegStrokeA(pt4.cx, pt4.cy).addCornerRounded(ribRound1);
		}
		rCtr.closeSegStroke();
	}
	return rCtr;
}

function hollowStraight(
	cx: number,
	cy: number,
	hollowExt: number,
	hollowInt: number,
	spokeNb: number,
	spokeWidth: number,
	spokeRound: number,
	initAngle: number
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
