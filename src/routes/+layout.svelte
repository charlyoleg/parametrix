<script lang="ts">
	import { base } from '$app/paths';
	import Garland from '$lib/Garland.svelte';
</script>

<header>
	<section>
		<img class="img1" src="{base}/favicon.svg" alt="Parametrix's logo" />
		<h1>Parametrix</h1>
		<img class="img2 img-suite" src="{base}/favicon.svg" alt="Parametrix's logo" />
		<img class="img3 img-suite" src="{base}/favicon.svg" alt="Parametrix's logo" />
		<img class="img4 img-suite" src="{base}/favicon.svg" alt="Parametrix's logo" />
		<img class="img5 img-suite" src="{base}/favicon.svg" alt="Parametrix's logo" />
	</section>
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
	<Garland />
	<ul>
		<li class="footer-title">Parametrix</li>
		<li><a href="https://github.com/charlyoleg/parametrix">Github repo</a></li>
		<li><a href="https://charlyoleg.github.io/parametrix/">Github page</a></li>
	</ul>
	<Garland />
	<ul>
		<li class="footer-title">Friends</li>
		<li><a href="https://www.freecad.org/">FreeCAD</a></li>
		<li><a href="https://openscad.org/">OpenSCAD</a></li>
		<li><a href="https://librecad.org/">LibreCAD</a></li>
		<li><a href="https://solvespace.com/">SolveSpace</a></li>
		<li><a href="https://inkscape.org/">Inkscape</a></li>
		<li><a href="https://cadquery.readthedocs.io">CadQuery</a></li>
		<li><a href="https://github.com/tpaviot/pythonocc-core">PythonOCC</a></li>
	</ul>
	<Garland />
	<ul>
		<li class="footer-title">Inspirations</li>
		<li><a href="https://github.com/devbisme/skidl">SKiDL</a></li>
		<li><a href="https://www.myhdl.org/">MyHDL</a></li>
	</ul>
	<Garland />
	<ul>
		<li class="footer-title">Miscellaneous</li>
		<li><a href="https://pythonhosted.org/Cnc25D/">cnc25D</a></li>
		<li><a href="https://phydemo.app/ray-optics/">Ray Optics Simulation</a></li>
	</ul>
	<Garland />
</footer>

<style lang="scss">
	@use '$lib/style/colors.scss';

	:global(body) {
		font-family: 'Lucida Console', 'Monaco', 'Verdana';
		margin: 0;
	}
	header {
		background-color: colors.$header-bg;
	}
	header > section {
		display: flex;
		align-items: center;
		padding-left: 1rem;
	}
	header > section > h1 {
		color: colors.$header-title;
		font-size: 3rem;
		margin: 0;
		margin-right: 0.5rem;
	}
	header > section > img {
		margin: 0.1rem;
		transition: transform 0.5s;
	}
	header > section > img.img-suite {
		margin-left: 0.4rem;
		margin-right: 0.4rem;
	}
	header > section > img.img1 {
		width: 3rem;
		height: 3rem;
	}
	header > section > img.img1:hover {
		transform: scale(1.3);
	}
	header > section > img.img2 {
		width: 2rem;
		height: 2rem;
	}
	header > section > img.img2:hover {
		transform: scale(1.3) rotate(45deg);
	}
	header > section > img.img3 {
		width: 1.6rem;
		height: 1.6rem;
	}
	header > section > img.img3:hover {
		transform: scaleX(1.5);
	}
	header > section > img.img4 {
		width: 2.5rem;
		height: 2.5rem;
	}
	header > section > img.img4:hover {
		transform: scaleY(1.5);
	}
	header > section > img.img5 {
		width: 1.5rem;
		height: 1.5rem;
	}
	header > section > img.img5:hover {
		transform: scale(1.3) rotate(-45deg);
	}
	header > article {
		color: colors.$header-subtitle;
		font-size: 1rem;
		padding-left: 5rem;
	}
	nav {
		background-color: colors.$header-bg;
		padding: 0.3rem;
		padding-top: 0.8rem;
	}
	nav > a {
		color: colors.$menu;
		background-color: colors.$menu-back;
		text-decoration: none;
		padding-left: 0.3rem;
		padding-right: 0.3rem;
		border-style: solid;
		border-width: 0.2rem;
		border-radius: 0.6rem;
		border-color: colors.$menu-border;
	}
	nav > a:hover {
		color: colors.$menu-hover;
	}
	main {
		background-color: colors.$main-bg;
		min-height: 70vh;
	}
	footer {
		background-color: colors.$footer-bg;
		padding-top: 1rem;
		padding-left: 5rem;
		padding-right: 5rem;
		padding-bottom: 5rem;
		min-height: 30vh;
		column-width: 16rem;
		column-gap: 2rem;
	}
	footer > ul {
		list-style-type: none;
		margin: 0;
		padding: 0;
	}
	footer > ul > li.footer-title {
		font-size: 1rem;
		font-weight: bold;
		margin-top: 1.2rem;
		margin-bottom: 0.2rem;
	}
	footer > ul > li > a {
		color: colors.$footer;
		text-decoration: none;
	}
</style>
