//クラス定義
var ThreeDD = {};
ThreeDD.data;
ThreeDD.finished = false;
ThreeDD.main = function(){
	
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
	loadCss(MakePath("css/dashboard.css"));
	
	//画面リサイズで再実行されないように(暫定対応)
	if(this.finished) return 
	var _data = ThreeDD.data;
	
	/////////////////////////
	//関数
	/////////////////////////
	function Tricks(){
		$("#layout-column_column-1").children().remove();
	}
	Tricks();
	
	function MakeUrl(str){
		return site_settings.graphInfoServiceSSL + site_settings.graphInfoServiceIP + "/graphservice/" + str + "?sessionId=" + site_settings.sessionId;
	}
	
	function MakePath(str){
		return "/html/" + str;
		return site_settings.graphInfoServiceSSL + site_settings.graphInfoServiceIP + "/BigScreen/" + str;
	}
	
	var GetUrlVars = function(){
	    var vars = {}; 
	    var param = location.search.substring(1).split('&');
	    for(var i = 0; i < param.length; i++) {
	        var keySearch = param[i].search(/=/);
	        var key = '';
	        if(keySearch != -1) key = param[i].slice(0, keySearch);
	        var val = param[i].slice(param[i].indexOf('=', 0) + 1);
	        if(key != '') vars[key] = decodeURI(val);
	    } 
	    return vars; 
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
	
	function SumHashArray(hash){
	    var sum = 0;
	    $.each(hash, function(i, v){
	        sum =  sum + Number(v);
	    });
	    return sum
	}

	function init() {
		camera = new THREE.PerspectiveCamera(40, window.width/window.height , 1, 10000 *resolutionZoom);
		camera.position.z = 3000 * resolutionZoom;
		
		isAnimateHand = true;
		controls = new THREE.OrbitControls( camera );
		controls.rotateSpeed = 0.1;
		controls.zoomSpeed = 1.2;
		controls.panSpeed = 0.5;
		controls.noZoom = false;
		controls.noPan = false;
		controls.staticMoving = false;
		controls.dynamicDampingFactor = 0.1;
		controls.minDistance = 100 * resolutionZoom;   //近づける距離の最小値
		controls.maxDistance = 6000 * resolutionZoom;
		controls.addEventListener('change', ReversalPanel);

		geometry = new THREE.CubeGeometry( 200, 300, 400 );
		
		///////////////////////////////////////////////
		//ミニグラフ定義
		///////////////////////////////////////////////
		scene2 = new THREE.Scene();
		//ミニグラフのサイズ定義
	    var width  = 230 * resolutionZoom,
	        height = 160 * resolutionZoom;
	        
		//グラフ描画用のDIV生成
	    elements = d3.selectAll('.element')
	        .data(_data).enter()
	        .append('div')
	        //.attr('class', 'element')
	        .attr('class', function(d){
	        	if(d.hasOwnProperty("recs")) return 'element dataPanel';
	        	else return 'element categoryPanel';
	        })
	        .attr('id', function(e, i){
	        	return "divPanel" + i;
	        })
	        .style("width",  width + "px")
	        .style("height", height + "px")
	        .style("color", "rgba(145, 145, 145, 0.75)")
	        .style("background", "rgba(145, 145, 145, 0.75)")
	        .on('click', MoveCameraObject);
	    
	    //カテゴリパネル作成
		$.each(_data, function(i, v){
			if(!v.hasOwnProperty("recs")){
				$("#divPanel" + i).append("<div class='categoryDiv'>"+ v.classification +"</div>");
			}
		});
		//カテゴリパネルのデザイン調整
		$(".categoryDiv").css({
			"display":"table-cell",
		    "height":height + "px",
		    "line-height":height + "px",
		    "width":width + "px",
		    "vertical-align":"middle",
		    "text-align":"center",
		    "font-size":"48px",
		    "color":"white",
		});
		
		//グラフ用DIV
	    elements.append('div')
	      .attr('class', function(e){
	      	if(e.hasOwnProperty("recs")) return "chartDiv"; 
	      	else return "";
	      })
	      .attr('id', function(e, i){
	      	return "divChart" + i;
	      })
	      .style('width', '100%')
	      .style('height', '90%')
	      .style('margin-top', '7%')
	      .style('margin-bottom', '3%');
	    
		//グラフ名用DIV
	    elements.append('div')
	      .attr('class', 'chartTitle')
	      .html(function (d) {
	      	if(d.hasOwnProperty("recs")) return d.name; 
	      	else return "";
	      });
	      
	      $("div.chartTitle")
	      .css("font-size", Number($("div.chartTitle").css("font-size").slice(0,-2)) *resolutionZoom)
	      .css("top", Number($("div.chartTitle").css("top").slice(0,-2)) *resolutionZoom)
	      .css("left", Number($("div.chartTitle").css("left").slice(0,-2)) *resolutionZoom);
		
		//loading表示
		$(".chartDiv").append("<div class='loadingGraphDiv' style='text-align:center; margin-top: 36%; font-size: 24px; color:rgba(256,256,256,0.5)'>Loading...<div>");
		
		//座標を設定
		elements.each(SetPosition);
		
		//シーンへの初期配置処理
		$.each(elements[0], function(i, v){
			object = new THREE.CSS3DObject(v);
		    //object.position = v['__data__'].helix.position;
		    object.position.fromArray(v['__data__'].helix.position);
		    object.rotation.fromArray(v['__data__'].helix.rotation);
		    scene2.add(object);
		});
		
		renderer2 = new THREE.CSS3DRenderer();
		renderer2.setSize( window.innerWidth, window.innerHeight );
		renderer2.domElement.style.position = 'absolute';
		renderer2.domElement.style.top = 0;
		document.getElementById('container').appendChild(renderer2.domElement);
	}

	var isAnimateHand = false;
	var isAnimateAuto = false;
	var isAnimateFly = false;
	var isAnimateCircle = false;
	var piRotate;
	function animate() {
		requestAnimationFrame(animate);
		
		if(isAnimateHand) controls.update();
		
		if(isAnimateAuto) {
			if(displyStyle == "sphere"){
				theta = (oldTimeSeconds + clockAutoRotate.getElapsedTime()) / 50;
				piRotate =  Math.cos(theta/5) * (Math.PI/2);
				camera.position.x = (borderInside.sphere + 300) * resolutionZoom * Math.sin(theta) * Math.cos(piRotate);
			    camera.position.y = (borderInside.sphere + 300) * resolutionZoom * Math.sin(piRotate);
			    camera.position.z = (borderInside.sphere + 300) * resolutionZoom * Math.cos(theta) * Math.cos(piRotate);
		    }else{
		    	theta = (oldTimeSeconds + clockAutoRotate.getElapsedTime()) / 100;
		    	camera.position.x = 1500*resolutionZoom * Math.sin(theta);
			    camera.position.y = ((4*dataCount) * Math.cos(theta) + (2*dataCount))*resolutionZoom; //水面下に入らないように
			    camera.position.z = 1500*resolutionZoom * Math.cos(theta);
		    }
		    camera.lookAt(new THREE.Vector3(0, 0, 0));
		}
		
		if(isAnimateFly){
			var deltaFly = clockFly.getDelta();
			controls.update(deltaFly);
		}
		
		if(isAnimateCircle){
			theta = oldTimeCircle + (clockCircle.getElapsedTime()/(5*dataCount)) ;
			r = 40 * dataCount;
			$.each(scene2.children, function(i, v){
				var circle = new THREE.Object3D();
				var vector = new THREE.Vector3();
				var phi = 2 * i/dataCount * Math.PI + theta;
				var phi_dash = (2 * (i)/dataCount +  0.25) * Math.PI + theta;
				circle.position.set(((r * Math.sin(phi))+(0.75 * r)) *resolutionZoom, 0, (r * Math.cos(phi)) *resolutionZoom);
				
				vector.x = Math.SQRT2 * r * Math.sin(phi_dash) * resolutionZoom;
				vector.y = 0;
				vector.z = Math.SQRT2 * r * Math.cos(phi_dash) * resolutionZoom;
				circle.lookAt(vector);
				
				v.position.set(circle.position.x, circle.position.y, circle.position.z);
				v.rotation.set(circle.rotation.x, circle.rotation.y, circle.rotation.z);
			});
		    camera.lookAt(new THREE.Vector3(0, 0, 0));
		}
		
		TWEEN.update();
		renderer2.render( scene2, camera );
	}

	function WindowResize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
	}

	function SetPosition(d, i) {
		var vector, phi, theta;
		
		if(filterCategory){
			dataCount = elements.filter(function(element, index, array) {
				return (element.classification == filterCategory );
			})[0].length;
		}else{
			dataCount = elements[0].length;
		}
		
		if(dataCount <= 4) borderInside.sphere = 180;
		else if(dataCount <= 8) borderInside.sphere = 220;
		else if(dataCount <= 12) borderInside.sphere = 260;
		else if(dataCount <= 16) borderInside.sphere = 300;
		else if(dataCount <= 20) borderInside.sphere = 340;
		else if(dataCount <= 24) borderInside.sphere = 380;
		else borderInside.sphere = 380 + (dataCount-24) * 8;
		
		//borderInside.helix = 1000;
		if(dataCount >= 25) {
			borderInside.helix = 1000;
			borderInside.phi = 0.25;
		}else if(dataCount >= 10){
			borderInside.helix  = 40 * dataCount;
			borderInside.phi = Math.PI * 2 / dataCount;
		}else{
			 borderInside.helix = 400;
			 borderInside.phi = 0.62;
		}
		
		var random = new THREE.Object3D();
		random.position.x = (Math.random() * 4000 - 2000)*resolutionZoom;
		random.position.y = (Math.random() * 4000 - 2000)*resolutionZoom;
		random.position.z = (Math.random() * 4000 - 2000)*resolutionZoom;
		d['random'] = random;
		
		//フィルタ対象外は原点配置
		if(filterCategory && filterCategory != d.classification){
			var origin = {position:{x:0,y:0,z:0},rotation:{x:0,y:0,z:0}};
			d['sphere'] = origin;
			d['sphere_i'] = origin;
			d['helix'] = origin;
			d['helix_i'] = origin;
			d['circle'] = origin;
			d['straight'] = origin;
			d['table'] = origin;
			d['grid'] = origin;
			filterCnt++;
		}else{
			
			//天体_外向き
			var sphere = new THREE.Object3D();
			vector = new THREE.Vector3();
			phi = Math.acos(-1 + ( 2 * (i-filterCnt) ) / (dataCount - 1));
			theta = Math.sqrt(dataCount * Math.PI) * phi;
			sphere.position.x = (borderInside.sphere * Math.cos(theta) * Math.sin(phi)) *resolutionZoom;
			sphere.position.y = (borderInside.sphere * Math.sin(theta) * Math.sin(phi)) *resolutionZoom;
			sphere.position.z = (borderInside.sphere * Math.cos(phi)) *resolutionZoom;
			vector.copy(sphere.position).multiplyScalar(2);
			sphere.lookAt(vector);
			d['sphere'] = sphere;
			
			//天体_内向き
			var sphere_i = new THREE.Object3D();
			vector = new THREE.Vector3();
			phi = Math.acos(-1 + ( 2 * (i-filterCnt) ) / (dataCount - 1));
			theta = Math.sqrt(dataCount * Math.PI) * phi;
			sphere_i.position.x = (borderInside.sphere * Math.cos(theta) * Math.sin(phi)) *resolutionZoom;
			sphere_i.position.y = (borderInside.sphere * Math.sin(theta) * Math.sin(phi)) *resolutionZoom;
			sphere_i.position.z = (borderInside.sphere * Math.cos(phi)) *resolutionZoom;
			vector.copy(sphere_i.position).multiplyScalar(0.5);
			sphere_i.lookAt(vector);
			d['sphere_i'] = sphere_i;
			
			//螺旋_外向き
			var helix = new THREE.Object3D();
			vector = new THREE.Vector3();
			phi = ((i-filterCnt) + 12) * borderInside.phi + Math.PI;
			helix.position.x = (borderInside.helix * Math.sin(phi))*resolutionZoom;
			helix.position.y = (- ((i-filterCnt) * 8) + (dataCount/25)*100)*resolutionZoom;
			helix.position.z = (borderInside.helix * Math.cos(phi))*resolutionZoom;
			vector.x = helix.position.x * 2 *resolutionZoom;
			vector.y = helix.position.y *resolutionZoom;
			vector.z = helix.position.z * 2 *resolutionZoom;
			helix.lookAt(vector);
			d['helix'] = helix;
			
			//螺旋_内向き
			var helix_i = new THREE.Object3D();
			vector = new THREE.Vector3();
			phi = ((i-filterCnt) + 12) * borderInside.phi + Math.PI;
			helix_i.position.x = (borderInside.helix * Math.sin(phi))*resolutionZoom;
			helix_i.position.y = (- ((i-filterCnt) * 8) + (dataCount/25)*100)*resolutionZoom;
			helix_i.position.z = (borderInside.helix * Math.cos(phi))*resolutionZoom;
			vector.copy(helix_i.position).multiplyScalar(0.5)
			helix_i.lookAt(vector);
			d['helix_i'] = helix_i;
			
			//円形順列
			var circle = new THREE.Object3D();
			vector = new THREE.Vector3();
			r = 40 * dataCount * resolutionZoom;
			phi = 2 * (i-filterCnt)/dataCount * Math.PI;
			phi_dash = (2 * (i-filterCnt)/dataCount +  0.25) * Math.PI;
			circle.position.x = (r * Math.sin(phi))+(0.75 * r);
			circle.position.y = 0;
			circle.position.z = r * Math.cos(phi);
			vector.x = Math.SQRT2 * r * Math.sin(phi_dash);
			vector.y = 0;
			vector.z = Math.SQRT2 * r * Math.cos(phi_dash);
			circle.lookAt(vector);
			d['circle'] = circle;
			
			//直列順列
			var straight = new THREE.Object3D();
			straight.position.x = 0;
			straight.position.y = 0;
			straight.position.z = (dataCount - (i-filterCnt))*straightLength - (dataCount/2 * straightLength);
			d['straight'] = straight;
			
			//マトリックス表示
			var grid = new THREE.Object3D();
			grid.position.x = ((( (i-filterCnt) % 5 ) * 400) - 800)*resolutionZoom ;
			grid.position.y = (( - ( Math.floor( (i-filterCnt) / 5 ) % 5 ) * 400 ) + 800)*resolutionZoom ;
			grid.position.z = ((Math.floor( (i-filterCnt) / 25 )) * 1000 - 2000)*resolutionZoom ;
			d['grid'] = grid;
			
			//表形式表示
			var table = new THREE.Object3D();
			var sqrt =  Math.ceil(Math.sqrt(dataCount));
			table.position.x = ((((i-filterCnt) % sqrt ) * 300) - (150 * sqrt))*resolutionZoom + 450;
			table.position.y = (( - ( Math.floor( (i-filterCnt) / sqrt ) % sqrt ) * 200 ) + (100 * sqrt))*resolutionZoom - 300;
			table.position.z = 2000;
			d['table'] = table;
		}
	}
	//パネル反転
	function ReversalPanel(e, callback){
		var target = $("#menuDisplay button.active").text();
		if(!borderInside[target]) return;
		var distance = Math.sqrt(Math.pow(camera.position.x,2) + Math.pow(camera.position.y,2) + Math.pow(camera.position.z,2));
		if(distance < borderInside[target]*resolutionZoom && !isDirectionInside){
			isDirectionInside = true;
			Transform($("#menuDisplay button.active").text() + "_i", 1000, callback); 
		}else if(distance > borderInside[target]*resolutionZoom && isDirectionInside){
			isDirectionInside = false;
			Transform($("#menuDisplay button.active").text(), 1000, callback); 
		}
	}
	//パネル反転(条件逆))
	function ReversalPanelAntithesis(e, callback){
		var target = $("#menuDisplay button.active").text();
		if(!borderInside[target]) return;
		var distance = Math.sqrt(Math.pow(camera.position.x,2) + Math.pow(camera.position.y,2) + Math.pow(camera.position.z,2));
		if(distance > borderInside[target]*resolutionZoom && !isDirectionInside){
			isDirectionInside = true;
			Transform($("#menuDisplay button.active").text() + "_i", 1000, callback); 
		}else if(distance < borderInside[target]*resolutionZoom && isDirectionInside){
			isDirectionInside = false;
			Transform($("#menuDisplay button.active").text(), 1000, callback); 
		}
	}
	//パネル位置確認
	function CheackInside(e){
		var target = $("#menuDisplay button.active").text();
		if(!borderInside[target]) return false;
		var distance = Math.sqrt(Math.pow(camera.position.x,2) + Math.pow(camera.position.y,2) + Math.pow(camera.position.z,2));
		if(distance < borderInside[target]*resolutionZoom){
			return true;
		}else return false;
	}

	function Transform(layout, duration, callback) {
		TWEEN.removeAll();
		r = 40 * dataCount;
		
		//パネルの表示非表示制御
		elements.style('display', 'block')
			.transition().duration(duration)
			.style('opacity', function(d){
				if(filterCategory && filterCategory != d.classification) return 0;
				else if ($("#inputSearch").get(0) && d.name.toLowerCase().indexOf($("#inputSearch").get(0).value.toLowerCase()) == -1) return 0.05;
				else return 1;
			})
			.transition()
			.duration(1)
			.delay(duration)
			.style('display', function(d){
				if(filterCategory){
					if(filterCategory != d.classification) return "none";
					else return "block";
				}
			});
		
		//パネルの移動
		$.each(scene2.children, function(i, v){
			
			var newPos;
			var newRot;
			
			if(layout == "circle"){
				var circle = new THREE.Object3D();
				var vector = new THREE.Vector3();
				var phi = 2 * i/dataCount * Math.PI + oldTimeCircle;
				var phi_dash = (2 * (i)/dataCount +  0.25) * Math.PI + oldTimeCircle;
				
				newPos={x:((r*Math.sin(phi))+(0.75 * r))*resolutionZoom, y:0, z:(r*Math.cos(phi))*resolutionZoom};
				
				vector.x = Math.SQRT2 * r * Math.sin(phi_dash) * resolutionZoom;
				vector.y = 0;
				vector.z = Math.SQRT2 * r * Math.cos(phi_dash) * resolutionZoom;
				circle.lookAt(vector);
				
				newRot = circle.rotation;
				
			}else{
				newPos = v.element.__data__[layout].position;
				newRot = v.element.__data__[layout].rotation;
			}
			
			var coords = new TWEEN.Tween(v.position)
			    .to({x: newPos.x, y: newPos.y, z: newPos.z}, Math.random() * duration + duration)
			    .easing(TWEEN.Easing.Exponential.InOut)
			    .start();
			
			var rotate = new TWEEN.Tween(v.rotation)
			    .to({x: newRot.x, y: newRot.y, z: newRot.z}, Math.random() * duration + duration)
			    .easing(TWEEN.Easing.Exponential.InOut)
			    .start();
		});

		var update = new TWEEN.Tween(this)
			.to({}, duration * 2)
			.onComplete(function(){
				if(callback) callback();
			})
			.start();
	}
	function MoveCameraObject(e){
		//移動中はパネル反転中止
		controls.removeEventListener('change', ReversalPanel);
		
		//カメラの移動前ポジション
		var from = {
		    x: camera.position.x,
		    y: camera.position.y,
		    z: camera.position.z
		};
		//カメラの移動後ポジション
		var margin;
		if(dataCount >= 25) margin = 1.25;
		else if(dataCount >= 10) margin = 1.25 + 0.023 * (25 - dataCount);
		else margin = 1.6;
		
		var to = {
		    x: e[$("#menuDisplay button.active").text()].position.x * margin,
		    y: e[$("#menuDisplay button.active").text()].position.y * margin,
		    z: e[$("#menuDisplay button.active").text()].position.z * margin,
		};
		var tween = new TWEEN.Tween(from)
		    .to(to, 300)
		    .easing(TWEEN.Easing.Linear.None)
		    .onUpdate(function () {
		        camera.position.set(this.x, this.y, this.z);
		        if($("#menuDisplay button.active").text() != "grid")
		        	camera.lookAt(new THREE.Vector3(0, 0, 0));
			})
		    .onComplete(function () {
		        if($("#menuDisplay button.active").text() != "grid")
		        	camera.lookAt(new THREE.Vector3(0, 0, 0));
		        ReversalPanel();
		        controls.addEventListener('change', ReversalPanel);
		    })
		    .start();
	}
	function MoveCameraCircleObject(e){
		//elementの移動
		theta = 86/50*Math.PI - (2*e.index*Math.PI/dataCount);
		clockCircle.stop();
		isAnimateCircle = false;
		r = 40 * dataCount;
		$.each(scene2.children, function(i, v){
			var circle = new THREE.Object3D();
			var vector = new THREE.Vector3();
			var phi = 2 * i/dataCount * Math.PI + theta;
			var phi_dash = (2 * (i)/dataCount +  0.25) * Math.PI + theta;
			circle.position.set(((r * Math.sin(phi))+(0.75 * r)) *resolutionZoom, 0, (r * Math.cos(phi)) *resolutionZoom);
			
			vector.x = Math.SQRT2 * r * Math.sin(phi_dash) * resolutionZoom;
			vector.y = 0;
			vector.z = Math.SQRT2 * r * Math.cos(phi_dash) * resolutionZoom;
			circle.lookAt(vector);
			
			var from = {
			    x_pos: v.position.x, y_pos: v.position.y, z_pos: v.position.z,
			    x_rot: v.rotation.x, y_rot: v.rotation.y, z_rot: v.rotation.z,
			};
			//カメラの移動後ポジション
			var to = {
				x_pos: circle.position.x, y_pos: circle.position.y, z_pos: circle.position.z,
				x_rot: circle.rotation.x, y_rot: circle.rotation.y, z_rot: circle.rotation.z,
			};
			var tween = new TWEEN.Tween(from)
			    .to(to, 300)
			    .easing(TWEEN.Easing.Linear.None)
			    .onUpdate(function () {
			        v.position.set(this.x_pos, this.y_pos, this.z_pos);
			        v.rotation.set(this.x_rot, this.y_rot, this.z_rot);
				})
				.start();
		});
		
		//カメラの移動前ポジション
		var from = {
		    x: camera.position.x,
		    y: camera.position.y,
		    z: camera.position.z
		};
		//カメラの移動後ポジション
		var to = {
		    x: 0,
		    y: 0,
		    z: 30 * dataCount * resolutionZoom,
		};
		var tween = new TWEEN.Tween(from)
		    .to(to, 300)
		    .easing(TWEEN.Easing.Linear.None)
		    .onUpdate(function () {
		    	camera.position.set(this.x, this.y, this.z);
		        camera.lookAt(new THREE.Vector3(0, 0, 0));
			})
		    .onComplete(function () {
		    	oldTimeCircle = theta;
		    	clockCircle.start();
				isAnimateCircle = true;
		        camera.lookAt(new THREE.Vector3(0, 0, 0));
		    })
		    .start();
	}
	function RotateAuto(){
		if(!autoRotate){
			//自動回転
			autoRotate = true;
			
			//内側にいるのなら反転させる
			controls.removeEventListener('change', ReversalPanel);
			if(CheackInside()){
				ReversalPanelAntithesis();
			}
			
			//カメラの移動前ポジション
	    	var from = {
	            x: camera.position.x,
	            y: camera.position.y,
	            z: camera.position.z
	        };
	        //カメラの移動後ポジション
	        var to;
	        if(displyStyle == "sphere"){
	        	piRotate =  Math.cos(theta/10) * (Math.PI/2);
	        	to = {
	        		x: (borderInside.sphere + 300) * resolutionZoom * Math.sin(theta) * Math.cos(piRotate),
		            y: (borderInside.sphere + 300) * resolutionZoom * Math.sin(piRotate),
		            z: (borderInside.sphere + 300) * resolutionZoom * Math.cos(theta) * Math.cos(piRotate),
		        };
	        }else{
	        	to = {
		            x: 1500*resolutionZoom * Math.sin(theta),
		            y: ((4*dataCount) * Math.cos(theta) + (2*dataCount))*resolutionZoom,
		            z: 1500*resolutionZoom * Math.cos(theta),
		        };
	        }
	        
	    	var tween = new TWEEN.Tween(from)
	        .to(to, 1000)
	        .easing(TWEEN.Easing.Linear.None)
	        .onUpdate(function () {
	            camera.position.set(this.x, this.y, this.z);
	            camera.lookAt(new THREE.Vector3(0, 0, 0));
	        })
	        .onComplete(function () {
	        	//パネル反転
	            isAnimateHand = false;
	        	controls.enabled = false;
	            	        	
	            elements.on('click',null);
	            
	            clockAutoRotate.start();
	  			isAnimateAuto = true;
		  	})
	        .start();
	    
	    	//SVG変形アニメーション
			d3.select("#path1").transition().duration(1000)
			.attr('d', "M4549.9,4715.8c-233.8-27.8-451.5-64.8-652.9-115.8c-1349.8-335.7-2449.5-1356.7-2864-2655.6c-83.4-261.6-85.7-296.4-27.8-423.7c106.5-231.5,414.4-289.4,588.1-106.5c34.7,37,94.9,162.1,143.5,305.6c252.4,720,696.9,1303.5,1296.5,1699.4c1544.3,1018.7,3621.1,622.8,4646.7-886.7C7902.4,2206,8127,1668.9,8178,1340.1l13.9-94.9l-150.5,143.6c-210.7,199.1-361.2,231.5-544.1,111.1c-132-88-189.8-321.8-113.4-470C7434.8,930.3,8386.3,6.5,8474.3-30.5c215.3-90.3,298.7-37,896,562.6c537.1,541.8,553.3,567.2,518.6,759.4c-23.2,113.4-164.4,257-275.5,277.8c-171.3,32.4-243.1,0-458.4-213c-220-215.3-213-215.3-240.8,4.6c-23.2,187.5-127.3,560.3-222.3,810.4c-347.3,898.3-1062.7,1680.9-1937.9,2118.5c-375.1,187.5-727,303.3-1173.8,384.3C5402,4708.8,4716.6,4734.3,4549.9,4715.8z");
			d3.select("#path2").transition().duration(1000)
	        .attr('d', "M1216,247.3C1125.7,208,192.6-706.6,134.7-813.1C116.2-847.8,100-924.2,100-979.8c0-203.7,155.1-356.5,356.6-356.5c148.2,0,182.9,18.5,391.3,224.6c196.8,192.2,189.8,192.2,217.6-27.8c23.1-185.2,141.2-606.6,231.5-833.5c282.5-701.5,780.2-1331.3,1403.1-1778.1c259.3-185.2,780.2-449.2,1078.9-546.4c1208.6-395.9,2530.6-210.7,3597.9,502.4c724.7,483.9,1287.3,1222.5,1562.8,2051.3c94.9,289.4,94.9,386.7-6.9,518.6c-99.6,132-303.3,182.9-442.2,111.2c-113.5-60.2-169-143.6-250-386.7C7907.1-2487,7129.2-3260.3,6138.2-3591.4c-372.8-125-613.5-159.7-1067.3-159.7c-340.3,0-460.7,9.2-650.6,48.6c-467.7,99.6-872.8,268.6-1234,509.4c-259.3,173.6-652.9,555.7-835.8,808c-252.4,356.6-495.5,916.8-546.4,1266.4l-13.9,94.9l134.3-129.7c164.4-159.7,208.4-182.9,333.4-182.9c263.9,0,442.2,273.2,338,516.3c-46.3,106.5-977,1023.3-1083.5,1067.3C1405.8,293.6,1320.2,293.6,1216,247.3z");
		}else{
		//手動回転
			
			oldTimeSeconds += clockAutoRotate.getElapsedTime();
	  		clockAutoRotate.stop();
	  		isAnimateAuto = false;
	  		
	  		controls.enabled = true;
	  		controls.addEventListener('change', ReversalPanel);
			elements.on('click', MoveCameraObject);

	  		isAnimateHand = true;
	  		autoRotate = false;
	  		
	  		//SVG変形アニメーション
				d3.select("#path1").transition().duration(1000)
				.attr('d', "M1268.4,4933.9c-269.8-56-519.3-196-725.5-402.2c-491.3-491.3-583-1232.1-229.1-1838c94.2-160.4,346.2-412.4,506.6-506.6c422.6-246.9,949.6-280,1382.3-89.1c58.5,25.5,109.5,38.2,109.5,28c0-10.2-22.9-86.6-50.9-170.6c-63.6-178.2-50.9-264.8,35.6-264.8c33.1,0,71.3,15.3,86.6,33.1c40.7,48.4,218.9,644.1,203.7,682.3c-7.6,20.4-165.5,86.5-348.8,145.1c-364,119.6-420,117.1-404.8-15.3c7.6-56,35.6-73.8,208.7-132.4l201.1-66.2l-127.3-56c-361.5-155.3-761.2-140-1127.7,40.7c-76.4,38.2-213.8,142.6-305.5,234.2C428.3,2810.8,301,3108.6,301,3459.9c-2.5,972.5,1020.8,1608.9,1886.4,1171c155.3-78.9,226.6-66.2,226.6,38.2c0,66.2-17.8,81.5-165.5,152.7C1943,4967,1601.9,5007.7,1268.4,4933.9z");
				d3.select("#path2").transition().duration(1000)
	            .attr('d', "M3442.4,4188c-157.8-71.3-302.9-216.4-366.6-366.6c-114.6-259.7-122.2-231.6,570.2-2466.8c343.7-1117.5,626.2-2036.6,626.2-2046.7c0-7.6-96.7,73.8-213.8,185.8C3495.9,18.2,2966.4,127.6,2594.7-208.4c-162.9-147.6-241.8-323.3-241.8-547.3c0-252,78.9-389.5,381.9-669.5c325.8-302.9,595.7-608.4,990.3-1127.8c641.5-837.5,1036.1-1143,1952.6-1499.4c173.1-66.2,338.6-145.1,366.6-173.1c30.6-30.5,78.9-137.5,109.5-239.3c45.8-152.7,68.7-193.5,137.5-234.2c45.8-28,112-50.9,152.7-50.9c38.2,0,794.3,224,1680.2,496.4c1710.7,524.4,1695.4,519.3,1738.7,689.9c10.2,35.6-12.7,165.5-53.5,310.6l-68.7,249.5l53.5,264.7c183.3,921.5,132.4,1662.3-178.2,2558.4c-50.9,155.3-211.3,577.9-353.9,939.4c-142.5,364-315.7,827.3-384.4,1031c-140,407.3-208.8,532-364.1,636.4c-142.5,96.7-252,129.8-422.6,129.8c-208.8,0-371.7-63.6-511.7-203.7l-117.1-117.1l-58.5,109.5c-106.9,203.7-323.3,338.6-575.3,358.9c-226.6,17.8-389.5-43.3-565.1-213.8l-140-134.9l-61.1,73.8c-33.1,40.7-127.3,106.9-206.2,145.1c-119.7,58.5-178.2,71.3-323.3,68.7c-229.1-2.6-381.9-73.8-542.2-254.6L4868,2253.3l-211.3,692.4c-117.1,381.9-236.8,753.5-264.8,829.9c-63.6,175.6-198.6,325.8-361.5,399.7C3867.5,4254.2,3597.7,4259.3,3442.4,4188z M3898.1,3790.9c28-17.8,63.6-53.4,81.5-81.5c17.8-25.5,244.4-738.3,506.6-1586c262.2-847.7,496.4-1568.1,521.9-1603.8c145.1-201.1,455.7-147.6,532.1,91.7c30.6,96.7,22.9,127.3-147.6,682.2c-96.7,320.7-178.2,611-178.2,649.2c0,173.1,185.8,323.3,364,300.4c183.3-25.5,229.1-101.8,397.1-636.4c81.4-262.2,168-498.9,193.5-527c99.3-109.5,323.3-86.5,407.3,40.7c58.5,89.1,48.4,196-50.9,516.8c-101.8,333.5-106.9,392-38.2,504c68.7,114.6,185.8,168,325.8,152.7c188.4-20.4,236.7-94.2,386.9-577.9c150.2-483.7,201.1-560.1,384.4-560.1c84,0,119.6,15.3,190.9,86.6c101.8,101.8,109.5,173.1,33.1,386.9c-86.6,252-28,422.6,175.6,511.7c109.5,45.8,259.7,7.6,343.7-91.6c33.1-40.7,119.6-244.4,190.9-455.7c73.8-211.3,208.8-575.3,300.4-812.1c555-1412.9,641.5-1726,664.4-2387.9c15.3-407.3-7.6-667-99.3-1125.2l-56-282.6l53.5-201.1c30.5-109.5,48.3-203.7,43.3-208.7c-28-30.6-2874.1-891-2886.8-873.2c-10.2,10.2-38.2,73.8-63.6,142.6c-76.4,206.2-188.4,292.8-575.3,445.5c-896.1,353.8-1275.4,639-1825.3,1369.6c-394.6,521.9-705.2,875.7-1132.8,1272.8C2750-885.6,2714.3-791.4,2775.4-631c53.5,140,178.2,216.4,341.1,203.7c277.5-22.9,598.2-254.6,1036.1-753.5c137.5-155.3,280-300.4,315.7-323.3c119.6-78.9,364,12.7,399.7,150.2c10.2,40.7-224,837.5-725.5,2461.7c-567.7,1848.2-735.7,2420.9-723,2484.6c17.8,94.2,140,229.1,224,244.4C3719.9,3852,3842.1,3829.1,3898.1,3790.9z");
		}
	}

	//回転アニメーション
	function animateCircleStart() {
		isAnimateCircle = true;
		clockCircle.start();
		isAnimateCircle = true;
	}

	function ChangeControlsOrbit(){
		var prevCamera = camera;
	    camera = new THREE.PerspectiveCamera(40, window.width/window.height , 1, 10000*resolutionZoom);
	    var from = {
		    x_pos: prevCamera.position.x, y_pos: prevCamera.position.y, z_pos: prevCamera.position.z,
		    x_rot: prevCamera.rotation.x, y_rot: prevCamera.rotation.y, z_rot: prevCamera.rotation.z,
		};
		//カメラの移動後ポジション
		var to = {
			x_pos: 0, y_pos: 0, z_pos: 3000*resolutionZoom,
			x_rot: 0, y_rot: 0, z_rot: 0,
		};
		var tween = new TWEEN.Tween(from)
		    .to(to, 3000)
		    .easing(TWEEN.Easing.Linear.None)
		    .onUpdate(function () {
		        camera.position.set(this.x_pos, this.y_pos, this.z_pos);
		        camera.rotation.set(this.x_rot, this.y_rot, this.z_rot);
			})
		    .onComplete(function () {
		    	setTimeout(function(){
		    		isAnimateFly = false;
	    			
					controls = null;
					controls = new THREE.OrbitControls( camera );
					controls.rotateSpeed = 0.1;
					controls.zoomSpeed = 1.2;
					controls.panSpeed = 0.5;
					controls.noZoom = false;
					controls.noPan = false;
					controls.staticMoving = false;
					controls.dynamicDampingFactor = 0.1;
					controls.minDistance = 100*resolutionZoom;   //近づける距離の最小値
					controls.maxDistance = 6000*resolutionZoom; 
					
					isAnimateHand = true;
	    		}, 1000)
		    })
		    .start();
	}
		    
	function ChangeControlsFly(){
		clockFly.start();
		var prevCamera = camera;
	    camera = new THREE.PerspectiveCamera(40, window.width/window.height , 1, straightLength*dataCount/2+straightLength);
	    var from = {
		    x_pos: prevCamera.position.x, y_pos: prevCamera.position.y, z_pos: prevCamera.position.z,
		    x_rot: prevCamera.rotation.x, y_rot: prevCamera.rotation.y, z_rot: prevCamera.rotation.z,
		};
		//カメラの移動後ポジション
		var to = {
			x_pos: 0, y_pos: 0, z_pos: (straightLength*dataCount/2+straightLength),
			x_rot: 0, y_rot: 0, z_rot: 0,
		};
		var tween = new TWEEN.Tween(from)
		    .to(to, 3000)
		    .easing(TWEEN.Easing.Linear.None)
		    .onUpdate(function () {
		        camera.position.set(this.x_pos, this.y_pos, this.z_pos);
		        camera.rotation.set(this.x_rot, this.y_rot, this.z_rot);
			})
		    .onComplete(function () {
		    	setTimeout(function(){
					
					controls = null;
					controls = new THREE.FlyControls(camera);
				    controls.movementSpeed = movementSpeed;//移動速度
					controls.rollSpeed = 0;   //回転速度
					controls.autoForward = true;         //true:自動で移動する,false:自動で移動しない
					controls.dragToLook = true;
					//キーダウンでの移動を不可能にする
					controls.dispose();
					
					elements.on('click', null);
					isAnimateFly = true;
					
					setTimeout(function(){
						controls.moveVector.z = -1;
						HideAutoPanel();
					}, 500)
	    		}, 500)
		    })
		    .start();
	}

	function MoveCamera(position, rotate, speed, callback){

		if(!position) position={x:0, y:0, z:0};
		if(!rotate) rotate={x:0, y:0, z:0};
		
		//カメラの移動前ポジション
		var from = {
		    x_pos: camera.position.x,
		    y_pos: camera.position.y,
		    z_pos: camera.position.z,
		    x_rot: camera.rotation.x,
		    y_rot: camera.rotation.y,
		    z_rot: camera.rotation.z,
		};
		//カメラの移動後ポジション
		var to = {
		    x_pos: position.x,
		    y_pos: position.y,
		    z_pos: position.z,
		    x_rot: rotate.x,
		    y_rot: rotate.y,
		    z_rot: rotate.z,
		};
		var tween = new TWEEN.Tween(from)
		    .to(to, speed)
		    .easing(TWEEN.Easing.Linear.None)
		    .onUpdate(function () {
		        camera.position.set(this.x_pos, this.y_pos, this.z_pos);
		        camera.rotation.set(this.x_rot, this.y_rot, this.z_rot);
			})
		    .onComplete(function () {
		        if(callback) callback;
		    })
		    .start();
	}
	
	  function RrollOverSlice(e){
    	if(isBalloonShow){
            $(e.chart.chartDiv).find("text.amcharts-label-categoryPie tspan").text(e.dataItem.dataContext.category);
            $(e.chart.chartDiv).find("text.amcharts-label-valuePie tspan").text(e.dataItem.dataContext.total);
    	}
    	$(e.chart.chartDiv).find("g.amcharts-pie-item path").css("opacity", 0.2);
    	$(e.chart.chartDiv).find("text.amcharts-pie-label").css("opacity", 0.2);
    	if(e.event) $(e.event.target).css("opacity", 1);
        else {
        	$(e.chart.chartDiv).find("g.amcharts-pie-item." + e.dataItem.title + " path").css("opacity", 1);
        }
        $(e.chart.chartDiv).find("text.amcharts-pie-label." + e.dataItem.title).css("opacity", 1);
    }
    
    function RrollOutSlice(e){
    	if(isBalloonShow){
            $(e.chart.chartDiv).find("text.amcharts-label-categoryPie tspan").text("");
            $(e.chart.chartDiv).find("text.amcharts-label-valuePie tspan").text("");
        }
        $(e.chart.chartDiv).find("g.amcharts-pie-item path").css("opacity", 1);
        $(e.chart.chartDiv).find("text.amcharts-pie-label").css("opacity", 1);
    }
    
    function DrawnColumnChart(e){
    	$(e.chart.chartDiv).find("g.column-category-axis text").css("opacity", 0);
    	$(e.chart.chartDiv).find("g.column-category-axis text:last-child").css("opacity", 1);
    	$(e.chart.chartDiv).find("g.column-category-axis text:first-child").css("opacity", 1);
    	
    	if(e.chart.dataProvider.length > 12){
    		var divNum = Math.floor(e.chart.dataProvider.length/5);
    		for(var i = 3; i < e.chart.dataProvider.length - divNum + 1; i++){
	    		if(i%divNum == 1)
	    			$(e.chart.chartDiv).find("g.column-category-axis text:nth-child(" + i + ")").css("opacity", 1);
	    	}
    	}else if(e.chart.dataProvider.length > 4){
    		for(var i = 3; i < e.chart.dataProvider.length - 1; i++){
	    		if(i%2 == 1)
	    			$(e.chart.chartDiv).find("g.column-category-axis text:nth-child(" + i + ")").css("opacity", 1);
	    	}
    	}
    }
    
    function DrawnAmcharts(e){
    	$(e.chart.chartDiv).find("g.amcharts-category-axis text").css("opacity", 0);
    	$(e.chart.chartDiv).find("g.amcharts-category-axis text:last-child").css("opacity", 1);
    	$(e.chart.chartDiv).find("g.amcharts-category-axis text:first-child").css("opacity", 1);
    	
    	if(e.chart.dataProvider.length > 12){
    		var divNum = Math.floor(e.chart.dataProvider.length/5);
    		for(var i = 3; i < e.chart.dataProvider.length - divNum + 1; i++){
	    		if(i%divNum == 1)
	    			$(e.chart.chartDiv).find("g.amcharts-category-axis text:nth-child(" + i + ")").css("opacity", 1);
	    	}
    	}else if(e.chart.dataProvider.length > 4){
    		for(var i = 3; i < e.chart.dataProvider.length - 1; i++){
	    		if(i%2)
	    			$(e.chart.chartDiv).find("g.amcharts-category-axis text:nth-child(" + i + ")").css("opacity", 1);
	    	}
    	}
    }
	
	function DrawGraph(i, v){
		$("#divPanel" + i)
	    .css("color", titleColors[v.color])
		.css("background-color", fillColors[v.color])
        .css("border", "2px solid " + borderColors[v.color])
        .on('mouseover', function(e){
        	$(this).css({
        		"box-shadow": "0px 0px 12px " + shadowColors[v.color],
        		"border": "1px solid " + borderColors[v.color],
        	});
        })
        .on('mouseout', function(e){
        	$(this).css({
        		"box-shadow": "none",
        		"border": "2px solid " + borderColors[v.color],
        	});
        });
        
	    //グラフの設定
	    $.ajax({
		    type: 'GET',
		    url: '/html/data/sample_data_graph.json',
		    dataType: 'json',
		    scriptCharset:'utf-8',
		    async:false,
		    error: function(XMLHttpRequest, textStatus, errorThrown){
			    debugger;
			  	console.log("aaa")  
			  },
		    success: function(json){
		        if(json.data && json.data.length > 0) {
		        	//Loading削除
		        	$("#divChart" + i + " .loadingGraphDiv").remove();
		        	
			        //積上げ棒
					if(v.hasOwnProperty("recs") && v.type=="column" ){
						var graphSettings = {
						  "type": "serial",
						  "dataProvider": AmCharts.parseJSON(JSON.stringify(json.data)),
						  "categoryField": "category",
						  "autoMargins": false,
						  "addClassNames": true,
						  "classNamePrefix": "column",
						  "marginLeft": 6*resolutionZoom,
						  "marginRight": 6*resolutionZoom,
						  "marginTop": 6*resolutionZoom,
						  "marginBottom": 18*resolutionZoom,
						  "graphs": [],
						  "chartCursor": {
						      "cursorAlpha": 0,
						      "zoomable": false,
						      "oneBalloonOnly":true,
						      "color": "#FFF",
							  "categoryBalloonColor": balloonColors[v.color],
						  },
						  "valueAxes": [ {
						    "stackType": "regular",
						    "labelsEnabled": false,
						    "gridAlpha": 0,
						    "axisAlpha": 0
						  } ],
						  "categoryAxis": {
						    "gridAlpha": 0,
						    "axisAlpha": 0,
						    "color": "#9E9E9E",
						    "fontSize": 8*resolutionZoom,
						    "autoGridCount":false,
						    "gridCount":json.data.length
						  },
						  "balloon": {
						    "drop": false,
						    "borderAlpha": 0,
						    "fillAlpha": 0,
						    "shadowAlpha": 0,
						  },
						  "listeners": [{
				                "event": "drawn",
								"method": DrawnColumnChart
				          }]
						};
						
						var colorIndex = 0;
						$.each(json.data[0], function(ii, vv){
							if(ii != "category"){
								var txt = "<table style='font-size:"+9*resolutionZoom+"px; line-height: "+12*resolutionZoom+"px;'>";
				                var txt_in = "";
				                $.each(json.data[0], function(iii, vvv){
				                	if(iii != "category"){
				                		txt_in = "<tr style='color:"+ (ii==iii?'#FFF':'#BDBDBD') +";'><td style='text-align:left;'><span style='text-align:left;' class='toolImg'>"+ iii +"</span></td><td style='text-align:right;'><span style='text-align:right;'>[["+ iii +"]]</span></td></tr>" + txt_in;
				                    }
				                });
				                txt += txt_in;
				                txt += "</table>",
				                graphSettings.graphs.push({
									    "valueField": ii,
									    "type": "column",
									    "fillAlphas": 1,
									    "lineColor": colors[v.color][colorIndex],
									    "showBalloon": isBalloonShow,
									    "balloonText": txt,
								});
								colorIndex++;
							}
						})
						v.chart = AmCharts.makeChart("divChart" + i, graphSettings);
						
					}if(v.hasOwnProperty("recs") && v.type=="band" ){
						var graphSettings = {
						  "type": "serial",
						  "dataProvider": AmCharts.parseJSON(JSON.stringify(json.data)),
						  "categoryField": "category",
						  "autoMargins": false,
						  "addClassNames": true,
						  "classNamePrefix": "column",
						  "marginLeft": 6*resolutionZoom,
						  "marginRight": 6*resolutionZoom,
						  "marginTop": 12*resolutionZoom,
						  "marginBottom": 18*resolutionZoom,
						  "graphs": [],
						  "chartCursor": {
						      "cursorAlpha": 0,
						      "zoomable": false,
						      "oneBalloonOnly":true,
						      "color": "#FFF",
							  "categoryBalloonColor": balloonColors[v.color],
						  },
						  "valueAxes": [ {
						    "stackType": "100%",
						    "labelsEnabled": false,
						    "gridAlpha": 0,
						    "axisAlpha": 0
						  } ],
						  "categoryAxis": {
						    "gridAlpha": 0,
						    "axisAlpha": 0,
						    "color": "#9E9E9E",
						    "fontSize": 8*resolutionZoom,
						    "autoGridCount":false,
						    "gridCount":json.data.length
						  },
						  "balloon": {
						    "drop": false,
						    "borderAlpha": 0,
						    "fillAlpha": 0,
						    "shadowAlpha": 0,
						  },
						  "listeners": [{
				                "event": "drawn",
								"method": DrawnColumnChart
				          }]
						};
						
						var colorIndex = 0;
						$.each(json.data[0], function(ii, vv){
							if(ii != "category"){
								var txt = "<table style='font-size:"+9*resolutionZoom+"px; line-height: "+12*resolutionZoom+"px;'>";
				                var txt_in = "";
				                $.each(json.data[0], function(iii, vvv){
				                	if(iii != "category"){
				                		txt_in = "<tr style='color:"+ (ii==iii?'#FFF':'#BDBDBD') +";'><td style='text-align:left;'><span style='text-align:left;' class='toolImg'>"+ iii +"</span></td><td style='text-align:right;'><span style='text-align:right;'>[["+ iii +"]]</span></td></tr>" + txt_in;
				                    }
				                });
				                txt += txt_in;
				                txt += "</table>",
				                graphSettings.graphs.push({
									    "valueField": ii,
									    "type": "column",
									    "fillAlphas": 1,
									    "lineColor": colors[v.color][colorIndex],
									    "showBalloon": isBalloonShow,
									    "balloonText": txt,
								});
								colorIndex++;
							}
						})
						v.chart = AmCharts.makeChart("divChart" + i, graphSettings);
					}else if(v.hasOwnProperty("recs") && v.type=="line" ){
					//折れ線
						var graphSettings = {
				            "theme": "light",
				            "type": "serial",
				            "autoMargins": false,
				            "marginBottom": 18*resolutionZoom,
				            "marginTop": 6*resolutionZoom,
				            "marginLeft": 6*resolutionZoom,
				            "marginRight": 6*resolutionZoom,
				            "addClassNames": true,
				            "dataProvider": AmCharts.parseJSON(JSON.stringify(json.data)),
				            "zoomControl": {
								"zoomControlEnabled": false
							},
				            "valueAxes": [{
				                "id": "v1",
				                "axisAlpha": 0,
				                "offset":0,
				                "ignoreAxisWidth":true,
				                "autoGridCount":false,
				                "gridCount": 0,
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
				              "shadowAlpha":0,
				              "borderThickness": 0,
				              "verticalPadding": 2*resolutionZoom,
				              "fontSize": 8*resolutionZoom,
				            },
				            "chartScrollbar": {
				                "enabled": false,
				            },
				            "chartCursor": {
						        "cursorAlpha": 0,
						        "zoomable": false,
						        "color": "#FFF",
								"categoryBalloonColor": balloonColors[v.color],
						    },
				            "categoryField": "category",
				            "categoryAxis": {
				                "parseDates": false,
				                "dashLength": 0,
				                "axisColor": "#FFF",
				                "color": "rgba(256,256,256,0.5)",
				                "minorGridEnabled": false,
				                "gridAlpha": 0,
				                "fontSize": 8*resolutionZoom,
				                "autoGridCount":false,
				                "gridCount":json.data.length
				            },
				            "listeners": [{
				                "event": "drawn",
								"method": DrawnAmcharts
				            }]
				        };
				        
				        var colorIndex = 0;
				        $.each(json.data[0], function(ii, vv){
							if(ii != "category"){
					            graphSettings.graphs.push({
					                "id": "g"+ ii,
					                "valueField": ii,
					                "title": ii,
					                "bulletField": "bullet",
					                "useLineColorForBulletBorder": false,
					                "hideBulletsCount": 50,
					                "lineThickness": 1.5*resolutionZoom,
					                "lineColor": colors[v.color][colorIndex],
					                "type":"smoothedLine",
					                "showBalloon": isBalloonShow,
					                "balloonText": "<span style='font-size: "+10*resolutionZoom+"px; color:#FAFAFA;'>[[title]]</span><span><b style='font-size: "+10*resolutionZoom+"px; color:#FFF; padding-left: 6px;'>[[value]]</b></span>",
					            });
					            colorIndex++;
				            }
				        });
						v.chart = AmCharts.makeChart("divChart" + i, graphSettings);
					}else if(v.hasOwnProperty("recs") && v.type=="area" ){
					//面グラフ
						var graphSettings = {
						    "type": "serial",
						    "theme": "light",
						    "autoMargins": false,
						    "marginRight":6*resolutionZoom,
						    "marginTop": 6*resolutionZoom,
						    "marginLeft": 6*resolutionZoom,
						    "marginBottom": 18*resolutionZoom,
						    "addClassNames": true,
				            "dataProvider": AmCharts.parseJSON(JSON.stringify(json.data)),
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
						    "balloon": {
				              "color": "#E0E0E0",
				              "borderAlpha":0,
				              "fillAlpha":0,
				              "shadowAlpha":0,
				              "borderThickness": 0,
				              "verticalPadding": 2*resolutionZoom,
				              "fontSize": 8*resolutionZoom,
				            },
						    "chartScrollbar": {
				                "enabled": false,
				            },
						    "chartCursor": {
						        "cursorAlpha": 0,
						        "zoomable": false,
						        "color": "#FFF",
								"categoryBalloonColor": balloonColors[v.color],
						    },
						    "chartScrollbar": {
				                "enabled": false,
				            },
						    "categoryField": "category",
						    "categoryAxis": {
						        "startOnAxis": true,
						        "parseDates": false,
				                "dashLength": 0,
				                "axisColor": "#FFF",
				                "color": "rgba(256,256,256,0.5)",
				                "minorGridEnabled": false,
				                "gridAlpha": 0,
				                "fontSize": 8*resolutionZoom,
				                "autoGridCount":false,
				                "gridCount":json.data.length
						    },
						    "listeners": [{
				                "event": "drawn",
								"method": DrawnAmcharts
				            }]
						};
				        
				        var colorIndex = 0;
				        $.each(json.data[0], function(ii, vv){
							if(ii != "category"){
					            graphSettings.graphs.push({
					                "id": "g"+ ii,
					                "valueField": ii,
					                "fillAlphas": 0.6,
							        "lineAlpha": 0.4,
					                "title": ii,
					                "fillColors": colors[v.color][colorIndex],
					                "lineColor": colors[v.color][colorIndex],
					                "showBalloon": isBalloonShow,
					                "balloonText": "<span style='font-size: "+10*resolutionZoom+"px; color:#FAFAFA;'>[[title]]</span><span><b style='font-size: "+10*resolutionZoom+"px; color:#FFF; padding-left: "+6*resolutionZoom+"px;'>[[value]]</b></span>",
					            });
					            colorIndex++;
				            }
				        });
				        v.chart = AmCharts.makeChart("divChart" + i, graphSettings);
					}else if(v.type=="circle"){
						
						//円グラフ用に縦横変換
						var pieData = AmCharts.parseJSON(JSON.stringify(json.data));
						$.each(pieData, function(ii, vv){
							vv.total = SumHashArray(Object.keys(vv).map(function (key) {
								if(key == "category") return 0;
								else return vv[key];
							}));
						});
				        
				        v.chart = AmCharts.makeChart( "divChart" + i, {
				          "type": "pie",
				          "marginBottom": 6*resolutionZoom,
				          "marginTop": 6*resolutionZoom,
				          "marginLeft": "25%",
				          "marginRight": 6*resolutionZoom,
				          "autoMargins": false,
				          "groupedPulled": false,
				          "dataProvider": pieData,
				          "valueField": "total",
				          "titleField": "category",
				          "classNameField":"category",
				          "labelText":"[[category]]",
				          "fontSize":20,
				          "labelRadius": -25*resolutionZoom,
				          "color":"#FFF",
				          "colors": reverseColors[v.color],
				          "fontSize":5*resolutionZoom,
				          "addClassNames":true,
				          "balloonText": "",
				          "radius": "48%",
				          //"innerRadius": "50%",
				          "outlineThickness": 1,
				          "startDuration": 0,
				          "allLabels": [{
				            "id":"categoryPie",
				            "text": "",
				            "size": 16*resolutionZoom,
				            "color":"#FFF",
				            "align": "center",
				            "bold": false,
				            "y": "40%",
				            "x": "-12.5%",
				          }, {
				            "id":"valuePie",
				            "text": "",
				            "color":"#FFF",
				            "align": "center",
				            "size": 16*resolutionZoom,
				            "bold": true,
				            "y": "50%",
				            "x": "-12.5%",
				          }],
				          "listeners": [{
				              "event": "rollOverSlice",
				              "method": RrollOverSlice
				          },{
				              "event": "rollOutSlice",
				              "method": RrollOutSlice
				          }],
				        });
					}
		        }
	        },
	        complete: function(d){
	        	if(v.realtimeSecond > 0){
	        		var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
					svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
					svg.setAttribute('class', 'loader');
					$("#divPanel" + i).append(svg);
					
					$("#divPanel" + i + " svg.loader").append(CreatePath({"class":"loader", "fill":colors[v.color][colors[v.color].length-1], "opacity":".5", "transform":"translate(25, 25)"}));
					
					var alpha = 0
					  , pi = Math.PI
					  , t = v.realtimeSecond * 1000 / 360;

					setInterval(function() {
					  alpha++;
					  alpha %= 360;
					  var r = ( alpha * pi / 180 )
					    , x = Math.sin( r ) * 22
					    , y = Math.cos( r ) * - 22
					    , mid = ( alpha > 180 ) ? 1 : 0
					    , anim = 'M 0 0 v -22 A 22 22 1 ' 
					           + mid + ' 1 ' 
					           +  x  + ' ' 
					           +  y  + ' z';
					  $("#divPanel" + i + " svg path.loader").attr( 'd', anim );
					}, t);
					
					setInterval(function(){
						$.ajax({
						    type: 'GET',
						    url: '/html/data/sample_data_graph.json',
						    dataType: 'json',
						    success: function(json){
						        if(json.data && json.data.length > 0) {
						        	if(v.type == "circle"){
						        		json.data = AmCharts.parseJSON(JSON.stringify(json.data));
										$.each(json.data, function(ii, vv){
											vv.total = SumHashArray(Object.keys(vv).map(function (key) {
												if(key == "category") return 0;
												else return vv[key];
											}));
										});
						        	}
									v.chart.dataProvider = json.data;
									v.chart.validateData();
									
									//更新のアニメーション
									$("#divPanel" + i).css(updateAnimetion)
									setTimeout(function(){
										$("#divPanel" + i).css(removeAnimetion)
									}, 1500);
								}
							}
						});
					}, v.realtimeSecond * 1000)
					
					$("#divPanel" + i).append("<div class='loader'></div>");
					//リアルタイムアイコン作成
					var sonic = new Sonic({
						width: 50,
						height: 50,
						backgroundColor: 'rgba(0,0,0,0)',
						stepsPerFrame: 4,
						trailLength: 1,
						pointDistance: 0.01,
						fps: 25,
						setup: function() {
							this._.lineWidth = 10;
						},
						step: function(point, i, f) {
							var progress = point.progress,
								degAngle = 360 * progress,
								angle = Math.PI/180 * degAngle,
								angleB = Math.PI/180 * (degAngle - 180),
								size = i*3;
							this._.fillStyle = colors[v.color][Math.floor(colors[v.color].length/3)];//'#FF7B24'
							this._.fillRect(
								Math.cos(angle) * 12.5 + (25-size/2),
								Math.sin(angle) * 7.5 + (25-size/2),
								size,
								size
							); 
							this._.fillStyle = colors[v.color][Math.floor(colors[v.color].length/1.5)];//'#63D3FF'
							this._.fillRect(
								Math.cos(angleB) * 7.5 + (25-size/2),
								Math.sin(angleB) * 12.5 + (25-size/2),
								size,
								size
							);
							if (point.progress == 1) {
								this._.globalAlpha = f < .5 ? 1-f : f;
								this._.fillStyle = colors[v.color][0];
								this._.beginPath();
								this._.arc(25, 25, 2, 0, 360, 0);
								this._.closePath();
								this._.fill();
							}
						},
						path: [
							['line', 0, 0, 1, 1] // stub -- not actually rendered
						]
					});
					$("#divPanel" + i + " div.loader").append(sonic.canvas);
					sonic.play();
	        	}
	        }
	    });
	}
	
	function SetChatsData(data) {
		$.each(data, function(i, v){
			setTimeout(function(){
				//グラフサマリ値
				if(v.sum != ""){
					$.ajax({
					    type: 'GET',
					    url: '/html/data/sample_data_sum.json',
					    dataType: 'json',
					    success : function(json){
					    	//サマリ値の設定
					    	$("#divPanel" + i).append('<div class="investData">'+ d3.format(',')(json.data[0].value) +'<span>'+ v.valueUnit +'<span><div>');
						    $("#divPanel" + i + " .investData")
						      .css("font-size", Number($("#divPanel"+ i +" div.investData").css("font-size").slice(0,-2)) *resolutionZoom)
						      .css("top", Number($("#divPanel"+ i +" div.investData").css("top").slice(0,-2)) *resolutionZoom)
						      .css("left", Number($("#divPanel"+ i +" div.investData").css("left").slice(0,-2)) *resolutionZoom);
						    
						    //色の設定
						    $.each(v.color, function(ii,vv){
								//色コードが指定されていない場合
								if(vv=="") delete v.color[ii];
							})
							v.color = Object.keys(v.color).map(function (key) {
								if(v.color[key] && v.color[key] != "")
								return {color:key, value:Number(v.color[key])};
							});
							v.color.sort(function(a,b){
							    if(a.value>b.value) return -1;
								if(a.value < b.value) return 1;
							    return 0;
							});
						    if(v.color.length>0){
						    	$.each(v.color, function(ii, vv){
							    	if(Number(json.data[0].value) >= vv.value) {
							    		v.color = vv.color;
							    		return false;
							    	}
							    });
						    }else{
						    	//色の設定がなかった時のデフォ値はblue
						    	v.color = "blue";
						    }
					    },
						complete: function(){
							DrawGraph(i, v);
					    }
					});
				}else{
					//サマリ値が指定されていない場合
					v.color = "blue";
					DrawGraph(i, v);
				}
			}, 100 * i);
		});
	}

	//Straight表示用にパネルを徐々に透明にしていく
	function HideAutoPanel(){
		var delayBase = (straightLength/movementSpeed * 1000 * 0.4) + 500;
		var animationSpeed = 100000/movementSpeed;
		var timeCount = dataCount;
		if(filterCategory){
			elements.filter(function(d) { return (d.classification == filterCategory);})
			.transition().duration(animationSpeed)
			.delay(function(d, i){
				return i * straightLength / movementSpeed * 1000 + delayBase
			})
		    .style("opacity",  0)
		    .transition()
		    .delay(function(d, i){
				return i * straightLength / movementSpeed * 1000 + delayBase + animationSpeed
			})
		    .style("visibility",  "hidden");
		    timeCount = elements.filter(function(d) { return (d.classification == filterCategory);})[0].length;
		}else{
			elements.transition().duration(animationSpeed)
			.delay(function(d, i){
				return i * straightLength / movementSpeed * 1000 + delayBase
			})
		    .style("opacity",  0)
		    .transition()
		    .delay(function(d, i){
				return i * straightLength / movementSpeed * 1000 + delayBase + animationSpeed
			})
		    .style("visibility",  "hidden");
		}
	    
	    //繰り返しパネル
	    timerAutoHide = setTimeout(function(){
	    	clockFly.stop();
	    	$("body").append("<div id='restartStraight' style='opacity:0; border: 2px solid rgba(127, 127, 127, 0.25);position:absolute;width:575px;height:400px;background: rgba(101,101,101,0.8);color: white;text-align: center;font-size: 48px;border-radius: 8px; top:"+ (window.innerHeight-400)/2 +"px; left:"+ (window.innerWidth-575)/2 +"px;' ><span style='vertical-align: middle;line-height: 400px;'>リスタート</span></div>");
	    	d3.select("#restartStraight").transition().duration(300).style("opacity",  1).each("end", function() {
	    		$("#restartStraight").on('mouseover', function(e){
		        	$(this).css({
		        		"box-shadow": "0px 0px 12px rgba(256, 256, 256, 0.75)",
		        		"border": "1px solid rgba(127, 127, 127, 0.25)",
		        	});
		        })
		        .on('mouseout', function(e){
		        	$(this).css({
		        		"box-shadow": "none",
		        		"border": "2px solid rgba(127, 127, 127, 0.25)",
		        	});
		        })
		        .on("click", function(){
		    		d3.select("#restartStraight").transition().duration(300).style("opacity",  0).delay(300).remove();
		    		$('#menuDisplay button.active').trigger("click");
		    	});
	    	});
	    }, ((timeCount + 2) * straightLength / movementSpeed * 1000 + 1000))
	}

	/////////////////////////
	//変数
	/////////////////////////
	var tooltipIcon;
	var filterCnt = 0;
	var filterCategory;
	var movementSpeed;
	var straightLength = 1000;
	var displyStyle;
	var isDirectionInside = false;
	var isBalloonShow = false;
	var borderInside = {};
	var theta = 0;
	var dataCount;
	var camera;
	var geometry, mesh;
	var scene2, renderer2;
	var controls;
	var clockAutoRotate = new THREE.Clock(false);
	var clockCircle = new THREE.Clock(false);
	var clockFly = new THREE.Clock(false);
	var autoRotate = false; //自動回転フラグ
	var oldTimeSeconds = 0;
	var oldTimeCircle = 0;
	var resolutionZoom = 2.5; //解像度
	var timerAutoHide;
	var hashDisplayStyle = ["sphere", "helix", "grid", "table", "circle", "straight"];
	var indexDisplayStyle = 1;
	var colors = {
		"blue":['#006064','#00838F','#0097A7','#00ACC1','#00BCD4','#26C6DA','#4DD0E1','#80DEEA', '#B2EBF2', '#E0F7FA'],
		"red":['#B71C1C','#C62828','#D32F2F','#E53935','#F44336','#EF5350','#E57373','#EF9A9A', '#FFCDD2', '#FFEBEE'],
		"green":['#1B5E20','#2E7D32','#388E3C','#43A047','#4CAF50','#66BB6A','#81C784','#A5D6A7', '#C8E6C9', '#E8F5E9'],
		"yellow":['#F57F17','#F9A825','#FBC02D','#FDD835','#FFEB3B','#FFEE58','#FFF176','#FFF59D', '#FFF9C4', '#FFFDE7'],
	};
	var reverseColors = {
		"blue": colors.blue.reverse(),
		"red": colors.red.reverse(),
		"green": colors.green.reverse(),
		"yellow": colors.yellow.reverse(),
	};
	var fillColors = {
		"blue": "rgba(48,103,145,.75)",
		"red": "rgba(145,52,48,0.75)",
		"green": "rgba(72,145,48,0.75)",
		"gray": "rgba(145,145,145,0.75)",
		"yellow": "rgba(145,145,48,0.75)",
	};
	var borderColors = {
		"blue": "rgba(127,255,255,0.25)",
		"red": "rgba(255,127,127,0.25)",
		"green": "rgba(127,255,127,0.25)",
		"gray": "rgba(255,255,255,0.25)",
		"yellow": "rgba(255,255,127,0.25)",
	};
	var balloonColors = {
		"blue": "rgba(0,255,255,01)",
		"red": "rgba(255,0,0,1)",
		"green": "rgba(0,255,0,1)",
		"gray": "rgba(127,127,127,1)",
		"yellow": "rgba(255,255,0,1)",
	};
	var titleColors = {
		"blue": "rgba(127,255,255,0.75)",
		"red": "rgba(255,127,127,0.75)",
		"green": "rgba(127,255,127,0.75)",
		"yellow": "rgba(255,255,127,0.75)",
	};
	var shadowColors = {
		"blue": "rgba(0,255,255,0.75)",
		"red": "rgba(255,0,0,0.75)",
		"green": "rgba(0,255,0,0.75)",
		"yellow": "rgba(255,255,0,0.75)",
	};
	var updateAnimetion = {
	    "box-shadow": "0 0 10px #fff, 0 0 20px #fff, 0 0 30px #fff, 0 0 40px #fff, 0 0 50px #fff, 0 0 60px #fff, 0 0 70px #fff, 0 0 80px #fff",
	    "-webkit-transition": "1s",
	    "transition": "1s"
	};
	var removeAnimetion= {
	    "box-shadow": "",
	};
	window.cancelAnimationFrame = window.cancelAnimationFrame ||
	  window.mozCancelAnimationFrame ||
	  window.webkitCancelAnimationFrame ||
	  window.msCancelAnimationFrame;

	/////////////////////////
	//メイン処理
	/////////////////////////
	$("#sb-site").css("z-index", "-1");
	$("#sb-site").attr("id", "container");
	$("#dockbar-container").css("display", "none");
	$("#wrapper, #add-btn-area").css("display", "none");
	$("#container").css("background", "url('"+ MakePath("image/background.jpg") +"')");
	$("#container").css("height", "100%");
	
	//パネル表示スタイル変更ボタン
	if(GetUrlVars().displayStyle !== void(0)){
		indexDisplayStyle = Number(GetUrlVars().displayStyle);
	}
	$("body").append('<div id="menuDisplay"><button>sphere</button><button>helix</button><button>grid</button><button>table</button><button>circle</button><button>straight</button></div>');
	$("#menuDisplay button:nth-child("+ (indexDisplayStyle+1) +")").addClass("active");
	displyStyle = hashDisplayStyle[indexDisplayStyle];
		
	//ソフトバンクロゴ
	$("body").append("<div id='sumaryDiv' style='position: absolute;bottom: 12px;right: 12px;'>");
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
	
	//データ調整
	$.each(_data, function(i, v){
		v.index = i;
		v.realtimeSecond = v.realtimeSecond == "" ? 0 : Number(v.realtimeSecond);
	});
	dataCount = _data.length;
	movementSpeed = 10000 / dataCount;
	
	init();
	animate();
	
	//自動回転、手動回転切り替えボタン
	var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
	svg.setAttribute('width', '40px');
	svg.setAttribute('height', '40px');
	svg.setAttribute('id', 'svgSwitchRotateMode');
	svg.setAttribute('class', 'tooltipIcon');
	svg.setAttribute('title', 'ChangeViewMode');
	svg.setAttribute('style', 'position: absolute;bottom: 18px;left: 30px;border-radius: 30px;background: rgba(0,0,0,0.3);');
	$("body").append(svg);
	var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
	g.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
	g.setAttribute('transform', 'translate(8,20)scale(0.0025,-0.0025)');
	g.setAttribute('class', 'tooltipIcon');
	g.setAttribute('title', 'ChangeViewMode');
	$("#svgSwitchRotateMode").append(g);
	var path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
	path1.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
	path1.setAttribute('id', 'path1');
	path1.setAttribute('style', 'fill:rgb(256,256,256);');
	path1.setAttribute('class', 'tooltipIcon');
	path1.setAttribute('title', 'ChangeViewMode');
	path1.setAttribute('d', 'M1268.4,4933.9c-269.8-56-519.3-196-725.5-402.2c-491.3-491.3-583-1232.1-229.1-1838c94.2-160.4,346.2-412.4,506.6-506.6c422.6-246.9,949.6-280,1382.3-89.1c58.5,25.5,109.5,38.2,109.5,28c0-10.2-22.9-86.6-50.9-170.6c-63.6-178.2-50.9-264.8,35.6-264.8c33.1,0,71.3,15.3,86.6,33.1c40.7,48.4,218.9,644.1,203.7,682.3c-7.6,20.4-165.5,86.5-348.8,145.1c-364,119.6-420,117.1-404.8-15.3c7.6-56,35.6-73.8,208.7-132.4l201.1-66.2l-127.3-56c-361.5-155.3-761.2-140-1127.7,40.7c-76.4,38.2-213.8,142.6-305.5,234.2C428.3,2810.8,301,3108.6,301,3459.9c-2.5,972.5,1020.8,1608.9,1886.4,1171c155.3-78.9,226.6-66.2,226.6,38.2c0,66.2-17.8,81.5-165.5,152.7C1943,4967,1601.9,5007.7,1268.4,4933.9z');
	$("#svgSwitchRotateMode g").append(path1);
	var path2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
	path2.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
	path2.setAttribute('id', 'path2');
	path2.setAttribute('class', 'tooltipIcon');
	path2.setAttribute('title', 'ChangeViewMode');
	path2.setAttribute('style', 'fill:rgb(256,256,256);');
	path2.setAttribute('d', 'M3442.4,4188c-157.8-71.3-302.9-216.4-366.6-366.6c-114.6-259.7-122.2-231.6,570.2-2466.8c343.7-1117.5,626.2-2036.6,626.2-2046.7c0-7.6-96.7,73.8-213.8,185.8C3495.9,18.2,2966.4,127.6,2594.7-208.4c-162.9-147.6-241.8-323.3-241.8-547.3c0-252,78.9-389.5,381.9-669.5c325.8-302.9,595.7-608.4,990.3-1127.8c641.5-837.5,1036.1-1143,1952.6-1499.4c173.1-66.2,338.6-145.1,366.6-173.1c30.6-30.5,78.9-137.5,109.5-239.3c45.8-152.7,68.7-193.5,137.5-234.2c45.8-28,112-50.9,152.7-50.9c38.2,0,794.3,224,1680.2,496.4c1710.7,524.4,1695.4,519.3,1738.7,689.9c10.2,35.6-12.7,165.5-53.5,310.6l-68.7,249.5l53.5,264.7c183.3,921.5,132.4,1662.3-178.2,2558.4c-50.9,155.3-211.3,577.9-353.9,939.4c-142.5,364-315.7,827.3-384.4,1031c-140,407.3-208.8,532-364.1,636.4c-142.5,96.7-252,129.8-422.6,129.8c-208.8,0-371.7-63.6-511.7-203.7l-117.1-117.1l-58.5,109.5c-106.9,203.7-323.3,338.6-575.3,358.9c-226.6,17.8-389.5-43.3-565.1-213.8l-140-134.9l-61.1,73.8c-33.1,40.7-127.3,106.9-206.2,145.1c-119.7,58.5-178.2,71.3-323.3,68.7c-229.1-2.6-381.9-73.8-542.2-254.6L4868,2253.3l-211.3,692.4c-117.1,381.9-236.8,753.5-264.8,829.9c-63.6,175.6-198.6,325.8-361.5,399.7C3867.5,4254.2,3597.7,4259.3,3442.4,4188z M3898.1,3790.9c28-17.8,63.6-53.4,81.5-81.5c17.8-25.5,244.4-738.3,506.6-1586c262.2-847.7,496.4-1568.1,521.9-1603.8c145.1-201.1,455.7-147.6,532.1,91.7c30.6,96.7,22.9,127.3-147.6,682.2c-96.7,320.7-178.2,611-178.2,649.2c0,173.1,185.8,323.3,364,300.4c183.3-25.5,229.1-101.8,397.1-636.4c81.4-262.2,168-498.9,193.5-527c99.3-109.5,323.3-86.5,407.3,40.7c58.5,89.1,48.4,196-50.9,516.8c-101.8,333.5-106.9,392-38.2,504c68.7,114.6,185.8,168,325.8,152.7c188.4-20.4,236.7-94.2,386.9-577.9c150.2-483.7,201.1-560.1,384.4-560.1c84,0,119.6,15.3,190.9,86.6c101.8,101.8,109.5,173.1,33.1,386.9c-86.6,252-28,422.6,175.6,511.7c109.5,45.8,259.7,7.6,343.7-91.6c33.1-40.7,119.6-244.4,190.9-455.7c73.8-211.3,208.8-575.3,300.4-812.1c555-1412.9,641.5-1726,664.4-2387.9c15.3-407.3-7.6-667-99.3-1125.2l-56-282.6l53.5-201.1c30.5-109.5,48.3-203.7,43.3-208.7c-28-30.6-2874.1-891-2886.8-873.2c-10.2,10.2-38.2,73.8-63.6,142.6c-76.4,206.2-188.4,292.8-575.3,445.5c-896.1,353.8-1275.4,639-1825.3,1369.6c-394.6,521.9-705.2,875.7-1132.8,1272.8C2750-885.6,2714.3-791.4,2775.4-631c53.5,140,178.2,216.4,341.1,203.7c277.5-22.9,598.2-254.6,1036.1-753.5c137.5-155.3,280-300.4,315.7-323.3c119.6-78.9,364,12.7,399.7,150.2c10.2,40.7-224,837.5-725.5,2461.7c-567.7,1848.2-735.7,2420.9-723,2484.6c17.8,94.2,140,229.1,224,244.4C3719.9,3852,3842.1,3829.1,3898.1,3790.9z');
	$("#svgSwitchRotateMode g").append(path2);
	$("#svgSwitchRotateMode").on("click", RotateAuto);
	
	//バルーン表示切替
	var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
	svg.setAttribute('width', '40px');
	svg.setAttribute('height', '40px');
	svg.setAttribute('id', 'switchBalloomShow');
	svg.setAttribute('class', 'tooltipIcon');
	svg.setAttribute('title', 'tooltip');
	svg.setAttribute('style', 'position: absolute;bottom: 73px;left: 30px;border-radius: 30px;background: rgba(0,0,0,0.3);');
	$("body").append(svg);
	
	var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
	g.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
	g.setAttribute('transform', 'translate(10,13) scale(0.0022,-0.0024)');
	g.setAttribute('class', 'tooltipIcon');
	g.setAttribute('title', 'tooltip');
	$("#switchBalloomShow").append(g)
	
	var path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
	path1.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
	path1.setAttribute('style', 'fill:rgb(256,256,256); opacity:.2');
	path1.setAttribute('class', 'tooltipIcon');
	path1.setAttribute('title', 'tooltip');
	path1.setAttribute('d', 'M925.3,960.2C564.6,801.8,195.1,353.1,133.5,1.2c-26.4-158.4-44-1513.4-26.4-3026.8c26.4-2613.2,35.2-2754,211.2-2982.8C723-6553.8,881.4-6615.4,2122-6641.8l1143.8-35.2l835.9-1003.1c466.3-554.3,879.9-1003,915-1003c35.2,0,448.8,448.7,915.1,1003L6767.6-6677l1143.8,35.2c1240.7,26.4,1398.9,88,1803.7,633.4c176,228.8,184.8,352,184.8,3220.4c0,2868.4-8.8,2991.5-184.8,3220.3c-96.8,132-290.3,325.5-422.3,422.3c-237.6,176-351.9,184.8-4170.6,202.4C1990,1074.6,1136.5,1057,925.3,960.2z M8536.2-1380.2v-351.9H5016.7H1497.3v351.9v352h3519.4h3519.5V-1380.2z M8536.2-2788v-351.9H5016.7H1497.3v351.9v352h3519.4h3519.5V-2788z M8536.2-4195.8v-352H5016.7H1497.3v352v351.9h3519.4h3519.5V-4195.8z');
	$("#switchBalloomShow g").append(path1);
	
	$("#switchBalloomShow").on("click", function(){
		isBalloonShow = !isBalloonShow;
		$("#switchBalloomShow g path").css("opacity", isBalloonShow?1:.2);
		$.each(_data, function(i,v){
			if(v.chart !== void(0)){
				if(v.type!="circle"){
					$.each(v.chart.graphs, function(ii,vv){
						vv.showBalloon = isBalloonShow;
					})
				}
				v.chart.validateData();
			}
		});
	});
	
	//カテゴリ再構成
	$("body").append('<div class="styled-select blue semi-square"><select id="selectReconstruction"></select></div>');
	$("#selectReconstruction").append('<option value="all">All Category</option>');
	$.each(_data.map(function(i){ return i.classification}).filter(function (x, i, self) {return self.indexOf(x) === i;}), function(i, v){
		$("#selectReconstruction").append('<option value="'+v+'">'+ v +'</option>');
	});
	$("#selectReconstruction").change(function(v){
		filterCnt = 0;
		if($("#selectReconstruction option:selected").get(0).textContent == "All Category"){
			filterCategory = null;
			elements.each(SetPosition);
			Transform(displyStyle, 3000);
		}else{
			filterCategory = $("#selectReconstruction option:selected").get(0).textContent;
			elements.each(SetPosition);
			Transform(displyStyle, 3000);
		}
		if(displyStyle == "circle") MoveCamera({x:0,y:0,z:30*dataCount*resolutionZoom}, null, 3000);
		if(displyStyle == "straight") ChangeControlsFly();
	});
	
	//表示形式変更
	$("#menuDisplay button").on("click", function(e){
		//選択されているボタンの見た目変更
		$("#menuDisplay button").removeClass("active");
		$(this).addClass("active");
		
		var preDisplayStyle = displyStyle;
		
		//変更前表示形式に合わせた処理
		switch(displyStyle){
			case "sphere":
			case "helix":
				if(autoRotate){
					$("#svgSwitchRotateMode").trigger("click");
				}
			case "circle":
				oldTimeCircle += (clockCircle.getElapsedTime()/500);
				clockCircle.stop();
				isAnimateCircle= false
				break;
			case "straight":
				clockFly.stop();
				clearInterval(timerAutoHide);
				
				//リスタートパネルの削除
				d3.select("#restartStraight").transition().duration(300).style("opacity",  0).delay(300).remove();
				
				//フィルタ選択モードであれば、フィルタを反映させる。
				elements.transition();
				var target = $("#inputSearch").get(0).value.toLowerCase();
				elements
		        .style("opacity",  function(d){
		        	if (d.name.toLowerCase().indexOf(target) == -1) return 0.05;
		        	else {
		        		return 1;
		        	}
		        })
		        .style("visibility", "visible");
				
				break;
		}
		
		//新たなスタイル
		displyStyle = $(e.target).text();
		indexDisplayStyle = $(this).parent().children().index(this);
		
		//変更後表示形式に合わせた処理
		switch(displyStyle){
			case "sphere":
			case "helix":
				//内向きか外向きか判定
				if(CheackInside()) Transform(displyStyle + "_i", 1500);
				else Transform(displyStyle, 1500);
				
				//以前がFlyコントローラの場合はコントローラの切替を行う
				if(preDisplayStyle == "straight") {
					ChangeControlsOrbit();
					elements.on('click', MoveCameraObject);
				}else if(preDisplayStyle == "circle") {
					elements.on("click", null);
					elements.on('click', MoveCameraObject);
					isAnimateHand = true;
				}
				else isAnimateHand = true;
				
				d3.select("#svgSwitchRotateMode").transition().duration(300).style("opacity", "1");
				
				if(!autoRotate){
					setTimeout(function(){
						$("#svgSwitchRotateMode").trigger("click");
					}, 2000)
				}
				
				break;
			case "grid":
			case "table":
			default:
				Transform(displyStyle, 1500);
				
				//以前がFlyコントローラの場合はコントローラの切替を行う
				if(preDisplayStyle == "straight") {
					ChangeControlsOrbit();
					elements.on('click', MoveCameraObject);
				}else if(preDisplayStyle == "circle") {
					elements.on("click", null);
					elements.on('click', MoveCameraObject);
					isAnimateHand = true;
				}
				else isAnimateHand = true;
				
				d3.select("#svgSwitchRotateMode").transition().duration(300).style("opacity", "0");
				break;
			case "circle":
				Transform(displyStyle, 1500, animateCircleStart);
				
				if(preDisplayStyle == "straight") {
					ChangeControlsOrbit();
					elements.on('click', MoveCameraCircleObject);
				}else{
					elements.on("click", null);
					elements.on("click", MoveCameraCircleObject);
					var r = 40 * dataCount * resolutionZoom;
					var distanca = Math.sqrt(r*r - (0.75*r)*(0.75*r)) + 1000;
					MoveCamera({x:0,y:0, z:distanca}, null, 3000);
					isAnimateHand=true;
				}
				
				d3.select("#svgSwitchRotateMode").transition().duration(300).style("opacity", "0");
				break;
				
			case "straight":
				isAnimateHand = false;
				isAnimateAuto = false;
				isAnimateCircle = false;
				
				Transform(displyStyle, 1500);
				ChangeControlsFly();
				d3.select("#svgSwitchRotateMode").transition().duration(300).style("opacity", "0");
				break;
		}
	});
	
	//検索ウィンドウ
	$("body").append("<div id='txtSearchResult' style='position:absolute;bottom: 52px;font-size: 12px;left: 120px;color: white;'></div><div id='txtSearch' style='position:absolute;bottom:12px;left:96px;'><input type='text' placeholder='search…' id='inputSearch' autofocus></div>");
	$("#inputSearch, #selectReconstruction").on('mouseover', function(){
		controls.enabled = false;
	});
	$("#inputSearch, #selectReconstruction").on('mouseout', function(){
		if(!autoRotate) controls.enabled = true;
	});
	$("#inputSearch").keyup(function(){
		var target = $(this)[0].value.toLowerCase();
		var c=0;
        elements
        .style("opacity",  function(d){
        	if (d.name.toLowerCase().indexOf(target) == -1) return 0.05;
        	else {
        		if(!filterCategory || (filterCategory && d.classification == filterCategory)) c++;
        		return 1;
        	}
        });
        if(c == dataCount) $("#txtSearchResult").text("");
        else if(c > 0) $("#txtSearchResult").text(c+" 件ヒットしました");
        else $("#txtSearchResult").text("検索結果なし");
    });
    
	//初期表示スタイル適用
	$("#menuDisplay button.active").trigger("click");
	
	//画面リサイズ
	window.addEventListener('resize', WindowResize, false);

	//メニューボタン作成
	var menuIconSvg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
	menuIconSvg.setAttribute("id", "menuRect");
	menuIconSvg.setAttribute("class", "tooltipIcon");
	menuIconSvg.setAttribute("title", "menu");
	menuIconSvg.setAttribute("height", 40);
	menuIconSvg.setAttribute("width", 40);
	menuIconSvg.setAttribute("style", "position: absolute;left: 20px;top: 20px;background: rgba(160, 160, 160, 0.5);z-index: 9999;border-radius: 20px;");
	$("body").append(menuIconSvg);
	$("#menuRect").append(CreateRect({"width":"20", "height":"5", "fill":"white", "x":"10", "y":"12.5", "opacity":".9", "class":"tooltipIcon", "title":"menu"}));
	$("#menuRect").append(CreateRect({"width":"20", "height":"5", "fill":"white", "x":"10", "y":"22.5", "opacity":".9", "class":"tooltipIcon", "title":"menu"}));
	
	//基盤のメニューウィンドウを表示する
	$("#menuRect").on("click", function(){
	    $('#menu').trigger("click");
	});
	
	//ツールチップ作成
	$("body").append("<div id='tooltipIcon'></span>");
	tooltipIcon = d3.select("body").select("#tooltipIcon");
	$(".tooltipIcon")
    .on("mouseover", function(d){
    	if(d.target.attributes.hasOwnProperty("title")){
    		tooltipIcon.html(
	            "<div id='tooltipIconDiv'>" + d.target.attributes["title"].value + "</div>"
	        );
	        tooltipIcon.style("visibility", "visible").transition().duration(300).delay(1000).style("opacity", "1");
    	}
    })
    .on("mousemove", function(d){return tooltipIcon.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
    .on("mouseout", function(d){
    	if(d.toElement.className instanceof Object && d.toElement.className.baseVal.indexOf("tooltipIcon") > -1) return;
    	else tooltipIcon.style("opacity", "0").style("visibility", "hidden");
    });

	SetChatsData(_data);
	
	//リアルタイム更新処理
	
	
	//リロードと表示スタイルの変更
	setTimeout(function(){
		var url = location.href.replace(/\?.*$/,"")
		if(indexDisplayStyle == 1 || indexDisplayStyle == 2) indexDisplayStyle = 3
		var index = ((indexDisplayStyle + 1) % Object.keys(hashDisplayStyle).length)
		location.href = url + "?displayStyle=" + index;
	}, 1200000);
	this.finished=true;
}
window.ThreeDD = ThreeDD;
