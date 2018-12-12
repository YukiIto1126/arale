function videoStart(){
	
	const medias = {
		audio : false,
		video : {
      facingMode: {
        exact : "environment" // リアカメラにアクセス
      }
    }
	};

	debugger;
	video  = document.getElementById("video");
	navigator.getUserMedia(medias, successCallback, errorCallback);	
}

function successCallback(stream) {
	debugger;
  video.srcObject = stream;
};

function errorCallback(err) {
  alert(err);
};