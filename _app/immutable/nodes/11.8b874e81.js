import{s as ct,f as i,a as u,g as n,r as a,c as r,j as v,i as l,u as J,d as s}from"../chunks/scheduler.f047f8ca.js";import{S as vt,i as xt}from"../chunks/index.11b8e362.js";import{b as I}from"../chunks/paths.688c58e7.js";function Ct(rt){let c,K="Magnetic circuit",g,x,O="In this page, we study several magnetic circuits in order to modelize the reluctance motor.",E,p,Q="The reluctance motor",d,C,U=`Advantages of the reluctance motor:
	<ul><li>no permanent magnet</li> <li>consists mostly of soft iron and wiring</li> <li>simple mechanics</li> <li>also efficient at high speed</li> <li>only limited by the electrical power source and electrical switching speed</li></ul>
	Disadvantages of the reluctance motor:
	<ul><li>Advanced electronics</li> <li>Requires current sensors and position sensor</li></ul>`,$,T,V="Magnetic circuits",b,H,W="Physical laws",q,_,X="F = Ni",k,L,Y="Regular torus",z,h,Z=`<img src="${I}/regular_torus.svg" alt="regular torus"/>`,j,M,tt="Torus with swelling",P,o,et=`<img src="${I}/torus_with_swelling.svg" alt="torus with swelling"/>`,S,A,lt="Torus with air gap",D,f,st=`<img src="${I}/torus_with_air_gap.svg" alt="torus with air gap"/>`,F,R,it="Torus with shuttle",N,m,nt=`<img src="${I}/torus_with_shuttle.svg" alt="torus with shuttle"/> <img src="${I}/top_view_of_air_gap_and_shuttle.svg" alt="top view of air gap and shuttle"/>`,B,y,at="Torus with realistic shuttle",G,w,ut=`<img src="${I}/torus_with_realistic_shuttle.svg" alt="torus with a realistic shuttle"/>`;return{c(){c=i("h1"),c.textContent=K,g=u(),x=i("article"),x.textContent=O,E=u(),p=i("h2"),p.textContent=Q,d=u(),C=i("article"),C.innerHTML=U,$=u(),T=i("h2"),T.textContent=V,b=u(),H=i("h3"),H.textContent=W,q=u(),_=i("article"),_.textContent=X,k=u(),L=i("h3"),L.textContent=Y,z=u(),h=i("article"),h.innerHTML=Z,j=u(),M=i("h3"),M.textContent=tt,P=u(),o=i("article"),o.innerHTML=et,S=u(),A=i("h3"),A.textContent=lt,D=u(),f=i("article"),f.innerHTML=st,F=u(),R=i("h3"),R.textContent=it,N=u(),m=i("article"),m.innerHTML=nt,B=u(),y=i("h3"),y.textContent=at,G=u(),w=i("article"),w.innerHTML=ut,this.h()},l(t){c=n(t,"H1",{class:!0,"data-svelte-h":!0}),a(c)!=="svelte-162vin1"&&(c.textContent=K),g=r(t),x=n(t,"ARTICLE",{class:!0,"data-svelte-h":!0}),a(x)!=="svelte-1r9wx5h"&&(x.textContent=O),E=r(t),p=n(t,"H2",{"data-svelte-h":!0}),a(p)!=="svelte-1rt4ock"&&(p.textContent=Q),d=r(t),C=n(t,"ARTICLE",{class:!0,"data-svelte-h":!0}),a(C)!=="svelte-1xxx1n6"&&(C.innerHTML=U),$=r(t),T=n(t,"H2",{"data-svelte-h":!0}),a(T)!=="svelte-fn2sq8"&&(T.textContent=V),b=r(t),H=n(t,"H3",{"data-svelte-h":!0}),a(H)!=="svelte-j22ocw"&&(H.textContent=W),q=r(t),_=n(t,"ARTICLE",{class:!0,"data-svelte-h":!0}),a(_)!=="svelte-1x5afvv"&&(_.textContent=X),k=r(t),L=n(t,"H3",{"data-svelte-h":!0}),a(L)!=="svelte-9lvmqh"&&(L.textContent=Y),z=r(t),h=n(t,"ARTICLE",{class:!0,"data-svelte-h":!0}),a(h)!=="svelte-ztzc81"&&(h.innerHTML=Z),j=r(t),M=n(t,"H3",{"data-svelte-h":!0}),a(M)!=="svelte-kw8hw0"&&(M.textContent=tt),P=r(t),o=n(t,"ARTICLE",{class:!0,"data-svelte-h":!0}),a(o)!=="svelte-o8gy62"&&(o.innerHTML=et),S=r(t),A=n(t,"H3",{"data-svelte-h":!0}),a(A)!=="svelte-12s38xb"&&(A.textContent=lt),D=r(t),f=n(t,"ARTICLE",{class:!0,"data-svelte-h":!0}),a(f)!=="svelte-3dcut7"&&(f.innerHTML=st),F=r(t),R=n(t,"H3",{"data-svelte-h":!0}),a(R)!=="svelte-ukchfe"&&(R.textContent=it),N=r(t),m=n(t,"ARTICLE",{class:!0,"data-svelte-h":!0}),a(m)!=="svelte-1i13tte"&&(m.innerHTML=nt),B=r(t),y=n(t,"H3",{"data-svelte-h":!0}),a(y)!=="svelte-1wxwau6"&&(y.textContent=at),G=r(t),w=n(t,"ARTICLE",{class:!0,"data-svelte-h":!0}),a(w)!=="svelte-1xof02c"&&(w.innerHTML=ut),this.h()},h(){v(c,"class","svelte-e371e7"),v(x,"class","svelte-e371e7"),v(C,"class","svelte-e371e7"),v(_,"class","svelte-e371e7"),v(h,"class","svelte-e371e7"),v(o,"class","svelte-e371e7"),v(f,"class","svelte-e371e7"),v(m,"class","svelte-e371e7"),v(w,"class","svelte-e371e7")},m(t,e){l(t,c,e),l(t,g,e),l(t,x,e),l(t,E,e),l(t,p,e),l(t,d,e),l(t,C,e),l(t,$,e),l(t,T,e),l(t,b,e),l(t,H,e),l(t,q,e),l(t,_,e),l(t,k,e),l(t,L,e),l(t,z,e),l(t,h,e),l(t,j,e),l(t,M,e),l(t,P,e),l(t,o,e),l(t,S,e),l(t,A,e),l(t,D,e),l(t,f,e),l(t,F,e),l(t,R,e),l(t,N,e),l(t,m,e),l(t,B,e),l(t,y,e),l(t,G,e),l(t,w,e)},p:J,i:J,o:J,d(t){t&&(s(c),s(g),s(x),s(E),s(p),s(d),s(C),s($),s(T),s(b),s(H),s(q),s(_),s(k),s(L),s(z),s(h),s(j),s(M),s(P),s(o),s(S),s(A),s(D),s(f),s(F),s(R),s(N),s(m),s(B),s(y),s(G),s(w))}}}class ft extends vt{constructor(c){super(),xt(this,c,null,Ct,ct,{})}}export{ft as component};
