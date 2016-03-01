<#-- Renders a hidden form field with preset value. Can be used on create for default values -->
<#assign fieldValue = "">
<#if field.control.params.value??>
	<#assign fieldValue = field.control.params.value>
</#if>

<#if form.mode == "edit" || form.mode == "create">
   <input type="hidden" name="${field.name}" 
          <#if fieldValue?is_number>value="${fieldValue?c}"<#else>value="${fieldValue?html}"</#if> />
</#if>