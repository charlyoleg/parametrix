<script lang="ts">
	import { menuFirst } from '$lib/menuList.js';
	import Navig from '$lib/Navig.svelte';

	import CadEcosystem from '$lib/CadEcosystem.svelte';
</script>

<Navig slot="navig" menuList={menuFirst} />

<h2>About Parametrix</h2>
<article>
	Parametrix is a serie of web-pages, which generate two dimentional graphics that can be exported
	as <a href="https://www.w3.org/Graphics/SVG/">SVG</a> or
	<a href="https://en.wikipedia.org/wiki/AutoCAD_DXF">DXF</a>. After extruding the 2D face into a
	3D model, the solid can be exported as
	<a href="https://en.wikipedia.org/wiki/ISO_10303-21">STEP</a>,
	<a href="https://dev.opencascade.org/doc/overview/html/specification__brep_format.html">BRep</a>
	or <a href="https://en.wikipedia.org/wiki/STL_(file_format)">STL</a>. Those files can then be
	used in CAD applications, like
	<a href="https://wiki.freecad.org/Manual:Import_and_export_to_other_filetypes">FreeCAD</a>.
</article>
<article>
	Below a list of open-source CAD software sorted by family of technologies.
	<CadEcosystem />
</article>

<style lang="scss">
	@use '$lib/style/colors.scss';

	h2 {
		margin: 1rem;
	}
	article {
		margin: 1rem;
	}
</style>
