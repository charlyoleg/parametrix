<script lang="ts">
	//import type { tMParams, tRParams, tSubInst, tSubDesign } from 'geometrix';
	import type { tSubDesign } from 'geometrix';
	//import { PType } from 'geometrix';
	//import { onMount, createEventDispatcher } from 'svelte';
	//import { browser } from '$app/environment';
	//import { page } from '$app/stores';
	//import { base } from '$app/paths';

	export let subD: tSubDesign = {};
</script>

<section>
	<h2>Sub-design</h2>
	<p>Number of sub-instances: {Object.keys(subD).length}</p>
</section>

<style lang="scss">
	@use '$lib/style/colors.scss';
	@use '$lib/style/styling.scss';

	section > h2 {
		@include styling.mix-h2;
	}
</style>
