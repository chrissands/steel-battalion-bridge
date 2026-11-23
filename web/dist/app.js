(()=>{function l(t,e,o,r){var n=arguments.length,i=n<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,o):r,a;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(t,e,o,r);else for(var s=t.length-1;s>=0;s--)(a=t[s])&&(i=(n<3?a(i):n>3?a(e,o,i):a(e,o))||i);return n>3&&i&&Object.defineProperty(e,o,i),i}var Ct=class{constructor(e,o,r=!1){this.evaluate=e,this.policy=o,this.isVolatile=r}};var J;(function(t){t[t.needsArrayObservation=1101]="needsArrayObservation",t[t.onlySetDOMPolicyOnce=1201]="onlySetDOMPolicyOnce",t[t.bindingInnerHTMLRequiresTrustedTypes=1202]="bindingInnerHTMLRequiresTrustedTypes",t[t.twoWayBindingRequiresObservables=1203]="twoWayBindingRequiresObservables",t[t.hostBindingWithoutHost=1204]="hostBindingWithoutHost",t[t.unsupportedBindingBehavior=1205]="unsupportedBindingBehavior",t[t.directCallToHTMLTagNotAllowed=1206]="directCallToHTMLTagNotAllowed",t[t.onlySetTemplatePolicyOnce=1207]="onlySetTemplatePolicyOnce",t[t.cannotSetTemplatePolicyAfterCompilation=1208]="cannotSetTemplatePolicyAfterCompilation",t[t.blockedByDOMPolicy=1209]="blockedByDOMPolicy",t[t.invalidHydrationAttributeMarker=1210]="invalidHydrationAttributeMarker",t[t.duplicateRenderInstruction=1211]="duplicateRenderInstruction",t[t.missingElementDefinition=1401]="missingElementDefinition",t[t.noRegistrationForContext=1501]="noRegistrationForContext",t[t.noFactoryForResolver=1502]="noFactoryForResolver",t[t.invalidResolverStrategy=1503]="invalidResolverStrategy",t[t.cannotAutoregisterDependency=1504]="cannotAutoregisterDependency",t[t.cannotResolveKey=1505]="cannotResolveKey",t[t.cannotConstructNativeFunction=1506]="cannotConstructNativeFunction",t[t.cannotJITRegisterNonConstructor=1507]="cannotJITRegisterNonConstructor",t[t.cannotJITRegisterIntrinsic=1508]="cannotJITRegisterIntrinsic",t[t.cannotJITRegisterInterface=1509]="cannotJITRegisterInterface",t[t.invalidResolver=1510]="invalidResolver",t[t.invalidKey=1511]="invalidKey",t[t.noDefaultResolver=1512]="noDefaultResolver",t[t.cyclicDependency=1513]="cyclicDependency",t[t.connectUpdateRequiresController=1514]="connectUpdateRequiresController"})(J||(J={}));var rt=t=>typeof t=="function",Se=t=>typeof t=="string",Vi=()=>{};var eu=Object.create(null),ne={warn(t,e){},error(t,e){return new Error(`Error ${t}`)},addMessages(t){Object.assign(eu,t)}};var Wi=Object.freeze([]);function to(){let t=new Map;return Object.freeze({register(e){return t.has(e.type)?!1:(t.set(e.type,e),!0)},getByType(e){return t.get(e)},getForInstance(e){if(e!=null)return t.get(e.constructor)}})}function Sr(){let t=new WeakMap;return function(e){let o=t.get(e);if(o===void 0){let r=Reflect.getPrototypeOf(e);for(;o===void 0&&r!==null;)o=t.get(r),r=Reflect.getPrototypeOf(r);o=o===void 0?[]:o.slice(0),t.set(e,o)}return o}}function Fe(t){t.prototype.toJSON=Vi}var Br=class extends Ct{createObserver(){return this}bind(e){return this.evaluate(e.source,e.context)}};Fe(Br);function wr(t,e){return new Br(t,e)}var oo=class{constructor(e,o){this.sub1=void 0,this.sub2=void 0,this.spillover=void 0,this.subject=e,this.sub1=o}has(e){return this.spillover===void 0?this.sub1===e||this.sub2===e:this.spillover.indexOf(e)!==-1}subscribe(e){let o=this.spillover;if(o===void 0){if(this.has(e))return;if(this.sub1===void 0){this.sub1=e;return}if(this.sub2===void 0){this.sub2=e;return}this.spillover=[this.sub1,this.sub2,e],this.sub1=void 0,this.sub2=void 0}else o.indexOf(e)===-1&&o.push(e)}unsubscribe(e){let o=this.spillover;if(o===void 0)this.sub1===e?this.sub1=void 0:this.sub2===e&&(this.sub2=void 0);else{let r=o.indexOf(e);r!==-1&&o.splice(r,1)}}notify(e){let o=this.spillover,r=this.subject;if(o===void 0){let n=this.sub1,i=this.sub2;n!==void 0&&n.handleChange(r,e),i!==void 0&&i.handleChange(r,e)}else for(let n=0,i=o.length;n<i;++n)o[n].handleChange(r,e)}},ro=class{constructor(e){this.subscribers={},this.subjectSubscribers=null,this.subject=e}notify(e){var o,r;(o=this.subscribers[e])===null||o===void 0||o.notify(e),(r=this.subjectSubscribers)===null||r===void 0||r.notify(e)}subscribe(e,o){var r,n;let i;o?i=(r=this.subscribers[o])!==null&&r!==void 0?r:this.subscribers[o]=new oo(this.subject):i=(n=this.subjectSubscribers)!==null&&n!==void 0?n:this.subjectSubscribers=new oo(this.subject),i.subscribe(e)}unsubscribe(e,o){var r,n;o?(r=this.subscribers[o])===null||r===void 0||r.unsubscribe(e):(n=this.subjectSubscribers)===null||n===void 0||n.unsubscribe(e)}};var nt=[],En=[],tu=globalThis.requestAnimationFrame,Rn=!0;function ou(){if(En.length)throw En.shift()}function ru(t){try{t.call()}catch(e){if(Rn)En.push(e),setTimeout(ou,0);else throw nt.length=0,e}}function zn(){let e=0;for(;e<nt.length;)if(ru(nt[e]),e++,e>1024){for(let o=0,r=nt.length-e;o<r;o++)nt[o]=nt[o+e];nt.length-=e,e=0}nt.length=0}function ji(t){nt.push(t),nt.length<2&&(Rn?tu(zn):zn())}var L=Object.freeze({enqueue:ji,next:()=>new Promise(ji),process:zn,setMode:t=>Rn=t});var It=Object.freeze({unknown:void 0,coupled:1}),v=(()=>{let t=L.enqueue,e=/(:|&&|\|\||if|\?\.)/,o=new WeakMap,r,n=h=>{throw ne.error(J.needsArrayObservation)};function i(h){var u;let x=(u=h.$fastController)!==null&&u!==void 0?u:o.get(h);return x===void 0&&(Array.isArray(h)?x=n(h):o.set(h,x=new ro(h))),x}let a=Sr();class s{constructor(u){this.name=u,this.field=`_${u}`,this.callback=`${u}Changed`}getValue(u){return r!==void 0&&r.watch(u,this.name),u[this.field]}setValue(u,x){let N=this.field,D=u[N];if(D!==x){u[N]=x;let V=u[this.callback];rt(V)&&V.call(u,D,x),i(u).notify(this.name)}}}class d extends oo{constructor(u,x,N=!1){super(u,x),this.expression=u,this.isVolatileBinding=N,this.needsRefresh=!0,this.needsQueue=!0,this.isAsync=!0,this.first=this,this.last=null,this.propertySource=void 0,this.propertyName=void 0,this.notifier=void 0,this.next=void 0}setMode(u){this.isAsync=this.needsQueue=u}bind(u){let x=this.observe(u.source,u.context);return!u.isBound&&this.requiresUnbind(u)&&u.onUnbind(this),x}requiresUnbind(u){return u.sourceLifetime!==It.coupled||this.first!==this.last||this.first.propertySource!==u.source}unbind(u){this.dispose()}observe(u,x){this.needsRefresh&&this.last!==null&&this.dispose();let N=r;r=this.needsRefresh?this:void 0,this.needsRefresh=this.isVolatileBinding;let D;try{D=this.expression(u,x)}finally{r=N}return D}disconnect(){this.dispose()}dispose(){if(this.last!==null){let u=this.first;for(;u!==void 0;)u.notifier.unsubscribe(this,u.propertyName),u=u.next;this.last=null,this.needsRefresh=this.needsQueue=this.isAsync}}watch(u,x){let N=this.last,D=i(u),V=N===null?this.first:{};if(V.propertySource=u,V.propertyName=x,V.notifier=D,D.subscribe(this,x),N!==null){if(!this.needsRefresh){let Pe;r=void 0,Pe=N.propertySource[N.propertyName],r=this,u===Pe&&(this.needsRefresh=!0)}N.next=V}this.last=V}handleChange(){this.needsQueue?(this.needsQueue=!1,t(this)):this.isAsync||this.call()}call(){this.last!==null&&(this.needsQueue=this.isAsync,this.notify(this))}*records(){let u=this.first;for(;u!==void 0;)yield u,u=u.next}}return Fe(d),Object.freeze({setArrayObserverFactory(h){n=h},getNotifier:i,track(h,u){r&&r.watch(h,u)},trackVolatile(){r&&(r.needsRefresh=!0)},notify(h,u){i(h).notify(u)},defineProperty(h,u){Se(u)&&(u=new s(u)),a(h).push(u),Reflect.defineProperty(h,u.name,{enumerable:!0,get(){return u.getValue(this)},set(x){u.setValue(this,x)}})},getAccessors:a,binding(h,u,x=this.isVolatileBinding(h)){return new d(h,u,x)},isVolatileBinding(h){return e.test(h.toString())}})})();function k(t,e){v.defineProperty(t,e)}var Gi=(()=>{let t=null;return{get(){return t},set(e){t=e}}})(),ft=Object.freeze({default:{index:0,length:0,get event(){return ft.getEvent()},eventDetail(){return this.event.detail},eventTarget(){return this.event.target}},getEvent(){return Gi.get()},setEvent(t){Gi.set(t)}});var _n=class extends Ct{createObserver(e){return v.binding(this.evaluate,e,this.isVolatile)}};function Nr(t,e,o=v.isVolatileBinding(t)){return new _n(t,e,o)}var R=Object.freeze({none:0,attribute:1,booleanAttribute:2,property:3,content:4,tokenList:5,event:6});var nu=/^[\u0000-\u0020\u007F]+|[\u0000-\u0020\u007F]+$/g,iu=/[\u0000-\u0020\u007F]+/g,au=/^(?:javascript|vbscript|data):/;function Vn(t){return t.replace(nu,"")}function su(t){try{return decodeURIComponent(t)}catch{return t}}function lu(t){let e=Vn(t);for(let o=0;o<3;++o){let r=su(e);if(r===e)break;e=Vn(r)}return e=e.replace(iu,"").toLowerCase(),au.test(e)}function cu(t){let e=Vn(t);return lu(e)?"":e}function mt(t,e,o,r){return(n,i,a,...s)=>{a!=null&&(a=cu(`${a}`)),r(n,i,a,...s)}}function g(t,e,o,r){throw ne.error(J.blockedByDOMPolicy,{aspectName:o,tagName:t??"text"})}var du={"a.href":mt,"area.href":mt,"embed.src":g,"form.action":mt,"frame.src":mt,"iframe.src":mt,"iframe.srcdoc":g,"link.href":g,"object.data":g,"script.src":g,"script.text":g},uu={"button.formaction":mt,"input.formaction":mt,"object.codebase":g},pu={"button.formAction":mt,"input.formAction":mt,"object.codeBase":g,"script.innerText":g,"script.textContent":g,"style.innerText":g,"style.textContent":g};function hu(t,e,o){var r;let n=e===R.attribute?uu:e===R.property?pu:void 0;if(n){let i=`${t}.${o}`;return(r=n[i])!==null&&r!==void 0?r:du[i]}}var gu={onabort:g,onauxclick:g,onbeforeinput:g,onbeforematch:g,onblur:g,oncancel:g,oncanplay:g,oncanplaythrough:g,onchange:g,onclick:g,onclose:g,oncontextlost:g,oncontextmenu:g,oncontextrestored:g,oncopy:g,oncuechange:g,oncut:g,ondblclick:g,ondrag:g,ondragend:g,ondragenter:g,ondragleave:g,ondragover:g,ondragstart:g,ondrop:g,ondurationchange:g,onemptied:g,onended:g,onerror:g,onfocus:g,onformdata:g,oninput:g,oninvalid:g,onkeydown:g,onkeypress:g,onkeyup:g,onload:g,onloadeddata:g,onloadedmetadata:g,onloadstart:g,onmousedown:g,onmouseenter:g,onmouseleave:g,onmousemove:g,onmouseout:g,onmouseover:g,onmouseup:g,onpaste:g,onpause:g,onplay:g,onplaying:g,onprogress:g,onratechange:g,onreset:g,onresize:g,onscroll:g,onsecuritypolicyviolation:g,onseeked:g,onseeking:g,onselect:g,onslotchange:g,onstalled:g,onsubmit:g,onsuspend:g,ontimeupdate:g,ontoggle:g,onvolumechange:g,onwaiting:g,onwebkitanimationend:g,onwebkitanimationiteration:g,onwebkitanimationstart:g,onwebkittransitionend:g,onwheel:g};function fu(t,e){if(t===R.property&&e==="innerHTML")return g;if(t===R.attribute||t===R.property||t===R.event)return gu[e]}function Xi(t,e,o,r){var n;let i=(n=hu((t??"").toLowerCase(),e,o))!==null&&n!==void 0?n:fu(e,o);return i?i(t,e,o,r):r}var Ui=t=>t,mu=globalThis.trustedTypes?globalThis.trustedTypes.createPolicy("fast-html",{createHTML:Ui}):{createHTML:Ui},qi=Object.freeze({createHTML(t){return mu.createHTML(t)},protect:Xi}),Wn=qi,bt=Object.freeze({get policy(){return Wn},setPolicy(t){if(Wn!==qi)throw ne.error(J.onlySetDOMPolicyOnce);Wn=t},setAttribute(t,e,o){o==null?t.removeAttribute(e):t.setAttribute(e,o)},setBooleanAttribute(t,e,o){o?t.setAttribute(e,""):t.removeAttribute(e)}});var jn="boolean",Ki="reflect",no=Object.freeze({locate:Sr()}),Ji={toView(t){return t?"":null},fromView(t){return!!t}};function Yi(t){if(t==null)return null;let e=t*1;return isNaN(e)?null:e}var Mo={toView(t){let e=Yi(t);return e&&e.toString()},fromView:Yi},Oo=class t{constructor(e,o,r=o.toLowerCase(),n=Ki,i){this.guards=new Set,this.Owner=e,this.name=o,this.attribute=r,this.mode=n,this.converter=i,this.fieldName=`_${o}`,this.callbackName=`${o}Changed`,this.hasCallback=this.callbackName in e.prototype,n===jn&&i===void 0&&(this.converter=Ji)}setValue(e,o){let r=e[this.fieldName],n=this.converter;n!==void 0&&(o=n.fromView(o)),r!==o&&(e[this.fieldName]=o,this.tryReflectToAttribute(e),this.hasCallback&&e[this.callbackName](r,o),e.$fastController.notify(this.name))}getValue(e){return v.track(e,this.name),e[this.fieldName]}onAttributeChangedCallback(e,o){this.guards.has(e)||(this.guards.add(e),this.mode===jn?this.setValue(e,o!==null):this.setValue(e,o),this.guards.delete(e))}tryReflectToAttribute(e){let o=this.mode,r=this.guards;r.has(e)||o==="fromView"||L.enqueue(()=>{r.add(e);let n=e[this.fieldName];switch(o){case Ki:{let i=this.converter;bt.setAttribute(e,this.attribute,i!==void 0?i.toView(n):n);break}case jn:bt.setBooleanAttribute(e,this.attribute,n);break}r.delete(e)})}static collect(e,...o){let r=[];o.push(no.locate(e));for(let n=0,i=o.length;n<i;++n){let a=o[n];if(a!==void 0)for(let s=0,d=a.length;s<d;++s){let h=a[s];Se(h)?r.push(new t(e,h)):r.push(new t(e,h.property,h.attribute,h.mode,h.converter))}}return r}};function p(t,e){let o;function r(n,i){arguments.length>1&&(o.property=i),no.locate(n.constructor).push(o)}if(arguments.length>1){o={},r(t,e);return}return o=t===void 0?{}:t,r}var Gn;function Qi(t){return t.reduce((e,o)=>(o instanceof Te?e.push(...Qi(o.styles)):e.push(o),e),[])}var Te=class t{get strategy(){return this._strategy===null&&(Gn||t.setDefaultStrategy(t.supportsAdoptedStyleSheets?bu():xu()),this.withStrategy(Gn)),this._strategy}constructor(e){this.styles=e,this.targets=new WeakSet,this._strategy=null}addStylesTo(e){this.strategy.addStylesTo(e),this.targets.add(e)}removeStylesFrom(e){this.strategy.removeStylesFrom(e),this.targets.delete(e)}isAttachedTo(e){return this.targets.has(e)}withStrategy(e){return this._strategy=new e(Qi(this.styles)),this}static setDefaultStrategy(e){Gn=e}static normalize(e){return e===void 0?void 0:Array.isArray(e)?new t(e):e instanceof t?e:new t([e])}};Te.supportsAdoptedStyleSheets=Array.isArray(document.adoptedStyleSheets)&&"replace"in CSSStyleSheet.prototype;function bu(){let t=new Map;return class{constructor(o){this.sheets=o.map(r=>{if(r instanceof CSSStyleSheet)return r;let n=t.get(r);return n===void 0&&(n=new CSSStyleSheet,n.replaceSync(r),t.set(r,n)),n})}addStylesTo(o){let r=o;r.adoptedStyleSheets=[...r.adoptedStyleSheets,...this.sheets]}removeStylesFrom(o){let r=o;r.adoptedStyleSheets=r.adoptedStyleSheets.filter(n=>this.sheets.indexOf(n)===-1)}}}var vu=0;function xu(){return class{constructor(e){this.styles=e,this.styleClass=`fast-${++vu}`}addStylesTo(e){let o=e===document?document.body:e;for(let r=0;r<this.styles.length;r++){let n=document.createElement("style");n.innerHTML=this.styles[r],n.className=this.styleClass,o.append(n)}}removeStylesFrom(e){let o=e===document?document.body:e,r=o.querySelectorAll(`.${this.styleClass}`);for(let n=0,i=r.length;n<i;++n)o.removeChild(r[n])}}}var Xn={define(t,e,o,r,n){r.define(t,e,o)}};var ku={},Zi=new WeakMap,Un=to(),$r=new WeakMap,ea=new WeakMap,io=Object.freeze({register(t){if(!Un.register(t))return!1;let e=oa(t.registry);return Object.prototype.hasOwnProperty.call(e,t.name)||v.defineProperty(e,t.name),e[t.name]=t.type,!0},getByType:Un.getByType,getForInstance:Un.getForInstance,whenRegistered:yu});function oa(t=customElements){if(t===customElements)return ku;let e=Zi.get(t);return e||(e={},Zi.set(t,e)),e}function ta(t){return t===void 0?void 0:io.getByType(t)}function yu(t,e=customElements){let o=oa(e);Object.prototype.hasOwnProperty.call(o,t)||v.defineProperty(o,t);let r=ta(o[t]);return r!==void 0?Promise.resolve(r):new Promise(n=>{let i=v.getNotifier(o),a={handleChange:()=>{let s=ta(o[t]);s!==void 0&&(i.unsubscribe(a,t),n(s))}};i.subscribe(a,t)})}function ra(t,e){if(ea.has(e))return!1;let o=$r.get(t),r=o===void 0;o===void 0&&(o=new Set,$r.set(t,o));let n=new WeakRef(e);return o.add(n),ea.set(e,n),r}function na(t,e){let o=$r.get(t);if(o!==void 0){$r.delete(t);for(let r of o){let n=r.deref();n!==void 0&&e(n)}}}var ia={mode:"open"},aa={},sa=new Set,Fr=new WeakMap,Pr=new WeakMap,zt=new WeakMap,la=new WeakMap,Su=new WeakMap;function Bu(t){return rt(t)}function wu(t){return typeof t?.then=="function"}function ca(t,e){if(Pr.delete(t),t.template===void 0&&e!==void 0&&(t.template=e),t.template!==void 0)return zt.delete(t),Fr.delete(t),t.template}function qn(t,e=t.registry,o){if(!o?.length)return;let r=t,n=la.get(r);if(!n?.has(e)){n===void 0&&(n=new WeakSet,la.set(r,n)),n.add(e);for(let i of o)i(t)}}function Tr(t){var e;return(e=Su.get(t))!==null&&e!==void 0?e:null}function Kn(t){if(t.template!==void 0)return zt.delete(t),t.template;let e=Pr.get(t);if(e)return e;let o=Fr.get(t);if(!o)return;zt.delete(t);let r;try{r=o(t)}catch(n){throw zt.set(t,n),n}if(wu(r)){let n=Promise.resolve(r).then(i=>ca(t,i)).catch(i=>{throw Pr.delete(t),zt.set(t,i),i});return Pr.set(t,n),n}return ca(t,r)}function Nu(t,e){let o=t;if(e===void 0){zt.delete(o);return}zt.set(o,e)}var Ye=class t{get isDefined(){return this.platformDefined}constructor(e,o=e.definition){var r;this.platformDefined=!1,Se(o)&&(o={name:o}),this.type=e,this.name=o.name,this.registry=(r=o.registry)!==null&&r!==void 0?r:customElements,Bu(o.template)?Fr.set(this,o.template):this.template=o.template;let n=e.prototype,i=Oo.collect(e,o.attributes),a=new Array(i.length),s={},d={};for(let h=0,u=i.length;h<u;++h){let x=i[h];a[h]=x.attribute,s[x.name]=x,d[x.attribute]=x,v.defineProperty(n,x)}Reflect.defineProperty(e,"observedAttributes",{value:a,enumerable:!0}),this.attributes=i,this.propertyLookup=s,this.attributeLookup=d,this.shadowOptions=o.shadowOptions===void 0?ia:o.shadowOptions===null?void 0:Object.assign(Object.assign({},ia),o.shadowOptions),this.elementOptions=o.elementOptions===void 0?aa:Object.assign(Object.assign({},aa),o.elementOptions),this.styles=Te.normalize(o.styles),this.schema=o.schema,io.register(this)}define(e=this.registry,o){let r=this.type;if(!e.get(this.name)){if(qn(this,e,o),this.template===void 0&&Fr.has(this))return Promise.resolve().then(()=>Kn(this)).then(i=>{if(i!==void 0&&!e.get(this.name)){let a=this.platformDefined;this.platformDefined=!0,Xn.define(this.name,r,this.elementOptions,e,a)}}).catch(i=>{Nu(this,i),v.notify(this,"template")}),this;let n=this.platformDefined;this.platformDefined=!0,Xn.define(this.name,r,this.elementOptions,e,n)}return this}static compose(e,o){let r=sa.has(e)||io.getByType(e)?new t(class extends e{},o):new t(e,o);return Promise.resolve(r)}static registerBaseType(e){sa.add(e)}};Ye.getByType=io.getByType;Ye.getForInstance=io.getForInstance;v.defineProperty(Ye.prototype,"template");var $u={bubbles:!0,composed:!0,cancelable:!0},Yn="isConnected",pa=new WeakMap,Jn=Symbol("fast-late-attribute-observer");function Ar(t){var e,o;return(o=(e=t.shadowRoot)!==null&&e!==void 0?e:pa.get(t))!==null&&o!==void 0?o:null}var da,Ae;(function(t){t[t.connecting=0]="connecting",t[t.connected=1]="connected",t[t.disconnecting=2]="disconnecting",t[t.disconnected=3]="disconnected"})(Ae||(Ae={}));var Ht=class t{get isConnected(){return v.track(this,Yn),this.stage===Ae.connected}get context(){var e,o;return(o=(e=this.view)===null||e===void 0?void 0:e.context)!==null&&o!==void 0?o:ft.default}get isBound(){var e,o;return(o=(e=this.view)===null||e===void 0?void 0:e.isBound)!==null&&o!==void 0?o:!1}get sourceLifetime(){var e;return(e=this.view)===null||e===void 0?void 0:e.sourceLifetime}get template(){var e;if(this._template===null){let o=this.definition;this.source.resolveTemplate?this._template=this.source.resolveTemplate():o.template&&(this._template=(e=o.template)!==null&&e!==void 0?e:null)}return this._template}set template(e){this._template!==e&&(this._template=e,this.needsInitialization||this.renderTemplate(e))}get shadowOptions(){return this._shadowRootOptions}set shadowOptions(e){if(this._shadowRootOptions===void 0&&e!==void 0){this._shadowRootOptions=e;let o=this.source.shadowRoot;o?this.hasExistingShadowRoot=!0:(o=this.source.attachShadow(e),e.mode==="closed"&&pa.set(this.source,o))}}get mainStyles(){var e;if(this._mainStyles===null){let o=this.definition;this.source.resolveStyles?this._mainStyles=this.source.resolveStyles():o.styles&&(this._mainStyles=(e=o.styles)!==null&&e!==void 0?e:null)}return this._mainStyles}set mainStyles(e){this._mainStyles!==e&&(this._mainStyles!==null&&this.removeStyles(this._mainStyles),this._mainStyles=e,this.needsInitialization||this.addStyles(e))}constructor(e,o){this.boundObservables=null,this.needsInitialization=!0,this.hasExistingShadowRoot=!1,this.isPrerendered=new Promise(i=>{this._resolvePrerendered=i}),this.isHydrated=new Promise(i=>{this._resolveHydrated=i}),this._template=null,this.stage=Ae.disconnected,this.guardBehaviorConnection=!1,this.behaviors=null,this.behaviorsConnected=!1,this._mainStyles=null,this.$fastController=this,this.view=null,this._notifier=new ro(e),this.source=e,this.definition=o,this.shadowOptions=o.shadowOptions;let r=Reflect.getPrototypeOf(e),n=r===null?[]:v.getAccessors(r);if(n.length>0){let i=this.boundObservables=Object.create(null);for(let a=0,s=n.length;a<s;++a){let d=n[a].name,h=e[d];h!==void 0&&(delete e[d],i[d]=h)}Object.keys(i).length===0&&(this.boundObservables=null)}this.captureBoundObservables()}get subject(){return this._notifier.subject}notify(e){this._notifier.notify(e)}subscribe(e,o){this._notifier.subscribe(e,o)}unsubscribe(e,o){this._notifier.unsubscribe(e,o)}onUnbind(e){var o;(o=this.view)===null||o===void 0||o.onUnbind(e)}addBehavior(e){var o,r;let n=(o=this.behaviors)!==null&&o!==void 0?o:this.behaviors=new Map,i=(r=n.get(e))!==null&&r!==void 0?r:0;i===0?(n.set(e,1),e.addedCallback&&e.addedCallback(this),e.connectedCallback&&!this.guardBehaviorConnection&&(this.stage===Ae.connected||this.stage===Ae.connecting)&&e.connectedCallback(this)):n.set(e,i+1)}removeBehavior(e,o=!1){let r=this.behaviors;if(r===null)return;let n=r.get(e);n!==void 0&&(n===1||o?(r.delete(e),e.disconnectedCallback&&this.stage!==Ae.disconnected&&e.disconnectedCallback(this),e.removedCallback&&e.removedCallback(this)):r.set(e,n-1))}addStyles(e){var o;if(!e)return;let r=this.source;e instanceof HTMLElement?((o=Ar(r))!==null&&o!==void 0?o:this.source).append(e):e.isAttachedTo(r)||e.addStylesTo(r)}removeStyles(e){var o;if(!e)return;let r=this.source;e instanceof HTMLElement?((o=Ar(r))!==null&&o!==void 0?o:r).removeChild(e):e.isAttachedTo(r)&&e.removeStylesFrom(r)}connect(){this.stage===Ae.disconnected&&(this.stage=Ae.connecting,this.captureBoundObservables(),this.syncLateAttributes(),this.observeLateAttributes(),this.bindObservables(),this.connectBehaviors(),this.needsInitialization?(this.renderTemplate(this.template),this.addStyles(this.mainStyles),this.needsInitialization=!1):this.view!==null&&this.view.bind(this.source),this.stage=Ae.connected,v.notify(this,Yn))}bindObservables(){if(this.boundObservables!==null){let e=this.source,o=this.boundObservables,r=Object.keys(o);for(let n=0,i=r.length;n<i;++n){let a=r[n];e[a]=o[a]}this.boundObservables=null}}captureBoundObservables(){let e=this.source,o=Object.getOwnPropertyNames(e),r=i=>{let a=Reflect.getPrototypeOf(e);for(;a!==null;){let s=Reflect.getOwnPropertyDescriptor(a,i);if(s?.get||s?.set)return!0;a=Reflect.getPrototypeOf(a)}return!1},n=this.boundObservables;for(let i=0,a=o.length;i<a;++i){let d=o[i];if(!r(d))continue;let h=e[d];if(h===void 0){delete e[d];continue}delete e[d],(n??(n=this.boundObservables=Object.create(null)))[d]=h}}syncLateAttributes(){let e=Tr(this.definition);if(e!==null)for(let o of Object.keys(e))this.source.hasAttribute(o)&&this.onAttributeChangedCallback(o,null,this.source.getAttribute(o))}observeLateAttributes(){let e=Tr(this.definition);if(e===null)return;let o=this.source;o[Jn]===void 0&&(o[Jn]=new MutationObserver(r=>{let n=o.$fastController,i=Tr(n.definition);if(i!==null)for(let a=0,s=r.length;a<s;++a){let d=r[a].attributeName;d===null||i[d]===void 0||n.onAttributeChangedCallback(d,null,o.getAttribute(d))}}),o[Jn].observe(o,{attributes:!0,attributeFilter:Object.keys(e)}))}connectBehaviors(){if(this.behaviorsConnected===!1){let e=this.behaviors;if(e!==null){this.guardBehaviorConnection=!0;for(let o of e.keys())o.connectedCallback&&o.connectedCallback(this);this.guardBehaviorConnection=!1}this.behaviorsConnected=!0}}disconnectBehaviors(){if(this.behaviorsConnected===!0){let e=this.behaviors;if(e!==null)for(let o of e.keys())o.disconnectedCallback&&o.disconnectedCallback(this);this.behaviorsConnected=!1}}disconnect(){this.stage===Ae.connected&&(this.stage=Ae.disconnecting,v.notify(this,Yn),this.view!==null&&this.view.unbind(),this.disconnectBehaviors(),this.stage=Ae.disconnected)}onAttributeChangedCallback(e,o,r){let n=this.definition.attributeLookup[e];n!==void 0&&n.onAttributeChangedCallback(this.source,r)}emit(e,o,r){return this.stage===Ae.connected?this.source.dispatchEvent(new CustomEvent(e,Object.assign(Object.assign({detail:o},$u),r))):!1}renderTemplate(e){var o;let r=this.source,n=(o=Ar(r))!==null&&o!==void 0?o:r;if(this.view!==null)this.view.dispose(),this.view=null;else if((!this.needsInitialization||this.hasExistingShadowRoot)&&(!this.hasExistingShadowRoot||!this.needsInitialization))for(let i=n.firstChild;i!==null;i=n.firstChild)n.removeChild(i);if(e){let i=this.hasExistingShadowRoot&&this.needsInitialization,a=!1;i&&t.hydrationHook&&(a=t.hydrationHook(this,e,r,n)),a||this.renderClientSide(e,r,n),this._resolvePrerendered(i),this._resolveHydrated(a)}else this.needsInitialization&&(this._resolvePrerendered(!1),this._resolveHydrated(!1))}renderClientSide(e,o,r){if(this.hasExistingShadowRoot){for(let n=r.firstChild;n!==null;n=r.firstChild)r.removeChild(n);this.hasExistingShadowRoot=!1}this.view=e.render(o,r,o),this.view.sourceLifetime=It.coupled}static forCustomElement(e,o=!1){let r=e.$fastController;if(r!==void 0&&!o)return r;let n=Ye.getForInstance(e);if(n===void 0)throw ne.error(J.missingElementDefinition);if(n.template===void 0&&ra(n,e)){let i=v.getNotifier(n),a={handleChange:()=>{i.unsubscribe(a,"template"),na(n,s=>{let d=s;t.forCustomElement(d,!0),d.isConnected&&d.$fastController.connect()})}};i.subscribe(a,"template")}return e.$fastController=new da(e,n)}static setStrategy(e){da=e}static installHydrationHook(e){t.hydrationHook=e}};Ht.hydrationHook=null;Fe(Ht);Ht.setStrategy(Ht);function Cr(t){var e;return"adoptedStyleSheets"in t?t:(e=Ar(t))!==null&&e!==void 0?e:t.getRootNode()}var Ir=class t{constructor(e){let o=t.styleSheetCache;this.sheets=e.map(r=>{if(r instanceof CSSStyleSheet)return r;let n=o.get(r);return n===void 0&&(n=new CSSStyleSheet,n.replaceSync(r),o.set(r,n)),n})}addStylesTo(e){ha(Cr(e),this.sheets)}removeStylesFrom(e){ga(Cr(e),this.sheets)}};Ir.styleSheetCache=new Map;var Pu=0,Fu=()=>`fast-${++Pu}`;function ua(t){return t===document?document.body:t}var Qn=class{constructor(e){this.styles=e,this.styleClass=Fu()}addStylesTo(e){e=ua(Cr(e));let o=this.styles,r=this.styleClass;for(let n=0;n<o.length;n++){let i=document.createElement("style");i.innerHTML=o[n],i.className=r,e.append(i)}}removeStylesFrom(e){e=ua(Cr(e));let o=e.querySelectorAll(`.${this.styleClass}`);for(let r=0,n=o.length;r<n;++r)e.removeChild(o[r])}},ha=(t,e)=>{t.adoptedStyleSheets=[...t.adoptedStyleSheets,...e]},ga=(t,e)=>{t.adoptedStyleSheets=t.adoptedStyleSheets.filter(o=>e.indexOf(o)===-1)};if(Te.supportsAdoptedStyleSheets){try{document.adoptedStyleSheets.push(),document.adoptedStyleSheets.splice(),ha=(t,e)=>{t.adoptedStyleSheets.push(...e)},ga=(t,e)=>{for(let o of e){let r=t.adoptedStyleSheets.indexOf(o);r!==-1&&t.adoptedStyleSheets.splice(r,1)}}}catch{}Te.setDefaultStrategy(Ir)}else Te.setDefaultStrategy(Qn);function fa(t){let e=class extends t{constructor(){super(),Ht.forCustomElement(this)}$emit(o,r,n){return this.$fastController.emit(o,r,n)}connectedCallback(){this.$fastController.connect()}disconnectedCallback(){this.$fastController.disconnect()}attributeChangedCallback(o,r,n){this.$fastController.onAttributeChangedCallback(o,r,n)}};return Ye.registerBaseType(e),e}function Tu(t){return typeof t?.then=="function"}function Au(t,e,o){return Array.isArray(e)&&(o=e,e=void 0),(rt(t)?Ye.compose(t,e):Ye.compose(this,t)).then(n=>{qn(n,n.registry,o);let i=Kn(n);return Tu(i)?i.then(()=>n.define().type):n.define().type})}function Cu(t){return fa(t)}var F=Object.assign(fa(HTMLElement),{from:Cu,define:Au});function it(t,e,o){return Object.assign({},o,{get(){return v.trackVolatile(),o.get.apply(this)}})}var Zn=to(),ei=Object.freeze({getForInstance:Zn.getForInstance,getByType:Zn.getByType,define(t){return Zn.register({type:t}),t}});function ma(t,e){let o=[],r="";for(let n=0,i=t.length-1;n<i;++n){r+=t[n];let a=e[n];ei.getForInstance(a)!==void 0&&(a=a.createCSS()),a instanceof Te||a instanceof CSSStyleSheet?(r.trim()!==""&&(o.push(r),r=""),o.push(a)):r+=a}return r+=t[t.length-1],r.trim()!==""&&o.push(r),o}var b=((t,...e)=>new Te(ma(t,e))),Hr=class{constructor(e){this.value=e.length===0?"":e.length===1?e[0]:new Te(e)}createCSS(){return this.value}};ei.define(Hr);b.partial=(t,...e)=>new Hr(ma(t,e));var ti=`fast-${Math.random().toString(36).substring(2,8)}`,Dr=`${ti}{`,Eo=`}${ti}`,Iu=Eo.length,Hu=0,zo=()=>`${ti}-${++Hu}`,Lr=Object.freeze({interpolation:t=>`${Dr}${t}${Eo}`,attribute:t=>`${zo()}="${Dr}${t}${Eo}"`,comment:t=>`<!--${Dr}${t}${Eo}-->`}),Ro=Object.freeze({parse(t,e){let o=t.split(Dr);if(o.length===1)return null;let r=[];for(let n=0,i=o.length;n<i;++n){let a=o[n],s=a.indexOf(Eo),d;if(s===-1)d=a;else{let h=a.substring(0,s);r.push(e[h]),d=a.substring(s+Iu)}d!==""&&r.push(d)}return r}});var oi=to(),Be=Object.freeze({getForInstance:oi.getForInstance,getByType:oi.getByType,define(t,e){return e=e||{},e.type=t,oi.register(e),t},assignAspect(t,e){if(!e){t.aspectType=R.content;return}switch(t.sourceAspect=e,e[0]){case":":t.targetAspect=e.substring(1),t.aspectType=t.targetAspect==="classList"?R.tokenList:R.property;break;case"?":t.targetAspect=e.substring(1),t.aspectType=R.booleanAttribute;break;case"@":t.targetAspect=e.substring(1),t.aspectType=R.event;break;default:t.targetAspect=e,t.aspectType=R.attribute;break}}});var Rt=class{constructor(e){this.options=e}createHTML(e){return Lr.attribute(e(this))}createBehavior(){return this}};Fe(Rt);var Du=t=>t.nodeType===1,ao=t=>t?e=>e.nodeType===1&&e.matches(t):Du,_o=class extends Rt{get id(){return this._id}set id(e){this._id=e,this._controllerProperty=`${e}-c`}bind(e){let o=e.targets[this.targetNodeId];o[this._controllerProperty]=e,this.updateTarget(e.source,this.computeNodes(o)),this.observe(o),e.onUnbind(this)}unbind(e){let o=e.targets[this.targetNodeId];this.updateTarget(e.source,Wi),this.disconnect(o),o[this._controllerProperty]=null}getSource(e){return e[this._controllerProperty].source}updateTarget(e,o){e[this.options.property]=o}computeNodes(e){let o=this.getNodes(e);return"filter"in this.options&&(o=o.filter(this.options.filter)),o}};var Lu=Symbol(),xa=new WeakMap;function Ou(t){let e=Object.freeze(Object.assign(Object.assign({},t),{[Lu]:!0}));return xa.set(e,e),e}function ba(t){return t.nodeType===Node.COMMENT_NODE}function va(t){let e=t.getAttribute("data-fe");if(e===null)return null;let o=e.trim();if(!/^\d+$/.test(o))throw ne.error(J.invalidHydrationAttributeMarker,{value:e});let r=parseInt(o,10);if(r<1)throw ne.error(J.invalidHydrationAttributeMarker,{value:e});return r}var so=Ou({attributeMarkerName:"data-fe",contentBindingStartMarker(){return"fe:b"},contentBindingEndMarker(){return"fe:/b"},repeatStartMarker(){return"fe:r"},repeatEndMarker(){return"fe:/r"},elementBoundaryStartMarker(){return"fe:e"},elementBoundaryEndMarker(){return"fe:/e"},parseAttributeBindingCount:va,resolveAttributeBindings(t,e,o){let r=va(t);return r!==null?{factoryIndices:Array.from({length:r},(i,a)=>e+a),nextFactoryPointer:e+r,cleanup:()=>t.removeAttribute("data-fe")}:null},resolveContentBinding(t,e,o){return t==="fe:b"?{factoryIndices:[e],nextFactoryPointer:e+1}:null},isContentBindingStartMarker(t){return t==="fe:b"},isContentBindingEndMarker(t){return t==="fe:/b"},isRepeatViewStartMarker(t){return t==="fe:r"},isRepeatViewEndMarker(t){return t==="fe:/r"},isElementBoundaryStartMarker(t){return ba(t)&&t.data==="fe:e"},isElementBoundaryEndMarker(t){return ba(t)&&t.data==="fe:/e"}}),Mu=xa.get(so);function ka(){return Mu}var Vo=Symbol.for("fe-hydration");function Or(t){return t[Vo]===Vo}var ya="unknown",Sa="content following `<!--fe:b-->` content binding marker",Ba="matching `<!--fe:/b-->` content binding close marker",wa="matching `<!--fe:/e-->` element boundary close marker";function Na(t,e){let o=e?`: ${e}`:"";return`Hydration mismatch in <${t}>${o}. Install hydrationDebugger() from "@microsoft/fast-element/hydration.js" and pass it as enableHydration({ debugger: hydrationDebugger() }) for an "Expected / Received" report including the SSR HTML snippet.`}function ri(t){return`no more attribute bindings (template defines ${t})`}function $a(t){return`no more content bindings (template defines ${t})`}function Pa(t,e){let o=(t??ya).toLowerCase();return Na(o,e)}var Eu={formatBindingMismatch(t,e,o,r){return{message:Pa(r,void 0)}},formatStructuralError(t,e,o){return{message:Pa(e,o)}}},zu=Eu;function Mr(){return zu}function Er(t){var e;return t?(e=t.getRootNode().host)===null||e===void 0?void 0:e.nodeName:void 0}var ni,ii,Tg=(ni=Object.getOwnPropertyDescriptor(Object.getPrototypeOf(customElements),"define"))===null||ni===void 0?void 0:ni.value,Ag=(ii=Object.getOwnPropertyDescriptor(Array.prototype,Symbol.iterator))===null||ii===void 0?void 0:ii.value,Ru=new WeakMap;function Fa(t){return Ru.get(Object.getPrototypeOf(t))===!0}function zr(t){return t.nodeType===8}function _u(t){return t.nodeType===3}function Aa(t){return zr(t)||_u(t)?t.data.length:t.childNodes.length}var Ca=133;function ai(t,e){let o=document.createRange();return o.setStart(t,0),o.setEnd(e,Aa(e)),o}function Ta(t,e,o=t){let r=ai(t,e),n=r.startContainer===t?document.createTreeWalker(r.commonAncestorContainer,Ca):null,i=e.contains(o),a=!1;n!==null&&(n.currentNode=o);function s(d){if(n===null||!a&&d&&n.currentNode.contains(e))return null;let h=n.currentNode,u=d?n.nextSibling():n.nextNode();return a||!i||e.contains(u)?(u===e&&(i=!0),u):(n.currentNode=h,null)}return[s,()=>{if(n!==null&&!a&&(r.startContainer!==t||r.endContainer!==e||r.endOffset!==Aa(e)||n.currentNode!==t&&n.currentNode!==e&&!r.intersectsNode(n.currentNode))){let d=n.currentNode;n=document.createTreeWalker(n.root,n.whatToShow,{acceptNode:h=>r.comparePoint(h,0)===0?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT}),n.currentNode=d,a=!0}}]}function Ia(t,e){let o=t.parentNode;if(o===null||o!==e.parentNode||t!==e&&!(t.compareDocumentPosition(e)&Node.DOCUMENT_POSITION_FOLLOWING)){let[a,s]=Ta(t,e);return[a,s,()=>{}]}let r=t,n=null;function i(a=!1){if(n!==null)return n[0](a);if(a&&r===e)return null;let s=r;do if(a){if(s===e)return null;s=s.nextSibling}else{let d=s;for(s=s.firstChild;s===null;){if(d===e)return null;if(s=d.nextSibling,d=d.parentNode,d===o||d===null)break}}while(s!==null&&!(Ca&1<<s.nodeType-1));return s!==null&&(r=s),s}return[i,()=>n?.[1](),()=>{n??(n=Ta(t,e,r))}]}var Wo=class extends Error{constructor(e,o,r,n,i){super(e),this.factories=o,this.node=r,this.expected=n,this.received=i}},Ha=Element.prototype.removeAttribute,Da=Element.prototype.getAttribute,Vu=Element.prototype.hasAttribute;function Oa(t,e,o){let r=t;for(;r!==null;){let n=Object.getOwnPropertyDescriptor(r,e);if(n!==void 0)return n.value===o;r=Object.getPrototypeOf(r)}return!1}function La(t,e){return e?Vu.call(t,"is")||!Oa(t,"removeAttribute",Ha):t.localName.includes("-")||t.hasAttribute("is")||"attributeChangedCallback"in t||t.removeAttribute!==Ha}function lo(t,e,o){let r=Mr().formatStructuralError(t,Er(t),o);throw new Wo(r.message,e,t,r.expected,r.received)}function Ma(t,e,o){var r;let[n,i,a]=Ia(t,e),s={},d={},h=ka(),u=h===so;h!==so&&a();let x=Gu(o),N=x,D=t;for(;D!==null;){switch(D.nodeType){case Node.ELEMENT_NODE:{let V=D,Pe=u&&V.localName.includes("-"),yr=Pe&&Fa(V);if((Pe?!Oa(V,"getAttribute",Da):V.getAttribute!==Da)&&a(),u){let Do=so.parseAttributeBindingCount(V);if(Do!==null){Do>4294967295&&so.resolveAttributeBindings(V,N,x);for(let Lo=0;Lo<Do;Lo++){let _i=o[N++];_i||lo(D,o,ri(o.length)),jo(_i,D,s)}La(V,yr)&&a(),V.removeAttribute("data-fe"),i()}break}let gt=h.resolveAttributeBindings(V,N,x);if(gt!==null){N=gt.nextFactoryPointer;for(let Do of gt.factoryIndices){let Lo=o[Do];Lo||lo(D,o,ri(o.length)),jo(Lo,D,s)}La(V,!1)&&a(),(r=gt.cleanup)===null||r===void 0||r.call(gt),i()}break}case 8:{let V=D.data;if(u?V==="fe:e":h.isElementBoundaryStartMarker(D))D.data="",ju(n,o,D,h,u);else{let Pe;if(u){if(V!=="fe:b")break;Pe=N++}else{let gt=h.resolveContentBinding(V,N,x);if(gt===null)break;N=gt.nextFactoryPointer,Pe=gt.factoryIndices[0]}let yr=o[Pe];yr||lo(D,o,$a(o.length)),Wu(D,n,yr,o,s,d,h,u)}break}}D=n()}return{targets:s,boundaries:d}}function Wu(t,e,o,r,n,i,a,s){let d=e(!0);t.data="",d===null&&lo(t,r,Sa);let h=d,u=0;for(;d!==null;){if(zr(d)){if(s?d.data==="fe:b":a.isContentBindingStartMarker(d.data))u++;else if(s?d.data==="fe:/b":a.isContentBindingEndMarker(d.data)){if(u===0)break;u--}}d=e(!0)}d===null&&lo(t,r,Ba),d.data="",d!==h&&d.previousSibling!==null&&(i[o.targetNodeId]={first:h,last:d.previousSibling}),jo(o,d,n)}function ju(t,e,o,r,n){let i=0,a=t(!0);for(;a!==null;){if(zr(a)){if(n?a.data==="fe:e":r.isElementBoundaryStartMarker(a))a.data="",i++;else if((n?a.data==="fe:/e":r.isElementBoundaryEndMarker(a))&&(a.data="",i--===0))return}a=t(!0)}lo(o,e,wa)}function Gu(t){let e=0;for(;e<t.length&&t[e].targetNodeId==="h";)e++;return e}function jo(t,e,o){let r=t.targetNodeId;if(r===void 0)throw new Error("Factory could not be target to the node");o[r]=e}function co(t,e){let o=t.parentNode,r=t,n;for(;r!==e;){if(n=r.nextSibling,!n)throw new Error(`Unmatched first/last child inside "${e.getRootNode().host.nodeName}".`);o.removeChild(r),r=n}o.removeChild(e)}var Go=class{constructor(){this.index=0,this.length=0}get event(){return ft.getEvent()}get isEven(){return this.index%2===0}get isOdd(){return this.index%2!==0}get isFirst(){return this.index===0}get isInMiddle(){return!this.isFirst&&!this.isLast}get isLast(){return this.index===this.length-1}eventDetail(){return this.event.detail}eventTarget(){return this.event.target}},_t=class extends Go{constructor(e,o,r){super(),this.fragment=e,this.factories=o,this.targets=r,this.behaviors=null,this.unbindables=[],this.source=null,this.isBound=!1,this.sourceLifetime=It.unknown,this._skipAttrUpdates=!1,this.isPrerendered=Promise.resolve(!1),this.isHydrated=Promise.resolve(!1),this.context=this,this.firstChild=e.firstChild,this.lastChild=e.lastChild}appendTo(e){e.appendChild(this.fragment)}insertBefore(e){if(this.fragment.hasChildNodes())e.parentNode.insertBefore(this.fragment,e);else{let o=this.lastChild;if(e.previousSibling===o)return;let r=e.parentNode,n=this.firstChild,i;for(;n!==o;)i=n.nextSibling,r.insertBefore(n,e),n=i;r.insertBefore(o,e)}}remove(){let e=this.fragment,o=this.lastChild,r=this.firstChild,n;for(;r!==o;)n=r.nextSibling,e.appendChild(r),r=n;e.appendChild(o)}dispose(){co(this.firstChild,this.lastChild),this.unbind()}onUnbind(e){this.unbindables.push(e)}bind(e,o=this){if(this.source===e&&this.context===o)return;let r=this.behaviors;if(r===null){this.source=e,this.context=o,this.behaviors=r=new Array(this.factories.length);let n=this.factories;for(let i=0,a=n.length;i<a;++i){let s=n[i].createBehavior();s.bind(this),r[i]=s}}else{this.source!==null&&this.evaluateUnbindables(),this.isBound=!1,this.source=e,this.context=o;for(let n=0,i=r.length;n<i;++n)r[n].bind(this)}this.isBound=!0}unbind(){!this.isBound||this.source===null||(this.evaluateUnbindables(),this.source=null,this.context=this,this.isBound=!1)}evaluateUnbindables(){let e=this.unbindables;for(let o=0,r=e.length;o<r;++o)e[o].unbind(this);e.length=0}static disposeContiguousBatch(e){if(e.length!==0){co(e[0].firstChild,e[e.length-1].lastChild);for(let o=0,r=e.length;o<r;++o)e[o].unbind()}}};Fe(_t);v.defineProperty(_t.prototype,"index");v.defineProperty(_t.prototype,"length");var Ea,Vt={unhydrated:"unhydrated",hydrating:"hydrating",hydrated:"hydrated"},si=class extends Error{constructor(e,o,r,n,i,a){super(e),this.factory=o,this.fragment=r,this.templateString=n,this.expected=i,this.received=a}},li=class extends Go{get hydrationStage(){return this._hydrationStage}get targets(){return this._targets}get bindingViewBoundaries(){return this._bindingViewBoundaries}constructor(e,o,r,n){super(),this.firstChild=e,this.lastChild=o,this.sourceTemplate=r,this.hostBindingTarget=n,this[Ea]=Vo,this.context=this,this.source=null,this.isBound=!1,this.sourceLifetime=It.unknown,this.unbindables=[],this.fragment=null,this.behaviors=null,this._hydrationStage=Vt.unhydrated,this._bindingViewBoundaries={},this._targets={},this.factories=r.compile().factories}insertBefore(e){if(this.fragment!==null)if(this.fragment.hasChildNodes())e.parentNode.insertBefore(this.fragment,e);else{let o=this.lastChild;if(e.previousSibling===o)return;let r=e.parentNode,n=this.firstChild,i;for(;n!==o;)i=n.nextSibling,r.insertBefore(n,e),n=i;r.insertBefore(o,e)}}appendTo(e){this.fragment!==null&&e.appendChild(this.fragment)}remove(){let e=this.fragment||(this.fragment=document.createDocumentFragment()),o=this.lastChild,r=this.firstChild,n;for(;r!==o;){if(n=r.nextSibling,!n)throw new Error(`Unmatched first/last child inside "${o.getRootNode().host.nodeName}".`);e.appendChild(r),r=n}e.appendChild(o)}bind(e,o=this){if(this.source===e&&this.context===o)return;this.hydrationStage!==Vt.hydrated&&(this._hydrationStage=Vt.hydrating);let r=this.behaviors;if(r===null){this.source=e,this.context=o;try{let{targets:i,boundaries:a}=Ma(this.firstChild,this.lastChild,this.factories);this._targets=i,this._bindingViewBoundaries=a}catch(i){if(i instanceof Wo){let a=this.sourceTemplate.html;typeof a!="string"&&(a=a.innerHTML),i.templateString=a}throw i}this.behaviors=r=new Array(this.factories.length);let n=this.factories;for(let i=0,a=n.length;i<a;++i){let s=n[i];if(s.targetNodeId==="h"&&this.hostBindingTarget&&jo(s,this.hostBindingTarget,this._targets),s.targetNodeId in this.targets){let d=s.createBehavior();d.bind(this),r[i]=d}else{let d=this.sourceTemplate.html;typeof d!="string"&&(d=d.innerHTML);let h=ai(this.firstChild,this.lastChild).cloneContents(),u=Mr().formatBindingMismatch(s,this.firstChild,this.lastChild,Er(this.firstChild));throw new si(u.message,s,h,d,u.expected,u.received)}}}else{this.source!==null&&this.evaluateUnbindables(),this.isBound=!1,this.source=e,this.context=o;for(let n=0,i=r.length;n<i;++n)r[n].bind(this)}this.isBound=!0,this._hydrationStage=Vt.hydrated}unbind(){!this.isBound||this.source===null||(this.evaluateUnbindables(),this.source=null,this.context=this,this.isBound=!1)}dispose(){co(this.firstChild,this.lastChild),this.unbind()}onUnbind(e){this.unbindables.push(e)}evaluateUnbindables(){let e=this.unbindables;for(let o=0,r=e.length;o<r;++o)e[o].unbind(this);e.length=0}};Ea=Vo;Fe(li);function Xu(t){return t.create!==void 0}function za(t,e){if(t.nodeType!==8){t.textContent=e;return}let o=t.$fastText;o!==void 0&&(o.textContent=e),e===""?o?.remove():(o===void 0&&(t.$fastText=o=document.createTextNode(e)),o.parentNode!==t.parentNode&&t.parentNode.insertBefore(o,t))}function Uu(t,e,o,r){if(o==null&&(o=""),Xu(o)){za(t,"");let n=t.$fastView;if(n===void 0)if(Or(r)&&Or(o)&&r.bindingViewBoundaries[this.targetNodeId]!==void 0&&r.hydrationStage!==Vt.hydrated){let i=r.bindingViewBoundaries[this.targetNodeId];n=o.hydrate(i.first,i.last)}else n=o.create();else t.$fastTemplate!==o&&(n.isComposed&&(n.remove(),n.unbind()),n=o.create());n.isComposed?n.needsBindOnly&&(n.needsBindOnly=!1,n.bind(r.source,r.context)):(n.isComposed=!0,n.bind(r.source,r.context),n.insertBefore(t),t.$fastView=n,t.$fastTemplate=o)}else{let n=t.$fastView;if(n!==void 0&&n.isComposed&&(n.isComposed=!1,n.remove(),n.needsBindOnly?n.needsBindOnly=!1:n.unbind()),n===void 0&&Or(r)&&r.hydrationStage!==Vt.hydrated){let i=r.bindingViewBoundaries[this.targetNodeId];i!==void 0&&(t.nodeType===8&&i.first===i.last&&i.first.nodeType===3?t.$fastText=i.first:co(i.first,i.last),delete r.bindingViewBoundaries[this.targetNodeId])}za(t,o)}}function qu(t,e,o){var r;let n=`${this.id}-t`,i=(r=t[n])!==null&&r!==void 0?r:t[n]={v:0,cv:Object.create(null)},a=i.cv,s=i.v,d=t[e];if(o!=null&&o.length){let h=o.split(/\s+/);for(let u=0,x=h.length;u<x;++u){let N=h[u];N!==""&&(a[N]=s,d.add(N))}}if(i.v=s+1,s!==0){s-=1;for(let h in a)a[h]===s&&d.remove(h)}}var Ku={[R.attribute]:bt.setAttribute,[R.booleanAttribute]:bt.setBooleanAttribute,[R.property]:(t,e,o)=>t[e]=o,[R.content]:Uu,[R.tokenList]:qu,[R.event]:()=>{}},Je=class{constructor(e){this.updateTarget=null,this.aspectType=R.content,this.dataBinding=e}createHTML(e){return Lr.interpolation(e(this))}createBehavior(){var e;if(this.updateTarget===null){let o=Ku[this.aspectType],r=(e=this.dataBinding.policy)!==null&&e!==void 0?e:this.policy;if(!o)throw ne.error(J.unsupportedBindingBehavior);this.data=`${this.id}-d`,this.updateTarget=r.protect(this.targetTagName,this.aspectType,this.targetAspect,o)}return this}bind(e){var o;let r=e.targets[this.targetNodeId];switch(this.aspectType){case R.event:r[this.data]=e,r.addEventListener(this.targetAspect,this,this.dataBinding.options);break;case R.content:e.onUnbind(this);default:{let n=(o=r[this.data])!==null&&o!==void 0?o:r[this.data]=this.dataBinding.createObserver(this,this);n.target=r,n.controller=e;let i=n.bind(e);if(e._skipAttrUpdates&&(this.aspectType===R.attribute||this.aspectType===R.booleanAttribute))break;this.updateTarget(r,this.targetAspect,i,e);break}}}unbind(e){let r=e.targets[this.targetNodeId].$fastView;r!==void 0&&r.isComposed&&(r.unbind(),r.needsBindOnly=!0)}handleEvent(e){let o=e.currentTarget[this.data];if(o.isBound){ft.setEvent(e);let r=this.dataBinding.evaluate(o.source,o.context);ft.setEvent(null),r!==!0&&e.preventDefault()}}handleChange(e,o){let r=o.controller;if(!r.isBound)return;let n=o.target;this.updateTarget(n,this.targetAspect,o.bind(r),r)}};Be.define(Je,{aspected:!0});var Wa=(t,e)=>`${t}.${e}`,Ra={},at={index:0,node:null};function _a(t){t.startsWith("fast-")||ne.warn(J.hostBindingWithoutHost,{name:t})}var Yu=new Proxy(document.createElement("div"),{get(t,e){_a(e);let o=Reflect.get(t,e);return rt(o)?o.bind(t):o},set(t,e,o){return _a(e),Reflect.set(t,e,o)}}),ci=class{constructor(e,o,r){this.fragment=e,this.directives=o,this.policy=r,this.proto=null,this.nodeIds=new Set,this.descriptors={},this.factories=[]}addFactory(e,o,r,n,i){var a,s;this.nodeIds.has(r)||(this.nodeIds.add(r),this.addTargetDescriptor(o,r,n)),e.id=(a=e.id)!==null&&a!==void 0?a:zo(),e.targetNodeId=r,e.targetTagName=i,e.policy=(s=e.policy)!==null&&s!==void 0?s:this.policy,this.factories.push(e)}freeze(){return this.proto=Object.create(null,this.descriptors),this}addTargetDescriptor(e,o,r){let n=this.descriptors;if(o==="r"||o==="h"||n[o])return;if(!n[e]){let a=e.lastIndexOf("."),s=e.substring(0,a),d=parseInt(e.substring(a+1),10);this.addTargetDescriptor(s,e,d)}let i=Ra[o];if(!i){let a=`_${o}`;Ra[o]=i={get(){var s;return(s=this[a])!==null&&s!==void 0?s:this[a]=this[e].childNodes[r]}}}n[o]=i}createView(e){let o=this.fragment.cloneNode(!0),r=Object.create(this.proto);r.r=o,r.h=e??Yu;for(let n of this.nodeIds)Reflect.get(r,n);return new _t(o,this.factories,r)}};function ja(t,e,o,r,n,i=!1){let a=o.attributes,s=t.directives;for(let d=0,h=a.length;d<h;++d){let u=a[d],x=u.value,N=Ro.parse(x,s),D=null;N===null?i&&(D=new Je(wr(()=>x,t.policy)),Be.assignAspect(D,u.name)):D=Rr.aggregate(N,t.policy),D!==null&&(o.removeAttributeNode(u),d--,h--,t.addFactory(D,e,r,n,o.tagName))}}function Ju(t,e,o,r,n){let i=Ro.parse(e.textContent,t.directives);if(i===null)return at.node=e.nextSibling,at.index=n+1,at;let a,s=a=e;for(let d=0,h=i.length;d<h;++d){let u=i[d];if(d!==0&&(n++,r=Wa(o,n),a=s.parentNode.insertBefore(document.createTextNode(""),s.nextSibling)),Se(u))a.textContent=u;else{if(Be.assignAspect(u),u instanceof Je){let x=document.createComment("");a.parentNode.replaceChild(x,a),a=x}else a.textContent=" ";t.addFactory(u,o,r,n,null)}s=a}return at.index=n+1,at.node=s.nextSibling,at}function Ga(t,e,o){let r=0,n=e.firstChild;for(;n;){let i=Qu(t,o,n,r);n=i.node,r=i.index}}function Qu(t,e,o,r){let n=Wa(e,r);switch(o.nodeType){case 1:ja(t,e,o,n,r),Ga(t,o,n);break;case 3:return Ju(t,o,e,n,r);case 8:{let i=Ro.parse(o.data,t.directives);i!==null&&t.addFactory(Rr.aggregate(i),e,n,r,null);break}}return at.index=r+1,at.node=o.nextSibling,at}function Zu(t,e){if(!t||t.nodeType!==8&&t.nodeType!==3)return!1;let o=Ro.parse(t.data,e);return o!==null&&(t.nodeType===8||!Se(o[0]))}var Va="TEMPLATE",Rr={compile(t,e,o=bt.policy){let r;if(Se(t)){r=document.createElement(Va),r.innerHTML=o.createHTML(t);let a=r.content.firstElementChild;a!==null&&a.tagName===Va&&(r=a)}else r=t;!r.content.firstChild&&!r.content.lastChild&&r.content.appendChild(document.createComment(""));let n=document.adoptNode(r.content),i=new ci(n,e,o);return ja(i,"",r,"h",0,!0),(Zu(n.firstChild,e)||n.childNodes.length===1&&Object.keys(e).length>0)&&n.insertBefore(document.createComment(""),n.firstChild),Ga(i,n,"r"),at.node=null,i.freeze()},setDefaultStrategy(t){this.compile=t},aggregate(t,e=bt.policy){if(t.length===1)return t[0];let o,r=!1,n,i=t.length,a=t.map(h=>Se(h)?()=>h:(o=h.sourceAspect||o,r=r||h.dataBinding.isVolatile,n=n||h.dataBinding.policy,h.dataBinding.evaluate)),s=(h,u)=>{let x="";for(let N=0;N<i;++N)x+=a[N](h,u);return x},d=new Je(Nr(s,n??e,r));return Be.assignAspect(d,o),d}};var Xo=class extends Rt{bind(e){e.source[this.options]=e.targets[this.targetNodeId]}};Be.define(Xo);var K=t=>new Xo(t);var ep=/([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/,tp=Object.create(null),Qe=class{constructor(e,o=tp){this.html=e,this.factories=o}createHTML(e){let o=this.factories;for(let r in o)e(o[r]);return this.html}};Qe.empty=new Qe("");Be.define(Qe);function op(t,e,o,r=Be.getForInstance(t)){if(r.aspected){let n=ep.exec(e);n!==null&&Be.assignAspect(t,n[2])}return t.createHTML(o)}var Uo=class t{constructor(e,o={},r){this.policy=r,this.result=null,this.html=e,this.factories=o}compile(){return this.result===null&&(this.result=Rr.compile(this.html,this.factories,this.policy)),this.result}inline(){return new Qe(Se(this.html)?this.html:this.html.innerHTML,this.factories)}withPolicy(e){if(this.result)throw ne.error(J.cannotSetTemplatePolicyAfterCompilation);if(this.policy)throw ne.error(J.onlySetTemplatePolicyOnce);return this.policy=e,this}render(e,o,r){let n=this.create(r);return n.bind(e),n.appendTo(o),n}create(e){return this.compile().createView(e)}static create(e,o,r){let n="",i=Object.create(null),a=s=>{var d;let h=(d=s.id)!==null&&d!==void 0?d:s.id=zo();return i[h]=s,h};for(let s=0,d=e.length-1;s<d;++s){let h=e[s],u=o[s],x;if(n+=h,rt(u))u=new Je(Nr(u));else if(u instanceof Ct)u=new Je(u);else if(!(x=Be.getForInstance(u))){let N=u;u=new Je(wr(()=>N))}n+=op(u,h,a,x)}return new t(n+e[e.length-1],i,r)}};Fe(Uo);var y=((t,...e)=>{if(Array.isArray(t)&&Array.isArray(t.raw))return Uo.create(t,e);throw ne.error(J.directCallToHTMLTagNotAllowed)});y.partial=t=>new Qe(t);var Xa="slotchange",qo=class extends _o{observe(e){e.addEventListener(Xa,this)}disconnect(e){e.removeEventListener(Xa,this)}getNodes(e){return e.assignedNodes(this.options)}handleEvent(e){let o=e.currentTarget;this.updateTarget(this.getSource(o),this.computeNodes(o))}};Be.define(qo);function fe(t){return Se(t)&&(t={property:t}),new qo(t)}function ie(t){return t?typeof t=="string"?new Qe(t):"inline"in t?t.inline():t:Qe.empty}var Ge=class{};function st(t){return y` <slot name="end" ${K("end")}>${ie(t.end)}</slot> `.inline()}function Xe(t){return y` <slot name="start" ${K("start")}>${ie(t.start)}</slot> `.inline()}function lt(t,...e){let o=no.locate(t);e.forEach(r=>{Object.getOwnPropertyNames(r.prototype).forEach(i=>{i!=="constructor"&&Object.defineProperty(t.prototype,i,Object.getOwnPropertyDescriptor(r.prototype,i))}),no.locate(r).forEach(i=>o.push(i))})}var f=Object.freeze({prefix:"fluent",shadowRootMode:"open",registry:globalThis.customElements});function di(...t){return t.every(e=>e instanceof HTMLElement)}var rp=":host([hidden]){display:none}";function T(t){return`${rp}:host{display:${t}}`}var X="var(--colorNeutralForeground1)",_r="var(--colorNeutralForeground1Hover)",Ua="var(--colorNeutralForeground1Pressed)";var ze="var(--colorNeutralForeground2)",uo="var(--colorNeutralForeground2Hover)",po="var(--colorNeutralForeground2Pressed)";var ui="var(--colorNeutralForeground2BrandHover)",pi="var(--colorNeutralForeground2BrandPressed)";var U="var(--colorNeutralForeground3)",qa="var(--colorNeutralForeground3Hover)",Ka="var(--colorNeutralForeground3Pressed)";var Vr="var(--colorNeutralForeground4)";var _="var(--colorNeutralForegroundDisabled)",Ya="var(--colorBrandForegroundLink)",Ja="var(--colorBrandForegroundLinkHover)",Qa="var(--colorBrandForegroundLinkPressed)";var Za="var(--colorNeutralForeground2Link)",es="var(--colorNeutralForeground2LinkHover)",ts="var(--colorNeutralForeground2LinkPressed)";var os="var(--colorCompoundBrandForeground1Hover)",rs="var(--colorCompoundBrandForeground1Pressed)",vt="var(--colorNeutralForegroundOnBrand)",ct="var(--colorNeutralForegroundInverted)",ns="var(--colorNeutralForegroundInvertedHover)",is="var(--colorNeutralForegroundInvertedPressed)";var as="var(--colorNeutralForegroundStaticInverted)";var Ko="var(--colorBrandForeground1)",ss="var(--colorBrandForeground2)";var ls="var(--colorNeutralForeground1Static)";var A="var(--colorNeutralBackground1)",ho="var(--colorNeutralBackground1Hover)",Wr="var(--colorNeutralBackground1Pressed)",cs="var(--colorNeutralBackground1Selected)";var Wt="var(--colorNeutralBackground3)";var ds="var(--colorNeutralBackground4)";var us="var(--colorNeutralBackground5)";var ps="var(--colorNeutralBackgroundInverted)";var hs="var(--colorSubtleBackground)",jr="var(--colorSubtleBackgroundHover)",Yo="var(--colorSubtleBackgroundPressed)";var Ce="var(--colorTransparentBackground)",hi="var(--colorTransparentBackgroundHover)",gi="var(--colorTransparentBackgroundPressed)";var Ie="var(--colorNeutralBackgroundDisabled)";var gs="var(--colorBackgroundOverlay)";var Gr="var(--colorBrandBackground)",fs="var(--colorBrandBackgroundHover)",ms="var(--colorBrandBackgroundPressed)";var xt="var(--colorCompoundBrandBackground)",kt="var(--colorCompoundBrandBackgroundHover)",yt="var(--colorCompoundBrandBackgroundPressed)";var bs="var(--colorBrandBackground2)";var we="var(--colorNeutralStrokeAccessible)",St="var(--colorNeutralStrokeAccessibleHover)",Bt="var(--colorNeutralStrokeAccessiblePressed)";var Ne="var(--colorNeutralStroke1)",wt="var(--colorNeutralStroke1Hover)",go="var(--colorNeutralStroke1Pressed)";var fo="var(--colorNeutralStroke2)",vs="var(--colorNeutralStroke3)";var xs="var(--colorBrandStroke1)",ks="var(--colorBrandStroke2)";var He="var(--colorCompoundBrandStroke)",ys="var(--colorCompoundBrandStrokeHover)",Xr="var(--colorCompoundBrandStrokePressed)",be="var(--colorNeutralStrokeDisabled)";var q="var(--colorTransparentStroke)",mo="var(--colorTransparentStrokeInteractive)";var bo="var(--colorStrokeFocus1)",ae="var(--colorStrokeFocus2)";var Ur="var(--colorPaletteRedBackground1)";var Ss="var(--colorPaletteRedBackground3)";var qr="var(--colorPaletteRedBorder1)",Bs="var(--colorPaletteRedBorder2)",ws="var(--colorPaletteRedForeground1)";var fi="var(--colorPaletteRedForeground3)";var Kr="var(--colorPaletteGreenBackground1)";var Ns="var(--colorPaletteGreenBackground3)";var $s="var(--colorPaletteGreenBorder1)",Ps="var(--colorPaletteGreenBorder2)",Fs="var(--colorPaletteGreenForeground1)",Ts="var(--colorPaletteGreenForeground2)",As="var(--colorPaletteGreenForeground3)";var Yr="var(--colorPaletteDarkOrangeBackground1)";var Cs="var(--colorPaletteDarkOrangeBackground3)";var Jr="var(--colorPaletteDarkOrangeBorder1)";var Is="var(--colorPaletteDarkOrangeForeground1)";var mi="var(--colorPaletteDarkOrangeForeground3)",Hs="var(--colorPaletteYellowBackground1)";var Ds="var(--colorPaletteYellowBackground3)";var Ls="var(--colorPaletteYellowBorder1)";var Qr="var(--colorPaletteYellowForeground2)";var vo="var(--borderRadiusNone)",Re="var(--borderRadiusSmall)",M="var(--borderRadiusMedium)",Os="var(--borderRadiusLarge)",Ms="var(--borderRadiusXLarge)";var ve="var(--borderRadiusCircular)",$="var(--fontFamilyBase)";var Jo="var(--fontSizeBase100)",de="var(--fontSizeBase200)",se="var(--fontSizeBase300)",Ze="var(--fontSizeBase400)",xo="var(--fontSizeBase500)",Zr="var(--fontSizeBase600)",Es="var(--fontSizeHero700)",zs="var(--fontSizeHero800)",Rs="var(--fontSizeHero900)",_s="var(--fontSizeHero1000)",Q="var(--fontWeightRegular)";var te="var(--fontWeightSemibold)",en="var(--fontWeightBold)",Qo="var(--lineHeightBase100)",ue="var(--lineHeightBase200)",le="var(--lineHeightBase300)",Ue="var(--lineHeightBase400)",tn="var(--lineHeightBase500)",Vs="var(--lineHeightBase600)",Ws="var(--lineHeightHero700)",js="var(--lineHeightHero800)",Gs="var(--lineHeightHero900)",Xs="var(--lineHeightHero1000)",on="var(--shadow2)",rn="var(--shadow4)";var nn="var(--shadow16)";var Us="var(--shadow64)";var I="var(--strokeWidthThin)",et="var(--strokeWidthThick)",Dt="var(--strokeWidthThicker)";var oe="var(--spacingHorizontalXXS)",qe="var(--spacingHorizontalXS)",De="var(--spacingHorizontalSNudge)",dt="var(--spacingHorizontalS)",tt="var(--spacingHorizontalMNudge)",_e="var(--spacingHorizontalM)",qs="var(--spacingHorizontalL)";var Ks="var(--spacingHorizontalXXL)";var Ys="var(--spacingVerticalXXS)",Zo="var(--spacingVerticalXS)",ko="var(--spacingVerticalSNudge)",Le="var(--spacingVerticalS)",yo="var(--spacingVerticalMNudge)";var an="var(--spacingVerticalL)";var So="var(--spacingVerticalXXL)";var sn="var(--durationUltraFast)",Js="var(--durationFaster)";var Bo="var(--durationNormal)",Qs="var(--durationGentle)",Zs="var(--durationSlow)";var wo="var(--curveAccelerateMid)";var el="var(--curveDecelerateMax)",No="var(--curveDecelerateMid)";var ln="var(--curveEasyEase)",tl="var(--curveLinear)";function ol(t,e){if("requestIdleCallback"in globalThis)return globalThis.requestIdleCallback(t,e);let o=Date.now();return setTimeout(()=>{t({didTimeout:e?.timeout?Date.now()-o>=e.timeout:!1,timeRemaining:()=>0})},e?.timeout??1)}function jt(t,e,o){let r=o?.shallow??!1,n=o?.timeout??50,i=o?.idleCallback??!1,a=`${r?":scope > ":""}:not(:defined)`,s=d=>{if(t.querySelector(a)===null||d&&d.timeRemaining()<=0){i?ol(e,{timeout:n}):e();return}ol(s,{timeout:n})};s()}var er={submit:"submit",reset:"reset",button:"button"};var rl=`${f.prefix}-button`;var nl={download:"download",href:"href",hreflang:"hreflang",ping:"ping",referrerpolicy:"referrerpolicy",rel:"rel",target:"target",type:"type"},cm=`${f.prefix}-anchor-button`;var il=`${f.prefix}-link`;var al=b`
  ${T("inline")}

  :host {
    position: relative;
    box-sizing: border-box;
    background-color: transparent;
    color: ${Ya};
    cursor: pointer;
    font-family: ${$};
    font-size: ${se};
    font-weight: ${Q};
    overflow: inherit;
    text-align: start;
    text-decoration: none;
    text-decoration-thickness: ${I};
    text-overflow: inherit;
    user-select: text;
  }

  :host(:hover) {
    outline: none;
    text-decoration-line: underline;
  }

  @media (hover: hover) {
    :host(:hover) {
      color: ${Ja};
    }

    :host(:active) {
      color: ${Qa};
    }

    :host([appearance='subtle']:hover) {
      color: ${es};
    }

    :host([appearance='subtle']:active) {
      color: ${ts};
    }
  }

  :host([appearance='subtle']) {
    color: ${Za};
  }

  :host-context(:is(h1, h2, h3, h4, h5, h6, p, fluent-text)),
  :host([inline]) {
    font: inherit;
    text-decoration: underline;
  }

  :host(:focus-visible),
  :host-context(:is(h1, h2, h3, h4, h5, h6, p, fluent-text)):focus-visible,
  :host([inline]:focus-visible) {
    outline-style: none;
    text-decoration-line: underline;
    text-decoration-style: double;
    text-decoration-color: ${ae};
  }

  :host(:not([href])) {
    color: inherit;
    text-decoration: none;
  }

  ::slotted(a) {
    position: absolute;
    inset: 0;
  }

  @media (forced-colors: active) {
    :host {
      color: LinkText;
    }
  }
`;function np(){return y`
    <template
      @click="${(t,e)=>t.clickHandler(e.event)}"
      @keydown="${(t,e)=>t.keydownHandler(e.event)}"
    >
      <slot></slot>
    </template>
  `}var sl=np();var ll={name:il,registry:f.registry,styles:al,template:sl};var Ke=class extends F{constructor(){super(),this.isMac=navigator.userAgent.includes("Mac"),this.elementInternals=this.attachInternals(),this.internalProxyAnchor=this.createProxyElement(),this.elementInternals.role="link"}connectedCallback(){super.connectedCallback(),this.tabIndex=Number(this.getAttribute("tabindex")??0)<0?-1:0,v.getNotifier(this).subscribe(this),Object.keys(this.$fastController.definition.attributeLookup).forEach(e=>{this.handleChange(this,e)}),this.append(this.internalProxyAnchor)}disconnectedCallback(){super.disconnectedCallback(),v.getNotifier(this).unsubscribe(this)}handleChange(e,o){if(o in nl){let r=this.$fastController.definition.attributeLookup[o]?.attribute;r&&this.handleProxyAttributeChange(r,this[o])}}clickHandler(e){if(e.composedPath()[0]===this.internalProxyAnchor)return e.stopImmediatePropagation(),!0;if(this.href){let o=e.ctrlKey||e.metaKey;this.handleNavigation(o)}return!0}keydownHandler(e){if(this.href&&e.key==="Enter"){let o=this.isMac&&e.metaKey||e.ctrlKey;this.handleNavigation(o);return}return!0}handleNavigation(e){e?window.open(this.href,"_blank"):this.internalProxyAnchor.click()}handleProxyAttributeChange(e,o){o?this.internalProxyAnchor.setAttribute(e,o):this.internalProxyAnchor.removeAttribute(e)}createProxyElement(){let e=this.internalProxyAnchor??document.createElement("a");return e.inert=!0,e}};l([p],Ke.prototype,"download",void 0);l([p],Ke.prototype,"href",void 0);l([p],Ke.prototype,"hreflang",void 0);l([p],Ke.prototype,"ping",void 0);l([p],Ke.prototype,"referrerpolicy",void 0);l([p],Ke.prototype,"rel",void 0);l([p],Ke.prototype,"target",void 0);l([p],Ke.prototype,"type",void 0);var cn=class extends Ke{};var cl=`${f.prefix}-badge`;var dl=b.partial`
  ${T("inline-flex")} :host {
    position: relative;
    box-sizing: border-box;
    align-items: center;
    justify-content: center;
    font-family: ${$};
    font-weight: ${te};
    font-size: ${de};
    line-height: ${ue};
    min-width: 20px;
    height: 20px;
    padding-inline: calc(${qe} + ${oe});
    border-radius: ${ve};
    border-color: ${q};
    background-color: ${Gr};
    color: ${vt};
    contain: content;
  }

  ::slotted(svg) {
    font-size: 12px;
  }

  :host(:not([appearance='ghost']))::after {
    position: absolute;
    content: '';
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    border-style: solid;
    border-width: ${I};
    border-color: inherit;
    border-radius: inherit;
  }
`,ul=b.partial`
  :host([size='tiny']) {
    width: 6px;
    height: 6px;
    font-size: 4px;
    line-height: 4px;
    padding-inline: 0;
    min-width: unset;
  }
  :host([size='tiny']) ::slotted(svg) {
    font-size: 6px;
  }
  :host([size='extra-small']) {
    width: 10px;
    height: 10px;
    font-size: 6px;
    line-height: 6px;
    padding-inline: 0;
    min-width: unset;
  }
  :host([size='extra-small']) ::slotted(svg) {
    font-size: 10px;
  }
  :host([size='small']) {
    min-width: 16px;
    height: 16px;
    font-size: ${Jo};
    line-height: ${Qo};
    padding-inline: calc(${oe} + ${oe});
  }
  :host([size='small']) ::slotted(svg) {
    font-size: 12px;
  }
  :host([size='large']) {
    min-width: 24px;
    height: 24px;
    font-size: ${de};
    line-height: ${ue};
    padding-inline: calc(${qe} + ${oe});
  }
  :host([size='large']) ::slotted(svg) {
    font-size: 16px;
  }
  :host([size='extra-large']) {
    min-width: 32px;
    height: 32px;
    font-size: ${de};
    line-height: ${ue};
    padding-inline: calc(${De} + ${oe});
  }
  :host([size='extra-large']) ::slotted(svg) {
    font-size: 20px;
  }
`,pl=b.partial`
  :host([color='danger']) {
    background-color: ${Ss};
    color: ${vt};
  }

  :host([color='important']) {
    background-color: ${X};
    color: ${A};
  }

  :host([color='informative']) {
    background-color: ${us};
    color: ${U};
  }

  :host([color='severe']) {
    background-color: ${Cs};
    color: ${vt};
  }

  :host([color='subtle']) {
    background-color: ${A};
    color: ${X};
  }

  :host([color='success']) {
    background-color: ${Ns};
    color: ${vt};
  }

  :host([color='warning']) {
    background-color: ${Ds};
    color: ${ls};
  }
`,hl=b.partial`
  :host([appearance='ghost']) {
    color: ${Ko};
    background-color: initial;
  }

  :host([appearance='ghost'][color='danger']) {
    color: ${fi};
  }

  :host([appearance='ghost'][color='important']) {
    color: ${X};
  }

  :host([appearance='ghost'][color='informative']) {
    color: ${U};
  }

  :host([appearance='ghost'][color='severe']) {
    color: ${mi};
  }

  :host([appearance='ghost'][color='subtle']) {
    color: ${ct};
  }

  :host([appearance='ghost'][color='success']) {
    color: ${As};
  }

  :host([appearance='ghost'][color='warning']) {
    color: ${Qr};
  }
`,gl=b.partial`
  :host([appearance='outline']) {
    border-color: currentColor;
    color: ${Ko};
    background-color: initial;
  }

  :host([appearance='outline'][color='danger']) {
    color: ${fi};
  }

  :host([appearance='outline'][color='important']) {
    color: ${U};
    border-color: ${we};
  }

  :host([appearance='outline'][color='informative']) {
    color: ${U};
    border-color: ${fo};
  }

  :host([appearance='outline'][color='severe']) {
    color: ${mi};
  }

  :host([appearance='outline'][color='subtle']) {
    color: ${as};
  }

  :host([appearance='outline'][color='success']) {
    color: ${Ts};
  }

  :host([appearance='outline'][color='warning']) {
    color: ${Qr};
  }
`,fl=b.partial`
  :host([appearance='tint']) {
    background-color: ${bs};
    color: ${ss};
    border-color: ${ks};
  }

  :host([appearance='tint'][color='danger']) {
    background-color: ${Ur};
    color: ${ws};
    border-color: ${qr};
  }

  :host([appearance='tint'][color='important']) {
    background-color: ${U};
    color: ${A};
    border-color: ${q};
  }

  :host([appearance='tint'][color='informative']) {
    background-color: ${ds};
    color: ${U};
    border-color: ${fo};
  }

  :host([appearance='tint'][color='severe']) {
    background-color: ${Yr};
    color: ${Is};
    border-color: ${Jr};
  }

  :host([appearance='tint'][color='subtle']) {
    background-color: ${A};
    color: ${U};
    border-color: ${fo};
  }

  :host([appearance='tint'][color='success']) {
    background-color: ${Kr};
    color: ${Fs};
    border-color: ${Ps};
  }

  :host([appearance='tint'][color='warning']) {
    background-color: ${Hs};
    color: ${Qr};
    border-color: ${Ls};
  }
`;var ml=b`
  :host([shape='square']) {
    border-radius: ${vo};
  }

  :host([shape='rounded']) {
    border-radius: ${M};
  }

  :host([shape='rounded']:is([size='tiny'], [size='extra-small'], [size='small'])) {
    border-radius: ${Re};
  }

  ${fl}
  ${gl}
  ${hl}
  ${pl}
  ${ul}
  ${dl}

  @media (forced-colors: active) {
    :host,
    :host([appearance='outline']),
    :host([appearance='tint']) {
      border-color: CanvasText;
    }
  }
`;function ip(t={}){return y`
    ${Xe(t)}
    <slot>${ie(t.defaultContent)}</slot>
    ${st(t)}
  `}var bl=ip();var vl={name:cl,registry:f.registry,styles:ml,template:bl};var tr=class extends F{};lt(tr,Ge);var ap=b`
  ${T("inline-flex")}

  :host {
    --icon-spacing: ${De};
    position: relative;
    contain: layout style;
    vertical-align: middle;
    align-items: center;
    box-sizing: border-box;
    justify-content: center;
    text-align: center;
    text-decoration-line: none;
    margin: 0;
    min-height: 32px;
    outline-style: none;
    background-color: ${A};
    color: ${X};
    border: ${I} solid ${Ne};
    padding: 0 ${_e};
    min-width: 96px;
    border-radius: ${M};
    font-size: ${se};
    font-family: ${$};
    font-weight: ${te};
    line-height: ${le};
    transition-duration: ${Js};
    transition-property: background, border, color;
    transition-timing-function: ${ln};
    cursor: pointer;
    user-select: none;
  }

  .content {
    display: inherit;
  }

  :host(:hover) {
    background-color: ${ho};
    color: ${_r};
    border-color: ${wt};
  }

  :host(:hover:active) {
    background-color: ${Wr};
    border-color: ${go};
    color: ${Ua};
    outline-style: none;
  }

  :host(:focus-visible) {
    border-color: ${q};
    outline: ${et} solid ${q};
    box-shadow: ${rn}, 0 0 0 2px ${ae};
  }

  @media screen and (prefers-reduced-motion: reduce) {
    :host {
      transition-duration: 0.01ms;
    }
  }

  ::slotted(svg) {
    font-size: 20px;
    height: 20px;
    width: 20px;
    fill: currentColor;
  }

  ::slotted([slot='start']) {
    margin-inline-end: var(--icon-spacing);
  }

  ::slotted([slot='end']),
  [slot='end'] {
    flex-shrink: 0;
    margin-inline-start: var(--icon-spacing);
  }

  :host([icon-only]) {
    min-width: 32px;
    max-width: 32px;
  }

  :host([size='small']) {
    --icon-spacing: ${qe};
    min-height: 24px;
    min-width: 64px;
    padding: 0 ${dt};
    border-radius: ${Re};
    font-size: ${de};
    line-height: ${ue};
    font-weight: ${Q};
  }

  :host([size='small'][icon-only]) {
    min-width: 24px;
    max-width: 24px;
  }

  :host([size='large']) {
    min-height: 40px;
    border-radius: ${Os};
    padding: 0 ${qs};
    font-size: ${Ze};
    line-height: ${Ue};
  }

  :host([size='large'][icon-only]) {
    min-width: 40px;
    max-width: 40px;
  }

  :host([size='large']) ::slotted(svg) {
    font-size: 24px;
    height: 24px;
    width: 24px;
  }

  :host(:is([shape='circular'], [shape='circular']:focus-visible)) {
    border-radius: ${ve};
  }

  :host(:is([shape='square'], [shape='square']:focus-visible)) {
    border-radius: ${vo};
  }

  :host([appearance='primary']) {
    background-color: ${Gr};
    color: ${vt};
    border-color: transparent;
  }

  :host([appearance='primary']:hover) {
    background-color: ${fs};
  }

  :host([appearance='primary']:is(:hover, :hover:active):not(:focus-visible)) {
    border-color: transparent;
  }

  :host([appearance='primary']:is(:hover, :hover:active)) {
    color: ${vt};
  }

  :host([appearance='primary']:hover:active) {
    background-color: ${ms};
  }

  :host([appearance='primary']:focus-visible) {
    border-color: ${vt};
    box-shadow: ${on}, 0 0 0 2px ${ae};
  }

  :host([appearance='outline']) {
    background-color: ${Ce};
  }

  :host([appearance='outline']:hover) {
    background-color: ${hi};
  }

  :host([appearance='outline']:hover:active) {
    background-color: ${gi};
  }

  :host([appearance='subtle']) {
    background-color: ${hs};
    color: ${ze};
    border-color: transparent;
  }

  :host([appearance='subtle']:hover) {
    background-color: ${jr};
    color: ${uo};
    border-color: transparent;
  }

  :host([appearance='subtle']:hover:active) {
    background-color: ${Yo};
    color: ${po};
    border-color: transparent;
  }

  :host([appearance='subtle']:hover) ::slotted(svg) {
    fill: ${ui};
  }

  :host([appearance='subtle']:hover:active) ::slotted(svg) {
    fill: ${pi};
  }

  :host([appearance='transparent']) {
    background-color: ${Ce};
    color: ${ze};
  }

  :host([appearance='transparent']:hover) {
    background-color: ${hi};
    color: ${ui};
  }

  :host([appearance='transparent']:hover:active) {
    background-color: ${gi};
    color: ${pi};
  }

  :host(:is([appearance='transparent'], [appearance='transparent']:is(:hover, :active))) {
    border-color: transparent;
  }
`,dn=b`
  ${ap}

  :host(:is(:disabled, [disabled], [disabled-focusable], [appearance]:disabled, [appearance][disabled], [appearance][disabled-focusable])),
  :host(:is(:disabled, [disabled], [disabled-focusable], [appearance]:disabled, [appearance][disabled], [appearance][disabled-focusable]):hover),
  :host(:is(:disabled, [disabled], [disabled-focusable], [appearance]:disabled, [appearance][disabled], [appearance][disabled-focusable]):hover:active) {
    background-color: ${Ie};
    border-color: ${be};
    color: ${_};
    cursor: not-allowed;
  }

  :host([appearance='primary']:is(:disabled, [disabled], [disabled-focusable])),
  :host([appearance='primary']:is(:disabled, [disabled], [disabled-focusable]):is(:hover, :hover:active)) {
    border-color: transparent;
  }

  :host([appearance='outline']:is(:disabled, [disabled], [disabled-focusable])),
  :host([appearance='outline']:is(:disabled, [disabled], [disabled-focusable]):is(:hover, :hover:active)) {
    background-color: ${Ce};
  }

  :host([appearance='subtle']:is(:disabled, [disabled], [disabled-focusable])),
  :host([appearance='subtle']:is(:disabled, [disabled], [disabled-focusable]):is(:hover, :hover:active)) {
    background-color: ${Ce};
    border-color: transparent;
  }

  :host([appearance='transparent']:is(:disabled, [disabled], [disabled-focusable])),
  :host([appearance='transparent']:is(:disabled, [disabled], [disabled-focusable]):is(:hover, :hover:active)) {
    border-color: transparent;
    background-color: ${Ce};
  }

  @media (forced-colors: active) {
    :host {
      background-color: ButtonFace;
      color: ButtonText;
    }

    :host(:is(:hover, :focus-visible)) {
      border-color: Highlight !important;
    }

    :host([appearance='primary']:not(:is(:hover, :focus-visible))) {
      background-color: Highlight;
      color: HighlightText;
      forced-color-adjust: none;
    }

    :host(
        :is(
            :disabled,
            [disabled],
            [disabled-focusable],
            [appearance]:disabled,
            [appearance][disabled],
            [appearance][disabled-focusable]
          )
      ) {
      background-color: ButtonFace;
      color: GrayText;
      border-color: ButtonText;
    }
  }
`;function bi(t={}){return y`
    <template
      @click="${(e,o)=>e.clickHandler(o.event)}"
      @keypress="${(e,o)=>e.keypressHandler(o.event)}"
    >
      ${Xe(t)}
      <span class="content" part="content">
        <slot ${fe("defaultSlottedContent")}></slot>
      </span>
      ${st(t)}
    </template>
  `}var xl=bi();var kl={name:rl,registry:f.registry,styles:dn,template:xl};function Oe(t){let e=t.ownerDocument;t?.isConnected&&t?.hasAttribute("autofocus")&&t?.checkVisibility?.({contentVisibilityAuto:!0,visibilityProperty:!0})&&[null,t,e.body,e.documentElement].includes(e.activeElement)&&L.enqueue(()=>{t.focus()})}var xe=class extends F{disabledChanged(){this.setTabIndex()}disabledFocusableChanged(e,o){this.elementInternals&&(this.elementInternals.ariaDisabled=`${!!o}`)}get form(){return this.elementInternals.form}static{this.formAssociated=!0}get labels(){return Object.freeze(Array.from(this.elementInternals.labels))}typeChanged(e,o){o!==er.submit&&(this.formSubmissionFallbackControl?.remove(),this.shadowRoot?.querySelector('slot[name="internal"]')?.remove())}clickHandler(e){if(e&&this.disabledFocusable){e.stopImmediatePropagation();return}return this.press(),!0}connectedCallback(){super.connectedCallback(),this.elementInternals.ariaDisabled=`${!!this.disabledFocusable}`,this.setTabIndex(),Oe(this)}constructor(){super(),this.disabledFocusable=!1,this.elementInternals=this.attachInternals(),this.elementInternals.role="button"}createAndInsertFormSubmissionFallbackControl(){let e=this.formSubmissionFallbackControlSlot??document.createElement("slot");e.setAttribute("name","internal"),this.shadowRoot?.appendChild(e),this.formSubmissionFallbackControlSlot=e;let o=this.formSubmissionFallbackControl??document.createElement("button");o.style.display="none",o.setAttribute("type","submit"),o.setAttribute("slot","internal"),this.formNoValidate&&o.toggleAttribute("formnovalidate",!0),this.elementInternals.form?.id&&o.setAttribute("form",this.elementInternals.form.id),this.name&&o.setAttribute("name",this.name),this.value&&o.setAttribute("value",this.value),this.formAction&&o.setAttribute("formaction",this.formAction??""),this.formEnctype&&o.setAttribute("formenctype",this.formEnctype??""),this.formMethod&&o.setAttribute("formmethod",this.formMethod??""),this.formTarget&&o.setAttribute("formtarget",this.formTarget??""),this.append(o),this.formSubmissionFallbackControl=o}formDisabledCallback(e){this.disabled=e}keypressHandler(e){if(e&&this.disabledFocusable){e.stopImmediatePropagation();return}if(e.key==="Enter"||e.key===" "){this.click();return}return!0}press(){switch(this.type){case er.reset:{this.resetForm();break}case er.submit:{this.submitForm();break}}}resetForm(){this.elementInternals.form?.reset()}setTabIndex(){if(this.disabled){this.removeAttribute("tabindex");return}this.tabIndex=Number(this.getAttribute("tabindex")??0)<0?-1:0}submitForm(){if(!(!this.elementInternals.form||this.disabled||this.type!==er.submit)){if(!this.name&&!this.formAction&&!this.formEnctype&&!this.formAttribute&&!this.formMethod&&!this.formNoValidate&&!this.formTarget){this.elementInternals.form.requestSubmit();return}try{this.elementInternals.setFormValue(this.value??""),this.elementInternals.form.requestSubmit(this)}catch{this.createAndInsertFormSubmissionFallbackControl(),this.elementInternals.setFormValue(null),this.elementInternals.form.requestSubmit(this.formSubmissionFallbackControl)}}}};l([k],xe.prototype,"defaultSlottedContent",void 0);l([p({mode:"boolean"})],xe.prototype,"disabled",void 0);l([p({attribute:"disabled-focusable",mode:"boolean"})],xe.prototype,"disabledFocusable",void 0);l([p({attribute:"formaction"})],xe.prototype,"formAction",void 0);l([p({attribute:"form"})],xe.prototype,"formAttribute",void 0);l([p({attribute:"formenctype"})],xe.prototype,"formEnctype",void 0);l([p({attribute:"formmethod"})],xe.prototype,"formMethod",void 0);l([p({attribute:"formnovalidate",mode:"boolean"})],xe.prototype,"formNoValidate",void 0);l([p({attribute:"formtarget"})],xe.prototype,"formTarget",void 0);l([p],xe.prototype,"name",void 0);l([p],xe.prototype,"type",void 0);l([p],xe.prototype,"value",void 0);var Gt=class extends xe{};lt(Gt,Ge);var yl=`${f.prefix}-checkbox`;var vi=CSS.supports("anchor-name: --a"),wb="anchor"in HTMLElement.prototype,xi=CSS.supports("selector(:state(g))");var Sl=new Map;function E(t){return Sl.get(t)??Sl.set(t,xi?`:state(${t})`:`[state--${t}]`).get(t)}function z(t,e,o){if(!(!e||!t)){if(!xi){t.shadowRoot.host.toggleAttribute(`state--${e}`,o);return}if(o??!t.states.has(e)){t.states.add(e);return}t.states.delete(e)}}var ki=new WeakMap;function sp(t,e){if(!t||!e)return!1;if(ki.has(t))return ki.get(t).has(e);let o=new Set(Object.values(t));return ki.set(t,o),o.has(e)}function un(t,e="",o="",r,n=""){z(t,`${n}${e}`,!1),(!r||sp(r,o))&&z(t,`${n}${o}`,!0)}var Tb=E("active"),Ab=E("bad-input"),O=E("checked"),Cb=E("custom-error"),Bl=E("description"),Xt=E("disabled"),w=":is([disabled], :disabled)",Ib=E("error"),wl=E("flip-block"),Hb=E("focus-visible"),Db=E("has-message"),Lt=E("indeterminate"),Ut=E("multiple"),Nl=E("open"),Lb=E("pattern-mismatch"),$l=E("placeholder-shown"),Ob=E("pressed"),Mb=E("range-overflow"),Eb=E("range-underflow"),zb=E("required"),pn=E("selected"),Rb=E("step-mismatch"),yi=E("submenu"),_b=E("too-long"),Vb=E("too-short"),Wb=E("type-mismatch"),jb=E("user-invalid"),Gb=E("valid"),Xb=E("value-missing");var Pl=b`
  ${T("inline-flex")}

  :host {
    --size: 16px;
    background-color: ${A};
    border-radius: ${Re};
    border: ${I} solid ${we};
    box-sizing: border-box;
    cursor: pointer;
    position: relative;
    width: var(--size);
  }

  :host,
  .indeterminate-indicator,
  .checked-indicator {
    aspect-ratio: 1;
  }

  :host(:hover) {
    border-color: ${St};
  }

  :host(:active) {
    border-color: ${Bt};
  }

  :host(${O}:hover) {
    background-color: ${kt};
    border-color: ${ys};
  }

  :host(${O}:active) {
    background-color: ${yt};
    border-color: ${Xr};
  }

  :host(:focus-visible) {
    outline: none;
  }

  :host(:not([slot='input']))::after {
    content: '';
    position: absolute;
    inset: -8px;
    box-sizing: border-box;
    outline: none;
    border: ${et} solid ${q};
    border-radius: ${M};
  }

  :host(:not([slot='input']):focus-visible)::after {
    border-color: ${ae};
  }

  .indeterminate-indicator,
  .checked-indicator {
    color: ${ct};
    inset: 0;
    margin: auto;
    position: absolute;
  }

  ::slotted([slot='checked-indicator']),
  .checked-indicator {
    fill: currentColor;
    display: inline-flex;
    flex: 1 0 auto;
    width: 12px;
  }

  :host(:not(${O})) *:is(::slotted([slot='checked-indicator']), .checked-indicator) {
    display: none;
  }

  :host(${O}),
  :host(${Lt}) {
    border-color: ${He};
  }

  :host(${O}),
  :host(${Lt}) .indeterminate-indicator {
    background-color: ${xt};
  }

  :host(${Lt}) .indeterminate-indicator {
    border-radius: ${Re};
    position: absolute;
    width: calc(var(--size) / 2);
    inset: 0;
  }

  :host([size='large']) {
    --size: 20px;
  }

  :host([size='large']) ::slotted([slot='checked-indicator']),
  :host([size='large']) .checked-indicator {
    width: 16px;
  }

  :host([shape='circular']),
  :host([shape='circular']) .indeterminate-indicator {
    border-radius: ${ve};
  }

  :host(${w}),
  :host(${w}${O}) {
    background-color: ${Ie};
    border-color: ${be};
  }

  :host(${w}) {
    cursor: unset;
  }

  :host(${w}${Lt}) .indeterminate-indicator {
    background-color: ${be};
  }

  :host(${w}${O}) .checked-indicator {
    color: ${be};
  }

  @media (forced-colors: active) {
    :host {
      border-color: FieldText;
    }

    :host(:not([slot='input']:focus-visible))::after {
      border-color: Canvas;
    }

    :host(:not(${w}):hover),
    :host(${O}:not(${w}):hover),
    :host(:not([slot='input']):focus-visible)::after {
      border-color: Highlight;
    }

    .indeterminate-indicator,
    .checked-indicator {
      color: HighlightText;
    }

    :host(${O}),
    :host(${Lt}) .indeterminate-indicator {
      background-color: FieldText;
    }

    :host(${O}:not(${w}):hover),
    :host(${Lt}:not(${w}):hover) .indeterminate-indicator {
      background-color: Highlight;
    }

    :host(${w}) {
      border-color: GrayText;
    }

    :host(${w}${Lt}) .indeterminate-indicator {
      background-color: GrayText;
    }

    :host(${w}),
    :host(${w}${O}) .checked-indicator {
      color: GrayText;
    }
  }
`;var lp=y.partial(`
    <svg
        fill="currentColor"
        aria-hidden="true"
        class="checked-indicator"
        width="1em"
        height="1em"
        viewBox="0 0 12 12"
        xmlns="http://www.w3.org/2000/svg">
            <path d="M9.76 3.2c.3.29.32.76.04 1.06l-4.25 4.5a.75.75 0 0 1-1.08.02L2.22 6.53a.75.75 0 0 1 1.06-1.06l1.7 1.7L8.7 3.24a.75.75 0 0 1 1.06-.04Z" fill="currentColor"></path>
    </svg>
`),cp=y.partial(`
    <span class="indeterminate-indicator"></span>
`);function dp(t={}){return y`
    <template
      @click="${(e,o)=>e.clickHandler(o.event)}"
      @input="${(e,o)=>e.inputHandler(o.event)}"
      @keydown="${(e,o)=>e.keydownHandler(o.event)}"
      @keyup="${(e,o)=>e.keyupHandler(o.event)}"
    >
      <slot name="checked-indicator">${ie(t.checkedIndicator)}</slot>
      <slot name="indeterminate-indicator">${ie(t.indeterminateIndicator)}</slot>
    </template>
  `}var Fl=dp({checkedIndicator:lp,indeterminateIndicator:cp});var Tl={name:yl,registry:f.registry,styles:Pl,template:Fl};var Ve=class extends F{constructor(){super(...arguments),this.initialValue="on",this._keydownPressed=!1,this.dirtyChecked=!1,this.elementInternals=this.attachInternals(),this._validationFallbackMessage="",this._value=this.initialValue}get checked(){return v.track(this,"checked"),!!this._checked}set checked(e){this._checked=e,this.setFormValue(e?this.value:null),this.setValidity(),this.setAriaChecked(),z(this.elementInternals,"checked",e),v.notify(this,"checked")}disabledChanged(e,o){this.disabled?this.removeAttribute("tabindex"):this.tabIndex=Number(this.getAttribute("tabindex")??0)<0?-1:0,this.elementInternals.ariaDisabled=this.disabled?"true":"false",z(this.elementInternals,"disabled",this.disabled)}disabledAttributeChanged(e,o){this.disabled=!!o}initialCheckedChanged(e,o){this.dirtyChecked||(this.checked=!!o)}initialValueChanged(e,o){this._value=o}requiredChanged(e,o){this.elementInternals&&(this.setValidity(),this.elementInternals.ariaRequired=this.required?"true":"false")}get form(){return this.elementInternals.form}static{this.formAssociated=!0}get labels(){return Object.freeze(Array.from(this.elementInternals.labels))}get validationMessage(){if(this.elementInternals?.validationMessage)return this.elementInternals.validationMessage;if(!this._validationFallbackMessage){let e=document.createElement("input");e.type="checkbox",e.required=!0,e.checked=!1,this._validationFallbackMessage=e.validationMessage}return this._validationFallbackMessage}get validity(){return this.elementInternals.validity}get value(){return v.track(this,"value"),this._value}set value(e){this._value=e,this.elementInternals&&(this.setFormValue(e),this.setValidity()),v.notify(this,"value")}get willValidate(){return this.elementInternals.willValidate}checkValidity(){return this.elementInternals.checkValidity()}clickHandler(e){if(this.disabled)return;this.dirtyChecked=!0;let o=this.checked;return this.toggleChecked(),o!==this.checked&&(this.$emit("change"),this.$emit("input")),!0}connectedCallback(){super.connectedCallback(),this.disabled=!!this.disabledAttribute,this.setAriaChecked(),this.setValidity(),Oe(this)}inputHandler(e){return this.setFormValue(this.value),this.setValidity(),!0}keydownHandler(e){if(e.key!==" ")return!0;this._keydownPressed=!0}keyupHandler(e){if(!this._keydownPressed||e.key!==" ")return!0;this._keydownPressed=!1,this.click()}formResetCallback(){this.checked=this.initialChecked??!1,this.dirtyChecked=!1,this.setValidity()}reportValidity(){return this.elementInternals.reportValidity()}setAriaChecked(e=this.checked){this.elementInternals&&(this.elementInternals.ariaChecked=e?"true":"false")}setFormValue(e,o){this.elementInternals?.setFormValue(e,e??o)}setCustomValidity(e){this.elementInternals.setValidity({customError:!0},e),this.setValidity()}setValidity(e,o,r){if(this.elementInternals){if(this.disabled||!this.required){this.elementInternals.setValidity({});return}this.elementInternals.setValidity({valueMissing:!!this.required&&!this.checked,...e},o??this.validationMessage,r)}}toggleChecked(e=!this.checked){this.checked=e}};l([k],Ve.prototype,"disabled",void 0);l([p({attribute:"disabled",mode:"boolean"})],Ve.prototype,"disabledAttribute",void 0);l([p({attribute:"form"})],Ve.prototype,"formAttribute",void 0);l([p({attribute:"checked",mode:"boolean"})],Ve.prototype,"initialChecked",void 0);l([p({attribute:"value",mode:"fromView"})],Ve.prototype,"initialValue",void 0);l([p],Ve.prototype,"name",void 0);l([p({mode:"boolean"})],Ve.prototype,"required",void 0);var or=class extends Ve{indeterminateChanged(e,o){this.setAriaChecked(),z(this.elementInternals,"indeterminate",o)}constructor(){super(),this.elementInternals.role="checkbox"}setAriaChecked(e=this.checked){if(this.indeterminate){this.elementInternals.ariaChecked="mixed";return}super.setAriaChecked(e)}toggleChecked(e=!this.checked){this.indeterminate=!1,super.toggleChecked(e)}};l([k],or.prototype,"indeterminate",void 0);var Ot={modal:"modal",nonModal:"non-modal",alert:"alert"};function Al(t,e="-dialog"){return t?.nodeType!==Node.ELEMENT_NODE?!1:t.tagName.toLowerCase().endsWith(e)}var Cl=`${f.prefix}-dialog`;var Me=class extends F{constructor(){super(...arguments),this.emitToggle=()=>{this.$emit("toggle",{oldState:this.dialog.open?"closed":"open",newState:this.dialog.open?"open":"closed"})}}get dialogDescribedby(){if(this.dialog)return this.ariaDescribedby}get dialogLabel(){if(this.dialog)return this.ariaLabel}get dialogLabelledby(){if(this.dialog)return this.ariaLabelledby}get dialogModal(){if(this.dialog&&this.type!==Ot.nonModal)return!0}get dialogRole(){if(this.dialog&&this.type===Ot.alert)return"alertdialog"}connectedCallback(){super.connectedCallback(),L.enqueue(()=>{this.type=this.type??Ot.modal})}emitBeforeToggle(){this.$emit("beforetoggle",{oldState:this.dialog.open?"open":"closed",newState:this.dialog.open?"closed":"open"})}show(){L.enqueue(()=>{this.emitBeforeToggle(),this.type===Ot.alert||this.type===Ot.modal?this.dialog.showModal():this.type===Ot.nonModal&&this.dialog.show(),this.querySelector("[autofocus]")?.focus?.(),this.emitToggle()})}hide(){this.emitBeforeToggle(),this.dialog.close(),this.emitToggle()}clickHandler(e){return this.dialog.open&&this.type!==Ot.alert&&e.target===this.dialog&&this.hide(),!0}};l([k],Me.prototype,"dialog",void 0);l([p({attribute:"aria-describedby"})],Me.prototype,"ariaDescribedby",void 0);l([p({attribute:"aria-labelledby"})],Me.prototype,"ariaLabelledby",void 0);l([p({attribute:"aria-label"})],Me.prototype,"ariaLabel",void 0);l([p],Me.prototype,"type",void 0);l([it],Me.prototype,"dialogDescribedby",null);l([it],Me.prototype,"dialogLabel",null);l([it],Me.prototype,"dialogLabelledby",null);l([it],Me.prototype,"dialogModal",null);l([it],Me.prototype,"dialogRole",null);var Il=b`
  @layer base {
    :host {
      --dialog-backdrop: ${gs};
      --dialog-starting-scale: 0.85;
    }

    ::backdrop {
      background: var(--dialog-backdrop, rgba(0, 0, 0, 0.4));
    }

    dialog {
      background: ${A};
      border-radius: ${Ms};
      border: none;
      box-shadow: ${Us};
      color: ${X};
      max-height: 100vh;
      padding: 0;
      width: 100%;
      max-width: 600px;
    }

    :host([type='non-modal']) dialog {
      inset: 0;
      z-index: 2;
      overflow: auto;
    }

    @supports (max-height: 1dvh) {
      dialog {
        max-height: 100dvh;
      }
    }
  }

  @layer animations {
    /* Disable animations for reduced motion */
    @media (prefers-reduced-motion: no-preference) {
      dialog,
      ::backdrop {
        transition: display allow-discrete, opacity, overlay allow-discrete, scale;
        transition-duration: ${Qs};
        transition-timing-function: ${No};
        /* Set opacity to 0 when closed */
        opacity: 0;
      }
      ::backdrop {
        transition-timing-function: ${tl};
      }

      /* Set opacity to 1 when open */
      [open],
      [open]::backdrop {
        opacity: 1;
      }

      /* Exit styles for dialog */
      dialog:not([open]) {
        /* Make small when leaving */
        scale: var(--dialog-starting-scale);
        /* Faster leaving the stage then entering */
        transition-timing-function: ${wo};
      }
    }

    @starting-style {
      [open],
      [open]::backdrop {
        opacity: 0;
      }

      dialog {
        scale: var(--dialog-starting-scale);
      }
    }
  }

  @media (forced-colors: active) {
    @layer base {
      dialog {
        border: ${I} solid ${q};
      }
    }
  }
`;var Hl=y`
  <dialog
    class="dialog"
    part="dialog"
    aria-modal="${t=>t.dialogModal}"
    aria-describedby="${t=>t.dialogDescribedby}"
    aria-labelledby="${t=>t.dialogLabelledby}"
    aria-label="${t=>t.dialogLabel}"
    role="${t=>t.dialogRole}"
    @click="${(t,e)=>t.clickHandler(e.event)}"
    @cancel="${t=>t.hide()}"
    ${K("dialog")}
  >
    <div tabindex="-1"></div>
    <slot></slot>
  </dialog>
`;var Dl={name:Cl,registry:f.registry,styles:Il,template:Hl};var hn=class extends F{clickHandler(e){if(!e.defaultPrevented){let o=this.parentElement;Al(o)&&o.hide()}return!0}};var Ll=`${f.prefix}-dialog-body`;var Ol=b`
  ${T("grid")}

  :host {
    background: ${A};
    box-sizing: border-box;
    gap: ${Le};
    padding: ${So} ${Ks};
    container: dialog-body / inline-size;
  }

  .title {
    box-sizing: border-box;
    align-items: flex-start;
    background: ${A};
    color: ${X};
    column-gap: 8px;
    display: flex;
    font-family: ${$};
    font-size: ${xo};
    font-weight: ${te};
    inset-block-start: 0;
    justify-content: space-between;
    line-height: ${tn};
    margin-block-end: calc(${Le} * -1);
    margin-block-start: calc(${So} * -1);
    padding-block-end: ${Le};
    padding-block-start: ${So};
  }

  .content {
    box-sizing: border-box;
    color: ${X};
    font-family: ${$};
    font-size: ${se};
    font-weight: ${Q};
    line-height: ${le};
    min-height: 32px;
  }

  .actions {
    box-sizing: border-box;
    background: ${A};
    display: flex;
    flex-direction: column;
    gap: ${Le};
    inset-block-end: 0;
    margin-block-end: calc(${So} * -1);
    padding-block-end: ${So};
    padding-block-start: ${an};
  }

  ::slotted([slot='title-action']) {
    margin-inline-start: auto;
  }

  ::slotted([slot='title']) {
    font: inherit;
    padding: 0;
    margin: 0;
  }

  /* align  title content to the end when there is no title*/
  :not(:has(:is([slot='title'], [slot='title-action']))) .title {
    justify-content: end;
  }

  @container (min-width: 480px) {
    .actions {
      align-items: center;
      flex-direction: row;
      justify-content: flex-end;
      margin-block-start: calc(${Le} * -1);
      padding-block-start: ${Le};
    }
  }

  /* For a11y, set sticky position for title and actions when the viewport is tall enough */
  @media (min-height: 480px) {
    .title {
      position: sticky;
      z-index: 1;
    }
    .actions {
      position: sticky;
      z-index: 2;
    }
  }
`;var Ml=y`
  <template>
    <div class="title" part="title">
      <slot name="title"></slot>
      <slot name="title-action"></slot>
      <slot name="close" @click="${(t,e)=>t.clickHandler(e.event)}"></slot>
    </div>
    <div class="content" part="content"><slot></slot></div>
    <div class="actions" part="actions"><slot name="action"></slot></div>
  </template>
`;var El={name:Ll,registry:f.registry,styles:Ol,template:Ml};var ke={horizontal:"horizontal",vertical:"vertical"};var $o={separator:"separator",presentation:"presentation"},Si=ke;var zl=`${f.prefix}-divider`;var Po=class extends F{constructor(){super(...arguments),this.elementInternals=this.attachInternals()}connectedCallback(){super.connectedCallback(),this.elementInternals.role=this.role??$o.separator,this.role!==$o.presentation&&(this.elementInternals.ariaOrientation=this.orientation??Si.horizontal)}roleChanged(e,o){this.$fastController.isConnected&&(this.elementInternals.role=`${o??$o.separator}`),o===$o.presentation&&(this.elementInternals.ariaOrientation=null)}orientationChanged(e,o){this.elementInternals.ariaOrientation=this.role!==$o.presentation?o??null:null,un(this.elementInternals,e,o,Si)}};l([p],Po.prototype,"role",void 0);l([p],Po.prototype,"orientation",void 0);var gn=class extends Po{};var Rl=b`
  ${T("flex")}

  :host {
    --_vertical-min-height: 10px;

    contain: content;
  }

  :host::after,
  :host::before {
    align-self: center;
    background: ${fo};
    box-sizing: border-box;
    content: '';
    display: flex;
    flex-grow: 1;
    height: ${I};
  }

  :host([inset]) {
    padding: 0 12px;
  }

  :host ::slotted(*) {
    color: ${ze};
    font-family: ${$};
    font-size: ${de};
    font-weight: ${Q};
    margin: 0;
    padding: 0 12px;
  }

  :host([align-content='start'])::before,
  :host([align-content='end'])::after {
    flex-basis: 12px;
    flex-grow: 0;
    flex-shrink: 0;
  }

  :host([orientation='vertical']) {
    align-items: center;
    flex-direction: column;
    height: 100%;
  }

  :host([orientation='vertical'][inset])::before {
    margin-top: 12px;
  }

  :host([orientation='vertical'][inset])::after {
    margin-bottom: 12px;
  }

  :host([orientation='vertical'])::before,
  :host([orientation='vertical'])::after {
    width: ${I};
    min-height: var(--_vertical-min-height);
    height: 100%;
  }

  /**
   * Use @supports to avoid the scoped styles from applying in Safari. Because
   * Safari supports @scope but ':scope:has(*)' would select a host with no
   * children.
   */
  @supports not selector(:host(:has(*))) {
    @scope {
      :scope:has(*) {
        --_vertical-min-height: 20px;
      }
    }
  }

  :host(:has(*)) {
    --_vertical-min-height: 20px;
  }

  :host([orientation='vertical']) ::slotted(*) {
    display: flex;
    flex-direction: column;
    padding: 12px 0;
    line-height: 20px;
  }

  :host([orientation='vertical'][align-content='start'])::before {
    min-height: 8px;
  }
  :host([orientation='vertical'][align-content='end'])::after {
    min-height: 8px;
  }

  :host([appearance='strong'])::before,
  :host([appearance='strong'])::after {
    background: ${Ne};
  }
  :host([appearance='strong']) ::slotted(*) {
    color: ${X};
  }
  :host([appearance='brand'])::before,
  :host([appearance='brand'])::after {
    background: ${xs};
  }
  :host([appearance='brand']) ::slotted(*) {
    color: ${Ko};
  }
  :host([appearance='subtle'])::before,
  :host([appearance='subtle'])::after {
    background: ${vs};
  }
  :host([appearance='subtle']) ::slotted(*) {
    color: ${U};
  }

  @media (forced-colors: active) {
    :host([appearance='strong'])::before,
    :host([appearance='strong'])::after,
    :host([appearance='brand'])::before,
    :host([appearance='brand'])::after,
    :host([appearance='subtle'])::before,
    :host([appearance='subtle'])::after,
    :host::after,
    :host::before {
      background: WindowText;
      color: WindowText;
    }
  }
`;function up(){return y`<slot></slot>`}var _l=up();var Vl={name:zl,registry:f.registry,styles:Rl,template:_l};var fn=b.partial`
  font-family: ${$};
  font-size: ${se};
  line-height: ${le};
  font-weight: ${Q};
`,xv=b.partial`
  font-family: ${$};
  font-size: ${se};
  line-height: ${le};
  font-weight: ${te};
`,kv=b.partial`
  font-family: ${$};
  font-size: ${se};
  line-height: ${le};
  font-weight: ${en};
`,Wl=b.partial`
  font-family: ${$};
  font-size: ${Ze};
  line-height: ${Ue};
  font-weight: ${Q};
`,mn=b.partial`
  font-family: ${$};
  font-size: ${de};
  line-height: ${ue};
  font-weight: ${Q};
`,yv=b.partial`
  font-family: ${$};
  font-size: ${de};
  line-height: ${ue};
  font-weight: ${te};
`,Sv=b.partial`
  font-family: ${$};
  font-size: ${de};
  line-height: ${ue};
  font-weight: ${en};
`,Bv=b.partial`
  font-family: ${$};
  font-size: ${Jo};
  line-height: ${Qo};
  font-weight: ${Q};
`,wv=b.partial`
  font-family: ${$};
  font-size: ${Jo};
  line-height: ${Qo};
  font-weight: ${te};
`,Nv=b.partial`
  font-family: ${$};
  font-size: ${xo};
  line-height: ${tn};
  font-weight: ${te};
`,$v=b.partial`
  font-family: ${$};
  font-size: ${Ze};
  line-height: ${Ue};
  font-weight: ${te};
`,Pv=b.partial`
  font-family: ${$};
  font-size: ${Ze};
  line-height: ${Ue};
  font-weight: ${en};
`,Fv=b.partial`
  font-family: ${$};
  font-size: ${zs};
  line-height: ${js};
  font-weight: ${te};
`,Tv=b.partial`
  font-family: ${$};
  font-size: ${Es};
  line-height: ${Ws};
  font-weight: ${te};
`,Av=b.partial`
  font-family: ${$};
  font-size: ${Zr};
  line-height: ${Vs};
  font-weight: ${te};
`,Cv=b.partial`
  font-family: ${$};
  font-size: ${Rs};
  line-height: ${Gs};
  font-weight: ${te};
`,Iv=b.partial`
  font-family: ${$};
  font-size: ${_s};
  line-height: ${Xs};
  font-weight: ${te};
`;var bn={combobox:"combobox",dropdown:"dropdown",select:"select"},jl=`${f.prefix}-dropdown`;var Gl=b`
  ${T("inline-flex")}

  :host {
    --_indicator-size: 20px;
    --_placeholder-color: ${Vr};
    --_initial-display: attr(initial-display raw-string, attr(placeholder raw-string, none));

    box-sizing: border-box;
    color: ${X};
    cursor: pointer;
  }

  :host(${$l}) {
    color: var(--_placeholder-color);
  }

  .control {
    --control-border-color: ${Ne};
    appearance: none;
    background-color: ${A};
    border-radius: ${M};
    border: ${I} solid ${q};
    box-shadow: inset 0 0 0 ${I} var(--control-border-color);
    box-sizing: border-box;
    color: inherit;
    column-gap: ${oe};
    display: inline-grid;
    grid-template-columns: 1fr var(--_indicator-size);
    justify-content: space-between;
    min-width: 160px;
    overflow: hidden;
    padding: ${ko} ${tt};
    white-space: normal;
    position: relative;
    text-align: start;
    width: 100%;
    z-index: 1;
    ${fn}
  }

  :host([size='small']) .control {
    column-gap: ${oe};
    padding: ${Zo} ${De};
    ${mn}
  }

  :host([size='large']) .control {
    column-gap: ${dt};
    padding: ${Le} ${_e};
    ${Wl}
  }

  /* webkit, firefox */
  :host(:not(:has([slot='control']))) slot[name='control']::before {
    content: var(--_initial-display);
  }
  /* chromium */
  @scope {
    :scope:not(:has([slot='control'])) slot[name='control']::before {
      content: var(--_initial-display);
    }
  }

  :host(:is(:not([value]), [value=''])) slot[name='control']::before {
    color: var(--_placeholder-color);
  }

  ::slotted(:is(input, button)) {
    all: unset;
  }

  slot[name='control']::before,
  ::slotted(:is(input, button)) {
    grid-area: 1 / 1;
  }

  ::slotted(button) {
    cursor: pointer;
  }

  ::slotted(input) {
    cursor: text;
    min-width: 0;
    width: 100%;
  }

  ::slotted(input)::placeholder {
    color: var(--_placeholder-color);
  }

  :where(slot[name='indicator'] > *, ::slotted([slot='indicator'])) {
    all: unset;
    align-items: center;
    appearance: none;
    aspect-ratio: 1;
    color: ${U};
    display: inline-flex;
    grid-area: 1 / 2;
    justify-content: center;
    width: var(--_indicator-size);
  }

  :host([size='small']) :where(slot[name='indicator'] > *, ::slotted([slot='indicator'])) {
    --_indicator-size: 16px;
  }

  :host([size='large']) :where(slot[name='indicator'] > *, ::slotted([slot='indicator'])) {
    --_indicator-size: 24px;
  }

  .control::after,
  .control::before {
    content: '' / '';
    inset: auto 0 0;
    pointer-events: none;
    position: absolute;
  }

  .control::before {
    background-color: ${we};
    height: ${I};
  }

  .control::after {
    background-color: ${He};
    height: ${et};
    scale: 0 1;
    transition: scale ${sn} ${No};
  }

  /**
  * focus-ring style uses lingering :focus-within selector due to platform limitations
  * TODO: Convert selector to \`:host(:has(:focus-visible)) .control\` when browser support increases
  * ISSUE: https://issues.chromium.org/issues/40062355
  */
  :host(:where(:focus-within)) .control {
    border-radius: ${M};
    box-shadow: inset 0 0 0 1px ${bo};
    outline: ${et} solid ${ae};
  }

  :host(:where(${Nl}, :focus-within)) .control::after {
    scale: 1 1;
    transition-duration: ${Bo};
    transition-timing-function: ${wo};
  }

  :host([appearance='transparent']) .control {
    --control-border-color: ${mo};
    background-color: ${Ce};
    border-radius: ${vo};
  }

  .control:hover {
    --control-border-color: ${wt};
  }

  .control:hover::before {
    background-color: ${St};
  }

  .control:hover::after {
    background-color: ${kt};
  }

  .control:active {
    --control-border-color: ${go};
  }

  .control:active::before {
    background-color: ${Bt};
  }

  .control:active::after {
    background-color: ${yt};
  }

  :host([appearance='transparent']) .control:is(:hover, :active) {
    --control-border-color: ${mo};
  }

  :host([appearance='transparent']) .control:hover::after {
    background-color: ${He};
  }

  :host([appearance='filled-darker']) .control {
    background-color: ${Wt};
  }

  :host(:where([appearance='filled-lighter'], [appearance='filled-darker'])) .control {
    --control-border-color: ${q};
  }

  :host(:where([appearance='filled-lighter'], [appearance='filled-darker'])) .control:is(:hover, :active) {
    --control-border-color: ${q};
  }

  :host(:where([appearance='filled-lighter'], [appearance='filled-darker'])) .control::before {
    background-color: initial;
  }

  :host(:where([appearance='filled-lighter'], [appearance='filled-darker'])) .control:is(:hover, :active)::after {
    background-color: ${He};
  }

  :host(${w}),
  :host(${w}) ::slotted(:where(button, input)) {
    cursor: not-allowed;
  }

  :host(${w}) .control::before,
  :host(${w}) .control::after {
    content: none;
  }

  :host(${w}) .control:is(*, :active, :hover),
  :host(${w}) :where(slot[name='indicator'] > *, ::slotted([slot='indicator'])) {
    --control-border-color: ${be};
    background-color: ${Ie};
    color: ${_};
  }

  ::slotted(:not([slot]):not([popover])),
  ::slotted([popover]:not(:popover-open)) {
    display: none;
  }

  @supports not (anchor-name: --anchor) {
    :host {
      --listbox-max-height: 50vh;
      --margin-offset: calc(${le} + (${ko} * 2) + ${I});
    }

    :host([size='small']) {
      --margin-offset: calc(${ue} + (${Zo} * 2) + ${I});
    }

    :host([size='large']) {
      --margin-offset: calc(${Ue} + (${Le} * 2) + ${I});
    }
  }

  @media (forced-colors: active) {
    :host(${w}) .control {
      border-color: GrayText;
    }
    :host(${w}) :where(slot[name='indicator'] > *, ::slotted([slot='indicator'])) {
      color: GrayText;
    }
  }
`;var pp=y`
  <svg class="chevron-down-20-regular" aria-hidden="true" slot="indicator" viewBox="0 0 20 20" ${K("indicator")}>
    <path
      d="M15.85 7.65a.5.5 0 0 1 0 .7l-5.46 5.49a.55.55 0 0 1-.78 0L4.15 8.35a.5.5 0 1 1 .7-.7L10 12.8l5.15-5.16a.5.5 0 0 1 .7 0"
      fill="currentColor"
    />
  </svg>
`,Xl=y`
  <input
    @input="${(t,e)=>t.inputHandler(e.event)}"
    @change="${(t,e)=>t.changeHandler(e.event)}"
    aria-activedescendant="${t=>t.activeDescendant}"
    aria-controls="${t=>t.listbox?.id??null}"
    aria-labelledby="${t=>t.ariaLabelledBy}"
    aria-expanded="${t=>t.open}"
    aria-haspopup="listbox"
    size="1"
    placeholder="${t=>t.placeholder}"
    role="combobox"
    ?disabled="${t=>t.disabled}"
    value="${t=>t.initialValue}"
    slot="control"
    ${K("control")}
  />
`,Ul=y`
  <button
    aria-activedescendant="${t=>t.activeDescendant}"
    aria-controls="${t=>t.listbox?.id??null}"
    aria-expanded="${t=>t.open}"
    aria-haspopup="listbox"
    role="combobox"
    ?disabled="${t=>t.disabled}"
    type="button"
    slot="control"
    ${K("control")}
  >
    ${t=>t.displayValue}
  </button>
`;function hp(t={}){return y`
    <template
      @click="${(e,o)=>e.clickHandler(o.event)}"
      @focusout="${(e,o)=>e.focusoutHandler(o.event)}"
      @keydown="${(e,o)=>e.keydownHandler(o.event)}"
      @mousedown="${(e,o)=>e.mousedownHandler(o.event)}"
    >
      <div class="control">
        <slot name="control" ${K("controlSlot")}></slot>
        <slot name="indicator" ${K("indicatorSlot")}>${ie(t.indicator)}</slot>
      </div>
      <slot @slotchange="${(e,o)=>e.slotchangeHandler(o.event)}"></slot>
    </template>
  `}var ql=hp({indicator:pp});var Kl={name:jl,registry:f.registry,styles:Gl,template:ql};function Bi(t,e="-listbox"){return t?.nodeType!==Node.ELEMENT_NODE?!1:t.tagName.toLowerCase().endsWith(e)}var Yl=`${f.prefix}-listbox`;function Nt(t,e="-option"){return t?.nodeType!==Node.ELEMENT_NODE?!1:t.tagName.toLowerCase().endsWith(e)}var Jl=`${f.prefix}-option`;var ut={ltr:"ltr",rtl:"rtl"},vn=t=>t.closest("[dir]")?.dir==="rtl"?ut.rtl:ut.ltr;function wi(t){return t.closest("[lang]")?.lang??"en"}var gp=0;function We(t="id-"){let e=`${t}${gp++}`;return document.getElementById(e)?We(t):e}var Z=class t extends F{static{this.elementIdentity="dropdown"}get activeDescendant(){if(this.open)return this.enabledOptions[this.activeIndex]?.id}activeIndexChanged(e,o){if(typeof o=="number"){let r=this.matches(":has(:focus-visible)")?o:-1;this.enabledOptions.forEach((n,i)=>{n.toggleAttribute("active",i===r)}),this.open&&this.enabledOptions[r]?.scrollIntoView({block:"nearest"})}}controlChanged(e,o){o&&(o.id=o.id||We("input-"))}disabledChanged(e,o){this.listbox&&L.enqueue(()=>{this.options.forEach(r=>{r.disabled=r.disabledAttribute||this.disabled})})}get displayValue(){if(!this.$fastController.isConnected||!this.control||this.isCombobox&&this.multiple)return z(this.elementInternals,"placeholder-shown",!1),"";this.listFormatter=this.listFormatter??new Intl.ListFormat(wi(this),{type:"conjunction",style:"narrow"});let e=this.listFormatter.format(this.selectedOptions.map(o=>o.text));return z(this.elementInternals,"placeholder-shown",!e),this.isCombobox?e:e||this.placeholder}listboxChanged(e,o){if(e&&v.getNotifier(this).unsubscribe(e),o){o.dropdown=this,o.popover="manual",o.tabIndex=-1;let r=v.getNotifier(this);if(r.subscribe(o),r.notify("multiple"),L.enqueue(()=>{this.options.forEach(n=>{n.disabled=n.disabledAttribute||this.disabled,n.name=this.name}),this.enabledOptions.filter(n=>n.defaultSelected).forEach((n,i)=>{n.selected=this.multiple||i===0}),this.setValidity()}),vi){let n=this.style.getPropertyValue("anchor-name")||We("--dropdown-anchor-");this.style.setProperty("anchor-name",n),this.listbox.style.setProperty("position-anchor",n)}}}multipleChanged(e,o){this.elementInternals.ariaMultiSelectable=o?"true":"false",z(this.elementInternals,"multiple",o),this.value=null}nameChanged(e,o){this.listbox&&L.enqueue(()=>{this.options.forEach(r=>{r.name=o})})}openChanged(e,o){z(this.elementInternals,"open",o),this.elementInternals.ariaExpanded=o?"true":"false",this.activeIndex=this.selectedIndex??-1,vi||this.anchorPositionFallback(o)}typeChanged(e,o){this.$fastController.isConnected&&this.insertControl()}get enabledOptions(){return this.listbox?.enabledOptions??Array.from(this.querySelectorAll("*")).filter(e=>Nt(e)&&!e.disabled)}static{this.formAssociated=!0}get freeformOption(){return this.enabledOptions.find(e=>e.freeform)}get isCombobox(){return this.type===bn.combobox}get labels(){return Object.freeze(Array.from(this.elementInternals.labels))}get options(){return this.listbox?.options??Array.from(this.querySelectorAll("*")).filter(e=>Nt(e))}get selectedIndex(){return this.enabledOptions.findIndex(e=>e.selected)??-1}get selectedOptions(){return this.listbox?.selectedOptions??[]}get validationMessage(){if(this.elementInternals.validationMessage)return this.elementInternals.validationMessage;if(!this._validationFallbackMessage){let e=document.createElement("input");e.type="radio",e.name="validation-message-fallback",e.required=!0,e.checked=!1,this._validationFallbackMessage=e.validationMessage}return!this.disabled&&this.required&&this.listbox.selectedOptions.length===0?this._validationFallbackMessage:""}get validity(){return this.elementInternals.validity}get value(){return v.notify(this,"value"),this.enabledOptions.find(e=>e.selected)?.value??null}set value(e){this.multiple||(this.selectOption(this.enabledOptions.findIndex(o=>o.value===e)),v.track(this,"value"))}get willValidate(){return this.elementInternals.willValidate}changeHandler(e){if(this===e.target)return!0;let o=this.isCombobox?this.enabledOptions.findIndex(r=>r.text===this.control.value):this.enabledOptions.indexOf(e.target);return this.selectOption(o,!0),!0}checkValidity(){return this.elementInternals.checkValidity()}clickHandler(e){if(this.disabled)return;let o=e.target;if(this.focus(),(o===this.control||e.composedPath().includes(this.indicator))&&!this.isCombobox)return this.listbox.togglePopover(),!0;if(!this.open)return this.listbox.showPopover(),!0;if(Nt(o)){if(o.disabled)return;this.selectOption(this.enabledOptions.indexOf(o),!0),this.multiple||(this.isCombobox&&(this.control.value=o.text,this.updateFreeformOption()),this.listbox.hidePopover())}return!0}constructor(){super(),this.activeIndex=0,this.id=We("dropdown-"),this.required=!1,this.type=bn.dropdown,this.repositionListbox=()=>{this.frameId&&cancelAnimationFrame(this.frameId),this.frameId=requestAnimationFrame(()=>{let e=this.getBoundingClientRect(),o=window.innerWidth-e.right,r=e.left;this.listbox.style.minWidth=`${e.width}px`,this.listbox.style.top=`${e.top}px`,r+e.width>window.innerWidth||vn(this)==="rtl"&&o-e.width>0?(this.listbox.style.right=`${o}px`,this.listbox.style.left="unset"):(this.listbox.style.left=`${r}px`,this.listbox.style.right="unset")})},this.elementInternals=this.attachInternals(),this._insertingControl=!1,this.searchTimeoutMs=500,this.searchString="",this.elementInternals.role="presentation"}filterOptions(e,o=this.enabledOptions){return this.listCollator||(this.listCollator=new Intl.Collator(wi(this),{usage:"search",sensitivity:"base"})),o.filter(r=>this.listCollator.compare(r.text.substring(0,Math.min(r.text.length,e.length)),e)===0)}focus(e){this.disabled||this.control.focus(e)}focusoutHandler(e){let o=e.relatedTarget;return this.open&&!this.contains(o)&&this.listbox.togglePopover(),!0}formResetCallback(){this.enabledOptions.forEach((e,o)=>{if(this.multiple){e.selected=!!e.defaultSelected;return}if(!e.defaultSelected){e.selected=!1;return}this.selectOption(o)}),this.setValidity()}getEnabledIndexInBounds(e,o=this.enabledOptions.length||0){return o===0?-1:(e+o)%o}inputHandler(e){this.open||this.listbox.showPopover(),this.updateFreeformOption();let o=this.control.value,r=this.enabledOptions.indexOf(this.filterOptions(o)[0]??null);return this.activeIndex=r,!0}insertControl(){if(!this._insertingControl){if(this._insertingControl=!0,this.controlSlot?.assignedNodes().forEach(e=>this.removeChild(e)),this.type===bn.combobox){Xl.render(this,this);return}Ul.render(this,this),this._insertingControl=!1}}handleSearchCharacter(e){let o=this.searchString===e.repeat(this.searchString.length);this.searchString+=e;let r=this.searchString.length>1?this.filterOptions(this.searchString):[],n=!1;if(!r.length&&o&&(r=this.filterOptions(e),n=!0),r.length){let i=this.enabledOptions[this.activeIndex],a=r.indexOf(i),s=n?r[this.getEnabledIndexInBounds(a+1,r.length)]:a>=0?i:r[0];this.activeIndex=this.enabledOptions.indexOf(s)}clearTimeout(this.searchTimeout),this.searchTimeout=setTimeout(()=>{this.searchString="",this.searchTimeout=void 0},this.searchTimeoutMs)}keydownHandler(e){let o=0;switch(e.key){case"ArrowUp":{e.preventDefault(),o=-1;break}case"ArrowDown":{e.preventDefault(),o=1;break}case" ":case"Enter":case"Tab":{if(e.key===" "){if(this.isCombobox)break;e.preventDefault()}if(this.open){if(this.selectOption(this.activeIndex,!0),this.multiple)break;return this.listbox.hidePopover(),e.key==="Tab"}this.listbox.showPopover();break}case"Escape":{this.activeIndex=this.multiple?0:this.selectedIndex,this.listbox.hidePopover();break}}if(!o)return!this.isCombobox&&e.key.length===1&&e.key!==" "&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&(this.open||this.listbox.showPopover(),this.handleSearchCharacter(e.key)),!0;if(!this.open){this.listbox.showPopover();return}let r=this.activeIndex;r+=o;let n=this.getEnabledIndexInBounds(r);return n===0&&this.freeformOption?.hidden&&(n=this.getEnabledIndexInBounds(r+o)),this.activeIndex=n,!0}mousedownHandler(e){if(!(this.disabled||e.target===this.control&&!this.isCombobox))return!Nt(e.target)}reportValidity(){return this.elementInternals.reportValidity()}selectOption(e=this.selectedIndex,o=!1){this.listbox.selectOption(e),this.control&&(this.control.value=this.displayValue),this.setValidity(),this.updateFreeformOption(),o&&this.$emit("change")}setValidity(e,o,r){if(!this.elementInternals)return;if(this.disabled||!this.required){this.elementInternals.setValidity({});return}let n=this.required&&this.listbox.selectedOptions.length===0;this.elementInternals.setValidity({valueMissing:n,...e},o??this.validationMessage,r??this.control)}slotchangeHandler(e){let o=e.target;jt(this,()=>{let r=o.assignedElements().find(n=>Bi(n));r&&(this.listbox=r)})}updateFreeformOption(e=this.control.value){if(this.freeformOption){if(e===""||this.filterOptions(e,this.enabledOptions.filter(o=>!o.freeform)).length){this.freeformOption.value="",this.freeformOption.selected=!1,this.freeformOption.hidden=!0;return}this.freeformOption.value=e,this.freeformOption.hidden=!1}}connectedCallback(){super.connectedCallback(),L.enqueue(()=>{this.insertControl()}),Oe(this)}disconnectedCallback(){t.AnchorPositionFallbackObserver?.disconnect(),this.debounceController?.abort(),this.searchTimeout&&(clearTimeout(this.searchTimeout),this.searchTimeout=void 0,this.searchString=""),super.disconnectedCallback()}anchorPositionFallback(e){if(t.AnchorPositionFallbackObserver||(t.AnchorPositionFallbackObserver=new IntersectionObserver(o=>{o.forEach(({boundingClientRect:r,isIntersecting:n,target:i})=>{if(Bi(i)){if(r.bottom>window.innerHeight){z(i.elementInternals,"flip-block",!0);return}r.top<0&&z(i.elementInternals,"flip-block",!1)}})},{threshold:1})),e){this.debounceController=new AbortController,t.AnchorPositionFallbackObserver.observe(this.listbox),window.addEventListener("scroll",this.repositionListbox,{passive:!0,capture:!0,signal:this.debounceController.signal}),window.addEventListener("resize",this.repositionListbox,{passive:!0,signal:this.debounceController.signal}),this.repositionListbox();return}t.AnchorPositionFallbackObserver.unobserve(this.listbox),this.debounceController?.abort(),this.frameId&&(cancelAnimationFrame(this.frameId),this.frameId=void 0)}};l([it],Z.prototype,"activeDescendant",null);l([k],Z.prototype,"activeIndex",void 0);l([p({attribute:"aria-labelledby",mode:"fromView"})],Z.prototype,"ariaLabelledBy",void 0);l([k],Z.prototype,"control",void 0);l([p({mode:"boolean"})],Z.prototype,"disabled",void 0);l([it],Z.prototype,"displayValue",null);l([p({attribute:"id"})],Z.prototype,"id",void 0);l([k],Z.prototype,"indicator",void 0);l([k],Z.prototype,"indicatorSlot",void 0);l([p({attribute:"value",mode:"fromView"})],Z.prototype,"initialValue",void 0);l([k],Z.prototype,"listbox",void 0);l([p({mode:"boolean"})],Z.prototype,"multiple",void 0);l([p],Z.prototype,"name",void 0);l([k],Z.prototype,"open",void 0);l([p],Z.prototype,"placeholder",void 0);l([p({mode:"boolean"})],Z.prototype,"required",void 0);l([p],Z.prototype,"type",void 0);var xn=class extends Z{};var Ql=b`
  ${T("inline-flex")}

  :host {
    background-color: ${A};
    border-radius: ${M};
    border: ${I} solid ${q};
    box-shadow: ${nn};
    box-sizing: border-box;
    flex-direction: column;
    margin: 0;
    min-inline-size: 160px;
    padding: ${qe};
    row-gap: ${oe};
    width: auto;
  }

  :host([popover]) {
    inset: unset;
    overflow: auto;
  }

  @supports (anchor-name: --anchor) {
    :host([popover]) {
      position: fixed;
      max-block-size: var(--listbox-max-height, calc(50vh - anchor-size(self-block)));
      min-inline-size: anchor-size(inline);
      inset-block-start: anchor(outside);
      inset-inline-start: anchor(inside);
      position-try-fallbacks: flip-block, flip-inline, flip-inline flip-block;
    }
  }

  @supports not (anchor-name: --anchor) {
    :host([popover]) {
      margin-block-start: var(--margin-offset, 0);
      max-block-size: var(--listbox-max-height, 50vh);
      position: absolute;
    }

    :host([popover]${wl}) {
      margin-block-start: revert;
      translate: 0 -100%;
    }
  }
`;function fp(){return y`
    <template
      @beforetoggle="${(t,e)=>t.beforetoggleHandler(e.event)}"
      @click="${(t,e)=>t.clickHandler(e.event)}"
    >
      <slot ${K("defaultSlot")} @slotchange="${(t,e)=>t.slotchangeHandler(e.event)}"></slot>
    </template>
  `}var Zl=fp();var ec={name:Yl,registry:f.registry,styles:Ql,template:Zl};var $t=class extends F{defaultSlotChanged(){this.slotchangeHandler()}multipleChanged(e,o){this.elementInternals.ariaMultiSelectable=o?"true":"false",z(this.elementInternals,"multiple",o),L.enqueue(()=>{this.options.forEach(r=>{r.multiple=!!o})})}optionsChanged(e,o){o?.forEach((r,n)=>{r.elementInternals.ariaPosInSet=`${n+1}`,r.elementInternals.ariaSetSize=`${o.length}`})}beforetoggleHandler(e){if(!this.dropdown)return!0;if(this.dropdown.disabled){this.dropdown.open=!1;return}return this.dropdown.open=e.newState==="open",!0}get enabledOptions(){return this.options?.filter(e=>!e.disabled)??Array.from(this.querySelectorAll("*")).filter(e=>Nt(e)&&!e.disabled)??[]}get selectedOptions(){return this.options?.filter(e=>e.selected)??[]}clickHandler(e){if(this.dropdown)return!0;let o=e.target;return Nt(o)&&this.selectOption(this.enabledOptions.indexOf(o)),!0}constructor(){super(),this.elementInternals=this.attachInternals(),this.elementInternals.role="listbox"}connectedCallback(){super.connectedCallback(),jt(this,()=>{this.id=this.id||We("listbox-")},{shallow:!0})}handleChange(e,o){if(o==="multiple"){this.multiple=e.multiple;return}}selectOption(e=this.selectedIndex){let o=this.selectedIndex;if(!this.multiple)this.enabledOptions.forEach((r,n)=>{let i=n===e;r.selected=i,i&&(o=n)});else{let r=this.enabledOptions[e];r&&(r.selected=!r.selected),o=e}this.selectedIndex=o}slotchangeHandler(e){jt(this,()=>{if(this.defaultSlot){let o=this.defaultSlot.assignedElements().filter(r=>Nt(r));this.options=o}})}};l([k],$t.prototype,"defaultSlot",void 0);l([k],$t.prototype,"multiple",void 0);l([k],$t.prototype,"options",void 0);l([k],$t.prototype,"selectedIndex",void 0);l([k],$t.prototype,"dropdown",void 0);var tc=`${f.prefix}-message-bar`;var oc=b`
  :host {
    display: grid;
    box-sizing: border-box;
    font-family: ${$};
    font-size: ${de};
    line-height: ${ue};
    width: 100%;
    background: ${Wt};
    color: ${U};
    border: 1px solid ${Ne};
    padding-inline: ${_e};
    border-radius: ${M};
    min-height: 36px;
    align-items: center;
    grid-template: 'icon body actions dismiss' / auto 1fr auto auto;
    contain: layout style paint;
  }

  :host([shape='square']) {
    border-radius: 0;
  }

  :host([intent='success']) {
    background-color: ${Kr};
    border-color: ${$s};
  }

  :host([intent='warning']) {
    background-color: ${Yr};
    border-color: ${Jr};
  }

  :host([intent='error']) {
    background-color: ${Ur};
    border-color: ${qr};
  }

  :host([layout='multiline']) {
    grid-template-areas:
      'icon body dismiss'
      'actions actions actions';
    grid-template-columns: auto 1fr auto;
    grid-template-rows: auto auto 1fr;
    padding-block: ${yo};
    padding-inline: ${_e};
  }

  .content {
    grid-area: body;
    padding-block: ${yo};
    padding-inline: 0;
  }

  :host([layout='multiline']) .content {
    padding: 0;
  }

  ::slotted([slot='icon']) {
    display: flex;
    grid-area: icon;
    flex-direction: column;
    align-items: center;
    color: ${U};
    margin-inline-end: ${dt};
  }

  :host([layout='multiline']) ::slotted([slot='icon']) {
    align-items: start;
    height: 100%;
  }

  ::slotted([slot='dismiss']) {
    grid-area: dismiss;
  }

  .actions {
    grid-area: actions;
    display: flex;
    justify-self: end;
    margin-inline-end: ${dt};
    gap: ${dt};
  }

  :host([layout='multiline']) .actions {
    margin-block-start: ${yo};
    margin-inline-end: 0;
  }

  :host([layout='multiline']) ::slotted([slot='dismiss']) {
    align-items: start;
    height: 100%;
  }

  ::slotted(*) {
    font-size: inherit;
  }
`;function mp(){return y`
    <slot name="icon"></slot>
    <div class="content">
      <slot></slot>
    </div>
    <div class="actions">
      <slot name="actions"></slot>
    </div>
    <slot name="dismiss"></slot>
  `}var rc=mp();var nc={name:tc,registry:f.registry,styles:oc,template:rc};var kn=class extends F{constructor(){super(),this.elementInternals=this.attachInternals(),this.dismissMessageBar=()=>{this.$emit("dismiss",{})},this.elementInternals.role="status"}};var ic=`${f.prefix}-menu-button`;var ac=dn;var sc=bi({end:y.partial(`
    <svg slot="end" fill="currentColor" aria-hidden="true" width="1em" height="1em" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path d="M15.85 7.65c.2.2.2.5 0 .7l-5.46 5.49a.55.55 0 0 1-.78 0L4.15 8.35a.5.5 0 1 1 .7-.7L10 12.8l5.15-5.16c.2-.2.5-.2.7 0Z" fill="currentColor"></path>
    </svg>
  `)});var lc={name:ic,registry:f.registry,styles:ac,template:sc};var yn=class extends Gt{};var ce={menuitem:"menuitem",menuitemcheckbox:"menuitemcheckbox",menuitemradio:"menuitemradio"},bp={[ce.menuitem]:"menuitem",[ce.menuitemcheckbox]:"menuitemcheckbox",[ce.menuitemradio]:"menuitemradio"};function cc(t,e="-menu-item"){return t?.nodeType!==Node.ELEMENT_NODE?!1:t.tagName.toLowerCase().endsWith(e)}var dc=`${f.prefix}-menu-item`;var uc=b`
  ${T("flex")}

  :host {
    align-items: center;
    background: ${A};
    border-radius: ${M};
    box-sizing: border-box;
    color: ${ze};
    cursor: pointer;
    font: ${Q} ${se} / ${le} ${$};
    gap: 4px;
    min-block-size: 32px;
    overflow: visible;
    padding-inline: 10px;
  }

  @supports (grid-template-columns: subgrid) {
    :host {
      display: grid;
      gap: 0;
      grid-template-columns: subgrid;
      padding-inline: unset;
    }
  }

  :host(:hover) {
    background: ${ho};
    color: ${uo};
  }

  :host(:active) {
    background-color: ${cs};
    color: ${po};
  }

  :host(:active) ::slotted([slot='start']) {
    color: ${rs};
  }

  :host(${Xt}) {
    background-color: ${Ie};
    color: ${_};
  }

  :host(${Xt}) ::slotted([slot='start']),
  :host(${Xt}) ::slotted([slot='end']) {
    color: ${_};
  }

  :host(:focus-visible) {
    border-radius: ${M};
    outline: 2px solid ${ae};
  }

  :host(:not([role='menuitemcheckbox']):not([role='menuitemradio'])) .indicator,
  :host(:not([role='menuitemcheckbox']):not([role='menuitemradio'])) ::slotted([slot='indicator']),
  :host(:not(${yi})) .submenu-glyph,
  :host(:not(${yi})) ::slotted([slot='submenu-glyph']) {
    display: none;
  }

  :host(:not(${O})) .indicator,
  :host(:not(${O})) ::slotted([slot='indicator']) {
    visibility: hidden;
  }

  .indicator,
  ::slotted([slot='indicator']),
  ::slotted([slot='start']),
  ::slotted([slot='end']),
  .submenu-glyph,
  ::slotted([slot='submenu-glyph']) {
    margin-inline: ${oe};
  }

  ::slotted([slot='end']) {
    color: ${U};
    font: ${Q} ${de} / ${ue} ${$};
    white-space: nowrap;
  }

  .indicator,
  ::slotted([slot='indicator']) {
    grid-column: 2 / span 1;
    width: 20px;
  }

  ::slotted([slot='start']) {
    display: inline-flex;
    grid-column: 3 / span 1;
  }

  .content {
    flex-grow: 1;
    grid-column: 4 / span 1;
    padding: 0 2px;
    white-space: nowrap;
  }

  ::slotted([slot='end']) {
    grid-column: 5 / span 1;
    justify-self: end;
  }

  .submenu-glyph,
  ::slotted([slot='submenu-glyph']) {
    grid-column: 6 / span 1;
    justify-self: end;
  }

  @layer popover {
    :host {
      anchor-name: --menu-trigger;
      position: relative;
    }

    @position-try --inline-inside {
      inset-inline-start: unset;
      inset-inline-end: anchor(inside);
    }

    ::slotted([popover]) {
      margin: 0;
      max-block-size: var(--menu-max-height, auto);
      position: fixed;
      position-anchor: --menu-trigger;
      inset: unset;
      inset-block-start: anchor(inside);
      inset-inline-start: anchor(outside);
      position-try-fallbacks: --inline-inside, flip-block, flip-block --inline-inside;
      z-index: 1;
    }

    ::slotted([popover]:not(:popover-open)) {
      display: none;
    }

    /* Fallback for no anchor-positioning */
    @supports not (anchor-name: --menu-trigger) {
      ::slotted([popover]) {
        align-self: start;
      }
    }
  }

  @media (forced-colors: active) {
    :host(${Xt}),
    :host(${Xt}) ::slotted([slot='start']),
    :host(${Xt}) ::slotted([slot='end']) {
      color: GrayText;
    }
  }
`;var vp=y.partial('<svg class="indicator" fill="currentColor" aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M14.05 3.49c.28.3.27.77-.04 1.06l-7.93 7.47A.85.85 0 014.9 12L2.22 9.28a.75.75 0 111.06-1.06l2.24 2.27 7.47-7.04a.75.75 0 011.06.04z" fill="currentColor"></path></svg>'),xp=y.partial('<svg class="submenu-glyph" fill="currentColor" aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M5.74 3.2a.75.75 0 00-.04 1.06L9.23 8 5.7 11.74a.75.75 0 101.1 1.02l4-4.25a.75.75 0 000-1.02l-4-4.25a.75.75 0 00-1.06-.04z" fill="currentColor"></path></svg>');function kp(t={}){return y`
    <template
      @keydown="${(e,o)=>e.handleMenuItemKeyDown(o.event)}"
      @click="${(e,o)=>e.handleMenuItemClick(o.event)}"
      @mouseover="${(e,o)=>e.handleMouseOver(o.event)}"
      @mouseout="${(e,o)=>e.handleMouseOut(o.event)}"
      @toggle="${(e,o)=>e.handleToggle(o.event)}"
    >
      <slot name="indicator"> ${ie(t.indicator)} </slot>
      ${Xe(t)}
      <div part="content" class="content">
        <slot></slot>
      </div>
      ${st(t)}
      <slot name="submenu-glyph"> ${ie(t.submenuGlyph)} </slot>
      <slot name="submenu" ${fe({property:"slottedSubmenu"})}></slot>
    </template>
  `}var pc=kp({indicator:vp,submenuGlyph:xp});var hc={name:dc,registry:f.registry,styles:uc,template:pc};var je=class extends F{constructor(){super(...arguments),this.elementInternals=this.attachInternals(),this.role=ce.menuitem,this.checked=!1,this.handleMenuItemKeyDown=e=>{if(e.defaultPrevented)return!1;switch(e.key){case"Enter":case" ":return this.invoke(),!1;case"ArrowRight":return this.disabled||(this.submenu?.togglePopover(!0),this.submenu?.focus()),!1;case"ArrowLeft":return this.parentElement?.hasAttribute("popover")&&(this.parentElement.togglePopover(!1),this.parentElement.parentElement?.focus()),!1}return!0},this.handleMenuItemClick=e=>(e.defaultPrevented||this.disabled||this.invoke(),!1),this.handleMouseOver=e=>(this.disabled||this.submenu?.togglePopover(!0),!1),this.handleMouseOut=e=>(this.contains(document.activeElement)||this.submenu?.togglePopover(!1),!1),this.handleToggle=e=>{e instanceof ToggleEvent&&(e.newState==="open"&&(this.elementInternals.ariaExpanded="true",this.setSubmenuPosition()),e.newState==="closed"&&(this.elementInternals.ariaExpanded="false"),this.submenu?.setAttribute("focusgroup",e.newState==="open"?"menu":"none"))},this.handleSubmenuFocusOut=e=>{e.relatedTarget&&this.submenu?.contains(e.relatedTarget)||this.submenu?.togglePopover(!1)},this.invoke=()=>{if(!this.disabled)switch(this.role){case ce.menuitemcheckbox:this.checked=!this.checked;break;case ce.menuitem:if(this.submenu){this.submenu.togglePopover(!0),this.submenu.focus();break}this.$emit("change");break;case ce.menuitemradio:this.checked||(this.checked=!0);break}},this.setSubmenuPosition=()=>{if(!CSS.supports("anchor-name","--anchor")&&this.submenu){let e=this.getBoundingClientRect(),o=this.submenu.getBoundingClientRect(),r=getComputedStyle(this).direction==="ltr"?"right":"left";if(e.width+o.width>window.innerWidth*.75){this.submenu.style.translate="0 -100%";return}if(e[r]+o.width>window.innerWidth){this.submenu.style.translate="-100% 0";return}this.submenu.style.translate=`${e.width-8}px 0`}}}disabledChanged(e,o){this.elementInternals.ariaDisabled=o?`${o}`:null,z(this.elementInternals,"disabled",o)}roleChanged(e,o){this.elementInternals.role=o??ce.menuitem}checkedChanged(e,o){let r=this.role!==ce.menuitem;this.elementInternals.ariaChecked=r?`${!!o}`:null,z(this.elementInternals,"checked",r?o:!1),this.$fastController.isConnected&&this.$emit("change",o,{bubbles:!0})}slottedSubmenuChanged(e,o){this.submenu?.removeEventListener("toggle",this.handleToggle),this.submenu?.removeEventListener("focusout",this.handleSubmenuFocusOut),o.length?(this.submenu=o[0],this.submenu.toggleAttribute("popover",!0),this.submenu.setAttribute("focusgroup","none"),this.submenu.addEventListener("toggle",this.handleToggle),this.submenu.addEventListener("focusout",this.handleSubmenuFocusOut),this.elementInternals.ariaHasPopup="menu",z(this.elementInternals,"submenu",!0)):(this.elementInternals.ariaHasPopup=null,z(this.elementInternals,"submenu",!1))}connectedCallback(){super.connectedCallback(),this.hasAttribute("tabindex")||(this.tabIndex=0),this.elementInternals.role=this.role??ce.menuitem,this.elementInternals.ariaChecked=this.role!==ce.menuitem?`${!!this.checked}`:null,Oe(this)}};l([p({mode:"boolean"})],je.prototype,"disabled",void 0);l([p],je.prototype,"role",void 0);l([p({mode:"boolean"})],je.prototype,"checked",void 0);l([p({mode:"boolean"})],je.prototype,"hidden",void 0);l([k],je.prototype,"slottedSubmenu",void 0);l([k],je.prototype,"submenu",void 0);lt(je,Ge);var rr=class t extends F{itemsChanged(e,o){this.$fastController.isConnected&&this.menuChildren!==void 0&&this.setItems()}static{this.focusableElementRoles=ce}constructor(){super(),this.elementInternals=this.attachInternals(),this.isNestedMenu=()=>this.parentElement!==null&&di(this.parentElement)&&this.parentElement.getAttribute("role")==="menuitem",this.changedMenuItemHandler=e=>{if(this.menuChildren===void 0)return;let o=e.target,r=this.menuChildren.indexOf(o);if(r!==-1&&o.role==="menuitemradio"&&o.checked===!0){for(let i=r-1;i>=0;--i){let a=this.menuChildren[i],s=a.role;if(s===ce.menuitemradio&&(a.checked=!1),s==="separator")break}let n=this.menuChildren.length-1;for(let i=r+1;i<=n;++i){let a=this.menuChildren[i],s=a.role;if(s===ce.menuitemradio&&(a.checked=!1),s==="separator")break}}},this.elementInternals.role="menu"}connectedCallback(){super.connectedCallback(),this.hasAttribute("focusgroup")||this.setAttribute("focusgroup","menu"),!this.slot&&this.isNestedMenu()&&(this.slot="submenu"),L.enqueue(()=>{this.setItems()}),this.addEventListener("change",this.changedMenuItemHandler)}disconnectedCallback(){super.disconnectedCallback(),Array.from(this.children).forEach(e=>{v.getNotifier(e).unsubscribe(this,"hidden")}),this.menuChildren=void 0,this.removeEventListener("change",this.changedMenuItemHandler)}focus(){L.enqueue(()=>{this.menuItems?.find(e=>!e.disabled)?.focus()})}setItems(){let e=Array.from(this.children);e.forEach(o=>{v.getNotifier(o).subscribe(this,"hidden")}),this.menuChildren=e.filter(o=>!o.hasAttribute("hidden")),this.menuItems=this.menuChildren?.filter(this.isMenuItemElement)}handleChange(e,o){o==="hidden"&&this.setItems()}isMenuItemElement(e){return cc(e)||di(e)&&!!e.role&&e.role in t.focusableElementRoles}};l([k],rr.prototype,"items",void 0);var Fo={INFERRED_ROLE:"data-fg-ir",ITEM:"data-fg-item",AUTHOR_TABINDEX:"data-fg-ati",SEGMENT:"data-fg-seg",SEGMENT_START:"data-fg-segs"},Pt={TOOLBAR:"toolbar",TABLIST:"tablist",RADIOGROUP:"radiogroup",LISTBOX:"listbox",MENU:"menu",MENUBAR:"menubar",NONE:"none"},_k=[Pt.TOOLBAR,Pt.TABLIST,Pt.RADIOGROUP,Pt.LISTBOX,Pt.MENU,Pt.MENUBAR,Pt.NONE];function Sn(t,e){return t.contains(e)}function gc(){return"focusgroup"in(globalThis?.HTMLElement?.prototype??{})||"focusGroup"in(globalThis?.HTMLElement?.prototype??{})}function fc(t,e,o){let r="forward",n="backward",i="block",a="inline";if(yp(t.composedPath()[0]))return t.key==="Tab"?t.shiftKey?n:r:null;if(t.shiftKey||t.ctrlKey||t.metaKey)return null;let{writingMode:s,direction:d}=window.getComputedStyle(e),h=!s.startsWith("horizontal-"),u=d==="rtl",x=h?i:a,N=h?a:i,D=h?s.endsWith("-rl")!==u:u,V=h&&u,Pe={ArrowUp:{axis:N,dir:V?r:n},ArrowDown:{axis:N,dir:V?n:r},ArrowLeft:{axis:x,dir:D?r:n},ArrowRight:{axis:x,dir:D?n:r},Home:{dir:"start"},End:{dir:"end"}}[t.key];return!Pe||o&&Pe.axis&&Pe.axis!==o?null:Pe.dir}function yp(t){return t?.nodeType===Node.ELEMENT_NODE&&(["INPUT","TEXTAREA","SELECT"].includes(t.nodeName)&&!["checkbox","radio"].includes(t.getAttribute("type"))||t.isContentEditable||["AUDIO","VIDEO"].includes(t.nodeName)&&t.hasAttribute("controls")||["IFRAME","OBJECT"].includes(t.nodeName))}globalThis.__FOCUSGROUP_POLYFILL__??={o:new Set,b:!1};var mc=globalThis.__FOCUSGROUP_POLYFILL__;var Sp=mc.o;function Bn(){for(let t of Sp)t.takeRecords()}var nr=class{#t;#e;#n=null;#p=void 0;#c=!1;#s=!0;#r;#o=null;#i=!1;#l=null;#h=new AbortController;#d;#u;constructor(t,e,o={}){if(gc()||!t)return;this.#t=t,this.#e=e,this.#d=o.decorateOwner,this.#u=o.decorateItem,this.#g(o.definition),this.#d?.(this.#t,this.#n),this.#f();let r={signal:this.#h.signal};this.#t.addEventListener("keydown",this.#x.bind(this),r),this.#t.addEventListener("focusin",this.#k.bind(this),r),this.#t.addEventListener("focusout",this.#y.bind(this),r)}disconnect(){this.#a(),this.#h.abort(),this.#e?.disconnect?.(),this.#t=null}update(t={}){if(this.#t){if(t.definition!==void 0&&(this.#g(t.definition),this.#d?.(this.#t,this.#n)),t.authorTabindexChanges)for(let e of t.authorTabindexChanges)e.setAttribute(Fo.AUTHOR_TABINDEX,e.getAttribute("tabindex")??"none");this.#m(),this.#f()}}#g(t){this.#n=t?.behavior??null,this.#c=t?.wrap??!1,this.#p=t?.axis,this.#s=t?.memory??!0,this.#s||(this.#o=null)}#f(){if(!this.#n||this.#n===Pt.NONE){this.#m();return}this.#e.decorate?.();for(let{element:e,segmentBoundary:o}of this.#e.items())this.#u?.(e,this.#n),e.setAttribute(Fo.AUTHOR_TABINDEX,e.getAttribute("tabindex")??"none"),e.tabIndex=o?0:-1;(!this.#o?.isConnected||!(this.#e.isItem?.(this.#o)??this.#e.contains(this.#o)))&&(this.#o=null);let t=this.#o??this.#e.start??this.#e.first?.()??null;t&&(t.tabIndex=0,this.#r=t,this.#a(),this.#b(t)),this.#e.flush?.()}#m(){this.#a();let t=!1;for(let{element:e}of this.#e.items()){t=!0,this.#u?.(e,null);let o=e.getAttribute(Fo.AUTHOR_TABINDEX);o&&(o==="none"?e.removeAttribute("tabindex"):e.setAttribute("tabindex",o),e.removeAttribute(Fo.AUTHOR_TABINDEX))}this.#e.undecorate?.(),t&&this.#e.flush?.()}#x(t){let e=t.composedPath()[0];if(t.defaultPrevented||e===this.#t||!this.#e.contains(e))return;let o;switch(fc(t,e,this.#p)){case"start":o=this.#e.first();break;case"end":o=this.#e.last();break;case"forward":o=this.#e.next(e),!o&&this.#c&&(o=this.#e.first());break;case"backward":o=this.#e.previous(e),!o&&this.#c&&(o=this.#e.last());break}o&&o!==e&&(this.#v(e,o,!0),this.#o=o,t.preventDefault())}#k(t){let e=t.composedPath()[0];if(e===this.#t&&this.#i&&(!t.relatedTarget||!Sn(this.#t,t.relatedTarget))){let r=this.#o||this.#r;this.#a(),r&&r.focus(),t.stopPropagation();return}if(!this.#e.contains(e))return;this.#i&&this.#a();let o=this.#o;if(this.#o=e,o!==e&&e.tabIndex<0){let r=o??this.#r;r&&this.#v(r,e)}}#y(t){if(!t.relatedTarget||!Sn(this.#t,t.relatedTarget)){let r=this.#s?this.#o||this.#r:this.#r;r&&this.#b(r)}if(t.relatedTarget&&Sn(this.#t,t.relatedTarget)||this.#s||!this.#r)return;let e=this.#o;this.#o=null;let o=this.#e.start??this.#e.first?.()??null;if(e!==this.#r||o!==this.#r){for(let{element:r,segmentBoundary:n}of this.#e.items())r.tabIndex=n?0:-1;o&&(o.tabIndex=0,this.#r=o),this.#e.flush?.()}}#b(t){let e=(t.assignedSlot??t).getRootNode(),o=e instanceof ShadowRoot&&e.host.hasAttribute(Fo.AUTHOR_TABINDEX);this.#i||!o||(this.#l=this.#t.getAttribute("tabindex"),this.#t.tabIndex=0,this.#i=!0,Bn())}#a(){this.#i&&(this.#l!==null?this.#t.setAttribute("tabindex",this.#l):this.#t.removeAttribute("tabindex"),this.#i=!1,this.#l=null,this.#e.flush?.(),Bn())}#v(t,e,o=!1){e.tabIndex=0,o&&e.focus(),t.tabIndex=this.#e.sameSegment?.(t,e)??!0?-1:0,this.#a(),Bn()}};var To=class{constructor(e,o){this.getItems=e,this.getStart=o}get start(){return this.getStart?.()??null}first(){return this.getItems()[0]??null}last(){let e=this.getItems();return e[e.length-1]??null}next(e){let o=this.getItems(),r=o.indexOf(e);return r===-1?null:o[r+1]??null}previous(e){let o=this.getItems(),r=o.indexOf(e);return r<=0?null:o[r-1]??null}*items(){for(let e of this.getItems())yield{element:e}}contains(e){return this.getItems().includes(e)}};var wn=class extends rr{disconnectedCallback(){this.fg?.disconnect(),super.disconnectedCallback()}setItems(){super.setItems(),this.fgItems??=new To(()=>this.menuItems?.filter(e=>!e.hidden)??[]),this.fg?this.fg.update():this.fg=new nr(this,this.fgItems,{definition:{behavior:"menu",axis:"block",wrap:!0}})}};function Bp(){return y`
    <template>
      <slot ${fe("items")}></slot>
    </template>
  `}var bc=Bp();var vc=b`
  ${T("grid")}

  :host {
    contain: layout style;
    block-size: auto;
    max-inline-size: 300px;
    min-inline-size: 160px;
    inline-size: auto;
    background-color: ${A};
    border: 1px solid ${q};
    border-radius: ${M};
    box-shadow: ${nn};
    grid-template-columns: 10px max-content max-content minmax(0, 1fr) max-content max-content 10px;
    gap: 2px 0;
    padding: 4px;
  }

  ::slotted(*) {
    grid-column: 1 / -1;
  }
`;var xc=`${f.prefix}-menu-list`;var kc={name:xc,registry:f.registry,styles:vc,template:bc};var ot=class extends F{constructor(){super(...arguments),this._open=!1,this.toggleMenu=()=>{this._menuList?.togglePopover(!this._open)},this.closeMenu=e=>{e?.target instanceof je&&(e.target.getAttribute("role")===ce.menuitemcheckbox||e.target.getAttribute("role")===ce.menuitemradio)||(this._menuList?.togglePopover(!1),this.closeOnScroll&&document.removeEventListener("scroll",this.closeMenu))},this.openMenu=e=>{this._menuList?.togglePopover(!0),e&&this.openOnContext&&e.preventDefault(),this.closeOnScroll&&document.addEventListener("scroll",this.closeMenu)},this.toggleHandler=e=>{if(e.type==="toggle"&&e.newState){let o=e.newState==="open";this._trigger?.setAttribute("aria-expanded",`${o}`),this._menuList?.setAttribute("focusgroup",o?"menu":"none"),this._open=o,this._open&&this.focusMenuList()}},this.triggerKeydownHandler=e=>{if(e.defaultPrevented)return;switch(e.key){case" ":case"Enter":e.preventDefault(),this.toggleMenu();break;default:return!0}},this.documentClickHandler=e=>{e.composedPath().some(o=>o===this._trigger||o===this._menuList)||this.closeMenu()}}slottedMenuListChanged(e,o){this._menuListAbortController?.abort(),o?.length&&(this._menuList=o[0],this._menuList.popover=this.openOnContext?"manual":"",this.addMenuListListeners())}slottedTriggersChanged(e,o){if(this._triggerAbortController?.abort(),o?.length){let r=o[0];this._trigger=r,this._trigger?.isConnected&&(this._trigger.setAttribute("aria-haspopup","true"),this._trigger.setAttribute("aria-expanded",`${this._open}`),this.addTriggerListeners())}}connectedCallback(){super.connectedCallback(),this.setComponent()}disconnectedCallback(){super.disconnectedCallback(),this._triggerAbortController?.abort(),this._menuListAbortController?.abort()}setComponent(){}focusMenuList(){L.enqueue(()=>{this._menuList.focus()})}focusTrigger(){L.enqueue(()=>{this._trigger.focus()})}openOnHoverChanged(e,o){this._trigger&&(this._triggerAbortController?.abort(),this.addTriggerListeners())}persistOnItemClickChanged(e,o){this._menuList&&(this._menuListAbortController?.abort(),this.addMenuListListeners())}openOnContextChanged(e,o){o?this._menuList?.setAttribute("popover","manual"):this._menuList?.setAttribute("popover",""),this._trigger&&(this._triggerAbortController?.abort(),this.addTriggerListeners())}closeOnScrollChanged(e,o){o?document.addEventListener("scroll",this.closeMenu):document.removeEventListener("scroll",this.closeMenu)}addTriggerListeners(){this._triggerAbortController=new AbortController;let{signal:e}=this._triggerAbortController;this._trigger?.addEventListener("keydown",this.triggerKeydownHandler,{signal:e}),this.openOnHover?this._trigger?.addEventListener("mouseover",this.openMenu,{signal:e}):this.openOnContext?(this._trigger?.addEventListener("contextmenu",this.openMenu,{signal:e}),document.addEventListener("click",this.documentClickHandler,{signal:e})):this._trigger?.addEventListener("click",this.toggleMenu,{signal:e})}addMenuListListeners(){this._menuListAbortController=new AbortController;let{signal:e}=this._menuListAbortController;this._menuList?.addEventListener("toggle",this.toggleHandler,{signal:e}),this.persistOnItemClick||this._menuList?.addEventListener("change",this.closeMenu,{signal:e})}menuKeydownHandler(e){if(e.defaultPrevented)return;switch(e.key){case"Escape":e.preventDefault(),this._open&&(this.closeMenu(),this.focusTrigger());break;case"Tab":if(this._open&&this.closeMenu(),e.shiftKey&&e.composedPath()[0]!==this._trigger&&e.composedPath()[0].assignedSlot!==this.primaryAction)this.focusTrigger();else if(e.shiftKey)return!0;default:return!0}}};l([p({attribute:"open-on-hover",mode:"boolean"})],ot.prototype,"openOnHover",void 0);l([p({attribute:"open-on-context",mode:"boolean"})],ot.prototype,"openOnContext",void 0);l([p({attribute:"close-on-scroll",mode:"boolean"})],ot.prototype,"closeOnScroll",void 0);l([p({attribute:"persist-on-item-click",mode:"boolean"})],ot.prototype,"persistOnItemClick",void 0);l([k],ot.prototype,"slottedMenuList",void 0);l([k],ot.prototype,"slottedTriggers",void 0);l([k],ot.prototype,"primaryAction",void 0);function wp(){return y`
    <template @keydown="${(t,e)=>t.menuKeydownHandler(e.event)}">
      <slot name="primary-action" ${K("primaryAction")}></slot>
      <slot name="trigger" ${fe({property:"slottedTriggers",filter:ao()})}></slot>
      <slot ${fe({property:"slottedMenuList",filter:ao()})}></slot>
    </template>
  `}var yc=wp();var Sc=b`
  ${T("inline-block")}

  ::slotted([slot='trigger']) {
    anchor-name: --menu-trigger;
  }

  ::slotted([popover]) {
    margin: 0;
    max-height: var(--menu-max-height, auto);
    position-anchor: --menu-trigger;
    inset: unset;
    inset-block-start: anchor(outside);
    inset-inline-start: anchor(self-start);
    position-try-fallbacks: flip-block, flip-inline, flip-block flip-inline;
    position: fixed;
    z-index: 1;
  }

  :host([split]) ::slotted([popover]) {
    inset-inline-start: unset;
    inset-inline-end: anchor(self-end);
  }

  ::slotted([popover]:not(:popover-open)) {
    display: none;
  }

  :host([split]) {
    display: inline-flex;
  }

  :host([split]) ::slotted([slot='primary-action']) {
    border-inline-end: ${I} solid ${Ne};
    border-start-end-radius: 0;
    border-end-end-radius: 0;
  }

  /* Keeps focus visible visuals above trigger slot*/
  :host([split]) ::slotted([slot='primary-action']:focus-visible) {
    z-index: 1;
  }

  :host([split]) ::slotted([slot='primary-action'][appearance='primary']) {
    border-inline-end: ${I} solid white;
  }

  :host([split]) ::slotted([slot='trigger']) {
    border-inline-start: 0;
    border-start-start-radius: 0;
    border-end-start-radius: 0;
  }
`;var Bc=`${f.prefix}-menu`;var wc={name:Bc,registry:f.registry,styles:Sc,template:yc};var Nc=b`
  ${T("inline-grid")}

  :host {
    -webkit-tap-highlight-color: transparent;
    ${fn}
    align-items: center;
    background-color: ${A};
    border-radius: ${M};
    box-sizing: border-box;
    color: ${ze};
    column-gap: ${qe};
    cursor: pointer;
    grid-template-areas: 'indicator start content';
    grid-template-columns: auto auto 1fr;
    min-height: 32px;
    padding: ${De};
    text-align: start;
  }

  .content {
    grid-area: content;
    line-height: 1;
  }

  ::slotted([slot='start']) {
    grid-area: start;
  }

  :host(:hover) {
    background-color: ${ho};
    color: ${uo};
  }

  :host(:active) {
    background-color: ${Wr};
    color: ${po};
  }

  :host(${w}) {
    background-color: ${A};
    color: ${_};
    cursor: default;
  }

  .checkmark-16-filled {
    fill: currentColor;
    width: 16px;
  }

  slot[name='checked-indicator'] > *,
  ::slotted([slot='checked-indicator']) {
    aspect-ratio: 1;
    flex: 0 0 auto;
    grid-area: indicator;
    visibility: hidden;
  }

  :host(${pn}) :is(slot[name='checked-indicator'] > *, ::slotted([slot='checked-indicator'])) {
    visibility: visible;
  }

  :host(${Ut}) .checkmark-16-filled,
  :host(:not(${Ut})) .checkmark-12-regular {
    display: none;
  }

  :host(${Ut}) .checkmark-12-regular {
    background-color: ${A};
    border-radius: ${Re};
    border: ${I} solid ${we};
    box-sizing: border-box;
    cursor: pointer;
    fill: transparent;
    position: relative;
    visibility: visible;
    width: 16px;
  }

  :host(${Ut}${pn}) .checkmark-12-regular {
    background-color: ${xt};
    border-color: ${He};
    fill: ${ct};
  }

  :host(${w}${Ut}) .checkmark-12-regular {
    border-color: ${be};
  }

  :host(${w}${Ut}${pn}) .checkmark-12-regular {
    background-color: ${Ie};
  }

  :host([active]) {
    border: ${et} solid ${ae};
  }

  @supports (selector(:host(:has(*)))) {
    :host(:has([slot='start']:not([size='16']))) {
      column-gap: ${De};
    }
  }

  :host(${Bl}) {
    column-gap: ${De};
    grid-template-areas:
      'indicator start content'
      'indicator start description';
  }

  ::slotted([slot='description']) {
    color: ${U};
    grid-area: description;
    ${mn}
  }

  @media (forced-colors: active) {
    :host(${w}) {
      color: GrayText;
    }
  }
`;var Np=y.partial(`
  <svg aria-hidden="true" class="checkmark-16-filled" viewBox="0 0 16 16">
    <path
      d="M14.046 3.486a.75.75 0 0 1-.032 1.06l-7.93 7.474a.85.85 0 0 1-1.188-.022l-2.68-2.72a.75.75 0 1 1 1.068-1.053l2.234 2.267l7.468-7.038a.75.75 0 0 1 1.06.032"
    />
  </svg>
  <svg aria-hidden="true" class="checkmark-12-regular" viewBox="0 0 12 12">
    <path
      d="M9.854 3.146a.5.5 0 0 1 0 .708l-4.5 4.5a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L5 7.293l4.146-4.147a.5.5 0 0 1 .708 0"
    />
  </svg>
`);function $p(t={}){return y`
    <slot name="checked-indicator">${ie(t.checkedIndicator)}</slot>
    ${Xe(t)}
    <div class="content" part="content">
      <slot ${fe({property:"freeformOutputs",filter:ao("output")})}></slot>
    </div>
    <div class="description" part="description">
      <slot name="description" ${fe("descriptionSlot")}></slot>
    </div>
  `}var $c=$p({checkedIndicator:Np});var Pc={name:Jl,registry:f.registry,styles:Nc,template:$c};var me=class extends F{currentSelectedChanged(e,o){this.selected=!!o}defaultSelectedChanged(e,o){this.selected=!!o}descriptionSlotChanged(e,o){z(this.elementInternals,"description",!!o?.length)}disabledChanged(e,o){this.elementInternals.ariaDisabled=this.disabled?"true":"false",z(this.elementInternals,"disabled",this.disabled),this.setFormValue(!this.disabled&&this.selected?this.value:null)}disabledAttributeChanged(e,o){this.disabled=!!o}initialValueChanged(e,o){this._value=o}multipleChanged(e,o){z(this.elementInternals,"multiple",o),this.selected=!1}get form(){return this.elementInternals.form}static{this.formAssociated=!0}get labels(){return Object.freeze(Array.from(this.elementInternals.labels))}get selected(){return v.track(this,"selected"),!!this.currentSelected}set selected(e){this.currentSelected=e,L.enqueue(()=>{this.elementInternals&&(this.setFormValue(e?this.value:null),this.elementInternals.ariaSelected=e?"true":"false",z(this.elementInternals,"selected",e))}),v.notify(this,"selected")}get text(){return this.freeform?this.value.replace(/\s+/g," ").trim():(this.textAttribute??this.textContent)?.replace(/\s+/g," ").trim()??""}get value(){return v.track(this,"value"),this._value??this.text}set value(e){this._value=e,this.$fastController.isConnected&&(this.setFormValue(this.selected?e:null),this.freeformOutputs?.forEach(o=>{o.value=e}),v.notify(this,"value"))}connectedCallback(){super.connectedCallback(),this.freeform&&(this.value="",this.hidden=!0,this.selected=!1)}constructor(){super(),this.id=We("option-"),this.initialValue="",this.multiple=!1,this.elementInternals=this.attachInternals(),this._value=this.initialValue,this.elementInternals.role="option"}setFormValue(e,o){if(this.disabled){this.elementInternals.setFormValue(null);return}this.elementInternals.setFormValue(e,e??o)}toggleSelected(e=!this.selected){this.selected=e}};l([p({attribute:"current-selected",mode:"boolean"})],me.prototype,"currentSelected",void 0);l([p({attribute:"selected",mode:"boolean"})],me.prototype,"defaultSelected",void 0);l([k],me.prototype,"descriptionSlot",void 0);l([k],me.prototype,"disabled",void 0);l([p({attribute:"disabled",mode:"boolean"})],me.prototype,"disabledAttribute",void 0);l([p({attribute:"form"})],me.prototype,"formAttribute",void 0);l([p({mode:"boolean"})],me.prototype,"freeform",void 0);l([p({attribute:"id"})],me.prototype,"id",void 0);l([p({attribute:"value",mode:"fromView"})],me.prototype,"initialValue",void 0);l([k],me.prototype,"multiple",void 0);l([p],me.prototype,"name",void 0);l([k],me.prototype,"start",void 0);l([p({attribute:"text",mode:"fromView"})],me.prototype,"textAttribute",void 0);var Fc=ke,Tc={singleValue:"single-value"},Ac=`${f.prefix}-slider`;var Cc=b`
  ${T("inline-grid")}

  :host {
    --thumb-size: 20px;
    --track-margin-inline: calc(var(--thumb-size) / 2);
    --track-size: 4px;
    --track-overhang: calc(var(--track-size) / -2);
    --rail-color: ${xt};
    --track-color: ${we};
    --slider-direction: 90deg;
    --border-radius: ${M};
    --step-marker-inset: var(--track-overhang) -1px;

    position: relative;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    outline: none;
    user-select: none;
    touch-action: none;
    min-width: 120px;
    min-height: 32px;
    grid-template-rows: 1fr var(--thumb-size) 1fr;
    grid-template-columns: var(--track-margin-inline) 1fr var(--track-margin-inline);
  }

  :host(:hover) {
    --rail-color: ${kt};
  }

  :host(:active) {
    --rail-color: ${yt};
  }

  :host(${w}) {
    --rail-color: ${_};
    --track-color: ${Ie};
  }

  :host(:not(${w})) {
    cursor: pointer;
  }

  :host(:dir(rtl)) {
    --slider-direction: -90deg;
  }

  :host([size='small']) {
    --thumb-size: 16px;
    --track-overhang: -1px;
    --track-size: 2px;
    --border-radius: ${Re};
  }

  :host([orientation='vertical']) {
    --slider-direction: 0deg;
    --step-marker-inset: -1px var(--track-overhang);
    min-height: 120px;
    grid-template-rows: var(--track-margin-inline) 1fr var(--track-margin-inline);
    grid-template-columns: 1fr var(--thumb-size) 1fr;
    width: unset;
    min-width: 32px;
    justify-items: center;
  }

  :host(:not([slot='input']):focus-visible) {
    box-shadow: 0 0 0 2pt ${ae};
    outline: 1px solid ${bo};
  }

  :host:after,
  .track {
    height: var(--track-size);
    width: 100%;
  }

  :host:after {
    background-image: linear-gradient(
      var(--slider-direction),
      var(--rail-color) 0%,
      var(--rail-color) 50%,
      var(--track-color) 50.1%,
      var(--track-color) 100%
    );
    border-radius: var(--border-radius);
    content: '';
    grid-row: 1 / -1;
    grid-column: 1 / -1;
  }

  .track {
    position: relative;
    background-color: var(--track-color);
    grid-row: 2 / 2;
    grid-column: 2 / 2;
    forced-color-adjust: none;
    overflow: hidden;
  }

  :host([orientation='vertical'])::after,
  :host([orientation='vertical']) .track {
    height: 100%;
    width: var(--track-size);
  }

  .track::before {
    content: '';
    position: absolute;
    height: 100%;
    border-radius: inherit;
    inset-inline-start: 0;
    width: var(--slider-progress);
  }

  :host(:dir(rtl)) .track::before {
    width: calc(100% - var(--slider-progress));
  }

  :host([orientation='vertical']) .track::before {
    width: 100%;
    bottom: 0;
    height: var(--slider-progress);
  }

  :host([step]) .track::after {
    content: '';
    position: absolute;
    border-radius: inherit;
    inset: var(--step-marker-inset);
    background-image: repeating-linear-gradient(
      var(--slider-direction),
      #0000 0%,
      #0000 calc(var(--step-rate) - 1px),
      ${A} calc(var(--step-rate) - 1px),
      ${A} var(--step-rate)
    );
  }

  .thumb-container {
    position: absolute;
    grid-row: 2 / 2;
    grid-column: 2 / 2;
    transform: translateX(-50%);
    left: var(--slider-thumb);
  }

  :host([orientation='vertical']) .thumb-container {
    transform: translateY(50%);
    left: unset;
    bottom: var(--slider-thumb);
  }

  :host(:not(:active)) :is(.thumb-container, .track::before) {
    transition: all 0.2s ease;
  }

  .thumb {
    width: var(--thumb-size);
    height: var(--thumb-size);
    border-radius: ${ve};
    box-shadow: 0 0 0 calc(var(--thumb-size) * 0.2) ${A} inset;
    border: calc(var(--thumb-size) * 0.05) solid ${Ne};
    box-sizing: border-box;
  }

  .thumb,
  .track::before {
    background-color: var(--rail-color);
  }

  @media (forced-colors: active) {
    .track:hover,
    .track:active,
    .track {
      background: WindowText;
    }
    .thumb:hover,
    .thumb:active,
    .thumb {
      background: ButtonText;
    }

    :host(:hover) .track::before,
    :host(:active) .track::before,
    .track::before {
      background: Highlight;
    }
  }
`;function Pp(t={}){return y`
    <template
      @pointerdown="${(e,o)=>e.handlePointerDown(o.event)}"
      @keydown="${(e,o)=>e.handleKeydown(o.event)}"
    >
      <div ${K("track")} part="track-container" class="track" style="${e=>e.position}"></div>
      <div
        ${K("thumb")}
        part="thumb-container"
        class="thumb-container"
        style="${e=>e.position}"
        @pointerdown="${(e,o)=>e.handleThumbPointerDown(o.event)}"
      >
        <slot name="thumb">${ie(t.thumb)}</slot>
      </div>
    </template>
  `}var Ic=Pp({thumb:'<div class="thumb"></div>'});var Hc={name:Ac,registry:f.registry,styles:Cc,template:Ic};function Nn(t,e,o){return Math.min(Math.max(o,t),e)}var $n={fromView(t){let e=parseFloat(t);return Number.isNaN(e)?"":e.toString()},toView(t){let e=parseFloat(t);return Number.isNaN(e)?void 0:e.toString()}};function Ni(t,e,o,r){let n=Nn(0,1,(t-e)/(o-e));return r===ut.rtl&&(n=1-n),n}var re=class extends F{static{this.formAssociated=!0}get labels(){return Object.freeze(Array.from(this.elementInternals.labels))}handleChange(e,o){switch(o){case"min":case"max":this.setSliderPosition();case"step":this.handleStepStyles();break}}handleStepStyles(){if(this.step){let e=100/Math.floor((this.maxAsNumber-this.minAsNumber)/this.stepAsNumber);this.stepStyles!==void 0&&this.$fastController.removeStyles(this.stepStyles),this.stepStyles=b`
        :host {
          --step-rate: ${e}%;
        }
      `,this.$fastController.addStyles(this.stepStyles)}else this.stepStyles!==void 0&&this.$fastController.removeStyles(this.stepStyles)}initialValueChanged(e,o){this.$fastController.isConnected?this.value=o:this._value=o}get validity(){return this.elementInternals.validity}get validationMessage(){return this.elementInternals.validationMessage}get willValidate(){return this.elementInternals.willValidate}checkValidity(){return this.elementInternals.checkValidity()}reportValidity(){return this.elementInternals.reportValidity()}setCustomValidity(e){this.setValidity({customError:!!e},e)}setValidity(e,o,r){if(this.$fastController.isConnected){if(this.isDisabled){this.elementInternals.setValidity({});return}this.elementInternals.setValidity({customError:!!o,...e},o??this.validationMessage,r)}}get value(){return v.track(this,"value"),this._value?.toString()??""}set value(e){if(!this.$fastController.isConnected){this._value=e.toString();return}let o=parseFloat(e),r=Nn(this.minAsNumber,this.maxAsNumber,this.convertToConstrainedValue(o)).toString();if(r!==e){this.value=r;return}this._value=e.toString(),this.elementInternals.ariaValueNow=this._value,this.elementInternals.ariaValueText=this.valueTextFormatter(this._value),this.setSliderPosition(),this.$emit("change"),this.setFormValue(e),v.notify(this,"value")}formResetCallback(){this.value=this.initialValue??this.midpoint}formDisabledCallback(e){this.setDisabledSideEffect(e)}setFormValue(e,o){this.elementInternals.setFormValue(e,e??o)}directionChanged(){this.setSliderPosition()}get valueAsNumber(){return parseFloat(this.value)}set valueAsNumber(e){this.value=e.toString()}valueTextFormatterChanged(){typeof this.valueTextFormatter=="function"?this.elementInternals.ariaValueText=this.valueTextFormatter(this._value):this.elementInternals.ariaValueText=""}disabledChanged(){this.setDisabledSideEffect(this.disabled)}get isDisabled(){return this.disabled||this.elementInternals?.ariaDisabled==="true"||this.isConnected&&this.matches(":disabled")}minChanged(){this.elementInternals.ariaValueMin=`${this.minAsNumber}`,this.$fastController.isConnected&&this.minAsNumber>this.valueAsNumber&&(this.value=this.min)}get minAsNumber(){if(this.min!==void 0){let e=parseFloat(this.min);if(!Number.isNaN(e))return e}return 0}maxChanged(){this.elementInternals.ariaValueMax=`${this.maxAsNumber}`,this.$fastController.isConnected&&this.maxAsNumber<this.valueAsNumber&&(this.value=this.max)}get maxAsNumber(){if(this.max!==void 0){let e=parseFloat(this.max);if(!Number.isNaN(e))return e}return 100}stepChanged(){this.updateStepMultiplier(),this.$fastController.isConnected&&(this.value=this._value)}get stepAsNumber(){if(this.step!==void 0){let e=parseFloat(this.step);if(!Number.isNaN(e)&&e>0)return e}return 1}orientationChanged(e,o){this.elementInternals.ariaOrientation=o??ke.horizontal,this.$fastController.isConnected&&this.setSliderPosition()}constructor(){super(),this.elementInternals=this.attachInternals(),this.direction=ut.ltr,this.isDragging=!1,this.trackWidth=0,this.trackMinWidth=0,this.trackHeight=0,this.trackLeft=0,this.trackMinHeight=0,this.valueTextFormatter=()=>"",this.disabled=!1,this.min="",this.max="",this.step="",this.mode=Tc.singleValue,this.setupTrackConstraints=()=>{let e=this.track.getBoundingClientRect();this.trackWidth=this.track.clientWidth,this.trackMinWidth=this.track.clientLeft,this.trackHeight=e.top,this.trackMinHeight=e.bottom,this.trackLeft=this.getBoundingClientRect().left,this.trackWidth===0&&(this.trackWidth=1)},this.handleThumbPointerDown=e=>{if(this.isDisabled)return!0;let o=e!==null?window.addEventListener:window.removeEventListener;return o("pointerup",this.handleWindowPointerUp),o("pointermove",this.handlePointerMove,{passive:!0}),o("touchmove",this.handlePointerMove,{passive:!0}),o("touchend",this.handleWindowPointerUp),this.isDragging=e!==null,!0},this.handlePointerMove=e=>{if(this.isDisabled||e.defaultPrevented)return;let o=window.TouchEvent&&e instanceof TouchEvent?e.touches[0]:e,r=this.thumb.getBoundingClientRect().width,n=this.orientation===ke.vertical?o.pageY-document.documentElement.scrollTop:o.pageX-document.documentElement.scrollLeft-this.trackLeft-r/2;this.value=`${this.calculateNewValue(n)}`},this.handleWindowPointerUp=()=>{this.stopDragging()},this.stopDragging=()=>{this.isDragging=!1,this.handlePointerDown(null),this.handleThumbPointerDown(null)},this.handlePointerDown=e=>{if(e===null||!this.isDisabled){let o=e!==null?window.addEventListener:window.removeEventListener,r=e!==null?document.addEventListener:document.removeEventListener;o("pointerup",this.handleWindowPointerUp),r("mouseleave",this.handleWindowPointerUp),o("pointermove",this.handlePointerMove);let n=this.thumb.getBoundingClientRect().width;if(e){this.setupTrackConstraints();let i=this.orientation===ke.vertical?e.pageY-document.documentElement.scrollTop:e.pageX-document.documentElement.scrollLeft-this.trackLeft-n/2;this.value=`${this.calculateNewValue(i)}`}}return!0},this.elementInternals.role="slider",this.elementInternals.ariaOrientation=this.orientation??Fc.horizontal}connectedCallback(){super.connectedCallback(),requestAnimationFrame(()=>{if(!this.$fastController.isConnected)return;this.direction=vn(this),this.setDisabledSideEffect(this.disabled),this.updateStepMultiplier(),this.setupTrackConstraints(),this.setupDefaultValue(),this.setSliderPosition(),this.handleStepStyles();let e=v.getNotifier(this);e.subscribe(this,"max"),e.subscribe(this,"min"),e.subscribe(this,"step")}),Oe(this)}disconnectedCallback(){super.disconnectedCallback();let e=v.getNotifier(this);e.unsubscribe(this,"max"),e.unsubscribe(this,"min"),e.unsubscribe(this,"step")}increment(){let e=this.direction!==ut.rtl?Number(this.value)+this.stepAsNumber:Number(this.value)-this.stepAsNumber,o=this.convertToConstrainedValue(e),r=o<this.maxAsNumber?`${o}`:`${this.maxAsNumber}`;this.value=r}decrement(){let e=this.direction!==ut.rtl?Number(this.value)-Number(this.stepAsNumber):Number(this.value)+Number(this.stepAsNumber),o=this.convertToConstrainedValue(e),r=o>this.minAsNumber?`${o}`:`${this.minAsNumber}`;this.value=r}handleKeydown(e){if(this.isDisabled)return!0;switch(e.key){case"Home":e.preventDefault(),this.value=this.direction!==ut.rtl&&this.orientation!==ke.vertical?`${this.minAsNumber}`:`${this.maxAsNumber}`;break;case"End":e.preventDefault(),this.value=this.direction!==ut.rtl&&this.orientation!==ke.vertical?`${this.maxAsNumber}`:`${this.minAsNumber}`;break;case"ArrowRight":case"ArrowUp":e.shiftKey||(e.preventDefault(),this.increment());break;case"ArrowLeft":case"ArrowDown":e.shiftKey||(e.preventDefault(),this.decrement());break}return!0}setSliderPosition(){let o=Ni(parseFloat(this.value),this.minAsNumber,this.maxAsNumber,this.orientation===ke.vertical?void 0:this.direction)*100;this.position=`--slider-thumb: ${o}%; --slider-progress: ${o}%`}updateStepMultiplier(){let e=this.stepAsNumber+"",o=this.stepAsNumber%1?e.length-e.indexOf(".")-1:0;this.stepMultiplier=Math.pow(10,o)}get midpoint(){return`${this.convertToConstrainedValue((this.maxAsNumber+this.minAsNumber)/2)}`}setupDefaultValue(){this._value||(this.value=this.initialValue??this.midpoint),!Number.isNaN(this.valueAsNumber)&&(this.valueAsNumber<this.minAsNumber||this.valueAsNumber>this.maxAsNumber)&&(this.value=this.midpoint),this.elementInternals.ariaValueNow=this.value}calculateNewValue(e){this.setupTrackConstraints();let o=Ni(e,this.orientation===ke.vertical?this.trackMinHeight:this.trackMinWidth,this.orientation===ke.vertical?this.trackHeight:this.trackWidth,this.orientation===ke.vertical?void 0:this.direction),r=(this.maxAsNumber-this.minAsNumber)*o+this.minAsNumber;return this.convertToConstrainedValue(r)}convertToConstrainedValue(e){isNaN(e)&&(e=this.minAsNumber);let o=e-this.minAsNumber,r=Math.round(o/this.stepAsNumber),n=o-r*(this.stepMultiplier*this.stepAsNumber)/this.stepMultiplier;return o=n>=Number(this.stepAsNumber)/2?o-n+Number(this.stepAsNumber):o-n,o+this.minAsNumber}setDisabledSideEffect(e=this.isDisabled){L.enqueue(()=>{this.elementInternals.ariaDisabled=e.toString(),this.tabIndex=e?-1:0})}};l([p({attribute:"value",mode:"fromView"})],re.prototype,"initialValue",void 0);l([k],re.prototype,"direction",void 0);l([k],re.prototype,"isDragging",void 0);l([k],re.prototype,"position",void 0);l([k],re.prototype,"trackWidth",void 0);l([k],re.prototype,"trackMinWidth",void 0);l([k],re.prototype,"trackHeight",void 0);l([k],re.prototype,"trackLeft",void 0);l([k],re.prototype,"trackMinHeight",void 0);l([k],re.prototype,"valueTextFormatter",void 0);l([p({mode:"boolean"})],re.prototype,"disabled",void 0);l([p({converter:$n})],re.prototype,"min",void 0);l([p({converter:$n})],re.prototype,"max",void 0);l([p({converter:$n})],re.prototype,"step",void 0);l([p],re.prototype,"orientation",void 0);l([p],re.prototype,"mode",void 0);var Dc=`${f.prefix}-switch`;var Lc=b`
  ${T("inline-flex")}

  :host {
    box-sizing: border-box;
    align-items: center;
    flex-direction: row;
    outline: none;
    user-select: none;
    contain: content;
    padding: 0 ${oe};
    width: 40px;
    height: 20px;
    background-color: ${Ce};
    border: 1px solid ${we};
    border-radius: ${ve};
  }

  :host(:enabled) {
    cursor: pointer;
  }

  :host(:hover) {
    background: none;
    border-color: ${St};
  }
  :host(:active) {
    border-color: ${Bt};
  }
  :host(${w}),
  :host([readonly]) {
    border: 1px solid ${be};
    background-color: none;
    pointer: default;
  }
  :host(${O}) {
    background: ${xt};
    border-color: ${xt};
  }
  :host(${O}:hover) {
    background: ${kt};
    border-color: ${kt};
  }
  :host(${O}:active) {
    background: ${yt};
    border-color: ${yt};
  }
  :host(${O}${w}) {
    background: ${Ie};
    border-color: ${be};
  }
  .checked-indicator {
    height: 14px;
    width: 14px;
    border-radius: 50%;
    margin-inline-start: 0;
    background-color: ${U};
    transition-duration: ${Bo};
    transition-timing-function: ${ln};
    transition-property: margin-inline-start;
  }
  :host(${O}) .checked-indicator {
    background-color: ${ct};
    margin-inline-start: calc(100% - 14px);
  }
  :host(${O}:hover) .checked-indicator {
    background: ${ns};
  }
  :host(${O}:active) .checked-indicator {
    background: ${is};
  }
  :host(:hover) .checked-indicator {
    background-color: ${qa};
  }
  :host(:active) .checked-indicator {
    background-color: ${Ka};
  }
  :host(${w}) .checked-indicator,
  :host([readonly]) .checked-indicator {
    background: ${_};
  }
  :host(${O}${w}) .checked-indicator {
    background: ${_};
  }

  :host(:focus-visible) {
    outline: none;
  }

  :host(:not([slot='input']):focus-visible) {
    border-color: ${q};
    outline: ${et} solid ${q};
    outline-offset: 1px;
    box-shadow: ${rn}, 0 0 0 2px ${ae};
  }

  @media (forced-colors: active) {
    :host {
      border-color: InactiveBorder;
    }
    :host(${O}),
    :host(${O}:active),
    :host(${O}:hover) {
      background: Highlight;
      border-color: Highlight;
    }
    .checked-indicator,
    :host(:hover) .checked-indicator,
    :host(:active) .checked-indicator {
      background-color: CanvasText;
    }
    :host(${O}) .checked-indicator,
    :host(${O}:hover) .checked-indicator,
    :host(${O}:active) .checked-indicator {
      background-color: HighlightText;
    }
    :host(${w}) .checked-indicator,
    :host(${O}${w}) .checked-indicator {
      background-color: GrayText;
    }
  }
`;function Fp(t={}){return y`
    <template
      @click="${(e,o)=>e.clickHandler(o.event)}"
      @input="${(e,o)=>e.inputHandler(o.event)}"
      @keydown="${(e,o)=>e.keydownHandler(o.event)}"
      @keyup="${(e,o)=>e.keyupHandler(o.event)}"
    >
      <slot name="switch">${ie(t.switch)}</slot>
    </template>
  `}var Oc=Fp({switch:'<span class="checked-indicator" part="checked-indicator"></span>'});var Mc={name:Dc,registry:f.registry,styles:Lc,template:Oc};var Pn=class extends Ve{constructor(){super(),this.elementInternals.role="switch"}};function ir(t,e="-tab"){return t?.nodeType!==Node.ELEMENT_NODE?!1:t.tagName.toLowerCase().endsWith(e)}var Ec=`${f.prefix}-tab`;var zc=b`
  ${T("inline-flex")}

  :host {
    position: relative;
    flex-direction: row;
    align-items: center;
    cursor: pointer;
    box-sizing: border-box;
    justify-content: center;
    line-height: ${le};
    font-family: ${$};
    font-size: ${se};
    color: ${ze};
    fill: currentcolor;
    grid-row: 1;
    padding: ${_e} ${tt};
    border-radius: ${M};
    gap: 4px;
  }

  :host .tab-content {
    display: inline-flex;
    flex-direction: column;
    padding: 0 2px;
    grid-column: 3;
  }

  :host([aria-selected='true']) {
    color: ${X};
    font-weight: ${te};
  }

  /* adds hidden textContent to prevent shifting ui on bold / unbolding of text */
  :host .tab-content::after {
    content: var(--textContent);
    visibility: hidden;
    height: 0;
    line-height: ${le};
    font-weight: ${te};
  }

  :host([aria-selected='true'])::after {
    background-color: ${He};
    border-radius: ${ve};
    content: '';
    inset: 0;
    position: absolute;
    z-index: 2;
  }

  :host([aria-selected='false']:hover)::after {
    background-color: ${wt};
    border-radius: ${ve};
    content: '';
    inset: 0;
    position: absolute;
    z-index: 1;
  }

  /*
   * TODO: Remove '(text-size-adjust: auto)' after this bug is fixed:
   * https://bugs.webkit.org/show_bug.cgi?id=298646
   * Also remove the same trick from tablist.styles.ts.
   * Using '@supports (text-size-adjust: auto)' here to exclude Safari 26 from
   * using CSS Anchor Positioning here because it crashes.
   */
  @supports (anchor-name: --a) and (text-size-adjust: auto) {
    :host([aria-selected='true'])::after {
      background-color: transparent;
    }

    :host([aria-selected='true']:hover)::after {
      background-color: ${wt};
    }
  }

  :host([aria-selected='true'][disabled])::after {
    background-color: ${_};
  }

  ::slotted([slot='start']) {
    grid-column: 2;
  }

  ::slotted([slot='end']) {
    grid-column: -1;
  }

  ::slotted([slot='start']),
  ::slotted([slot='end']) {
    display: flex;
  }
  :host([disabled]) {
    cursor: not-allowed;
    fill: ${_};
    color: ${_};
    pointer-events: none;
  }

  :host([disabled]:hover)::after {
    background-color: unset;
  }

  :host(:focus) {
    outline: none;
  }

  :host(:focus-visible) {
    border-radius: ${Re};
    box-shadow: 0 0 0 3px ${ae};
    outline: 1px solid ${bo};
  }

  @media (forced-colors: active) {
    :host([aria-selected='true'])::after {
      background-color: Highlight;
    }
  }
`;function Tp(t={}){return y`
    <template>
      ${Xe(t)}
      <span class="tab-content"><slot></slot></span>
      ${st(t)}
    </template>
  `}var Rc=Tp({});var _c={name:Ec,registry:f.registry,styles:zc,template:Rc};var Ao=class extends F{disabledChanged(e,o){this.setDisabledSideEffect(o)}constructor(){super(),this.elementInternals=this.attachInternals(),this.elementInternals.role="tab"}connectedCallback(){super.connectedCallback(),this.slot||="tab",this.role??="tab",this.setDisabledSideEffect(this.disabled),this.styles&&this.$fastController.removeStyles(this.styles),this.styles=b`
      :host {
        --textContent: '${this.textContent}';
      }
    `,this.$fastController.addStyles(this.styles),Oe(this)}setDisabledSideEffect(e){e?this.setAttribute("aria-disabled","true"):this.removeAttribute("aria-disabled"),this.tabIndex=e&&this.getAttribute("aria-selected")!=="true"?-1:0}};l([p({mode:"boolean"})],Ao.prototype,"disabled",void 0);lt(Ao,Ge);var ar=ke,Vc=`${f.prefix}-tablist`;var Wc=b`
  ${T("flex")}

  :host {
    --tabPaddingInline: ${tt};
    --tabPaddingBlock: ${_e};
    --tabIndicatorInsetInline: var(--tabPaddingInline);
    --tabIndicatorInsetBlock: 0;
    box-sizing: border-box;
    color: ${ze};
    flex-direction: row;
    position: relative;
  }

  :host([size='small']) {
    --tabPaddingBlock: ${ko};
    --tabPaddingInline: ${De};
  }

  :host([size='large']) {
    --tabPaddingBlock: ${an};
    --tabPaddingInline: ${tt};
  }

  :host([orientation='vertical']) {
    --tabPaddingBlock: ${Le};
    --tabIndicatorInsetBlock: ${Le};
    --_col-start-width: 0px;
    display: grid;
    grid-template-columns: ${tt} var(--_col-start-width) 1fr auto ${tt};
  }

  :host(:has([slot='start'])) {
    --_col-start-width: 24px;
  }

  @scope {
    :scope:has([slot='start']) {
      --_col-start-width: 24px;
    }
  }

  :host([orientation='vertical'][size='small']) {
    --tabPaddingBlock: ${Ys};
    --tabIndicatorInsetBlock: ${ko};
  }

  :host([orientation='vertical'][size='large']) {
    --tabPaddingBlock: ${Le};
    --tabIndicatorInsetBlock: ${yo};
  }

  ::slotted([slot='tab']) {
    padding-inline: var(--tabPaddingInline);
    padding-block: var(--tabPaddingBlock);
  }

  :host([orientation='vertical']) ::slotted([role='tab']) {
    justify-content: flex-start;
    display: grid;
    gap: 0;
    grid-column: 1 / -1;
    grid-template-columns: subgrid;
    grid-row: unset;
    padding-inline: 0;
  }

  :host ::slotted([slot='tab'])::after {
    height: ${Dt};
    margin-block-start: auto;
  }

  :host([orientation='vertical']) ::slotted([slot='tab'])::after {
    width: ${Dt};
    height: unset;
    margin-block-start: unset;
  }

  /* ::before adds a secondary indicator placeholder that appears right after click on the active tab */
  :host ::slotted([slot='tab'])::before {
    height: ${Dt};
    border-radius: ${ve};
    content: '';
    inset-inline: var(--tabIndicatorInsetInline);
    inset-block: var(--tabIndicatorInsetBlock);
    position: absolute;
    margin-top: auto;
  }

  :host ::slotted([slot='tab'])::before {
    inset-inline: var(--tabIndicatorInsetInline);
    inset-block: var(--tabIndicatorInsetBlock);
  }

  :host ::slotted([slot='tab'][aria-selected='true'])::before {
    background-color: ${_};
  }

  :host ::slotted([slot='tab'][aria-selected='false']:hover)::after {
    height: ${Dt};
    margin-block-start: auto;
    transform-origin: left;
  }

  :host([orientation='vertical']) ::slotted([slot='tab'])::before,
  :host([orientation='vertical']) ::slotted([slot='tab'][aria-selected='false']:hover)::after {
    height: unset;
    width: ${Dt};
    margin-inline-end: auto;
    transform-origin: top;
  }

  :host([size='small']) ::slotted([slot='tab']) {
    font-size: ${se};
    line-height: ${le};
  }

  :host([size='large']) ::slotted([slot='tab']) {
    font-size: ${Ze};
    line-height: ${Ue};
  }

  /* horizontal spacing for indicator */
  :host ::slotted([slot='tab'])::after,
  :host ::slotted([slot='tab'])::before,
  :host ::slotted([slot='tab']:hover)::after {
    inset-inline: var(--tabIndicatorInsetInline);
  }

  :host([orientation='vertical']) ::slotted([slot='tab'])::after,
  :host([orientation='vertical']) ::slotted([slot='tab'])::before,
  :host([orientation='vertical']) ::slotted([slot='tab']:hover)::after {
    inset-inline: 0;
    inset-block: var(--tabIndicatorInsetBlock);
  }

  /* disabled styles */
  :host([disabled]) {
    cursor: not-allowed;
    color: ${_};
  }

  :host([disabled]) ::slotted([slot='tab']) {
    pointer-events: none;
    cursor: not-allowed;
    color: ${_};
  }

  :host([disabled]) ::slotted([slot='tab']:after) {
    background-color: ${_};
  }

  :host([disabled]) ::slotted([slot='tab'][aria-selected='true'])::after {
    background-color: ${_};
  }

  :host([disabled]) ::slotted([slot='tab']:hover):before {
    content: unset;
  }

  :host([appearance='subtle']) ::slotted([slot='tab']:hover) {
    background-color: ${jr};
    color: ${_r};
    fill: ${os};
  }

  :host([appearance='subtle']) ::slotted([slot='tab']:active) {
    background-color: ${Yo};
    fill: ${Yo};
    color: ${X};
  }

  /*
   * TODO: Remove '(text-size-adjust: auto)' after this bug is fixed:
   * https://bugs.webkit.org/show_bug.cgi?id=298646
   * Also remove the same trick from tab.styles.ts.
   * Using '@supports (text-size-adjust: auto)' here to exclude Safari 26.0 from
   * using CSS Anchor Positioning here because it crashes.
   */
  @supports (anchor-name: --a) and (text-size-adjust: auto) {
    ::slotted([slot='tab'][aria-selected='true']) {
      anchor-name: --tab;
    }

    :host::after {
      background-color: ${He};
      content: '';
      inline-size: 100%;
      inset-block: auto anchor(end);
      inset-inline: anchor(center) auto;
      position: fixed;
      position-anchor: --tab;
      transform: translateX(-50%);
      transition-property: inset-inline, width;
      transition-duration: ${Zs};
      transition-timing-function: ${el};
      z-index: 3;

      /* These styles should be in sync with tab.styles.ts’s :host::after */
      border-radius: ${ve};
      width: calc(anchor-size() - var(--tabIndicatorInsetInline) * 2);
      height: ${Dt};
    }

    :host(:dir(rtl))::after {
      transform: translateX(50%);
    }

    :host([orientation='vertical'])::after {
      inset-block: anchor(center) auto;
      inset-inline: anchor(start) auto;
      transform: translateY(-50%);
      transition-property: inset-block, height;

      /* These styles should be in sync with #vertical-tab-highlight above */
      width: ${Dt};
      height: calc(anchor-size() - var(--tabIndicatorInsetBlock) * 2);
    }

    :host([disabled])::after {
      background-color: ${_};
    }
  }
`;var jc=y`
  <template
    @click="${(t,e)=>t.handleClick(e.event)}"
    @focusin="${(t,e)=>t.handleFocusIn(e.event)}"
  >
    <slot name="tab" ${fe("slottedTabs")}></slot>
  </template>
`;var Gc={name:Vc,registry:f.registry,styles:Wc,template:jc};var Ft=class extends F{disabledChanged(e,o){this.elementInternals&&z(this.elementInternals,"disabled",o),this.setTabs({forceDisabled:!0})}orientationChanged(e,o){this.elementInternals&&(this.elementInternals.ariaOrientation=o??ar.horizontal,un(this.elementInternals,e,o,ar)),this.setTabs()}activeidChanged(e,o){this.tabs?.length>0&&this.changeTab(e,o)}slottedTabsChanged(e,o){this.tabs=o?.filter(r=>ir(r))??[]}tabsChanged(e,o){this.tabs?.length>0&&this.setTabs({connectToPanel:!0})}setTabs({connectToPanel:e=!1,forceDisabled:o=!1}={}){if(!this.tabs)return;let r=this.getRootNode(),n="";for(let i of this.tabs){if(i.slot!=="tab")continue;i.id||=We("tab-"),o?i.disabled=this.disabled:i.disabled=i.disabled||this.disabled,!n&&!i.disabled&&(n=i.id);let a=this.activeid===i.id;if(i.toggleAttribute("focusgroupstart",a),i.setAttribute("aria-selected",a.toString()),e){let s=i.getAttribute("aria-controls")??"",d=r.getElementById(s);s&&d&&(d.role??="tabpanel",d.hidden=this.activeid!==i.id,this.tabPanelMap.set(i,d))}}this.disabled||(this.activeid?this.changeTab(void 0,this.activeid):n&&(this.activeid=n))}handleFocusIn(e){let o=e.target;!ir(o)||o.disabled||(this.activeid=o.id)}handleClick(e){if(e.isTrusted)return;let o=e.target;!ir(o)||o.disabled||(this.activeid=o.id)}changeTab(e,o){let r=this.getRootNode(),n=e?r.getElementById(e):null,i=r.getElementById(o);if(!ir(i)||i.disabled||!this.contains(i))return;if(n){n.setAttribute("aria-selected","false");let s=this.tabPanelMap.get(n);s&&(s.hidden=!0)}i.setAttribute("aria-selected","true");let a=this.tabPanelMap.get(i);a&&(a.hidden=!1),this.activetab=i,this.change()}constructor(){super(),this.elementInternals=this.attachInternals(),this.disabled=!1,this.orientation=ar.horizontal,this.tabs=[],this.tabPanelMap=new WeakMap,this.change=()=>{this.$emit("change",this.activetab)},this.elementInternals.role="tablist",this.elementInternals.ariaOrientation=this.orientation??ar.horizontal}connectedCallback(){super.connectedCallback(),this.role??="tablist",this.hasAttribute("focusgroup")||this.setAttribute("focusgroup","tablist inline block"),jt(this,()=>{this.setTabs()},{shallow:!0})}};l([p({mode:"boolean"})],Ft.prototype,"disabled",void 0);l([p],Ft.prototype,"orientation",void 0);l([p],Ft.prototype,"activeid",void 0);l([k],Ft.prototype,"slottedTabs",void 0);l([k],Ft.prototype,"tabs",void 0);var Fn=class extends Ft{disconnectedCallback(){this.fg?.disconnect(),super.disconnectedCallback()}tabsChanged(e,o){super.tabsChanged(e,o),this.fgItems??=new To(()=>this.tabs?.filter(r=>(r.getAttribute("aria-selected")==="true"||!r.disabled)&&!r.hidden)??[],()=>this.activetab??null),this.fg?this.fg.update():this.fg=new nr(this,this.fgItems,{definition:{behavior:"tablist",axis:void 0,memory:!1,wrap:!0}})}};var Xc={email:"email",password:"password",tel:"tel",text:"text",url:"url"},Uc=["date","datetime-local","email","month","number","password","search","tel","text","time","url","week"],qc=`${f.prefix}-text-input`;var Kc=b`
  ${T("block")}

  :host {
    font-family: ${$};
    font-size: ${se};
    font-weight: ${Q};
    line-height: ${le};
    max-width: 400px;
  }
  .label {
    display: flex;
    color: ${X};
    padding-bottom: ${Zo};
    flex-shrink: 0;
    padding-inline-end: ${qe};
  }

  .label[hidden],
  :host(:empty) .label {
    display: none;
  }

  .root {
    align-items: center;
    background-color: ${A};
    border: ${I} solid ${Ne};
    border-bottom-color: ${we};
    border-radius: ${M};
    box-sizing: border-box;
    height: 32px;
    display: inline-flex;
    flex-direction: row;
    gap: ${oe};
    padding: 0 ${tt};
    position: relative;
    width: 100%;
  }

  :has(.control:user-invalid) {
    border-color: ${Bs};
  }

  .root::after {
    box-sizing: border-box;
    content: '';
    position: absolute;
    left: -1px;
    bottom: 0px;
    right: -1px;
    height: max(2px, ${M});
    border-radius: 0 0 ${M} ${M};
    border-bottom: 2px solid ${He};
    clip-path: inset(calc(100% - 2px) 1px 0px);
    transform: scaleX(0);
    transition-property: transform;
    transition-duration: ${sn};
    transition-delay: ${wo};
  }
  .control {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    color: ${X};
    border-radius: ${M};
    background: ${Ce};
    font-family: ${$};
    font-weight: ${Q};
    font-size: ${se};
    border: none;
    vertical-align: center;
  }
  .control:focus-visible {
    outline: 0;
    border: 0;
  }
  .control::placeholder {
    color: ${Vr};
  }
  :host ::slotted([slot='start']),
  :host ::slotted([slot='end']) {
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${U};
    font-size: ${xo};
  }
  :host ::slotted([slot='start']) {
    padding-right: ${oe};
  }
  :host ::slotted([slot='end']) {
    padding-left: ${oe};
    gap: ${qe};
  }
  :host(:hover) .root {
    border-color: ${wt};
    border-bottom-color: ${St};
  }
  :host(:active) .root {
    border-color: ${go};
  }
  :host(:focus-within) .root {
    outline: transparent solid 2px;
    border-bottom: 0;
  }
  :host(:focus-within) .root::after {
    transform: scaleX(1);
    transition-property: transform;
    transition-duration: ${Bo};
    transition-delay: ${No};
  }
  :host(:focus-within:active) .root:after {
    border-bottom-color: ${Xr};
  }
  :host([appearance='outline']:focus-within) .root {
    border: ${I} solid ${Ne};
  }
  :host(:focus-within) .control {
    color: ${X};
  }
  :host(${w}) .root {
    background: ${Ce};
    border: ${I} solid ${be};
  }
  :host(${w}) .control::placeholder,
  :host(${w}) ::slotted([slot='start']),
  :host(${w}) ::slotted([slot='end']) {
    color: ${_};
  }
  ::selection {
    color: ${ct};
    background-color: ${ps};
  }
  :host([control-size='small']) .control {
    font-size: ${de};
    font-weight: ${Q};
    line-height: ${ue};
  }
  :host([control-size='small']) .root {
    height: 24px;
    gap: ${oe};
    padding: 0 ${De};
  }
  :host([control-size='small']) ::slotted([slot='start']),
  :host([control-size='small']) ::slotted([slot='end']) {
    font-size: ${Ze};
  }
  :host([control-size='large']) .control {
    font-size: ${Ze};
    font-weight: ${Q};
    line-height: ${Ue};
  }
  :host([control-size='large']) .root {
    height: 40px;
    gap: ${dt};
    padding: 0 ${_e};
  }
  :host([control-size='large']) ::slotted([slot='start']),
  :host([control-size='large']) ::slotted([slot='end']) {
    font-size: ${Zr};
  }
  :host([appearance='underline']) .root {
    background: ${Ce};
    border: 0;
    border-radius: 0;
    border-bottom: ${I} solid ${we};
  }
  :host([appearance='underline']:hover) .root {
    border-bottom-color: ${St};
  }
  :host([appearance='underline']:active) .root {
    border-bottom-color: ${Bt};
  }
  :host([appearance='underline']:focus-within) .root {
    border: 0;
    border-bottom-color: ${Bt};
  }
  :host([appearance='underline']${w}) .root {
    border-bottom-color: ${be};
  }
  :host([appearance='filled-lighter']) .root,
  :host([appearance='filled-darker']) .root {
    border: ${I} solid ${q};
    box-shadow: ${on};
  }
  :host([appearance='filled-lighter']) .root {
    background: ${A};
  }
  :host([appearance='filled-darker']) .root {
    background: ${Wt};
  }
  :host([appearance='filled-lighter']:hover) .root,
  :host([appearance='filled-darker']:hover) .root {
    border-color: ${mo};
  }
  :host([appearance='filled-lighter']:active) .root,
  :host([appearance='filled-darker']:active) .root {
    border-color: ${mo};
    background: ${Wt};
  }
`;function Ap(t={}){return y`
    <template @keydown="${(e,o)=>e.keydownHandler(o.event)}">
      <label part="label" for="control" class="label" ${K("controlLabel")}>
        <slot ${fe("defaultSlottedNodes")}></slot>
      </label>
      <div class="root" part="root">
        ${Xe(t)}
        <input
          class="control"
          part="control"
          id="control"
          @change="${(e,o)=>e.changeHandler(o.event)}"
          @input="${(e,o)=>e.inputHandler(o.event)}"
          autocomplete="${e=>e.autocomplete}"
          ?disabled="${e=>e.disabled}"
          list="${e=>e.list}"
          maxlength="${e=>e.maxlength}"
          minlength="${e=>e.minlength}"
          ?multiple="${e=>e.multiple}"
          name="${e=>e.name}"
          pattern="${e=>e.pattern}"
          placeholder="${e=>e.placeholder}"
          ?readonly="${e=>e.readOnly}"
          ?required="${e=>e.required}"
          size="${e=>e.size}"
          spellcheck="${e=>e.spellcheck}"
          type="${e=>e.type}"
          value="${e=>e.value}"
          ${K("control")}
        />
        ${st(t)}
      </div>
    </template>
  `}var Yc=Ap();var Jc={name:qc,registry:f.registry,shadowOptions:{delegatesFocus:!0},styles:Kc,template:Yc};var W=class extends F{constructor(){super(...arguments),this.type=Xc.text,this.dirtyValue=!1,this.committedValue="",this.isUserInput=!1,this.elementInternals=this.attachInternals()}currentValueChanged(e,o){this.value=o}defaultSlottedNodesChanged(e,o){L.enqueue(()=>{this.controlLabel&&(this.controlLabel.hidden=!o?.some(r=>r.nodeType===Node.ELEMENT_NODE||r.nodeType===Node.TEXT_NODE&&!!r.textContent?.trim()))})}initialValueChanged(){this.dirtyValue||(this.value=this.initialValue)}readOnlyChanged(){this.$fastController.isConnected&&(this.elementInternals.ariaReadOnly=`${!!this.readOnly}`)}requiredChanged(e,o){this.$fastController.isConnected&&(this.elementInternals.ariaRequired=`${!!o}`)}controlChanged(e,o){L.enqueue(()=>{this.$fastController.isConnected&&this.setValidity()})}static{this.formAssociated=!0}get validity(){return this.elementInternals.validity}get validationMessage(){return this.elementInternals.validationMessage||this.control.validationMessage}get value(){return v.track(this,"value"),this.currentValue}set value(e){this.currentValue=e,this.isUserInput||(this.committedValue=e??""),this.elementInternals&&this.control&&(this.control.value=e??"",this.setFormValue(e),this.setValidity(),v.notify(this,"value"))}get willValidate(){return this.elementInternals.willValidate}get form(){return this.elementInternals.form}changeHandler(e){return this.control.value!==this.committedValue&&this.emitChange(e),!0}emitChange(e){this.committedValue=this.control.value,this.setValidity(),this.$emit("change",e,{bubbles:!0,composed:!0})}checkValidity(){return this.elementInternals.checkValidity()}clickHandler(e){return e.target===this&&this.control?.click(),!0}connectedCallback(){super.connectedCallback(),this.setFormValue(this.value),this.setValidity(),Oe(this)}formResetCallback(){this.value=this.initialValue,this.dirtyValue=!1}implicitSubmit(){if(!this.elementInternals.form)return;if(this.elementInternals.form.elements.length===1){this.elementInternals.form.requestSubmit();return}let e=[...this.elementInternals.form.elements],o=e.find(n=>n.getAttribute("type")==="submit");if(o){o.click();return}e.filter(n=>Uc.includes(n.getAttribute("type")??"")).length>1||this.elementInternals.form.requestSubmit()}inputHandler(e){this.dirtyValue=!0,this.isUserInput=!0;try{this.value=this.control.value}finally{this.isUserInput=!1}return!0}keydownHandler(e){return e.key!=="Enter"||e.isComposing||e.keyCode===229||e.composedPath()[0]!==this.control||(this.control.value!==this.committedValue&&this.emitChange(),this.implicitSubmit()),!0}select(){this.control.select(),this.$emit("select")}setCustomValidity(e){this.elementInternals.setValidity({customError:!0},e),this.reportValidity()}reportValidity(){return this.elementInternals.reportValidity()}setFormValue(e,o){this.elementInternals?.setFormValue(e,e??o)}setValidity(e,o,r){if(this.elementInternals&&this.control){if(this.disabled){this.elementInternals.setValidity({});return}this.elementInternals.setValidity(e??this.control.validity,o??this.validationMessage,r??this.control)}}};l([p],W.prototype,"autocomplete",void 0);l([p({attribute:"current-value"})],W.prototype,"currentValue",void 0);l([k],W.prototype,"defaultSlottedNodes",void 0);l([p],W.prototype,"dirname",void 0);l([p({mode:"boolean"})],W.prototype,"disabled",void 0);l([p({attribute:"form"})],W.prototype,"formAttribute",void 0);l([p({attribute:"value",mode:"fromView"})],W.prototype,"initialValue",void 0);l([p],W.prototype,"list",void 0);l([p({converter:Mo})],W.prototype,"maxlength",void 0);l([p({converter:Mo})],W.prototype,"minlength",void 0);l([p({mode:"boolean"})],W.prototype,"multiple",void 0);l([p],W.prototype,"name",void 0);l([p],W.prototype,"pattern",void 0);l([p],W.prototype,"placeholder",void 0);l([p({attribute:"readonly",mode:"boolean"})],W.prototype,"readOnly",void 0);l([p({mode:"boolean"})],W.prototype,"required",void 0);l([p({converter:Mo})],W.prototype,"size",void 0);l([p({converter:{fromView:t=>typeof t=="string"?["true",""].includes(t.trim().toLowerCase()):null,toView:t=>t.toString()}})],W.prototype,"spellcheck",void 0);l([p],W.prototype,"type",void 0);l([k],W.prototype,"control",void 0);l([k],W.prototype,"controlLabel",void 0);var sr=class extends W{};lt(sr,Ge);var Cp="adoptedStyleSheets"in document,Ip="CSSScopeRule"in window,$i=new Map,Pi=new Map,cr=new Map,Fi=new Map,lr=new CSSStyleSheet;function Tn(t,e=document){if(!(!e||!Mp(e))){if(!Cp||e instanceof HTMLElement&&!e.shadowRoot&&!Ip){let o=e===document?document.documentElement:e;Vp(t,o);return}[document,document.documentElement,document.body].includes(e)?Ep(t):zp(t,e)}}var Hp=/^[a-zA-Z_-][a-zA-Z0-9_-]*$/;function Dp(t){return Hp.test(t)?t:""}var Lp=/(;|{|}|\/\*|\*\/|@import|url\s*\(|expression\s*\(|javascript:)/i;function Op(t){return Lp.test(t)?"":t}function Ti(t){return $i.has(t)||$i.set(t,Object.keys(t).reduce((e,o)=>{let r=Dp(o),n=Op(t[o].toString());return r&&n?`${e}--${r}:${n};`:e},"")),$i.get(t)}function Mp(t){return[document,document.documentElement].includes(t)||t instanceof HTMLElement&&!!t.closest("body")}function Ep(t){if(t===null){document.adoptedStyleSheets.includes(lr)&&lr.replaceSync("");return}lr.replaceSync(`
    html {
      ${Ti(t)}
    }
  `),document.adoptedStyleSheets.includes(lr)||document.adoptedStyleSheets.push(lr)}function zp(t,e){if(t===null){e.shadowRoot&&cr.has(e)?cr.get(e).replaceSync(""):(delete e.dataset.fluentTheme,Qc(e));return}e.shadowRoot?Rp(e).replaceSync(`
      :host {
        ${Ti(t)}
      }
    `):(e.dataset.fluentTheme=_p(t),Qc(e))}function Rp(t){if(!cr.has(t)){let e=new CSSStyleSheet;cr.set(t,e),t.shadowRoot?.adoptedStyleSheets.push(e)}return cr.get(t)}function _p(t){if(!Pi.has(t)){let e=We("fluent-theme-"),o=new CSSStyleSheet;Pi.set(t,e),o.replaceSync(`
      @scope ([data-fluent-theme="${e}"]) {
        :scope {
          ${Ti(t)}
        }
      }
    `),document.adoptedStyleSheets.push(o)}return Pi.get(t)}function Vp(t,e){let o;if(t===null){if(!Fi.has(e))return;o=Fi.get(e)}else Fi.set(e,t),o=t;for(let[r,n]of Object.entries(o))t===null?e.style.removeProperty(`--${r}`):e.style.setProperty(`--${r}`,n.toString())}var{userAgent:Wp}=navigator,jp=/\bAppleWebKit\/[\d+\.]+\b/.test(Wp);function Qc(t){if(!jp)return;let e="visibility",o="hidden",r=t.style.getPropertyValue(e);t.style.setProperty(e,o),L.process(),t.style.setProperty(e,r)}var c={2:"#050505",4:"#0a0a0a",6:"#0f0f0f",8:"#141414",10:"#1a1a1a",12:"#1f1f1f",14:"#242424",16:"#292929",18:"#2e2e2e",20:"#333333",22:"#383838",24:"#3d3d3d",26:"#424242",28:"#474747",30:"#4d4d4d",32:"#525252",34:"#575757",36:"#5c5c5c",38:"#616161",40:"#666666",42:"#6b6b6b",44:"#707070",46:"#757575",48:"#7a7a7a",50:"#808080",52:"#858585",54:"#8a8a8a",56:"#8f8f8f",58:"#949494",60:"#999999",62:"#9e9e9e",64:"#a3a3a3",66:"#a8a8a8",68:"#adadad",70:"#b3b3b3",72:"#b8b8b8",74:"#bdbdbd",76:"#c2c2c2",78:"#c7c7c7",80:"#cccccc",82:"#d1d1d1",84:"#d6d6d6",86:"#dbdbdb",88:"#e0e0e0",90:"#e6e6e6",92:"#ebebeb",94:"#f0f0f0",96:"#f5f5f5",98:"#fafafa",99:"#fcfcfc"},pe={5:"rgba(255, 255, 255, 0.05)",10:"rgba(255, 255, 255, 0.1)",20:"rgba(255, 255, 255, 0.2)",30:"rgba(255, 255, 255, 0.3)",40:"rgba(255, 255, 255, 0.4)",50:"rgba(255, 255, 255, 0.5)",60:"rgba(255, 255, 255, 0.6)",70:"rgba(255, 255, 255, 0.7)",80:"rgba(255, 255, 255, 0.8)",90:"rgba(255, 255, 255, 0.9)"},Ee={5:"rgba(0, 0, 0, 0.05)",10:"rgba(0, 0, 0, 0.1)",20:"rgba(0, 0, 0, 0.2)",30:"rgba(0, 0, 0, 0.3)",40:"rgba(0, 0, 0, 0.4)",50:"rgba(0, 0, 0, 0.5)",60:"rgba(0, 0, 0, 0.6)",70:"rgba(0, 0, 0, 0.7)",80:"rgba(0, 0, 0, 0.8)",90:"rgba(0, 0, 0, 0.9)"},Zc={5:"rgba(26, 26, 26, 0.05)",10:"rgba(26, 26, 26, 0.1)",20:"rgba(26, 26, 26, 0.2)",30:"rgba(26, 26, 26, 0.3)",40:"rgba(26, 26, 26, 0.4)",50:"rgba(26, 26, 26, 0.5)",60:"rgba(26, 26, 26, 0.6)",70:"rgba(26, 26, 26, 0.7)",80:"rgba(26, 26, 26, 0.8)",90:"rgba(26, 26, 26, 0.9)"},ed={5:"rgba(31, 31, 31, 0.05)",10:"rgba(31, 31, 31, 0.1)",20:"rgba(31, 31, 31, 0.2)",30:"rgba(31, 31, 31, 0.3)",40:"rgba(31, 31, 31, 0.4)",50:"rgba(31, 31, 31, 0.5)",60:"rgba(31, 31, 31, 0.6)",70:"rgba(31, 31, 31, 0.7)",80:"rgba(31, 31, 31, 0.8)",90:"rgba(31, 31, 31, 0.9)"},Ai={5:"rgba(36, 36, 36, 0.05)",10:"rgba(36, 36, 36, 0.1)",20:"rgba(36, 36, 36, 0.2)",30:"rgba(36, 36, 36, 0.3)",40:"rgba(36, 36, 36, 0.4)",50:"rgba(36, 36, 36, 0.5)",60:"rgba(36, 36, 36, 0.6)",70:"rgba(36, 36, 36, 0.7)",80:"rgba(36, 36, 36, 0.8)",90:"rgba(36, 36, 36, 0.9)"},S="#ffffff",Co="#000000";var td={shade50:"#130204",shade40:"#230308",shade30:"#420610",shade20:"#590815",shade10:"#690a19",primary:"#750b1c",tint10:"#861b2c",tint20:"#962f3f",tint30:"#ac4f5e",tint40:"#d69ca5",tint50:"#e9c7cd",tint60:"#f9f0f2"};var Ci={shade50:"#200205",shade40:"#3b0509",shade30:"#6e0811",shade20:"#960b18",shade10:"#b10e1c",primary:"#c50f1f",tint10:"#cc2635",tint20:"#d33f4c",tint30:"#dc626d",tint40:"#eeacb2",tint50:"#f6d1d5",tint60:"#fdf3f4"},od={shade50:"#210809",shade40:"#3f1011",shade30:"#751d1f",shade20:"#9f282b",shade10:"#bc2f32",primary:"#d13438",tint10:"#d7494c",tint20:"#dc5e62",tint30:"#e37d80",tint40:"#f1bbbc",tint50:"#f8dadb",tint60:"#fdf6f6"},rd={shade50:"#230900",shade40:"#411200",shade30:"#7a2101",shade20:"#a62d01",shade10:"#c43501",primary:"#da3b01",tint10:"#de501c",tint20:"#e36537",tint30:"#e9835e",tint40:"#f4bfab",tint50:"#f9dcd1",tint60:"#fdf6f3"};var nd={shade50:"#200d03",shade40:"#3d1805",shade30:"#712d09",shade20:"#9a3d0c",shade10:"#b6480e",primary:"#ca5010",tint10:"#d06228",tint20:"#d77440",tint30:"#df8e64",tint40:"#efc4ad",tint50:"#f7dfd2",tint60:"#fdf7f4"},id={shade50:"#271002",shade40:"#4a1e04",shade30:"#8a3707",shade20:"#bc4b09",shade10:"#de590b",primary:"#f7630c",tint10:"#f87528",tint20:"#f98845",tint30:"#faa06b",tint40:"#fdcfb4",tint50:"#fee5d7",tint60:"#fff9f5"},ad={shade50:"#291600",shade40:"#4d2a00",shade30:"#8f4e00",shade20:"#c26a00",shade10:"#e67e00",primary:"#ff8c00",tint10:"#ff9a1f",tint20:"#ffa83d",tint30:"#ffba66",tint40:"#ffddb3",tint50:"#ffedd6",tint60:"#fffaf5"},sd={shade50:"#251a00",shade40:"#463100",shade30:"#835b00",shade20:"#b27c00",shade10:"#d39300",primary:"#eaa300",tint10:"#edad1c",tint20:"#efb839",tint30:"#f2c661",tint40:"#f9e2ae",tint50:"#fcefd3",tint60:"#fefbf4"},ld={shade50:"#282400",shade40:"#4c4400",shade30:"#817400",shade20:"#c0ad00",shade10:"#e4cc00",primary:"#fde300",tint10:"#fde61e",tint20:"#fdea3d",tint30:"#feee66",tint40:"#fef7b2",tint50:"#fffad6",tint60:"#fffef5"},cd={shade50:"#1f1900",shade40:"#3a2f00",shade30:"#6c5700",shade20:"#937700",shade10:"#ae8c00",primary:"#c19c00",tint10:"#c8a718",tint20:"#d0b232",tint30:"#dac157",tint40:"#ecdfa5",tint50:"#f5eece",tint60:"#fdfbf2"},dd={shade50:"#181202",shade40:"#2e2103",shade30:"#553e06",shade20:"#745408",shade10:"#89640a",primary:"#986f0b",tint10:"#a47d1e",tint20:"#b18c34",tint30:"#c1a256",tint40:"#e0cea2",tint50:"#efe4cb",tint60:"#fbf8f2"},ud={shade50:"#170e07",shade40:"#2b1a0e",shade30:"#50301a",shade20:"#6c4123",shade10:"#804d29",primary:"#8e562e",tint10:"#9c663f",tint20:"#a97652",tint30:"#bb8f6f",tint40:"#ddc3b0",tint50:"#edded3",tint60:"#faf7f4"};var pd={shade50:"#0c1501",shade40:"#162702",shade30:"#294903",shade20:"#376304",shade10:"#427505",primary:"#498205",tint10:"#599116",tint20:"#6ba02b",tint30:"#85b44c",tint40:"#bdd99b",tint50:"#dbebc7",tint60:"#f6faf0"},hd={shade50:"#002111",shade40:"#003d20",shade30:"#00723b",shade20:"#009b51",shade10:"#00b85f",primary:"#00cc6a",tint10:"#19d279",tint20:"#34d889",tint30:"#5ae0a0",tint40:"#a8f0cd",tint50:"#cff7e4",tint60:"#f3fdf8"},gd={shade50:"#031a02",shade40:"#063004",shade30:"#0b5a08",shade20:"#0e7a0b",shade10:"#11910d",primary:"#13a10e",tint10:"#27ac22",tint20:"#3db838",tint30:"#5ec75a",tint40:"#a7e3a5",tint50:"#cef0cd",tint60:"#f2fbf2"},Ii={shade50:"#031403",shade40:"#052505",shade30:"#094509",shade20:"#0c5e0c",shade10:"#0e700e",primary:"#107c10",tint10:"#218c21",tint20:"#359b35",tint30:"#54b054",tint40:"#9fd89f",tint50:"#c9eac9",tint60:"#f1faf1"},fd={shade50:"#021102",shade40:"#032003",shade30:"#063b06",shade20:"#085108",shade10:"#0a5f0a",primary:"#0b6a0b",tint10:"#1a7c1a",tint20:"#2d8e2d",tint30:"#4da64d",tint40:"#9ad29a",tint50:"#c6e7c6",tint60:"#f0f9f0"},md={shade50:"#001d1f",shade40:"#00373a",shade30:"#00666d",shade20:"#008b94",shade10:"#00a5af",primary:"#00b7c3",tint10:"#18bfca",tint20:"#32c8d1",tint30:"#58d3db",tint40:"#a6e9ed",tint50:"#cef3f5",tint60:"#f2fcfd"},bd={shade50:"#001516",shade40:"#012728",shade30:"#02494c",shade20:"#026467",shade10:"#037679",primary:"#038387",tint10:"#159195",tint20:"#2aa0a4",tint30:"#4cb4b7",tint40:"#9bd9db",tint50:"#c7ebec",tint60:"#f0fafa"};var vd={shade50:"#000f12",shade40:"#001b22",shade30:"#00333f",shade20:"#004555",shade10:"#005265",primary:"#005b70",tint10:"#0f6c81",tint20:"#237d92",tint30:"#4496a9",tint40:"#94c8d4",tint50:"#c3e1e8",tint60:"#eff7f9"};var xd={shade50:"#001322",shade40:"#002440",shade30:"#004377",shade20:"#005ba1",shade10:"#006cbf",primary:"#0078d4",tint10:"#1a86d9",tint20:"#3595de",tint30:"#5caae5",tint40:"#a9d3f2",tint50:"#d0e7f8",tint60:"#f3f9fd"},kd={shade50:"#000c16",shade40:"#00172a",shade30:"#002c4e",shade20:"#003b6a",shade10:"#00467e",primary:"#004e8c",tint10:"#125e9a",tint20:"#286fa8",tint30:"#4a89ba",tint40:"#9abfdc",tint50:"#c7dced",tint60:"#f0f6fa"};var yd={shade50:"#0d1126",shade40:"#182047",shade30:"#2c3c85",shade20:"#3c51b4",shade10:"#4760d5",primary:"#4f6bed",tint10:"#637cef",tint20:"#778df1",tint30:"#93a4f4",tint40:"#c8d1fa",tint50:"#e1e6fc",tint60:"#f7f9fe"},Sd={shade50:"#00061d",shade40:"#000c36",shade30:"#001665",shade20:"#001e89",shade10:"#0023a2",primary:"#0027b4",tint10:"#173bbd",tint20:"#3050c6",tint30:"#546fd2",tint40:"#a3b2e8",tint50:"#ccd5f3",tint60:"#f2f4fc"},Bd={shade50:"#120f25",shade40:"#221d46",shade30:"#3f3682",shade20:"#5649b0",shade10:"#6656d1",primary:"#7160e8",tint10:"#8172eb",tint20:"#9184ee",tint30:"#a79cf1",tint40:"#d2ccf8",tint50:"#e7e4fb",tint60:"#f9f8fe"},wd={shade50:"#0f0717",shade40:"#1c0e2b",shade30:"#341a51",shade20:"#46236e",shade10:"#532982",primary:"#5c2e91",tint10:"#6b3f9e",tint20:"#7c52ab",tint30:"#9470bd",tint40:"#c6b1de",tint50:"#e0d3ed",tint60:"#f7f4fb"};var Nd={shade50:"#160418",shade40:"#29072e",shade30:"#4c0d55",shade20:"#671174",shade10:"#7a1589",primary:"#881798",tint10:"#952aa4",tint20:"#a33fb1",tint30:"#b55fc1",tint40:"#d9a7e0",tint50:"#eaceef",tint60:"#faf2fb"},$d={shade50:"#1f091d",shade40:"#3a1136",shade30:"#6d2064",shade20:"#932b88",shade10:"#af33a1",primary:"#c239b3",tint10:"#c94cbc",tint20:"#d161c4",tint30:"#da7ed0",tint40:"#edbbe7",tint50:"#f5daf2",tint60:"#fdf5fc"},Pd={shade50:"#1c0b1f",shade40:"#35153a",shade30:"#63276d",shade20:"#863593",shade10:"#9f3faf",primary:"#b146c2",tint10:"#ba58c9",tint20:"#c36bd1",tint30:"#cf87da",tint40:"#e6bfed",tint50:"#f2dcf5",tint60:"#fcf6fd"},Fd={shade50:"#24091b",shade40:"#441232",shade30:"#80215d",shade20:"#ad2d7e",shade10:"#cd3595",primary:"#e43ba6",tint10:"#e750b0",tint20:"#ea66ba",tint30:"#ef85c8",tint40:"#f7c0e3",tint50:"#fbddf0",tint60:"#fef6fb"};var Td={shade50:"#1f0013",shade40:"#390024",shade30:"#6b0043",shade20:"#91005a",shade10:"#ac006b",primary:"#bf0077",tint10:"#c71885",tint20:"#ce3293",tint30:"#d957a8",tint40:"#eca5d1",tint50:"#f5cee6",tint60:"#fcf2f9"},Ad={shade50:"#13000c",shade40:"#240017",shade30:"#43002b",shade20:"#5a003b",shade10:"#6b0045",primary:"#77004d",tint10:"#87105d",tint20:"#98246f",tint30:"#ad4589",tint40:"#d696c0",tint50:"#e9c4dc",tint60:"#faf0f6"},Cd={shade50:"#141313",shade40:"#252323",shade30:"#444241",shade20:"#5d5958",shade10:"#6e6968",primary:"#7a7574",tint10:"#8a8584",tint20:"#9a9594",tint30:"#afabaa",tint40:"#d7d4d4",tint50:"#eae8e8",tint60:"#faf9f9"},Id={shade50:"#0f0e0e",shade40:"#1c1b1a",shade30:"#343231",shade20:"#474443",shade10:"#54514f",primary:"#5d5a58",tint10:"#706d6b",tint20:"#84817e",tint30:"#9e9b99",tint40:"#cecccb",tint50:"#e5e4e3",tint60:"#f8f8f8"};var Hd={shade50:"#111314",shade40:"#1f2426",shade30:"#3b4447",shade20:"#505c60",shade10:"#5f6d71",primary:"#69797e",tint10:"#79898d",tint20:"#89989d",tint30:"#a0adb2",tint40:"#cdd6d8",tint50:"#e4e9ea",tint60:"#f8f9fa"},Dd={shade50:"#090a0b",shade40:"#111315",shade30:"#202427",shade20:"#2b3135",shade10:"#333a3f",primary:"#394146",tint10:"#4d565c",tint20:"#626c72",tint30:"#808a90",tint40:"#bcc3c7",tint50:"#dbdfe1",tint60:"#f6f7f8"};var H={red:od,green:Ii,darkOrange:rd,yellow:ld,berry:$d,lightGreen:gd,marigold:sd},pt={darkRed:td,cranberry:Ci,pumpkin:nd,peach:ad,gold:cd,brass:dd,brown:ud,forest:pd,seafoam:hd,darkGreen:fd,lightTeal:md,teal:bd,steel:vd,blue:xd,royalBlue:kd,cornflower:yd,navy:Sd,lavender:Bd,purple:wd,grape:Nd,lilac:Pd,pink:Fd,magenta:Td,plum:Ad,beige:Cd,mink:Id,platinum:Hd,anchor:Dd},C={cranberry:Ci,green:Ii,orange:id};var An=["red","green","darkOrange","yellow","berry","lightGreen","marigold"],Cn=["darkRed","cranberry","pumpkin","peach","gold","brass","brown","forest","seafoam","darkGreen","lightTeal","teal","steel","blue","royalBlue","cornflower","navy","lavender","purple","grape","lilac","pink","magenta","plum","beige","mink","platinum","anchor"];var ye={success:"green",warning:"orange",danger:"cranberry"};var dr=An.reduce((t,e)=>{let o=e.slice(0,1).toUpperCase()+e.slice(1),r={[`colorPalette${o}Background1`]:H[e].tint60,[`colorPalette${o}Background2`]:H[e].tint40,[`colorPalette${o}Background3`]:H[e].primary,[`colorPalette${o}Foreground1`]:H[e].shade10,[`colorPalette${o}Foreground2`]:H[e].shade30,[`colorPalette${o}Foreground3`]:H[e].primary,[`colorPalette${o}BorderActive`]:H[e].primary,[`colorPalette${o}Border1`]:H[e].tint40,[`colorPalette${o}Border2`]:H[e].primary};return Object.assign(t,r)},{});dr.colorPaletteYellowForeground1=H.yellow.shade30;dr.colorPaletteRedForegroundInverted=H.red.tint20;dr.colorPaletteGreenForegroundInverted=H.green.tint20;dr.colorPaletteYellowForegroundInverted=H.yellow.tint40;var Gp=Cn.reduce((t,e)=>{let o=e.slice(0,1).toUpperCase()+e.slice(1),r={[`colorPalette${o}Background2`]:pt[e].tint40,[`colorPalette${o}Foreground2`]:pt[e].shade30,[`colorPalette${o}BorderActive`]:pt[e].primary};return Object.assign(t,r)},{}),Ld={...dr,...Gp},qt=Object.entries(ye).reduce((t,[e,o])=>{let r=e.slice(0,1).toUpperCase()+e.slice(1),n={[`colorStatus${r}Background1`]:C[o].tint60,[`colorStatus${r}Background2`]:C[o].tint40,[`colorStatus${r}Background3`]:C[o].primary,[`colorStatus${r}Foreground1`]:C[o].shade10,[`colorStatus${r}Foreground2`]:C[o].shade30,[`colorStatus${r}Foreground3`]:C[o].primary,[`colorStatus${r}ForegroundInverted`]:C[o].tint30,[`colorStatus${r}BorderActive`]:C[o].primary,[`colorStatus${r}Border1`]:C[o].tint40,[`colorStatus${r}Border2`]:C[o].primary};return Object.assign(t,n)},{});qt.colorStatusDangerBackground3Hover=C[ye.danger].shade10;qt.colorStatusDangerBackground3Pressed=C[ye.danger].shade20;qt.colorStatusWarningForeground1=C[ye.warning].shade20;qt.colorStatusWarningForeground3=C[ye.warning].shade20;qt.colorStatusWarningBorder2=C[ye.warning].shade20;var Od=t=>({colorNeutralForeground1:c[14],colorNeutralForeground1Hover:c[14],colorNeutralForeground1Pressed:c[14],colorNeutralForeground1Selected:c[14],colorNeutralForeground2:c[26],colorNeutralForeground2Hover:c[14],colorNeutralForeground2Pressed:c[14],colorNeutralForeground2Selected:c[14],colorNeutralForeground2BrandHover:t[80],colorNeutralForeground2BrandPressed:t[70],colorNeutralForeground2BrandSelected:t[80],colorNeutralForeground3:c[38],colorNeutralForeground3Hover:c[26],colorNeutralForeground3Pressed:c[26],colorNeutralForeground3Selected:c[26],colorNeutralForeground3BrandHover:t[80],colorNeutralForeground3BrandPressed:t[70],colorNeutralForeground3BrandSelected:t[80],colorNeutralForeground4:c[44],colorNeutralForeground5:c[38],colorNeutralForeground5Hover:c[14],colorNeutralForeground5Pressed:c[14],colorNeutralForeground5Selected:c[14],colorNeutralForegroundDisabled:c[74],colorNeutralForegroundInvertedDisabled:pe[40],colorBrandForegroundLink:t[70],colorBrandForegroundLinkHover:t[60],colorBrandForegroundLinkPressed:t[40],colorBrandForegroundLinkSelected:t[70],colorNeutralForeground2Link:c[26],colorNeutralForeground2LinkHover:c[14],colorNeutralForeground2LinkPressed:c[14],colorNeutralForeground2LinkSelected:c[14],colorCompoundBrandForeground1:t[80],colorCompoundBrandForeground1Hover:t[70],colorCompoundBrandForeground1Pressed:t[60],colorBrandForeground1:t[80],colorBrandForeground2:t[70],colorBrandForeground2Hover:t[60],colorBrandForeground2Pressed:t[30],colorNeutralForeground1Static:c[14],colorNeutralForegroundStaticInverted:S,colorNeutralForegroundInverted:S,colorNeutralForegroundInvertedHover:S,colorNeutralForegroundInvertedPressed:S,colorNeutralForegroundInvertedSelected:S,colorNeutralForegroundInverted2:S,colorNeutralForegroundOnBrand:S,colorNeutralForegroundInvertedLink:S,colorNeutralForegroundInvertedLinkHover:S,colorNeutralForegroundInvertedLinkPressed:S,colorNeutralForegroundInvertedLinkSelected:S,colorBrandForegroundInverted:t[100],colorBrandForegroundInvertedHover:t[110],colorBrandForegroundInvertedPressed:t[100],colorBrandForegroundOnLight:t[80],colorBrandForegroundOnLightHover:t[70],colorBrandForegroundOnLightPressed:t[50],colorBrandForegroundOnLightSelected:t[60],colorNeutralBackground1:S,colorNeutralBackground1Hover:c[96],colorNeutralBackground1Pressed:c[88],colorNeutralBackground1Selected:c[92],colorNeutralBackground2:c[98],colorNeutralBackground2Hover:c[94],colorNeutralBackground2Pressed:c[86],colorNeutralBackground2Selected:c[90],colorNeutralBackground3:c[96],colorNeutralBackground3Hover:c[92],colorNeutralBackground3Pressed:c[84],colorNeutralBackground3Selected:c[88],colorNeutralBackground4:c[94],colorNeutralBackground4Hover:c[98],colorNeutralBackground4Pressed:c[96],colorNeutralBackground4Selected:S,colorNeutralBackground5:c[92],colorNeutralBackground5Hover:c[96],colorNeutralBackground5Pressed:c[94],colorNeutralBackground5Selected:c[98],colorNeutralBackground6:c[90],colorNeutralBackground7:"#00000000",colorNeutralBackground7Hover:c[92],colorNeutralBackground7Pressed:c[84],colorNeutralBackground7Selected:"#00000000",colorNeutralBackground8:c[99],colorNeutralBackgroundInverted:c[16],colorNeutralBackgroundInvertedHover:c[24],colorNeutralBackgroundInvertedPressed:c[12],colorNeutralBackgroundInvertedSelected:c[22],colorNeutralBackgroundStatic:c[20],colorNeutralBackgroundAlpha:pe[50],colorNeutralBackgroundAlpha2:pe[80],colorSubtleBackground:"transparent",colorSubtleBackgroundHover:c[96],colorSubtleBackgroundPressed:c[88],colorSubtleBackgroundSelected:c[92],colorSubtleBackgroundLightAlphaHover:pe[70],colorSubtleBackgroundLightAlphaPressed:pe[50],colorSubtleBackgroundLightAlphaSelected:"transparent",colorSubtleBackgroundInverted:"transparent",colorSubtleBackgroundInvertedHover:Ee[10],colorSubtleBackgroundInvertedPressed:Ee[30],colorSubtleBackgroundInvertedSelected:Ee[20],colorTransparentBackground:"transparent",colorTransparentBackgroundHover:"transparent",colorTransparentBackgroundPressed:"transparent",colorTransparentBackgroundSelected:"transparent",colorNeutralBackgroundDisabled:c[94],colorNeutralBackgroundDisabled2:S,colorNeutralBackgroundInvertedDisabled:pe[10],colorNeutralStencil1:c[90],colorNeutralStencil2:c[98],colorNeutralStencil1Alpha:Ee[10],colorNeutralStencil2Alpha:Ee[5],colorBackgroundOverlay:Ee[40],colorScrollbarOverlay:Ee[50],colorBrandBackground:t[80],colorBrandBackgroundHover:t[70],colorBrandBackgroundPressed:t[40],colorBrandBackgroundSelected:t[60],colorCompoundBrandBackground:t[80],colorCompoundBrandBackgroundHover:t[70],colorCompoundBrandBackgroundPressed:t[60],colorBrandBackgroundStatic:t[80],colorBrandBackground2:t[160],colorBrandBackground2Hover:t[150],colorBrandBackground2Pressed:t[130],colorBrandBackground3Static:t[60],colorBrandBackground4Static:t[40],colorBrandBackgroundInverted:S,colorBrandBackgroundInvertedHover:t[160],colorBrandBackgroundInvertedPressed:t[140],colorBrandBackgroundInvertedSelected:t[150],colorNeutralCardBackground:c[98],colorNeutralCardBackgroundHover:S,colorNeutralCardBackgroundPressed:c[96],colorNeutralCardBackgroundSelected:c[92],colorNeutralCardBackgroundDisabled:c[94],colorNeutralStrokeAccessible:c[38],colorNeutralStrokeAccessibleHover:c[34],colorNeutralStrokeAccessiblePressed:c[30],colorNeutralStrokeAccessibleSelected:t[80],colorNeutralStroke1:c[82],colorNeutralStroke1Hover:c[78],colorNeutralStroke1Pressed:c[70],colorNeutralStroke1Selected:c[74],colorNeutralStroke2:c[88],colorNeutralStroke3:c[94],colorNeutralStroke4:c[92],colorNeutralStroke4Hover:c[88],colorNeutralStroke4Pressed:c[84],colorNeutralStroke4Selected:c[92],colorNeutralStrokeSubtle:c[88],colorNeutralStrokeOnBrand:S,colorNeutralStrokeOnBrand2:S,colorNeutralStrokeOnBrand2Hover:S,colorNeutralStrokeOnBrand2Pressed:S,colorNeutralStrokeOnBrand2Selected:S,colorBrandStroke1:t[80],colorBrandStroke2:t[140],colorBrandStroke2Hover:t[120],colorBrandStroke2Pressed:t[80],colorBrandStroke2Contrast:t[140],colorCompoundBrandStroke:t[80],colorCompoundBrandStrokeHover:t[70],colorCompoundBrandStrokePressed:t[60],colorNeutralStrokeDisabled:c[88],colorNeutralStrokeDisabled2:c[92],colorNeutralStrokeInvertedDisabled:pe[40],colorTransparentStroke:"transparent",colorTransparentStrokeInteractive:"transparent",colorTransparentStrokeDisabled:"transparent",colorNeutralStrokeAlpha:Ee[5],colorNeutralStrokeAlpha2:pe[20],colorStrokeFocus1:S,colorStrokeFocus2:Co,colorNeutralShadowAmbient:"rgba(0,0,0,0.12)",colorNeutralShadowKey:"rgba(0,0,0,0.14)",colorNeutralShadowAmbientLighter:"rgba(0,0,0,0.06)",colorNeutralShadowKeyLighter:"rgba(0,0,0,0.07)",colorNeutralShadowAmbientDarker:"rgba(0,0,0,0.20)",colorNeutralShadowKeyDarker:"rgba(0,0,0,0.24)",colorBrandShadowAmbient:"rgba(0,0,0,0.30)",colorBrandShadowKey:"rgba(0,0,0,0.25)"});var ur={borderRadiusNone:"0",borderRadiusSmall:"2px",borderRadiusMedium:"4px",borderRadiusLarge:"6px",borderRadiusXLarge:"8px",borderRadius2XLarge:"12px",borderRadius3XLarge:"16px",borderRadius4XLarge:"24px",borderRadius5XLarge:"32px",borderRadius6XLarge:"40px",borderRadiusCircular:"10000px"};var In={curveAccelerateMax:"cubic-bezier(0.9,0.1,1,0.2)",curveAccelerateMid:"cubic-bezier(1,0,1,1)",curveAccelerateMin:"cubic-bezier(0.8,0,0.78,1)",curveDecelerateMax:"cubic-bezier(0.1,0.9,0.2,1)",curveDecelerateMid:"cubic-bezier(0,0,0,1)",curveDecelerateMin:"cubic-bezier(0.33,0,0.1,1)",curveEasyEaseMax:"cubic-bezier(0.8,0,0.2,1)",curveEasyEase:"cubic-bezier(0.33,0,0.67,1)",curveLinear:"cubic-bezier(0,0,1,1)"};var Hn={durationUltraFast:"50ms",durationFaster:"100ms",durationFast:"150ms",durationNormal:"200ms",durationGentle:"250ms",durationSlow:"300ms",durationSlower:"400ms",durationUltraSlow:"500ms"};var pr={fontSizeBase100:"10px",fontSizeBase200:"12px",fontSizeBase300:"14px",fontSizeBase400:"16px",fontSizeBase500:"20px",fontSizeBase600:"24px",fontSizeHero700:"28px",fontSizeHero800:"32px",fontSizeHero900:"40px",fontSizeHero1000:"68px"},hr={lineHeightBase100:"14px",lineHeightBase200:"16px",lineHeightBase300:"20px",lineHeightBase400:"22px",lineHeightBase500:"28px",lineHeightBase600:"32px",lineHeightHero700:"36px",lineHeightHero800:"40px",lineHeightHero900:"52px",lineHeightHero1000:"92px"},gr={fontWeightRegular:400,fontWeightMedium:500,fontWeightSemibold:600,fontWeightBold:700},fr={fontFamilyBase:"'Segoe UI', 'Segoe UI Web (West European)', -apple-system, BlinkMacSystemFont, Roboto, 'Helvetica Neue', sans-serif",fontFamilyMonospace:"Consolas, 'Courier New', Courier, monospace",fontFamilyNumeric:"Bahnschrift, 'Segoe UI', 'Segoe UI Web (West European)', -apple-system, BlinkMacSystemFont, Roboto, 'Helvetica Neue', sans-serif"};var Y={none:"0",xxs:"2px",xs:"4px",sNudge:"6px",s:"8px",mNudge:"10px",m:"12px",l:"16px",xl:"20px",xxl:"24px",xxxl:"32px"},Dn={spacingHorizontalNone:Y.none,spacingHorizontalXXS:Y.xxs,spacingHorizontalXS:Y.xs,spacingHorizontalSNudge:Y.sNudge,spacingHorizontalS:Y.s,spacingHorizontalMNudge:Y.mNudge,spacingHorizontalM:Y.m,spacingHorizontalL:Y.l,spacingHorizontalXL:Y.xl,spacingHorizontalXXL:Y.xxl,spacingHorizontalXXXL:Y.xxxl},Ln={spacingVerticalNone:Y.none,spacingVerticalXXS:Y.xxs,spacingVerticalXS:Y.xs,spacingVerticalSNudge:Y.sNudge,spacingVerticalS:Y.s,spacingVerticalMNudge:Y.mNudge,spacingVerticalM:Y.m,spacingVerticalL:Y.l,spacingVerticalXL:Y.xl,spacingVerticalXXL:Y.xxl,spacingVerticalXXXL:Y.xxxl};var mr={strokeWidthThin:"1px",strokeWidthThick:"2px",strokeWidthThicker:"3px",strokeWidthThickest:"4px"};function Io(t,e,o=""){return{[`shadow2${o}`]:`0 0 2px ${t}, 0 1px 2px ${e}`,[`shadow4${o}`]:`0 0 2px ${t}, 0 2px 4px ${e}`,[`shadow8${o}`]:`0 0 2px ${t}, 0 4px 8px ${e}`,[`shadow16${o}`]:`0 0 2px ${t}, 0 8px 16px ${e}`,[`shadow28${o}`]:`0 0 8px ${t}, 0 14px 28px ${e}`,[`shadow64${o}`]:`0 0 8px ${t}, 0 32px 64px ${e}`}}var Md=t=>{let e=Od(t);return{...ur,...pr,...hr,...fr,...gr,...mr,...Dn,...Ln,...Hn,...In,...e,...Ld,...qt,...Io(e.colorNeutralShadowAmbient,e.colorNeutralShadowKey),...Io(e.colorBrandShadowAmbient,e.colorBrandShadowKey,"Brand")}};var On={10:"#061724",20:"#082338",30:"#0a2e4a",40:"#0c3b5e",50:"#0e4775",60:"#0f548c",70:"#115ea3",80:"#0f6cbd",90:"#2886de",100:"#479ef5",110:"#62abf5",120:"#77b7f7",130:"#96c6fa",140:"#b4d6fa",150:"#cfe4fa",160:"#ebf3fc"};var ht=An.reduce((t,e)=>{let o=e.slice(0,1).toUpperCase()+e.slice(1),r={[`colorPalette${o}Background1`]:H[e].shade40,[`colorPalette${o}Background2`]:H[e].shade30,[`colorPalette${o}Background3`]:H[e].primary,[`colorPalette${o}Foreground1`]:H[e].tint30,[`colorPalette${o}Foreground2`]:H[e].tint40,[`colorPalette${o}Foreground3`]:H[e].tint20,[`colorPalette${o}BorderActive`]:H[e].tint30,[`colorPalette${o}Border1`]:H[e].primary,[`colorPalette${o}Border2`]:H[e].tint20};return Object.assign(t,r)},{});ht.colorPaletteRedForeground3=H.red.tint30;ht.colorPaletteRedBorder2=H.red.tint30;ht.colorPaletteGreenForeground3=H.green.tint40;ht.colorPaletteGreenBorder2=H.green.tint40;ht.colorPaletteDarkOrangeForeground3=H.darkOrange.tint30;ht.colorPaletteDarkOrangeBorder2=H.darkOrange.tint30;ht.colorPaletteRedForegroundInverted=H.red.primary;ht.colorPaletteGreenForegroundInverted=H.green.primary;ht.colorPaletteYellowForegroundInverted=H.yellow.shade30;var Hi=Cn.reduce((t,e)=>{let o=e.slice(0,1).toUpperCase()+e.slice(1),r={[`colorPalette${o}Background2`]:pt[e].shade30,[`colorPalette${o}Foreground2`]:pt[e].tint40,[`colorPalette${o}BorderActive`]:pt[e].tint30};return Object.assign(t,r)},{});Hi.colorPaletteDarkRedBackground2=pt.darkRed.shade20;Hi.colorPalettePlumBackground2=pt.plum.shade20;var Ed={...ht,...Hi},Tt=Object.entries(ye).reduce((t,[e,o])=>{let r=e.slice(0,1).toUpperCase()+e.slice(1),n={[`colorStatus${r}Background1`]:C[o].shade40,[`colorStatus${r}Background2`]:C[o].shade30,[`colorStatus${r}Background3`]:C[o].primary,[`colorStatus${r}Foreground1`]:C[o].tint30,[`colorStatus${r}Foreground2`]:C[o].tint40,[`colorStatus${r}Foreground3`]:C[o].tint20,[`colorStatus${r}BorderActive`]:C[o].tint30,[`colorStatus${r}ForegroundInverted`]:C[o].shade10,[`colorStatus${r}Border1`]:C[o].primary,[`colorStatus${r}Border2`]:C[o].tint20};return Object.assign(t,n)},{});Tt.colorStatusDangerBackground3Hover=C[ye.danger].shade10;Tt.colorStatusDangerBackground3Pressed=C[ye.danger].shade20;Tt.colorStatusDangerForeground3=C[ye.danger].tint40;Tt.colorStatusDangerBorder2=C[ye.danger].tint30;Tt.colorStatusSuccessForeground3=C[ye.success].tint40;Tt.colorStatusSuccessBorder2=C[ye.success].tint40;Tt.colorStatusWarningForegroundInverted=C[ye.warning].shade20;var br=Md(On);var zd=t=>({colorNeutralForeground1:S,colorNeutralForeground1Hover:S,colorNeutralForeground1Pressed:S,colorNeutralForeground1Selected:S,colorNeutralForeground2:c[84],colorNeutralForeground2Hover:S,colorNeutralForeground2Pressed:S,colorNeutralForeground2Selected:S,colorNeutralForeground2BrandHover:t[100],colorNeutralForeground2BrandPressed:t[90],colorNeutralForeground2BrandSelected:t[100],colorNeutralForeground3:c[68],colorNeutralForeground3Hover:c[84],colorNeutralForeground3Pressed:c[84],colorNeutralForeground3Selected:c[84],colorNeutralForeground3BrandHover:t[100],colorNeutralForeground3BrandPressed:t[90],colorNeutralForeground3BrandSelected:t[100],colorNeutralForeground4:c[60],colorNeutralForeground5:c[68],colorNeutralForeground5Hover:S,colorNeutralForeground5Pressed:S,colorNeutralForeground5Selected:S,colorNeutralForegroundDisabled:c[36],colorNeutralForegroundInvertedDisabled:pe[40],colorBrandForegroundLink:t[100],colorBrandForegroundLinkHover:t[110],colorBrandForegroundLinkPressed:t[90],colorBrandForegroundLinkSelected:t[100],colorNeutralForeground2Link:c[84],colorNeutralForeground2LinkHover:S,colorNeutralForeground2LinkPressed:S,colorNeutralForeground2LinkSelected:S,colorCompoundBrandForeground1:t[100],colorCompoundBrandForeground1Hover:t[110],colorCompoundBrandForeground1Pressed:t[90],colorBrandForeground1:t[100],colorBrandForeground2:t[110],colorBrandForeground2Hover:t[130],colorBrandForeground2Pressed:t[160],colorNeutralForeground1Static:c[14],colorNeutralForegroundStaticInverted:S,colorNeutralForegroundInverted:c[14],colorNeutralForegroundInvertedHover:c[14],colorNeutralForegroundInvertedPressed:c[14],colorNeutralForegroundInvertedSelected:c[14],colorNeutralForegroundInverted2:c[14],colorNeutralForegroundOnBrand:S,colorNeutralForegroundInvertedLink:S,colorNeutralForegroundInvertedLinkHover:S,colorNeutralForegroundInvertedLinkPressed:S,colorNeutralForegroundInvertedLinkSelected:S,colorBrandForegroundInverted:t[80],colorBrandForegroundInvertedHover:t[70],colorBrandForegroundInvertedPressed:t[60],colorBrandForegroundOnLight:t[80],colorBrandForegroundOnLightHover:t[70],colorBrandForegroundOnLightPressed:t[50],colorBrandForegroundOnLightSelected:t[60],colorNeutralBackground1:c[16],colorNeutralBackground1Hover:c[24],colorNeutralBackground1Pressed:c[12],colorNeutralBackground1Selected:c[22],colorNeutralBackground2:c[12],colorNeutralBackground2Hover:c[20],colorNeutralBackground2Pressed:c[8],colorNeutralBackground2Selected:c[18],colorNeutralBackground3:c[8],colorNeutralBackground3Hover:c[16],colorNeutralBackground3Pressed:c[4],colorNeutralBackground3Selected:c[14],colorNeutralBackground4:c[4],colorNeutralBackground4Hover:c[12],colorNeutralBackground4Pressed:Co,colorNeutralBackground4Selected:c[10],colorNeutralBackground5:Co,colorNeutralBackground5Hover:c[8],colorNeutralBackground5Pressed:c[2],colorNeutralBackground5Selected:c[6],colorNeutralBackground6:c[20],colorNeutralBackground7:"#00000000",colorNeutralBackground7Hover:c[10],colorNeutralBackground7Pressed:c[4],colorNeutralBackground7Selected:"#00000000",colorNeutralBackground8:c[16],colorNeutralBackgroundInverted:S,colorNeutralBackgroundInvertedHover:c[96],colorNeutralBackgroundInvertedPressed:c[88],colorNeutralBackgroundInvertedSelected:c[92],colorNeutralBackgroundStatic:c[24],colorNeutralBackgroundAlpha:Zc[50],colorNeutralBackgroundAlpha2:ed[70],colorSubtleBackground:"transparent",colorSubtleBackgroundHover:c[22],colorSubtleBackgroundPressed:c[18],colorSubtleBackgroundSelected:c[20],colorSubtleBackgroundLightAlphaHover:Ai[80],colorSubtleBackgroundLightAlphaPressed:Ai[50],colorSubtleBackgroundLightAlphaSelected:"transparent",colorSubtleBackgroundInverted:"transparent",colorSubtleBackgroundInvertedHover:Ee[10],colorSubtleBackgroundInvertedPressed:Ee[30],colorSubtleBackgroundInvertedSelected:Ee[20],colorTransparentBackground:"transparent",colorTransparentBackgroundHover:"transparent",colorTransparentBackgroundPressed:"transparent",colorTransparentBackgroundSelected:"transparent",colorNeutralBackgroundDisabled:c[8],colorNeutralBackgroundDisabled2:c[16],colorNeutralBackgroundInvertedDisabled:pe[10],colorNeutralStencil1:c[34],colorNeutralStencil2:c[20],colorNeutralStencil1Alpha:pe[10],colorNeutralStencil2Alpha:pe[5],colorBackgroundOverlay:Ee[50],colorScrollbarOverlay:pe[60],colorBrandBackground:t[70],colorBrandBackgroundHover:t[80],colorBrandBackgroundPressed:t[40],colorBrandBackgroundSelected:t[60],colorCompoundBrandBackground:t[100],colorCompoundBrandBackgroundHover:t[110],colorCompoundBrandBackgroundPressed:t[90],colorBrandBackgroundStatic:t[80],colorBrandBackground2:t[20],colorBrandBackground2Hover:t[40],colorBrandBackground2Pressed:t[10],colorBrandBackground3Static:t[60],colorBrandBackground4Static:t[40],colorBrandBackgroundInverted:S,colorBrandBackgroundInvertedHover:t[160],colorBrandBackgroundInvertedPressed:t[140],colorBrandBackgroundInvertedSelected:t[150],colorNeutralCardBackground:c[20],colorNeutralCardBackgroundHover:c[24],colorNeutralCardBackgroundPressed:c[18],colorNeutralCardBackgroundSelected:c[22],colorNeutralCardBackgroundDisabled:c[8],colorNeutralStrokeAccessible:c[68],colorNeutralStrokeAccessibleHover:c[74],colorNeutralStrokeAccessiblePressed:c[70],colorNeutralStrokeAccessibleSelected:t[100],colorNeutralStroke1:c[40],colorNeutralStroke1Hover:c[46],colorNeutralStroke1Pressed:c[42],colorNeutralStroke1Selected:c[44],colorNeutralStroke2:c[32],colorNeutralStroke3:c[24],colorNeutralStroke4:c[24],colorNeutralStroke4Hover:c[18],colorNeutralStroke4Pressed:c[14],colorNeutralStroke4Selected:c[24],colorNeutralStrokeSubtle:c[4],colorNeutralStrokeOnBrand:c[16],colorNeutralStrokeOnBrand2:S,colorNeutralStrokeOnBrand2Hover:S,colorNeutralStrokeOnBrand2Pressed:S,colorNeutralStrokeOnBrand2Selected:S,colorBrandStroke1:t[100],colorBrandStroke2:t[50],colorBrandStroke2Hover:t[50],colorBrandStroke2Pressed:t[30],colorBrandStroke2Contrast:t[50],colorCompoundBrandStroke:t[100],colorCompoundBrandStrokeHover:t[110],colorCompoundBrandStrokePressed:t[90],colorNeutralStrokeDisabled:c[26],colorNeutralStrokeDisabled2:c[24],colorNeutralStrokeInvertedDisabled:pe[40],colorTransparentStroke:"transparent",colorTransparentStrokeInteractive:"transparent",colorTransparentStrokeDisabled:"transparent",colorNeutralStrokeAlpha:pe[10],colorNeutralStrokeAlpha2:pe[20],colorStrokeFocus1:Co,colorStrokeFocus2:S,colorNeutralShadowAmbient:"rgba(0,0,0,0.24)",colorNeutralShadowKey:"rgba(0,0,0,0.28)",colorNeutralShadowAmbientLighter:"rgba(0,0,0,0.12)",colorNeutralShadowKeyLighter:"rgba(0,0,0,0.14)",colorNeutralShadowAmbientDarker:"rgba(0,0,0,0.40)",colorNeutralShadowKeyDarker:"rgba(0,0,0,0.48)",colorBrandShadowAmbient:"rgba(0,0,0,0.30)",colorBrandShadowKey:"rgba(0,0,0,0.25)"});var Rd=t=>{let e=zd(t);return{...ur,...pr,...hr,...fr,...gr,...mr,...Dn,...Ln,...Hn,...In,...e,...Ed,...Tt,...Io(e.colorNeutralShadowAmbient,e.colorNeutralShadowKey),...Io(e.colorBrandShadowAmbient,e.colorBrandShadowKey,"Brand")}};var vr=Rd(On);tr.define(vl);Gt.define(kl);or.define(Tl);Me.define(Dl);hn.define(El);gn.define(Vl);xn.define(Kl);cn.define(ll);$t.define(ec);ot.define(wc);yn.define(lc);je.define(hc);wn.define(kc);kn.define(nc);me.define(Pc);re.define(Hc);Pn.define(Mc);Ao.define(_c);Fn.define(Gc);sr.define(Jc);var jd=window.matchMedia("(prefers-color-scheme: dark)"),Gd=()=>Tn(jd.matches?vr:br);Gd();jd.addEventListener("change",Gd);var m=t=>document.getElementById(t),j=null,G=null,ge=-1,B=null,Yt=null,xr=null,Ho="live";async function ee(t,e,o){let r={method:t,headers:{"X-SBBridge":"1"}};t!=="GET"&&(r.headers["Content-Type"]="application/json",r.body=JSON.stringify(o===void 0?{}:o));let n=await fetch(e,r),i=await n.json().catch(()=>({}));if(!n.ok)throw new Error(i.error||"HTTP "+n.status);return i}function P(t,e,...o){let r=document.createElement(t);for(let[n,i]of Object.entries(e||{}))n==="class"?r.className=i:n.startsWith("on")?r.addEventListener(n.slice(2),i):i===!0?r.setAttribute(n,""):i!=null&&i!==!1&&r.setAttribute(n,i);for(let n of o)n!=null&&r.append(n);return r}function Qt(t){let e=m("toast");e.textContent=t,e.classList.add("show"),clearTimeout(e._h),e._h=setTimeout(()=>e.classList.remove("show"),2600)}var At=t=>j.controls.find(e=>e.id===t)||{id:t,name:"(none)",kind:"None"},Jt=t=>t.replace(/^NumPad(\d)$/,"Numpad $1").replace(/^D(\d)$/,"$1").replace(/([a-z0-9])([A-Z])/g,"$1 $2");function Mi(t,e,o,r,n={}){let i=P("fluent-listbox");t.forEach((s,d)=>i.append(P("fluent-option",{value:s,selected:s===o},e?e[d]:s)));let a=P("fluent-dropdown",{placeholder:n.placeholder||"Select\u2026",type:n.combobox?"combobox":null,"aria-label":n.label},i);return a.addEventListener("change",()=>{let s=a.value;s!=null&&r(s)}),a}function he(t,e,o){let r="f"+Math.random().toString(36).slice(2,8);return e.id=r,P("div",{class:"field"},P("label",{for:r},t),e,o?P("span",{class:"hint"},o):null)}function _d(t,e,o,r={}){let n=P("fluent-text-input",Object.assign({type:e,value:t??""},r));return n.addEventListener("input",()=>o(n.value)),n.addEventListener("change",()=>o(n.value)),n}function Kt(t,e,o){let r="s"+Math.random().toString(36).slice(2,8),n=P("fluent-switch",{id:r,checked:!!e,"aria-label":t});return n.addEventListener("change",()=>o(!!n.checked)),P("div",{class:"switchrow"},n,P("label",{for:r},t))}function Ei(t,e){return new Promise(o=>{let r=m("dlg"),n=m("dlgInput");m("dlgTitle").textContent=t,n.value=e||"";let i=a=>{m("dlgOk").onclick=m("dlgCancel").onclick=null,n.onkeydown=null,r.hide(),o(a)};m("dlgOk").onclick=()=>i(n.value.trim()||null),m("dlgCancel").onclick=()=>i(null),n.onkeydown=a=>{a.key==="Enter"&&i(n.value.trim()||null)},r.show(),setTimeout(()=>n.focus(),50)})}function zi(t){return new Promise(e=>{let o=m("dlg"),r=m("dlgInput");m("dlgTitle").textContent=t,r.hidden=!0;let n=i=>{m("dlgOk").onclick=m("dlgCancel").onclick=null,r.hidden=!1,o.hide(),e(i)};m("dlgOk").onclick=()=>n(!0),m("dlgCancel").onclick=()=>n(!1),o.show()})}async function $e(t,e){try{let o=await t;return e&&Qt(e),o}catch(o){return Qt(o.message),null}}m("tabs").addEventListener("change",()=>{Ho=(m("tabs").activeid||"tab-live").replace("tab-","");for(let e of document.querySelectorAll(".panel"))e.hidden=e.id!=="panel-"+Ho});async function Mt(){let t=await ee("GET","/api/profiles"),e=m("profileHost");e.innerHTML="",e.append(Mi(t.names,null,t.active,async o=>{o!==G?.name&&(await Mn(),await $e(ee("POST","/api/profiles/select",{name:o}),"Profile: "+o),await Mt())},{label:"Profile"})),G=await ee("GET","/api/profile"),ge=-1,eo(),Et()}m("miNew").addEventListener("click",async()=>{let t=await Ei("New profile name","My profile");t&&(await Mn(),await $e(ee("POST","/api/profiles/new",{name:t,copy:!1})),await Mt())});m("miCopy").addEventListener("click",async()=>{let t=await Ei("Duplicate profile as",G.name+" copy");t&&(await Mn(),await $e(ee("POST","/api/profiles/new",{name:t,copy:!0})),await Mt())});m("miRename").addEventListener("click",async()=>{let t=await Ei("Rename profile",G.name);t&&t!==G.name&&(await Mn(),await $e(ee("POST","/api/profiles/rename",{name:t})),await Mt())});m("miDelete").addEventListener("click",async()=>{await zi("Delete the profile \u201C"+G.name+"\u201D?")&&(await $e(ee("POST","/api/profiles/delete"),"Profile deleted"),await Mt())});m("miDefaults").addEventListener("click",async()=>{await zi("Restore the built-in profiles? Your own profiles are kept; edited built-in ones are overwritten.")&&(await $e(ee("POST","/api/profiles/reset-defaults"),"Built-in profiles restored"),await Mt())});function Zt(){clearTimeout(xr),xr=setTimeout(Xd,400)}async function Xd(){xr=null;try{await ee("PUT","/api/profile",G)}catch(t){Qt("Couldn't save: "+t.message)}}async function Mn(){xr&&(clearTimeout(xr),await Xd())}var Ud=t=>At(t.control).kind==="Axis",qd=t=>["XboxButton","Key","MouseButton"].includes(t.output);function Kd(t){switch(t.output){case"XboxButton":return"Xbox "+Jt(t.xboxButton);case"XboxAxis":return"Xbox "+Jt(t.xboxAxis);case"Key":return"Key "+(t.withCtrl?"Ctrl+":"")+(t.withShift?"Shift+":"")+(t.withAlt?"Alt+":"")+Jt(t.key);case"MouseButton":return"Mouse "+Jt(t.mouseButton);case"MouseMove":return"Mouse "+t.mouseAxis+" movement";default:return"\u2014"}}var Yd=t=>qd(t)?Ud(t)?t.direction+" past "+t.threshold:Jt(t.mode):t.invert?"Inverted":"",Jd=t=>t.layer==="Always"?"":t.layer==="ShiftedOnly"?"Shift":"Normal";function eo(){let t=m("bindRows");t.innerHTML="",G.bindings.forEach((r,n)=>{let i=P("tr",{class:"clickable"+(n===ge?" sel":""),onclick:()=>{ge=n,eo(),Et()}},P("td",{},At(r.control).name),P("td",{},Jd(r)),P("td",{},Kd(r)),P("td",{},Yd(r)),P("td",{class:"note"},r.note||""));i.dataset.control=r.control,t.append(i)});let e=m("shiftHost");e.innerHTML="";let o=j.controls.filter(r=>r.kind==="Button"||r.kind==="VirtualButton");e.append(Mi(["None"].concat(o.map(r=>r.id)),["None"].concat(o.map(r=>r.name)),G.shiftControl||"None",r=>{G.shiftControl=r,Zt()},{label:"Shift control"}))}function Xp(){let t=G.bindings[ge],e=m("bindRows").children[ge];!t||!e||[At(t.control).name,Jd(t),Kd(t),Yd(t),t.note||""].forEach((o,r)=>e.children[r].textContent=o)}function Qd(t){let e=t&&At(t).kind==="Axis";return{control:t||"None",layer:"Always",output:e?"XboxAxis":"XboxButton",xboxButton:"A",xboxAxis:"LeftStickX",key:"None",withCtrl:!1,withShift:!1,withAlt:!1,mouseButton:"Left",mouseAxis:"X",mouseSpeed:1200,mode:"Hold",pulseMs:60,direction:"Positive",threshold:.5,invert:!1,deadzone:.05,curve:1,oneSidedToFullRange:!1,scale:1,note:""}}m("btnAdd").addEventListener("click",()=>{G.bindings.push(Qd()),ge=G.bindings.length-1,eo(),Et(),Zt()});m("btnDup").addEventListener("click",()=>{ge<0||(G.bindings.splice(ge+1,0,JSON.parse(JSON.stringify(G.bindings[ge]))),ge++,eo(),Et(),Zt())});m("btnRemove").addEventListener("click",()=>{ge<0||(G.bindings.splice(ge,1),ge=Math.min(ge,G.bindings.length-1),eo(),Et(),Zt())});m("btnSort").addEventListener("click",()=>{let t=j.controls.map(e=>e.id);G.bindings.sort((e,o)=>t.indexOf(e.control)-t.indexOf(o.control)),ge=-1,eo(),Et(),Zt()});function Et(){let t=m("editorFields");t.innerHTML="";let e=G.bindings[ge];if(m("editorEmpty").hidden=!!e,!e)return;let o=Ud(e),r=qd(e),n=(s,d)=>h=>{e[s]=h,Zt(),Xp(),d&&Et()},i=(s,d,h,u)=>_d(e[s],"number",x=>{let N=parseFloat(x);isNaN(N)||n(s)(Math.max(d,Math.min(h,N)))},{min:d,max:h,step:u}),a=(s,d,h,u,x)=>Mi(d,u||d.map(Jt),e[s],n(s,h),x);t.append(P("div",{class:"section-label"},"Source")),t.append(he("Control",a("control",["None"].concat(j.controls.map(s=>s.id)),!0,["(none)"].concat(j.controls.map(s=>s.name))))),t.append(he("Layer",a("layer",j.layers),"Always = both layers. Normal only / Shifted only follow the Shift control.")),t.append(P("div",{class:"section-label"},"Output")),t.append(he("Output",a("output",j.outputKinds,!0))),e.output==="XboxButton"&&t.append(he("Xbox button",a("xboxButton",j.xboxButtons))),e.output==="XboxAxis"&&t.append(he("Xbox stick or trigger",a("xboxAxis",j.xboxAxes))),e.output==="Key"&&(t.append(he("Key",a("key",j.keys))),t.append(Kt("Hold Ctrl",e.withCtrl,n("withCtrl")),Kt("Hold Shift",e.withShift,n("withShift")),Kt("Hold Alt",e.withAlt,n("withAlt")))),e.output==="MouseButton"&&t.append(he("Mouse button",a("mouseButton",j.mouseButtons))),e.output==="MouseMove"&&(t.append(he("Mouse axis",a("mouseAxis",j.mouseAxes))),t.append(he("Speed (pixels per second)",i("mouseSpeed",0,2e4,50)))),r&&!o&&(t.append(P("div",{class:"section-label"},"Behaviour")),t.append(he("Mode",a("mode",j.modes),"Hold mirrors the control. Pulse taps once on press. Pulse on change taps whenever a latching switch flips. Toggle latches on/off.")),t.append(he("Pulse length (ms)",i("pulseMs",10,2e3,10)))),o&&r&&(t.append(P("div",{class:"section-label"},"Axis as button")),t.append(he("Direction",a("direction",j.directions),"Which way the axis must move to press it.")),t.append(he("Threshold (0\u20131)",i("threshold",0,1,.05))),t.append(Kt("Invert axis",e.invert,n("invert")))),!o&&e.output==="XboxAxis"&&t.append(he("Direction",a("direction",j.directions),"Pushes the stick this way while the button is held.")),o&&(e.output==="XboxAxis"||e.output==="MouseMove")&&(t.append(P("div",{class:"section-label"},"Axis tuning")),t.append(Kt("Invert axis",e.invert,n("invert"))),t.append(he("Dead zone (0\u20130.9)",i("deadzone",0,.9,.01))),t.append(he("Curve",i("curve",.1,5,.1),"1 = linear, 2 = finer control near the centre.")),t.append(he("Scale",i("scale",0,4,.05))),e.output==="XboxAxis"&&t.append(Kt("Pedal/dial uses the stick's full range",e.oneSidedToFullRange,n("oneSidedToFullRange")))),t.append(P("div",{class:"section-label"},"Note")),t.append(he("Note",_d(e.note,"text",n("note"),{placeholder:"What this does in-game"})))}m("btnLearn").addEventListener("click",()=>{if(!B||!B.connected){Qt("Connect the controller first");return}Yt=JSON.parse(JSON.stringify(B)),kr()});function Up(){if(!Yt||!B||!B.connected)return;let t=null;for(let r of j.controls){let n=Yt.down.includes(r.id),i=B.down.includes(r.id);if(r.kind==="Button"&&n!==i){t=r.id;break}if(r.kind==="VirtualButton"&&i&&!n){t=r.id;break}if(r.calibratable&&Math.abs(B.axes[r.id].value-Yt.axes[r.id].value)>.45){t=r.id;break}}if(!t)return;Yt=null,kr();let e=G.bindings[ge],o=At(t).kind==="Axis";e&&e.control==="None"?(e.control=t,o&&e.output==="XboxButton"&&(e.output="XboxAxis")):(G.bindings.push(Qd(t)),ge=G.bindings.length-1),Ho!=="bindings"&&(m("tabs").activeid="tab-bindings"),eo(),Et(),Zt(),Qt("Learned: "+At(t).name)}function qp(){let t=m("liveGrid");t.innerHTML="";for(let[e,o]of[["Axis","Axes"],["Button","Buttons and switches"],["VirtualButton","Gear lever and tuner dial"]]){t.append(P("div",{class:"group-title"},o));for(let r of j.controls.filter(n=>n.kind===e)){let n=P("span",{class:"val"}),i=e==="Axis"?P("span",{},P("span",{class:"meter"+(r.bipolar?" bi":"")},P("i")),n):n,a=P("div",{class:"ctl",id:"live-"+r.id},P("span",{},r.name),i);t.append(a)}}}function Kp(){for(let r of j.controls){let n=m("live-"+r.id);if(!n)continue;let i=n.querySelector(".val");if(r.kind==="Axis"){let a=B.axes[r.id],s=a.value,d=n.querySelector(".meter i");i.textContent=(s>=0?"+":"")+s.toFixed(2),r.bipolar?(d.style.left=(s>=0?50:50+s*50)+"%",d.style.width=Math.abs(s)*50+"%"):(d.style.left="0",d.style.width=s*100+"%")}else{let a=B.down.includes(r.id);n.classList.toggle("on",a),i.textContent=a?"On":""}}let t=B.pad,e=r=>r/32768*34;m("dotL").style.transform=`translate(${e(t.lx)}px, ${-e(t.ly)}px)`,m("dotR").style.transform=`translate(${e(t.rx)}px, ${-e(t.ry)}px)`,m("trigL").style.height=t.lt/255*100+"%",m("trigR").style.height=t.rt/255*100+"%";let o=m("padButtons");o.innerHTML="";for(let r of j.xboxButtons.filter(n=>!n.endsWith("Full")))o.append(P("fluent-badge",{appearance:t.buttons.includes(r)?"filled":"ghost",color:t.buttons.includes(r)?"brand":"informative",size:"small"},Jt(r)));m("rawHex").textContent=B.raw,m("rate").textContent=B.connected?B.reportsPerSecond+" reports per second":"Not connected"}m("btnLeds").addEventListener("click",()=>$e(ee("POST","/api/leds/test")));function Yp(){let t=m("calRows");if(!t.children.length)for(let e of B.calibration){let o=P("tr",{id:"cal-"+e.id},P("td",{},At(e.id).name));for(let r=0;r<6;r++)o.append(P("td",{class:"num"}));t.append(o)}for(let e of B.calibration){let o=m("cal-"+e.id).children,r=B.axes[e.id];o[1].textContent=r.raw,o[2].textContent=B.calibrating&&e.seenMin!==null?e.seenMin:e.min,o[3].textContent=B.calibrating?"at finish":At(e.id).bipolar?e.center:"\u2013",o[4].textContent=B.calibrating&&e.seenMax!==null?e.seenMax:e.max,o[5].textContent=(r.value>=0?"+":"")+r.value.toFixed(2),o[6].textContent=B.calibrating&&e.seenMin!==null&&e.seenMax-e.seenMin>=100?"\u2713 moved":""}m("btnCalStart").disabled=B.calibrating,m("btnCalFinish").disabled=!B.calibrating,m("btnCalCancel").disabled=!B.calibrating,m("btnCalFinish").setAttribute("appearance",B.calibrating?"primary":"secondary")}m("btnCalStart").addEventListener("click",()=>$e(ee("POST","/api/calibration/start")));m("btnCalFinish").addEventListener("click",async()=>{let t=await $e(ee("POST","/api/calibration/finish"));t&&Qt("Calibrated "+t.updated+" axes")});m("btnCalCancel").addEventListener("click",()=>$e(ee("POST","/api/calibration/cancel")));m("btnCalReset").addEventListener("click",async()=>{await zi("Reset all axis calibration to the defaults?")&&$e(ee("POST","/api/calibration/reset"),"Calibration reset")});var Li=!1;async function Jp(){let t=await ee("GET","/api/settings");Li=!0,m("swLed").checked=t.ledFeedback,m("slBright").value=String(t.ledBright),m("vBright").textContent=t.ledBright,m("slDim").value=String(t.ledDim),m("vDim").textContent=t.ledDim;let e=m("platformToggles");e.innerHTML="",t.toggles.length&&e.append(P("div",{class:"section-label"},"App"));for(let o of t.toggles)e.append(Kt(o.label,o.value,r=>$e(ee("PUT","/api/settings",{toggles:{[o.id]:r}}))));Li=!1}var Ri=()=>{Li||(m("vBright").textContent=m("slBright").value,m("vDim").textContent=m("slDim").value,$e(ee("PUT","/api/settings",{ledFeedback:!!m("swLed").checked,ledBright:+m("slBright").value,ledDim:+m("slDim").value})))};m("swLed").addEventListener("change",Ri);m("slBright").addEventListener("change",Ri);m("slDim").addEventListener("change",Ri);m("swOutput").addEventListener("change",()=>$e(ee("POST","/api/output",{enabled:!!m("swOutput").checked})));var Vd="";function kr(){let t=[];Oi>=3?t.push({intent:"error",title:"Lost connection to Steel Battalion Bridge.",text:j&&j.platform==="linux"?"Is the service running? systemctl --user status sbbridge":"Restart the app."}):B&&(Yt&&t.push({intent:"info",title:"Learning\u2026",text:"Press a button, flip a switch or push an axis on the controller.",cancel:!0}),B.connected?B.actions&&B.actions.length&&t.push({intent:"warning",title:"Action needed.",text:"",actions:B.actions}):t.push({intent:"warning",title:"Controller not connected.",text:B.usbStatus,actions:B.actions}),B.padOk||t.push({intent:"error",title:"Virtual Xbox controller unavailable.",text:B.padStatus,actions:B.connected?[]:null}),B.outputEnabled||t.push({intent:"info",title:"Output is off.",text:"Games won't receive input until you turn Output on."}));let e=JSON.stringify(t);if(e===Vd)return;Vd=e;let o=m("bars");o.innerHTML="";for(let r of t){let n=P("fluent-message-bar",{intent:r.intent,layout:"singleline"},P("b",{},r.title+" "),r.text||"");for(let i of r.actions||[]){let a=P("fluent-button",{slot:"actions",size:"small",appearance:i.primary?"primary":"secondary",title:i.description||""},i.label);a.addEventListener("click",async()=>{a.disabled=!0;let s=await $e(ee("POST","/api/action",{id:i.id}));s&&s.message&&Qt(s.message),a.disabled=!1}),n.append(a)}if(r.cancel){let i=P("fluent-button",{slot:"actions",size:"small"},"Cancel");i.addEventListener("click",()=>{Yt=null,kr()}),n.append(i)}o.append(n)}}function Di(t,e,o){return P("fluent-badge",{appearance:"tint",color:t?"success":e?"warning":"danger",shape:"rounded"},o)}var Wd="";function Qp(){let t=/^Virtual/.test(B.inputStatus||""),e=[B.connected,B.padOk,t].join();if(e!==Wd){Wd=e;let o=m("status");o.innerHTML="",o.append(Di(B.connected,!1,B.connected?"Controller connected":"No controller"),Di(B.padOk,!1,B.padOk?"Xbox controller active":"No virtual controller"),Di(t,!0,t?"Keys active":"Keys unavailable"))}document.activeElement!==m("swOutput")&&(m("swOutput").checked=B.outputEnabled);for(let o of m("bindRows").children){let r=o.dataset.control,n=At(r);o.classList.toggle("on",n.kind==="Axis"?B.axes[r]&&Math.abs(B.axes[r].value)>.25:B.down.includes(r))}}var Oi=0;async function Zd(){try{B=await ee("GET","/api/state"),Oi=0,Qp(),kr(),Up(),Ho==="live"&&Kp(),Ho==="calibration"&&Yp(),G&&B.profile!==G.name&&await Mt()}catch{++Oi===3&&kr()}setTimeout(Zd,document.hidden?1e3:Ho==="settings"?500:100)}(async()=>(j=await ee("GET","/api/meta"),m("version").textContent="Version "+j.version+" \xB7 "+(j.platform==="windows"?"Windows":"Linux"),m("serviceHint").textContent=j.serviceHint||"",qp(),await Mt(),await Jp(),Zd()))();})();
