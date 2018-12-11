///////////////////////////////////////////
//メイン処理
///////////////////////////////////////////
var ScatterMatrix = {};
ScatterMatrix.data;
ScatterMatrix.finished = false;
ScatterMatrix.main = function(){
	
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
	loadCss(MakePath("css/ScatterMatrix.css"));
	
	//暫定リリース用
	if(this.finished) return
	var _data = Map.data;
	
	function Tricks(){
		$("#layout-column_column-1, #canvasArea").children().remove();
	}
	Tricks();
	
	function MakeUrl(str){
		return site_settings.graphInfoServiceSSL + site_settings.graphInfoServiceIP + "/graphservice/" + str + "?sessionId=" + site_settings.sessionId;
	}
	
	function MakePath(str){
		return site_settings.graphInfoServiceSSL + site_settings.graphInfoServiceIP + "/BigScreen/" + str;
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
	
	//変数
	var colors;
	var filterType = ["none","none"] ;
	var filterLimits = [[0,0],[0,0]] ;
	var isZoom = true;
	
	//ライブラリ
	ScatterplotMatrix = function(url, data, id) {
	  this.__url = url;
	  this.__data = data;
	  this.__cell_size = 140;
	  this.__element_id = id;
	};

	ScatterplotMatrix.prototype.cellSize = function(n) {
	  this.__cell_size = n;
	  return this;
	};

	ScatterplotMatrix.prototype.onData = function(cb) {
	  if (this.__data) { cb(); return; }
	  var self = this;
	  d3.csv(self.__url, function(data) {
	    self.__data = data;
	    cb();
	  });
	};

	ScatterplotMatrix.prototype.render = function () {
	  var self = this;

	  var container = d3.select('#'+ self.__element_id).append('div')
	                                   .attr('class', 'scatter-matrix-container');
	  var control = container.append('div')
	                         .attr('class', 'scatter-matrix-control');
	  $("div.scatter-matrix-control").css("height", window.innerHeight -108 -60);
	  var svgDiv = container.append('div')
	                     .attr('class', 'scatter-matrix-svg')
	                     .attr('style', 'height:'+ (window.innerHeight) +'px; width:'+ (window.innerWidth) +'px;');
	  
	  // Root panel
		var svg = svgDiv.append("svg:svg")
		    .attr("width", window.innerWidth)
		    .attr("height", window.innerHeight);
		
		svg.append("svg:g")
			.attr("class", "gTransform")
		    .attr("transform", "translate(60, 48)");

	  this.onData(function() {
	    var data = self.__data;

	    // Fetch data and get all string variables
	    self.__string_variables = [undefined];
	    self.__numeric_variables = [];
	    self.__numeric_variable_values = {};
		self.__categoryState = {};
		
	    for (k in data[0]) {
	      if(k == 'NAME') continue;
	      else if (isNaN(+data[0][k])) { self.__string_variables.push(k); }
	      else { self.__numeric_variables.push(k); self.__numeric_variable_values[k] = []; }
	    }

	    data.forEach(function(d) {
	      $.each(self.__numeric_variables, function(i,j){
	      	var k = self.__numeric_variables[i];
	        var value = d[k];
	        if (self.__numeric_variable_values[k].indexOf(value) < 0) {
	          self.__numeric_variable_values[k].push(value);
	        }
	      });
	    });
		
		  // Get Min and Max of each of the columns
		  self.__domainByTrait = {};
		  self.__numeric_variables.forEach(function(variables) {
		    self.__domainByTrait[variables] = d3.extent(data, function(d) {
		      return +d[variables];
		    });
		  });
	  
		//コントロール群
	    var size_control = control.append('div').attr('class', 'scatter-matrix-size-control');
	    var color_control = control.append('div').attr('class', 'scatter-matrix-color-control');
	    var filter_control = control.append('div').attr('class', 'scatter-matrix-filter-control');
	    var variable_control = control.append('div').attr('class', 'scatter-matrix-variable-control');
	    var drill_control = control.append('div').attr('class', 'scatter-matrix-drill-control');
	    var time_control = control.append('div').attr('class', 'scatter-matrix-time-control');

	    // shared control states
	    var to_include = [];
	    var color_variable = undefined;
	    var selected_colors = undefined;
	    
	    $.each(self.__numeric_variables, function(i,v){
	    	//var v = self.__numeric_variables[j];
			to_include.push(v);
	    });
	    var drill_variables = [];

	    function set_filter(variable) {
	      filter_control.selectAll('*').remove();
	      if (variable) {
	        // Get unique values for this variable
	        var values = [];
	        data.forEach(function(d) {
	          var v = d[variable];
	          if (values.indexOf(v) < 0) { values.push(v); }
	        });

	        selected_colors = [];
	        $.each(values, function(i,v){
	        	selected_colors.push(v);
	        });

	        var filter_li =
	          filter_control
	            .append('p').text('Filter by '+variable+': ')
	            .append('div')
	            .style('width', $(".scatter-matrix-control").width() + "px")
	            .selectAll('span')
	            .data(values)
	            .enter().append('span')
	            .html(function(d) { return d; })
	            .attr('class', function(d){ 
				  var c = d;
			      if (color_variable && d[color_variable]) { c = d[color_variable]; }
			      return colors.length > 0 ? 'colorBack-'+colors.indexOf(c) +' active filter' : 'colorBack-selected active filter';
	            })
		        .on('click', function(d, i) {
		           var new_selected_colors = [];
		           if ($(this).hasClass('active')) { 
		             $(this).removeClass('active');
		             $(this).addClass('passive');
		           }else{
		             $(this).removeClass('passive');
		             $(this).addClass('active');
		           }
		           $.each(selected_colors, function(i, v){
		             if (v !== d || $(this).hasClass('active')) { new_selected_colors.push(v); } 
		           });
		           if ($(this).hasClass('active')) new_selected_colors.push(d);
		           selected_colors = new_selected_colors;
		           self.__draw(self.__cell_size, svg, color_variable, selected_colors, to_include, drill_variables);
		        });
	        
	      }
	    }
		
		//セルサイズコントローラ
	    size_a = size_control.append('p').text('Change cell size: ');
	    size_a.append('span')
	          .html('-')
	          .attr('class', 'spanSizeControl')
	          .on('click', function() {
	            self.__cell_size *= 0.8;
	            self.__draw(self.__cell_size, svg, color_variable, selected_colors, to_include, drill_variables);
	          });
	    size_a.append('span').html('&nbsp;');
	    size_a.append('span')
	          .html('+')
	          .attr('class', 'spanSizeControl')
	          .on('click', function() {
	            self.__cell_size *= 1.2;
	            self.__draw(self.__cell_size, svg, color_variable, selected_colors, to_include, drill_variables);
	          });
	    
	    //時間軸コントローラ
	    time_a = time_control.append('p').text('Change Time: ').append('p').style('margin-top','6px');
	    time_a.append('span')
	          .html('-')
	          .attr('class', 'spanTimeControl')
	          .on('click', function() {
	          	var ym = $("span.spanTime").text();
	          	var y = Number(ym.slice(0,4));
	          	var m = Number(ym.slice(4,6));
	          	if(m == 1) {
	          		m = "12";
	          		y--;
	          	}else{
	          		m--;
	          	}
	          	$("span.spanTime").text(y+ ('0'+m).slice(-2));
	          	//var url = ScatterMatrix.data + '&SEARCH_FILTER1=[{"operator":"in","key":["substr(登録年月日,1,6)"],"showKey":"","value":["' + $("spam.spanTime").text() + '"],"pid":"","searchId":""}]';
	            svg.select("g.gTransform").selectAll('*').remove();
	            $("#loadingDiv").css({"display":"block", "opacity":"1"});
	            $.ajax({
				    type: 'GET',
				    url: MakeUrl(ScatterMatrix.data),
				    dataType: 'json',
				    success: function(json){
				    	self.__data = json.data
				    	self.__draw(self.__cell_size, svg, color_variable, selected_colors, to_include, drill_variables);
				    	$("#loadingDiv").css("opacity", "0").css("display","none");
				    }
				});
	          });
	    time_a.append('span').html('201403').attr('class', 'spanTime');
	    time_a.append('span')
	          .html('+')
	          .attr('class', 'spanTimeControl')
	          .on('click', function() {
	          	var ym = $("span.spanTime").text();
	          	var y = Number(ym.slice(0,4));
	          	var m = Number(ym.slice(4,6));
	          	if(m == 12) {
	          		m = "01";
	          		y++;
	          	}else{
	          		m++;
	          	}
	          	$("span.spanTime").text(y+ ('0'+m).slice(-2));
	            //var url = ScatterMatrix.data + '&SEARCH_FILTER1=[{"operator":"in","key":["substr(登録年月日,1,6)"],"showKey":"","value":["' + $("spam.spanTime").text() + '"],"pid":"","searchId":""}]';
	            svg.select("g.gTransform").selectAll('*').remove();
	            $("#loadingDiv").css({"display":"block", "opacity":"1"});
	            $.ajax({
				    type: 'GET',
				    url: MakeUrl(ScatterMatrix.data),
				    dataType: 'json',
				    success: function(json){
				    	self.__data = json.data
				    	self.__draw(self.__cell_size, svg, color_variable, selected_colors, to_include, drill_variables);
				    	$("#loadingDiv").css("opacity", "0").css("display","none");
				    }
				});
	          });

	    color_control.append('p').text('Select a variable to color:')
	    color_control
	      .append('ul')
	      .selectAll('li')
	      .data(self.__string_variables)
	      .enter().append('li')
	        .append('a')
	          .attr('href', '#')
	          .text(function(d) { return d ? d : 'None'; })
	          .on('click', function(d, i) {
				color_variable = d;
				selected_colors = undefined;
				self.__draw(self.__cell_size, svg, color_variable, selected_colors, to_include, drill_variables);
				set_filter(d);
	          });

	    var variable_li =
	      variable_control
	        .append('p').text('Include variables: ')
	        .append('ul')
	        .selectAll('li')
	        .data(self.__numeric_variables)
	        .enter().append('li');

	    variable_li.append('label')
	    		   .append('input')
	               .attr('type', 'checkbox')
	               .attr('checked', 'checked')
	               .attr('class', 'checkbox')
	               .on('click', function(d, i) {
	                 var new_to_include = [];
	                 $.each(to_include, function(i,v){
	                 	if (v !== d || this.checked) { new_to_include.push(v); } 
	                 });
	                 if (this.checked) { new_to_include.push(d); }
	                 to_include = new_to_include;
	                 self.__draw(self.__cell_size, svg, color_variable, selected_colors, to_include, drill_variables);
	               });
	    variable_li.select('label').append('span')
	    		   .attr('class', 'checkbox-icon')
	               .html(function(d) { return d; });

	    drill_li = 
	      drill_control
	        .append('p').text('Drill and Expand: ')
	        .append('ul')
	        .selectAll('li')
	        .data(self.__numeric_variables)
	        .enter().append('li')
	        .attr('class', function(d) { return d; });

	    drill_li.append('label')
	    		.append('input')
	            .attr('type', 'checkbox')
	            .attr('class', 'checkbox')
	            .on('click', function(d, i) {
	               var new_drill_variables = [];
	               $.each(drill_variables, function(i,v){
	                 if (v !== d || this.checked) { new_drill_variables.push(v); } 
	               });
	               if (this.checked) { new_drill_variables.push(d); }
	               
	               //2個以上は選択できないようにする
	               if(new_drill_variables.length > 2){
		               $(event.currentTarget).prop('checked', false);
		               return;
	               }else if(new_drill_variables.length == 2){
	                   $(".scatter-matrix-drill-control li").css("opacity", "0.3");
		               $.each(new_drill_variables, function(i, v){
		                   $(".scatter-matrix-drill-control li."+ v).css("opacity", "1");
		               });
	               }else{
	                   $(".scatter-matrix-drill-control li").css("opacity", 1);
	               }
	               
	               drill_variables = new_drill_variables;
	               self.__draw(self.__cell_size, svg, color_variable, selected_colors, to_include, drill_variables);
	             });
	    drill_li.select('label').append('span')
	    		.attr('class', 'checkbox-icon')
	            .html(function(d) { return d+' ('+self.__numeric_variable_values[d].length+')'; });

	    self.__draw(self.__cell_size, svg, color_variable, selected_colors, to_include, drill_variables);
	    
	    
	    //キャンバスズーム
	    var zoomMin = 0.5;
		var zoomMax = 5;
		var preZoom = 1;
	    function initZoom(x, y, scale){
			zoom = d3.behavior.zoom();
			if(x!= null && y != null) zoom.translate([x, y]);
			if(scale != null) zoom.scale(scale);
			//zoom.scaleExtent([zoomMin, zoomMax]);
			zoom.on("zoom", zoomFunction);
			svg.call( zoom ) ;
		}
		function zoomFunction(){
			if(isZoom){
				var event = d3.event ;
				tx = event.translate[0];
				ty = event.translate[1];
				
				if(false){
				//if(event.scale != preZoom){ 代理店対応
					self.__cell_size *= (event.scale > preZoom ? 1.2 : 0.8);
					preZoom = event.scale;
					self.__draw(self.__cell_size, svg, color_variable, selected_colors, to_include, drill_variables);
				}
				//d3.select("g.gTransform").style( "transform", "translate( " + tx + "px, " + ty + "px )"); 代理店対応
				d3.select("g.gTransform").style( "transform", "translate( " + tx + "px, " + ty + "px )scale("+event.scale+")") ;
			}
		}
		initZoom(48, 60);
		
		//検索イベント付加
		$("#inputSearch").on("keyup", ScatterplotMatrix.prototype.__SerchCircle);
	  });
	};

	//描画
	ScatterplotMatrix.prototype.__draw = function(cell_size, svg, color_variable, selected_colors, to_include, drill_variables) {
	  var self = this;
	  this.onData(function() {
	    var data = self.__data;

	    if (color_variable && selected_colors) {
	      data = [];
	      self.__categoryState[color_variable] = {};
	      self.__data.forEach(function(d) {
	        if (selected_colors.indexOf(d[color_variable]) >= 0) { 
	        	data.push(d);
	        	self.__categoryState[color_variable][d[color_variable]] = true;
	        }else{
	        	self.__categoryState[color_variable][d[color_variable]] = false;
	        }
	      });
	    }

	    svg.select("g.gTransform").selectAll('*').remove();

	    // If no data, don't do anything
	    if (data.length == 0) { return; }

		// フィルタリング反映
	    self.__numeric_variables = [];
	    for (k in data[0]) {
	      if (!isNaN(+data[0][k]) && to_include.indexOf(k) >= 0) { self.__numeric_variables.push(k); }
	    }
	    
	    // Get values of the string variable
	    colors = [];
	    if (color_variable) {
	      // Using self.__data, instead of data, so our css classes are consistent when
	      // we filter by value.
	      self.__data.forEach(function(d) {
	        var s = d[color_variable];
	        if (colors.indexOf(s) < 0) { colors.push(s); }
	      });
	    }

	    function color_class(d) {
	      var c = d;
	      if (color_variable && d[color_variable]) { c = d[color_variable]; }
	      return colors.length > 0 ? 'color-'+colors.indexOf(c) : 'color-selected';
	    }

	    // Size parameters
	    var size = cell_size, padding = 10,
	        axis_width = 20, axis_height = 15, label_height = 15;

	    // Get x and y scales for each numeric variable
	    var x = {}, y = {};
	    self.__numeric_variables.forEach(function(trait) {
	      // Coerce values to numbers.
	      data.forEach(function(d) { d[trait] = +d[trait]; });

	      var value = function(d) { return d[trait]; },
	          domain = [d3.min(data, value), d3.max(data, value)],
	          range_x = [padding / 2 +6, size - padding / 2 -6],
	          range_y = [padding / 2 +6, size - padding / 2 -6];

	      x[trait] = d3.scale.linear().domain(domain).range(range_x);
	      y[trait] = d3.scale.linear().domain(domain).range(range_y.reverse());
	    });

	    // When drilling, user select one or more variables. The first drilled
	    // variable becomes the x-axis variable for all columns, and each column
	    // contains only data points that match specific values for each of the
	    // drilled variables other than the first.

	    var drill_values = [];
	    var drill_degrees = []
	    drill_variables.forEach(function(variable) {
	      // Skip first one, since that's just the x axis
	      if (drill_values.length == 0) {
	        drill_values.push([]);
	        drill_degrees.push(1);
	      }
	      else {
	        var values = [];
	        data.forEach(function(d) {
	          var v = d[variable];
	          if (v !== undefined && values.indexOf(v) < 0) { values.push(v); }
	        });
	        values.sort();
	        drill_values.push(values);
	        drill_degrees.push(values.length);
	      }
	    });
	    var total_columns = 1;
	    drill_degrees.forEach(function(d) { total_columns *= d; });

	    // Pick out stuff to draw on horizontal and vertical dimensions

	    if (drill_variables.length > 0) {
	      // First drill is now the x-axis variable for all columns
	      x_variables = [];
	      for (var i=0; i<total_columns; i++) {
	        x_variables.push(drill_variables[0]);
	      }
	    }
	    else {
	      x_variables = self.__numeric_variables.slice(0);
	    }

	    if (drill_variables.length > 0) {
	      // Don't draw any of the "drilled" variables in vertical dimension
	      y_variables = [];
	      self.__numeric_variables.forEach(function(variable) {
	        if (drill_variables.indexOf(variable) < 0) { y_variables.push(variable); }
	      });
	    }
	    else {
	      y_variables = self.__numeric_variables.slice(0);
	    }

	    var filter_descriptions = 0;
	    if (drill_variables.length > 1) {
	      filter_descriptions = drill_variables.length-1;
	    }

	    // Axes
	    var x_axis = d3.svg.axis();
	    var y_axis = d3.svg.axis();
	    //数値のフォーマット
	    var intf = d3.format('d');
	    var fltf = d3.format('.f');
	    var scif = d3.format('.2s');
	    var thou = d3.format('0,000');

	    x_axis.ticks(Math.ceil(self.__cell_size/50))
	          .tickSize(size * y_variables.length)
	          .tickFormat(function(d) {
	            if (Math.abs(+d) > 10000 || (Math.abs(d) < 0.001 && Math.abs(d) != 0)) { return scif(d); }
	            if (parseInt(d) == +d) { return intf(d); }
	            return fltf(d);
	          });

	    y_axis.ticks(Math.ceil(self.__cell_size/30))
	          .tickSize(size * x_variables.length)
	          .tickFormat(function(d) {
	            if (Math.abs(+d) > 10000 || (Math.abs(d) < 0.001 && Math.abs(d) != 0)) { return scif(d); }
	            if (parseInt(d) == +d) { return intf(d); }
	            return fltf(d);
	          });

	    // Brush - for highlighting regions of data
	    var brush = d3.svg.brush()
	        .on("brushstart", brushstart)
	        .on("brush", brush)
	        .on("brushend", brushend);
	    
	    // Root panel
	    svg = svg.select("g.gTransform");

	    // Draw X-axis
	    svg.selectAll("g.x.axis")
	        .data(x_variables)
	      .enter().append("svg:g")
	        .attr("class", "x axis")
	        .attr("transform", function(d, i) { return "translate(" + i * size + ",0)"; })
	        .each(function(d) { d3.select(this).call(x_axis.scale(x[d]).orient("bottom")); });

	    // Draw Y-axis
	    svg.selectAll("g.y.axis")
	        .data(y_variables)
	      .enter().append("svg:g")
	        .attr("class", "y axis")
	        .attr("transform", function(d, i) { return "translate(0," + i * size + ")"; })
	        .each(function(d) { d3.select(this).call(y_axis.scale(y[d]).orient("right")); });
	    
	    // Cell集合体
	    var cells = svg.append("svg:g")
	        .attr("class", "cells");

	    // Draw scatter plot
	    var cell = cells.selectAll("g.cell")
	        .data(cross(x_variables, y_variables))
	      .enter().append("svg:g")
	        .attr("class", "cell")
	        .attr("transform", function(d) { return "translate(" + d.i * size + "," + d.j * size + ")"; });
	    var histCells;
	    
	    //セル内描画
	    if(drill_variables.length == 0){
	    	
	    	//基準線作成
	    	cell.filter(function(d) { return d.j > d.i; }).append('svg:g').attr('class', 'gAvgAxis');
	    	
	    	cell.filter(function(d) { return (d.i !== d.j && d.j > d.i);})
	    	  .each(plot);
			histCells = cell.filter(function(d) { return d.i === d.j; })
		     .each(firstPlotHistogram) ;
		    MakeRelationshipCoefficient();
		    DrawAvgLine();
		    
		    cell.on("mouseover", function(d){
		    	$(this).children("rect.frame").css("fill-opacity", "0.6");
		    	cell.filter(function(p) { return (p.i == d.j && p.j == d.i);}).select("rect.frame").style("fill-opacity", "0.6");
		    	
		    	//軸値の太文字化
		    	d3.selectAll("g.y.axis").filter(function(p,i) { return (i == d.j);}).selectAll("text").style("font-weight", "bold");
		    	d3.selectAll("g.x.axis").filter(function(p,i) { return (i == d.i);}).selectAll("text").style("font-weight", "bold");
		    	d3.selectAll("text.textVerticalAxis").filter(function(p,i) { return (i == d.j);}).style("font-weight", "bold");
		    	d3.selectAll("text.textHorizontalAxis").filter(function(p,i) { return (i == d.i);}).style("font-weight", "bold");
		    	d3.selectAll("text.textXAxisAverage").filter(function(p,i) { return (i == d.i);}).style("font-weight", "bold");
		    	
		    }).on("mouseout", function(d){
		    	$(this).children("rect.frame").css("fill-opacity", "0.3");
		    	cell.filter(function(p) { return (p.i == d.j && p.j == d.i);}).select("rect.frame").style("fill-opacity", "0.3");
		    	
		    	d3.selectAll("g.y.axis").filter(function(p,i) { return (i == d.j);}).selectAll("text").style("font-weight", "normal");
		    	d3.selectAll("g.x.axis").filter(function(p,i) { return (i == d.i);}).selectAll("text").style("font-weight", "normal");
		    	d3.selectAll("text.textVerticalAxis").filter(function(p,i) { return (i == d.j);}).style("font-weight", "normal");
		    	d3.selectAll("text.textHorizontalAxis").filter(function(p,i) { return (i == d.i);}).style("font-weight", "normal");
		    	d3.selectAll("text.textXAxisAverage").filter(function(p,i) { return (i == d.i);}).style("font-weight", "normal");
		    });
	    }else{
	    	cell.each(plot);
	    }
	    
	    //X軸グラフ名称の追加
	    cell.filter(function(d) { return d.j == 0; }).append("svg:text")
	        .attr("x", size/2)
	        .attr("y", -36)
	        .attr("dy", ".71em")
	        .attr("class", "textHorizontalAxis")
	        .style("text-anchor", "middle")
	        .text(function(d) { return d.x; });
	    
	    // Add titles for y variables
	    cell.filter(function(d) { return d.i == 0; }).append("svg:text")
	        .attr("x", padding-size/2)
	        .attr("y", -label_height)
	        .attr("dy", ".71em")
	        .attr("class", "textVerticalAxis")
	        .style("text-anchor", "middle")
	        .attr("transform", function(d) { return "rotate(-90)"; })
	        .text(function(d) { 
	        	return d.y; 
	        });
	    
	    //ツールチップ作成
		$("body").append("<div id='tooltip' class='refreshElement'></span>");
		var tooltip = d3.select("body").select("#tooltip");
		
	    //ツールチップが表示されるようにbackgroundのrectを移動させる
	    $.each($("rect.background"), function(i, v){
	    	$(v).parent("g").find("rect.frame").after($(v));
	    });
	    $.each($("rect.extent"), function(i, v){
	    	$(v).parent("g").find("rect.background").after($(v));
	    });
	    
	    //ツールチップ選択対象アニメーション
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
		anime2.setAttribute("from", "1");
		anime2.setAttribute("to", self.__cell_size / 15);
	    
	    //散布図作成
	    function plot(p) {
	      var data_to_draw = data;

	      // If drilling, compute what values of the drill variables correspond to
	      // this column.
	      var filter = {};
	      if (drill_variables.length > 1) {
	        var column = p.i;

	        var cap = 1;
	        for (var i=drill_variables.length-1; i > 0; i--) {
	          var var_name = drill_variables[i];
	          var var_value = undefined;

	          if (i == drill_variables.length-1) {
	            // for the last drill variable, we index by %
	            var_value = drill_values[i][column % drill_degrees[i]];
	          }
	          else {
	            // otherwise divide by capacity of subsequent variables to get value array index
	            var_value = drill_values[i][parseInt(column/cap)];
	          }

	          filter[var_name] = var_value;
	          cap *= drill_degrees[i];
	        }

	        data_to_draw = [];
	        data.forEach(function(d) {
	          var pass = true;
	          for (k in filter) { if (d[k] != filter[k]) { pass = false; break; } }
	          if (pass === true) { data_to_draw.push(d); }
	        });
	      }

	      var cell = d3.select(this);

	      // Frame
	      cell.append("svg:rect")
	          .attr("class", "frame")
	          .attr("x", padding / 2)
	          .attr("y", padding / 2)
	          .attr("width", size - padding)
	          .attr("height", size - padding);
		  
		  // 散布図の点作成
	  	cell.selectAll("circle")
	  	  .data(data_to_draw)
	  	  .enter().append("svg:circle")
	  	  .attr("class", function(d) { return color_class(d); })
	  	  .attr("cx", function(d) { 
	  	  	return x[p.x](d[p.x]); }
	  	  )
	  	  .attr("cy", function(d) { return y[p.y](d[p.y]); })
	  	  .attr("r", 3)
	  	  .attr("name", function(d) { return d.NAME; })
	  	  .on("mouseover", function(d){
	  	  	//点名称
	  	  	var text = "<div id='name'>" + d.NAME + "</div>";
	  	  	//value明細項目
	  	  	var drillCnt = 0;
	  	  	$.each(self.__numeric_variables, function(i,v){
	  	  		var axis="";
	  	  		var color = "#FFF";
	  	  		if(drill_variables.length > 0){
	  	  			if(v==drill_variables[1]){
	  	  				drillCnt++;
	  	  				color = "#cecece";
	  	  			}
	  	  			else if(v==drill_variables[0]) {
	  	  				drillCnt++;
	  	  				axis = "x.";
	  	  			}else if(i == p.j + drillCnt) axis = "y.";
	  	  			else color = "#cecece";
	  	  		}else{
	  	  			if(i == p.i) axis = "x.";
	  	  			else if(i == p.j) axis = "y.";
	  	  			else color = "#cecece";
	  	  		}
	  	  		text += "<div class='toolValues' style='color:"+ color +";'><span class='spanAxis'>"+ axis +"</span><span class='toolVariablesName'>"+ v +"</span><span class='toolVariablesVal'>"+ thou(d[v]) +"</span></div>";
	  	  	});
	  	  	
	  	  	//ツールチップ
	  	    tooltip.html(text);
	  	    tooltip.style("visibility", "visible").transition().duration(300).style("opacity", "1");
	  	    //$("svg circle[name='"+ d.NAME +"']").css({"stroke":"white","stroke-width":"3px","stroke-opacity":".8"});
	  	    $("svg circle[name='"+ d.NAME +"']").css({"stroke":"white","stroke-opacity":".8"});
	  	    
	  	    //選択円アニメーション
	  	    $("svg circle[name='"+ d.NAME +"']").append(anime1);
	  	    $("svg circle[name='"+ d.NAME +"']").append(anime2);
	  	    $("svg circle[name='"+ d.NAME +"']").attr("r", $("svg circle[name='"+ d.NAME +"']").attr("r")*2);
	  	    
	  	  })
	  	  .on("mousemove", function(d){
	  	  	if(event.pageY < window.innerHeight / 2){
	  	        return tooltip.style("top", (event.pageY+6)+"px").style("left",(event.pageX +6)+"px");
	  	    }else{
	  	        return tooltip.style("top", (event.pageY-$("#tooltip").outerHeight(true)-6) +"px").style("left", (event.pageX+6) +"px");
	  	    }
	  	  })
	  	  .on("mouseout", function(d){
	  	    tooltip.style("opacity", "0").style("visibility", "hidden");
	  	    $("svg circle[name='"+ d.NAME +"']").css({"stroke":"none","stroke-width":null,"stroke-opacity":null});
	  	    
	  	    //選択円アニメーション解除
	  	    $("svg circle[name='"+ d.NAME +"']").remove(anime1);
	  	    $("svg circle[name='"+ d.NAME +"']").remove(anime2);
	  	    $("svg circle[name='"+ d.NAME +"']").attr("r", $("svg circle[name='"+ d.NAME +"']").attr("r")/2);
	  	  });
	  	  	  
		  	// 横軸名称追加、ドリルダウン項目とドリルダウン値の追加
		  	if (drill_variables.length > 1 && p.j == 1) {
		  	  var i = 0;
		  	  for (k in filter) {
		  	    cell.append("svg:text")
		  	        .attr("x", size/2)
		  	        .attr("y", -self.__cell_size -16 -i*14)
		  	        .attr("dy", ".71em")
		  	        .attr("class", "textHorizontalAxis")
		  	        .style("text-anchor", "middle")
		  	        .text(function(d) { return k +': '+ filter[k]; });
		  	    i += 1;
		  	  }
		  	}
		  // Brush
	      cell.call(brush.x(x[p.x]).y(y[p.y]));
	    }
	  
	  //棒グラフ作成
	  function firstPlotHistogram(p) {
		var cell = d3.select(this);
	    
	    var histX = d3.scale.linear()
	    	.range([padding / 2, size - padding / 2]);
	  	var histY = d3.scale.linear()
	    	.range([size - padding / 2, padding / 2]);
	    histX.domain(self.__domainByTrait[p.x]);
	    histY.domain(self.__domainByTrait[p.y]);
	    
	    cell.append("rect")
	        .attr("x", padding / 2)
	        .attr("y", padding / 2)
	        .attr("width", size - padding)
	        .attr("height", size - padding)
	        .attr("fill", "rgba(256,256,256,.3)")

	    // Extract data for histogramming into single array
	    histData = data.map(function(d) {
	      return +d[p.x] ;
	    });

	    // Generate a histogram using twenty uniformly-spaced bins.
	    var hist = d3.layout.histogram()
	      .bins(histX.ticks(25))
	      (histData);

	    var histScale = d3.scale.linear()
	    .domain([0, d3.max(hist, function(d) { return d.y; })])
	    .range([size - padding / 2, padding / 2]);

		var bar = cell.selectAll(".bar")
	      .data(hist)
	      .enter().append("g")
	      .attr("class", "bar")
	      .classed("histogram",true)
	      .attr("transform", function(d) {
	        return "translate(" + histX(d.x) + "," + histScale(d.y) + ")";
	      });

	    bar.append("rect")
	    .classed("histogram",true)
	    .attr("x", 1)
	    .attr("y", function(d) { return (size - padding / 2 - histScale(d.y)) * 0.25})
	    .attr("width", (self.__cell_size/hist.length))
	    .attr("height", function(d) {
	      return (size - padding / 2 - histScale(d.y)) * 0.75;
	    })
	    .attr("class", "rectHistogram")
	    .style("fill", "rgba(54, 244, 232, 0.8)")
	    .on('mouseover', function(d, index){
	    	var text = "<div id='name'>" + p.x + "</div>";
	  	  	text += "<div class='toolValues'><span class='toolVariablesName' style='margin-left:20px;'>Range:</span><span class='toolVariablesVal'>"+ thou(d[d.length-1]) +" ～ "+ thou(d[0]) +"</span></div>";
	  	  	text += "<div class='toolValues'><span class='toolVariablesName' style='margin-left:20px;'>Count:</span><span class='toolVariablesVal'>"+ d.length +"</span></div>";
	  	  	text += "<div class='toolValues'><span class='toolVariablesName' style='margin-left:20px;'>Percentage:</span><span class='toolVariablesVal'>"+ Math.round((d.length/histData.length)*10000)/100 +"%</span></div>";
	  	  	//ツールチップ
	  	    tooltip.html(text);
	  	    tooltip.style("visibility", "visible").transition().duration(300).style("opacity", "1");
	  	    
	  	    $(this).parent().parent().find("rect.rectHistogram").attr("opacity", "0.3");
	  	    $(this).attr("opacity", "1");
	    })
	    .on("mousemove", function(d){
	  	  	if(event.pageY < window.innerHeight / 2){
	  	        return tooltip.style("top", (event.pageY+6)+"px").style("left",(event.pageX +6)+"px");
	  	    }else{
	  	        return tooltip.style("top", (event.pageY-$("#tooltip").outerHeight(true)-6) +"px").style("left", (event.pageX+6) +"px");
	  	    }
	  	})
	  	.on("mouseout", function(d){
	  	    tooltip.style("opacity", "0").style("visibility", "hidden");
	  	    $(this).parent().parent().find("rect.rectHistogram").attr("opacity", "1");
	  	});
	  }
	  
	  //棒グラフの更新
	  function updateHistograms() {
	    d3.selectAll(".histogram")
	      .remove() ;

	    histCells.each(function(p) {

	      var cell = d3.select(this);
		  
		  var histX = d3.scale.linear()
	    	.range([padding / 2, size - padding / 2]);
	      histX.domain(self.__domainByTrait[p.x]);
	      
	      // Filter data down based on selections
	      var histData = data.filter(function(d) {
	        
	        // Has the fuel category been hidden?
	        if (color_variable && !self.__categoryState[color_variable][d[color_variable]]) {
	            return false ;
	        // Is a filter applied and is the point within the bounds of the selected region
	        } else if (filterType[0] !== "none") {
	           if (filterLimits[0][0] > +d[filterType[0]] || +d[filterType[0]] > filterLimits[0][1] ||
	               filterLimits[1][0] > +d[filterType[1]] || +d[filterType[1]] > filterLimits[1][1]) {
	            return false ;
	           }
	        }
	        return true ;
	      }) ;

	      // Extract data for histogramming into single array
	      histData = histData.map(function(d) {
	        return +d[p.x] ;
	      });

	      // Generate a histogram using twenty uniformly-spaced bins.
	      var hist = d3.layout.histogram()
	        .bins(histX.ticks(25))
	        (histData);

	      var histScale = d3.scale.linear()
	      .domain([0, d3.max(hist, function(d) { return d.y; })])
	      .range([size - padding / 2, padding / 2]);

	      var bar = cell.selectAll(".bar")
	        .data(hist)
	        .enter().append("g")
	        .attr("class", "bar")
	        .classed("histogram",true)
	        .attr("transform", function(d) {
	          return "translate(" + histX(d.x) + "," + histScale(d.y) + ")";
	        });

	      bar.append("rect")
	      .attr("class", "rectHistogram")
	      .attr("x", 1)
	      .attr("y", function(d) { return (size - padding / 2 - histScale(d.y)) * 0.25})
	      .attr("width", (self.__cell_size/hist.length)) //x(hist[0].dx) )
	      .attr("height", function(d) {
	        return (size - padding / 2 - histScale(d.y)) * 0.75;
	      })
	      .style("fill", "rgba(54, 244, 232, 0.8)")
	      .on('mouseover', function(d, index){
		    	var text = "<div id='name'>" + p.x + "</div>";
		  	  	text += "<div class='toolValues'><span class='toolVariablesName' style='margin-left:20px;'>Range:</span><span class='toolVariablesVal'>"+ thou(d[d.length-1]) +" ～ "+ thou(d[0]) +"</span></div>";
		  	  	text += "<div class='toolValues'><span class='toolVariablesName' style='margin-left:20px;'>Count:</span><span class='toolVariablesVal'>"+ d.length +"</span></div>";
		  	  	text += "<div class='toolValues'><span class='toolVariablesName' style='margin-left:20px;'>Percentage:</span><span class='toolVariablesVal'>"+ Math.round((d.length/histData.length)*10000)/100 +"%</span></div>";
		  	  	//ツールチップ
		  	    tooltip.html(text);
		  	    tooltip.style("visibility", "visible").transition().duration(300).style("opacity", "1");
		  	    
		  	    $(this).parent().parent().find("rect.rectHistogram").attr("opacity", "0.3");
		  	    $(this).attr("opacity", "1");
		  })
		  .on("mousemove", function(d){
		  	  	if(event.pageY < window.innerHeight / 2){
		  	        return tooltip.style("top", (event.pageY+6)+"px").style("left",(event.pageX +6)+"px");
		  	    }else{
		  	        return tooltip.style("top", (event.pageY-$("#tooltip").outerHeight(true)-6) +"px").style("left", (event.pageX+6) +"px");
		  	    }
		  })
		  .on("mouseout", function(d){
		  	    tooltip.style("opacity", "0").style("visibility", "hidden");
		  	    $(this).parent().parent().find("rect.rectHistogram").attr("opacity", "1");
		  });
	    }) ;
	  }
	  
	  //関係係数の更新
	  function MakeRelationshipCoefficient() {
	  
		//選択状態のサークル取得
		var targetData = data.filter(function(d) {
			// Has the fuel category been hidden?
			if (color_variable && self.__categoryState.hasOwnProperty(color_variable) &&!self.__categoryState[color_variable][d[color_variable]]) {
			    return false ;
			// Is a filter applied and is the point within the bounds of the selected region
			} else if (filterType[0] !== "none") {
			   if (filterLimits[0][0] > +d[filterType[0]] || +d[filterType[0]] > filterLimits[0][1] ||
			       filterLimits[1][0] > +d[filterType[1]] || +d[filterType[1]] > filterLimits[1][1]) {
			    return false ;
			   }
			}
			return true ;
		}) ;
		
		cell.filter(function(d) { return d.i > d.j; })
	     .each(function(p, index){
	     	var cell = d3.select(this);
	     	
	     	cell.select("rect.frame").remove();
	     	cell.append("svg:rect")
	          .attr("class", "frame")
	          .attr("x", padding / 2)
	          .attr("y", padding / 2)
	          .attr("width", size - padding)
	          .attr("height", size - padding);
	          
	     	var ans = "-";
	     	//相関係数の算出
	     	if(targetData.length > 1){
	     		ans = {};
	     		xAve = targetData.map(function(d) {return +d[p.x];}).reduce(function(prev, current, i, arr) {return prev+current;}) / targetData.length;
			  	yAve = targetData.map(function(d) {return +d[p.y];}).reduce(function(prev, current, i, arr) {return prev+current;}) / targetData.length;
			  	ans.x = 0;
			  	ans.y = 0;
			  	ans.covariance = 0;
			  	$.each(targetData, function(i, v){
			  		ans.x += Math.pow(v[p.x] - xAve, 2);
			  		ans.y += Math.pow(v[p.y] - yAve, 2);
			  		ans.covariance += (v[p.x] - xAve) * (v[p.y] - yAve);
			  	});
			  	if(ans.x == 0 || ans.y == 0) ans = 0;
			  	else ans = (ans.covariance / targetData.length) / Math.sqrt(ans.x/targetData.length) / Math.sqrt(ans.y/targetData.length);
	     	}
		  	
		  	cell.select("text.textRelationshipCoefficient").remove();
		  	cell.append("svg:text")
		      .attr("class", "textRelationshipCoefficient")
		      .attr("dx", function(d) { return self.__cell_size/2; })
		      .attr("dy", function(d) { 
		      	return self.__cell_size/2 + self.__cell_size/8 * (ans=="-"?0:Math.abs(ans));
		      })
		      .attr("font-size", 10 + self.__cell_size/5 * Math.abs(ans))
		      .attr("text-anchor", "middle")
		      .text(ans=="-"?"-":ans.toFixed(2));
	     }) ;
	     
	     //平均値算出
	     cell.select("text.textXAxisAverage").remove();
	     cell.filter(function(d) { return d.j == 0; })
		  	.each(function(p, index){
		  		if(targetData.length >= 1){
		  		 xAve = Math.round(targetData.map(function(d) {return +d[p.x];}).reduce(function(prev, current, i, arr) {return prev+current;}) / targetData.length);
		  		}else{
		  		 xAve = '-';
		  		}
	     		var cell = d3.select(this);
			    cell.filter(function(d) { return d.j == 0;}).append("svg:text")
			      .attr("class", "textXAxisAverage")
			      .attr("y", -6)
			      .attr("dx", function(d) { return self.__cell_size/2; })
			      .attr("font-size", self.__cell_size/10)
			      .attr("text-anchor", "middle")
			      .text("avg: "+ thou(xAve));
			});
		}
		
		function DrawAvgLine(){
			//選択状態のサークル取得
			var targetData = data.filter(function(d) {
				// Has the fuel category been hidden?
				if (color_variable && self.__categoryState.hasOwnProperty(color_variable) &&!self.__categoryState[color_variable][d[color_variable]]) {
				    return false ;
				// Is a filter applied and is the point within the bounds of the selected region
				} else if (filterType[0] !== "none") {
				   if (filterLimits[0][0] > +d[filterType[0]] || +d[filterType[0]] > filterLimits[0][1] ||
				       filterLimits[1][0] > +d[filterType[1]] || +d[filterType[1]] > filterLimits[1][1]) {
				    return false ;
				   }
				}
				return true ;
			}) ;
		
			//基準線作成
			cell.selectAll('.lineAvg').remove();
			if(targetData.length >= 1){
			    cell.filter(function(d) { return d.j > d.i; })
			      .each(function(p, index){
			          
			    	  xAve = targetData.map(function(d) {return +d[p.x];}).reduce(function(prev, current, i, arr) {return prev+current;}) / targetData.length;
					  yAve = targetData.map(function(d) {return +d[p.y];}).reduce(function(prev, current, i, arr) {return prev+current;}) / targetData.length;
					  
					  var cell = d3.select(this);
			          cell.select('.gAvgAxis').append("svg:line")
					  	  .attr("class", "lineAvg" )
					  	  .attr("x1", function(d) { 
					  	  	return x[p.x](xAve); }
					  	  )
					  	  .attr("x2", function(d) { 
					  	  	return x[p.x](xAve); }
					  	  )
					  	  .attr("y1", 0)
					  	  .attr("y2", self.__cell_size);
					  
					  cell.select('.gAvgAxis').append("svg:line")
					  	  .attr("class", "lineAvg" )
					  	  .attr("y1", function(d) { 
					  	  	return y[p.y](yAve); }
					  	  )
					  	  .attr("y2", function(d) { 
					  	  	return y[p.y](yAve); 
					  	  })
					  	  .attr("x1", 0)
					  	  .attr("x2", self.__cell_size);
				})
			}
		}
	  
	    // Clear the previously-active brush, if any
	    function brushstart(p) {
	      isZoom = false;
	      if (brush.data !== p) {
	        if(drill_variables.length == 0){
	    		cell.filter(function(d) { return (d.i !== d.j && d.j > d.i);})
	    		  .call(brush.clear());
	    	}else cell.call(brush.clear());
	        brush.x(x[p.x]).y(y[p.y]).data = p;
	      }
	    }

	    // Highlight selected circles
	    function brush(p) {
	      var e = brush.extent();
	      svg.selectAll(".cell circle").attr("class", function(d) {
	        return e[0][0] <= d[p.x] && d[p.x] <= e[1][0]
	            && e[0][1] <= d[p.y] && d[p.y] <= e[1][1]
	            ? color_class(d) : null;
	      });
	      
			// Identify subselections for histograms
			filterType = [p.x,p.y] ;
			filterLimits = [ [+e[0][0],+e[1][0]],
			                 [+e[0][1],+e[1][1]]
			               ] ;
			if (filterLimits[0][0] == filterLimits[0][1] && filterLimits[1][0] == filterLimits[1][1]) filterType = ["none","none"] ;
	        
	        if(drill_variables.length == 0){
	        	MakeRelationshipCoefficient();
	        	updateHistograms();
	        }
	    }

	    // If brush is empty, select all circles
	    function brushend() {
	      if (brush.empty()) svg.selectAll(".cell circle").attr("class", function(d) {
	        return color_class(d);
	      });
	      
	      if(drill_variables.length == 0) {
	      	updateHistograms();
	      	MakeRelationshipCoefficient();
	      	DrawAvgLine();
	      }
	      isZoom = true;
	    }

	    function cross(a, b) {
	      var c = [], n = a.length, m = b.length, i, j;
	      for (i = -1; ++i < n;) for (j = -1; ++j < m;) c.push({x: a[i], i: i, y: b[j], j: j});
	      return c;
	    }
	    
	    ScatterplotMatrix.prototype.__SerchCircle = function(){
	    	d3.selectAll("g.cell circle").style("opacity", 0.1);
	    	var circleCount = d3.selectAll("g.cell circle")[0].length;
			var target = $(this)[0].value.toLowerCase();
			var circle = d3.selectAll("g.cell circle").filter(function(d) {
	        	return (d.NAME.toLowerCase().indexOf(target) != -1)
	        });
	        circle.style("opacity",  1)
	        if(circle[0].length == circleCount ) $("#txtSearchResult").text("");
	        else if(circle[0].length > 0) $("#txtSearchResult").text((circle[0].length/(Math.sqrt(cell[0].length)*(Math.sqrt(cell[0].length)-1)/2)) +" 件ヒットしました");
	        else $("#txtSearchResult").text("検索結果なし");
	    }
	  }); 
	};

	//データ切替時にエレメントを削除する
	$(".refreshElement").remove();
	
	//ローディング削除
	if(document.getElementById("loadingDiv")){
		$("#loadingDiv").css("display","block");
		$("#loadingDiv").css({
	        "opacity": "1",
	        "-webkit-transition": "1s",
	        "transition": "1s"
	    });
	}else{
		//loading表示
		$("body").append("<div id='loadingDiv'>");
		$("#loadingDiv").css({
			"width": "100%",
		    "background": "#000",
		    "height": "100%",
		    "position": "absolute",
		    "top": "0px",
		    "z-index":"5",
		}).append("<div class='gifDiv blinking'></div>").append("<span>loading...</span>");
		$("#loadingDiv span").css({
			"position": "absolute",
		    "text-align": "center",
		    "width":"100%",
		    "color": "rgba(33, 150, 243, 0.8)",
		    "font-size": "24px",
		    "top": (window.innerHeight/2)+"px",
		});
		$("#loadingDiv .gifDiv").css("text-align", "center").append('<div class="loadingCircle1"></div><div class="loadingCircle2"></div>');
	    $("#loadingDiv .gifDiv").css("margin-top", $("#loadingDiv span").position().top -100);
	}
    
	$.ajax({
	    type: 'GET',
	    url: MakeUrl(ScatterMatrix.data),
	    dataType: 'json',
	    success: function(json){
	    	//ローディング削除
	    	$("#loadingDiv").css({
	            "opacity": "0",
	            "-webkit-transition": "1s",
	            "transition": "1s",
	            "background": "none"
	        });
	        setTimeout(function(){
	            $("#loadingDiv").css("display","none");
	        }, 1000);
	    	
	    	if(json.data && json.data.length > 0) {
	        	var sm = new ScatterplotMatrix(null, json.data, "sb-site");
				sm.render();
			}else{
				window.alert(json.error_detail);
			}
		},
	});
	
	$("#sb-site").children().remove();
	$("#dockbar-container").css("display", "none");
	$("#wrapper, #add-btn-area").css("display", "none");
	$("#sb-site").css("background", "url('"+ MakePath("img/background.jpg") +"')");

	//ソフトバンクロゴ
	$("body").append("<div id='sumaryDiv' style='position: absolute;bottom: 12px;right: 12px;' class='refreshElement'>");
	var headerHtml = '<img style="height: 30px" alt="logo02" src="'+ MakePath('icon/icon_softbank_blk.png') +'">';
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

	//検索ウィンドウ
	$("body").append("<div id='txtSearchResult' class='refreshElement'></div><div id='txtSearch' ><input type='text' placeholder='search…' id='inputSearch' autofocus></div>");

	//メニューボタン作成
	var menuIconSvg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
	menuIconSvg.setAttribute("id", "svgMenu");
	menuIconSvg.setAttribute("class", "refreshElement");
	menuIconSvg.setAttribute("height", 40);
	menuIconSvg.setAttribute("width", 40);
	menuIconSvg.setAttribute("style", "position: absolute;left: 20px;top: 20px;background: rgba(0,0,0,0.8);z-index: 9999;border-radius: 20px;");
	$("body").append(menuIconSvg);
	$("#svgMenu").append(CreateImage({"x":"10", "y":"10", "id":"menuRect", "width":"20", "height":"20", "title":"menu", "href":MakePath("icon/icon_SoftbankFlag.png")}));
	//基盤のメニューウィンドウを表示する
	$("#menuRect").on("click", function(){
	    $('#menu').trigger("click");
	});
	
	//ウィンドウクローズ
	var isOpenSideWindow = true;
	$("#divTime").append('<div><img class="active tooltipIcon" id="windowCloseImage" xlink:title="windowClose" width="20" height="20" src="'+ MakePath('icon/icon_close.png') +'"></div>');
	$("#windowCloseImage").on("click", function(){
		if(isOpenSideWindow){
			d3.select("div.scatter-matrix-control").transition().duration(300).style("transform", "translateX("+ $("div.scatter-matrix-control").outerWidth(true) +"px)");
			d3.select("#windowCloseImage").transition().duration(300).style("transform", "rotate(180deg)");
			isOpenSideWindow = false;
		}else{
			d3.select("div.scatter-matrix-control").transition().duration(300).style("transform", "translateX(0px)");
			d3.select("#windowCloseImage").transition().duration(300).style("transform", "rotate(0deg)");
			isOpenSideWindow = true;
		}
	})
	
	//リサイズ
	$(window).on('resize', function(){
		$(".scatter-matrix-svg svg").width(window.innerWidth);
	});
	
	this.finished = true;
}
window.ScatterMatrix = ScatterMatrix;
