///<reference path="../imports.ts"/>

/**
 * Created by artem on 6/14/15.
 */

module to.common {


	var backgroundMap = {
		'Bookmarks': 'background-bookmarks',
		'Plan': 'background-plan',
		'Track': 'background-track',
		'Progress': 'background-act',
		'Categories': 'background-categories',
		'Reasons': 'background-reasons',
		'Archive': 'background-archive',
		'Advise': 'background-advise'
	};

	var currentTheme:string;

	export function setTheme(theme:string) {
		jQuery('.view-title').text(theme);

		if(!backgroundMap[theme]) {
			return;
		}
		var headerBar = jQuery('.menu-content .bar-header');
		if(currentTheme) {
			headerBar.removeClass(backgroundMap[currentTheme]);
		}
		currentTheme = theme;
		headerBar.addClass(backgroundMap[theme]);

	}
}
