(function($) {
  var disqus_shortname = 'miljopartiet';
  if (! ("disqus_shortname" in window)) {
    window.disqus_shortname = disqus_shortname;
  }

  function embedComments() {
    var element = (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]),
        dsq = document.createElement('script');

    dsq.type = 'text/javascript';
    dsq.async = true;
    dsq.src = 'http://' + disqus_shortname + '.disqus.com/embed.js';
    element.appendChild(dsq);
  }

  $(document).ready(function() {
    var element = (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0])
        $commentsContainer = $('#disqus_thread'),
        $disqus_link = $('div.fetch-more a[href="#disqus_thread"]');

    if ($commentsContainer.size() == 0) {
      $disqus_link.bind('click', function(e) {
        e.preventDefault();
        var $fetch_more = $(this).parent('.fetch-more');
        $fetch_more.hide();
        $fetch_more.after($('<div id="disqus_thread" class="comments"></div>'));

        embedComments();
      });

      if (window.location.hash == '#disqus_thread') {
        $disqus_link.trigger('click');
      }
    } else {
      embedComments();
    }
  });

  (function () {
    var s = document.createElement('script'); s.async = true;
    s.type = 'text/javascript';
    s.src = 'http://' + window.disqus_shortname + '.disqus.com/count.js';
    (document.getElementsByTagName('HEAD')[0] || document.getElementsByTagName('BODY')[0]).appendChild(s);
  }());

})(jQuery);
