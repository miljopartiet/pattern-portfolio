/*! Cookies.js - 0.2.0; Copyright (c) 2012, Scott Hamper; http://www.opensource.org/licenses/MIT */

(function(f,e){var b=function(c,d,a){return 1===arguments.length?b.get(c):b.set(c,d,a)};b.get=function(c){f.cookie!==b._cacheString&&b._populateCache();return b._cache[c]};b.defaults={path:"/"};b.set=function(c,d,a){a={path:a&&a.path||b.defaults.path,domain:a&&a.domain||b.defaults.domain,expires:a&&a.expires||b.defaults.expires,secure:a&&a.secure!==e?a.secure:b.defaults.secure};d===e&&(a.expires=-1);switch(typeof a.expires){case "number":a.expires=new Date((new Date).getTime()+1E3*a.expires);break;
case "string":a.expires=new Date(a.expires)}c=encodeURIComponent(c)+"="+(d+"").replace(/[^!#-+\--:<-[\]-~]/g,encodeURIComponent);c+=a.path?";path="+a.path:"";c+=a.domain?";domain="+a.domain:"";c+=a.expires?";expires="+a.expires.toGMTString():"";c+=a.secure?";secure":"";f.cookie=c;return b};b.expire=function(c,d){return b.set(c,e,d)};b._populateCache=function(){b._cache={};b._cacheString=f.cookie;for(var c=b._cacheString.split("; "),d=0;d<c.length;d++){var a=c[d].indexOf("="),g=decodeURIComponent(c[d].substr(0,
a)),a=decodeURIComponent(c[d].substr(a+1));b._cache[g]===e&&(b._cache[g]=a)}};b.enabled=function(){var c="1"===b.set("cookies.js","1").get("cookies.js");b.expire("cookies.js");return c}();"function"===typeof define&&define.amd?define(function(){return b}):"undefined"!==typeof exports?("undefined"!=typeof module&&module.exports&&(exports=module.exports=b),exports.Cookies=b):window.Cookies=b})(document);
/*! matchMedia() polyfill - Test a CSS media type/query in JS. Authors & copyright (c) 2012: Scott Jehl, Paul Irish, Nicholas Zakas. Dual MIT/BSD license */
/*! NOTE: If you're already including a window.matchMedia polyfill via Modernizr or otherwise, you don't need this part */

window.matchMedia=window.matchMedia||(function(e,f){var c,a=e.documentElement,b=a.firstElementChild||a.firstChild,d=e.createElement("body"),g=e.createElement("div");g.id="mq-test-1";g.style.cssText="position:absolute;top:-100em";d.style.background="none";d.appendChild(g);return function(h){g.innerHTML='&shy;<style media="'+h+'"> #mq-test-1 { width: 42px; }</style>';a.insertBefore(d,b);c=g.offsetWidth==42;a.removeChild(d);return{matches:c,media:h}}})(document);

