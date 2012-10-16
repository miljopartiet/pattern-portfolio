(function() {
  var disqus_shortname = 'mp-dev';

  $(document).ready(function() {
    var element = (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0])

    $('a[href="#disqus_thread"]').bind('click', function(e) {
      e.preventDefault();
      var $fetch_more = $(this).parent('.fetch-more');

      $fetch_more.hide();
      $fetch_more.after($('<div id="disqus_thread" class="comments"></div>'));

      var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
      dsq.src = 'http://' + disqus_shortname + '.disqus.com/embed.js';
      element.appendChild(dsq);
    });


    var s = document.createElement('script'); s.async = true;
    s.type = 'text/javascript';
    s.src = 'http://' + disqus_shortname + '.disqus.com/count.js';
    element.appendChild(s);
  });
})();
