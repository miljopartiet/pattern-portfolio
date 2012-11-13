(function($) {

  function Voting() {
    $('div.voting').each(function() {
      var $voting = $(this),
          $votable = $voting.find('div.votable'),
          $results = $voting.find('div.poll-results');
      if ($results.size() == 0) {
        return;
      }

      $results.hide();

      $votable.append('<a href="#" class="show-results toggler">'+ $votable.data('show-results-copy') +'</a>');
      $results.append('<a href="#" class="show-votable toggler">'+ $results.data('show-votable-copy') +'</a>');

      $voting.delegate('input[type="submit"], a.show-results', 'click', function(e) {
        e.preventDefault();
        $votable.hide();
        $results.show();
      });

      $voting.delegate('a.show-votable', 'click', function(e) {
        e.preventDefault();
        $results.hide();
        $votable.show();
      });
    });
  };

  function toggleLocalityInfo(e) {
    e.preventDefault();
    var $element = $(e.liveFired),
        $bubble  = $element.parents('div.speech-bubble'),
        $local_info = $bubble.siblings('.article-section.local');

    if ($local_info.size() !== 0) {
      $bubble.hide();
      var html = [],
          $temp;
      html.push('<section class="article-section loading">');
      html.push('<header></header>');
      html.push('<h2><a href="/jamtland.html" class="topic">Östersund</a></h2>');
      html.push('</section>');
      $temp = $(html.join(''));
      $bubble.after($temp);
      setTimeout(function() {
        $temp.replaceWith($local_info.show());
      }, Math.floor(Math.random()*1901) + 100);
    }
  }
  $(document).ready(function() {
    Voting();

    $('div.position-me').delegate('span.choose', 'click', function(e) {
      e.preventDefault();
      var $element = $(e.liveFired);
      $element.hide();
      $element.siblings('div.localities').show()
        .delegate('form', 'submit', toggleLocalityInfo);
    }).delegate('a.action', 'click', toggleLocalityInfo)
      .each(function() {
        var $bubble = $(this).parents('div.speech-bubble'),
            $local_info = $bubble.siblings('.article-section.local');

        $local_info.hide();
      });

    var loader = new Image();
    loader.src = '/images/ajax-loader.gif';
    $('div.fetch-more a.action').click(function(e) {
      e.preventDefault();
      var $link = $(this);
      $link.addClass('loading');
      setTimeout(function() {
        $link.removeClass('loading');
      }, 1000);
    });
  });
}(jQuery));
