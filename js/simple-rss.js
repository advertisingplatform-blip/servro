var simpleRSSPlugin = (function() {
	// get all the feed containers
	var feedsNodes = document.querySelectorAll('[data-rss-feed]');
	// Convert to array
	var feeds = [].slice.call(feedsNodes);
	for (var i = 0; i < feeds.length; i++) {
		var container = feedsNodes[i];
		
		// get feed URL
		var url = container.getAttribute('data-rss-feed');
		// get whether to link titles
		var addLink = container.getAttribute('data-rss-link-titles') || 'true';
		
		// get title wrapper element
		var titleWrapper = container.getAttribute('data-rss-title-wrapper') || 'h2';
		// Max outputs
		var max = container.getAttribute('data-rss-max') || 10;
		// Get data - append as script with callback to avoid CORS
		var script = document.createElement('script');
		script.src = document.location.protocol + '//api.rss2json.com/v1/api.json?callback=simpleRSSPlugin.handleJSON&api_key=gimh1rtcjvvdk8td3hgozdb01fdkdfaxgmekidxn&rss_url=' + encodeURIComponent(url);
		document.querySelector('head').appendChild(script);
		
		// Remove script
		script.parentNode.removeChild(script);
	}
	// Callback function
	var loops = 0;
	function handleJSON(data) {
		if (data.feed && data.items) {
			
			var docFrag = document.createDocumentFragment();
			for (var i = 0; i < data.items.length; i++) {
				var e = data.items[i];
				e.thumbnail = e.thumbnail.replace('/s72', '/s1600');
				var tempNode = document.createElement('div');
				tempNode.classList.add('item', 'features-image', 'col-12', 'col-md-6', 'col-lg-4');
				var template = '<div class="item-wrapper"><div class="item-img"><a href="' + e.link + '"><img src="' + e.thumbnail + '" alt="' + e.title + '"></a></div><div class="item-content"><' + titleWrapper + ' class="item-title mbr-fonts-style display-5"><strong><a class="text-black fw-bold" href="' + e.link + '">' + e.title + '</a></strong></' + titleWrapper + '><div class="mbr-section-btn item-footer"><a href="' + e.link + '" class="btn item-btn btn-primary display-7">Citeste</a></div></div></div>';
				if (addLink === 'false') {
					template = '<' + titleWrapper + '>' + e.title + '</' + titleWrapper + '>' + e.content;
				}
				if (i < max) {
					
					tempNode.innerHTML = template;
					
					docFrag.appendChild(tempNode);
				}
			}
			container = feedsNodes[loops];
			container.appendChild(docFrag);
			loops++;
		}
	}
	// Return function for use in global scope
	return {
		handleJSON:handleJSON
	}
})();
