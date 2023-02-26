<ul>
	<li class="list-header">Open CAD Ecosystem</li>
	<li>
		<input type="checkbox" id="toggle_2d" class="toggle" checked />
		<div class="arrow" />
		<label for="toggle_2d" class="label">2D drawing</label>
		<ul class="nested">
			<li>
				<a href="https://librecad.org/">LibreCAD</a>
				<small>A community fork of QCAD 2.0</small>
			</li>
			<li>
				<a href="https://github.com/qcad/qcad">QCAD</a>
				<small>QCAD 3.0, also available as a commercial product</small>
			</li>
			<li>
				<a href="https://inkscape.org/">Inkscape</a>
				<small>Vector drawing for artists, but can be hacked for technical drawing</small>
			</li>
			<li>
				<a href="https://github.com/VVS1864/SAMoCAD">SAMoCAD</a>
				<small>An unmaintained python2/OpenGL tool</small>
			</li>
		</ul>
	</li>
	<li>
		<input type="checkbox" id="toggle_3d" class="toggle" checked />
		<div class="arrow" />
		<label for="toggle_3d" class="label">3D drawing</label>
		<ul class="nested">
			<li><a href="https://www.opengl.org/">OpenGL</a></li>
			<li><a href="https://www.gcad3d.org/">gCAD3D</a></li>
			<li><a href="https://www.cgal.org/">CGAL</a></li>
			<li><a href="https://ocjs.org/">OpenCascade.js</a></li>
			<li><a href="https://github.com/jscad/OpenJSCAD.org">OpenJsCAD</a></li>
			<li><a href="https://www.freecad.org/">FreeCAD</a></li>
			<li><a href="https://solvespace.com/">SolveSpace</a></li>
			<li><a href="https://librecad.org/">LibreCAD</a></li>
			<li><a href="https://inkscape.org/">Inkscape</a></li>
			<li><a href="https://cadquery.readthedocs.io">CadQuery</a></li>
			<li><a href="https://github.com/tpaviot/pythonocc-core">PythonOCC</a></li>
			<li><a href="https://openscad.org/">OpenSCAD</a></li>
		</ul>
	</li>
</ul>

<style lang="scss">
	@use '$lib/style/colors.scss';

	ul {
		list-style-type: none;
		margin: 0;
		padding: 0;
	}
	ul.nested {
		padding-left: 2rem;
		display: none;
	}
	input.toggle:checked ~ ul.nested {
		display: block;
	}
	input.toggle {
		display: none;
	}
	$arrow-size: 0.4rem;
	div.arrow {
		display: inline-block;
		width: 0;
		height: 0;
		border-top: $arrow-size solid transparent;
		border-bottom: $arrow-size solid transparent;
		border-left: (1.8 * $arrow-size) solid DarkOrange;
		margin-left: 0.5rem;
	}
	input.toggle:checked ~ div.arrow {
		border-left: $arrow-size solid transparent;
		border-right: $arrow-size solid transparent;
		border-top: (1.8 * $arrow-size) solid colors.$arrow;
		border-bottom: 0;
	}
	li.list-header {
		font-size: 1rem;
		font-weight: bold;
		margin-top: 0.2rem;
		margin-bottom: 0.2rem;
	}
	li > a {
		color: colors.$link;
		text-decoration: none;
	}
	li > small {
		font-size: 0.8rem;
		margin-left: 0.8rem;
	}
</style>
