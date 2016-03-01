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

var q = args["q"] ? args["q"] : "";
var maxItems = (args.maxItems !== null) ? parseInt(args.maxItems, 10) : 50;
var skipCount = (args.skipCount !== null) ? parseInt(args.skipCount, 10) : 0;
var nodesLength = 0;

/**
 * Fetches all maintenance posts
 */
function getSearch()
{

	var siteId = url.templateArgs.site, basePath;

	// fetch site
	var site = siteService.getSite(siteId);
	if (site === null)
	{
		status.setCode(status.STATUS_NOT_FOUND, "Site not found: '" + siteId + "'");
		return null;
	}

	var node = site.getContainer("manual");
	if (node === null)
	{
		node = site.createContainer("manual");
		if (node === null)
		{
			status.setCode(status.STATUS_NOT_FOUND, "Unable to fetch container '" + containerId + "' of site '" + siteId + "'. (No write permission?)");
			return null;
		}
	}

	basePath = node.displayPath + "/manual";

	// PATH:"//cm:loftux/cm:manual//*" AND @cm:name:index.md AND ALL:"peter"
	// PATH:"//cm:loftux/cm:manual//*" AND ((@cm:name:index.md AND TEXT:"peter")
	// OR (@cm:name:"peter"))

	var query = 'PATH:"//cm:' + siteId + '/cm:manual//*" AND ((@cm:name:index.md AND TEXT:"' + q + '") OR (@cm:name:index.md AND @cm:title:"' + q + '"))';

	// var sort=
	// {
	// column: "cm:name",
	// ascending: dirasc
	// };

	var page = {
		maxItems : 50,
		skipCount : skipCount
	};

	var searchdef = {
		query : query,
		// sort: [sort],
		page : page,
		language : "fts-alfresco"
	};

	var nodes = search.query(searchdef);
	if (logger.isLoggingEnabled())
	{
		logger.log("LX Manual Query: " + query);
		// logger.log("LX sort: " + sortcolumn+ " "+direction);
		logger.log("LX Length " + nodes.length);
		logger.log("LX maxItems " + maxItems);
		logger.log("LX skipCount " + skipCount);
		logger.log("LX basePath " + basePath);
	}

	// Set the actual nodesLength
	nodesLength = nodes.length + skipCount;

	// max sure we only return the expected number of hits
	var maxNodes = [], currentnode, content, contentresult;
	for ( var i = 0; (i < maxItems) && (i < nodes.length); i++)
	{

		if (nodes[i].isContainer)
		{
			// We got a hit on name, but what we want is the content
			currentnode = nodes[i].childByNamePath("/index.md");
		} else
		{
			currentnode = nodes[i];
		}
		if (currentnode)
		{
			// Get the content first 300 char + image declarations in end
			// Ned to find better algorithm for that
			content = currentnode.content + "";
			contentresult = content.substr(0, 300);

			if (content.length > 300)
			{
				// Add some breaks before, else it may not be parsed by markdown
				if (content.indexOf("\]:") > 300)
				{
					contentresult += '  \n\n' + content.substring(content.indexOf("\]:") - 4);
				}

			}

			// Add the node data
			maxNodes.push({
				path : currentnode.displayPath.replace(basePath, ""),
				content : contentresult
			});
		}

	}

	return maxNodes;
}

model.data = getSearch();
// model.length = 50;
model.length = nodesLength;
model.maxItems = maxItems;
model.skipCount = skipCount;