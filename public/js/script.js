$(document).ready(function () {
	$.getJSON('files', function (data, client_data) {
		if (!data || data.length === 0) {
			console.log('error retrieving files');
			return;
		}
		console.log(client_data);
		data.forEach(addFile);
		initFiles();
	});

	function addFile(file) {
		var filetype = getType(),
			icon = '<i class="fa fa-fw fa-file-' + getIcon(filetype) + '"></i>',
			card = '<div g="column"><div class="grid__item ' + filetype + '"></div><a href="' + file.url + '" download><label>' + icon + file.name + '</label></a><span style="font-size: 0.7em">' + file.timeSincePosted + '</span></div>';
		if (file.hasThumbnail) {
			icon = '';
			card = '<div g="column"><div class="grid__item grid_photo ' + filetype + '" style="background-image: url(' + file.url + ')">' + icon + '</div><a href="' + file.url + '" download><label>' + file.name + '</label></a><span style="font-size: 0.7em">' + file.timeSincePosted + '</span></div>';
		}
        $('#grid').append(card);

		function getType() {
			var d = file.name.lastIndexOf('.');
			if (d < 0) return 'unknown';
			var ext = file.name.substring(d+1);
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

	function initFiles() {
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
});