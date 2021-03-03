(function ($) {

  "use strict";

    // MENU
    $('.navbar-collapse a').on('click',function(){
      $(".navbar-collapse").collapse('hide');
    });

    $(window).scroll(function() {
      if ($(".navbar").offset().top > 50) {
        $(".navbar-fixed-top").addClass("nav-collapse");
          } else {
            $(".navbar-fixed-top").removeClass("nav-collapse");
          }
    });

    // PARALLAX EFFECT
    $.stellar({
      horizontalScrolling: false,
    });  
})(jQuery);
