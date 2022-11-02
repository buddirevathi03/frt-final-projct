"use strict";function _createForOfIteratorHelper(t,e){var n="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!n){if(Array.isArray(t)||(n=_unsupportedIterableToArray(t))||e&&t&&"number"==typeof t.length){n&&(t=n);var a=0,o=function(){};return{s:o,n:function(){return a>=t.length?{done:!0}:{done:!1,value:t[a++]}},e:function(t){throw t},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,r=!0,c=!1;return{s:function(){n=n.call(t)},n:function(){var t=n.next();return r=t.done,t},e:function(t){c=!0,i=t},f:function(){try{r||null==n.return||n.return()}finally{if(c)throw i}}}}function _unsupportedIterableToArray(t,e){if(t){if("string"==typeof t)return _arrayLikeToArray(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?_arrayLikeToArray(t,e):void 0}}function _arrayLikeToArray(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,a=new Array(e);n<e;n++)a[n]=t[n];return a}function ownKeys(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(t);e&&(a=a.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,a)}return n}function _objectSpread(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?ownKeys(Object(n),!0).forEach((function(e){_defineProperty(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):ownKeys(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}function _defineProperty(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}!function(){var t,e,n;if(window.HIKO=_objectSpread(_objectSpread({},window.HIKO),{},{extension:!0}),null===(t=window.HIKO)||void 0===t||!t.script){if("function"==typeof $&&"function"==typeof $.attr&&(null===(e=$.fn)||void 0===e?void 0:e.jquery)>="1.5")return o($);if("function"==typeof jQuery&&"function"==typeof jQuery.attr&&(null===(n=jQuery.fn)||void 0===n?void 0:n.jquery)>="1.5")return o(jQuery);a("https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js").then((function(){o($.noConflict(!0))}))}function a(t){return new Promise((function(e){var n=document.createElement("script");n.src=t.indexOf("http")>=0?t:"https://apps.hiko.link".concat(t),n.defer="defer",n.async="async",n.onload=function(){e()},document.head.appendChild(n)}))}function o(t){var e=/^(\/[a-zA-Z]{2,3}(-[a-zA-Z]{2})?)?\/challenge($|\?)/,n="hiko_socials",o="abw",i=function(){if(!(location.protocol.indexOf("http")<0||e.test(location.pathname))){var n="hiko-auth-embedded.js",a=t('script[src*="'.concat(n,'"]')),o=t("<a href=".concat(a.attr("src"),"/>"))[0],i=o.pathname.substring(0,o.pathname.indexOf(n)).split("/"),r=i.slice(0,i.length-1),c="".concat(o.protocol,"//").concat(o.hostname).concat(r.join("/"));return{shop:window.Shopify.shop,origin:"https://apps.hiko.link",instruction:p(location.href).ha,cdn:c}}}();if(null==i||!i.shop)return console.error("app loading fail");var r=i.shop,c=i.origin,s=i.instruction;i.cdn;if("undefined"!=typeof __st&&__st.cid)return function(){var t=f(o);t&&(u("POST","/apps/authapp/user",{id:t}),h(o));var e=f(n);if(null==e||!e.avatar)return;if(!e.avatar.profile&&!e.avatar.header)return;var a=f("hiko_"+__st.cid);a&&void 0!==a.avatar?T(a,e.avatar):u("POST","/apps/authapp/avatar",{id:__st.cid,social:e?e.click:""}).then((function(t){h("hiko_"+__st.cid,t),T(t,e.avatar)}))}();function d(){if(s){var e=f(n);e&&e.locale&&t("head").append(t('<style id="hikostyles"/>').append(document.createTextNode(e.css)));var a=JSON.parse(atob(s));"error"===a.name&&(a.data.message=decodeURIComponent(a.data.message)),j(a)}!function(e){var a=f(n);if(a&&a.locale===l()){return a.version>="202108041"&&e(a),u("POST","/apps/authapp/load",{version:a.version,locale:a.locale}).then((function(o){(o.html||o.error)&&(a&&a.click&&(o.click=a.click),h(n,o),t('div[name="hiko-container"][app]').remove(),e(o))}))}u("POST","/apps/authapp/load",{}).then((function(t){h(n,t),e(t)}))}(O)}function p(t){var e={};return t.replace(/[?&]+([^=&]+)=([^&]*)/gi,(function(t,n,a){return e[n]=a})),e}function l(){var e=t("html").attr("lang");return/^[A-Za-z]{2,4}([_-][A-Za-z]{4})?([_-]([A-Za-z]{2}|[0-9]{3}))?$/.test(e)?e:(console.warn("suspicious injection in html lang ".concat(e)),"")}function u(t,e,n){return new Promise((function(a,o){var i=new XMLHttpRequest,r=function(t){var e=[];for(var n in t)e.push("".concat(n,"=").concat(encodeURIComponent(t[n]||"")));return e.join("&")}(_objectSpread(_objectSpread({},n),{},{app:"auth-app",href:encodeURIComponent(location.href),script:"em",lang:l()}));"POST"===t?(i.open("POST","".concat(location.origin).concat(e),!0),i.setRequestHeader("Content-Type","application/x-www-form-urlencoded")):i.open("GET","".concat(c).concat(e,"?").concat(r)),i.onload=function(){return 200===i.status?a(JSON.parse(i.responseText)):o()},i.send(r)}))}function f(t){var e=sessionStorage.getItem(t);if(e)return JSON.parse(e)}function h(t,e){if(!t)return console.error("invalid storage set");if(e)if(e.error){var n=JSON.parse(JSON.stringify(e));delete n.error,sessionStorage.setItem(t,JSON.stringify(n))}else sessionStorage.setItem(t,JSON.stringify(e));else sessionStorage.removeItem(t)}function m(t){u("POST","/apps/authapp/onetap",_objectSpread(_objectSpread({},t),{},{href:encodeURIComponent(location.href),lang:l()})).then((function(t){t&&(t.token?(_(),w(t)):t.multipass?(_(),window.location.replace(t.multipass)):(_(),b(t)))}))}function v(t){"display"===(null==t?void 0:t.g)&&null!=t&&t.h&&u("POST","/apps/authapp/event",{name:"onetappop",path:location.pathname}).catch((function(t){return console.error(t.message)}))}function g(e,n){var o,i,r,c=(null===(o=e.onetap.position)||void 0===o?void 0:o.right)||20,s=(null===(i=e.onetap.position)||void 0===i?void 0:i.top)||20,d=(null===(r=e.onetap.position)||void 0===r?void 0:r.zIndex)||999,p="onetap".concat((new Date).getTime());window[p]=n;var l="momentCallback".concat((new Date).getTime());window[l]=v,t("body").append('<div id="g_id_onload"\n                data-client_id="'.concat(e.onetap.id,'"\n                data-prompt_parent_id="g_id_onload"\n                data-callback="').concat(p,'"\n                data-moment_callback="').concat(l,'"\n                style="position: absolute; right: ').concat(c,"px; top: ").concat(s,"px;  z-index: ").concat(d,';">\n                </div>')),a("https://accounts.google.com/gsi/client")}function y(e,n){var a,o,i,r="_".concat(Math.round(1e7*Math.random()).toString(36)),c=(null===(a=e.onetap.position)||void 0===a?void 0:a.right)||20,s=(null===(o=e.onetap.position)||void 0===o?void 0:o.top)||20;null===(i=e.onetap.position)||void 0===i||i.zIndex;t("body").append("\n            <style>\n              .".concat(r,"cz {position: fixed !important;  right: ").concat(c,"px; top: ").concat(s,"px;  z-index: 9999;}\n              .").concat(r,"z { border: none;}\n              @media screen and (max-width: 480px) { .").concat(r,"z { position: fixed; bottom: 0px; left: 0px; z-index: 2147483647; width: 100%; height: 239px;  border: none; } }\n            </style>\n            "));var d=t('<div style="display: none;" class="'.concat(r,'cz"/>')),p=t('<iframe class="'.concat(r,'z" src="https://cdn.shopify.com/s/files/1/0279/9478/3882/t/5/assets/hiko-tap.html?v=').concat((new Date).getTime(),"&client=").concat(e.onetap.id,'"></iframe>'));t("body").append(d.append(p)),window.addEventListener("message",(function(t){"size"===t.data.type?(p.css("width",t.data.width+"px"),p.css("height",t.data.height+"px")):"notification"===t.data.type?"display"===t.data.notification.g?!0===t.data.notification.h?(d.css("display","block"),u("POST","/apps/authapp/event",{name:"onetappop",path:location.pathname}).catch((function(t){return console.error(t.message)}))):(console.error(t.data.notification.j),d.remove()):"display"!==t.data.notification.g&&(d.remove(),"user_cancel"===t.data.notification.l&&function(t,e){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1,a=new Date;a.setTime(a.getTime()+24*n*60*60*1e3);var o="; expires="+a.toGMTString();document.cookie=t+"="+e+o+"; path=/"}("onet",t.data.notification.l)):"credential"===t.data.type&&n(t.data.token)}))}function b(t){k(t.contextpath,{"customer[email]":t.email,"customer[password]":t.password})}function w(t){k(t.contextpath,{"customer[password]":t.password,"customer[password_confirmation]":t.password,token:t.token,utf8:"✓",id:t.id})}function k(e,n){var a=t('<form method="post" action="'.concat(e,'" style="display: none;"/>'));for(var o in n)n[o]&&a.append('<input name="'.concat(o,'" value="').concat(n[o],'"/>'));t("body").append(a),a.submit()}function _(){t(".hiko-spinner").css("display","block")}function O(e){var n,a,i,r=function(e){var n,a=t('div[name="hiko-container"]'),o=!1,i=!1;if(a.length){if(a.each((function(e,n){void 0===t(n).attr("app")&&(o=!0),void 0!==t(n).attr("ignore")&&(i=!0)})),i)return a.find("div[data]").each((function(e,n){t(n).off("click").on("click",(function(){return x({button:n})}))})),t("head").append(t('<style id="hikoimages"/>').append(document.createTextNode(e.images))),t();if(o)return a}var r=t('form[action*="/account"]'),c=(null===(n=location)||void 0===n?void 0:n.href.indexOf("?checkout_url"))>=0&&r.length>1,s=[];return r.each((function(n,a){if(!(t(a).find('div[name="hiko-container"]').length>0||a.action.indexOf("/account/recover")>=0)){var o=a.action.indexOf("/account/login")>=0?t('<div name="hiko-container" type="login" app/>'):t('<div name="hiko-container" type="register" app/>');"top"===e.position?t(a).prepend(o):t(a).append(o),(!c||c&&0===s.length)&&s.push(o)}})),t(s)}(e);return r.length>0&&(t("#hikostyles").remove(),t("head").append(t('<style id="hikostyles"/>').append(document.createTextNode(e.css))),t("head").append(t('<style id="hikoimages"/>').append(document.createTextNode(e.images))),r.each((function(n,a){t(a).empty();var o=t(a).attr("type")||"login";t(a).append(e.html[o]);var i=t(a).find(".".concat(e.classes.consent));t(a).find(".".concat(e.classes.buttons," > div")).each((function(n,o){t(o).off("click").on("click",(function(){return x({button:o,consent:i,classes:e.classes,marketing:e.marketing,container:t(a)})}))}))}))),n={marketing:e.marketing},a=n.marketing,(i=t('form[action*="/account"]')).length&&i.on("submit",(function(){var e=i.find('input[name="customer[password]"]').val(),n=i.find('input[name="customer[email]"]').val(),r=encodeURIComponent(Math.random().toString(36).substr(5)),c={id:r,email:n};if(a){var s=t('input[name="'.concat(a,'"][type="checkbox"]'));s.length&&(c.mkt=s[0].checked)}if(h(o,r),n&&e&&r)return u("POST","/apps/authapp/user",c)})),e}function x(e){var a,o,i=e.button,s=e.consent,d=e.classes,p=e.marketing,u=e.container,m=t(i).attr("data"),v=t(s).find("input");if(v.length){if(!1===v[0].checked)return t(s).attr("class",d.consent+" "+d.disagree);t(s).attr("class",d.consent)}var g={google:{width:450,height:680},facebook:{width:520,height:600},spotify:{width:520,height:470},twitter:{width:700,height:800},linkedin:{width:480,height:580},amazon:{width:420,height:630},line:{width:400,height:730},snapchat:{width:400,height:730},kakao:{width:400,height:680},tumblr:{width:330,height:400},twitch:{width:400,height:370},discord:{width:500,height:730},reddit:{width:860,height:620},vk:{width:680,height:450},tiktok:{width:400,height:620}},y=(null===(a=g[m])||void 0===a?void 0:a.width)||400,b=(null===(o=g[m])||void 0===o?void 0:o.height)||580,w=f(n)||{};h(n,_objectSpread(_objectSpread({},w),{},{click:m}));var _=l(),O=function(){if(p){var e=t('input[name="'.concat(p,'"][type="checkbox"]'));if(e.length)return""+e[0].checked}return""}(),x=encodeURIComponent(location.href),j=(new Date).getTime(),T=(null==u?void 0:u.attr("register_tag"))||"";try{window.addEventListener("message",S,!1),window.open("".concat(c,"/js/login.html?social=").concat(m,"&shop=").concat(r,"&href=").concat(x,"&lang=").concat(_,"&mkt=").concat(O,"&register_tag=").concat(T,"&ts=").concat(j),"Login social","toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=".concat(y,", height=").concat(b))}catch(t){k("".concat(c,"/admin/auth"),{social:m,shop:r,href:x,lang:_})}}function S(t){t.origin===c&&j(t.data)}function j(e){"login"===e.name?(_(),b(e.data)):"multipass"===e.name?(_(),window.location.replace(e.data.multipass)):"activate"===e.name?(_(),w(e.data)):"error"===e.name&&function(e){var n=e.code,a=e.type,o=e.email,i=e.message;if(o&&541===n){var r=t('input[name="customer[email]"]');r.length&&r.each((function(e,n){return t(n).val(o)}))}t('div[name="hiko-err"]').each((function(e,n){var o=t(n);o.empty();var r=t("<div/>");o.append(r),"error"===a?(r.attr("class","form-message form-message--error errors"),r.append('<i class="fas fa-exclamation-circle"/>')):"warning"===a?(r.attr("class","form-message form-message--success"),r.append('<i class="fas fa-exclamation"/>')):(r.attr("class","form-message form-message--success"),r.append('<i class="fas fa-check-circle"/>')),r.append(document.createTextNode(" "+i))}))}(e.data)}function T(e,n){if(null!=e&&e.avatar){var a=function(t){var e=t.first_name,n=t.last_name;if(!e&&!n)return"";if(e&&n)return"".concat(e," ").concat(n);if(e)return e;if(n)return n}(e),o=t('[name="hiko-avatar"]');if(o.length)o.each((function(n,o){if(e.avatar){var i=t(o).prop("tagName");if("IMG"===i)t(o).attr("src",e.avatar),t(o).attr("title",a);else if("A"===i){var r=t(o).find("img");r.length?(t(r).attr("src",e.avatar),t(r).attr("title",a)):t(o).append('<img src="'.concat(e.avatar,'" title="').concat(a,'"/>'))}t(o).css("display","block")}}));else if(/^(\/[a-zA-Z]{2,3}(-[a-zA-Z]{2})?)?\/account($|\?)/.test(location.pathname)){if(null==n||!n.profile)return;var i=t("a[href*='/account/addresses']");if(i.length){var r='<img src="'.concat(e.avatar,'" title="').concat(a,'" alt="').concat(a,'" style="border-radius: 20%;width: 64px;height: 64px;margin-top: 10px"/>');n.profile_link&&(r='<a href="'.concat(n.profile_link,'">').concat(r,"</a>")),t(i[0]).parent().after(r),t(r).after("<p><bold>".concat(a,"</bold></p>"))}}else{if(null==n||!n.header)return;var c=t("a[href*='/account']").filter((function(t,e){return e.href&&e.href.match(/.*\/account$/)}));if(c.length){var s='<img src="'.concat(e.avatar,'" class="icon" title="').concat(a,'" alt="').concat(a,'" style="border-radius: 20%;width: 24px;height: 24px"/>');n.header_link&&(s='<a href="'.concat(n.header_link,'">').concat(s,"</a>")),c.each((function(e,n){if(t(n).parents("header").length){var a=t.clone(n);t(a).empty(),t(a).append(s),t(n).after(a)}}))}}}}(t('div[name="hiko-container"]').length||t('form[action*="/account"]').length||s)&&d(),function(){try{var e=new MutationObserver((function(e){t(e).each((function(e,a){"attributes"===a.type&&"lang"===a.attributeName&&(h(n),d()),"childList"===a.type&&a.addedNodes.length>0&&t(a.addedNodes).each((function(e,n){if(n.nodeType===Node.ELEMENT_NODE){if(t(n).find('form[action*="/account"]').length&&d(),"FORM"===n.nodeName){var a,o=_createForOfIteratorHelper(n.attributes);try{for(o.s();!(a=o.n()).done;){var i=a.value;"action"===i.name&&i.value.indexOf("/account")>=0&&d()}}catch(t){o.e(t)}finally{o.f()}}t(n).find('div[name="hiko-container"]').each((function(e,n){void 0===t(n).attr("app")&&d()}))}}))}))}));t("html")[0]&&e.observe(t("html")[0],{attributes:!0,attributeFilter:["lang"]}),t("body")[0]&&e.observe(t("body")[0],{childList:!0,subtree:!0})}catch(t){console.error(t.message)}}(),new Promise((function(t,e){var a=f(n);a?t(a):u("POST","/apps/authapp/load",{}).then((function(e){h(n,e),t(e)})).catch((function(t){console.error(t.message),e()}))})).then((function(t){var e;if("undefined"!=typeof __st&&__st.cid)return;if(/.*\/account/.test(location.pathname))return;if(/(iPod|iPhone|iPad)/.test(navigator.userAgent)||/Safari/.test(navigator.userAgent)&&!/Chrome/.test(navigator.userAgent))return void console.warn("one tap not supported");if(function(t){for(var e=t+"=",n=document.cookie.split(";"),a=0;a<n.length;a++){for(var o=n[a];" "==o.charAt(0);)o=o.substring(1,o.length);if(0==o.indexOf(e))return o.substring(e.length,o.length)}return null}("onet"))return void console.warn("one tap supressed");if(null===(e=t.onetap)||void 0===e||!e.enable)return;var n=t.onetap.custom?g:y;t.onetap.delay?isNaN(t.onetap.delay)||setTimeout((function(){n(t,m)}),1e3*t.onetap.delay):n(t,m)}))}}();