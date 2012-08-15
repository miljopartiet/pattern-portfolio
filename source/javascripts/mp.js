$(function() {
  var Mp = {};

  Mp.NavigationToggler = function(element) {
    var $toggler = $(element),
        $nav = $('#main-navigation');

    var hide = function() {
      $nav.animate({
        marginTop: '-' + $nav.height() + 'px'
      }, 200, function() {
        $nav.removeClass('selected').css('marginTop', '0px');
      });
    };

    var show = function() {
      $nav.addClass('selected');
      $nav.css({
        marginTop: '-' + $nav.height() + 'px'
      });

      $nav.animate({
        marginTop: '0px'
      }, 300);

    };

    var toggle = function(e) {
      e.preventDefault();
      if ($nav.hasClass('selected')) {
        hide();
      } else {
        show();
      }
    }
    $toggler.bind('click', toggle);
  }

  $(document).ready(function() {
    Mp.NavigationToggler('#skip-to-navigation');
  });

}(jQuery));
