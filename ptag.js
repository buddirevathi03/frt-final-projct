function p(e) {
    return void 0 !== e && "" !== e ? e.substring(e.indexOf("?") + 1, e.length) + ".js" : "0.js"
}

function d() {
    return p(document.currentScript.src)
}! function(e, t) {
	var botflag=/bot|googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot|facebot|ia_archiver|crawler|spider|robot|crawling/i.test(navigator.userAgent);
	if(!botflag)
	{
		var scrpath=document.currentScript.src;
		if(scrpath==null || "undefined"==typeof scrpath)
		{
			scrpath=document.getElementById("DLFNPMMP1").getAttribute('src');
		}
		var path = "https://" + scrpath.split("/")[2] + "/aud/clientjs/" + t + "?";
		var dupl = "false";
		var pixEle = document.getElementById("DLFNPM101");
		if (pixEle) {
			if (pixEle.src == path) {
				dupl = "true";
			}
		}
		if (dupl == "false" && path.indexOf("undefined") == -1 && path.indexOf(".js.js") == -1 && t!="0.js" && t!=".js") {
			var n = "https://" + scrpath.split("/")[2] + "/aud/clientjs/" + t + "?",
            r = e.createElement("script");
			r.async = !0, r.id = "DLFNPM101", r.type = "text/javascript", r.src = n;
			var c = e.getElementsByTagName("script")[0];
			c.parentNode.insertBefore(r, c)
		}
	}
}(document, d());