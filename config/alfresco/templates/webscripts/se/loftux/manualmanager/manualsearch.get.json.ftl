<#macro renderlist listitems><#list listitems as listitem>${listitem}<#if listitem_has_next> </#if></#list></#macro>
<#macro dateFormat date>${date?string("yyyy-MM-dd")}</#macro>
<#macro renderItem item>
<#escape x as jsonUtils.encodeJSONString(x)>
		{
			"path": "${item.path}",
			"content": "${item.content}"
		}
</#escape>
</#macro>
<#escape x as jsonUtils.encodeJSONString(x)>
{ 
"data":
	[
	<#if data??>
	<#list data as item><@renderItem item /><#if item_has_next>,</#if></#list>
	</#if>
	],
"paging": 
	{
		"totalItems": ${length},
		"maxItems": ${maxItems},
		"skipCount": ${skipCount}
	}
}
</#escape>