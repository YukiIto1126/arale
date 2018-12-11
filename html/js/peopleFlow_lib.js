//ヒートマップ
(function(a,b,c){if(typeof module!=="undefined"&&module.exports){module.exports=c()}else if(typeof define==="function"&&define.amd){define(c)}else{b[a]=c()}})("h337",this,function(){var a={defaultRadius:40,defaultRenderer:"canvas2d",defaultGradient:{.25:"rgb(0,0,255)",.55:"rgb(0,255,0)",.85:"yellow",1:"rgb(255,0,0)"},defaultMaxOpacity:1,defaultMinOpacity:0,defaultBlur:.85,defaultXField:"x",defaultYField:"y",defaultValueField:"value",plugins:{}};var b=function h(){var b=function d(a){this._coordinator={};this._data=[];this._radi=[];this._min=10;this._max=1;this._xField=a["xField"]||a.defaultXField;this._yField=a["yField"]||a.defaultYField;this._valueField=a["valueField"]||a.defaultValueField;if(a["radius"]){this._cfgRadius=a["radius"]}};var c=a.defaultRadius;b.prototype={_organiseData:function(a,b){var d=a[this._xField];var e=a[this._yField];var f=this._radi;var g=this._data;var h=this._max;var i=this._min;var j=a[this._valueField]||1;var k=a.radius||this._cfgRadius||c;if(!g[d]){g[d]=[];f[d]=[]}if(!g[d][e]){g[d][e]=j;f[d][e]=k}else{g[d][e]+=j}var l=g[d][e];if(l>h){if(!b){this._max=l}else{this.setDataMax(l)}return false}else if(l<i){if(!b){this._min=l}else{this.setDataMin(l)}return false}else{return{x:d,y:e,value:j,radius:k,min:i,max:h}}},_unOrganizeData:function(){var a=[];var b=this._data;var c=this._radi;for(var d in b){for(var e in b[d]){a.push({x:d,y:e,radius:c[d][e],value:b[d][e]})}}return{min:this._min,max:this._max,data:a}},_onExtremaChange:function(){this._coordinator.emit("extremachange",{min:this._min,max:this._max})},addData:function(){if(arguments[0].length>0){var a=arguments[0];var b=a.length;while(b--){this.addData.call(this,a[b])}}else{var c=this._organiseData(arguments[0],true);if(c){if(this._data.length===0){this._min=this._max=c.value}this._coordinator.emit("renderpartial",{min:this._min,max:this._max,data:[c]})}}return this},setData:function(a){var b=a.data;var c=b.length;this._data=[];this._radi=[];for(var d=0;d<c;d++){this._organiseData(b[d],false)}this._max=a.max;this._min=a.min||0;this._onExtremaChange();this._coordinator.emit("renderall",this._getInternalData());return this},removeData:function(){},setDataMax:function(a){this._max=a;this._onExtremaChange();this._coordinator.emit("renderall",this._getInternalData());return this},setDataMin:function(a){this._min=a;this._onExtremaChange();this._coordinator.emit("renderall",this._getInternalData());return this},setCoordinator:function(a){this._coordinator=a},_getInternalData:function(){return{max:this._max,min:this._min,data:this._data,radi:this._radi}},getData:function(){return this._unOrganizeData()}};return b}();var c=function i(){var a=function(a){var b=a.gradient||a.defaultGradient;var c=document.createElement("canvas");var d=c.getContext("2d");c.width=256;c.height=1;var e=d.createLinearGradient(0,0,256,1);for(var f in b){e.addColorStop(f,b[f])}d.fillStyle=e;d.fillRect(0,0,256,1);return d.getImageData(0,0,256,1).data};var b=function(a,b){var c=document.createElement("canvas");var d=c.getContext("2d");var e=a;var f=a;c.width=c.height=a*2;if(b==1){d.beginPath();d.arc(e,f,a,0,2*Math.PI,false);d.fillStyle="rgba(0,0,0,1)";d.fill()}else{var g=d.createRadialGradient(e,f,a*b,e,f,a);g.addColorStop(0,"rgba(0,0,0,1)");g.addColorStop(1,"rgba(0,0,0,0)");d.fillStyle=g;d.fillRect(0,0,2*a,2*a)}return c};var c=function(a){var b=[];var c=a.min;var d=a.max;var e=a.radi;var a=a.data;var f=Object.keys(a);var g=f.length;while(g--){var h=f[g];var i=Object.keys(a[h]);var j=i.length;while(j--){var k=i[j];var l=a[h][k];var m=e[h][k];b.push({x:h,y:k,value:l,radius:m})}}return{min:c,max:d,data:b}};function d(b){var c=b.container;var d=this.shadowCanvas=document.createElement("canvas");var e=this.canvas=b.canvas||document.createElement("canvas");var f=this._renderBoundaries=[1e4,1e4,0,0];var g=getComputedStyle(b.container)||{};e.className="heatmap-canvas";this._width=e.width=d.width=b.width||+g.width.replace(/px/,"");this._height=e.height=d.height=b.height||+g.height.replace(/px/,"");this.shadowCtx=d.getContext("2d");this.ctx=e.getContext("2d");e.style.cssText=d.style.cssText="position:absolute;left:0;top:0;";c.style.position="relative";c.appendChild(e);this._palette=a(b);this._templates={};this._setStyles(b)}d.prototype={renderPartial:function(a){if(a.data.length>0){this._drawAlpha(a);this._colorize()}},renderAll:function(a){this._clear();if(a.data.length>0){this._drawAlpha(c(a));this._colorize()}},_updateGradient:function(b){this._palette=a(b)},updateConfig:function(a){if(a["gradient"]){this._updateGradient(a)}this._setStyles(a)},setDimensions:function(a,b){this._width=a;this._height=b;this.canvas.width=this.shadowCanvas.width=a;this.canvas.height=this.shadowCanvas.height=b},_clear:function(){this.shadowCtx.clearRect(0,0,this._width,this._height);this.ctx.clearRect(0,0,this._width,this._height)},_setStyles:function(a){this._blur=a.blur==0?0:a.blur||a.defaultBlur;if(a.backgroundColor){this.canvas.style.backgroundColor=a.backgroundColor}this._width=this.canvas.width=this.shadowCanvas.width=a.width||this._width;this._height=this.canvas.height=this.shadowCanvas.height=a.height||this._height;this._opacity=(a.opacity||0)*255;this._maxOpacity=(a.maxOpacity||a.defaultMaxOpacity)*255;this._minOpacity=(a.minOpacity||a.defaultMinOpacity)*255;this._useGradientOpacity=!!a.useGradientOpacity},_drawAlpha:function(a){var c=this._min=a.min;var d=this._max=a.max;var a=a.data||[];var e=a.length;var f=1-this._blur;while(e--){var g=a[e];var h=g.x;var i=g.y;var j=g.radius;var k=Math.min(g.value,d);var l=h-j;var m=i-j;var n=this.shadowCtx;var o;if(!this._templates[j]){this._templates[j]=o=b(j,f)}else{o=this._templates[j]}var p=(k-c)/(d-c);n.globalAlpha=p<.01?.01:p;n.drawImage(o,l,m);if(l<this._renderBoundaries[0]){this._renderBoundaries[0]=l}if(m<this._renderBoundaries[1]){this._renderBoundaries[1]=m}if(l+2*j>this._renderBoundaries[2]){this._renderBoundaries[2]=l+2*j}if(m+2*j>this._renderBoundaries[3]){this._renderBoundaries[3]=m+2*j}}},_colorize:function(){var a=this._renderBoundaries[0];var b=this._renderBoundaries[1];var c=this._renderBoundaries[2]-a;var d=this._renderBoundaries[3]-b;var e=this._width;var f=this._height;var g=this._opacity;var h=this._maxOpacity;var i=this._minOpacity;var j=this._useGradientOpacity;if(a<0){a=0}if(b<0){b=0}if(a+c>e){c=e-a}if(b+d>f){d=f-b}var k=this.shadowCtx.getImageData(a,b,c,d);var l=k.data;var m=l.length;var n=this._palette;for(var o=3;o<m;o+=4){var p=l[o];var q=p*4;if(!q){continue}var r;if(g>0){r=g}else{if(p<h){if(p<i){r=i}else{r=p}}else{r=h}}l[o-3]=n[q];l[o-2]=n[q+1];l[o-1]=n[q+2];l[o]=j?n[q+3]:r}k.data=l;this.ctx.putImageData(k,a,b);this._renderBoundaries=[1e3,1e3,0,0]},getValueAt:function(a){var b;var c=this.shadowCtx;var d=c.getImageData(a.x,a.y,1,1);var e=d.data[3];var f=this._max;var g=this._min;b=Math.abs(f-g)*(e/255)>>0;return b},getDataURL:function(){return this.canvas.toDataURL()}};return d}();var d=function j(){var b=false;if(a["defaultRenderer"]==="canvas2d"){b=c}return b}();var e={merge:function(){var a={};var b=arguments.length;for(var c=0;c<b;c++){var d=arguments[c];for(var e in d){a[e]=d[e]}}return a}};var f=function k(){var c=function h(){function a(){this.cStore={}}a.prototype={on:function(a,b,c){var d=this.cStore;if(!d[a]){d[a]=[]}d[a].push(function(a){return b.call(c,a)})},emit:function(a,b){var c=this.cStore;if(c[a]){var d=c[a].length;for(var e=0;e<d;e++){var f=c[a][e];f(b)}}}};return a}();var f=function(a){var b=a._renderer;var c=a._coordinator;var d=a._store;c.on("renderpartial",b.renderPartial,b);c.on("renderall",b.renderAll,b);c.on("extremachange",function(b){a._config.onExtremaChange&&a._config.onExtremaChange({min:b.min,max:b.max,gradient:a._config["gradient"]||a._config["defaultGradient"]})});d.setCoordinator(c)};function g(){var g=this._config=e.merge(a,arguments[0]||{});this._coordinator=new c;if(g["plugin"]){var h=g["plugin"];if(!a.plugins[h]){throw new Error("Plugin '"+h+"' not found. Maybe it was not registered.")}else{var i=a.plugins[h];this._renderer=new i.renderer(g);this._store=new i.store(g)}}else{this._renderer=new d(g);this._store=new b(g)}f(this)}g.prototype={addData:function(){this._store.addData.apply(this._store,arguments);return this},removeData:function(){this._store.removeData&&this._store.removeData.apply(this._store,arguments);return this},setData:function(){this._store.setData.apply(this._store,arguments);return this},setDataMax:function(){this._store.setDataMax.apply(this._store,arguments);return this},setDataMin:function(){this._store.setDataMin.apply(this._store,arguments);return this},configure:function(a){this._config=e.merge(this._config,a);this._renderer.updateConfig(this._config);this._coordinator.emit("renderall",this._store._getInternalData());return this},repaint:function(){this._coordinator.emit("renderall",this._store._getInternalData());return this},getData:function(){return this._store.getData()},getDataURL:function(){return this._renderer.getDataURL()},getValueAt:function(a){if(this._store.getValueAt){return this._store.getValueAt(a)}else if(this._renderer.getValueAt){return this._renderer.getValueAt(a)}else{return null}}};return g}();var g={create:function(a){return new f(a)},register:function(b,c){a.plugins[b]=c}};return g});

