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

var SECTION_START = '<section><!-- start -->\n',
   SECTION_END = '</section><!-- end -->\n',
   SECTION_MD_START = '<section data-markdown>\n<script type="text/template">\n',
   SECTION_MD_END = '</script>\n</section>\n';

function getContent(node)
{

	var doc = node.childByNamePath("/index.md"), currentcontent = "";

	if (doc)
	{
		currentcontent += doc.content;

	} else
	{
		currentcontent += '  \n\n----\n';
		currentcontent += '>Error finding content';
	}
	
	//Fix numbering for links, else document overwrite each others links
	var docid = node.properties["sys:node-dbid"];
	currentcontent = currentcontent.replace(/\[([0-9]*?)\]\:/g, function ($0,$1){
	   
	   return "["+ docid +$1+ "]:";
	})
   currentcontent = currentcontent.replace(/\]\[([0-9]*?)\]/g, function ($0,$1){
      
      return "]["+ docid +$1+ "]";
   })
   
	return currentcontent + '\n';
}

// Sort the sort topics
function sortChildren(a, b)
{
   if (a.properties.title < b.properties.title)
   {   
      return -1;
   }
   if (a.properties.title > b.properties.title)
   {
      return 1;
   }
   return 0;
}

function getSlides(node){
   var slides = []
   for (c in node.children)
   {
      var child = node.children[c];

      if (child.isContainer)
      {
         slides.push(child);
      }
   }
   if(slides.length > 1)
   {
      slides.sort(sortChildren);
   }
   
   return slides;
}
function recurse(scriptNode)
{

   var mainSlides = getSlides(scriptNode)
   if (mainSlides.length === 0 )
      return;
   
   if(recursenodes)
   {
      for (c in mainSlides)
      {
         var child = mainSlides[c], childSlides = getSlides(child);
         if(childSlides.length > 0)
         {
            content += SECTION_START;
            content += SECTION_MD_START + getContent(child) + SECTION_MD_END ;
            for (cs in childSlides)
            {
               var childSlide = childSlides[cs];
               content += SECTION_MD_START + getContent(childSlide) + SECTION_MD_END ;
            }
            content += SECTION_END;
         }
         else
         {
            content += SECTION_MD_START + getContent(child) + SECTION_MD_END ;
         }
         
      }
   }
   else
   {
      for (c in mainSlides)
      {
         var child = mainSlides[c];
         content += SECTION_MD_START + getContent(child) + SECTION_MD_END ;
      }      
   }

}

function main()
{

	var nodeRef = args["nodeRef"] ? args["nodeRef"] : null;

	recursenodes = (args["recurse"] === "true") ? true : false;

	var node = utils.getNodeFromString(nodeRef);
	if (!nodeRef)
	{
		model.data.content = '>Could not find node';
		return null;
	}

	content += SECTION_MD_START + getContent(node) + SECTION_MD_END;
	recurse(node);

}

var content = "", recursenodes;

main();

model.content = content;