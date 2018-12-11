function RGBColor(e){this.ok=!1,"#"==e.charAt(0)&&(e=e.substr(1,6)),e=e.replace(/ /g,""),e=e.toLowerCase();var f={aliceblue:"f0f8ff",antiquewhite:"faebd7",aqua:"00ffff",aquamarine:"7fffd4",azure:"f0ffff",beige:"f5f5dc",bisque:"ffe4c4",black:"000000",blanchedalmond:"ffebcd",blue:"0000ff",blueviolet:"8a2be2",brown:"a52a2a",burlywood:"deb887",cadetblue:"5f9ea0",chartreuse:"7fff00",chocolate:"d2691e",coral:"ff7f50",cornflowerblue:"6495ed",cornsilk:"fff8dc",crimson:"dc143c",cyan:"00ffff",darkblue:"00008b",darkcyan:"008b8b",darkgoldenrod:"b8860b",darkgray:"a9a9a9",darkgreen:"006400",darkkhaki:"bdb76b",darkmagenta:"8b008b",darkolivegreen:"556b2f",darkorange:"ff8c00",darkorchid:"9932cc",darkred:"8b0000",darksalmon:"e9967a",darkseagreen:"8fbc8f",darkslateblue:"483d8b",darkslategray:"2f4f4f",darkturquoise:"00ced1",darkviolet:"9400d3",deeppink:"ff1493",deepskyblue:"00bfff",dimgray:"696969",dodgerblue:"1e90ff",feldspar:"d19275",firebrick:"b22222",floralwhite:"fffaf0",forestgreen:"228b22",fuchsia:"ff00ff",gainsboro:"dcdcdc",ghostwhite:"f8f8ff",gold:"ffd700",goldenrod:"daa520",gray:"808080",green:"008000",greenyellow:"adff2f",honeydew:"f0fff0",hotpink:"ff69b4",indianred:"cd5c5c",indigo:"4b0082",ivory:"fffff0",khaki:"f0e68c",lavender:"e6e6fa",lavenderblush:"fff0f5",lawngreen:"7cfc00",lemonchiffon:"fffacd",lightblue:"add8e6",lightcoral:"f08080",lightcyan:"e0ffff",lightgoldenrodyellow:"fafad2",lightgrey:"d3d3d3",lightgreen:"90ee90",lightpink:"ffb6c1",lightsalmon:"ffa07a",lightseagreen:"20b2aa",lightskyblue:"87cefa",lightslateblue:"8470ff",lightslategray:"778899",lightsteelblue:"b0c4de",lightyellow:"ffffe0",lime:"00ff00",limegreen:"32cd32",linen:"faf0e6",magenta:"ff00ff",maroon:"800000",mediumaquamarine:"66cdaa",mediumblue:"0000cd",mediumorchid:"ba55d3",mediumpurple:"9370d8",mediumseagreen:"3cb371",mediumslateblue:"7b68ee",mediumspringgreen:"00fa9a",mediumturquoise:"48d1cc",mediumvioletred:"c71585",midnightblue:"191970",mintcream:"f5fffa",mistyrose:"ffe4e1",moccasin:"ffe4b5",navajowhite:"ffdead",navy:"000080",oldlace:"fdf5e6",olive:"808000",olivedrab:"6b8e23",orange:"ffa500",orangered:"ff4500",orchid:"da70d6",palegoldenrod:"eee8aa",palegreen:"98fb98",paleturquoise:"afeeee",palevioletred:"d87093",papayawhip:"ffefd5",peachpuff:"ffdab9",peru:"cd853f",pink:"ffc0cb",plum:"dda0dd",powderblue:"b0e0e6",purple:"800080",red:"ff0000",rosybrown:"bc8f8f",royalblue:"4169e1",saddlebrown:"8b4513",salmon:"fa8072",sandybrown:"f4a460",seagreen:"2e8b57",seashell:"fff5ee",sienna:"a0522d",silver:"c0c0c0",skyblue:"87ceeb",slateblue:"6a5acd",slategray:"708090",snow:"fffafa",springgreen:"00ff7f",steelblue:"4682b4",tan:"d2b48c",teal:"008080",thistle:"d8bfd8",tomato:"ff6347",turquoise:"40e0d0",violet:"ee82ee",violetred:"d02090",wheat:"f5deb3",white:"ffffff",whitesmoke:"f5f5f5",yellow:"ffff00",yellowgreen:"9acd32"};for(var a in f)e==a&&(e=f[a]);for(var r=[{re:/^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/,example:["rgb(123, 234, 45)","rgb(255,234,245)"],process:function(e){return[parseInt(e[1]),parseInt(e[2]),parseInt(e[3])]}},{re:/^(\w{2})(\w{2})(\w{2})$/,example:["#00ff00","336699"],process:function(e){return[parseInt(e[1],16),parseInt(e[2],16),parseInt(e[3],16)]}},{re:/^(\w{1})(\w{1})(\w{1})$/,example:["#fb0","f0f"],process:function(e){return[parseInt(e[1]+e[1],16),parseInt(e[2]+e[2],16),parseInt(e[3]+e[3],16)]}}],t=0;t<r.length;t++){var d=r[t].re,l=r[t].process,n=d.exec(e);n&&(channels=l(n),this.r=channels[0],this.g=channels[1],this.b=channels[2],this.ok=!0)}this.r=this.r<0||isNaN(this.r)?0:this.r>255?255:this.r,this.g=this.g<0||isNaN(this.g)?0:this.g>255?255:this.g,this.b=this.b<0||isNaN(this.b)?0:this.b>255?255:this.b,this.toRGB=function(){return"rgb("+this.r+", "+this.g+", "+this.b+")"},this.toHex=function(){var e=this.r.toString(16),f=this.g.toString(16),a=this.b.toString(16);return 1==e.length&&(e="0"+e),1==f.length&&(f="0"+f),1==a.length&&(a="0"+a),"#"+e+f+a},this.getHelpXML=function(){for(var e=new Array,a=0;a<r.length;a++)for(var t=r[a].example,d=0;d<t.length;d++)e[e.length]=t[d];for(var l in f)e[e.length]=l;var n=document.createElement("ul");n.setAttribute("id","rgbcolor-examples");for(var a=0;a<e.length;a++)try{var i=document.createElement("li"),o=new RGBColor(e[a]),s=document.createElement("div");s.style.cssText="margin: 3px; border: 1px solid black; background:"+o.toHex()+"; color:"+o.toHex(),s.appendChild(document.createTextNode("test"));var c=document.createTextNode(" "+e[a]+" -> "+o.toRGB()+" -> "+o.toHex());i.appendChild(s),i.appendChild(c),n.appendChild(i)}catch(b){}return n}}

