import{s as D,f as p,a as d,g as u,r as m,c as g,j as f,i as l,u as _,d as o}from"../chunks/scheduler.f047f8ca.js";import{S as b,i as A}from"../chunks/index.11b8e362.js";function y(C){let t,w="About Parametrix",n,i,x=`Parametrix is a library for programmatic CAD including a web-ui. It displays two dimentional
	graphics for adjusting parameters. It runs a simple programmatic 2D simulation. And it exports
	the design as <a href="https://www.w3.org/Graphics/SVG/">SVG</a> or
	<a href="https://en.wikipedia.org/wiki/AutoCAD_DXF">DXF</a>. After extruding the 2D face into a
	3D model, the solid can be exported as
	<a href="https://en.wikipedia.org/wiki/ISO_10303-21">STEP</a>,
	<a href="https://dev.opencascade.org/doc/overview/html/specification__brep_format.html">BRep</a>
	or <a href="https://en.wikipedia.org/wiki/STL_(file_format)">STL</a>. Those files can then be
	used in CAD applications, like
	<a href="https://wiki.freecad.org/Manual:Import_and_export_to_other_filetypes">FreeCAD</a>.`,c,a,v=`Parametrix is a lightweight programmatic CAD solution like
	<a href="https://maker.js.org">maker.js</a>, <a href="https://openscad.org/">OpenSCAD</a>
	or <a href="https://mirmik.github.io/zencad/en/index.html">ZenCAD</a> but with the following
	particularities:
	<ul><li>Only 2D engine but with a preparation of 3D scripts for futur extrapolation with other
			tools</li> <li>Limited on purpose to strokes and arcs to ease the integration with CAM tools and
			numeric fabrication</li> <li>Programmatic 2D simulation for early feedback</li> <li>Rework of cornes (rounded, widened and wide-access)</li></ul>`,h,r,k=`Discover further <i>Parametrix</i> with those following links:
	<ul><li><a href="https://github.com/charlyoleg/parametrix">Source code</a></li> <li><a href="https://charlyoleg.github.io/parametrix/">Public instance</a></li> <li><a href="https://charlyoleg.github.io/parametrix/docs/readme">Installation instructions</a></li> <li><a href="https://charlyoleg.github.io/parametrix/docs/concept">Documentation</a></li></ul>`;return{c(){t=p("h1"),t.textContent=w,n=d(),i=p("article"),i.innerHTML=x,c=d(),a=p("article"),a.innerHTML=v,h=d(),r=p("article"),r.innerHTML=k,this.h()},l(e){t=u(e,"H1",{class:!0,"data-svelte-h":!0}),m(t)!=="svelte-lzjywg"&&(t.textContent=w),n=g(e),i=u(e,"ARTICLE",{class:!0,"data-svelte-h":!0}),m(i)!=="svelte-1kph7ur"&&(i.innerHTML=x),c=g(e),a=u(e,"ARTICLE",{class:!0,"data-svelte-h":!0}),m(a)!=="svelte-dar7go"&&(a.innerHTML=v),h=g(e),r=u(e,"ARTICLE",{class:!0,"data-svelte-h":!0}),m(r)!=="svelte-akrz7u"&&(r.innerHTML=k),this.h()},h(){f(t,"class","svelte-e371e7"),f(i,"class","svelte-e371e7"),f(a,"class","svelte-e371e7"),f(r,"class","svelte-e371e7")},m(e,s){l(e,t,s),l(e,n,s),l(e,i,s),l(e,c,s),l(e,a,s),l(e,h,s),l(e,r,s)},p:_,i:_,o:_,d(e){e&&(o(t),o(n),o(i),o(c),o(a),o(h),o(r))}}}class S extends b{constructor(t){super(),A(this,t,null,y,D,{})}}export{S as component};
