<#macro relatedJson list>
   <#escape x as jsonUtils.encodeJSONString(x)>
		{
			"path": "${list.path}",
			"name": "${list.name}"
		}
   </#escape>
</#macro>

<#escape x as jsonUtils.encodeJSONString(x)>
{ 
"data":
[{
	"nodeRef": "${data.nodeRef!""}",
	"documentNodeRef": "${data.documentNodeRef!""}",
	"parentNodeRef": "${data.parentNodeRef!""}",
	"templateNodeRef": "${data.templateNodeRef!""}",
	"rootNodeRef": "${data.rootNodeRef!""}",
	"rootPath": "${data.rootPath!""}",
	"topicPath": "${data.topicPath!""}",
	"content": "${data.content!""}",
	"permissions":
	{
		"edit": "${data.permissions.edit?string!""}",
		"editTemplate": "${data.permissions.editTemplate?string!""}",
		"create": "${data.permissions.create?string!""}",
		"deleteNode": "${data.permissions.delete?string!""}",
		"permissions": "${data.permissions.permissions?string!""}"
	},
	"related":
	[
	<#list related?sort_by("sort") as list>
	<@relatedJson list /><#if list_has_next>,</#if>
	</#list>
	],
	"subtopics":
	[
	<#list subtopics?sort_by("sort") as list>
	<@relatedJson list /><#if list_has_next>,</#if>
	</#list>
	]
}],
"paging": 
{
	"totalItems": 1,
    "maxItems": 100,
    "skipCount": 0
}
}
</#escape>