//= require lib/underscore/_deferred

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
        var dfd = _.Deferred();
        if (!this._visible) {
          this.$header.addClass("visible");
          this.$header.removeClass("hidden");
          this._visible = true;

          // Wait for visible transformation
          setTimeout(function() {
            dfd.resolve();
          }, 250);
        } else {
          dfd.resolve();
        }

        return dfd.promise();
      },

      hidden: function() {
        var dfd = _.Deferred();
        if (this._visible) {
          this.$header.addClass("hidden");
          this.$header.removeClass("visible");
          this._visible = false;

          // Wait for visible transformation
          setTimeout(function() {
            dfd.resolve();
          }, 300);
        } else {
          dfd.resolve();
        }

        return dfd.promise();
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
        $target.find("input").trigger("focus");
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
    var MIN_OFFSET_FOR_DETACH = 550,
        MIN_HIDE_SCROLL_TOP = 160,
        MIN_SCROLL_OFFSET = 60,
        lastScrollTop = $(document).scrollTop(),
        busy = false;

    var scrollDirection = function(newScrollTop, lastScrollTop) {
      var direction = {};

      if (newScrollTop < lastScrollTop) {
        direction.direction = "up";
        direction.offset = lastScrollTop - newScrollTop;
      } else if (newScrollTop > lastScrollTop){
        direction.direction = "down";
        direction.offset = newScrollTop - lastScrollTop;
      } else {
        direction.direction = "still";
        direction.offset = 0;
      }

      return direction;
    };

    var setNavigationPlacement = function() {
      var newScrollTop = $(document).scrollTop(),
          direction = scrollDirection(newScrollTop, lastScrollTop);

      lastScrollTop = newScrollTop;

      if (newScrollTop <= 0) {
        navigation.attach();
        navigation.visible();
        return;
      } else if (busy || direction.offset < MIN_SCROLL_OFFSET) {
        return;
      }


      if (direction.direction == "up") {
        busy = true;
        navigation.visible().done(function() {
          busy = false;
        });
      } else {
        if (newScrollTop >= MIN_HIDE_SCROLL_TOP) {
          busy = true;
          navigation.hidden().done(function() {
            busy = false;
          });
        }

        if (newScrollTop >= MIN_OFFSET_FOR_DETACH) {
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
