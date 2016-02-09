var toggledocumentcolors =
{
	TDC_ADDON_ID   : "toggleDocumentColors@darkoshi",
	FIREFOX_ID     : "{ec8030f7-c20a-464f-9b0e-13a3a9e97384}",
	SEAMONKEY_ID   : "{92650c4d-4b8e-4d2a-b7eb-24ecf4f6b63a}",
	APPINFO_SVC    : Components.classes["@mozilla.org/xre/app-info;1"].getService(Components.interfaces.nsIXULAppInfo),
	OBSERVER_SVC   : Components.classes["@mozilla.org/observer-service;1"].getService(Components.interfaces.nsIObserverService),
	PREFSVC_SVC    : Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService),
	prefMgr        : Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch),

	browserPrefs: null,
	tdcPrefs: null,
	isUninstalling: false,


	onLoad: function(e)
	{
		if (!Application.extensions)
		{
			// Firefox version 4+; SeaMonkey version 2.1+
			Components.utils.import("resource://gre/modules/AddonManager.jsm");
		}

		// The first time the addon is loaded, add the toggle button to the navigation toolbar.

		if (!this.prefMgr.prefHasUserValue("toggledocumentcolors.toolbarButtonAdded"))
		{
			this.installButton("nav-bar", "toggledocumentcolors-toolbar-button", "stop-button");
			this.prefMgr.setBoolPref("toggledocumentcolors.toolbarButtonAdded", true);
		}

		this.initShortcutKey();
		this.initPrefs();
		this.initObservers();

		this.initialized = true;
	},

	onUnload: function(e)
	{
		// Remove observers

		if (Application.extensions)
		{
			// Firefox older than version 4; Seamonkey older than version 2.1
			this.OBSERVER_SVC.removeObserver(this, "em-action-requested");
		}
		else
		{
			// Firefox version 4+; SeaMonkey version 2.1+
			AddonManager.removeAddonListener(this);
		}

		this.browserPrefs.removeObserver("", this);
		this.tdcPrefs.removeObserver("", this);
	},


	/**
	 * Installs the toolbar button with the given ID into the given
	 * toolbar, if it is not already present in the document.
	 *
	 * @param {string} toolbarId The ID of the toolbar to install to.
	 * @param {string} id The ID of the button to install.
	 * @param {string} afterId The ID of the element to insert after. @optional
	 */
	installButton: function(toolbarId, id, afterId)
	{
		var button;

		button = document.getElementById(id);

		if (!button ||
			button.parentNode.id == "BrowserToolbarPalette")	// need this for SeaMonkey
		{
			var toolbar = document.getElementById(toolbarId);

			var before = toolbar.firstChild;
			if (afterId)
			{
				var elem;
				elem = document.getElementById(afterId);
				if (elem && elem.parentNode == toolbar)
					before = elem.nextElementSibling;
			}

			toolbar.insertItem(id, before);
			toolbar.setAttribute("currentset", toolbar.currentSet);
			document.persist(toolbar.id, "currentset");
		}
	},


	initShortcutKey: function()
	{
		var keyNode = document.getElementById("key_toggledocumentcolors");
		var appInfo;
		var strKey;
		var strModifiers;

		// Check app-info for the browser being used, in order to assign different shortcut keys for Firefox and SeaMonkey.

		appInfo = this.APPINFO_SVC;

		// Read the shortcut key/modifier values from the preferences.
		// This allows a user to override them via about:config.
		// If preferences not set yet, save the default shortcut key/modifier values based on which browser is being used.

		if (this.prefMgr.prefHasUserValue("toggledocumentcolors.shortcutKey"))
			strKey = this.prefMgr.getCharPref("toggledocumentcolors.shortcutKey");
		else
		{
			if (appInfo.ID == this.FIREFOX_ID)
				strKey = "C";
			else if (appInfo.ID == this.SEAMONKEY_ID)
				strKey = "K";

			this.prefMgr.setCharPref("toggledocumentcolors.shortcutKey", strKey);
		}

		if (this.prefMgr.prefHasUserValue("toggledocumentcolors.shortcutModifiers"))
			strModifiers = this.prefMgr.getCharPref("toggledocumentcolors.shortcutModifiers");
		else
		{
			if (appInfo.ID == this.FIREFOX_ID)
				strModifiers = "accel,shift";
			else if (appInfo.ID == this.SEAMONKEY_ID)
				strModifiers = "accel";

			this.prefMgr.setCharPref("toggledocumentcolors.shortcutModifiers", strModifiers);
		}

		keyNode.setAttribute("key", strKey);
		keyNode.setAttribute("modifiers", strModifiers);

	},

	initPrefs: function()
	{
		// Old versions of this add-on used different names for the user preferences.
		// If the user has just upgraded from an older version, rename the preferences.
		// Otherwise, if add-on has just been installed, set the preferences from the current values.

		if (!this.prefMgr.prefHasUserValue("toggledocumentcolors.internalVersion"))
		{
			if (this.prefMgr.prefHasUserValue("browser.display.background_color.hold"))
				{
				this.prefMgr.setCharPref("toggledocumentcolors.color_background",
					this.prefMgr.getCharPref("browser.display.background_color.hold"));
				this.prefMgr.clearUserPref("browser.display.background_color.hold");
				}
			else if (this.prefMgr.prefHasUserValue("browser.display.background_color"))
				{
				this.prefMgr.setCharPref("toggledocumentcolors.color_background",
					this.prefMgr.getCharPref("browser.display.background_color"));
				}

			if (this.prefMgr.prefHasUserValue("browser.display.foreground_color.hold"))
				{
				this.prefMgr.setCharPref("toggledocumentcolors.color_foreground",
					this.prefMgr.getCharPref("browser.display.foreground_color.hold"));
				this.prefMgr.clearUserPref("browser.display.foreground_color.hold");
				}
			else if (this.prefMgr.prefHasUserValue("browser.display.foreground_color"))
				{
				this.prefMgr.setCharPref("toggledocumentcolors.color_foreground",
					this.prefMgr.getCharPref("browser.display.foreground_color"));
				}

			if (this.prefMgr.prefHasUserValue("browser.anchor_color.hold"))
				{
				this.prefMgr.setCharPref("toggledocumentcolors.color_anchor",
					this.prefMgr.getCharPref("browser.anchor_color.hold"));
				this.prefMgr.clearUserPref("browser.anchor_color.hold");
				}
			else if (this.prefMgr.prefHasUserValue("browser.anchor_color"))
				{
				this.prefMgr.setCharPref("toggledocumentcolors.color_anchor",
					this.prefMgr.getCharPref("browser.anchor_color"));
				}

			if (this.prefMgr.prefHasUserValue("browser.visited_color.hold"))
				{
				this.prefMgr.setCharPref("toggledocumentcolors.color_visited",
					this.prefMgr.getCharPref("browser.visited_color.hold"));
				this.prefMgr.clearUserPref("browser.visited_color.hold");
				}
			else if (this.prefMgr.prefHasUserValue("browser.visited_color"))
				{
				this.prefMgr.setCharPref("toggledocumentcolors.color_visited",
					this.prefMgr.getCharPref("browser.visited_color"));
				}
		}

		this.prefMgr.setCharPref("toggledocumentcolors.internalVersion", "1");
	},


	initObservers: function()
	{
		this.OBSERVER_SVC.addObserver(this, "quit-application-granted", false);

		if (Application.extensions)
		{
			// Firefox older than version 4; Seamonkey older than version 2.1
			this.OBSERVER_SVC.addObserver(this, "em-action-requested", false);
		}
		else
		{
			// Firefox version 4+; SeaMonkey version 2.1+
			AddonManager.addAddonListener(this);
		}


		// Add an observer for changes to the browser (color) preferences.

		this.browserPrefs = this.PREFSVC_SVC.getBranch("browser.");
		this.browserPrefs.QueryInterface(Components.interfaces.nsIPrefBranch2);
		this.browserPrefs.addObserver("", this, false);


		// Add an observer for changes to the toggledocumentcolors preferences.
		// This will allow the shortcut key to be updated via the about:config page, without the
		// user needing to close and restart all browser windows for the change to take effect.

		this.tdcPrefs = this.PREFSVC_SVC.getBranch("toggledocumentcolors.");
		this.tdcPrefs.QueryInterface(Components.interfaces.nsIPrefBranch2);
		this.tdcPrefs.addObserver("", this, false);
	},


	// The observe function gets called based on the things we've added observers for.
	observe: function(subject, topic, data)
	{
		var strKey;
		var strModifiers;

		if (topic == "em-action-requested")	// Used for Firefox versions older than v4.
		{
			subject.QueryInterface(Components.interfaces.nsIUpdateItem);

			if (subject.id == this.TDC_ADDON_ID)
			{
				if (data == "item-uninstalled")
				{
					this.isUninstalling = true;
				}
				else if (data == "item-cancel-action")
				{
					this.isUninstalling = false;
				}
			}
		}
		else if (topic == "quit-application-granted")
		{
			if (this.isUninstalling)
			{
				this.prefMgr.deleteBranch("toggledocumentcolors");
			}

			// This observer must be removed here, not in the OnUnload() function,
			// as "quit-application-granted" occurs *after* the unload event!

			this.OBSERVER_SVC.removeObserver(this, "quit-application-granted");
		}
		else if (topic = "nsPref:changed")
		{
			// Each browser window registers its own observers;
			// this function may get called multiple times for the same event, once for each window.
			//
			// When the event was initiated from onToolbarButtonCommand, then this logic should be skipped.
			// Otherwise the toggledocumentcolors preferences would get set to the wrong values.
			//
			// toggledocumentcolors.isToggling is being used like a global variable which 
			// all instances of this extension can check (how else could this be handled?).

			if (!this.prefMgr.prefHasUserValue("toggledocumentcolors.isToggling"))
			{
				// If the user has updated a color option, then copy the new value to the toggledocumentcolors preference.
				// This will avoid the the user-selected color being lost when the colors are toggled back and forth.

				switch (data)
				{
					case "display.background_color":
						if (this.prefMgr.prefHasUserValue("browser.display.background_color"))
						{
							this.prefMgr.setCharPref("toggledocumentcolors.color_background",
										this.prefMgr.getCharPref("browser.display.background_color"));
						}
						else
							this.prefMgr.clearUserPref("toggledocumentcolors.color_background");
						break;

					case "display.foreground_color":
						if (this.prefMgr.prefHasUserValue("browser.display.foreground_color"))
						{
							this.prefMgr.setCharPref("toggledocumentcolors.color_foreground",
										this.prefMgr.getCharPref("browser.display.foreground_color"));
						}
						else
							this.prefMgr.clearUserPref("toggledocumentcolors.color_foreground");
						break;

					case "anchor_color":
						if (this.prefMgr.prefHasUserValue("browser.anchor_color"))
						{
							this.prefMgr.setCharPref("toggledocumentcolors.color_anchor",
										this.prefMgr.getCharPref("browser.anchor_color"));
						}
						else
							this.prefMgr.clearUserPref("toggledocumentcolors.color_anchor");
						break;

					case "visited_color":
						if (this.prefMgr.prefHasUserValue("browser.visited_color"))
						{
							this.prefMgr.setCharPref("toggledocumentcolors.color_visited",
										this.prefMgr.getCharPref("browser.visited_color"));
						}
						else
							this.prefMgr.clearUserPref("toggledocumentcolors.color_visited");
						break;

					case "display.use_system_colors":
						if (this.prefMgr.prefHasUserValue("browser.display.use_system_colors"))
						{
							this.prefMgr.setBoolPref("toggledocumentcolors.use_system_colors",
										this.prefMgr.getBoolPref("browser.display.use_system_colors"));
						}
						else
							this.prefMgr.clearUserPref("toggledocumentcolors.use_system_colors");
						break;

					// If the user toggles the colors by some method other than this Add-on,
					// then perform this Add-on's logic too, for consistency.

					// The following event will be processed multiple times if multiple browser windows are open.
					// This results in redundant execution of code, but it does not cause any values
					// to be set incorrectly.

					case "display.use_document_colors":
						this.prefMgr.setBoolPref("toggledocumentcolors.isToggling", true);
						this.onToolbarButtonCommand("");
						break;

					// If the user changes the shortcut key or modifiers values on the about:config page,
					// apply the update right away.

					case "shortcutKey":
					case "shortcutModifiers":
						strKey = this.prefMgr.getCharPref("toggledocumentcolors.shortcutKey");
						strModifiers = this.prefMgr.getCharPref("toggledocumentcolors.shortcutModifiers");
						this.updateShortcut(strKey, strModifiers);
						break;
				}
			}
		}
	},


	// onUninstalling, onOperationCancelled - for Firefox version 4+; SeaMonkey version 2.1+
	onUninstalling: function(addon)
	{
		if (addon.id == this.TDC_ADDON_ID)
		{
			this.isUninstalling = true;
		}
	},
	onOperationCancelled: function(addon)
	{
		if (addon.id == this.TDC_ADDON_ID)
		{
			this.isUninstalling = (addon.pendingOperations & AddonManager.PENDING_UNINSTALL) != 0;
		}
	},


	updateShortcut: function(strKey, strModifiers)
	{
		var keyNode;
		var keyParent;

		keyNode = document.getElementById("key_toggledocumentcolors");
		keyParent = keyNode.parentNode;

		keyNode.removeAttribute("modifiers");
		keyNode.removeAttribute("key");

		keyNode.setAttribute("key", strKey);
		keyNode.setAttribute("modifiers", strModifiers);

		// Next part should cause the browser to reset the key cache, so that the change gets applied

		keyParent.parentNode.insertBefore(keyParent, keyParent.nextSibling);
	},


	onToolbarButtonCommand: function(e)
	{
		// document colors = page-defined colors

		var useDocColors = this.prefMgr.getBoolPref("browser.display.use_document_colors");


		if (!this.prefMgr.prefHasUserValue("toggledocumentcolors.isToggling"))
		{
			// If we get here, that means this add-on's button or shortcut-key was used to toggle colors
			// Otherwise, a different method was used, in which case use_document_colors was already toggled.

			this.prefMgr.setBoolPref("toggledocumentcolors.isToggling", true);

			useDocColors = !useDocColors;
			this.prefMgr.setBoolPref("browser.display.use_document_colors", useDocColors);
		}


		// Many websites assume that the user's colors are set to the default values (black text, white background).
		// These sites may specify a value for the text color without also specifying a background color, or vice versa.
		// This may cause a problem if the user's colors are very different from the defaults.
		// For example, if the user's background color is set to black, and a website sets the text color 
		// to dark blue without also specifying a page background color, then the user will be presented 
		// with dark blue text on a black background, which is difficult to read.

		// To avoid this problem, whenever the user switches over to using the page-defined colors,
		// we will set the colors to the default values.
		// When the user switches back to using their own colors, we copy back the saved-off color values.

		// The "use system colors" option causes pages to be displayed with a user's system colors.
		// In page-defined colors mode, the page colors may clash with the system colors in the same way
		// that they may clash with the user's colors. Therefore, this addon sets the "use system colors"
		// to false when switching to using the page-specified colors.
		// When the user switches back to using their own colors, the saved-off "use system colors" value is copied back.
		var my_button = document.getElementById("toggledocumentcolors-toolbar-button");
		
		if (!useDocColors) // user is switching over to using their own colors
		{
			// Set the colors to the saved-off user-specified colors, if they exist.
			my_button.checked = true;
			if (this.prefMgr.prefHasUserValue("toggledocumentcolors.color_background"))
				this.prefMgr.setCharPref("browser.display.background_color",
					this.prefMgr.getCharPref("toggledocumentcolors.color_background"));

			if (this.prefMgr.prefHasUserValue("toggledocumentcolors.color_foreground"))
				this.prefMgr.setCharPref("browser.display.foreground_color",
					this.prefMgr.getCharPref("toggledocumentcolors.color_foreground"));

			if (this.prefMgr.prefHasUserValue("toggledocumentcolors.color_anchor"))
				this.prefMgr.setCharPref("browser.anchor_color",
					this.prefMgr.getCharPref("toggledocumentcolors.color_anchor"));

			if (this.prefMgr.prefHasUserValue("toggledocumentcolors.color_visited"))
				this.prefMgr.setCharPref("browser.visited_color",
					this.prefMgr.getCharPref("toggledocumentcolors.color_visited"));

			// Set use_system_colors to the saved-off user-specified value.

			if (this.prefMgr.prefHasUserValue("toggledocumentcolors.use_system_colors"))
				this.prefMgr.setBoolPref("browser.display.use_system_colors",
					this.prefMgr.getBoolPref("toggledocumentcolors.use_system_colors"));

		}
		else  // user is switching over to using the page-defined colors
		{
			// Set the colors to their default values.
			my_button.checked = false;
			if (this.prefMgr.prefHasUserValue("browser.display.background_color"))
				this.prefMgr.clearUserPref("browser.display.background_color");

			if (this.prefMgr.prefHasUserValue("browser.display.foreground_color"))
				this.prefMgr.clearUserPref("browser.display.foreground_color");

			if (this.prefMgr.prefHasUserValue("browser.anchor_color"))
				this.prefMgr.clearUserPref("browser.anchor_color");

			if (this.prefMgr.prefHasUserValue("browser.visited_color"))
				this.prefMgr.clearUserPref("browser.visited_color");

			// Clear the use_system_colors value
			if (this.prefMgr.prefHasUserValue("browser.display.use_system_colors"))
				this.prefMgr.clearUserPref("browser.display.use_system_colors");
		}

		this.prefMgr.clearUserPref("toggledocumentcolors.isToggling");
	}

};

window.addEventListener("load", function(e) { toggledocumentcolors.onLoad(e); }, false);
window.addEventListener("unload", function(e) { toggledocumentcolors.onUnload(e); }, false);
