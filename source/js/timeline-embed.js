/*!
	Verite Timeline Loader 0.1
	Designed and built by Zach Wise digitalartwork.net
	Date: March 30, 2012

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    http://www.gnu.org/licenses/

*/  

/* 	CodeKit Import
	http://incident57.com/codekit/
================================================== */
// @codekit-prepend "Embed.LoadLib.js";


/* TIMELINE CDN LOADER
================================================== */

/* Embed code with config
================================================== */
/*
<!-- Begin Embed Code -->
<div id="timeline-embed"></div>
<script type="text/javascript">
    var timeline_config = {
		width: 900,
		height: 700,
		source: 'https://docs.google.com/a/digitalartwork.net/spreadsheet/ccc?hl=en_US&key=0Agl_Dv6iEbDadGRwZjJSRTR4RHJpanE2U3lkb0lyYUE&rm=full#gid=0',
		css: '../timeline.css',
		js: '../timeline.js'
	}
</script>
<script type="text/javascript" src="../timeline-embed.js"></script>
<!-- End Embed Code -->
*/

  


(function() {
	
	/* CONFIG Default
	================================================== */
	var embed_config = {
		width: 800,
		height: 600,
		source: 'taylor/data.json',
		font: 'default',
		css: 'http://veritetimeline.appspot.com/latest/timeline.css',
		js: 'http://veritetimeline.appspot.com/latest/timeline-min.js'
	}
	
	if (typeof timeline_config == 'object') {
	    var x;
		for (x in timeline_config) {
			if (Object.prototype.hasOwnProperty.call(timeline_config, x)) {
				embed_config[x] = timeline_config[x];
			}
		}
	} else if (typeof config == 'object') {
		var x;
		for (x in config) {
			if (Object.prototype.hasOwnProperty.call(config, x)) {
				embed_config[x] = config[x];
			}
		}
	}
	
	timeline_config = embed_config;
	
	/* VARS
	================================================== */
	var jsReady = false;
	var cssReady = false;
	var fontCSSReady = false;
	var fontJSReady = false;
	var font_css_url = "http://veritetimeline.appspot.com/latest/font/"
	var font_js_url = "http://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js";
	var isReady = false;
	var preload_checks = 0;
	var timeout;
	var timeline;
	
	/* Add Timeline Div
	================================================== */
	var t = document.createElement('div');
	var te = document.getElementById("timeline-embed");
	te.appendChild(t);
	t.setAttribute("id", 'timeline');
	
	if (embed_config.width.toString().match("%") || embed_config.width.toString().match("px")) {
		te.style.width = embed_config.width;
	} else {
		te.style.width = embed_config.width + 'px';
	}
	
	if (embed_config.height.toString().match("%") || embed_config.height.toString().match("px")) {
		te.style.height = embed_config.height;
	} else {
		te.style.height = embed_config.height + 'px';
	}
	
	t.style.position = 'relative';
	
	/* Load CSS
	================================================== */
	LazyLoad.css(embed_config.css, cssComplete);
	
	
	/* Load Font 
	================================================== */
	
	if (embed_config.font != "default") {
		
		fontJSReady = true;
		fontCSSReady = true;
		
	} else {
		
		/* Load Font CSS
		================================================== */

		if (embed_config.font.match("http://")) {
			font_css_url = embed_config.font;
		} else {
			font_css_url = font_css_url + embed_config.font + ".css";
		}

		LazyLoad.css(font_css_url, fontCSSComplete);
		
		/* Load Font JS
		================================================== */
		
		WebFontConfig = {
			google: { families: [ 'News+Cycle:400,700:latin', 'Merriweather:400,700,900:latin' ] }
		};
		
		LazyLoad.js(font_js_url, onFontJSLoaded);
		
	}
	
	
	
	/* Check for jQuery
	================================================== */
	try {
	    var jqueryLoaded=jQuery;
	    jqueryLoaded=true;
	} catch(err) {
	    var jqueryLoaded=false;
	}
	
	/* Load jQuery if it doesn't exist
	================================================== */
	if (!jqueryLoaded) {
		LazyLoad.js('http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js', onJQueryLoaded);
	} else {
		onJQueryLoaded();
	}
	
	
	function onJQueryLoaded() {
		LazyLoad.js(embed_config.js, onJSLoaded);
	}
	
	function onJSLoaded() {
		jsReady = true;
		checkLoad();
	}
	
	function cssComplete() {
		cssReady = true;
		checkLoad();
	}
	
	function fontCSSComplete() {
		fontCSSReady = true;
		checkLoad();
	}
	
	function onFontJSLoaded() {
		fontJSReady = true;
		checkLoad();
	}
	
	/* Check to see if everything is loaded.
	================================================== */
	function checkLoad() {
		if (preload_checks > 40) {
			return;
			alert("Error Loading Files");
		} else {
			preload_checks++;
			
			if (jsReady && cssReady && fontCSSReady && fontJSReady) {
				if (!isReady) {
					isReady = true;
					timeline = new VMM.Timeline();
					timeline.init(embed_config.source);
				}
			} else {
				//alert("run timeout");
				timeout = setTimeout('checkAgain();', 250);
			}
		}
	}

	this.checkAgain = function() {
		checkLoad();
	}
	
	
	
})();