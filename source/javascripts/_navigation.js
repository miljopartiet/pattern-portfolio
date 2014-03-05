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
          this.header.removeClass("detached");
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
        if (!this._visible) {
          this.header.removeClass("hidden");
          this.header.addClass("visible");
        }

        this._visible = true;
      },

      hidden: function() {
        if (this._visible) {
          this.header.removeClass("visible");
          this.header.addClass("hidden");
        }

        this._visible = false;
      }
    });

    return Navigation;
  }());

  Mp.NavigationToggler = function(toggler, target) {
    var toggle = function(event) {
      event.preventDefault();

      $(toggler).toggleClass("active");
      $(target).toggleClass("open");
      $("body").toggleClass("site-banner-is-detached");
    };

    $(toggler).bind("click", toggle);
  };

  function detachNavigationOnScroll(navigation) {
    var MIN_OFFSET = 80,
        lastValue = 0;

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

    $(window).scroll(_.debounce(function() {
      var newValue = $(document).scrollTop(),
          direction = scrollDirection(newValue, lastValue);


      if (direction.offset > MIN_OFFSET) {
        lastValue = newValue;
      } else {
        return;
      }

      if (newValue <= 0) {
        navigation.attach();
      } else {
        navigation.detach();
      }

      if (direction.direction == "up") {
        navigation.visible();
      } else {
        navigation.hidden();
      }

    }), 150);
  }

  $(function() {
    var navigation = new Mp.Navigation();
    detachNavigationOnScroll(navigation);
  });
}(jQuery));