/*! Respond.js v1.1.0: min/max-width media query polyfill. (c) Scott Jehl. MIT/GPLv2 Lic. j.mp/respondjs  */
(function(e){e.respond={};respond.update=function(){};respond.mediaQueriesSupported=e.matchMedia&&e.matchMedia("only all").matches;if(respond.mediaQueriesSupported){return}var w=e.document,s=w.documentElement,i=[],k=[],q=[],o={},h=30,f=w.getElementsByTagName("head")[0]||s,g=w.getElementsByTagName("base")[0],b=f.getElementsByTagName("link"),d=[],a=function(){var D=b,y=D.length,B=0,A,z,C,x;for(;B<y;B++){A=D[B],z=A.href,C=A.media,x=A.rel&&A.rel.toLowerCase()==="stylesheet";if(!!z&&x&&!o[z]){if(A.styleSheet&&A.styleSheet.rawCssText){m(A.styleSheet.rawCssText,z,C);o[z]=true}else{if((!/^([a-zA-Z:]*\/\/)/.test(z)&&!g)||z.replace(RegExp.$1,"").split("/")[0]===e.location.host){d.push({href:z,media:C})}}}}u()},u=function(){if(d.length){var x=d.shift();n(x.href,function(y){m(y,x.href,x.media);o[x.href]=true;u()})}},m=function(I,x,z){var G=I.match(/@media[^\{]+\{([^\{\}]*\{[^\}\{]*\})+/gi),J=G&&G.length||0,x=x.substring(0,x.lastIndexOf("/")),y=function(K){return K.replace(/(url\()['"]?([^\/\)'"][^:\)'"]+)['"]?(\))/g,"$1"+x+"$2$3")},A=!J&&z,D=0,C,E,F,B,H;if(x.length){x+="/"}if(A){J=1}for(;D<J;D++){C=0;if(A){E=z;k.push(y(I))}else{E=G[D].match(/@media *([^\{]+)\{([\S\s]+?)$/)&&RegExp.$1;k.push(RegExp.$2&&y(RegExp.$2))}B=E.split(",");H=B.length;for(;C<H;C++){F=B[C];i.push({media:F.split("(")[0].match(/(only\s+)?([a-zA-Z]+)\s?/)&&RegExp.$2||"all",rules:k.length-1,hasquery:F.indexOf("(")>-1,minw:F.match(/\(min\-width:[\s]*([\s]*[0-9\.]+)(px|em)[\s]*\)/)&&parseFloat(RegExp.$1)+(RegExp.$2||""),maxw:F.match(/\(max\-width:[\s]*([\s]*[0-9\.]+)(px|em)[\s]*\)/)&&parseFloat(RegExp.$1)+(RegExp.$2||"")})}}j()},l,r,v=function(){var z,A=w.createElement("div"),x=w.body,y=false;A.style.cssText="position:absolute;font-size:1em;width:1em";if(!x){x=y=w.createElement("body");x.style.background="none"}x.appendChild(A);s.insertBefore(x,s.firstChild);z=A.offsetWidth;if(y){s.removeChild(x)}else{x.removeChild(A)}z=p=parseFloat(z);return z},p,j=function(I){var x="clientWidth",B=s[x],H=w.compatMode==="CSS1Compat"&&B||w.body[x]||B,D={},G=b[b.length-1],z=(new Date()).getTime();if(I&&l&&z-l<h){clearTimeout(r);r=setTimeout(j,h);return}else{l=z}for(var E in i){var K=i[E],C=K.minw,J=K.maxw,A=C===null,L=J===null,y="em";if(!!C){C=parseFloat(C)*(C.indexOf(y)>-1?(p||v()):1)}if(!!J){J=parseFloat(J)*(J.indexOf(y)>-1?(p||v()):1)}if(!K.hasquery||(!A||!L)&&(A||H>=C)&&(L||H<=J)){if(!D[K.media]){D[K.media]=[]}D[K.media].push(k[K.rules])}}for(var E in q){if(q[E]&&q[E].parentNode===f){f.removeChild(q[E])}}for(var E in D){var M=w.createElement("style"),F=D[E].join("\n");M.type="text/css";M.media=E;f.insertBefore(M,G.nextSibling);if(M.styleSheet){M.styleSheet.cssText=F}else{M.appendChild(w.createTextNode(F))}q.push(M)}},n=function(x,z){var y=c();if(!y){return}y.open("GET",x,true);y.onreadystatechange=function(){if(y.readyState!=4||y.status!=200&&y.status!=304){return}z(y.responseText)};if(y.readyState==4){return}y.send(null)},c=(function(){var x=false;try{x=new XMLHttpRequest()}catch(y){x=new ActiveXObject("Microsoft.XMLHTTP")}return function(){return x}})();a();respond.update=a;function t(){j(true)}if(e.addEventListener){e.addEventListener("resize",t,false)}else{if(e.attachEvent){e.attachEvent("onresize",t)}}})(this);
$(function() {
  "use strict";
  var Mp = {};

  Mp.CookieChecker = function() {
    var cookie = Cookies.get('allow-cookies'),
        $message;
    if (! cookie) {
      $message = $('#cookies');
      $message.on('click', 'a.confirm', function(e) {
        e.preventDefault();
        $message.hide();
        Cookies.set('allow-cookies', true);
      });
      $message.show();
    }
  };

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
      $nav.attr('id', 'site-top-navigation');
      console.log($original_nav);

      $nav.append('<a href="#" class="close"><span>Stäng meny</span></a>');
      $nav.on('click', 'a.close', hide);

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
      console.log(e);
      e.preventDefault();
      $nav.addClass('inactive').removeClass('active');
    };

    var show = function(e) {
      e.preventDefault();
      $nav.addClass('active').removeClass('inactive');
    };

    $toggler.bind('click', show);
    $toggler.bind('mouseenter', function() {
      setup();
    });
  }

  $(document).ready(function() {
    Mp.NavigationToggler('#skip-to-navigation');
    Mp.CookieChecker();
  });

}(jQuery));



