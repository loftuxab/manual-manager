<div id="image-tab-view" class="yui-navset"> 
	<ul class="yui-nav"> 
		<li class="selected"><a href="#topic"><em>${msg("label.topic")}</em></a></li> 
		<li><a href="#actions"><em>${msg("label.actions")}</em></a></li> 
		<li><a href="#filetypes"><em>${msg("label.filetypes")}</em></a></li> 
	</ul>             
	<div class="yui-content"> 
		<div id="topic">
		<#if images.images?has_content>
			<#list images.images as image><div class="wmd-image-box"><div class="wmd-image-box-image">		
			<img src="${url.context}/proxy/alfresco/api/node/${image.nodeRef?replace("://", "/")}/content/thumbnails/doclib/${image.name?url}?c=force">
			</div><div class="wmd-image-box-actions">	
			<a href="#" onClick="event.preventDefault();YAHOO.Bubbling.fire('manualImageSelected', '${url.context}/proxy/alfresco/api/node/${image.nodeRef?replace("://", "/")}/content/thumbnails/avatar/${image.name?url}?c=force');"
				alt="Small 48px"><img class="wmd-image-selector" src="${url.context}/res/loftux/components/manualmanager/images/6.png"></a>
			<a href="#" onClick="event.preventDefault();YAHOO.Bubbling.fire('manualImageSelected', '${url.context}/proxy/alfresco/api/node/${image.nodeRef?replace("://", "/")}/content/thumbnails/doclib/${image.name?url}?c=force');" 
				alt="Medium 100px"><img class="wmd-image-selector" src="${url.context}/res/loftux/components/manualmanager/images/10.png"></a>
			<a href="#" onClick="event.preventDefault();YAHOO.Bubbling.fire('manualImageSelected', '${url.context}/proxy/alfresco/api/node/${image.nodeRef?replace("://", "/")}/content/thumbnails/imgpreview/${image.name?url}?c=force');" 
				alt="Large 480px"><img class="wmd-image-selector" alt="Large 480px" src="${url.context}/res/loftux/components/manualmanager/images/48.png"></a>
			<a href="#" onClick="event.preventDefault();YAHOO.Bubbling.fire('manualImageSelected', '${url.context}/proxy/alfresco/api/node/${image.nodeRef?replace("://", "/")}/content/${image.name?url}?c=force');" 
				alt="Original size"><img class="wmd-image-selector" src="${url.context}/res/loftux/components/manualmanager/images/100.png"></a>
			</div></div>
			</#list>
		<#else>
		<p>${msg("message.noimages")}</p><p>${msg("message.upload")}</p>
		</#if>
		</div> 
		<div id="actions">
		<#list actions as action>
			<a href="#" onClick="event.preventDefault();YAHOO.Bubbling.fire('manualImageSelected', '${url.context}/res/${action.path!""}');" alt="${action.name!""}"><img src="${url.context}/res/${action.path!""}"></a>
		</#list>		
		</div> 
		<div id="filetypes">
		<#list filetypes as filetype>
			<a href="#" onClick="event.preventDefault();YAHOO.Bubbling.fire('manualImageSelected', '${url.context}/res/${filetype.path!""}');" alt="${filetype.name!""}"><img src="${url.context}/res/${filetype.path!""}"></a>
		</#list>
		</div>
		<button id="image-tab-view-close" class="button-close-image-panel">${msg("label.close")}</button>
	</div> 
</div> 