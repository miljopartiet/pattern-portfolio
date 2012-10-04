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


    Mp.searchAsYouType('#main-search', {
      limit: 25,
      inlined: true,
      source: function() {
        var self = this,
            source_url = this.element.data('source');

        $.getJSON(source_url, function(data) {
          self.source = data;
        });
      },
      itemTemplate: function(item, query) {
        var html = ['<li><a href="'+item.href+'">'],
            name = item.name,
            matches = [],
            words = query.split(' ');

        for (var i = 0, j = words.length; i < j; i++) {
          var word_matches = name.match(new RegExp(words[i], 'gi'));
          if (word_matches) {
            matches = matches.concat(word_matches);
          }
        }

        if (matches.length > 0) {
          for (var i = 0, j = matches.length; i < j; i++) {
            name = name.replace(matches[i], '<em>'+ matches[i] +'</em>');
          }
        }

        html.push('<span class="name">');
        html.push(name);
        html.push('</span>');
        html.push('<span class="category">');
        html.push(item.category);
        html.push('</span>');
        html.push('</a></li>');

        return html.join('');
      },
      onSetup: function() {
        this.container.addClass('main-search');
      },
      onShow: function() {
        this.element.addClass('has-suggestions');
      },
      onHide: function() {
        this.element.removeClass('has-suggestions');
      },
      sortFunction: function(one, other) {
        if (one.score !== other.score) {
          return one.score < other.score ? 1 : -1;
        } else {
          return this.defaultSortFunction(one, other);
        }
      }
    });

  });
}(jQuery));
