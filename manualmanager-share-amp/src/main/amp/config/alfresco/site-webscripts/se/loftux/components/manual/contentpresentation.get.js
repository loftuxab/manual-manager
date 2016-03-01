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

var uri = "/loftux/manual/presentation?nodeRef=" + page.url.args.nodeRef + "&recurse=" + ((page.url.args.recurse === "true") ? "true" : "false");
var connector = remote.connect("alfresco");

var result = connector.get(uri);
if (result.status.code == status.STATUS_OK)
{
   // Strip out possible malicious code
   var result = eval("(" + result.response + ")");

   model.content = result.content;
}
else
{
   status.code = result.status.code;
   status.message = msg.get("message.failure");
   status.redirect = true;
}