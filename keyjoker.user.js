// ==UserScript==
// @name         keyjoker半自动任务（伪）
// @namespace    https://greasyfork.org/zh-CN/scripts/406476
// @version      0.3.6
// @description  keyjoker半自动任务,修改自https://greasyfork.org/zh-CN/scripts/383411,部分操作需手动辅助
// @author       祭夜
// @include      *://www.keyjoker.com/entries*
// @include      *.hcaptcha.com/*
// @include      *://steamcommunity.com/profiles/*?type=keyjoker
// @include      *://steamcommunity.com/groups/*
// @include      *://discord.com/invite/*
// @include      *://twitter.com/*
// @include      *://open.spotify.com/album/*
// @include      *?type=keyjoker
// @supportURL   https://www.jysafe.cn/
// @homepage     https://www.jysafe.cn/
// @run-at       document-end
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_openInTab
// @grant        GM_log
// @connect      accounts.hcaptcha.com
// @connect      store.steampowered.com
// @connect      steamcommunity.com
// @connect      twitter.com
// @connect      facebook.com
// @connect      discordapp.com
// @connect      twitch.tv
// @connect      *
// @require      https://greasyfork.org/scripts/379868-jquery-not/code/jQuery%20not%20$.js?version=700787
// @require      https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// ==/UserScript==