var Utilization = {};
Utilization.finished = false;
Utilization.main = function(){
	/////////////////////////
	//変数
	/////////////////////////
	var resolution = (1 + devicePixelRatio) / 2; //画素数対応
	var lastCategory;
	var isFirstDraw = true;
	var initZoom;
	
	/////////////////////////
	//関数
	/////////////////////////
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
	loadCss(MakePath("css/Utilization.css"));
	
	function Tricks(){
		$("#layout-column_column-1").children().remove();
	}
	Tricks();
	
	function MakeUrl(str){
		return site_settings.graphInfoServiceSSL + site_settings.graphInfoServiceIP + "/graphservice/" + str + "?sessionId=" + site_settings.sessionId;
	}
	
	function MakePath(str){
		return site_settings.graphInfoServiceSSL + site_settings.graphInfoServiceIP + "/BigScreen/" + str;
	}
	
	function FairingName(w) {
        return w.toLowerCase().replace(/[ ,\.]/g, "")
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
	
	function CreatePath(obj){
	    var path = document.createElementNS("http://www.w3.org/2000/svg", 'path');
	    if(obj.hasOwnProperty("d")) path.setAttribute("d", obj.d);
	    if(obj.hasOwnProperty("class")) path.setAttribute("class", obj.class);
	    if(obj.hasOwnProperty("fill")) path.setAttribute("fill", obj.fill);
	    if(obj.hasOwnProperty("stroke")) path.setAttribute("stroke", obj.stroke);
	    if(obj.hasOwnProperty("strokeWidth")) path.setAttribute("stroke-width", obj.strokeWidth);
	    if(obj.hasOwnProperty("strokeOpacity")) path.setAttribute("stroke-opacity", obj.strokeOpacity);
	    if(obj.hasOwnProperty("transform")) path.setAttribute("transform", obj.transform);
	    if(obj.hasOwnProperty("style")) path.setAttribute("style", obj.style);
	    return path;
	}
    
	function CreateImage(obj){
	    var image = document.createElementNS("http://www.w3.org/2000/svg", 'image');
	    if(obj.hasOwnProperty("x")) image.setAttribute("x", obj.x);
	    if(obj.hasOwnProperty("y")) image.setAttribute("y", obj.y);
	    if(obj.hasOwnProperty("transform")) image.setAttribute("transform", obj.transform);
	    if(obj.hasOwnProperty("width")) image.setAttribute("width", obj.width);
	    if(obj.hasOwnProperty("height")) image.setAttribute("height", obj.height);
	    if(obj.hasOwnProperty("id")) image.setAttribute("id", obj.id);
	    if(obj.hasOwnProperty("class")) image.setAttribute("class", obj.class);
	    if(obj.hasOwnProperty("title")) image.setAttributeNS("http://www.w3.org/1999/xlink", "title", obj.title);
	    if(obj.hasOwnProperty("href")) image.setAttributeNS("http://www.w3.org/1999/xlink", "href", obj.href);
	    return image;
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
	    if(obj.hasOwnProperty("dataFilterValue")) circle.setAttribute("data-filter-value", obj.dataFilterValue);
	    if(obj.hasOwnProperty("style")) circle.setAttribute("style", obj.style);
	    return circle;
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
	    if(obj.hasOwnProperty("content")) text.textContent = obj.content;
	    return text;
	}
	function CreateArcPath(cx, cy, r, s, e){
	   var x1,y1,x2,y2,f;
	   sr=s*Math.PI/180;
	   er=e*Math.PI/180;
	   x1=Math.round(cx+r*Math.cos(sr));
	   y1=Math.round(cy+r*Math.sin(sr));
	   x2=Math.round(cx+r*Math.cos(er));
	   y2=Math.round(cy+r*Math.sin(er));
	   l=Math.abs(e-s);
	   dx=x2-x1;
	   dy=y2-y1;
	   if(l>180)
	      f=1;
	   else
	      f=0;  
	   return "M "+x1+","+y1+" a "+r+" "+r+" "+s+" "+f+" 1 "+dx+","+dy;
	}
	
	if(this.finished) return 
	var _data = Utilization.data;
	
	//main
	$("#sb-site").children().remove();
	$("#dockbar-sb-site").css("display", "none");
	$("#sb-site").css("z-index", "0");
	$("#wrapper, #add-btn-area").css("display", "none");
	$("#sb-site").css("background", "url('"+ MakePath("img/background.jpg") +"')");
	
	//ソフトバンクロゴ
	$("body").append("<div id='sumaryDiv' style='position: absolute;top: 12px;right: 12px;'>");
	var headerHtml = '<img style="height: 30px" alt="logo02" src="'+ MakePath("icon/icon_softbank_blk.png") +'">';
	$("div#sumaryDiv").append(headerHtml);
	$("div#sumaryDiv").css({"transform-origin":"right bottom 0px"});
	
	//時計
	var _monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
	var _weekNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	var _weekShortNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	$("body").append("<div id='divTime'></div>");
    $("#divTime").append("<div><div>"+ _weekNames[new Date().getDay()] +"</div><div>"+ new Date().getFullYear() +"</div><div>Tokyo</div></div>");
    $("#divTime").append("<div><div>"+ new Date().getDate() +"</div><div>"+ _monthNames[new Date().getMonth()] +".</div><div id='hourMinutes'>"+ new Date().getHours() + ":" + ("0"+new Date().getMinutes()).slice(-2) +"</div></div>");
	setInterval(function(){
		$("#hourMinutes").text(new Date().getHours() + ':' + ('0'+new Date().getMinutes()).slice(-2));
	}, 60000);
	
	//メニューボタン作成
	var menuIconSvg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
	menuIconSvg.setAttribute("id", "menuRect");
	menuIconSvg.setAttribute("height", 36);
	menuIconSvg.setAttribute("width", 36);
	menuIconSvg.setAttribute("style", "position: absolute;right: 20px;top: 118px;;background: rgba(160, 160, 160, 0.5);z-index: 9999;border-radius: 20px;");
	$("body").append(menuIconSvg);
	$("#menuRect").append(CreateRect({"width":"20", "height":"5", "fill":"white", "x":"8", "y":"10.5", "opacity":".9"}));
	$("#menuRect").append(CreateRect({"width":"20", "height":"5", "fill":"white", "x":"8", "y":"20.5", "opacity":".9"}));
	//基盤のメニューウィンドウを表示する
    $("#menuRect").on("click", function(){
        $('#menu').trigger("click");
    });
    
	//自動再生ボタン
	var autoPlaySvg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
	autoPlaySvg.setAttribute("id", "svgAutoPlay");
	autoPlaySvg.setAttribute("height", 36);
	autoPlaySvg.setAttribute("width", 36);
	autoPlaySvg.setAttribute("style", "position: absolute;right: 70px;top: 118px;;background: rgba(160, 160, 160, 0.5);z-index: 9999;border-radius: 20px;");
	$("body").append(autoPlaySvg);
	$("#svgAutoPlay").append(CreateG({"class":"gAutoPlay", "style":"transform: translate(-3px, -2px)scale(.08);"}));
	$("#svgAutoPlay g.gAutoPlay").append(CreatePath({"d":"M368.149,244.383l-146.883-84.805c-2.953-1.707-6.133-2.047-9.09-1.496c-0.126,0.023-0.25,0.027-0.371,0.054   c-0.715,0.152-1.394,0.379-2.07,0.645c-0.23,0.09-0.453,0.183-0.676,0.281c-0.66,0.305-1.297,0.633-1.902,1.035   c-0.062,0.043-0.117,0.094-0.179,0.137c-2,1.379-3.59,3.282-4.606,5.578c-0.054,0.125-0.11,0.242-0.16,0.367   c-0.294,0.726-0.535,1.465-0.699,2.258c-0.031,0.141-0.035,0.293-0.059,0.442c-0.133,0.762-0.316,1.504-0.316,2.32v169.606   c0,0.812,0.183,1.554,0.316,2.32c0.024,0.145,0.028,0.297,0.059,0.438c0.164,0.793,0.406,1.535,0.703,2.262   c0.05,0.122,0.102,0.238,0.152,0.359c1.019,2.305,2.617,4.211,4.625,5.59c0.055,0.039,0.102,0.086,0.16,0.125   c0.61,0.406,1.246,0.734,1.918,1.039c0.214,0.102,0.434,0.191,0.656,0.278c0.68,0.269,1.363,0.496,2.082,0.648   c0.117,0.027,0.242,0.031,0.363,0.054c2.961,0.551,6.137,0.215,9.094-1.492l146.883-84.805   C377.094,262.457,377.094,249.547,368.149,244.383z", "fill":"white", "opacity":".9"}));
	
	//グラフ描画用DOM作成
	$("#sb-site").append("<div style='height:"+ window.innerHeight +"px; width:"+ window.innerWidth +"px'><div id='divMain'></div><div id='divSub'></div></div>");
	
	var resolutionZoom = 2.5
	var graphSettingsBase = {
        "theme": "light",
        "type": "serial",
        "autoMargins": false,
        "marginBottom": 18*resolutionZoom,
        "marginTop": 18*resolutionZoom,
        "marginLeft": 18*resolutionZoom,
        "marginRight": 18*resolutionZoom,
        "addClassNames": true,
        "zoomControl": {
			"zoomControlEnabled": false,
			"buttonBorderColor":"#FFF",
			"buttonColorHover":"#FFF",
			"buttonCornerRadius":"20",
		},
        "valueAxes": [{
            "id": "v1",
            "axisAlpha": 0,
            "offset":0,
            "minimum":0,
            "maximum":100,
            "gridAlpha":0,
            "axisColor": "#FFF",
            "color": "rgba(256,256,256,0.5)",
            "ignoreAxisWidth":true,
            "autoGridCount":false,
            "gridCount": 4,
            "balloon": {
              "enabled": true,
            },
        }],
        "graphs":[],
        "balloon": {
          "adjustBorderColor": true,
          "color": "#E0E0E0",
          "borderAlpha":0,
          "fillAlpha":0,
          "shadowAlpha":0,
          "borderThickness": 0,
          "verticalPadding": 0,
          "fontSize": 10,
        },
        "chartScrollbar": {
            "enabled": false,
        },
        "chartCursor": {
	        "cursorAlpha": 1,
	        "cursorColor":"rgba(256,256,256,.5)",
	        "zoomable": true,
	        "color": "rgba(256,256,256,.8)",
			"categoryBalloonColor": "black",
	    },
        "categoryField": "TIME",
        "categoryAxis": {
            "parseDates": false,
            "dashLength": 0,
            "axisColor": "#FFF",
            "color": "rgba(256,256,256,0.5)",
            "minorGridEnabled": false,
            "gridAlpha": 0,
            "fontSize": 12,
            "autoGridCount":true,
        },
        "listeners": [{
            "event": "drawn",
			"method": DrawnAmcharts
        }]
    };
    
    /////////////////////////////////////////////////
    //グラフイベント定義
    /////////////////////////////////////////////////
    //描画後イベント
    var icon = "M6.684,25.682L24.316,15.5L6.684,5.318V25.682z";
    function DrawnAmcharts(event){
    	if(isFirstDraw){
    		event.chart.chartCursor.addListener("changed", handleCursorChange);
		    event.chart.chartCursor.addListener("onHideCursor", handleHideCursor);
		    event.chart.addListener("zoomed", syncZoom);
		    event.chart.chartCursor.showCursorAt(lastCategory);
		    targetCursor = lastCategory;
		    if(event.chart.legend){
		    	event.chart.legend.addListener("rollOverItem", RollOverItem);
		    	event.chart.legend.addListener("rollOutItem", RollOutItem);
		    	event.chart.legend.addListener("showItem", ShowItem);
		    	event.chart.legend.addListener("hideItem", HideItem);
		    }
    	}else{
    		if(initZoom){
    			event.chart.ignoreZoom = true;
                event.chart.zoomToCategoryValues(initZoom.start, initZoom.end);
    		}
    		if(targetCursor) event.chart.chartCursor.showCursorAt(targetCursor);
    		event.chart.addListener("zoomed", syncZoom);
    		event.chart.chartCursor.addListener("changed", handleCursorChange);
		    event.chart.chartCursor.addListener("onHideCursor", handleHideCursor);
    	}
    }
    function RollOverItem(b){
    	//データ上の濃淡
    	$.each(b.chart.graphs, function(i,v){
    		//if(v.legendTextReal != b.dataItem.legendTextReal) v.lineAlpha = 0.1
    	})
    	//見た目の濃淡
    	$(b.chart.chartDiv).parents('.panelItem').find("g.amcharts-graph-line").css("opacity", .2);
    	$(b.chart.chartDiv).parents('.panelItem').find("g.amcharts-graph-g" + b.dataItem.legendTextReal).css("opacity", 1);
    	
    	$(b.target.div).find("g[cursor='pointer']").css("opacity", .2);
    	$(b.target.div).find("g.amcharts-legend-item-g" + b.dataItem.legendTextReal).css("opacity", 1);
    }
    function RollOutItem(b){
    	$.each(b.chart.graphs, function(i,v){
    		//v.lineAlpha = 0.9
    	})
    	$(b.chart.chartDiv).parents('.panelItem').find("g.amcharts-graph-line").css("opacity", 1);
    	$(b.target.div).find("g[cursor='pointer']").css("opacity", 1);
    }
    
    function ShowItem(b){
    	Object.keys(charts).map(function(key, index) {
			if($(charts[key].chart.div).parent()[0] == $(b.chart.div).parent()[0] && charts[key].chart != b.chart){
				$.each(charts[key].chart.graphs, function(i,v){
					if(v.valueField == b.dataItem.legendTextReal){
					   charts[key].chart.showGraph(v);
					}
		       })
			}
		});
    }
    function HideItem(b){
    	Object.keys(charts).map(function(key, index) {
			if($(charts[key].chart.div).parent()[0] == $(b.chart.div).parent()[0] && charts[key].chart != b.chart){
				$.each(charts[key].chart.graphs, function(i,v){
					if(v.valueField == b.dataItem.legendTextReal){
					   charts[key].chart.hideGraph(v);
					}
		       })
			}
		});
    }
    var targetCursor;
    //カーソル移動イベント
	function handleCursorChange(event) {
		if(!event.index) return;
		targetCursor = event.chart.dataProvider[event.index].TIME;
		$.each(charts, function(i, v){
			if (event.chart != v.chart) {
	            if (event.position) {
	            	v.chart.chartCursor.removeListener(v.chart.chartCursor, "changed", handleCursorChange);
	                v.chart.chartCursor.isZooming(event.target.zooming);
	                //v.chart.chartCursor.selectionPosX = event.target.selectionPosX;
	                v.chart.chartCursor.forceShow = true;
	                //v.chart.chartCursor.setPosition(event.position, false, event.target.index);
	                v.chart.chartCursor.showCursorAt(targetCursor);
	            }
	        }
		});
	}
	//カーソル消去イベント
	function handleHideCursor() {
		targetCursor = null;
		$.each(charts, function(i, v){
	        if (v.chart.chartCursor.hideCursor) {
	        	v.chart.chartCursor.addListener("changed", handleCursorChange);
	            v.chart.chartCursor.forceShow = false;
	            v.chart.chartCursor.hideCursor(false);
	        }
	    })
	    charts.divMain.chart.chartCursor.showCursorAt(lastCategory);
	}
	//ズーム同期イベント
	function syncZoom(event) {
	    $.each(charts, function(i, v){
            if (v.chart.ignoreZoom) {
                v.chart.ignoreZoom = false;
            }
            if (event.chart != v.chart) {
                v.chart.ignoreZoom = true;
                v.chart.zoomToCategoryValues(event.startValue, event.endValue);
            }
        })
        if(event.startIndex == 0 && event.endIndex == (event.target.chartData.length-1)) initZoom = null;
        else initZoom = {"start":event.startValue, "end":event.endValue};
	}
    
    var charts = {};
    //メインパネルの描画
	function drawCharts(url, divId, color, setting, standardVal){
		$.ajax({
			type: 'GET',
		    url: MakeUrl(url),
		    dataType: 'json',
		    success: function(json){
		        if(json.data && json.data.length > 0) {
		        	
		        	//データ整形
		        	var colorIndex;
		        	$.each(json.data, function(i,v){
		        		colorIndex = 0;
		        		$.each(v, function(ii,vv){
		        			if(ii=="TIME"){
		        				json.data[i].TIME = vv.substr(0,2) + ":" + vv.substr(-2,2);
		        				return;
		        			}
		        			if(vv < standardVal) {
		        				json.data[i]["fillColor" + ii] = "rgba(0,0,0,0)";
		        			}else{
		        				//json.data[i]["fillColor" + ii] = color[colorIndex];
		        				json.data[i]["fillColor" + ii] = "#F44336";
		        			}
		        			json.data[i][ii] = Math.floor(vv * 100) / 100;
		        			colorIndex++;
		        		});
		        	});
		        	setting.dataProvider = AmCharts.parseJSON(JSON.stringify(json.data))
		        	
		        	colorIndex = 0;
				    $.each(json.data[0], function(ii, vv){
						if(ii != "TIME" && ii.indexOf("Color") == -1){
							//バルーンの色は濃くする
							var col = new RGBColor(color[colorIndex]);
							col.r = Math.floor(col.r*1.25)>255?255:Math.floor(col.r*1.25);
							col.g = Math.floor(col.g*1.25)>255?255:Math.floor(col.g*1.25);
							col.b = Math.floor(col.b*1.25)>255?255:Math.floor(col.b*1.25);
							var balloonColor = "rgb(" + col.r + "," + col.g + "," + col.b +")" ;
							
				            setting.graphs.push({
				                "id": "g"+ ii,
				                "valueField": ii,
				                "title": ii,
				                "bulletField": "bullet",
				                "useLineColorForBulletBorder": false,
				                "fillAlphas": 0.2,
				                "fillColorsField": "fillColor" + ii,
				                "lineThickness": 1.5,
				                "lineColor": color[colorIndex],
				                "type":"line",
				                "showBalloon": true,
				                "balloonText": "<span><b style='font-size: 10px; color:"+ balloonColor +"; padding-left: 0px;'>[[value]]</b></span>",
				                //"balloonText": "<span style='font-size: 10px; color:"+color[colorIndex]+";'>[[title]]</span><span><b style='font-size: 10px; color:"+color[colorIndex]+"; padding-left: 6px;'>[[value]]</b></span>",
				            });
				            colorIndex++;
				        }
				    });
					var chart = AmCharts.makeChart(divId, setting);
					charts[divId] = {};
					charts[divId].chart = chart;
					charts[divId].url = url;
					charts[divId].standardVal = standardVal;
		        }
		    }
		})
	}
	
	//メインパネル
	var settingMain = $.extend(true, {}, graphSettingsBase);
	$.ajax({
		type: 'GET',
	    url: MakeUrl(_data.pv.url),
	    dataType: 'json',
	    success: function(json){
	        if(json.data && json.data.length > 0) {
	        	//データの整形
	        	var isLast = false;
	        	var indexLast = json.data.length;
	        	json.data[json.data.length-1].bulletClass = "lastBullet";
				json.data[json.data.length-1].labelText = _data.pv.name + " : " + json.data[json.data.length-1].pv;
				json.data[json.data.length-1].labelColor = "#FFF";
				lastCategory = json.data[json.data.length-1].TIME;
							
	        	$.each(json.data, function(i,v){
	        		$.each(v, function(ii,vv){
	        			if(ii=="TIME") return;
	        			if(vv=="") {
	        				delete v[ii];
	        				if(!isLast){
	        					isLast = true; 
	        					indexLast = i-1;
	        					json.data[i-1].bulletClass = "lastBullet";
	        					json.data[i-1].labelText = _data.pv.name + " : " + json.data[i-1][ii];
  								json.data[i-1].labelColor = "#FFF";
  								lastCategory = json.data[i-1].TIME;
	        				}
	        			}
	        		});
	        	});
	        	
	        	//余白分のデータ調整
	        	if(indexLast / json.data.length < .7){
	        		//余白の削除
	        		json.data = json.data.slice(0, indexLast / .7);
	        	}else{
	        		//余白の追加
	        		for(var i = json.data.length; i < indexLast / .7 ; i++){
	        			json.data.push({"TIME":""});
	        		}
	        	}
	        	
	        	settingMain.dataProvider = AmCharts.parseJSON(JSON.stringify(json.data))
	        	
	        	var colorIndex = 0;
			    $.each(json.data[0], function(ii, vv){
					if(ii != "TIME"){
			            settingMain.graphs.push({
			                "id": "g"+ ii,
			                "valueField": ii,
			                "title": ii,
			                "classNameField": "bulletClass",
			                "labelText": "[[labelText]]",
						    "labelOffset": -28,
						    "fontSize": 12,
						    "labelColorField": "labelColor",
			                "bullet": "round",
						    "bulletField": "bullet",
						    "bulletSize": 8,
						    "bulletBorderAlpha": 1,
						    "bulletBorderThickness": 2,
						    "bulletColor": "#BBDEFB",
			                "useLineColorForBulletBorder": true,
			                "lineThickness": 2,
			                "lineColor": "#BBDEFB",
			                "type":"line",
			                "showBalloon": true,
			                "balloonText": "<span><b style='font-size: 10px; color:#BBDEFB; padding-left: 0px;'>[[value]]</b></span>",
			                //"balloonText": "<span style='font-size: 10px; color:"+color[colorIndex]+";'>[[title]]</span><span><b style='font-size: 10px; color:"+color[colorIndex]+"; padding-left: 6px;'>[[value]]</b></span>",
			            });
			            colorIndex++;
			        }
			    });
				var chart = AmCharts.makeChart("divMain", settingMain);
				charts.divMain = {};
				charts.divMain.chart = chart;
				charts.divMain.url = _data.pv.url;
	        }
	    }
	})
		
	//カーソル自動移動
	var autoPlayIndex = 1;
	var playMode = 0;
	var timerAutoPlay;
	$("#svgAutoPlay").on("click", function(){
		playMode = (playMode + 1) % 3;
		switch(playMode){
			case 0: //自由カーソル
				clearInterval(timerAutoPlay);
				$.each(charts, function(i,v){
					v.chart.chartCursor.enabled = true;
					v.chart.chartCursor.addListener("changed", handleCursorChange);
					v.chart.chartCursor.addListener("onHideCursor", handleHideCursor);
				});
				d3.select("#svgAutoPlay g.gAutoPlay").transition().duration(300).style("transform", "translate(-3px, -2px)scale(.08)");
				d3.select("#svgAutoPlay path").transition().duration(300).attr("d", "M368.149,244.383l-146.883-84.805c-2.953-1.707-6.133-2.047-9.09-1.496c-0.126,0.023-0.25,0.027-0.371,0.054   c-0.715,0.152-1.394,0.379-2.07,0.645c-0.23,0.09-0.453,0.183-0.676,0.281c-0.66,0.305-1.297,0.633-1.902,1.035   c-0.062,0.043-0.117,0.094-0.179,0.137c-2,1.379-3.59,3.282-4.606,5.578c-0.054,0.125-0.11,0.242-0.16,0.367   c-0.294,0.726-0.535,1.465-0.699,2.258c-0.031,0.141-0.035,0.293-0.059,0.442c-0.133,0.762-0.316,1.504-0.316,2.32v169.606   c0,0.812,0.183,1.554,0.316,2.32c0.024,0.145,0.028,0.297,0.059,0.438c0.164,0.793,0.406,1.535,0.703,2.262   c0.05,0.122,0.102,0.238,0.152,0.359c1.019,2.305,2.617,4.211,4.625,5.59c0.055,0.039,0.102,0.086,0.16,0.125   c0.61,0.406,1.246,0.734,1.918,1.039c0.214,0.102,0.434,0.191,0.656,0.278c0.68,0.269,1.363,0.496,2.082,0.648   c0.117,0.027,0.242,0.031,0.363,0.054c2.961,0.551,6.137,0.215,9.094-1.492l146.883-84.805   C377.094,262.457,377.094,249.547,368.149,244.383z");
				break;
			case 1: //自動再生モード
				$.each(charts, function(i,v){
					v.chart.chartCursor.removeListener(v.chart.chartCursor, "changed", handleCursorChange);
					v.chart.chartCursor.removeListener(v.chart.chartCursor, "onHideCursor", handleHideCursor);
					v.chart.chartCursor.enabled = false;
				});
				var key = "divMain";
				var categoryLength = charts[key].chart.dataProvider.filter(function(element, index, array) {
					return (element.TIME != "");
				}).length;
				timerAutoPlay = setInterval(function(){
					$.each(charts, function(i,v){
						v.chart.chartCursor.showCursorAt(charts[key].chart.dataProvider[autoPlayIndex].TIME);
					})
					autoPlayIndex = (autoPlayIndex+1) % categoryLength;
				}, 1000);
				
				d3.select("#svgAutoPlay g.gAutoPlay").transition().duration(300).style("transform", "translate(-3px, -2px)scale(.08)");
				d3.select("#svgAutoPlay path").transition().duration(300).attr("d", "M 180 180 h 160 v 160 h -160 z");
				break;
			case 2: //最新断面表示
				clearInterval(timerAutoPlay);
				$.each(charts, function(i,v){
					v.chart.chartCursor.showCursorAt(lastCategory);
				});
				
				d3.select("#svgAutoPlay g.gAutoPlay").transition().duration(300).style("transform", "translate(6px, 5px)scale(.05)");
				d3.select("#svgAutoPlay path").transition().duration(300).attr("d", "M461.74,282.084c-15.492-23.242-36.635-35.027-62.846-35.027c-4.532,0-9.321,0.352-14.241,1.057   c-9.251,1.321-31.562,3.543-63.379,6.315l-38.365-33.239h32.69v20.379l2.657,2.362c1.493-0.123,2.92-0.254,4.38-0.377l53.21-39.284   l-60.246-43.212v26.309H243.87l-3.637-3.149c-10.465-9.275-23.123-15.222-35.408-16.763V76.611h26.326l-43.229-60.262   l-43.229,60.262h26.318v99.956c-1.948,1.559-3.809,3.24-5.502,5.151c-1.583,1.788-2.953,3.69-4.224,5.65H60.246v-26.309L0,204.271   l60.246,43.229V221.19h93.231c1.3,13.606,7.221,27.515,17.534,39.235v71.522h-26.318l43.229,77.042l43.229-77.042h-26.326v-41.408   l44.299,38.333c-13.917,33.641-11.49,48.198-10.608,53.471c4.092,24.456,34.876,56.597,49.437,70.621   c8.21,10.342,18.826,18.527,30.919,23.841c7.98,4.732,34.732,18.846,69.952,18.846c15.254,0,30.168-2.69,44.327-8.004   c53.579-20.084,80.196-65.823,78.797-100.612C511.107,366.13,494.217,330.824,461.74,282.084z M424.306,464.061   c-12.4,4.65-24.419,6.397-35.482,6.397c-33.588,0-58.389-16.115-58.389-16.115c-9.415-3.83-17.607-10.145-23.701-18.272   c0,0-40.071-38.168-43.368-57.876c-2.509-15.032,10.268-43.408,16.476-56.055l-87.08-75.353   c-15.976-15.54-18.625-36.807-8.415-48.337c3.916-4.412,8.919-6.233,14.25-6.233c8.587,0,18.026,4.74,25.141,11.047l89.09,77.182   c25.924-2.215,61.476-5.405,75.385-7.39c3.728-0.533,7.283-0.804,10.682-0.804c17.554,0,30.874,7.29,41.88,23.808   c13.138,19.716,45.119,70.03,46,91.985C487.656,409.998,469.097,447.264,424.306,464.061z");
				break;
		}
	});
	
	//子グラフパネル
	var w = (window.innerWidth - (6 * _data.item.length)) / _data.item.length;
	var color = ["rgb(230,184,62)","rgb(137,179,105)","rgb(110,207,222)","rgb(230,132,64)","rgb(214,131,206)","rgb(226,77,66)"];
	$.each(_data.item, function(i, v){
		var settingTop = $.extend(true, {}, graphSettingsBase);
		var settingBottom = $.extend(true, {}, graphSettingsBase);
		
		///////////////////////////
		//グラフ設定変更
		///////////////////////////
		//グラフタイトル
        settingTop.titles= [
			{
				"text": v.name +" cpu",
				"size": 12,
				"color":"rgba(256,256,256,.8)"
			}
		];
		settingBottom.titles= [
			{
				"text": v.name +" memory",
				"size": 12,
				"color":"rgba(256,256,256,.8)"
			}
		];
		
		//グラフのマージン
		settingBottom.marginRight = 6;
		settingTop.marginRight = 6;
		settingBottom.marginLeft = 36;
		settingTop.marginLeft = 36;
		
		//凡例の設置
		settingTop.legend ={
	        "equalWidths": false,
	        "valueText": "",
	        "useMarkerColorForLabels":true,
	        "position": "absolute",
	        "top":6,
	        "left":0,
	        "color":"rgba(256,256,256,.8)",
	        "fontSize":8,
	        "valueAlign": "left",
	        "valueWidth":0,
	        "markerBorderThickness":0,
	        "markerSize":8,
	        "markerType":"circle",
	    };
	    
	    //危険値ガイドの設置
	    settingTop.valueAxes[0].guides= [{
            "dashLength": 3,
            "inside": true,
            "lineColor":"white",
            "lineThickness": .8,
            "label": "danger",
            "position":"bottom",
            "lineAlpha": 1,
            "value": Number(v.main_standard_val)
        }];
        settingBottom.valueAxes[0].guides= [{
            "dashLength": 3,
            "inside": true,
            "lineColor":"white",
            "lineThickness": .5,
            "label": "danger",
            "position":"bottom",
            "lineAlpha": 1,
            "value": Number(v.sub_standard_val)
        }];
		
		$("#divSub").append("<div class = 'panelItem panelItem"+i+"' style='width:"+ w +"px;height:100%'></div>");
		$(".panelItem"+i).append("<div class='divCharts divChartsUpper' id='divChartsCpu"+ FairingName(v.name) +"'></div><div class='divCharts divChartsBottom' id='divChartsMem"+ FairingName(v.name) +"'></div>");
		
		drawCharts(v.main, "divChartsCpu"+ FairingName(v.name), v.colors, settingTop, Number(v.main_standard_val));
		drawCharts(v.sub, "divChartsMem"+ FairingName(v.name), v.colors, settingBottom, Number(v.sub_standard_val));
	})
	
	//リアルタイム更新
	function UpdateCharts(){
		isFirstDraw = false;
		$.each(charts, function(i, v){
			v.chart.removeListener(v.chart, "zoomed", syncZoom);
			v.chart.chartCursor.removeListener(v.chart.chartCursor, "changed", handleCursorChange);
			v.chart.chartCursor.removeListener(v.chart.chartCursor, "onHideCursor", handleHideCursor);
        	//メイングラフ
        	if(i == "divMain"){
				$.ajax({
		            type: 'GET',
				    url: MakeUrl(_data.pv.url),
				    dataType: 'json',
				    success: function(json){
				        if(json.data && json.data.length > 0) {
				        	//データの整形
				        	var isLast = false;
				        	var indexLast = json.data.length;
				        	json.data[json.data.length-1].bulletClass = "lastBullet";
        					json.data[json.data.length-1].labelText = _data.pv.name + " : " + json.data[json.data.length-1].pv;
							json.data[json.data.length-1].labelColor = "#FFF";
							lastCategory = json.data[json.data.length-1].TIME;
							
				        	$.each(json.data, function(ii,vv){
				        		$.each(vv, function(iii,vvv){
				        			if(iii=="TIME") {
		        						return;
				        			}
				        			if(vvv=="") {
				        				delete vv[iii];
				        				if(!isLast){
				        					isLast = true; 
				        					indexLast = ii-1;
				        					json.data[ii-1].bulletClass = "lastBullet";
				        					json.data[ii-1].labelText = _data.pv.name + " : " + json.data[ii-1][iii];
			  								json.data[ii-1].labelColor = "#FFF";
			  								lastCategory = json.data[ii-1].TIME;
				        				}
				        			}
				        		});
				        	});
				        	
				        	//
				        	
				        	//余白分のデータ調整
				        	if(indexLast / json.data.length < .7){
				        		//余白の削除
				        		json.data = json.data.slice(0, indexLast / .7);
				        	}else{
				        		//余白の追加
				        		for(var ii = json.data.length; ii < indexLast / .7 ; ii++){
				        			json.data.push({"TIME":""});
				        		}
				        	}
				        	
				        	v.chart.dataProvider = json.data;
							v.chart.validateData();
				        }
			        }
		        });
	        }else{
	        	//サブグラフ
	        	$.ajax({
					type: 'GET',
				    url: MakeUrl(v.url),
				    dataType: 'json',
				    success: function(json){
				        if(json.data && json.data.length > 0) {
				        	//データ整形
				        	var colorIndex;
				        	$.each(json.data, function(ii,vv){
				        		colorIndex = 0;
				        		$.each(vv, function(iii,vvv){
				        			if(iii=="TIME") {
				        				json.data[ii].TIME = vvv.substr(0,2) + ":" + vv.substr(-2,2);
				        				return;
				        			}
				        			if(Number(vvv) < v.standardVal) {
				        				json.data[ii]["fillColor" + iii] = "rgba(0,0,0,0)";
				        			}else{
				        				//json.data[ii]["fillColor" + iii] = color[colorIndex];
				        				json.data[ii]["fillColor" + iii] = "#F44336";
				        			}
				        			colorIndex++;
				        		});
				        	});
				        	v.chart.dataProvider = json.data;
							v.chart.validateData();
				        }
		        	}
	        	});
	        }
        })
	}
	setInterval(UpdateCharts, _data.realtimeSecond * 1000);
	
	$("body").append("<div id='divDataName' style='font-size:36px;font-size: 36px;position: absolute;right: 14px;top: 70px;color: white;'></div>");
	var lightAnimationTextCss = {
	    "text-shadow": "0 0 5px #fff, 0 0 10px #fff, 0 0 15px #fff",
	    "-webkit-transition": "0.3s",
	    "transition": "0.3s"
	};
	
    $("#divDataName").text(_data.dataSource.dataSet);
    $("#divDataName").css(lightAnimationTextCss);
    
	//リサイズで再度実行されないように
	this.finished=true;
}
window.Utilization = Utilization;
$(window).resize(function() {
	if(!window.Utilization.finished) return;
	$("#sb-site>div").css({"height": window.innerHeight +"px","width": window.innerWidth +"px"});
	var w = (window.innerWidth - (6 * Utilization.data.item.length)) / Utilization.data.item.length;
	$("div.panelItem").css("width", w + "px");
});
