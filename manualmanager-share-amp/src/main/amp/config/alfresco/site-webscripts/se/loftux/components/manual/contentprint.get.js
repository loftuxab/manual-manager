function widgets()
{
   var manualManagerPrint = {
      id : "ManualManagerPrint", 
      name : "Loftux.ManualManagerPrint",
      options : {
         nodeRef : (page.url.args.nodeRef != null) ? page.url.args.nodeRef : "",
         recurse : (page.url.args.recurse != null) ? page.url.args.recurse : ""
      }
   };
   model.widgets = [manualManagerPrint];
}

widgets();
   
   