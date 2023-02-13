<script lang="ts">
	import { base } from '$app/paths';
</script>

<header>
	<h1>Parametrix</h1>
	<article>2D parametric designs</article>
</header>
<nav>
	<a href="{base}/">Index</a>
	<a href="{base}/rough">Rough</a>
	<a href="{base}/circles">Circles</a>
	<a href="{base}/about">About</a>
</nav>

<main>
	<slot />
</main>

<footer>
	<ul>
		<li><a href="https://github.com/charlyoleg/parametrix">Github repo</a></li>
		<li><a href="https://charlyoleg.github.io/parametrix/">Github page</a></li>
	</ul>
</footer>

<style lang="scss">
	@use '$lib/style/colors.scss';

	:global(body) {
		font-family: 'Lucida Console', 'Monaco', 'Verdana';
	}
	header {
		background-color: colors.$frame;
	}
	header > h1 {
		color: colors.$header-title;
		size: 3em;
	}
	header > article {
		color: colors.$header-subtile;
		size: 1em;
	}
	nav {
		background-color: colors.$frame;
	}
	nav > a {
		color: colors.$menu;
	}
	main {
		background-color: colors.$main;
	}
	footer {
		background-color: colors.$frame;
	}
	footer > ul > li > a {
		color: colors.$footer;
	}
</style>
