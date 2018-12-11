var Map = {};
Map.data;
Map.finished = false;
Map.main = function(){
	
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
	loadCss(MakePath("css/map.css"));
	
	//暫定リリース用
	if(this.finished) return
	var _data = Map.data;
	
	//////////////////////////////
	//定数
	//////////////////////////////
	var _monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
	var _weekNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	var _weekShortNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	var _topicRowHeight = 43;
	var _rankingCount = 5;

	//////////////////////////////
	//変数(必要に応じて値を変更)
	//////////////////////////////
	var isAutoPlay = false;
	var timerAutoPlay;
	var timerMiniGraph;
	var jqxhr; //ajax通信オブジェクト
	var jqxhrTopic;
	var d3_svg;
	var gCircle;
	var gJapan;
	var topicChart;
	var selectedHistory;
	var selectedHistoryIndex = 0;
	var datasourceMenu = {};
	var rankingData = {};
	var selectedCategory = "";
	var selectedDatasource = "";
	var selectedDescription = "";
	var selectedPrerequisite = "";
	var mainCircleClass = "main showed" 
	var resolution = (1 + devicePixelRatio) / 2; //画素数対応
	var animeStrokeWidthTo = 0.1; //獲得情報を描画する際の円の大きさ
	var topicCount = 1; //表示するトピック数初期値
	var stdStopDeviation = 1; //fillドロップシャドウ
	var stdMoveDeviation = 5; //fillドロップシャドウ
	var selectedIcon = "info";
	var isVisibleMode = false;
	var isOpenTimeControler = false;
	var isSegmentation = false;
	var isLabelOpen = false;
	var isOpenMenu = false;
	var clearChurmFlg=true;
	var isZoomedPrefectures = "";
	var filterColor;
	var successAjax = true;
	var whatTimeIs; //データ取得時の時刻を保存
	var isSelectedDivision; //選択された統計先
	var w = window.innerWidth;
	var h = window.innerHeight;
	var k;
	var circleRadius = 1 * resolution;
	var tooltipGraphTypeIndex = 0;
	var chartsStartIndex;
	var chartsEndIndex;
	var mapDisplayWidth = window.innerWidth - (window.innerWidth / 2 - 250);
	var filterCategoryIndex = 0; //フィルタ選択のインデックス
	var rankCategoryIndex = 0; //選択されているランキングのカテゴリ
	var rankCategoryNameList; //ランキングのカテゴリのリスト
	var allGrossData = new Array();
	var insertDates = new Array();
	var upgradeDates = new Array();
	var textData = new Array();
	var arrAllvisibleStyles = new Array();
	var arrZoomvisibleStyles = new Array();
	var arrCircleStyles;
	var elapsed;
	var filterObj = {};
	var interval; //インターバル
	var timeoutClear; //タイムアウト
	var arrTimeoutText = new Array(); //テキスト更新処理
	var tooltip;
	var tooltipIcon;
	var segmentFactor;
	var segmentationRange;
	var filterValue = "";
	var labelPositionY = 60 * resolution;
	var japan;
	var prefectureData = {};
	var arrPrefecture = new Array();
	var lightAnimationTextCss = {
	    "text-shadow": "0 0 5px #fff, 0 0 10px #fff, 0 0 15px #fff",
	    "-webkit-transition": "0.3s",
	    "transition": "0.3s"
	};
	var lightAnimationRemoveCss = {
	    "text-shadow": "",
	};

	//アニメーション定義
	var anime1 = document.createElementNS("http://www.w3.org/2000/svg", 'animate');
	anime1.setAttribute("attributeName","stroke-opacity");
	anime1.setAttribute("attributeType", "XML");
	anime1.setAttribute("dur", "1s");
	anime1.setAttribute("repeatCount", "indefinite");
	anime1.setAttribute("from", 0.8);
	anime1.setAttribute("to", 0);

	var anime2 = document.createElementNS("http://www.w3.org/2000/svg", 'animate');
	anime2.setAttribute("attributeName","stroke-width");
	anime2.setAttribute("attributeType", "XML");
	anime2.setAttribute("dur", "1s");
	anime2.setAttribute("repeatCount", "indefinite");
	anime2.setAttribute("from", "0");

	var anime3 = document.createElementNS("http://www.w3.org/2000/svg", 'animateTransform');
	anime3.setAttribute("attributeName","transform");
	anime3.setAttribute("attributeType", "XML");
	anime3.setAttribute("type", "scale");
	anime3.setAttribute("dur", "1s");
	anime3.setAttribute("repeatCount", "indefinite");
	anime3.setAttribute("values", "1; 1.5; 1");

	//半円パネルの新規・純増・解約挿入位置
	var posGross = {"x":150};
	var posNet = {"x":240};
	var posChurm = {"x":330};
	var posUpgrade = {"x":420};
	var posBalloom = {"Gross":posGross, "Net":posNet, "Churm":posChurm, "Upgrade":posUpgrade};

	////////////////////
	//関数
	////////////////////
	function CreateDropG(){
	    var g = document.createElementNS("http://www.w3.org/2000/svg", 'g');
	    g.setAttribute("class", "dropG");
	    return g;
	}
	function CreateDrop(){
	    var drop = document.createElementNS("http://www.w3.org/2000/svg", 'path');
	    drop.setAttribute("d", "M388.823,191.344L255.995,0L123.183,191.344c-53.875,84.438-73.359,192.281,0,265.641C159.854,493.656,207.917,512,255.995,512s96.141-18.344,132.828-55.016C462.167,383.625,442.698,275.781,388.823,191.344zM133.151,393.234c-34.469-70.219,20.422-171.078,54.906-209.375c0,0-35.75,95.75,11.484,191.516C224.042,425.047,171.636,471.656,133.151,393.234z");
	    drop.setAttribute("class", "drop");
	    drop.setAttribute("fill", "rgb(100, 181, 246)");
	    drop.setAttribute("transform", "translate(20, 3)scale(0.03)");
	    return drop;
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
	    if(obj.hasOwnProperty("content")) text.textContent = obj.content;
	    return text;
	}
	function CreatePath(obj){
	    var path = document.createElementNS("http://www.w3.org/2000/svg", 'path');
	    if(obj.hasOwnProperty("d")) path.setAttribute("d", obj.d);
	    if(obj.hasOwnProperty("class")) path.setAttribute("class", obj.class);
	    if(obj.hasOwnProperty("fill")) path.setAttribute("fill", obj.fill);
	    if(obj.hasOwnProperty("title")) path.setAttribute("title", obj.title);
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
	    if(obj.hasOwnProperty("title")) circle.setAttribute("title", obj.title);
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
	    if(obj.hasOwnProperty("id")) image.setAttribute("id", obj.id);
	    if(obj.hasOwnProperty("class")) image.setAttribute("class", obj.class);
	    if(obj.hasOwnProperty("title")) image.setAttributeNS("http://www.w3.org/1999/xlink", "title", obj.title);
	    if(obj.hasOwnProperty("href")) image.setAttributeNS("http://www.w3.org/1999/xlink", "href", obj.href);
	    return image;
	}
	function RoundZoomOutBg(event){
	    $("rect.amcharts-zoom-out-bg").width($("rect.amcharts-zoom-out-bg").attr("height"));
	    $("rect.amcharts-zoom-out-bg").attr("rx",$("rect.amcharts-zoom-out-bg").attr("height")).attr("ry",$("rect.amcharts-zoom-out-bg").attr("height"));
	    chartsStartIndex = event.startIndex;
	    chartsEndIndex = event.endIndex;
	}
	//ツールチップ作成
	function AddEventCircle(){
		$("circle.main").off("mouseout").off("mouseover").off("click");
	    $("circle.main.showed")
	    .on("mouseover", function(d){
	    	if(!isVisibleMode) return;
	        //サークルサークル注目装飾作成
	        if(isZoomedPrefectures != ""){
	            var toolCircleWidth = d.target.getBBox().width < 0.3 ? 0.3: d.target.getBBox().width;
	            $("circle.toolCircle").attr("r", toolCircleWidth * .2);
	            $("#gToolCircle").attr("transform", d.target.attributes.transform.value);
	            $("#gToolCircle").css("display", "block" );
	            ResizeToolCircle(toolCircleWidth * .4);
	        }
	        var color = $(this).css("fill") == "rgb(0, 0, 0)" ? "rgb(256, 256, 256)" : $(this).css("fill");
	        tooltip.style({
	        		"visibility": "visible",
	        		"opacity": 0
	        	})
	        	.html(
		            CreateTooltopHtml(d, $(this).css("fill"))   
		        )
		        .transition()
		        .duration(200)
		        .style("opacity", 1);
	        
	        $("span.toolGraphClose").on("click", function(){
	            $("#tooltip").css("box-shadow","0 0 20px rgba(256,256,256,0.5),0 0 20px rgba(256,256,256,0.5)");
	            $(this).removeAttr("id");
	            AddEventCircle();
	            if (jqxhr) jqxhr.abort();
	            clearTimeout(timerMiniGraph);
	            tooltipIcon.html(
	                "<div id='tooltipIconDiv'>click to fix</div>"
	            );
	            $("span.toolGraphClose").css("visibility", "hidden");
	            $("#gToolCircle").css("display", "none" );
	        	tooltip.style("visibility", "hidden");
	        });
	        
	        //グラフ切替イベント(インデックスボタン)
	        $("div.toolGraphCarousel span.toolGraphCarouselPoint").on("click", function(i, v){
	            var color = $("#toolTipCircle").css("fill") == "rgba(0, 0, 0, 0)" ? "#FFF" : $("#toolTipCircle").css("fill");
	            if (jqxhr) jqxhr.abort();
	            clearTimeout(timerMiniGraph);
	            tooltipGraphTypeIndex = $("div.toolGraphCarousel span.toolGraphCarouselPoint").index(this);
	            MakeMiniGraph($("#tooltip div.innerTip.shopName").text(), color);
	            
	            //カルーセルインデックス
	            $("div.toolGraphCarousel span").text("○");
	            $(this).text("●");
	        });
	        
	        $("#tooltip").css("box-shadow","0 0 20px rgba(256,256,256,0.5),0 0 20px rgba(256,256,256,0.5)");
	        //グラフ切替イベント(左右ボタン)
	        $(".toolGraphTitle span.toolGraphChageLeft, .toolGraphTitle span.toolGraphChageRight").on('click', function(){
	            var color = $("#toolTipCircle").css("fill") == "rgba(0, 0, 0, 0)" ? "#FFF" : $("#toolTipCircle").css("fill");
	            if (jqxhr) jqxhr.abort();
	            clearTimeout(timerMiniGraph);
	            if($(this).hasClass("toolGraphChageRight")){
	                tooltipGraphTypeIndex = (tooltipGraphTypeIndex + 1) % (_data.toolTipData.length);
	            }else if($(this).hasClass("toolGraphChageLeft")){
	                tooltipGraphTypeIndex = (tooltipGraphTypeIndex + _data.toolTipData.length - 1) % (_data.toolTipData.length);
	            }
	            MakeMiniGraph($("#tooltip div.innerTip.shopName").text(), color);
	            
	            //カルーセルインデックス
	            $("div.toolGraphCarousel span").text("○");
	            $("div.toolGraphCarousel span:nth-of-type("+ (tooltipGraphTypeIndex+1) +")").text("●");
	        });
	        //着色
	        var rgb = color.substr( 0, color.length-1 ).slice( color.substr(0,4)=="rgba"?5:4 ).split(",").map(function(v, i){
	            return Number(v.trim());
	        });
	        color = "rgb("+ rgb[0] +","+ rgb[1] +","+ rgb[2] +")";
	        $(".tooltipBorder").css("background", "linear-gradient(to right,  rgba("+ Math.ceil(rgb[0]/2) +","+ Math.ceil(rgb[1]/2) +","+ Math.ceil(rgb[2]/2) +",0.5) 0%,rgba("+ color.substr( 0, color.length-1 ).slice(4) +",1) 50%,rgba("+ Math.ceil(rgb[0]/2) +","+ Math.ceil(rgb[1]/2) +","+ Math.ceil(rgb[2]/2) +",0.5) 100%)");
	        $(".tooltipSummary div.toolSummaryValue:last-of-type").css("color", color);
	        $(".tooltipSummary div.toolSummaryValue:last-of-type").prev().css("color", color);
	        //ミニグラフ作成
	        var name = d.hasOwnProperty("toElement") ? d.toElement.__data__.LOCATION_NAME : d.target.__data__.LOCATION_NAME;
	        MakeMiniGraph(name, color);
	        
	        var cY = d.hasOwnProperty("clientY") ? d.clientY : $(d.target).position().top;
	        if(cY > window.innerHeight / 2){
	            tooltip.style("top", ($(d.target).position().top - $("#tooltip").outerHeight(true) - d.target.getBoundingClientRect().width*2/3 + 10 +"px")).style("left",($(d.target).position().left + d.target.getBoundingClientRect().width*2/3)+"px");
	        }else{
	            tooltip.style("top", ($(d.target).position().top + d.target.getBoundingClientRect().width*2/3 +"px")).style("left",($(d.target).position().left + d.target.getBoundingClientRect().width*2/3)+"px");
	        }
	    })
	    .on("mouseout", function(d){
	    	if(!isVisibleMode) return;
	        if (jqxhr) jqxhr.abort();
	        clearTimeout(timerMiniGraph);
	        $("#gToolCircle").css("display", "none" );
	        return tooltip.style("visibility", "hidden");
	    })
	    .on("click", function(d){
	    	if(!isVisibleMode) return;
	        //$(".toolGraphTitle span").css("display", "inline-block");
	        $("circle.main").off("mouseout").off("mouseover").off("click");
	        $("circle.main.showed").off("mouseover").off("mouseout");
	        tooltipIcon.html(
	            "<div id='tooltipIconDiv'>click to release</div>"
	        );
	        $(this).attr("id", "toolTipCircle");
	        $("#tooltip").css("box-shadow","");
	        $("span.toolGraphClose").css("visibility", "visible");
	        //ツールチップCloseイベント
	        $("#toolTipCircle").off('click');
	        $("#toolTipCircle").on('click', function(){
	            $("#tooltip").css("box-shadow","0 0 20px rgba(256,256,256,0.5),0 0 20px rgba(256,256,256,0.5)");
	            $(this).removeAttr("id");
	            AddEventCircle();
	            if (jqxhr) jqxhr.abort();
	            clearTimeout(timerMiniGraph);
	            tooltipIcon.html(
	                "<div id='tooltipIconDiv'>click to fix</div>"
	            );
	            $("span.toolGraphClose").css("visibility", "hidden");
	        });
	    });
	    
	    $("circle.main.showed")
	    .on("mouseover", function(d){
	    	if(!isVisibleMode) return;
	        tooltipIcon.html(
	            "<div id='tooltipIconDiv'>click to fix</div>"
	        );
	        tooltipIcon.style("visibility", "visible").transition().duration(300).delay(1000).style("opacity", "1");
	        
	        var cY = d.hasOwnProperty("clientY") ? d.clientY : $(d.target).position().top;
	        if(cY > window.innerHeight / 2){
	            tooltipIcon.style("top", ($(d.target).position().top - d.target.getBoundingClientRect().width*2/3 + 15 +"px")).style("left",($(d.target).position().left + d.target.getBoundingClientRect().width*2/3 + 25) + "px");
	        }else{
	            tooltipIcon.style("top", ($(d.target).position().top + d.target.getBoundingClientRect().width*2/3 - 30) + "px").style("left",($(d.target).position().left + d.target.getBoundingClientRect().width*2/3 + 20) + "px");
	        }
	    })
	    .on("mouseout", function(d){
	    	if(!isVisibleMode) return;
	    	 tooltipIcon.style("opacity", "0").style("visibility", "hidden");
	    });
	}
	function ResizeToolCircle(r){
	    $("#gToolCircle circle.toolCircle:nth-of-type(1)").attr("cx", r*2).attr("cy", 0);
	    $("#gToolCircle circle.toolCircle:nth-of-type(2)").attr("cx", r*2/Math.sqrt(2)).attr("cy", r*2/Math.sqrt(2));
	    $("#gToolCircle circle.toolCircle:nth-of-type(3)").attr("cx", 0).attr("cy", r*2);
	    $("#gToolCircle circle.toolCircle:nth-of-type(4)").attr("cx", -r*2/Math.sqrt(2)).attr("cy", r*2/Math.sqrt(2));
	    $("#gToolCircle circle.toolCircle:nth-of-type(5)").attr("cx", -r*2).attr("cy", 0);
	    $("#gToolCircle circle.toolCircle:nth-of-type(6)").attr("cx", -r*2/Math.sqrt(2)).attr("cy", -r*2/Math.sqrt(2));
	    $("#gToolCircle circle.toolCircle:nth-of-type(7)").attr("cx", 0).attr("cy", -r*2);
	    $("#gToolCircle circle.toolCircle:nth-of-type(8)").attr("cx", r*2/Math.sqrt(2)).attr("cy", -r*2/Math.sqrt(2));
	}
	function DrawCharts(event){
	    if(chartsStartIndex && chartsEndIndex) event.chart.zoomToIndexes(chartsStartIndex, chartsEndIndex);
	    event.chart.addListener("zoomed", RoundZoomOutBg);
	}
	function UpdateTopicChart(isFilter){
		if(_data.history[selectedHistoryIndex].url_topic == "") return;
	    if(isFilter && $(".loadingTopicDiv").length == 0){
	        $("#topicChartDiv").css("display", "none");
	        $("#topicChartDiv").before('<div class="loadingTopicDiv" style="height: 200px;transform: scale(0.75);"><div class="loadingSpace" style="height: 50%;"></div><div class="loadingCircle1"></div><div class="loadingCircle2"></div></div>');
	    }
	    var url = MakeUrl(_data.history[selectedHistoryIndex].url_topic);
	    Object.keys(filterObj).forEach(function (key) {
	        if(filterObj[key].length > 0)
	        url += "&" + key + '=[{"operator":"in","key":["' + key + '"],"showKey":"","value":["' + filterObj[key].join([separator = '","']) + '"],"pid":"","searchId":""}]';
	    });
	    //トピックミニグラフの作成
	    jqxhrTopic = $.ajax({
	      type: 'GET',
	      url: url,
	      dataType: 'json',
	      success: function(json){
	        if(!json.data || json.data.length == 0) {
	             successAjax = false;
	            console.log("ajaxFail:" + url);
	            return;
	        }
	        var topicChartData = json.data.map(function(v, i){
	            return json.data.slice(0, (i+1)).reduceRight(function(x, y) {
	            	var obj = {"TIME":x.TIME};
	            	$.each(_data.topic.value, function(ii, vv){
	            		obj[vv.val] = Number(x[vv.val]) + Number(y[vv.val]);
	            	});
	                return obj;
	            });
	        });
	        topicChart.dataProvider = AmCharts.parseJSON(JSON.stringify(topicChartData));
	        topicChart.events.zoomed = new Array();
	        topicChart.validateData();
	        if(isFilter){
	            $("#topicChartDiv").css("display", "block");
	            $(".loadingTopicDiv").remove();
	        }
	      }
	    });
	}
	function GetPlanet(){
		if(_data.history[selectedHistoryIndex].url_planetData == "") return;
	    //キャリア別の新規解約初期値設定
	    $.ajax({
	      type: 'GET',
	      url: MakeUrl(_data.history[selectedHistoryIndex].url_planetData),
	      dataType: 'json',
	      success: function(json){
	        if(!json.data || json.data.length == 0) {
	             successAjax = false;
	            console.log("ajaxFail:" + MakeUrl(_data.history[selectedHistoryIndex].url_planetData));
	            return;
	        }
	        $.each(json.data, function(index, val){
	            $('#'+ ConvertEvent(val.EVENT) + val.PLANET_ID + " tspan." + val.VERTICAL_CATEGORY).text(InsertComma(val.VALUE));
	            var sum = Number(RemoveComma($('#'+ ConvertEvent(val.EVENT) + val.PLANET_ID + " tspan.CarrierSum").text()));
	            $('#'+ ConvertEvent(val.EVENT) + val.PLANET_ID + " tspan.CarrierSum").text(InsertComma(sum + Number(val.VALUE)));
	        })
	      }
	    });
	}
	function GetSemiCirclePanel(){
		if(_data.history[selectedHistoryIndex].url_semiCircleMain != ""){
			//サマリパネルメインの作成
		    $.ajax({
		      type: 'GET',
		      url: MakeUrl(_data.history[selectedHistoryIndex].url_semiCircleMain),
		      dataType: 'json',
		      success: function(json){
		        if(!json.data || json.data.length == 0) {
		             successAjax = false;
		            console.log("ajaxFail:" + MakeUrl(_data.history[selectedHistoryIndex].url_semiCircleMain));
		            return;
		        }else{
		        	$("#semiCircleMain").text(InsertComma(json.data[0].VALUE));
		        }
		      }
		    });
		}
	    //サマリパネル詳細の初期値設定
	    if(_data.history[selectedHistoryIndex].url_semiCircleDetail != ""){
	    	$.ajax({
		      type: 'GET',
		      url: MakeUrl(_data.history[selectedHistoryIndex].url_semiCircleDetail),
		      dataType: 'json',
		      success: function(json){
		        if(!json.data || json.data.length == 0) {
		             successAjax = false;
		            console.log("ajaxFail:" + MakeUrl(_data.history[selectedHistoryIndex].url_semiCircleDetail));
		            return;
		        }
		        $.each(json.data, function(index, val){
		            $.each(_data.semiCircleDetail, function(i, v){
		                if(v.event.plus.indexOf(val.EVENT) != -1 ){
		                    $("#"+ v.id +" tspan.total").text(InsertComma(Number(RemoveComma($("#"+ v.id +" tspan.total").text())) + Number(val.VALUE)));
		                    $("#"+ v.id +" tspan." + val.VERTICAL_CATEGORY).text(InsertComma(Number(RemoveComma($("#"+ v.id +" tspan." + val.VERTICAL_CATEGORY).text())) + Number(val.VALUE)));
		                }
		                if(v.event.minus.indexOf(val.EVENT) != -1 ){
		                    $("#"+ v.id +" tspan.total").text(InsertComma(Number(RemoveComma($("#"+ v.id +" tspan.total").text())) - Number(val.VALUE)));
		                    $("#"+ v.id +" tspan." + val.VERTICAL_CATEGORY).text(InsertComma(Number(RemoveComma($("#"+ v.id +" tspan." + val.VERTICAL_CATEGORY).text())) - Number(val.VALUE)));
		                }
		            });
		        });
		      }
		    });
	    }
	}
	function DoFilterMap(){
	    $("circle.showed.main").css("display", "none");
	    var isFirst = true;
	    Object.keys(filterObj).forEach(function (key) {
	        var selecter = "circle.showed.main[";
	        if(filterObj[key].length > 0){
	            cnt = 0;
	            while(cnt < filterObj[key].length){
	                if(isFirst){
	                    $("circle[data-filter"+ key.slice(-1) +"='" + filterObj[key][cnt] + "']").css("display", "");
	                }else {
	                    selecter += "data-filter";
	                    selecter += key.slice(-1);
	                    selecter += "!='";
	                    selecter += filterObj[key][cnt];
	                    selecter += "'][";
	                }
	                cnt++;
	            }
	            if(!isFirst) {
	                $(selecter.substr(0, selecter.length - 1) + ":visible").css("display", "none");
	            }
	            isFirst = false;
	        }
	    });
	}
	
	//ランキングデータのフィルタリングを行う
	var rankAjax = {};
	function DoFilterRank(){
	    $.each(_data.rankData, function(i, v){
	    	var url = MakeUrl(_data.history[selectedHistoryIndex].url_rank[i]);
	        Object.keys(filterObj).forEach(function (key) {
	            if(filterObj[key].length > 0)
	            url += "&" + key + '=[{"operator":"in","key":["' + key + '"],"showKey":"","value":["' + filterObj[key].join([separator = '","']) + '"],"pid":"","searchId":""}]';
	        });
	        
	        //ランキングSVG
	        $("div.rankTableSvgDiv."+ (v.category + v.event)).append('<div class="loadingRankDiv" style="height: '+ ((20 * _rankingCount) + 50) +'px;transform: scale(0.75);"><div class="loadingSpace" style="height: 50%;"></div><div class="loadingCircle1"></div><div class="loadingCircle2"></div></div>');
	        $("div.rankTableSvgDiv."+ (v.category + v.event)+ " svg *").remove();
	        $("div.rankTableSvgDiv."+ (v.category + v.event)+ " svg").css("display", "none");
	        
	        rankAjax[v.category + v.event] = $.ajax({
	          type: 'GET',
	          url: encodeURI(url),
	          dataType: 'json',
	          cache: false,
	          success: function(json){
	            if(!json.data || json.data.length == 0) {
	                 successAjax = false;
	                console.log("ajaxFail:" + encodeURI(url));
	                return;
	            }
	            $("div.rankTableSvgDiv."+ (v.category + v.event)+ " svg").css("display", "block");
	            $("div.rankTableSvgDiv."+ (v.category + v.event)+ " div.loadingRankDiv").remove();
	            if(json.data.length > 0){
	                $.each(json.data, function(index, val){
	                    val.VALUE = Number(val.VALUE);
	                    if(val[v.category] == "") val[v.category] = '不明';
	                });
	                v.object = json.data;
	                MakeRankSvg(v.object, v.category, (v.category+v.event));
	            }
	          },
	        });
	    });
	}
	//フィルタリング設定項目一覧
	function WriteFilterDescription(){
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
	        description = filterCnt + "項目でフィルタリングされています。";
	    }else if(filterCnt > 0){
	        description.slice(-1);
	        description += "でフィルタリングされています。";
	    }else{
	        description = "フィルタリング項目未選択";
	    }
	    $("#divFilterDescription").text(description);
	    $(".divSelectedFilterItem").height($("#sumaryDiv").position().top - $(".divSelectedFilterItem").position().top - 36);
	}
	//リアルタイムデータがフィルタリング該当データか調べる
	function IsFilteredDate(val){
	    var r = true;
	    $.each(filterObj, function(i, v){
	        if(v.length > 0 && v.indexOf(val[i]) == -1 ) r = false;
	    });
	    return r;
	}
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
	//ローディング削除
	function HideLoading(){
	    if(successAjax){
	        $("#loadingDiv").css({
	            "opacity": "0",
	            "-webkit-transition": "1s",
	            "transition": "1s"
	        });
	        setTimeout(function(){
	            $("#loadingDiv").css("display","none");
	        }, 1000);
	    }else{
	        $("#loadingDiv span").text("Communication error. Auto Reload after 3 seconds.");
	        setTimeout(function(){
	            location.reload();
	        }, 3000);
	    }
	}
	function ConvertEvent(val){
	    var returnVal;
	    $.each(_data.event, function(i, v){
	        if(v.name == val) returnVal = i;
	    });
	    return returnVal;
	}
	//数値型からカンマ削除
	function RemoveComma(strNum){
	    if(strNum.length>0) return parseInt(strNum.split(',').join('').trim());
	    else return "";
	}
	//数値にカンマ挿入
	function InsertComma(strNum){
	    return strNum.toString().replace(/(\d)(?=(\d{3})+$)/g , '$1,');
	}
	//ランキングテーブルのリサイズ
	function ResizeRank(){
	    var ww = window.innerWidth / 2 -250 - 36;
	    if(ww > 500) ww = 500;
	    $("#topicDiv").width(ww);
	    $("#divFilterDescription").width(ww + 12); //フィルタリング項目は親DIVの余白分も含めて設定する。
	    $("#chartDiv>svg").attr("width", window.innerWidth);
	}
	//消滅したサークルデータの削除処理
	function InitializeData(){
		upgradeDates = new Array();
        textData = new Array();
        insertDates = new Array();
        arrTimeoutText = new Array();
        
        clearChurmFlg = true;
	}
	
	function ApplyCircleStyle(d, circle){
    	var circleStyles;
      	$.each(arrCircleStyles, function(i, v){
      		if(v.target_value == ""){
      			circleStyles = $.extend(true, {}, arrCircleStyles[arrCircleStyles.length-1]);
      			return false;
      		}else if(Number(d[v.target_value]) >= v.value){
      			circleStyles = $.extend(true, {}, v);
      			return false;
      	 	}
      	});
        
        if(circleStyles.isVisibleZoomed) circle.attr("class", mainCircleClass + " zoomVisible " + circleStyles.circleType);
        else circle.attr("class", mainCircleClass + " " + circleStyles.circleType);
        
        if(isZoomedPrefectures == '' && circleStyles.isVisibleZoomed) {
			//ズームしていない&ズームオンリーのサークル
			circleStyles.css.visibility = "hidden";
		}else if(isZoomedPrefectures == ''){
			//ズームしていない場合
			circleStyles.css.visibility = "visible";
			circleStyles.css.opacity = 0.8;
			var targetVal = arrCircleStyles[0]["target_value"];
			circleStyles.css.r = Number(d[targetVal]) >= _data.bigCircleBoundaryValue * elapsed ? 2 * resolution  : 1 * resolution;
		}else if(isZoomedPrefectures == d.PREFECTURES_01_NM){
			//自分の県にズームしてる場合
			circleStyles.css.visibility = "visible";
			circleStyles.css.r = animeStrokeWidthTo * resolution * (circleStyles.circleType=="mini"?0.4:1) + "px"
			circleStyles.css.opacity = 0.8;
			
			if(circleStyles.ckircleType == "circle" && !circle.children("animate").length){
				circle.append(anime1);
			circle.append(anime2);
			}
			if(circleStyles.circleType == "dash" || circleStyles.circleType == "white") circleStyles.css.strokeWidth = animeStrokeWidthTo * 0.15 * resolution;
		}else if(isZoomedPrefectures != ""){
			//他県にズームしてる場合
			circleStyles.css.visibility = "visible";
			circleStyles.css.r = animeStrokeWidthTo * resolution * (circleStyles.circleType=="mini"?0.4:1) + "px"
			circleStyles.css.opacity = 0.1;
			if(circleStyles.circleType == "dash" || circleStyles.circleType == "white") circleStyles.css.strokeWidth = animeStrokeWidthTo * 0.15 * resolution;
		}
			
        //フィルタ用の属性の更新
        var filterVal = circleStyles.target_value.slice(6).toLowerCase() + circleStyles.value;
        circle.attr("data-filter-value", filterVal);
        if(filterValue != "" && filterValue != filterVal){
        	circleStyles.css.visibility = "hidden";
        }
        
			circle.css(circleStyles.css);
			
      	//ツールチップ表示対象の更新
      	if(d.LOCATION_NAME == $("div.innerTip.shopName").text()){
      		$("#tooltipLeft .tooltipSummary ." + ConvertEvent(d.EVENT)).text(Number(d["VALUE_" + ConvertEvent(d.EVENT).toUpperCase()]));
        }
        
        d.TIME = 0;
    }
            
	var chartMini;
	function MakeMiniGraph(name, color){
		if(_data.toolTipData.length == 0) return;
		
	    $("div.divTooltipRightGraphCategory").remove();
	    
	    if(chartMini) chartMini.clear();
	    else $("#tooltipRightGraph").children().remove();
	    
	    $("#tooltipRightGraph").height($("#tooltipLeft").outerHeight(true) - $(".toolGraphTitle").height() - $(".toolGraphTitle").height() -12);
	    $("#tooltipRightGraph").append('<div style="transform: scale(0.5);vertical-align: middle;padding-top: 10px;"><div class="loadingCircle1" style="border:5px solid '+ color +';box-shadow: 0 0 35px '+color+';border-left:5px solid rgba(0,0,0,0);border-right:5px solid rgba(0,0,0,0);"></div><div class="loadingCircle2" style="border:5px solid '+ color +';box-shadow: 0 0 15px '+color+';border-left:5px solid rgba(0,0,0,0);border-right:5px solid rgba(0,0,0,0);"></div></div>');
	    $("#toolGraphTitleVal").text(_data.toolTipData[tooltipGraphTypeIndex].name);
	    var url = MakeUrl(_data.history[selectedHistoryIndex].url_tooltip[tooltipGraphTypeIndex]) + '&SEARCH_FILTER1=[{"operator":"in","key":["文字列2"],"showKey":"","value":["' + name + '"],"pid":"","searchId":""}]';
	    jqxhr = $.ajax({
	      type: 'GET',
	      url: encodeURI(url),
	      dataType: 'json',
	      cache: false,
	      success: function(json){
	        if(json.data.length > 0){
	            if(_data.toolTipData[tooltipGraphTypeIndex].type == "bar"){
	                chartMini = new AmCharts.AmSerialChart(AmCharts.themes.none);
	                chartMini.dataProvider = AmCharts.parseJSON(JSON.stringify(json.data));
	                chartMini.categoryField = "TIME";
	                chartMini.autoMargins = false;
	                chartMini.addClassNames = true;
	                chartMini.marginLeft = 24;
	                chartMini.marginRight = 24;
	                chartMini.marginTop = 0;
	                chartMini.marginBottom = 5;
	                $.each(_data.toolTipData[tooltipGraphTypeIndex].item, function(i, v){
	                    var graph = new AmCharts.AmGraph();
	                    graph.valueField = v.sql_val;
	                    graph.type = "column";
	                    graph.fillAlphas = 1;
	                    if(_data.toolTipData[tooltipGraphTypeIndex].item.length - 1 == i){
	                        var txt = "<table style='font-size:10px; line-height: 16px;'>";
	                        var txt_in = "";
	                        $.each(_data.toolTipData[tooltipGraphTypeIndex].item, function(ii, vv){
	                        	if(vv.icon == "") txt_in = "<tr><td></td><td>[["+ vv.sql_val +"]]</td></tr>" + txt_in;
	                        	else txt_in = "<tr><td><img class='toolImg' alt='toolImg' src='"+ MakePath(vv.icon) +"'/></td><td>[["+ vv.sql_val +"]]</td></tr>" + txt_in;
	                        });
	                        txt += txt_in;
	                        txt += "</table>",
	                        graph.balloonText = txt;
	                    }else{
	                        graph.showBalloon = false;
	                    }
	                    graph.lineAlpha = 0;
	                    if(i==0) graph.fillColors = color;
	                    else graph.fillColors = "rgb("+ (100+50*i) +","+ (100+50*i) +","+ (100+50*i) +")";
	                    chartMini.addGraph(graph);
	                });
	                
	                var balloon = new AmCharts.AmBalloon();
	                balloon.drop = false;
	                balloon.adjustBorderColor = true;
	                balloon.borderAlpha = 0;
	                balloon.shadowAlpha = 0
	                balloon.color = "#FFF";
	                balloon.cornerRadius = 0;
	                balloon.pointerWidth = 0;
	                balloon.fillColor = "#000";
	                balloon.fillAlpha = 0;
	                chartMini.balloon = balloon;
	                
	                var valueAxis = new AmCharts.ValueAxis();
	                valueAxis.gridAlpha = 0;
	                valueAxis.axisAlpha = 0;
	                valueAxis.stackType = "regular";
	                chartMini.addValueAxis(valueAxis);

	                var categoryAxis = chartMini.categoryAxis;
	                categoryAxis.gridAlpha = 0;
	                categoryAxis.axisAlpha = 0;
	                categoryAxis.autoWrap= true;
	                chartMini.categoryAxis = categoryAxis;
	                chartMini.gridPosition = "start";
	                
	                $("#tooltipRightGraph").height($("#tooltipRightGraph").height() - 26);
	                $("#tooltipRightGraph").children().remove();
	                chartMini.write("tooltipRightGraph");
	                $("dv.divTooltipAxis").remove();
	                
	                $("#tooltipRightGraph").after("<div class='divTooltipRightGraphCategory'>");
	                var widthToolCategory = $(".divTooltipRightGraphCategory").width() / chartMini.dataProvider.length;
	                
	                $.each(chartMini.dataProvider, function(i, v){
	                    $("div.divTooltipRightGraphCategory").append("<div style='width:"+ widthToolCategory +"px; display:inline-block;'><span>"+ v.TIME.slice(0, -3) +"</span><span>"+ v.TIME.slice(-3) +"</span></div>");
	                });
	            }else if(_data.toolTipData[tooltipGraphTypeIndex].type == "pie"){
	                
	                $("div.tooltipSummaryGrid span.historyDate, div.tooltipSummaryGrid span.lastData").text("");
	                var rgb = color.substr( 0, color.length-1 ).slice( color.substr(0,4)=="rgba"?5:4 ).split(",").map(function(v, i){
	                    return Number(v.trim());
	                });
	                "rgb("+ Math.ceil(rgb[0]/2) +","+ Math.ceil(rgb[1]/2) +","+ Math.ceil(rgb[2]/2) +")"
	                var colors = new Array();
	                colors.push("rgb("+ rgb[0] +","+ rgb[1] +","+ rgb[2] +")");
	                colors.push("rgb("+ Math.ceil(rgb[0]*7/8) +","+ Math.ceil(rgb[1]*7/8) +","+ Math.ceil(rgb[2]*7/8) +")");
	                colors.push("rgb("+ Math.ceil(rgb[0]*6/8) +","+ Math.ceil(rgb[1]*6/8) +","+ Math.ceil(rgb[2]*6/8) +")");
	                colors.push("rgb("+ Math.ceil(rgb[0]*5/8) +","+ Math.ceil(rgb[1]*5/8) +","+ Math.ceil(rgb[2]*5/8) +")");
	                colors.push("rgb("+ Math.ceil(rgb[0]*4/8) +","+ Math.ceil(rgb[1]*4/8) +","+ Math.ceil(rgb[2]*4/8) +")");
	                colors.push("rgb(100,100,100)");
	                
	                //ランキングの6位以下はその他としてくくる
	                if(json.data.length > 5){
	                    json.data[5].CATEGORY = "その他";
	                    json.data[5].VALUE = SumHashArray(Object.keys(json.data).map(key => Number(json.data[key].VALUE)).filter(function(v, i){
	                        if (5 <= i) return true;
	                    }));
	                    json.data = json.data.slice(0, 6);
	                }
	                
	                function RrollOverSlice(e){
	                    $("#tooltipRightGraph text.amcharts-label-categoryPie tspan").text(e.dataItem.dataContext.CATEGORY);
	                    $("#tooltipRightGraph text.amcharts-label-valueUpper tspan").text(e.dataItem.dataContext.VAL2 + "件");
	                    $("#tooltipRightGraph text.amcharts-label-valueLower tspan").text(e.dataItem.dataContext.VAL1 + "件");
	                    $("#tooltipRightGraph g.amcharts-pie-item path").css("opacity", 0.2);
	                    $(e.event.target).css("opacity", 1);
	                }
	                
	                function RrollOutSlice(e){
	                    $("#tooltipRightGraph g.amcharts-pie-item path").css("opacity", 1);
	                }
	                
	                function DrawnPieChart(){
	                	if(_data.toolTipData[tooltipGraphTypeIndex].type != "pie") return;
	                	
	                	//ガイド初期表示
		                $("#tooltipRightGraph text.amcharts-label-categoryPie tspan").text(json.data[0].CATEGORY);
		                $("#tooltipRightGraph text.amcharts-label-valueUpper tspan").text(json.data[0].VAL2 + "件");
		                $("#tooltipRightGraph text.amcharts-label-valueLower tspan").text(json.data[0].VAL1 + "件");
		                //ドーナツの中の凡例
		                $("#tooltipRightGraph text.amcharts-label-valueUpper").before(CreateImage({"x":"-16", "y":"-3", "class":"pieBreakdownLabel", "href":MakePath("icon/icon_upgrade.png"), "width":"11", "height":"11", "transform":$("#tooltipRightGraph text.amcharts-label-valueUpper").attr("transform")}));
		                $("#tooltipRightGraph text.amcharts-label-valueLower").before(CreateImage({"x":"-16", "y":"-3", "class":"pieBreakdownLabel", "href":MakePath("icon/icon_add.png"), "width":"11", "height":"11", "transform":$("#tooltipRightGraph text.amcharts-label-valueLower").attr("transform")}));
	                }
	                
	                $("#tooltipRightGraph").children().remove();
	                chartMini = AmCharts.makeChart( "tooltipRightGraph", {
	                  "type": "pie",
	                  "marginTop":"0",
	                  "marginTop":"10",
	                  "autoMargins": false,
	                  "groupedPulled": false,
	                  "dataProvider": AmCharts.parseJSON(JSON.stringify(json.data)),
	                  "valueField": "VALUE",
	                  "titleField": "CATEGORY",
	                  "labelText":"",
	                  "labelRadius": -50,
	                  "color":"#FFF",
	                  "colors": colors,
	                  "colorField":"COLOR",
	                  "fontSize":"5",
	                  "addClassNames":true,
	                  "balloonText": "",
	                  "radius": "48%",
	                  "innerRadius": "60%",
	                  "outlineThickness": 1,
	                  "startDuration": 0,
	                  "allLabels": [{
	                    "id":"categoryPie",
	                    "text": "Category",
	                    "size": 11,
	                    "color":"#FFF",
	                    "align": "center",
	                    "bold": false,
	                    "y": $("#tooltipRightGraph").height() / 2 - 24,
	                  }, {
	                    "id":"valueUpper",
	                    "text": "Value",
	                    "color":"#FFF",
	                    "align": "center",
	                    "size": 11,
	                    "bold": true,
	                    "y": $("#tooltipRightGraph").height() / 2 - 8
	                  }, {
	                    "id":"valueLower",
	                    "text": "Value",
	                    "color":"#FFF",
	                    "align": "center",
	                    "size": 11,
	                    "bold": true,
	                    "y": $("#tooltipRightGraph").height() / 2 + 8
	                  }],
	                  "listeners": [{
	                      "event": "drawn",
	                      "method": DrawnPieChart
	                  },{
	                      "event": "rollOverSlice",
	                      "method": RrollOverSlice
	                  },{
	                      "event": "rollOutSlice",
	                      "method": RrollOutSlice
	                  }],
	                });
	                
	            }else if(_data.toolTipData[tooltipGraphTypeIndex].type == "stack"){
	                function StackChartRendered(){
	                	if($("g.amcharts-graph-column.amcharts-graph-female path.amcharts-graph-column-front.amcharts-graph-column-element").length < 1) return;
	                	
	                    //男女の棒グラフを引き話して間にカテゴリを挿入する
	                    var x = Number($($("g.amcharts-graph-column.amcharts-graph-female path.amcharts-graph-column-front.amcharts-graph-column-element").first().parent().get(0)).attr("transform").split(",")[0].slice(10));
	                    $.each($("g.amcharts-graph-column.amcharts-graph-male path.amcharts-graph-column-front.amcharts-graph-column-element"), function(i, v){
	                        $(v).attr("transform", "translate(24,0)");
	                    });
	                    $.each($("g.amcharts-graph-column.amcharts-graph-female path.amcharts-graph-column-front.amcharts-graph-column-element"), function(i, v){
	                        $(v).attr("transform", "translate(-5,0)");
	                    });
	                    $($("g.amcharts-graph-column.amcharts-graph-male text.amcharts-graph-label").first().parent()).attr("transform", "translate(24, 0)");
	                    $($("g.amcharts-graph-column.amcharts-graph-female text.amcharts-graph-label").first().parent()).attr("transform", "translate(-5, 0)");
	                    $.each($("#tooltipRightGraph g.amcharts-category-axis text.amcharts-axis-label"), function(i, v){
	                        $(v).attr("transform", "translate("+ x +"," + (Number($(v).attr("transform").split(",")[1].slice(0, -1))-2) + ")");
	                        $(v).attr("opacity", 0.5);
	                    });
	                    $("#tooltipRight g.amcharts-category-axis").css("display" ,"block");
	                    $("#tooltipRight g.amcharts-category-axis .amcharts-axis-fill").css("display" ,"none");
	                    $("g.amcharts-graph-column.amcharts-graph-male text.amcharts-graph-label").attr("opacity", 0);
	                    $("g.amcharts-graph-column.amcharts-graph-female text.amcharts-graph-label").attr("opacity", 0);
	                }
	                function StackChartCursorChange(obj){
	                	//マウスカーソルの位置に合わせてラベルを表示させる
	                    d3.selectAll("g.amcharts-graph-column.amcharts-graph-male text.amcharts-graph-label").transition().attr("opacity", 0);
	                    d3.selectAll("g.amcharts-graph-column.amcharts-graph-female text.amcharts-graph-label").transition().attr("opacity", 0);
	                    if(obj.index != void(0)){
	                        if(Number(obj.chart.dataProvider[obj.index].VALUE2)<0)
	                            d3.selectAll("svg>g>g.amcharts-graph-column.amcharts-graph-female text:nth-of-type("+ (obj.index+1) +")").transition().duration(300).attr("opacity", 1);
	                        if(Number(obj.chart.dataProvider[obj.index].VALUE1)>0)
	                            d3.selectAll("svg>g>g.amcharts-graph-column.amcharts-graph-male text:nth-of-type("+ (obj.index+1) +")").transition().duration(300).attr("opacity", 1);
	                    }
	                }
	                //人口ピラミッド作成
	                $("#tooltipRightGraph").children().remove();
	                chartMini = AmCharts.makeChart("tooltipRightGraph", {
	                  "type": "serial",
	                  "theme": AmCharts.themes.none,
	                  "rotate": true,
	                  "addClassNames":true,
	                  "marginBottom": 6,
	                  "marginTop": 0,
	                  "marginLeft": 24,
	                  "marginRight": 24,
	                  "dataProvider": AmCharts.parseJSON(JSON.stringify(json.data)),
	                  "startDuration": 0,
	                  "graphs": [{
	                    "id":"male",
	                    "fillAlphas": 0.8,
	                    "fillColors":"#2196F3",
	                    "lineAlpha": 0,
	                    "showBalloon":false,
	                    "type": "column",
	                    "valueField": "VALUE1",
	                    "title": "Male",
	                    "labelText": "[[value]]",
	                    "labelOffset":6,
	                    "fontSize":16,
	                    "color":"rgb(255,255,255)",
	                    "clustered": false,
	                    "labelFunction": function(item) {
	                      return Math.abs(item.values.value);
	                    }
	                  }, {
	                    "id":"female",
	                    "fillAlphas": 0.8,
	                    "fillColors":"#F44336",
	                    "lineAlpha": 0.2,
	                    "showBalloon":false,
	                    "type": "column",
	                    "valueField": "VALUE2",
	                    "title": "Female",
	                    "labelText": "[[value]]",
	                    "labelOffset":6,
	                    "fontSize":16,
	                    "color":"rgb(255,255,255)",
	                    "clustered": false,
	                    "labelFunction": function(item) {
	                      return Math.abs(item.values.value);
	                    }
	                  }],
	                  "categoryField": "CATEGORY",
	                  "categoryAxis": {
	                    "autoGridCount" : false,
	                    "gridPosition": "middle",
	                    "labelsEnabled":true,
	                    "centerRotatedLabels":true,
	                    "inside": true,
	                    "position":"left",
	                    "gridAlpha": 0,
	                    "axisAlpha": 0,
	                    "fontSize": 10,
	                    "fillAlpha": 0.6,
	                    "color":"#FFF",
	                  },
	                  "valueAxes": [{
	                    "gridAlpha": 0,
	                    "fillAlpha": 0,
	                    "zeroGridAlpha":0.8,
	                    "ignoreAxisWidth": true,
	                    "labelsEnabled": false,
	                  }],
	                  "chartCursor": {
	                    "valueBalloonsEnabled": false,
	                    "categoryBalloonEnabled":false,
	                    "fullWidth": false,
	                    "cursorAlpha": 0,
	                    "categoryBalloonAlpha":0,
	                    "graphBulletAlpha":0,
	                    "selectionAlpha":0,
	                    "valueLineAlpha":0,
	                    "cursorAlpha":0,
	                    "categoryBalloonColor":"#9E9E9E",
	                    "cursorPosition":"mouse",
	                    "zoomable":false,
	                    "listeners": [{
	                          "event": "changed",
	                          "method": StackChartCursorChange,
	                      }],
	                  },
	                  "listeners": [{
	                      "event": "drawn",
	                      "method": StackChartRendered,
	                  }],
	                 "export": {
	                    "enabled": true
	                  }
	                });
	            }else if(_data.toolTipData[tooltipGraphTypeIndex].type == "grid"){
	                //テーブル形式のグラフ作成
	                $("#tooltipRightGraph").children().remove();
	                var d = AmCharts.parseJSON(JSON.stringify(json.data));
	                $.each(d, function(i, v){
	                    if(v.NAME == "") return;
	                    var color = "#FFFFFF";
	                    var imgUrl;
	                    if(Number(v.RANK) < 20){
	                        color = "#FFD700";
	                        imgUrl = MakePath("icon/icon_excellent.png");
	                    }else if(Number(v.RANK) < 50){
	                        color = "#C0C0C0";
	                        imgUrl = MakePath("icon/icon_great.png");
	                    }
	                    else if(Number(v.RANK) < 100){
	                        color = "#C47222";
	                        imgUrl = MakePath("icon/icon_good.png");
	                    }
	                    //ランキングのTOP100にはアイコンを表示する
	                    if(Number(v.RANK) < 100){
	                        $("#tooltipRightGraph").append("<div><span class='toolGraphGridLabel' width='30px'><img width='20px' height='20px' src='"+ imgUrl +"'/></span><span class='toolGraphGridRank' style='color:"+ color +";'>"+ v.RANK +"</span><span class='toolGraphGridName'>"+ v.NAME +"</span><span class='toolGraphGridVal'>"+ v.VALUE +"</span></div>");
	                    }else{
	                        $("#tooltipRightGraph").append("<div><span class='toolGraphGridLabel' width='30px' style='margin-right:20px;'></span><span class='toolGraphGridRank' style='color:"+ color +";'>"+ v.RANK +"</span><span class='toolGraphGridName'>"+ v.NAME +"</span><span class='toolGraphGridVal'>"+ v.VALUE +"</span></div>");
	                    }
	                });
	                //テーブルの各行の高さの調整
	                $("#tooltipRightGraph>div>div").css("line-height", $("#tooltipRightGraph").height()/Math.ceil((Object.keys(d).length-1)/2)+"px");
	            }
	        }
	      },
	    });
	}
	function MakeRankSvg(objectArray, category, targetTableId){
	    var maxVal = Math.max.apply(null, Object.keys(objectArray).map(key => objectArray[key].VALUE));
	    rankingData[targetTableId].selectAll("rect")   // SVGでの四角形を示す要素を指定
	        .data(objectArray.slice(0, 5)) // データを設定
	        .enter()
	        .append("rect")
	        .attr("x", function(d,i){
	            if(d.VALUE == 0 || !d.VALUE) return 0;
	            else return $("#topicDiv").width() - (d.VALUE / maxVal * $("#topicDiv").width() * 0.5) - 40;
	        })
	        .attr("y", function(d,i){   // Y座標を配列の順序に応じて計算
	            return (i * 20);
	        })
	        .attr("width", function(d){ // 横幅を配列の内容に応じて計算
	            if(d.VALUE == 0 || !d.VALUE) return "0px";
	            else return (d.VALUE / maxVal * $("#topicDiv").width() * 0.5) + "px";
	        })
	        .attr("height", "12")   // 棒グラフの高さを指定
	        .attr("fill", "rgba(158,158,158,0.8)");
	        
	    rankingData[targetTableId].selectAll("text.rankItemName")
	        .data(objectArray.slice(0, 5))
	        .enter()
	        .append("text")
	        .text(function(d, i){
	            return (i+1) + ". " + d[category];
	        })
	        .attr("class", "rankItemName")
	        .attr("x", 24)
	        .attr("y", function(d,i){
	            return (i * 20 + 10);
	        })
	        .attr("font-size", 12)
	        .attr("fill", "#FFF")
	        
	    rankingData[targetTableId].selectAll("text.rankItemValue")
	        .data(objectArray.slice(0, 5))
	        .enter()
	        .append("text")
	        .text(function(d){
	            return d.VALUE;
	        })
	        .attr("class", "rankItemValue")
	        .attr("x", function(d,i){
	            return $("#topicDiv").width() - 6;
	        })
	        .attr("y", function(d,i){
	            return (i * 20 + 10);
	        })
	        .attr("text-anchor", "end")
	        .attr("font-size", 12)
	        .attr("fill", "#FFF")
	}
	function UpdateRankSvg(objectArray, category, targetTableId){
	    var maxVal = Math.max.apply(null, Object.keys(objectArray).map(key => objectArray[key].VALUE));
	    rankingData[targetTableId].selectAll("rect")   // SVGでの四角形を示す要素を指定
	        .data(objectArray.slice(0, 5))
	        .attr("x", function(d,i){
	            return $("#topicDiv").width() - (d.VALUE / maxVal * $("#topicDiv").width() * 0.5) - 40;
	        })
	        .attr("y", function(d,i){   // Y座標を配列の順序に応じて計算
	            return (i * 20);
	        })
	        .attr("width", function(d){ // 横幅を配列の内容に応じて計算
	            return (d.VALUE / maxVal * $("#topicDiv").width() * 0.5) + "px";
	        })
	        .attr("height", "12")   // 棒グラフの高さを指定
	        .attr("fill", "rgba(158,158,158,0.8)");
	        
	    rankingData[targetTableId].selectAll("text.rankItemName")
	        .data(objectArray.slice(0, 5))
	        .text(function(d, i){
	            return (i+1) + ". " + d[category];
	        })
	        .attr("class", "rankItemName")
	        .attr("x", 24)
	        .attr("y", function(d,i){
	            return (i * 20 + 10);
	        })
	        .attr("font-size", 12)
	        .attr("fill", "#FFF")
	        
	    rankingData[targetTableId].selectAll("text.rankItemValue")
	        .data(objectArray.slice(0, 5))
	        .text(function(d){
	            return d.VALUE;
	        })
	        .attr("class", "rankItemValue")
	        .attr("x", function(d,i){
	            return $("#topicDiv").width() - 6;
	        })
	        .attr("y", function(d,i){
	            return (i * 20 + 10);
	        })
	        .attr("text-anchor", "end")
	        .attr("font-size", 12)
	        .attr("fill", "#FFF")
	}
	//凡例のサークルでフィルタリングを行う
	function DoFilterCircles(){
		if(filterValue == $(this).attr("data-filter-value")){ //フィルタ解除
	        if(isZoomedPrefectures != ""){
	            $("circle.main.showed").css("visibility", "visible");
	            $("circle.labelCircle").css("opacity", 0.8);
	        }else{
	            $("circle.main.showed:not('.zoomVisible')").css("visibility", "visible");
	            $("circle.labelCircle:not('.zoomVisible')").css("opacity", 0.8);
	        }
	        filterValue = "";
	    }else{  //フィルタリング
	    	filterValue = $(this).attr("data-filter-value");
	    	
	    	//凡例自身のフィルタ
	        $("circle.labelCircle").css("opacity", 0.3);
	        $(this).css("opacity", 0.8);
	        
	        //経路店のフィルタ
	        $("circle.main.showed").css("visibility", "hidden");
	        $("circle.main.showed[data-filter-value='"+ filterValue +"']").css("visibility", "visible");
	    }
	}
	//配列・Objectの値を合計する
	function SumHashArray(hash){
	    var sum = 0;
	    $.each(hash, function(i, v){
	        sum =  sum + v;
	    });
	    return sum
	}
	//サークルマウスオーバー時のツールチップを作成する
	function CreateTooltopHtml(element, color){
	    
	    //ツールチップ左側のHTML
	    var html = "<div id='tooltipLeft'>";
	    html += "<div class='innerTip TooltipLeftTitle'>" + selectedHistory + " </div>";
	    html += "<div class='tooltipSummary'>";
	    h = "";
	    $.each(_data.event, function(i, v){
	        if(v.tooltip){
	        	var title = v.tooltipTitle == "" ? i : v.tooltipTitle;
	        	var img = v.icon == "" ? "" : "<img class='toolImg' alt='toolImg' src='"+ MakePath(v.icon) +"' />";
	        	var val = element.hasOwnProperty("toElement") ? element.toElement.attributes[("data-" + i)].value : element.target.attributes[("data-" + i)].value;
	        	h = "<div class='toolSummaryTitle'>" + img + title +"</div><div class='toolSummaryValue "+ i +"'>"+ val +"</div>" + h;
	        }
	    });
	    html += h;
	    html += "</div>"; //サマリの終点
	    html += "</div>"; //左側HTMLの終点
	    //ツールチップ右側のHTML
	    html += '<div id="tooltipRight">';
	    if(_data.toolTipData.length > 0){
	    	html += '<div class="toolGraphTitle"><span class="toolGraphChageLeft toolChange"><span>&lt;</span></span><span id="toolGraphTitleVal">'+ _data.toolTipData[tooltipGraphTypeIndex].name +'</span><span class="toolGraphChageRight toolChange"><span>&gt;</span></span><span class="toolGraphClose" style="display:inline-block; visibility:hidden;">×</span></div><div id="tooltipRightGraph"></div>';
	    	html += '<div class="toolGraphCarousel">';
		    $.each(_data.toolTipData, function(i, v){
		        if(i == tooltipGraphTypeIndex){
		            html += '<span class="toolGraphCarouselPoint '+ v.name +'">●</span>';
		        }else{
		            html += '<span class="toolGraphCarouselPoint '+ v.name +'">○</span>';
		        }
		    });
		    html += '</div>';
		    
	    }
	    html += '</div>';
	    //ツールチップの境界線HTML
	    html += '<div class="tooltipBorder"></div>';
	    //ツールチップ下部のHTML
	    var e = element.hasOwnProperty("toElement") ? element.toElement.__data__ : element.target.__data__;
	    html += '<div class="toolFooter" ><div class="divToolLocation" ><div class="innerTip shopName"">'+ e.LOCATION_NAME +'</div><div class="innerTip divisionName"><span class="locationInfoItem">'+ e.LOCATION_CATEGORY +'</span><span class="locationInfoItem">'+ e.LOCATION_FILTER3 +'</span><span class="locationInfoItem">'+ e.PREFECTURES_01_NM +'</span></div></div></div>';
	    return html;
	}
	//データソース一覧の円弧の作成
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
	
	function Tricks(){
		$("#layout-column_column-1, #canvasArea").children().remove();
	}
	Tricks();
	
	//データセットURL作成
	function MakeUrl(str){
		return site_settings.graphInfoServiceSSL + site_settings.graphInfoServiceIP + "/graphservice/" + str + "?sessionId=" + site_settings.sessionId;
	}
	
	//アイコンへのパス作成
	function MakePath(str){
		return site_settings.graphInfoServiceSSL + site_settings.graphInfoServiceIP + "/BigScreen/" + str;
	}

    //////////////////////////////
    //グラフ描画DOM生成
    //////////////////////////////
    $("#sb-site *").remove();
    $("#sb-site").attr("id", 'chartdivBase');
    
    $("#chartdivBase").css("height", h);
    $("#chartdivBase").append("<div class='box'>");
    $("div.box").append("<div id='chartDiv'>");
    $("div.box").append("<div id='topicDiv'><div id='divFilterDescription'>フィルタリング項目未選択</div></div>");
    $("#topicDiv").css("padding-top", 105 * resolution);
    
    //Loading
    $("body").append("<div id='loadingDiv'>");
    $("#loadingDiv").css({
        "width": "100%",
        "background": "#000",
        "height": "100%",
        "position": "absolute",
        "top": "0px",
        "z-index":"1",
    }).append("<div class='gifDiv blinking'></div>").append("<span>Loading...</span>");
    $("#loadingDiv span").css({
        "position": "absolute",
        "text-align": "center",
        "width":"100%",
        "color": "rgba(33, 150, 243, 0.8)",
        "font-size": "24px",
        "top": (window.innerHeight / 2 + $("#chartdivBase").offset().top) + 40 + "px",
    });
    $("#loadingDiv .gifDiv").css("text-align", "center").append('<div class="loadingCircle1"></div><div class="loadingCircle2"></div>');
    $("#loadingDiv .gifDiv").css("margin-top", $("#loadingDiv span").position().top -100);
    
    //////////////////////////////
    //データモデルからオブジェクト作成
    //////////////////////////////
    
    //Booleanの文字列からBoolean型に変換
    _data.event.white.tooltip = _data.event.white.tooltip == "true" ? true:false;
    _data.event.black.tooltip = _data.event.black.tooltip == "true" ? true:false;
    _data.event.flash.tooltip = _data.event.flash.tooltip == "true" ? true:false;
    _data.isAutoPlaySum = _data.isAutoPlaySum == "true" ? true:false;
    _data.labels.nondata.isVisibleZoomed = _data.labels.nondata.isVisibleZoomed == "true" ? true:false;
    $.each(_data.labels.data, function(i, v){
    	v.isVisibleZoomed = v.isVisibleZoomed == "false" ? false:true;
    })
    $.each(_data.history, function(i, v){
    	v.realtime = v.realtime == "true" ? true:false;
    })
    
    //bigCircleBoundaryValueの未設定対応
    if(_data.bigCircleBoundaryValue != "") _data.bigCircleBoundaryValue = Number(_data.bigCircleBoundaryValue);
    else if(_data.bigCircleBoundaryValue == "" && _data.labels.data.length) _data.bigCircleBoundaryValue = Math.floor(Number(_data.labels.data[0].labels[_data.labels.data[0].labels.length - 1].filterData / 2))
    else _data.bigCircleBoundaryValue = 1000;
    
    if(_data.hasOwnProperty("autoPlaySecond")) _data.autoPlaySecond = Number(_data.autoPlaySecond) * 1000;
    else _data.autoPlaySecond = 15000;
    
    selectedCategory = _data.dataSource.category;
    selectedDatasource = _data.dataSource.dataSet;
    var objPlanet = {"white":{}, "black":{}};
    $.each(_data.planet, function(i, v){
        if(!objPlanet[v.type].hasOwnProperty(v.id)) objPlanet[v.type][v.id] = {};
        if(Number(v.x) < 0) objPlanet[v.type][v.id].x = mapDisplayWidth + Number(v.x);
        else objPlanet[v.type][v.id].x = Number(v.x);
        objPlanet[v.type][v.id].y = Number(v.y);
        objPlanet[v.type][v.id].name = v.name;
        objPlanet[v.type][v.id].color = v.color=="" ? "#FFF" : v.color ;
    });
    //都道府県色付けのためのデータ生成
    $.each(_data.segmentation, function(i,v){
        prefectureData[v.event] = {};
    });
    _data.segmentation.unshift({"title":"none"});
    
    //円着色のためのobject作成
    function MakeLabelObject(){
    	arrCircleStyles = new Array();
	    var isFirstIndex = true;
	    elapsed = 1;
	    switch(_data.history[selectedHistoryIndex].countUnit){
	    	case "daily":
	    		elapsed = 1;
	    		break;
	    	case "monthly":
	    		elapsed = new Date().getDate();
	    		break;
	    	case "annual":
	    		var date2 = new Date();
				var y = date2.getMonth() < 3 ? date2.getFullYear() - 1 : date2.getFullYear()
				var date1 = new Date(y, 3, 1);
				var msDiff = date2.getTime() - date1.getTime();
				var daysDiff = Math.floor(msDiff / (1000 * 60 * 60 *24)) + 1;
				elapsed = daysDiff;
	    		break;
	    	case "weekly":
	    		elapsed = new Date().getDay();
	    		if(elapsed == 0) elapsed = 7;
	    		break;
	    }
	    
	    $.each(_data.labels.data, function(i, v){
	    	var css = new Object();
	    	var colorKey;
	    	switch(v.type){
	    		case "white":
	    			css.r = circleRadius;
	    			css["fill-opacity"] = 0;
	    			css["stroke-dasharray"] = 0;
	    			css["stroke-width"] = animeStrokeWidthTo * 0.15 * resolution;
	    			colorKey = "stroke";
	    			break;
				case "dash":
					css.r = circleRadius;
					css["fill-opacity"] = 0;
					css["stroke-dasharray"] = 3;
					css["stroke-width"] = animeStrokeWidthTo * 0.15 * resolution;
					colorKey = "stroke";
	    			break;
	    		case "mini":
	    			css.r = circleRadius * .5;
	    			css["fill-opacity"] = 1;
	    			colorKey = "fill";
	    			break;
	    		case "circle":
	    		default: //未設定はcircleと同じになる
	    			css.r = circleRadius;
	    			css["fill-opacity"] = 1;
	    			css["stroke-dasharray"] = 0;
	    			colorKey = "fill";
	    			break;
	    	}
	    	for(var cnt = v.labels.length - 1 ; cnt >= 0 ; cnt--){
	    		var cssSetting = $.extend(true, {}, css);
	        	cssSetting[colorKey] = v.labels[cnt].color == "" ? "#FFF" : v.labels[cnt].color;
		    	if(isFirstIndex && Number(v.labels[cnt].filterData) >= _data.bigCircleBoundaryValue * elapsed){
		    		 cssSetting.r = circleRadius * 2;
		    	}
	            arrCircleStyles.push({"target_value":v.target_value, "value":Number(v.labels[cnt].filterData) * elapsed, "isVisibleZoomed":v.isVisibleZoomed ,"css":cssSetting, "circleType":v.type});
	        }
	        isFirstIndex = false;
	    });
	    
	    var cssNon = new Object();
	    switch(_data.labels.nondata.type){
			case "circle":
				cssNon.r = circleRadius;
				cssNon["fill-opacity"] = 1;
				cssNon["stroke-dasharray"] = 0;
				cssNon.fill = _data.labels.nondata.color;
				break;
			case "white":
				cssNon.r = circleRadius;
				cssNon["fill-opacity"] = 0;
				cssNon["stroke-dasharray"] = 0;
				cssNon["stroke-width"] = 1;
				cssNon.stroke = _data.labels.nondata.color;
				break;
			case "dash":
				cssNon.r = circleRadius;
				cssNon["fill-opacity"] = 0;
				cssNon["stroke-dasharray"] = 3;
				cssNon["stroke-width"] = 1;
				cssNon.stroke = _data.labels.nondata.color;
				break;
			case "mini":
				cssNon.r = circleRadius * .5;
				cssNon["fill-opacity"] = 1;
				cssNon.fill = _data.labels.nondata.color;
				break;
			default: //labels項目が設定されていない場合
				cssNon.r = circleRadius;
				cssNon["fill-opacity"] = 1;
				cssNon["stroke-dasharray"] = 0;
				cssNon.fill = "#FFF";
				break;
		}
	    arrCircleStyles.push({"target_value":"", "value":0, "isVisibleZoomed":_data.labels.nondata.isVisibleZoomed ,"css":cssNon, "circleType":_data.labels.nondata.type});
	}
	MakeLabelObject();
	
    //フィルタ項目の設定
    $.each(_data.filter, function(i, v){
        filterObj["LOCATION_FILTER"+ v.target.slice(-1)] = new Array();
    });
    //半円表示項目の個数に応じて表示位置を調整する
    if(_data.semiCircleDetail.length == 4){
        _data.semiCircleDetail[0].x = 150;
        _data.semiCircleDetail[1].x = 240;
        _data.semiCircleDetail[2].x = 330;
        _data.semiCircleDetail[3].x = 420;
    }
    //都道府県着色値のレンジ
    segmentationRange = Number(_data.segmentation[0].range);
    //ランキングカテゴリリスト生成(カテゴリの重複削除)
    rankCategoryNameList = Object.keys(_data.rankData).map(key => _data.rankData[key].categoryName).unique();
    //画面リサイズ
    ResizeRank();
    //ソフトバンクロゴ作成
    $("div.box").append("<div id='sumaryDiv'>");
    var headerHtml = '<img style="height: 30px" alt="logo02" src="'+ MakePath("icon/icon_softbank_blk.png") +'">';
    $("div#sumaryDiv").append(headerHtml);
    $("div#sumaryDiv").css({"transform-origin":"right bottom 0px","transform":"scale(" + resolution + ")"});
    //ツールチップ作成
    $("body").append("<div id='tooltip'></span>");
    $("body").append("<div id='tooltipIcon'></span>");
    //日本地図SVG 
    d3_svg = d3.select("#chartDiv")
              .append("svg")
              .attr("width", w)
              .attr("height", h)
              .attr("version", "1.1")
              .attr("xmlns", "http://www.w3.org/2000/svg");
    gJapan = d3_svg.append("g").attr('class', 'japan');
    gCircle = d3_svg.append("g").attr('class', 'circles');
    //選択円装飾用の子サークル
    $("#chartDiv g.circles").append(CreateG({"id":"gToolCircle", "display":"none"}));
    $("#gToolCircle").append(CreateCircle({"class":"toolCircle", "fill":"#FFF", "cx":4, "cy":0}));
    $("#gToolCircle").append(CreateCircle({"class":"toolCircle", "fill":"#FFF", "cx":4/Math.sqrt(2), "cy":4/Math.sqrt(2)}));
    $("#gToolCircle").append(CreateCircle({"class":"toolCircle", "fill":"#FFF", "cx":0, "cy":4}));
    $("#gToolCircle").append(CreateCircle({"class":"toolCircle", "fill":"#FFF", "cx":-4/Math.sqrt(2), "cy":4/Math.sqrt(2)}));
    $("#gToolCircle").append(CreateCircle({"class":"toolCircle", "fill":"#FFF", "cx":-4, "cy":0}));
    $("#gToolCircle").append(CreateCircle({"class":"toolCircle", "fill":"#FFF", "cx":-4/Math.sqrt(2), "cy":-4/Math.sqrt(2)}));
    $("#gToolCircle").append(CreateCircle({"class":"toolCircle", "fill":"#FFF", "cx":0, "cy":-4}));
    $("#gToolCircle").append(CreateCircle({"class":"toolCircle", "fill":"#FFF", "cx":4/Math.sqrt(2), "cy":-4/Math.sqrt(2)}));
    $("circle.toolCircle").append(anime3);
    //日本地図描画
    d3.json(MakePath("json/japan.topojson"), function(json) {
        if(!json || !json.hasOwnProperty("objects") || json.objects.japan.length == 0) {
            $("#loadingDiv span").text("Communication error. Auto Reload after 3 seconds.");
            setTimeout(function(){
                location.reload();
            }, 3000);
        }
        japan = topojson.feature(json, json.objects.japan).features;
        var centered,
            scale0 = 1200 * Number(window.innerHeight) / 683;
        $.each(japan, function(i, v){
            $.each(prefectureData, function(ii, vv){
                vv[v.properties.nam_ja] = 0;
            });
        });
        //プロジェクション設定
        var projection = d3.geo
            .mercator()
            .scale(scale0)
            .translate([mapDisplayWidth / 2, 350 * Number(window.innerHeight) / 700])
            .center([139.0032936, 36.3219088]);
        // 緯度経度⇒パスデータ変換設定
        var path = d3.geo.path()
            .projection(projection);
        // パスデータとして日本地図描画
        gJapan.selectAll("path")
        .data(japan)
        .enter()
        .append("path")
        .attr({
        	"fill": "#000000",
        	"d": path,
        	"class": function(d){
        		return "pathPrefecture " + d.properties.nam_ja;
        	}
        })
        .on('mouseover', function(){
            d3.select(this)
            .style("fill", "#607D8B");
        })
        .on('mouseout', function(){
            d3.select(this)
            .style("fill", "#000000");
        })
        .on('click', SelectPrefecture)
        
        function SelectPrefecture(d){
          //都道府県ズーム
          var x, y, bounds,
          w = $("#chartDiv").width() - $("#topicDiv").width();
          h = $("#chartDiv").height() - $("#sumaryDiv").height() * 2.5;
          animeStrokeWidthTo = 0.5;
          if (d && centered !== d) {
          
            //ツールチップ非表示
            if(tooltip.style("visibility")=="visible"){
                if (jqxhr) jqxhr.abort();
                clearTimeout(timerMiniGraph);
                $("#gToolCircle").css("display", "none" );
                $("#toolTipCircle").removeAttr("id");
                AddEventCircle();
                tooltip.style("visibility", "hidden");
                tooltipIcon.style("visibility", "hidden");
            }
            $("circle.labelCircle.zoomVisible").css("cursor","pointer").on("click", DoFilterCircles);
            
            isZoomedPrefectures = d.properties.nam_ja;
            bounds = path.bounds(d);
            if (isZoomedPrefectures == "東京都") {
                x = bounds[0][0] + (bounds[1][0] - bounds[0][0]) / 30;
                y = bounds[0][1] + (bounds[1][1] - bounds[0][1]) / 40;
                if((w / (bounds[1][0] - bounds[0][0])) > (h / (bounds[1][1] - bounds[0][1]))) k = Math.floor(h / (bounds[1][1] - bounds[0][1]) * 16);
                else k = Math.floor(w / (bounds[1][0] - bounds[0][0]) * 16);
            }else if(isZoomedPrefectures == "北海道"){
                x = bounds[0][0] + (bounds[1][0] - bounds[0][0]) / 4;
                y = bounds[0][1] + (bounds[1][1] - bounds[0][1]) / 2;
                if((w / (bounds[1][0] - bounds[0][0])) > (h / (bounds[1][1] - bounds[0][1]))) k = Math.floor(h / (bounds[1][1] - bounds[0][1]) * 1.2);
                else k = Math.floor(w / (bounds[1][0] - bounds[0][0]) * 1.2);
            }else{
                x = bounds[0][0] + (bounds[1][0] - bounds[0][0]) / 2;
                y = bounds[0][1] + (bounds[1][1] - bounds[0][1]) / 2;
                if((w / (bounds[1][0] - bounds[0][0])) > (h / (bounds[1][1] - bounds[0][1]))) k = Math.floor(h / (bounds[1][1] - bounds[0][1]));
                else k = Math.floor(w / (bounds[1][0] - bounds[0][0]));
                k = k * 0.9;
            }
            centered = d;
            //ズームの倍率に応じて、サークルの波紋を求める
            animeStrokeWidthTo = 6 / k;
            anime2.setAttribute("to", animeStrokeWidthTo);
            
            //ズーム時はアニメーションをつける
            $("circle.main.showed animate").remove();
            $("circle.circle.showed").attr("stroke", "");
            setTimeout(function(){
	            $("circle.circle.showed[data-prefecture='" + isZoomedPrefectures + "']").attr("stroke", "white");
	            $("circle.circle.showed[data-prefecture='" + isZoomedPrefectures + "']").append(anime1);
	            $("circle.circle.showed[data-prefecture='" + isZoomedPrefectures + "']").append(anime2);
            }, 450);
            
            //地図の濃淡の変更
            gJapan.selectAll("path").attr('opacity', 0.5);
            gJapan.selectAll("path." + d.properties.nam_ja).attr('opacity', 1);
            
            //円の濃淡サイズ変更
            $("circle.main.showed").css("opacity", 0.2);
            $("circle.showed[data-prefecture='" + isZoomedPrefectures + "']").css("opacity", 0.8);
            $("circle.main.showed").css("r", animeStrokeWidthTo * resolution + "px");
            
            //獲得機変0件代理店の可視化
            $("circle.main.showed.white, circle.main.showed.dash").css("stroke-width", animeStrokeWidthTo * 0.15 * resolution);
            $("circle.main.showed.mini").css("r", animeStrokeWidthTo * resolution * .4 + "px");

			//フィルタリングの継続
			if(filterValue == ""){
                $("circle.main.zoomVisible").css("opacity", "0.1");
                $("circle.main.zoomVisible[data-prefecture='" + isZoomedPrefectures + "']").css("opacity", "0.8");
                $("circle.main.showed.zoomVisible").css("visibility", "visible");
                $("circle.labelCircle.zoomVisible").css("opacity", "0.8");
            }
            
            //凡例円ラベルの見た目
            if(isLabelOpen){
                $("text.zoomVisible").css("opacity", 0.8);
            }
          } else { //ズーム解除
          
            //ツールチップ非表示
            if(tooltip.style("visibility")=="visible"){
                if (jqxhr) jqxhr.abort();
                clearTimeout(timerMiniGraph);
                $("#gToolCircle").css("display", "none" );
                $("#toolTipCircle").removeAttr("id");
                AddEventCircle();
                tooltip.style("visibility", "hidden");
                tooltipIcon.style("visibility", "hidden");
            }
            isZoomedPrefectures = "";
            x = mapDisplayWidth / 2;
            y = 350 * Number(window.innerHeight) / 700;
            k = 1;
            centered = null;
            setTimeout(function(){
                $("circle.main.zoomVisible").css("visibility", "hidden");
                //サークルサイズを元に戻す
                $("circle.main.showed").css("r", resolution + "px");
                //ビックサイズサークルの可視化
                $.each($("circle.main.showed." + arrCircleStyles[0].circleType), function(index, item){
                	$(item).css("r", Number($(item).attr("data-" + arrCircleStyles[0]["target_value"].slice(6).toLowerCase())) >= _data.bigCircleBoundaryValue * elapsed ? 2 * resolution  : 1 * resolution);
                });
            },900);
            
            $("circle.circle.showed").attr("stroke", "");
            $("circle.main.showed animate").remove();
            $("circle.main.showed").css("opacity", 0.8);
            
            //都道府県の見た目
            gJapan.selectAll("path").attr('opacity', 1);
            
            //凡例の見た目修正
            if(isLabelOpen) $("text.zoomVisible").css("opacity", "0.3");
            $("circle.labelCircle.zoomVisible").off("click", DoFilterCircles);
            $("circle.labelCircle.zoomVisible").css("opacity","0.3").css("cursor","auto");
            //zoomVisible系のフィルタリングを解除する
            if($("circle.zoomVisible.labelCircle[data-filter-value = "+ filterValue +"]").length > 0){
                $("circle.main.showed").css("visibility", "visible");
                $("circle.labelCircle").css("opacity", 0.8);
                $("circle.labelCircle.zoomVisible").css("opacity", 0.3);
                filterValue = "";
            }
          }
          
          //日本地図の移動
          gJapan.selectAll("path")
              .classed("active", centered && function(d) { return d === centered; });
          gJapan.transition()
              .duration(900)
              .attr("transform", "translate(" + w / 2 + "," + (h / 2 + 75) + ")scale(" + k + ")translate(" + -x + "," + -y + ")");
          //円の移動
          gCircle.transition()
              .duration(900)
              .attr("transform", "translate(" + w / 2 + "," + (h / 2 + 75) + ")scale(" + k + ")translate(" + -x + "," + -y + ")");
        }
        
        ////////////////////////////////////////////
        //グラフメニューの作成(日本地図のzIndexが上になるようにここで処理)
        ////////////////////////////////////////////
        $("#chartDiv svg").append(CreateG({"class":"gHistoryPos", "style":"transform:translate(12px, " + (h - 66) + "px); transform-origin: left bottom;"}));
        $("#chartDiv svg g.gHistoryPos").append(CreateG({"class":"gHistory", "style":"transform:scale("+ resolution +");transform-origin:left bottom;"}));
        $("#chartDiv svg g.gHistory").append(CreateG({"class":"gHistoryAnime", "style":"transform:scaleY(0.01);transform-origin:left bottom;opacity:0"}));
        $.each(_data.history, function(i, v){
            $("#chartDiv svg g.gHistoryAnime").append(CreateText({"class":"historyItemCircle", "fontSize":"28px", "fill":"#FFF", "content":v.realtime?"●":"○", "y": i*-36+4}));
            $("#chartDiv svg g.gHistoryAnime").append(CreateText({"class":"historyItem", "fontSize":"12px", "fill":"#FFF", "content":v.name, "y":i*-36, "x":24}));
            if(_data.history.length - 1 != i){
                $("#chartDiv svg g.gHistoryAnime").append(CreateLine({"stroke":"#fff", "x1":8, "y1":i*-36-14, "x2":8, "y2":i*-36-29, "strokeWidth":"2"}));
            }
        });
        selectedHistory = $(".historyItem").first().text();
        $(".historyItem").first().append(CreateTspan({"fontSize":"14", "fill":"#ffffff", "class":"blinking", "dx":"24", "content":"Construction…", "style":"display:none; opacity:0;"}));
        $(".historyItemCircle").first().css("text-shadow", "rgb(255, 255, 255) 0px 0px 5px,  rgb(255, 255, 255) 0px 0px 10px,  rgb(255, 255, 255) 0px 0px 15px,  rgb(255, 255, 255) 0px 0px 20px,  rgb(255, 255, 255) 0px 0px 25px,  rgb(255, 255, 255) 0px 0px 30px");
        $(".historyItem").first().css("text-shadow", "rgb(255, 255, 255) 0px 0px 5px,  rgb(255, 255, 255) 0px 0px 10px,  rgb(255, 255, 255) 0px 0px 15px,  rgb(255, 255, 255) 0px 0px 20px,  rgb(255, 255, 255) 0px 0px 25px,  rgb(255, 255, 255) 0px 0px 30px");
        $("#chartDiv svg").append(CreateG({"class":"gLeftBotomTran", "style":"transform:translate(0px, " + (h - 48*resolution) + "px); transform-origin: left bottom;"}));
        $("#chartDiv svg g.gLeftBotomTran").append(CreateG({"class":"gLeftBotom", "style":"transform:scale("+ resolution +");transform-origin:left bottom;"}));
        $("#chartDiv svg g.gLeftBotom").append(CreateG({"class":"gToday", "style":"transform:translate(16px, 0px)"}));
        $("#chartDiv svg g.gToday").append(CreateRect({"x":"0", "class":"switchDataMesh", "rx":"16", "ry":"16", "width":"110", "height":"32", "fill":"rgba(0, 0, 0, 0.5)"}));
        $("#chartDiv svg g.gToday").append(CreateText({"font-size":"16", "fill":"#ffffff", "class":"switchDataMesh"}));
        $("#chartDiv svg g.gToday text.switchDataMesh").append(CreateTspan({"x":"12", "y":"20", "id":"tspanSwitchDataMesh", "class":"switchDataMesh", "content":"Time Controler"}));
        
        //ヒートマップアイコンの切替
        $("#chartDiv svg g.gLeftBotom").append(CreateG({"class":"gSwitch", "style":"transform:translate(140px, 0px)"}));
        $("#chartDiv svg g.gSwitch").append(CreateText({"x":"0", "y":"20", "font-size":"14", "fill":"#ffffff", "content":"Segment:"}));
        $("#chartDiv svg g.gSwitch").append(CreateRect({"x":"55", "rx":"16", "ry":"16", "height":"32", "fill":"rgba(0, 0, 0, 0.5)"}));
        $("#chartDiv svg g.gSwitch").append(CreateText({"x":"65", "y":"21", "font-size":"16", "fill":"#ffffff", "id":"segmentText"}));
        $("#segmentText").append(CreateTspan({"dx":"0", "y":"20", "class":"segmentTextContent", "content":"none"}));
        $("#segmentText").append(CreateTspan({"dx":"6", "y":"20", "font-size":"8", "fill":"#ffffff", "class":"", "content":"▼"}));
        $("#chartDiv svg g.gSwitch rect").attr('width', $("#segmentText").outerWidth(true) + 20);
        var selectSegmentIndex = 0;
        
        //都道府県着色処理
        $("g.gSwitch rect, #segmentText").on('click', function(){
            selectSegmentIndex++;
            segmentationRange = _data.segmentation[selectSegmentIndex % _data.segmentation.length].range;
            $("#segmentText .segmentTextContent").text(_data.segmentation[selectSegmentIndex % _data.segmentation.length].title);
            $("#chartDiv svg g.gSwitch rect").attr('width', $("#segmentText").outerWidth(true) + 20);
            if($("#segmentText .segmentTextContent").text() == "none"){
                $("#iconSegment").attr("opacity", "0.3");
                 isSegmentation = false;
                 
                gJapan.selectAll("path")
                    .data(japan)
                    .transition()
                    .duration(2000)
                    .style("fill", "#000")
                    .style("opacity", 0.8);
                    
                gJapan.selectAll("path")
                    .on('mouseover', function(){
                        d3.select(this)
                        .style("fill", "#607D8B");
                    })
                    .on('mouseout', function(){
                        d3.select(this)
                        .style("fill", "#000000");
                    });
            }else{
                segmentFactor = _data.segmentation[selectSegmentIndex % _data.segmentation.length].event;
                isSegmentation = true;
                gJapan.selectAll("path")
                    .data(japan)
                    .transition()
                    .duration(2000)
                    .style("fill", function(d){
                        var n = prefectureData[segmentFactor][d.properties.nam_ja];
                        if(n > segmentationRange * 9) return "#B71C1C";
                        if(n > segmentationRange * 8) return "#C62828";
                        if(n > segmentationRange * 7) return "#D32F2F";
                        if(n > segmentationRange * 6) return "#E53935";
                        if(n > segmentationRange * 5) return "#F44336";
                        if(n > segmentationRange * 4) return "#EF5350";
                        if(n > segmentationRange * 3) return "#E57373";
                        if(n > segmentationRange * 2) return "#EF9A9A";
                        if(n > segmentationRange) return "#FFCDD2";
                        if(n > 0) return "#FFEBEE";
                        return "#FFFFFF";
                    })
                    .style("opacity", function(d){
                        var n = prefectureData[segmentFactor][d.properties.nam_ja];
                        if(n > segmentationRange * 9) return 1;
                        if(n > segmentationRange * 8) return 0.91;
                        if(n > segmentationRange * 7) return 0.82;
                        if(n > segmentationRange * 6) return 0.73;
                        if(n > segmentationRange * 5) return 0.64;
                        if(n > segmentationRange * 4) return 0.55;
                        if(n > segmentationRange * 3) return 0.46;
                        if(n > segmentationRange * 2) return 0.37;
                        if(n > segmentationRange) return 0.28;
                        if(n > 0) return 0.19;
                        return 0.1;
                    });
                gJapan.selectAll("path")
                    .on('mouseover', null)
                    .on('mouseout', null);
            }
        });
        
        //目隠しモード
        $("#chartDiv>svg").append(CreateG({"id":"gVisibleImportant", "style":"transform:translate(72px, 12px)scale(" + resolution + ")"}));
        $("#gVisibleImportant").append(CreateCircle({"cx":"0", "cy":"16", "r":"16", "fill":"rgba(0,0,0,.8)", "class":"tooltipIcon", "title":"ShowData"}));
        $("#gVisibleImportant").append(CreateG({"style":"transform:translate(-7px, 8px)scale(.03);", opacity:"0.3"}));
        $("#gVisibleImportant g").append(CreatePath({fill:"white", "class":"tooltipIcon", "title":"ShowData", d:"M238.301,346.393c0.598,3.938,2.563,7.725,5.903,11.359c3.313,3.626,7.252,5.447,11.796,5.447 c10.592,0,16.486-5.608,17.691-16.806l35.398-271.98c0.607-4.823,0.911-11.636,0.911-20.415c0-13.618-4.679-26.013-14.065-37.22 C286.558,5.59,273.244,0,255.999,0c-17.868,0-31.317,5.742-40.389,17.226c-9.073,11.206-13.61,23.459-13.61,36.773 c0,8.172,0.285,14.976,0.892,20.415L238.301,346.393z"}));
        $("#gVisibleImportant g").append(CreatePath({fill:"white", "class":"tooltipIcon", "title":"ShowData", d:"M295.033,418.065c-10.288-10.287-23.307-15.44-39.034-15.44c-15.422,0-28.441,5.314-39.032,15.896 c-10.591,10.591-15.877,23.441-15.877,38.569c0,14.52,5.286,27.379,15.877,38.577C227.558,506.562,240.578,512,255.999,512 c15.423,0,28.424-5.286,39.034-15.886c10.574-10.574,15.877-23.593,15.877-39.024C310.91,441.658,305.607,428.656,295.033,418.065z"}));
        $("#gVisibleImportant").on("click", function(){
        	d3.selectAll(".HiddenInfo").transition().duration(150)
	        	.ease("sin")
	            .style("opacity", isVisibleMode ? 0 : 1);
	        
        	$("#gVisibleImportant g").attr("opacity", isVisibleMode ? ".3" : "1");
        	isVisibleMode = !isVisibleMode;
        });
        
        function AutoSelectPrefecture(){
        	var d;
    		if(preIndex == arrPrefecture.length){
    			d = japan.filter(function(v, i){
                    if (v.properties.nam_ja == isZoomedPrefectures) return v;
                });
                SelectPrefecture(d[0]);
    		}else {
    			d = japan.filter(function(v, i){
                    if (v.properties.nam_ja == arrPrefecture[preIndex].name) return v;
                });
                var preName;
                if(isZoomedPrefectures != arrPrefecture[preIndex].name){
                	preName = arrPrefecture[preIndex].name;
                	SelectPrefecture(d[0]);
                }else preName = isZoomedPrefectures;
                //ツールチップの表示
                setTimeout(function(){
                	var nums = $("g.circles circle.main[data-prefecture="+ preName +"]").map(function(i, d){ 
                		return Number(d.attributes["data-white"].value)
                	});
                	var max = Math.max.apply(null, nums);
                	var target = $("g.circles circle.main[data-prefecture="+ preName +"][data-white="+ max +"]");
                	
                	if(target.length == 1) $(target[0]).trigger("mouseover");
                	else{
                		var nums2nd = target.map(function(i, d){
                			return Number(d.attributes["data-flash"].value)
                		});
                		var max2nd = Math.max.apply(null, nums2nd);
                		var target2nd = $("g.circles circle.main[data-prefecture="+ preName +"][data-white="+ max +"][data-flash="+ max2nd +"]");
                		$(target2nd[0]).trigger("mouseover");
                	}
                }, _data.autoPlaySecond/3);
    		}
    		preIndex = (preIndex+1) % (arrPrefecture.length+1) ;
        }
        
        //自動循環モード
        $("#chartDiv>svg").append(CreateG({"id":"gAutoPlay", "style":"transform:translate(120px, 12px)scale(" + resolution + ")"}));
        $("#gAutoPlay").append(CreateCircle({"cx":"0", "cy":"16", "r":"16", "fill":"rgba(0,0,0,.8)", "class":"tooltipIcon", "title":"AutoPlay"}));
        $("#gAutoPlay").append(CreateG({"style":"transform: translate(-21px, -4px) scale(0.08); opacity:.8;"}));
        $("#gAutoPlay g").append(CreatePath({fill:"white", "class":"tooltipIcon", "title":"AutoPlay", d:"M368.149,244.383l-146.883-84.805c-2.953-1.707-6.133-2.047-9.09-1.496c-0.126,0.023-0.25,0.027-0.371,0.054   c-0.715,0.152-1.394,0.379-2.07,0.645c-0.23,0.09-0.453,0.183-0.676,0.281c-0.66,0.305-1.297,0.633-1.902,1.035   c-0.062,0.043-0.117,0.094-0.179,0.137c-2,1.379-3.59,3.282-4.606,5.578c-0.054,0.125-0.11,0.242-0.16,0.367   c-0.294,0.726-0.535,1.465-0.699,2.258c-0.031,0.141-0.035,0.293-0.059,0.442c-0.133,0.762-0.316,1.504-0.316,2.32v169.606   c0,0.812,0.183,1.554,0.316,2.32c0.024,0.145,0.028,0.297,0.059,0.438c0.164,0.793,0.406,1.535,0.703,2.262   c0.05,0.122,0.102,0.238,0.152,0.359c1.019,2.305,2.617,4.211,4.625,5.59c0.055,0.039,0.102,0.086,0.16,0.125   c0.61,0.406,1.246,0.734,1.918,1.039c0.214,0.102,0.434,0.191,0.656,0.278c0.68,0.269,1.363,0.496,2.082,0.648   c0.117,0.027,0.242,0.031,0.363,0.054c2.961,0.551,6.137,0.215,9.094-1.492l146.883-84.805   C377.094,262.457,377.094,249.547,368.149,244.383z"}));
        var preIndex = 0;
        $("#gAutoPlay").on("click", function(){
        	if(isAutoPlay){
        		clearInterval(timerAutoPlay);
        		preIndex = 0;
        		d3.select("#gAutoPlay g").transition().duration(300).style("transform", "translate(-21px, -4px) scale(0.08)");
				d3.select("#gAutoPlay g path").transition().duration(300).attr("d", "M368.149,244.383l-146.883-84.805c-2.953-1.707-6.133-2.047-9.09-1.496c-0.126,0.023-0.25,0.027-0.371,0.054   c-0.715,0.152-1.394,0.379-2.07,0.645c-0.23,0.09-0.453,0.183-0.676,0.281c-0.66,0.305-1.297,0.633-1.902,1.035   c-0.062,0.043-0.117,0.094-0.179,0.137c-2,1.379-3.59,3.282-4.606,5.578c-0.054,0.125-0.11,0.242-0.16,0.367   c-0.294,0.726-0.535,1.465-0.699,2.258c-0.031,0.141-0.035,0.293-0.059,0.442c-0.133,0.762-0.316,1.504-0.316,2.32v169.606   c0,0.812,0.183,1.554,0.316,2.32c0.024,0.145,0.028,0.297,0.059,0.438c0.164,0.793,0.406,1.535,0.703,2.262   c0.05,0.122,0.102,0.238,0.152,0.359c1.019,2.305,2.617,4.211,4.625,5.59c0.055,0.039,0.102,0.086,0.16,0.125   c0.61,0.406,1.246,0.734,1.918,1.039c0.214,0.102,0.434,0.191,0.656,0.278c0.68,0.269,1.363,0.496,2.082,0.648   c0.117,0.027,0.242,0.031,0.363,0.054c2.961,0.551,6.137,0.215,9.094-1.492l146.883-84.805   C377.094,262.457,377.094,249.547,368.149,244.383z");
        	}else{
        		arrPrefecture = new Array();
        		if(_data.isAutoPlaySum){
        			$.each(prefectureData[_data.segmentation[1].event], function(i, v){
		        		arrPrefecture.push({"name":i, "val":v});
		        	});
		        	arrPrefecture.sort(function(a, b) {
					  return b.val - a.val;
					});
	        	}else{
	        		$.each(japan, function(i, v){
		        		arrPrefecture.push({"name":v.properties.nam_ja, "val":v.properties.id});
		        	});
		        	arrPrefecture.sort(function(a, b) {
					  return a.val - b.val;
					});
	        	}
	        	
	        	AutoSelectPrefecture();
	        	timerAutoPlay = setInterval(AutoSelectPrefecture, _data.autoPlaySecond)
	        	d3.select("#gAutoPlay g").transition().duration(300).style("transform", "translate(-20px, -5px)scale(.08)");
				d3.select("#gAutoPlay g path").transition().duration(300).attr("d", "M 180 180 h 160 v 160 h -160 z");
        	}
        	isAutoPlay = !isAutoPlay;
        });
        
        ////////////////////////////////////////////
        //ラベルの生成
        ////////////////////////////////////////////
        function MakeLabel(){
	        $("#chartDiv svg").append(CreateG({"class":"gLabelPos", "style":"transform:translate(0px, "+ labelPositionY +"px);"}));
	        $("#chartDiv svg g.gLabelPos").append(CreateG({"class":"gLabelZoom"}));
	        $("#chartDiv svg g.gLabelZoom").append(CreateG({"class":"gLabel"}));
	        $("#chartDiv svg g.gLabelZoom").append(CreateG({"class":"gLabelClose"}));
	        
	        $("#chartDiv svg g.gLabelClose").append(CreateRect({"x": 12 * resolution + 8,"rx":"14","ry":"14","width":"70","height":"36","fill":"rgba(0, 0, 0, 0)",}));
			$("#chartDiv svg g.gLabel").append(CreateRect({"x": "-30","rx": 18,"ry": 18,"height":"36","fill":"rgba(0: 0: 0: 0.5)"}));
			$("#chartDiv svg g.gLabelClose").append(CreateImage({"x": "20","y":"10.5","visibility": "visible","id": "closeLabel","class": "tooltipIcon","title": "label","href": MakePath("icon/icon_label.png"),"width":"16","height":"16",}));
	        
	        //凡例ラベル開閉
	        $("#closeLabel").on('click', function(){
	            if(isLabelOpen){
	                d3_svg.select("g.gLabel")
	                    .transition()
	                    .duration(150)
	                    .delay(100)
	                    .ease("sin")
	                    .style("transform", "translate(" + ((-labelRectWidth + 80)) + "px, 0px)");
	                d3_svg.selectAll("g.gLabel text, g.gLabel circle, g.gLabel line, text.zoomVisible")
	                    .transition()
	                    .duration(150)
	                    .ease("sin")
	                    .style("opacity", "0");
	                d3_svg.select("#chartDiv svg g.gLabel rect")
	                    .transition()
	                    .duration(150)
	                    .ease("sin")
	                    .attr("rx", 18 * resolution);
	                isLabelOpen = false;
	            }else{
	                d3_svg.selectAll("text.allVisivle, g.gLabel line")
	                    .transition()
	                    .duration(150)
	                    .delay(100)
	                    .ease("sin")
	                    .style("opacity", "0.8");
	                d3_svg.select("g.gLabel")
	                    .transition()
	                    .duration(150)
	                    .ease("sin")    
	                    .style("transform", "translate(0px, 0px)")
	                d3_svg.select("#chartDiv svg g.gLabel rect")
	                    .transition()
	                    .duration(150)
	                    .ease("sin")
	                    .attr("rx", 18);
	                d3_svg.selectAll("text.zoomVisible")
	                    .transition()
	                    .duration(150)
	                    .delay(100)
	                    .ease("sin")
	                    .style("opacity", "0.3");
	                
	                //前回フィルタリング実績がある場合は再開させる
	                if(filterValue != "") {
	                    d3_svg.selectAll("g.gLabel circle:not([data-filter-value='" + filterValue + "'])")
	                        .transition()
	                        .duration(150)
	                        .delay(100)
	                        .ease("sin")
	                        .style("opacity", "0.3");
	                    d3_svg.selectAll("g.gLabel circle[data-filter-value='" + filterValue + "']")
	                        .transition()
	                        .duration(150)
	                        .delay(100)
	                        .ease("sin")
	                        .style("opacity", "0.8");
	                    //拡大時表示ラベル
	                    if(isZoomedPrefectures != "") {
	                        d3_svg.selectAll("text.zoomVisible")
	                            .transition()
	                            .duration(150)
	                            .delay(100)
	                            .ease("sin")
	                            .style("opacity", "0.8");
	                    }else{
	                    	d3_svg.selectAll("circle.labelCircle.zoomVisible")
			                    .transition()
			                    .duration(150)
			                    .delay(100)
			                    .ease("sin")
			                    .style("opacity", "0.3");
	                    }
	                }else{
	                    d3_svg.selectAll("circle.labelCircle")
	                        .transition()
	                        .duration(150)
	                        .delay(100)
	                        .ease("sin")
	                        .style("opacity", "0.8");
	                    //拡大時表示ラベル
	                    if(isZoomedPrefectures != "") {
	                    	d3_svg.selectAll("circle.labelCircle.zoomVisible, text.zoomVisible")
	                            .transition()
	                            .duration(150)
	                            .delay(100)
	                            .ease("sin")
	                            .style("opacity", "0.8");
	                    }else{
	                    	d3_svg.selectAll("circle.labelCircle.zoomVisible")
			                    .transition()
			                    .duration(150)
			                    .delay(100)
			                    .ease("sin")
			                    .style("opacity", "0.3");
	                    }
	                }
	                isLabelOpen = true;
	            }
	        });
	        //ラベル文言・円生成
	        var cx = 0;
	        $.each(_data.labels.data, function(i, v){
	        	var visibleText = v.isVisibleZoomed ? "zoomVisible" : "allVisivle";
	            $("#chartDiv svg g.gLabel").append(CreateText({"class":visibleText, "x":(cx + 60),"y":"22","fill":"#fff", "content":v.name}));
	            $("#chartDiv svg g.gLabel").append(CreateLine({"stroke":"#fff", "x1":(cx + 50), "y1":"6", "x2":(cx + 50), "y2":"30", "stroke-width":"0.5"}));
	            
	            $.each(v.labels, function(ii, vv){
	            	var n;
	            	if($("#chartDiv svg g.gLabel text:last-of-type").text() == "") n = $("#chartDiv svg g.gLabel line:last-of-type").position().left;
	            	else n = $("#chartDiv svg g.gLabel text:last-of-type").position().left + $("#chartDiv svg g.gLabel text:last-of-type").width();
	            	n += 24/resolution;
	                $("#chartDiv svg g.gLabel").append(CreateText({"x":n, "y":"22", "class":visibleText, "fill":"#fff", "content":Number(vv.filterData) * elapsed}));
	                
	                cx = n - 12/resolution;
	                
	                //未入力項目の補填
	                if(vv.color == "") vv.color = "#FFF";
	                if(vv.filterData == "") vv.filterData = 0;
	                
	                var circleObj = {"cx":cx, "cy":"18", "r":"6", "dataFilterValue":v.target_value.slice(6).toLowerCase() + Number(vv.filterData) * elapsed};
	                
	                //ズーム時の振舞
	                if(v.isVisibleZoomed) {
	                	circleObj.class = "labelCircle zoomVisible";
	                	circleObj.style = "cursor:auto";
	                	circleObj.opacity="0";
	                }else{
	                	circleObj.class = "labelCircle";
	                	circleObj.opacity="0.8";
	                }
	                
	                if(v.type == "white"){
	                	circleObj.strokeWidth="1";
	                	circleObj.fill="rgba(0,0,0,0)";
	                	circleObj.stroke = vv.color;
	                }
	                else if(v.type == "dash"){
	                	circleObj.strokeWidth="1";
	                	circleObj.fill="rgba(0,0,0,0)";
	                	circleObj.stroke = vv.color;
	                	circleObj.strokeDasharray="3";
	                }
	                else if(v.type == "mini"){
	                	circleObj.r="4";
						circleObj.strokeWidth="0";
						circleObj.fill=vv.color;
	                }else{
	                	circleObj.strokeWidth="0";
						circleObj.fill=vv.color;
	                }
	                
	                //エレメント生成
	                $("#chartDiv svg g.gLabel").append(CreateCircle(circleObj));
	            });
	        });
	        
	        //データなし用のラベル作成
	        var vis =  _data.labels.nondata.isVisibleZoomed ? "zoomVisible" : "allVisivle";
	        $("#chartDiv svg g.gLabel").append(CreateLine({"stroke":"#fff", "x1":(cx + 50), "y1":"6", "x2":(cx + 50), "y2":"30", "stroke-width":"0.5"}));
	        $("#chartDiv svg g.gLabel").append(CreateText({"class":vis, "x":(cx + 60 + 24/resolution),"y":"22","fill":"#fff", "content":_data.labels.nondata.name}));
	        var circleObj = {"cx":(cx + 70), "cy":"18", "r":"6", "dataFilterValue":"0"};
	        //ズーム時の振舞
	        if(_data.labels.nondata.isVisibleZoomed) {
	        	circleObj.class = "labelCircle zoomVisible";
	        	circleObj.opacity="0";
	        }else{
	        	circleObj.class = "labelCircle";
	        	circleObj.opacity="0.8";
	        }
	        if(_data.labels.nondata.type == "white"){
	        	circleObj.strokeWidth="1";
	        	circleObj.fill="rgba(0,0,0,0)";
	        	circleObj.stroke = _data.labels.nondata.color;
	        }
	        else if(_data.labels.nondata.type == "dash"){
	        	circleObj.strokeWidth="1";
	        	circleObj.fill="rgba(0,0,0,0)";
	        	circleObj.stroke=_data.labels.nondata.color;
	        	circleObj.strokeDasharray="3";
	        }
	        else if(_data.labels.nondata.type == "mini"){
	        	circleObj.r="4";
				circleObj.strokeWidth="0";
				circleObj.fill=_data.labels.nondata.color;
	        }else{
	        	circleObj.strokeWidth="0";
				circleObj.fill=_data.labels.nondata.color;
	        }
	        //エレメント生成
	        $("#chartDiv svg g.gLabel").append(CreateCircle(circleObj));
	        
	        labelRectWidth = $("#chartDiv svg g.gLabel text:last-of-type").position().left + $("#chartDiv svg g.gLabel text:last-of-type").width() + 50;
	        $("#chartDiv svg g.gLabel").css("transform", "translate(" + ((-labelRectWidth + 80)) + "px, 0px)");
	        $("#chartDiv svg g.gLabel rect").attr("width", labelRectWidth).attr("rx", 18 * resolution);
	        //ラベルの初期表示スタイル
	        $("g.gLabel text, g.gLabel circle, g.gLabel line").attr("opacity", "0");
	        $("circle.labelCircle.zoomVisible").attr("opacity", 0.1);
	        //ズーム調整
	        $("#chartDiv svg g.gLabelZoom").css({"transform":"scale(" + resolution + ")", "transform-origin":"left top"});
	        //ラベルフィルタリング実装
	        $("circle.labelCircle:not('.zoomVisible')").on("click", DoFilterCircles);
	    }
	    MakeLabel();
        
        function draw(circleData){
        	clearChurmFlg =false;
        	
            //同じ緯度経度データの更新
            var isNew = true;
            $.each( circleData , function(index, v){
                isNew = true;
                if(ConvertEvent(v.EVENT) == 'flash'){
                    upgradeDates.push(v);
                    //店舗機変値の更新
                    $.each( allGrossData , function(index, item){
                        if(v.LATITUDE == item.LATITUDE && v.LONGITUDE == item.LONGITUDE && v.VALUE){ 
                        	item.TIME = v.TIME;
                            item.VALUE_FLASH = Number(item.VALUE_FLASH) + Number(v.VALUE);
                        }
                    });
                }else{
                    //店舗獲得値の更新
                    $.each( allGrossData , function(index, item){
                        if(v.LATITUDE == item.LATITUDE && v.LONGITUDE == item.LONGITUDE && v.GRAYOUT == '1'){ 
                            item.VALUE_WHITE = ConvertEvent(v.EVENT) == "white" ? Number(item.VALUE_WHITE) + Number(v.VALUE) : Number(item.VALUE_WHITE);
                            item.TIME = v.TIME;
                            isNew=false;
                            //console.log(item.PREFECTURES_01_NM + ":" + item.LOCATION_NAME + ":" + item.VALUE_WHITE);
                        }
                    });
                    if(v.GRAYOUT == '0') insertDates.push(v);
                    else if(isNew){
                        if(ConvertEvent(v.EVENT)=='white'){
                            v.NEW = true;
                            insertDates.push(v); //消さないデータ
                        }else if(ConvertEvent(v.EVENT)=='black'){
                            insertDates.push(v); //後から消すデータ
                        }
                    }else{
                        insertDates.push(v); //後から消すデータ
                    }
                }
            });
            
            //console.table(upgradeDates.concat(insertDates));
            
            //テキストを変更する
            jQuery.each(circleData, function(i, val) {
                arrTimeoutText.push(setTimeout(function(){
                    //semiCircleMain
                    if(_data.semiCircleMain.event.plus.indexOf(val.EVENT) > -1)
                    	$("#semiCircleMain").text(InsertComma(Number(RemoveComma($("#semiCircleMain").text())) + Number(val.VALUE)));
                    if(_data.semiCircleMain.event.minus.indexOf(val.EVENT) > -1)
                    	$("#semiCircleMain").text(InsertComma(Number(RemoveComma($("#semiCircleMain").text())) - Number(val.VALUE)));
                    //semiCircleSubの更新
                    $.each(_data.semiCircleDetail, function(ii, vv){
                        if(vv.event.plus.indexOf(val.EVENT) != -1 ){
                            $("#"+ vv.id +" tspan.total").text(InsertComma(Number(RemoveComma($("#"+ vv.id +" tspan.total").text())) + Number(val.VALUE)));
                            $("#"+ vv.id +" tspan." + val.VERTICAL_CATEGORY).text(InsertComma(Number(RemoveComma($("#"+ vv.id +" tspan." + val.VERTICAL_CATEGORY).text())) + Number(val.VALUE)));
                        }
                        if(vv.event.minus.indexOf(val.EVENT) != -1 ){
                            $("#"+ vv.id +" tspan.total").text(InsertComma(Number(RemoveComma($("#"+ vv.id +" tspan.total").text())) - Number(val.VALUE)));
                            $("#"+ vv.id +" tspan." + val.VERTICAL_CATEGORY).text(InsertComma(Number(RemoveComma($("#"+ vv.id +" tspan." + val.VERTICAL_CATEGORY).text())) - Number(val.VALUE)));
                        }
                    });
                    //ホワイトホール・ブラックホールの各キャリア合計値の更新
                    $('#'+ ConvertEvent(val.EVENT) + val.PLANET_NAME + " tspan.CarrierSum").text(InsertComma(Number(RemoveComma($('#'+ ConvertEvent(val.EVENT) + val.PLANET_NAME + " tspan.CarrierSum").text())) + Number(val.VALUE)));
                    //トピックを変更する
                    if(IsFilteredDate(val)){ //フィルタリング該当のリアルタイムデータであれば
                        if($("#gridTable tbody tr").length >= topicCount) $("#gridTable tbody tr:last-child").fadeOut(100, function() {
                          $.each($("#gridTable tbody tr"), function(i, tr){
                            if(i >= topicCount) $(tr).remove();
                          });
                        });
                        var prefe = val.PREFECTURES_01_NM == "北海道" ? val.PREFECTURES_01_NM : val.PREFECTURES_01_NM.substr(0, val.PREFECTURES_01_NM.length -1);
                        if(topicCount > 0 && ConvertEvent(val.EVENT) == "white")$('#gridTable tbody').prepend("<tr><td><div>" + new Date().getDate() + "." + _monthNames[new Date().getMonth()] + "." + new Date().getFullYear() + "</div><div>" + whatTimeIs + "</div></td><td style='color:#ffffff'><div><div>" + val["LOCATION_NAME"] + "<span>" + prefe + "</span></div><div>" + val.ITEM_NAME + "</div></div></td><td>+" + InsertComma(val.VALUE) + "</td></tr>");
                        else if(topicCount > 0 && ConvertEvent(val.EVENT) == "black") $('#gridTable tbody').prepend("<tr><td><div>" + new Date().getDate() + "." + _monthNames[new Date().getMonth()]  + "." +  new Date().getFullYear() + "</div><div>" + whatTimeIs + "</div></td><td style='color:#ffffff'><div><div>" + val["LOCATION_NAME"] + "<span>" + prefe + "</span></div><div>" + val["ITEM_NAME"] + "</div></div></td><td>-" + InsertComma(val.VALUE) + "</td></tr>");
                        else if(topicCount > 0 && ConvertEvent(val.EVENT) == "flash") $('#gridTable tbody').prepend("<tr><td><div>" + new Date().getDate() + "." + _monthNames[new Date().getMonth()]  + "." +  new Date().getFullYear() + "</div><div>" + whatTimeIs + "</div></td><td style='color:#ffffff'><div><div>" + val["LOCATION_NAME"] + "<span>" + prefe + "</span></div><div>" + val["ITEM_NAME"] + "</div></div></td><td><img class='tipsImage' src='"+ MakePath("icon/icon_upgrade.png") +"'><span>" + InsertComma(val.VALUE) + "<span></td></tr>");
                        //スライドダウンアニメーション
                        $('#gridTable tbody tr:first-child').find('td').wrapInner('<div style="display: none;" />');
                        $('#gridTable tbody tr:first-child').find('td > div').slideDown( 100 );
                        //トピックの幅のサイズ調整
                        $('#gridTable td').css({"line-height":"14px", "padding-bottom":"16px"});
                    }
                    //ホワイトホール横タイプ別獲得の更新
                    $('#'+ ConvertEvent(val.EVENT) + val.PLANET_NAME + " tspan." + val.VERTICAL_CATEGORY).text(InsertComma(Number(RemoveComma($('#'+ ConvertEvent(val.EVENT) + val.PLANET_NAME + " tspan." + val.VERTICAL_CATEGORY).text())) + Number(val.VALUE)));
                    //ランキング更新
                    if($("circle.main.showed[data-shop='" + val.LOCATION_NAME + "']").css('display') != "none"){
                        $.each(_data.rankData, function(i, v){
                            if(val.EVENT == v.event){
                                var thisItem = v.object.filter(function(i, index){
                                    if (i[v.category] == val[v.category]) return true;
                                });
                                if(thisItem.length == 1){
                                    thisItem[0].VALUE = thisItem[0].VALUE + Number(val.VALUE);
                                } 
                                else{ //フィルタリング該当であれば、新規追加する
                                    var obj={};
                                    obj[v.category] = val[v.category];
                                    obj.VALUE = Number(val.VALUE);
                                    v.object.push(obj);
                                }
                                UpdateRankSvg(v.object, v.category, (v.category + v.event));
                            }
                        });
                    }
                    
                    //都道府県累計データの更新
                    if(prefectureData.hasOwnProperty(val.EVENT)) prefectureData[val.EVENT][val.PREFECTURES_01_NM] += Number(val.VALUE);
                    
                    if(isSegmentation){
                        gJapan.selectAll("path")
                            .data(japan)
                            .transition()
                            .duration(2000)
                            .style("fill", function(d){
                                var n = prefectureData[segmentFactor][d.properties.nam_ja];
                                if(n > segmentationRange * 9) return "#B71C1C";
                                if(n > segmentationRange * 8) return "#C62828";
                                if(n > segmentationRange * 7) return "#D32F2F";
                                if(n > segmentationRange * 6) return "#E53935";
                                if(n > segmentationRange * 5) return "#F44336";
                                if(n > segmentationRange * 4) return "#EF5350";
                                if(n > segmentationRange * 3) return "#E57373";
                                if(n > segmentationRange * 2) return "#EF9A9A";
                                if(n > segmentationRange) return "#FFCDD2";
                                if(n > 0) return "#FFEBEE";
                                return "#FFFFFF";
                            })
                            .style("opacity", function(d){
                                var n = prefectureData[segmentFactor][d.properties.nam_ja];
                                if(n > segmentationRange * 9) return 1;
                                if(n > segmentationRange * 8) return 0.91;
                                if(n > segmentationRange * 7) return 0.82;
                                if(n > segmentationRange * 6) return 0.73;
                                if(n > segmentationRange * 5) return 0.64;
                                if(n > segmentationRange * 4) return 0.55;
                                if(n > segmentationRange * 3) return 0.46;
                                if(n > segmentationRange * 2) return 0.37;
                                if(n > segmentationRange) return 0.28;
                                if(n > 0) return 0.19;
                                return 0.1;
                            });
                    }
                }, ConvertEvent(val.EVENT) == "white" ? Number(val.TIME) + 3650 : Number(val.TIME) + 2150));
            });
            
            ///////////////////////////////////////////////////////////////////////
            //upgradeDates
            ///////////////////////////////////////////////////////////////////////
            gCircle.selectAll("path.upgrade")
              .data(upgradeDates).enter().append("path")
              .attr("d", "M3001 4095 c-1 -110 4 -287 11 -392 10 -173 9 -206 -7 -318 -11 -80 -16 -147 -11 -186 6 -61 0 -109 -14 -109 -4 0 -14 17 -22 38 -120 293 -188 469 -188 482 0 5 -5 10 -11 10 -13 0 -12 -8 21 -163 11 -55 20 -111 20 -125 -1 -26 -2 -25 -43 20 -24 26 -53 48 -66 50 -29 3 -53 33 -231 276 -69 94 -155 213 -192 263 -38 51 -68 96 -68 101 0 4 -4 8 -10 8 -15 0 -12 -16 5 -34 8 -8 15 -17 15 -21 0 -8 121 -210 202 -337 79 -125 182 -324 173 -337 -6 -10 33 -78 97 -170 36 -51 47 -81 31 -81 -9 0 -141 102 -272 209 -57 47 -120 100 -141 116 -20 17 -68 55 -106 86 -145 119 -242 197 -324 259 -47 35 -91 70 -98 77 -7 7 -19 13 -25 13 -7 0 6 -17 28 -37 22 -20 63 -57 90 -82 28 -25 79 -70 115 -100 36 -30 70 -59 75 -65 6 -7 24 -22 40 -35 17 -12 50 -41 75 -64 114 -104 150 -136 217 -196 73 -65 97 -96 65 -84 -18 7 -72 40 -297 183 -131 83 -278 170 -287 170 -12 0 101 -92 139 -113 12 -6 61 -39 108 -72 48 -33 94 -64 103 -70 9 -5 33 -22 53 -37 20 -16 41 -28 46 -28 5 0 16 -8 25 -19 8 -10 22 -21 29 -23 20 -7 1 -28 -25 -28 -23 0 -56 -28 -56 -47 0 -20 48 -53 150 -103 171 -83 190 -94 181 -103 -5 -5 -39 -2 -78 6 -37 9 -104 19 -148 22 -90 7 -267 31 -335 44 -25 5 -92 17 -150 26 -58 9 -129 21 -159 27 -65 12 -206 29 -286 33 l-60 3 65 -12 c36 -7 72 -15 80 -18 8 -4 33 -9 55 -12 22 -4 67 -13 100 -20 120 -28 202 -45 285 -61 47 -9 114 -23 150 -30 36 -8 84 -17 107 -20 24 -4 45 -11 49 -16 7 -12 -205 -11 -380 2 -77 5 -190 9 -251 7 l-110 -3 195 -23 c107 -12 289 -31 404 -42 115 -11 211 -22 214 -24 6 -7 -68 -14 -269 -25 -186 -10 -245 -20 -219 -36 7 -4 85 -10 174 -12 88 -2 177 -7 196 -10 34 -5 34 -6 -35 -28 -39 -12 -93 -26 -122 -30 -28 -3 -59 -12 -68 -19 -14 -10 13 -11 134 -9 83 2 219 4 301 6 111 2 150 0 150 -9 0 -6 -44 -35 -99 -62 -105 -54 -233 -130 -353 -209 -41 -27 -80 -52 -88 -56 -8 -4 -28 -16 -45 -27 -16 -11 -39 -24 -50 -30 -11 -6 -33 -19 -50 -30 -16 -11 -42 -25 -57 -31 -30 -12 -38 -29 -13 -29 8 0 41 13 72 29 143 72 329 148 339 139 2 -2 -20 -24 -49 -49 -78 -66 -149 -139 -137 -139 6 0 77 44 157 97 94 62 164 101 196 110 28 7 86 36 129 64 43 29 80 50 83 48 2 -3 -21 -33 -51 -69 -30 -35 -54 -71 -54 -80 0 -8 -15 -31 -33 -51 -125 -140 -237 -270 -261 -302 l-28 -39 51 34 c28 18 72 48 96 65 40 29 45 31 45 14 0 -11 -4 -21 -8 -23 -12 -4 -72 -128 -72 -147 0 -11 11 -4 33 20 62 70 97 114 97 122 0 5 6 7 14 4 8 -3 35 19 67 56 30 33 70 76 90 94 19 18 50 53 69 78 41 55 64 60 55 11 -4 -19 -2 -43 4 -53 6 -13 7 -32 1 -54 -8 -33 -26 -117 -50 -244 -7 -33 -10 -74 -8 -90 l4 -30 10 35 c6 21 17 35 26 35 23 0 57 33 77 75 10 19 37 67 59 107 23 40 42 75 42 79 0 4 12 33 27 66 30 67 43 62 43 -14 0 -66 17 -60 25 7 8 58 20 78 29 48 6 -23 23 -189 31 -313 3 -52 12 -140 20 -195 7 -55 16 -156 20 -224 4 -69 11 -134 16 -145 6 -13 8 129 4 377 l-5 397 26 0 c23 0 24 3 20 33 -12 70 -11 140 1 144 14 5 81 -134 150 -307 14 -36 34 -84 44 -107 11 -23 19 -48 19 -54 0 -9 3 -10 10 -3 9 9 2 48 -36 180 -16 57 -19 114 -5 114 5 0 24 -19 43 -42 18 -23 44 -54 57 -68 24 -26 150 -215 256 -385 33 -53 68 -106 78 -117 9 -12 17 -27 17 -35 0 -7 5 -13 10 -13 17 0 20 -6 -90 195 -18 33 -55 101 -82 150 -76 139 -188 374 -195 408 l-6 31 32 -23 c18 -13 34 -21 37 -18 6 6 -31 66 -92 149 -41 56 -54 88 -36 88 4 0 48 -35 98 -78 49 -42 105 -88 123 -102 18 -14 39 -31 46 -37 7 -7 21 -10 30 -7 15 6 79 -29 120 -68 20 -18 153 -122 337 -263 53 -41 109 -86 124 -100 15 -14 34 -25 43 -25 14 1 13 3 -3 15 -10 7 -35 29 -55 47 -43 41 -317 277 -386 333 -26 22 -67 56 -90 75 -23 19 -77 64 -119 98 -68 57 -89 82 -70 82 9 0 59 -31 179 -109 55 -37 108 -70 117 -76 18 -11 143 -89 186 -117 15 -10 34 -21 42 -24 8 -4 22 -13 30 -19 26 -21 132 -77 136 -72 5 5 -97 81 -201 150 -38 25 -84 56 -102 69 -17 13 -41 30 -53 38 -12 8 -59 42 -104 76 -44 33 -103 75 -131 94 -27 19 -59 42 -69 52 -20 18 -20 18 0 18 24 0 81 -21 170 -62 12 -6 30 -8 40 -6 20 4 -118 91 -238 149 -103 51 -118 60 -118 71 0 7 18 8 53 4 90 -12 102 -12 99 2 -3 16 31 12 283 -28 99 -15 234 -35 300 -44 66 -9 138 -18 160 -21 22 -3 72 -7 110 -10 68 -4 69 -4 20 6 -27 5 -65 14 -83 20 -19 6 -57 15 -85 19 -29 5 -72 13 -97 19 -25 5 -119 24 -210 41 -199 36 -240 45 -305 62 l-50 13 35 3 c19 3 157 -1 306 -8 258 -12 397 -8 349 10 -11 4 -46 10 -77 14 -39 5 -58 12 -58 21 0 17 -27 22 -205 35 -76 6 -141 13 -144 16 -19 19 75 42 302 76 42 6 77 15 77 20 0 12 -102 10 -290 -6 -170 -14 -480 -19 -480 -7 0 4 42 24 93 45 149 62 172 75 185 106 13 29 125 112 182 135 8 4 22 11 30 16 8 5 27 14 43 20 15 6 27 15 27 19 0 4 12 11 28 15 16 4 21 10 14 12 -8 3 -26 0 -40 -7 -15 -7 -40 -18 -57 -25 -16 -6 -47 -20 -68 -29 -21 -9 -46 -16 -57 -16 -10 0 -21 -4 -24 -9 -3 -4 -27 -11 -53 -14 -27 -4 -60 -9 -75 -13 -22 -5 -28 -3 -28 10 0 9 4 16 9 16 5 0 16 6 23 13 15 15 142 98 178 117 14 7 27 16 30 19 12 14 70 51 81 51 7 0 9 3 6 7 -8 7 -16 4 -147 -61 -52 -25 -102 -46 -112 -46 -9 0 -18 -6 -21 -12 -2 -7 -4 3 -3 22 1 38 7 45 81 105 104 85 119 109 39 64 -68 -38 -68 -18 0 66 35 44 62 82 60 84 -1 2 -33 -22 -71 -53 -37 -31 -83 -61 -101 -67 -19 -6 -51 -22 -71 -35 -119 -78 -169 -114 -217 -158 -35 -31 -54 -43 -54 -33 0 8 3 17 8 19 4 2 22 31 40 66 27 50 31 66 22 77 -9 11 -8 23 6 55 10 22 21 40 25 40 4 0 9 8 13 18 3 9 15 31 26 47 11 17 24 39 30 50 13 26 33 59 41 65 16 15 49 80 40 80 -5 0 -12 -9 -16 -19 -3 -11 -12 -22 -20 -25 -8 -3 -15 -12 -15 -21 0 -8 -4 -15 -8 -15 -8 0 -82 -95 -82 -105 0 -3 -8 -13 -17 -24 -10 -10 -28 -31 -40 -47 -12 -16 -36 -45 -54 -64 -18 -19 -56 -67 -86 -107 -61 -82 -69 -89 -77 -66 -9 22 1 87 29 197 17 65 21 96 14 114 -6 16 -4 60 7 133 10 71 12 114 6 125 -8 15 -11 13 -16 -13 -4 -17 -16 -41 -27 -54 -10 -12 -19 -29 -19 -38 -1 -13 -3 -13 -15 3 -11 15 -15 16 -19 5 -2 -8 -11 -36 -21 -64 -9 -27 -20 -65 -26 -82 -5 -18 -14 -33 -19 -33 -4 0 -20 30 -34 68 -20 54 -29 110 -46 292 -11 124 -24 266 -29 315 -7 80 -8 68 -10 -110z")
              .style("fill", '#81FF00')
              .attr('class', 'upgrade')
              .attr("transform", function(d) {
                var p = projection([d.LATITUDE,d.LONGITUDE]);
                p[0] = p[0] - 30;
                p[1] = p[1] - 28;
                return "translate(" + p + ")scale(0.01)";
              })
              .style("display", "none")
              .transition()
              .duration(50)
              .delay(function(d){ return Number(d.TIME) + 2150;})
              .ease("sin")
              .style("display", "inherit")
              .attr("stroke", "#81FF00") //#81FF00
              .attr("stroke-width", 100)
              .attr("stroke-opacity", 0.3)
              .attr("data-prefecture", function(d) {
                return d.PREFECTURES_01_NM;
              })
              .transition()
              .duration(75)
              .delay(function(d){ 
                return Number(d.TIME) + 2250;
              })
              .attr("opacity", 0.8)
              .transition() //animation
              .duration(50)
              .delay(function(d){ 
                return Number(d.TIME) + 2350;
              })
              .attr("transform", function(d) {
                var p = projection([d.LATITUDE,d.LONGITUDE]);
                p[0] = p[0] - 3;
                p[1] = p[1] - 3;
                return "translate(" + p + ")scale(0.001)";
              })
              .transition() //animation
              .duration(1000)
              .delay(function(d){ 
                return Number(d.TIME) + 3450;
              })
              .attr("transform", function(d) {
                var p = projection([d.LATITUDE,d.LONGITUDE]);
                p[0] = p[0] - 0.3;
                p[1] = p[1] - 0.3;
                return "translate(" + p + ")scale(0.0001)";
              })
              .attr("opacity", 0)
              .each('end',  function(d){
              	$(this).remove();
              });
            
            ///////////////////////////////////////////////////////////////////////
            //update(ホワイトホール・ブラックホールに対する元座標点の更新処理)
            ///////////////////////////////////////////////////////////////////////
            var completeCnt = 0;
            gCircle.selectAll("circle.main")
              .data(allGrossData)
              .transition()
              .delay(function(d){ return Number(d.TIME) + 3500; }) //d.TIME
              .ease("sin")
              .attr("data-white", function(d) {
                return d.VALUE_WHITE;
              })
              .attr("data-black", function(d) {
                return d.VALUE_BLACK;
              })
              .attr("data-flash", function(d) {
              	return d.VALUE_FLASH;
              })
              .each('end',  function(d){ 
              	if(d.TIME > 0){
              		ApplyCircleStyle(d, $(this));
              	}
              	completeCnt++;
              	if(completeCnt == allGrossData.length) InitializeData();
              })
            
            ///////////////////////////////////////////////////////////////////////
            //Insert
            //////////////////////////////////////////////////////////////////////
            function newInsert(ddd){
            	gCircle.selectAll("circle.insert").data(ddd).enter().append("circle").attr('class', 'insert')
                  .attr("transform", function(d) {
                    if(ConvertEvent(d.EVENT) == "black") {
                        return "translate(" + projection([d.LATITUDE,d.LONGITUDE]) + ")";
                    }else{
                        return "translate("+ (objPlanet["white"][d.PLANET_NAME].x + 12) + ", "+ (objPlanet["white"][d.PLANET_NAME].y-12) +")";
                    }
                  })
                  .style("r", 0.1 * circleRadius + "px")
                  .style("opacity", 0)
                  .style("stroke-opacity", 0)
                  .style("fill", function(d) {
                    if(ConvertEvent(d.EVENT) == "black") return "#B71C1C";
                    else if (d.GRAYOUT == '0') return "#616161";
                    else return "#ffffff";
                  })
                  .style("stroke", function(d) {
                    if(ConvertEvent(d.EVENT) == "black") return "#B71C1C";
                    else if (d.GRAYOUT == '0') return "#616161";
                    else return "#ffffff";
                  })
                  .transition() //first Animation
                  .duration(500)
                  .delay(function(d){ 
                    return Number(d.TIME);
                   })
                  .style("stroke-width", 5)
                  .style("stroke-opacity", 0.3)
                  .style("opacity", 1)
                  .style("r", 4 * circleRadius + "px")
                  .transition() //sedcond Animation
                  .duration(2000)
                  .delay(function(d){ 
                    return Number(d.TIME) + 1000;
                   }) 
                  .ease("sin")
                  .attr("transform", function(d) {
                    if(ConvertEvent(d.EVENT) == "white") {
                        return "translate(" + projection([d.LATITUDE,d.LONGITUDE]) + ")";
                    }else{
                        return "translate("+ (objPlanet["black"][d.PLANET_NAME].x + 12) + ", "+ (objPlanet["black"][d.PLANET_NAME].y-12) +")";
                    }
                  })
                  .style("fill", function(d) {
                    if(ConvertEvent(d.EVENT) == "black") return "#B71C1C";
                    if(objPlanet[ConvertEvent(d.EVENT)][d.PLANET_NAME].color == "") return "#FFF"
                    return objPlanet[ConvertEvent(d.EVENT)][d.PLANET_NAME].color;
                  })
                  .style("stroke", function(d) {
                    if(ConvertEvent(d.EVENT) == "black") return "#B71C1C";
                    return objPlanet[ConvertEvent(d.EVENT)][d.PLANET_NAME].color;
                  })
                  .transition() //thirdAnimation
                  .duration(500)
                  .delay(function(d){ 
                    return Number(d.TIME) + 3050;
                   })
                  .style("stroke-width", function(d) {
                    return ConvertEvent(d.EVENT) == "white" ? 100 : 0.1;
                  })
                  .style("r", 0.5 * circleRadius + "px")
                  .style("stroke-opacity", 0)
                  .transition() //fourth Animation
                  .duration(1000)
                  .delay(function(d){ 
                    return Number(d.TIME) + 3600;
                   })
                  .style("opacity", function(d) {
                    if(ConvertEvent(d.EVENT) == "white" && d.NEW && d.GRAYOUT=='1') return 0.8;
                    else return 0;
                  })
                  .transition() //fifth Animation
                  .duration(10)
                  .delay(function(d){ 
                    return Number(d.TIME) + 4700;
                  })
                  .style("stroke-width", "0")
                  .each('end',  function(d){
                  	$(this).remove();
                  });
            }
            newInsert(insertDates);
            
            /////////////////////////////////////////////////////////
            //獲得数テキスト
            /////////////////////////////////////////////////////////
            gCircle.selectAll("text.circleTextCnt").data(insertDates).enter().append("text")
              .attr("class", "circleTextCnt")
              .attr("dy", 10)
              .attr("transform", function(d) {
                if(ConvertEvent(d.EVENT) == "black"){
                    return "translate(0,0)";
                }
                else return "translate("+ (objPlanet["white"][d.PLANET_NAME].x + (d.VALUE.toString().length + stdMoveDeviation * 3)) + ", "+ (objPlanet["white"][d.PLANET_NAME].y + (4 + stdMoveDeviation )) +")";
                
              })
              .style("font-size", 11)
              .style("font-weight", 100)
              .attr("opacity", 0)
              .attr("fill", "#ffffff")
              .text(function(d){ 
                return d.VALUE;
               })
              .transition() //first Animation
              .duration(500)
              .delay(function(d){ 
                return Number(d.TIME);
               })
              .attr("opacity", function(d) {
                return ConvertEvent(d.EVENT) == "white" ? 0.8 : 0;
              })
              .transition() //second Animation
              .duration(2000)
              .delay(function(d){ 
                return Number(d.TIME) + 1000;
               }) 
              .ease("sin")
              .attr("transform", function(d) {
                if(ConvertEvent(d.EVENT) == "white"){
                    var p = projection([d.LATITUDE,d.LONGITUDE]);
                    p[0] = p[0] -0.5 * d.ITEM_NAME.length;
                    p[1] = p[1] + 2 + stdMoveDeviation;
                    return "translate(" + p + ")";
                }
                else return "translate(0, 0)";
              })
              .transition() //third Animation
              .duration(500)
              .delay(function(d){ 
                return Number(d.TIME) + 3050;
               }) 
              .ease("sin")
              .attr("opacity", 0)
              .style("display", "none")
              .each('end',  function(d){
				$(this).remove()
			  });
            
            /////////////////////////////////////////////////////////
            //モデル名テキスト
            /////////////////////////////////////////////////////////
                
            gCircle.selectAll("text.circleTextNm").data(insertDates ).enter().append("text")
              .attr("class", "circleTextNm")
              .attr("dy", -10)
              .attr("transform", function(d) {
                if(ConvertEvent(d.EVENT) == "black"){
                    return "translate(0,0)";
                } 
                else return "translate("+ (objPlanet["white"][d.PLANET_NAME].x - d.ITEM_NAME.length) + ", "+ (objPlanet["white"][d.PLANET_NAME].y - 4 - stdMoveDeviation) +")";
              })
              .style("font-size", 11)
              .style("font-weight", 100)
              .attr("opacity", 0)
              .attr("fill", "#ffffff")
              .text(function(d){ 
                return d.ITEM_NAME;
               })
              .transition() //first Animation
              .duration(500)
              .delay(function(d){ 
                return Number(d.TIME);
               })
              .attr("opacity", function(d) {
                return ConvertEvent(d.EVENT) == "white" ? 0.8 : 0;
              })
              .transition() //second Animation
              .duration(2000)
              .delay(function(d){ 
                return Number(d.TIME) + 1000;
               }) 
              .ease("sin")
              .attr("transform", function(d) {
                if(ConvertEvent(d.EVENT) == "white"){
                    var p = projection([d.LATITUDE,d.LONGITUDE]);
                    p[0] = p[0] - 0.5 * d.ITEM_NAME.length;
                    p[1] = p[1] - 2 - stdMoveDeviation;
                    return "translate(" + p + ")";
                }
                else return "translate(0, 0)";
              })
              .transition() //third Animation
              .duration(500)
              .delay(function(d){ 
                return Number(d.TIME) + 3050;
               }) 
              .ease("sin")
              .attr("opacity", 0)
              .style("display", "none")
              .each('end',  function(d){
				$(this).remove()
			  });
        }
        
        //データソース一覧作成
        if(_data.datasourceMenuDS != ""){
        	$.ajax({
	            type: 'GET',
	            url: MakeUrl(_data.datasourceMenuDS),
	            dataType: 'json',
	            success: function(json){
	                if(!json.data || json.data.length == 0) {
	                    successAjax = false;
	                    console.log("ajaxFail:" + MakeUrl(_data.datasourceMenuDS));
	                    return;
	                }
	                $.each(json.data, function(i,v){
	                    if(!datasourceMenu.hasOwnProperty(v.CATEGORY)) datasourceMenu[v.CATEGORY] = new Array();
	                    datasourceMenu[v.CATEGORY].push({"dataSet":v.DATASET, "description":v.DESCRIPTION});
	                    if(v.DATASET == selectedDatasource && v.CATEGORY == selectedCategory){
	                        selectedDescription = v.DESCRIPTION;
	                        selectedPrerequisite = v.PREREQUISITE;
	                    }
	                });
	                
	                //////////////////////////////////////////
	                //データソースメニュー作成
	                //////////////////////////////////////////
	                var gMenue = d3_svg.append("g").attr('class', 'gMenuGraph').attr("transform", "translate(" + w/2 + ",0)scale(" + resolution + ")");
	                $("svg g.gMenuGraph").append(CreateG({"id":"gSemicircle", "style":"transform='scale(1)'"}));
	                $("#gSemicircle").append(CreateCircle({"r":"30", "cx":"0", "cy":"0", "fill":"rgba(0, 0, 0, 0.7)"}));
	                var imgGraph = document.createElementNS("http://www.w3.org/2000/svg", 'image');
	                imgGraph.setAttributeNS(null, "x", "-9");
	                imgGraph.setAttributeNS(null,"y","6");
	                imgGraph.setAttributeNS("http://www.w3.org/1999/xlink", "href", MakePath("icon/icon_datasource.png"));
	                imgGraph.setAttributeNS(null, "id","imgMenu");
	                imgGraph.setAttributeNS(null, "class","tooltipIcon");
	                imgGraph.setAttributeNS("http://www.w3.org/1999/xlink", "title", "dataSource");
	                imgGraph.setAttributeNS(null, "width","18");
	                imgGraph.setAttributeNS(null, "height","18");
	                $("#chartDiv svg g.gMenuGraph").append(imgGraph);
	                $("g.gMenuGraph").append(CreateText({"id":"menuEscape","x":"0","y":"30","fontSize":"36","fill":"#EEEEEE","textAnchor":"middle", "class":"tooltipIcon", "content":"×", "title":"MenuClose", "style":"display:none"}));
	                //Escボタンでメニューを隠す
	                $(window).keyup(function(e){
	                    if(e.keyCode == 27 && isOpenMenu){
	                        $('#menuEscape').trigger("click");
	                        isOpenMenu = false;
	                    }
	                });
	                
	                var textGraph = document.createElementNS("http://www.w3.org/2000/svg", 'text');
	                textGraph.setAttribute("x", "0");
	                textGraph.setAttribute("y", "50");
	                textGraph.setAttribute("id", "GraphTittle");
	                textGraph.setAttribute("font-size", "20");
	                textGraph.setAttribute("fill","#ffffff");
	                textGraph.setAttribute("text-anchor","middle");
	                textGraph.textContent = selectedDatasource;
	                $("#chartDiv svg g.gMenuGraph").append(textGraph);
	                //データソースメニューの拡大倍率設定
	                menuScale = Math.floor(h / 30 / resolution);
	                var wheel = 0; 
	                function wheeled(){
	                    if(event.wheelDelta){
	                        wheel += (event.wheelDelta / 60);
	                        d3.select("#gSemicircle").attr("transform", "scale("+ menuScale +")rotate(" + wheel + ")");
	                    }
	                }
	                //グラフタイプ
	                $("g.gMenuGraph").append(CreateG({"id":"gMenuIcon1", "style":"transform:translateX(0px); display:none;"}));
	                $("#gMenuIcon1").append(CreatePath({"class":"menuIcon", "fill":"rgba(255,255,255,0.5)", "transform":"translate(-80,100)scale(0.15)", "d":"M677.6,312c-17.3,9.5-34.4,31.6-38,49.5l-6.7,32.4c0,0-4.7,26-10.5,58c-5.8,32.1-21.1,73-34.2,91.3c-13.1,18.4-37.9,43.1-55.2,55.2c-17.3,12.1-35.3,14.2-40,4.8s-12.4-15-17.1-12.4c-4.7,2.6-16.2,21.8-25.7,42.8c-9.5,21-23.1,43.6-30.4,50.5c-7.4,6.8-28.2,12.4-46.6,12.4c-18.4,0-55.9,5.5-83.7,12.4c-27.9,6.8-67.1,22.2-87.5,34.2L164.8,765c0,0-6,3.4-13.3,7.6c-7.4,4.2-4.8,13.1,5.7,20c10.5,6.8,26.3,14.9,35.2,18.1c8.9,3.2,45.6-7.9,81.8-24.8c36.3-16.8,77.4-29.2,91.8-27.6c14.4,1.6,28,19.5,30.4,40c2.4,20.5,16.2,31.6,30.9,24.7c14.7-6.9,36-24.3,47.6-39c11.6-14.7,42.7-31.8,69.5-38c26.8-6.3,60.5-23.8,75.2-39c14.7-15.2,32.6-22.5,40-16.1c7.3,6.3,9.9,23.8,5.7,39c-4.2,15.3,9.4,12.7,30.4-5.7c21-18.4,35.5-73.4,32.4-122.8c-3.2-49.4,0.3-112.4,7.6-140.8c7.3-28.4,4.4-76.9-6.7-108.5C718,320.5,695,302.6,677.6,312z", "style":"display:none; transform-origin:center center 0px;"}));
	                $("#gMenuIcon1").append(CreatePath({"class":"menuIcon", "fill":"rgba(255,255,255,0.5)", "transform":"translate(-80,100)scale(0.15)", "d":"M915.5,108.5c-11-12.6-52.8-34.3-93.3-48.5c-40.5-14.2-82.6-33.4-94.2-42.9c-11.6-9.5-31.2-9.5-43.8,0s-16.4,42.7-8.6,74.2s1.1,67.3-15.2,79.9C644.2,183.9,631,212.8,631,236c0,23.1,17,41.9,38,41.9c21,0,38.1-13.6,38.1-30.4c0-16.8,13.6-21.5,30.4-10.5c16.8,11,41.9,17,56.1,13.3c14.2-3.7,33.8-23.7,43.8-44.7c10-21,36-46.2,58-56.1C917.6,139.4,926.5,121.1,915.5,108.5z", "style":"display:none; transform-origin:center center 0px;"}));
	                $("#gMenuIcon1").append(CreatePath({"class":"menuIcon", "fill":"rgba(255,255,255,0.5)", "transform":"translate(-80,100)scale(0.15)", "d":"M160,818.3c-12.1-9.5-38.5-9.5-59,0c-20.5,9.5-27.3,31.2-15.2,48.5c12.1,17.3,14.6,44.2,5.7,60c-9,15.8-9,37,0,47.6c8.9,10.5,23,17.3,31.4,15.2c8.4-2.1,26.7-28.1,40.9-58.1c14.2-29.9,24-63.6,21.9-75.2C183.6,844.8,172.1,827.8,160,818.3z", "style":"display:none; transform-origin:center center 0px;"}));
	                $("#gMenuIcon1").append(CreatePath({"class":"menuIcon", "fill":"rgba(255,255,255,0.5)", "transform":"translate(-80,100)scale(0.15)", "d":"M294.1,804l-40,21.9l-5.7,9.5c0,0-3.8,6.8-8.6,15.2c-4.7,8.4-4.7,24.6,0,36.2c4.7,11.6,19.7,4.8,33.3-15.2c13.7-20,33.3-32.3,43.8-27.6c10.5,4.7,23.7,7.3,29.5,5.7c5.8-1.6,5.4-17.3-0.9-35.2C339.2,796.6,316.2,792,294.1,804z", "style":"display:none; transform-origin:center center 0px;"}));
	                $("#gMenuIcon1").append(CreateText({"class":"menuText map","x":"-175","y":"0","fontSize":"30","fill":"rgba(255,255,255,0.8)", "transform":"rotate(-90)", "writingMode":"tb", "textAnchor":"middle","content":"MAP"}));
	                $("g.gMenuGraph").append(CreateG({"id":"gMenuIcon2", "style":"transform:translateX(-165px); display:none;", "opacity":"0"}));
	                $("#gMenuIcon2").append(CreatePath({"class":"menuIcon", "fill":"rgba(255,255,255,0.5)", "transform":"rotate(90)translate(100, -72)scale(1.6)", "d":"M86.75,70.981V59.5c0-6.934-4.594-17.25-17.25-17.25h-10c-7.06,0-7.717-3.464-7.75-5.25V23.02C56.014,21.178,59,16.939,59,12c0-6.626-5.373-12-12-12S35,5.374,35,12c0,4.939,2.986,9.178,7.25,11.02V37c0,1.294-0.374,5.25-7.75,5.25h-10c-12.656,0-17.25,10.316-17.25,17.25v11.481C2.986,72.822,0,77.062,0,82c0,6.627,5.373,12,12,12s12-5.373,12-12c0-4.938-2.986-9.178-7.25-11.019V59.5c0-1.294,0.374-7.75,7.75-7.75h10c3.035,0,5.595-0.459,7.75-1.237v20.469C37.986,72.822,35,77.062,35,82c0,6.627,5.373,12,12,12s12-5.373,12-12c0-4.938-2.986-9.178-7.25-11.019V50.513c2.155,0.778,4.715,1.237,7.75,1.237h10c7.06,0,7.717,5.964,7.75,7.75v11.481C72.986,72.822,70,77.062,70,82c0,6.627,5.373,12,12,12s12-5.373,12-12C94,77.062,91.014,72.822,86.75,70.981z M18.923,82c0,3.823-3.101,6.923-6.923,6.923c-3.823,0-6.923-3.1-6.923-6.923s3.1-6.923,6.923-6.923C15.822,75.077,18.923,78.177,18.923,82z M40.077,12c0-3.823,3.101-6.923,6.923-6.923c3.823,0,6.923,3.1,6.923,6.923s-3.1,6.923-6.923,6.923C43.178,18.923,40.077,15.823,40.077,12z M53.923,82c0,3.823-3.1,6.923-6.923,6.923c-3.822,0-6.923-3.1-6.923-6.923s3.101-6.923,6.923-6.923C50.823,75.077,53.923,78.177,53.923,82z M82,88.923c-3.822,0-6.923-3.1-6.923-6.923s3.101-6.923,6.923-6.923c3.823,0,6.923,3.1,6.923,6.923S85.823,88.923,82,88.923z", "style":"display:none; transform-origin:center center 0px;"}));
	                $("#gMenuIcon2").append(CreateText({"class":"menuText flow","x":"-175","y":"0","fontSize":"30","fill":"rgba(255,255,255,0.8)", "transform":"rotate(-90)", "writingMode":"tb" , "style":"display:none","textAnchor":"middle","content":"FLOW"}));
	                $("g.gMenuGraph").append(CreateText({"class":"menuText menuDescription","x":"0","y":"320","fontSize":"16","fill":"#EEEEEE","textAnchor":"middle","content":selectedDescription, "style":"display:none"}));
	                $("g.gMenuGraph").append(CreateCircle({"class":"menuText graphMoveLeft","cx":"-135","cy":"172","r":"18","fill":"rgba(32,147,239,0.8)","style":"display:none"}));
	                $("g.gMenuGraph").append(CreateCircle({"class":"menuText graphMoveRight","cx":"135","cy":"172","r":"18","fill":"rgba(32,147,239,0.8)","style":"display:none"}));
	                $("g.gMenuGraph").append(CreateText({"class":"menuText graphMoveLeft","x":"-137","y":"93","fontSize":"20","fill":"#FFF","textAnchor":"middle","content":"<", "style":"display:none", "transform":"scale(1, 2)"}));
	                $("g.gMenuGraph").append(CreateText({"class":"menuText graphMoveRight","x":"137","y":"93","fontSize":"20","fill":"#FFF","textAnchor":"middle","content":">", "style":"display:none", "transform":"scale(1, 2)"}));
	                
	                //グラフ切替
	                $("g.gMenuGraph .graphMoveLeft, g.gMenuGraph .graphMoveRight").on("click", function(){
	                    d3.select("#gMenuIcon1").transition().duration(300).style("transform", "translateX(-165px)").attr("opacity", "0");
	                    d3.select("#gMenuIcon2").transition().duration(300).style("transform", "translateX(0px)").attr("opacity", "1");
	                    setTimeout(function(){
	                        document.location.href = "http://poc.rtr.bb.local/group/tomahawk/-533";
	                    }, 1000);
	                });
	                
	                var baseAngle = 50;
	                var baseLength = h * 0.75;
	                $.each(datasourceMenu, function(i,v){
	                    $("g.gMenuGraph #gSemicircle").append(CreateText({"content":i, "transform":"rotate(" + (baseAngle - 2.5 * (v.length - 1)) + ")scale(" + 1/menuScale + ")", "class":"menuText menuCategory","x":"0","y":baseLength,"fontSize":"20","fill":"#EEEEEE","textAnchor":"end", "writingMode":"tb" , "style":"display:none"}));
	                    $("g.gMenuGraph #gSemicircle").append(CreatePath({"class":"menuArc","d":CreateArcPath(0,0,baseLength,(baseAngle - 5 * (v.length - 1) + 90),(baseAngle + 90)),"fill":"none","stroke":"#EEEEEE", "strokeOpacity":"0.4", "strokeWidth":"3", "transform":"scale(" + 1/menuScale + ")", "style":"display:none"}));
	                    for(var cnt = 0; cnt < v.length; cnt++){
	                        $("g.gMenuGraph #gSemicircle").append(CreateText({"category":i, "content":v[cnt].dataSet, "description":v[cnt].description, "transform":"rotate(" + (baseAngle - 5 * cnt) + ")scale(" + 1/menuScale + ")", "class":"menuText dataSetMenu","x":"0","y":(baseLength + 10),"fontSize":"16","fill":"#EEEEEE","textAnchor":"start", "writingMode":"tb" , "style":"display:none"}));
	                    }
	                    baseAngle = baseAngle - 5 * (v.length + 1);
	                });

	                //データソース切替
	                $("#imgMenu").on("click", function(){
	                    if(!isOpenMenu){
	                        d3.select("#gSemicircle").transition().duration(300).attr("transform", "scale("+ menuScale +")rotate(" + wheel + ")");
	                        if(!isHideMenu) $('#windowCloseImage').trigger("click");
	                        isOpenMenu = true;
	                        $("#imgMenu").css("display", "none");
	                        $("#menuEscape, #gMenuIcon1, #gMenuIcon2").css("display", "block");
	                        $("#GraphTittle").text("close").attr("font-size", "16");
	                        //メニューを作成する
	                        setTimeout(function(){
	                            $(".menuText, path.menuArc, path.menuIcon").css("display", " block");
	                            //選択中のデータセットは色を変更する
	                            $("text.dataSetMenu[data-category='" + selectedCategory + "']:contains('" + selectedDatasource + "')").attr("fill", "#2196F3").attr('class', function(index, classNames) {
	                                return classNames + ' selectedDatasource';
	                            });
	                            //説明文の表示
	                            $(".dataSetMenu:not(.selectedDatasource)").on("mouseover", function(){
	                                $(".menuDescription").css(lightAnimationRemoveCss);
	                                $(".menuDescription").text($(this).attr("data-description"));
	                                $(".menuText").css(lightAnimationRemoveCss);
	                                $(this).css(lightAnimationTextCss);
	                                $(".menuDescription").css(lightAnimationTextCss);
	                            });
	                            d3.selectAll("#gSemicircle, .menuText, path.menuIcon").call(d3.behavior.zoom().on("zoom", wheeled));
	                        }, 150);
	                    }
	                });
	                    
	                $("#menuEscape").on("click", function(){
	                    d3.select("#gSemicircle").transition().duration(300).attr("transform", "scale(1)"); //.attr("fill", "rgba(0, 0, 0, 0.5)")
	                    d3.select("#gSemicircle path").transition().duration(150).attr("fill", "rgba(0, 0, 0, 0.5)");
	                    isOpenMenu = false;
	                    $(".menuText, path.menuArc, path.menuIcon").css("display", "none");
	                    $("#imgMenu").css("display", "block");
	                    $("#menuEscape").css("display", "none");
	                    $("#GraphTittle").text(selectedDatasource).attr("font-size", "20");
	                });
	                //インフォテーブル
	                $("div#topicDiv").append('<div id="datasourceInfoDiv" style="display:none;"><div class="subTittle">DataSource</div><div class="divSubTittle">' + selectedDatasource + '</div><div class="infoDiv">' + selectedDescription + '</div><div class="PrerequisiteDiv">' + selectedPrerequisite + '</div></div>');
	            }
	        });
        }
        
        //トピック
        $("div#topicDiv").append('<div id="gridTopicDiv"><div class="subTittle">Topic</div><div id="topicChartDiv" style="width: 100%;height: 200px;"></div><table id="gridTable"><tbody><tr><td></td><td></td><td></td></tr></tbody></table></div>');
        
        var graphSettings = {
            "theme": "light",
            "type": "serial",
            "marginBottom": 0,
            "marginLeft": 20,
            "marginRight": 20,
            "addClassNames": true,
            "dataProvider": "",
            "pathToImages": MakePath("icon/"),
            "valueAxes": [{
                "id": "v1",
                "axisAlpha": 0.1,
                "offset":0,
                "color":"rgba(256,256,256,0.5)",
                "ignoreAxisWidth":true,
                "autoGridCount":false,
                "gridCount": 3,
                "gridColor":"rgba(256,256,256,0.9)",
                "balloon": {
                  "enabled": false,
                },
            }],
            "graphs":[],
            "balloon": {
              "adjustBorderColor": true,
              "color": "#E0E0E0",
              "borderAlpha":0,
              "fillAlpha":0,
              "shadowAlpha":0
            },
            "chartScrollbar": {
                "graph": "g1",
                "oppositeAxis": false,
                "offset": 30,
                "scrollbarHeight": 30,
                "backgroundAlpha": 0,
                "selectedBackgroundAlpha": 0.1,
                "selectedBackgroundColor": "#888888",
                "graphFillAlpha": 0,
                "graphLineAlpha": 0.5,
                "selectedGraphFillAlpha": 0,
                "selectedGraphLineAlpha": 1,
                "selectedGraphLineColor":"#616161",
                "autoGridCount": true,
                "color": "#AAAAAA"
            },
            "chartCursor": {
                "valueLineEnabled": true,
                "valueLineBalloonEnabled": true,
                "cursorAlpha": 0.2,
                "valueLineAlpha": 0.2,
                "categoryBalloonColor":"#FAFAFA",
                "cursorColor":"#FAFAFA",
                "color":"#212121",
                "categoryBalloonAlpha":0.8
            },
            "categoryField": _data.topic.category,
            "categoryAxis": {
                "parseDates": false,
                "dashLength": 1,
                "color":"rgba(256,256,256,0.5)",
                "minorGridEnabled": false,
                "gridCount": "3",
            },
            "export": {
                "enabled": true
            },
            "listeners": [{
              "event": "drawn",
              "method": DrawCharts
            }],
        };
        
        $.each(_data.topic.value, function(i, v){
            graphSettings.graphs.push({
                "id": "g"+(i+1),
                "balloonText": "[[title]]</br><span><b style='font-size: 18px; color:#FAFAFA; padding-left: 3px; padding-right: 3px;'>[[value]]</b></span>",
                "bulletField": "bullet",
                "classNameField": "bulletClass",
                "useLineColorForBulletBorder": false,
                "hideBulletsCount": 50,
                "title": v.title,
                "lineThickness": 2,
                "lineColor": v.color == "" ? "#FFF" : v.color,
                "valueField": v.val,
                "type":"smoothedLine"
            });
        });
        topicChart = AmCharts.makeChart("topicChartDiv", graphSettings);
        
        //ランキングテーブルHTML作成
        var rankingHtml = new StringBuffer('<div id="rankingDiv" style="display:none;"><div class="subTittle">Ranking<span id="spanRankingCategory">'+ rankCategoryNameList[rankCategoryIndex] +' ▼</span></div>');
        $.each(_data.rankData, function(i, v){
            if(v.title == "") rankingHtml.append('<div class="rankTableSvgDiv '+ (v.category + v.event) +' '+v.categoryName+'"></div>');
            else rankingHtml.append('<div class="rankingSubTittle" style="width:'+ (v.title.length * 7 + 24) +'px">'+ v.title +'</div><div class="rankTableSvgDiv '+ (v.category + v.event) +' '+v.categoryName+'"></div>');
        });
        rankingHtml.append('</div>');
        $("div#topicDiv").append(rankingHtml.toString());
        $("div.rankTableSvgDiv").css("display", "none");
        $("#spanRankingCategory").on('click', function(){
            rankCategoryIndex = (rankCategoryIndex + 1) % (rankCategoryNameList.length);
            $(this).text(rankCategoryNameList[rankCategoryIndex] + " ▼");
            $("div.rankTableDiv").css("display", "none");
            $("div.rankTableDiv."+rankCategoryNameList[rankCategoryIndex]).css("display", "block");
            $("div.rankTableSvgDiv").css("display", "none");
            $("div.rankTableSvgDiv."+rankCategoryNameList[rankCategoryIndex]).css("display", "block");
        });
        
        //フィルタリングDOM作成
        $("div#topicDiv").append('<div id="filterDiv" style="display:none;"><div class="subTittle">Filter<span id="spanFilterCategory"></span></div><div><input type="text" placeholder="search…" id="searchFilterItem"></div><div class="divFilterItemList" style="overflow-x: hidden; overflow-y: scroll;"></div><div class="divSelectedFilterItem"></div></div>');
        
        //削除
        $.each(_data.filter, function(i, v){
            $("div.divFilterItemList").append("<ul id='ul"+ v.id +"' style='display:none;'></ul>");
        });
        
        $("#spanFilterCategory").text(_data.filter[0].name + "▼");
        $("#ul" + _data.filter[0].id).css("display", "block");
        $("#spanFilterCategory").on("click", function(){
            filterCategoryIndex = (filterCategoryIndex + 1) % _data.filter.length;
            $("#spanFilterCategory").text(_data.filter[filterCategoryIndex].name + "▼");
            $(".divFilterItemList ul").css("display", "none");
            $("#ul" + _data.filter[filterCategoryIndex].id).css("display", "block");
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
        
        //トピック表示件数を調整する
        topicCount = Math.floor(($("#sumaryDiv").position().top - $("#gridTable").position().top)/ _topicRowHeight);
        topicCount = topicCount < 0 ? 1 : topicCount;
        
        //右側パネル操作アイコン作成
        $("div.box").append("<div id='manueDiv'>");
        $("#manueDiv").width(w * 0.25).height(105 * resolution);

        // SVG要素生成
        d3.select("#manueDiv")
          .append("svg")
          .attr("width", w * 0.25)
          .attr("height", 105 * resolution)
          .attr("version", "1.1")
          .attr("xmlns", "http://www.w3.org/2000/svg");

        //日付の設定
        $("#manueDiv svg").append(CreateG({"class":"gTimePos", "style":"transform:translate(" + (w * 0.25 - 12)  + "px, 0px);"}));
        $("#manueDiv svg g.gTimePos").append(CreateG({"class":"gTime", "style":"transform:scale(" + resolution + "); transform-origin:right top;"}));
        $("#manueDiv svg g.gTime").append(CreateText({"x":"0", "y":"24", "fill":"#ffffff", "class":"textUpper", "textAnchor":"end"}));

        //曜日作成
        var textWeekday = document.createElementNS("http://www.w3.org/2000/svg", 'tspan');
        textWeekday.textContent = _weekNames[new Date().getDay()];
        $("#manueDiv svg g.gTime .textUpper").append(textWeekday);

        //年作成
        var textYear = document.createElementNS("http://www.w3.org/2000/svg", 'tspan');
        textYear.setAttribute("dx", "20");
        textYear.textContent = new Date().getFullYear();
        $("#manueDiv svg g.gTime .textUpper").append(textYear);

        //場所作成
        var textLocation = document.createElementNS("http://www.w3.org/2000/svg", 'tspan');
        textLocation.setAttribute("dx", "20");
        textLocation.textContent = "Tokyo";
        $("#manueDiv svg g.gTime .textUpper").append(textLocation);

        $("#manueDiv svg g.gTime").append(CreateText({"x":"0", "y":"48", "textAnchor":"end", "fontSize":"20", "fill":"#ffffff", "class":"textBotom"}));

        //日作成
        var textWeekday = document.createElementNS("http://www.w3.org/2000/svg", 'tspan');
        textWeekday.textContent = new Date().getDate();
        $("#manueDiv svg g.gTime .textBotom").append(textWeekday);

        //月作成
        var textYear = document.createElementNS("http://www.w3.org/2000/svg", 'tspan');
        textYear.setAttribute("dx", "20");
        textYear.textContent =  _monthNames[new Date().getMonth()] + ".";
        $("#manueDiv svg g.gTime .textBotom").append(textYear);

        //時間作成
        var textLocation = document.createElementNS("http://www.w3.org/2000/svg", 'tspan');
        textLocation.setAttribute("dx", "20");
        textLocation.setAttribute("id", "hourMinutes");
        textLocation.textContent = new Date().getHours() + ':' + ('0'+new Date().getMinutes()).slice(-2);
        $("#manueDiv svg g.gTime .textBotom").append(textLocation);

        $("#manueDiv svg").append(CreateG({"class":"gIconPos"}));
        $("#manueDiv svg g.gIconPos").append(CreateG({"class":"gIcon"}));

        var circleIconInfo = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
        circleIconInfo.setAttribute("cx", "0");
        circleIconInfo.setAttribute("cy", "16");
        circleIconInfo.setAttribute("r", "16");
        circleIconInfo.setAttribute("fill","rgba(0,0,0,0.5)");
        circleIconInfo.setAttributeNS("http://www.w3.org/1999/xlink", "title", "info");
        circleIconInfo.setAttribute("class","circleIconInfo tooltipIcon");
        $("#manueDiv svg g.gIcon").append(circleIconInfo);
        
        var circleIconTopic = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
        circleIconTopic.setAttribute("cx", "40");
        circleIconTopic.setAttribute("cy", "16");
        circleIconTopic.setAttribute("r", "16");
        circleIconTopic.setAttribute("fill","rgba(0,0,0,0.5)");
        circleIconTopic.setAttributeNS("http://www.w3.org/1999/xlink", "title", "Topic");
        circleIconTopic.setAttribute("class","circleIconTopic tooltipIcon");
        $("#manueDiv svg g.gIcon").append(circleIconTopic);

        var circleIconRanking = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
        circleIconRanking.setAttribute("cx", "80");
        circleIconRanking.setAttribute("cy", "16");
        circleIconRanking.setAttribute("r", "16");
        circleIconRanking.setAttribute("fill","rgba(0,0,0,0.5)");
        circleIconRanking.setAttributeNS("http://www.w3.org/1999/xlink", "title", "ranking");
        circleIconRanking.setAttribute("class","circleIconRanking tooltipIcon");
        $("#manueDiv svg g.gIcon").append(circleIconRanking);

        var circleIconFilter = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
        circleIconFilter.setAttribute("cx", "120");
        circleIconFilter.setAttribute("cy", "16");
        circleIconFilter.setAttribute("r", "16");
        circleIconFilter.setAttribute("fill","rgba(0,0,0,0.5)");
        circleIconFilter.setAttributeNS("http://www.w3.org/1999/xlink", "title", "filter");
        circleIconFilter.setAttribute("class","circleIconFilter tooltipIcon");
        $("#manueDiv svg g.gIcon").append(circleIconFilter);

        var circleIconClose = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
        circleIconClose.setAttribute("cx", "170");
        circleIconClose.setAttribute("cy", "16");
        circleIconClose.setAttribute("id", "windowClose");
        circleIconClose.setAttribute("r", "16");
        circleIconClose.setAttribute("fill","rgba(0,0,0,0.5)");
        circleIconClose.setAttributeNS("http://www.w3.org/1999/xlink", "title", "windowClose");
        circleIconClose.setAttribute("class","circleIconClose tooltipIcon");
        $("#manueDiv svg g.gIcon").append(circleIconClose);

        var iconSepareteLine = document.createElementNS("http://www.w3.org/2000/svg", 'line');
        iconSepareteLine.setAttribute("stroke", "#fff");
        iconSepareteLine.setAttribute("x1", "145");
        iconSepareteLine.setAttribute("y1", "0");
        iconSepareteLine.setAttribute("x2", "145");
        iconSepareteLine.setAttribute("y2", "32");
        iconSepareteLine.setAttribute("stroke-width", "0.5");
        $("#manueDiv svg g.gIcon").append(iconSepareteLine);

        var imgInfo = document.createElementNS("http://www.w3.org/2000/svg", 'image');
        imgInfo.setAttributeNS(null, "x", "-8");
        imgInfo.setAttributeNS(null, "y", "8");
        imgInfo.setAttributeNS(null, "id", "iconInfo");
        imgInfo.setAttributeNS(null, "opacity", "0.5");
        imgInfo.setAttributeNS(null, "class", "active tooltipIcon");
        imgInfo.setAttributeNS("http://www.w3.org/1999/xlink", "title", "info");
        imgInfo.setAttributeNS("http://www.w3.org/1999/xlink", "href", MakePath("icon/icon_info.png"));
        imgInfo.setAttributeNS(null, "width","16");
        imgInfo.setAttributeNS(null, "height","16");
        $("#manueDiv svg g.gIcon").append(imgInfo);
        
        $("#manueDiv svg g.gIcon").append(CreateG({id:"iconTopic", class:"active tooltipIcon"}));
        $("#iconTopic").append(CreateCircle({cx:"33", cy:"10", r:"2", fill:"white","class":"tooltipIcon", "title":"Topic"}));
        $("#iconTopic").append(CreateCircle({cx:"33", cy:"16", r:"2", fill:"white","class":"tooltipIcon", "title":"Topic"}));
        $("#iconTopic").append(CreateCircle({cx:"33", cy:"22", r:"2", fill:"white","class":"tooltipIcon", "title":"Topic"}));
        $("#iconTopic").append(CreateLine({x1:"38", x2:"50", y1:"10", y2:"10", stroke:"white", strokeWidth:"2","class":"tooltipIcon", "title":"Topic"}));
        $("#iconTopic").append(CreateLine({x1:"38", x2:"50", y1:"16", y2:"16", stroke:"white", strokeWidth:"2","class":"tooltipIcon", "title":"Topic"}));
        $("#iconTopic").append(CreateLine({x1:"38", x2:"50", y1:"22", y2:"22", stroke:"white", strokeWidth:"2","class":"tooltipIcon", "title":"Topic"}));
        
        var pathRanking = document.createElementNS("http://www.w3.org/2000/svg", 'path');
        pathRanking.setAttribute("transform", "translate(69.5,5)scale(0.042)");
        pathRanking.setAttribute("fill", "rgba(256,256,256,0.5)");
        pathRanking.setAttribute("id", "iconRanking");
        pathRanking.setAttribute("class", "active tooltipIcon");
        pathRanking.setAttributeNS("http://www.w3.org/1999/xlink", "title", "ranking");
        pathRanking.setAttribute("d", "M512,180.219c0-21.484-17.422-38.891-38.906-38.891c-21.469,0-38.891,17.406-38.891,38.891   c0,10.5,4.172,20,10.938,27c-26.453,54.781-77.016,73.891-116.203,56.578c-34.906-15.422-47.781-59.547-52.141-93.734   c14.219-7.5,23.922-22.406,23.922-39.594c0-24.719-20.016-44.734-44.719-44.734c-24.719,0-44.734,20.016-44.734,44.734   c0,17.188,9.703,32.094,23.938,39.594c-4.359,34.188-17.25,78.313-52.141,93.734C143.875,281.109,93.328,262,66.859,207.219   c6.75-7,10.938-16.5,10.938-27c0-21.484-17.422-38.891-38.906-38.891S0,158.734,0,180.219c0,19.766,14.734,36.031,33.813,38.531   l55.75,207.516h332.875l55.75-207.516C497.25,216.25,512,199.984,512,180.219z");
        $("#manueDiv svg g.gIcon").append(pathRanking);

        var imgFilter = document.createElementNS("http://www.w3.org/2000/svg", 'image');
        imgFilter.setAttributeNS(null, "x", "112");
        imgFilter.setAttributeNS(null, "y", "8");
        imgFilter.setAttributeNS(null, "id", "iconFilter");
        imgFilter.setAttributeNS(null, "class", "active tooltipIcon");
        imgFilter.setAttributeNS(null, "opacity", "0.5");
        imgFilter.setAttributeNS("http://www.w3.org/1999/xlink", "title", "filter");
        imgFilter.setAttributeNS("http://www.w3.org/1999/xlink", "href", MakePath("icon/icon_filter.png"));
        imgFilter.setAttributeNS(null, "width","16");
        imgFilter.setAttributeNS(null, "height","16");
        $("#manueDiv svg g.gIcon").append(imgFilter);

        //アイコン群の位置調整
        $("#manueDiv svg g.gIcon").css({"transform":"scale(" + resolution + ")", "transform-origin":"right top"});
        $("#manueDiv svg g.gIconPos").css({"transform":"translate(" + ($("#manueDiv").width() - $("#manueDiv svg g.gIconPos").get(0).getBBox().width ) + "px, " + labelPositionY + "px)", "transform-origin":"right top"});

        //フィルタクローズイベント付与
        $(".circleIconInfo, #iconInfo").on('click', function(){
            if(!isVisibleMode) return;
            $("#rankingDiv, #filterDiv, #gridTopicDiv").css("display", "none");
            $("#datasourceInfoDiv").css("display", "inherit");
            
            $("#iconFilter, #iconTopic").attr("opacity", 0.3);
            $("#iconRanking").attr("fill", "rgba(256,256,256,0.3)");
            $("#iconInfo").attr("opacity", 1);
            selectedIcon = "info";
        });
        $(".circleIconTopic, #iconTopic").on('click', function(){
            if(!isVisibleMode) return;
            $("#rankingDiv, #filterDiv, #datasourceInfoDiv").css("display", "none");
            $("#gridTopicDiv").css("display", "inherit");
            
            $("#iconFilter, #iconInfo").attr("opacity", 0.3);
            $("#iconRanking").attr("fill", "rgba(256,256,256,0.3)");
            $("#iconTopic").attr("opacity", 1);
            selectedIcon = "info";
        });
        $(".circleIconFilter, #iconFilter").on('click', function(){
        	if(!isVisibleMode) return;
            $("#rankingDiv, #datasourceInfoDiv, #gridTopicDiv").css("display", "none");
            $("#filterDiv").css("display", "inherit");
            
            $("#iconFilter").attr("opacity", 1);
            $("#iconRanking").attr("fill", "rgba(256,256,256,0.3)");
            $("#iconInfo, #iconTopic").attr("opacity", 0.3);
            selectedIcon = "filter";
            
            $(".divSelectedFilterItem").height($("#sumaryDiv").position().top - $(".divSelectedFilterItem").position().top - 36);
        });
        $(".circleIconRanking, #iconRanking").on('click', function(){
            if(!isVisibleMode) return;
            $("#rankingDiv").css("display", "inherit");
            $("div.rankTableDiv."+rankCategoryNameList[rankCategoryIndex]).css("display", "block");
            $("div.rankTableSvgDiv."+rankCategoryNameList[rankCategoryIndex]).css("display", "block");
            $("#datasourceInfoDiv, #gridTopicDiv, #filterDiv").css("display", "none");
            
            $("#iconRanking").attr("fill", "rgba(256,256,256,1)");
            $("#iconInfo, #iconTopic, #iconFilter").attr("opacity", 0.3);
            selectedIcon = "ranking";
        });

        var imgClose = document.createElementNS("http://www.w3.org/2000/svg", 'image');
        imgClose.setAttributeNS(null, "x", "162");
        imgClose.setAttributeNS(null, "y", "8");
        imgClose.setAttributeNS(null, "class", "active tooltipIcon");
        imgClose.setAttribute("id", "windowCloseImage");
        imgClose.setAttributeNS("http://www.w3.org/1999/xlink", "href", MakePath("icon/icon_close.png"));
        imgClose.setAttributeNS("http://www.w3.org/1999/xlink", "title", "windowClose");
        imgClose.setAttributeNS(null, "width","16");
        imgClose.setAttributeNS(null, "height","16");
        $("#manueDiv svg g.gIcon").append(imgClose);
        //詳細ウィンドウのクローズイベント付与
        var isHideMenu = false;
        $("#windowCloseImage, #windowClose").on('click', function(){
            if(isHideMenu){
                 $("#topicDiv").animate({ 
                    right: "0px",opacity: 1
                 }, 300 );
                 $("#windowCloseImage").css("transform", "scaleX(1)");
                 isHideMenu = false;
            }else{
                $("#topicDiv").animate({ 
                right: (Number($("#topicDiv").outerWidth(true)) * -1),opacity: 0.5
                 }, 300 );
                 $("#windowCloseImage").css("transform", "scaleX(-1)translateX(-340px)");
                 isHideMenu = true;
            }
        });
        
        //初期データの描画 ajaxでjson読込
        function MakeInitGraph(dataUrl){
        	tooltip = d3.select("body").select("#tooltip");
            tooltipIcon = d3.select("body").select("#tooltipIcon");
            $.ajax({
                type: 'GET',
                url: MakeUrl(dataUrl),
                dataType: 'json',
                success: function(json){
                    allGrossData = json.data;
                    //地図上の点の作成
                    if(allGrossData || allGrossData.length > 0){
                        allGrossData = allGrossData.filter(function(item, index){
                                if (item['LATITUDE'] != "" && item['LONGITUDE'] != "") return true;
                            });
                        $.each(allGrossData, function(index, val){
                            //都道府県累計値の設定
                            $.each(_data.event, function(i, v){
                                if(val.hasOwnProperty(v.valueItem) && prefectureData.hasOwnProperty(v.name)) prefectureData[v.name][val.PREFECTURES_01_NM] += Number(val[v.valueItem]);
                            });
                            val.EVENT = "1";
                            val.GRAYOUT = "1";
                        });
                        
                        //初期表示座標点作成
                        gCircle.selectAll("circle.main")
                          .data(allGrossData).enter().append("circle")
                          .attr("class", "main showed")
                          .attr({
                          	"transform": function(d) {return "translate(" + projection([d.LATITUDE,d.LONGITUDE]) + ")";},
                          	"data-shop": function(d) {return d.LOCATION_NAME;},
                          	"data-prefecture": function(d) {return d.PREFECTURES_01_NM;},
                          	"data-filter1": function(d) {return d.LOCATION_FILTER1;},
                          	"data-filter2": function(d) {return d.LOCATION_FILTER2;},
                          	"data-filter3": function(d) {return d.LOCATION_FILTER3;},
                          	"data-white": function(d) {return d.VALUE_WHITE;},
                          	"data-black": function(d) {return d.VALUE_BLACK;},
                          	"data-flash": function(d) {return d.VALUE_FLASH;},
                          })
                          .transition() //animation
                          .duration(1000)
                          .attr('opacity', function(d){ 
                            if(isZoomedPrefectures == '' && Number(d.VALUE_WHITE) > 0){
                                return 0.8;
                            }else{
                                return d.PREFECTURES_01_NM == isZoomedPrefectures ? "0.8" : "0.2";
                            }
                          })
                          .each('end', function(d){
                          	ApplyCircleStyle(d, $(this));
                          });

                        //座標点にイベントを付加する
                        AddEventCircle();
                        //画像アイコンのツールチップ
                        $(".tooltipIcon")
                        .on("mouseover", function(d){
                            tooltipIcon.html(
                                "<div id='tooltipIconDiv'>" + d.target.attributes["title"].value + "</div>"
                            );
                            tooltipIcon.style("visibility", "visible").transition().duration(300).delay(1000).style("opacity", "1");
                        })
                        .on("mousemove", function(d){return tooltipIcon.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
                        .on("mouseout", function(d){ tooltipIcon.style("opacity", "0").style("visibility", "hidden");});
                        //更新前のフィルタリング反映
                        if($("div.divSelectedFilterItem span").length > 0)  DoFilterMap();
                    }else{
                        $("#loadingDiv span").text("Communication error. Auto Reload after 3 seconds.");
                        setTimeout(function(){
                            location.reload();
                        }, 3000);
                    }
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                	console.log("ajaxFail:" + MakeUrl(dataUrl));
		             successAjax = false;
		        },
                complete: function(){
                	d3.select("text.historyItem tspan.blinking").transition()
                        .duration(1000)
                        .attr('opacity', "0")
                        .transition()
                        .delay(1000)
                        .style("display", "none");
                    //Loading削除
                    HideLoading();
                    
                    if(_data.history[selectedHistoryIndex].realtime){
                    	GetThisData();
        				readData();
                    }
                }
            });
        }
        MakeInitGraph(_data.history[0].url_point);
        
        //タイムコントローラ表示
        $("rect.switchDataMesh, text.switchDataMesh").on("click", function(){
            if(isOpenTimeControler){
                d3.select("g.gHistoryAnime").transition().duration(300).ease("sin").style("transform", "scaleY(0.01)").style("opacity", 0);
                isOpenTimeControler = false;
            }else{
                d3.select("g.gHistoryAnime").transition().duration(300).ease("sin").style("transform", "scaleY(1)").style("opacity", 1);
                isOpenTimeControler = true;
            }
        });
        
        //対象データセット切り替え
        $("text.historyItemCircle").on("click", function(i, v){
            //データ取得処理の中止
            gCircle.selectAll("path.upgrade").transition();
            gCircle.selectAll("g.circles circle").transition();
            gCircle.selectAll("text.circleTextNm").transition();
            gCircle.selectAll("text.circleTextCnt").transition();
            
            //全タイムアウト処理の中断
            $.each(arrTimeoutText, function(ii, vv){
                clearTimeout(vv);
            });
            arrTimeoutText = new Array();
            clearTimeout(timeoutClear);
            clearTimeout(timeoutThis);
            clearInterval(interval);
            
            //ツールチップ表示用
            selectedHistory = $(this).next().text();
            
            //更新対象テキストのクリア
            d3.selectAll(".historyChange")
                .transition()
                .duration(1000)
                .attr('opacity', "0")
                .each('end',  function(d){ 
                    //$(this).text("0");
                    d3.select(this)
                        .transition()
                        .duration(3000)
                        .attr('opacity', "1");
                });
            
            //Loading表示
            $(this).next().append($("text.historyItem tspan.blinking"));
            
            //選択状態グラデーション
            $("g.gHistoryAnime text").css("text-shadow", "");
            $(this).css("text-shadow", "rgb(255, 255, 255) 0px 0px 5px,  rgb(255, 255, 255) 0px 0px 10px,  rgb(255, 255, 255) 0px 0px 15px,  rgb(255, 255, 255) 0px 0px 20px,  rgb(255, 255, 255) 0px 0px 25px,  rgb(255, 255, 255) 0px 0px 30px");
            $(this).next().css("text-shadow", "rgb(255, 255, 255) 0px 0px 5px,  rgb(255, 255, 255) 0px 0px 10px,  rgb(255, 255, 255) 0px 0px 15px,  rgb(255, 255, 255) 0px 0px 20px,  rgb(255, 255, 255) 0px 0px 25px,  rgb(255, 255, 255) 0px 0px 30px");
            //Loading文言の削除
            d3.select(".blinking").style("display", "block")
                .transition()
                .duration(1000)
                .attr('opacity', "1");
            
            //トピックの削除
            $("#gridTable tbody").children().each(function(i, v){
                $(v).remove();
            });
            
            //自動循環の停止
            if(isAutoPlay){
            	$("#gAutoPlay").trigger("click");
            }
            
            //フィルタリング解除
            filterValue = "";
            isLabelOpen = false;
            
            //ラベル再作成
             d3.selectAll(".gLabelPos")
                .transition()
                .duration(1000)
                .attr('opacity', "0")
                .each('end',  function(d){ 
                    $(this).remove();
                    MakeLabelObject();
                    MakeLabel();
                });
                
            //ツールチップ削除
            if(tooltip.style("visibility")=="visible"){
                if (jqxhr) jqxhr.abort();
                clearTimeout(timerMiniGraph);
                $("#gToolCircle").css("display", "none" );
                $("#toolTipCircle").removeAttr("id");
                tooltip.style("visibility", "hidden");
                tooltipIcon.style("visibility", "hidden");
            }
            //選択されている時間軸
            selectedHistoryIndex = $('text.historyItemCircle').index(this);
            d3_svg.selectAll("circle.main")
                .transition() //animation
                .duration(1000)
                .attr('opacity', "0");
                
            setTimeout(function(){
                InitializeData();
                
                gCircle.selectAll("text.circleTextNm").remove();
                gCircle.selectAll("text.circleTextCnt").remove();
                d3_svg.selectAll("g.circles circle").remove();
                $("path.upgrade").remove();
                
                MakeInitGraph(_data.history[selectedHistoryIndex].url_point);
                
                //惑星の数値作成
                GetPlanet();
                //画面下半円サマリパネル作成
                GetSemiCirclePanel();
                //ランキング
                DoFilterRank();
                //トピックグラフ
                UpdateTopicChart(true);
            }, 1000);
        });
        
        //svgへのキャリア会社名テキスト挿入
        $.each(objPlanet, function(i,v){
            $.each(v, function(ii,vv){
                $("svg g.circles").append(CreateText({"x":vv.x ,"y":vv.y, "id":(i+ii), "fill":"#fff",}));
                $("#" + (i+ii)).append(CreateTspan({"x":vv.x + 12 ,"y":vv.y -36, "content":vv.name, "textAnchor":"middle"}));
                $("#" + (i+ii)).append(CreateTspan({"x":vv.x + 12 ,"y":vv.y + 20, "class":"CarrierSum historyChange HiddenInfo", "opacity":"0", "content":0, "textAnchor":"middle"}));
                if(i == 'white'){
                    //ホワイトホール挿入
                    $("svg g.circles").append(CreateG({"id":("Whitehool" + ii), "fill":"#fff", "transform":("translate("+ (vv.x - 3 ) +", "+  (vv.y + 3) +") scale(0.01,-0.01)")}));
                    $("#" + "Whitehool" + ii).append(CreatePath({"d":"M1295 2939 c-151 -22 -341 -85 -475 -157 -443 -238 -744 -711 -762 -1197 l-3 -80 137 -3 136 -3 6 58 c22 203 64 356 138 494 169 317 482 542 842 604 49 8 111 15 137 15 l49 0 0 140 0 140 -72 -1 c-40 -1 -100 -5 -133 -10z"}));
                    $("#" + "Whitehool" + ii).append(CreatePath({"d":"M1540 2692 c0 -20 6 -22 48 -22 124 0 332 -54 467 -122 148 -75 318 -225 414 -367 104 -153 177 -361 188 -538 6 -90 7 -93 30 -93 23 0 23 1 18 68 -14 154 -47 285 -104 418 -21 49 -22 54 -7 82 26 51 20 75 -43 159 -100 133 -332 343 -381 343 -10 0 -34 -7 -55 -16 -36 -15 -39 -14 -124 20 -117 47 -235 75 -353 83 -96 6 -98 5 -98 -15z"}));
                    $("#" + "Whitehool" + ii).append(CreatePath({"d":"M1285 2413 c-349 -74 -627 -355 -699 -705 -9 -42 -16 -100 -16 -128 l0 -50 94 0 94 0 7 67 c36 338 300 602 638 638 l67 7 0 94 0 94 -57 -1 c-32 0 -89 -7 -128 -16z"}));
                    $("#" + "Whitehool" + ii).append(CreatePath({"d":"M1540 2338 l0 -95 84 -12 c159 -22 283 -81 396 -187 135 -127 197 -257 225 -466 l6 -48 96 0 96 0 -7 75 c-39 433 -393 789 -818 822 l-78 6 0 -95z"}));
                    $("#" + "Whitehool" + ii).append(CreatePath({"d":"M2667 1403 c-23 -348 -222 -680 -526 -881 -155 -102 -326 -162 -522 -184 l-107 -12 -4 -130 c-3 -72 -3 -135 0 -140 14 -25 308 20 457 70 553 187 951 697 982 1262 l6 112 -140 0 -140 0 -6 -97z"}));
                    $("#" + "Whitehool" + ii).append(CreatePath({"d":"M570 1410 c0 -127 62 -314 146 -442 52 -80 164 -196 234 -245 124 -85 297 -147 440 -159 l80 -7 0 95 0 95 -60 7 c-259 29 -463 172 -575 401 -43 86 -75 206 -75 275 l0 30 -95 0 -95 0 0 -50z"}));
                    $("#" + "Whitehool" + ii).append(CreatePath({"d":"M2250 1453 c-1 -41 -25 -161 -42 -213 -66 -203 -245 -382 -448 -448 -52 -17 -172 -41 -212 -42 -5 0 -8 -43 -8 -96 l0 -97 80 7 c424 37 779 392 816 816 l7 80 -97 0 c-53 0 -96 -3 -96 -7z"}));
                    $("#" + "Whitehool" + ii).append(CreatePath({"d":"M303 1358 c8 -118 38 -239 84 -347 l36 -83 -22 -45 c-14 -28 -19 -53 -15 -67 27 -85 298 -362 413 -420 32 -17 35 -17 82 3 l49 20 72 -30 c113 -47 244 -79 351 -86 95 -6 97 -5 97 15 0 19 -6 22 -47 22 -69 0 -211 27 -300 56 -323 108 -588 370 -701 694 -32 91 -62 246 -62 317 0 37 -3 43 -22 43 -20 0 -21 -3 -15 -92z"}));
                    var startPositiontextY = -24;
                    $.each(_data.categoryItem, function(iii,vvv){
                        $("#" + (i + ii)).append(CreateTspan({"x":vv.x - 46,"y":vv.y + startPositiontextY, "class":"HiddenInfo", "content":vvv + ":", "textAnchor":"end", "opacity":"0"}));
                        $("#" + (i + ii)).append(CreateTspan({"x":vv.x - 16,"y":vv.y + startPositiontextY, "content":0, "class":vvv + " historyChange HiddenInfo", "textAnchor":"end", "opacity":"0"}));
                        startPositiontextY += 12;
                    });
                }else if(i == 'black'){
                    //ブラックホール挿入
                    $("svg g.circles").append(CreateG({"id":("blackhool" + ii), "fill":"#000", "transform":("translate("+ (vv.x - 3 ) +", "+  (vv.y + 3) +") scale(0.02,-0.02)")}));
                    $("#" + "blackhool" + ii).append(CreatePath({"d":"M500 1380 c0 -5 9 -10 20 -10 42 0 177 -43 241 -76 65 -34 159 -118 146 -130 -3 -4 -20 6 -38 20 -108 91 -288 129 -434 91 -131 -34 -275 -144 -353 -268 -42 -67 -68 -125 -60 -133 3 -2 41 32 84 76 58 60 97 90 149 116 64 31 147 54 199 54 20 0 20 0 1 -14 -11 -8 -39 -19 -61 -26 -112 -33 -247 -165 -295 -287 -32 -79 -34 -278 -5 -363 30 -88 75 -171 123 -228 49 -58 65 -61 40 -10 -47 98 -67 182 -67 273 0 41 4 77 10 80 6 4 10 -16 10 -52 0 -114 44 -209 139 -304 72 -72 172 -128 274 -154 61 -16 287 -21 287 -7 0 4 -28 14 -62 21 -134 27 -244 80 -312 150 -41 42 -44 71 -3 34 12 -12 47 -35 78 -52 150 -82 325 -81 483 1 89 47 211 173 261 270 22 42 37 79 34 82 -2 3 -44 -33 -91 -79 -111 -108 -184 -145 -308 -160 -49 -6 -53 -5 -35 7 11 8 41 22 68 32 149 56 276 201 308 354 15 73 7 232 -16 297 -28 83 -74 167 -122 223 -49 58 -64 61 -40 10 47 -99 67 -182 67 -273 0 -43 -4 -75 -10 -75 -5 0 -10 24 -10 53 -1 193 -155 370 -389 446 -51 17 -90 21 -188 21 -75 0 -123 -4 -123 -10z"}));
                }
            });
        });
        
        //アコーディオン半円作成
        var gSemicircle = document.createElementNS("http://www.w3.org/2000/svg", 'g');
        gSemicircle.setAttribute("transform","translate(" + ((w / 2) - 250) + "," + (Number($("#chartDiv svg").height()) - 30) + ")"); //768 - 250
        gSemicircle.setAttribute("class","Accordion HiddenInfo");
        gSemicircle.setAttribute("opacity", 0);
        $("#chartDiv svg").append(gSemicircle);
        
        //半円の作成
        var pathSemicircle = document.createElementNS("http://www.w3.org/2000/svg", 'path');
        pathSemicircle.setAttribute("d","M 0 250 A 250 250 0 0 1 500 250 L 250 0 A 250 250 0 0 1 500 250 Z");
        pathSemicircle.setAttribute("x","0");
        pathSemicircle.setAttribute("y","0");
        pathSemicircle.setAttribute("stroke-width","0");
        pathSemicircle.setAttribute("fill","rgba(0, 0, 0, 0.5)");
        $("svg g.Accordion").append(pathSemicircle);
        
        //三角形の作成
        var triangle = document.createElementNS("http://www.w3.org/2000/svg", 'path');
        triangle.setAttribute("d","M4,14l12,0,-6,12z");
        triangle.setAttribute("style","-webkit-transform: translate(230px,-5px); cursor:pointer;");
        triangle.setAttribute("class","AccordionTriangle");
        triangle.setAttribute("stroke-width","3");
        triangle.setAttribute("fill","#fff");
        $("svg g.Accordion").append(triangle);
        $("svg g.Accordion path.AccordionTriangle").on('click', function(){
            if($(this).attr("class")=="AccordionTriangle activ"){
                d3_svg.selectAll("g.Accordion").transition().duration(300).ease("sin").attr("transform", "translate(" + ((w / 2) - 250) + ", " + (Number($("#chartDiv svg").height()) - 30) + ")");
                $(this).attr("class", "AccordionTriangle");
            }else{
                d3_svg.selectAll("g.Accordion").transition().duration(300).ease("sin").attr("transform", "translate(" + ((w / 2) -250) + ", " + (Number($("#chartDiv svg").height()) - 250) + ")");
                $(this).attr("class", "AccordionTriangle activ");
            }
        });
        
        //半円パネルメイン作成
        $("svg g.Accordion").append(CreateText({"content":_data.semiCircleMain.name, "x":"230", "y":"40", "style":"fill:#FFF; text-anchor: middle;"}));
        $("svg g.Accordion").append(CreateText({"id":"semiCircleMain", "class":"historyChange", "x":"230", "y":"72", "content":"0", "style":"fill:#ffffff;  text-anchor: middle; font-size: 30px;"}));
        
        //半円パネルの詳細数値作成
        $.each(_data.semiCircleDetail, function(i,v){
        	var hiddenCss = "";
        	var visibleCss = "";
        	if(v.name == ""){
        		hiddenCss = "visibility:hidden;";
        		visibleCss = "visibility:visible;";
        		v.name = "noname";
        	}
            $("svg g.Accordion").append(CreateText({"id":v.id, "x":v.x, "content":v.name, "dy":"100", "style":"fill:#ffffff; text-anchor: end;" + hiddenCss}));
            $("#" + v.id).append(CreateTspan({"class":"total historyChange", "x":v.x, "content":"0", "dy":"26", "style":"font-size: 24px; text-anchor: end;"}));
            var padingTop = 20;
            $.each(_data.categoryItem, function(index, value){
                $("#" + v.id).append(CreateTspan({"x":(v.x - 25), "content":value+":", "dy":20 + padingTop, "style":"fill:#ffffff;  text-anchor: end; font-size:10px;" + visibleCss}));
                $("#" + v.id).append(CreateTspan({"class":value + " historyChange", "x":v.x, "content":"0", "style":"fill:#ffffff;  text-anchor: end; font-size:10px;" + visibleCss}));
                if(padingTop == 20) padingTop = 0;
            });
        });
        
        //惑星の数値作成
        GetPlanet();
        //画面下半円サマリパネル作成
        GetSemiCirclePanel();
        //ランキング初期表示データの取得
        $.each(_data.rankData, function(i, v){
        	$.ajax({
              type: 'GET',
              url: MakeUrl(_data.history[selectedHistoryIndex].url_rank[i]),
              dataType: 'json',
              cache: false,
              success: function(json){
                if(!json.data || json.data.length == 0) {
                     successAjax = false;
                    console.log("ajaxFail:" + MakeUrl(_data.history[selectedHistoryIndex].url_rank[i]));
                    return;
                }
                if(json.data.length > 0){
                    $.each(json.data, function(index, val){
                        val.VALUE = Number(val.VALUE);
                        if(val[v.category] == "") val[v.category] = '不明';
                    });
                    v.object = json.data;
                    //横棒グラフ
                    var maxVal = Math.max.apply(null, Object.keys(v.object).map(key => v.object[key].VALUE));
                    var svg = d3.select("div.rankTableSvgDiv." + (v.category + v.event)).append("svg")
                        .attr("width", $("#topicDiv").width()).attr("height", 20 * _rankingCount);
                    rankingData[v.category + v.event] = svg;
                    svg.selectAll("rect")   // SVGでの四角形を示す要素を指定
                        .data(v.object.slice(0, 5)) // データを設定
                        .enter()
                        .append("rect") // SVGでの四角形を示す要素を生成
                        .attr("x", function(d,i){
                            if(d.VALUE == 0 || !d.VALUE) return 0;
                            else return $("#topicDiv").width() - (d.VALUE / maxVal * $("#topicDiv").width() * 0.5) - 40;
                        })
                        .attr("y", function(d,i){   // Y座標を配列の順序に応じて計算
                            return (i * 20);
                        })
                        .attr("width", function(d){ // 横幅を配列の内容に応じて計算
                            if(d.VALUE == 0 || !d.VALUE) return "0px";
                            else return (d.VALUE / maxVal * $("#topicDiv").width() * 0.5) + "px";
                        })
                        .attr("height", "12")   // 棒グラフの高さを指定
                        .attr("fill", "rgba(158,158,158,0.8)");
                        
                    svg.selectAll("text.rankItemName")
                        .data(v.object.slice(0, 5))
                        .enter()
                        .append("text")
                        .text(function(d, i){
                            return (i+1) + ". " + d[v.category];
                        })
                        .attr("class", "rankItemName")
                        .attr("x", 24)
                        .attr("y", function(d,i){
                            return (i * 20 + 10);
                        })
                        .attr("font-size", 12)
                        .attr("fill", "#FFF")
                        
                    svg.selectAll("text.rankItemValue")
                        .data(v.object.slice(0, 5))
                        .enter()
                        .append("text")
                        .text(function(d){
                            return d.VALUE;
                        })
                        .attr("class", "rankItemValue")
                        .attr("x", function(d,i){
                            return $("#topicDiv").width() - 6;
                        })
                        .attr("y", function(d,i){
                            return (i * 20 + 10);
                        })
                        .attr("text-anchor", "end")
                        .attr("font-size", 12)
                        .attr("fill", "#FFF")
                }else{
                	v.object = new Array();
                }
              },
            });
        });
        
        //フィルタデータの取得
        $.each(_data.filter, function(i, v){
            $.ajax({
              type: 'GET',
              url: MakeUrl(v.url),
              dataType: 'json',
              cache: false,
              success: function(json){
                if(!json.data || json.data.length == 0) {
                     successAjax = false;
                    console.log("ajaxFail:" + MakeUrl(v.url));
                    return;
                }
                if(json.data.length > 0){
                    $.each(json.data, function(ii, vv){
                        $("#ul" + v.id).append("<li><label><input type='checkbox' class='checkbox' value='"+ vv.NAME +"'/><span class='checkbox-icon'>"+ vv.NAME +"</span></label></ul>");
                    });
                    //チェックボックスチェックイベント
                    $("#ul" + v.id +" li input").change(function(){
                        chartsStartIndex = null;
                        chartsEndIndex = null;
                        if ($(this).is(':checked')) {
                            $('div.divSelectedFilterItem').prepend('<span style="width:'+ (this.value.length * 12 + 24) +'px;" class="spanSelectedFilterItem '+ this.value +'">'+ this.value +'<span class="spanClearFilter">&#10006;</span></span>');
                            $("span.spanClearFilter").off('click');
                            $("span.spanClearFilter").on("click", function(){
                                $("input[value='"+ $(this).parent().text().slice(0,-1) +"']").prop("checked", false).change();
                                $(this).parent().remove();
                            });
                            //フィルタリング
                            $("circle.showed.main").css("display", "none");
                            $("circle[data-filter"+ v.target.slice(-1) +"='" + this.value + "']").css("display", "");
                            filterObj["LOCATION_FILTER"+ v.target.slice(-1)].push(this.value);
                        } else {
                            var target = this.value;
                            $('div.divSelectedFilterItem span.'+ target).remove();
                            filterObj["LOCATION_FILTER"+ v.target.slice(-1)].some(function(vv, ii){
                                if (vv == target) filterObj["LOCATION_FILTER"+ v.target.slice(-1)].splice(ii,1);
                            });
                            if($('div.divSelectedFilterItem span').length == 0){
                                $("circle.showed.main").css("display", "");
                                $.each(_data.rankData, function(i, v){
                                    if (rankAjax[v.category + v.event]) rankAjax[v.category + v.event].abort();
                                });
                                $("div.loadingRankDiv").remove();
                                DoFilterRank();
                                if (jqxhrTopic) {
                                    jqxhrTopic.abort();
                                    $(".loadingTopicDiv").remove();
                                }
                                UpdateTopicChart(true);
                                WriteFilterDescription();
                                return;
                            }
                        }
                        $.each(_data.rankData, function(i, v){
                            if (rankAjax[v.category + v.event]) rankAjax[v.category + v.event].abort();
                        });
                        $("div.loadingRankDiv").remove();
                        DoFilterMap();
                        DoFilterRank();
                        if (jqxhrTopic) {
                            jqxhrTopic.abort();
                            $(".loadingTopicDiv").remove();
                        }
                        UpdateTopicChart(true);
                        $("#gridTable tbody tr").remove();
                        WriteFilterDescription();
                    });
                }
              },
            });
        });
        
        function GetThisData(){
        	if(_data.realTimeData == "" || !_data.history[selectedHistoryIndex].realtime) return;
            timeoutThis = setTimeout(function(){
                $.ajax({
                  type: 'GET',
                  url: MakeUrl(_data.realTimeData),
                  dataType: 'json',
                  success: function(json){
                    if(!json.data || json.data.length == 0) {
                        console.log(new Date().getHours() + ':' + ('0'+new Date().getMinutes()).slice(-2)+"読み込みデータなし");
                         successAjax = false;
                        console.log("ajaxFail:" + MakeUrl(_data.realTimeData));
                        return;
                    }
                    //読み込んだデータの時刻を保持、これを元に2重読込していないか確認する
                    whatTimeIs = "";
                    whatTimeIs = json.data[json.data.length - 1]["TIME"].substr(0, 2) + ":" + json.data[json.data.length - 1]["TIME"].substr(2,2);
                    var arr = json.data.filter(function(item, index){
                                if (item['LATITUDE'] != "" && item['LONGITUDE'] != "") return true;
                            });
                    $.each(arr, function(index, val){
                        val.NEW = false;
                        val.TIME = Math.random() * 50 * 1000;
                        if(val.ITEM_NAME == null || val.ITEM_NAME == "") val.ITEM_NAME = "不明";
                    });
                    //console.log(whatTimeIs + ":" + arr.length + "件");
                    draw(arr);
                  }
                });
                UpdateTopicChart(false);
            }, 10000);
        }
        
        var tmp;
        
        function GetNextData(){
            if(clearChurmFlg){
            	//console.log(whatTimeIs + ":" + tmp.length + "件");
                draw(tmp);
                return false;
            }else setTimeout(GetNextData, 1000);
        }
        
        function GetData(){
        	if(_data.realTimeData == "" || !_data.history[selectedHistoryIndex].realtime) return;
        	$.ajax({
              type: 'GET',
              url: MakeUrl(_data.realTimeData),
              dataType: 'json',
              success: function(json){
                if(!json.data) {
                    successAjax = false;
                    console.log("ajaxFail:" + MakeUrl(_data.realTimeData));
                    return;
                }
                if(json.data.length == 0){
                    console.log("ajax_" + new Date().getHours() + ':' + ('0'+new Date().getMinutes()).slice(-2)+"__none");
                    return;
                }else
                if(whatTimeIs != json.data[json.data.length - 1]["TIME"].substr(0, 2) + ":" + json.data[json.data.length - 1]["TIME"].substr(2,2)){ //高橋春日
                //if(true){
                	whatTimeIs = json.data[json.data.length - 1]["TIME"].substr(0, 2) + ":" + json.data[json.data.length - 1]["TIME"].substr(2,2);
                    var arr = json.data.filter(function(item, index){
                                if (item['LATITUDE'] != "" && item['LONGITUDE'] != "") return true;
                            });
                    $.each(arr, function(index, val){
                        val.NEW = false;
                        val.TIME = Math.random() * 50 * 1000;
                        if(val.ITEM_NAME == null || val.ITEM_NAME == "") val.ITEM_NAME = "不明";
                    });
                    tmp = arr;
                    GetNextData(whatTimeIs);
                }else{
                	setTimeout(GetData, 1000);
                }
              }
            });
        }
        function readData(){
        	interval = setInterval(function(){
                //時計更新
                $("#hourMinutes").text(new Date().getHours() + ':' + ('0'+new Date().getMinutes()).slice(-2));
                //サークル取得
                GetData();
                UpdateTopicChart(false);
            },60000);
        }
    });
    
    $(window).on('resize', function(){
        ResizeRank();
    });

    //////////////////////////////////////////
    //メニューボタン作成
    //////////////////////////////////////////
    $("div.sb-slidebar.sb-left").after("<div id='menuIconDiv'></div>");
    $("#menuIconDiv").css({"position":"absolute", "left":"0px", "top":"0px", "z-index":"9999"});
    var menuIconSvg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
    menuIconSvg.setAttribute("height", 60 * resolution);
    menuIconSvg.setAttribute("width", 60 * resolution);
    $("#menuIconDiv").append(menuIconSvg);
    $("#menuIconDiv svg").append(CreateG({"id":"gSummary", "transform":"scale(" + resolution + ")"}));
	$("#gSummary").append(CreateCircle({"cx":"30", "cy":"30", "r":"16", "fill":"rgba(0,0,0,0.8)", "class":"tooltipIcon", "title":"menu"}));
    $("#gSummary").append(CreateImage({"x":"24", "y":"24", "id":"menuRect", "class":"tooltipIcon", "title":"menu", "width":"12", "height":"12", "title":"menu", "href":MakePath("icon/icon_SoftbankFlag.png")}));
    //基盤のメニューウィンドウを表示する
    $("#menuRect").on("click", function(){
        $('#menu').trigger("click");
    });
	//画面スクロール基盤側の余分な画面を消す
    window.scrollTo(0, Number($("#chartdivBase").offset().top));
    
    //セッションクリア対策のため、20分ごとにリロードする
    setTimeout(function(){
    	location.reload();
    }, 1200000);
    
    this.finished = true;
}
window.Map = Map;
