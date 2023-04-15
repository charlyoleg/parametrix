// geom_utils.ts
// some useful function foe 2D geometry
// geom_utils.ts has no dependency

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

type tPolar = [number, number]; // angle, distance

/* export */

export type { tPolar };
export { degToRad, radToDeg, roundZero };
