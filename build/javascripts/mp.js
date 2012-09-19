
/**
 * Cookie plugin 1.0
 *
 * Copyright (c) 2006 Klaus Hartl (stilbuero.de)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */

jQuery.cookie=function(b,j,m){if(typeof j!="undefined"){m=m||{};if(j===null){j="";m.expires=-1}var e="";if(m.expires&&(typeof m.expires=="number"||m.expires.toUTCString)){var f;if(typeof m.expires=="number"){f=new Date();f.setTime(f.getTime()+(m.expires*24*60*60*1000))}else{f=m.expires}e="; expires="+f.toUTCString()}var l=m.path?"; path="+(m.path):"";var g=m.domain?"; domain="+(m.domain):"";var a=m.secure?"; secure":"";document.cookie=[b,"=",encodeURIComponent(j),e,l,g,a].join("")}else{var d=null;if(document.cookie&&document.cookie!=""){var k=document.cookie.split(";");for(var h=0;h<k.length;h++){var c=jQuery.trim(k[h]);if(c.substring(0,b.length+1)==(b+"=")){d=decodeURIComponent(c.substring(b.length+1));break}}}return d}};
/*
 * Natural Sort algorithm for Javascript - Version 0.6 - Released under MIT license
 * Author: Jim Palmer (based on chunking idea from Dave Koelle)
 * Contributors: Mike Grier (mgrier.com), Clint Priest, Kyle Adams, guillermo
 */

function naturalSort(a, b) {
  var re = /(^-?[0-9]+(\.?[0-9]*)[df]?e?[0-9]?$|^0x[0-9a-f]+$|[0-9]+)/gi,
    sre = /(^[ ]*|[ ]*$)/g,
    dre = /(^([\w ]+,?[\w ]+)?[\w ]+,?[\w ]+\d+:\d+(:\d+)?[\w ]?|^\d{1,4}[\/\-]\d{1,4}[\/\-]\d{1,4}|^\w+, \w+ \d+, \d{4})/,
    hre = /^0x[0-9a-f]+$/i,
    ore = /^0/,
    // convert all to strings and trim()
    x = a.toString().replace(sre, '') || '',
    y = b.toString().replace(sre, '') || '',
    // chunk/tokenize
    xN = x.replace(re, '\0$1\0').replace(/\0$/,'').replace(/^\0/,'').split('\0'),
    yN = y.replace(re, '\0$1\0').replace(/\0$/,'').replace(/^\0/,'').split('\0'),
    // numeric, hex or date detection
    xD = parseInt(x.match(hre)) || (xN.length != 1 && x.match(dre) && Date.parse(x)),
    yD = parseInt(y.match(hre)) || xD && y.match(dre) && Date.parse(y) || null;
  // first try and sort Hex codes or Dates
  if (yD) {
    if ( xD < yD ) {
      return -1;
    } else if ( xD > yD ) {
      return 1;
    }
  }
  // natural sorting through split numeric strings and default strings
  for (var cLoc=0, numS=Math.max(xN.length, yN.length); cLoc < numS; cLoc++) {
    // find floats not starting with '0', string or 0 if not defined (Clint Priest)
    oFxNcL = !(xN[cLoc] || '').match(ore) && parseFloat(xN[cLoc]) || xN[cLoc] || 0;
    oFyNcL = !(yN[cLoc] || '').match(ore) && parseFloat(yN[cLoc]) || yN[cLoc] || 0;
    // handle numeric vs string comparison - number < string - (Kyle Adams)
    if (isNaN(oFxNcL) !== isNaN(oFyNcL)) {
      return (isNaN(oFxNcL)) ? 1 : -1;
    // rely on string comparison if different types - i.e. '02' < 2 != '02' < '2'
    } else if (typeof oFxNcL !== typeof oFyNcL) {
      oFxNcL += '';
      oFyNcL += '';
    }
    if (oFxNcL < oFyNcL) {
      return -1;
    }
    if (oFxNcL > oFyNcL) {
      return 1;
    }
  }
  return 0;
}
;
/*! matchMedia() polyfill - Test a CSS media type/query in JS. Authors & copyright (c) 2012: Scott Jehl, Paul Irish, Nicholas Zakas. Dual MIT/BSD license */
/*! NOTE: If you're already including a window.matchMedia polyfill via Modernizr or otherwise, you don't need this part */

