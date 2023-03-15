<script lang="ts">
	import Navigat from '$lib/Navigat.svelte';
	import { base } from '$app/paths';
</script>

<Navigat />
<h2>Index of 2D parametrics designs</h2>
<ul>
	<li><a href="{base}/rough">Rough</a></li>
	<li><a href="{base}/circles">Circles</a></li>
	<li><a href="{base}/about">About</a></li>
</ul>

<style>
	h2 {
		margin: 0;
	}
</style>
