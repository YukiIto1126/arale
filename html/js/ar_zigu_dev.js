//クラス定義
var ThreeDD = {};
ThreeDD.finished = false;
ThreeDD.main = function(){
	
	// userAgentの判定
	var sp;
	var ua = navigator.userAgent;
    if (ua.indexOf('iPhone') > 0 || ua.indexOf('iPod') > 0 || ua.indexOf('Android') > 0) {
        var sp = true;
    }else if(ua.indexOf('iPad') > 0 || ua.indexOf('Android') > 0){
        var sp = true;
    }
	
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
	
	// 	データの作成
	var _data = {
	  "matchId": "string",
	  "setNo": 2,
	  "team1Score": 14,
	  "team2Score": 11,
	  "pointLog": [
	    [
	      {"team1":0,"team2":1},
	      {"team1":0,"team2":1},
	      {"team1":1,"team2":0},
	      {"team1":1,"team2":0},
	      {"team1":0,"team2":1},
	      {"team1":0,"team2":1},
	      {"team1":0,"team2":1},
	      {"team1":1,"team2":0},
	      {"team1":1,"team2":0},
	      {"team1":0,"team2":1},
	      {"team1":0,"team2":1},
	      {"team1":1,"team2":0},
	      {"team1":1,"team2":0},
	      {"team1":1,"team2":0},
	      {"team1":0,"team2":1},
	      {"team1":0,"team2":1},
	      {"team1":1,"team2":0},
	      {"team1":0,"team2":1},
	      {"team1":0,"team2":1},
	      {"team1":1,"team2":0},
	      {"team1":1,"team2":0},
	      {"team1":1,"team2":0},
	      {"team1":0,"team2":1},
	      {"team1":1,"team2":0},
	      {"team1":1,"team2":0},
	      {"team1":0,"team2":1},
	      {"team1":0,"team2":1},
	      {"team1":1,"team2":0},
	      {"team1":0,"team2":1},
	      {"team1":1,"team2":0},
	      {"team1":0,"team2":1},
	      {"team1":0,"team2":1},
	      {"team1":0,"team2":1},
	      {"team1":1,"team2":0},
	      {"team1":1,"team2":0},
	      {"team1":1,"team2":0},
	      {"team1":0,"team2":1},
	      {"team1":1,"team2":0},
	      {"team1":1,"team2":0},
	      {"team1":0,"team2":1},
	      {"team1":0,"team2":1},
	      {"team1":1,"team2":0},
	      {"team1":1,"team2":0},
	      {"team1":0,"team2":1},
	      {"team1":1,"team2":0},
	      {"team1":0,"team2":1},
	      {"team1":1,"team2":0},
	      {"team1":0,"team2":1},
	      {"team1":0,"team2":1},
	    ],[
	      {"team1":0,"team2":1},
	      {"team1":0,"team2":1},
	      {"team1":1,"team2":0},
	      {"team1":1,"team2":0},
	      {"team1":0,"team2":1},
	      {"team1":0,"team2":1},
	      {"team1":0,"team2":1},
	      {"team1":1,"team2":0},
	      {"team1":1,"team2":0},
	      {"team1":0,"team2":1},
	      {"team1":0,"team2":1},
	      {"team1":1,"team2":0},
	      {"team1":1,"team2":0},
	      {"team1":1,"team2":0},
	      {"team1":0,"team2":1},
	      {"team1":0,"team2":1},
	      {"team1":1,"team2":0},
	      {"team1":0,"team2":1},
	      {"team1":0,"team2":1},
	      {"team1":1,"team2":0},
	      {"team1":1,"team2":0},
	      {"team1":1,"team2":0},
	      {"team1":0,"team2":1},
	      {"team1":1,"team2":0},
	      {"team1":1,"team2":0},
	      {"team1":0,"team2":1},
	      {"team1":0,"team2":1},
	      {"team1":1,"team2":0},
	      {"team1":0,"team2":1},
	      {"team1":1,"team2":0},
	      {"team1":0,"team2":1},
	      {"team1":0,"team2":1},
	      {"team1":0,"team2":1},
	      {"team1":1,"team2":0},
	      {"team1":1,"team2":0},
	      {"team1":1,"team2":0},
	      {"team1":0,"team2":1},
	      {"team1":1,"team2":0},
	      {"team1":1,"team2":0},
	      {"team1":0,"team2":1},
	      {"team1":0,"team2":1},
	      {"team1":1,"team2":0},
	      {"team1":1,"team2":0},
	      {"team1":0,"team2":1},
	      {"team1":1,"team2":0},
	      {"team1":0,"team2":1},
	      {"team1":1,"team2":0},
	      {"team1":0,"team2":1},
	      {"team1":0,"team2":1},
	    ],[
	      {"team1":0,"team2":1},
	      {"team1":0,"team2":1},
	      {"team1":1,"team2":0},
	      {"team1":1,"team2":0},
	      {"team1":0,"team2":1},
	      {"team1":0,"team2":1},
	      {"team1":0,"team2":1},
	      {"team1":1,"team2":0},
	      {"team1":1,"team2":0},
	      {"team1":0,"team2":1},
	      {"team1":0,"team2":1},
	      {"team1":1,"team2":0},
	      {"team1":1,"team2":0},
	      {"team1":1,"team2":0},
	      {"team1":0,"team2":1},
	      {"team1":0,"team2":1},
	      {"team1":1,"team2":0},
	      {"team1":0,"team2":1},
	      {"team1":0,"team2":1},
	      {"team1":1,"team2":0},
	      {"team1":1,"team2":0},
	      {"team1":1,"team2":0},
	      {"team1":0,"team2":1},
	      {"team1":1,"team2":0},
	      {"team1":1,"team2":0},
	      {"team1":0,"team2":1},
	      {"team1":0,"team2":1},
	      {"team1":1,"team2":0},
	      {"team1":0,"team2":1},
	      {"team1":1,"team2":0},
	      {"team1":0,"team2":1},
	      {"team1":0,"team2":1},
	      {"team1":0,"team2":1},
	      {"team1":1,"team2":0},
	      {"team1":1,"team2":0},
	      {"team1":1,"team2":0},
	      {"team1":0,"team2":1},
	      {"team1":1,"team2":0},
	      {"team1":1,"team2":0},
	      {"team1":0,"team2":1},
	      {"team1":0,"team2":1},
	      {"team1":1,"team2":0},
	      {"team1":1,"team2":0},
	      {"team1":0,"team2":1},
	      {"team1":1,"team2":0},
	      {"team1":0,"team2":1},
	      {"team1":1,"team2":0},
	      {"team1":0,"team2":1},
	      {"team1":0,"team2":1},
	    ],[
	      {"team1":0,"team2":1},
	      {"team1":0,"team2":1},
	      {"team1":1,"team2":0},
	      {"team1":1,"team2":0},
	      {"team1":0,"team2":1},
	      {"team1":0,"team2":1},
	      {"team1":0,"team2":1},
	      {"team1":1,"team2":0},
	      {"team1":1,"team2":0},
	      {"team1":0,"team2":1},
	      {"team1":0,"team2":1},
	      {"team1":1,"team2":0},
	      {"team1":1,"team2":0},
	      {"team1":1,"team2":0},
	      {"team1":0,"team2":1},
	      {"team1":0,"team2":1},
	      {"team1":1,"team2":0},
	      {"team1":0,"team2":1},
	      {"team1":0,"team2":1},
	      {"team1":1,"team2":0},
	      {"team1":1,"team2":0},
	      {"team1":1,"team2":0},
	      {"team1":0,"team2":1},
	      {"team1":1,"team2":0},
	      {"team1":1,"team2":0},
	      {"team1":0,"team2":1},
	      {"team1":0,"team2":1},
	      {"team1":1,"team2":0},
	      {"team1":0,"team2":1},
	      {"team1":1,"team2":0},
	      {"team1":0,"team2":1},
	      {"team1":0,"team2":1},
	      {"team1":0,"team2":1},
	      {"team1":1,"team2":0},
	      {"team1":1,"team2":0},
	      {"team1":1,"team2":0},
	      {"team1":0,"team2":1},
	      {"team1":1,"team2":0},
	      {"team1":1,"team2":0},
	      {"team1":0,"team2":1},
	      {"team1":0,"team2":1},
	      {"team1":1,"team2":0},
	      {"team1":1,"team2":0},
	      {"team1":0,"team2":1},
	      {"team1":1,"team2":0},
	      {"team1":0,"team2":1},
	      {"team1":1,"team2":0},
	      {"team1":0,"team2":1},
	      {"team1":0,"team2":1},
	    ],[
	      {"team1":1,"team2":0},
	      {"team1":0,"team2":1},
	      {"team1":0,"team2":1},
	      {"team1":0,"team2":1},
	      {"team1":1,"team2":0},
	      {"team1":0,"team2":1},
	      {"team1":0,"team2":1},
	      {"team1":1,"team2":0},
	      {"team1":1,"team2":0},
	      {"team1":0,"team2":1},
	      {"team1":1,"team2":0},
	      {"team1":1,"team2":0},
	      {"team1":0,"team2":1},
	      {"team1":1,"team2":0},
	      {"team1":1,"team2":0},
	      {"team1":0,"team2":1},
	      {"team1":1,"team2":0},
	      {"team1":1,"team2":0},
	      {"team1":0,"team2":1},
	      {"team1":1,"team2":0},
	      {"team1":1,"team2":0},
	      {"team1":0,"team2":1},
	      {"team1":1,"team2":0},
	      {"team1":1,"team2":0},
	      {"team1":0,"team2":1},
	    ]
	  ]
	};
 	
 	var pointDatas = []
	for(var i=0; i<_data.pointLog.length; i++){
		for(var ii=0; ii<_data.pointLog[i].length; ii++){
			var pointData = _data.pointLog[i][ii]; 
			pointData["set"] = i;
			pointData["index"] = ii;
			var key = _data.pointLog[i][ii]["team1"] == 1 ? "team1" : "team2";
			pointData["sum"] = _data.pointLog[i].slice(0,(ii+1)).map(m=>m[key]).reduce((p,c,i,a)=>p+c);
			
			pointDatas.push(pointData);
		}	
	}
	
	/////////////////////////
	//関数
	/////////////////////////
	
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

	function init() {
		camera = new THREE.PerspectiveCamera(40, window.width/window.height , 1, 10000 *resolutionZoom);
		camera.position.z = 500 * resolutionZoom;
		isAnimateHand = true;
		
		if(sp){
	    gcontrols = new THREE.DeviceOrientationControls(camera);
			camera.position.z = -1000 * resolutionZoom;
	  }else{
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
	  }

		geometry = new THREE.CubeGeometry( 200, 300, 400 );
		
		///////////////////////////////////////////////
		//ミニグラフ定義
		///////////////////////////////////////////////
		sceneOtherStamp = new THREE.Scene();
// 		sceneMyStamp = new THREE.Scene();
		
		//ミニグラフのサイズ定義
		var sizeBase = 56;
    var width  = sizeBase * resolutionZoom, height = sizeBase * resolutionZoom;
          
		//グラフ描画用のDIV生成 narumi
    elementsPoint = d3.selectAll('.element')
        .data(pointDatas).enter()
        .append('div')
        .attr('class', 'element')
        .attr('id', function(e, i){
        	return "divPanel" + i;
        })
        .style({
	        "width":width + "px",
	        "height": height + "px",
	        "font-size": "72px",
	        "border-radius": "96px",
	        "color": "rgba(255, 255, 255, 0.75)",
	        "text-alain": "center",
					"background": "rgba(0, 0, 0, 0.75)",
// 					"background": "red",
					"background-attachment": "fixed",
					"background-repeat": "no-repeat",
					"opacity": "1",
					"line-height": "125px",
				})
				.text(function(e, i){
        	return e["sum"];
        });
        
    //グラフ描画用のDIV生成 narumi
    elementsLine = d3.selectAll('.elementLine')
        .data(pointDatas).enter()
        .append('hr')
        .attr('class', 'elementLine')
        .style({
	        "width":width + "px",
	        "height": height + "px",
	        "font-size": "72px",
	        "border-radius": "96px",
	        "color": "rgba(255, 255, 255, 0.75)",
	        "text-alain": "center",
					"background": "rgba(0, 0, 0, 0.75)",
					"background": "red",
					"background-attachment": "fixed",
					"background-repeat": "no-repeat",
					"opacity": "1",
					"line-height": "125px",
				})
				.text(function(e, i){
        	return e["sum"];
        });

	    		
		//座標を設定 narumi
		for (let elm of elementsPoint[0]) {
			
			//ランダム配置
			var random = new THREE.Object3D();
			random.position.x = (Math.random() * 4000 - 2000)*resolutionZoom;
			random.position.y = (Math.random() * 4000 - 2000)*resolutionZoom;
			random.position.z = (Math.random() * 4000 - 2000)*resolutionZoom;
			elm['__data__']['random'] = random;
			
			//ARジグザグ配置
			var helix = new THREE.Object3D();
			
			var x_param = 1200;
			var y_param = 4800;
			var z_param = 3200;
			
			var stx = x_param - (x_param/2) * elm['__data__']['set'];
			var sty = y_param - elm['__data__']['index'] * (y_param/25);
			var stz = -z_param;
			
			var atanSitaXZ = Math.atan(Math.abs(stx) / Math.abs(stz)) * 1;
			var atanSitaYZ = Math.atan(Math.abs(sty) / Math.abs(stz)) * 1;
			
			// Y軸方向にて、値が大小大きくなるにつれ見にくいので仮想Z軸の倍率を設定しておく
			var faceR = Math.pow((Math.abs(elm['__data__']['index'] -25) / 22), 2.5) + 0.8;

			var teamDiffUnit = 72
			var teamDiffX = (elm['__data__']['team1'] == 1 ? -teamDiffUnit : teamDiffUnit) * Math.cos(atanSitaXZ) * faceR;
			var teamDiffZ = (elm['__data__']['team1'] == 1 ? -teamDiffUnit : teamDiffUnit) * Math.sin(atanSitaXZ) * faceR;
			
			helix.position.x = teamDiffX + (stx <= 0 ? Math.sin(atanSitaXZ) * Math.abs(stz) : Math.sin(atanSitaXZ) * stz);
			helix.position.y = sty >= 0 ? Math.sin(atanSitaYZ) * Math.abs(stz) * faceR : Math.sin(atanSitaYZ) * stz * faceR;
			helix.position.z = (stx <= 0 ? teamDiffZ : -teamDiffZ) + Math.abs(Math.cos(atanSitaXZ)) * stz + Math.abs(Math.cos(atanSitaYZ)) * stz;
			
			helix.lookAt(new THREE.Vector3(0,0,-z_param));
			elm['__data__']['helix'] = helix;
		}
		
		//シーンへの初期配置処理		
		let list = document.getElementsByClassName('fuga');
		for (let elm of elementsPoint[0]) {
			object = new THREE.CSS3DObject(elm);
	    object.position.fromArray(elm['__data__'].helix.position);
	    object.rotation.fromArray(elm['__data__'].helix.rotation);
	    console.log(elm['__data__'].helix.position);
	    sceneOtherStamp.add(object);
		}
		
		rendererOtherStamp = new THREE.CSS3DRenderer();
		rendererOtherStamp.setSize( window.innerWidth, window.innerHeight );
		rendererOtherStamp.domElement.style.position = 'absolute';
		rendererOtherStamp.domElement.style.top = 0;
		document.getElementById('container').appendChild(rendererOtherStamp.domElement);
		
		rendererMyStamp = new THREE.CSS3DRenderer();
		rendererMyStamp.setSize( window.innerWidth, window.innerHeight );
		rendererMyStamp.domElement.style.position = 'absolute';
		rendererMyStamp.domElement.style.top = 0;
		document.getElementById('container').appendChild(rendererMyStamp.domElement);
		
	}
	
	var isAnimateHand = false;
	var isAnimateAuto = false;
	var isAnimateFly = false;
	var isAnimateCircle = false;
	var piRotate;
	function animate() {
		requestAnimationFrame(animate);
		
		if(sp){
			gcontrols.connect();
      gcontrols.update();
		}else if(isAnimateHand){
			controls.update();
		}
		
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
			
			for (let i = 0; i < sceneOtherStamp.children.length; i++) {
				var circle = new THREE.Object3D();
				var vector = new THREE.Vector3();
				var phi = 2 * i/dataCount * Math.PI + theta;
				var phi_dash = (2 * (i)/dataCount +  0.25) * Math.PI + theta;
				circle.position.set(((r * Math.sin(phi))+(0.75 * r)) *resolutionZoom, 0, (r * Math.cos(phi)) *resolutionZoom);
				
				vector.x = Math.SQRT2 * r * Math.sin(phi_dash) * resolutionZoom;
				vector.y = 0;
				vector.z = Math.SQRT2 * r * Math.cos(phi_dash) * resolutionZoom;
				circle.lookAt(vector);
				
				sceneOtherStamp.children[i].position.set(circle.position.x, circle.position.y, circle.position.z);
				sceneOtherStamp.children[i].rotation.set(circle.rotation.x, circle.rotation.y, circle.rotation.z);	
			}
			camera.lookAt(new THREE.Vector3(0, 0, 0));
		}
				
		TWEEN.update();
		rendererOtherStamp.render( sceneOtherStamp, camera );
	}

	function WindowResize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
	}

	function Transform(layout, duration, callback) {
		TWEEN.removeAll();
		r = 40 * dataCount;
		
		//パネルの表示非表示制御
		elementsPoint.style('display', 'block')
			.transition().duration(duration)
			.transition()
			.duration(1)
			.delay(duration)
			.style('display', "block");
		
		//パネルの移動
		for (let i = 0; i < sceneOtherStamp.children.length; i++) {
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
				newPos = sceneOtherStamp.children[i].element.__data__[layout].position;
				newRot = sceneOtherStamp.children[i].element.__data__[layout].rotation;
			}
				
			//スタンプ移動処理
			var coords = new TWEEN.Tween(sceneOtherStamp.children[i].position)
			    .to({x: newPos.x, y: newPos.y, z: newPos.z}, Math.random() * duration + duration)
			    .easing(TWEEN.Easing.Exponential.InOut)
			    .start();
			
			var rotate = new TWEEN.Tween(sceneOtherStamp.children[i].rotation)
			    .to({x: newRot.x, y: newRot.y, z: newRot.z}, Math.random() * duration + duration)
			    .easing(TWEEN.Easing.Exponential.InOut)
			    .start();
		}
		var update = new TWEEN.Tween(this)
			.to({}, duration * 2)
			.onComplete(function(){
				if(callback) callback();
			})
			.start();
	}
