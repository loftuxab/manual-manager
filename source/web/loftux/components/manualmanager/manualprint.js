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
 * Manual Content component.
 * 
 * Displays manual content.
 * 
 * @namespace Loftux
 * @class Loftux.ManualManagerPrint
 */

(function()
{
	
	if (typeof Loftux == "undefined" || !Loftux)
	{
		Loftux = {};
	}


	/**
	 * YUI Library aliases
	 */
	var Dom = YAHOO.util.Dom, $html = Alfresco.util.encodeHTML, Event = YAHOO.util.Event;

	/**
	 * CommentList constructor.
	 * 
	 * @param {String}
	 *           htmlId The HTML id of the parent element
	 * @return {Alfresco.CommentList} The new Comment instance
	 * @constructor
	 */
	Loftux.ManualManagerPrint = function MMPrint_ManualManagerPrint(htmlId)
	{
		Loftux.ManualManagerPrint.superclass.constructor.call(this, "Loftux.ManualManagerPrint", htmlId, [ "button", "menu",
				"datasource", "datatable", "paginator", "json" ]);

		return this;
	};

	YAHOO.extend(Loftux.ManualManagerPrint, Alfresco.component.Base);

	YAHOO.lang.augmentObject(Loftux.ManualManagerPrint.prototype, {
		/**
		 * Object container for initialization options
		 * 
		 * @property options
		 * @type object
		 */
		options : {
			/**
			 * Holds the value for current folder
			 */
			nodeRef : null,
			
			/**
			 * Should we include subtopics
			 */
			recurse : "false"

		},

		/**
		 * Fired by YUI when parent element is available for scripting. Component
		 * initialisation, including instantiation of YUI widgets and event
		 * listener binding.
		 * 
		 * @method onReady
		 */
		onReady : function ManualManagerPrint_onReady()
		{

			// Create Markdown converter instance
			this.widgets.Markdown = Markdown.getSanitizingConverter();

			var url = Alfresco.constants.PROXY_URI + 'loftux/manual/print?nodeRef='+this.options.nodeRef+'&recurse='+this.options.recurse;
			this.widgets.pagingDataTable = new Alfresco.util.DataTable({
				dataTable : {
					container : this.id + "-content",
					columnDefinitions : [ {
						key : "nodeRef",
						label : "",
						sortable : false,
						formatter : this.bind(this.renderContent)
					} ],
					config : {
						MSG_EMPTY : this.msg("message.noTasks"),
						responseType : YAHOO.util.DataSource.TYPE_JSARRAY,
						responseSchema : {
							resultsList : "data",
							fields : [ "nodeRef", "content" ]
						}

					}
				},
				dataSource : {
					url : url
				}
			});
		},
		renderContent : function ManualManagerPrint_renderContent(elCell, oRecord, oColumn, oData)
		{

			var content = '<div class="wmd-preview">' + this.widgets.Markdown.makeHtml(oRecord.getData("content")) + '</div>';

			elCell.innerHTML = content;

		}

	});
})();
