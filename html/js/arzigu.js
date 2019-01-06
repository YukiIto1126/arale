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
	var duration = 3000;
	var distance  = 960;
	var yAxisBaseShift = -300;
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
	var curentSetPointCnt = 0;
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
	      {"team1":1,"team2":0},
				{"team1":1,"team2":0},
				{"team1":1,"team2":0},
				{"team1":1,"team2":0},
				{"team1":1,"team2":0},
				{"team1":1,"team2":0},
				{"team1":0,"team2":1},
				{"team1":1,"team2":0},
				{"team1":0,"team2":1},
				{"team1":0,"team2":1},
				{"team1":1,"team2":0},
				{"team1":1,"team2":0},
				{"team1":1,"team2":0},
				{"team1":0,"team2":1},
				{"team1":0,"team2":1},
				{"team1":1,"team2":0},
				{"team1":1,"team2":0},
				{"team1":1,"team2":0},
				{"team1":0,"team2":1},
				{"team1":0,"team2":1},
				{"team1":0,"team2":1},
				{"team1":1,"team2":0}
	    ]
	  ]
	};
/*
	var rowData = {
	  "matchId": "string",
	  "setNo": 2,
	  "team1Score": 14,
	  "team2Score": 11,
	  "pointLog": [
	    [
	      {"team1":1,"team2":0},
				{"team1":1,"team2":0},
				{"team1":1,"team2":0},
				{"team1":1,"team2":0},
				{"team1":1,"team2":0},
				{"team1":1,"team2":0},
				{"team1":0,"team2":1},
				{"team1":1,"team2":0},
				{"team1":0,"team2":1},
				{"team1":0,"team2":1},
				{"team1":1,"team2":0},
				{"team1":1,"team2":0},
				{"team1":1,"team2":0},
				{"team1":0,"team2":1},
				{"team1":0,"team2":1},
				{"team1":1,"team2":0},
				{"team1":1,"team2":0},
				{"team1":1,"team2":0},
				{"team1":0,"team2":1},
				{"team1":0,"team2":1},
				{"team1":0,"team2":1},
				{"team1":1,"team2":0},
				{"team1":1,"team2":0},
				{"team1":0,"team2":1},
				{"team1":1,"team2":0},
				{"team1":1,"team2":0},
				{"team1":0,"team2":1},
				{"team1":0,"team2":1},
				{"team1":0,"team2":1},
				{"team1":1,"team2":0},
				{"team1":0,"team2":1},
				{"team1":0,"team2":1},
				{"team1":1,"team2":0},
				{"team1":0,"team2":1},
				{"team1":0,"team2":1},
				{"team1":0,"team2":1},
				{"team1":0,"team2":1},
				{"team1":0,"team2":1},
				{"team1":1,"team2":0},
				{"team1":0,"team2":1},
				{"team1":1,"team2":0},
				{"team1":1,"team2":0},
				{"team1":0,"team2":1},
				{"team1":1,"team2":0},
				{"team1":1,"team2":0},
				{"team1":1,"team2":0},
				{"team1":0,"team2":1},
				{"team1":0,"team2":1},
				{"team1":0,"team2":1},
				{"team1":0,"team2":1},
	    ],[
	      {"team1":1,"team2":0},
				{"team1":0,"team2":1},
				{"team1":1,"team2":0},
				{"team1":0,"team2":1},
				{"team1":1,"team2":0},
				{"team1":0,"team2":1},
				{"team1":1,"team2":0},
				{"team1":1,"team2":0},
				{"team1":0,"team2":1},
				{"team1":1,"team2":0},
				{"team1":0,"team2":1},
				{"team1":1,"team2":0},
				{"team1":0,"team2":1},
				{"team1":1,"team2":0},
				{"team1":0,"team2":1},
				{"team1":1,"team2":0},
				{"team1":1,"team2":0},
				{"team1":0,"team2":1},
				{"team1":0,"team2":1},
				{"team1":1,"team2":0},
				{"team1":1,"team2":0},
				{"team1":1,"team2":0},
				{"team1":1,"team2":0},
				{"team1":1,"team2":0},
				{"team1":1,"team2":0},
				{"team1":1,"team2":0},
				{"team1":1,"team2":0},
				{"team1":1,"team2":0},
				{"team1":0,"team2":1},
				{"team1":0,"team2":1},
				{"team1":1,"team2":0},
				{"team1":0,"team2":1},
				{"team1":0,"team2":1},
				{"team1":0,"team2":1},
				{"team1":0,"team2":1},
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
				{"team1":0,"team2":1},
				{"team1":1,"team2":0}
	    ],[
	      {"team1":0,"team2":1},
				{"team1":1,"team2":0},
				{"team1":0,"team2":1},
				{"team1":0,"team2":1},
				{"team1":1,"team2":0},
				{"team1":0,"team2":1},
				{"team1":0,"team2":1},
				{"team1":0,"team2":1},
				{"team1":1,"team2":0},
				{"team1":0,"team2":1},
				{"team1":0,"team2":1},
				{"team1":0,"team2":1},
				{"team1":0,"team2":1},
				{"team1":1,"team2":0},
				{"team1":0,"team2":1},
				{"team1":0,"team2":1},
				{"team1":1,"team2":0},
				{"team1":1,"team2":0},
				{"team1":1,"team2":0},
				{"team1":1,"team2":0},
				{"team1":0,"team2":1},
				{"team1":0,"team2":1},
				{"team1":1,"team2":0},
				{"team1":0,"team2":1},
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
				{"team1":1,"team2":0},
				{"team1":0,"team2":1},
				{"team1":0,"team2":1},
				{"team1":1,"team2":0},
				{"team1":0,"team2":1},
	    ],[
				{"team1":0,"team2":1},
				{"team1":1,"team2":0},
				{"team1":0,"team2":1},
				{"team1":0,"team2":1},
				{"team1":1,"team2":0},
				{"team1":1,"team2":0},
				{"team1":1,"team2":0},
				{"team1":0,"team2":1},
				{"team1":0,"team2":1},
				{"team1":0,"team2":1},
				{"team1":0,"team2":1},
				{"team1":0,"team2":1},
				{"team1":1,"team2":0},
				{"team1":0,"team2":1},
				{"team1":0,"team2":1},
				{"team1":0,"team2":1},
				{"team1":0,"team2":1},
				{"team1":0,"team2":1},
				{"team1":1,"team2":0},
				{"team1":1,"team2":0},
				{"team1":1,"team2":0},
				{"team1":1,"team2":0},
				{"team1":1,"team2":0},
				{"team1":0,"team2":1},
				{"team1":0,"team2":1},
				{"team1":0,"team2":1},
				{"team1":1,"team2":0},
				{"team1":1,"team2":0},
				{"team1":0,"team2":1},
				{"team1":1,"team2":0},
				{"team1":0,"team2":1},
				{"team1":1,"team2":0},
				{"team1":1,"team2":0},
				{"team1":1,"team2":0},
				{"team1":1,"team2":0},
				{"team1":1,"team2":0},
				{"team1":0,"team2":1},
				{"team1":0,"team2":1},
				{"team1":0,"team2":1},
				{"team1":1,"team2":0},
				{"team1":0,"team2":1},
				{"team1":0,"team2":1},
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
	      {"team1":0,"team2":1},
	      {"team1":1,"team2":0},
	      {"team1":1,"team2":0},
	      {"team1":0,"team2":1},
	      {"team1":1,"team2":0},
	      {"team1":1,"team2":0}
	    ]
	  ]
	};
*/
	
	var pointDatas = makePointData(rowData);
	var currentSetIndex = rowData.pointLog.length-1;
	
	
	/////////////////////////
	//関数
	/////////////////////////
	
	function makePointData(rowData){
		var _pointDatas = [];
		for(var i=0; i<rowData.pointLog.length; i++){
			//ポイント毎での繰り返し
			for(var ii=0; ii<rowData.pointLog[i].length; ii++){
				if(!_pointDatas[ii]) _pointDatas[ii] = {};
				if(!_pointDatas[ii]["index"])_pointDatas[ii]["index"] = ii;
				
				_pointDatas[ii]["set"+i] = {};
				d = _pointDatas[ii]["set"+i]
				d["point"] = rowData.pointLog[i][ii]; 
				
				var key = rowData.pointLog[i][ii]["team1"] == 1 ? "team1" : "team2";
				d["sum"] = rowData.pointLog[i].slice(0,(ii+1)).map(m=>m[key]).reduce((p,c,i,a)=>p+c);
	
				if(ii>0){
					var thisTeam = _pointDatas[ii]["set"+i].point;
					var preTeam = _pointDatas[ii - 1]["set"+i].point;
					if(thisTeam.team1 == 1 && preTeam.team1 == 0) d["direction"] = 'up';
					else if(thisTeam.team1 == 0 && preTeam.team1 == 1) d["direction"] = 'down';
					else d["direction"] = 'horizon';
				}
			}	
			curentSetPointCnt = rowData.pointLog[i].length;
		}	
		return _pointDatas
	}
	
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
	function FistSetPosition(){
		
		//セット数の文言更新
		document.getElementById("setValue").textContent = (currentSetIndex+1) + "set";
		
		var schoolData = [{"name":"星城"},{"name":"育英"}];
		var lineData = pointDatas.slice(1,pointDatas.length); 

		//初回描画
		elements = container.selectAll(".point").data(pointDatas).enter().append('div');
		elementsLine = container.selectAll(".ziguline").data(lineData).enter().append('hr');
		elementsSchool = container.selectAll(".schoolNm").data(schoolData).enter().append('div');
		
		elementsSchool
				.text(e=>e.name)
        .attr('class', 'schoolNm')
        .style("opacity", 0)
        .style("font-size", "54px")
				.style("color", "rgba(255, 255, 255, 1)")
				.style("text-align", "center")
				.transition().duration(duration)
				.style("opacity", "1");
				
		elements
				.text(function(e, i){
		    	return e["set"+currentSetIndex] ? e["set"+currentSetIndex]["sum"] : "";
		    })
        .attr('class', 'point')
        .attr('id', function(e, i){
        	return "divPanel" + i;
        })
        .style("opacity", 0)
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
				.style("line-height", "140px")
				.style("text-align", "center")
				.transition().duration(duration)
				.style("opacity", function(e, i){
        	return e["set"+currentSetIndex] ? "1" : "0";
        });
				
				
		//グラフ描画用のDIV生成
    elementsLine
        .attr('class', 'ziguline')
        .attr('width','200')
        .attr('color','#ffffff')
        .style("opacity", 0)
        .transition().duration(duration)
        .style("opacity", function(e, i){
        	return e["set"+currentSetIndex] ? "1" : "0";
        });
     
		//座標を設定して配置する
		var cnt = 0;
		
		for (let e of elements._groups[0]) {

			if(e){
				SetPosition(e, cnt);	
				//初期配置
				var object = new THREE.CSS3DObject(e);
		    scene.add(object);
			}
			
			if(elementsLine._groups[0].length > cnt && elementsLine._groups[0][cnt]){
				SetLinePosition(elementsLine._groups[0][cnt], cnt);	
				var el = elementsLine._groups[0][cnt]
		    var objLine = new THREE.CSS3DObject(elementsLine._groups[0][cnt]);
		    scene.add(objLine);
			}
		  cnt++;
		}
		
		for (var i = 0; i<elementsSchool._groups[0].length; i++){
			SetScoolPosition(elementsSchool._groups[0][i], i, curentSetPointCnt)
			var es = elementsSchool._groups[0][i]
			var objectScool = new THREE.CSS3DObject(es);
	    scene.add(objectScool);
	    objectScool.position.set(elementsSchool._groups[0][i].__data__['arziguScool'].position.x, elementsSchool._groups[0][i].__data__['arziguScool'].position.y, elementsSchool._groups[0][i].__data__['arziguScool'].position.z)
	    objectScool.rotation.set(elementsSchool._groups[0][i].__data__['arziguScool'].rotation.x, elementsSchool._groups[0][i].__data__['arziguScool'].rotation.y, elementsSchool._groups[0][i].__data__['arziguScool'].rotation.z)
		}
		
   	transform();
	}	
	
	function autoLoadData(){
		
		//デモ用にカレンとセットにでーたを増やす
		var r = Math.round(Math.random());
		var obj = {"team1":0, "team2":1};
		if( r == 0 ) obj = {"team1":1, "team2":0};
		var _rowData = Object.assign({}, rowData);
		_rowData.pointLog[rowData.pointLog.length-1].push(obj);
		
		//増加得点データの抽出
		var newPointData = makePointData(_rowData);
		var newLinwData = newPointData.slice(1,newPointData.length);
		
		//セットが変更されたかの判定
		if(rowData.pointLog.length != _rowData.pointLog.length){
			//anythin done・・・
		}else{
			//表示しているデータ数を増やすかどうか判定
			if(pointDatas.length < _rowData.pointLog[rowData.pointLog.length-1].length){
				
				//エレメント数も増やす
				var exit = elements.data(newPointData);
				elements = exit.enter().append('div').merge(exit);
				
				var exitLine = elementsLine.data(newLinwData);
				elementsLine = exitLine.enter().append('hr').merge(exitLine);
				
				//ScenObjectも増やす
				//位置も再計算する
				
				elements
					.text(function(e, i){
			    	return e["set"+currentSetIndex] ? e["set"+currentSetIndex]["sum"] : "";
			    })
	        .attr('class', 'point')
	        .attr('id', function(e, i){
	        	return "divPanel" + i;
	        })
	        .style("opacity", 1)
	        .style("width", width + "px")
	        .style("height", height + "px")
	        .style("font-size", "72px")
					.style("border-radius", "96px")
					.style("color", "rgba(255, 255, 255, 0.75)")
					.style("text-alain", "center")
// 					.style("background", "rgba(0, 0, 0, 0.75)")
					.style("background", "red")
					.style("background-attachment", "fixed")
					.style("background-repeat", "no-repeat")
					.style("line-height", "140px")
					.style("text-align", "center");
						
				//グラフ描画用のDIV生成
		    elementsLine
	        .attr('class', 'ziguline')
	        .attr('width','200')
	        .attr('color','#ffffff')
	        .style("opacity", 1);
	     
				//座標を設定して配置する
				for (var cnt = 0; cnt < elements._groups[0].length; cnt++) {
					var e = elements._groups[0][cnt];
					if(e){
						SetPosition(e, cnt);	
						if(cnt > pointDatas.length-1){
							// オブジェクトの配置の良し悪しを判断する
							var object = new THREE.CSS3DObject(e);
							object.position.set(0, 0, -500);
					    scene.add(object);	
						}
					}
					
					if(elementsLine._groups[0].length > cnt && elementsLine._groups[0][cnt]){
						var el = elementsLine._groups[0][cnt]
						SetLinePosition(el, cnt);	
						if(cnt > pointDatas.length-2){
							var objLine = new THREE.CSS3DObject(el);
							objLine.position.set(el.__data__["arziguLine"+currentSetIndex].position.x, el.__data__["arziguLine"+currentSetIndex].position.y, el.__data__["arziguLine"+currentSetIndex].position.z);
					    scene.add(objLine);
						}
					}
				}
				
		   	transform();
		   	
			}else{
				//データ件数が増えなかった場合
				
				//エレメントのデータを更新するだけ
				//位置の再計算を行う。
			}
		}
		
		rowData = _rowData;
		pointDatas = newPointData;
	}
	setInterval(autoLoadData, 8000);
	
	// 	
	function changeSet(){
		//セット数の文言更新
		document.getElementById("setValue").textContent = (currentSetIndex+1) + "set";
		curentSetPointCnt = rowData.pointLog[currentSetIndex].length;
		
		elements
				.transition().duration(duration)
				.text(function(e, i){
		    	return e["set"+currentSetIndex] ? e["set"+currentSetIndex]["sum"] : "";
		    })
				.style("opacity", function(e, i){
        	return e["set"+currentSetIndex] ? "1" : "0";
        })
		
		elementsLine
				.transition().duration(duration)
        .style("opacity", function(e, i){
        	return e["set"+currentSetIndex] ? "1" : "0";
        });

		transform();
	}
	
	function transform(){
		TWEEN.removeAll();
		
		//パネルの表示非表示制御
		elements
			.transition().duration(duration)
			.style("opacity", function(e, i){
        	return e["set"+currentSetIndex] ? "1" : "0";
      });
		
		//パネルの移動
		for(var i = 0; i < scene.children.length; i++){
			var v = scene.children[i];
			
			if(!v.element)continue;
			
			var newPos;
			var newRot;
			
			var key;
			switch(v.element.className){
				case "point":
					key = "arzigu"+currentSetIndex;
					break;
				case "ziguline":
					key = "arziguLine"+currentSetIndex;
					break;
				case "schoolNm":
					continue;
					break;
				default:
					break;
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
		
		//バボちゃんコメントのリサイズ
		var baboWidth = document.getElementById("baboImg").width;
		document.getElementById("baboCommentDiv").style.width = window.innerWidth - baboWidth - 78 + "px";
	}

	function SetPosition(d, index) {
		// 中心点からスタンプを話す距離
		for(var i = 0; i<=currentSetIndex; i++){
			// １週の中に描画するスタンプの個数
			var dataCnt = rowData.pointLog[i].length;
			var countPerCircle = dataCnt > 48 ? dataCnt+2 : 50;
			var piOneStamp = Math.PI * 2 / countPerCircle / 2;
			var zure = -Math.PI/3 - piOneStamp * dataCnt;
		
			//螺旋_外向き
			var arzigu = new THREE.Object3D();
			//ズレを計算
			var	phi = index * piOneStamp + zure;
			arzigu.position.x = (distance * Math.cos(phi))*resolutionZoom;
			arzigu.position.y = (d.__data__["set"+i] ? (d.__data__["set"+i]["point"].team1==1 ? height*0.75 : -height*0.75) : 0) + yAxisBaseShift;
			arzigu.position.z = (distance * Math.sin(phi))*resolutionZoom; 
			//回転を設定
			arzigu.lookAt(new THREE.Vector3(0,0,0));
			//位置・回転情報の設定
			d.__data__['arzigu'+i] = arzigu;	
		}
		
		d.__data__['element'] = d;
	}
	
	function SetLinePosition(d, index) {
		for(var i = 0; i<=currentSetIndex; i++){
			// １週の中に描画するスタンプの個数
			var dataCnt = rowData.pointLog[i].length;
			var countPerCircle = dataCnt > 48 ? dataCnt+2 : 50;
			var piOneStamp = Math.PI * 2 / countPerCircle / 2;
			var zure = -Math.PI/3 - piOneStamp * dataCnt;
			
			//螺旋_外向き
			var arziguLine = new THREE.Object3D();
			//ズレを計算
			var	phi = (index+0.5) * piOneStamp + zure;
			arziguLine.position.x = (distance * Math.cos(phi))*resolutionZoom * 1.02;
			arziguLine.position.y = (d.__data__["set"+i] ? (d.__data__["set"+i]["point"].team1==1 ? height*0.75 : -height*0.75) : 0) + yAxisBaseShift;
			arziguLine.position.z = (distance * Math.sin(phi))*resolutionZoom * 1.02; 
			
			//得点パネルを包む角度を設定
			arziguLine.rotation.x = 0;
			
			//連続得点でない場合は斜めにする
			if(d.__data__["set"+i]){
				switch(d.__data__["set"+i].direction){
					case "up":
						arziguLine.rotation.z =  -Math.PI/4;
						arziguLine.position.y = arziguLine.position.y - height*0.75
						break;
					case "down":
						arziguLine.rotation.z =  Math.PI/4;
						arziguLine.position.y = arziguLine.position.y + height*0.75
						break;
					default:
						break;
				}
			}
			//得点パネルを包む角度を設定
			arziguLine.rotation.y = Math.PI/2-phi;
			d.__data__['arziguLine'+i] = arziguLine;
		}
		d.__data__['element'] = d;
	}
	
	function SetScoolPosition(d, i, dataCnt) {
		
		//螺旋_外向き
		var arziguScool = new THREE.Object3D();
		arziguScool.position.x = (distance * Math.cos(-Math.PI/3))*resolutionZoom;
		arziguScool.position.y = (i == 0 ? height*0.75 : -height*0.75) + yAxisBaseShift;
		arziguScool.position.z = (distance * Math.sin(-Math.PI/3))*resolutionZoom; 
		arziguScool.lookAt(new THREE.Vector3(0,0,0));
		
		d.__data__['arziguScool'] = arziguScool;
		d.__data__['element'] = d;
	}
	
	// 	セット変更用のボタン作成
	function setChangePrev(){
		if(currentSetIndex == 0) return;
		currentSetIndex--;
		
		changeSet();
	}
	function setChangeNext(){
		if(currentSetIndex == rowData.pointLog.length-1) return;
		currentSetIndex++;
		
		changeSet();
	}
	
	function baboComment(){
		//データ取得
		var key = Math.floor(Math.random()*10);
		var imageSrc = "html/image/babo/sticker_"+ key +".png";
		var coms = [
		 "５０文字テスト：体調不良すいませんでした。不徳の致すところです。本当に本当に申し訳ありませんでした"
		 ,"テスト"
		 ,"５０文字テスト：体調不良すいませんでした。不徳の致すところです。本当に本当に申し訳ありませんでした"
		 ,"テスト"
		 ,"５０文字テスト：体調不良すいませんでした。不徳の致すところです。本当に本当に申し訳ありませんでした"
		 ,"テスト"
		 ,"５０文字テスト：体調不良すいませんでした。不徳の致すところです。本当に本当に申し訳ありませんでした"
		 ,"テスト"
		 ,"５０文字テスト：体調不良すいませんでした。不徳の致すところです。本当に本当に申し訳ありませんでした"
		 ,"テスト"
		 ];
		
		//データ更新
		document.getElementById("baboImg").setAttribute("src", imageSrc);
		document.getElementById("baboComment").textContent = coms[key];
		
		//バボちゃん表示処理
		d3.select("#baboArea")
			.transition()
			.duration(1000)
			.style('opacity', 1)
			.style('margin-bottom', "0px")
			.transition()
			.duration(1000)
			.delay(4000)
			.style('opacity', 0)
			.style('margin-bottom', "-180px")
			.on('end', function(e) {
				setTimeout(baboComment, 3000);
			})
	}

	/////////////////////////
	//メイン処理
	/////////////////////////
	
	init();
	
	//スタンプ生成
	FistSetPosition(Object.keys(pointDatas).length-1);
		
	animate();
	
	document.getElementById("setChangePrev").addEventListener( "click" , setChangePrev, false );
	document.getElementById("setChangeNext").addEventListener( "click" , setChangeNext, false );
	
	//画面リサイズ
	window.addEventListener('resize', WindowResize, false);
	
	
	//バボコメント表示
	setTimeout(function(){
		// 	バボコメントエリアのサイズ指定
		var baboWidth = document.getElementById("baboImg").width;
		document.getElementById("baboCommentDiv").style.width = window.innerWidth - baboWidth - 24 + "px";
		
		//バボちゃんコメント画像の余白設定
		//document.getElementById("baboImg").style.marginTop = (document.getElementById("baboArea").clientHeight - document.getElementById("baboImg").clientHeight) / 2 + "px";
		
		baboComment();
	}, 3000);
}
window.ThreeDD = ThreeDD;
