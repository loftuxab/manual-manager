<@markup id="css" >
   <#-- CSS Dependencies -->
   <@link rel="stylesheet" type="text/css" href="${url.context}/res/loftux/components/manualmanager/manual.css" group="manualmanager"/>
   <@link rel="stylesheet" type="text/css" media="all" href="${url.context}/res/loftux/components/editors/pagedown/pagedown.css" group="manualmanager"/>
   <#-- Assign to different group, must render after pagedown.css-->
   <@link rel="stylesheet" type="text/css" media="print" href="${url.context}/res/loftux/components/manualmanager/manualprint.css" group="manualmanagerprint"/>
</@>

<@markup id="js">
   <#-- JavaScript Dependencies -->
	<@script type="text/javascript" src="${page.url.context}/res/loftux/components/editors/pagedown/Markdown.Converter.js" group="manualmanager" />
	<@script type="text/javascript" src="${page.url.context}/res/loftux/components/editors/pagedown/Markdown.Sanitizer.js" group="manualmanager" />
   <@script type="text/javascript" src="${page.url.context}/res/loftux/components/editors/pagedown/Markdown.Extra.js" group="manualmanager" />
   <@script type="text/javascript" src="${page.url.context}/res/loftux/components/manualmanager/manualprint.js" group="manualmanager" />
</@>

<@markup id="widgets">
   <@createWidgets group="manualmanager"/>
</@>

<@uniqueIdDiv>
   <@markup id="html">
   <#assign id=args.htmlid?html>
	<div id="${id}-body" class="manual-manager-body">
	   <div id="${id}-content" class="manual-manager-content"></div>
	</div>
   </@>
</@>
