<#macro listJSON list>
   <#escape x as jsonUtils.encodeJSONString(x)>
		{
			"nodeRef": "${list.nodeRef}",
			"name": "${list.name}"
		}
   </#escape>
</#macro>
<#escape x as jsonUtils.encodeJSONString(x)>
{
   "sorttopics":
   [
   <#list sorttopics as list>
      <@listJSON list /><#if list_has_next>,</#if>
   </#list>
   ]
}
</#escape>