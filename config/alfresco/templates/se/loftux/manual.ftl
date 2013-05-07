<#include "../../org/alfresco/include/alfresco-template.ftl" />
<@templateHeader>
   <script type="text/javascript">//<![CDATA[
      new Alfresco.widget.Resizer("Wiki");
   //]]></script>
   <@templateHtmlEditorAssets />     
</@>

<@templateBody>
   <div id="alf-hd">
      <@region id="header" scope="global" />
      <@region id="title" scope="template" />
      <@region id="navigation" scope="template" />
   </div>
   <div id="bd">
      <div class="yui-t1" id="alfresco-wiki">
         <div id="yui-main">
            <div class="yui-b" id="alf-content">
               <@region id="content" scope="template"/>
            </div>
         </div>
         <div class="yui-b" id="alf-filters">
            <@region id="tree" scope="template"/>
         </div>
      </div>
   </div>
      
      <@region id="html-upload" scope="template"/>
      <@region id="flash-upload" scope="template"/>
      <@region id="file-upload" scope="template"/>
      <@region id="dnd-upload" scope="template"/>
</@>

<@templateFooter>
   <div id="alf-ft">
      <@region id="footer" scope="global" />
   </div>
</@>