(function(e){function t(){e("div.voting").each(function(){var t=e(this),n=t.find("div.votable"),r=t.find("div.poll-results");if(r.size()==0)return;r.hide(),n.append('<a href="#" class="show-results toggler">'+n.data("show-results-copy")+"</a>"),r.append('<a href="#" class="show-votable toggler">'+r.data("show-votable-copy")+"</a>"),t.delegate("button, a.show-results","click",function(e){console.log(e),e.preventDefault(),n.hide(),r.show()}),t.delegate("a.show-votable","click",function(e){e.preventDefault(),r.hide(),n.show()})})}function n(t){t.preventDefault();var n=e(t.liveFired),r=n.parents("div.speech-bubble"),i=r.siblings(".article-section.local");i.size()!==0&&(r.hide(),i.show())}e(document).ready(function(){t(),e("div.position-me").delegate("span.choose","click",function(t){t.preventDefault();var r=e(t.liveFired);r.hide(),r.siblings("div.localities").show().delegate("form","submit",n)}).delegate("a.action","click",n).each(function(){var t=e(this).parents("div.speech-bubble"),n=t.siblings(".article-section.local");n.hide()})})})(jQuery);