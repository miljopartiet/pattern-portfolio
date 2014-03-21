(function($) {
  "use strict";
  namespace("Mp");

  Mp.Navigation = (function() {
    function Navigation(selector) {
      this.$header = $(selector);
      this._visible = true;
      this._detached = false;
    }

    $.extend(Navigation.prototype, {
      attach: function() {
        if (this._detached) {
          this.$header.removeClass("detached hidden");
          this.$header.addClass("visible");
          this._detached = false;
        }
      },

      detach: function() {
        if (!this._detached) {
          this.$header.addClass("detached");
          this._detached = true;
        }
      },

      visible: function() {
        if (!this._visible) {
          this.$header.addClass("visible");
          this.$header.removeClass("hidden");
          this._visible = true;
        }
      },

      hidden: function() {
        if (this._visible) {
          this.$header.addClass("hidden");
          this.$header.removeClass("visible");
          this._visible = false;
        }
      }
    });

    return Navigation;
  }());

  Mp.NavigationToggler = function(element) {
    var $element = $(element);
    if ($element.size() === 0) {
      return;
    }

    var toggle = function(event) {
      event.preventDefault();
      var $toggler = $(this),
          $siblings = $element.find(".toggler").not($toggler),
          $target = $($toggler.attr("href")),
          $body = $("body"),
          $siblingTargets = siblingTargets($siblings);


      var siblingClasses = openIndicationClasses(siblingTargetIds($siblingTargets)).join(" ");
      $body.removeClass(siblingClasses);
      $siblingTargets.removeClass("open");
      $siblings.removeClass("active");

      $toggler.toggleClass("active");
      $target.toggleClass("open");

      var targetClass = openIndicationClasses([$target.attr("id")])
      targetClass.push("navigation-is-open");

      if ($target.hasClass("open")) {
        $body.addClass(targetClass.join(" "));
      } else {
        $body.removeClass(targetClass.join(" "));
      }
    };

    var siblingTargets = function($siblings) {
      return $($siblings.map(function() {
        return $(this).attr("href");
      }).get().join(","));
    };

    var siblingTargetIds = function($siblingTargets) {
      var ids = [];
      for (var i=0,j=$siblingTargets.length; i < j; i++) {
        ids.push($siblingTargets.get(i).id)
      }
      return ids;
    };

    var openIndicationClasses = function(ids) {
      return $.map(ids, function(id) {
        return id + "-is-open";
      });
    }

    $element.delegate(".toggler", "click", toggle);
  };

  function detachNavigationOnScroll(navigation) {
    var MIN_OFFSET_FOR_DETACH = 350,
        MIN_SCROLL_OFFSET = 80,
        lastValue = $(document).scrollTop();

    var scrollDirection = function(newValue, lastValue) {
      var direction = {};

      if (newValue < lastValue) {
        direction.direction = "up";
        direction.offset = lastValue - newValue;
      } else if (newValue > lastValue){
        direction.direction = "down";
        direction.offset = newValue - lastValue;
      } else {
        direction.direction = "still";
        direction.offset = 0;
      }

      return direction;
    };

    var setNavigationPlacement = function() {
      var newValue = $(document).scrollTop(),
          direction = scrollDirection(newValue, lastValue);

      if (newValue <= 0) {
        navigation.attach();
        navigation.visible();
        return;
      }

      if (direction.offset > MIN_SCROLL_OFFSET) {
        lastValue = newValue;
      }

      if (direction.direction == "up") {
        navigation.visible();
      } else {
        if (newValue >= MIN_SCROLL_OFFSET * 2) {
          navigation.hidden();
        }

        if (direction.offset > 0 && newValue >= MIN_OFFSET_FOR_DETACH) {
          // Ensure we wait for hide transition before detaching
          setTimeout(function() {
            navigation.detach();
          }, 250);
        }
      }
    };

    $(window).scroll(_.throttle(setNavigationPlacement, 320));
  }

  $(function() {
    var $siteBanner = $("#site-banner"),
        navigation = new Mp.Navigation($siteBanner);

    detachNavigationOnScroll(navigation);
    Mp.NavigationToggler($siteBanner);
  });
}(jQuery));
