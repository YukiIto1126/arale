//ツールチップ周期的表示アニメーション
$.each(elements[0], function(i,v){
	v.chartIndex = 0;
	setTimeout(function(){
		setInterval(function(){
			if(v.__data__.hasOwnProperty("recs")){
				if(v.__data__.type=="circle"){
					v.__data__.chart.rollOverSlice(v.chartIndex % v.__data__.chart.dataProvider.length);
					
				}else{
					v.__data__.chart.chartCursor.showCursorAt(v.__data__.chart.dataProvider[(v.chartIndex % v.__data__.chart.dataProvider.length)].category);
				}
			}
			v.chartIndex++;
		}, 10000);
	}, Math.random() * 1000 * dataCount);
});



//線点滅アニメーション
function Border(){
	var bw = 0
	setInterval(function(){
		bw = (bw+1)%2 * 2.5;
		console.log(bw);
		$("div.element").css("border-width", bw+"px");
	},500);
}
Border();