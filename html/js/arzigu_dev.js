document.ontouchmove = function(event){
    event.preventDefault();
}

//ダブルタップズームの制御
var lastTouchEnd = 0;
document.addEventListener('touchend', function (event) {
  var now = (new Date()).getTime();
  if (now - lastTouchEnd <= 300) {
    event.preventDefault();
  }
  lastTouchEnd = now;
}, false);

//クラス定義
var ThreeDD = {};
ThreeDD.main = function(){
	
	/////////////////////////
	//ユーザ定義変数
	/////////////////////////
	var autoLoadMiliSecond = 3000;
	
	/////////////////////////
	//プライベート変数
	/////////////////////////
	var container = d3.select("#container");
	var elements, elementsLine, elementsSchool;
	var theta = 0;
	var camera;
	var geometry, mesh;
	var scene;
	var renderer;
	var controls, gcontrols;
	var resolutionZoom = 2.5; //解像度
	//得点サイズ定義
  var sizeBase = 56;
  var width  = sizeBase * resolutionZoom, height = sizeBase * resolutionZoom;
	// userAgentの判定
	var sp = false;
	var ua = navigator.userAgent;
    if (ua.indexOf('iPhone') > 0 || ua.indexOf('iPod') > 0 || ua.indexOf('Android') > 0 || ua.indexOf('iPad') > 0) {
        var sp = true;
    }
	
	//スタンプ画像のキャッシュ
	var baboImgs={};
	for(var i=0; i<10; i++){
		baboImgs[i]=new Image();
		baboImgs[i].src="/html/image/babo/sticker_"+i+".png";		
	}	

	// 	データの作成
	// 	データの作成
	var rowData = {
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
	
	var pointDatas = {};
	var currentSetIndex = rowData.pointLog.length-1;
	for(var i=0; i<rowData.pointLog.length; i++){
		pointDatas[i] = [];
		for(var ii=0; ii<rowData.pointLog[i].length; ii++){
			var pointData = rowData.pointLog[i][ii]; 
			pointData["set"] = i;
			pointData["index"] = ii;
			var key = rowData.pointLog[i][ii]["team1"] == 1 ? "team1" : "team2";
			pointData["sum"] = rowData.pointLog[i].slice(0,(ii+1)).map(m=>m[key]).reduce((p,c,i,a)=>p+c);
			pointDatas[i].push(pointData);
		}	
	}

	/////////////////////////
	//関数
	/////////////////////////
	
	function makeStampData(arr, classNm){
		return arr.stampList.map(m=>{
			var obj = {};
			obj.imageId = m;
			obj.time = Math.random() * 3000;
			obj.classNm = classNm;
			return obj;
		});
	}
	
	//データをポーリングで読み込んで描画する
	function autoLoadData(){
		
		//セット数の文言更新
		document.getElementById("setValue").textContent = (currentSetIndex+1) + "set";
		
		for(var e in scene.children){
			if(e.element)e.element.remove();
		}
		
		var schoolData = [{"name":"星城"},{"name":"育英"}];
		var data = pointDatas[currentSetIndex];
		var lineData = data.map((m,i)=>{
			if(i==data.length-1) return m;
			if(data[i+1].team1 == 1 && m.team1 == 0) m.direction = 'up';
			else if(data[i+1].team1 == 0 && m.team1 == 1) m.direction = 'down';
			else m.direction = 'horizon';
			return m
		}).slice(0, data.length-1)
		
		if(elements){
								
				//描画既存のエレメントを削除する
				while(scene.children.length > 0){ 
				  scene.remove(scene.children[0]); 
				}
				
				var exit = elements.data(data)
				exit.exit().remove();
				elements = exit.enter().append('div').merge(exit);
				
				var exitLine = elementsLine.data(lineData)
				exitLine.exit().remove();
				elementsLine = exitLine.enter().append('hr').merge(exitLine);
				
		}else{
			//初回描画
			elements = container.selectAll(".schoolNm").data(data).enter().append('div');
			elementsLine = container.selectAll(".ziguline").data(lineData).enter().append('hr');
			elementsSchool = container.selectAll(".point").data(schoolData).enter().append('div');
		}
		
		elementsSchool
				.text(e=>e.name)
        .attr('class', 'schoolNm')
        .style("font-size", "54px")
				.style("color", "rgba(255, 255, 255, 1)")
				.style("opacity", "1")
				.style("text-align", "center");
				
		elements
				.text(function(e, i){
		    	return e["sum"];
		    })
        .attr('class', 'point')
        .attr('id', function(e, i){
        	return "divPanel" + i;
        })
        .style("width", width + "px")
        .style("height", height + "px")
        .style("font-size", "72px")
				.style("border-radius", "96px")
				.style("color", "rgba(255, 255, 255, 0.75)")
				.style("text-alain", "center")
// 				.style("background", "rgba(0, 0, 0, 0.75)")
				.style("background", "red")
				.style("background-attachment", "fixed")
				.style("background-repeat", "no-repeat")
				.style("opacity", "1")
				.style("line-height", "140px")
				.style("text-align", "center");
				
		//グラフ描画用のDIV生成
    elementsLine
        .attr('class', 'ziguline')
        .attr('width','200')
        .attr('color','#ffffff')
     
		//座標を設定して配置する
		var cnt = 0;
		var l = elements._groups[0].length;
		
		for (let e of elements._groups[0]) {

			if(e){
				SetPosition(e, cnt, l);	
				//初期配置
				var object = new THREE.CSS3DObject(e);
				object.position.set(e.__data__.arzigu.position.x, e.__data__.arzigu.position.y, e.__data__.arzigu.position.z);
		    object.rotation.set(e.__data__.arzigu.rotation.x, e.__data__.arzigu.rotation.y, e.__data__.arzigu.rotation.z);
		    scene.add(object);
			}
			
			if(elementsLine._groups[0].length > cnt && elementsLine._groups[0][cnt]){
				SetLinePosition(elementsLine._groups[0][cnt], cnt, l);	
				var el = elementsLine._groups[0][cnt]
		    var objLine = new THREE.CSS3DObject(elementsLine._groups[0][cnt]);
				objLine.position.set(el.__data__.arziguLine.position.x, el.__data__.arziguLine.position.y, el.__data__.arziguLine.position.z);
		    objLine.rotation.set(el.__data__.arziguLine.rotation.x, el.__data__.arziguLine.rotation.y, el.__data__.arziguLine.rotation.z);
		    scene.add(objLine);
			}
			
		  cnt++;
		}
		
		
		for (var i = 0; i<elementsSchool._groups[0].length; i++){
			SetScoolPosition(elementsSchool._groups[0][i], i, elements._groups[0].length)
			var es = elementsSchool._groups[0][i]
			var objectScool = new THREE.CSS3DObject(es);
			objectScool.position.set(es.__data__.arziguScool.position.x, es.__data__.arziguScool.position.y, es.__data__.arziguScool.position.z);
	    objectScool.rotation.set(es.__data__.arziguScool.rotation.x, es.__data__.arziguScool.rotation.y, es.__data__.arziguScool.rotation.z);
	    scene.add(objectScool);
		}
		
		removeEmptyDiv();

// 		transform()
/*
		setTimeout(function(){
			autoLoadData();
		}, autoLoadMiliSecond);
*/
	}
	
	function transform(){
		TWEEN.removeAll();
		var duration = 3000;
		
		//パネルの表示非表示制御
/*
		elements
			.transition().duration(duration)
			.style('opacity', function(d,i){
				return 1;
			});
*/
		
		//パネルの移動
		for(var i = 0; i < scene.children.length; i++){
			var v = scene.children[i];
			
			if(!v.element)continue;
			
			var newPos;
			var newRot;
			
			var key = "arzigu";
			if(v.element.__data__["arziguScool"]){
				key = "arziguScool";
			}else if(v.element.__data__["arziguLine"]){
				key = "arziguLine";
			}
			
			newPos = v.element.__data__[key].position;
			newRot = v.element.__data__[key].rotation;
			
			var position = new TWEEN.Tween(v.position)
			    .to({x: newPos.x, y: newPos.y, z: newPos.z}, Math.random() * duration + duration)
			    .easing(TWEEN.Easing.Exponential.InOut)
			    .start();
			
			var rotate = new TWEEN.Tween(v.rotation)
			    .to({x: newRot.x, y: newRot.y, z: newRot.z}, Math.random() * duration + duration)
			    .easing(TWEEN.Easing.Exponential.InOut)
			    .start();
		}
	
		var update = new TWEEN.Tween(this)
			.to({}, duration * 2)
			.onUpdate(function(){
				renderer.render( scene, camera )
			})
			.start();
	}			
		
	function removeEmptyDiv(){
		//空のDivを削除する
		var div = document.getElementById("container").childNodes;
		for(var i = 0; i < div.length; i++){
			if(div[i].style.cssText == ""){
				div[i].remove();
			}
		}
	}

	// 	Threeの初期化処理
	function init() {
		camera = new THREE.PerspectiveCamera(40, window.width/window.height , 1, 10000 *resolutionZoom);
		camera.position.z = 500;
		
		isAnimateHand = true;
		
		if(sp){
	    gcontrols = new THREE.DeviceOrientationControls(camera);
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

		scene = new THREE.Scene();
		renderer = new THREE.CSS3DRenderer();
		renderer.setSize( window.innerWidth, window.innerHeight );
		renderer.domElement.style.position = 'absolute';
		renderer.domElement.style.top = 0;
		document.getElementById('container').appendChild(renderer.domElement);
	}
	
	//Threeアニメーションの定義
	function animate() {
	
		if(sp){
			gcontrols.connect();
      gcontrols.update();
		}else if(isAnimateHand){
			controls.update();
		}
		
		TWEEN.update();
		renderer.render( scene, camera );
		
		requestAnimationFrame(animate);
	}

	function WindowResize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize( window.innerWidth, window.innerHeight );
	}

	function SetPosition(d, i, dataCnt) {
		
		// １週の中に描画するスタンプの個数
		var countPerCircle = dataCnt > 50 ? dataCnt : 50;
		// 中心点からスタンプを話す距離
		var distance  = 560;
		
		var index = i;
		var piOneStamp = Math.PI * 2 / countPerCircle;
		//螺旋_外向き
		var arzigu = new THREE.Object3D();
		var vector = new THREE.Vector3();
		
		//ズレを計算
		var	phi = (index+4) * piOneStamp + Math.PI/2
		arzigu.position.x = (distance * Math.cos(phi))*resolutionZoom;
		arzigu.position.y = d.__data__.team1 == 1 ? height*0.75 : -height*0.75;
		arzigu.position.z = (distance * Math.sin(phi))*resolutionZoom; 
		
		arzigu.lookAt(new THREE.Vector3(0,0,0));
		
		d.__data__['arzigu'] = arzigu;
		d.__data__['element'] = d;
	}
	
	function SetScoolPosition(d, i, dataCnt) {
		
		// １週の中に描画するスタンプの個数
		var countPerCircle = dataCnt > 50 ? dataCnt : 50;
		// 中心点からスタンプを話す距離
		var distance  = 560;
		var piOneStamp = Math.PI * 2 / countPerCircle;
		//螺旋_外向き
		var arziguScool = new THREE.Object3D();
		var vector = new THREE.Vector3();
		
		//ズレを計算
		var	phi = (dataCnt+4.5) * piOneStamp + Math.PI/2
		arziguScool.position.x = (distance * Math.cos(phi))*resolutionZoom;
		arziguScool.position.y = i == 0 ? height*0.75 : -height*0.75;
		arziguScool.position.z = (distance * Math.sin(phi))*resolutionZoom; 
		
		arziguScool.lookAt(new THREE.Vector3(0,0,0));
		
		d.__data__['arziguScool'] = arziguScool;
		d.__data__['element'] = d;
	}
	
	
	function SetLinePosition(d, i, dataCnt) {
		
		// １週の中に描画するスタンプの個数
		var countPerCircle = dataCnt > 50 ? dataCnt : 50;
		// 中心点からスタンプを話す距離
		var distance  = 560;
		
		var index = i;
		var piOneStamp = Math.PI * 2 / countPerCircle;
		//螺旋_外向き
		var arziguLine = new THREE.Object3D();
		var vector = new THREE.Vector3();
		
		//ズレを計算
		var	phi = (index + 4.5) * piOneStamp + Math.PI/2
		arziguLine.position.x = (distance * Math.cos(phi))*resolutionZoom * 1.02;
		arziguLine.position.y = d.__data__.team1 == 1 ? height*0.75 : -height*0.75;
		arziguLine.position.z = (distance * Math.sin(phi))*resolutionZoom * 1.02; 
		
		//得点パネルを包む角度を設定
		arziguLine.rotation.x = 0;
		
		//連続得点でない場合は斜めにする
		switch(d.__data__.direction){
			case "up":
				arziguLine.rotation.z =  -Math.PI/4;
				arziguLine.position.y = arziguLine.position.y + height*0.75
				break;
			case "down":
				arziguLine.rotation.z =  Math.PI/4;
				arziguLine.position.y = arziguLine.position.y - height*0.75
				break;
			default:
				break;
		}
		
		//得点パネルを包む角度を設定
		arziguLine.rotation.y = Math.PI/2-phi;
		
		d.__data__['arziguLine'] = arziguLine;
		d.__data__['element'] = d;
	}
	
	// 	セット変更用のボタン作成
	function setChangePrev(){
		if(currentSetIndex == 0) return;
		currentSetIndex--;
		autoLoadData();
	}
	function setChangeNext(){
		if(currentSetIndex == Object.keys(pointDatas).length-1) return;
		currentSetIndex++;
		autoLoadData();
	}

	/////////////////////////
	//メイン処理
	/////////////////////////
	
	init();
	
	//スタンプ生成
	autoLoadData(Object.keys(pointDatas).length-1);
		
	animate();
	
	document.getElementById("setChangePrev").addEventListener( "click" , setChangePrev, false );
	document.getElementById("setChangeNext").addEventListener( "click" , setChangeNext, false );
	
	//画面リサイズ
	window.addEventListener('resize', WindowResize, false);
	
}
window.ThreeDD = ThreeDD;
