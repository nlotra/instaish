
function Instaish(images_per_row, image_tag) {

//number of image boxes per row
      var per_row = images_per_row;

      var tag = image_tag;

      //width of flippers div 
      var wrapper = $('.flippers'),
      //width of each box = width/predefined number per_row, rounded down
        box_width = Math.floor( wrapper.width() / per_row ),
        //width of boxes * number of boxes (differend from box_width in the rounding)
        width = box_width * per_row;
        //difference between actual width and width of calculated width
        width_margin = wrapper.width() - width;
        //height of box area, divide by size of box and round off then multiply again
        height = Math.floor( ( wrapper.height() / box_width ) ) * box_width,
        //difference between actual height and calculated height
        height_margin = wrapper.height() - height;
        //calculate how many boxes fit vertically on the page
        per_column = height / box_width,
        //calculate number of flippers
        flippers = per_row  * per_column,
        html = '';

      //prepare html string to be appended into flippers
      for(var i = $(".flippers").length; i <= flippers; i++) {
        html += '<div class="flipper"><div class="flip" id="flip_' + i + '"></div></div>'; 
      }
      //append html
      wrapper.html('<div class="inner">' + html + '</div>');

      //set width and height & margins of wrapper
      $('.inner', wrapper ).css({
        'width' : width,
        'height' : height,
        'margin-top': height_margin / 2,
        'margin-bottom': height_margin / 2,
        'margin-left': width_margin / 2,
        'margin-right': width_margin / 2
      });

      //set width and height of each flipper
      $('.flipper, .flipper > div', wrapper ).css({
          'width': box_width,
          'height': box_width
      });

      //get an image from url 
      function preloadImage(url) {
        var img=new Image();
        img.src=url;
      }

      //get images according to predefimed tag
      $( document ).ready(function() {

        function gramulate() {
          var feed = new Instafeed({
              get: 'tagged',
              tagName: tag,
              clientId: '2506a522329a496bbacd16ea45a582d9',
              resolution: 'low_resolution',
              limit: 60,
              success : function(object) {
                if(object.data){
                  object.data.forEach(function(gram) {
                    if( $('#gram_' + gram.id).length < 1 ) {
                      $('#grams').prepend('<li class="gram" id="gram_' + gram.id + '"><img src="' + gram.images.low_resolution.url + '" class="img-responsive" /></li>');
                    }
                    //preload the image from the url
                    preloadImage( gram.images.low_resolution.url );
                  });
                }
              }
          });
          feed.run();
        };

        gramulate();

        //flip elements randomly until all elements have been flipped, repeat
        window.setInterval(function(){

          var random = 0;
          while( random == 0){
            // Pick a random element.
            random = Math.floor( Math.random() * ( flippers - 1 + 1 ) + 1 )

            // If all elements have an href then everything has been flipped at least once, continue with randomness.
            if( $(".flip[href]").length == flippers ) {
              break;
            }
            // If the element has already been flipped, choose another random.
            if(typeof $("#flip_" + random).attr('href') !== 'undefined' && $("#flip_" + random).attr('href') !== false) {
              random = 0;
            }
          }
          var flip = $( "#flip_" + random )

          //image flips
          flip.flippy({
            onStart: function(){
              //find which boxes do not have a url yet
              var grams = $(".gram").length;
              var seen = $(".gram[href]").length;
              var unseen = grams - seen;
              
              //get more images before the last 5 images are shown
              if( unseen < 5) {
                gramulate();
              }
            },
            direction: 'RIGHT',
            duration: '300',
            depth: 0.30,
            verso: function() {
              var content = "";

              // Loop hrough grams and find the first unseen and set the flip content.
              $('.gram:not([href])').each(function() {
                content = $(this).html();
                $(this).attr( 'href', flip.attr('id') );
                flip.attr( 'href', $(this).attr('id') );
                return false;
              });

              // If the flip content is still not set, loop again and find any gram currently not on screen.
              if( content == "" ){
                $('.gram').each(function() {
                  if( $( '.flip[href="' + $(this).attr('id') + '"]' ).length < 1 ) {
                    content = $(this).html();
                    $(this).attr( 'href', flip.attr('id') );
                    flip.attr( 'href', $(this).attr('id') );
                    
                    // Move to the bottom of the list
                    $(this).appendTo('#grams');

                    return false;
                  }
                });
              }

              // If content is still blank, set default.
              if( content == "" ){
                content = $('#default-gram').html();
                $(this).attr( 'href', "#" );
                flip.attr( 'href', "#" );
              }

              return content;
            }
          });
        }, 5000);

      });
};
