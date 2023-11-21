(()=>{"use strict";var e,t={401:(e,t,n)=>{const r=window.wp.blocks,a=window.React,l=window.wp.blockEditor,o=window.wp.components,c=window.wp.element,i=window.wp.i18n,d=window.wp.primitives,s=(0,a.createElement)(d.SVG,{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24"},(0,a.createElement)(d.Path,{d:"M5 10.2h-.8v1.5H5c1.9 0 3.8.8 5.1 2.1 1.4 1.4 2.1 3.2 2.1 5.1v.8h1.5V19c0-2.3-.9-4.5-2.6-6.2-1.6-1.6-3.8-2.6-6.1-2.6zm10.4-1.6C12.6 5.8 8.9 4.2 5 4.2h-.8v1.5H5c3.5 0 6.9 1.4 9.4 3.9s3.9 5.8 3.9 9.4v.8h1.5V19c0-3.9-1.6-7.6-4.4-10.4zM4 20h3v-3H4v3z"})),m=(0,a.createElement)(d.SVG,{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24"},(0,a.createElement)(d.Path,{d:"m19 7-3-3-8.5 8.5-1 4 4-1L19 7Zm-7 11.5H5V20h7v-1.5Z"})),p=window.wp.serverSideRender;var u=n.n(p);const f=JSON.parse('{"u2":"feedland/feedviewer"}');(0,r.registerBlockType)(f.u2,{edit:function({attributes:e,setAttributes:t}){const[n,r]=(0,c.useState)(!(e.screenname&&e.category)),{displayDate:d,displayExcerpt:p,excerptLength:f,screenname:_,category:w,itemsToShow:v}=e;function h(n){return()=>{const r=e[n];t({[n]:!r})}}const g=(0,l.useBlockProps)();if(n)return(0,a.createElement)("div",{...g},(0,a.createElement)(o.Placeholder,{icon:s,label:"FeedLand"},(0,a.createElement)("form",{onSubmit:function(e){e.preventDefault(),_&&w&&(t({screenname:_,category:w}),r(!1))},className:"wp-block-feedland-feedviewer__placeholder-form"},(0,a.createElement)(o.__experimentalHStack,{wrap:!0},(0,a.createElement)(o.__experimentalInputControl,{__next40pxDefaultSize:!0,placeholder:(0,i.__)("Enter screenname here…","feedland"),value:_,onChange:e=>t({screenname:e}),className:"wp-block-feedland-feedviewer__placeholder-input"}),(0,a.createElement)(o.__experimentalInputControl,{__next40pxDefaultSize:!0,placeholder:(0,i.__)("Enter category here…","feedland"),value:w,onChange:e=>t({category:e}),className:"wp-block-feedland-feedviewer__placeholder-input"}),(0,a.createElement)(o.Button,{__next40pxDefaultSize:!0,variant:"primary",type:"submit"},(0,i.__)("Done","feedland"))))));const x=[{icon:m,title:(0,i.__)("Edit category and screenname","feedland"),onClick:()=>r(!0)}];return(0,a.createElement)(a.Fragment,null,(0,a.createElement)(l.BlockControls,null,(0,a.createElement)(o.ToolbarGroup,{controls:x})),(0,a.createElement)(l.InspectorControls,null,(0,a.createElement)(o.PanelBody,{title:(0,i.__)("Settings","feedland")},(0,a.createElement)(o.RangeControl,{__nextHasNoMarginBottom:!0,__next40pxDefaultSize:!0,label:(0,i.__)("Number of items","feedland"),value:v,onChange:e=>t({itemsToShow:e}),min:1,max:20,required:!0}),(0,a.createElement)(o.ToggleControl,{__nextHasNoMarginBottom:!0,label:(0,i.__)("Display date","feedland"),checked:d,onChange:h("displayDate")}),(0,a.createElement)(o.ToggleControl,{__nextHasNoMarginBottom:!0,label:(0,i.__)("Display excerpt","feedland"),checked:p,onChange:h("displayExcerpt")}),p&&(0,a.createElement)(o.RangeControl,{__nextHasNoMarginBottom:!0,__next40pxDefaultSize:!0,label:(0,i.__)("Max number of words in excerpt","feedland"),value:f,onChange:e=>t({excerptLength:e}),min:10,max:100,required:!0}))),(0,a.createElement)("div",{...g},(0,a.createElement)(o.Disabled,null,(0,a.createElement)(u(),{block:"feedland/feedviewer",attributes:e}))))}})}},n={};function r(e){var a=n[e];if(void 0!==a)return a.exports;var l=n[e]={exports:{}};return t[e](l,l.exports,r),l.exports}r.m=t,e=[],r.O=(t,n,a,l)=>{if(!n){var o=1/0;for(s=0;s<e.length;s++){for(var[n,a,l]=e[s],c=!0,i=0;i<n.length;i++)(!1&l||o>=l)&&Object.keys(r.O).every((e=>r.O[e](n[i])))?n.splice(i--,1):(c=!1,l<o&&(o=l));if(c){e.splice(s--,1);var d=a();void 0!==d&&(t=d)}}return t}l=l||0;for(var s=e.length;s>0&&e[s-1][2]>l;s--)e[s]=e[s-1];e[s]=[n,a,l]},r.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return r.d(t,{a:t}),t},r.d=(e,t)=>{for(var n in t)r.o(t,n)&&!r.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},r.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),(()=>{var e={163:0,388:0};r.O.j=t=>0===e[t];var t=(t,n)=>{var a,l,[o,c,i]=n,d=0;if(o.some((t=>0!==e[t]))){for(a in c)r.o(c,a)&&(r.m[a]=c[a]);if(i)var s=i(r)}for(t&&t(n);d<o.length;d++)l=o[d],r.o(e,l)&&e[l]&&e[l][0](),e[l]=0;return r.O(s)},n=globalThis.webpackChunkfeedland=globalThis.webpackChunkfeedland||[];n.forEach(t.bind(null,0)),n.push=t.bind(null,n.push.bind(n))})();var a=r.O(void 0,[388],(()=>r(401)));a=r.O(a)})();