// [design]/+page.js

import { designDefs } from '$lib/menuList';
import { error } from '@sveltejs/kit';

export function load({ params }) {
	//console.log(params);
	const re = /^.*\//g;
	const short = params.design.replace(re, '');
	if (Object.keys(designDefs).includes(short)) {
		return {
			pageDef: designDefs[short]
		};
	}
	throw error(404, 'Design undefined!');
}
