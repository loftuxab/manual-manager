<#if field.control.params.rows??><#assign rows=field.control.params.rows><#else><#assign rows=8></#if>
<#if field.control.params.columns??><#assign columns=field.control.params.columns><#else><#assign columns=80></#if>

<#if form.capabilities?? && form.capabilities.javascript?? && form.capabilities.javascript == false><#assign jsDisabled=true><#else><#assign jsDisabled=false></#if>

<#-- NOTE: content properties are not shown at all in view mode -->

<#if form.mode != "view">
<div class="form-field" id="${fieldHtmlId}-field">
   <#if jsDisabled == false>
   <script type="text/javascript">//<![CDATA[
   (function()
   {
      new Loftux.PagedownContentControl("${fieldHtmlId}").setOptions(
      {
         <#if form.mode == "view" || (field.disabled && !(field.control.params.forceEditable?? && field.control.params.forceEditable == "true"))>disabled: true,</#if>
         currentValue: "${field.value?js_string}",
         mandatory: ${field.mandatory?string},
         formMode: "${form.mode}",
         <#if context.properties.nodeRef??>
         nodeRef: "${context.properties.nodeRef?js_string}",
         <#elseif form.mode == "edit" && args.itemId??>
         nodeRef: "${args.itemId?js_string}",
         <#else>
         nodeRef: "",
         </#if>
         <#if field.control.params.settingsfile??>settingsfile: "${field.control.params.settingsfile}",</#if>
         mimeType: "${(context.properties.mimeType!"")?js_string}"
         
      }).setMessages(
         ${messages}
      );
   })();
   //]]></script>
   </#if>

	<div class="yui-g">
		<div class="yui-u first">
	   		<label for="${fieldHtmlId}" style="text-align: left;">${field.label?html}:<#if field.mandatory><span class="mandatory-indicator">${msg("form.required.fields.marker")}</span></#if></label>
	        <div class="wmd-panel">
	            <div id="wmd-button-bar${fieldHtmlId}"></div>
	        <textarea id="${fieldHtmlId}" name="${field.name}" rows="${rows}" columns="${columns}" tabindex="0" class="wmd-input" 
	             <#if field.description??>title="${field.description?html}"</#if>
	             <#if field.control.params.style??>style="${field.control.params.style}"</#if>
	             <#if field.disabled && !(field.control.params.forceEditable?? && field.control.params.forceEditable == "true")>disabled="true"</#if>><#if jsDisabled>${field.content?html}</#if></textarea>
	        </div>	
		</div>
		<div class="yui-u">
			<div class="wmd-preview-label">${msg("label.preview")}:</div>
			<div id="wmd-preview${fieldHtmlId}" class="wmd-panel wmd-preview"></div>
			<div id="wmd-images${fieldHtmlId}" class="wmd-panel wmd-images"></div>
		</div>
	</div>        
</div>
</#if>