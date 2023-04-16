// triangle_utils.ts
// some functions around triangle
// triangle_utils.ts dependences on angle_utils.ts

/* right triangle
 *	sides: la [hypothenuse], lb, lc
 *	angles: aA [right angle], aB, aC
 * */

function rightTriLaFromLbLc(ilb: number, ilc: number): number {
	return Math.sqrt(ilb ** 2 + ilc ** 2);
}

/* any triangle */

/* export */

export { rightTriLaFromLbLc };
