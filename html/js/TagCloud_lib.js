var TagCloud = {};
TagCloud.data;
TagCloud.finished = false;
TagCloud.main = function(){
    
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
	var rankCategoryIndex = 0;
    var target = "";
    var h = window.innerHeight;
	var w = window.innerWidth;
	var tagClouds;
	var svg;
	var random;
	var countMax;
	var sizeScale;
	var words;
	var layout;
	var selectWord = "";
	var selectCategory = "";
	var areaChartsIndex = 0;
	var displayCategoryIndexNm;
	var filterCategoryIndexNm;
	var filterItem = {};
    var chartCategoryArea;
    
    if(this.finished) return 
	var _data = TagCloud.data;
	
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
	loadCss(MakePath("css/TagCloud.css"));
    	
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
	
	//フィルタリング設定項目一覧
	function WriteFilterDescription(){
	    var display = "none";
	    var description = "";
	    var filterCnt = 0;
	    $.each(filterItem, function(i, v){
	        if(v.length > 0) display = "block";
	        $.each(v, function(ii, vv){
	            filterCnt++;
	            if(filterCnt < 4){
	                description += '\"' + vv + '\", ';
	            }
	        });
	    });
	    if(filterCnt > 3){
	        description = filterCnt + "項目が除外されています。";
	    }else if(filterCnt > 0){
	        description.slice(-1);
	        description += "を除外しています。";
	    }else{
	        description = "フィルタリング項目未選択";
	    }
	    $("#divFilterDescription").text(description);
	    $(".divSelectedFilterItem").height($("#sumaryDiv").position().top - $(".divSelectedFilterItem").position().top - 36);
	}
	
	//データモデル整形
	if(_data.hasOwnProperty("autoPlaySecond")) _data.autoPlaySecond = Number(_data.autoPlaySecond) * 1000;
    else _data.autoPlaySecond = 5000;
    $.each(_data.category, function(i,v){
    	dataLabel[v.targetColumn] = {};
    	dataArea[v.targetColumn] = {};
    	filterItem[v.targetColumn] = new Array();
    })
    displayCategoryIndexNm = _data.category[0].targetColumn;
    filterCategoryIndexNm = _data.category[0].targetColumn;
    
    //DOM整形
    $("#sb-site *").remove();
    var txt = '<svg id="main"></svg>';
    txt += '<div id="divAreaChart" style="position: absolute;bottom: 0;height: 200px;width: '+ (window.innerWidth - 250) +'px;"></div>';
    txt += "<div id='rightPanelDiv'><div id='divFilterDescription' style='width: 294.5px;'>フィルタリング項目未選択</div></div>";
    $("#sb-site").append(txt);
    $("#rightPanelDiv").css({"padding-top":"80px", "width":"250px"});
    
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
    
    var svg = d3.select("#main")
    var background = svg.append("g");
    var vis;
    
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
    $("#manueDiv svg g.gIcon").append(CreateCircle({"cx":"40", "cy":"16", "r":"16", "fill":"rgba(0,0,0,0.5)", "title":"Topic", "class":"circleIconTopic tooltipIcon"}));
    $("#manueDiv svg g.gIcon").append(CreateCircle({"cx":"80", "cy":"16", "r":"16", "fill":"rgba(0,0,0,0.5)", "title":"ranking", "class":"circleIconRanking tooltipIcon"}));
	$("#manueDiv svg g.gIcon").append(CreateCircle({"cx":"120", "cy":"16", "r":"16", "fill":"rgba(0,0,0,0.5)", "title":"filter", "class":"circleIconFilter tooltipIcon"}));
    $("#manueDiv svg g.gIcon").append(CreateCircle({"cx":"170", "cy":"16", "r":"16", "fill":"rgba(0,0,0,0.5)", "title":"windowClose", "class":"circleIconClose tooltipIcon"}));
    $("#manueDiv svg g.gIcon").append(CreateLine({"stroke":"#fff", "x1":"145", "y1":"0", "x2":"145", "y2":"32", "stroke-width":"0.5"}));
    $("#manueDiv svg g.gIcon").append(CreateImage({"x":"-8",  "y":"8",  "id":"iconInfo",  "opacity":".3",  "class":"tooltipIcon",  "title":"info",  "href": MakePath("icon/icon_info.png"),  "width":"16",  "height":"16"}));
    $("#manueDiv svg g.gIcon").append(CreateG({id:"iconTopic", class:"active tooltipIcon"}));
    $("#iconTopic").append(CreateCircle({cx:"33", cy:"10", r:"2", fill:"white"}));
    $("#iconTopic").append(CreateCircle({cx:"33", cy:"16", r:"2", fill:"white"}));
    $("#iconTopic").append(CreateCircle({cx:"33", cy:"22", r:"2", fill:"white"}));
    $("#iconTopic").append(CreateLine({x1:"38", x2:"50", y1:"10", y2:"10", stroke:"white", strokeWidth:"2"}));
    $("#iconTopic").append(CreateLine({x1:"38", x2:"50", y1:"16", y2:"16", stroke:"white", strokeWidth:"2"}));
    $("#iconTopic").append(CreateLine({x1:"38", x2:"50", y1:"22", y2:"22", stroke:"white", strokeWidth:"2"}));
    $("#manueDiv svg g.gIcon").append(CreatePath({"transform":"translate(69.5,5)scale(0.042)", "fill":"rgb(256,256,256)", "opacity":".3", "id":"iconRanking", "class":"tooltipIcon", "title":"ranking", "d":"M512,180.219c0-21.484-17.422-38.891-38.906-38.891c-21.469,0-38.891,17.406-38.891,38.891   c0,10.5,4.172,20,10.938,27c-26.453,54.781-77.016,73.891-116.203,56.578c-34.906-15.422-47.781-59.547-52.141-93.734   c14.219-7.5,23.922-22.406,23.922-39.594c0-24.719-20.016-44.734-44.719-44.734c-24.719,0-44.734,20.016-44.734,44.734   c0,17.188,9.703,32.094,23.938,39.594c-4.359,34.188-17.25,78.313-52.141,93.734C143.875,281.109,93.328,262,66.859,207.219   c6.75-7,10.938-16.5,10.938-27c0-21.484-17.422-38.891-38.906-38.891S0,158.734,0,180.219c0,19.766,14.734,36.031,33.813,38.531   l55.75,207.516h332.875l55.75-207.516C497.25,216.25,512,199.984,512,180.219z",}));
    $("#manueDiv svg g.gIcon").append(CreateImage({"x":"112", "y":"8", "id":"iconFilter", "class":"tooltipIcon", "opacity":"0.3", "title":"filter", "href":MakePath("icon/icon_filter.png"), "width":"16", "height":"16"}));

    //アイコン群の位置調整
    $("#manueDiv svg g.gIcon").css({"transform":"scale(" + resolution + ")", "transform-origin":"right top"});
    $("#manueDiv svg g.gIconPos").css({"transform":"translate(" + ($("#manueDiv").width() - $("#manueDiv svg g.gIconPos").get(0).getBBox().width ) + "px, 60px)", "transform-origin":"right top"});

    //フィルタクローズイベント付与
    $(".circleIconInfo, #iconInfo").on('click', function(){
        $("#rankingDiv, #filterDiv, #topicDiv").css("display", "none");
        $("#infoDiv").css("display", "inherit");
        $("#iconFilter, #iconTopic, #iconRanking").attr("opacity", 0.3);
        $("#iconInfo").attr("opacity", 1);
    });
    $(".circleIconTopic, #iconTopic").on('click', function(){
        $("#rankingDiv, #filterDiv, #infoDiv").css("display", "none");
        $("#topicDiv").css("display", "inherit");
        $("#iconFilter, #iconInfo, #iconRanking").attr("opacity", 0.3);
        $("#iconTopic").attr("opacity", 1);
    });
    $(".circleIconFilter, #iconFilter").on('click', function(){
        $("#rankingDiv, #infoDiv, #topicDiv").css("display", "none");
        $("#filterDiv").css("display", "inherit");
        $("#iconFilter").attr("opacity", 1);
        $("#iconInfo, #iconTopic, #iconRanking").attr("opacity", 0.3);            
        $(".divSelectedFilterItem").height($("#sumaryDiv").position().top - $(".divSelectedFilterItem").position().top - 36);
    });
    $(".circleIconRanking, #iconRanking").on('click', function(){
        $("#rankingDiv").css("display", "inherit");
        $("div.rankTableDiv."+ FairingName(Object.keys(dataLabel[displayCategoryIndexNm])[rankCategoryIndex])).css("display", "block");
        $("#infoDiv, #topicDiv, #filterDiv").css("display", "none");
        $("#iconRanking").attr("opacity", "1");
        $("#iconInfo, #iconTopic, #iconFilter").attr("opacity", 0.3);
    });
    
    $("#manueDiv svg g.gIcon").append(CreateImage({"x": "162","y": "8","class": "active tooltipIcon","id": "windowCloseImage","href": MakePath("icon/icon_close.png"),"title": "windowClose","width":"16","height":"16"}));
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
             $("#windowCloseImage").css("transform", "scaleX(-1)translateX(-340px)");
             isHideMenu = true;
        }
    });
    
    //検索
    $("#sb-site").append('<div id="search" class="searchbox"><input type="text" placeholder="search…"><div id="results"><ul></ul></div></div>');
	$("#search input").keyup(function(){
		target = $(this)[0].value.toLowerCase();
		var c=0;
		if(target == ""){
			tagClouds.style("opacity", function(d) { return d.size * 0.05; })
		}else{
			tagClouds.style("opacity",  function(d){
	        	if (d.verb.toLowerCase().indexOf(target) == -1) return 0.05;
	        	else {
	        		c++;
	        		return .9;
	        	}
	        });
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
    var menuIconSvg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
    menuIconSvg.setAttribute("id", "svgAutoPlay");
    menuIconSvg.setAttribute("height", 40);
    menuIconSvg.setAttribute("width", 40);
    menuIconSvg.setAttribute("style", "z-index:1; position: absolute;left: 70px;top: 20px;background: rgba(0,0,0,0.8); border-radius: 20px;");
    $("body").append(menuIconSvg);
    $("#svgAutoPlay").append(CreateG({"style":"transform: translate(-4px, -3px) scale(0.09); opacity:.8;"}));
    $("#svgAutoPlay g").append(CreatePath({fill:"white", "class":"tooltipIcon", "title":"AutoPlay", d:"M368.149,244.383l-146.883-84.805c-2.953-1.707-6.133-2.047-9.09-1.496c-0.126,0.023-0.25,0.027-0.371,0.054   c-0.715,0.152-1.394,0.379-2.07,0.645c-0.23,0.09-0.453,0.183-0.676,0.281c-0.66,0.305-1.297,0.633-1.902,1.035   c-0.062,0.043-0.117,0.094-0.179,0.137c-2,1.379-3.59,3.282-4.606,5.578c-0.054,0.125-0.11,0.242-0.16,0.367   c-0.294,0.726-0.535,1.465-0.699,2.258c-0.031,0.141-0.035,0.293-0.059,0.442c-0.133,0.762-0.316,1.504-0.316,2.32v169.606   c0,0.812,0.183,1.554,0.316,2.32c0.024,0.145,0.028,0.297,0.059,0.438c0.164,0.793,0.406,1.535,0.703,2.262   c0.05,0.122,0.102,0.238,0.152,0.359c1.019,2.305,2.617,4.211,4.625,5.59c0.055,0.039,0.102,0.086,0.16,0.125   c0.61,0.406,1.246,0.734,1.918,1.039c0.214,0.102,0.434,0.191,0.656,0.278c0.68,0.269,1.363,0.496,2.082,0.648   c0.117,0.027,0.242,0.031,0.363,0.054c2.961,0.551,6.137,0.215,9.094-1.492l146.883-84.805   C377.094,262.457,377.094,249.547,368.149,244.383z"}));
    $("#svgAutoPlay").on("click", function(){
    	if(isAutoPlay){
    		clearInterval(timerAutoPlay);
    		d3.select("#svgAutoPlay g").transition().duration(300).style("transform", "translate(-4px, -3px) scale(0.09)");
			d3.select("#svgAutoPlay g path").transition().duration(300).attr("d", "M368.149,244.383l-146.883-84.805c-2.953-1.707-6.133-2.047-9.09-1.496c-0.126,0.023-0.25,0.027-0.371,0.054   c-0.715,0.152-1.394,0.379-2.07,0.645c-0.23,0.09-0.453,0.183-0.676,0.281c-0.66,0.305-1.297,0.633-1.902,1.035   c-0.062,0.043-0.117,0.094-0.179,0.137c-2,1.379-3.59,3.282-4.606,5.578c-0.054,0.125-0.11,0.242-0.16,0.367   c-0.294,0.726-0.535,1.465-0.699,2.258c-0.031,0.141-0.035,0.293-0.059,0.442c-0.133,0.762-0.316,1.504-0.316,2.32v169.606   c0,0.812,0.183,1.554,0.316,2.32c0.024,0.145,0.028,0.297,0.059,0.438c0.164,0.793,0.406,1.535,0.703,2.262   c0.05,0.122,0.102,0.238,0.152,0.359c1.019,2.305,2.617,4.211,4.625,5.59c0.055,0.039,0.102,0.086,0.16,0.125   c0.61,0.406,1.246,0.734,1.918,1.039c0.214,0.102,0.434,0.191,0.656,0.278c0.68,0.269,1.363,0.496,2.082,0.648   c0.117,0.027,0.242,0.031,0.363,0.054c2.961,0.551,6.137,0.215,9.094-1.492l146.883-84.805   C377.094,262.457,377.094,249.547,368.149,244.383z");
    	}else{
    		var autoPlayIndex = chartCategoryArea.chartCursor.index;
    		autoPlayIndex = (autoPlayIndex+1) % chartCategoryArea.dataProvider.length ;
    		chartCategoryArea.chartCursor.showCursorAt(chartCategoryArea.dataProvider[autoPlayIndex].time);
        	timerAutoPlay = setInterval(function(){
        		autoPlayIndex = (autoPlayIndex+1) % chartCategoryArea.dataProvider.length ;
        		chartCategoryArea.chartCursor.showCursorAt(chartCategoryArea.dataProvider[autoPlayIndex].time);
        	}, _data.autoPlaySecond)
        	
        	d3.select("#svgAutoPlay g").transition().duration(300).style("transform", "translate(-1px, -4px) scale(0.09)");
			d3.select("#svgAutoPlay g path").transition().duration(300).attr("d", "M 180 180 h 160 v 160 h -160 z");
    	}
    	isAutoPlay = !isAutoPlay;
    });
    
    //インフォ
    $("div#rightPanelDiv").append('<div id="infoDiv" style="display:none;"><div class="subTittle">info</div><div id="switchColor"></div><</div>');
    $.each(_data.category, function(i,v){
	    $("#switchColor").append("<span class=" + v.targetColumn+ " style='opacity:"+ (i==0?1:.5) +"'>" + v.name +"</span>");
    })
    $("#switchColor span").on('click', function(i, v){
    	
    	$("#switchColor span").css("opacity", .5);
    	$(this).css("opacity", 1);
    	
    	displayCategoryIndexNm = $(this).attr("class");
    	tagClouds.transition().duration(1000).style("fill", function(d, i){
			return dataLabel[displayCategoryIndexNm][d[displayCategoryIndexNm]].color ? dataLabel[displayCategoryIndexNm][d[displayCategoryIndexNm]].color : "rgba(256,256,256,.5)";
		});
		
		//ラベル再作成
		$("#main g.gLabelPos").remove();
		MakeLabel(dataLabel[displayCategoryIndexNm]);
		
		//面グラフのインデックス記憶
		areaChartsIndex = chartCategoryArea.chartCursor.index;
		
		var data = GetAreaChartsData();
		//面グラフ作成
		chartCategoryArea.graphs = new Array();
		var widthNm = Object.keys(data[0]).map(function(v, i) { 
        	if(v!="time") return v.toString().length;
        	else return 0;
        });
        var widthVal = data.map(function(v, i) { 
        	var maxValLength = Object.keys(v).map(function(vv, ii) { 
	        	if(vv != "time") return v[vv].toString().length;
	        	else return 0;
	        });
	        return Math.max.apply(null, maxValLength);
        });
        widthNm = Math.max.apply(null, widthNm) * 10 - 12;
        widthVal = Math.max.apply(null, widthVal) * 10;
		var transX = Object.keys(dataLabel[displayCategoryIndexNm]).length;
		
		$.each(dataLabel[displayCategoryIndexNm], function(ii, vv){
			var graph = new AmCharts.AmGraph();
		    graph.id = "g"+ ii;
            graph.valueField = ii;
            graph.fillAlphas = 0.4;
	        graph.lineAlpha = 0.8;
	        graph.hidden = filterItem[displayCategoryIndexNm].indexOf(ii) > -1 ? true : false;
            graph.title = ii;
            graph.fillColors = vv.color,
            graph.lineColor = vv.color,
            graph.showBalloon = true;
            graph.balloonFunction =  function(item, g) {
              var col = vv.color;
	          return "<div style='line-height: 18px; transform:translate(0px, -"+ transX +"px)'><span style='font-size: "+10+"px; color:"+ col +"; width:"+ widthNm +"px;'>"+ g.title +"</span><span style='font-size: 14px; color:"+ col +"; width:"+ widthVal +"px;'><b>"+ item.values.value +"</b></span><span style='font-size: 10px; color:"+ col +"; width:50px;'><b>(" + Math.floor(item.values.percents * 10) / 10 + "%)</span></div>";
		    },
		    chartCategoryArea.addGraph(graph);
        });
        
		chartCategoryArea.dataProvider = data;
		chartCategoryArea.validateData();
		
		//ランキングの更新
		MakeRankDiv();
		
		//トピックの更新
		MakeTopic();
    })
    
    //トピック
    $("div#rightPanelDiv").append('<div id="topicDiv"><div class="subTittle">Topic<span id="spanSelectTopic">未選択</span></div><table id="gridTable"><tbody><tr><td></td><td></td><td></td></tr></tbody></table></div>');
    var topicHight = $("#sumaryDiv").position().top - $("#gridTable").position().top - 24;
    $("#gridTable").css({"height":topicHight + "px"});
    
    //ランキング
    $("div#rightPanelDiv").append('<div id="rankingDiv" style="display:none;"><div class="subTittle">Ranking</div>');
    if(_data.ranking.length > 0) $("#rankingDiv div.subTittle").append('<span id="spanRankingCategory"></span>');
    $("#spanRankingCategory").on('click', function(){
        rankCategoryIndex = (rankCategoryIndex + 1) % Object.keys(dataLabel[displayCategoryIndexNm]).length;
        $(this).text(Object.keys(dataLabel[displayCategoryIndexNm])[rankCategoryIndex] + " ▼");
        $("div.rankTableDiv").css("display", "none");
        $("div.rankTableDiv."+ FairingName(Object.keys(dataLabel[displayCategoryIndexNm])[rankCategoryIndex])).css("display", "block");
    });
    function MakeRankDiv(){
    	if(_data.ranking.length == 0) return;
    	
    	$("div#rankingDiv div.rankTableDiv").remove();
    	$("#spanRankingCategory").text(Object.keys(dataLabel[displayCategoryIndexNm])[rankCategoryIndex] + " ▼");
    	
    	var rankingHtml = new StringBuffer();
    	$.each(dataLabel[displayCategoryIndexNm], function(i, v){
    		var className = FairingName(i);
        	rankingHtml.append('<div class="rankTableDiv '+ className +'">');
        	$.each(_data.ranking, function(ii, vv){
        		var divId = "rankDiv" + className + FairingName(vv.title);
            	rankingHtml.append('<div class="rankingSubTittle">'+ vv.title +'</div><div id="'+ divId +'" class="rankTableSvgDiv"><div class="loadingRankDiv" style="height: '+ ((20 * _rankingCount) + 50) +'px;transform: scale(0.75);"><div class="loadingSpace" style="height: 50%;"></div><div class="loadingCircle1"></div><div class="loadingCircle2"></div></div></div>');
            	var url = MakeUrl(vv.url);
				url += '&TAG_FILTER=[{"operator":"in","key":["'+ displayCategoryIndexNm +'"],"showKey":"","value":["' + i + '"],"pid":"","searchId":""}]';
            	$.ajax({
			        type: 'GET',
			        url: url,
			        dataType: 'json',
			        success: function(json){
			        	$("#"+ divId + " div.loadingRankDiv").remove();
			        	MakeRankSvg(json.data, divId)
			        }
				})
            })
            rankingHtml.append('</div>');
        });
        rankingHtml.append('</div>');
        $("div#rankingDiv").append(rankingHtml.toString());
        
        $("div.rankTableDiv").css("display", "none");
        $("div.rankTableDiv." + FairingName(Object.keys(dataLabel[displayCategoryIndexNm])[rankCategoryIndex])).css("display", "block");
    }
    var _rankingCount = 5;
    function MakeRankSvg(graphData, targetTableId){
	    var svg = d3.select("#" + targetTableId).append("svg")
            .attr("width", $("#rightPanelDiv").width()).attr("height", 20 * _rankingCount);
        
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
	        
	    svg.selectAll("text.rankItemName")
	        .data(graphData.slice(0, 5))
	        .enter()
	        .append("text")
	        .text(function(d, i){
	            return (i+1) + ". " + d.category;
	        })
	        .attr("class", "rankItemName")
	        .attr("x", 24)
	        .attr("y", function(d,i){
	            return (i * 20 + 10);
	        })
	        .attr("font-size", 12)
	        .attr("fill", "#FFF")
	        
	    svg.selectAll("text.rankItemValue")
	        .data(graphData.slice(0, 5))
	        .enter()
	        .append("text")
	        .text(function(d){
	            return d.value;
	        })
	        .attr("class", "rankItemValue")
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
    	$("div.divFilterItemList").append("<ul id='ul"+ v.targetColumn +"' style='display:"+ (i==0 ? "block" : "none") +";'></ul>");
    });
    $("#spanFilterCategory").text(_data.category[0].name + "▼");
    var ind = 0;
    $("#spanFilterCategory").on("click", function(){
    	ind = (ind + 1) % _data.category.length;
        filterCategoryIndexNm = _data.category[ind].targetColumn;
        $("#spanFilterCategory").text(_data.category[ind].name + "▼");
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
    function MakeFilter(){
    	$.each(dataLabel, function(i, v){
    		$.each(v, function(ii, vv){
	            $("#ul" + i).append("<li><label><input type='checkbox' class='checkbox' value='"+ FairingName(ii) +"'/><span class='checkbox-icon'>"+ ii +"</span></label></ul>");
	        });
	        
	        //チェックボックスチェックイベント
	        $("#ul" + i +" li input").change(function(){
	        	var category = $(this).parents("ul").attr("id").substr(2);
	        	if ($(this).is(':checked')) {
	            	//フィルタ選択
	                $('div.divSelectedFilterItem').prepend('<span class="spanSelectedFilterItem '+ this.value +'" data-filter="'+ FairingName(this.value) +'">'+ this.value +'<span class="spanClearFilter">&#10006;</span></span>');
	                $("span.spanClearFilter").off('click');
	                $("span.spanClearFilter").on("click", function(){
	                    $("input[value='"+ $(this).parent().attr("data-filter") +"']").prop("checked", false).change();
	                    $(this).parent().remove();
	                });
	                //フィルタリングアイテム追加
	                filterItem[filterCategoryIndexNm].push($(this).next().text());
	            } else {
	            	//フィルタ解除
	                var target = this.value;
	                var nm = $(this).next().text();
	                $('div.divSelectedFilterItem span.'+ target).remove();
	                filterItem[category].some(function(vv, ii){
	                    if (vv == nm) filterItem[category].splice(ii,1);
	                });
	            }
			    UpdateTag();
			    
			    //面グラフの更新
			    areaChartsIndex = chartCategoryArea.chartCursor.index;
			    chartCategoryArea.dataProvider = GetAreaChartsData();
				chartCategoryArea.validateData();
			    if(filterCategoryIndexNm == category){
			    	//表示している凡例ラベルの項目でフィルタリングする場合
			    	$.each(chartCategoryArea.graphs, function(ii, vv){
			    		if(filterItem[filterCategoryIndexNm].length > 0){
			    			$.each(filterItem[filterCategoryIndexNm], function(i, v){
					    		if(vv.title == v) chartCategoryArea.hideGraph(vv);
					    		else if(vv.hidden && filterItem[filterCategoryIndexNm].indexOf(vv.title) == -1) chartCategoryArea.showGraph(vv);
					    	})
			    		}else{
			    			if(vv.hidden) chartCategoryArea.showGraph(vv);
			    		}
				    })
			    }
			    //フィルタリングリスト記述
	            WriteFilterDescription();
	        });
    	})
    }
    
    function GetAreaChartsData(){
    	//表示している凡例ラベル以外の項目でフィルタリングする場合
    	dataAreaTmp = new Array();
    	dataArea = new Array();
    	$.each(dataTag, function(i, v){
    		var obj = {};
    		obj.time = i;
    		obj.data = v;
    		dataAreaTmp.push(obj);
    	});
    	
    	$.each(dataAreaTmp, function(i,v){
    		var obj = {};
			$.each(dataLabel[displayCategoryIndexNm], function(ii,vv){
				obj[ii] = v.data.filter(function(d) {
					var isTarget = d[displayCategoryIndexNm] == ii ? true : false;
					if(isTarget){
						$.each(filterItem, function(iii, vvv){
							if(vvv.length > 0 && vvv.indexOf(d[iii]) > -1){
								isTarget = false;
							}
				    	})
					}
					return isTarget;
				});
				obj[ii] = obj[ii].map(function(d) {
			        return d.val;
			    });
			    if(obj[ii].length > 0){
					obj[ii] = obj[ii].reduce(function(prev, current, i, arr) {
				        return prev + current;
				    });
			    }else{
			    	obj[ii] = 0;
			    }
			})
			obj.time = v.time;
			dataArea.push(obj);
		})
		return dataArea;
    }
    
    function MakeAmCharts(divId, chartData){
    	var graphSettings = {
		    "type": "serial",
		    "theme": "light",
		    "autoMargins": false,
		    "marginRight":6,
		    "marginTop": 30,
		    "marginLeft": 6,
		    "marginBottom": 12,
		    "addClassNames": true,
            "dataProvider": AmCharts.parseJSON(JSON.stringify(chartData)),
            "zoomControl": {
				"zoomControlEnabled": false
			},
		    "valueAxes": [{
                "id": "v1",
                "stackType": "regular",
                "axisAlpha": 0,
                "offset":0,
                "color":"rgba(256,256,256,0.5)",
                "ignoreAxisWidth":true,
                "autoGridCount":false,
                "gridCount": 0,
                "balloon": {
                  "enabled": false,
                },
            }],
		    "graphs": [],
		    "plotAreaBorderAlpha": 0,
		    "chartScrollbar": {
                "enabled": false,
            },
		    "chartCursor": {
		        "cursorAlpha": 0.3,
		        "cursorColor":"#FAFAFA",
		        "zoomable": false,
		        "color": "#FAFAFA",
		        "categoryBalloonColor":"rgba(0,0,0,0)",
		        "categoryBalloonFunction": adjustBalloonText,
		        "leaveCursor":true,
				"listeners": [{
	                "event": "changed", //changed
					"method": ChangedCursor
	            }]
		    },
		    "chartScrollbar": {
                "enabled": false,
            },
		    "categoryField": "time",
		    "categoryAxis": {
		        "startOnAxis": false,
		        "parseDates": false,
                "dashLength": 0,
                "axisColor": "#FFF",
                "color": "rgba(256,256,256,0.5)",
                "minorGridEnabled": false,
                "gridAlpha": 0,
                "fontSize": 8,
                "autoGridCount":false,
                "gridCount":0,
                "position":"top",
		    },
		    "balloon": {
              "color": "#E0E0E0",
              "borderAlpha":0,
              "fillAlpha": 0,
              "shadowAlpha":0,
              "cornerRadius": 20,
              "borderThickness": 0,
              "verticalPadding": -4,
              "fontSize": 8,
            },
		    "listeners": [{
                "event": "drawn",
				"method": DrawnAmcharts
            }]
		};
        
        var widthNm = Object.keys(chartData[0]).map(function(v, i) { 
        	if(v!="time") return v.toString().length;
        	else return 0;
        });
        var widthVal = chartData.map(function(v, i) { 
        	var maxValLength = Object.keys(v).map(function(vv, ii) { 
	        	if(vv != "time") return v[vv].toString().length;
	        	else return 0;
	        });
	        return Math.max.apply(null, maxValLength);
        });
        widthNm = Math.max.apply(null, widthNm) * 10 - 12;
        widthVal = Math.max.apply(null, widthVal) * 10;
        var transX = Object.keys(chartData[0]).length - 1;
        
        $.each(dataLabel[displayCategoryIndexNm], function(ii, vv){
			if(ii != "time"){
				graphSettings.graphs.push({
	                "id": "g"+ ii,
	                "valueField": ii,
	                "fillAlphas": 0.4,
	                "fillColors": vv.color,
	                "lineColor": vv.color,
			        "lineAlpha": 0.8,
	                "title": ii,
	                "showBalloon": true,
	                "balloonFunction" : function(item, g) {
	                  var col = vv.color;
	                  return "<div style='line-height: 18px; transform:translate(0px, -"+ transX +"px)'><span style='font-size: "+10+"px; color:"+ col +"; width:"+ widthNm +"px;'>"+ g.title +"</span><span style='font-size: 14px; color:"+ col +"; width:"+ widthVal +"px;'><b>"+ item.values.value +"</b></span><span style='font-size: 10px; color:"+ col +"; width:50px;'><b>(" + Math.floor(item.values.percents * 10) / 10 + "%)</span></div>";
				    },
	            });
            }
        });
        
        chartCategoryArea = AmCharts.makeChart(divId, graphSettings);
    }
    function adjustBalloonText(graphDataItem, graph){
    	return '<div style="color:#FFF; opacity: .6;">'+ graphDataItem +'</div><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" xml:space="preserve" height="30" width="30"><g><path transform="scale(.03)" opacity=.6 fill="#1da1f2" d="M874.5,236.8c41.5-24.1,73.4-62.1,88.4-107.5c-38.9,22.3-81.9,38.5-127.7,47.2c-36.7-37.8-88.9-61.4-146.8-61.4c-111,0-201.1,87-201.1,194.4c0,15.2,1.8,30.1,5.2,44.3c-167.1-8.1-315.3-85.5-414.4-203.1C60.9,179.3,51,212.7,51,248.3c0,67.4,35.5,126.9,89.4,161.8c-33-1-64-9.8-91.1-24.3c0,0.8,0,1.6,0,2.4c0,94.2,69.3,172.7,161.3,190.6c-16.9,4.4-34.6,6.8-53,6.8c-13,0-25.6-1.2-37.8-3.5c25.6,77.2,99.8,133.4,187.8,135c-68.8,52.1-155.5,83.2-249.7,83.2c-16.2,0-32.2-0.9-48-2.7C99,852.8,204.7,885,318.2,885c369.8,0,572.1-296.2,572.1-553.1c0-8.4-0.2-16.8-0.6-25.1C929,279.4,963,245.1,990,206.1C953.9,221.6,915.2,232.1,874.5,236.8z"/></g></svg>';
	}
    function DrawnAmcharts(d){
    	d.chart.chartCursor.showCursorAt(d.chart.categoryAxis.data[areaChartsIndex].category);
    	TagCloud.finished = true;
    }
    var key;
    function ChangedCursor(d){
    	if(d.hasOwnProperty("index")){
    		key = d.chart.dataProvider[d.index].time;
    		UpdateTag(key);
    	}
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
    
    function WindowResize(){
    	
    }
    WindowResize();
    window.addEventListener('resize', WindowResize);
    
    var selectData;
	var selectElement;
    function ClickTag(d) {
		$('#gridTable tbody').children().remove();
		if($("#spanSelectTopic").text() == d.verb){
			$("#spanSelectTopic").text("未選択").css("color", "#FFF");
			d3.select(this).style("text-shadow", function(d) { 
				return "0 0 " + d.size/10 + "px #212121, 0 0 " + d.size/5 + "px #212121";
			})
			
			selectWord = "";
			selectCategory = "";
			selectData = null;
			selectElement = null;
	
			if (jqxhrTopic) {
            	jqxhrTopic.abort();
            }
		}else{
			selectData = d;
			selectElement = this;
			MakeTopic();
		}
	}
    
    function MakeTopic(){
    	if(!selectData || !selectElement) return;
		
    	$('#gridTable tbody').children().remove();
    	
    	//フィルタワードのセット
		$("#spanSelectTopic").text(selectData.verb).css("color", dataLabel[displayCategoryIndexNm][selectData[displayCategoryIndexNm]].color);
		
		//ワードのシャドウ切替
		d3.selectAll("g.vis text").style("text-shadow", function(dd) { 
			return "0 0 " + dd.size/10 + "px #212121, 0 0 " + dd.size/5 + "px #212121";
		})
		d3.select(selectElement).style("text-shadow", function(dd) { 
			return "0 0 " + dd.size/10 + "px #FFF, 0 0 " + dd.size/5 + "px #FFF";
		})
		
		selectWord = selectData.verb;
		selectCategory = selectData[displayCategoryIndexNm];
		
		//トピックデータの取得
		var url = MakeUrl(_data.topic_url);
		url += '&TAG_FILTER1=[{"operator":"in","key":["'+ _data.wordColumn +'"],"showKey":"","value":["' + selectData.verb + '"],"pid":"","searchId":""}]';
		url += '&TAG_FILTER2=[{"operator":"in","key":["'+ displayCategoryIndexNm +'"],"showKey":"","value":["' + selectData[displayCategoryIndexNm] + '"],"pid":"","searchId":""}]';
		jqxhrTopic = $.ajax({
	        type: 'GET',
	        url: url,
	        dataType: 'json',
	        success: function(json){
	        	var i = 0;
	        	$.each(json.data, function(i, v){
	        		$('#gridTable tbody').prepend("<tr><td><div>"+ v.TEXT +"</div></td></tr>");
	        	});
	        }
		})
    }
    
	function draw(newWords, e) {
		
		tagClouds = vis.selectAll("text").data(newWords, function(t) {
	        return t.verb.toLowerCase()
	    });
    
		//更新ワード
		//tagClouds = vis.selectAll("text").data(newWords);
		tagClouds
		.transition().duration(1000)
		.attr({
			"transform": function(d) {
				return "translate(" + d.x + "," + d.y + ")";
			}
		})
		.style({
			"fill": function(d, i) {
				return dataLabel[displayCategoryIndexNm][d[displayCategoryIndexNm]].color ? dataLabel[displayCategoryIndexNm][d[displayCategoryIndexNm]].color : "rgba(256,256,256,.5)";
			},
			"text-shadow": function(d) { 
				if(d.category == selectCategory && d.verb == selectWord){
					return "0 0 " + d.size/10 + "px #FFF, 0 0 " + d.size/5 + "px #FFF";
				}else{
					return "0 0 " + d.size/10 + "px #212121, 0 0 " + d.size/5 + "px #212121";
				}
			},
			"font-size": function(d) {
				return d.size + "px"; 
			},
			"fill": function(d, i) {
				return dataLabel[displayCategoryIndexNm][d[displayCategoryIndexNm]].color ? dataLabel[displayCategoryIndexNm][d[displayCategoryIndexNm]].color : "rgba(256,256,256,.5)";
			},
			"opacity":function(d) {
				if(target == "") return d.size * 0.05;
				else if (d.verb.toLowerCase().indexOf(target) == -1) return 0.05;
			    else return .9;
			},
		});
		
		//新しいワード
		tagClouds.enter().append("text")
		.attr({
			"transform": function(d) {
				return "translate(" + d.x + "," + d.y + ")";
			},
		})
		.style({
			"fill": function(d, i) {
				return dataLabel[displayCategoryIndexNm][d[displayCategoryIndexNm]].color ? dataLabel[displayCategoryIndexNm][d[displayCategoryIndexNm]].color : "rgba(256,256,256,.5)";
			},
			"opacity": 0,
			"font-size": 1,
		})
		.transition().duration(1000)
		.style({
			"text-shadow": function(d) { 
				if(d.category == selectCategory && d.verb == selectWord){
					return "0 0 " + d.size/10 + "px #FFF, 0 0 " + d.size/5 + "px #FFF";
				}else{
					return "0 0 " + d.size/10 + "px #212121, 0 0 " + d.size/5 + "px #212121";
				}
			},
			"font-size": function(d) {
				return d.size + "px"; 
			},
			"opacity":function(d) {
				if(target == "") return d.size * 0.05;
				else if (d.verb.toLowerCase().indexOf(target) == -1) return 0.05;
			    else return .9;
			},
		})
		
		//テキストの更新
		tagClouds
		.style("text-anchor", "middle")
		.text(function(d) { return d.verb; })
		.on("click", ClickTag);
		
		//余分なワードの削除
		var gBk = background.attr("transform", vis.attr("transform")).append("g").attr("transform", vis.attr("transform"))
	      , node = gBk.node();
	    tagClouds.exit().each(function() {
	        node.appendChild(this)
	    });
	    gBk.transition().duration(1000).style("opacity", 1e-6).remove();
	}
	
    function UpdateTag(){
    	var dataWords;
    	dataWords = dataTag[key].filter(function(d) {
    		var isTarget = true;
			$.each(filterItem, function(i, v){
				if(v.length > 0 && v.indexOf(d[i]) > -1){
					isTarget = false;
				}
	    	})
			return isTarget;
		});
    	
    	random = d3.random.irwinHall(2)
		countMax = d3.max(dataWords, function(d){ return d.val} );
		sizeScale = d3.scale.linear().domain([0, countMax]).range([5, 60])
		words = dataWords.map(function(d) {
			var obj = {
				verb: d.verb,
				size: sizeScale(d.val),
			};
			$.each(_data.category, function(i, v){
				obj[v.targetColumn] = d[v.targetColumn];
			});
			return obj;
		});
	 	layout.stop().words(words).on("end", draw).start();
    }
    
    //メイン処理
    $.ajax({
        type: 'GET',
        url: MakeUrl(_data.data_url),
        dataType: 'json',
        success: function(json){
        	
        	if(json.data.length==0) console.log("データ読込失敗");
        	$("#loadingDiv").css({
	            "opacity": "0",
	            "-webkit-transition": "1s",
	            "transition": "1s"
	        });
	        setTimeout(function(){
	            $("#loadingDiv").css("display","none");
	        }, 1000);
        	
			//日付ごとの連想配列に変換する
			key = json.data[0].time;
			var colorIndex = {};
			$.each(_data.category, function(i, v){
				colorIndex[v.targetColumn] = 0;
			})
			
			$.each(_data.category, function(ii, vv){
				var arrLabel = new Array();
				$.each(json.data, function(i,v){
					
					if(arrLabel.indexOf(v[vv.targetColumn]) == -1){
						arrLabel.push(v[vv.targetColumn])
					}
					
					v.val = Number(v.val);
					
					if(ii == 0){
						if(dataTag.hasOwnProperty(v.time)){
							dataTag[v.time].push(v);
						}else{
							dataTag[v.time] = new Array();
							dataTag[v.time].push(v);
						}
					}
					
					if(dataArea[vv.targetColumn].hasOwnProperty(v.time)){
						if(dataArea[vv.targetColumn][v.time].hasOwnProperty(v[vv.targetColumn])) dataArea[vv.targetColumn][v.time][v[vv.targetColumn]] += v.val;
						else dataArea[vv.targetColumn][v.time][v[vv.targetColumn]] = v.val;
					}else{
						dataArea[vv.targetColumn][v.time] = {};
						dataArea[vv.targetColumn][v.time][v[vv.targetColumn]] = v.val;
					}
				})
				
				//ラベルのソート（五十音順）
				arrLabel.sort(function(a,b){
			        if( a.toUpperCase() < b.toUpperCase() ) return -1;
			        if( a.toUpperCase() > b.toUpperCase() ) return 1;
			        return 0;
				});
				$.each(arrLabel, function(i, v){
					dataLabel[vv.targetColumn][v] = {};
					dataLabel[vv.targetColumn][v].color = vv.color[colorIndex[vv.targetColumn]];
					colorIndex[vv.targetColumn]++;
				})
				
				dataArea[vv.targetColumn] = Object.keys(dataArea[vv.targetColumn]).map(function(key, index) {
					var obj = dataArea[vv.targetColumn][key];
					obj.time = key;
					return obj;
				});
			})
			
			random = d3.random.irwinHall(2)
			countMax = d3.max(dataTag[key], function(d){ return d.val} );
			sizeScale = d3.scale.linear().domain([0, countMax]).range([5, 60])
			words = dataTag[key].map(function(d) {
				var obj = {
					verb: d.verb,
					size: sizeScale(d.val),
				};
				$.each(_data.category, function(i, v){
					obj[v.targetColumn] = d[v.targetColumn];
				});
				return obj;
			});
		 	
		 	MakeLabel(dataLabel[displayCategoryIndexNm]);
		 	
		 	vis = svg.attr({
					"width": w,
					"height": h
				})
				.append("g")
				.attr("class", "vis")
				.style("transform", "translate("+ (w-250)/2 +"px,"+ (h-200)/2 +"px)");
				
			layout = d3.layout.cloud().size([w, h])
				.words(words)
				.rotate(function() { return Math.round(1-random()) * 0; }) //ランダムに文字を90度回転
				.fontSize(function(d) { return d.size; })
				.on("end", draw) //描画関数の読み込み
				.start();
			
			MakeAmCharts("divAreaChart", dataArea[displayCategoryIndexNm]);
			
			//ラベルが先頭にくるようにインデックス調整
			$("#main").append($(".gLabelPos"));
			
			
			//キャンバスズームの追加
		    var zoomMin = 0.5;
			var zoomMax = 5;
			var preZoom = 1;
			var isZoom = false;
		    function initZoom(x, y, scale){
		    	zoom = d3.behavior.zoom();
				if(x!= null && y != null) zoom.translate([x, y]);
				if(scale != null) zoom.scale(scale);
				zoom.on("zoom", zoomFunction);
				svg.call( zoom ) ;
			}
			function zoomFunction(){
				if(isZoom){
					var event = d3.event ;
					tx = event.translate[0];
					ty = event.translate[1];
					
					if(false){
						self.__cell_size *= (event.scale > preZoom ? 1.2 : 0.8);
						preZoom = event.scale;
						self.__draw(self.__cell_size, svg, color_variable, selected_colors, to_include, drill_variables);
					}
					d3.select("g.vis").style( "transform", "translate( " + tx + "px, " + ty + "px )scale("+event.scale+")") ;
				}
			}
			initZoom(w/3, h/3);
			
			MakeRankDiv();
			MakeFilter();
        }
    });
}
window.TagCloud = TagCloud;
