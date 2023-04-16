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

/* export */

export { degToRad, radToDeg, roundZero };
