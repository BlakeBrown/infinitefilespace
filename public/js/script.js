var client = new Dropbox.Client({ key: 'urwnqx6tzbbcjt2' });
var folderPath = '';

$(document).ready(function () {
    if (client.isAuthenticated()) {
    	getFiles('');
    } else {
		client.authenticate(function (error, client) {
	        if (error) {
	        	console.log('Error: ' + error);
	        	return;
	        }
	        getFiles('');
	    });
    }
});

function clearFiles() {
	$('#grid').empty();
}

function getFiles(path) {
	client.readdir('/' + path, function (error, entries, folder_data, file_data) {
		var i = file_data.length;
		file_data.forEach(function (file) {
			client.makeUrl(file.path, {downloadHack: true}, function (error, file_data) {
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
		var type = getType();
		var icon = '<i class="fa fa-fw fa-file-' + getIcon(type) + '"></i>';
		var card = '<div g="column"><div class="grid__item ' + type + '"></div><a href="' + file.url + '" download><label>' + icon + file.name + '</label></a><span style="font-size: 0.7em">' + file.timeSincePosted + '</span></div>';
		if (file.hasThumbnail) {
			card = '<div g="column"><div class="grid__item grid_photo ' + type + '" style="background-image: url(' + file.url + ')"></div><a href="' + file.url + '" download><label>' + file.name + '</label></a><span style="font-size: 0.7em">' + file.timeSincePosted + '</span></div>';
		}
        $('#grid').append(card);

		function getType() {
			var d = file.name.lastIndexOf('.');
			if (d < 0) return 'unknown';
			var ext = file.name.substring(d+1).toLowerCase();
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
}

function initGrid() {
	var body = document.body,
		dropArea = document.getElementById( 'drop-area' ),
		droppableArr = [], dropAreaTimeout;

	// initialize droppables
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

	// initialize draggable(s)
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
		} );
	} );
};

//this function is called when the input loads a video
function renderImage(file) {
    var reader = new FileReader();
	//when the file is read it triggers the onload event above.
    reader.readAsArrayBuffer(file);
    reader.onload = function(event) {
        var url = event.target.result;
		var card = '<div g="column"><div class="grid__item grid_photo ' + "jpeg" + '" style="background-image: url(' + url + ')">' + '</div><a href="' + url + '" download><label>' + file.name + '</label></a><span style="font-size: 0.7em">' + "Just posted" + '</span></div>';
		$('#grid').append(card);
		var data = { 
			url: reader.result,
			name: file.name
		};
		client.writeFile(data.name, data.url, function (error, stat) {
			console.log(error);
		});
    }
}

$("#upload").on("click", function() {
	$("#upload_file").click();
});

$("#upload_file").change(function() {
	renderImage(this.files[0]);
});
