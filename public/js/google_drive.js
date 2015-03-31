var clientId = '766073445398-mj7vlvphri2a54pkmn1e9eapu3dkc6f3.apps.googleusercontent.com';
var apiKey = 'AIzaSyAOCKS4OLptIyuefC2OBdPEi9uJU840GAQ';
// To enter one or more authentication scopes, refer to the documentation for the API.
var scopes = 'https://www.googleapis.com/auth/drive';

// Use a button to handle authentication the first time.
function handleClientLoad() {
	gapi.client.setApiKey(apiKey);
	window.setTimeout(checkAuth,1);
}

function checkAuth() {
	gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: true}, handleAuthResult);
}

function handleAuthResult(authResult) {
	var authorizeButton = document.getElementById('authorize-button');
	if (authResult && !authResult.error) {
		authorizeButton.style.visibility = 'hidden';
		makeApiCall();
	} else {
		authorizeButton.style.visibility = '';
		authorizeButton.onclick = handleAuthClick;
	}
}

function handleAuthClick(event) {
	gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: false}, handleAuthResult);
	return false;
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
				var icon = '<i class="fa fa-fw fa-file-' + getIcon(getType(name)) + '"></i>';
				if (url) icon = '';
				console.log(url);
				if(url!='undefined') {        		
					var card = '<div g="column"><a href="' + url + '" download><div class="grid__item grid_photo image' + '" style="background-image: url(' + url + ')">' + icon + '</div><label>' + name + '</label></a><span style="font-size: 0.7em">' + createdDate + '</span></div>';
					$('#grid').append(card);
				} else {
					var card = '<div g="column"><a href="' + url + '" download><div class="grid__item grid_photo' + '" style="background-image: url(' + url + ')">' + icon + '</div><label>' + name + '</label></a><span style="font-size: 0.7em">' + createdDate + '</span></div>';
					$('#grid').append(card);
				}
				//var dateCreated = resp.items[i].createdDate;
				//var date = timeSince(dateCreated);
			}
			initGrid();
		});        
	});
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

	[].slice.call(document.querySelectorAll( '#grid .grid__item' )).forEach( function( el ) {
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
					clearTimeout( dropAreaTimeout );
					dropAreaTimeout = setTimeout( afterDropFn, 400 );
				}
			}
		});
	});
}