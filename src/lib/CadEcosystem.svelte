<ul>
	<li class="list-header">Open CAD Ecosystem</li>
	<li>
		<input type="checkbox" id="toggle_2d" class="toggle" checked />
		<label for="toggle_2d" class="label"
			><div class="arrow" />
			2D drawing</label
		>
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
		<label for="toggle_3d" class="label"
			><div class="arrow" />
			3D drawing</label
		>
		<ul class="nested">
			<li>Libraries for 3D engine</li>
			<li>
				<input type="checkbox" id="toggle_opengl" class="toggle" checked />
				<label for="toggle_opengl" class="label"
					><div class="arrow" />
					OpenGL</label
				>
				<a href="https://www.opengl.org/">OpenGL.org</a>
				<small>The rendering library of Khronos</small>
				<ul class="nested">
					<li>
						<a href="https://www.gcad3d.org/">gCAD3D</a>
						<small>The lightweight 3D modeling based on GTK and OpenGL</small>
					</li>
				</ul>
			</li>
			<li>
				<input type="checkbox" id="toggle_cgal" class="toggle" checked />
				<label for="toggle_cgal" class="label"
					><div class="arrow" />
					CGAL</label
				>
				<a href="https://www.cgal.org/">CGAL.org</a>
				<small
					>The C++ Computational Geometry Algorithms Library founded by European research
					instituts</small
				>
				<ul class="nested">
					<li>
						<a href="https://openscad.org/">OpenSCAD</a>
						<small>A pioneer scripting tool for 3D modeling</small>
						<ul class="nested sub">
							<li>
								<a href="https://github.com/janssen86/OpenSCAD-Getriebebibliothek"
									>OpenSCAD Gear</a
								>
								<small>Gear generator based on OpenSCAD</small>
							</li>
						</ul>
					</li>
				</ul>
			</li>
			<li>
				<input type="checkbox" id="toggle_occ" class="toggle" checked />
				<label for="toggle_occ" class="label"
					><div class="arrow" />
					OpenCascade</label
				>
				<a href="https://dev.opencascade.org/">OpenCascade.org</a>
				<small
					>The world famous open source 3D modeling library originated from France</small
				>
				<ul class="nested">
					<li>
						<a href="https://www.freecad.org/">FreeCAD</a>
						<small>Powerful GUI based on Qt</small>
					</li>
					<li>
						<a href="https://solvespace.com/">SolveSpace</a>
						<small>Light weight GUI based on GTK</small>
					</li>
					<li>
						<a href="https://github.com/tpaviot/pythonocc-core">pythonOCC</a>
						<small>Python binding of OpenCascade based on SWIG</small>
						<ul class="nested sub">
							<li>
								<a href="https://github.com/e-dub/pygear">pythonOCC Gear</a>
								<small>Gear generator based on pythonOCC</small>
							</li>
							<li>
								<a href="https://mirmik.github.io/zencad/en/index.html">ZenCAD</a>
								<small
									>A python library for parametric 3D modeling based on pythonOCC</small
								>
							</li>
						</ul>
					</li>
					<li>
						<a href="https://github.com/trelau/pyOCCT">pyOCCT</a>
						<small>Python binding of OpenCascade based on pybind11</small>
					</li>
					<li>
						<a href="https://cadquery.readthedocs.io">CadQuery</a>
						<small
							>Python module based on OpenCascade for building parametric 3D CAD
							models</small
						>
						<ul class="nested sub">
							<li>
								<a href="https://github.com/meadiode/cq_gears">CQ Gear</a>
								<small>Gear generator based on CadQuery</small>
							</li>
							<li>
								<a href="https://github.com/michaelgale/cq-kit">CQ Kit</a>
								<small>Helper python library for CadQuery</small>
							</li>
						</ul>
					</li>
					<li>
						<a href="https://ocjs.org/">OpenCascade.js</a>
						<small
							>Port of the OpenCascade CAD library to JavaScript and WebAssembly via
							Emscripten</small
						>
						<ul class="nested sub">
							<li>
								<a href="https://github.com/sgenoud/replicad">Replicad</a>
								<small>A js-scripting library for 3D modeling</small>
							</li>
							<li>
								<a href="https://github.com/zalo/CascadeStudio">CascadeStudio</a>
								<small>A web UI for 3D modeling</small>
							</li>
							<li>
								<a href="https://github.com/ArchiyouApp/archiyou-core"
									>Archiyou-core</a
								>
								<small>An other js-scripting library for 3D modeling</small>
							</li>
						</ul>
					</li>
				</ul>
			</li>
			<li><a href="https://github.com/jscad/OpenJSCAD.org">OpenJsCAD</a></li>
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
	ul.nested.sub {
		display: block;
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
	input.toggle:checked ~ label > div.arrow {
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