window.matchMedia=window.matchMedia||(function(e,f){var c,a=e.documentElement,b=a.firstElementChild||a.firstChild,d=e.createElement("body"),g=e.createElement("div");g.id="mq-test-1";g.style.cssText="position:absolute;top:-100em";d.style.background="none";d.appendChild(g);return function(h){g.innerHTML='&shy;<style media="'+h+'"> #mq-test-1 { width: 42px; }</style>';a.insertBefore(d,b);c=g.offsetWidth==42;a.removeChild(d);return{matches:c,media:h}}})(document);

/*! Respond.js v1.1.0: min/max-width media query polyfill. (c) Scott Jehl. MIT/GPLv2 Lic. j.mp/respondjs  */
(function(e){e.respond={};respond.update=function(){};respond.mediaQueriesSupported=e.matchMedia&&e.matchMedia("only all").matches;if(respond.mediaQueriesSupported){return}var w=e.document,s=w.documentElement,i=[],k=[],q=[],o={},h=30,f=w.getElementsByTagName("head")[0]||s,g=w.getElementsByTagName("base")[0],b=f.getElementsByTagName("link"),d=[],a=function(){var D=b,y=D.length,B=0,A,z,C,x;for(;B<y;B++){A=D[B],z=A.href,C=A.media,x=A.rel&&A.rel.toLowerCase()==="stylesheet";if(!!z&&x&&!o[z]){if(A.styleSheet&&A.styleSheet.rawCssText){m(A.styleSheet.rawCssText,z,C);o[z]=true}else{if((!/^([a-zA-Z:]*\/\/)/.test(z)&&!g)||z.replace(RegExp.$1,"").split("/")[0]===e.location.host){d.push({href:z,media:C})}}}}u()},u=function(){if(d.length){var x=d.shift();n(x.href,function(y){m(y,x.href,x.media);o[x.href]=true;u()})}},m=function(I,x,z){var G=I.match(/@media[^\{]+\{([^\{\}]*\{[^\}\{]*\})+/gi),J=G&&G.length||0,x=x.substring(0,x.lastIndexOf("/")),y=function(K){return K.replace(/(url\()['"]?([^\/\)'"][^:\)'"]+)['"]?(\))/g,"$1"+x+"$2$3")},A=!J&&z,D=0,C,E,F,B,H;if(x.length){x+="/"}if(A){J=1}for(;D<J;D++){C=0;if(A){E=z;k.push(y(I))}else{E=G[D].match(/@media *([^\{]+)\{([\S\s]+?)$/)&&RegExp.$1;k.push(RegExp.$2&&y(RegExp.$2))}B=E.split(",");H=B.length;for(;C<H;C++){F=B[C];i.push({media:F.split("(")[0].match(/(only\s+)?([a-zA-Z]+)\s?/)&&RegExp.$2||"all",rules:k.length-1,hasquery:F.indexOf("(")>-1,minw:F.match(/\(min\-width:[\s]*([\s]*[0-9\.]+)(px|em)[\s]*\)/)&&parseFloat(RegExp.$1)+(RegExp.$2||""),maxw:F.match(/\(max\-width:[\s]*([\s]*[0-9\.]+)(px|em)[\s]*\)/)&&parseFloat(RegExp.$1)+(RegExp.$2||"")})}}j()},l,r,v=function(){var z,A=w.createElement("div"),x=w.body,y=false;A.style.cssText="position:absolute;font-size:1em;width:1em";if(!x){x=y=w.createElement("body");x.style.background="none"}x.appendChild(A);s.insertBefore(x,s.firstChild);z=A.offsetWidth;if(y){s.removeChild(x)}else{x.removeChild(A)}z=p=parseFloat(z);return z},p,j=function(I){var x="clientWidth",B=s[x],H=w.compatMode==="CSS1Compat"&&B||w.body[x]||B,D={},G=b[b.length-1],z=(new Date()).getTime();if(I&&l&&z-l<h){clearTimeout(r);r=setTimeout(j,h);return}else{l=z}for(var E in i){var K=i[E],C=K.minw,J=K.maxw,A=C===null,L=J===null,y="em";if(!!C){C=parseFloat(C)*(C.indexOf(y)>-1?(p||v()):1)}if(!!J){J=parseFloat(J)*(J.indexOf(y)>-1?(p||v()):1)}if(!K.hasquery||(!A||!L)&&(A||H>=C)&&(L||H<=J)){if(!D[K.media]){D[K.media]=[]}D[K.media].push(k[K.rules])}}for(var E in q){if(q[E]&&q[E].parentNode===f){f.removeChild(q[E])}}for(var E in D){var M=w.createElement("style"),F=D[E].join("\n");M.type="text/css";M.media=E;f.insertBefore(M,G.nextSibling);if(M.styleSheet){M.styleSheet.cssText=F}else{M.appendChild(w.createTextNode(F))}q.push(M)}},n=function(x,z){var y=c();if(!y){return}y.open("GET",x,true);y.onreadystatechange=function(){if(y.readyState!=4||y.status!=200&&y.status!=304){return}z(y.responseText)};if(y.readyState==4){return}y.send(null)},c=(function(){var x=false;try{x=new XMLHttpRequest()}catch(y){x=new ActiveXObject("Microsoft.XMLHTTP")}return function(){return x}})();a();respond.update=a;function t(){j(true)}if(e.addEventListener){e.addEventListener("resize",t,false)}else{if(e.attachEvent){e.attachEvent("onresize",t)}}})(this);
(function($) {
  "use strict";
  var Mp = {};

  Mp.CookieChecker = function() {
    var cookie = $.cookie('allow-cookies'),
        $message;
    if (! cookie) {
      $message = $('#cookies');
      $message.bind('click', 'a.confirm', function(e) {
        e.preventDefault();
        $message.hide();
        $.cookie('allow-cookies', true, { expires: 365, path: '/' });
      });
      $('body').prepend($message.show());
    }
  };

  Mp.searchAsYouType = (function() {
    var $element, $suggest_list,
    positionOffsetX, positionOffsetY,
    options,
    focused = -1, current_suggestions = [];

    var movementKeys = {
      '16': null, // Shift
      '27': function() { // esc
        hide();
        $element.blur();
      },
      '37': null, // Arrow left
      '38': function(e) { // Arrow up
        focusPrevious();
        e.preventDefault(e);
      },
      '39': null, // Arrow right
      '40': function(e) { // Arrow down
        focusNext();
        e.preventDefault();
      },
      '9': function(e) { // tab
        !e.shiftKey ? focusNext() : focusPrevious();
        e.preventDefault();
      },
      '13': function(e) { // enter
        e.preventDefault();
        $suggest_list.find("a.focused").trigger("click");
      }
    };

    var init = function(element, opts) {
      $element = $(element);
      if ($element.size() == 0) {
        return;
      }
      $suggest_list = $('<div id="search-suggestions" class="suggestions" style="display:none;position:absolute;"></div>');
      $suggest_list.css({
        width: $element.outerWidth() + 'px'
      });
      var $body = $('body');
      positionOffsetX = parseInt($body.css('paddingLeft'), 10);
      positionOffsetY = parseInt($body.css('paddingTop'), 10) + $element.outerHeight();

      options = $.extend({
        source: []
      }, opts || {});

      if (typeof options.source === 'function') {
        options.source = options.source.call(this);
      }

      $element.bind('keydown.autocomplete', function(e) {
        var func = movementKeys[e.keyCode.toString()];
        if (typeof func === 'function') {
          func.call(this, e);
        }
      }).bind('keyup.autocomplete', function(e) {
        if (typeof movementKeys[e.keyCode.toString()] !== 'undefined') {
          e.preventDefault();
          return;
        }
        search($element.val());
      }).bind('focus.autocomplete', function() {
        if ($.trim($element.val()) !== '') {
          show();
        }
      }).bind('blur.autocomplete', function() {
        focusSuggestion(-1);
      });

      $(window).bind('resize.autocomplete', position);

      $suggest_list.appendTo('body');
    };

    var search = function(value) {
      var value = $.trim(value);
      if (value === '') {
        update([]);
        hide();
      } else if (value !== '') {
        update(searchSources(value));
        if ($suggest_list.is(':hidden')) {
          show();
        }
      }
    };

    var searchSources = function(value) {
      var test = new RegExp('^' + value + '|\\s' + value, 'i');
      return $.grep(options.source, function(company) {
        return test.exec(company.name) !== null;
      });
    };

    var update = function(matches) {
      current_suggestions = matches;
      focused = -1;

      if (current_suggestions.length == 0) {
        current_suggestions.push(notFound());
      }

      var html = [];
      $.each(current_suggestions, function(i, c) {
        html.push('<a href="'+ c.href +'">'+ c.name +'</a>');
      });
      $suggest_list.html(html.join(''));
    };

    var show = function() {
      position();
      $suggest_list.show();
      $("#search").addClass("has-results");
      $(document).bind('click.autocomplete', function(e) {
        var el = $suggest_list.get(0);
        if (e.target !== $element.get(0) && e.target !== el && !$.contains(el, e.target)) {
          hide();
          $element.blur();
        }
      });
    };

    var hide = function() {
      $suggest_list.hide();
      $("#search").removeClass("has-results");
      $(document).unbind('click.autocomplete');
    };

    var focusNext = function() {
      var num = current_suggestions.length;
      if (num > 0 && focused < (num - 1)) {
        focusSuggestion(focused + 1);
      } else if (focused === (num - 1)) {
        focusSuggestion(0);
      }
    };

    var focusPrevious = function() {
      if (focused !== -1) {
        focusSuggestion(focused - 1);
      } else {
        focusSuggestion(current_suggestions.length - 1);
      }
    };

    var focusSuggestion = function(num) {
      $suggest_list.find('a').removeClass('focused')
      .filter(':nth-child('+ (num + 1) +')')
      .addClass('focused');
      focused = num;
    };

    var position = function() {
      var position = $element.offset();
      $suggest_list.css({
        'top': Math.round(position.top + positionOffsetY) + 'px',
        'left': Math.round(position.left + positionOffsetX) + 'px'
      });
    };

    var notFound = function () {
      return {
        name: 'No matches found',
        id: null
      }
    };

    return init;
  })();

  Mp.NavigationToggler = function(element) {
    var $toggler = $(element),
        setup_run = false,
        $nav;

    var setup = function() {
      if (setup_run) {
        return;
      }
      var $original_nav = $('#site-navigation');
      $nav = $original_nav.clone();
      $nav.attr('id', 'site-top-navigation').css({
        visibility: 'hidden'
      });

      $nav.append('<a href="#" class="close"><span>Stäng meny</span></a>');
      $nav.bind('click', 'a.close', hide);

      $('body').append($nav);
      var offset = $nav.outerHeight(),
          style = document.createElement('style'),
          rules = "#site-top-navigation { margin-top: -"+ offset +"px; }";

      rules += "#site-top-navigation.inactive { margin-top: -"+ offset +"px; }";
      style.type = 'text/css';
      style.innerHTML = rules;

      document.getElementsByTagName("head")[0].appendChild(style);
      setup_run = true;
    }

    var hide = function(e) {
      e.preventDefault();
      $nav.addClass('inactive').removeClass('active');
    };

    var show = function(e) {
      e.preventDefault();
      $nav.css('visibility', 'visible');
      $nav.addClass('active').removeClass('inactive');
    };

    $toggler.bind('click', show);
    setup();
  };

  $(document).ready(function() {
    Mp.NavigationToggler('#skip-to-navigation');
    Mp.CookieChecker();
    Mp.searchAsYouType('#topics-search', {
      source: function() {
        var items = $.map($('#topics a'), function(link) {
          return {
            name: $(link).text(),
            href: link.href
          };
        });

        return items.sort(function(self, other) {
          return naturalSort(self.name, other.name);
        });
      }
    });

    $('section.tabbed').tabs();
    $('#conversation-form').hide();
    $('#go-to-form').bind('click', function(e) {
      e.preventDefault();
      var $form = $('#conversation-form');
      if ($form.is(':visible')) {
        $('#conversation-form').slideUp();
      } else {
        $('#conversation-form').slideDown();
      }
    });
  });

}(jQuery));