(function() {
    'use strict';

    const debug = 1;
    // steam信息
    const steamInfo = GM_getValue('steamInfo') || {
      userName: '',
      steam64Id: '',
      communitySessionID: '',
      storeSessionID: '',
      updateTime: 0
    }
    function reLoad(time,sum){
        let date=new Date();
        let hour=date.getHours();
        let min=date.getMinutes()<10?("0"+date.getMinutes()):date.getMinutes();
        if(GM_getValue("start")==1){
            $(".border-bottom").text(hour+":"+min+" 执行新任务检测");
            $.ajax({
                url:"/entries/load",
                type:"get",
                headers:{'x-csrf-token': $('meta[name="csrf-token"]').attr('content')},
                success:(data)=>{
                    if(data && (data.actions && (data.actions.length > sum) )){
                        console.log(data);
                        let date=new Date();
                        let hour=date.getHours();
                        let min=date.getMinutes()<10?("0"+date.getMinutes()):date.getMinutes();
                        $(".border-bottom").text(hour+":"+min+" 检测到新任务");
                        $show({
                            title:"keyjoker新任务",
                            msg:"keyjoker网站更新"+(data.actions.length-sum)+"个新任务！",
                            icon:"https://www.keyjoker.com/favicon-32x32.png",
                            time:0,
                            onclick:function(){
                                location.reload(true);
                            }
                        });
                        // 新窗口打开任务链接（免跳转）
                        for(var i = 0; i < data.actions.length; i++)
                        {
                            if(data.actions[i].task.name == "Join Steam Group")
                                continue;
                            console.log(data.actions[i]);
                            window.open(data.actions[i].data.url + "?type=keyjoker");
                        }
                        func.do_task(data);
                        // 重载任务列表
                        document.getElementsByClassName("row")[1].parentNode.removeChild(document.getElementsByClassName("row")[1]);
                        $('.layout-container').append('<entries-component></entries-component>');
                        $.getScript("/js/app.js");
                        // 检查任务是否完成
                        let checkComplete=setInterval(()=>{
                            if(document.getElementsByClassName("card mb-4 list-complete-item").length == 0){
                                // 停止检查操作
                                clearInterval(checkComplete);
                                // 重新开始检查任务
                                setTimeout(()=>{
                                    reLoad(time,0);
                                },time);
                            }else
                            {
                                if(GM_getValue("autoRedeem"))
                                {
                                    func.redeem();
                                }
                            }
                        },10000);
                    }else{
                        setTimeout(()=>{
                            reLoad(time,sum);
                        },time);
                    }
                },
                error:(err)=>{
                    window.location.reload(true);
                }
            });
        }
    }
    function setTime(){
        let time=prompt('请输入获取任务信息的时间间隔(单位:秒)：');
        if(!isNaN(time)){
            GM_setValue("time",parseInt(time));
        }
    }
    function start(){
        // $showTest();
        GM_setValue("start",1);
        let time=GM_getValue("time");
        if(!time){
            time=60;
        }
        if(confirm("是否以时间间隔"+time+"秒进行任务检测？")){
            next();
        }
    }
    function next(){
        let time=GM_getValue("time");
        if(!time){
            time=60;
        }
        let sum=$(".list-complete-item").length;
        if(sum>0){
            reLoad(time*1000,sum);
        }else{
            reLoad(time*1000,0);
        }
    }
    const func = {
        httpRequest: function (e) {
            const requestObj = {}
            requestObj.url = e.url
            requestObj.method = e.method.toUpperCase()
            requestObj.timeout = e.timeout || 30000
            if (e.dataType) requestObj.responseType = e.dataType
            if (e.headers) requestObj.headers = e.headers
            if (e.data) requestObj.data = e.data
            if (e.onload) requestObj.onload = e.onload
            requestObj.ontimeout = e.ontimeout || function (data) {
                if (debug) console.log(data)
                if (e.status) e.status.error('Error:Timeout(0)')
                if (e.r) e.r({ result: 'error', statusText: 'Timeout', status: 0, option: e })
            }
            requestObj.onabort = e.onabort || function (data) {
                if (debug) console.log(data)
                if (e.status) e.status.error('Error:Aborted(0)')
                if (e.r) e.r({ result: 'error', statusText: 'Aborted', status: 0, option: e })
            }
            requestObj.onerror = e.onerror || function (data) {
                if (debug) console.log(data)
                if (e.status) e.status.error('Error:Error(0)')
                if (e.r) e.r({ result: 'error', statusText: 'Error', status: 0, option: e })
            }
            if (debug) console.log('发送请求:', requestObj)
            GM_xmlhttpRequest(requestObj)
        },
        updateSteamInfo: function (r, type = 'all', update = false) {
            if (new Date().getTime() - steamInfo.updateTime > 10 * 60 * 1000 || update) {
                const pro = []
                if (type === 'community' || type === 'all') {
                    pro.push(new Promise((resolve, reject) => {
                        this.httpRequest({
                            url: 'https://steamcommunity.com/my',
                            method: 'GET',
                            onload: (response) => {
                                if (debug) console.log(response)
                                if (response.status === 200) {
                                    if ($(response.responseText).find('a[href*="/login/home"]').length > 0) {
                                        console.log(Error('Not Login'))
                                    } else {
                                        const steam64Id = response.responseText.match(/g_steamID = "(.+?)";/)
                                        const communitySessionID = response.responseText.match(/g_sessionID = "(.+?)";/)
                                        const userName = response.responseText.match(/steamcommunity.com\/id\/(.+?)\/friends\//)
                                        if (steam64Id) steamInfo.steam64Id = steam64Id[1]
                                        if (communitySessionID) steamInfo.communitySessionID = communitySessionID[1]
                                        if (userName) steamInfo.userName = userName[1]
                                        console.log("community update")
                                        resolve()
                                    }
                                } else {
                                    console.log('Error:' + response.statusText + '(' + response.status + ')')
                                    console.log(Error('Request Failed'))
                                }
                            },
                            r: resolve,
                            status
                        })
                    }))
                }
                if (type === 'store' || type === 'all') {
                    pro.push(new Promise((resolve, reject) => {

                        this.httpRequest({
                            url: 'https://store.steampowered.com/stats/',
                            method: 'GET',
                            onload: (response) => {
                                if (debug) console.log(response)
                                if (response.status === 200) {
                                    if ($(response.responseText).find('a[href*="/login/"]').length > 0) {
                                        status.error('Error:' + getI18n('loginSteamStore'), true)
                                        reject(Error('Not Login'))
                                    } else {
                                        const storeSessionID = response.responseText.match(/g_sessionID = "(.+?)";/)
                                        if (storeSessionID) steamInfo.storeSessionID = storeSessionID[1]
                                        console.log("storeInfo updated");
                                        resolve();
                                    }
                                } else {
                                    console.log('Error:' + response.statusText + '(' + response.status + ')')
                                    reject(Error('Request Failed'))
                                }
                            },
                            r: resolve,
                            status
                        })
                    }))
                }
                Promise.all(pro).then(() => {
                    steamInfo.updateTime = new Date().getTime()
                    GM_setValue('steamInfo', steamInfo)
                    r(1)
                }).catch(err => {
                    console.error(err)
                })
            } else {
                r(1)
            }
        },
        redeem: function(){
            var elem = document.getElementsByClassName("col-md-12")[1].getElementsByTagName("button");
            for(var i = 0; i < elem.length; i++)
            {
                if(typeof elem[i] != "undefined")
                {
                    elem[i].click();
                }
            }
        },
        hcaptcha: function () {
            let hcaptchaClick=setInterval(()=>{
                console.log("hCaptcha");
                if(document.getElementsByTagName('button').length == 1)
                {
                    if(document.getElementsByTagName('button')[0].innerText == "Login")
                    {
                        console.log("Login");
                        document.getElementsByTagName('button')[0].click();
                    }else if(document.getElementsByTagName('button')[0].innerText == "Set Cookie"){
                        console.log("Set Cookie");
                        document.getElementsByTagName('button')[0].click();
                        let checkClose=setInterval(()=>{
                            if(document.getElementsByTagName('span')[0].innerText == "Cookie set.")
                            {
                                console.log("Cookie set");
                                window.close();
                                clearInterval(checkClose);
                            }
                        }, 1000);
                        clearInterval(hcaptchaClick);
                    }
                }
            },1000);
        },
        // 人机验证出现图片时的处理
        hcaptcha2: function () {
            let hcaptcha2Click=setInterval(()=>{
                if(document.getElementsByClassName("challenge-container")[0].children.length != 0)
                {
                    console.log("open hcaptcha");
                    this.httpRequest({
                        url: 'https://accounts.hcaptcha.com/accessibility/get_cookie',
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json'},
                        onload: (response) => {
                            console.log(response);
                            if(response.state == 401)
                            {
                                alert("获取免验证cookie失败，将在新窗口打开至cookie获取页面");
                                window.open("https://dashboard.hcaptcha.com/welcome_accessibility");
                            }
                        }
                    })
                    clearInterval(hcaptcha2Click);
                }
            },1000);
        },
        twitch: function () {
            if(document.referrer.indexOf("keyjoker") != -1)
            {
                let twitchClick=setInterval(()=>{
                    if(document.getElementsByClassName("follow-btn__follow-btn").length == 1)
                    {
                        document.getElementsByClassName("follow-btn__follow-btn")[0].getElementsByTagName("button")[0].click();
                        clearInterval(twitchClick);
                    }
                }, 1000);
            }
        },
        steamcommunity: function () {
            if(document.referrer.indexOf("keyjoker") != -1)
            {
                // 来源keyjoker
                switch(location.pathname.split("/")[1])
                {
                    case "groups":
                        // 加组
                        {
                            let steamClick=setInterval(()=>{
                                if(document.getElementsByClassName("grouppage_join_area").length == 1)
                                {
                                    document.getElementsByClassName("grouppage_join_area")[0].getElementsByTagName("a")[0].click();
                                    clearInterval(steamClick);
                                }
                            }, 1000);
                        }
                        break;
                    case "profiles":
                        // 评论
                        {
                            let profileClick=setInterval(()=>{
                                if(document.getElementsByClassName("commentthread_entry_quotebox").length == 1 && document.getElementsByClassName("commentthread_comments")[0].innerText.indexOf(document.getElementById("account_pulldown").innerText) != -1)
                                {
                                    document.getElementsByClassName("commentthread_entry_quotebox")[0].firstElementChild.value="+rep";
                                    document.getElementsByClassName("commentthread_entry_submitlink")[0].getElementsByClassName("btn_green_white_innerfade btn_small")[0].click();
                                    clearInterval(profileClick);
                                }
                            }, 1000);
                        }
                        break;
                    default :
                        break;
                }
            }
        },
        // steam个人资料回复"+rep"
        steamRep: function(url){
            let id = url.split("s/")[1];
            this.updateSteamInfo(() => {
                this.httpRequest({
                    url: 'https://steamcommunity.com/comment/Profile/post/' + id + '/-1/',
                    method: 'POST',
                    data: {
                        comment:'+rep',
                        count:6,
                        sessionid:steamInfo.communitySessionID,
                        feature2:-1
                    },
                    onload: (response) => {
                        console.log(response);
                    }
                });
            })
        },
        joinSteamGroup: function (r, group) {
            this.updateSteamInfo(() => {
                if(debug){console.log("====steamInfo====");console.log(steamInfo);}
                this.httpRequest({
                    url: 'https://steamcommunity.com/groups/' + group,
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                    data: $.param({ action: 'join', sessionID: steamInfo.communitySessionID }),
                    onload: (response) => {
                        if (debug) console.log(response)
                        if (response.status === 200 && !response.responseText.includes('grouppage_join_area')) {
                            status.success()
                            r({ result: 'success', statusText: response.statusText, status: response.status })
                        } else {
                            status.error('Error:' + response.statusText + '(' + response.status + ')')
                            r({ result: 'error', statusText: response.statusText, status: response.status })
                        }
                    }
                })
            });
        },
        twitterRetweet: function(){
            if(document.referrer.indexOf("keyjoker") != -1)
            {
                let twitterClick=setInterval(()=>{
                    if(document.getElementsByTagName("article").length > 0)
                    {
                        console.log("Retweet");
                        $('div[data-testid="retweet"]')[0].click();
                        $('div[data-testid="retweetConfirm"]').click();
                        clearInterval(twitterClick);
                        let twitterClose=setInterval(()=>{
                            console.log(jQuery('div[data-testid="placementTracking"]').length + "--" + jQuery('div[data-testid="placementTracking"]')[0].innerText);
                            if($('div[data-testid="unretweet"]').length>0)
                            {
                                window.close();
                                clearInterval(twitterClose);
                            }
                        },1000);
                    }
                },1000);
            }
        },
        twitterFollow: function(){
            console.log("执行twitterFollow");
            let twitterClick=setInterval(()=>{
                if($('div[data-testid="placementTracking"]').length > 0)
                {
                    $('div[data-testid="placementTracking"]')[0].children[0].children[0].click();
                    clearInterval(twitterClick);
                    let twitterClose=setInterval(()=>{
                        console.log(jQuery('div[data-testid="placementTracking"]').length + "--" + jQuery('div[data-testid="placementTracking"]')[0].innerText);
                        if(jQuery('div[data-testid="placementTracking"]').length == 1 && jQuery('div[data-testid="placementTracking"]')[0].innerText == "正在关注")
                        {
                            window.close();
                            clearInterval(twitterClose);
                        }
                    },1000);
                }
            },1000);
        },
        discord: function(){
            let discordClick=setInterval(()=>{
                if(document.getElementsByTagName("button").length == 1 && document.getElementsByTagName("button")[0].innerText == "接受邀请")
                {
                    document.getElementsByTagName("button")[0].click();
                    clearInterval(discordClick);
                }
            },1000);
        },
        spotify: function(){
            let spotifyClick=setInterval(()=>{
                if(document.getElementsByClassName("spoticon-heart-32").length == 1)
                {
                    document.getElementsByClassName("spoticon-heart-32")[0].click();
                    clearInterval(spotifyClick);
                }
            },1000);
        },
        do_task: function(data){
            for(const task of data.actions)
            {
                switch(task.task.name)
                {
                    case "Join Steam Group":
                        console.log(task);
                        this.updateSteamInfo('all');
                        this.joinSteamGroup(console.log, task.data.gid);
                        break;
                    default:
                        break;
                }
            }
        },
        test: function(){
            this.updateSteamInfo(() => {
                console.log("====steamInfo====")
                console.log(steamInfo);
            });
        }
    }
    if(debug)func.test();
    function appHandle(){
        switch(location.hostname)
        {
            case "dashboard.hcaptcha.com":
                // hcaptcha 登录、设置Cookie
                //func.hcaptcha();
                break;
            case "store.steampowered.com":
                // Steam 添加愿望单
                if(document.referrer.indexOf("keyjoker") != -1)
                {
                    document.getElementById("add_to_wishlist_area").lastElementChild.click();
                }
                break;
            case "www.twitch.tv":
                // twitch关注
                func.twitch();
                break;
            case "steamcommunity.com":
                // Steam 回复“+rep”
                func.steamcommunity();
                break;
            case "twitter.com":
                // retweet
                func.twitterRetweet();
                func.twitterFollow();
                break;
            case "discord.com":
                // Discord
                func.discord();
                break;
            case "open.spotify.com":
                // spotify
                func.spotify();
                break;
            case "assets.hcaptcha.com":
                // 人机验证
                func.hcaptcha2();
                break;
            default :
                break;
        }
    }
    console.log("load in " + location.hostname);
    if(document.getElementsByClassName("cf-section cf-highlight cf-captcha-container").length != 0)
    {
        console.log("cf验证页面！");
    }else if(document.getElementById("logout-form") && location.search !== "")
    {
        location.href = location.pathname;
    }else if(location.href == "https://www.keyjoker.com/entries")
    {
        console.log("keyjoker页面！");
        if(document.getElementsByClassName("nav-item active")[0].innerText == "Earn Credits")
        {
            let isStart=setInterval(()=>{
                if(GM_getValue("start")==1){
                    clearInterval(isStart);
                    next();
                }
            },1000);
        }
    }else{
        console.log("appHandle");
        appHandle();
    }
    GM_registerMenuCommand("设置时间间隔",setTime);
    GM_registerMenuCommand("开始检测",start);
    GM_registerMenuCommand("停止检测",()=>{
        let date=new Date();
        let hour=date.getHours();
        let min=date.getMinutes()<10?("0"+date.getMinutes()):date.getMinutes();
        GM_setValue("start",0);
        $(".border-bottom").text(hour+":"+min+" 停止执行新任务检测");
    });
    GM_registerMenuCommand("开启自动redeem",()=>{
        GM_setValue("autoRedeem",1);
    });
    GM_registerMenuCommand("关闭自动redeem",()=>{
        GM_setValue("autoRedeem",0);
    });
})();