(self.webpackChunkWebsite=self.webpackChunkWebsite||[]).push([[8588],{8588:(t,n,i)=>{"use strict";i.r(n),i.d(n,{ion_ripple_effect:()=>o});var a=i(2322),e=i(7505);const o=class{constructor(t){(0,a.r)(this,t),this.type="bounded"}async addRipple(t,n){return new Promise(i=>{(0,a.f)(()=>{const e=this.el.getBoundingClientRect(),o=e.width,c=e.height,m=Math.sqrt(o*o+c*c),f=Math.max(c,o),d=this.unbounded?f:m+s,u=Math.floor(f*l),p=d/u;let b=t-e.left,h=n-e.top;this.unbounded&&(b=.5*o,h=.5*c);const w=b-.5*u,k=h-.5*u,y=.5*o-b,g=.5*c-h;(0,a.c)(()=>{const t=document.createElement("div");t.classList.add("ripple-effect");const n=t.style;n.top=k+"px",n.left=w+"px",n.width=n.height=u+"px",n.setProperty("--final-scale",`${p}`),n.setProperty("--translate-end",`${y}px, ${g}px`),(this.el.shadowRoot||this.el).appendChild(t),setTimeout(()=>{i(()=>{r(t)})},325)})})})}get unbounded(){return"unbounded"===this.type}render(){const t=(0,e.b)(this);return(0,a.h)(a.H,{role:"presentation",class:{[t]:!0,unbounded:this.unbounded}})}get el(){return(0,a.i)(this)}},r=t=>{t.classList.add("fade-out"),setTimeout(()=>{t.remove()},200)},s=10,l=.5;o.style=":host{left:0;right:0;top:0;bottom:0;position:absolute;contain:strict;pointer-events:none}:host(.unbounded){contain:layout size style}.ripple-effect{border-radius:50%;position:absolute;background-color:currentColor;color:inherit;contain:strict;opacity:0;-webkit-animation:225ms rippleAnimation forwards, 75ms fadeInAnimation forwards;animation:225ms rippleAnimation forwards, 75ms fadeInAnimation forwards;will-change:transform, opacity;pointer-events:none}.fade-out{-webkit-transform:translate(var(--translate-end)) scale(var(--final-scale, 1));transform:translate(var(--translate-end)) scale(var(--final-scale, 1));-webkit-animation:150ms fadeOutAnimation forwards;animation:150ms fadeOutAnimation forwards}@-webkit-keyframes rippleAnimation{from{-webkit-animation-timing-function:cubic-bezier(0.4, 0, 0.2, 1);animation-timing-function:cubic-bezier(0.4, 0, 0.2, 1);-webkit-transform:scale(1);transform:scale(1)}to{-webkit-transform:translate(var(--translate-end)) scale(var(--final-scale, 1));transform:translate(var(--translate-end)) scale(var(--final-scale, 1))}}@keyframes rippleAnimation{from{-webkit-animation-timing-function:cubic-bezier(0.4, 0, 0.2, 1);animation-timing-function:cubic-bezier(0.4, 0, 0.2, 1);-webkit-transform:scale(1);transform:scale(1)}to{-webkit-transform:translate(var(--translate-end)) scale(var(--final-scale, 1));transform:translate(var(--translate-end)) scale(var(--final-scale, 1))}}@-webkit-keyframes fadeInAnimation{from{-webkit-animation-timing-function:linear;animation-timing-function:linear;opacity:0}to{opacity:0.16}}@keyframes fadeInAnimation{from{-webkit-animation-timing-function:linear;animation-timing-function:linear;opacity:0}to{opacity:0.16}}@-webkit-keyframes fadeOutAnimation{from{-webkit-animation-timing-function:linear;animation-timing-function:linear;opacity:0.16}to{opacity:0}}@keyframes fadeOutAnimation{from{-webkit-animation-timing-function:linear;animation-timing-function:linear;opacity:0.16}to{opacity:0}}"}}]);