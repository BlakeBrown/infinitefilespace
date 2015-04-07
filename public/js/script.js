var dropbox_client = new Dropbox.Client({ key: 'urwnqx6tzbbcjt2' });
var folderPath = '';

var google_client_id = '766073445398-mj7vlvphri2a54pkmn1e9eapu3dkc6f3.apps.googleusercontent.com';
var google_api_key = 'AIzaSyAOCKS4OLptIyuefC2OBdPEi9uJU840GAQ';

//=============== GOOGLE DRIVE ================================ 

// Use a button to handle authentication the first time.
function handleClientLoad() {
	gapi.client.setApiKey(google_api_key);
	window.setTimeout(checkAuth,1);
}

function checkAuth() {
	gapi.auth.authorize({client_id: google_client_id, scope: 'https://www.googleapis.com/auth/drive', immediate: true}, handleAuthResult);
}

function handleAuthResult(authResult) {
	var authorizeButton = document.getElementById('add_account_btn');
	if (authResult && !authResult.error) {
		//authorizeButton.style.visibility = 'hidden';
		makeApiCall();
	} else {
		authorizeButton.style.visibility = '';
	}
}

// Load the API and make an API call.  Display the results on the screen.
function makeApiCall() {
	gapi.client.load('drive', 'v2', function() {

		var request = gapi.client.drive.files.list ();

		request.execute(function(resp) {          
			for (i=0; i<resp.items.length; i++) {

				var name = resp.items[i].title;
				var url = resp.items[i].thumbnailLink;
				var createdDate = Date.parse(resp.items[i].createdDate);
				createdDate = timeSince(createdDate);
				if(name.length > 40) {
					name = name.substr(0, 40) + "...";
				}
				var icon = '<i class="fa fa-fw fa-file-' + getIcon(getType(name)) + '"></i>';
				if (url) icon = '';

				if(url) {   
					card = '<div class="col-md-3 grid_item_container">\
								<a href="' + url + '" download>\
									<div class="grid_item grid_photo" style="background-image: url(' + url + ')"></div>\
									<br>\
									<label class="file_name">' + name + '</label>\
								</a>\
								<br>\
								<span style="font-size: 0.7em">' + createdDate + '</span>\
							</div>';
					$('#grid').append(card);
				} else {
					var card = '<div class="col-md-3 grid_item_container">\
									<a href="' + url + '" download>\
										<div class="grid_item">' + icon + '</div>\
										<br>\
										<label class="file_name">' + name+ '</label>\
									</a>\
									<br>\
									<span style="font-size: 0.7em">' + createdDate + '</span>\
								</div>'; 
					$('#grid').append(card);
				}

				//var dateCreated = resp.items[i].createdDate;
				//var date = timeSince(dateCreated);
			}
			initGrid();
		});        
	});
}

// ============= END OF GOOGLE DRIVE =====================

$(document).ready(function () {
    if (dropbox_client.isAuthenticated()) {
    	getUser();
    	getFiles();
    } else {
		dropbox_client.authenticate(function (error, client) {
	        if (error) {
	        	console.log('Error: ' + error);
	        	return;
	        }
    		getUser();
	        getFiles();
	    });
    }
});

function clearFiles() {
	$('#grid').empty();
}

function getUser() {
	dropbox_client.getAccountInfo(function(error, info) {
		if (error) return showError(error);
	});
}

function getFiles() {
	dropbox_client.readdir('/', function (error, entries, folder_data, file_data) {
		var i = file_data.length;
		file_data.forEach(function (file) {
			dropbox_client.makeUrl(file.path, {downloadHack: true}, function (error, file_data) {
				file.url = file_data.url;
				var time = ('' + file.modifiedAt).substring(0, 24);
				file.timeSincePosted = timeSince(Date.parse(time));
				addFile(file);
				i--;
				if (i === 0) initGrid();
			});
		});
	});

	function addFile(file) {
		var type = getType(file.name);
		var icon = '<i class="fa fa-fw fa-file-' + getIcon(type) + '"></i>';
		var name = file.name;
		var url = file.url;
		if(name.length > 40) {
			name = name.substr(0, 40) + "...";
		}
		var card = '<div class="col-md-3 grid_item_container">\
						<a href="' + url + '" download>\
							<div class="grid_item ' + type + '">' + icon + '</div>\
							<br>\
							<label class="file_name">' + name+ '</label>\
						</a>\
						<br>\
						<span style="font-size: 0.7em">' + file.timeSincePosted + '</span>\
					</div>';
		if (file.hasThumbnail) {
			card = '<div class="col-md-3 grid_item_container">\
						<a href="' + url + '" download>\
							<div class="grid_item grid_photo ' + type + '" style="background-image: url(' + url + ')"></div>\
							<br>\
							<label class="file_name">' + name + '</label>\
						</a>\
						<br>\
						<span style="font-size: 0.7em">' + file.timeSincePosted + '</span>\
					</div>';
		}

        $('#grid').append(card);
	}
}

