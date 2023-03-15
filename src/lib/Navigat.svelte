<script lang="ts">
	//import type { HTMLAttributes } from 'svelte/elements';
	//type $$Props = HTMLAttributes<HTMLElement>;

	import { getMenuMenu } from '$lib/menuList.js';
	import Navig from '$lib/Navig.svelte';
</script>

<Navig menuList={getMenuMenu()} />