var HumanFlow = {};
HumanFlow.data;
HumanFlow.finished = false;
HumanFlow.main = function(){
    var requestAnimationFrame = window.requestAnimationFrame ||window.mozRequestAnimationFrame ||window.webkitRequestAnimationFrame ||window.msRequestAnimationFrame;
	window.requestAnimationFrame = requestAnimationFrame;
	var cancelAnimationFrame = window.cancelAnimationFrame ||window.mozcancelAnimationFrame ||window.webkitcancelAnimationFrame ||window.mscancelAnimationFrame;
    window.cancelAnimationFrame = cancelAnimationFrame;

    //配列の拡<input type="text" placeholder="search…" class="searchItem" id="searchSearchItem" readonly>張
    Array.prototype.getLastVal = function (){ return this[this.length -1];}
    
    //Lifrayの自動変換対応
	if(location.href.indexOf("js_fast_load") < 0){
		var url = location.href + "?js_fast_load=0";
		location.href = url;
		return
	}
	
	//ウィンドウのサイズ変更で再実行されないように
	if(this.finished) return;
    
	var _data = HumanFlow.data;
	
    var StringBuffer = function(string) {
	    this.buffer = [];
	    this.append = function(string) {
	        this.buffer.push(string);
	        return this;
	    };
	    this.toString = function() {
	        return this.buffer.join('');
	    };
	    if (string) this.append(string);
	};

    //変数
    var resolution = (1 + devicePixelRatio) / 2; //画素数対応
    var jqxhrTopic;
    var dataLabel = {};
    var dataTag = {};
	var dataArea = {};
	var data = {};
	var redZoneStagnation = {};
	var drawData = {};
	drawData.circle = new Array();
	drawData.heatmaps = {};
	var searchInput = "";
	var statisticsCategoryIndex = 0;
    var h = window.innerHeight;
	var w = window.innerWidth;
	var svg;
	var random;
	var countMax;
	var words;
	var layout;
	var selectWord = "";
	var selectCategory = "";
	var areaChartsIndex = 0;
	var targetBilding;
	var circlePoints;
	var textPoints;
	var circleStagnatePoints;
	var displayCategoryIndexNm;
	var filterCategoryIndexNm;
	var floorIndex = _data.map_index_init;
	var filterItem = {};
    var chartCategoryArea;
    var areaChartHeight = 200;
    var showCircleName = true;
    var timer = {From:0, End:0};
    var mapScales = {};
    var sizeScale;
    var timeScale;
    var timeScaleData;
    var timerEarth;
    var timerBilding;
    var addTimeRange = Number(_data.addTimeRange);
    var timerAutoMove;
    var jsonData;
    var pathLines;
    var divHeatmap;
    var serchPanelDivs;
    var pathRedzone;
    var heatmapDetail = {};
    var heatmaps = {};
    var gMain;
    var gPoints;
    var gReturn;
    var gHeat;
    var gPath;
    var gStagnatePoints;
    var colorScale = d3.scale.category10();
    var colorScaleTrain = function(i){
    	return "hsl("+ i*360 +", 50%, 50%)";
    }
    var colorObj = {};
    var tooltip;
    var formatThou = d3.format("0,000");
    var margin = {top:"150", left:"24", right:"24", bottom:"24"};
	var container;
	var camera, scene, renderer;
    var controls;
    var objects = [];
    var Render_earth, AnimateBill;
    var tooltip_Earth;
    var mapUri = [];
    var groupNames = new THREE.Group();
    var serchPanelSapns;
    
    //外部CSS読込
	function loadCss(href, check) {
		if(typeof(check) == 'undefined') check = true;
		var head = document.getElementsByTagName('head')[0];
		var link = document.createElement('link');
		link.rel = 'stylesheet';
		link.type = 'text/css';
		link.href = href;
		if(check) {
			var links = head.getElementsByTagName('link');
			for(var i = 0; i < links.length; i++) {
				if(links[i].href == link.href) return false;
			}
		}
		head.appendChild(link);
	}
	//loadCss(MakePath("css/HumanFlow.css"));
    	
    function Tricks(){
		$("#layout-Columnn_Columnn-1, #canvasArea").children().remove();
	}
	Tricks();
	
	function MakeUrl(str){
		return site_settings.graphInfoServiceSSL + site_settings.graphInfoServiceIP + "/graphservice/" + str + "?sessionId=" + site_settings.sessionId;
	}
	function MakePath(str){
		return site_settings.graphInfoServiceSSL + site_settings.graphInfoServiceIP + "/BigScreen/" + str;
	}
	function FairingName(w) {
		return w.replace(/[!-/:-@[-`{-~]/g, '');
	}
	
	function CreateSvg(obj){
	    var svg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
	    svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
	    if(obj.hasOwnProperty("id")) svg.setAttribute("id", obj.id);
	    if(obj.hasOwnProperty("class")) svg.setAttribute("class", obj.class);
	    if(obj.hasOwnProperty("viewBox")) svg.setAttribute("viewBox", obj.viewBox);
	    if(obj.hasOwnProperty("height")) svg.setAttribute("height", obj.height);
	    if(obj.hasOwnProperty("width")) svg.setAttribute("width", obj.width);
	    if(obj.hasOwnProperty("transform")) svg.setAttribute("transform", obj.transform);
	    if(obj.hasOwnProperty("title")) svg.setAttribute("title", obj.title);
	    if(obj.hasOwnProperty("style")) svg.setAttribute("style", obj.style);
	    if(obj.hasOwnProperty("opacity")) svg.setAttribute("opacity", obj.opacity);
	    return svg;
    }
	function CreateG(obj){
	    var g = document.createElementNS("http://www.w3.org/2000/svg", 'g');
	    if(obj.hasOwnProperty("id")) g.setAttribute("id", obj.id);
	    if(obj.hasOwnProperty("class")) g.setAttribute("class", obj.class);
	    if(obj.hasOwnProperty("fill")) g.setAttribute("fill", obj.fill);
	    if(obj.hasOwnProperty("transform")) g.setAttribute("transform", obj.transform);
	    if(obj.hasOwnProperty("style")) g.setAttribute("style", obj.style);
	    if(obj.hasOwnProperty("opacity")) g.setAttribute("opacity", obj.opacity);
	    return g;
	}
	function CreatePolygon(obj){
	    var polygon = document.createElementNS("http://www.w3.org/2000/svg", 'polygon');
	    if(obj.hasOwnProperty("id")) polygon.setAttribute("id", obj.id);
	    if(obj.hasOwnProperty("class")) polygon.setAttribute("class", obj.class);
	    if(obj.hasOwnProperty("fill")) polygon.setAttribute("fill", obj.fill);
	    if(obj.hasOwnProperty("transform")) polygon.setAttribute("transform", obj.transform);
	    if(obj.hasOwnProperty("style")) polygon.setAttribute("style", obj.style);
	    if(obj.hasOwnProperty("opacity")) polygon.setAttribute("opacity", obj.opacity);
	    if(obj.hasOwnProperty("points")) polygon.setAttribute("points", obj.points);
	    return polygon;
	}
	function CreateTspan(obj){
	    var tspan = document.createElementNS("http://www.w3.org/2000/svg", 'tspan');
	    if(obj.hasOwnProperty("x")) tspan.setAttribute("x", obj.x);
	    if(obj.hasOwnProperty("y")) tspan.setAttribute("y", obj.y);
	    if(obj.hasOwnProperty("dx")) tspan.setAttribute("dx", obj.dx);
	    if(obj.hasOwnProperty("dy")) tspan.setAttribute("dy", obj.dy);
	    if(obj.hasOwnProperty("class")) tspan.setAttribute("class", obj.class);
	    if(obj.hasOwnProperty("id")) tspan.setAttribute("id", obj.id);
	    if(obj.hasOwnProperty("fill")) tspan.setAttribute("fill", obj.fill);
	    if(obj.hasOwnProperty("fontSize")) tspan.setAttribute("font-size", obj.fontSize);
	    if(obj.hasOwnProperty("textAnchor")) tspan.setAttribute("text-anchor", obj.textAnchor);
	    if(obj.hasOwnProperty("transform")) tspan.setAttribute("transform", obj.transform);
	    if(obj.hasOwnProperty("style")) tspan.setAttribute("style", obj.style);
	    if(obj.hasOwnProperty("opacity")) tspan.setAttribute("opacity", obj.opacity);
	    if(obj.hasOwnProperty("content")) tspan.textContent = obj.content;
	    return tspan;
	}
	function CreateText(obj){
	    var text = document.createElementNS("http://www.w3.org/2000/svg", 'text');
	    if(obj.hasOwnProperty("x")) text.setAttribute("x", obj.x);
	    if(obj.hasOwnProperty("y")) text.setAttribute("y", obj.y);
	    if(obj.hasOwnProperty("dx")) text.setAttribute("dx", obj.dx);
	    if(obj.hasOwnProperty("dy")) text.setAttribute("dy", obj.dy);
	    if(obj.hasOwnProperty("id")) text.setAttribute("id", obj.id);
	    if(obj.hasOwnProperty("class")) text.setAttribute("class", obj.class);
	    if(obj.hasOwnProperty("opacity")) text.setAttribute("opacity", obj.opacity);
	    if(obj.hasOwnProperty("fill")) text.setAttribute("fill", obj.fill);
	    if(obj.hasOwnProperty("fontSize")) text.setAttribute("font-size", obj.fontSize);
	    if(obj.hasOwnProperty("textAnchor")) text.setAttribute("text-anchor", obj.textAnchor);
	    if(obj.hasOwnProperty("transform")) text.setAttribute("transform", obj.transform);
	    if(obj.hasOwnProperty("writingMode")) text.setAttribute("writing-mode", obj.writingMode);
	    if(obj.hasOwnProperty("description")) text.setAttribute("data-description", obj.description);
	    if(obj.hasOwnProperty("category")) text.setAttribute("data-category", obj.category);
	    if(obj.hasOwnProperty("style")) text.setAttribute("style", obj.style);
	    if(obj.hasOwnProperty("title")) text.setAttribute("title", obj.title);
	    if(obj.hasOwnProperty("dataFilter")) text.setAttribute("data-filter", obj.dataFilter);
	    if(obj.hasOwnProperty("content")) text.textContent = obj.content;
	    return text;
	}
	function CreatePath(obj){
	    var path = document.createElementNS("http://www.w3.org/2000/svg", 'path');
	    if(obj.hasOwnProperty("d")) path.setAttribute("d", obj.d);
	    if(obj.hasOwnProperty("id")) path.setAttribute("id", obj.id);
	    if(obj.hasOwnProperty("class")) path.setAttribute("class", obj.class);
	    if(obj.hasOwnProperty("fill")) path.setAttribute("fill", obj.fill);
	    if(obj.hasOwnProperty("opacity")) path.setAttribute("opacity", obj.opacity);
	    if(obj.hasOwnProperty("stroke")) path.setAttribute("stroke", obj.stroke);
	    if(obj.hasOwnProperty("strokeWidth")) path.setAttribute("stroke-width", obj.strokeWidth);
	    if(obj.hasOwnProperty("strokeOpacity")) path.setAttribute("stroke-opacity", obj.strokeOpacity);
	    if(obj.hasOwnProperty("transform")) path.setAttribute("transform", obj.transform);
	    if(obj.hasOwnProperty("style")) path.setAttribute("style", obj.style);
	    return path;
	}
	function CreateCircle(obj){
	    var circle = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
	    if(obj.hasOwnProperty("cx")) circle.setAttribute("cx", obj.cx);
	    if(obj.hasOwnProperty("cy")) circle.setAttribute("cy", obj.cy);
	    if(obj.hasOwnProperty("r")) circle.setAttribute("r", obj.r);
	    if(obj.hasOwnProperty("id")) circle.setAttribute("id", obj.id);
	    if(obj.hasOwnProperty("class")) circle.setAttribute("class", obj.class);
	    if(obj.hasOwnProperty("fill")) circle.setAttribute("fill", obj.fill);
	    if(obj.hasOwnProperty("opacity")) circle.setAttribute("opacity", obj.opacity);
	    if(obj.hasOwnProperty("transform")) circle.setAttribute("transform", obj.transform);
	    if(obj.hasOwnProperty("data")) circle.setAttribute("data", obj.data);
	    if(obj.hasOwnProperty("stroke")) circle.setAttribute("stroke", obj.stroke);
	    if(obj.hasOwnProperty("strokeWidth")) circle.setAttribute("stroke-width", obj.strokeWidth);
	    if(obj.hasOwnProperty("strokeDasharray")) circle.setAttribute("stroke-dasharray", obj.strokeDasharray);
	    if(obj.hasOwnProperty("fillOpacity")) circle.setAttribute("fill-opacity", obj.fillOpacity);
	    if(obj.hasOwnProperty("dataFilter")) circle.setAttribute("data-filter", obj.dataFilter);
	    if(obj.hasOwnProperty("style")) circle.setAttribute("style", obj.style);
	    return circle;
	}
	function CreateRect(obj){
	    var rect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
	    if(obj.hasOwnProperty("x")) rect.setAttribute("x", obj.x);
	    if(obj.hasOwnProperty("y")) rect.setAttribute("y", obj.y);
	    if(obj.hasOwnProperty("rx")) rect.setAttribute("rx", obj.rx);
	    if(obj.hasOwnProperty("ry")) rect.setAttribute("ry", obj.ry);
	    if(obj.hasOwnProperty("width")) rect.setAttribute("width", obj.width);
	    if(obj.hasOwnProperty("height")) rect.setAttribute("height", obj.height);
	    if(obj.hasOwnProperty("id")) rect.setAttribute("id", obj.id);
	    if(obj.hasOwnProperty("class")) rect.setAttribute("class", obj.class);
	    if(obj.hasOwnProperty("fill")) rect.setAttribute("fill", obj.fill);
	    if(obj.hasOwnProperty("opacity")) rect.setAttribute("opacity", obj.opacity);
	    if(obj.hasOwnProperty("strokeWidth")) rect.setAttribute("stroke-width", obj.strokeWidth);
	    if(obj.hasOwnProperty("transform")) rect.setAttribute("transform", obj.transform);
	    if(obj.hasOwnProperty("pointerEvents")) rect.setAttribute("pointer-events", obj.pointerEvents);
	    
	    return rect;
	}
	function CreateLine(obj){
	    var line = document.createElementNS("http://www.w3.org/2000/svg", 'line');
	    if(obj.hasOwnProperty("x1")) line.setAttribute("x1", obj.x1);
	    if(obj.hasOwnProperty("y1")) line.setAttribute("y1", obj.y1);
	    if(obj.hasOwnProperty("x2")) line.setAttribute("x2", obj.x2);
	    if(obj.hasOwnProperty("y2")) line.setAttribute("y2", obj.y2);
	    if(obj.hasOwnProperty("stroke")) line.setAttribute("stroke", obj.stroke);
	    if(obj.hasOwnProperty("strokeWidth")) line.setAttribute("stroke-width", obj.strokeWidth);
	    return line;
	}
	function CreateImage(obj){
	    var image = document.createElementNS("http://www.w3.org/2000/svg", 'image');
	    if(obj.hasOwnProperty("x")) image.setAttribute("x", obj.x);
	    if(obj.hasOwnProperty("y")) image.setAttribute("y", obj.y);
	    if(obj.hasOwnProperty("transform")) image.setAttribute("transform", obj.transform);
	    if(obj.hasOwnProperty("width")) image.setAttribute("width", obj.width);
	    if(obj.hasOwnProperty("height")) image.setAttribute("height", obj.height);
	    if(obj.hasOwnProperty("opacity")) image.setAttribute("opacity", obj.opacity);
	    if(obj.hasOwnProperty("id")) image.setAttribute("id", obj.id);
	    if(obj.hasOwnProperty("class")) image.setAttribute("class", obj.class);
	    if(obj.hasOwnProperty("title")) image.setAttributeNS("http://www.w3.org/1999/xlink", "title", obj.title);
	    if(obj.hasOwnProperty("href")) image.setAttributeNS("http://www.w3.org/1999/xlink", "href", obj.href);
	    return image;
	}
	
	//スケール作成
	var loadImageCnt = 0;
	var loadImageFull = Object.keys(_data.bildings).map(m => _data.bildings[m].length).reduce((a,x) => a+=x,0);
	$.each(_data.bildings, function(ii, vv){
		mapScales[ii] = {};
		$.each(vv, function(i, v){
			var img = new Image();
			var aspc;
			mapScales[ii][v.floor] = {};
			function ImageLoadFunc(e){
				
				var aspc = img.width / img.height;
				v.w = w-250;
				v.h = (w-250) / aspc;
				
				mapScales[ii][v.floor].xscale = d3.scale.linear()
		               .domain([0, v.width])
		               .range([0, w-250]);
				mapScales[ii][v.floor].yscale = d3.scale.linear()
		               .domain([0, v.length])
		               .range([0, (w-250) / aspc]);
		        mapScales[ii][v.floor].scaleDetailReverse = d3.scale.linear()
		               .domain([0, w-250])
		               .range([0, v.width]);
				
				loadImageCnt++;
				if(loadImageCnt == loadImageFull){
					$.each(_data.bildings, function(iii, vvv){
						var margin_max = vvv.map(m => m.h).reduce((a,x) => a+=x,0);
						//階数に応じた高さの設定
						$.each(vvv, (iiii,vvvv)=>{
							var margin = vvv.slice(0, iiii).map(m => m.h).reduce((a,x) => a+=x,0);
							vvvv.floorHeight = -margin_max/2 + margin + 12*iiii;
						})
					})
					
				}
			}
			if(img.addEventListener){
				img.addEventListener("load",ImageLoadFunc);
			}else if(img.attachEvent){
				img.attachEvent("onload",ImageLoadFunc);
			}else{
				img.onload = ImageLoadFunc;
			}
	        img.src = MakePath(v.img);
		})
	})
	
	//フィルタリング設定項目一覧
	function WriteFilterDescription(filterObj){
	    var display = "none";
	    var description = "";
	    var filterCnt = 0;
	    $.each(filterObj, function(i, v){
	        if(v.length > 0) display = "block";
	        $.each(v, function(ii, vv){
	            filterCnt++;
	            if(filterCnt < 4){
	                description += '\"' + vv + '\", ';
	            }
	        });
	    });
	    if(filterCnt > 3){
	        description = filterCnt + "項目が選択されています";
	    }else if(filterCnt > 0){
	        description.slice(-1);
	        description += "を選択しています";
	    }else{
	        description = "フィルタリング項目未選択";
	    }
	    $("#divFilterDescription").text(description);
	    $(".divSelectedFilterItem").height($("#sumaryDiv").position().top - $(".divSelectedFilterItem").position().top - 36);
	}
	
	//統計データ用のデータモデル整形
    var statisticsModel = [{
    	name:"移動距離",
    	class:"movement"
    },{
    	name:"レッドゾーン",
    	class:"redzone"
    }];
    //{name:"コミュニケーション",class:"comunication"}
    
    //DOM整形
    $("#sb-site *").remove();
    
    $("#sb-site").prepend("<div id='container_earth' style='width:"+w+"px; height:"+h+"px; position: absolute;'>");
    $("#sb-site").prepend("<div id='container' style='width:"+w+"px; height:"+h+"px; position: absolute; display:none;'>");
	
	container = d3.select("#container");
	
    var txt = '<div id="divHeatmap" style="opacity:0; width: 500px; height: 500px; position:relative; display:none; transform-origin: left top 0px; transform:translate('+ margin.left +'px,'+ margin.top +'px)"></div>';
    txt += '<svg id="main" style="opacity:0; display:none;"></svg>';
    txt += '<div id="divAreaChart" style="position: absolute;bottom: 0;height: '+ areaChartHeight +';width: '+ (window.innerWidth - 250) +'px;"></div>';
    txt += "<div id='rightPanelDiv'><div id='divFilterDescription' style='width: 294.5px;'>フィルタリング項目未選択</div></div>";
    $("#sb-site").append(txt);
    $("#rightPanelDiv").css({"padding-top":"80px", "width":"250px"});
    
    divHeatmap = d3.select("#divHeatmap");
	
    //Loading
    $("body").append("<div id='loadingDiv'>");
    $("#loadingDiv").css({
        "width": "100%",
        "background": "#000",
        "height": "100%",
        "position": "absolute",
        "top": "0px",
        "z-index":"9998",
    }).append("<div class='gifDiv blinking'></div>").append("<span>Loading...</span>");
    $("#loadingDiv span").css({
        "position": "absolute",
        "text-align": "center",
        "width":"100%",
        "color": "rgba(33, 150, 243, 0.8)",
        "font-size": "24px",
        "top": (h/2) + "px",
    });
    $("#loadingDiv .gifDiv").css("text-align", "center").append('<div class="loadingCircle1"></div><div class="loadingCircle2"></div>');
    $("#loadingDiv .gifDiv").css("margin-top", $("#loadingDiv span").position().top -100);
    
    var svg = d3.select("#main").attr("height", h).attr("width", w * .75);
    //カーソル移動用グループ生成
	gMain = svg.append("g").style("transform", "translate("+ margin.left +"px,"+ margin.top +"px)").attr("id", "gMain");
    
    //右側パネル操作アイコン作成
    $("body").append("<div id='manueDiv'>");
    $("#manueDiv").width(w * 0.25).height(105 * resolution);
    // SVG要素生成
    d3.select("#manueDiv")
      .append("svg")
      .attr("width", w * 0.25)
      .attr("height", 105 * resolution)
      .attr("version", "1.1")
      .attr("xmlns", "http://www.w3.org/2000/svg");

    $("#manueDiv svg").append(CreateG({"class":"gIconPos"}));
    $("#manueDiv svg g.gIconPos").append(CreateG({"class":"gIcon"}));
    $("#manueDiv svg g.gIcon").append(CreateCircle({"cx":"0", "cy":"16", "r":"16", "fill":"rgba(0,0,0,0.5)", "title":"info", "class":"circleIconInfo tooltipIcon"}));
    $("#manueDiv svg g.gIcon").append(CreateCircle({"cx":"40", "cy":"16", "r":"16", "fill":"rgba(0,0,0,0.5)", "title":"search", "class":"circleIconSearch tooltipIcon"}));
    $("#manueDiv svg g.gIcon").append(CreateCircle({"cx":"80", "cy":"16", "r":"16", "fill":"rgba(0,0,0,0.5)", "title":"Topic", "class":"circleIconTopic tooltipIcon"}));
    $("#manueDiv svg g.gIcon").append(CreateCircle({"cx":"120", "cy":"16", "r":"16", "fill":"rgba(0,0,0,0.5)", "title":"statistics", "class":"circleIconStatistics tooltipIcon"}));
	$("#manueDiv svg g.gIcon").append(CreateCircle({"cx":"160", "cy":"16", "r":"16", "fill":"rgba(0,0,0,0.5)", "title":"filter", "class":"circleIconFilter tooltipIcon"}));
    $("#manueDiv svg g.gIcon").append(CreateCircle({"cx":"210", "cy":"16", "r":"16", "fill":"rgba(0,0,0,0.5)", "title":"windowClose", "class":"circleIconClose tooltipIcon"}));
    $("#manueDiv svg g.gIcon").append(CreateLine({"stroke":"#fff", "x1":"185", "y1":"0", "x2":"185", "y2":"32", "stroke-width":"0.5"}));
    $("#manueDiv svg g.gIcon").append(CreateImage({"x":"-8",  "y":"8",  "id":"iconInfo",  "opacity":".3",  "class":"tooltipIcon",  "title":"info",  "href": MakePath("icon/icon_info.png"),  "width":"16",  "height":"16"}));
    $("#manueDiv svg g.gIcon").append(CreatePath({"transform":"translate(30, 5)scale(0.04)", "fill":"rgb(256,256,256)", "opacity":".3", "id":"iconSearch", "class":"tooltipIcon", "title":"search", "d":"M495.272,423.558c0,0-68.542-59.952-84.937-76.328c-24.063-23.938-33.69-35.466-25.195-54.931   c37.155-75.78,24.303-169.854-38.72-232.858c-79.235-79.254-207.739-79.254-286.984,0c-79.245,79.264-79.245,207.729,0,287.003   c62.985,62.985,157.088,75.837,232.839,38.691c19.466-8.485,31.022,1.142,54.951,25.215c16.384,16.385,76.308,84.937,76.308,84.937   c31.089,31.071,55.009,11.95,69.368-2.39C507.232,478.547,526.362,454.638,495.272,423.558z M286.017,286.012   c-45.9,45.871-120.288,45.871-166.169,0c-45.88-45.871-45.88-120.278,0-166.149c45.881-45.871,120.269-45.871,166.169,0   C331.898,165.734,331.898,240.141,286.017,286.012z",}));
    $("#manueDiv svg g.gIcon").append(CreateG({id:"iconTopic", class:"active tooltipIcon"}));
    $("#iconTopic").append(CreateCircle({cx:"73", cy:"10", r:"2", fill:"white"}));
    $("#iconTopic").append(CreateCircle({cx:"73", cy:"16", r:"2", fill:"white"}));
    $("#iconTopic").append(CreateCircle({cx:"73", cy:"22", r:"2", fill:"white"}));
    $("#iconTopic").append(CreateLine({x1:"78", x2:"90", y1:"10", y2:"10", stroke:"white", strokeWidth:"2"}));
    $("#iconTopic").append(CreateLine({x1:"78", x2:"90", y1:"16", y2:"16", stroke:"white", strokeWidth:"2"}));
    $("#iconTopic").append(CreateLine({x1:"78", x2:"90", y1:"22", y2:"22", stroke:"white", strokeWidth:"2"}));
    $("#manueDiv svg g.gIcon").append(CreatePath({"transform":"translate(109.5,5)scale(0.042)", "fill":"rgb(256,256,256)", "opacity":".3", "id":"iconStatistics", "class":"tooltipIcon", "title":"statistics", "d":"M112,166.016c4.531,0,8.813-0.922,12.844-2.391l70.625,100.297c-5.422,6.578-8.813,14.891-8.813,24.078   c0,21,17.016,38.016,38,38.016c21,0,38.031-17.016,38.031-38.016c0-7.563-2.281-14.563-6.078-20.469l55.688-61.719   c5.141,2.594,10.891,4.188,17.047,4.188c3.875,0,7.531-0.75,11.063-1.813L414,324.469c-6.156,6.75-10.016,15.656-10.016,25.531   c0,21,17.016,38.016,38.016,38.016S480.016,371,480.016,350S463,311.984,442,311.984c-3.875,0-7.547,0.75-11.063,1.828   l-73.609-116.281c6.172-6.766,10.016-15.672,10.016-25.531c0-21-17.016-38.031-38-38.031c-21,0-38.031,17.031-38.031,38.031   c0,7.547,2.281,14.547,6.078,20.469l-55.688,61.719c-5.141-2.594-10.891-4.203-17.047-4.203c-4.531,0-8.813,0.922-12.844,2.391   l-70.625-100.297c5.438-6.578,8.828-14.891,8.828-24.078c0-21-17.016-38.016-38.016-38.016S73.984,107,73.984,128   S91,166.016,112,166.016z",}));
    $("#manueDiv svg g.gIcon").append(CreateImage({"x":"150", "y":"10", "id":"iconFilter", "class":"tooltipIcon", "opacity":"0.3", "title":"filter", "href":MakePath("icon/icon_filter.png"), "width":"16", "height":"16"}));

    //アイコン群の位置調整
    $("#manueDiv svg g.gIcon").css({"transform":"scale(" + resolution + ")", "transform-origin":"right top"});
    $("#manueDiv svg g.gIconPos").css({"transform":"translate(" + ($("#manueDiv").width() - $("#manueDiv svg g.gIconPos").get(0).getBBox().width ) + "px, 60px)", "transform-origin":"right top"});

    //フィルタクローズイベント付与
    $(".circleIconInfo, #iconInfo").on('click', function(){
        $("#statisticsDiv, #filterDiv, #topicDiv, #searchDiv").css("display", "none");
        $("#infoDiv").css("display", "inherit");
        $("#infoDiv div.divNameList").height($("#sumaryDiv").position().top - $("#infoDiv div.divNameList").position().top - 24)
        $("#iconFilter, #iconTopic, #iconStatistics, #iconSearch").attr("opacity", 0.3);
        $("#iconInfo").attr("opacity", 1);
    });
    $(".circleIconSearch, #iconSearch").on('click', function(){
        $("#statisticsDiv, #filterDiv, #infoDiv, #topicDiv").css("display", "none");
        $("#searchDiv").css("display", "inherit");
        $("#iconFilter, #iconInfo, #iconStatistics, #iconTopic").attr("opacity", 0.3);
        $("#iconSearch").attr("opacity", 1);
        $("#searchDiv div.divNameList").height($("#sumaryDiv").position().top - $("#searchDiv div.divNameList").position().top - 24);
    });
    $(".circleIconTopic, #iconTopic").on('click', function(){
        $("#statisticsDiv, #filterDiv, #infoDiv, #searchDiv").css("display", "none");
        $("#topicDiv").css("display", "inherit");
        $("#iconFilter, #iconInfo, #iconStatistics, #iconSearch").attr("opacity", 0.3);
        $("#iconTopic").attr("opacity", 1);
    });
    $(".circleIconFilter, #iconFilter").on('click', function(){
        $("#statisticsDiv, #infoDiv, #topicDiv, #searchDiv").css("display", "none");
        $("#filterDiv").css("display", "inherit");
        $("#iconFilter").attr("opacity", 1);
        $("#iconInfo, #iconTopic, #iconStatistics, #iconSearch").attr("opacity", 0.3);            
        $(".divSelectedFilterItem").height($("#sumaryDiv").position().top - $(".divSelectedFilterItem").position().top - 24);
    });
    $(".circleIconStatistics, #iconStatistics").on('click', function(){
        $("#statisticsDiv").css("display", "inherit");
        $("#infoDiv, #topicDiv, #filterDiv, #searchDiv").css("display", "none");
        $("#iconStatistics").attr("opacity", "1");
        $("#iconInfo, #iconTopic, #iconFilter, #iconSearch").attr("opacity", 0.3);
    });
    
    $("#manueDiv svg g.gIcon").append(CreateImage({"x": "202","y": "8","class": "active tooltipIcon","id": "windowCloseImage","href": MakePath("icon/icon_close.png"),"title": "windowClose","width":"16","height":"16"}));
    //詳細ウィンドウのクローズイベント付与
    var isHideMenu = false;
    $("#windowCloseImage, #windowClose").on('click', function(){
        if(isHideMenu){
             $("#rightPanelDiv").animate({ 
                right: "0px",opacity: 1
             }, 300 );
             $("#windowCloseImage").css("transform", "scaleX(1)");
             isHideMenu = false;
        }else{
            $("#rightPanelDiv").animate({ 
            right: (Number($("#rightPanelDiv").outerWidth(true)) * -1),opacity: 0.5
             }, 300 );
             $("#windowCloseImage").css("transform", "scaleX(-1)translateX(-422px)");
             isHideMenu = true;
        }
    });
    
    //背景
    $("#sb-site").css('background', 'url('+ MakePath("img/background.jpg") + ')');
    $("#fixed-top").css('display', 'none');
    
    //ソフトバンクロゴ
    $("body").append("<div id='sumaryDiv' style='position: absolute;bottom: 12px;right: 12px; z-index:1;' class='refreshElement'>");
    var headerHtml = '<img style="height: 30px" alt="logo02" src="'+ MakePath("icon/icon_softbank_blk.png")+ '">';
    $("div#sumaryDiv").append(headerHtml);

    //時計
    var _monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    var _weekNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var _weekShortNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    $("body").append("<div id='divTime' class='refreshElement'></div>");
    $("#divTime").append("<div><div>"+ _weekNames[new Date().getDay()] +"</div><div>"+ new Date().getFullYear() +"</div><div>Tokyo</div></div>");
    $("#divTime").append("<div><div>"+ new Date().getDate() +"</div><div>"+ _monthNames[new Date().getMonth()] +".</div><div id='hourMinutes'>"+ new Date().getHours() + ":" + ("0"+new Date().getMinutes()).slice(-2) +"</div></div>");
    setInterval(function(){
        $("#hourMinutes").text(new Date().getHours() + ':' + ('0'+new Date().getMinutes()).slice(-2));
    }, 60000);
    
    //基盤メニュー
    var menuIconSvg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
    menuIconSvg.setAttribute("id", "svgMenu");
    menuIconSvg.setAttribute("class", "refreshElement");
    menuIconSvg.setAttribute("height", 40);
    menuIconSvg.setAttribute("width", 40);
    menuIconSvg.setAttribute("style", "position: absolute;left: 20px;top: 20px;background: rgba(0,0,0,0.8);z-index: 9999;border-radius: 20px;");
    $("body").append(menuIconSvg);
    $("#svgMenu").append(CreateImage({"x":"10", "y":"10", "id":"menuRect", "width":"20", "height":"20", "title":"menu", "href":MakePath("/icon/icon_SoftbankFlag.png")}));
    //基盤のメニューウィンドウを表示する
    $("#menuRect").on("click", function(){
        $('#menu').trigger("click");
    });
    
    //自動再生
    var isAutoPlay = false;
    var timerAutoPlay;
    $("body").append(CreateSvg({"id": "svgAutoPlay","height": 40,"width": 40, "viewBox":"0 0 512 512", "style": "z-index:1; position: absolute;left: 620px;top: 20px;background: rgba(0,0,0,0.8); border-radius: 20px;"}));
    $("#svgAutoPlay").append(CreateG({"style":"opacity:.8;"}));
    $("#svgAutoPlay g").append(CreatePath({fill:"white", "class":"tooltipIcon", "title":"AutoPlay", d:"M368.149,244.383l-146.883-84.805c-2.953-1.707-6.133-2.047-9.09-1.496c-0.126,0.023-0.25,0.027-0.371,0.054   c-0.715,0.152-1.394,0.379-2.07,0.645c-0.23,0.09-0.453,0.183-0.676,0.281c-0.66,0.305-1.297,0.633-1.902,1.035   c-0.062,0.043-0.117,0.094-0.179,0.137c-2,1.379-3.59,3.282-4.606,5.578c-0.054,0.125-0.11,0.242-0.16,0.367   c-0.294,0.726-0.535,1.465-0.699,2.258c-0.031,0.141-0.035,0.293-0.059,0.442c-0.133,0.762-0.316,1.504-0.316,2.32v169.606   c0,0.812,0.183,1.554,0.316,2.32c0.024,0.145,0.028,0.297,0.059,0.438c0.164,0.793,0.406,1.535,0.703,2.262   c0.05,0.122,0.102,0.238,0.152,0.359c1.019,2.305,2.617,4.211,4.625,5.59c0.055,0.039,0.102,0.086,0.16,0.125   c0.61,0.406,1.246,0.734,1.918,1.039c0.214,0.102,0.434,0.191,0.656,0.278c0.68,0.269,1.363,0.496,2.082,0.648   c0.117,0.027,0.242,0.031,0.363,0.054c2.961,0.551,6.137,0.215,9.094-1.492l146.883-84.805   C377.094,262.457,377.094,249.547,368.149,244.383z"}));
    
    //速度DOWN
    $("body").append(CreateSvg({"id": "svgSpeedDown","viewBox":"-60 -60 512 512","height": 40,"width": 40,"style": "z-index:1; position: absolute;left: 690px; top: 20px;background: rgba(0,0,0,0.8); border-radius: 20px;"}));
    $("#svgSpeedDown").append(CreateG({"style":"opacity:.8; transform-origin: center; transform:scale(.75);"}));
    $("#svgSpeedDown g").append(CreatePath({fill:"white", "class":"tooltipIcon", "title":"SpeedDown", d:"M302.085,199.562l-56.034-15.928c-5.258-1.489-10.821-0.09-14.582,3.671l-53.2,53.2   c-3.769,3.769-5.175,9.326-3.679,14.59l15.921,56.034c1.489,5.264,5.654,9.43,10.918,10.917l56.034,15.906   c5.257,1.496,10.821,0.105,14.59-3.656l53.207-53.207c3.761-3.762,5.16-9.326,3.664-14.582l-15.928-56.041   C311.492,205.215,307.334,201.057,302.085,199.562z"}));
    $("#svgSpeedDown g").append(CreatePath({fill:"white", "class":"tooltipIcon", "title":"SpeedDown", d:"M261.905,99.385c-13.371,0.763-30.369,5.848-30.369,5.848c-2.714,0.516-5.048,2.146-6.462,4.486   c-1.414,2.341-1.787,5.197-1.009,7.882l13.229,46.552c1.495,5.257,5.646,9.415,10.903,10.91l56.042,15.929   c5.257,1.495,10.813,0.105,14.574-3.664l43.777-43.777c2.168-2.176,3.179-5.257,2.73-8.368c-0.434-3.104-2.281-5.87-5.004-7.515   c0,0-11.688-9.796-26.33-15.914C312.898,102.967,288.055,97.881,261.905,99.385z"}));
    $("#svgSpeedDown g").append(CreatePath({fill:"white", "class":"tooltipIcon", "title":"SpeedDown", d:"M115.415,225.878l41.855,11.882c5.257,1.496,10.806,0.105,14.574-3.664l53.215-53.206   c3.754-3.762,5.152-9.326,3.656-14.582l-2.101-7.389l-10.297-36.224c-0.853-3.006-3.029-5.504-5.886-6.775   c-2.864-1.279-6.11-1.189-8.809,0.247c0,0-11.21,4.442-21.903,11.591c-11.285,7.568-22.188,16.579-32.62,27.003   c-10.185,10.193-18.949,20.976-26.263,32.268c-7.321,11.307-12.07,24.386-12.07,24.386c-1.331,2.685-1.353,5.885-0.074,8.697   C109.986,222.909,112.454,225.033,115.415,225.878z"}));
    $("#svgSpeedDown g").append(CreatePath({fill:"white", "class":"tooltipIcon", "title":"SpeedDown", d:"M181.941,313.289l-15.921-56.042c-1.481-5.264-5.646-9.422-10.911-10.917l-3.111-0.883l-40.853-11.606   c-2.722-0.77-5.608-0.389-7.964,1.054c-2.348,1.444-3.956,3.821-4.449,6.573c0,0-3.754,13.76-4.487,25.485   c-1.705,27.28-2.879,58.913,5.242,79.583c6.207,15.764,15.114,26.488,15.114,26.488c1.585,2.796,4.382,4.726,7.53,5.219   c3.14,0.479,6.282-0.523,8.48-2.722l47.658-47.65C182.03,324.103,183.444,318.547,181.941,313.289z"}));
    $("#svgSpeedDown g").append(CreatePath({fill:"white", "class":"tooltipIcon", "title":"SpeedDown", d:"M385.271,152.614c-1.645-2.714-4.412-4.562-7.523-5.01c-3.104-0.434-6.184,0.576-8.353,2.737l-43.784,43.777   c-3.762,3.769-5.16,9.326-3.672,14.59l15.936,56.033c1.488,5.25,5.654,9.408,10.91,10.904l46.544,13.228   c2.7,0.77,5.549,0.397,7.89-1.009c2.34-1.414,3.964-3.754,4.479-6.454c0,0,5.085-17.013,5.856-30.376   c1.503-26.144-3.582-51-12.376-72.09C395.06,164.31,385.271,152.614,385.271,152.614z"}));
    $("#svgSpeedDown g").append(CreatePath({fill:"white", "class":"tooltipIcon", "title":"SpeedDown", d:"M390.252,296.62l-36.231-10.297l-7.389-2.109c-5.257-1.496-10.813-0.09-14.575,3.664l-53.214,53.215   c-3.761,3.754-5.16,9.325-3.664,14.575l11.882,41.855c0.845,2.961,2.969,5.422,5.773,6.715c2.798,1.286,5.998,1.256,8.69-0.067   c0,0,13.079-4.756,24.386-12.062c11.292-7.314,22.075-16.086,32.275-26.279c10.425-10.432,19.436-21.327,26.996-32.619   c7.157-10.687,11.599-21.904,11.599-21.904c1.413-2.7,1.518-5.93,0.239-8.802C395.748,299.635,393.25,297.466,390.252,296.62z"}));
    $("#svgSpeedDown g").append(CreatePath({fill:"white", "class":"tooltipIcon", "title":"SpeedDown", d:"M267.483,360.933l-0.875-3.104c-1.496-5.264-5.66-9.429-10.918-10.918l-56.049-15.913   c-5.249-1.496-10.813-0.097-14.575,3.672l-47.651,47.658c-2.198,2.198-3.208,5.332-2.722,8.48c0.501,3.141,2.423,5.938,5.22,7.524   c0,0,10.724,8.914,26.488,15.113c20.669,8.128,52.302,6.954,79.582,5.249c11.718-0.74,25.478-4.494,25.478-4.494   c2.752-0.493,5.13-2.094,6.581-4.442c1.443-2.362,1.825-5.234,1.047-7.972L267.483,360.933z"}));
    $("#svgSpeedDown g").append(CreatePath({fill:"white", "class":"tooltipIcon", "title":"SpeedDown", d:"M400.145,159.793c0,0,24.17-8.062,31.206-13.094c7.06-5.04,21.156-31.221,21.156-39.275   s4.031-16.108-13.094-33.232c-17.117-17.118-25.178-13.095-33.225-13.095c-8.069,0-34.243,14.104-39.283,21.148   c-5.04,7.052-13.095,31.222-13.095,31.222s20.139,12.085,27.191,19.136C388.053,139.647,400.145,159.793,400.145,159.793z"}));
    $("#svgSpeedDown g").append(CreatePath({fill:"white", "class":"tooltipIcon", "title":"SpeedDown", d:"M157.457,41.78l67.363,19.212c0,0,7.306,19.159,8.839,32.485c35.91-12.392,66.623-3.164,66.623-3.164   l-9.153-42.199c-6.843-31.543-37.81-51.532-69.487-44.869l-63.123,13.289c-5.87,1.242-10.162,6.304-10.41,12.287   C147.855,34.796,151.714,40.15,157.457,41.78z"}));
    $("#svgSpeedDown g").append(CreatePath({fill:"white", "class":"tooltipIcon", "title":"SpeedDown", d:"M465.848,222.841l-42.199-9.153c0,0,9.235,30.704-3.157,66.622c13.319,1.526,32.478,8.832,32.478,8.832   l19.211,67.37c1.638,5.728,6.985,9.602,12.967,9.348c5.975-0.254,11.046-4.546,12.279-10.409l13.289-63.123   C517.388,260.651,497.391,229.676,465.848,222.841z"}));
    $("#svgSpeedDown g").append(CreatePath({fill:"white", "class":"tooltipIcon", "title":"SpeedDown", d:"M44.694,255.095c-15.397-2.573-29.725,9.138-31.961,15.196l-11.77,31.789   c-1.99,5.37-0.845,11.389,2.976,15.652c3.814,4.262,9.684,6.065,15.232,4.673l64.006-15.995c-6.416-19.249,0-46.193,0-46.193   L44.694,255.095z"}));
    $("#svgSpeedDown g").append(CreatePath({fill:"white", "class":"tooltipIcon", "title":"SpeedDown", d:"M249.812,426.853c0,0-26.944,6.416-46.185,0l-16.011,64.012c-1.384,5.549,0.419,11.412,4.681,15.226   c4.263,3.821,10.283,4.973,15.66,2.984l31.781-11.778c6.05-2.244,17.769-16.556,15.196-31.962L249.812,426.853z"}));

    //速度UP
    $("body").append(CreateSvg({"id": "svgSpeedUp","viewBox":"-200 -200 1000 1000","height": 40,"width": 40,"style": "z-index:1; position: absolute;left: 800px;top: 20px;background: rgba(0,0,0,0.8); border-radius: 20px;"}));
    $("#svgSpeedUp").append(CreateG({"style":"opacity:.8; transform-origin: center; transform:scale(.6);"}));
    $("#svgSpeedUp g").append(CreatePath({fill:"white", "class":"tooltipIcon", "title":"SpeedUp", d:"M990,806.4c0,32.7-28.6,61.3-61.3,61.3c-44.9,0-98-24.5-102.1-61.3c0-32.7,53.1-61.3,98-61.3C961.4,745.1,990,773.7,990,806.4z"}));
    $("#svgSpeedUp g").append(CreatePath({fill:"white", "class":"tooltipIcon", "title":"SpeedUp", d:"M659.3,22.4C687.8,83.6,528.6,91.8,455.1,149C389.7,198,328.5,279.6,304,251.1c-49-49,12.2-110.2,89.8-167.4C491.8,14.2,647-6.2,659.3,22.4z"}));
    $("#svgSpeedUp g").append(CreatePath({fill:"white", "class":"tooltipIcon", "title":"SpeedUp", d:"M704.2,136.7c4.1,32.7-110.3,36.7-196,77.6c-85.8,44.9-130.7,77.6-155.2,49c-53.1-49,8.2-73.5,89.8-126.6C561.3,67.3,700.1,83.6,704.2,136.7z"}));
    $("#svgSpeedUp g").append(CreatePath({fill:"white", "class":"tooltipIcon", "title":"SpeedUp", d:"M908.3,704.3c0-85.7-28.6-216.4-167.4-281.7c-130.7-61.3-314.4-8.2-322.6-106.2c-44.9,20.4-171.5,106.2-191.9,130.7c-122.5,159.2,4.1,175.6-32.7,302.2c-16.3,57.1-12.2,130.6-20.4,142.9c-20.4,24.5-122.5-12.3-122.5,81.7c0,16.3,24.5,16.3,134.7,16.3c49,0,89.8-138.8,151.1-204.2c-49-249.1,196-245,253.2-134.7c-118.4-61.3-212.3,8.2-212.3,85.7c0,114.4,155.2,142.9,204.2,151.1c-285.8,0-285.8,53.1-285.8,81.7c0,20.4,40.8,20.4,93.9,20.4c65.3,0,147-8.2,204.2-8.2c57.2,0,138.8,8.2,187.9,8.2c53.1,0,49-65.3,28.6-98C781.8,839,908.3,826.8,908.3,704.3z"}));
    $("#svgSpeedUp g").append(CreatePath({fill:"white", "class":"tooltipIcon", "title":"SpeedUp", d:"M246.8,173.5c-32.7,0-61.3,8.2-89.8,20.4C83.5,230.6,10,336.8,10,414.4c0,44.9,20.4,85.8,175.6,85.8c191.9,0,232.8-122.5,232.8-183.8C418.3,234.7,328.5,173.5,246.8,173.5z M173.3,381.7c-24.5,0-44.9-20.4-44.9-44.9s20.4-44.9,44.9-44.9c24.5,0,44.9,20.4,44.9,44.9S197.8,381.7,173.3,381.7z"}));
    
    //グラフ時刻速度
    $("body").append("<span style='position: absolute;left: 744px;top: 32px;z-index: 1;color: white;font-size: 20px;' id='textTimeSpeed'>*"+ (addTimeRange/100) +"</span>")
    
    //メーター
    //$("#main").append(CreateG({transform:"translate(300,36)", id:"gMeter"}));
    $("body").append(CreateSvg({id:"svgMeter", style:"z-index: 1;position: absolute;left: 255; top: 12px;", width:360, height:51}));
    $("#svgMeter").append(CreateG({transform:"translate(30,25)", id:"gMeter"}));
    $("#gMeter").append(CreateRect({x:0, y:0, rx:3, ry:300, fill:"#555", id:"rectMeter", width:300, height:6, opacity:".8"}));
    $("#gMeter").append(CreateRect({x:0, y:0, rx:3, ry:300, fill:"#2196F3", id:"rectFillMeter", width:0, height:6, opacity:".8"}));
    $("#gMeter").append(CreateText({"x":0, "y":"-8", "fill":"#fff", "content":"", "textAnchor":"middle", id:"textTimeFrom"}));
    $("#gMeter").append(CreateText({"x":0, "y":"26", "fill":"#fff", "content":"", "textAnchor":"middle", id:"textTimeEnd"}));
    
    //日時
    //$("#main").append(CreateG({transform:"translate(70,36)", id:"gDate"}));
    $("body").append(CreateSvg({style:"z-index: 1;position: absolute; left:80px; top:24px;", width:170, height:30, id:"svgDate"}));
    $("#svgDate").append(CreateG({transform:"translate(0,13)", id:"gDate"}));
    $("#gDate").append(CreateText({x:86, y:8, fill:"#FFF", id:"textTimeDate", "content":"", "textAnchor":"middle", "fontSize":"16"}));
	$("#gDate").append(CreateCircle({cx:14, cy:2, r:14, fill:"#000", class:"contrlDateDown", opacity:".8"}));
	$("#gDate").append(CreateText({x:14, y:6, fill:"#FFF", class:"contrlDateDown", "content":"＜", "textAnchor":"middle", "fontSize":"10"}));
	$("#gDate").append(CreateCircle({cx:156, cy:2, r:14, fill:"#000", class:"contrlDateUp", opacity:".8"}));
	$("#gDate").append(CreateText({x:160, y:6, fill:"#FFF", class:"contrlDateUp", "content":"＞", "textAnchor":"middle", "fontSize":"10"}));
	
	//日時変更
	$(".contrlDateUp, .contrlDateDown").on("click", function(){
		
		var ymd = new Date($("#textTimeDate").text());
		ymd.setDate(ymd.getDate() + ($(this).attr("class") == "contrlDateUp" ? 1 : -1));
		$("#textTimeDate").text(ymd.toLocaleDateString());
		
		//本当はここで変更された日付でデータ取得を行う
		var m = ("0" + (ymd.getMonth()+1)).slice(-2);
		var d = ("0" + (ymd.getDate())).slice(-2);
		_data.data_point = _data.data_point.slice(0, _data.data_point.length - 4) + m + d;
		var url = MakeUrl(_data.data_point);
		
		
		//現在の表示をクリアする
		circlePoints.transition().duration(300).attr("opacity", 0).remove();
		textPoints.transition().duration(300).attr("opacity", 0).remove();
		pathLines.transition().duration(300).attr("opacity", 0).remove();
		if(circleStagnatePoints) circleStagnatePoints.transition().duration(300).attr("opacity", 0).remove();
		
		//右側パネル削除
		$("#statisticsDiv .divNameList.movement *").remove();
		$("#statisticsDiv .divNameList.redzone div").remove();
		$("#topicTable tbody *").remove();
		$("#topicTable tbody").append("<tr><td></td><td></td><td></td></tr>");
		
		targetLocus = new Array();
		targetStagnatePoint = new Array();

		//時間コントローラ初期化
		d3.select("#circleFillMeterFrom").transition().duration(300).attr("cx", 0);
		d3.select("#circleFillMeterEnd").transition().duration(300).attr("cx", 0);
		d3.select("#textTimeFrom").transition().duration(300).attr("x", 0);
		d3.select("#textTimeEnd").transition().duration(300).attr("x", 0);
		d3.select("#rectFillMeter").transition().duration(300).attr("x", 0).attr("width", 0);
		
		$.ajax({
	        type: 'GET',
	        url: url,
	        dataType: 'json',
	        success: function(json){
				
				if(json.status_cd == "1") return;
				
		        //data整形
		        jsonData = json.data;
		        data = {};
		        $.each(jsonData, function(i,v){
		        	v.unixTime = Number(v.unixTime);
		        });
		        jsonData.sort(function(a, b) { return a.unixTime - b.unixTime; });
		        var names = jsonData.map(function(d){ return d.name});
		        names = names.filter(function (x, i, self) {
		        	return self.indexOf(x) === i && i !== self.lastIndexOf(x);
		        });
		        $.each(names, function(i, v){
		        	data[v] = new Array();
		        	colorObj[v] = colorScaleTrain(i/names.length);
		        });
		        
//		        $.each(names, function(i, v){
//		        	comunication_cnt[v] = {};
//		        	for(var c = i+1; c < names.length; c++){
//		        		comunication_cnt[v][names[c]] = 0;
//		        	}
//		        	if(Object.keys(comunication_cnt[v]).length == 0) delete comunication_cnt[v];
//		        	else{
//		        		$.each(comunication_cnt[v], function(ii, vv){
//		        			$("#statisticsDiv .divNameList.comunication").append("<div><div class='leftComunication'><div class='up' style='color:"+ colorObj[v] +"'>"+ v +"</div><div class='down' style='color:"+ colorObj[ii] +"'>"+ ii +"</div></div><div class='rightComunication'><span id='com"+ (v+ii) +"'>"+ vv +"</span></div></div>");
//		        		})
//		        	}
//		        });
		        
		        $.each(jsonData, function(i, v){
		        	data[v.name].push(v);
		        });
		        
		        MakeHeatMapsData();
		        
		        //時間スケーリング
		        timeScale = d3.scale.linear()
	               .domain([jsonData[0].unixTime, jsonData[jsonData.length-1].unixTime])
	               .range([0, 300]);
	            timeScaleData = d3.scale.linear()
	               .domain([0, 300])
	               .range([jsonData[0].unixTime, jsonData[jsonData.length-1].unixTime]);
		        
		        //最初の時刻を表示
		        timer.End = jsonData[0].unixTime;
		        timer.From = jsonData[0].unixTime;
		        
				$("#textTimeFrom").text(new Date(timer.From).toLocaleTimeString());
				$("#textTimeEnd").text(new Date(timer.End).toLocaleTimeString());
				$("#textTimeDate").text(new Date(timer.End).toLocaleDateString());
				
				//初期描画データの取得
		        var firstPointData = Object.keys(data).map(function(d){
		        	return data[d][0];
		        });
		        drawData.circle = firstPointData;
		        
		        //動線グループ
		        pathLines = gPath.selectAll("path")
    				.data(firstPointData)
    				.enter()
    				.append("path")
    				.attr({
    					"id": function(d){
    						return d.name;
    					},
    					"class": "pathLocus",
    					"fill": "none",
    					"stroke": function(d, i){
    						return colorObj[d.name];
    					},
    					"stroke-width": 1.6,
    				});
    				
		        //点・線・ヒートマップ作成
		        MakePoint(firstPointData);
				MakeList(firstPointData);
				MakeStatisticsDivMovement(firstPointData);
				if(isHeatOn) SetHeatmapDetail(timer);
				SetHeatMapData(timer);
			}
		});
	});
	
    var drag = d3.behavior.drag()
	    .origin(function() { 
            var t = d3.select(this);
            return {x: t.attr("cx"),
                    y: t.attr("cy")};
        })
	    .on("dragstart", dragstarted)
	    .on("drag", dragged)
	    .on("dragend", dragended);
	function dragstarted(d) {
		d3.event.sourceEvent.stopPropagation();
		if(d.id == "End"){
	    	if(isAutoPlay) $("#svgAutoPlay").trigger("click");
			d3.select(this).classed("active", true);
		}
	}
	function dragged(d) {
		var x;
		if(d.id == "From"){
			var endX = Number(d3.select("#textTimeEnd").attr("x"));
			
			if(d3.event.x < 0) x = 0;
			else if(d3.event.x > endX) x = endX - 10;
			else if(d3.event.x > 300) x = 300;
			else x = d3.event.x;
			
			d3.select("#circleFillMeterFrom").attr("cx", x);
			d3.select("#textTimeFrom").attr("x", x);
			
			d3.select("#rectFillMeter").attr("x", x);
			d3.select("#rectFillMeter").attr("width", endX - x);
			
			var t = new Date(Math.floor(Number(timeScaleData(d3.select(this).attr("cx")))));
			$("#textTimeFrom").text(t.toLocaleTimeString());
		}else{
			var fromX = Number(d3.select("#textTimeFrom").attr("x"));
			
			if(d3.event.x < 0) x = 0;
			else if(d3.event.x < fromX) x = fromX;
			else if(d3.event.x > 300) x = 300;
			else x = d3.event.x;
			
			d3.select("#circleFillMeterEnd").attr("cx", x);
			d3.select("#textTimeEnd").attr("x", x);
			d3.select("#rectFillMeter").attr("width", x - Number(d3.select("#textTimeFrom").attr("x")));
			
			var t = new Date(Math.floor(Number(timeScaleData(d3.select(this).attr("cx")))));
			$("#textTimeEnd").text(t.toLocaleTimeString());
		}
	}
	function dragended(d) {
		d3.select(this).classed("active", false);
		timer[d.id] = Math.floor(Number(timeScaleData(d3.select(this).attr("cx"))));
		
		GetThisTimeData(timer);
		
		//座標更新
		if(d.id == "End"){
			SetCirclePosition(drawData.circle);
		}
		
		//動線更新
		SetLocus(drawData.paths);
		SetPathLength();
		
		//停留更新
		if(targetStagnatePoint.length > 0){
			var arr = GetThisTimeStagnatePointData(timer);
	    	SetStagnatePoint(arr);
		}
		
		//ヒートマップ更新
		if(isHeatOn) SetHeatmapDetail(timer);
		SetHeatMapData(timer);
	}
	var circleMeter = d3.select("#gMeter").selectAll("circle").data([{id:"From"},{id:"End"}]).enter().append("circle")
		.attr({
			"id":function(d){ return "circleFillMeter" + d.id; },
			"cx":0,
			"cy":3,
			"r":8,
			"fill":"#2196F3",
			"class":"circleFillMeter",
			"opacity":"1"
		})
		.call(drag);
	
	//自動再生・停止
    $("#svgAutoPlay").on("click", function(){
    	if(isAutoPlay){
    		//停止
    		clearInterval(timerAutoMove);
    		d3.select("#svgAutoPlay g path").transition().duration(300).attr("d", "M368.149,244.383l-146.883-84.805c-2.953-1.707-6.133-2.047-9.09-1.496c-0.126,0.023-0.25,0.027-0.371,0.054   c-0.715,0.152-1.394,0.379-2.07,0.645c-0.23,0.09-0.453,0.183-0.676,0.281c-0.66,0.305-1.297,0.633-1.902,1.035   c-0.062,0.043-0.117,0.094-0.179,0.137c-2,1.379-3.59,3.282-4.606,5.578c-0.054,0.125-0.11,0.242-0.16,0.367   c-0.294,0.726-0.535,1.465-0.699,2.258c-0.031,0.141-0.035,0.293-0.059,0.442c-0.133,0.762-0.316,1.504-0.316,2.32v169.606   c0,0.812,0.183,1.554,0.316,2.32c0.024,0.145,0.028,0.297,0.059,0.438c0.164,0.793,0.406,1.535,0.703,2.262   c0.05,0.122,0.102,0.238,0.152,0.359c1.019,2.305,2.617,4.211,4.625,5.59c0.055,0.039,0.102,0.086,0.16,0.125   c0.61,0.406,1.246,0.734,1.918,1.039c0.214,0.102,0.434,0.191,0.656,0.278c0.68,0.269,1.363,0.496,2.082,0.648   c0.117,0.027,0.242,0.031,0.363,0.054c2.961,0.551,6.137,0.215,9.094-1.492l146.883-84.805   C377.094,262.457,377.094,249.547,368.149,244.383z");
    	}else{
    		//自動移動
    		AutoMove(addTimeRange);
        	d3.select("#svgAutoPlay g path").transition().duration(300).attr("d", "M 180 180 h 160 v 160 h -160 z");
    	}
    	isAutoPlay = !isAutoPlay;
    });
    $("#svgSpeedUp, #svgSpeedDown").on("click", function(){
    	addTimeRange = addTimeRange + ($(this).attr("id") == "svgSpeedUp" ? 1000 : -1000);
    	if(addTimeRange < 100) addTimeRange = 100;
    	if(addTimeRange == 1100) addTimeRange = 1000;
    	$("#textTimeSpeed").text("*" + (addTimeRange/100));
    	
    	if(isAutoPlay){
    		clearInterval(timerAutoMove);
    		AutoMove(addTimeRange);
    	}
    });
    
    //フロア一覧
    $("#main").append(CreateG({"class":"gHistoryPos", "style":"transform:translate(16px, " + (h - 70) + "px); transform-origin: left bottom;"}));
    $("#main g.gHistoryPos").append(CreateG({"class":"gHistory", "style":"transform:scale("+ resolution +");transform-origin:left bottom;"}));
    $("#main g.gHistory").append(CreateG({"class":"gHistoryAnime", "style":"transform:scaleY(0.01);transform-origin:left bottom;opacity:0"}));
    function MakeFloorList(){
    	$("#main g.gHistoryAnime *").remove();
    	$.each(_data.bildings[targetBilding], function(i, v){
	    	$("#main g.gHistoryAnime").append(CreateText({"class":"floorItemCircle", "dataFilter":i, "fontSize":"28px", "fill":"#FFF", "content":"●", "y": i*-36+4}));
	        $("#main g.gHistoryAnime").append(CreateText({"class":"historyItem", "fontSize":"12px", "fill":"#FFF", "content":v.floor, "y":i*-36, "x":24}));
	        if(_data.bildings[targetBilding].length - 1 != i){
	            $("#main g.gHistoryAnime").append(CreateLine({"stroke":"#fff", "x1":8, "y1":i*-36-14, "x2":8, "y2":i*-36-29, "strokeWidth":"2"}));
	        }
	    });
    }
    
    //フロア選択
    $(".floorItemCircle").on("click", function(){
    	//Loading表示
        $(this).next().append($("text.historyItem tspan.blinking"));
        d3.select(".blinking").style("display", "block")
            .transition()
            .duration(1000)
            .attr('opacity', "1");
            
        //選択状態グラデーション
        $("g.gHistoryAnime text").css("text-shadow", "");
        $(this).css("text-shadow", "rgb(255, 255, 255) 0px 0px 5px,  rgb(255, 255, 255) 0px 0px 10px,  rgb(255, 255, 255) 0px 0px 15px,  rgb(255, 255, 255) 0px 0px 20px,  rgb(255, 255, 255) 0px 0px 25px,  rgb(255, 255, 255) 0px 0px 30px");
        $(this).next().css("text-shadow", "rgb(255, 255, 255) 0px 0px 5px,  rgb(255, 255, 255) 0px 0px 10px,  rgb(255, 255, 255) 0px 0px 15px,  rgb(255, 255, 255) 0px 0px 20px,  rgb(255, 255, 255) 0px 0px 25px,  rgb(255, 255, 255) 0px 0px 30px");
        
        //図面更新
        floorIndex = Number($(this).attr("data-filter"));
        $("#textReturn").text(_data.bildings[targetBilding][floorIndex].floor);
        LoadImage(MakePath(_data.bildings[targetBilding][floorIndex].img), function(){
        
        	if(!isAutoPlay){
	        	GetThisTimeData(timer)
	        	SetCirclePosition(drawData.circle);
	        	SetLocus(drawData.paths);
	        }
	        
	        //滞留切替
	        var arr = GetThisTimeStagnatePointData(timer);
		    SetStagnatePoint(arr);
		    
		    //レッドゾーン更新
		    MakeRedZone();
        });
    });
    
    //フロアコントローラー
    $(".historyItem").first().append(CreateTspan({"fontSize":"14", "fill":"#ffffff", "class":"blinking", "dx":"24", "content":"Construction…", "style":"display:none; opacity:0;"}));
    $(".floorItemCircle").eq(floorIndex).css("text-shadow", "rgb(255, 255, 255) 0px 0px 5px,  rgb(255, 255, 255) 0px 0px 10px,  rgb(255, 255, 255) 0px 0px 15px,  rgb(255, 255, 255) 0px 0px 20px,  rgb(255, 255, 255) 0px 0px 25px,  rgb(255, 255, 255) 0px 0px 30px");
    $(".historyItem").eq(floorIndex).css("text-shadow", "rgb(255, 255, 255) 0px 0px 5px,  rgb(255, 255, 255) 0px 0px 10px,  rgb(255, 255, 255) 0px 0px 15px,  rgb(255, 255, 255) 0px 0px 20px,  rgb(255, 255, 255) 0px 0px 25px,  rgb(255, 255, 255) 0px 0px 30px");
    $("#main").append(CreateG({"class":"switchDataMesh iconFloorPlanDetail", "style":"transform:translate(12px, "+ (h-52) +"px)"}));
    $("#main g.switchDataMesh").append(CreateRect({"x":"0", "class":"switchDataMesh", "rx":"16", "ry":"16", "width":"120", "height":"40", "fill":"rgba(0, 0, 0, 0.5)"}));
    $("#main g.switchDataMesh").append(CreateText({"font-size":"16", "fill":"#ffffff", "class":"switchDataMesh"}));
    $("#main g.switchDataMesh text.switchDataMesh").append(CreateTspan({"x":"16", "y":"24", "id":"tspanSwitchDataMesh", "class":"switchDataMesh", "content":"FloorChange"}));
    var isOpenFloorControler = false;
    $("rect.switchDataMesh, text.switchDataMesh").on("click", function(){
        d3.select("g.gHistoryAnime").transition().duration(300).ease("sin").style("transform", isOpenFloorControler ? "scaleY(0.01)" : "scaleY(1)").style("opacity", isOpenFloorControler ? 0 : 1);
        isOpenFloorControler = !isOpenFloorControler;
    });
    
    //ツールチップ
    $("body").append("<div id='tooltip'></span>");
    tooltip = d3.select("body").select("#tooltip");
    
    //サークル名表示切替
	$("body").append(CreateSvg({'width': '40px','height': '40px','id': 'switchBalloomShow','class': 'tooltipIcon iconFloorPlanDetail','title': 'tooltip','style': 'display:none; position: absolute;bottom: 12px;left: 210px;border-radius: 30px;background: rgba(0,0,0,0.3);z-index: 1;'}));
	$("#switchBalloomShow").append(CreateG({'transform':'translate(10,13) scale(0.0022,-0.0024)','class':'tooltipIcon','title':'tooltip'}));
	$("#switchBalloomShow g").append(CreatePath({'style':'fill:rgb(256,256,256); opacity:1','class':'tooltipIcon','title':'tooltip','d':'M925.3,960.2C564.6,801.8,195.1,353.1,133.5,1.2c-26.4-158.4-44-1513.4-26.4-3026.8c26.4-2613.2,35.2-2754,211.2-2982.8C723-6553.8,881.4-6615.4,2122-6641.8l1143.8-35.2l835.9-1003.1c466.3-554.3,879.9-1003,915-1003c35.2,0,448.8,448.7,915.1,1003L6767.6-6677l1143.8,35.2c1240.7,26.4,1398.9,88,1803.7,633.4c176,228.8,184.8,352,184.8,3220.4c0,2868.4-8.8,2991.5-184.8,3220.3c-96.8,132-290.3,325.5-422.3,422.3c-237.6,176-351.9,184.8-4170.6,202.4C1990,1074.6,1136.5,1057,925.3,960.2z M8536.2-1380.2v-351.9H5016.7H1497.3v351.9v352h3519.4h3519.5V-1380.2z M8536.2-2788v-351.9H5016.7H1497.3v351.9v352h3519.4h3519.5V-2788z M8536.2-4195.8v-352H5016.7H1497.3v352v351.9h3519.4h3519.5V-4195.8z'}));
	$("#switchBalloomShow").on("click", function(){
		showCircleName = !showCircleName;
		$("#switchBalloomShow g path").css("opacity", showCircleName?1:.2);
		textPoints.style("display", showCircleName ? "block" : "none");
	});
    
    //ヒートマップ表示
	$("body").append(CreateSvg({'viewBox':'-8 -8 64 64', 'width': '40px','height': '40px','id': 'showHeatMap','class':'tooltipIcon iconFloorPlanDetail','title': 'heatmap','style': 'position: absolute;bottom: 12px;left: 270px;border-radius: 30px;background: rgba(0,0,0,0.3);z-index: 1; display:none;'}));
	$("#showHeatMap").append(CreatePolygon({"fill":"#FFF", "points":"9,39 9,6 7,6 7,41 42,41 42,39","opacity":.3}))
	$("#showHeatMap").append(CreateCircle({"fill":"#FFF","cx":"14","cy":"11","r":"2","opacity":.3}))
	$("#showHeatMap").append(CreateCircle({"fill":"#FFF","cx":"32","cy":"11","r":"2","opacity":.3}))
	$("#showHeatMap").append(CreateCircle({"fill":"#FFF","cx":"39","cy":"11","r":"2","opacity":.3}))
	$("#showHeatMap").append(CreateCircle({"fill":"#FFF","cx":"23","cy":"11","r":"4","opacity":.3}))
	$("#showHeatMap").append(CreateCircle({"fill":"#FFF","cx":"14","cy":"33","r":"2","opacity":.3}))
	$("#showHeatMap").append(CreateCircle({"fill":"#FFF","cx":"30","cy":"33","r":"2","opacity":.3}))
	$("#showHeatMap").append(CreateCircle({"fill":"#FFF","cx":"22","cy":"33","r":"3","opacity":.3}))
	$("#showHeatMap").append(CreateCircle({"fill":"#FFF","cx":"38","cy":"33","r":"4","opacity":.3}))
	$("#showHeatMap").append(CreateCircle({"fill":"#FFF","cx":"14","cy":"22","r":"2","opacity":.3}))
	$("#showHeatMap").append(CreateCircle({"fill":"#FFF","cx":"39","cy":"22","r":"2","opacity":.3}))
	$("#showHeatMap").append(CreateCircle({"fill":"#FFF","cx":"32","cy":"22","r":"3","opacity":.3}))
	var isHeatOn = false;
	$("#showHeatMap").on("click", function(){
		isHeatOn = !isHeatOn;
		
		if(isHeatOn){
			
			SetHeatmapDetail(timer);
			
			$(this).children().css("opacity", 1);
			divHeatmap.transition().duration(150).style("opacity", 1);
			
		}else{
			$(this).children().css("opacity", .3);
			divHeatmap.transition().duration(150).style("opacity", 0);
		}
	});
    
    //地球儀表示
    $("body").append(CreateSvg({'viewBox':'-60 -60 620 620', 'width': '40px','height': '40px','id': 'showEarth', 'class':'tooltipIcon iconFloorPlan iconFloorPlanDetail','title': 'heatmap', 'style':'display:none; position: absolute;bottom: 12px;left: 150px;border-radius: 30px;background: rgba(0,0,0,0.3);z-index: 1;'}));
	$("#showEarth").append(CreatePath({"fill":"#FFF","d":"M496.123,167.12c-4.457-12.064-9.825-23.73-15.992-34.864c-11.674-21.088-26.21-40.373-43.13-57.261   c-0.413-0.413-0.754-0.762-1.167-1.175h-0.028c-0.48-0.476-0.937-0.936-1.445-1.404l-0.035-0.024   c-1.449-1.445-2.948-2.881-4.457-4.223C384.25,25.859,323.069,0.002,255.998,0.002c-38.948,0-75.912,8.722-108.972,24.302   c-2.27,1.071-4.532,2.174-6.754,3.31c-24.25,12.309-46.277,28.356-65.281,47.381c-27.793,27.761-49.214,61.951-61.924,100.11   c-0.639,1.921-1.27,3.873-1.861,5.817l-0.076,0.215c-0.405,1.317-0.793,2.682-1.174,4.032c-0.944,3.23-1.806,6.46-2.592,9.754   c-0.31,1.135-0.563,2.278-0.818,3.437C2.262,216.882,0,236.183,0,256c0,70.627,28.682,134.73,74.991,181.007   c26.06,26.048,57.75,46.531,93.075,59.483c1.099,0.405,2.222,0.81,3.36,1.182c6.75,2.381,13.655,4.468,20.659,6.27   c1.222,0.31,2.468,0.619,3.718,0.889c19.314,4.69,39.488,7.166,60.194,7.166c70.634,0,134.725-28.674,181.003-74.991   c8.492-8.468,16.36-17.524,23.559-27.127C492.834,367.055,512,313.706,512,256C512,224.771,506.385,194.818,496.123,167.12z    M94.789,417.221C53.512,375.897,28.015,319,28.015,256c0-11.643,0.87-23.056,2.552-34.206   c7.766,5.429,21.932,13.024,22.111,13.064c0.531,0.167,1.142,0.254,1.881,0.254c1.147,0,2.524-0.206,3.948-0.436   c1.504-0.222,3.036-0.444,4.254-0.444c0.381,0,0.742,0.016,1.028,0.071c0.527,0.238,1.393,2.238,1.849,3.31   c0.945,2.159,1.913,4.396,3.905,5.373c1.849,0.936,5.849,1.421,11.71,2.047c1.941,0.215,3.925,0.453,4.944,0.619   c0.381,0.698,0.845,2.405,1.151,3.596c0.893,3.349,1.778,6.77,4.329,8.294c2.116,1.294,9.016,7.857,12.866,11.722   c0.508,0.492,1.146,0.746,1.809,0.746c0.425,0,0.889-0.103,1.27-0.357c0.306-0.175,7.027-4.111,9.373-5.579   c0.488,0.158,1.353,0.706,2.139,1.381c0.123,3.69,0.591,15.897,0.614,18.365c-0.432,1.532-5.555,6.856-11.206,11.634   c-0.559,0.468-0.9,1.127-0.92,1.833c-0.024,0.698-0.636,16.817,0,23.294c0.666,6.563,11.436,19.389,14.333,22.722   c1.226,3.326,4.567,12.175,5.842,14.072c1.273,1.912,14.19,11.603,22.495,17.738v38.19c0,4.278,1.671,7.071,3.004,9.341   c0.818,1.349,1.452,2.413,1.452,3.381v26.746c0,3.477,1.012,6.326,2.416,8.738C133.911,450.3,112.868,435.269,94.789,417.221z    M453.413,161.755c-4.464-3.174-11.465-4.452-11.465-4.452l-5.099-0.651c-2.544-5.088-1.27-16.547-10.182-14.008   c-8.921,2.555-38.214,7.642-44.583,8.92c-6.361,1.27-14.008,11.452-19.099,19.096c-5.099,7.642-19.106,31.848-21.654,35.666   c-2.544,3.817-3.822,28.024-3.822,34.381c0,6.381,28.028,33.127,36.936,34.396c8.917,1.27,33.11-5.095,39.484-6.365   c6.369-1.286,10.186,7.635,15.282,7.635c5.095,0,11.464,2.547,6.368,10.206c-5.095,7.619-5.095,11.444,0,16.54   c5.096,5.103,15.282,24.206,8.913,39.492c-6.369,15.277-1.265,22.912,2.552,29.285c0.73,1.222,1.5,2.92,2.318,4.92   c-9.178,14.635-19.976,28.19-32.151,40.404c-41.321,41.262-98.218,66.762-161.213,66.762c-21.044,0-41.389-2.866-60.726-8.167   c0.08-0.318,0.155-0.674,0.21-1.04c0.321-2.388-0.666-4.166-1.686-5.42c1.429-0.683,2.572-1.778,3.385-3.239   c1.23-2.238,1.432-4.984,1.23-7.151l1.238,0.024c3.107,0,6.679-0.286,9.428-2.246c4.504-3.206,4.588-9.984,3.742-14.69   c0.329,0.143,0.666,0.301,0.972,0.396c0.35,0.143,0.735,0.175,1.123,0.175c4.076,0,8.584-7.326,9.798-12.175   c0.464-1.778,2.167-5.714,3.83-9.548c3.893-9.04,6.234-14.722,5.782-17.547c0.067-1.778,7.052-7.342,13.261-8.588   c7.366-1.468,9.988-4.174,12.766-13.23c2.651-8.595,3.953-22.912,3.266-29.032c-0.202-2.007,4.142-8.119,7.055-12.166   c4.735-6.682,7.619-10.952,7.619-14.286c0-7.698-6.475-12.889-11.341-16.134c-4.837-3.23-13.321-3.976-18.952-4.445   c-1.575-0.135-2.953-0.254-3.592-0.388c-0.583-0.12-1.603-1.23-2.417-2.088c-1.754-1.889-4.158-4.46-7.98-4.944   c-0.432-0.056-0.885-0.072-1.317-0.072c-2.428,0-4.584,0.762-6.698,1.5c-1.885,0.683-3.671,1.334-5.448,1.334   c-0.544,0-1.048-0.063-1.556-0.191c-0.944-0.198-1.306-0.46-1.378-0.46c0.02-0.428,0.838-1.865,2.845-3.199   c1.941-1.293,3.778-4.15,1.663-10.627c-1.503-4.666-4.285-9.079-5.396-10.73c-4-6.007-11.29-6.007-13.683-6.007   c-2.191,0-4.333,0.214-6.528,0.404l-0.476,0.016c-2.219,0-3.516-1.952-6.04-6.079c-1.429-2.342-3.035-4.961-5.266-7.659   c-4.849-5.81-11.618-6.58-17.631-6.58c-0.794,0-1.556,0-2.298,0.032c-0.634,0-1.25,0.016-1.829,0.016   c-0.814,0-1.556-0.016-2.198-0.103c-2.21-0.278-5.5-1.96-8.401-3.452c-3.182-1.635-6.19-3.191-8.738-3.548l-0.635-0.047   c-3.643,0-7.766,4.23-13.651,10.643c-1.46,1.587-3.341,3.642-4.337,4.507c-0.198-0.23-0.457-0.523-0.655-0.778   c-1.071-1.365-2.527-3.158-5.103-4.031c-0.556-0.183-1.119-0.286-1.678-0.286c-2.012,0-3.512,1.159-4.818,2.158   c-1.163,0.873-2.159,1.612-3.362,1.612c-0.706,0-1.524-0.246-2.468-0.754c-3.512-1.92-2.346-9.278-1.425-15.183   c0.436-2.714,0.845-5.27,0.845-7.421c0-4.888-2.889-5.42-4.103-5.42c-1.174,0-2.321,0.406-3.646,0.929   c-1.5,0.54-3.235,1.182-5.044,1.182c-0.814,0-1.576-0.135-2.314-0.388c-1.452-0.476-2.095-0.984-2.194-1.286   c-0.357-0.977,1.528-3.85,2.9-5.968c0.636-0.969,1.302-1.985,1.937-3.024c2.655-4.42,4.032-7.682,2.623-10.151   c-0.87-1.492-2.465-2.27-4.762-2.27c-0.885,0-1.88,0.103-3.055,0.333c-0.866,0.158-1.683,0.238-2.497,0.238   c-1.094,0-1.936-0.151-2.674-0.278c-0.69-0.11-1.222-0.214-1.686-0.214c-3.512,0-3.944,3.491-4.127,5c-0.655,5.301-3.838,8-9.417,8   c-0.413,0-0.809-0.024-1.246-0.048c-5.937-0.381-8.464-4.595-8.464-14.016c0-4.095,0.643-5.174,2.548-8.388   c0.944-1.548,2.118-3.508,3.543-6.381c3.155-6.294,5.655-7.468,8.837-8.936c0.94-0.445,1.912-0.896,2.909-1.469   c0.762-0.46,1.397-0.658,1.853-0.658c0.337,0,0.687,0.135,1.302,0.341c0.845,0.317,1.984,0.722,3.492,0.722   c0.432,0,0.888-0.015,1.396-0.087c4.687-0.801,5.679-3.548,6.548-5.968c0.108-0.254,0.202-0.524,0.338-0.865   c0.25,0.087,0.504,0.15,0.762,0.198c2.064,0.595,5.504,1.556,11.055,1.556c1.833,0,3.159,0.023,4.127,0.08   c-0.69,3.492-0.666,10.222,6.234,18.087c2.27,2.571,4.262,3.769,6.294,3.769c6.528,0,7.08-11,7.08-23.238   c0-7.396,2.805-9.42,11.107-15.349l0.54-0.397c4.508-3.198,7.187-7,9.778-10.674c2.806-3.96,5.448-7.707,10.42-10.802   c4.666-2.944,11.948-6.175,18.98-9.334c8.123-3.611,15.786-7.031,19.385-9.904c4.127-3.317,3.309-8.508,2.643-12.722   c-0.866-5.414-0.611-6.532,1.556-7.176c3.568-1.008,7.389-1.602,11.44-2.238c5.802-0.913,11.818-1.857,17.988-4.182   c6.405-2.388,7.889-5.809,8.016-8.278c0.234-4.174-3.366-7.516-6.516-9.095c-1.378-0.691-1.536-4.072-1.635-7.072   c-0.151-3.833-0.301-7.777-2.778-10.222c-1.397-1.428-3.186-2.143-5.25-2.143c-2.698,0-5.6,1.19-8.961,2.611   c-2.222,0.912-4.714,1.928-7.364,2.69c-0.286,0.08-0.536,0.135-0.738,0.135c-0.996,0-1.707-2.071-2.592-4.976   c-1.361-4.294-3.369-10.722-10.424-10.722c-0.79,0-1.659,0.072-2.572,0.254c-8.992,1.801-11.107,11.444-12.631,18.491   c-0.54,2.532-1.377,6.373-2.119,6.881c-5.298,0-7.004,3.381-8.662,6.666c-1.048,2.096-2.238,4.461-4.56,6.778   c-1.425,1.429-2.413,1.818-2.698,1.85c-0.432-0.405-1.092-3.508,1.682-9.048c1.174-2.325,2.496-5.714,0.866-8.484   c-1.913-3.238-6.44-3.452-11.667-3.642c-2.087-0.103-4.254-0.183-6.42-0.46c-4.131-0.516-5.218-1.564-5.27-1.786   c0-0.103,0.052-0.818,1.175-2.198c34.055-20.246,73.836-31.888,116.38-31.888c51.586,0,99.082,17.103,137.292,45.968   c-0.595,2.389-2.527,5.865-4.202,8.794c-2.543,4.468-1.269,7.016-1.269,7.016s12.103-1.913,14.643-3.182   c0.896-0.444,1.706-1.762,2.302-3.357c1.297,1.095,2.567,2.198,3.809,3.357c-3.028,2.745-6.281,5.626-7.381,6.372   c-1.905,1.262-8.274,3.182-10.825,4.444c-2.548,1.278,7.638,5.739,7.638,7.643c0,1.913,0,10.826-3.821,11.452   c-3.817,0.643-21.643,0.643-21.643,0.643s-5.738,20.374-4.464,22.286c1.274,1.92,9.552,6.381,14.65,5.746   c5.092-0.658,16.559-6.365,16.559-6.365l5.088-11.46l10.186-10.85c0,0,7.643,3.182,10.194,0.643   c2.544-2.54,7.642-5.079,7.642-5.079s5.096,9.539,8.278,10.818l0.615,0.278l0.016,0.039c3.679,5.064,7.115,10.278,10.318,15.659   l0.032,0.04v0.024l0.047,0.112c0.175,0.373,0.358,0.706,0.588,0.921c5.218,8.841,9.885,18.031,13.904,27.547   C462.088,167.255,457.274,164.501,453.413,161.755z"}))
	$("#showEarth").on("click", function(){
	
		//表示制御
		d3.select("#container_earth").attr({"opacity":0, "display":"block"}).transition().duration(300).style("opacity", 1)
			.transition().duration(10).delay(300).style("display", "block");
		container.transition().duration(300).style("opacity", 0)
			.transition().duration(10).delay(300).style("display", "none");
		d3.select("#main").transition().duration(300).style("opacity", 0)
			.transition().duration(10).delay(300).style("display", "none");
		
		//アイコン群の表示制御
		$(".iconEarth").css("display", "block");
		$(".iconFloorPlan, .iconFloorPlanDetail").css("display", "none");
		
		//地球儀上のツールチップ非表示
		tooltip_Earth.style("display", "block");
		
		controls.enable = false;
		controls_earth.enabled = true;
		
		window.cancelAnimationFrame(timerBilding);
		Render_earth();
	});
    
    //インフォ
    $("div#rightPanelDiv").append('<div id="infoDiv" style="display:none;"><div class="subTittle">info</div><div><input type="text" placeholder="search…" class="searchItem" id="searchInfoItem"></div><div class="divNameList"></div></div>');
    $("#searchInfoItem").keyup(function(){
        var target = $(this)[0].value;
        $.each($("#infoDiv div.divNameList").children(), function(i, v){
            var str = $(v).find("span.nameList").text();
            if (str.indexOf(target) == -1) {
                $(v).css("display", "none");
            }else{
                $(v).css("display", "inline-block");
            }
        });
    });
    
    //検索
    $("div#rightPanelDiv").append('<div id="searchDiv" style="display:none;"><div class="subTittle">search</div><div><input type="text" placeholder="search…" class="searchItem" id="searchSearchItem"></div><div class="divNameList"></div></div>');
    $("#searchSearchItem").keyup(function(){
    	searchInput = $(this)[0].value.toLowerCase();
		var c=0;
		
		if(searchInput == ""){
			serchPanelDivs.style("display", "block")
			circlePoints.style("opacity", ".8")
			textPoints.style("opacity", ".5")
		}else{
			//検索ボックスの一覧をフィルタリングする
			serchPanelDivs.style("display", "none")
				.filter(f=>(f.toLowerCase().indexOf(searchInput) > -1))
				.style("display", "block");
			
			circlePoints.style("opacity",  function(d){
	        	if (d.name.toLowerCase().indexOf(searchInput) == -1) return 0.1;
	        	else {
	        		c++;
	        		return .9;
	        	}
	        });
	        textPoints.style("opacity",  function(d){
	        	if (d.name.toLowerCase().indexOf(searchInput) == -1) return 0.1;
	        	else {
	        		return .9;
	        	}
	        });
		}
		//ヒートマップ更新
        if(isHeatOn) SetHeatmapDetail(timer);
    });
    
    //トピック
    $("div#rightPanelDiv").append('<div id="topicDiv"><div class="subTittle">Topic</div><table id="topicTable"><tbody><tr><td></td><td></td><td></td></tr></tbody></table></div>');
    var topicHight = $("#sumaryDiv").position().top - $("#topicTable").position().top - 24;
    $("#topicTable").css({"height":topicHight + "px"});
    
    //トピック挿入
    var _topicRowHeight = 60;
    var topicCount = topicHight / _topicRowHeight;
    function InsertTopic(d, strEvent){
    	
    	if($("#topicTable tbody tr").length >= topicCount) $("#topicTable tbody tr:last-child").fadeOut(100, function() {
        	$.each($("#topicTable tbody tr"), function(i, tr){
        		if(i >= topicCount) $(tr).remove();
        	});
        });
        
        //トピック追加
        $('#topicTable tbody').prepend("<tr style='height:"+ _topicRowHeight +"px'><td><div>" + d.time + "</div><div>" + strEvent + "</div></td><td><div class='divTopicMiddleTd'><div style='color:"+ colorObj[d.name] +"'>" + d.name + "</div><div>" + d.division + "</div></div></td><td><div>" + d.floor + "</div></td></tr>");
        
        //スライドダウンアニメーション
        $('#topicTable tbody tr:first-child').find('td').wrapInner('<div style="display: none;" />');
        $('#topicTable tbody tr:first-child').find('td > div').slideDown( 100 );
        
        //トピックの名称の幅調整
        var w = 250 - 12 - $('#topicTable tbody tr:first-child td:first-child').outerWidth(true) - $('#topicTable tbody tr:first-child td:nth-of-type(3)').outerWidth(true)
        $('#topicTable tbody tr div.divTopicMiddleTd>div').width(w);
        //$('#topicTable tbody tr div.divTopicMiddleTd').width(w);
    }
    
    //統計
    $("div#rightPanelDiv").append('<div id="statisticsDiv" style="display:none;"><div class="subTittle">Statistics</div><div><input type="text" placeholder="search…" class="searchItem" id="searchStatisticsItem"></div><div class="divNameList"></div></div>');
    $.each(statisticsModel, function(i, v){
    	$("#statisticsDiv").append('<div class="divNameList '+ v.class +'" style="display:'+ (i==0?"block":"none") +'; height:'+ (topicHight-12) +'px;"></div>');
    })
    $("#statisticsDiv div.subTittle").append('<span id="spanStatisticsCategory">移動距離 ▼</span>');
    var statisticsIndex = 0;
    $("#spanStatisticsCategory").on('click', function(){
    	
        statisticsIndex = (statisticsIndex + 1) % statisticsModel.length;
        $(this).text(statisticsModel[statisticsIndex].name + " ▼");
        $("#statisticsDiv div.divNameList").css("display", "none");
        $("#statisticsDiv div.divNameList."+ statisticsModel[statisticsIndex].class).css("display", "block");
    });
    $("#searchStatisticsItem").keyup(function(){
        var target = $(this)[0].value;
        $.each($("#statisticsDiv .divNameList.movement").children(), function(i, v){
            var str = $(v).find("span.nameList").text();
            if (str.indexOf(target) == -1) {
                $(v).css("display", "none");
            }else{
                $(v).css("display", "inline-block");
            }
        });
    });
    
    //移動距離一覧作成
    function MakeStatisticsDivMovement(pointData){
    	$("#statisticsDiv .divNameList.movement *").remove();
    	$.each(pointData, function(i, v){
			$("#statisticsDiv .divNameList.movement").append("<div><span class='nameList' style='color:"+ colorObj[v.name] +"'>"+ v.name +"</span><span class='migration'>0m</span></div>");
		})
    }
    
    var _statisticsCount = 5;
    function MakeStatisticsSvg(graphData, targetTableId){
	    var svg = d3.select("#" + targetTableId).append("svg")
            .attr("width", $("#rightPanelDiv").width()).attr("height", 20 * _statisticsCount);
        
        var maxVal = Math.max.apply(null, Object.keys(graphData).map(key => graphData[key].value));
	    svg.selectAll("rect")   // SVGでの四角形を示す要素を指定
	        .data(graphData.slice(0, 5)) // データを設定
	        .enter()
	        .append("rect")
	        .attr("x", function(d,i){
	            if(d.value == 0 || !d.value) return 0;
	            else return $("#rightPanelDiv").width() - (d.value / maxVal * $("#rightPanelDiv").width() * 0.5) - 40;
	        })
	        .attr("y", function(d,i){   // Y座標を配列の順序に応じて計算
	            return (i * 20);
	        })
	        .attr("width", function(d){ // 横幅を配列の内容に応じて計算
	            if(d.value == 0 || !d.value) return "0px";
	            else return (d.value / maxVal * $("#rightPanelDiv").width() * 0.5) + "px";
	        })
	        .attr("height", "12")   // 棒グラフの高さを指定
	        .attr("fill", "rgba(158,158,158,0.8)");
	        
	    svg.selectAll("text.statisticsItemName")
	        .data(graphData.slice(0, 5))
	        .enter()
	        .append("text")
	        .text(function(d, i){
	            return (i+1) + ". " + d.category;
	        })
	        .attr("class", "statisticsItemName")
	        .attr("x", 24)
	        .attr("y", function(d,i){
	            return (i * 20 + 10);
	        })
	        .attr("font-size", 12)
	        .attr("fill", "#FFF")
	        
	    svg.selectAll("text.statisticsItemValue")
	        .data(graphData.slice(0, 5))
	        .enter()
	        .append("text")
	        .text(function(d){
	            return d.value;
	        })
	        .attr("class", "statisticsItemValue")
	        .attr("x", function(d,i){
	            return $("#rightPanelDiv").width() - 6;
	        })
	        .attr("y", function(d,i){
	            return (i * 20 + 10);
	        })
	        .attr("text-anchor", "end")
	        .attr("font-size", 12)
	        .attr("fill", "#FFF")
	}
	
	//フィルタリングDOM作成
	$("div#rightPanelDiv").append('<div id="filterDiv" style="display:none;"><div class="subTittle">Filter<span id="spanFilterCategory"></span></div><div><input type="text" placeholder="search…" id="searchFilterItem"></div><div class="divFilterItemList" style="overflow-x: hidden; overflow-y: scroll;"></div><div class="divSelectedFilterItem"></div></div>');
    $.each(_data.category, function(i, v){
    	$("div.divFilterItemList").append("<ul id='ul"+ v.column +"' style='display:"+ (i==0 ? "block" : "none") +";'></ul>");
    });
    $("#spanFilterCategory").text(_data.category[0].name + " ▼");
    var ind = 0;
    $("#spanFilterCategory").on("click", function(){
    	ind = (ind + 1) % _data.category.length;
        filterCategoryIndexNm = _data.category[ind].column;
        $("#spanFilterCategory").text(_data.category[ind].name + " ▼");
        $(".divFilterItemList ul").css("display", "none");
        $("#ul" + filterCategoryIndexNm).css("display", "block");
        $("#searchFilterItem").val('');
    });
    //フィルタリングアイテム検索ボックス
    $("#searchFilterItem").keyup(function(){
        var target = $(this)[0].value;
        $.each($("div.divFilterItemList ul:visible").children(), function(i, v){
            var str = $(v).find("label input").val();
            if (str.indexOf(target) == -1) {
                $(v).css("display", "none");
            }else{
                $(v).css("display", "block");
            }
        });
    });
    
    //検索ウィンドウを選択可能にする
    $("#searchInfoItem, #searchFilterItem, #searchStatisticsItem, #searchSearchItem").on('mouseover', function(){
		if(controls)controls.enabled = false;
	}).on('mouseout', function(){
		if(controls)controls.enabled = true;
	});
	
    var filterObj = {};
    function MakeFilter(obj){
    	$.each(obj, function(i, v){
    		filterObj[v.column] = new Array();
    		$.each(v.list, function(ii, vv){
	            $("#ul" + v.column).append("<li><label><input type='checkbox' class='checkbox' value='"+ FairingName(vv) +"'/><span class='checkbox-icon'>"+ vv +"</span></label></ul>");
	        });
	        //チェックボックスチェックイベント
	        $("#ul" + v.column +" li input").change(function(){
	        	
	        	if ($(this).is(':checked')) {
                    $('div.divSelectedFilterItem').prepend('<span class="spanSelectedFilterItem '+ this.value +'">'+ this.value +'<span class="spanClearFilter">&#10006;</span></span>');
                    //style="width:'+ (this.value.length * 11) +'px;"
                    $("span.spanClearFilter").off('click');
                    $("span.spanClearFilter").on("click", function(){
                        $("input[value='"+ FairingName($(this).parent().text().slice(0,-1)) +"']").prop("checked", false).change();
                        $(this).parent().remove();
                    });
                    
                    filterObj[v.column].push(this.value);
                } else {
                	//フィルタリング解除
                    var target = this.value;
                    $('div.divSelectedFilterItem span.'+ target).remove();
                    filterObj[v.column].some(function(vvv, iii){
                        if (vvv == target) filterObj[v.column].splice(iii, 1);
                    });
                }
                
                //フィルタリング
                circlePoints.style("display", "block")
                .filter(function(f){
                	var hidden = false;
                	$.each(filterObj, function(i,v){
                		if(v.length > 0 && v.indexOf(f[i]) == -1) hidden = true;
                	})
                	return hidden;
                }).style("display", "none");
                
				textPoints.style("display", "block")
				.filter(function(f){
                	var hidden = false;
                	$.each(filterObj, function(i,v){
                		if(v.length > 0 && v.indexOf(f[i]) == -1) hidden = true;
                	})
                	return hidden;
                }).style("display", "none");
                
                pathLines.style("display", "block")
				.filter(function(f){
                	var hidden = false;
                	$.each(filterObj, function(i,v){
                		if(v.length > 0 && v.indexOf(f[i]) == -1) hidden = true;
                	})
                	return hidden;
                }).style("display", "none");
                
                //滞留を更新する
                if(circleStagnatePoints){
                	var arr = GetThisTimeStagnatePointData(timer);
	    			SetStagnatePoint(arr);
                }
                
                //ヒートマップ更新
                if(isHeatOn) SetHeatmapDetail(timer);
                
                //infoの座標点一覧でフィルタ除外項目は表示させない
                pointList.style("display", "block")
				.filter(function(f){
                	var hidden = true;
                	$.each(filterObj, function(i,v){
                		if(v.length == 0 ) hidden = false;
                		else if(v.indexOf(f[i]) > -1) hidden = false;
                	})
                	return hidden;
                }).style("display", "none");
                
	        	WriteFilterDescription(filterObj)
	        });
    	})
    }
    
    //ラベル文言・円生成
    function MakeLabel(dLabel){
    	//ラベル
	    var labelPositionY = 80 * resolution;
	    var isLabelOpen = false;
	    $("#main").append(CreateG({"class":"gLabelPos", "style":"transform:translate(0px, "+ labelPositionY +"px);"}));
	    $("#main g.gLabelPos").append(CreateG({"class":"gLabelZoom"}));
	    $("#main g.gLabelZoom").append(CreateG({"class":"gLabel"}));
	    $("#main g.gLabelZoom").append(CreateG({"class":"gLabelClose"}));
	    $("#main g.gLabel").append(CreateRect({"x": -30,"rx": 18,"ry": 18,"height":36,"fill":"rgba(0, 0, 0, .5)"}));

	    $("#main g.gLabelClose").append(CreateImage({"x": "20","y":"10.5","visibility": "visible","id": "closeLabel","class": "tooltipIcon","title": "label","href": MakePath("icon/icon_label.png"),"width":"16","height":"16"}));
	    $("#closeLabel").on('click', function(){
	        if(isLabelOpen){
	            d3.select("g.gLabel")
	                .transition()
	                .duration(150)
	                .delay(100)
	                .ease("sin")
	                .style("transform", "translate(" + ((-labelRectWidth + 80)) + "px, 0px)");
	            d3.selectAll("g.gLabel text, g.gLabel circle, g.gLabel line, text.zoomVisible")
	                .transition()
	                .duration(150)
	                .ease("sin")
	                .attr("opacity", "0");
	            d3.select("#main g.gLabel rect")
	                .transition()
	                .duration(150)
	                .ease("sin")
	                .attr("rx", 18 * resolution);
	            isLabelOpen = false;
	        }else{
	            d3.selectAll("#main g.gLabel text, g.gLabel line")
	                .transition()
	                .duration(150)
	                .delay(100)
	                .ease("sin")
	                .attr("opacity", "0.8");
	            d3.select("g.gLabel")
	                .transition()
	                .duration(150)
	                .ease("sin")    
	                .style("transform", "translate(0px, 0px)")
	            d3.select("#main g.gLabel rect")
	                .transition()
	                .duration(150)
	                .ease("sin")
	                .attr("rx", 18);
	            d3.selectAll("circle.labelCircle")
	                .transition()
	                .duration(150)
	                .delay(100)
	                .ease("sin")
	                .attr("opacity", "0.8");
	            isLabelOpen = true;
	        }
	    });
    
    	var cx = 0;
    	$("#main g.gLabel").append(CreateLine({"stroke":"#fff", "x1":50, "y1":"6", "x2":50, "y2":"30", "stroke-width":"0.5"}));
	    var n = 80;
	    $.each(dLabel, function(i, v){
	        if($("#main g.gLabel text:last-of-type").length > 0) n = $("#main g.gLabel text:last-of-type").position().left + $("#main g.gLabel text:last-of-type").width() + 24/resolution;
	        $("#main g.gLabel").append(CreateText({"x":n, "y":"22", "fill":"#fff", "content":i, "dataFilter":i}));
	        cx = $("#main g.gLabel text:last-of-type").position().left - 12/resolution;
	        $("#main g.gLabel").append(CreateCircle({"cx":cx, "cy":"18", "r":"6", "class":"labelCircle", "stroke-width":"0", "opacity":"0.8", "fill":v.color, "dataFilter":i}));
	    });
	    
	    labelRectWidth = $("#main g.gLabel text:last-of-type").position().left + 150;
	    $("#main g.gLabel").css("transform", "translate(" + ((-labelRectWidth + 80)) + "px, 0px)");
	    $("#main g.gLabel rect").attr("width", labelRectWidth).attr("rx", 18 * resolution);
	    //ラベルの初期表示スタイル
	    $("g.gLabel text, g.gLabel circle, g.gLabel line").attr("opacity", "0");
	    $("circle.labelCircleZoomVisible").attr("opacity", 0.1);
	    //ズーム調整
	    $("#main g.gLabelZoom").css({"transform":"scale(" + resolution + ")", "transform-origin":"left top"});
	    
	    $("g.gLabel circle.labelCircle");
    }
    
    $("body").append('<input type="file" multiple id="file" style="position:absolute; top:25%; left:40%; z-index:9999;">');
    document.getElementById( "file" ).addEventListener( "change", function() {
		var fileList = this.files ;
		$.each(fileList, (i,v)=>{
			var fileReader = new FileReader() ;
			fileReader.onload = function(e) {
				// データURIを取得
				var name = v.name.replace(/(\.[^.]+$)/g, '');
				mapUri[name] = this.result;//JSON.parse(e.target.result);//json調査用
				
				if(Object.keys(mapUri).length == fileList.length){
					$("#file").remove();
					GetData();
					window.HumanFlow.finished = true;
				}
			}
			fileReader.readAsDataURL( v );
		})
	} ) ;
    
    //画面リサイズ
    function WindowResize(){
    	camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', WindowResize);
    
    //ローディング削除
    function HideLoading(){
    	$("#loadingDiv").css({
            "opacity": "0",
            "-webkit-transition": "1s",
            "transition": "1s"
        });
        setTimeout(function(){
            $("#loadingDiv").css("display","none");
        }, 1000);
    }
    
    //現在の座標点と動線の算出
    function GetThisTimeData(time){
    	drawData.paths = new Array();
    	$.each(Object.keys(data), function(i, v){
    		
    		var arr = data[v].filter(function(f){
        		return (f.unixTime >= time.From && f.unixTime <= time.End)
        	});
        	
			var obj = {};
    		obj.name = v;
    		
    		$.each(_data.category, function(ii, vv){
    			obj[vv.column] = data[v][0][vv.column];
    		})
    		
    		if(arr.length > 0){
        		obj.paths = arr.filter(function(f){
        			return (f.floor == _data.bildings[targetBilding][floorIndex].floor);
        		});
    		}
    		drawData.paths.push(obj);
			
			if(arr.length == 0 ){
        		//未出勤データはhidden属性を付加する
        		drawData.circle[i] = data[v][0];
        		drawData.circle[i].hidden = true;
        	}else{
        		var newObj = arr[arr.length-1];
        		//出社
        		if(drawData.circle[i].hidden == true) {
        			delete drawData.circle[i].hidden;
        			InsertTopic(newObj, "Arrival");
        			serchPanelSapns.filter(f => f == newObj.name)
        				.text(newObj.floor);
        		}
        		
        		//フロア移動
        		if(drawData.circle[i].floor != newObj.floor) {
        			InsertTopic(newObj, "FloorChane");
        			serchPanelSapns.filter(f => f == newObj.name)
        				.text(newObj.floor);
        		}
        		
        		//フリスぺに侵入した時
        		if(!IsRedZone(drawData.circle[i]) && IsRedZone(newObj)){
        			redZoneStagnation[newObj.name] = newObj;
        			InsertTopic(newObj, "RedZoneIn");
        		}
        		
        		//フリスぺから離れたとき
        		if(IsRedZone(drawData.circle[i]) && !IsRedZone(newObj) && redZoneStagnation.hasOwnProperty(newObj.name)){
        			var t = newObj.unixTime - redZoneStagnation[newObj.name].unixTime;
        			if(t > 0 ){
	        			t = Math.floor(t/6000)/10;
	        			var v = redZoneStagnation[newObj.name];
	        			var n = GetRedZone(v);
	        			//統計実績作成
	        			$("#statisticsDiv .divNameList.redzone").prepend("<div><div class='mainStatistics'><span class='key' style='color:"+ colorObj[v.name] +"'>"+ v.name +"</span><span class='value'>"+ t +" 分</span></div><div class='subStatistics'><span class='key'>"+ n.floor + " " + n.name +"</span><span class='value'>"+ v.time +"</span></div></div>");
	        			var w = 238 - 12 - $("#statisticsDiv .divNameList.redzone div:first-child div.mainStatistics span.value").text().length * 12 - 12;
	        			$("#statisticsDiv .divNameList.redzone div:first-child div.mainStatistics span.key").width(w);
        			}
        			delete redZoneStagnation[newObj.name];
        		}
        		drawData.circle[i] = newObj;
        	}
        });
        
        //ビル表示時の位置アイコンが存在するときはアイコン位置を更新してあげる
        if(controls.enable && groupNames.children.length > 0){
        	$.each(groupNames.children, (i,v)=>{
    			var f = drawData.circle.filter(f => f.name == v.name)
    			if(f.length>0){
    				var c = groupNames.getObjectByName(f[0].name);
		    		if(c){
		    			var h = _data.bildings[targetBilding].filter(ff => (ff.floor == f[0].floor));
		    			c.position.set(f[0].x - h[0].w/2, h[0].floorHeight + 24, f[0].y - h[0].h/2);
		    		}
    			}
    		})
    	}
    	
//		//コミュニケーションカウント
//		var l = Object.keys(redZoneStagnation).length;
//		if(l > 1){
//			for(var c = 0; l > c; c++){
//				var from = drawData.circle[c];
//				
//				for(var cc = c+1; l > cc; cc++){
//					var to = drawData.circle[cc];
//					var d = Math.sqrt(Math.pow((from.x - to.x), 2) + Math.pow((from.y - to.y), 2));
//					
//					if(scaleDetailReverse(d) < 5){ //5m以内であればコミュニケーションをとったとカウントする
//						if( !new_comunications.hasOwnProperty(from.name + to.name)){
//							comunication_cnt[from.name][to.name]++;
//							
//							//コミュニケーション追加
//	        				$("#com" + from.name + to.name).text(comunication_cnt[from.name][to.name]);
//						}
//						new_comunications[from.name + to.name] = 1;
//					}else{
//						delete new_comunications[from.name + to.name];
//					}
//				}
//			}
//		} else new_comunications = {};
    }
    
    //停滞の算出
    function GetThisTimeStagnatePointData(time){
    	var arr = Object.keys(data).map(function(m){
    		var isTarget = (targetStagnatePoint.indexOf(data[m][0].name) > -1);
    		if(isTarget && $('div.divSelectedFilterItem span').length > 0){
    			var isTarget = false;
    			$.each(filterObj, function(i,v){
    				if(v.length > 0) {
    					if(v.indexOf(data[m][0][i]) > -1) isTarget = true;
    				}
    			})
    		}
    		if(isTarget){
    			return data[m].filter(f => (f.unixTime >= time.From && f.unixTime <= time.End))
    		}
    	})
    	return Array.prototype.concat.apply([], arr.filter(Boolean));
    }
    
    function AutoPlayHeatMap(time){
    	$.each(heatmaps, function(i,v){
    		if(v.thisTimeData.length == 0){
	    		v.thisTimeData = v.allTimeData.filter(function(f){
	    			return (f.time >= time.From && f.time <= time.End)
	    		})
	    		if(v.thisTimeData.length > 0){
	    			v.heatmap.setData({ min:0, max: v.maxAllData, data: v.thisTimeData});
	    		}
	    	}else{
	    		var d = v.allTimeData.filter(function(f){
	    			return (f.time >= time.From && f.time <= time.End)
	    		})
	    		var dd = d.slice(v.thisTimeData.length);
	    		if(dd.length > 0){
	    			v.thisTimeData = d;
	    			//ヒートマップデータ追加
	    			//v.heatmap.addData(dd.map(function(ddd){return {x:ddd.x, y:ddd.y, value:ddd.value}}));
	    			//v.heatmap.addData(dd);
	    			v.heatmap.setData({data:d, min:0, max:v.maxAllData});
	    		}
	    	}
    	})
    }
    
    function AutoPlayHeatMapDetail(time){
    	
    	if(heatmapDetail.thisTimeData.length == 0){
    		heatmapDetail.thisTimeData = heatmapDetail.allTimeData.filter(function(f){
    			return (f.time >= time.From && f.time <= time.End)
    		})
    		if(heatmapDetail.thisTimeData.length > 0){
    			heatmapDetail.heatmap.setData({ data: heatmapDetail.thisTimeData, min:0, max: heatmapDetail.maxAllData});
    		}
    	}else{
    		var d = heatmapDetail.allTimeData.filter(function(f){
    			return (f.time >= time.From && f.time <= time.End)
    		})
    		var dd = d.slice(heatmapDetail.thisTimeData.length);
    		if(dd.length > 0){
    			heatmapDetail.thisTimeData = d;
    			//heatmapDetail.heatmap.addData(dd.map(function(ddd){return {x:ddd.x, y:ddd.y, value:ddd.value}}));
    			//heatmapDetail.heatmap.addData(dd);
    			heatmapDetail.heatmap.setData({data:d, min:0, max:heatmapDetail.maxAllData});
    		}
    	}
    }
    
    function SetHeatMapData(time){
    	var firstDrawData = Object.keys(data).map(m => data[m].filter(f => (f.unixTime <= timer.End)).getLastVal());
        firstDrawData = Array.prototype.concat.apply([], firstDrawData.filter(Boolean));
        
        $.each(heatmaps, function(i,v){
        	var drawData = firstDrawData.filter(f => (f.floor == i));
        	drawData = drawData.map(m => {return {x:m.xHeat, y:m.yHeat, value:m.value}});
			if(drawData.length > 0) heatmaps[i].heatmap.setData({min:0, max:2, data: drawData});
			else heatmaps[i].heatmap.setData({min:0, max:2, data:[{x:0, y:0, value:0}]});
        })
    }
    
    function SetHeatmapDetail(time){
    	
    	//指定時間・フロアでの絞り込み
    	var drawData = Object.keys(data).map(m => data[m].filter(f => (f.unixTime <= timer.End)).getLastVal());
    	drawData = Array.prototype.concat.apply([], drawData.filter(Boolean));
    	drawData = drawData.filter(f => f.floor == _data.bildings[targetBilding][floorIndex].floor);
    	 
        //フィルタ指定範囲外は算出しない
		if($('div.divSelectedFilterItem span').length > 0){
			drawData = drawData.filter(function(f){
				$.each(filterObj, function(i,v){
					if(v.length > 0) {
						if(v.indexOf(f[i]) == -1) return false;
					}
				})
				return true;
			})
		}
		
		//検索対象外も外す
		if(searchInput.length > 0){
			drawData = drawData.filter(function(f){
				return (f[0].name.toLowerCase().indexOf(searchInput) > -1)
			})
		}
		
		//ヒートマップjsのバグで座標は整数で渡さないと正しく描画されない。
		drawData = drawData.map(m => {return {x:m.xHeat, y:m.yHeat, value:m.value}})
		
		//グラフの設定 ※ここで階層ごとにヒートマップの最大値を変更して表示したい時は、階層と絞り込み条件適用下での最大値を適用すること
		heatmapDetail.heatmap.setData({min:0, max:2, data:drawData});
    }
    
    function SetCirclePosition(circlePoint){
    	circlePoints.transition();
    	circlePoints.data(circlePoint)
    		.transition().duration(100)
    		.attr({
        		"cx": (d => d.x),
        		"cy": (d => d.y),
        	})
        	.style({
        		"visibility": function(d){
	    			var show = "visible";
	    			if(d.hasOwnProperty("hidden")) show = "hidden";
	    			else if(d.floor != _data.bildings[targetBilding][floorIndex].floor) show = "hidden";
	    			return show;
	    		},
	    	})
    	
    	textPoints.data(circlePoint)
    		.transition().duration(100)
    		.attr({
        		"x": (d => d.x + 6),
        		"y": (d => d.y - 6),
        	})
        	.style({
        		"visibility": function(d){
	    			var show = "visible";
	    			if(d.hasOwnProperty("hidden")) show = "hidden";
	    			else if(d.floor != _data.bildings[targetBilding][floorIndex].floor) show = "hidden";
	    			return show;
	    		},
	    	})
    }
    
    function SetPathLength(){
    	var scale = mapScales[targetBilding][_data.bildings[targetBilding][floorIndex].floor];
    	$.each(pathLines[0], function(i, v){
    		var l = formatThou(Math.floor(scale.scaleDetailReverse(v.getTotalLength()) * 0.3048)); //FEETからメートル変換
    		$("#statisticsDiv .divNameList div:nth-of-type("+ (i+1) +") span.migration").text(l + " m");
    	})
    }
    
    
    function SetLocus(objArr){
    	if(objArr && objArr.length > 0){
    		pathLines
	    		.data(objArr)
	    		.attr({
	    			"d": function(d){
	    				var pathD = "M";
	    				if(d.hasOwnProperty("paths") && d.paths.length > 0){
	    					$.each(d.paths, function(i, v){
					    		pathD += v.x.toString() + "," + v.y.toString() + " ";
					    	});
	    				}else{
	    					pathD += "0,0";
	    				}
			    		return pathD;
		    		},
		    		"id": function(d){ return d.name; },
		    		"class": "pathLocus",
					"fill": "none",
		    	})
		    	.style("visibility", function(d){
		    		if(targetLocus.indexOf(d.name) > -1) return "visible";
		    		else return "hidden";
		    	})
	    		.transition().duration(100)
	    		.attr("opacity", .9);
    	}else{
    		pathLines.remove();
    	}
    }
    
    
    function SetStagnatePoint(objArr){
    	if(objArr && objArr.length > 0){
    		if(circleStagnatePoints) circleStagnatePoints.remove();
    		circleStagnatePoints = gStagnatePoints.selectAll("circle").data(objArr).enter().append("circle")
	        	.attr({
	        		"r": function(d){
	        			return sizeScale(d.stagnation);
	        		},
	        		"fill":function(d){ 
	        			return colorObj[d.name]; //d.color ? d.color : "#FFF";
	        		},
	        		"opacity": ".5",
	        		"class": "toolCircle",
	        		"cx": function(d){return d.x;},
	        		"cy": function(d){return d.y;}
	        	})
	        	.on("mouseover", function(d){
	        		tooltip.style({
		        		"visibility": "visible",
		        		"opacity": 0
		        	})
		        	.html(
			            "<div><span class='toolLeft'>name:</span><span class='toolRight'>"+ d.name +"</span></div><div><span class='toolLeft'>time：</span><span class='toolRight'>"+ d.time +"</span></div><div><span class='toolLeft'>stay:</span><span class='toolRight'>"+ Math.floor(d.stagnation/6000)/10 +"分</span></div>"
			        )
			        .transition()
			        .duration(200)
			        .style("opacity", 1);
			        
			        $("#tooltip .toolRight").css("color", d.color);
	        	})
	        	.on("mousemove", function(d){
	        		return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
	        	})
	        	.on("mouseout", function(){
	        		return tooltip.style("visibility", "hidden");
	        	});
    	}else{
    		if(circleStagnatePoints) circleStagnatePoints.remove();
    	}
    }
    
    function AutoMove(time){
    	//座標点更新
        timerAutoMove = setInterval(function(){
        	//時計更新
        	timer.End += time;
        	$("#textTimeEnd").text(new Date(timer.End).toLocaleTimeString());
        	
        	//データ取得
        	GetThisTimeData(timer);
        	
        	//ヒートマップの更新
	        if(controls.enabled){
	        	SetHeatMapData(timer);
	        }else{
	        	//位置設定
	        	SetCirclePosition(drawData.circle);
		        SetLocus(drawData.paths);
		        SetPathLength();
		        
		        var arr = GetThisTimeStagnatePointData(timer);
		    	SetStagnatePoint(arr);
	    	
	        	//ヒートマップ詳細の更新
	        	if(isHeatOn) SetHeatmapDetail(timer);
	        }
	        
	        //メーターの位置を更新
	        var x = timeScale(timer.End);
	        d3.select("#circleFillMeterEnd").attr("cx", x);
			d3.select("#textTimeEnd").attr("x", x);
			d3.select("#rectFillMeter").attr("width", x);
        	
        	//最後までいった場合は中止
        	if(jsonData[jsonData.length-1].unixTime < timer.End){
        		$("#svgAutoPlay").trigger("click");
        	}
        }, 100)
    }
	
	var targetLocus = new Array();
	function ClickShowLocus(d){
		
		if(targetLocus.length == 1 && targetLocus.indexOf(d.name) != -1){
			//全解除
			targetLocus = new Array()
			$(this).css("background", "#000");
			
			pathLines
	    		.transition().duration(100)
	    		.attr("opacity", "0");
	    	
	    	circlePoints
	    		.classed("active", false)
	    		.attr("opacity", ".8");
			
			textPoints.attr("opacity", ".8");
			
		}else if(targetLocus.indexOf(d.name) != -1){
			//奇跡の削除
			var dekIndex = targetLocus.indexOf(d.name);
			targetLocus.splice(dekIndex, 1);
			$(this).css("background", "#000");
			
			pathLines
				.filter(function(d){
					return (targetLocus.indexOf(d.name) == -1);
				})
	    		.transition().duration(100)
	    		.attr("opacity", 0);
	    	
	    	circlePoints
	    		.filter(function(d){
					return (targetLocus.indexOf(d.name) == -1);
				})
	    		.classed("active", false)
	    		.attr("opacity", ".4");
			
			textPoints
				.filter(function(d){
					return (targetLocus.indexOf(d.name) == -1);
				})
	    		.attr("opacity", ".4");
			
		}else{
			targetLocus.push(d.name);
			
			circlePoints
				.classed("active", false)
				.attr("opacity", ".4")
				.filter(function(d){
					return (targetLocus.indexOf(d.name) != -1 && d.unixTime < timer.End);
				})
				.attr("opacity", ".8")
				.attr("class", "active")
				
				
			textPoints
				.attr("opacity", ".4")
				.filter(function(d){
					return (targetLocus.indexOf(d.name) != -1 && d.unixTime < timer.End);
				})
				.attr("opacity", ".8");
			
			if(!isAutoPlay){
				//自動再生でない場合は点線を作成する
				GetThisTimeData(timer);
		    	SetLocus(drawData.paths);
		    	SetPathLength();
			}
			
			//押下されたボタンの見た目
			$(this).css("background", "#2196F3");
		}
	}
	
	var targetStagnatePoint = new Array();
	function ClickShowStagnatePoint(d){
		
		if(targetStagnatePoint.length == 1 && targetStagnatePoint.indexOf(d.name) != -1){
			//全解除
			targetStagnatePoint = new Array()
			$(this).css("background", "#000");
			
			//停留削除
			circleStagnatePoints.remove();
			
		}else if(targetStagnatePoint.indexOf(d.name) != -1){
			//奇跡の削除
			var dekIndex = targetStagnatePoint.indexOf(d.name);
			targetStagnatePoint.splice(dekIndex, 1);
			$(this).css("background", "#000");
			
			var arr = GetThisTimeStagnatePointData(timer);
	    	SetStagnatePoint(arr);
	    	
		}else{
			targetStagnatePoint.push(d.name);
			
			//自動再生でない場合は点線を作成する
			var arr = GetThisTimeStagnatePointData(timer);
	    	SetStagnatePoint(arr);
	    	
			//押下されたボタンの見た目
			$(this).css("background", "#2196F3");
		}
	}
	
	//図面作成
	function LoadImage(path, callback){
    	var img = new Image();
		var aspc;
		function ImageLoadFunc(e){
			
			aspc = img.width / img.height;
			var img_w = w-250, img_h = (w-250) / aspc;
			
			if($("#gFloorMap image").length > 0){
				d3.select("#gFloorMap image").transition().duration(300).attr("opacity", 0)
					.delay(300)
					.remove()
					.each('end',  function(d){
						$("#gFloorMap").append(CreateImage({href:path, width: img_w, height: img_h, opacity:.42 }));
		            });
			}else{
				$("#gFloorMap").append(CreateImage({href:path, width: img_w, height: img_h, opacity:.42 }));
			}
			
			//フロア詳細のヒートマップのスケール更新
			$("#divHeatmap").css({
				"height": img_h,
				"width": img_w
			});
			
			//ヒートマップ作成
			if(!heatmapDetail.heatmap){
				heatmapDetail.heatmap = h337.create({
					container: document.getElementById('divHeatmap'),
					maxOpacity: 1,
					blur: 1,
					backgroundColor: 'none',
					gradient: {.25: "#84FFFF",.55: "#76FF03",.85: "yellow", 1: "rgb(255,0,0)"},
				});
			}
			
			//図面詳細のヒートマップ作成
			if(isHeatOn) SetHeatmapDetail(timer);
			
			//コールバック実行
			if(callback){
				callback();
			}
		}
		if(img.addEventListener){
			img.addEventListener("load",ImageLoadFunc);
		}else if(img.attachEvent){
			img.attachEvent("onload",ImageLoadFunc);
		}else{
			img.onload = ImageLoadFunc;
		}
        img.src = path;
    }
    
    //レッドゾーン作成
    function MakeRedZone(){
    	var r = _data.redZone.filter(function(f){
    		return (f.floor == _data.bildings[targetBilding][floorIndex].floor)
    	})
    	
    	if(pathRedzone) pathRedzone.remove()
    	pathRedzone = gHeat.selectAll("path").data(r).enter().append("path")
    		.attr({
    			"d":function(d){
    				var p = "M";
    				p += d.x1 + "," + d.y1 + " ";
    				p += d.x2 + "," + d.y1 + " ";
    				p += d.x2 + "," + d.y2 + " ";
    				p += d.x1 + "," + d.y2;
    				return p;
    			},
    			"fill":function(d){ return d.color; },
    			"class":"pathHeatmap",
    			"fill-opacity":".4",
    		})
    }
    //ヒートマップ位置判定
    function IsRedZone(obj){
    	var isHeat = false;
    	$.each(_data.redZone, function(i, v){
    		if(obj.x > v.x1 && obj.x < v.x2 && obj.y > v.y1 && obj.y < v.y2){
    			isHeat = true;
    			return;
    		}
    	})
    	return isHeat;
    }
    
    function GetRedZone(obj){
    	var n = {};
    	$.each(_data.redZone, function(i, v){
    		if(obj.x > v.x1 && obj.x < v.x2 && obj.y > v.y1 && obj.y < v.y2 && v.floor == obj.floor){
    			n.name = v.name;
    			n.floor = v.floor;
    		}
    	})
    	return n;
    }
    
    //座標点に配色を適用する
    function ApplayColorScale(obj){
    	var key = _data.colorScale.targetColumn;
    	if(obj[key] && _data.colorScale.ruleColor[obj[key]]){
    		return _data.colorScale.ruleColor[obj[key]]
    	}else return _data.colorScale.etcColor
    }
    
    //座標点作成
	function MakePoint(pointData){
		
		if(circlePoints) circlePoints.remove();
		if(textPoints) textPoints.remove();
		
        //描画
        circlePoints = gPoints.selectAll("circle").data(pointData).enter().append("circle")
        	.attr({
        		"r": 2.8,
        		"id" : function(d){ return "c_" + FairingName(d.name); },
        		"title" : function(d){ return d.name; },
        		"fill":ApplayColorScale,
        		"opacity": ".8",
        		"cx": (d => d.x),
        		"cy": (d => d.y),
        	})
        	.style({
        		"visibility": function(d){
        			var show = "visible";
        			if(d.unixTime == timer.End){
        				InsertTopic(d, "Arrival");
        				serchPanelSapns.filter(f => f == d.name).text(d.floor);
        			}else show = "hidden";
        			if(d.floor != _data.bildings[targetBilding][floorIndex].floor) show = "hidden";
        			return show;
		        },
    		});
        
        textPoints = gPoints.selectAll("text").data(pointData).enter().append("text")
        	.attr({
        		"id" : function(d){ return "t_" + FairingName(d.name); },
        		"fill":ApplayColorScale,
        		"text-anchor": "start",
        		"opacity": ".8",
        		"x": (d => d.x + 6),
        		"y": (d => d.y - 6),
        	})
        	.style({
        		"visibility": function(d){
        			var show = "visible";
        			if(d.unixTime != timer.End) show = "hidden";
        			if(d.floor != _data.bildings[targetBilding][floorIndex].floor) show = "hidden";
        			return show;
		        },
	    	})
        	.text(function(d){return d.name});
	}
	
	var pointList;
	function MakeList(pointData){
		if(pointList) pointList.remove();
		var pointListParent = d3.select("#infoDiv .divNameList");
		pointList = pointListParent.selectAll("div").data(pointData).enter()
			.append("div");
		pointList.append("span")
			.text(function(d){ return d.name + " ("+ d.floor  +")" })
			.attr("class", "nameList")
			.style("color", function(d, i){ return colorObj[d.name] });
		pointList.append("span")
			.text("動線")
			.attr("class", "locusLine")
			.on("click", ClickShowLocus);
		pointList.append("span")
			.text("滞留")
			.attr("class", "stagnatePoint")
			.on("click", ClickShowStagnatePoint);
	}
	
	//ヒートマップ表示用のデータ作成
	function MakeHeatMapsData(){
		
		var result = {};
        var maxArr = [];
        var maxArrSta = [];
        heatmaps = {};
	    $.each(data, function(ii, vv){
	    	$.each(vv, function(i, v){
        		if(i == vv.length-1){
        			v.value = 1;
        			v.stagnation = 1000
        		}else{
        			v.stagnation = vv[i+1].unixTime - v.unixTime; //線形写像
        			v.value = 1;
        		}
        	})
        	
        	maxArr.push(d3.max(vv, function (dd) {
			    return dd.value;
			}));
			maxArrSta.push(d3.max(vv, function (dd) {
			    return dd.stagnation;
			}));
        });
        
        var m = d3.max(maxArr, function (dd) {
		    return dd;
		});
        var mSta = d3.max(maxArrSta, function (dd) {
		    return dd;
		});
		
		//ヒートマップ詳細の最大値を設定
        heatmapDetail.maxAllData = m;
        
        var firstDrawData = Object.keys(data).map(m => data[m].filter(f => (f.unixTime <= timer.End))[0]);
        firstDrawData = Array.prototype.concat.apply([], firstDrawData.filter(Boolean));
        
        $.each(_data.bildings[targetBilding], function(i,v){
        	if(!heatmaps[v.floor]){
        		heatmaps[v.floor] = {};
        		heatmaps[v.floor].heatmap = h337.create({
					container: document.getElementById('element_' + v.floor),
					maxOpacity: .8,
					blur: 1,
					backgroundColor: 'none',
					gradient: {.25: "#84FFFF",.55: "#76FF03",.85: "yellow", 1: "rgb(255,0,0)"},
				});
        	}
        	
			heatmaps[v.floor].maxAllData = m;
			heatmaps[v.floor].maxAllDataSta = mSta;
			
			var drawData = firstDrawData.filter(f => (f.floor == v.floor));
			drawData = drawData.map(m => {return {x:m.xHeat, y:m.yHeat, value:m.value}})
			
			if(drawData.length > 0) heatmaps[v.floor].heatmap.setData({ max:2, data: drawData });
			else heatmaps[v.floor].heatmap.setData({data:[]});
        })
        
        sizeScale = d3.scale.linear().domain([0, heatmaps[Object.keys(heatmaps)[0]].maxAllDataSta]).range([1, 50]);
	}
	
	var InitZoom, CancelZoom;
	function GetData(){
		$.ajax({
	        type: 'GET',
	        url: mapUri[Object.keys(mapUri)[0]],
	        dataType: 'json',
	        success: function(json){
				//data整形
		        //json = json.data;
		        
		        //テスト 指定ビルの指定フロアに該当しないものは削除する
		        var billNames = Object.keys(_data.bildings);
		        jsonData = json.filter(f => {
		        	return (billNames.indexOf(f.build) >= 0 && mapScales[f.build].hasOwnProperty(f.floor))
		        });
		        
		        //unixTiemの数値型化
		        $.each(jsonData, function(i,v){
		        	v.unixTime = Number(v.unixTime);
		        	v.time = new Date(v.unixTime).toLocaleTimeString();
		        });
		        jsonData.sort(function(a, b) { return a.unixTime - b.unixTime; });
		        
		        //座標点の名前で連想配列を作成する
		        var names = jsonData.map(function(d){ return d.name});
		        names = names.filter(function (x, i, self) {
		        	return self.indexOf(x) === i && i !== self.lastIndexOf(x);
		        });
		        
		        //名前に応じた色定義を作成
		        $.each(names, function(i, v){
		        	data[v] = new Array();
		        	colorObj[v] = colorScaleTrain(i/names.length);
		        	
		        });
		        
				//検索パネルに人流リストを表示する
				serchPanelDivs = d3.select("#searchDiv div.divNameList").selectAll("div").data(names).enter().append("div");
		        serchPanelDivs.append("svg")
		        	.attr({
		        		"width":"20px",
		        		"height":"20px",
		        		"viewBox":"0 0 1000 1000"
		        	})
		        	.style("padding-left", "6px")
		        	.append("path")
		        	.attr({
		        		"fill":"white",
		        		"d":"M500,10c-210.5,0-381.2,170.7-381.2,381.2c0,269.1,380.3,598.8,380.3,598.8s382-327.3,382-598.8C881.2,180.7,710.5,10,500,10z M498.7,553.8c-90.2,0-163.4-73.2-163.4-163.4c0-90.2,73.1-163.4,163.4-163.4c90.2,0,163.4,73.1,163.4,163.4C662,480.6,588.9,553.8,498.7,553.8z"
		        	})
		        	.on("click", function(d){
		        		//ビル表示上に現在地を表現するアイコンを表示させる
		        		var t = drawData.circle.filter(f => {return (f.name == d)});
				    	if(t.length>0){
				    		if($(this).attr("fill") == "#2196F3"){
				    			//現在地プロット解除
				    			$(this).attr("fill", "#FFF");
				    			groupNames.remove(groupNames.getObjectByName(d));
				    		}else{
				    			//現在地プロット設定
				    			$(this).attr("fill", "#2196F3");
					    		
					    		var e = document.createElement("div");
						    	e.style.width = "48px";
						    	e.style.height = "48px";
						    	
						    	var svgPoint =  CreateSvg({'viewBox':'0 0 1000 1000', 'width': '48px','height': '48px', 'class': 'tooltipIcon', 'title': 'point', 'style': 'transform:translate(0px, 0px);'});
							    var pathPoint = CreatePath({fill:"#2196F3", d:"M500,10c-210.5,0-381.2,170.7-381.2,381.2c0,269.1,380.3,598.8,380.3,598.8s382-327.3,382-598.8C881.2,180.7,710.5,10,500,10z M498.7,553.8c-90.2,0-163.4-73.2-163.4-163.4c0-90.2,73.1-163.4,163.4-163.4c90.2,0,163.4,73.1,163.4,163.4C662,480.6,588.9,553.8,498.7,553.8z"})
						        svgPoint.append(pathPoint);
						    	e.append(svgPoint);
						    	
						    	var eMesh = new THREE.CSS3DObject(e);
						    	
					    		var h = _data.bildings[targetBilding].filter(f => (f.floor == t[0].floor));
					    		eMesh.position.set(t[0].x - h[0].w/2, h[0].floorHeight + 24, t[0].y - h[0].h/2);
						    	eMesh.name = d;
						    	
						    	groupNames.add(eMesh);
				    		}
				    	}
		        	});
			    serchPanelDivs.append("span")
		        	.text(d => d)
		        	.attr("class", "nameList")
		        serchPanelSapns = serchPanelDivs.append("span")
		        	.text("-")
		        	.style({
		        		"font-size": "20px",
    					"font-weight": "bold"
		        	})
		        	.attr("class", "floorList")
		        
		        //フィルタの作成
		        $.each(_data.category, function(i, v){
		        	v.list = jsonData.map(function(d){ return d[v.column]});
			        v.list = v.list.filter(function (x, i, self) {
			        	return self.indexOf(x) === i && i !== self.lastIndexOf(x);
			        });
		        })
		        MakeFilter(_data.category);
		        
		        //座標手のスケール化
		        $.each(jsonData, function(i, v){
		        	v.x = mapScales[v.build][v.floor].xscale(v.x);
		        	v.y = mapScales[v.build][v.floor].yscale(v.y);
		        	v.xHeat = Math.round(v.x);
		        	v.yHeat = Math.round(v.y);
		        	v.color = colorObj[v.name];
		        	if(data.hasOwnProperty(v.name)) data[v.name].push(v);
		        });
		        
		        //最初の時刻を表示
		        timer.End = jsonData[0].unixTime;
		        timer.From = jsonData[0].unixTime;
		        $("#textTimeFrom").text(new Date(timer.From).toLocaleTimeString());
				$("#textTimeEnd").text(new Date(timer.End).toLocaleTimeString());
				$("#textTimeDate").text(new Date(timer.End).toLocaleDateString());
				
		        //3D図面とアニメーションの生成
		        camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 10000 );
		        scene = new THREE.Scene();
		        
				//AnimateBill();
		        
		        
		        //時間スケーリング
		        timeScale = d3.scale.linear()
	               .domain([jsonData[0].unixTime, jsonData[jsonData.length-1].unixTime])
	               .range([0, 300]);
	            timeScaleData = d3.scale.linear()
	               .domain([0, 300])
	               .range([jsonData[0].unixTime, jsonData[jsonData.length-1].unixTime]);
	               
				//キャンバスズーム
				InitZoom = function(x, y, scale){
					zoom = d3.behavior.zoom();
					
					if(x!= null && y != null) zoom.translate([x, y]);
					else zoom.translate([zoomEvent.translate[0], zoomEvent.translate[1]]);zoomEvent
					
					if(scale != null) zoom.scale(scale);
					else zoom.scale(zoomEvent.scale);
					
					zoom.on("zoom", zoomFunction);
					svg.call( zoom ) ;
				}
				CancelZoom = function(){
					zoom.on("zoom", null);
				}
				var zoomEvent = {translate:[margin.left, margin.top], scale:1};
				function zoomFunction(){
					zoomEvent = d3.event ;
					tx = zoomEvent.translate[0];
					ty = zoomEvent.translate[1];
					gMain.style( "transform", "translate( " + tx + "px, " + ty + "px )scale("+zoomEvent.scale+")") ;
					divHeatmap.style( "transform", "translate( " + tx + "px, " + ty + "px )scale("+zoomEvent.scale+")");
				}
				
		        //図面の作成
		        var gFloor = gMain.append("g").attr("id", "gFloorMap");
		        
		        //全階層表示に戻る
		        gReturn = gMain.append("g").attr({
        				"id": "gReturn",
        				"transform": "translate(0, -50)",
        			})
        			.on("click", function(){
				    	container.style("display", "block")
				    		.transition().duration(500)
				    		.style("opacity", 1);
				    	
				    	divHeatmap.style("display", "none");
				    	
				    	svg.transition().duration(500)
				    		.style("opacity", 0)
				    		.transition().delay(500).duration(1)
				    		.style("display", "none");
				    	
				    	//アイコンの表示制御
				    	$(".iconFloorPlanDetail").css("display", "none");
				    	$(".iconFloorPlan").css("display", "block");
				    	
				    	CancelZoom();
	    				controls.enabled = true;
        			})
		        gReturn.append("path").attr({
		        	"d": "M646.4,458.6H139.1l195.4-184.5L290,229.5L10,490.5L290,745l44.5-44.5L140.2,522.3h506.2c82.7,0,280,19.1,280,216.4c0,19.1,12.7,31.8,31.8,31.8c12.7,0,31.8-19.1,31.8-31.8C990,566.8,856.4,458.6,646.4,458.6z",
		        	"transform": "scale(.05)",
		        	"fill": "#fff",
		        });
		        gReturn.append("text").attr({
		        	"id":"textReturn",
		        	"x": "72",
		        	"y": "36",
		        	"font-size": "48",
		        	"fill": "#fff",
		        })
		        
		        //ヒートマップグループ
		        gHeat = gMain.append("g").attr("id", "gHeat");
		        
		        //動線グループ
		        gPath = gMain.append("g").attr("id", "gLineMap");
		        
		        //座標描画グループ
		        gPoints = gMain.append("g").attr("id", "gPoints");
		        
		        //滞留グループ
		        gStagnatePoints = gMain.append("g").attr("id", "gStagnatePoints");
		        
		        //Loading削除
		        HideLoading();
			}
		});
	}
	
	function MakeFloor(){
		//初期描画データの取得
        var firstPointData = Object.keys(data).map(function(d){
        	if(data[d][0].unixTime > timer.End){
        		data[d][0].hidden = true;
        	}
        	return data[d][0];
        });
        drawData.circle = firstPointData;
        
        //動線
        gPath.selectAll("path").remove();
        pathLines = gPath.selectAll("path")
			.data(firstPointData)
			.enter()
			.append("path")
			.attr({
				"id": function(d){
					return d.name;
				},
				"class": "pathLocus",
				"fill": "none",
				"stroke": function(d, i){
					//return "#EEEEEE";
					return colorObj[d.name];
				},
				"stroke-width": 1.6,
			});
		
		//レッドゾーンのスケール適用
		$.each(_data.redZone, (i,v) => {
			v.x1 = mapScales[targetBilding][v.floor].xscale(Number(v.x1));
    		v.x2 = mapScales[targetBilding][v.floor].xscale(Number(v.x2));
    		v.y1 = mapScales[targetBilding][v.floor].yscale(Number(v.y1));
    		v.y2 = mapScales[targetBilding][v.floor].yscale(Number(v.y2));
		})
        
        //図面作成
        LoadImage(MakePath(_data.bildings[targetBilding][floorIndex].img), function(){
        	MakePoint(firstPointData);
			MakeList(firstPointData);
			MakeStatisticsDivMovement(firstPointData);
			MakeRedZone();
        });
	}
	
	function BuildBill(){
		
		var margin_max = _data.bildings[targetBilding].map(m => m.h).reduce((a,x) => a+=x,0);
        
	    //描画する図面の最小サイズ取得
    	var min_w = d3.min(_data.bildings[targetBilding], function (dd) {
		    return dd.w;
		});
    	
    	//前回のビル選択の成果物を削除
    	while(scene.children.length > 0){ 
    		scene.remove(scene.children[0]); 
		}
		$(".billPanel").remove();
    	scene.add(groupNames);
    	d3.selectAll('.element').remove();
    	
    	var elements = d3.selectAll('.element')
	        .data(_data.bildings[targetBilding]).enter()
	        .append('div')
	        .attr('class', 'element')
	        .style({
	        	'width' : function(d){ return d.w + "px"; },
    			'height' : function(d){ return d.h + "px"; },
	        })
	        .on('click', clickFloor);
	    
	    elements.append('div')
    		.attr({
    			'class': 'image',
    		})
    		.style({
    			'background-image' : function(d){return 'url("'+ MakePath(d.img) +'")';},
    			'background-size' : 'contain',
    			'width' : function(d){ return d.w + "px"; },
    			'height' : function(d){ return d.h + "px"; },
    			'transform' : function(d){ 
    				return "scale(" + min_w/d.w + ")";
    			},
    			'position' : 'absolute',
    			'top' : '0px',
    			'left' : '0px',
    		})
    		
    	elements.append('div')
    		.attr({
    			'class': 'canvas',
    			'id': function(d){
    				return 'element_' + d.floor;
    			}
    		})
    		.style({
    			'width' : function(d){ return d.w + "px"; },
    			'height' : function(d){ return d.h + "px"; },
    			'transform' : function(d){ 
    				return "scale(" + min_w/d.w + ")";
    			},
    		})
    	
    	$.each(elements[0], function(i, v){
    		var group = new THREE.Group();
    		group.name = v["__data__"].floor;
    		group.position.set(0,v["__data__"].floorHeight,0)
			scene.add(group);
    		
    		var margin = elements[0].slice(0, i).map(m => m["__data__"].h).reduce((a,x) => a+=x,0);
    		
    		//フロアの作成
			object = new THREE.CSS3DObject(v);
		    object.position.set(0,0,0)
			object.rotation.x = -Math.PI / 2;
		    group.add(object);
		    
		    //フロア表裏面
		    var a = document.createElement("div");
		    a.className = "billPanel";
	    	a.style.width = v["__data__"].w + "px";
	    	a.style.height = "30px";
	    	a.style.backgroundColor = "#E0E0E0";
	    	a.style.opacity = .8;
	    	
	    	var aobj = new THREE.CSS3DObject(a);
		    aobj.position.set(0, -15, -v["__data__"].h/2);
		    group.add(aobj);
		    
		    var b = a.cloneNode(false);
	    	var bobj = new THREE.CSS3DObject(b);
		    bobj.position.set(0, -15, v["__data__"].h/2);
		    group.add(bobj);
		    
		    //フロア側面
		    var c = document.createElement("div");
		    c.className = "billPanel";
	    	c.style.width = v["__data__"].h + "px";
	    	c.style.height = "30px";
	    	c.style.backgroundColor = "#E0E0E0";
	    	c.style.opacity = .8;
		    
		    var cMesh = new THREE.CSS3DObject(c);
		    cMesh.position.set(v["__data__"].w/2, -15, 0);
		    cMesh.rotation.y = Math.PI/ 2;
		    group.add(cMesh);
		    
		    var d = c.cloneNode(false);
	    	var dMesh = new THREE.CSS3DObject(d);
		    dMesh.position.set(-v["__data__"].w/2, -15, 0);
		    dMesh.rotation.y = Math.PI/ 2;
		    group.add(dMesh);
		    
		    //フロア底面
		    var e = document.createElement("div");
		    e.className = "billPanel";
	    	e.style.width = v["__data__"].w + "px";
	    	e.style.height = v["__data__"].h + "px";
	    	e.style.backgroundColor = "#E0E0E0";
	    	e.style.opacity = .9;
	    	
	    	var eMesh = new THREE.CSS3DObject(e);
		    eMesh.position.set(0, -30, 0);
		    eMesh.rotation.x = Math.PI/ 2;
		    group.add(eMesh);
		    
		    //階段ステップの作成
		    if(i < _data.bildings[targetBilding].length - 1){
		    	var step = document.createElement("div");
		    	step.style.width = "40px";
		    	step.style.height = v["__data__"].h/10 + "px";
		    	step.style.backgroundColor = "#E0E0E0";
		    	step.style.opacity = .9;
		    	var stepDif = v["__data__"].h*.05;
		    	for(var ii = 0; ii<10; ii++){
			    	var tmp = v["__data__"].h*(ii/10);
			    	
			    	var stepN = step.cloneNode(false);
			    	var stepMesh = new THREE.CSS3DObject(stepN);
				    stepMesh.position.set(-v["__data__"].w/2 - 20, v["__data__"].floorHeight + tmp + stepDif*2 , v["__data__"].h/2 - tmp - stepDif);
				    stepMesh.rotation.x = Math.PI/ 2;
				    scene.add(stepMesh);
				    
				    var stepV = step.cloneNode(false);
				    stepV.style.backgroundColor = "#BDBDBD";
			    	var stepMeshV = new THREE.CSS3DObject(stepV);
				    stepMeshV.position.set(-v["__data__"].w/2 - 20, v["__data__"].floorHeight + tmp + stepDif, v["__data__"].h/2 - tmp);
				    scene.add(stepMeshV);
			    }
			}
		    
		    //地面の作成
		    if(i == 0){
		    	$("#groundMap").remove();
		    	var g = document.createElement("div");
		    	g.id = "groundMap"
		    	g.style.width = v["__data__"].w * 4 + "px";
		    	g.style.height = v["__data__"].h * 4 + "px";
		    	g.style.background = "url(" + MakePath("img/ground.jpg") + ")";
		    	g.style.opacity = .5;
		    	g.style.backgroundSize = "100% 100%";
		    	
		    	var gobj = new THREE.CSS3DObject(g);
			    gobj.position.set(0,-margin_max/2 - v["__data__"].h/2,0);
				gobj.rotation.x = -Math.PI / 2;
				
			    scene.add(gobj);
			    
			    //DOM版の支柱
			    var prop1 = document.createElement("div");
			    
			    prop1.style.width = margin_max - v["__data__"].h + margin + 12*_data.bildings[targetBilding].length + "px";
		    	prop1.style.height = ".1px";
		    	prop1.style.border = "dashed 3px #EEE";
		    	prop1.style.opacity = .5;
		    	
		    	var objProp1 = new THREE.CSS3DObject(prop1);
			    objProp1.position.set(v["__data__"].w / 2, -v["__data__"].h/2, v["__data__"].h / 2);
				objProp1.rotation.set(-Math.PI / 2, -Math.PI / 2, 0);
			    
			    var prop2 = prop1.cloneNode(false);
		    	
		    	var objProp2 = new THREE.CSS3DObject(prop2);
			    objProp2.position.set(-v["__data__"].w / 2, -v["__data__"].h/2, -v["__data__"].h / 2);
		        objProp2.rotation.set(-Math.PI / 2, -Math.PI / 2, 0);
			    
			    scene.add(objProp1);
			    scene.add(objProp2);
		    }
		});
    	
    	//階数表示
    	d3.selectAll('.floor').remove();
    	var floor = d3.selectAll('.floor')
	        .data(_data.bildings[targetBilding]).enter()
	        .append('div')
	        .attr('class', 'floor')
	        .style({
	        	'color' : '#FFF',
	        	'font-size' : '100px',
	        })
	        .text(function(d){ return d.floor });
	    
	    $.each(floor[0], function(i, v){
			var margin = elements[0].slice(0, i).map(m => m["__data__"].h).reduce((a,x) => a+=x,0);
			var obj = new THREE.CSS3DObject(v);
		    obj.position.x = - (w - 250)/2 - 200;
			obj.position.y = -margin_max/2 + margin + 12*i;
			obj.position.z = 0;
		    scene.add(obj);
		});
        
        //ビル名の追加
        var building = document.createElement( 'div' );
		building.className = 'building';
		building.style.whiteSpace = 'nowrap';
		
		var buildName = document.createElement( 'span' );
		buildName.textContent = targetBilding;
		buildName.style.color = '#FFF';
		buildName.style.fontSize = '100px';
		building.appendChild(buildName)
		
		var buildReturn = document.createElement( 'span' );
		buildReturn.setAttribute('id', 'buildReturn');
		building.appendChild(buildReturn)
		
        var obj = new THREE.CSS3DObject( building );
		obj.position.x = 0;
		obj.position.y = margin_max/2;
		obj.position.z = 0;
		scene.add( obj );
		
        renderer = new THREE.CSS3DRenderer();
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.domElement.style.position = 'absolute';
        renderer.domElement.style.top = 0;
        document.getElementById( 'container' ).appendChild( renderer.domElement );
        
        controls = new THREE.OrbitControls( camera );
		controls.rotateSpeed = 0.1;
		controls.zoomSpeed = 1.2;
		controls.panSpeed = 0.5;
		controls.noZoom = false;
		controls.noPan = false;
		controls.staticMoving = false;
		controls.dynamicDampingFactor = 0.1;
		controls.minDistance = 100;
		controls.maxDistance = 6000;
		controls.enable = false;
        //controls.addEventListener( 'change', render );
        
        renderer.render( scene, camera );
        
        MakeFloorSideways();
	}
	
    //フロア選択
    function clickFloor(d, i){
    	
    	floorIndex = i;
    	var t= $("g.gHistoryAnime text.floorItemCircle[data-filter='"+ i +"']");
    	t.next().append($("text.historyItem tspan.blinking"));
    	d3.select(".blinking").style("display", "block")
            .transition()
            .duration(1000)
            .attr('opacity', "1");
        
        //選択状態グラデーション
        $("g.gHistoryAnime text").css("text-shadow", "");
        t.css("text-shadow", "rgb(255, 255, 255) 0px 0px 5px,  rgb(255, 255, 255) 0px 0px 10px,  rgb(255, 255, 255) 0px 0px 15px,  rgb(255, 255, 255) 0px 0px 20px,  rgb(255, 255, 255) 0px 0px 25px,  rgb(255, 255, 255) 0px 0px 30px");
        t.next().css("text-shadow", "rgb(255, 255, 255) 0px 0px 5px,  rgb(255, 255, 255) 0px 0px 10px,  rgb(255, 255, 255) 0px 0px 15px,  rgb(255, 255, 255) 0px 0px 20px,  rgb(255, 255, 255) 0px 0px 25px,  rgb(255, 255, 255) 0px 0px 30px");
        
        $("#textReturn").text(_data.bildings[targetBilding][floorIndex].floor);
        
        //図面更新
        LoadImage(MakePath(_data.bildings[targetBilding][i].img), function(){
        
        	if(!isAutoPlay){
	        	GetThisTimeData(timer)
	        	SetCirclePosition(drawData.circle);
	        	SetLocus(drawData.paths);
	        }
	        
	        //滞留切替
	        var arr = GetThisTimeStagnatePointData(timer);
		    SetStagnatePoint(arr);
		    
		    //レッドゾーン更新
		    MakeRedZone();
		    
		    //表示制御
	    	svg.style("display", "block")
	    		.transition().duration(500).delay(300)
	    		.style("opacity", 1);
	    	
	    	//平面図目のヒートマップ表示
	    	divHeatmap.style({"display":"block", "opacity":"0"})
	    	if(isHeatOn) divHeatmap.transition().duration(500).delay(300).style("opacity", "1")
	    		
	    	container.transition().duration(500).delay(300)
	    		.style("opacity", 0)
	    		.transition().delay(800).duration(1)
	    		.style("display", "none");
	    	
	    	//アイコン表示切替
	    	$(".iconFloorPlan").css("display", "none");
	    	$(".iconFloorPlanDetail").css("display", "block");
	    	
	    	//ズーム設定
	    	InitZoom();
	    	controls.enabled = false;
        });
    }
    
    function MakeFloorSideways(){
    	//フロア反転
        $("#buildReturn").append(CreateSvg({'viewBox':'0 0 1000 1000', 'width': '80px','height': '80px', 'class': 'tooltipIcon', 'title': 'rotate', 'style': 'transform:translate(50px, -30px);' }));
		$("#buildReturn svg").append(CreatePath({"fill":"#FFF", "transform":"translate(0,512) scale(0.1,-0.1)", "d":"M4689.7,5016.6c-759.2-65.2-1353.5-232-1968.9-554.1c-893.4-465.9-1652.6-1236.6-2105-2137.6C264.9,1625.1,100,923.4,100,120.1c0-801.4,164.9-1506.9,513.8-2202.8c400.7-795.6,1071.7-1522.2,1842.4-1991.9c1608.5-981.6,3671.4-937.5,5249.1,111.2C9743.3-2608,10471.8,18.5,9423.1,2229c-245.4,511.9-540.6,927.9-964.3,1353.5c-784.1,784.1-1704.4,1240.4-2810.5,1397.6C5448.9,5008.9,4854.5,5031.9,4689.7,5016.6z M5057.8,3417.6c47.9-49.8,55.6-69,46-120.8c-7.7-34.5-26.8-74.8-46-92c-17.3-17.3-354.7-214.7-749.6-440.9l-718.9-410.3l853.1-11.5c933.6-11.5,1048.7-23,1418.7-149.5C6838.8,1862.8,7555.8,1025,7728.4,14.7c38.3-228.1,44.1-646.1,11.5-862.7c-159.1-1046.8-880-1905.7-1880.7-2241.2c-299.1-99.7-515.7-134.2-862.7-134.2c-347,1.9-563.6,34.5-862.7,134.2c-939.4,312.5-1656.4,1113.9-1850.1,2066.7c-38.3,193.6-70.9,540.6-57.5,607.7c26.8,122.7,187.9,164.9,268.4,70.9c36.4-42.2,44.1-80.5,53.7-256.9c57.5-1073.6,797.5-1967,1853.9-2241.2c268.4-69,720.8-88.2,996.9-40.3c1067.8,185.9,1878.8,1021.8,2032.2,2091.6c26.8,195.6,23,531.1-9.6,728.5c-44.1,272.2-97.8,442.9-218.6,690.2c-253,517.6-630.7,895.3-1142.6,1142.6c-458.2,222.4-628.8,247.3-1656.4,247.3h-795.6l709.3-414.1c389.2-228.1,722.8-431.4,741.9-452.4c76.7-90.1,1.9-245.4-118.8-245.4c-38.3,0-352.8,174.5-1041,577.1c-540.6,316.3-998.8,590.5-1016.1,605.8c-49.8,44.1-46,163,5.8,209c74.8,67.1,2020.7,1175.2,2064.8,1177.1C4979.2,3475.2,5025.2,3448.3,5057.8,3417.6z"}))
		var isSideways = true;
		$("#buildReturn svg").on("click", function(){
			isSideways = !isSideways;
			TWEEN.removeAll();
			var r = isSideways ? 0 : Math.PI/2 ;
			var floorList = Object.keys(heatmaps);
			$.each(scene.children, function(i, v){
				if(v.type=="Group" && floorList.indexOf(v.name)>-1){
					var rotate = new TWEEN.Tween(v.rotation)
					    .to({x: r}, 1000)
					    .easing(TWEEN.Easing.Exponential.InOut)
						.start();
				}
			})
			
		})
    }
    AnimateBill = function() {
    	timerBilding = window.requestAnimationFrame(AnimateBill);
    	
    	if(controls.enable){
    		TWEEN.update();
			controls.update();
    	}
		
		renderer.render( scene, camera );
	}
	
	var controls_earth;
	function MakeEarth(){
		
		var scene_earth;
		var sphere_earth;
	    var camera_earth;
	    var light;
	    var shader;
	    var gridHelper; // 追加
	    var axisHelper; // 追加
	    var lightHelper; // 追加
	    var renderer_earth;
	    var pivot;
	    var sphereEarth;
	    var atmosphere;
	    var mesh_points;
	    var width = window.innerWidth;
	    var height = window.innerHeight;
	    var group = new THREE.Group();
	    var INTERSECTED, texture1, context1;
	    var autoRotate = false;
		
		//自動回転、手動回転切り替えボタン
		$("body").append(CreateSvg({'width': '40px','height': '40px','id': 'svgSwitchRotateMode','class': 'tooltipIcon iconEarth','title': 'ChangeViewMode','style': 'position: absolute;bottom: 18px;left: 30px;border-radius: 30px;background: rgba(0,0,0,0.3); z-index: 999;'}));
		$("#svgSwitchRotateMode").append(CreateG({'transform':'translate(8,20)scale(0.0025,-0.0025)','class':'tooltipIcon','title':'ChangeViewMode'}));
		$("#svgSwitchRotateMode g").append(CreatePath({'id':'path1','style':'fill:rgb(256,256,256);','class':'tooltipIcon','title':'ChangeViewMode','d':'M1268.4,4933.9c-269.8-56-519.3-196-725.5-402.2c-491.3-491.3-583-1232.1-229.1-1838c94.2-160.4,346.2-412.4,506.6-506.6c422.6-246.9,949.6-280,1382.3-89.1c58.5,25.5,109.5,38.2,109.5,28c0-10.2-22.9-86.6-50.9-170.6c-63.6-178.2-50.9-264.8,35.6-264.8c33.1,0,71.3,15.3,86.6,33.1c40.7,48.4,218.9,644.1,203.7,682.3c-7.6,20.4-165.5,86.5-348.8,145.1c-364,119.6-420,117.1-404.8-15.3c7.6-56,35.6-73.8,208.7-132.4l201.1-66.2l-127.3-56c-361.5-155.3-761.2-140-1127.7,40.7c-76.4,38.2-213.8,142.6-305.5,234.2C428.3,2810.8,301,3108.6,301,3459.9c-2.5,972.5,1020.8,1608.9,1886.4,1171c155.3-78.9,226.6-66.2,226.6,38.2c0,66.2-17.8,81.5-165.5,152.7C1943,4967,1601.9,5007.7,1268.4,4933.9z'}));
		$("#svgSwitchRotateMode g").append(CreatePath({'id':'path2','class':'tooltipIcon','title':'ChangeViewMode','style':'fill:rgb(256,256,256);','d':'M3442.4,4188c-157.8-71.3-302.9-216.4-366.6-366.6c-114.6-259.7-122.2-231.6,570.2-2466.8c343.7-1117.5,626.2-2036.6,626.2-2046.7c0-7.6-96.7,73.8-213.8,185.8C3495.9,18.2,2966.4,127.6,2594.7-208.4c-162.9-147.6-241.8-323.3-241.8-547.3c0-252,78.9-389.5,381.9-669.5c325.8-302.9,595.7-608.4,990.3-1127.8c641.5-837.5,1036.1-1143,1952.6-1499.4c173.1-66.2,338.6-145.1,366.6-173.1c30.6-30.5,78.9-137.5,109.5-239.3c45.8-152.7,68.7-193.5,137.5-234.2c45.8-28,112-50.9,152.7-50.9c38.2,0,794.3,224,1680.2,496.4c1710.7,524.4,1695.4,519.3,1738.7,689.9c10.2,35.6-12.7,165.5-53.5,310.6l-68.7,249.5l53.5,264.7c183.3,921.5,132.4,1662.3-178.2,2558.4c-50.9,155.3-211.3,577.9-353.9,939.4c-142.5,364-315.7,827.3-384.4,1031c-140,407.3-208.8,532-364.1,636.4c-142.5,96.7-252,129.8-422.6,129.8c-208.8,0-371.7-63.6-511.7-203.7l-117.1-117.1l-58.5,109.5c-106.9,203.7-323.3,338.6-575.3,358.9c-226.6,17.8-389.5-43.3-565.1-213.8l-140-134.9l-61.1,73.8c-33.1,40.7-127.3,106.9-206.2,145.1c-119.7,58.5-178.2,71.3-323.3,68.7c-229.1-2.6-381.9-73.8-542.2-254.6L4868,2253.3l-211.3,692.4c-117.1,381.9-236.8,753.5-264.8,829.9c-63.6,175.6-198.6,325.8-361.5,399.7C3867.5,4254.2,3597.7,4259.3,3442.4,4188z M3898.1,3790.9c28-17.8,63.6-53.4,81.5-81.5c17.8-25.5,244.4-738.3,506.6-1586c262.2-847.7,496.4-1568.1,521.9-1603.8c145.1-201.1,455.7-147.6,532.1,91.7c30.6,96.7,22.9,127.3-147.6,682.2c-96.7,320.7-178.2,611-178.2,649.2c0,173.1,185.8,323.3,364,300.4c183.3-25.5,229.1-101.8,397.1-636.4c81.4-262.2,168-498.9,193.5-527c99.3-109.5,323.3-86.5,407.3,40.7c58.5,89.1,48.4,196-50.9,516.8c-101.8,333.5-106.9,392-38.2,504c68.7,114.6,185.8,168,325.8,152.7c188.4-20.4,236.7-94.2,386.9-577.9c150.2-483.7,201.1-560.1,384.4-560.1c84,0,119.6,15.3,190.9,86.6c101.8,101.8,109.5,173.1,33.1,386.9c-86.6,252-28,422.6,175.6,511.7c109.5,45.8,259.7,7.6,343.7-91.6c33.1-40.7,119.6-244.4,190.9-455.7c73.8-211.3,208.8-575.3,300.4-812.1c555-1412.9,641.5-1726,664.4-2387.9c15.3-407.3-7.6-667-99.3-1125.2l-56-282.6l53.5-201.1c30.5-109.5,48.3-203.7,43.3-208.7c-28-30.6-2874.1-891-2886.8-873.2c-10.2,10.2-38.2,73.8-63.6,142.6c-76.4,206.2-188.4,292.8-575.3,445.5c-896.1,353.8-1275.4,639-1825.3,1369.6c-394.6,521.9-705.2,875.7-1132.8,1272.8C2750-885.6,2714.3-791.4,2775.4-631c53.5,140,178.2,216.4,341.1,203.7c277.5-22.9,598.2-254.6,1036.1-753.5c137.5-155.3,280-300.4,315.7-323.3c119.6-78.9,364,12.7,399.7,150.2c10.2,40.7-224,837.5-725.5,2461.7c-567.7,1848.2-735.7,2420.9-723,2484.6c17.8,94.2,140,229.1,224,244.4C3719.9,3852,3842.1,3829.1,3898.1,3790.9z'}));
		$("#svgSwitchRotateMode").on("click",  function(){
			//表示制御
			if(!autoRotate){
				//SVG変形アニメーション
				d3.select("#path1").transition().duration(1000)
					.attr('d', "M4549.9,4715.8c-233.8-27.8-451.5-64.8-652.9-115.8c-1349.8-335.7-2449.5-1356.7-2864-2655.6c-83.4-261.6-85.7-296.4-27.8-423.7c106.5-231.5,414.4-289.4,588.1-106.5c34.7,37,94.9,162.1,143.5,305.6c252.4,720,696.9,1303.5,1296.5,1699.4c1544.3,1018.7,3621.1,622.8,4646.7-886.7C7902.4,2206,8127,1668.9,8178,1340.1l13.9-94.9l-150.5,143.6c-210.7,199.1-361.2,231.5-544.1,111.1c-132-88-189.8-321.8-113.4-470C7434.8,930.3,8386.3,6.5,8474.3-30.5c215.3-90.3,298.7-37,896,562.6c537.1,541.8,553.3,567.2,518.6,759.4c-23.2,113.4-164.4,257-275.5,277.8c-171.3,32.4-243.1,0-458.4-213c-220-215.3-213-215.3-240.8,4.6c-23.2,187.5-127.3,560.3-222.3,810.4c-347.3,898.3-1062.7,1680.9-1937.9,2118.5c-375.1,187.5-727,303.3-1173.8,384.3C5402,4708.8,4716.6,4734.3,4549.9,4715.8z");
				d3.select("#path2").transition().duration(1000)
			        .attr('d', "M1216,247.3C1125.7,208,192.6-706.6,134.7-813.1C116.2-847.8,100-924.2,100-979.8c0-203.7,155.1-356.5,356.6-356.5c148.2,0,182.9,18.5,391.3,224.6c196.8,192.2,189.8,192.2,217.6-27.8c23.1-185.2,141.2-606.6,231.5-833.5c282.5-701.5,780.2-1331.3,1403.1-1778.1c259.3-185.2,780.2-449.2,1078.9-546.4c1208.6-395.9,2530.6-210.7,3597.9,502.4c724.7,483.9,1287.3,1222.5,1562.8,2051.3c94.9,289.4,94.9,386.7-6.9,518.6c-99.6,132-303.3,182.9-442.2,111.2c-113.5-60.2-169-143.6-250-386.7C7907.1-2487,7129.2-3260.3,6138.2-3591.4c-372.8-125-613.5-159.7-1067.3-159.7c-340.3,0-460.7,9.2-650.6,48.6c-467.7,99.6-872.8,268.6-1234,509.4c-259.3,173.6-652.9,555.7-835.8,808c-252.4,356.6-495.5,916.8-546.4,1266.4l-13.9,94.9l134.3-129.7c164.4-159.7,208.4-182.9,333.4-182.9c263.9,0,442.2,273.2,338,516.3c-46.3,106.5-977,1023.3-1083.5,1067.3C1405.8,293.6,1320.2,293.6,1216,247.3z");
	        }else{
	        	d3.select("#path1").transition().duration(1000)
					.attr('d', "M1268.4,4933.9c-269.8-56-519.3-196-725.5-402.2c-491.3-491.3-583-1232.1-229.1-1838c94.2-160.4,346.2-412.4,506.6-506.6c422.6-246.9,949.6-280,1382.3-89.1c58.5,25.5,109.5,38.2,109.5,28c0-10.2-22.9-86.6-50.9-170.6c-63.6-178.2-50.9-264.8,35.6-264.8c33.1,0,71.3,15.3,86.6,33.1c40.7,48.4,218.9,644.1,203.7,682.3c-7.6,20.4-165.5,86.5-348.8,145.1c-364,119.6-420,117.1-404.8-15.3c7.6-56,35.6-73.8,208.7-132.4l201.1-66.2l-127.3-56c-361.5-155.3-761.2-140-1127.7,40.7c-76.4,38.2-213.8,142.6-305.5,234.2C428.3,2810.8,301,3108.6,301,3459.9c-2.5,972.5,1020.8,1608.9,1886.4,1171c155.3-78.9,226.6-66.2,226.6,38.2c0,66.2-17.8,81.5-165.5,152.7C1943,4967,1601.9,5007.7,1268.4,4933.9z");
				d3.select("#path2").transition().duration(1000)
	    	        .attr('d', "M3442.4,4188c-157.8-71.3-302.9-216.4-366.6-366.6c-114.6-259.7-122.2-231.6,570.2-2466.8c343.7-1117.5,626.2-2036.6,626.2-2046.7c0-7.6-96.7,73.8-213.8,185.8C3495.9,18.2,2966.4,127.6,2594.7-208.4c-162.9-147.6-241.8-323.3-241.8-547.3c0-252,78.9-389.5,381.9-669.5c325.8-302.9,595.7-608.4,990.3-1127.8c641.5-837.5,1036.1-1143,1952.6-1499.4c173.1-66.2,338.6-145.1,366.6-173.1c30.6-30.5,78.9-137.5,109.5-239.3c45.8-152.7,68.7-193.5,137.5-234.2c45.8-28,112-50.9,152.7-50.9c38.2,0,794.3,224,1680.2,496.4c1710.7,524.4,1695.4,519.3,1738.7,689.9c10.2,35.6-12.7,165.5-53.5,310.6l-68.7,249.5l53.5,264.7c183.3,921.5,132.4,1662.3-178.2,2558.4c-50.9,155.3-211.3,577.9-353.9,939.4c-142.5,364-315.7,827.3-384.4,1031c-140,407.3-208.8,532-364.1,636.4c-142.5,96.7-252,129.8-422.6,129.8c-208.8,0-371.7-63.6-511.7-203.7l-117.1-117.1l-58.5,109.5c-106.9,203.7-323.3,338.6-575.3,358.9c-226.6,17.8-389.5-43.3-565.1-213.8l-140-134.9l-61.1,73.8c-33.1,40.7-127.3,106.9-206.2,145.1c-119.7,58.5-178.2,71.3-323.3,68.7c-229.1-2.6-381.9-73.8-542.2-254.6L4868,2253.3l-211.3,692.4c-117.1,381.9-236.8,753.5-264.8,829.9c-63.6,175.6-198.6,325.8-361.5,399.7C3867.5,4254.2,3597.7,4259.3,3442.4,4188z M3898.1,3790.9c28-17.8,63.6-53.4,81.5-81.5c17.8-25.5,244.4-738.3,506.6-1586c262.2-847.7,496.4-1568.1,521.9-1603.8c145.1-201.1,455.7-147.6,532.1,91.7c30.6,96.7,22.9,127.3-147.6,682.2c-96.7,320.7-178.2,611-178.2,649.2c0,173.1,185.8,323.3,364,300.4c183.3-25.5,229.1-101.8,397.1-636.4c81.4-262.2,168-498.9,193.5-527c99.3-109.5,323.3-86.5,407.3,40.7c58.5,89.1,48.4,196-50.9,516.8c-101.8,333.5-106.9,392-38.2,504c68.7,114.6,185.8,168,325.8,152.7c188.4-20.4,236.7-94.2,386.9-577.9c150.2-483.7,201.1-560.1,384.4-560.1c84,0,119.6,15.3,190.9,86.6c101.8,101.8,109.5,173.1,33.1,386.9c-86.6,252-28,422.6,175.6,511.7c109.5,45.8,259.7,7.6,343.7-91.6c33.1-40.7,119.6-244.4,190.9-455.7c73.8-211.3,208.8-575.3,300.4-812.1c555-1412.9,641.5-1726,664.4-2387.9c15.3-407.3-7.6-667-99.3-1125.2l-56-282.6l53.5-201.1c30.5-109.5,48.3-203.7,43.3-208.7c-28-30.6-2874.1-891-2886.8-873.2c-10.2,10.2-38.2,73.8-63.6,142.6c-76.4,206.2-188.4,292.8-575.3,445.5c-896.1,353.8-1275.4,639-1825.3,1369.6c-394.6,521.9-705.2,875.7-1132.8,1272.8C2750-885.6,2714.3-791.4,2775.4-631c53.5,140,178.2,216.4,341.1,203.7c277.5-22.9,598.2-254.6,1036.1-753.5c137.5-155.3,280-300.4,315.7-323.3c119.6-78.9,364,12.7,399.7,150.2c10.2,40.7-224,837.5-725.5,2461.7c-567.7,1848.2-735.7,2420.9-723,2484.6c17.8,94.2,140,229.1,224,244.4C3719.9,3852,3842.1,3829.1,3898.1,3790.9z");
    	    }
    	    autoRotate = !autoRotate
		});
	 
	    // ステージを作る
	    scene_earth = new THREE.Scene();
	 	
	 	var Shaders = {
			'earth' : {
			  uniforms: {
			    'texture': { type: 't', value: 0, texture: null }
			  },
			  vertexShader: [
			    'varying vec3 vNormal;',
			    'varying vec2 vUv;',
			    'void main() {',
			      'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
			      'vNormal = normalize( normalMatrix * normal );',
			      'vUv = uv;',
			    '}'
			  ].join('\n'),
			  fragmentShader: [
			    'uniform sampler2D texture;',
			    'varying vec3 vNormal;',
			    'varying vec2 vUv;',
			    'void main() {',
			      'vec3 diffuse = texture2D( texture, vUv ).xyz;',
			      'float intensity = 1.1 - dot( vNormal, vec3( 0.0, 0.0, 1.0 ) );',
			      'vec3 atmosphere = vec3( 1.0, 1.0, 1.0 ) * pow( intensity, 2.0 );',
			      'gl_FragColor = vec4( diffuse + atmosphere, 1.0 );',
			    '}'
			  ].join('\n')
			},
			'atmosphere' : {
			  uniforms: {},
			  vertexShader: [
				'uniform vec3 viewVector;',
				'uniform float c;',
				'uniform float p;',
				'varying float intensity;',
				'void main() {',
				'vec3 vNormal = normalize( normalMatrix * normal );',
				'vec3 vNormel = normalize( normalMatrix * viewVector );',
				'intensity = pow( c - dot(vNormal, vNormel), p );',
				'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );}'
			  ].join('\n'),
			  fragmentShader: [
			    'uniform vec3 glowColor;',
				'varying float intensity;',
				'void main() {',
				'vec3 glow = glowColor * intensity;',
				'gl_FragColor = vec4( glow, 1.0 );}',
			  ].join('\n')
			}
		};
		
		//マウスのグローバル変数
		var mouse = { x: 0, y: 0 };
		//オブジェクト格納グローバル変数
		var targetList = [];
		//マウスが押された時
		window.onclick = function (ev){
			if (ev.target == renderer_earth.domElement) { 
			    //マウス座標2D変換
			    var rect = ev.target.getBoundingClientRect();    
			    mouse.x =  ev.clientX - rect.left;
			    mouse.y =  ev.clientY - rect.top;
			    //マウス座標3D変換 width（横）やheight（縦）は画面サイズ
			    mouse.x =  (mouse.x / width) * 2 - 1;
			    mouse.y = -(mouse.y / height) * 2 + 1;
			    // マウスベクトル
			    var vector = new THREE.Vector3( mouse.x, mouse.y ,1);
			   // vector はスクリーン座標系なので, オブジェクトの座標系に変換
			    vector.unproject( camera_earth );
			    // 始点, 向きベクトルを渡してレイを作成
			    var ray = new THREE.Raycaster( camera_earth.position, vector.sub( camera_earth.position ).normalize() );
			     // クリック判定
			    var obj = ray.intersectObjects( targetList );
			     
			     // ビル選択されたら
			    if ( obj.length > 0 ){
			      	
			      	targetBilding = obj[0].object.name;
			      	BuildBill();
			      	MakeFloor();
			      	//ヒートマップ作成
		        	MakeHeatMapsData();
					MakeFloorList()
					
				    //表示制御
				    d3.select("#container_earth").transition().duration(1000).style("opacity", 0)
				    	.transition().duration(10).delay(1000).style("display", "none");
				    container.style("display", "block").transition().duration(300).style("opacity", 1);
				    
				    //アイコン群の表示制御
				    $(".iconEarth").css("display", "none");
				    $(".iconFloorPlan").css("display", "block");
				    
				    //地球儀上のツールチップ非表示
				    tooltip_Earth.style("display", "none");
				    
				    //非表示地球が回転しないようにする
				    controls_earth.enabled = false;
				    tooltip_Earth.text("");
				    
				    //カメラ位置
				    camera.position.z = d3.max(_data.bildings[targetBilding], function (dd) { return dd.w; }) * 3 * Math.cos(Math.PI/4); 
				    camera.position.x = d3.max(_data.bildings[targetBilding], function (dd) { return dd.w; }) * 3 * Math.cos(Math.PI/4); 
				    camera.position.y = d3.max(_data.bildings[targetBilding], function (dd) { return dd.floorHeight; }) * 2;
        			
				    controls.enable = true;
				    AnimateBill();
			   }
			}
		};
		
		// create a canvas element
		canvas1 = document.createElement('canvas');
		context1 = canvas1.getContext('2d');
		context1.font = "Bold 20px Arial";
		context1.fillStyle = "rgba(250,250,250,.95)";
	    context1.fillText('Hello, world!', 0, 20);
		// canvas contents will be used for a texture
		texture1 = new THREE.Texture(canvas1) 
		texture1.needsUpdate = true;
		
		var spriteMaterial = new THREE.SpriteMaterial( { map: texture1, useScreenCoordinates: true, alignment: {x:1, y:-1} } );
		
		$("body").append("<span id='tooltip_Earth' style='color:white; font-size:16px; position:absolute; top:0px; left:0px; z-index:999; opacity:0'>Hellow</span>")
		tooltip_Earth = d3.select("#tooltip_Earth");
		
		document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	 	function onDocumentMouseMove( event ) 
		{
			// update sprite position
			tooltip_Earth.style({
				"top" : event.clientY - 24 + "px",
				"left" : event.clientX + 12 + "px",
			});
			
			// update the mouse variable
			var rect = event.target.getBoundingClientRect();    
		    mouse.x =  event.clientX - rect.left;
		    mouse.y =  event.clientY - rect.top;
		    //マウス座標3D変換 width（横）やheight（縦）は画面サイズ
		    mouse.x =  (mouse.x / width) * 2 - 1;
		    mouse.y = -(mouse.y / height) * 2 + 1;
		}
		
	    // 追加：地球テクスチャーを準備
	    loader = new THREE.TextureLoader();
	    var fileReader = new FileReader() ;
	    $("body").append("<div id='svgArea' style='display:none;'>");
	    $("#svgArea").load(MakePath("img/earth.svg"), function(data){
	 		var url = 'data:image/svg+xml;base64,' + btoa(data);
			loader.load(url, function(texture) {
		    	createEarth(texture);
		    	renderer_earth.render(scene_earth, camera_earth);
		    	$("#svgArea").remove();
		    });
		});
		
	    // 追加：宇宙テクスチャーを準備
	    loader.load(MakePath("img/space.jpg"), function(texture2) {
	      createUniverse(texture2);
	      renderer_earth.render(scene_earth, camera_earth);
	    });
	    
	    // 追加：地球を作る
	    function createEarth(texture) {
	    	shader = Shaders['earth'];
		    uniforms = THREE.UniformsUtils.clone(shader.uniforms);
		    uniforms['texture'].value = texture;
		    sphereEarth = new THREE.Mesh(
		      new THREE.SphereGeometry(200, 50, 50),
		      new THREE.ShaderMaterial({
		          uniforms: uniforms,
		          vertexShader: shader.vertexShader,
		          fragmentShader: shader.fragmentShader,
		          side: THREE.DoubleSide,
		      })
		    );
		    sphereEarth.rotation.y = Math.PI;
		    sphereEarth.position.set(0, 0, 0);
		    sphereEarth.name = "earth";
		    group.add(sphereEarth);
		    MakeAtmospere();
	    };
	    
	    // 追加：宇宙を作る
	    function createUniverse(texture) {
	      texture.minFilter = THREE.LinearFilter
	      sphereUniverse = new THREE.Mesh(
	        new THREE.SphereGeometry(1000, 50, 50), // 形状
	        new THREE.MeshLambertMaterial({ // 材質    
	         map: texture,
	         side: THREE.DoubleSide,
	         alphaMap:.5,
	        })
	      );
	      sphereUniverse.position.set(0, 0, 0);
	      sphereUniverse.name = "space";
	      group.add(sphereUniverse);
	    };
	    
	    function MakeAtmospere(){
	    	//大気圏を作る
	    	shader = Shaders['atmosphere'];
		    uniforms = THREE.UniformsUtils.clone(shader.uniforms);
		    
		    var meshAtmospere = new THREE.Mesh(
		    	new THREE.SphereGeometry(220, 50, 50),
		    	new THREE.ShaderMaterial({
		        	uniforms:{ 
						"c":   { type: "f", value: .6 },
						"p":   { type: "f", value: 4 },
						glowColor: { type: "c", value: new THREE.Color(0xffffff) },
						viewVector: { type: "v3", value: camera_earth.position }
					},
					vertexShader:   shader.vertexShader,
					fragmentShader: shader.fragmentShader,
					side: THREE.BackSide,
					blending: THREE.AdditiveBlending,
					transparent: true
		        })
		    );
		    meshAtmospere.scale.x = meshAtmospere.scale.y = meshAtmospere.scale.z = 1.1;
		    meshAtmospere.flipSided = true;
		    meshAtmospere.matrixAutoUpdate = false;
		    meshAtmospere.updateMatrix();
		    meshAtmospere.name = "atmospere";
		    scene_earth.add(meshAtmospere);
	    }
	    
	    
	    // 平方光源を作る
	    light = new THREE.DirectionalLight(0xffffff, 2);
	    light.position.set(0, 10, 300);
	    scene_earth.add(light);
	    
	    // 追加：環境光源を作る
	    ambient = new THREE.AmbientLight(0xffffff);
	    scene_earth.add(ambient);
	 
	    // カメラを作る
	    camera_earth = new THREE.PerspectiveCamera(60, width / height, 1, 2000);
	    camera_earth.position.set(200, 100, 500);
	    camera_earth.lookAt(scene_earth.position);
	    lengthCamera = Math.sqrt(Math.pow(camera_earth.position.x, 2) + Math.pow(camera_earth.position.y, 2) + Math.pow(camera_earth.position.z, 2));
	    
	    // 追加：controls
    	controls_earth = new THREE.OrbitControls(camera_earth);
    	controls_earth.rotateSpeed = 0.1;
		controls_earth.zoomSpeed = 1.2;
		controls_earth.panSpeed = 0.5;
		controls_earth.noZoom = false;
		controls_earth.noPan = false;
		controls_earth.staticMoving = false;
		controls_earth.dynamicDampingFactor = 0.1;
		controls_earth.minDistance = 210;
		controls_earth.maxDistance = 990; 
	    
	    // renderer_earth
	    renderer_earth = new THREE.WebGLRenderer({ antialias: true});//, alpha: true 
	    renderer_earth.setSize(width, height);
	    renderer_earth.domElement.style.position = 'absolute';
	    renderer_earth.setClearColor( new THREE.Color(0x000000), 0.5);
	    document.getElementById('container_earth').appendChild(renderer_earth.domElement);
		
	    Render_earth = function() {
		    timerEarth = window.requestAnimationFrame(Render_earth);
		    
		    //メッシュの回転
		    if(autoRotate){
		      group.rotation.y += 0.0005; 
		    }
		    
		    controls_earth.update();
		    renderer_earth.clear();
		    renderer_earth.render(scene_earth, camera_earth);
	        
	        var vector = new THREE.Vector3( mouse.x, mouse.y ,1);
		    vector.unproject(camera_earth);
		    var ray = new THREE.Raycaster( camera_earth.position, vector.sub( camera_earth.position ).normalize() );
		    var intersects = ray.intersectObjects( targetList );
		    if ( intersects.length > 0 ){
				if ( intersects[ 0 ].object != INTERSECTED ){
					INTERSECTED = intersects[ 0 ].object;
					if ( intersects[ 0 ].object.name ){
					    tooltip_Earth.text(intersects[ 0 ].object.name)
					    	.style("opacity", 0)
					    	.transition()
					    	.duration(300)
					    	.style("opacity", 1);
					}else{
						tooltip_Earth.transition()
					    	.duration(100)
					    	.style("opacity", 0)
					}
				}
			}else{
				INTERSECTED = null;
				tooltip_Earth.transition()
			    	.duration(100)
			    	.style("opacity", 0)
			}
	    }
	    
	    $.ajax({
	        type: 'GET',
	        url: MakeUrl(_data.data_earth),
	        dataType: 'json',
	        success: function(json){
	        	
	        	var data = json.data;

				//json文字から数値へ
				$.each(data, (i, v) => {
					v.lat = Number(v.lat);
					v.lng = Number(v.lng);
					v.size = Number(v.size);
				})
				
				//配色定義
				var maxSize = d3.max(data, (v) => v.size);
				var minSize = d3.min(data, (v) => v.size);
				var colorFn = function(x) {
				    var c = new THREE.Color();//"hsl(0, 50%, 50%)"
				    c.setHSL( 0.6-(x/maxSize)*0.6 , .5+(x/maxSize)*0.5, .25+(x/maxSize)*0.25 );
				    return c;
				}
				
				geometry = new THREE.CubeGeometry( 0.75, 0.75, 1 );
			    for (var i = 0; i < geometry.vertices.length; i++) {
			      var vertex = geometry.vertices[i];
			      vertex.z += 0.5;
			    }
			    
				$.each(data, (i, v) => {
					var color = colorFn(v.size);
			    	var point = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
		            	color: color,
		            	morphTargets: false
		            }));
			    	
			    	//緯度経度から座標点を作成
			    	var phi = (90 - v.lat) * Math.PI / 180;
				    var theta = (180 - v.lng) * Math.PI / 180;
				    point.position.x = 200 * Math.sin(phi) * Math.cos(theta);
				    point.position.y = 200 * Math.cos(phi);
				    point.position.z = 200 * Math.sin(phi) * Math.sin(theta);

				    point.lookAt(new THREE.Vector3(0,0,0));
				    
				    if(v.size > 0) point.scale.z = v.size * -200;
				    else point.scale.z = 1;
				    
				    //ビルID付与
				    point.name = v.name;// + " : " + v.size * 200 + "人";
				    
				    group.add(point);
				    targetList.push(point);
			    })
			    scene_earth.add(group);
			    Render_earth();
	        }
	    })
	}
	
	//地球儀作成
	MakeEarth();
}
window.HumanFlow = HumanFlow;

HumanFlow.data = {
	data_point:"1490847412828/iPhone_0410",
	data_earth:"1490847412828/floor_earth_ginza",
	addTimeRange:"100",
	map_index_init:"1",
	bildings:{
		"[SBM-TGNZ]-SB Ginza Flagship":[
			{
				"floor":"B1F",
				"img":"img/shop_ginza_B1F.jpeg",
				"length": 49.2126,
	        	"width": 99.40945,
			},{
				"floor":"1F",
				"img":"img/shop_ginza_1F.jpeg",
				"length": 45.275593,
	        	"width": 106.6273,
			},{
				"floor":"2F",
				"img":"img/shop_ginza_2F.jpeg",
				"length": 45.275593,
	        	"width": 106.6273,
			}
		],
	},
	"redZone":[],
	"category": [{
		"name":"機種",
		"column":"type",
	}],
	"colorScale":{
		"targetColumn":"type",
		"ruleColor":{
			"ipadginie":"#F44336",
		},
		"etcColor":"#FFF"
	},
}
HumanFlow.main();