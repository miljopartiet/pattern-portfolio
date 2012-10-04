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

      $voting.delegate('button, a.show-results', 'click', function(e) {
        console.log(e);
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
      $local_info.show();
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
  });
}(jQuery));
