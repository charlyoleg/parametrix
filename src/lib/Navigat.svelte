<script lang="ts">
	//import type { HTMLAttributes } from 'svelte/elements';
	//type $$Props = HTMLAttributes<HTMLElement>;

	import { findMenuMenu } from '$lib/menuList';
	import Navig from '$lib/Navig.svelte';

	import { page } from '$app/stores';
	const pagePath: string = $page.url.pathname.split('/').slice(-1)[0];
</script>

<Navig menuList={findMenuMenu(pagePath)} menuSelected={pagePath} />
