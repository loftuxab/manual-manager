/**
 * Copyright (C) 2012-2013 Loftux AB
 *
 * This file is part of Manual Manager
 *
 * Manual Manager is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Manual Manager is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */

function getTemplate(container)
{

	var templateNode = container.childByNamePath('/template.md');
	if (templateNode)
	{

		return templateNode.content;
	}
	var baseTemplate = search.selectNodes('/app:company_home/app:dictionary/cm:Manual_x0020_Manager/cm:template.md');
	if (baseTemplate.length > 0)
	{
		// Check if we have write permission, then we can make a copy as the site
		// specific template
		if (container.hasPermission("CreateChildren"))
		{
			var newTemplate = baseTemplate[0].copy(container);
			return newTemplate.content;
		} else
		{
			// We do not have write permission, so return generic template content
			return msg.get('template.generic');
		}
	} else
	{
		// Check if we have write permission, then we can create a generic
		// template that manager can edit later
		if (container.hasPermission("CreateChildren"))
		{
			genericTemplate = container.createFile("template.md");
			genericTemplate.properties.content.content = msg.get('template.generic');
			genericTemplate.save();
			return genericTemplate.content;
		}
	}

	// If we get here, return generic as last resort.
	return msg.get('template.generic');
}

function main()
{
	var siteId = url.templateArgs.site;
	var containerId = url.templateArgs.container;
	var path = args["path"] ? args["path"] : "/";

	// Initiate model object
	model.data = {};

	// fetch site
	var site = siteService.getSite(siteId);
	if (site === null)
	{
		status.setCode(status.STATUS_NOT_FOUND, "Site not found: '" + siteId + "'");
		return null;
	}

	// fetch container
	var container = site.getContainer(containerId);
	if (container === null)
	{
		container = site.createContainer(containerId);
		if (container === null)
		{
			status.setCode(status.STATUS_NOT_FOUND, "Unable to fetch container '" + containerId + "' of site '" + siteId + "'. (No write permission?)");
			return null;
		}
	}

	// Store values we need for copy/move and other client side stuff
	model.data.rootNodeRef = container.nodeRef.toString();
	model.data.rootPath = container.displayPath;

	// try to fetch the the path is there is any
	if ((path !== null) && (path.length > 0) && (path !== "/"))
	{
		node = container.childByNamePath(path);
		if (node === null)
		{
			status.setCode(status.STATUS_NOT_FOUND, "No node found for the given path: \"" + path + "\" in container " + containerId + " of site " + siteId);
			return null;
		}
	} else
	{
		node = container;
	}

	// The folder (topic) nodeRef
	model.data.nodeRef = node.nodeRef.toString();
	model.data.topicPath = node.displayPath;
	// Parent
	model.data.parentNodeRef = node.parent.nodeRef.toString();

	var doc = node.childByNamePath("/index.md");
	if (doc)
	{
		model.data.content = doc.content;
	} else
	{
		doc = node.createFile("index.md");
		doc.properties.content.content = getTemplate(container);
		doc.save();
		model.data.content = doc.content;
	}

	// Sync description with parent name.
	// Used for search and display in history dialog
	if (doc.parent.properties.name !== doc.properties.title)
	{
		if (node.hasPermission("WriteProperties"))
		{
			doc.properties.title = doc.parent.properties.name;
			doc.save();
		}
	}

	if (!doc.hasAspect("cm:versionable"))
	{
		var vprops = new Array(2);
		vprops["cm:autoVersion"] = true;
		vprops["cm:autoVersionOnUpdateProps"] = false;
		doc.addAspect("cm:versionable",vprops);
	}

	model.data.documentNodeRef = doc.nodeRef.toString();

	// Push the permissions we need to know about
	var permissions = {
		"create" : node.hasPermission("CreateChildren"),
		"edit" : doc.hasPermission("Write"),
		"permissions" : node.hasPermission("ChangePermissions"),
		"delete" : node.hasPermission("Delete"),
	};

	model.data.permissions = permissions;

	// Get the template node
	templateNode = container.childByNamePath('/template.md');
	if (templateNode)
	{
		model.data.templateNodeRef = templateNode.nodeRef.toString();
		model.data.permissions.editTemplate = templateNode.hasPermission("Write");
	} else
	{
		model.data.templateNodeRef = "";
		model.data.permissions.editTemplate = false;
	}

	// Get related topics
	var related = node.parent.children, relatedA = [], subtopics = node.children, subtopicsA = [], nodename = node.properties.name + "";
	if ((related.length > 0) && (nodename !== "manual"))
	{

		for ( var i = 0; i < related.length; i++)
		{
			// We do not want the current node in the list
			if (related[i].isContainer && ((related[i].properties.name + "") !== nodename))
			{
				relatedA.push({
					path : related[i].displayPath.replace(model.data.rootPath + "/manual", ""),
					name : related[i].properties.name,
					sort : (related[i].properties.title) ? (related[i].properties.title) : "0"
				})
			}

		}

	}
	if (subtopics.length > 0)
	{

		for ( var i = 0; i < subtopics.length; i++)
		{
			if (subtopics[i].isContainer)
			{

				subtopicsA.push({
					path : subtopics[i].displayPath.replace(model.data.rootPath + "/manual", ""),
					name : subtopics[i].properties.name,
					sort : (subtopics[i].properties.title) ? (subtopics[i].properties.title) : "0"
				})
			}

		}

	}
	model.related = relatedA;
	model.subtopics = subtopicsA;
}

model.data = {};
model.data.permissions = {};
main();
