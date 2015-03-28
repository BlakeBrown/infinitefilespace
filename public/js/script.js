$(document).ready(function () {
	var $grid = document.getElementById('grid');

	$.getJSON('files', function (data) {
		if (!data || data.length === 0) {
			console.log('error retrieving files');
			return;
		}
		data.forEach(addFile);
		initFiles();
	});

	function addFile(file) {
		var $file = document.createElement('div'),
			$icon = document.createElement('i'),
			$filename = document.createElement('p');
		$file.className = 'grid__item';
		$icon.className = 'fa fa-fw fa-file-image-o';
		$filename.innerHTML = getType();

		$file.appendChild($icon);
		$file.appendChild($filename);
		$grid.appendChild($file);

		function getType() {
			var d = file.lastIndexOf('.');
			if (d < 0) return 'unknown';
			var ext = file.substring(d+1);
			if (['png','jpg','jpeg','gif'].indexOf(ext) >= 0) return 'image';
			if (['txt','doc','docx'].indexOf(ext) >= 0) return 'text';
			return ext;
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