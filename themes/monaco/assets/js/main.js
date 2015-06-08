// REFORMAT NOTECOUNT
var sep = "{select:Note count formatting}";
if(sep == "comma"){var seprender = "$1,";}
else if(sep == "period"){var seprender = "$1.";}
else if(sep == "space"){var seprender = "$1\u2006";}
// Function that transforms numbers like 1000 into 1k
function abbrNum(number, decPlaces) {
    decPlaces = Math.pow(10,decPlaces);
    var abbrev = [ "k", "m", "b", "t" ];
    for (var i=abbrev.length-1; i>=0; i--) {
        var size = Math.pow(10,(i+1)*3);
        if(size <= number) {
             number = Math.round(number*decPlaces/size)/decPlaces;
             if((number == 1000) && (i < abbrev.length - 1)) {
                 number = 1;
                 i++;
             }
             number += abbrev[i];
             break;
        }
    }
    return number;
}
// Function that carries out note count formatting
$.fn.digits = function(){
    if(seprender){
    // If comma, period or space are selected, add chosen characters to note counts where approriate
        return this.each(function(){
            $(this).text( $(this).text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, seprender));
        });
    }
    else{
    // If neither comma, period or space are selected, use letters to quantify large numbers
        return this.each(function(){
            var ntcount = $(this).text();
            $(this).text(abbrNum(ntcount, 0));
        });
    }
}

// HIDE LOADING SCREEN
var hideLoading = function(){ $("#loading").hide(); };

