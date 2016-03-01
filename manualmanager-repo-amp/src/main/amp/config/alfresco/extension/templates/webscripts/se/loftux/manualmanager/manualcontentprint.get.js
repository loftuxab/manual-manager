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

//Use java for better formatting 
var sdf = Packages.java.text.SimpleDateFormat(msg.get('date_time_pattern'));

function getContent(node)
{

	var doc = node.childByNamePath("/index.md"), currentcontent = "";

	// First add the name +hr. Must begin with rowbreak, else formatting breaks
	// if recursive

	// Do not include the name manual from root, makes no sense
	if (node.name + "" !== "manual")
	{
		currentcontent += '\n# ' + node.name + '  \n\n----\n\n'
	}

	if (doc)
	{
		currentcontent += doc.content;
		currentcontent += '\n\n----\n\n<sup>**' + msg.get('created') + '** ' + doc.properties["cm:creator"] + ' ' + sdf.format(doc.properties["cm:created"])
				+ ' | **' + msg.get('edited') + '** ' + doc.properties["cm:modifier"] + ' ' + sdf.format(doc.properties["cm:modified"]) +
		' | **' + msg.get('version') + '** ' + doc.properties["cm:versionLabel"] + '</sup>  \n\n----\n';

	} else
	{
		currentcontent += '  \n\n----\n';
		currentcontent += '>Error finding content';
	}
	
	//Fix numbering for links, else document overwrite each others links
	var docid = node.properties["sys:node-dbid"];
	currentcontent = currentcontent.replace(/\[([0-9]*?)\]\:/g, function ($0,$1){
	   
	   return "["+ docid +$1+ "]:";
	})
   currentcontent = currentcontent.replace(/\]\[([0-9]*?)\]/g, function ($0,$1){
      
      return "]["+ docid +$1+ "]";
   })
   
	return currentcontent;
}

function recurse(scriptNode)
{

	// Sort the sort topics
	var sortChildren = function(a, b)
	{
		if (a.properties.title < b.properties.title)
		{
			return -1;
		}
		if (a.properties.title > b.properties.title)
		{
			return 1;
		}
		return 0;
	}

	var recurseInternal = function(scriptNode)
	{
		var children = [];

		for (c in scriptNode.children)
		{
			var child = scriptNode.children[c];

			if (child.isContainer)
			{
				children.push(child);
			}
		}

		// Sort the array of children to custom set sort.
		children.sort(sortChildren);
		for (c in children)
		{
			var child = children[c];

			content += getContent(child);
			recurseInternal(child);

		}
	}

	recurseInternal(scriptNode);

}

function main()
{

	var nodeRef = args["nodeRef"] ? args["nodeRef"] : null, recursenodes = (args["recurse"] === "true") ? true : false;

	var node = utils.getNodeFromString(nodeRef);
	if (!nodeRef)
	{
		model.data.content = '>Could not find node';
		return null;
	}

	content += getContent(node);
	if (recursenodes)
	{
		recurse(node);
	}

}

var content = "";
model.data = {};

main();

model.data.content = content;