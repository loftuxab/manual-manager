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

var sorttopics = String(json.get("sorttopic"));
var topics = sorttopics.split(","), counter = 10, result = {
	status : "OK",
	description : ""
};

for ( var i = 0; i < topics.length; i++)
{

	var node = utils.getNodeFromString(topics[i]);
	if (node)
	{
		if (node.hasPermission("Write"))
		{
			node.properties.title = counter.toString();
			node.save();
		} else
		{
			result.status = "Error";
			result.description = "No write permission";
		}
		counter++;
	} else
	{
		result.status = "Error";
		result.description = "Node not found";
	}

}

model.result = result;
