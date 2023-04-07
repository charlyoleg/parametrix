// [design]/+page.js

import { pageDef } from '$lib/design/circles';

export function load({ params }) {
	return {
		pageDef: pageDef
	};
}
