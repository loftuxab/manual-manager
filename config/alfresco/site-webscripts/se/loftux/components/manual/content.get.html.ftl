<#assign id=args.htmlid?html>
<div id="${id}-body-toolbar" class="datalist-toolbar toolbar">
   <div id="${id}-headerBar" class="header-bar flat-button theme-bg-2">
      <div class="left">
      	<span class="content-path">${msg("label.path")}&nbsp;<span id="${id}-contentPath">&#62;<span>&nbsp;</span>
      </div>

      <div class="right">
        <div class="manual search-box">
         	<input id="${id}-searchText" type="text" maxlength="1024" />
      	</div>	
         <div class="selected-items">
            <button class="no-access-check" id="${id}-manual-actions-button" name="manual-actions-button">${msg("menu.manual-actions")}</button>
            <div id="${id}-manual-actions-menu" class="yuimenu">
               <div class="bd">
                  <ul>
                  <#list actionSet as action>
                     <li><a type="${action.asset!""}" rel="${action.permission!""}" href="${action.href}"><span class="${action.id}">${msg(action.label)}</span></a></li>
                  </#list>
                  </ul>
               </div>
            </div>
         </div>
      </div>
   </div>
</div>		

<div id="${id}-body" class="topic-list">
   <div id="${id}-search-result" class="manual-search yui-hidden"></div>
   <div id="${id}-search-result-paginator" class="manual-search-paginator yui-hidden"></div>
   <div id="${id}-content" class="topics"></div>
   <div id="${id}-version-buttons" class="version-buttons content-data">
   <button id="${id}-versionPrevious">
   	<img src="${url.context}/res/components/images/back-arrow.png" align="top" height="16"/>
      ${msg("button.previous")}
   </button>

   <button id="${id}-versionNext">
   	<img src="${url.context}/res/components/images/forward-arrow-16.png" align="top" height="16"/>
      ${msg("button.next")}
   </button>
   <button id="${id}-versionRevert">
   	<img src="${url.context}/res/components/images/revert-16.png" align="top" height="16"/>
      ${msg("button.revert")}
   </button>
   <button id="${id}-versionClose">
      ${msg("button.close")}
   </button>
   </div>
   <div id="${id}-version-properties" class="version-properties content-data"></div>
   <div id="${id}-version-content" class="version-content content-data"></div>
   <div id="${id}-paginator" class="paginator"></div>
</div>

<script type="text/javascript">//<![CDATA[
   new Loftux.ManualManager("${id?js_string}").setOptions(
   {
      siteId: "${page.url.templateArgs.site!""}",
   }).setMessages(
      ${messages}
   );
//]]></script>
