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
   
 
   var node = utils.getNodeFromString(nodeRef), images=[];
   if (!nodeRef)
      {
      status.setCode(status.STATUS_NOT_FOUND, "NodeRef not found");
      return null;
      }

   for each(child in node.children)
   {
      if(child.properties.content.mimetype.indexOf("image")>-1)
         {
            images.push({name:child.properties.name, nodeRef:child.nodeRef.toString()});
         }
   }
   model.images=images;
}

main();