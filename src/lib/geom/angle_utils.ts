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
		ra += 2 * Math.PI;
	}
	return ra;
}

function withinPiPi(ia: number) {
	const ra = ia % Math.PI;
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
	const ra = ia % (Math.PI / 2);
	return ra;
}

/* export */

export { degToRad, radToDeg, roundZero, withinZero2Pi, withinPiPi, withinZeroPi, withinHPiHPi };
