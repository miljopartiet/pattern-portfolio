(function($) {
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
