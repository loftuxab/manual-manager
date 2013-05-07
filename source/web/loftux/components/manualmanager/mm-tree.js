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
 
/**
 * Repository DocumentList TreeView component.
 * 
 * @namespace Alfresco
 * @class Alfresco.ManualManagerTree
 */
(function()
{
	if (typeof Loftux == "undefined" || !Loftux)
	{
		Loftux = {};
	}
	/**
    * Alfresco Slingshot aliases
    */
   var $html = Alfresco.util.encodeHTML,
      $combine = Alfresco.util.combinePaths;

   /**
    * Records DocumentList TreeView constructor.
    * 
    * @param {String} htmlId The HTML id of the parent element
    * @return {Alfresco.ManualManagerTree} The new ManualManagerTree instance
    * @constructor
    */
   Loftux.ManualManagerTree = function DLT_constructor(htmlId)
   {
      return Loftux.ManualManagerTree.superclass.constructor.call(this, htmlId);
   };
   
   YAHOO.extend(Loftux.ManualManagerTree, Alfresco.DocListTree,
   {
      /**
       * PRIVATE FUNCTIONS
       */

      /**
       * Build URI parameter string for treenode JSON data webscript
       *
       * @method _buildTreeNodeUrl
       * @param path {string} Path to query
       */
       _buildTreeNodeUrl: function DLT__buildTreeNodeUrl(path)
       {
          //This method overrides the default tree and retrieves a tree sorted by cm:title.
          var uriTemplate ="slingshot/doclib/mmtreenode/site/" + $combine(encodeURIComponent(this.options.siteId), encodeURIComponent(this.options.containerId), Alfresco.util.encodeURIPath(path));
          uriTemplate += "?perms=false&children=" + this.options.evaluateChildFolders + "&max=" + this.options.maximumFolderCount;
          return  Alfresco.constants.PROXY_URI + uriTemplate;
       }
   });
})();