// [design]/+page.js

import { pageDef } from '$lib/design/circles';

export function load({ params }) {
	console.log(params);
	return {
		pageDef: pageDef
	};
}
