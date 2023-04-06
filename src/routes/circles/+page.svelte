<script lang="ts">
	import ParamDrawExport from '$lib/ParamDrawExport.svelte';
	import { pTitle, pDescription, pDef, geom } from '$lib/design/circles';
</script>

<h1>{pTitle}</h1>
<article>{pDescription}</article>
<ParamDrawExport {pDef} {geom} />

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