function getType(name) {
	var d = name.lastIndexOf('.');
	if (d < 0) return 'unknown';
	var ext = name.substring(d+1).toLowerCase();
	//make sure to return fontawesome classnames
	if (['png','jpg','jpeg','gif'].indexOf(ext) >= 0) return 'image';
	if (['mp3','flac','ogg','wav'].indexOf(ext) >= 0) return 'audio';
	if (['pdf'].indexOf(ext) >= 0) return 'pdf';
	if (['txt','doc','docx'].indexOf(ext) >= 0) return 'text';
	return ext;
}

function getIcon(type) {
	//first line is for fontawesome classnames
	if (['image', 'audio', 'text', 'pdf'].indexOf(type) >= 0) return type + '-o';
	return 'o';
}

function timeSince(date) {
	var seconds = Math.floor((new Date() - date) / 1000);
	var interval = Math.floor(seconds / 31536000);
	if (interval > 1) return interval + " years ago";
	interval = Math.floor(seconds / 2592000);
	if (interval > 1) return interval + " months ago";
	interval = Math.floor(seconds / 86400);
	if (interval > 1) return interval + " days ago";
	interval = Math.floor(seconds / 3600);
	if (interval > 1) return interval + " hours ago";
	interval = Math.floor(seconds / 60);
	if (interval > 1) return interval + " minutes ago";
	return Math.floor(seconds) + " seconds ago";
}

function initGrid() {
	var body = document.body,
		dropArea = document.getElementById( 'drop-area' ),
		droppableArr = [], dropAreaTimeout;

	[].slice.call( document.querySelectorAll( '#drop-area .drop-area__item' )).forEach( function( el ) {
		droppableArr.push( new Droppable( el, {
			onDrop : function( instance, draggableEl ) {
				// show checkmark inside the droppabe element
				classie.add( instance.el, 'drop-feedback' );
				clearTimeout( instance.checkmarkTimeout );
				instance.checkmarkTimeout = setTimeout( function() {
						classie.remove( instance.el, 'drop-feedback' );
				}, 800 );
				// ...
			}
		} ) );
	} );

	[].slice.call(document.querySelectorAll( '#grid .grid_item' )).forEach( function( el ) {
		new Draggable( el, droppableArr, {
			draggabilly : { containment: document.body },
			onStart : function() {
				// add class 'drag-active' to body
				classie.add( body, 'drag-active' );
				// clear timeout: dropAreaTimeout (toggle drop area)
				clearTimeout( dropAreaTimeout );
				// show dropArea
				classie.add( dropArea, 'show' );
			},
			onEnd : function( wasDropped ) {
				var afterDropFn = function() {
					// hide dropArea
					classie.remove( dropArea, 'show' );
					// remove class 'drag-active' from body
					classie.remove( body, 'drag-active' );
				};

				if( !wasDropped ) {
					afterDropFn();
				}
				else {
					// after some time hide drop area and remove class 'drag-active' from body
					console.log($(".drag-active").closest(".grid_item").find("a").attr('href'));
					clearTimeout( dropAreaTimeout );
					dropAreaTimeout = setTimeout( afterDropFn, 400 );
				}
			}
		});
	});
}


$(".grid_item").on("click", function() {
	console.log($(this).find("a"));
});

// Uploads a file to dropbox and appends it to the DOM
function uploadFileToDropbox(file) {
    var reader = new FileReader();
	//readAsDataURL triggers the onload event 
    reader.readAsDataURL(file);
    reader.onload = function(event) {

        var url = event.target.result;
		var card = '<div g="column"><div class="grid_item grid_photo ' + "jpeg" + '" style="background-image: url(' + url + ')">' + '</div><a href="' + url + '" download><label>' + file.name + '</label></a><span style="font-size: 0.7em">' + "Just posted" + '</span></div>';
		$('#grid').append(card);

		client.writeFile(file.name, file, function (error, stat) {
			console.log(error);
		});
    }
}

$("#upload_file_btn").on("click", function() {
	$("#upload_file").click();
});

$("#upload_file").change(function() {
	uploadFileToDropbox(this.files[0]);
});

$("#list_photos").on("click", function() {
	var items = $(".grid_item");
	for (var i = 0; i < items.length; i++) {
		if(!$(items[i]).hasClass("image")) {
			$(items[i]).closest('[g~="column"]').hide(500);
		} else {
			$(items[i]).closest('[g~="column"]').show(500);
		}
	};
});

$("#list_files").on("click", function() {
	var items = $(".grid_item");
	for (var i = 0; i < items.length; i++) {
		if(!$(items[i]).hasClass("image")) {
			$(items[i]).closest('[g~="column"]').show(500);
		} else {
			$(items[i]).closest('[g~="column"]').hide(500);
		}
	};
});

$("#sharing_link").on("click", function() {
	console.log(file_map);
});

$("#add_account_btn").on("click", function(e) {
	e.preventDefault();
	$("#add_account_modal").show();
	//Authorize with google drive
	//gapi.auth.authorize({client_id: google_client_id, scope: scopes, immediate: false}, handleAuthResult);
});