function Audience(){if("undefined"===typeof window.data_2991){window.data_2991=[];if("undefined"!==typeof rtgsettings){window.data_2991.push(rtgsettings)}else{if("undefined"!==typeof window.data_0001){window.data_2991=window.data_0001}}}if("undefined"===typeof window.data_2991){return}else{if(window.data_2991.length===0){window.data_2991.push({pagetype:"generic"})}}CUDV();var l="";var q="Karagiri_IN";var k="IND";var e="poo_kag_in";var b="2991";var d="62920";var r="";null!==window.data_2991[0].token&&"undefined"!==window.data_2991[0].token&&Object!==window.data_2991[0].token&&undefined!==window.data_2991[0].token&&""!==window.data_2991[0].token&&(q=window.data_2991[0].token);r=null!==window.data_2991[0].pdt_url&&"undefined"!==window.data_2991[0].pdt_url&&Object!==window.data_2991[0].pdt_url&&undefined!==window.data_2991[0].pdt_url&&""!==window.data_2991[0].pdt_url&&!window.data_2991[0].pdt_url.toString().includes("$")?encodeURIComponent(window.data_2991[0].pdt_url):encodeURIComponent(window.location.href);var m=window.data_2991[0].OrderId;if(urlcheck(m,"OrderId")){m=""}if(lengthcheck(m)>200){m=m.toString().substring(0,200)}var a=window.data_2991[0].Amount;if(urlcheck(a,"Amount")){a=""}if(lengthcheck(a)>200){a=a.toString().substring(0,200)}var g=window.data_2991[0].CustomerType;if(urlcheck(g,"CustomerType")){g=""}if(lengthcheck(g)>200){g=g.toString().substring(0,200)}var p=window.data_2991[0].ProductId;if(urlcheck(p,"ProductId")){p=""}if(lengthcheck(p)>200){p=p.toString().substring(0,200)}var n=window.data_2991[0].PageType;n=PageTypeModBasic("www.karagiri.com","collections","products","/cart","/checkout",n,r);var o=window.data_2991[0].ProductCategoryList;if(urlcheck(o,"ProductCategoryList")){o=""}if(lengthcheck(o)>200){o=o.toString().substring(0,200)}var c=window.data_2991[0].Browsercheck;c=checkBrowser();var h=window.data_2991[0].gdpr;if(urlcheck(h,"gdpr")){h=""}if(lengthcheck(h)>200){h=h.toString().substring(0,200)}var i=window.data_2991[0].gdpr_consent;if(urlcheck(i,"gdpr_consent")){i=""}if(lengthcheck(i)>200){i=i.toString().substring(0,200)}var j=window.data_2991[0].gdpr_pd;if(urlcheck(j,"gdpr_pd")){j=""}if(lengthcheck(j)>200){j=j.toString().substring(0,200)}var s=window.data_2991[0].us_privacy;if(urlcheck(s,"us_privacy")){s=""}if(lengthcheck(s)>200){s=s.toString().substring(0,200)}var f=window.data_2991[0].CouponCode;if(urlcheck(f,"CouponCode")){f=""}if(lengthcheck(f)>200){f=f.toString().substring(0,200)}l="&ProgramName="+q+"&AudienceId="+b+"&CampaignId="+d+"&Referrer="+r+"&OrderId="+m+"&Amount="+a+"&CustomerType="+g+"&ProductId="+p+"&PageType="+n+"&ProductCategoryList="+o+"&Browsercheck="+c+"&gdpr="+h+"&gdpr_consent="+i+"&gdpr_pd="+j+"&us_privacy="+s+"&CouponCode="+f;l=l.replace(/[^=&]+=(&|$)/g,"").replace(/&$/,"");if((n!=undefined)&&(n!="")&&(c=="true")){CIF("CIF26370","https://cm.g.doubleclick.net/pixel?google_nid=preciso_srl&google_ula=6490516189&google_cm&cok15="+e+"&cnty15="+k+""+l)}if((n=="home")||(n=="category")||(n=="product")){CAU("CAU26372","https://clk.2trk.info/audit.aspx?token=Karagiri_IN&pagetype="+n+"&ref="+r,q,n)}if((n=="checkout")){CIG("CIG26375","https://rtgcloudsql.2trk.info/salestrack?mainadurl=id="+e+"::oid="+m+"::amt="+a+"::cus="+g+"::cuscoupon="+f+"::cok=1::campaignId=62920")}if((n=="product")||(n=="basket")){CIF("CIF26602","https://my.rtmarks.net/f.php?f=sync&lr=1&partners=389x46c555d482fcf532dd6e266ca1fbcff2bbaae5528931d78ef71bcde52adc")}}function CDV(a){var b=document.getElementById("m20D");b.appendChild(a)}function CIG(a,c){var b=document.createElement("img");b.id=a,b.width=1,b.height=1,b.src=c,CDV(b)}function CST(a,c){var b=document.createElement("script");b.id=a,b.type="text/javascript",b.src=c,CDV(b)}function CAU(a,e,d,b){if(chk(d.trim().toLowerCase(),b)){var c=document.createElement("script");c.id=a,c.type="text/javascript",c.src=e,CDV(c)}}function CIF(a,c){var b=document.createElement("iframe");b.id=a,b.marginWidth=0,b.marginHeight=0,b.frameBorder=0,b.scrolling="no",b.allowTransparency=!0,b.width=0,b.height=0,b.style.position="absolute",b.style.bottom="0px",b.style.overflowX="hidden",b.style.overflowY="hidden",b.style.width="0px",b.style.height="0px",b.style.display="none",b.src=c,CDV(b)}function FDV(a){document.body.appendChild(a)}function CUDV(){var a=document.createElement("div");a.id="m20D",a.style.display="none",FDV(a)}function urlcheck(b,c){var a=true;if(b!=undefined&&(b.toString().toLowerCase().indexOf("undefined")<0)&&(c!=undefined||!isNaN(c))){a=b.toString().includes(c)}else{a=true}return a}function lengthcheck(b){var a=b.toString().length;return a}function diff_hours(a,c){try{var b=(a.getTime()-c.getTime())/1000;return b/=3600,Math.abs(Math.round(b))}catch(a){return 6}}function chkses(a){return"undefined"===typeof Storage||!sessionStorage.getItem(a)}function chk(a,b){var c=!1;return("undefined"==typeof Storage||!localStorage.getItem(a)||5<diff_hours(new Date,new Date(localStorage.getItem(a))))&&(c=!0),!!c&&chkses(a+"-"+b)}function checkBrowser(){var a="true";if((navigator.userAgent.toLowerCase().indexOf("safari")>-1)&&(navigator.userAgent.toLowerCase().indexOf("chrome")<0)){a="false"}else{if(navigator.userAgent.toLowerCase().indexOf("firefox")>-1){a="false"}else{if(navigator.userAgent.toLowerCase().indexOf("iphone")>-1){a="false"}else{if(navigator.userAgent.toLowerCase().indexOf("mac os")>-1){a="false"}else{if(navigator.userAgent.toLowerCase().indexOf("facebook")>-1){a="false"}else{if(navigator.userAgent.toLowerCase().indexOf("googlebot")>-1){a="false"}}}}}}return a}function PageTypeModBasic(d,b,g,a,c,f,j){var h=j;var e=0;while(!h.toLowerCase().includes("://")&&e<5){h=decodeURIComponent(h);e++}if(h.includes(c)&&!h.includes(a)){f="checkout";return f}else{if(h.includes(a)&&!h.includes(c)){f="basket";return f}else{if(h.includes(g)){f="product";return f}else{if(h.includes(b)){f="category";return f}else{if(h.split("/")[2]===d){f="home";return f}else{f="generic";return f}}}}}}Audience();