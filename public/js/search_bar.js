(function() {

	//=== Code from Codrops, adds filled class to prevent search text from falling back down if input is filled ===

	// trim polyfill : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim
	if (!String.prototype.trim) {
		(function() {
			// Make sure we trim BOM and NBSP
			var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
			String.prototype.trim = function() {
				return this.replace(rtrim, '');
			};
		})();
	}

	[].slice.call( document.querySelectorAll( 'input.input__field' ) ).forEach( function( inputEl ) {
		// in case the input is already filled..
		if( inputEl.value.trim() !== '' ) {
			classie.add( inputEl.parentNode, 'input--filled' );
		}

		// events:
		inputEl.addEventListener( 'focus', onInputFocus );
		inputEl.addEventListener( 'blur', onInputBlur );
	} );

	function onInputFocus( ev ) {
		classie.add( ev.target.parentNode, 'input--filled' );
	}

	function onInputBlur( ev ) {
		if( ev.target.value.trim() === '' ) {
			classie.remove( ev.target.parentNode, 'input--filled' );
		}
	}

	///=== End of Codrops code ===

	// Searching functionality
	$("#search_bar_input").on("keyup", function(e) {
		
		$(".file_name").each(function() {
			$(this).closest(".grid_item_container").css("display", "none");
			if($(this).text().toLowerCase().indexOf($("#search_bar_input").val().toLowerCase()) >= 0) {
				$(this).closest(".grid_item_container").css("display", "block");
			}
		});
		
	});

})();