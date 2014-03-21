//= require lib/underscore/_string

(function($, Mp) {
  "use strict";
  Mp.Facebook = Mp.Facebook || {};

  Mp.Facebook.username = "miljopartiet";

  Mp.Facebook.Counter = function() {
    var $counters = $(".facebook-like-count");
    if ($counters.size() === 0) {
      return;
    }

    $.getJSON("https://graph.facebook.com/"+Mp.Facebook.username+"?callback=?", function(response) {
      $counters.text(_.str.numberFormat(response.likes, 0, ".", " ")+ " gillar");
    });
  };

  $(function() {
    Mp.Facebook.Counter();
  });
}(jQuery, Mp));

