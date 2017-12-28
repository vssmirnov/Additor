!function(t){function e(i){if(n[i])return n[i].exports;var o=n[i]={i:i,l:!1,exports:{}};return t[i].call(o.exports,o,o.exports,e),o.l=!0,o.exports}var n={};e.m=t,e.c=n,e.d=function(t,n,i){e.o(t,n)||Object.defineProperty(t,n,{configurable:!1,enumerable:!0,get:i})},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="",e(e.s=44)}([function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});e.default=function t(e){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),e=e||{},this.min=e.min,this.max=e.max,this.enum=e.enum,this.transform=e.transform}},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=function(){function t(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}return function(e,n,i){return n&&t(e.prototype,n),i&&t(e,i),e}}(),o=function(t){return t&&t.__esModule?t:{default:t}}(n(0)),r=function(){function t(e){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.constraintMap=[[]],this._parseMap(e,this.constraintMap[0],this.constraintMap)}return i(t,[{key:"constrain",value:function(t){var e=this;e.constraintMap.forEach(function(n){e._constrainBranch(t,n)})}},{key:"_applyConstraint",value:function(t,e,n){return void 0!==e.min&&(t[n]=Math.max(t[n],e.min)),void 0!==e.max&&(t[n]=Math.min(t[n],e.max)),void 0!==e.enum&&e.enum instanceof Array&&(t[n]=void 0!==e.enum.find(t[n])?t[n]:e.enum[0]),void 0!==e.transform&&"function"==typeof e.transform&&(t[n]=e.transform(t[n])),t}},{key:"_parseMap",value:function(t,e,n){var i=this;if(t instanceof Array)e.push("_arr_"),i._parseMap(t[0],e,n);else if(t instanceof Object&&!(t instanceof o.default)){var r=e.map(function(t){return t});Object.keys(t).forEach(function(o,a){if(0===a)e.push(o),i._parseMap(t[o],e,n);else{var s=r.map(function(t){return t});n.push(s),s.push(o),i._parseMap(t[o],s,n)}})}else t instanceof o.default&&e.push(t)}},{key:"_constrainBranch",value:function(t,e){for(var n=void 0,i=e[e.length-1],o=!1,r=0;r<e.length-2&&!o;++r)if("_arr_"===(n=e[r])){o=!0;for(var a=e.slice(r+1,e.length),s=0;s<t.length;++s)this._constrainBranch(t[s],a)}else t=t[n];if(!o)if("_arr_"===(n=e[e.length-2]))for(var u=0;u<t.length;++u)this._applyConstraint(t,i,u);else this._applyConstraint(t,i,n)}}]),t}();e.default=r},function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=function(){function t(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}return function(e,n,i){return n&&t(e.prototype,n),i&&t(e,i),e}}(),r=i(n(9)),a=i(n(10)),s=i(n(11)),u=i(n(12)),c=function(){function t(e,n){if(function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),void 0===e||!(e instanceof Element))throw new Error("widget requires a DOM element specifying its container as the first argument");this.container=e,n=n||{},this.svg=document.createElementNS(this.SVG_NS,"svg"),this.container.appendChild(this.svg),this.svg.setAttribute("width",this.container.getBoundingClientRect().width),this.svg.setAttribute("height",this.container.getBoundingClientRect().height),this.o={},this.svgEls={},this.handlers={},this.state={},this.stateConstraints={},this.observers=[],this._initOptions(n),this._initStateConstraints(),this._initState(),this._initSvgEls(),this._initHandlers()}return o(t,[{key:"_initOptions",value:function(t){}},{key:"_initStateConstraints",value:function(){}},{key:"_initState",value:function(){}},{key:"_initSvgEls",value:function(){}},{key:"_appendSvgEls",value:function(){function t(n){n instanceof Array?n.forEach(function(e){return t(e)}):(e.svg.appendChild(n),n.setAttribute("shape-rendering","geometricPrecision"))}var e=this;Object.values(e.svgEls).forEach(function(e){t(e)})}},{key:"_initHandlers",value:function(){}},{key:"_update",value:function(){}},{key:"getVal",value:function(){}},{key:"setInternalVal",value:function(t){}},{key:"setVal",value:function(t){}},{key:"getState",value:function(){}},{key:"setInternalState",value:function(t){}},{key:"setState",value:function(t){}},{key:"_getRelativeX",value:function(t){return t-this._getLeft()}},{key:"_getRelativeY",value:function(t){return t-this._getTop()}},{key:"_getWidth",value:function(){return this.svg.getBoundingClientRect().width}},{key:"_getHeight",value:function(){return this.svg.getBoundingClientRect().height}},{key:"_getTop",value:function(){return this.svg.getBoundingClientRect().top}},{key:"_getLeft",value:function(){return this.svg.getBoundingClientRect().left}}]),t}();Object.assign(c.prototype,r.default),Object.assign(c.prototype,a.default),Object.assign(c.prototype,s.default),Object.assign(c.prototype,u.default),e.default=c},function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=function(){function t(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}return function(e,n,i){return n&&t(e.prototype,n),i&&t(e,i),e}}(),r=function t(e,n,i){null===e&&(e=Function.prototype);var o=Object.getOwnPropertyDescriptor(e,n);if(void 0===o){var r=Object.getPrototypeOf(e);return null===r?void 0:t(r,n,i)}if("value"in o)return o.value;var a=o.get;if(void 0!==a)return a.call(i)},a=i(n(2)),s=i(n(0)),u=i(n(1)),c=i(n(4)),l=function(t){function e(t,n){return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,e),function(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}(this,(e.__proto__||Object.getPrototypeOf(e)).call(this,t,n))}return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}(e,a.default),o(e,[{key:"getVal",value:function(){return this.state.val}},{key:"setInternalVal",value:function(t){this.setInternalState({val:t})}},{key:"setVal",value:function(t){this.setState({val:t})}},{key:"setOptions",value:function(t){r(e.prototype.__proto__||Object.getPrototypeOf(e.prototype),"setOptions",this).call(this,t),this.o.stepPrecision=c.default.getPrecision(this.o.stepInterval)}},{key:"_initOptions",value:function(t){this.o={minVal:0,maxVal:127,stepInterval:1,needleColor:"#414141",activeColor:"#f40",mouseSensitivity:1.2},r(e.prototype.__proto__||Object.getPrototypeOf(e.prototype),"_initOptions",this).call(this,t),this.o.stepPrecision=c.default.getPrecision(this.o.stepInterval)}},{key:"_initStateConstraints",value:function(){var t=this;this.stateConstraints=new u.default({val:new s.default({min:t.o.minVal,max:t.o.maxVal,transform:function(e){return c.default.quantize(e,t.o.stepInterval,t.o.stepPrecision)}})})}},{key:"_initState",value:function(){this.state={val:0}}},{key:"_initSvgEls",value:function(){this.svgEls={bgArc:document.createElementNS(this.SVG_NS,"path"),activeArc:document.createElementNS(this.SVG_NS,"path"),needle:document.createElementNS(this.SVG_NS,"line")},this.svgEls.bgArc.setAttribute("d",this._calcSvgArcPath(this._calcNeedleCenter().x,this._calcNeedleCenter().y,this._calcDialRadius(),.67*Math.PI,2.35*Math.PI)),this.svgEls.bgArc.setAttribute("stroke-width",this._calcArcStrokeWidth()),this.svgEls.bgArc.setAttribute("stroke",this.o.needleColor),this.svgEls.bgArc.setAttribute("fill","transparent"),this.svgEls.bgArc.setAttribute("stroke-linecap","round"),this.svgEls.activeArc.setAttribute("stroke-width",this._calcArcStrokeWidth()),this.svgEls.activeArc.setAttribute("stroke",this.o.activeColor),this.svgEls.activeArc.setAttribute("fill","transparent"),this.svgEls.activeArc.setAttribute("stroke-linecap","round"),this.svgEls.needle.setAttribute("x1",this._calcNeedleCenter().x),this.svgEls.needle.setAttribute("y1",this._calcNeedleCenter().y),this.svgEls.needle.setAttribute("x2",this._calcNeedleEnd().x),this.svgEls.needle.setAttribute("y2",this._calcNeedleEnd().y),this.svgEls.needle.setAttribute("stroke-width",this._calcNeedleWidth()),this.svgEls.needle.setAttribute("stroke",this.o.needleColor),this.svgEls.needle.setAttribute("z-index","1000"),this.svgEls.needle.setAttribute("stroke-linecap","round"),this._appendSvgEls(),this._update()}},{key:"_initHandlers",value:function(){var t=this,e=0,n=0,i=t.getState().val;this.handlers={touch:function(n){e=n.clientY,document.addEventListener("mousemove",t.handlers.move),document.addEventListener("touchmove",t.handlers.move),document.addEventListener("mouseup",t.handlers.release),document.addEventListener("touchend",t.handlers.release)},move:function(o){o.preventDefault(),n=e-o.clientY,e=o.clientY,i=t.state.val+n*t.o.mouseSensitivity*t._calcMovePrecision(),i=Math.max(i,t.o.minVal),i=Math.min(i,t.o.maxVal),t.setState({val:i})},release:function(){document.removeEventListener("mousemove",t.handlers.move),document.removeEventListener("touchmove",t.handlers.move)}},this.svg.addEventListener("mousedown",t.handlers.touch),this.svg.addEventListener("touchstart",t.handlers.touch)}},{key:"_update",value:function(){this.svgEls.needle.setAttribute("x1",this._calcNeedleCenter().x),this.svgEls.needle.setAttribute("y1",this._calcNeedleCenter().y),this.svgEls.needle.setAttribute("x2",this._calcNeedleEnd().x),this.svgEls.needle.setAttribute("y2",this._calcNeedleEnd().y),this.svgEls.activeArc.setAttribute("d",this._calcSvgArcPath(this._calcNeedleCenter().x,this._calcNeedleCenter().y,this._calcDialRadius(),.65*Math.PI,this._calcNeedleAngle()-.5*Math.PI)),this.state.val===this.o.minVal?this.svgEls.activeArc.setAttribute("stroke",this.o.needleColor):this.svgEls.activeArc.setAttribute("stroke",this.o.activeColor)}},{key:"_calcArcStrokeWidth",value:function(){return this._calcDialRadius()/5}},{key:"_calcDialRadius",value:function(){var t=Math.min(this._getWidth(),this._getHeight())/2*.89;return t=Math.trunc(t)}},{key:"_calcNeedleAngle",value:function(){return this.o.maxVal-this.o.minVal!=0?(this.state.val-this.o.minVal)/(this.o.maxVal-this.o.minVal)*(1.7*Math.PI)+1.15*Math.PI:1.7*Math.PI*.5+1.15*Math.PI}},{key:"_calcNeedleCenter",value:function(){return{x:Math.trunc(this._getWidth()/2),y:Math.trunc(this._getHeight()/2)}}},{key:"_calcNeedleEnd",value:function(){return{x:this._calcNeedleCenter().x+Math.sin(this._calcNeedleAngle())*this._calcDialRadius(),y:this._calcNeedleCenter().y-Math.cos(this._calcNeedleAngle())*this._calcDialRadius()}}},{key:"_calcNeedleWidth",value:function(){return this._calcDialRadius()/5}},{key:"_calcSvgArcPath",value:function(t,e,n,i,o){var r=t+n*Math.cos(i),a=e+n*Math.sin(i),s=t+n*Math.cos(o),u=e+n*Math.sin(o);return["M",r,a,"A",n,n,0,o-i<Math.PI?0:1,(Math.PI,1),s,u].join(" ")}},{key:"_calcMovePrecision",value:function(){return(this.o.maxVal-this.o.minVal)/127}}]),e}();e.default=l},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i={getPrecision:function(t){var e=(""+t).split(".")[1];return e?e.length:0},round:function(t,e){var n=Math.pow(10,e);return Math.round(t*n)/n},quantize:function(t,e,n){var o=void 0;return 0==e?0:(e<0&&(e=Math.abs(e)),o=~~(t/e)*e,o=Math.abs(t-o)>e/2?o>0?o+e:o-e:o,void 0!==n&&(o=i.round(o,n)),o)},q:function(t,e,n){return i.quantize(t,e,n)}};e.default=i},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i={midiToFreq:function(t,e){e=e||440;var n=-1;return-1!==t&&(n=440*Math.pow(2,(t-69)/12)),n},noteNameToMidi:function(t){var e=/^([a-g]|[A-G])(#|b)?([0-9]|10)$/;if(!1===e.test(t))return console.log("AudioModuleUtil.noteNameToMidi: invalid note name format"),-1;var n=e.exec(t),i=n[1],o=n[2],r=n[3],a={A:9,a:9,B:11,b:11,C:0,c:0,D:2,d:2,E:4,e:4,F:5,f:5,G:7,g:7}[i];"#"===o?a++:"b"===o&&a--;return a+12*r},noteNameToFreq:function(t,e){return e=e||440,i.midiToFreq(i.noteNameToMidi(t),e)}};e.default=i},function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=function(){function t(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}return function(e,n,i){return n&&t(e.prototype,n),i&&t(e,i),e}}(),r=(i(n(5)),i(n(15))),a=function(){function t(e,n,i){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.audioCtx=e,this.isAudioModule=!0,"function"!=typeof this.audioCtx.webAudioConnect&&(0,r.default)(this.audioCtx),this.input=e.createGain(),this.output=e.createGain(),this.audioComponents={},this._initAudioComponents()}return o(t,[{key:"_initAudioComponents",value:function(){}},{key:"getContext",value:function(){return this.audioCtx}},{key:"connect",value:function(t,e,n){!0===t.isAudioModule?this.output.connect(t._input):this.output.connect(t)}},{key:"disconnect",value:function(t,e,n){!0===t.isAudioModule?this.output.disconnect(t._audioModuleInput):this.output.disconnect(t)}}]),t}();e.default=a},,,function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});e.default={SVG_NS:"http://www.w3.org/2000/svg"}},function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});i(n(0)),i(n(1));var o={getState:function(){return Object.assign({},this.state)},setInternalState:function(t){var e=this,n=!1;return t=t||this.getState(),Object.keys(t).forEach(function(i){e.state.hasOwnProperty(i)&&e.state[i]!==t[i]&&(e.state[i]=t[i],n=!0)}),e.stateConstraints.constrain(e.state),this._update(),n},setState:function(t){var e=!1;return e=this.setInternalState(t),this._notifyObservers(),e}};e.default=o},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i={_initOptions:function(t){var e=this;t=t||{},Object.keys(t).forEach(function(n){e.o.hasOwnProperty(n)&&e.o[n]!==t[n]&&(e.o[n]=t[n])})},getOptions:function(){return Object.assign({},this.o)},setOptions:function(t){var e=this;t=t||{};var n=!1;return Object.keys(t).forEach(function(i){e.o.hasOwnProperty(i)&&e.o[i]!==t[i]&&(e.o[i]=t[i],n=!0)}),n&&this.setState(),n}};e.default=i},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});e.default={addObserver:function(t){var e=!1;return this.observers.find(function(e){return e===t})||(this.observers.push(t),e=!0),e},removeObserver:function(t){var e=this,n=!1;return this.observers.forEach(function(i,o){i===t&&(e.observers.splice(o,1),n=!0)}),n},_notifyObservers:function(){var t=this;this.observers.forEach(function(e){return e(t.getVal())})}}},,,function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=function(t){var e=Object.getPrototypeOf(Object.getPrototypeOf(t.createGain()));e.webAudioConnect=e.connect,e.webAudioDisconnect=e.disconnect,e.connect=function(t,e,n){!0===t.isAudioModule?this.webAudioConnect(t.input,e,n):this.webAudioConnect(t,e,n)},e.disconnect=function(t,e,n){!0===t.isAudioModule?this.webAudioDisconnect(t.input,e,n):this.webAudioDisconnect(t,e,n)}}},,,,,,,,,,,,,,,,,,,,,,,,,,,,,function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}i(n(6));var o=i(n(45)),r=i(n(3)),a=new AudioContext,s=a.destination;!function(){a.createStereoPanner=function(){return new o.default(a)};var t=a.createStereoPanner(),e=a.createOscillator(),n=a.createGain();e.connect(t),t.connect(n),n.connect(s),n.gain.value=0,e.frequency.value=220,e.start();new r.default(document.getElementById("pan-dial"),{minVal:-1,maxVal:1,stepInterval:.01}).addObserver(function(e){t.pan.value=e}),document.getElementById("stereo-panner-audio-toggle").addEventListener("change",function(t){t.target.checked?n.gain.value=.5:n.gain.value=0})}()},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=function(){function t(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}return function(e,n,i){return n&&t(e.prototype,n),i&&t(e,i),e}}(),o=function(t){return t&&t.__esModule?t:{default:t}}(n(6)),r=function(t){function e(t){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,e);var n=function(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}(this,(e.__proto__||Object.getPrototypeOf(e)).call(this,t)),i=n;return function t(e){i.pan=new Number(e),Object.defineProperty(i.pan,"value",{set:function(e){e=(e=e>1?1:e)<-1?-1:e,i.audioComponents.gainL.gain.value=-e/2+.5,i.audioComponents.gainR.gain.value=e/2+.5,t(e)}})}(),n}return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}(e,o.default),i(e,[{key:"_initAudioComponents",value:function(){this.audioComponents={gainL:this.audioCtx.createGain(),gainR:this.audioCtx.createGain(),merger:this.audioCtx.createChannelMerger(2)},this.input.connect(this.audioComponents.gainL),this.input.connect(this.audioComponents.gainR),this.audioComponents.gainL.connect(this.audioComponents.merger,0,0),this.audioComponents.gainR.connect(this.audioComponents.merger,0,1),this.audioComponents.merger.connect(this.output)}}]),e}();e.default=r}]);