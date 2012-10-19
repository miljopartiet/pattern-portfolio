(function($) {
  var disqus_shortname = 'mp-dev';

  $(document).ready(function() {
    var element = (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0])
        $disqus_link = $('div.fetch-more a[href="#disqus_thread"]');

    $disqus_link.bind('click', function(e) {
      e.preventDefault();
      var $fetch_more = $(this).parent('.fetch-more');

      $fetch_more.hide();
      $fetch_more.after($('<div id="disqus_thread" class="comments"></div>'));

      var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
      dsq.src = 'http://' + disqus_shortname + '.disqus.com/embed.js';
      element.appendChild(dsq);
    });

    if (window.location.hash == '#disqus_thread') {
      $disqus_link.trigger('click');
    }

    var s = document.createElement('script'); s.async = true;
    s.type = 'text/javascript';
    s.src = 'http://' + disqus_shortname + '.disqus.com/count.js';
    element.appendChild(s);
  });
})(jQuery);
