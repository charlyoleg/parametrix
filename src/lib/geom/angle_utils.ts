// angle_utils.ts
// some useful functions manipulating angles
// angle_utils.ts has no dependency

/* utils for angles */

function degToRad(degrees: number): number {
	return degrees * (Math.PI / 180);
}

function radToDeg(rad: number): number {
	return rad / (Math.PI / 180);
}

function roundZero(ix: number): number {
	let rx = ix;
	if (Math.abs(rx) < 10 ** -4) {
		rx = 0;
	}
	return rx;
}

function withinZero2Pi(ia: number) {
	let ra = ia % (2 * Math.PI);
	if (ra < 0) {
		//console.log(`dbg026: ${ra}`);
		ra += 2 * Math.PI;
	}
	return ra;
}

function withinPiPi(ia: number) {
	let ra = withinZero2Pi(ia);
	if (ra > Math.PI) {
		ra -= 2 * Math.PI;
	}
	return ra;
}

function withinZeroPi(ia: number) {
	let ra = ia % Math.PI;
	if (ra < 0) {
		ra += Math.PI;
	}
	return ra;
}

function withinHPiHPi(ia: number) {
	let ra = withinZeroPi(ia);
	if (ra > Math.PI / 2) {
		ra -= Math.PI;
	}
	return ra;
}

function orientedArc(aStart: number, aStop: number, ccw: boolean) {
	const arc = withinPiPi(aStop) - withinPiPi(aStart);
	const arc2 = ccw ? withinZero2Pi(arc) : withinZero2Pi(arc) - 2 * Math.PI;
	return arc2;
}

function isWithin(aNew: number, aStart: number, aStop: number, ccw: boolean) {
	const arcOrig = orientedArc(aStart, aStop, ccw);
	const arcNew = orientedArc(aStart, aNew, ccw);
	let rYes = true;
	if (Math.abs(arcNew) > Math.abs(arcOrig)) {
		rYes = false;
	}
	return rYes;
}

/* export */

export { degToRad, radToDeg, roundZero, withinZero2Pi, withinPiPi, withinZeroPi, withinHPiHPi, orientedArc, isWithin };
