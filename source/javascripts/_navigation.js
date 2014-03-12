(function($) {
  "use strict";
  namespace("Mp");

  Mp.Navigation = (function() {
    function Navigation() {
      this.header = $("#site-banner");
    }

    $.extend(Navigation.prototype, {
      attach: function() {
        if (this._detached) {
          this.header.removeClass("detached hidden");
          this.header.addClass("visible");
          this._detached = false;
        }
      },

      detach: function() {
        if (!this._detached) {
          this.header.addClass("detached");
          this._detached = true;
        }
      },

      visible: function() {
        if (!this.header.hasClass("visible")) {
          this.header.addClass("visible");
          this.header.removeClass("hidden");
        }
      },

      hidden: function() {
        if (!this.header.hasClass("hidden")) {
          this.header.addClass("hidden");
          this.header.removeClass("visible");
        }
      }
    });

    return Navigation;
  }());

  Mp.NavigationToggler = function(toggler, target) {
    var toggle = function(event) {
      event.preventDefault();

      $(toggler).toggleClass("active");
      $(target).toggleClass("open");
      if ($(target).hasClass("open")) {
        $("#site-banner").addClass("detached");
      }
      $("body").toggleClass("site-banner-is-detached");
    };

    $(toggler).bind("click", toggle);
  };

  function detachNavigationOnScroll(navigation) {
    var MIN_OFFSET_FOR_DETACH = 500,
        MIN_SCROLL_OFFSET = 80,
        lastValue = $(document).scrollTop();

    var scrollDirection = function(newValue, lastValue) {
      var direction = {};

      if (newValue < lastValue) {
        direction.direction = "up";
        direction.offset = lastValue - newValue;
      } else {
        direction.direction = "down";
        direction.offset = newValue - lastValue;
      }

      return direction;
    };

    var setNavigationPlacement = function() {
      var newValue = $(document).scrollTop(),
          direction = scrollDirection(newValue, lastValue);

      if (newValue <= 0) {
        navigation.attach();
        return;
      }

      if (direction.offset > MIN_SCROLL_OFFSET) {
        lastValue = newValue;
      }

      if (direction.direction == "up") {
        navigation.visible();
      } else {
        navigation.hidden();

        if (direction.offset > 0 && newValue >= MIN_OFFSET_FOR_DETACH) {
          // Ensure we wait for hide transition before detaching
          setTimeout(function() {
            navigation.detach();
          }, 200);
        }
      }
    };

    $(window).scroll(_.throttle(setNavigationPlacement, 320));
  }

  $(function() {
    var navigation = new Mp.Navigation();
    detachNavigationOnScroll(navigation);
  });
}(jQuery));
