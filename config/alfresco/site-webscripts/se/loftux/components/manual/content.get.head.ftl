<#include "../../../../org/alfresco/components/component.head.inc">
<#include "../../../../org/alfresco/components/form/form.get.head.ftl">
<!-- Document Library Tree -->
<@script type="text/javascript" src="${page.url.context}/res/modules/simple-dialog.js"></@script>
<@script type="text/javascript" src="${page.url.context}/res/modules/documentlibrary/global-folder.js"></@script>
<@script type="text/javascript" src="${page.url.context}/res/modules/documentlibrary/copy-move-to.js"></@script>
<@script type="text/javascript" src="${page.url.context}/res/modules/documentlibrary/doclib-actions.js"></@script>
<@script type="text/javascript" src="${page.url.context}/res/modules/documentlibrary/permissions.js"></@script>
<@script type="text/javascript" src="${page.url.context}/res/modules/document-details/revert-version.js"></@script>
<@script type="text/javascript" src="${page.url.context}/res/js/alfresco-dnd.js"></@script>
<@script type="text/javascript" src="${page.url.context}/res/loftux/components/manualmanager/manual.js"></@script>
<@script type="text/javascript" src="${page.url.context}/res/loftux/components/manualmanager/manualdnd.js"></@script>
<@link rel="stylesheet" type="text/css" href="${page.url.context}/res/loftux/components/manualmanager/manual.css" />
<#-- Global Folder Picker (req'd by Copy/Move To) -->
<@link rel="stylesheet" type="text/css" href="${page.url.context}/res/modules/documentlibrary/global-folder.css" />
<@link rel="stylesheet" type="text/css" href="${page.url.context}/res/modules/document-details/revert-version.css" />