
$(document).ready(function(){

    
        
    $searching = $('.searching');
    $searchbar = $('#search input');
    $components = $('.results #components .demo');
    $results = $('.results');
    
    if ($searchbar.val() == '') {
        $searching.hide();
    };

    // Component searching
    $searchbar.on('keyup', function search_components(){

        var input_val = $(this).val().toLowerCase().trim();

        if (input_val.length) {
            $components.hide();
            $searching.hide();
            $('[id*="' + input_val + '"].demo').fadeIn();

            $('section[id*="' + input_val.replace(/ /g,'') + '"].demo').show();
            $('.searching h2').html('Sorry, but "' + input_val + '" isn\'t a component.');
            console.log(input_val);
        }

        else {
            $searching.hide();
            $components.fadeIn();
        }

        if ($searchbar.val() == '') {
            $searching.hide();
        };

    });

    $('aside ul li a').click(function(){
            replacement = $(this).html();
            $searchbar.val(replacement);
            var input_val = replacement.toLowerCase()
            $components.hide();
            $searching.show();
            $('[id*="' + input_val + '"].demo').fadeIn();
            $searching.hide();

            $cancel_search.html('<p>pfsdfds</p>');
            $cancel_search.on('click', function(){

            });

        });

    // Disable form submission for demo purposes
    $('form').on('submit', function() {
        return false;
    });


$grid_docs = $('.doc#layouts');
$scss_docs = $('.doc#scss')
$loading = $('.loading')

$grid_docs.hide();
$scss_docs.hide();


window.onscroll = function(ev) {

    section = 0;
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        
        $loading.html('<img g="centered" src="/media/loading.svg">');

        if (section == 0) { // Grid Docs
            $grid_docs.load('https://gist.githubusercontent.com/AndyF/5f9c8d951032179b9dc4/raw', function(data){
                $(this).fadeIn(data);
                section += 1;
                $loading.html('<img g="centered" src="/media/loading.svg">').delay(1000).html('<h3>How to Build Layouts <img src="/media/arrow-right.svg" style="height: 17px;"></h3>');
            });
        } else if (section == 1) { // Sass
            $scss_docs.load('https://gist.githubusercontent.com/AndyF/5f9c8d951032179b9dc4/raw', function(data){
                $(this).delay(500).fadeIn(data);
                section += 1;
            });
        }
        
    }
};


});
Prism.highlightAll();