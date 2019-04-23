(function () {

    let port = chrome.runtime.connect({name: "autoplay"});
    port.postMessage({"name": "autoplay", action: "ping"});
    port.onMessage.addListener(msg => {
        console.log(" ==>:  " + JSON.stringify(msg));
        if (msg.action == 'next') {
            nextVideo();
        }else if(msg.action == 'refresh'){
            console.log("===>: "+document.location.href);
            window.location.reload();
        }
    });

    let nextVideo = () => {
        console.log('-----next start------');
        let currentNode = document.querySelector('a.course_chapter.do');
        let nextNode = currentNode.parentElement.nextElementSibling;
        if (nextNode) {
            let index = parseInt(currentNode.getAttribute('index')) + 1;
            document.querySelector('a.course_chapter[index="' + index + '"]').click();
        } else {
            port.postMessage({"name": "autoplay", "action": "completed", msg: "The course has been completed ..."});
        }
        console.log('-----next end------');
    };

})();
