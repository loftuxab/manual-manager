<import resource="classpath:/alfresco/templates/org/alfresco/import/alfresco-util.js">
// See if a site page's title has been renamed by the site manager
model.metaPage = AlfrescoUtil.getMetaPage();

function widgets()
{
   var evaluateChildFolders = "true",
       maximumFolderCount = "-1";

   var docListTree = {
      id : "ManualManagerTree", 
      name : "Loftux.ManualManagerTree",
      options : {
         siteId : (page.url.templateArgs.site != null) ? page.url.templateArgs.site : "",
         containerId : "manual",
         evaluateChildFolders : Boolean(evaluateChildFolders),
         maximumFolderCount : parseInt(maximumFolderCount),
         setDropTargets : false
      }
   };
   model.widgets = [docListTree];
}

widgets();