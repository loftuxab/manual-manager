<#assign el=args.htmlid?html>
<div id="${el}-presentationsetup-dialog">
<p>
<input id="${el}-recurse" type="checkbox" tabindex="0" name="-" checked="checked" />
<label for="${el}-recurse">${msg("subtopics.label")}</label>
</p>
<p>
<select id="${el}-transition">
  <option value="default">${msg("transition.default")}</option>
  <option value="cube">${msg("transition.cube")}</option>
  <option value="page">${msg("transition.page")}</option>
  <option value="concave">${msg("transition.concave")}</option>
  <option value="zoom">${msg("transition.zoom")}</option>  
  <option value="linear">${msg("transition.linear")}</option>
  <option value="fade">${msg("transition.fade")}</option>
  <option value="none">${msg("transition.none")}</option>
</select>
<label for="${el}-transition">${msg("transition.label")}</label><br />
</p>
<p>
<select id="${el}-theme">
  <option value="default">${msg("theme.default")}</option>
  <option value="sky">${msg("theme.sky")}</option>
  <option value="beige">${msg("theme.beige")}</option>
  <option value="simple">${msg("theme.simple")}</option>
  <option value="serif">${msg("theme.serif")}</option>  
  <option value="night">${msg("theme.night")}</option>
</select>
<label for="${el}-theme">${msg("theme.label")}</label><br />
</p>
</div>