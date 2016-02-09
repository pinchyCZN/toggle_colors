Toggle Document Colors Add-On
-----------------------------


The Toggle Document Colors add-on lets you easily toggle the page colors between the page-defined colors
and your own user-defined color preferences. The colors may be toggled by means of a keyboard shortcut 
or a button on the toolbar.  

The toolbar button is automatically added to the browser's navigation bar when the add-on is installed.
If you don't want the button to display, or if you want to move it to a different position, right-click
the navigation bar and select "Customize...". Then you will be able to drag the button with your mouse 
to a new position or off the navigation bar.

The default keyboard shortcut for Firefox is (Control-Shift-C).
The default keyboard shortcut for SeaMonkey is (Control-K).
For SeaMonkey, the shortcut is only intended for use in browser windows, not in mail windows.

The shortcut key can be modified on the "about:config" page, by updating either of these values:
        toggledocumentcolors.shortcutKey
        toggledocumentcolors.shortcutModifiers
Before updating the values, make sure that the new shortcut values you plan to configure are not already used 
by the browser or by any other installed add-on.

To configure your own browser page colors, select "Tools - Options..." from the Firefox menu, then
select the "Content" tab, and then select the "Colors..." button.  This opens a window where you can
select the colors to use for the page background, text, and links.  This window also has a checkbox,
"Allow pages to choose their own colors, instead of my selections above".  Using the Toggle Document Colors 
keyboard shortcut or toolbar button is equivalent to opening the aforementioned window and selecting or
unselecting the checkbox.  But using the keyboard shortcut or toolbar button is much simpler and quicker.

This add-on has additional functionality to avoid your own colors from clashing with the page-defined colors
in situations where the page overrides the background color but not the text color, or where it overrides 
the text color but not the background color.
When you toggle the add-on to use the page-defined colors, your own color settings are saved,
and the color settings are set back to default values (generally, black text and white background).
When you toggle back to using your own colors, they are set back to your saved values.

Important:
To view your color preferences on the Firefox Options window while this add-on is installed, 
toggle to user-defined color mode before opening the Options window. 
Otherwise the Options window will only display the default values (due to the above-mentioned functionality).
Even though the default values are displayed, your personal colors settings are still saved.




Version History

---

January 22, 2012 - version 1.4.20120122

Fixed a bug which was causing the user-defined colors to get reset when the user toggled colors via the 
browser Options window.

Updated the maxVersion for SeaMonkey to 2.6.*.


---

January 22, 2012 - version 1.3.20120122

Fixed a bug which was causing the "use system colors" option not to work correctly, when toggling
back and forth between user-defined colors and page-defined colors, while multiple browser windows
were open.


---

October 8, 2011 - version 1.3.20111008

1. The default shortcut key for SeaMonkey has been changed to Control-K.
   The default shortcut key for Firefox remains Control-Shift-C.

2. The shortcut key is now stored in the user preferences. 
   The shortcut key can be modified on the "about:config" page, by updating either of these values:
        toggledocumentcolors.shortcutKey
        toggledocumentcolors.shortcutModifiers
   Before updating the values, make sure that the shortcut key you plan to configure is 
   not already used by the browser or by any other installed add-ons.

3. The Toggle-Colors button is now automatically added to the navigation toolbar,
   when the add-on is installed.

4. The add-on includes new functionality for the "Use system colors" option.
   When "Allow pages to choose their own colors..." is not selected, "Use system colors" causes pages 
   to be displayed with the user's system colors.
   When both options are selected, the page-defined colors may clash with the system colors in the 
   same way that they may clash with the user-defined colors.
   Therefore, this add-on now saves the "Use system colors" setting and turns it off when the user
   toggles to page-defined colors. When the user toggles back again, the "Use system colors"
   setting is set back to its original value.

5. When viewing the Firefox Options window while in page-defined color mode, the default colors are 
   displayed rather than the user-defined colors. The add-on has been updated so that if any color 
   preferences are changed while in page-defined color mode, those colors will be saved and not 
   overlaid when toggling between modes.  Only colors which were updated will be saved off.

6. The add-on preference names have been changed to begin with "toggledocumentcolors".
   Logic has been added to delete the add-on preferences when the add-on is uninstalled.

7. Due to the add-on's new functionality, the minimum supported Firefox version has been changed from 1.5 to 3.

---

April 11, 2011 - Version 1.2.20110411

Added support for SeaMonkey 2.0.*.

---

April 9, 2011 - Version 1.2.20110409

The add-on has been updated for Firefox 4.0.
The shortcut key is now Control-Shift-C, as Firefox 4 uses the add-on's previous shortcut (Control-Shift-E)
for something else.

---

July 16, 2010 - Version 1.1.20100716

This add-on is based on the one with the same name which was created and uploaded by "ecraven" on 02/03/2009.
This version of the add-on has maxVersion updated to 3.6.* so that it can run under Firefox 3.6,
as well as some additional functionality.

