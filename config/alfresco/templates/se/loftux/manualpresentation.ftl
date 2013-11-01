<#include "../../org/alfresco/include/alfresco-template.ftl" />
<!doctype html>
<html>

   <head>
      <meta charset="utf-8">

      <title>Presentation</title>

      <meta name="description" content="A framework for easily creating beautiful presentations using HTML">
      <meta name="author" content="Hakim El Hattab">

      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">

      <link rel="stylesheet" type="text/css" href="<@checksumResource src="${page.url.context}/res/loftux/components/reveal/css/reveal.min.css"/>" />
      <link rel="stylesheet" type="text/css" href="<@checksumResource src="${page.url.context}/res/loftux/components/reveal/css/theme/default.css"/>" id="theme" />

      <!-- For syntax highlighting -->
      <link rel="stylesheet" type="text/css" href="<@checksumResource src="${page.url.context}/res/loftux/components/reveal/lib/css/zenburn.css"/>" />

      <!--[if lt IE 9]>
      <script type="text/javascript" src="<@checksumResource src="${page.url.context}/res/loftux/components/reveal/lib/js/html5shiv.js"/>"></script>
      <![endif]-->
   </head>

   <body>
<@region id="reveal" chromeless="true" scope="template"/>

      <script type="text/javascript" src="<@checksumResource src="${page.url.context}/res/loftux/components/reveal/lib/js/head.js"/>"></script>
      <script type="text/javascript" src="<@checksumResource src="${page.url.context}/res/loftux/components/reveal/js/reveal.js"/>"></script>

      <script>

         // Full list of configuration options available here:
         // https://github.com/hakimel/reveal.js#configuration
         Reveal.initialize({
            controls: true,
            progress: true,
            history: true,
            center: true,

            theme: Reveal.getQueryHash().theme, // available themes are in /css/theme
            transition: Reveal.getQueryHash().transition || 'default', // default/cube/page/concave/zoom/linear/fade/none

            // Optional libraries used to extend on reveal.js
            dependencies: [
               { src: '<@checksumResource src="${page.url.context}/res/loftux/components/reveal/lib/js/classList.js"/>', condition: function() { return !document.body.classList; } },
               { src: '<@checksumResource src="${page.url.context}/res/loftux/components/reveal/plugin/markdown/marked.js"/>', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
               { src: '<@checksumResource src="${page.url.context}/res/loftux/components/reveal/plugin/markdown/markdown.js"/>', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
               { src: '<@checksumResource src="${page.url.context}/res/loftux/components/reveal/plugin/highlight/highlight.js"/>', async: true, callback: function() { hljs.initHighlightingOnLoad(); } },
               { src: '<@checksumResource src="${page.url.context}/res/loftux/components/reveal/plugin/zoom-js/zoom.js"/>', async: true, condition: function() { return !!document.body.classList; } },
               { src: '<@checksumResource src="${page.url.context}/res/loftux/components/reveal/plugin/notes/notes.js"/>', async: true, condition: function() { return !!document.body.classList; } }
               // { src: 'plugin/search/search.js', async: true, condition: function() { return !!document.body.classList; } }
               // { src: 'plugin/remotes/remotes.js', async: true, condition: function() { return !!document.body.classList; } }
            ]
         });

      </script>
   </body>
</html>