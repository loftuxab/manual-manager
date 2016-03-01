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

function setActionSet()
{
   // Actions
   var myConfig = new XML(config.script),
      xmlActionSet = myConfig.actionSet,
      actionSet = [];
   
   for each (var xmlAction in xmlActionSet.action)
   {
      actionSet.push(
      {
         id: xmlAction.@id.toString(),
         type: xmlAction.@type.toString(),
         permission: xmlAction.@permission.toString(),
         asset: xmlAction.@asset.toString(),
         href: xmlAction.@href.toString(),
         label: xmlAction.@label.toString()
      });
   }
   
   model.actionSet = actionSet;
}

function widgets()
{
   var ManualManager = {
      id : "ManualManager", 
      name : "Loftux.ManualManager",
      options : {
         siteId : (page.url.templateArgs.site != null) ? page.url.templateArgs.site : ""
      }
   };
   model.widgets = [ManualManager];
}

widgets();

setActionSet();