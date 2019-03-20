// 如果使用webpack打包的时候，要把这里放开，否则，无法引用bootstrap.min.css
// import './lib/bootstrap.min.css'
(function () {

    chrome.storage.local.get(['filterSetting'], result => {
        console.log("storage data: " + JSON.stringify(result));
        let _setting = result.filterSetting;
        if (_setting) {
            document.querySelector('#url').value = _setting.filter_url;
            document.querySelector('#paramsJson').value = _setting.filter_params;
        }
    });


    let port = chrome.runtime.connect({name: "setting"});
    port.postMessage({name: "setting",action: "ping"});
    port.onMessage.addListener(msg => {
        console.log(" ===>:  " + JSON.stringify(msg));
        if (msg.name == "pong") {
            port.postMessage({name: "setting", msg: "Connection success ..."});
        }
    });


    let submitBtn = document.querySelector('#submitBtn');
    submitBtn.addEventListener('click', () => {
        let _url = document.querySelector('#url').value;
        let _paramsJson = document.querySelector('#paramsJson').value;
        // if (_url == '' || _paramsJson == '') {
        //     showNotification('参数不能为空！');
        //     return;
        // }
        const _filterSetting = {filter_url: _url, filter_params: _paramsJson};
        chrome.storage.local.set({"filterSetting": _filterSetting}, () => {
            console.log("Setting saved successfully ...");
            showNotification('配置保存成功！');
            port.postMessage({name: "setting",action: "update"});
        });
    });

    let showNotification = msg => {
        let _notificationId = Date.now() + '';
        let _notificationSetting = {
            type: 'basic',
            title: '通知',
            iconUrl: "notifacation.png",
            message: msg,
            eventTime: Date.now()
        };
        chrome.notifications.create(_notificationId, _notificationSetting, null);
    };


})();