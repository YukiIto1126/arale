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
	var autoLoadMiliSecond = 4000;
	var yAxisBaseShift = 250;
	/////////////////////////
	//プライベート変数
	/////////////////////////
	var container = d3.select("#container");
	var elementsFst, elementsSnd, newElements;
	var theta = 0;
	var camera;
	var geometry, mesh;
	var scene, renderer;
	var controls, gcontrols;
	var resolutionZoom = 2.5; //解像度
	//スタンプサイズ定義
  var width  = 100 * resolutionZoom, height = 100 * resolutionZoom;
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
	var firstData = {stampList:[]};
	var secondData = {stampList:[]};
	// テスト用にデータ生成
	firstData.stampList = Array(2).fill(0).map(m=>String(Math.floor(Math.random()*9)));
	secondData.stampList = Array(3).fill(0).map(m=>String(Math.floor(Math.random()*9)));

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
	function autoLoadData(elm, data, classNm){
		
		data.stampList = Array(Math.floor(Math.random() * 47)+1).fill(0).map(m=>String(Math.floor(Math.random()*9)));
// 		data.stampList = Array(100).fill(0).map(m=>String(Math.floor(Math.random()*9)));
		var stampData = makeStampData(data, classNm);
		
		console.log("ランダムデータ数："+stampData.length)
		if(elm){
			
			var eles = document.getElementsByClassName(classNm);
			console.log("削除対象前："+ eles.length);
			for(var i=0; i<eles.length; i++){
					eles[i].remove();
				}

			while(document.getElementsByClassName(classNm).length>0){
				var a = document.getElementsByClassName(classNm);			
				for(var i=0; i<a.length; i++){
					a[i].remove();
				}
			}
			
			console.log("削除対象後："+ document.getElementsByClassName(classNm).length);
			
			if(elm._groups[0].length <= stampData.length){
				var enter = elm.data(stampData);
				var elmEnter = enter.enter().append("div");
				elm = elmEnter.merge(enter);	
			}else{
				container.selectAll("."+classNm).data(stampData).exit().remove();
				//描画するエレメントが少なくなる場合は対象のDivを削除する。
				elm = container.selectAll("."+classNm).data(stampData).enter().append('div');
			}
	    console.log("d３データ数："+elm._groups[0].length)
		}else{
			//初回描画
			elm = container.selectAll("."+classNm).data(stampData).enter().append('div');
		}
		
		elm.style('background',function(e, i){
				return 'url(' + baboImgs[e.imageId].src + ')';
			})
			.attr('class',classNm)
			.attr('border','0')
			.style("width",width + "px")
			.style("height", height + "px")
			.style("border","none")
			.style("background-attachment","fixed")
			.style("background-repeat","no-repeat")
			.style("opacity","0")
			.style("background-attachment","fixed")
			.style("background-repeat","no-repeat")
			.transition()
			.duration(600)
			.delay(function(e){
				return e.time;
			})
			.style('opacity', 1)
			.style('padding-top','120px')
			.transition()
			.duration(600)
			.delay(function(e){
				return autoLoadMiliSecond - 1000 + e.time;
			})
			.style('opacity',0)
			.style('padding-top', '0px');
					
		//座標を設定して配置する
		var cnt = 0;
		var l = elm._groups[0].length;
		for (let e of elm._groups[0]) {
			SetPosition(e, cnt, l);
			cnt++;
			
			//初期配置
			var object = new THREE.CSS3DObject(e);
			object.position.set(e['__data__'].arale.position.x, e['__data__'].arale.position.y, e['__data__'].arale.position.z);
	    object.rotation.set(e['__data__'].arale.rotation.x, e['__data__'].arale.rotation.y, e['__data__'].arale.rotation.z);
	    scene.add(object);
		}
		
		removeEmptyDiv();
		
		setTimeout(function(){
			autoLoadData(elm, data, classNm);
		}, autoLoadMiliSecond * 2.5);
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
		camera.position.z = 500 * resolutionZoom;
		
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
		requestAnimationFrame(animate);
		
		if(sp){
			gcontrols.connect();
      gcontrols.update();
		}else if(isAnimateHand){
			controls.update();
		}
		
		// 自分が送ったスタンプのアニメーション
		if(newElements) {
			ne = scene.children.filter(f=>f.element.classList[0] == "elementNew");
			for (let i = 0; i < ne.length; i++) {
				var newPosition = new THREE.Object3D();
				if(gcontrols){
					newPosition.position.set(
						ne[i].position.x + 50*Math.cos(camera.rotation.x)*Math.cos(camera.rotation.y+Math.PI/2),
						ne[i].position.y + 50*Math.sin(camera.rotation.x),
						ne[i].position.z - 50*Math.cos(camera.rotation.x)*Math.sin(camera.rotation.y+Math.PI/2)
					);	
				}else{
					newPosition.position.set(
						ne[i].position.x - 50*Math.sin(controls.getPolarAngle())*Math.sin(controls.getAzimuthalAngle()),
						ne[i].position.y - 50*Math.cos(controls.getPolarAngle()),
						ne[i].position.z - 50*Math.sin(controls.getPolarAngle())*Math.cos(controls.getAzimuthalAngle())
					);	
				}
				newPosition.lookAt(camera.position);
				ne[i].position.set(newPosition.position.x, newPosition.position.y, newPosition.position.z);
				ne[i].rotation.set(newPosition.rotation.x, newPosition.rotation.y, newPosition.rotation.z);	
			}
		}
		TWEEN.update();
		renderer.render( scene, camera );
	}

	function WindowResize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize( window.innerWidth, window.innerHeight );
	}

	function SetPosition(d, i, dataCnt) {
		
		// １週の中に描画するスタンプの個数
		var countPerCircle = dataCnt < 36 ? dataCnt : 36;
		// 中心点からスタンプを話す距離
		var distance  = 750;
		
		var index = i;
		var piOneStamp = Math.PI * 2 / countPerCircle;
		//螺旋_外向き
		var arale = new THREE.Object3D();
		var vector = new THREE.Vector3();
		
		//ズレを計算
		var	phi = ((index) + 12) * piOneStamp + Math.PI/2
		arale.position.x = (distance * Math.sin(phi))*resolutionZoom + (-120 + Math.random()*240);
		arale.position.y = Math.floor(dataCnt/countPerCircle/2) * -120 + Math.floor(index/countPerCircle) * 240 + (-120 + Math.random()*240) - 480 + yAxisBaseShift; 
		arale.position.z = (distance * Math.cos(phi))*resolutionZoom + (-60 + Math.random()*120); 
		vector.x = arale.position.x * 2 *resolutionZoom;
		vector.y = arale.position.y *resolutionZoom;
		vector.z = arale.position.z * 2 *resolutionZoom;
		arale.lookAt(camera.position);
		
		d['__data__']['arale'] = arale;
		d['__data__']['element'] = d;
	}
	
	/////////////////////////
	//メイン処理
	/////////////////////////
	
	init();
	
	//スタンプ生成
	autoLoadData(elementsFst, firstData, "elementFirst");
	setTimeout(function(){
		autoLoadData(elementsSnd, secondData, "elementSecond");
	}, autoLoadMiliSecond)
		
	animate();
	
	//画面リサイズ
	window.addEventListener('resize', WindowResize, false);
	    
	// 	スタンプ送信機能
	var myStamps = [];
	document.querySelector("#sendstamp").addEventListener('click', function(e){

	  //新規投稿データ生成
	  var newData = {"img":e.target.getAttribute("src")};
	  myStamps.push(newData);

	  //グラフ描画用のDIV生成
    newElements = container.select('.elementNew')
	    .data(myStamps).enter()
	    .append('div');
	  newElements.attr('class', 'elementNew')
	    .style("width", width + "px")
	    .style("height", height + "px",)
	    .style("background", function(e, i){
						return "url('"+e.img+"')"
			})
	    .style("background-attachment", "fixed")
	    .style("background-repeat", "no-repeat")
	    .style("opacity", "1")
			.transition()
			.duration(3000)
			.delay(100)
			.style('opacity', '0')
			.on('end', function(e) { 
				scene.remove(scene.children.filter(f=>f.element.className=="elementNew")[0])
				this.remove();
				myStamps.splice(0, 1);
				if(myStamps.length == 0){
					d3.selectAll('.elementNew').remove();
				}
			})
			.remove();

		//座標を設定
		var newPosition = new THREE.Object3D();
		vector = new THREE.Vector3(0,0,0);
		
		newPosition.position.x = camera.position.x;
		newPosition.position.y = 0;
		newPosition.position.z = camera.position.z * 0.8;
		
		newPosition.lookAt(vector);
		myStamps[myStamps.length-1]['newPosition'] = newPosition.position;
		
		//シーンへの初期配置処理
		var object = new THREE.CSS3DObject(newElements._groups[0][myStamps.length-1]);
    object.position.fromArray(newPosition.position);
    object.rotation.fromArray(newPosition.rotation);
    scene.add(object);
    object.position.set(newPosition.position.x,newPosition.position.y,newPosition.position.z);
    object.rotation.set(newPosition.rotation.x,newPosition.rotation.y,newPosition.rotation.z);
  });
}
window.ThreeDD = ThreeDD;
