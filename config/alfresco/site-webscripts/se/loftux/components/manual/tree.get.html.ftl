<#assign id=args.htmlid?html>
<#assign treeConfig = config.scoped["DocumentLibrary"]["tree"]!>
<#if treeConfig.getChildValue??>
   <#assign evaluateChildFolders = treeConfig.getChildValue("evaluate-child-folders")!"true">
   <#assign maximumFolderCount = treeConfig.getChildValue("maximum-folder-count")!"-1">
</#if>
<#assign treetitle=msg("header.library") />
<#if metaPage??>
<#assign treetitle= metaPage.sitePageTitle!metaPage.title!""/>
</#if>
<script type="text/javascript">//<![CDATA[
   new Loftux.ManualManagerTree("${args.htmlid?js_string}").setOptions(
   {
      siteId: "${page.url.templateArgs.site!""}",
      containerId: "${template.properties.container!"manual"}",
      evaluateChildFolders: ${evaluateChildFolders!"true"},
      maximumFolderCount: ${maximumFolderCount!"-1"},
      setDropTargets: false
   }).setMessages(
      ${messages}
   );
//]]></script>
<div class="treeview filter">
   <h2 id="${id}-h2" class="alfresco-twister">${treetitle}</h2>
   <div id="${id}-treeview" class="tree"></div>
</div>