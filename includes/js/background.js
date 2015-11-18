var storage = chrome.storage.local;
list = "";

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.method == "addToPlaylist") {
		addToPlaylist(request, sender, sendResponse);
	} else if (request.method == "deleteFromPlaylist") {
		deleteFromPlaylist(request, sender, sendResponse);
	} else if (request.method == "getPlaylist") {
		getPlaylist(request, sender, sendResponse);
	} else if (request.method == "clearPlaylist") {
		clearPlaylist(request, sender, sendResponse);
	} else if (request.method == "getNextVideo") {
		popPlaylist(request, sender, sendResponse);
	} else if (request.method == "updatePlaylist") {
		updatePlaylist(request, sender, sendResponse);
	} else {
		console.log("ERROR:");
		console.log(request);
		sendResponse({
			message : "An error occurred!"
		});
	}
});


/*--------------------------------------------------------------------------------------------------*/

function addToPlaylist(request, sender, sendResponse) {
	var listStr = list.toString() + request.vidID + '::' + request.vidTitle + '::' + request.vidTime + ';';
	var playlist = {"list" : listStr};
	storage.set(playlist, function() {
		if ( typeof (chrome.runtime.lastError) != "undefined") {
			console.log('An error occurred: ' + chrome.extension.lastError.message);
		}
	});
	storage.get("list", function(abc) {
		list = abc["list"].toString();
	});
	if ( typeof (chrome.runtime.lastError) == "undefined") {
		sendResponse({
			reply : "Success"
		});

	} else {
		sendResponse({
			reply : "Failure"
		});
	}
}

/*-----------------------------------------------------------------------------------------*/

function deleteFromPlaylist(request, sender, sendResponse) {
	var vidID = request.videoID;
	var listArr = list.split(';');
	var flag = 0;
	for(var i=0; i<listArr.length; i++) {
		if(search(listArr[i].toString(), vidID)) {
			listArr.splice(i,1);
			flag = 1;
			break;
		}
	}
	var listStr = listArr.join(';');
	var playlist = {"list" : listStr};
	storage.set(playlist, function() {
		if ( typeof (chrome.runtime.lastError) != "undefined") {
			console.log('An error occurred: ' + chrome.extension.lastError.message);
		}
	});
	storage.get("list", function(abc) {
		list = abc["list"].toString();
	});
	var msg = '';
	msg = (flag)?"Deleted successfully!":"An error occurred!"; 
	sendResponse({
		successCode : flag,
		message : msg});
}

function search(haystack, needle) {
	if(haystack.search(needle) != -1)
	return true;
	else 
	return false;
}
/*-----------------------------------------------------------------------------------------*/


function getPlaylist(request, sender, sendResponse) {
	storage.get("list", function(abc) {
		list = abc["list"].toString();
	});
	sendResponse({
		playlist : list
	});
}

/*----------------------------------------------------------------------------------------*/

function clearPlaylist(request, sender, sendResponse) {
	storage.clear();
	list = '';
	sendResponse({
		message : "Playlist cleared!"});
}


/*-----------------------------------------------------------------------------------------*/

function popPlaylist(request, sender, sendResponse) {
	var listStr = list.toString();
	var a = listStr.split(';');
	var nextVid = a.shift();
	var listNewStr = a.join(';');
	var playlist = {"list" : listNewStr};
	storage.set(playlist, function() {
		if ( typeof (chrome.runtime.lastError) != "undefined") {
			console.log('An error occurred: ' + chrome.extension.lastError.message);
		}
	});
	storage.get("list", function(abc) {
		list = abc["list"].toString();
	});
	if(nextVid.length<1)
	sendResponse({nextVideo : null,
		message : "Playlist is empty. Add more items to playlist!"});
	else
	sendResponse({nextVideo : nextVid.toString(),
		message : "Up Next: "});
}

function updatePlaylist(request, sender, sendResponse){
	var videoID = request.videoID;
	var oldIndex = request.oldIndex;
	var newIndex = request.newIndex;
	var flag = 0;	
	var listArr = list.split(';');	
	var tempOldItem = listArr.splice(oldIndex,1);
	if(search(tempOldItem.toString(), videoID)){
		flag=1;
		listArr.splice(newIndex,0,tempOldItem[0].toString());
		var listStr = listArr.join(';');
		var playlist = {"list" : listStr};
		storage.set(playlist, function() {
			if ( typeof (chrome.runtime.lastError) != "undefined") {
				console.log('An error occurred: ' + chrome.extension.lastError.message);
			}
		});
		storage.get("list", function(abc) {
			list = abc["list"].toString();
		});
	}
	var msg = '';
	msg = (flag)?"Playlist updated successfully!":"An error occurred!"; 
	sendResponse({successCode : flag,
		message : msg});	
}