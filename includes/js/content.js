// content script

function addToList(button) {
	var id = button.getAttribute("id");
	id = id.substring(2);
	var a = document.getElementById("btn"+id);
	var videoTitle = a.getElementsByTagName('a')[0].getAttribute("title");
	var c = a.getElementsByTagName('span')[1].innerHTML;
	var videoTime = c.substring(20).slice(0,-6);
	
	chrome.runtime.sendMessage({
		method : "addToPlaylist",
		vidID : id,
		vidTitle : videoTitle,
		vidTime : videoTime
	}, function(response) {
		if (response.reply == "Success") {
			button.className = "added";
			button.innerText = "Added to playlist";
			var n = noty({text: "Added to playlist!",
				theme : "relax",
				layout : "bottom",
				type : "success",
				timeout : 700,
closeWith: ['click']});			
		}
		else{
			button.className = "erroradding";
			button.innerText = "An Error Occurred";
			var n = noty({text: "An Error Occurred!",
				theme : "relax",
				layout : "bottom",
				type : "success",
				timeout : 700,
closeWith: ['click']});
		}
	});
}

function onLoadHandler(){
	var x = document.getElementsByClassName("content-wrapper");
	for (var i = 0; i < x.length; i++) {
		var b = x[i].innerHTML.search("watch");
		var id = x[i].innerHTML.substring(b + 8, b + 19);
		x[i].id = "btn" + id ;
		x[i].innerHTML = x[i].innerHTML + '<button class="add" ; id="bt' + id + '">Add to playlist</button>';
		document.getElementById("bt" + id).addEventListener("click", function() {
			addToList(this);
		});
	}
	//TODOconsole.log($('div.yt-thumb'));
}

function nextVideo(){
	chrome.runtime.sendMessage({
		method : "getNextVideo"
	}, function(response) {
		if(response.nextVideo != null){
			var videoItem = response.nextVideo.toString().split('::');
			var n = noty({text: response.message + videoItem[1] + " : " + videoItem[2],
				theme : "relax",
				layout : "bottom",
				type : "success",
				timeout : 3000,
closeWith: ['click']});
			window.setTimeout(function(){window.location.href = "https://www.youtube.com/watch?v=" + videoItem[0];},1000);
		} else {
			var n = noty({text: response.message,
				theme : "relax",
				layout : "bottom",
				type : "warning",
				timeout : 3000,
closeWith: ['click']});
		}
	});
}

function checkPlayer(){
	var html5 = document.querySelector('video.video-stream');
	if(html5 != null){  
		html5.addEventListener("ended",  function() {
			nextVideo();
		});
	} else {
		flashCheckPlayer();
	}
} 

function flashCheckPlayer(){
	//console.log("flash");
	var flash = document.getElementById("movie_player");
	if(flash != null){
		if(flash.getPlayerState() == 0){
			nextVideo();
			return;	
		}
		window.setTimeout(flashCheckPlayer,1000);
	}
}
window.onload = function() {
	window.setTimeout(function(){checkPlayer();},6000);
	onLoadHandler();
	var n = noty({text: "YouTube Playlist Plugin Active!",
		theme : "relax",
		layout : "bottom",
		type : "success",
		timeout : 1500,
closeWith: ['click']});
}