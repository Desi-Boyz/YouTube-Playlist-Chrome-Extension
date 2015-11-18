//javascript for my popup

document.addEventListener("click", function(){	
	showList();	
});

function resetEventListeners() {
	var el = document.getElementById("list"),
	elClone = el.cloneNode(true);
	el.parentNode.replaceChild(elClone, el);	
}

window.onload = function() {
	showList()
	window.setTimeout(function (){showList(),1000});
	document.getElementById("playBtn").addEventListener("click", function(){	
		nextVideo();});
	document.getElementById("clearBtn").addEventListener("click", function(){	
		chrome.runtime.sendMessage({
			method : "clearPlaylist"
		}, function(response) {
			var n = noty({text: response.message,
				type : "success",
				timeout : 1500,
closeWith: ['click']});
		});	
	});
};

function showList() {
	chrome.runtime.sendMessage({
		method : "getPlaylist"
	}, function(response) {
		displaylist(response.playlist);
	});
}

function displaylist(list)
{
	resetEventListeners();
	var displaysplit = '';
	var splitone = list.split(';');
	for(i=0;i<splitone.length-1; i++){
		var splittwo = splitone[i].split('::');
		var videoTitle = splittwo[1].substr(0,35) + ((splittwo[1].length > 35)? "..." : "");
		displaysplit += "<li id=\"bt" + splittwo[0] + "\">" + (i+1) + '.&nbsp;&nbsp;&nbsp;' + videoTitle + " : " + splittwo[2] + "<i class=\"js-remove\"><img src=\"../includes/images/redx.gif\" /></i></li>\n";
	}
	document.getElementById("list").innerHTML = displaysplit;
	editableList = Sortable.create(document.getElementById('list'), {
filter: '.js-remove', 
onFilter: function (evt) {
			var el = editableList.closest(evt.item); // get dragged item
			el && el.parentNode.removeChild(el);
			var vidID = evt.item.id.substring(2);
			deleteFromPlaylist(vidID);	
			window.setTimeout(function (){showList(),2000});
			window.setTimeout(function (){showList(),1000});
		},
onUpdate: function (/**Event*/evt) {
			var vidID = evt.item.id.substring(2);
			var oldIndex = evt.oldIndex;  // element's old index within parent
			var newIndex = evt.newIndex;  // element's new index within parent
			updatePlaylist(vidID, oldIndex, newIndex);
			window.setTimeout(function (){showList(),2000});
			window.setTimeout(function (){showList(),1000});
		}
	});
	if ($('#list').is(':empty')){
		$('#list').html('<div class="CBQ"><div class="Kza"><a href="#" class="Xwb DQb ob" title="Add items to playlist!">It\'s empty1!!</a></div><img class="axb m4a" src="../includes/images/bell.png" alt="Jingles Mascot of a bell with a smiley face"></div>');
	}
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
			chrome.tabs.create({active: true,
				url : "https://www.youtube.com/watch?v=" + videoItem[0] });
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

function updatePlaylist(vidID, oldIn, newIn){
	chrome.runtime.sendMessage({
		method : "updatePlaylist",
		videoID : vidID,
		oldIndex : oldIn,
		newIndex : newIn
	}, function(response) {
		window.setTimeout(function (){showList(),1000});
		if(response.successCode)
		var n = noty({text: response.message,
			type : "success",
			timeout : 1500,
closeWith: ['click']});
		else
		var n = noty({text: response.message,
			type : "warning",
			timeout : 1500,
closeWith: ['click']});
	});	
}

function deleteFromPlaylist(vidID) {
	chrome.runtime.sendMessage({
		method : "deleteFromPlaylist",
		videoID : vidID
	}, function(response) {
		window.setTimeout(function (){showList(),1000});
		if(response.successCode)
		var n = noty({text: response.message,
			type : "success",
			timeout : 1500,
closeWith: ['click']});
		else
		var n = noty({text: response.message,
			type : "warning",
			timeout : 1500,
closeWith: ['click']});
	});
}
