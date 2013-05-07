<@markup id="css" >
   <#-- CSS Dependencies -->
   <@link rel="stylesheet" type="text/css" href="${url.context}/res/components/documentlibrary/tree.css" group="manualmanager"/>
</@>

<@markup id="js">
   <#-- JavaScript Dependencies -->
   <@script type="text/javascript" src="${url.context}/res/components/documentlibrary/tree.js" group="manualmanager"/>
   <@script type="text/javascript" src="${page.url.context}/res/loftux/components/manualmanager/mm-tree.js" group="manualmanager" />
</@>

<@markup id="widgets">
   <@createWidgets group="manualmanager"/>
</@>

<@uniqueIdDiv>
   <@markup id="html">
   <#assign id=args.htmlid?html>
   <#assign treetitle=msg("header.library") />
   <#if metaPage??>
      <#assign treetitle= metaPage.sitePageTitle!metaPage.title!""/>
   </#if>
      <div class="treeview filter">
         <h2 id="${id}-h2" class="alfresco-twister">${treetitle}</h2>
         <div id="${id}-treeview" class="tree"></div>
      </div>
   </@>
</@>