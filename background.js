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
            const reqUrl = details.url;
			// console.log("msg :" + JSON.stringify(msg));
            if (msg.action != "completed" && reqUrl.match(new RegExp(url))) {
                return updateSesstionTime(channel,details);
            }
        }, {urls: [url]}, ["blocking", "requestBody",]);

    }

    let updateSesstionTime = (channel,msg) => {
        let url = msg.url;
        let lessonStatus = getQueryString(url, "lesson_status");
        console.log("lessonStatus --->:" + lessonStatus);
        if (lessonStatus == "completed") {
			channel.postMessage({"name": "autoplay", action: "next"});
            return {cancel: false};
        }

        let requiredTime = parseInt(getQueryString(url, "required_time"));
        console.log("requiredTime --->:" + requiredTime);

        let totalTime = parseInt(getQueryString(url, "total_time"));
        console.log("totalTime --->:" + totalTime);
        // chrome.storage.local.get("filterSetting", result => {
        //     let _setting = result.filterSetting;
        //     if (_setting) {
        //        const _paramsJson = _setting.filter_params;
        //     }
        // });
        let sesstionTime = Math.floor((Math.random() + 1) * requiredTime);
        let maxTotalTime = requiredTime;
        if (0 < requiredTime <= 15) {
            maxTotalTime = requiredTime * 12;
        } else if (15 < requiredTime <= 30) {
            maxTotalTime = requiredTime * 6;
        } else if (30 < requiredTime <= 60) {
            maxTotalTime = requiredTime * 3;
        } else if (60 < requiredTime <= 90) {
            maxTotalTime = requiredTime * 2;
        } else {
            sesstionTime = requiredTime + Math.floor((Math.random() + 1) * 30);
            maxTotalTime = requiredTime * 1.5;
        }

        if (totalTime >= maxTotalTime) {
			channel.postMessage({"name": "autoplay", action: "next"});
            return {cancel: false};
        }
        return {redirectUrl: getTargetUrl(url, sesstionTime)};
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