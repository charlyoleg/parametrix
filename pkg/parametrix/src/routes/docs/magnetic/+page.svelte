<script lang="ts">
	import { base } from '$app/paths';
</script>

<h1>Magnetic circuit</h1>
<article>
	In this page, we study several magnetic circuits in order to modelize the reluctance motor.
</article>
<h2>The reluctance motor</h2>
<article>
	Advantages of the reluctance motor:
	<ul>
		<li>no permanent magnet</li>
		<li>consists mostly of soft iron and wiring</li>
		<li>simple mechanics</li>
		<li>also efficient at high speed</li>
		<li>only limited by the electrical power source and electrical switching speed</li>
	</ul>
	Disadvantages of the reluctance motor:
	<ul>
		<li>Advanced electronics</li>
		<li>Requires current sensors and position sensor</li>
	</ul>
</article>
<h2>Magnetic circuits</h2>
<h3>Physical laws</h3>
<article>
	F = Ni
</article>
<h3>Regular torus</h3>
<article>
	<img src="{base}/regular_torus.svg" alt="regular torus" />
</article>
<h3>Torus with swelling</h3>
<article>
	<img src="{base}/torus_with_swelling.svg" alt="torus with swelling" />
</article>
<h3>Torus with air gap</h3>
<article>
	<img src="{base}/torus_with_air_gap.svg" alt="torus with air gap" />
</article>
<h3>Torus with shuttle</h3>
<article>
	<img src="{base}/torus_with_shuttle.svg" alt="torus with shuttle" />
	<img src="{base}/top_view_of_air_gap_and_shuttle.svg" alt="top view of air gap and shuttle" />
</article>
<h3>Torus with realistic shuttle</h3>
<article>
	<img src="{base}/torus_with_realistic_shuttle.svg" alt="torus with a realistic shuttle" />
</article>

<style lang="scss">
	@use '$lib/style/colors.scss';

	h1 {
		margin: 1rem;
	}
	article {
		margin: 1rem;
	}
</style>
