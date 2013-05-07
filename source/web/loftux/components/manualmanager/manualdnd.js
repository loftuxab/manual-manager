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

(function()
		{
	if (typeof Loftux == "undefined" || !Loftux)
	{
		Loftux = {};
	}
	if (typeof Loftux.ManualDND == "undefined" || !Loftux.ManualDND)
	{
		Loftux.ManualDND = {};
	}

	Loftux.ManualDND.prototype = {

	dragAndDropAllowed : true,
	dragAndDropEnabled : false,
	dragEventRefCount : 0,

	/**
	 * Removes HTML5 drag and drop listeners from the document list.
	 * 
	 * @method _removeDragAndDrop
	 */
	_removeDragAndDrop : function MMDnD__removeDragAndDrop()
	{
				if (this.dragAndDropEnabled)
				{
					// Make the entire DocumentList available for dropping files for
					// uploading onto.
					try
					{
						// Add listeners to the HTML5 drag and drop events fired from the
						// entire doc list
						var topicImages = Dom.get("topic");
						YAHOO.util.Event.removeListener(topicImages, "dragenter");
						YAHOO.util.Event.removeListener(topicImages, "dragover");
						YAHOO.util.Event.removeListener(topicImages, "dragleave");
						YAHOO.util.Event.removeListener(topicImages, "drop");
					} catch (exception)
					{
						Alfresco.logger.error("_removeDragAndDrop: The following exception occurred: ", exception);
					}
				}
	},

	/**
	 * Adds HTML5 drag and drop listeners to the document list.
	 * 
	 * @method _addDragAndDrop
	 */
	_addDragAndDrop : function MMDnD__addDragAndDrop()
	{
		if (this.permissions.create === "true" && this.dragAndDropEnabled)
		{
			// Make the entire DocumentList available for dropping files for
			// uploading onto.
			try
			{
				// Add listeners to the HTML5 drag and drop events fired from the
				// entire doc list
				var topicImages = Dom.get("topic");
				YAHOO.util.Event.addListener(topicImages, "dragenter", this.onDocumentListDragEnter, this, true);
				YAHOO.util.Event.addListener(topicImages, "dragover", this.onDocumentListDragOver, this, true);
				YAHOO.util.Event.addListener(topicImages, "dragleave", this.onDocumentListDragLeave, this, true);
				YAHOO.util.Event.addListener(topicImages, "drop", this.onDocumentListDrop, this, true);
			} catch (exception)
			{
				Alfresco.logger.error("_addDragAndDrop: The following exception occurred: ", exception);
			}
		}
	},

	/**
	 * Fired when an object starts getting dragged. The event is swallowed
	 * because we only want to allow drag and drop events that begin outside
	 * the browser window (e.g. for files). This prevents users attempting to
	 * drag and drop the document and folder images as if they could
	 * re-arrange the document lib structure.
	 * 
	 * @param e
	 *           {object} HTML5 drag and drop event
	 * @method _swallowDragStart
	 */
	_swallowDragStart : function MMDnD__swallowDragStart(e)
	{
		e.stopPropagation();
		e.preventDefault();
	},

	/**
	 * Fired when an object is dragged onto any node in the document body
	 * (unless the node has been explicitly overridden to invoke another
	 * function). Swallows the event.
	 * 
	 * @param e
	 *           {object} HTML5 drag and drop event
	 * @method _swallowDragEnter
	 */
	_swallowDragEnter : function MMDnD__swallowDragEnter(e)
	{
		e.stopPropagation();
		e.preventDefault();
	},

	/**
	 * Fired when an object is dragged over any node in the document body
	 * (unless the node has been explicitly overridden to invoke another
	 * function). Updates the drag behaviour to indicate that drops are not
	 * allowed and then swallows the event.
	 * 
	 * @param e
	 *           {object} HTML5 drag and drop event
	 * @method _swallowDragOver
	 */
	_swallowDragOver : function MMDnD__swallowDragOver(e)
	{
		e.dataTransfer.dropEffect = "none";
		e.stopPropagation();
		e.preventDefault();
	},

	/**
	 * Fired when an object is dropped onto any node in the document body
	 * (unless the node has been explicitly overridden to invoke another
	 * function). Swallows the event to prevent default browser behaviour
	 * (i.e. attempting to open the file).
	 * 
	 * @param e
	 *           {object} HTML5 drag and drop event
	 * @method _swallowDrop
	 */
	_swallowDrop : function MMDnD__swallowDrop(e)
	{
		e.stopPropagation();
		e.preventDefault();
	},

	/**
	 * Fired when an object is dragged into the DocumentList DOM element and
	 * then again when dragged into a Folder icon image DOM element.
	 * 
	 * @param e
	 *           {object} HTML5 drag and drop event
	 * @method onDocumentListDragEnter
	 */
	onDocumentListDragEnter : function MMDnD_onDocumentListDragEnter(e)
	{

		var topicImages = Dom.get("topic");
		Dom.addClass(topicImages, "dndHighlight");

		e.stopPropagation();
		e.preventDefault();
	},

	/**
	 * Fired when an object is dragged into the DocumentList DOM element and
	 * then again when dragged into a Folder icon image DOM element.
	 * 
	 * @param e
	 *           {object} HTML5 drag and drop event
	 * @method onDocumentListDragOver
	 */
	onDocumentListDragOver : function MMDnD_onDocumentListDragOver(e)
	{
		// Firefox 3.6 set effectAllowed = "move" for files, however the "copy"
		// effect is more accurate for uploads
		e.dataTransfer.dropEffect = Math.floor(YAHOO.env.ua.gecko) === 1 ? "move" : "copy";
		e.stopPropagation();
		e.preventDefault();
	},

	/**
	 * Fired when an object is dragged out of the DocumentList DOM element or
	 * the Folder icon image DOM element.
	 * 
	 * @param e
	 *           {object} HTML5 drag and drop event
	 * @method onDocumentListDragLeave
	 */
	onDocumentListDragLeave : function MMDnD_onDocumentListDragLeave(e)
	{
		var topicImages = Dom.get("topic");
		Dom.removeClass(topicImages, "dndHighlight");
		e.stopPropagation();
		e.preventDefault();
	},

	/**
	 * Fired when an object is dropped onto the DocumentList DOM element.
	 * Checks that files are present for upload, determines the target (either
	 * the current document list or a specific folder rendered in the document
	 * list and then calls on the DNDUpload singleton component to perform the
	 * upload.
	 * 
	 * @param e
	 *           {object} HTML5 drag and drop event
	 * @method onDocumentListDrop
	 */
	onDocumentListDrop : function MMDnD_onDocumentListDrop(e)
	{
		try
		{
			// Only perform a file upload if the user has *actually* dropped
			// some files!
			if (e.dataTransfer.files !== undefined && e.dataTransfer.files !== null && e.dataTransfer.files.length > 0)
			{
				// We need to get the upload progress dialog widget so that we
				// can display it.
				// The function called has been added to file-upload.js and
				// ensures the dialog is a singleton.
				var progressDialog = Alfresco.getDNDUploadProgressInstance();

				var continueWithUpload = false;

				// Check that at least one file with some data has been
				// dropped...
				var zeroByteFiles = "", i, j;

				j = e.dataTransfer.files.length;
				for (i = 0; i < j; i++)
				{
					if (e.dataTransfer.files[i].size > 0)
					{
						continueWithUpload = true;
					} else
					{
						zeroByteFiles += '"' + e.dataTransfer.files[i].name + '", ';
					}
				}

				if (!continueWithUpload)
				{
					zeroByteFiles = zeroByteFiles.substring(0, zeroByteFiles.lastIndexOf(", "));
					Alfresco.util.PopupManager.displayMessage({
						text : progressDialog.msg("message.zeroByteFiles", zeroByteFiles)
					});
				}

				// Perform some checks on based on the browser and selected files
				// to ensure that we will
				// support the upload request.
				if (continueWithUpload && progressDialog.uploadMethod === progressDialog.INMEMORY_UPLOAD)
				{
					// Add up the total size of all selected files to see if they
					// exceed the maximum allowed.
					// If the user has requested to upload too large a file or too
					// many files in one operation
					// then generate an error dialog and abort the upload...
					var totalRequestedUploadSize = 0;

					j = e.dataTransfer.files.length;
					for (i = 0; i < j; i++)
					{
						totalRequestedUploadSize += e.dataTransfer.files[i].size;
					}
					if (totalRequestedUploadSize > progressDialog.getInMemoryLimit())
					{
						continueWithUpload = false;
						Alfresco.util.PopupManager.displayPrompt({
							text : progressDialog.msg("inmemory.uploadsize.exceeded", Alfresco.util.formatFileSize(progressDialog.getInMemoryLimit()))
						});
					}
				}

				// Test that the dropped file is an image
				var nonImageFiles="";		
				//j set earlier
				for (i = 0; i < j; i++)
				{
					var isImage = /image/g;

					if (!isImage.test(e.dataTransfer.files[i].type)){
						continueWithUpload = false;
						nonImageFiles += '"' + e.dataTransfer.files[i].name + '", ';
					}
				}
				if(!continueWithUpload){
					Alfresco.util.PopupManager.displayPrompt({
						text : this.msg("upload.nonimagefiles", nonImageFiles)
					});
				}


				// If all tests are passed...
				if (continueWithUpload)
				{

					// Remove all the highlighting
					var topicImages = Dom.get("topic");
					Dom.removeClass(topicImages, "dndHighlight");

					// Show uploader for multiple files
					var multiUploadConfig = {
							files : e.dataTransfer.files,
							uploadDirectoryName : "",
							filter : [],
							mode : progressDialog.MODE_MULTI_UPLOAD,
							thumbnails : "doclib",
							destination : this.options.nodeRef,
							overwrite : false,
							onFileUploadComplete : {
								fn : this.onFileUploadComplete,
								scope : this
							}
					};

					progressDialog.show(multiUploadConfig);
				}
			} else
			{
				Alfresco.logger.debug("MMDnD_onDocumentListDrop: A drop event was detected, but no files were present for upload: ", e.dataTransfer);
			}
		} catch (exception)
		{
			Alfresco.logger.error("MMDnD_onDocumentListDrop: The following error occurred when files were dropped onto the Document List: ", exception);
		}
		e.stopPropagation();
		e.preventDefault();
	},

	onFileUploadComplete : function MMDnD_onFileUploadComplete()
	{

		// Remove existin Dnd
		this._removeDragAndDrop();

		var nodeRef = this.options.nodeRef;
		var templateUrl = YAHOO.lang.substitute(Alfresco.constants.URL_SERVICECONTEXT + "modules/manual/images?nodeRef={nodeRef}&htmlid={htmlId}", {
			nodeRef : nodeRef,
			htmlId : this.id
		});
		Alfresco.util.Ajax.request({
			method : Alfresco.util.Ajax.GET,
			url : templateUrl,
			successCallback : {
				fn : function PopupManager_displayWebscript_successCallback(response)
		{
					var imagesPanel = YAHOO.util.Dom.get("wmd-images" +
							this.widgets.controlId);

					// Instantiate a Panel from script
					this.widgets.ImagePanel.html = response.serverResponse.responseText;

					imagesPanel.innerHTML = this.widgets.ImagePanel.html;
					var tabViewImage = new YAHOO.widget.TabView('image-tab-view');
					var closeButton = Alfresco.util.createYUIButton(this, "image-tab-view-close", this.onActionSelectImage, {}, "image-tab-view-close");
					this._addDragAndDrop();
					this.widgets.ImagePanel.initialized = true;

		},
		scope : this
			},
			failureMessage : Alfresco.util.message("message.failure"),
			scope : this,
			execScripts : false
		});
	}

	}

	YAHOO.lang.augmentProto(Loftux.ManualManager, Loftux.ManualDND);
		})();