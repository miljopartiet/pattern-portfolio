(function($) {
  "use strict";
  namespace("Mp");

  Mp.NavigationToggler = function(toggler, target) {
    var toggle = function(event) {
      event.preventDefault();

      $(target).toggleClass("open");
      $("body").toggleClass("site-banner-is-active");
      $("#site-banner").toggleClass("active");
    };

    $(toggler).bind("click", toggle);
  };
}(jQuery));
