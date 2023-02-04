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
