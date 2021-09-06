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
 * @class Loftux.ManualManager
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
	Loftux.ManualManager = function MM_ManualManager(htmlId)
	{
		Loftux.ManualManager.superclass.constructor.call(this, "Loftux.ManualManager", htmlId, [ "button", "menu", "datasource",
		                                                                                                                 "datatable", "paginator", "json", "history", "tabview" ]);

		/* Decoupled event listeners */
		YAHOO.Bubbling.on("changeFilter", this.onChangeFilter, this);
		YAHOO.Bubbling.on("MMchangeFilter", this.onMMchangeFilter, this);
		// Pagedown event
		YAHOO.Bubbling.on("pageDownInitialized", this.onPagedownEditorInit, this);
		YAHOO.Bubbling.on("manualImageSelected", this.onActionSelectImage, this);
		YAHOO.Bubbling.on("filesMoved", this.onFilesMovedCopied, this);
		YAHOO.Bubbling.on("filesCopied", this.onFilesMovedCopied, this);
		// YAHOO.Bubbling.on("folderDeleted", this.onFolderDeleted, this);
		return this;
	};

	YAHOO.extend(Loftux.ManualManager, Alfresco.component.Base);

	YAHOO.lang
	.augmentObject(
			Loftux.ManualManager.prototype,
			{
				/**
				 * Object container for initialization options
				 * 
				 * @property options
				 * @type object
				 */
				options : {
					/**
					 * Current siteId.
					 * 
					 * @property siteId
					 * @type string
					 */
					siteId : "",

					/**
					 * Instruction show to resolve filter id & data to url
					 * parameters
					 * 
					 * @property filterParameters
					 * @type Array
					 * @default []
					 */
					filterParameters : [],

					/**
					 * Holds the value for current folder
					 */
					nodeRef : null,

					/**
					 * Holds the value for index.html
					 */
					documentNodeRef : ""

				},

				/**
				 * Fired by YUI when parent element is available for
				 * scripting. Component initialisation, including
				 * instantiation of YUI widgets and event listener binding.
				 * 
				 * @method onReady
				 */
				onReady : function ManualManager_onReady()
				{
					// If we have a current filter on first call, update
					// path markup
					var filterstate = YAHOO.util.History.getBookmarkedState("filter");
					if (filterstate)
					{
						var filterpath = filterstate.split("|");
						this.renderPath(filterpath[1]);
					}

					Event.addListener(this.id + "-edit-button", "click", this.onMMContentEdit, this, true);

					// Topics menu button
					this.widgets.manualActions = Alfresco.util.createYUIButton(this, "manual-actions-button", this.onManualActions, {
						type : "menu",
						menu : "manual-actions-menu",
						lazyloadmenu : false,
						disabled : false
					});

					// Configure search box
					this.configureSearch();

					// Make the toolbar visible
					Dom.setStyle(this.id + "-body-toolbar", "visibility", "visible");

					// Create Markdown converter instance
					this.widgets.Markdown = Markdown.getSanitizingConverter();
               // Init the extra markdown syntax support
               Markdown.Extra.init(this.widgets.Markdown);

					var url = Alfresco.constants.PROXY_URI + "loftux/manual/site/" + this.options.siteId + "/manual";
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
								MSG_EMPTY : this.msg("label.message.nocontent"),
								responseType : YAHOO.util.DataSource.TYPE_JSARRAY,
								responseSchema : {
									resultsList : "data",
									fields : [ "nodeRef", "content" ]
								}

							}
						},
						dataSource : {
							url : url,
							defaultFilter : {
								filterId : "path"
							},
							filterResolver : this.bind(function(filter)
									{
								var filterurl = "";
								if (filter && filter.filterData)
								{
									filterurl = "path=" + encodeURIComponent(filter.filterData);
								}
								return filterurl;
									})
						},
						paginator : {
							config : {
								containers : [ this.id + "-paginator" ]
							}
						}
					});

					// Drag and drop support
					// Detect whether or not HTML5 drag and drop is
					// supported...
					this.dragAndDropEnabled = this.dragAndDropAllowed && ('draggable' in document.createElement('span')) && YAHOO.env.ua.mobile === null;

					// Feature detection for drag and drop support (by not
					// attempting to attach the drag events
					// to anything we can prevent attempted uploads happening -
					// this is particularly important
					// with IE8 which would otherwise render the highlights,
					// but not process the upload).
					if (this.dragAndDropEnabled)
					{
						// Disable drop for the document body (we're then going
						// to do a specific override on the DocumentList nodes)
						Event.addListener(document.body, "dragenter", this._swallowDragEnter, this, true);
						Event.addListener(document.body, "dragover", this._swallowDragOver, this, true);
						Event.addListener(document.body, "drop", this._swallowDragDrop, this, true);
						Event.addListener(document.body, "dragstart", this._swallowDragStart, this, true);
					}
				},

				renderContent : function ManualManager_renderContent(elCell, oRecord, oColumn, oData)
				{
					// Attach an eventlistener to handle session timeout
					// but only first time around. Could not find better place
					// to attach it.
					if (!this.widgets.pagingDataTable.errorSubscribed)
					{
						this.widgets.pagingDataTable.widgets.dataSource.subscribe("dataErrorEvent", function(oResponse)
								{
							if (oResponse.response.status === 401)
							{
								// Unauthenticated, force reload
								window.location.reload();
							}
								});
						this.widgets.pagingDataTable.errorSubscribed = true;
					}
					var content = "", related, subtopics, path;
					this.options.nodeRef = oRecord.getData("nodeRef");
					this.options.documentNodeRef = oRecord.getData("documentNodeRef");
					this.options.templateNodeRef = oRecord.getData("templateNodeRef");
					this.options.parentNodeRef = oRecord.getData("parentNodeRef");
					this.options.rootNodeRef = oRecord.getData("rootNodeRef");
					this.options.rootPath = oRecord.getData("rootPath");
					this.options.topicPath = oRecord.getData("topicPath");

					content += '<div class="wmd-preview">' + this.widgets.Markdown.makeHtml(oRecord.getData("content")) + '</div><hr>';
					subtopics = oRecord.getData("subtopics");
					content += '<div class="yui-g"><div class="yui-u first">'
						if (subtopics.length > 0)
						{
							content += '<div class="set"><div class="set-bordered-panelLink"><div class="set-bordered-panelLink-heading">'
								+ this.msg("label.topic.subtopics") + '</div><div class="set-bordered-panelLink-body"><p>';

							for ( var i = 0; i < subtopics.length; i++)
							{
								path = this._encodeFilter('|' + subtopics[i].path + '/' + subtopics[i].name);
								content += '<a onClick="YAHOO.Bubbling.fire(\'MMchangeFilter\',\'' + subtopics[i].path + '/' + subtopics[i].name
								+ '\');" class="manualLink subtopic" href="#filter=path' + path + '"><span>' + subtopics[i].name + '</span></a>';
							}
							content += '</p></div></div></div>';
						}
					// Close yui grid
					content += '</div><div class="yui-u">'
						related = oRecord.getData("related");
					if (related.length > 0)
					{
						content += '<div class="set"><div class="set-bordered-panelLink"><div class="set-bordered-panelLink-heading">'
							+ this.msg("label.topic.related") + '</div><div class="set-bordered-panelLink-body"><p>';
						for ( var i = 0; i < related.length; i++)
						{
							path = this._encodeFilter('|' + related[i].path + '/' + related[i].name);

							content += '<a onClick="YAHOO.Bubbling.fire(\'MMchangeFilter\',\'' + related[i].path + '/' + related[i].name
							+ '\');" class="manualLink related" href="#filter=path' + path + '"><span>' + related[i].name + '</span></a>';
						}
						content += '</p></div></div></div>';
					}
					// Close yui grid
					content += '</div></div>'
						elCell.innerHTML = content;

					// Set up menu permissions

					var isRoot = (this.options.rootPath === this.options.topicPath) ? true : false;
					this.permissions = oRecord.getData("permissions");
					var oMenu = this.widgets.manualActions.getMenu();

					var menuitems = oMenu.getItems(), action, actionitem;
					for ( var i = 0; i < menuitems.length; i++)
					{
						// Enable all to begin with
						menuitems[i].cfg.setProperty("disabled", false);
						// var action =
						// Dom.getAttribute(menuitems[i].cfg.config.text.value,
						// 'class');
						if(YAHOO.env.ua.ie > 0 && YAHOO.env.ua.ie < 9)
                  {
                     //Ie returns value without quotes
                     action = menuitems[i].cfg.config.text.value
                     actionitem = action.substring(action.indexOf('=')+1, action.indexOf('>'));

                  }else
                  {
                     action = menuitems[i].cfg.config.text.value.match(/"(.*?)"/);
                     actionitem = action[1];
                  }
                  switch (actionitem)
						{

						case "onActionEdit":
							if (this.permissions.edit === "false")
							{
								menuitems[i].cfg.setProperty("disabled", true);
							}
							break;
						case "onActionEditTemplate":
							if (!isRoot || this.permissions.editTemplate === "false")
							{
								menuitems[i].cfg.setProperty("disabled", true);
							}
							break;
						case "onEditTopic":
							if (isRoot)
							{
								menuitems[i].cfg.setProperty("disabled", true);
							} else if (this.permissions.edit === "false")
							{
								menuitems[i].cfg.setProperty("disabled", true);
							}
							break;
						case "onNewTopic":
							if (this.permissions.create === "false")
							{
								menuitems[i].cfg.setProperty("disabled", true);
							}
							break;
						case "onFileUpload":
							if (this.permissions.create === "false")
							{
								menuitems[i].cfg.setProperty("disabled", true);
							}
							break;
						case "onActionCopyTo":
							if (isRoot)
							{
								menuitems[i].cfg.setProperty("disabled", true);
							} else if (this.permissions.edit === "false")
							{
								menuitems[i].cfg.setProperty("disabled", true);
							}
							break;
						case "onActionSort":
							if (isRoot)
							{
								menuitems[i].cfg.setProperty("disabled", true);
							} else if (this.permissions.edit === "false")
							{
								menuitems[i].cfg.setProperty("disabled", true);
							}
							break;
						case "onActionMoveTo":
							if (isRoot)
							{
								menuitems[i].cfg.setProperty("disabled", true);
							} else if (this.permissions.deleteNode === "false")
							{
								menuitems[i].cfg.setProperty("disabled", true);
							}
							break;
						case "onActionDelete":
							if (isRoot)
							{
								menuitems[i].cfg.setProperty("disabled", true);
							} else if (this.permissions.deleteNode === "false")
							{
								menuitems[i].cfg.setProperty("disabled", true);
							}
							break;
						case "onActionVersions":
							if (this.permissions.edit === "false")
							{
								menuitems[i].cfg.setProperty("disabled", true);
							}
							break;
						case "onActionPermissions":
							if (isRoot)
							{
								menuitems[i].cfg.setProperty("disabled", true);
							} else if (this.permissions.permissions === "false")
							{
								menuitems[i].cfg.setProperty("disabled", true);
							}
							break;
						case "onActionPrint":
							// Print permissions always available
							break;
                  case "onActionPresentation":
                     // Print permissions always available, unless ie <9
                     if(YAHOO.env.ua.ie > 0 && YAHOO.env.ua.ie < 9)
                     {
                        menuitems[i].cfg.setProperty("disabled", true);
                     }
                     break;
						}
					}

				},
				onChangeFilter : function ManualManager_onChangeFilter(layer, args)
				{
					var filter = Alfresco.util.cleanBubblingObject(args[1]);
					if (filter && filter.filterData)
					{
						this.renderPath(filter.filterData);
					}

				},
				onMMchangeFilter : function MM_onChangeFilter(layer, args)
				{
					var filter = args[1];
					if (filter)
					{
						this.renderPath(filter);
					}

				},
				onManualActions : function ManualManager_onManualActions(sType, aArgs, p_obj)
				{
					// Permission check code goes here NOT
					var domEvent = aArgs[0], eventTarget = aArgs[1];

					// Get the function related to the clicked item
					var fn = Alfresco.util.findEventClass(eventTarget);
					if (fn && (typeof this[fn] == "function"))
					{
						this[fn].call(this);
					}

					Event.preventDefault(domEvent);
				},

				onActionPrint : function MM_onActionPrint(p_obj)
				{
					var url = Alfresco.constants.URL_PAGECONTEXT + 'manualprint?nodeRef=' + this.options.nodeRef, windowsettings = 'toolbar=yes,location=yes,directories=yes,status=yes,menubar=yes,scrollbars=yes,copyhistory=yes,resizable=yes';

					Alfresco.util.PopupManager.displayPrompt({
						text : this.msg("message.confirm.print"),
						buttons : [ {
							text : this.msg("button.printcurrent"),
							handler : function Wiki_submit_forceSave()
						{
								window.open(url, this.id, windowsettings)
								// Set the "force save" flag and re-submit
								this.destroy();
						},
						isDefault : true
						}, {
							text : this.msg("button.printall"),
							handler : function Wiki_submit_forceSave()
						{
								window.open(url + '&recurse=true', this.id, windowsettings)
								// Set the "force save" flag and re-submit
								this.destroy();
						}
						}, {
							text : this.msg("button.cancel"),
							handler : function Wiki_submit_cancel()
						{
								this.destroy();
						}
						} ]
					});

				},
				
				onActionPresentation : function MM_onActionPresentation(p_obj)
				{

		         Alfresco.util.Ajax.request({
                  method: "GET",
                  url: Alfresco.constants.URL_SERVICECONTEXT + '/modules/manual/presentationsetup?htmlid='+this.id+'-presentationsetup',
                  successCallback: 
                  { 
                     fn: function(response){
                        

                        var config = {
                           url : Alfresco.constants.URL_SERVICECONTEXT + '/modules/manual/presentationsetup',
                           title : this.msg("menu.presentation"),
                           html : response.serverResponse.responseText,
                           initialShow : false,
                           callback:
                           {
                              fn: this._onActionPresentation,
                              scope: this,
                              obj: this
                           }
                           
                        };
                        
                        this.presentationSettings = Alfresco.util.PopupManager.getUserInput(config);
                        
                        if (this.presentationSettings.getButtons().length > 0)
                        {
                           // Alfresco disables ok button, enable it
                           var okButton = this.presentationSettings.getButtons()[0];
                           YAHOO.util.Event.removeListener(okButton, "keyup");
                           okButton.set("disabled", false);
                        }
                        
                        this.presentationSettings.show();
                     }, 
                     scope: this 
                  }
               });

				},

	          _onActionPresentation : function MM__onActionPresentation(p_obj)
            {
	            var form = this.presentationSettings.innerElement, recurse = false, theme = 'default', transition = 'default';
	            
	            var inputs = form.getElementsByTagName('input');
	            var selects = form.getElementsByTagName('select');
	            for(i=0; i < inputs.length;i++)
	            {
	               if(inputs[i].id === this.id+'-presentationsetup-recurse')
	               {
	                  recurse = inputs[i].checked;
	               }
	            }
               for(i=0; i < selects.length;i++)
               {
                  if(selects[i].id === this.id+'-presentationsetup-theme')
                  {
                     theme = selects[i].value;
                     
                  }else if(selects[i].id === this.id+'-presentationsetup-transition')
                  {
                     transition = selects[i].value;
                  }
               }
               
               var url = Alfresco.constants.URL_PAGECONTEXT + 'manualpresentation?nodeRef=' + this.options.nodeRef, 
               windowsettings = 'toolbar=yes,location=yes,directories=yes,status=yes,menubar=yes,scrollbars=yes,copyhistory=yes,resizable=yes';
               if(theme !== 'default')
               {
                  url += '&theme=' + theme;
               }
               if(transition !== 'default')
               {
                  url += '&transition=' + transition;
               }
               window.open(url + '&recurse=true', this.id+'presentation', windowsettings)
	            
            },
            
				onActionPermissions : function dlA_onActionPermissions(p_obj)
				{
					if (!this.modules.permissions)
					{
						this.modules.permissions = new Alfresco.module.DoclibPermissions(this.id + "-permissions");
					}

					Alfresco.util.Ajax.jsonGet({
						url : Alfresco.constants.PROXY_URI + "slingshot/doclib/node/" + this.options.nodeRef.replace("://", "/"),
						successCallback : {
							fn : function(response)
							{
								var file = {
										node : response.json.item
								};
								this.modules.permissions.setOptions({
									siteId : this.options.siteId,
									containerId : "manual",
									path : this.options.topicPath,
									files : file
								}).showDialog();
							},
							scope : this
						}
					});

				},

				onActionEdit : function MM_onActionEdit(p_pbj)
				{
					this._onActionEditNode(this.options.documentNodeRef);
				},

				onActionEditTemplate : function MM_onActionEditTemplate(p_pbj)
				{
					this._onActionEditNode(this.options.templateNodeRef);
				},

				_onActionEditNode : function MM_onActionEditNode(nodeRef)
				{

					var me = this;

					// Intercept before dialog show
					var doBeforeDialogShow = function dlA_onActionDetails_doBeforeDialogShow(p_form, p_dialog)
					{
						// Dialog title
						var fileSpan = '<span class="light">' + $html("TEST") + '</span>';

						Alfresco.util.populateHTML([ p_dialog.id + "-dialogTitle", me.msg("TEST") ]);

					};

					var templateUrl = YAHOO.lang
					.substitute(
							Alfresco.constants.URL_SERVICECONTEXT
							+ "components/form?itemKind={itemKind}&itemId={itemId}&mode={mode}&submitType={submitType}&formId={formId}&showCancelButton=true",
							{
								itemKind : "node",
								itemId : nodeRef,
								mode : "edit",
								submitType : "json",
								formId : "manual-inline-edit"
							});

					// Using Forms Service, so always create new instance
					var editDetails = new Alfresco.module.SimpleDialog(this.id + "-editDetails-" + Alfresco.util.generateDomId()), viewwidth = Dom
					.getViewportWidth() * 0.95;

					// Resize so dialog is not to small or big
					viewwidth = (viewwidth > 1024) ? viewwidth : 1024;
					viewwidth = (viewwidth > 1500) ? 1500 : viewwidth;

					editDetails.setOptions({
						width : viewwidth.toString() + "px",
						templateUrl : templateUrl,
						actionUrl : null,
						destroyOnHide : true,
						doBeforeDialogShow : {
							fn : doBeforeDialogShow,
							scope : this
						},
						onSuccess : {
							fn : function dlA_onActionDetails_success(response)
						{
								// Reload data
								this.widgets.pagingDataTable.reloadDataTable();
						},
						scope : this
						},
						onFailure : {
							fn : function dLA_onActionDetails_failure(response)
						{
								Alfresco.util.PopupManager.displayMessage({
									text : this.msg("message.details.failure")
								});
						},
						scope : this
						}
					}).show();

				},

				onNewTopic : function MM_onNewTopic(e, p_obj)
				{
					var templateUrl = YAHOO.lang
					.substitute(
							Alfresco.constants.URL_SERVICECONTEXT
							+ "components/form?itemKind={itemKind}&itemId={itemId}&destination={destination}&mode={mode}&submitType={submitType}&formId={formId}&showCancelButton=true",
							{
								itemKind : "type",
								itemId : "cm:folder",
								destination : this.options.nodeRef,
								mode : "create",
								submitType : "json",
								formId : "manual-folder-create"
							});

					this._onTopic(templateUrl, "create");
				},

				onEditTopic : function MM_onNewTopic(e, p_obj)
				{
					var templateUrl = YAHOO.lang
					.substitute(
							Alfresco.constants.URL_SERVICECONTEXT
							+ "components/form?itemKind={itemKind}&itemId={itemId}&mode={mode}&submitType={submitType}&formId={formId}&showCancelButton=true",
							{
								itemKind : "node",
								itemId : this.options.nodeRef,
								mode : "edit",
								submitType : "json",
								formId : "manual-folder-edit"
							});

					this._onTopic(templateUrl, "edit");
				},

				_onTopic : function MM_onTopic(templateUrl, mode)
				{

					// Intercept before dialog show
					var doBeforeDialogShow = function DLTB_onNewFolder_doBeforeDialogShow(p_form, p_dialog)
					{
						Dom.get(p_dialog.id + "-dialogTitle").innerHTML = this.msg("label.topic.title." + mode);
						Dom.get(p_dialog.id + "-dialogHeader").innerHTML = "";
					};

					// Using Forms Service, so always create new instance
					var createFolder = new Alfresco.module.SimpleDialog(this.id + "-createFolder");

					createFolder.setOptions({
						width : "33em",
						templateUrl : templateUrl,
						actionUrl : null,
						destroyOnHide : true,
						doBeforeDialogShow : {
							fn : doBeforeDialogShow,
							scope : this
						},
						onSuccess : {
							fn : function MM_onNewFolder_success(response, obj)
						{
								var folderName = response.config.dataObj["prop_cm_name"], filter = this.widgets.pagingDataTable.currentFilter;
								if (filter.filterId === "path")
								{
									if (obj.mode === "create")
									{
										if (filter.filterData)
										{
											if (filter.filterData.charAt(filter.filterData.length - 1) !== "/")
											{
												filter.filterData = filter.filterData + "/" + folderName;
											} else
											{
												filter.filterData = filter.filterData + folderName;
											}
										} else
										{
											filter.filterData = "/" + folderName;
										}

									} else if (obj.mode === "edit")
									{
										filter.filterData = filter.filterData.substring(0, filter.filterData.lastIndexOf("/")) + '/' + folderName;
									}
									YAHOO.Bubbling.fire("changeFilter", filter);
								}

								if (obj.mode === "create")
								{
									YAHOO.Bubbling.fire("folderCreated", {
										name : folderName,
										parentNodeRef : this.options.nodeRef
									});
								} else if (obj.mode === "edit")
								{
									YAHOO.Bubbling.fire("folderRenamed", {
										file : {
											displayName : folderName,
											node : {
												nodeRef : this.options.nodeRef
											},
											location : {
												path : filter.filterData,
												file : ""
											}
										}

									});

								}

								Alfresco.util.PopupManager.displayMessage({
									text : this.msg("message.topic.success." + mode, folderName)
								});
						},
						scope : this,
						obj : {
							mode : mode
						}
						},
						onFailure : {
							fn : function MM_onNewFolder_failure(response)
						{
								if (response)
								{
									var folderName = response.config.dataObj["prop_cm_name"];
									Alfresco.util.PopupManager.displayMessage({
										text : this.msg("message.topic.failure." + mode, folderName)
									});
								} else
								{
									Alfresco.util.PopupManager.displayMessage({
										text : this.msg("message.failure")
									});
								}
						},
						scope : this
						}
					}).show();
				},

				onFileUpload : function ManualManager_onFileUpload(e, p_obj)
				{
					if (!this.widgets.fileUpload)
					{
						this.widgets.fileUpload = Alfresco.getFileUploadInstance();
					}

					// Show uploader for multiple files
					var multiUploadConfig = {
							destination : this.options.nodeRef,
							filter : [ {
								description : "png",
								extensions : "*.png"
							}, {
								description : "jpg",
								extensions : "*.jpg"
							}, {
								description : "jpeg",
								extensions : "*.jpeg"
							}, {
								description : "bmp",
								extensions : "*.bmp"
							}, {
								description : "gif",
								extensions : "*.gif"
							}, {
								description : "svg",
								extensions : "*.svg"
							} ],
							mode : this.widgets.fileUpload.MODE_MULTI_UPLOAD,
							thumbnails : "doclib"
					};
					this.widgets.fileUpload.show(multiUploadConfig);

				},

				onActionVersions : function MM_onActionVersions(e)
				{

					Alfresco.util.Ajax.jsonGet({
						url : Alfresco.constants.PROXY_URI + "api/version?nodeRef=" + this.options.documentNodeRef,
						successCallback : {
							fn : function(response)
							{
								this.widgets.versions = {
										versions : response.json,
										pageIndex : 1
								};

								// Hide current
								this.widgets.pagingDataTable.widgets.dataTable.hideColumn(0);

								// Create buttons if they do not exist
								if (!this.widgets.nextButton)
								{
									this.widgets.nextButton = Alfresco.util.createYUIButton(this, "versionNext", this.onVersionNext);
									this.widgets.previousButton = Alfresco.util.createYUIButton(this, "versionPrevious", this.onVersionPrevious);
									this.widgets.revertButton = Alfresco.util.createYUIButton(this, "versionRevert", this.onVersionRevert);
									this.widgets.closeButton = Alfresco.util.createYUIButton(this, "versionClose", this.onVersionClose);
								}
								this._onActionVersionUpdateButtonStatus();

								Dom.setStyle(this.id + "-version-buttons", "visibility", "visible");
								Dom.setStyle(this.id + "-version-properties", "visibility", "visible");
								Dom.setStyle(this.id + "-version-content", "visibility", "visible");

								if (this.widgets.versions.versions.length > 1)
								{
									this._onActionVersionDrawContent();
								} else
								{
									this.widgets.nextButton.set("disabled", true);
									this.widgets.previousButton.set("disabled", true);
									this.widgets.revertButton.set("disabled", true);
									var content = Dom.get(this.id + "-version-content");
									content.innerHTML = '<div class="wmd-preview">' + this.widgets.Markdown.makeHtml(this.msg("message.noversion")) + '</div>';
								}

							},
							scope : this
						}
					});

				},

				_onActionVersionUpdateButtonStatus : function MM_UpdateButtonStatus()
				{
					this.widgets.nextButton.set("disabled", this.widgets.versions.pageIndex === 1);
					this.widgets.previousButton.set("disabled", this.widgets.versions.pageIndex === this.widgets.versions.versions.length - 1);
					this.widgets.revertButton.set("disabled", this.widgets.versions.pageIndex === 0);
				},

				_onActionVersionDrawContent : function MM__onActionVersionDrawContent()
				{
					var currentVersion = this.widgets.versions.versions[this.widgets.versions.pageIndex];

					// Check if we already have fetched the content
					if (!currentVersion.content)
					{
						Alfresco.util.Ajax.request({
							url : Alfresco.constants.PROXY_URI + "api/node/content/" + currentVersion.nodeRef.replace("://", "/"),
							successCallback : {
								fn : function(response)
								{
									currentVersion.content = response.serverResponse.responseText;
									// Recursive call again
									this._onActionVersionDrawContent();
								},
								scope : this
							}
						});
					} else
					{
						var prop = Dom.get(this.id + "-version-properties"), content = Dom.get(this.id + "-version-content");
						prop.innerHTML = this.msg("label.versionproperties", currentVersion.label, currentVersion.creator.firstName + ' '
								+ currentVersion.creator.lastName, Alfresco.util.formatDate(currentVersion.createdDateISO, this.msg("date-format.fullDateTime")));
						content.innerHTML = '<div class="wmd-preview">' + this.widgets.Markdown.makeHtml(currentVersion.content) + '</div>';
					}
				},

				onVersionNext : function MM_onVersionNext(e)
				{
					this.widgets.versions.pageIndex--;
					this._onActionVersionUpdateButtonStatus();
					this._onActionVersionDrawContent();

				},

				onVersionPrevious : function MM_onVersionPrevious(e)
				{
					this.widgets.versions.pageIndex++;
					this._onActionVersionUpdateButtonStatus();
					this._onActionVersionDrawContent();
				},

				onVersionRevert : function MM_onVersionRevert(e)
				{

					Alfresco.module.getRevertVersionInstance().show({
						filename : this.options.path,
						nodeRef : this.options.documentNodeRef,
						version : this.widgets.versions.versions[this.widgets.versions.pageIndex].label,
						onRevertVersionComplete : {
							fn : function()
							{

								Dom.setStyle(this.id + "-version-buttons", "visibility", "hidden");
								Dom.setStyle(this.id + "-version-properties", "visibility", "hidden");
								Dom.setStyle(this.id + "-version-content", "visibility", "hidden");

								this.widgets.pagingDataTable.widgets.dataTable.showColumn(0);
								this.widgets.pagingDataTable.reloadDataTable();
							},
							scope : this
						}
					});

				},

				onVersionClose : function MM_onVersionClose(e)
				{
					// Hide the the version content
					Dom.setStyle(this.id + "-version-buttons", "visibility", "hidden");
					Dom.setStyle(this.id + "-version-properties", "visibility", "hidden");
					Dom.setStyle(this.id + "-version-content", "visibility", "hidden");

					this.widgets.pagingDataTable.widgets.dataTable.showColumn(0);
					this.widgets.pagingDataTable.reloadDataTable();

				},

				onActionSort : function MM_onActionSort(e)
				{

					this.widgets.sortDialog = new Alfresco.module.SimpleDialog(this.id + "-sortDialog").setOptions({
						width : "35em",
						destroyOnHide : true,
						actionUrl : Alfresco.constants.PROXY_URI_RELATIVE + "loftux/manual/sort",
						templateUrl : Alfresco.constants.URL_SERVICECONTEXT + "modules/manual/sort?nodeRef=" + this.options.nodeRef,
						onSuccess : {
							fn : function MM_onActionSort_callback(response)
					{
								var result = response.json;
								var filter = this.widgets.pagingDataTable.currentFilter
								if (filter.filterId === "path")
								{
									// Tell the tree to update
									var obj = {
											// destination : filter.filterData,
											action : "folderCreated",
											// decrepitate : false,
											// stop : false,
											// flagged : false,
											parentNodeRef : this.options.parentNodeRef
									};

									// This is actually not a create, but triggers
									// sort of tree
									YAHOO.Bubbling.fire("folderCreated", obj);

								}

					},
					scope : this
						},
						doSetupFormsValidation : {
							fn : function MM_onActionSort_callback(form)
						{
								form.setShowSubmitStateDynamically(true, false);

								// Set up DnD
								// this.widgets.shadowEl =
								// Dom.get(this.configDialog.id +
								// "-dashlet-li-shadow");
								this.widgets.sorttopic = Dom.get(this.widgets.sortDialog.id + "-sorttopic-ul");
								var dndConfig = {
										draggables : [ {
											container : this.widgets.sorttopic,
											groups : [ Alfresco.util.DragAndDrop.GROUP_MOVE ],
											cssClass : "sortTopic"
										} ],
										targets : [ {
											container : this.widgets.sorttopic,
											group : Alfresco.util.DragAndDrop.GROUP_MOVE,
											maximum : 100
											// You need to set a maximum, else it will not
											// be accepted as target
										} ]
								};

								var dnd = new Alfresco.util.DragAndDrop(dndConfig);
						},

						scope : this
						},
						doBeforeFormSubmit : {
							fn : function GoogleSiteNews_doBeforeFormsSubmit(form)
						{
								// Before submit, iterate selected enabled items,
								// and store in hidden input
								var inputtopics = Dom.get(this.widgets.sortDialog.id + "-sorttopic");
								var ul = Dom.get(this.widgets.sortDialog.id + "-sorttopic-ul");
								var lis = Dom.getElementsByClassName("sorttopicitem", "li", ul);
								var sorteditems = [];
								for ( var j = 0; j < lis.length; j++)
								{
									var li = lis[j];
									sorteditems.push(YAHOO.util.Selector.query("input[type=hidden][name=sorttopicitem]", li, true).value);
								}
								inputtopics.value = sorteditems;
						},
						scope : this
						}
					}).show();
				},

				onPagedownEditorInit : function ManualManager_onPagedownEditorInit(event, p_obj)
				{
					this.widgets.editor = p_obj[1].editor;
					this.widgets.controlId = p_obj[1].controlId;
					// Initialize the image dialog

					var nodeRef = this.options.nodeRef;
					var templateUrl = YAHOO.lang.substitute(Alfresco.constants.URL_SERVICECONTEXT + "modules/manual/images?nodeRef={nodeRef}&htmlid={htmlId}",
							{
						nodeRef : nodeRef,
						htmlId : this.id
							});
					Alfresco.util.Ajax.request({
						method : Alfresco.util.Ajax.GET,
						url : templateUrl,
						successCallback : {
							fn : function PopupManager_displayWebscript_successCallback(response)
					{
								// Instantiate a Panel from script
								this.widgets.ImagePanel = {
										html : response.serverResponse.responseText,
										initialized : false
								};
					},
					scope : this
						},
						failureMessage : Alfresco.util.message("message.failure"),
						scope : this,
						execScripts : false
					});

					if (this.widgets.editor)
					{
						this.widgets.editor.hooks.set("insertImageDialog", this.bind(function(callback)
								{
							// this.widgets.ImageDialog.show();
							var previewPanel = YAHOO.util.Dom.get("wmd-preview" + this.widgets.controlId), imagesPanel = YAHOO.util.Dom.get("wmd-images"
									+ this.widgets.controlId), textBox = YAHOO.util.Dom.get(this.widgets.controlId);
							YUIDom.setStyle(previewPanel, "display", "none");
							YUIDom.setStyle(textBox, "color", "grey");
							textBox.readOnly = true;
							if (this.widgets.ImagePanel.initialized === false)
							{
								imagesPanel.innerHTML = this.widgets.ImagePanel.html;
								var tabViewImage = new YAHOO.widget.TabView('image-tab-view');
								var closeButton = Alfresco.util.createYUIButton(this, "image-tab-view-close", this.onActionSelectImage, {},
								"image-tab-view-close");
								this._addDragAndDrop();
								this.widgets.ImagePanel.initialized = true;
							}
							// This needs to be called every time since it
							// stores current "chunks" of text
							this.widgets.ImagePanel.callback = callback;

							YUIDom.setStyle(imagesPanel, "display", "block");
							return true
								}));
					}
				},

				onActionSelectImage : function ManualManager_onActionSelectImage(p_parameter, p_anchor)
				{
					var previewPanel = YAHOO.util.Dom.get("wmd-preview" + this.widgets.controlId), imagesPanel = YAHOO.util.Dom.get("wmd-images"
							+ this.widgets.controlId), textBox = YAHOO.util.Dom.get(this.widgets.controlId);
					;
					YUIDom.setStyle(imagesPanel, "display", "none");
					YUIDom.setStyle(previewPanel, "display", "block");
					YUIDom.setStyle(textBox, "color", "black");
					textBox.readOnly = false;

					// this.widgets.editor.refreshPreview();
					if (p_anchor[1])
					{
						this.widgets.ImagePanel.callback(p_anchor[1]);

					}

				},

				onActionCopyTo : function MM_onActionCopyTo(record)
				{
					this._copyMoveTo("copy");
				},

				onActionMoveTo : function MM_onActionMoveTo(record)
				{
					this._copyMoveTo("move");
				},

				onFilesMovedCopied : function MM_onFilesMovedCopied(e, obj)
				{
					var filter = this.widgets.pagingDataTable.currentFilter;
					if (filter.filterId === "path")
					{
						filter.filterData = obj[1].destination;

						YAHOO.Bubbling.fire("changeFilter", filter);
					}
				},

				_copyMoveTo : function MM_copyMoveTo(mode)
				{
					// Check mode is an allowed one
					if (!mode in {
						copy : true,
						move : true
					})
					{
						throw new Error("'" + mode + "' is not a valid Copy/Move to mode.");
					}

					if (!this.modules.copyMoveTo)
					{
						this.modules.copyMoveTo = new Alfresco.module.DoclibCopyMoveTo(this.id + "-copyMoveTo");
					}

					var allowedViewModes = [ Alfresco.module.DoclibGlobalFolder.VIEW_MODE_SITE ];
					if (this.options.repositoryBrowsing === true)
					{
						allowedViewModes.push(Alfresco.module.DoclibGlobalFolder.VIEW_MODE_REPOSITORY, Alfresco.module.DoclibGlobalFolder.VIEW_MODE_USERHOME);
					}
					// Construct the record object as copyMove dialog
					// expects it.
					var record = {
							node : {
								nodeRef : this.options.nodeRef,
								type : "cm:folder"
							}
					};

					// Loftux - the copyMoveTo is hardcoded to
					// documentLibrary in global-folder.js so use repository
					// mode only
					// That way we cannot move between sites, but withing
					// should do for now
					this.modules.copyMoveTo.setOptions({
						allowedViewModes : [ Alfresco.module.DoclibGlobalFolder.VIEW_MODE_REPOSITORY ],
						mode : mode,
						siteId : this.options.siteId,
						// containerId: "manual",
						path : this.options.topicPath,
						files : record,
						rootNode : this.options.rootNodeRef,
						parentId : this.options.parentNodeRef
					}).showDialog();
				},

				renderPath : function ManualManager_renderPath(path)
				{

					var pathItems = path.split("/"), pathHtml = "", currentPath = "", action = "";

					// Store the current path for later use
					this.options.path = path;

					for ( var i = 0; i < pathItems.length; i++)
					{
						if (pathItems[i] !== "")
						{
							currentPath += '/' + pathItems[i];
							pathHtml += $html(' > ');

							pathHtml += '<a onClick="YAHOO.Bubbling.fire(\'MMchangeFilter\',\'' + currentPath + '\');" href="#filter=path%7C'
							+ this._encodeFilter(currentPath) + '">' + $html(pathItems[i]) + '</a>';
						}
					}

					var contentPathDom = Dom.get(this.id + "-contentPath");
               if(contentPathDom)
               {
                  contentPathDom.innerHTML = pathHtml;
               }

					// Make sure the search panel is hidden when changing
					// path
					if (this.widgets.search)
					{
						this.widgets.search.widgets.dataTable.destroy();
						this.widgets.search = null;
					}
					// Paginator, leaves empty spaces in innerhtml, remove
					// them, else it occupy one row.
					var searchPaginatorDom = Dom.get(this.id + "-search-result-paginator");
               if(searchPaginatorDom)
               {
                  searchPaginatorDom.innerHTML = '';
               }

					// Hide version panel if visible
					Dom.setStyle(this.id + "-version-buttons", "visibility", "hidden");
					Dom.setStyle(this.id + "-version-properties", "visibility", "hidden");
					Dom.setStyle(this.id + "-version-content", "visibility", "hidden");

					if (this.widgets && this.widgets.pagingDataTable)
					{
						this.widgets.pagingDataTable.widgets.dataTable.showColumn(0);
					}

				},
				_encodeFilter : function MM_encodeFilter(text)
				{
					return encodeURIComponent(text).replace(/%20/g, '+');
				},

				/**
				 * Delete record.
				 * 
				 * @method onActionDelete
				 * @param record
				 *           {object} Object literal representing the file or
				 *           folder to be actioned
				 */
				onActionDelete : function MM_onActionDelete()
				{
					var me = this, record = {};

					record.filePath = "/";
					var filter = this.widgets.pagingDataTable.currentFilter;
					if (filter.filterId === "path")
					{
						record.filePath = filter.filterData;
					}

					record.nodeRef = this.options.nodeRef;

					Alfresco.util.PopupManager.displayPrompt({
						title : this.msg("actions.delete"),
						text : this.msg("message.confirm.delete", record.filePath),
						buttons : [ {
							text : this.msg("button.delete"),
							handler : function MM_onActionDelete_delete()
						{
								this.destroy();
								me._onActionDeleteConfirm.call(me, record);
						}
						}, {
							text : this.msg("button.cancel"),
							handler : function MM_onActionDelete_cancel()
						{
								this.destroy();
						},
						isDefault : true
						} ]
					});
				},

				/**
				 * Delete record confirmed.
				 * 
				 * @method _onActionDeleteConfirm
				 * @param record
				 *           {object} Object literal representing the file or
				 *           folder to be actioned
				 * @private
				 */
				_onActionDeleteConfirm : function MM_onActionDeleteConfirm(record)
				{
					var url = Alfresco.constants.PROXY_URI_RELATIVE + 'slingshot/doclib/action/file/node/' + record.nodeRef.replace("://", "/")

					// http://localhost:8080/share/proxy/alfresco/slingshot/doclib/action/file/node/workspace/SpacesStore/f09b4fb4-6274-41e5-b110-724af39e0a67
					// http://localhost:8080/share/proxy/alfresco/slingshot/doclib/action/file/workspace/SpacesStore/a608b857-43fb-430d-bcde-0d4788b85593

					Alfresco.util.Ajax
					.request({
						method : Alfresco.util.Ajax.DELETE,
						url : url,
						successCallback : {
							fn : function PopupManager_displayWebscript_successCallback(response, record)
					{
								Alfresco.util.PopupManager.displayMessage({
									text : this.msg("message.delete.success", record.filePath)
								});

								var filter = this.widgets.pagingDataTable.currentFilter, newPath = record.filePath.substring(0, record.filePath
										.lastIndexOf("/"));
								if (filter.filterId === "path")
								{
									filter.filterData = newPath;

									YAHOO.Bubbling.fire("changeFilter", filter);
								}
								// Tell the tree to update
								var obj = {
										path : record.filePath,
										action : "folderDeleted",
										decrepitate : false,
										stop : false,
										flagged : false
								};

								YAHOO.Bubbling.fire("folderDeleted", obj);

					},
					scope : this,
					obj : record
						},
						failureMessage : this.msg("message.delete.failure", record.filePath),
						scope : this
					});

				},

				onFolderDeleted : function DLT_onFolderDeleted(layer, args)
				{
					var obj = args[1];
					if (obj !== null)
					{
						var filter = this.widgets.pagingDataTable.currentFilter;
						if (filter.filterId === "path")
						{
							filter.filterData = obj[1].path;

							YAHOO.Bubbling.fire("changeFilter", filter);
						}
					}
				},

				/**
				 * Search Handlers
				 */

				/**
				 * Configure search area
				 * 
				 * @method configureSearch
				 */
				configureSearch : function MM_configureSearch()
				{
					this.widgets.searchBox = Dom.get(this.id + "-searchText");
					this.defaultSearchText = this.msg("manual.search.default");

					Event.addListener(this.widgets.searchBox, "focus", this.onSearchFocus, null, this);
					Event.addListener(this.widgets.searchBox, "blur", this.onSearchBlur, null, this);

					this.setDefaultSearchText();

					// Register the "enter" event on the search text field
					var me = this;

					this.widgets.searchEnterListener = new YAHOO.util.KeyListener(this.widgets.searchBox, {
						keys : YAHOO.util.KeyListener.KEY.ENTER
					}, {
						fn : me.submitSearch,
						scope : this,
						correctScope : true
					}, "keydown").enable();

				},

				/**
				 * Update image class when search box has focus.
				 * 
				 * @method onSearchFocus
				 */
				onSearchFocus : function MM_onSearchFocus()
				{
					if (this.widgets.searchBox.value == this.defaultSearchText)
					{
						Dom.removeClass(this.widgets.searchBox, "faded");
						this.widgets.searchBox.value = "";
					} else
					{
						this.widgets.searchBox.select();
					}
				},

				/**
				 * Set default search text when box loses focus and is empty.
				 * 
				 * @method onSearchBlur
				 */
				onSearchBlur : function MM_onSearchBlur()
				{
					var searchText = YAHOO.lang.trim(this.widgets.searchBox.value);
					if (searchText.length === 0)
					{
						/**
						 * Since the blur event occurs before the KeyListener
						 * gets the enter we give the enter listener a chance of
						 * testing against "" instead of the help text.
						 */
						YAHOO.lang.later(100, this, this.setDefaultSearchText, []);
					}
				},

				/**
				 * Set default search text for search box.
				 * 
				 * @method setDefaultSearchText
				 */
				setDefaultSearchText : function MM_setDefaultSearchText()
				{
					Dom.addClass(this.widgets.searchBox, "faded");
					this.widgets.searchBox.value = this.defaultSearchText;
				},

				/**
				 * Get current search text from search box.
				 * 
				 * @method getSearchText
				 */
				getSearchText : function MM_getSearchText()
				{
					return YAHOO.lang.trim(this.widgets.searchBox.value);
				},

				/**
				 * Will trigger a search, via a page refresh to ensure the
				 * Back button works correctly
				 * 
				 * @method submitSearch
				 */
				submitSearch : function MM_submitSearch()
				{
					var url = Alfresco.constants.PROXY_URI + "loftux/manual/site/" + this.options.siteId + "/search?q=" + this.getSearchText();
					this.widgets.search = new Alfresco.util.DataTable({
						dataTable : {
							container : this.id + "-search-result",
							columnDefinitions : [ {
								key : "path",
								sortable : false,
								formatter : this.bind(this.renderSearchLink)
							}, {
								key : "content",
								sortable : false,
								formatter : this.bind(this.renderSearchPreview)
							} ],
							config : {
								MSG_EMPTY : this.msg("label.search.noresults"),
								responseType : YAHOO.util.DataSource.TYPE_JSARRAY,
								responseSchema : {
									resultsList : "data",
									fields : [ "path", "content" ]
								}

							}
						},
						dataSource : {
							url : url
						},
						paginator : {
							history : false,
							config : {
								containers : [ this.id + "-search-result-paginator" ],
								rowsPerPage : 5

							}
						}
					});
				},

				renderSearchLink : function MM_renderSearchLink(elCell, oRecord, oColumn, oData)
				{
					if (oData.length < 1)
					{
						// We may have found root, assume path /
						oData = "/";
					}
					var html = '<a onClick="YAHOO.Bubbling.fire(\'MMchangeFilter\',\'' + oData + '\');" href="#filter=path%7C' + this._encodeFilter(oData)
					+ '">' + $html(oData.replace(/\//g, " > ")) + '</a>';
					elCell.innerHTML = '<span style="display:inline;white-space:nowrap;">' + html + '</span>';
				},

				renderSearchPreview : function MM_renderSearchPreview(elCell, oRecord, oColumn, oData)
				{
					elCell.innerHTML = '<div class="wmd-preview">' + this.widgets.Markdown.makeHtml(oData) + '</div>';
				}

			});
		})();
