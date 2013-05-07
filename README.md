#Manual Manager

Manual Manager is an add-on for Alfresco Share that adds hierarchically  structured documents written using markdown syntax. The result is kind of a classic help file. Current features include: 

* Topic Editor with realtime preview.
* Upload images to be used in topic using Drag and drop.
* Insert select image size (auto resize) of uploaded images.
* Insert Alfresco icons and document icons.
* Template for new topics - Add a default template to repository, Site Manager can edit to create site specific template.
* Sort topic order using drag and drop.
* Topic navigation using folder structure or by auto created links in topic display to navigate sub topics or related topics.
* Direct linking to each topic
* Move or copy current topic and all its subtopics in one action.
* Version management - including full preview of previous versions.
* Permission management of topics.
* Print current topic, and if selected all its subtopics. Prints includes metadata with dates, author and current version.
* Inline search with hit preview
* Presentation mode - Create slides of topics to be viewed online with select theme and transitions.  

You can watch this introduction [video](http://www.youtube.com/watch?v=iTn-lJozYkM) to see it in action.

##Author
Peter Löfgren Loftux AB [http://loftux.se](http://loftux.se) - [http://loftux.com](http://loftux.com) - [@loftux](https://twitter.com/loftux)

## Clone, build and install
There are no official releases of Manual Manager. But the source is here, so you can just clone and build yourself.  

	$ git clone git://github.com/loftuxab/manual-manager.git ManualManager  
	$ cd ManualManager   

Master branch is for 4.2. If you want to target 4.0.x version of Alfresco, checkout branch 4.0 before building. Both branches has the same features.

    $ git checkout 4.0

Build with  

	$ ant package  

This will produce `loftux-manual-manager.jar`.  
Copy this file to both
`tomcat/webbapps/alfresco/WEB-INF/lib`  
`tomcat/webbapps/share/WEB-INF/lib`  
and restart tomcat.

Once restarted, go to your site as Site Manager and select `Customise Site`. Add the **Manual** page component.  

##Third party components used
This add-on makes use of several external components  

* [Pagedown](https://code.google.com/p/pagedown/) for online editor and html view rendering of markdown
* [reveal.js](https://github.com/hakimel/reveal.js/) by [Hakim](http://hakim.se) for creating online presentations
* [Markdown](http://daringfireball.net/projects/markdown/) - the markdown syntax used.
* [Alfresco](http://www.alfresco.com) - Not included here! -but you need install this add-on on top of Alfresco.  

Some third party components in itself use other third party components. Check their respective site for details.

#LICENSE
Copyright (C) 2012-2013 Loftux AB

Manual Manager is free software: you can redistribute it and/or modify it under the terms of the GNU Lesser General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

Manual Manager is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Lesser General Public License for more details

##LICENSE Third party
Third party components comes with other licenses.  

* Pagedown - MIT License
* reveal.js - MIT License
* Markdown - BSD Style open source license

Licenses can be found in LICENSE folder.
