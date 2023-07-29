<script lang="ts">
	//import type { tMParams, tRParams, tSubInst, tSubDesign } from 'geometrix';
	import type { tSubDesign } from 'geometrix';
	//import { PType } from 'geometrix';
	//import { onMount, createEventDispatcher } from 'svelte';
	//import { browser } from '$app/environment';
	//import { page } from '$app/stores';
	import { base } from '$app/paths';

	export let subD: tSubDesign = {};

	let subInsts: string[] = [];
	$: subInsts = Object.keys(subD);
</script>

<section>
	<h2>Sub-design</h2>
	<p>Number of sub-instances: {subInsts.length}</p>
	{#each subInsts as subInst}
		<p>
			Instance: {subInst} ::
			<a href="{base}/gear/{subD[subInst].partName}">{subD[subInst].partName}</a>
			Export Constraints
		</p>
	{/each}
</section>

<style lang="scss">
	@use '$lib/style/colors.scss';
	@use '$lib/style/styling.scss';

	section > h2 {
		@include styling.mix-h2;
	}
</style>
