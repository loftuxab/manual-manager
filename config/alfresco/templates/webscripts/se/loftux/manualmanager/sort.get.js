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

function main()
{
var nodeRef = args["nodeRef"] ? args["nodeRef"] : null;
   
  
   var node = utils.getNodeFromString(nodeRef), sorttopics=[];
   if (!nodeRef)
      {
      status.setCode(status.STATUS_NOT_FOUND, "NodeRef not found");
      return null;
      }

   for each(child in node.parent.children)
   {
      if(child.isContainer)
      {
      	sorttopics.push({name:child.properties.name, nodeRef:child.nodeRef.toString(), title:((child.properties.title+"")===""?"999":child.properties.title)});

      }
   }
	
   // Now sort the sort topics
	var sortSortable = function (a,b){
		  if (a.title < b.title)
		     return -1;
		  if (a.title > b.title)
		    return 1;
		  return 0;
	}
	sorttopics.sort(sortSortable);
	
   model.sorttopics=sorttopics;
}

main();