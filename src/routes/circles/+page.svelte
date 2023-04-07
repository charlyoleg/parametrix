<script lang="ts">
	import ParamDrawExport from '$lib/ParamDrawExport.svelte';
	import { pageDef } from '$lib/design/circles';
</script>

<h1>{pageDef.pTitle}</h1>
<article>{pageDef.pDescription}</article>
<ParamDrawExport pDef={pageDef.pDef} geom={pageDef.pGeom} />

<style lang="scss">
	@use '$lib/style/colors.scss';

	h1 {
		margin: 1rem 1rem 0;
	}
	article {
		font-size: 1rem;
		font-weight: 400;
		font-style: italic;
		margin: 0 1rem 2rem;
	}
</style>
