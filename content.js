(function () {
    let injectScript = function (file, node) {
        const th = document.getElementsByTagName(node)[0];
        const s = document.createElement('script');
        s.setAttribute('type', 'text/javascript');
        s.setAttribute('src', file);
        th.appendChild(s);
    }
    const $ = chrome.extension.getURL('lib/jquery.min.js');
    const _ = chrome.extension.getURL('lib/baiduyun.js');
    injectScript($, 'body');
    injectScript(_, 'body');

})();
