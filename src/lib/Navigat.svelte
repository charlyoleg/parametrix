<script lang="ts">
	//import type { HTMLAttributes } from 'svelte/elements';
	//type $$Props = HTMLAttributes<HTMLElement>;

	import { checkEmptyPath, findMenuMenu } from '$lib/menuList';
	import Navig from '$lib/Navig.svelte';

	import { page } from '$app/stores';
	import { base } from '$app/paths';
	let pagePath: string;
	$: pagePath = checkEmptyPath($page.url.pathname.replace(base, ''));
	let category: string;
	const re1 = /^\//;
	const re2 = /^.*\//g;
	$: {
		const shorty = pagePath.replace(re2, '');
		const re3 = new RegExp(`/*${shorty}`);
		category = pagePath.replace(re3, '').replace(re1, '');
	}
</script>

<Navig menuList={findMenuMenu(pagePath)} menuSelected={pagePath} {category} />
