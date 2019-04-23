(function () {

    // 设置扩展状态提示信息
    // chrome.browserAction.setBadgeText({text: '2.0'});
    // chrome.browserAction.setBadgeBackgroundColor({color: [255, 0, 0, 255]});

    // 跳转到设置页面
    chrome.browserAction.onClicked.addListener(tab => {
        chrome.tabs.update(tab.id, {url: "options.html"});
    });

    // let url = "<all_urls>";
    let url = "http://222.240.166.22:8089/coursePlayer/loopCommit.do*";
    chrome.runtime.onConnect.addListener(port => {
        let _portName = port.name;
        // console.log("port:" + JSON.stringify(port));
        if (!port.name || port.name == "") {
            console.log("Connection failed ...")
            return;
        }
        port.onMessage.addListener(response => {
            console.log("listener response :" + JSON.stringify(response));
            if (!response.name || response.name == "") {
                console.log("Connection listener failed ...")
                return;
            }
            if (response.action == "ping") {
                port.postMessage({"name": response.name, action: "pong"});
            }
            switch (_portName) {
                case "setting":
                    settingService(port, response);
                    break;
                case "autoplay":
                    autoplayService(port, response);
                    break;
            }

        });
    });

    let settingService = (channel, msg) => {
        if (msg.action == "update") {
            chrome.storage.local.get("filterSetting", result => {
                console.log("storage data: " + JSON.stringify(result));
                let _setting = result.filterSetting;
                if (_setting) {
                    url = _setting.filter_url;
                    // _paramsJson = _setting.filter_params;
                    channel.postMessage({name: "setting", msg: "success"});
                }
            });
        }
    }

    let autoplayService = (channel, msg) => {
        chrome.webRequest.onBeforeRequest.addListener(details => {
            // console.log("request details :" + JSON.stringify(details));
            // console.log("msg :" + JSON.stringify(msg));
            const reqUrl = details.url;
            if (!reqUrl.match(new RegExp(url))) {
                return true;
            }
            if (msg.action == "completed") {
                return {cancel: false};
            }

            let lessonStatus = getQueryString(reqUrl, "lesson_status");
            console.log("lessonStatus --->:" + lessonStatus);
            let requiredTime = parseInt(getQueryString(reqUrl, "required_time"));
            console.log("requiredTime --->:" + requiredTime);
            let session_time = parseInt(getQueryString(reqUrl, "session_time").split(":")[1]);
            console.log("sessionTime --->:" + session_time);
            if (lessonStatus == "completed") {
                channel.postMessage({"name": "autoplay", action: "next"});
                return {cancel: false};
            }
            if (session_time >= requiredTime) {
                channel.postMessage({"name": "autoplay", action: "refresh"});
                return {cancel: false};
            }
            return {redirectUrl: getTargetUrl(reqUrl, Math.floor((Math.random() + 1) * requiredTime))};
        }, {urls: [url]}, ["blocking", "requestBody",]);
    }

    let getQueryString = (url, name) => {
        let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        let query = url.substring(url.lastIndexOf('?') + 1);
        let r = query.match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }

    let getTargetUrl = (url, sesstionTime) => {
        let query = url.substring(url.lastIndexOf('?') + 1);
        let reg = new RegExp("session_time=([^&]*)");
        let r = query.match(reg);
        if (r) {
            let sourceParam = unescape(r[0]);
            console.log("sourceParam --->:" + sourceParam);
            let targetParam = "session_time=00:" + sesstionTime + ":00";
            console.log("targetParam --->:" + targetParam);
            let targetUrl = decodeURIComponent(url).replace(sourceParam, targetParam);
            console.log(" >>>*** request url ***>>> : " + targetUrl);
            console.log("**************request end*****************");

            return targetUrl;
        }
    }

})();