function MoveCameraObject(e){
		
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
		
		var target = document.querySelector('#menuDisplay button.active').textContent;
		var to = {
		    x: e[target].position.x * margin,
		    y: e[target].position.y * margin,
		    z: e[target].position.z * margin,
		};
		var tween = new TWEEN.Tween(from)
	    .to(to, 300)
	    .easing(TWEEN.Easing.Linear.None)
	    .onUpdate(function () {
	        camera.position.set(this.x, this.y, this.z);
	        if(target != "grid")
	        	camera.lookAt(new THREE.Vector3(0, 0, 0));
			})
	    .onComplete(function () {
	        if(target != "grid")
	        	camera.lookAt(new THREE.Vector3(0, 0, 0));
	    })
	    .start();
	}
	function MoveCameraCircleObject(e){
		//elementの移動
		theta = 86/50*Math.PI - (2*e.index*Math.PI/dataCount);
		clockCircle.stop();
		isAnimateCircle = false;
		r = 40 * dataCount;
		
		for (let i = 0; i < sceneOtherStamp.children.length; i++) {
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
			        sceneOtherStamp.children[i].position.set(this.x_pos, this.y_pos, this.z_pos);
			        sceneOtherStamp.children[i].rotation.set(this.x_rot, this.y_rot, this.z_rot);
				})
				.start();
		}
		
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
	            	        	
	            elementsPoint.on('click',null);
	            
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
	  		
	  		if(!sp){
		  		controls.enabled = true;
	  		}
	  		
			elementsPoint.on('click', MoveCameraObject);

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
					
					elementsPoint.on('click', null);
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
	
	//Straight表示用にパネルを徐々に透明にしていく
	function HideAutoPanel(){
		var delayBase = (straightLength/movementSpeed * 1000 * 0.4) + 500;
		var animationSpeed = 100000/movementSpeed;
		var timeCount = dataCount;
		if(filterCategory){
			elementsPoint.transition().duration(animationSpeed)
				.delay(function(d, i){
					return i * straightLength / movementSpeed * 1000 + delayBase
				})
		    .style("opacity",  0)
		    .transition()
		    .delay(function(d, i){
					return i * straightLength / movementSpeed * 1000 + delayBase + animationSpeed
				})
		    .style("visibility",  "hidden");
		  timeCount = elementsPoint.length;
		}else{
			elementsPoint.transition().duration(animationSpeed)
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
    	var d = document.createElement("div");
    	d.setAttribute('id', 'restartStraight');
    	d.style.cssText = 'opacity:0; border: 2px solid rgba(127, 127, 127, 0.25);position:absolute;width:575px;height:400px;background: rgba(101,101,101,0.8);color: white;text-align: center;font-size: 48px;border-radius: 8px; top:'+ (window.innerHeight-400)/2 +'px; left:'+ (window.innerWidth-575)/2 +'px;';
    	var s = document.createElement("span");
    	s.style.cssText = 'vertical-align: middle;line-height: 400px;';
    	s.innerHTML = "restart";
    	d.appendChild(s);
    	document.body.appendChild(d);
    	d3.select("#restartStraight").transition().duration(300).style("opacity",  1).each("end", function() {
    		document.querySelector('#restartStraight').addEventListener('mouseover', function(e){
	        this.style.boxShadow = "0px 0px 12px rgba(256, 256, 256, 0.75)";
        	this.style.border = "1px solid rgba(127, 127, 127, 0.25)";
	      });
	      document.querySelector('#restartStraight').addEventListener('mouseout', function(e){
		      this.style.boxShadow = "none";
        	this.style.border = "2px solid rgba(127, 127, 127, 0.25)";
	      })
	      document.querySelector('#restartStraight').addEventListener('click', function(e){
	    		d3.select("#restartStraight").transition().duration(300).style("opacity",  0).delay(300).remove();
	    		document.querySelector('#menuDisplay button.active').click();
		    });
    	});
    }, ((timeCount + 2) * straightLength / movementSpeed * 1000 + 1000))
	}

	/////////////////////////
	//変数
	/////////////////////////
	var elementsPoint, newElements;
	var filterCnt = 0;
	var filterCategory;
	var movementSpeed;
	var straightLength = 1000;
	var displyStyle = "helix";
	var isDirectionInside = false;
	var isBalloonShow = false;
	var borderInside = {};
	var theta = 0;
	var dataCount;
	var camera;
	var geometry, mesh;
	var sceneOtherStamp, rendererOtherStamp;
	var sceneMyStamp, rendererMyStamp;	
	var controls, gcontrols;
	var clockAutoRotate = new THREE.Clock(false);
	var clockCircle = new THREE.Clock(false);
	var clockFly = new THREE.Clock(false);
	var autoRotate = true; //自動回転フラグ
	var oldTimeSeconds = 0;
	var oldTimeCircle = 0;
	var resolutionZoom = 2.5; //解像度
	var timerAutoHide;
	var hashDisplayStyle = ["sphere", "helix", "grid", "table", "circle", "straight"];
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
	
	//パネル表示スタイル変更ボタン
	var dom = document.createElement("div");
	dom.setAttribute('id', 'menuDisplay');
	dom.innerHTML = "<button class='active'>helix</button><button>random</button>";
	document.body.appendChild(dom)
	
	//データ調整
	dataCount = pointDatas.length;
	movementSpeed = 10000 / dataCount;
	
	init();
	animate();
	
	//表示形式変更
	document.querySelector('#menuDisplay').addEventListener("click", function(e){
		// ボタン以外が押されたら未処理
		if(e.toElement.id == "menuDisplay") return;
		
		//選択されているボタンの見た目変更
		buttons = document.querySelectorAll('#menuDisplay button');
		for(var i = 0; i < buttons.length; i++){
			buttons[i].classList.remove("active")
		}
		e.toElement.classList.add("active");
		
		//変更前表示形式に合わせた処理
		var preDisplayStyle = displyStyle;
		switch(displyStyle){
			case "sphere":
			case "helix":
				break;
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
				elementsPoint.transition();
				elementsPoint.style("visibility", "visible");
				
				break;
		}
		
		//新たなスタイル
		displyStyle = e.target.textContent;
		//変更後表示形式に合わせた処理
		switch(displyStyle){
			case "sphere":
			case "helix":
				//内向きか外向きか判定
				Transform(displyStyle, 1500);
				
				//以前がFlyコントローラの場合はコントローラの切替を行う
				if(preDisplayStyle == "straight") {
					ChangeControlsOrbit();
					elementsPoint.on('click', MoveCameraObject);
				}else if(preDisplayStyle == "circle") {
					elementsPoint.on("click", null);
					elementsPoint.on('click', MoveCameraObject);
					isAnimateHand = true;
				}
				else isAnimateHand = true;
				
				d3.select("#svgSwitchRotateMode").transition().duration(300).style("opacity", "1");
				
				break;
			case "grid":
			case "table":
			default:
				Transform(displyStyle, 1500);
				
				//以前がFlyコントローラの場合はコントローラの切替を行う
				if(preDisplayStyle == "straight") {
					ChangeControlsOrbit();
					elementsPoint.on('click', MoveCameraObject);
				}else if(preDisplayStyle == "circle") {
					elementsPoint.on("click", null);
					elementsPoint.on('click', MoveCameraObject);
					isAnimateHand = true;
				}
				else isAnimateHand = true;
				
				d3.select("#svgSwitchRotateMode").transition().duration(300).style("opacity", "0");
				break;
			case "circle":
				Transform(displyStyle, 1500, animateCircleStart);
				
				if(preDisplayStyle == "straight") {
					ChangeControlsOrbit();
				}else{
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
	
	//初期表示スタイル適用
	document.querySelector('#menuDisplay button.active').click();
	
	//画面リサイズ
	window.addEventListener('resize', WindowResize, false);
		
	this.finished=true;
}
window.ThreeDD = ThreeDD;
