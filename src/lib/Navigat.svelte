<script lang="ts">
	//import type { HTMLAttributes } from 'svelte/elements';
	//type $$Props = HTMLAttributes<HTMLElement>;

	import { checkEmptyPath, findMenuMenu } from '$lib/menuList';
	import Navig from '$lib/Navig.svelte';

	import { page } from '$app/stores';
	import { base } from '$app/paths';
	const pagePath: string = checkEmptyPath($page.url.pathname.replace(base, ''));
</script>

<Navig menuList={findMenuMenu(pagePath)} menuSelected={pagePath} />
