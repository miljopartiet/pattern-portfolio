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
        $local_info = $('.local');

    if ($local_info.size() !== 0) {
      $bubble.hide();
      var html = [],
          $temp;
      html.push('<div class="section loading"><article>');
      html.push('<header></header>');
      html.push('<h1><a href="/jamtland.html" class="topic">Östersund</a></h1>');
      html.push('</article></div>');
      $temp = $(html.join(''));
      $bubble.parent().after($temp);
      setTimeout(function() {
        $temp.replaceWith($local_info.show());
      }, Math.floor(Math.random()*1901) + 100);
    }
  }
  $(document).ready(function() {
    // Preload load indicators
    var green_loader = new Image(),
        grey_loader = new Image();
    green_loader.src = '/images/load-green-32.gif';
    grey_loader.src = '/images/load-grey-64.gif';

    Voting();

    $('div.position-me').delegate('span.choose', 'click', function(e) {
      e.preventDefault();
      var $element = $(e.liveFired);
      $element.hide();
      $element.siblings('div.localities').show()
        .delegate('form', 'submit', toggleLocalityInfo);
    }).delegate('a.action', 'click', toggleLocalityInfo)
      .each(function() {
        $('.local').hide();
      });

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
