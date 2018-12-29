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
	//変数
	/////////////////////////
	var container = d3.select("#container");
	var elementsFst, elementsSnd, newElements;
	var theta = 0;
	var camera;
	var geometry, mesh;
	var sceneOtherStamp, rendererOtherStamp;
	var sceneMyStamp, rendererMyStamp;	
	var controls, gcontrols;
	var oldTimeSeconds = 0;
	var oldTimeCircle = 0;
	var resolutionZoom = 2.5; //解像度
	//スタンプサイズ定義
  var width  = 100 * resolutionZoom, height = 100 * resolutionZoom;
	// userAgentの判定
	var sp = false;
	var ua = navigator.userAgent;
    if (ua.indexOf('iPhone') > 0 || ua.indexOf('iPod') > 0 || ua.indexOf('Android') > 0) {
        var sp = true;
//         document.getElementById("video").style.transform = "scale(1.2)";
    }else if(ua.indexOf('iPad') > 0 || ua.indexOf('Android') > 0){
        var sp = true;
//         document.getElementById("video").style.transform = "scale(1.2)";
    }
	
	//スタンプ画像のキャッシュ
	var baboImgs={};
	for(var i=0; i<10; i++){
		baboImgs[i]=new Image();
		baboImgs[i].src="/html/image/babo/sticker_"+i+".png";		
	}	

	// 	データの作成
	var firstDataRaw = {stampList:[]};
	var secondDataRaw = {stampList:[]};
	// テスト用にデータ生成
	firstDataRaw.stampList = Array(2).fill(0).map(m=>String(Math.floor(Math.random()*9)));
	secondDataRaw.stampList = Array(3).fill(0).map(m=>String(Math.floor(Math.random()*9)));

	//初回描画データとポールリングで受け取る用のデータ
	var firstData = makeStampData(firstDataRaw, "elementFirst");
	var secondData = makeStampData(secondDataRaw, "elementSecond");
	
	//データ格納先の箱の判定
	var isFastData = true;
		
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
		
		firstDataRaw.stampList = Array(Math.floor(Math.random() * 48)).fill(0).map(m=>String(Math.floor(Math.random()*9)));
		firstData = makeStampData(firstDataRaw, "elementFirst");

		if(elementsFst){
			elementsFst.data(firstData).enter()
	      .append('div');
		}else{
			elementsFst = container.selectAll(".elementFirst")
	      .data(firstData).enter().append('div');
		}
		
		elementsFst.attr({
        'class':'elementFirst',
        'border':'0',
       })
      .style({
        "width":width + "px",
        "height": height + "px",
				"background": function(e, i){
						return 'url(' + baboImgs[e.imageId].src + ')';
				},
				"border":"none",
				"background-attachment": "fixed",
				"background-repeat": "no-repeat",
				"opacity": "0"
			})
			.transition()
			.duration(1000)
			.delay(function(e){
				return e.time;
			})
			.style({
				'opacity':1,
				'padding-top': '120px'
			})
			.transition()
			.duration(1000)
			.delay(function(e){
				return 3000 + e.time;
			})
			.style({
				'opacity':0,
				'padding-top': '0px'
			})
			.remove();
					
		//座標を設定
		var cnt = 0;
		var l = elementsFst[0].length;
		for (let elm of elementsFst[0]) {
			SetPosition(elm, cnt, l);
			cnt++;
		}
		
		//シーンへの初期配置処理		
		for (let elm of elementsFst[0]) {
			var object = new THREE.CSS3DObject(elm);

	    sceneOtherStamp.add(object);
	    
			//初期配置
			object.position.set(elm['__data__'].arale.position.x, elm['__data__'].arale.position.y, elm['__data__'].arale.position.z);
	    object.rotation.set(elm['__data__'].arale.rotation.x, elm['__data__'].arale.rotation.y, elm['__data__'].arale.rotation.z);
		}
		
		removeEmptyDiv();
		setTimeout(autoLoadData, 8000);
	}
	
		//データをポーリングで読み込んで描画する
	function autoLoadSecondData(){
		
		secondDataRaw.stampList = Array(Math.floor(Math.random() * 48)).fill(0).map(m=>String(Math.floor(Math.random()*9)));
		secondData = makeStampData(secondDataRaw, "elementFirst");

		if(elementsSnd){
			elementsSnd.data(secondData).enter()
	      .append('div');
		}else{
			elementsSnd = container.selectAll(".elementSecond")
	      .data(secondData).enter().append('div');
		}
		
		elementsSnd.attr({
        'class':'elementSecond',
        'border':'0',
       })
      .style({
        "width":width + "px",
        "height": height + "px",
				"background": function(e, i){
						return 'url(' + baboImgs[e.imageId].src + ')';
				},
				"border":"none",
				"background-attachment": "fixed",
				"background-repeat": "no-repeat",
				"opacity": "0"
			})
			.transition()
			.duration(1000)
			.delay(function(e){
				return e.time;
			})
			.style({
				'opacity':1,
				'padding-top': '120px'
			})
			.transition()
			.duration(1000)
			.delay(function(e){
				return 3000 + e.time;
			})
			.style({
				'opacity':0,
				'padding-top': '0px'
			})
			.remove();
					
		//座標を設定
		var cnt = 0;
		var l = elementsSnd[0].length;
		for (let elm of elementsSnd[0]) {
			SetPosition(elm, cnt, l);
			cnt++;
		}
		
		//シーンへの初期配置処理		
		for (let elm of elementsSnd[0]) {
			var object = new THREE.CSS3DObject(elm);

	    sceneOtherStamp.add(object);
	    
			//初期配置
			object.position.set(elm['__data__'].arale.position.x, elm['__data__'].arale.position.y, elm['__data__'].arale.position.z);
	    object.rotation.set(elm['__data__'].arale.rotation.x, elm['__data__'].arale.rotation.y, elm['__data__'].arale.rotation.z);
		}
		
		removeEmptyDiv();
		
		setTimeout(autoLoadSecondData, 8000);
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

		geometry = new THREE.CubeGeometry( 200, 300, 400 );
		sceneOtherStamp = new THREE.Scene();
	  
		rendererOtherStamp = new THREE.CSS3DRenderer();
		rendererOtherStamp.setSize( window.innerWidth, window.innerHeight );
		rendererOtherStamp.domElement.style.position = 'absolute';
		rendererOtherStamp.domElement.style.top = 0;
		document.getElementById('container').appendChild(rendererOtherStamp.domElement);
		
		//スタンプ生成
		autoLoadData()
		setTimeout(autoLoadSecondData, 4000)
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
			ne = sceneOtherStamp.children.filter(f=>f.element.classList[0] == "elementNew");
			for (let i = 0; i < ne.length; i++) {
				var newPosition = new THREE.Object3D();
				console.log(ne[i].position.z);
				//narumi
				newPosition.position.set(ne[i].position.x, ne[i].position.y-15, ne[i].position.z-60);
				newPosition.lookAt(camera.position);
				
				ne[i].position.set(newPosition.position.x, newPosition.position.y, newPosition.position.z);
				ne[i].rotation.set(newPosition.rotation.x, newPosition.rotation.y, newPosition.rotation.z);	
			}
		}
		
		TWEEN.update();
		rendererOtherStamp.render( sceneOtherStamp, camera );
	}

	function WindowResize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		rendererOtherStamp.setSize( window.innerWidth, window.innerHeight );
	}

	function SetPosition(d, i, dataCnt) {
		
		// １週の中に描画するスタンプの個数
		var countPerCircle = dataCnt < 36 ? dataCnt : 36;
		// 中心点からスタンプを話す距離
		var distance  = 560;
		
		var index = i;
		var piOneStamp = Math.PI * 2 / countPerCircle;//dataCnt;

		//螺旋_外向き
		var arale = new THREE.Object3D();
		var vector = new THREE.Vector3();
		
		//ズレを計算
		var	phi = ((index) + 12) * piOneStamp + Math.PI;
		arale.position.x = (distance * Math.sin(phi))*resolutionZoom + (-120 + Math.random()*240);
		arale.position.y = Math.floor(dataCnt/countPerCircle/2) * -120 + Math.floor(index/countPerCircle) * 240 + (-120 + Math.random()*240) - 480; 
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
	animate();
	
	//画面リサイズ
	window.addEventListener('resize', WindowResize, false);
	    
	// 	スタンプ送信機能
	var myStamps = [];
	document.querySelector("#sendstamp").addEventListener('click', function(e){

	  //ミニグラフのサイズ定義
    var width  = 230 * resolutionZoom,
        height = 160 * resolutionZoom;
	  //新規投稿データ生成
	  var newData = {"img":e.target.getAttribute("src")};
	  myStamps.push(newData);
	  //グラフ描画用のDIV生成
    newElements = d3.selectAll('.elementNew')
	    .data(myStamps).enter()
	    .append('div')
	    .attr('class', 'elementNew')
	    .style({
	      "width":width + "px",
	      "height": height + "px",
				"background": function(e, i){
						return "url('"+e.img+"')"
				},
				"background-attachment": "fixed",
				"background-repeat": "no-repeat",
				"opacity": "1"
			})
			.transition()
			.duration(3000)
			.delay(100)
			.style('opacity', '0')
			.remove()
			.each("end", function(e) { 
				newElements[0].shift();
			});
				
	    		
		//座標を設定
		var newPosition = new THREE.Object3D();
		vector = new THREE.Vector3(0,0,0);
		
		newPosition.position.x = camera.position.x;
		newPosition.position.y = 0;
		newPosition.position.z = camera.position.z;
		
		newPosition.lookAt(vector);
		myStamps[myStamps.length-1]['newPosition'] = newPosition.position;
		
		//シーンへの初期配置処理
		var object = new THREE.CSS3DObject(newElements[0][myStamps.length-1]);
    object.position.fromArray(newPosition.position);
    object.rotation.fromArray(newPosition.rotation);
    sceneOtherStamp.add(object);
    
    object.position.set(newPosition.position.x,newPosition.position.y,newPosition.position.z);
    object.rotation.set(newPosition.rotation.x,newPosition.rotation.y,newPosition.rotation.z);
    
  });
}
window.ThreeDD = ThreeDD;
