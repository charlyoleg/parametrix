// [design]/+page.js

import { error } from '@sveltejs/kit';
import { pageDef as circlesDef } from '$lib/design/circles';

import type { tPageDef } from '$lib/design/aaParamGeom';
type tAllPageDef = { [index: string]: tPageDef };

const designDefs: tAllPageDef = {
	circles: circlesDef,
	rough: circlesDef
};

export function load({ params }) {
	console.log(params);
	if (Object.keys(designDefs).includes(params.design)) {
		return {
			pageDef: designDefs[params.design]
		};
	}
	throw error(404, 'Design undefined!');
}