$(document).ready(function() {
    // Set post container, run Masonry, and hide loading screen
    var $container = $("#posts");
    {block:IndexPage}
      $container.masonry({
          itemSelector: ".post",
          isAnimated: true,
          columnWidth: 270,
          gutter: 20,
          isFitWidth: true
      }, hideLoading());
    {/block:IndexPage}
    {block:PermalinkPage}
        hideLoading();
    {/block:PermalinkPage}

    {block:IfInfiniteScrolling}
      {block:IndexPage}
        var pathtoparse = "/page/";
            {block:TagPage}
      var pathtoparse = "/tagged/{Tag}/page/";
            {/block:TagPage}

          // Run infinite scroll on index pages
    $container.infinitescroll({
        navSelector: "#pagination",
        // selector for the paged navigation (it will be hidden)
        nextSelector: "a#nextpage",
        // selector for the NEXT link (to page 2)
        itemSelector: ".post-post",
        // selector for all items you'll retrieve
        bufferPx: 2500,
        prefill: true,
        pathParse: function() {
                       return [pathtoparse, ""]
        },
        loading: {
          finishedMsg: "{lang:No more posts}",
          img: "",
          msgText: "<i id='masonry-spinner' class='fa fa-2x fa-refresh fa-spin'></i>",
          },
        state: {currPage: {CurrentPage}},
      },

      // Apply Masonry to new posts, reformat their note counts, start listening for lightbox cues, and fetch like status
      function(items) {
      $container.masonry("appended", items);
        $(".notecount").digits();
        rerouteViewer(items);
        prepareLightbox(items);
        newIds = $(items).map(function () {return this.id;}).get();
        Tumblr.LikeButton.get_status_by_post_ids(newIds);
      }
    );
       {/block:IndexPage}
    {/block:IfInfiniteScrolling}

    {block:IndexPage}
      // LIGHTBOX FUNCTIONALITY
      // Clicking the zoom-icon will capture the current url, open lightbox, load the corresponding post, change the url to a post's permalink and start listening for lightbox closing events
      var currenturl;
      var saveMeta;
      var lightboxExit = '<div id="lightbox-exit" class="fa fa-times"></div>';
      var prepareLightbox = function(post){
          $(post).find(".zoom, .touch-enlarge, .notecount, .image-zoom").click(function(e){
              e.preventDefault();
              zoomid = e.target.id;
              postid = zoomid.slice(5);
              tempid = postid + "-dimmed";
              posturl = "{BlogURL}post/" + postid;
              posthtml = "#"+postid;
              loadPost = posturl + " " + posthtml;
              currenturl = $(location).attr("href");
              newurl = posturl;
              changeId();
              $("#lightbox").fadeIn(500).load(loadPost, function(){
              //  $("#postnotes").hide();
                  window.history.replaceState("", document.title, newurl);
                  $(".notecount").digits();
                  disableViewer();
                  $("#lightbox .post").append(lightboxExit);
                  $("#lightbox-exit").on('click touchstart', function(e){
                      e.preventDefault();
                      hideLightbox();
                  });
                  refreshLike();
                  fixIframescrolling();
                  resizeMeta();
              });
              listenLightbox();
              $("body").addClass("no-scroll");
      });
    };

      var fixIframescrolling = function(){
          // When in lightbox on touch-devices, place a div in front of photosets to prevent clicking the photoset. Without this, photosets can't be scrolled on touch-devices.
          if(touchscreen == true){
              $("#lightbox .html_photoset").prepend("<div class='iframe-touch-scroll-fix' style='position:absolute;left:0;right:0;bottom:0;top:0;z-index:3000;'></div>");
      }
  };
  var changeId = function(){
    // Temporarily change ID of post and metadata in order to avoid conflicts with lightbox post carrying the same ID
    $("#" + postid).attr("id", tempid);
    // Save content of meta-bar, then temporarily remove it to avoid conflict with like button in lightbox
    saveMeta = $("#metadata-"+postid);
    $("#metadata-"+postid).detach();
  };
  var refreshLike = function(){
    // Request like button status for post in lightbox
    postArray = "[" + postid + "]";
    Tumblr.LikeButton.get_status_by_post_ids(postArray);
  };
  var restoreLike = function(){
    // Restore original post ID
    $("#" + tempid).attr("id", postid);
    // Restore original metadata-bar
    $("#meta-container-" + postid).delay(500).append(saveMeta);
  };

      // When lightbox is activated, clicking, touching, or pressing the escape key will close lightbox and turn off event listening
      var listenLightbox = function(){
          $("#lightbox").on('click touchstart', function(e) {
              e.preventDefault();
          hideLightbox();
          $("#lightbox").off('click touchstart')
      }).on('click touchstart', '.post-permalink', function(e){e.stopPropagation();});
      $(document).on('keydown.escapekey',function(e){
              if ( e.which === 27 ) { // ESC
                  hideLightbox();
                  $(document).off('keydown.escapekey');
              }
          });
      };
      // Fade out lightbox, then remove loaded content and return to initial state and original url
      var hideLightbox = function(){
          $('#lightbox').fadeOut(200, function(){
            $(this).html("<i id='lightbox-spinner' class='fa fa-refresh fa-2x fa-spin'></i>");
            restoreLike();
        });
        window.history.replaceState("", document.title, currenturl);
        $("body").removeClass("no-scroll");
      };

      // Images that normally link to Tumblr's image viewer are redirected to the theme's lightbox mode. This preserves the user's flow and avoids confusion when navigating back from Tumblr's image viewer
      var rerouteViewer = function(){
          $('.content-photo a[href^="http://{Host}/image"]').each(function(){
              imageid = $(this).closest('.post').attr('id');
              $(this).contents().unwrap().attr("id", "imgz-" + imageid).attr("title", "{lang:Zoom}").addClass("image-zoom");
          });
      }
      var disableViewer = function(){
          $('#lightbox .content-photo a[href^="http://{Host}/image"]').contents().unwrap();
      }

      // Execute functions specific to index pages
      var touchscreen = Modernizr.touch;
      rerouteViewer();
      prepareLightbox(".post-post");
    {/block:IndexPage}

    // Resize meta info, tags and postnotes to fit width of permalink/lightbox post after post has loaded
    var resizeMeta = function(){
        setTimeout(function (){
            var postWidth = $(".post-permalink").width();
            $(".info-container").width(postWidth).fadeIn(500);
        }, 200);
    };

    {block:PermalinkPage}
      // Prevent photo posts on permalink pages from clicking through to Tumblr's image viewer to preserve user flow
        $('.content-photo a[href^="http://{Host}/image"]').contents().unwrap();
        // Resize meta info, tags and postnotes to fit width of permalink/lightbox post after post has loaded
        $(".post-permalink").load(resizeMeta());
    {/block:PermalinkPage}

    // Re-format notecount
    $(".notecount").digits();
    // Clicking on introduction tile will link back to main page
    $("#headshot").click(function(){ window.location = "{BlogURL}"; });
});
