<#assign id=args.htmlid?html>


<div id="${id}-body" class="task-list">
   <div id="${id}-content" class="tasks">TEST</div>
</div>

<script type="text/javascript">//<![CDATA[
   new Loftux.ManualManagerPrint("${args.htmlid?js_string}").setOptions(
   {
      nodeRef: "${page.url.args.nodeRef?js_string!""}",
      recurse: "<#if page.url.args.recurse??>${page.url.args.recurse?js_string}<#else>false</#if>"
   }).setMessages(
      ${messages}
   );
//]]></script>
