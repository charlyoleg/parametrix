// [design]/+page.js

import { designDefs } from '$lib/menuList';
import { error } from '@sveltejs/kit';

export function load({ params }) {
	//console.log(params);
	if (Object.keys(designDefs).includes(params.design)) {
		return {
			pageDef: designDefs[params.design]
		};
	}
	throw error(404, 'Design undefined!');
}
