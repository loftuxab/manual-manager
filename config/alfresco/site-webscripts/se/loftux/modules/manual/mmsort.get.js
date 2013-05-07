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

function loadTopics()
{
   var nodeRef = args["nodeRef"] ? args["nodeRef"] : null,
         connector = remote.connect("alfresco");
   
   if(nodeRef){
      
      // Load constraints
      result = connector.get("/loftux/manual/sort?nodeRef="+nodeRef);

      if (result.status == 200)
      {
         model.sorttopics  = eval('(' + result + ')');
      }
      
   }

}

loadTopics();