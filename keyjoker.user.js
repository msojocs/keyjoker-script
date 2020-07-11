// ==UserScript==
// @name         keyjoker半自动任务（伪）
// @namespace    https://greasyfork.org/zh-CN/scripts/406476
// @version      0.5
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
// @grant        GM_unregisterMenuCommand
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
// @connect      discord.com
// @connect      twitch.tv
// @connect      *
// @require      https://greasyfork.org/scripts/379868-jquery-not/code/jQuery%20not%20$.js?version=700787
// @require      https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// ==/UserScript==

(function() {
    'use strict';
    // 21点56分
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
                        // 选定任务执行模式
                        if(GM_setValue("advanceMode"))func.do_task(data);
                        else{
                            for(var i = 0; i < data.actions.length; i++)window.open(data.actions[i].data.url + "?type=keyjoker");
                        }
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
        // [修改自https://greasyfork.org/zh-CN/scripts/370650]
        httpRequest: function (e) {
            const requestObj = {}
            requestObj.url = e.url
            requestObj.method = e.method.toUpperCase()
            requestObj.timeout = e.timeout || 30000
            if (e.dataType) requestObj.responseType = e.dataType
            if (e.headers) requestObj.headers = e.headers
            if (e.data) requestObj.data = e.data
            if (e.cookie) requestObj.cookie = e.cookie
            if (e.anonymous) requestObj.anonymous = e.anonymous
            if (e.onload) requestObj.onload = e.onload
            if (e.fetch) requestObj.fetch = e.fetch
            if (e.onreadystatechange) requestObj.onreadystatechange = e.onreadystatechange
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
        // steam信息更新[修改自https://greasyfork.org/zh-CN/scripts/370650]
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
        // steam个人资料回复"+rep"
        steamRepAuto: function(url){
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
        // steam加组[修改自https://greasyfork.org/zh-CN/scripts/370650]
        joinSteamGroupAuto: function (r, group) {
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
        // steam加愿望单（In Progress）[修改自https://greasyfork.org/zh-CN/scripts/370650]
        steamAddWishlistAuto: function (r, gameId) {
            new Promise(resolve => {
                this.httpRequest({
                    url: 'https://store.steampowered.com/api/addtowishlist',
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                    data: $.param({ sessionid: steamInfo.storeSessionID, appid: gameId }),
                    dataType: 'json',
                    onload: function (response) {
                        if (debug) console.log(response)
                        if (response.status === 200 && response.response && response.response.success === true) {
                            resolve({ result: 'success', statusText: response.statusText, status: response.status })
                        } else {
                            resolve({ result: 'error', statusText: response.statusText, status: response.status })
                        }
                    },
                    onabort: response => { resolve({ result: 'error', statusText: response.statusText, status: response.status }) },
                    onerror: response => { resolve({ result: 'error', statusText: response.statusText, status: response.status }) },
                    ontimeout: response => { resolve({ result: 'error', statusText: response.statusText, status: response.status }) },
                    r: resolve
                })
            }).then(result => {
                if (result.result === 'success') {
                    r(result)
                } else {
                    this.httpRequest({
                        url: 'https://store.steampowered.com/app/' + gameId,
                        method: 'GET',
                        onload: function (response) {
                            if (debug) console.log(response)
                            if (response.status === 200) {
                                if (response.responseText.includes('class="queue_actions_ctn"') && response.responseText.includes('已在库中')) {
                                    r({ result: 'success', statusText: response.statusText, status: response.status, own: true })
                                } else if ((response.responseText.includes('class="queue_actions_ctn"') && response.responseText.includes('添加至您的愿望单')) || !response.responseText.includes('class="queue_actions_ctn"')) {
                                    console.error('Error:' + result.statusText + '(' + result.status + ')')
                                    r({ result: 'error', statusText: response.statusText, status: response.status })
                                } else {
                                    r({ result: 'success', statusText: response.statusText, status: response.status })
                                }
                            } else {
                                console.error('Error:' + result.statusText + '(' + result.status + ')')
                                r({ result: 'error', statusText: response.statusText, status: response.status })
                            }
                        },
                        r
                    })
                }
            }).catch(err => {
                console.error(err)
            })
        },
        // OK
        twitterFollowAuto: function(url){
            if(debug){console.log("====twitterFollowAuto====");console.log(steamInfo);}
            let userName = url.split("com/")[1];
            this.twitterGetUserInfo((obj)=>{
                console.log(obj.data.user.rest_id)
                let userId = obj.data.user.rest_id;
                this.httpRequest({
                    url: 'https://api.twitter.com/1.1/friendships/create.json',
                    method: 'POST',
                    headers: { authorization: GM_getValue("twitterAuth"), 'Content-Type': 'application/x-www-form-urlencoded', 'x-csrf-token':GM_getValue("twitterCookie").match(/ct0=(.+?); /)[1]},
                    data: $.param({ include_profile_interstitial_type: 1,include_blocking: 1,include_blocked_by: 1,include_followed_by: 1,include_want_retweets: 1,include_mute_edge: 1,include_can_dm: 1,include_can_media_tag: 1,skip_status: 1,id: userId}),
                    onload: (response) => {
                        if (debug) console.log(response)
                        if (response.status === 200) {
                            console.log("success")
                            console.log({ result: 'success', statusText: response.statusText, status: response.status })
                        } else {
                            console.log('Error:' + response.statusText + '(' + response.status + ')')
                            console.log({ result: 'error', statusText: response.statusText, status: response.status })
                        }
                    }
                })
            }, userName);
        },
        // OK
        twitterRetweetAuto: function(url){
            if(debug){console.log("====twitterRetweetAuto====");console.log(steamInfo);}
            let retweetId = url.split("status/")[1];
            this.httpRequest({
                url: 'https://api.twitter.com/1.1/statuses/retweet.json',
                method: 'POST',
                headers: { authorization: GM_getValue("twitterAuth"), 'Content-Type': 'application/x-www-form-urlencoded', 'x-csrf-token':GM_getValue("twitterCookie").match(/ct0=(.+?); /)[1]},
                data: $.param({ tweet_mode: "extended",id: retweetId}),
                onload: (response) => {
                    if (debug) console.log(response)
                    if (response.status === 200 || (response.status === 403 && response.responseText == '{"errors":[{"code":327,"message":"You have already retweeted this Tweet."}]}')) {
                        console.log("success");
                        if(debug)console.log({ result: 'success', statusText: response.statusText, status: response.status });
                    } else {
                        console.log('Error:' + response.statusText + '(' + response.status + ')')
                        console.log({ result: 'error', statusText: response.statusText, status: response.status })
                    }
                }
            })
        },
        twitterGetUserInfo: function(r, userName){
            if(debug)console.log("====twitterGetUserInfo====");
            console.log(document.cookie)
            this.httpRequest({
                url: 'https://api.twitter.com/graphql/-xfUfZsnR_zqjFd-IfrN5A/UserByScreenName?variables=%7B%22screen_name%22%3A%22' + userName + '%22%2C%22withHighlightedLabel%22%3Atrue%7D',
                method: 'GET',
                headers: { authorization: GM_getValue("twitterAuth"), "content-type": "application/json"},
                onload: (response) => {
                    if (response.status === 200) {
                        console.log({ result: 'success', statusText: response.statusText, status: response.status })
                        r(JSON.parse(response.responseText));
                    } else {
                        console.log('Error:' + response.statusText + '(' + response.status + ')')
                        console.log({ result: 'error', statusText: response.statusText, status: response.status })
                    }
                },
                error:(res)=>{
                    console.log("error");
                    console.log(res);
                },
                anonymous:true
            })
        },
        discordJoinServerAuto: function(server){
            this.httpRequest({
                url: 'https://discord.com/api/v6/invites/' + server,
                method: 'POST',
                headers: { authorization: GM_getValue("discordAuth"), "content-type": "application/json"},
                onload: (response) => {
                    if (response.status === 200 && response.responseText.indexOf('"new_member": true') != -1) {
                        console.log({ result: 'success', statusText: response.statusText, status: response.status })
                    } else {
                        console.log('Error:' + response.statusText + '(' + response.status + ')')
                        console.log({ result: 'error', statusText: response.statusText, status: response.status })
                    }
                },
                error:(res)=>{
                    console.error(res);
                },
                anonymous:true
            })
        },
        twitchFollowAuto: function(channels){
            this.twitchGetIdAuto(
                (id)=>{
                    this.httpRequest({
                        url: 'https://gql.twitch.tv/gql',
                        method: 'POST',
                        headers: { Authorization: "OAuth " + GM_getValue("twitchAuth").match(/auth-token=(.+?); /)[1]},
                        data: '[{"operationName":"FollowButton_FollowUser","variables":{"input":{"disableNotifications":false,"targetID":"' + id + '"}},"extensions":{"persistedQuery":{"version":1,"sha256Hash":"3efee1acda90efdff9fef6e6b4a29213be3ee490781c5b54469717b6131ffdfe"}}}]',
                        onload: (response) => {
                            if (debug) console.log(response)
                            if (response.status === 200) {
                                console.log("success")
                                console.log({ result: 'success', statusText: response.statusText, status: response.status })
                            } else {
                                console.log('Error:' + response.statusText + '(' + response.status + ')')
                                console.log({ result: 'error', statusText: response.statusText, status: response.status })
                            }
                        }
                    })
                },channels
            );
        },
        twitchGetIdAuto: function(r, channels)
        {
            this.httpRequest({
                url: 'https://api.twitch.tv/api/channels/' + channels + '/access_token?oauth_token=' + GM_getValue("twitchAuth").match(/auth-token=(.+?); /)[1] + '&need_https=true&platform=web&player_type=site&player_backend=mediaplayer',
                method: 'GET',
                onload: (response) => {
                    if (response.status === 200) {
                        console.log({ result: 'success', statusText: response.statusText, status: response.status })
                        let rep = JSON.parse(JSON.parse(response.responseText).token);
                        r(rep.channel_id);
                    } else {
                        console.log('Error:' + response.statusText + '(' + response.status + ')')
                        console.log({ result: 'error', statusText: response.statusText, status: response.status })
                    }
                },
                error:(res)=>{
                    console.log("error");
                    console.log(res);
                },
                anonymous:true
            })
        },
        spotifyLikeAuto: function(albums){
            this.spotifyGetUserInfo((userId, accessToken)=>{
                $.ajax({
                    type: 'PUT',
                    url: "https://spclient.wg.spotify.com/collection-view/v1/collection/albums/" + userId + "?base62ids=" + albums + "&model=bookmark",
                    headers: {authorization: "Bearer " + accessToken},
                    success: function(data){
                        console.log(data);
                    },
                    error: function(data){
                        console.error(data);
                    },
                    anonymous:true
                });
            });
        },
        spotifyGetUserInfo: function(r){
            this.spotifyGetAccessToken(
                (accessToken)=>{
                    this.httpRequest({
                        url: 'https://api.spotify.com/v1/me',
                        method: 'GET',
                        headers:{authorization: "Bearer " + accessToken},
                        onload: (response) => {
                            if (response.status === 200) {
                                console.log({ result: 'success', statusText: response.statusText, status: response.status })
                                r(JSON.parse(response.responseText).id, accessToken);
                            } else {
                                console.log('Error:' + response.statusText + '(' + response.status + ')')
                                console.log({ result: 'error', statusText: response.statusText, status: response.status })
                            }
                        },
                        error:(res)=>{
                            console.log("error");
                            console.log(res);
                        },
                        anonymous:true
                    })
                }
            )
        },
        spotifyGetAccessToken: function(r){
            this.httpRequest({
                url: 'https://open.spotify.com/get_access_token?reason=transport&productType=web_player',
                method: 'GET',
                onload: (response) => {
                    if (response.status === 200) {
                        console.log(response)
                        console.log({ result: 'success', statusText: response.statusText, status: response.status })
                        r(JSON.parse(response.responseText).accessToken);
                    } else {
                        console.log('Error:' + response.statusText + '(' + response.status + ')')
                        console.log({ result: 'error', statusText: response.statusText, status: response.status })
                    }
                },
                error:(res)=>{
                    console.log("error");
                    console.log(res);
                }
            })
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
                if(document.getElementsByClassName("challenge-container").length != 0 && document.getElementsByClassName("challenge-container")[0].children.length != 0)
                {
                    console.log("open hcaptcha");
                    let text = document.getElementsByClassName("prompt-text")[0].innerText;
                    document.getElementsByClassName("prompt-text")[0].innerText = text + "\n正在自动获取免验证Cookie";
                    this.httpRequest({
                        url: 'https://accounts.hcaptcha.com/accessibility/get_cookie',
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json'},
                        onload: (response) => {
                            if(response.status == 200)
                            {
                                document.getElementsByClassName("prompt-text")[0].innerText = text + "\n免验证Cookie获取成功，请重新点击验证框";
                            }else if(response.status == 401)
                            {
                                document.getElementsByClassName("prompt-text")[0].innerText = text + "\n当前IP的免验证Cookie获取次数已达上限，请更换assets.hcaptcha.com的代理IP";
                            }else if(response.status == 500)
                            {
                                document.getElementsByClassName("prompt-text")[0].innerText = text + "\n未登录hCaptcha，将在3秒后打开至登录页面";
                                setTimeout(()=>{window.open("https://dashboard.hcaptcha.com/welcome_accessibility")}, 3000);
                            }else{
                                console.error(response);
                                document.getElementsByClassName("prompt-text")[0].innerText = text + "\n发生未知错误,已将数据记录至控制台";
                            }
                        },
                        error: () =>{
                            console.error("error")
                        }
                    })
                    clearInterval(hcaptcha2Click);
                }
            },1000);
        },
        steamcommunityClick: function () {
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
        twitchFollowClick: function () {
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
        twitterRetweetClick: function(){
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
        twitterFollowClick: function(){
            if(debug) console.log("执行twitterFollowClick");
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
        joinDiscordServerClick: function(){
            let discordClick=setInterval(()=>{
                if(document.getElementsByTagName("button").length == 1 && document.getElementsByTagName("button")[0].innerText == "接受邀请")
                {
                    document.getElementsByTagName("button")[0].click();
                    clearInterval(discordClick);
                }
            },1000);
        },
        spotifyLikeClick: function(){
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
                        // this.updateSteamInfo('all');
                        this.joinSteamGroupAuto(console.log, task.data.gid);
                        break;
                    case "Follow Twitter Account":
                        if(GM_getValue("twitterAuth"))
                        {
                            this.twitterFollowAuto(data.data.url);
                        }else{
                            window.open(task.data.url + "?type=keyjoker");
                        }
                        break;
                    case "Join Discord Server":
                        if(GM_getValue("discordAuth"))
                        {
                            let server = data.data.url.split(".gg/")[1];
                            this.discordJoinServerAuto(server)
                        }else{
                            window.open(task.data.url + "?type=keyjoker");
                        }
                        break;
                    case "Retweet Twitter Tweet":
                        if(GM_getValue("twitterAuth"))
                        {
                            this.twitterRetweetAuto(data.data.url);
                        }else{
                            window.open(task.data.url + "?type=keyjoker");
                        }
                        break;
                    case "Like Spotify Albums":
                        var albums = data.data.url.split("album/")[1];
                        this.spotifyLikeAuto(albums);
                        break;
                    default:
                        window.open(task.data.url + "?type=keyjoker");
                        break;
                }
            }
        },
        test: function(){
            this.setAuth();
            this.spotifyLikeAuto("6m0AchDE7CuNfRE7CW48uH");
        },
        setAuth: function(type){
            if(!GM_getValue("twitterAuth") || type == "twitter")
            {
                let twitterAuth = prompt('请输入TwitterAuth：');
                if(twitterAuth.length > 0){
                    GM_setValue("twitterAuth", twitterAuth);
                }
            }
            if(!GM_getValue("twitterCookie") || type == "twitter")
            {
                let twitterCookie = prompt('请输入TwitterCookie：');
                if(twitterCookie.length > 0){
                    GM_setValue("twitterCookie", twitterCookie);
                }
            }
            if(!GM_getValue("discordAuth") || type == "discord")
            {
                let discordAuth = prompt('请输入discordAuth：');
                if(discordAuth.length > 0){
                    GM_setValue("discordAuth", discordAuth);
                }
            }
            if(!GM_getValue("twitchAuth") || type == "twitch")
            {
                console.log("在新窗口获取twitch凭证");
                window.open("https://www.twitch.tv/settings/profile?keyjokertask=storageCookie");
            }
        }
    }
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
                if(location.search == "?keyjokertask=storageCookie")
                {
                    GM_setValue("twitchAuth", document.cookie);
                    window.close();
                }
                // twitch关注
                if(document.referrer.indexOf("keyjoker") != -1)func.twitchFollowClick();
                break;
            case "steamcommunity.com":
                // Steam 回复“+rep”
                if(document.referrer.indexOf("keyjoker") != -1)func.steamcommunityClick();
                break;
            case "twitter.com":
                // retweet
                if(document.referrer.indexOf("keyjoker") != -1)func.twitterRetweetClick();
                if(document.referrer.indexOf("keyjoker") != -1)func.twitterFollowClick();
                break;
            case "discord.com":
                // Discord
                if(document.referrer.indexOf("keyjoker") != -1)func.joinDiscordServerClick();
                break;
            case "open.spotify.com":
                // spotify
                if(document.referrer.indexOf("keyjoker") != -1)func.spotifyLikeClick();
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
        if(document.getElementsByClassName("nav-item active").length != 0 && document.getElementsByClassName("nav-item active")[0].innerText == "Earn Credits")
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
    function advanceModeSwitch(id){
        GM_unregisterMenuCommand(id);
        if(!GM_getValue("advanceMode"))
        {
            let id = GM_registerMenuCommand("开启高级模式",()=>{
                GM_setValue("advanceMode",1);
                advanceModeSwitch(id);
            });
        }else{
            let id = GM_registerMenuCommand("关闭高级模式",()=>{
                GM_setValue("advanceMode",0);
                advanceModeSwitch(id);
            });
        }
    }
    advanceModeSwitch(null);
    if(debug)
    {
        GM_registerMenuCommand("Test",()=>{
            func.test();
        });
    }
})();