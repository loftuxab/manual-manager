<#macro renderListItem item>

			          <li class="sorttopicitem">
			          	<input type="hidden" name="sorttopicitem" value="${item.nodeRef}"/>
	           			<a href="#"><img class="dnd-draggable" src="${url.context}/res/yui/assets/skins/default/transparent.gif" alt="" /></a>
	           			<span>${item.name?html}</span>
	           			<div class="dnd-draggable" title="${item.name?html}"></div>
			          </li>		         
</#macro>
<div id="${args.htmlid}-sortDialog" class="sort-manual-manager">
	<div class="hd">${msg("label.topics")}:</div>
	<div class="bd">
		<form id="${args.htmlid}-form" action="" method="POST">
			<div id="searcher">
				<input type="hidden" id="${args.htmlid}-sorttopic" name="sorttopic" value="xxx"/>
				<div id="${args.htmlid}-sorttopic" class="yui-u first" >
					<div class="sorttextlabel">${msg("label.sort.intructions")}</div>
						<ul id="${args.htmlid}-sorttopic-ul" class="sorttopicList">
						<#list sorttopics.sorttopics as item>	
						<@renderListItem item />
						</#list>
						</ul>
					</div>
				</div>
				<div class="bdft">
					<input type="submit" id="${args.htmlid}-ok" value="${msg("button.ok")}" />
					<input type="button" id="${args.htmlid}-cancel" value="${msg("button.cancel")}" />
				</div>
			</div>
		</form>
	</div>
</div>