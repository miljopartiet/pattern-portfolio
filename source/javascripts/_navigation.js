(function($) {
  "use strict";
  namespace("Mp");

  Mp.NavigationToggler = function(toggler, target) {
    var toggle = function(event) {
      event.preventDefault();

      $(toggler).toggleClass("active");
      $(target).toggleClass("open");
      $("body").toggleClass("site-banner-is-detached");
    };

    $(toggler).bind("click", toggle);
  };
}(jQuery));
