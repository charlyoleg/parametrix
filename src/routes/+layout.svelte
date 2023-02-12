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
	$frame-color: #666699;
	//$frame-color: #666655;
	:global(body) {
		font-family: 'Lucida Console', 'Monaco', 'Verdana';
	}
	header {
		background-color: $frame-color;
	}
	header > h1 {
		color: red;
		size: 3em;
	}
	header > article {
		color: green;
		size: 1em;
	}
	nav {
		background-color: $frame-color;
	}
	nav > a {
		color: orange;
	}
	footer {
		background-color: $frame-color;
	}
	footer > ul > li > a {
		color: grey;
	}
</style>
