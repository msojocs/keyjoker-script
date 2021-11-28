// ==UserScript==
// @name         KeyJoker Auto Task
// @namespace    KeyJokerAutoTask
// @version      1.0.0
// @description  KeyJoker Auto Task,修改自https://greasyfork.org/zh-CN/scripts/383411
// @author       祭夜
// @icon         https://www.jysafe.cn/assets/images/avatar.jpg
// @include      *://www.keyjoker.com/entries*
// @include      *://assets.hcaptcha.com/*
// @include      *://discord.com/channels/@me?keyjokertask=storageAuth
// @include      *://www.twitch.tv/settings/profile?keyjokertask=storageAuth
// @include      *://twitter.com/settings/account?keyjokertask=storageAuth
// @updateURL    https://github.com/jiyeme/keyjokerScript/raw/master/keyjoker.user.js
// @downloadURL  https://github.com/jiyeme/keyjokerScript/raw/master/keyjoker.user.js
// @supportURL   https://www.jysafe.cn/4332.air
// @homepage     https://github.com/jiyeme/keyjokerScript/
// @run-at       document-start
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_openInTab
// @grant        GM_log
// @grant       GM_notification
// @connect      hcaptcha.com
// @connect      store.steampowered.com
// @connect      steamcommunity.com
// @connect      twitter.com
// @connect      facebook.com
// @connect      discord.com
// @connect      twitch.tv
// @connect      tumblr.com
// @connect      spotify.com
// @connect      jysafe.cn
// @require      https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// @require      https://cdn.jsdelivr.net/gh/jiyeme/keyjokerScript@e1f9bc6ca24cf7e8f734bd910306737449a26830/keyjoker.ext.js
// ==/UserScript==

(function() {
    'use strict';
    const debug = true;
    const discordAuth = GM_getValue('discordAuth') || {
        authorization: "",
        status:0,
        updateTime: 0
    }
    // steam信息
    const steamInfo = GM_getValue('steamInfo') || {
        userName: '',
        steam64Id: '',
        communitySessionID: '',
        storeSessionID: '',
        comUpdateTime: 0,
        storeUpdateTime: 0
    }
    const twitchAuth = GM_getValue('twitchAuth') || {
        "auth-token": "",
        status:0,
        updateTime: 0
    }
    const twitterAuth = GM_getValue('twitterAuth') || {
        authorization: "AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA",
        ct0: '',
        status: 0,
        updateTime: 0
    }
    const jq = $;
    let completeCheck = null;

    // 0-未动作|200-成功取得|401未登录|603正在取得
    const getAuthStatus = {
        discord: false,
        spotify: false,
        steamStore: 0,
        steamCom: 0,
        tumblr: false,
        twitch: false,
        twitter: 0
    }
    var checkSwitchId = null;
    const noticeFrame = {
        loadFrame: ()=>{
            if(debug)console.log("loadFrame");
            jq('body').append(`<style>
.fuck-task-logs li{display:list-item !important;float:none !important}
#extraBtn .el-badge.item{margin-bottom:4px !important}
#extraBtn .el-badge.item sup{padding-right:0 !important}
.fuck-task-logs{width:auto;max-width:50%;max-height:50%;z-index:99999999999 !important}
.fuck-task-logs .el-notification__group{width:100%}
.fuck-task-logs .el-notification__title{text-align:center}
.fuck-task-logs .el-notification__content{overflow:auto;max-height:230px}
font.start{color:black;}
font.success{color:green;}
font.error{color:red;}
font.warning{color:#00f;}
font.wait{color:#9c27b0;}
[class^=el-icon-]{font-family:element-icons !important;speak:none;font-style:normal;font-weight:400;font-variant:normal;text-transform:none;line-height:1;vertical-align:baseline;display:inline-block;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}
.el-icon-brush:before{content:"\\e76e"}
.el-icon-document:before{content:"\\e785"}
.el-icon-refresh:before{content:"\\e6d0"}
.el-icon-s-promotion:before{content:"\\e7ba"}
.el-icon-setting:before{content:"\\e6ca"}
.el-icon-video-play:before{content:"\\e7c0"}
.el-notification{display:-webkit-box;display:-ms-flexbox;display:flex;padding:14px 26px 14px 13px;border-radius:8px;-webkit-box-sizing:border-box;box-sizing:border-box;border:1px solid #ebeef5;position:fixed;background-color:#fff;-webkit-box-shadow:0 2px 12px 0 rgba(0,0,0,.1);box-shadow:0 2px 12px 0 rgba(0,0,0,.1);-webkit-transition:opacity .3s,left .3s,right .3s,top .4s,bottom .3s,-webkit-transform .3s;transition:opacity .3s,left .3s,right .3s,top .4s,bottom .3s,-webkit-transform .3s;transition:opacity .3s,transform .3s,left .3s,right .3s,top .4s,bottom .3s;transition:opacity .3s,transform .3s,left .3s,right .3s,top .4s,bottom .3s,-webkit-transform .3s;overflow:hidden}
.el-notification__group{margin-left:13px;margin-right:8px}
.el-notification__title{font-weight:700;font-size:16px;color:#303133;margin:0}
.el-notification__content{font-size:14px;line-height:21px;margin:6px 0 0;color:#606266;text-align:justify}
.el-notification__content p{margin:0}
.el-badge{position:relative;vertical-align:middle;display:inline-block}
.el-badge__content{background-color:#f56c6c;border-radius:10px;color:#fff;display:inline-block;font-size:12px;height:18px;line-height:18px;padding:0 6px;text-align:center;white-space:nowrap;border:1px solid #fff}
.el-badge__content.is-fixed{position:absolute;top:10px;right:10px;-webkit-transform:translateY(-50%) translateX(100%);transform:translateY(-50%) translateX(100%)}
.el-badge__content.is-fixed.is-dot{right:8px}
.el-badge__content.is-dot{height:8px;width:8px;padding:0;right:0;border-radius:50%}
.el-button{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none}
.el-button{-webkit-box-sizing:border-box}
.el-button{display:inline-block;line-height:1;white-space:nowrap;cursor:pointer;background:#fff;border:1px solid #dcdfe6;color:#606266;-webkit-appearance:none;text-align:center;box-sizing:border-box;outline:0;margin:0;-webkit-transition:.1s;transition:.1s;font-weight:500;padding:12px 20px;font-size:14px;border-radius:4px}
.el-button:focus,.el-button:hover{color:#409eff;border-color:#c6e2ff;background-color:#ecf5ff}
.el-button:active{color:#3a8ee6;border-color:#3a8ee6;outline:0}
.el-button::-moz-focus-inner{border:0}
.el-button.is-circle{border-radius:50%;padding:15px}
#extraBtn .el-button.is-circle{padding:8px !important}
@font-face{font-family:element-icons;src:url(https://cdn.bootcss.com/element-ui/2.12.0/theme-chalk/fonts/element-icons.woff) format("woff"),url(https://cdn.bootcss.com/element-ui/2.12.0/theme-chalk/fonts/element-icons.ttf) format("truetype");font-weight:400;font-display:auto;font-style:normal}
</style>
<div role="alert" class="el-notification fuck-task-logs right" style="bottom: 16px; z-index: 2000;">
<div class="el-notification__group">
<h2 id="extraBtn" class="el-notification__title">
<div class="el-badge item"><button id="checkUpdate" type="button" class="el-button el-button--default is-circle"
title="检查更新">
<i class="el-icon-refresh"></i>
</button><sup class="el-badge__content el-badge__content--undefined is-fixed is-dot"
style="display: none;"></sup></div>
<div class="el-badge item"><button id="fuck" type="button" class="el-button el-button--default is-circle" title="强制做任务">
<i class="el-icon-video-play"></i>
</button><sup class="el-badge__content el-badge__content--undefined is-fixed is-dot" style="display: none;"></sup>
</div>
<div class="el-badge item"><button id="changeLog" type="button" class="el-button el-button--default is-circle"
title="查看更新内容">
<i class="el-icon-document"></i>
</button><sup class="el-badge__content el-badge__content--undefined is-fixed is-dot" style="display: none;"></sup></div>
<div class="el-badge item"><button id="clearNotice" type="button" class="el-button el-button--default is-circle"
title="清空执行日志">
<i class="el-icon-brush"></i>
</button><sup class="el-badge__content el-badge__content--undefined is-fixed is-dot"
style="display: none;"></sup></div>
<div class="el-badge item"><button id="report" type="button" class="el-button el-button--default is-circle"
title="提交建议/BUG">
<i class="el-icon-s-promotion"></i>
</button><sup class="el-badge__content el-badge__content--undefined is-fixed is-dot"
style="display: none;"></sup></div>
</h2>
<h2 class="el-notification__title">任务执行日志</h2>
<div class="el-notification__content" style="">
<p></p>
</li>
</div>
</div>
</div>`)
        },
        addNotice: function(data){
            switch(data.type)
            {
                case "taskStatus":
                    jq('.el-notification__content').append('<li>' + data.task.task.name + ' <a href="' + data.task.data.url + '" target="_blank">' + (data.task.data.name||data.task.data.username) + '</a>|<font id="' + data.task.id + '" class="' + data.status +'">' + data.status +'</font></li>');
                    break;
                case "msg":
                    jq('.el-notification__content').append("<li>" + data.msg + "</li>");
                    break;
                case "authVerify":
                    jq('.el-notification__content').append('<li>' + data.name + ' |<font id="' + data.status.id + '" class="' + data.status.class +'">' + data.status.text + '</font></li>');
                    break;
                default:
                    jq('.el-notification__content').append("<li>" + data + "</li>");
                    break;
            }
        },
        clearNotice:()=>{
            jq('.el-notification__content li').remove();
        },
        updateNotice: function(id, result){
            jq('font#' + id).removeClass()
            jq('font#' + id).addClass(result.class)
            jq('font#' + id).text(result.text)
        },
    }

    const log = ((...data)=>{

        if(debug){
            return console
        }else{
            return {}
        }
    })();
    const HTTP = (function(){
        // [修改自https://greasyfork.org/zh-CN/scripts/370650]
        const httpRequest = function (e) {
            const requestObj = {}
            requestObj.url = e.url
            requestObj.method = e.method.toUpperCase()
            requestObj.timeout = e.timeout || 30000
            if (e.dataType) requestObj.dataType = e.dataType
            if (e.responseType) requestObj.responseType = e.responseType
            if (e.headers) requestObj.headers = e.headers
            if (e.binary) requestObj.binary = e.binary;
            if (e.data) requestObj.data = e.data
            if (e.cookie) requestObj.cookie = e.cookie
            if (e.anonymous) requestObj.anonymous = e.anonymous
            if (e.onload) requestObj.onload = e.onload
            if (e.fetch) requestObj.fetch = e.fetch
            if (e.onreadystatechange) requestObj.onreadystatechange = e.onreadystatechange
            requestObj.ontimeout = e.ontimeout || function (data) {
                log.info('请求超时:', data)
                if (e.status) e.status.error('Error:Timeout(0)')
                if (e.r) e.r({ result: 'error', statusText: 'Timeout', status: 0, option: e })
            }
            requestObj.onabort = e.onabort || function (data) {
                log.info('请求终止:', data)
                if (e.status) e.status.error('Error:Aborted(0)')
                if (e.r) e.r({ result: 'error', statusText: 'Aborted', status: 0, option: e })
            }
            requestObj.onerror = e.onerror || function (data) {
                log.info('请求出错:', data)
                if (e.status) e.status.error('Error:Error(0)')
                if (e.r) e.r({ result: 'error', statusText: 'Error', status: 0, option: e })
            }
            log.info('发送请求:', requestObj)
            GM_xmlhttpRequest(requestObj);
        }
        function get(url, data={}, e = {}){
            return new Promise((resolve, reject)=>{
                e.url = url;
                e.method = "GET";
                e.data = data;
                e.onload = resolve;
                e.onerror = reject;
                httpRequest(e)
            })
        }
        function post(url, data={}, e = {}){
            return new Promise((resolve, reject)=>{
                e.url = url;
                e.method = "POST";
                e.data = data;
                e.onload = resolve;
                e.onerror = reject
                httpRequest(e);
            })
        }
        function put(url, data={}, e = {}){
            return new Promise((resolve, reject)=>{
                e.url = url;
                e.method = "PUT";
                e.data = data;
                e.onload = resolve
                e.onerror = reject
                httpRequest(e);
            })
        }
        return {
            GET: get,
            POST: post,
            PUT: put
        }
    })();
    try{
        const checkTask = {
            reLoad: function (time,sum){
                let date=new Date();
                let hour=date.getHours();
                let min=date.getMinutes()<10?("0"+date.getMinutes()):date.getMinutes();
                if(GM_getValue("start")==1){
                    jq(".border-bottom").text(hour+":"+min+" 执行新任务检测");
                    jq.ajax({
                        url:"/entries/load",
                        type:"get",
                        headers:{'x-csrf-token': jq('meta[name="csrf-token"]').attr('content')},
                        success:(data,status,xhr)=>{
                            if(data && (data.actions && (data.actions.length > sum) )){
                                if(debug)console.log(data);
                                let date=new Date();
                                let hour=date.getHours();
                                let min=date.getMinutes()<10?("0"+date.getMinutes()):date.getMinutes();
                                jq(".border-bottom").text(hour+":"+min+" 检测到新任务（暂停检测）");
                                GM_notification({
                                    title: "keyjoker新任务",
                                    text: "keyjoker网站更新"+(data.actions.length-sum)+"个新任务！",
                                    image: "https://www.keyjoker.com/favicon-32x32.png",
                                    timeout: 0,
                                    onclick: function(){
                                        //location.reload(true);
                                    }
                                });
                                // 重载列表
                                noticeFrame.clearNotice();
                                func.reLoadTaskList(()=>{
                                    func.do_task(data);
                                });
                                GM_setValue("start", 0);
                                checkSwitch();
                            }else{
                                setTimeout(()=>{
                                    this.reLoad(time,sum);
                                },time);
                            }
                        },
                        error:(err)=>{
                            window.location.reload(true);
                        }
                    });
                }
            },
            setTime: function (){
                let time=prompt('请输入获取任务信息的时间间隔(单位:秒)：');
                if(!isNaN(time)){
                    GM_setValue("time",parseInt(time));
                }
            },
            start: function (r = null){
                let time = GM_getValue("time");
                if(!time){
                    time=60;
                }
                if(confirm("是否以时间间隔" + time + "秒进行任务检测？")){
                    GM_setValue("start",1);
                    if(r)r();
                    this.next();
                }
            },
            next: function (){
                // 初始化凭证获取状态
                getAuthStatus.discord = false;
                getAuthStatus.spotify = false;
                getAuthStatus.steamStore = 0;
                getAuthStatus.steamCom = 0;
                getAuthStatus.tumblr = false;
                getAuthStatus.twitch = false;
                getAuthStatus.twitter = 0;
                let time = GM_getValue("time");
                if(!time){
                    time=60;
                }
                let sum=jq(".list-complete-item").length;
                if(sum>0){
                    this.reLoad(time*1000,sum);
                }else{
                    this.reLoad(time*1000,0);
                }
            }
        }
        const DISCORD = (()=>{
            const AuthUpdate = (update = false)=>{
                return new Promise((resolve, reject)=>{
                    if (new Date().getTime() - discordAuth.updateTime < 30 * 60 * 1000 && discordAuth.status == 200 && !update) {
                        log.info("DISCORD: 直接使用未过期的Auth")
                        resolve(200)
                        return;
                    }
                    if(false == getAuthStatus.discord || true === update)
                    {
                        getAuthStatus.discord = true;
                        GM_openInTab("https://discord.com/channels/@me?keyjokertask=storageAuth", true);
                    }
                    let i = 0;
                    let check = setInterval(()=>{
                        i++;
                        if(GM_getValue("discordAuth") && new Date().getTime() - GM_getValue("discordAuth").updateTime <= 10 * 1000)
                        {
                            if(GM_getValue("discordAuth").status != 200)
                            {
                                clearInterval(check);
                                reject(GM_getValue("discordAuth").status)
                                return;
                            }
                            discordAuth.authorization = GM_getValue("discordAuth").authorization
                            discordAuth.updateTime = GM_getValue("discordAuth").updateTime
                            discordAuth.status = GM_getValue("discordAuth").status;
                            clearInterval(check);
                            resolve(discordAuth.status)
                        }
                        if(i >= 10)
                        {
                            clearInterval(check);
                            reject(408)
                        }
                    }, 1000)
                    })
            }
            const doJoinServer = (server)=>{
                return HTTP.POST('https://discord.com/api/v9/invites/' + server, null, {
                    headers: {
                        referer: 'https://discord.com/invite/' + server,
                        authorization: discordAuth.authorization
                    },
                    anonymous: true,
                    responseType: 'json'
                }).then(res=>{
                    if (res.status === 200) {
                        log.log({ result: 'success', statusText: res.statusText, status: res.status })
                        return Promise.resolve(200);
                    } else {
                        log.error("状态码异常：", res);
                        log.info(res.responseText)
                        return Promise.reject(res.status);
                    }
                })
            }
            const JoinServer = async (r, server)=>{
                log.info("DISCORD: 准备加入服务器：", server)
                try{
                    log.info("DISCORD: 更新凭证：", server)
                    const auth = await AuthUpdate()

                    // https://discord.com/api/v9/invites/EVgxm7TTvD
                    log.info("DISCORD: 加入服务器：", server)
                    const ret = await doJoinServer(server)
                    log.info('DISCORD: ret', ret)
                    r(ret)
                }catch(e){
                    log.error("DISCORD: 加入服务器出错：", e)
                    r(e);
                    return;
                }
            }
            const LeaveServer = (r, serverId)=>{
                AuthUpdate((ret)=>{
                    if(ret != 200)
                    {
                        r(ret);
                        return;
                    }
                    jq.ajax({
                        url: 'https://discord.com/api/v6/users/@me/guilds/' + serverId,
                        method: 'DELETE',
                        headers: { authorization: discordAuth.authorization, "content-type": "application/json"},
                        onload: (response) => {
                            if (response.status === 604) {
                                if(debug)console.log({ result: 'success', statusText: response.statusText, status: response.status })
                                r(604);
                            } else {
                                console.error(response);
                                r(601);
                            }
                        },
                        error:(res)=>{
                            console.error(res);
                            r(601);
                        },
                        anonymous:true
                    })
                })
            }
            return {
                AuthUpdate: AuthUpdate,
                JoinServer: JoinServer,
                LeaveServer: LeaveServer
            }
        })();
        const SPOTIFY = (()=>{
            const GetUserInfo = async (r)=>{
                r(603)
                const accessToken = GetAccessToken()
                return HTTP.GET('https://api.spotify.com/v1/me', null, {
                    headers:{authorization: "Bearer " + accessToken},
                    anonymous:true
                }).then((res, accessToken)=>{
                    if (res.status === 200) {
                        r(200, accessToken, JSON.parse(res.responseText).id);
                    } else {
                        log.error(res)
                        r(401);
                    }
                })
            }
            const GetAccessToken = function(){
                return HTTP.GET('https://open.spotify.com/get_access_token?reason=transport&productType=web_player', null)
                    .then(res=>{
                    if (res.status === 200) {
                        return Promise.resolve(JSON.parse(res.responseText).accessToken);
                    } else {
                        console.log(res);
                        return Promise.reject(401);
                    }
                })
            }
            const SaveAuto = (r, data, del = false)=>{
                GetUserInfo((status, accessToken = null, userId = null)=>{
                    if(status != 200)
                    {
                        r(status);
                        return;
                    }
                    let putUrl = "";
                    new Promise((resolve, reject)=>{
                        switch(data.type)
                        {
                            case "album":
                                putUrl = "https://spclient.wg.spotify.com/collection-view/v1/collection/albums/" + userId + "?base62ids=" + data.id + "&model=bookmark";
                                resolve(putUrl);
                                break;
                            case "track":
                                HTTP.GET('https://api.spotify.com/v1/tracks?ids=' + data.id + '&market=from_token', null, {
                                    headers:{authorization: "Bearer " + accessToken},
                                    anonymous:true
                                }).then(res=>{
                                    if(res.status == 200)
                                    {
                                        let temp = JSON.parse(res.response);
                                        putUrl = "https://spclient.wg.spotify.com/collection-view/v1/collection/albums/" + userId + "?base62ids=" + temp.tracks[0].album.id + "&model=bookmark";
                                        resolve(putUrl);
                                    }else
                                    {
                                        log.error(res);
                                        reject(601);
                                    }
                                }).catch(err=>{
                                    console.error(err);
                                    reject(601);
                                })
                                break;
                            default:
                                console.error("spotifySaveAuto未知类型：", data);
                                r(601);
                                return;
                                break;
                        }
                    }).then((putUrl)=>{
                        if(debug)console.log(putUrl)
                        jq.ajax({
                            type: !del?'PUT':"DELETE",
                            url: putUrl,
                            headers: {authorization: "Bearer " + accessToken},
                            success: function(data){
                                console.log(data);
                                r(200);
                            },
                            error: function(data){
                                console.error(data);
                                r(601);
                            },
                            anonymous:true
                        });
                    })
                });
            }
            const Follow = (r, data, del = false)=>{
                GetUserInfo((status, accessToken = null)=>{
                    if(status != 200)
                    {
                        r(status)
                        return;
                    }
                    let putUrl = "";
                    switch(data.type)
                    {
                        case "artist":
                            putUrl = "https://api.spotify.com/v1/me/following?type=artist&ids=" + data.id;
                            break;
                        case "playlist":
                            putUrl = "https://api.spotify.com/v1/playlists/" + data.id + "/followers"
                            break;
                        case "user":
                            putUrl = "https://api.spotify.com/v1/me/following?type=user&ids=" + data.id;
                            break;
                        default:
                            console.error(data);
                            r(601);
                            return;
                            break;
                    }
                    jq.ajax({
                        type: !del?'PUT':"DELETE",
                        url: putUrl,
                        headers: {authorization: "Bearer " + accessToken},
                        success: function(data){
                            r(200);
                        },
                        error: function(data){
                            console.error(data);
                            r(604);
                        },
                        anonymous:true
                    });
                });
            }
            return {
                GetAccessToken: GetAccessToken,
                SaveAuto: SaveAuto,
                Follow: Follow
            }
        })();
        const STEAM = (()=>{
            const InfoUpdate = async (type = 'all', forceUpdate = false)=> {
                if (type === 'community' || type === 'all') {
                    await getComAuth(forceUpdate)
                }
                if (type === 'store' || type === 'all') {
                    await getStoreAuth(forceUpdate)
                }
            }
            const getComAuth = (forceUpdate = false)=>{
                if (new Date().getTime() - steamInfo.comUpdateTime > 10 * 60 * 1000 || forceUpdate) {
                    getAuthStatus.steamCom = 603;
                    HTTP.GET('https://steamcommunity.com/my')
                        .then(res=>{
                        if (res.status === 200) {
                            if (jq(res.responseText).find('a[href*="/login/home"]').length > 0) {
                                getAuthStatus.steamCom = 401;
                                return Promise.reject(401);
                            } else {
                                const steam64Id = res.responseText.match(/g_steamID = "(.+?)";/);
                                const communitySessionID = res.responseText.match(/g_sessionID = "(.+?)";/);
                                const userName = res.responseText.match(/steamcommunity.com\/id\/(.+?)\/friends\//);
                                if (steam64Id) steamInfo.steam64Id = steam64Id[1];
                                if (communitySessionID) steamInfo.communitySessionID = communitySessionID[1];
                                if (userName) steamInfo.userName = userName[1];
                                getAuthStatus.steamCom = 200;
                                steamInfo.comUpdateTime = new Date().getTime();
                                GM_setValue('steamInfo', steamInfo);
                                return Promise.resolve(200);
                            }
                        } else {
                            log.error(res);
                            getAuthStatus.steamCom = 601;
                            return Promise.reject(601);
                        }
                    })
                } else {
                    return Promise.resolve(200);
                }
            }
            const getStoreAuth = (forceUpdate = false)=>{
                if (new Date().getTime() - steamInfo.storeUpdateTime > 10 * 60 * 1000 || forceUpdate) {
                    getAuthStatus.steamStore = 603;
                    return HTTP.GET('https://store.steampowered.com/stats/', null )
                        .then(res=>{
                        if (res.status === 200) {
                            if (jq(res.responseText).find('a[href*="/login/"]').length > 0) {
                                log.log(res)
                                getAuthStatus.steamStore = 401;
                                return Promise.reject(401)
                            } else {
                                const storeSessionID = res.responseText.match(/g_sessionID = "(.+?)";/)
                                if (storeSessionID) steamInfo.storeSessionID = storeSessionID[1]
                                getAuthStatus.steamStore = 200;
                                steamInfo.storeUpdateTime = new Date().getTime();
                                GM_setValue('steamInfo', steamInfo);
                                return Promise.resolve(200);
                            }
                        } else {
                            log.error(res);
                            getAuthStatus.steamStore = 601;
                            return Promise.reject(601);
                        }
                    })
                } else {
                    return Promise.resolve(200)
                }
            }

            const Rep = async (r, id)=>{
                try{
                    const check = await RepHisCheck(id)
                    HTTP.POST('https://steamcommunity.com/comment/Profile/post/' + id + '/-1/',jq.param({comment:'+rep',count:6,sessionid:steamInfo.communitySessionID,feature2:-1}), {
                        headers:{'content-type': 'application/x-www-form-urlencoded'},
                    }).then(res=>{
                        if(res.status == 200)
                        {
                            let ret = JSON.parse(res.response)
                            if(ret.success == true)r(200);
                            else{
                                log.error("发送评论失败", res);
                                r(601);
                            }
                        }else{
                            log.error("评论返回值异常", res);
                            r(601);
                        }
                    }).catch(err=>{
                        log.error("请求发送异常", err);
                        r(601);
                    })
                }catch(e){
                    r(e);
                    return;
                }
            }
            const RepHisCheck = async function (id){
                const auth = await InfoUpdate( "community")
                return HTTP.GET("https://steamcommunity.com/profiles/" + id)
                    .then(res=>{
                    if(res.status == 200)
                    {
                        let comments = res.responseText.match(/commentthread_comments([\s\S]*)commentthread_footer/);
                        log.log(comments);
                        if(comments != null)
                        {
                            if(comments[1].includes(steamInfo.steam64Id) || steamInfo.userName?comments[1].includes(steamInfo.userName):false)
                            {
                                return Promise.resolve(200, true);
                            }
                            else if(!res.responseText.includes("commentthread_textarea"))
                            {
                                return Promise.reject(605)
                            }else{
                                return Promise.resolve(200, false);
                            }
                        }
                        else return Promise.reject(605);
                    }else{
                        log.error("检查评论记录返回异常", res);
                        return Promise.reject(601);
                    }
                })

            }
            const isGroupExist = (url)=>{
                return HTTP.GET(url).then(res=>{
                    const html = res.responseText;
                    return Promise.resolve(html.indexOf('已被移除。') !== -1 || html.indexOf('无法检索到该指定 URL 的组') !== -1)
                })
            }
            const JoinGroupAuto = async function (r, url) {
                try{
                    const auth = await InfoUpdate('community')
                    HTTP.POST(url, jq.param({ action: 'join', sessionID: steamInfo.communitySessionID }), {
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                    }).then(res=>{
                        if (res.status === 200 && !res.responseText.includes('grouppage_join_area')) {
                            if(res.responseText.match(/<h3>(.+?)<\/h3>/) && res.responseText.match(/<h3>(.+?)<\/h3>/)[1] != "您已经是该组的成员了。")
                            {
                                log.error("STEAM.JoinGroupAuto1", res);
                                r(404);
                            }else r(200);
                        } else {
                            log.error("STEAM.JoinGroupAuto2", res);
                            r(601);
                        }
                    })
                }catch(e){
                    let exist = await isGroupExist(url)
                    r(!exist?404:e);
                    return;
                }

            }
            const LeaveGroup = function (r, url) {
                let groupName = url.split('s/')[1];
                GetGroupID(groupName, (groupName, groupId) => {
                    var postUrl = "";
                    postUrl = (steamInfo.userName) ? 'https://steamcommunity.com/id/' + steamInfo.userName + '/home_process' : 'https://steamcommunity.com/profiles/' + steamInfo.steam64Id + '/home_process'
                    HTTP.POST(postUrl, jq.param({ sessionID: steamInfo.communitySessionID, action: 'leaveGroup', groupId: groupId }), {
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                    }).then(res=>{
                        if (res.status === 200 && res.finalUrl.includes('groups') && jq(res.responseText.toLowerCase()).find(`a[href='https://steamcommunity.com/groups/${groupName.toLowerCase()}']`).length === 0) {
                            r(200);
                        } else {
                            log.error(res);
                            r(601);
                        }
                    })
                })
            }
            const GetGroupID = async function (groupName, callback) {
                try{
                    const auth = InfoUpdate()
                    HTTP.GET('https://steamcommunity.com/groups/' + groupName, null, {
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                    }).then(res=>{
                        log.log(res)
                        if (res.status === 200) {
                            const groupId = res.responseText.match(/OpenGroupChat\( '([0-9]+)'/)
                            if (groupId === null) {
                                log.error(res)
                            } else {
                                if (groupId[1] !== false && callback) callback(groupName, groupId[1]);
                            }
                        } else {
                            log.error(res)
                        }
                    })
                }catch(e){
                    callback(e);
                    return;
                }
            }
            const AddWishlistAuto = async function (r, gameId) {
                try{
                    const auth = await InfoUpdate('store')

                    HTTP.POST('https://store.steampowered.com/api/addtowishlist', jq.param({ sessionid: steamInfo.storeSessionID, appid: gameId }), {
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                        dataType: 'json'
                    }).then(res=>{
                        log.log(res)
                        if (res.status === 200 && res.response && res.response.success === true) {
                            r(200)
                        } else {
                            HTTP.GET('https://store.steampowered.com/app/' + gameId)
                                .then(res=>{
                                log.log(res)
                                if (res.status === 200) {
                                    if (res.responseText.includes('class="queue_actions_ctn"') && res.responseText.includes('已在库中')) {
                                        r(200)
                                    } else if ((res.responseText.includes('class="queue_actions_ctn"') && !res.responseText.includes('add_to_wishlist_area" style="display: none;"')) || !res.responseText.includes('class="queue_actions_ctn"')) {
                                        log.error(res);
                                        r(601);
                                    } else {
                                        r(200);
                                    }
                                } else {
                                    log.error(res);
                                    r(601);
                                }
                            })
                            return Promise.resolve({ result: 'error', statusText: res.statusText, status: res.status })
                        }
                    })
                }catch(e){
                    log.error(e);
                    r(601);
                }
            }
            const RemoveWishlistAuto = function (r, gameId) {
                this.steamInfoUpdate(() => {
                    new Promise(resolve => {
                        HTTP.POST('https://store.steampowered.com/api/removefromwishlist', jq.param({ sessionid: steamInfo.storeSessionID, appid: gameId }), {
                            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                            dataType: 'json',
                            onabort: response => { resolve({ result: 'error', statusText: response.statusText, status: response.status }) },
                            ontimeout: response => { resolve({ result: 'error', statusText: response.statusText, status: response.status }) },
                            r: resolve
                        }).then(res=>{
                                if (res.status === 200 && res.response && res.response.success === true) {
                                    resolve({ result: 'success', statusText: res.statusText, status: res.status })
                                } else {
                                    resolve({ result: 'error', statusText: res.statusText, status: res.status })
                                }
                        })
                    }).then(result => {
                        if (result.result === 'success') {
                            r(200);
                        } else {
                            HTTP.GET('https://store.steampowered.com/app/' + gameId)
                                .then(res=>{
                                if (res.status === 200) {
                                    if (res.responseText.includes('class="queue_actions_ctn"') && (res.responseText.includes('已在库中') || res.responseText.includes('添加至您的愿望单'))) {
                                        r(200);
                                    } else {
                                        log.error(res);
                                        r(601);
                                    }
                                } else {
                                    log.error(res);
                                    r(601);
                                }
                            })
                        }
                    }).catch(err => {
                        log.error(err);
                        r(601);
                    })
                })
            }
            return {
                InfoUpdate: InfoUpdate,
                Rep: Rep,
                JoinGroup: JoinGroupAuto,
                LeaveGroup: LeaveGroup,
                AddWishlist: AddWishlistAuto
            }
        })();
        const TUMBLR = (()=>{
            const FollowAuto = async function(r, name){
                try{
                    r(603)
                    const key = await AuthUpdate()
                    HTTP.POST( 'https://www.tumblr.com/svc/follow', jq.param({'data[tumblelog]': name}), {
                        headers: {"x-tumblr-form-key": key, "Content-Type": "application/x-www-form-urlencoded"},
                    }).then(res=>{
                        if(res.status == 200)
                        {
                            r(200);
                        }else{
                            log.error(res);
                            r(601);
                        }
                    })
                }catch(e){
                    r(e);
                    return;
                }
            }
            const UnfollowAuto = function(r, name){
                AuthUpdate((status, key = false)=>{
                    if(status != 200)
                    {
                        r(status);
                        return;
                    }
                    if(false != key){
                        HTTP.POST('https://www.tumblr.com/svc/unfollow', jq.param({'data[tumblelog]': name}), {
                            headers: {"x-tumblr-form-key": key, "Content-Type": "application/x-www-form-urlencoded"},
                        }).then(res=>{
                            if(res.status == 200)
                            {
                                r(200);
                            }else{
                                log.error(res);
                                r(601);
                            }
                        })
                    }else{
                        r(601);
                    }
                })
            }
            const AuthUpdate = function(update = false){
                return HTTP.GET('https://www.tumblr.com/dashboard/iframe')
                    .then(res=>{
                    if(res.status == 200)
                    {
                        let key = res.responseText.match(/id="tumblr_form_key" content="(.+?)">/)
                        if(key){
                            key = key[1]
                            if(-1 != key.indexOf("!123") && -1 !=key.indexOf("|") )
                            {
                                return Promise.reject(401);
                            }else return Promise.resolve(key);
                        }
                        else{
                            log.error("tumblrGetKey->get key failed.", res);
                            return Promise.reject(601);
                        }
                    }else{
                        log.error(res);
                        return Promise.reject(601);
                    }
                })
            }
            return {
                AuthUpdate: AuthUpdate,
                Follow: FollowAuto,
                UnfollowAuto: UnfollowAuto
            }
        })();
        const TWITCH = (()=>{
            const FollowAuto = async function(r, channelId){
                try{
                    const auth = await AuthUpdate()
                    HTTP.POST( 'https://gql.twitch.tv/gql','[{"operationName":"FollowButton_FollowUser","variables":{"input":{"disableNotifications":false,"targetID":"' + channelId + '"}},"extensions":{"persistedQuery":{"version":1,"sha256Hash":"3efee1acda90efdff9fef6e6b4a29213be3ee490781c5b54469717b6131ffdfe"}}}]', {
                        headers: { Authorization: "OAuth " + twitchAuth["auth-token"]},
                    }).then(res=>{
                        if (res.status === 200) {
                            r(200);
                        } else if(res.status === 401){
                            twitchAuth.updateTime = 0;
                            GM_setValue("twitchAuth", null);
                            r(401);
                        }else{
                            console.error(res);
                            r(601);
                        }
                    })
                }catch(e){
                    r(status);
                    return;
                }
            }
            const UnfollowAuto = function(r, channelId){
                AuthUpdate((status)=>{
                    if(status != 200)
                    {
                        r(status);
                        return;
                    }
                    HTTP.POST('https://gql.twitch.tv/gql', '[{"operationName":"FollowButton_UnfollowUser","variables":{"input":{"targetID":"' + channelId + '"}},"extensions":{"persistedQuery":{"version":1,"sha256Hash":"d7fbdb4e9780dcdc0cc1618ec783309471cd05a59584fc3c56ea1c52bb632d41"}}}]', {
                        headers: { Authorization: "OAuth " + twitchAuth["auth-token"]},
                    }).then(res=>{
                        if (res.status === 200) {
                            r(200);
                        } else if(res.status === 401){
                            twitchAuth.updateTime = 0;
                            GM_setValue("twitchAuth", null);
                            r(401);
                        }else{
                            log.error(res);
                            r(601);
                        }
                    })
                })
            }
            // 弃用
            const twitchGetId = function(r, channels){
                HTTP.GET('https://api.twitch.tv/api/channels/' + channels + '/access_token?oauth_token=' + GM_getValue("twitchAuth").match(/auth-token=(.+?); /)[1] + '&need_https=true&platform=web&player_type=site&player_backend=mediaplayer', null, {
                    anonymous:true
                }) .then(res=>{
                    if (res.status === 200) {
                        let rep = JSON.parse(JSON.parse(res.responseText).token);
                        r(rep.channel_id);
                    } else {
                        log.error(res);
                        r('error')
                    }
                })
            }
            const AuthUpdate = function(r, update = false){
                return new Promise((resolve, reject)=>{
                    if (new Date().getTime() - twitchAuth.updateTime < 30 * 60 * 1000 && twitchAuth.status === 200 && !update) {
                        resolve(200)
                        return
                    }
                    r(603)
                    if(false == getAuthStatus.twitch || true === update)
                    {
                        getAuthStatus.twitch = true;
                        GM_openInTab("https://www.twitch.tv/settings/profile?keyjokertask=storageAuth", true);
                    }
                    let i = 0;
                    let check = setInterval(()=>{
                        i++;
                        if(GM_getValue("twitchAuth") && new Date().getTime() - GM_getValue("twitchAuth").updateTime <= 10 * 1000)
                        {
                            if(GM_getValue("twitchAuth").status != 200)
                            {
                                clearInterval(check);
                                reject(401);
                                return;
                            }
                            twitchAuth["auth-token"] = GM_getValue('twitchAuth')["auth-token"];
                            twitchAuth.updateTime = GM_getValue('twitchAuth').updateTime;
                            twitchAuth.status = GM_getValue('twitchAuth').status;
                            clearInterval(check);
                            resolve(200)
                        }
                        if(i >= 10)
                        {
                            clearInterval(check);
                            reject(408)
                        }
                    }, 1000)
                    })
            }
            return {
                AuthUpdate: AuthUpdate,
                FollowAuto: FollowAuto,
                UnfollowAuto: UnfollowAuto
            }
        })();
        const TWITTER = (()=>{
            const FollowAuto = async function(r, data){
                try{
                    const auth = await AuthUpdate()
                    const uinfo = await GetUserInfo(data.username)
                    let userId = uinfo[1]
                    HTTP.POST('https://api.twitter.com/1.1/friendships/create.json',
                              jq.param({
                        include_profile_interstitial_type: 1,
                        include_blocking: 1,
                        include_blocked_by: 1,
                        include_followed_by: 1,
                        include_want_retweets: 1,
                        include_mute_edge: 1,
                        include_can_dm: 1,
                        include_can_media_tag: 1,
                        skip_status: 1,
                        id: userId
                    }), {
                        headers: { authorization: "Bearer " + twitterAuth.authorization, 'Content-Type': 'application/x-www-form-urlencoded', 'x-csrf-token':twitterAuth.ct0},
                    }).then(res=>{
                        if (res.status === 200) {
                            r(200);
                        } else {
                            log.error(res);
                            twitterAuth.updateTime = 0;
                            GM_setValue("twitterAuth", twitterAuth);
                            r(601);
                        }
                    })
                }catch(e){
                    log.error("TWITTER: 关注出错：", e)
                    r(e);
                    return;
                }
            }
            const UnfollowAuto = function(r, data){
                AuthUpdate((status)=>{
                    if(status != 200)
                    {
                        r(status);
                        return;
                    }
                    GetUserInfo((userId)=>{
                        if(debug)console.log(userId)
                        if("error" == userId)
                        {
                            r(601);
                            return;
                        }
                        HTTP.POST('https://api.twitter.com/1.1/friendships/destroy.json', jq.param({ include_profile_interstitial_type: 1,include_blocking: 1,include_blocked_by: 1,include_followed_by: 1,include_want_retweets: 1,include_mute_edge: 1,include_can_dm: 1,include_can_media_tag: 1,skip_status: 1,id: userId}), {
                            headers: { authorization: "Bearer " + twitterAuth.authorization, 'Content-Type': 'application/x-www-form-urlencoded', 'x-csrf-token':twitterAuth.ct0},
                        }).then(res=>{
                            if (res.status === 200) {
                                r(200);
                            } else {
                                log.error(res);
                                twitterAuth.updateTime = 0;
                                GM_setValue("twitterAuth", twitterAuth);
                                r(601);
                            }
                        })
                    }, data.username)
                })
            }
            const RetweetAuto = async function(r, url){
                let retweetId = url.split("status/")[1];
                try{
                    const auth = await AuthUpdate()
                    HTTP.POST( 'https://api.twitter.com/1.1/statuses/retweet.json', jq.param({ tweet_mode: "extended",id: retweetId}), {
                        headers: { authorization: "Bearer " + twitterAuth.authorization, 'Content-Type': 'application/x-www-form-urlencoded', 'x-csrf-token':twitterAuth.ct0},
                    }).then(res=>{
                        if (res.status === 200 || (res.status === 403 && res.responseText == '{"errors":[{"code":327,"message":"You have already retweeted this Tweet."}]}')) {
                            r(200);
                        } else {
                            twitterAuth.updateTime = 0;
                            GM_setValue("twitterAuth", twitterAuth);
                            r(601);
                        }
                    })
                }catch(e){
                    log.error("TWITTER: 转推出错：", e)
                    r(e);
                    return;
                }
            }
            const GetUserInfo = function(userName){
                if(debug)log.log("====twitterGetUserInfo====");
                return HTTP.GET('https://api.twitter.com/graphql/-xfUfZsnR_zqjFd-IfrN5A/UserByScreenName?variables=%7B%22screen_name%22%3A%22' + userName + '%22%2C%22withHighlightedLabel%22%3Atrue%7D', null, {
                    headers: { authorization: "Bearer " + twitterAuth.authorization, "content-type": "application/json"},
                    anonymous:true
                }).then(res=>{
                    if (res.status === 200) {
                        return Promise.resolve([200, JSON.parse(res.responseText).data.user.rest_id]);
                    } else {
                        log.error(res);
                        return Promise.reject(601);
                    }
                })
            }
            const AuthUpdate = function(update = false){
                return new Promise((resolve, reject)=>{
                    if(new Date().getTime() - twitterAuth.updateTime < 30 * 60 * 1000 && !update){
                        // 未过期，不强制更新
                        resolve(200)
                        return;
                    }

                    if(false == getAuthStatus.twitter || true === update)
                    {
                        getAuthStatus.twitter = true;
                        GM_openInTab("https://twitter.com/settings/account?keyjokertask=storageAuth", true);
                    }
                    let i = 0;
                    let check = setInterval(()=>{
                        i++;
                        if(GM_getValue("twitterAuth") && new Date().getTime() - GM_getValue("twitterAuth").updateTime <= 10 * 1000)
                        {
                            if(GM_getValue("twitterAuth").status != 200)
                            {
                                clearInterval(check);
                                reject(GM_getValue("twitterAuth").status)
                                return;
                            }
                            twitterAuth.ct0 = GM_getValue("twitterAuth").ct0;
                            twitterAuth.updateTime = GM_getValue("twitterAuth").updateTime
                            twitterAuth.status = GM_getValue("twitterAuth").status;
                            clearInterval(check);
                            resolve(twitterAuth.status)
                        }
                        if(i >= 10)
                        {
                            clearInterval(check);
                            reject(408)
                        }
                    }, 1000)
                    })
            }
            // 推特取得用户页面响应头（OK）
            /*twitterAP:function(r){
            HTTP.GET( 'https://twitter.com/settings/account?k')
            .then(res=>{
                        if (res.status === 200) {
                            log.log(res)
                            r(200, res.responseHeaders)
                        } else {
                            log.error(res);
                            r(601);
                        }
            }).catch(err=>{
                        log.error(res);
                        r(601);
            })
            },*/

            return {
                FollowAuto: FollowAuto,
                RetweetAuto: RetweetAuto,
                AuthUpdate: AuthUpdate
            }
        })();
        const func = {
            // twitch & discord 凭证存储，人机验证处理
            appHandle: function(){
                switch(location.hostname)
                {
                    case "www.twitch.tv":
                        if(location.search == "?keyjokertask=storageAuth")
                        {
                            let cookie = document.cookie + ";"
                            twitchAuth.updateTime = new Date().getTime();
                            if(cookie.match(/auth-token=(.+?);/) != null)
                            {
                                twitchAuth["auth-token"] = cookie.match(/auth-token=(.+?);/)[1]
                                twitchAuth.status = 200;
                            }else twitchAuth.status = 401;
                            GM_setValue("twitchAuth", twitchAuth)
                            log.log(twitchAuth)
                            if(!debug)window.close();
                        }
                        if(!debug)window.close();
                        break;
                    case "discord.com":
                        if(location.search == "?keyjokertask=storageAuth")
                        {
                            discordAuth.authorization = JSON.parse(localStorage.getItem("token"));
                            if(discordAuth.authorization == null)discordAuth.status = 401;
                            else discordAuth.status = 200;
                            discordAuth.updateTime = new Date().getTime();
                            GM_setValue("discordAuth", discordAuth);
                            log.log(discordAuth)
                            if(!debug)window.close();
                        }
                        break;
                    case "twitter.com":
                        if(location.search == "?keyjokertask=storageAuth")
                        {
                            let m = document.cookie.match(/ct0=(.+?);/);
                            if(m != null && m[1])
                            {
                                twitterAuth.status = 200;
                                twitterAuth.ct0 = m[1];
                                twitterAuth.updateTime = new Date().getTime()
                            }else{
                                twitterAuth.status = 401;
                            }
                            GM_setValue("twitterAuth", twitterAuth)
                            if(!debug)window.close();
                        }
                        break;
                    case "assets.hcaptcha.com":
                        // 人机验证
                        func.hcaptcha2();
                        break;
                    default :
                        break;
                }
            },
            authVerify:function(){
                // noticeFrame.loadFrame();
                noticeFrame.addNotice("检查各项凭证");
                noticeFrame.addNotice({type: "authVerify", name: "<a href=\"https://discord.com/login/\" target=\"_blank\">Discord</a> Auth", status:{id: "discord", class: "wait", text:"ready"}});
                noticeFrame.addNotice({type: "authVerify", name: "<a href=\"https://accounts.spotify.com/login/\" target=\"_blank\">Spotify</a> Auth&nbsp;", status:{id: "spotify", class: "wait", text:"ready"}});
                noticeFrame.addNotice({type: "authVerify", name: "<a href=\"https://steamcommunity.com/login/\" target=\"_blank\">Steam</a> Auth&nbsp;&nbsp;", status:{id: "steam", class: "wait", text:"ready"}});
                noticeFrame.addNotice({type: "authVerify", name: "<a href=\"https://www.tumblr.com/login\" target=\"_blank\">Tumblr</a> Auth", status:{id: "tumblr", class: "wait", text:"ready"}});
                noticeFrame.addNotice({type: "authVerify", name: "<a href=\"https://www.twitch.tv/login\" target=\"_blank\">Twitch</a> Auth&nbsp;", status:{id: "twitch", class: "wait", text:"ready"}});
                noticeFrame.addNotice({type: "authVerify", name: "<a href=\"https://twitter.com/login/\" target=\"_blank\">Twitter</a> Auth", status:{id: "twitter", class: "wait", text:"ready"}});

                DISCORD.AuthUpdate(true).then(res=>{
                    this.statusReact(res, "discord");
                }).catch(err=>{
                    this.statusReact(err, "discord");
                });
                SPOTIFY.GetAccessToken().then((res)=>{
                    log.info("spotify", res)
                    this.statusReact(200, "spotify");
                }).catch(err=>{
                    this.statusReact(err, "spotify");
                });
                STEAM.InfoUpdate("all", true).then((res)=>{
                    log.info("STEAM", res)
                    this.statusReact(200, "steam");
                }).catch(err=>{
                    this.statusReact(err, "steam");
                });
                TUMBLR.AuthUpdate(true).then((status)=>{
                    this.statusReact(200, "tumblr");
                }).catch(err=>{
                    this.statusReact(err, "tumblr");
                });
                TWITCH.AuthUpdate(true).then((status)=>{
                    this.statusReact(status, "twitch");
                }).catch(err=>{
                    this.statusReact(err, "twitch");
                });
                TWITTER.AuthUpdate(true).then((status)=>{
                    this.statusReact(status, "twitter");
                }).catch(err=>{
                    this.statusReact(err, "twitter");
                });
            },
            statusReact: (code, id)=>{
                const result = {
                    200: {
                        class:"success",
                        text: 'success'
                    },
                    601: {
                        class:"error",
                        text: 'error'
                    },
                    401: {
                        class:"error", text:"Not Login"
                    },
                    408: {class:"error", text:"Time Out"},
                    603: {class:"wait", text:"Getting Auth"},
                    604: {class:"error", text:"Network Error"},
                    605: {class:"error", text:"评论区未找到"},
                }
                log.info(code)
                noticeFrame.updateNotice(id, result[code])
            },
            checkUpdate: function(){
                noticeFrame.addNotice({type:"msg",msg:"正在检查版本信息...(当前版本：" + GM_info.script.version + ")"})
                HTTP.GET('https://task.jysafe.cn/keyjoker/script/update.php?type=ver', null, {headers:{action: "keyjoker"}})
                .then(res=>{
                    const resp = JSON.parse(res.response)
                    if(resp.status != 200)
                        {
                            noticeFrame.addNotice({type:"msg", msg:"异常！<font class=\"error\">" + resp.msg + "</font>"})
                            return;
                        }
                        if(this.checkVersion(resp.ver))
                        {
                            noticeFrame.addNotice({type:"msg", msg:"发现新版本！<font class=\"success\">" + resp.ver + "=>" + resp.msg + "</font>"})
                        }else{
                            noticeFrame.addNotice({type:"msg",msg:"当前已是最新版本！"})
                        }
                }).catch(err=>{
                        log.error(err);
                        noticeFrame.addNotice({type:"msg", msg:"请求异常！请至控制台查看详情！"})
                })
            },
            checkVersion: function(ver){
                let new_ver = ver.split('.');
                let old_ver = GM_info.script.version.split('.');
                for(var i=0; i<new_ver.length && i<old_ver.length; i++){
                    let _new = parseInt(new_ver[i]);
                    let _old = parseInt(old_ver[i]);
                    if(_new >_old){
                        // 需更新
                        return 1;
                    }else if(_new == _old){
                        continue;
                    }else{
                        break;
                    }
                }
                return 0;
            },
            // 做任务
            do_task: function(data){
                for(const task of data.actions)
                {
                    noticeFrame.addNotice({type: "taskStatus", task:task, status:'start'});
                    this.runDirectUrl(task.redirect_url);
                    let react = (code)=>{
                        switch(code)
                        {
                            case 200:
                                noticeFrame.updateNotice(task.id, {class:"success",text:'success'})
                                this.redeemAuto(task.redirect_url);
                                break;
                            case 601:
                                noticeFrame.updateNotice(task.id, {class:"error",text:'error'})
                                break;
                            case 401:
                                noticeFrame.updateNotice(task.id, {class:"error", text:"Not Login"})
                                break;
                            case 404:
                                noticeFrame.updateNotice(task.id, {class:"error", text:"目标不存在"})
                                break;
                            case 408:
                                noticeFrame.updateNotice(task.id, {class:"error", text:"Time Out"})
                                break;
                            case 603:
                                noticeFrame.updateNotice(task.id, {class:"wait", text:"Getting Auth"})
                                break;
                            case 604:
                                noticeFrame.updateNotice(task.id, {class:"error", text:"Network Error"})
                                break;
                            case 605:
                                noticeFrame.updateNotice(task.id, {class:"error", text:"评论区未找到"})
                                break;
                            default:
                                noticeFrame.updateNotice(task.id, {class:"error", text:"Unknown Error"})
                                log.error("React Unknown Error--->", code)
                                break;
                        }
                    }

                    switch(task.task.name)
                    {
                        case "Join Steam Group":
                            STEAM.JoinGroup(react, task.data.url);
                            break;
                        case "Rep Steam Account":
                            STEAM.Rep(react, task.data.id);
                            break;
                        case "Wishlist Steam Game":
                            STEAM.AddWishlist(react, task.data.id);
                            break;
                        case "Follow Twitter Account":
                            TWITTER.FollowAuto(react, task.data);
                            break;
                        case "Join Discord Server":
                            var server = task.data.url.split(".gg/")[1];
                            DISCORD.JoinServer(react, server)
                            break;
                        case "Retweet Twitter Tweet":
                            TWITTER.RetweetAuto(react, task.data.url);
                            break;
                        case "Save Spotify Album":
                            SPOTIFY.SaveAuto(react, task.data);
                            break;
                        case "Follow Spotify Account":
                            SPOTIFY.Follow(react, task.data);
                            break;
                        case "Follow Twitch Channel":
                            TWITCH.FollowAuto(react, task.data.id);
                            break;
                        case "Follow Tumblr Blog":
                            TUMBLR.Follow(react, task.data.name);
                            break;
                        default:
                            noticeFrame.updateNotice(task.id, {class:"error", text:"Unknow Type:" + task.task.name})
                            console.error("未指定操作" + task.task.name)
                            break;
                    }
                }

                let i = 0;

                // 清除上次残留线程
                if(null != completeCheck)clearInterval(completeCheck);
                let discordCheck = true;
                completeCheck = setInterval(()=>{
                    i++;
                    if(i >= 5)clearInterval(completeCheck);
                    // click reedem
                    //jq('button[class="btn btn-primary"]').click();
                    if(1 == jq('#fraud-warning-modal[style!="display: none;"]').length){
                        // 有弹窗，模拟点击OK
                        jq('button.btn.btn-secondary[type!="button"]')[0].click();
                    }
                    if( document.getElementById("toast-container")){
                        // 操作不存在
                        if(document.getElementById("toast-container").textContent == "This action does not exist."){
                            jq('.card').remove();
                        }
                        // check discord error [Could not refresh Discord information, please try again.]
                        if(discordCheck == true && document.getElementById("toast-container").textContent == "Could not refresh Discord information, please try again.")
                        {
                            discordCheck = false;
                            GM_openInTab("https://www.keyjoker.com/account/identities", true)
                        }
                    }
                    if(jq(".list-complete-item").length == 0)
                    {
                        clearInterval(completeCheck);
                        noticeFrame.addNotice({type:"msg", msg:"任务似乎已完成，恢复监测!"});
                        GM_setValue("start", 1);
                        checkSwitch();
                        checkTask.next();
                    }
                }, 5 * 1000)
            },
            // 人机验证出现图片时的处理
            hC_get_c: function(r){
                new Promise((resolve, reject)=>{
                    HTTP.GET( 'https://hcaptcha.com/checksiteconfig?host=dashboard.hcaptcha.com&sitekey=e4b28873-6852-49c0-9784-7231f004b96b&sc=1&swa=1', null, {
                        headers: { 'Content-Type': 'application/json; charset=utf-8'},
                    }).then(res=>{
                        let ret = JSON.parse(res.response);
                        if(ret.pass){
                            GM_log(ret);
                            resolve(ret.c);
                        }else{
                            reject();
                        }
                    })
                }).then((c)=>{
                    r(c);
                }).catch((err)=>{
                    log.error(err);
                    //let text = document.getElementsByClassName("prompt-text")[0].innerText;
                    //document.getElementsByClassName("prompt-text")[0].innerText = text + "\n免验证Cookie获取异常，请手动进行验证";
                });

            },
            hC_getcaptcha: function(r){
                this.hC_get_c((c)=>{
                    new Promise((resolve, reject)=>{
                        HTTP.POST('https://hcaptcha.com/getcaptcha', jq.param({
                                sitekey:'e4b28873-6852-49c0-9784-7231f004b96b',
                                host:'dashboard.hcaptcha.com',
                                n:'暂未实现获取方案',
                                c:JSON.stringify(c)
                            }), {
                            headers: { 'Content-Type': 'application/x-www-form-urlencoded'},
                        })
                    }).then((res)=>{
                        let rep = JSON.parse(res.response);
                        let c = rep.generated_pass_UUID
                        r(c);
                    }).catch((err)=>{
                        console.error(err);
                        r(false)
                        //let text = document.getElementsByClassName("prompt-text")[0].innerText;
                        //document.getElementsByClassName("prompt-text")[0].innerText = text + "\ngetcaptcha failed!";
                    });
                });
            },
            hcaptcha2: function () {
                return false;
                let hcaptcha2Click=setInterval(()=>{
                    if(document.getElementsByClassName("challenge-container").length != 0 && document.getElementsByClassName("challenge-container")[0].children.length != 0)
                    {
                        clearInterval(hcaptcha2Click);
                        console.log("open hcaptcha");
                        let text = document.getElementsByClassName("prompt-text")[0].innerText;
                        document.getElementsByClassName("prompt-text")[0].innerText = text + "\n正在自动获取免验证Cookie";
                        //$(".task-grid").remove();
                        //$(".challenge-example").remove();

                        HTTP.GET('https://accounts.hcaptcha.com/user', null, {
                            headers: { 'Content-Type': 'application/json'},
                        }).then((csrf)=>{
                            this.hC_getcaptcha((token)=>{
                                if(token == false)
                                {
                                    document.getElementsByClassName("prompt-text")[0].innerText = text + "\ntoken 获取失败";
                                    return ;
                                }
                                HTTP.POST('https://accounts.hcaptcha.com/accessibility/get_cookie', JSON.stringify({token:token}), {
                                    headers: { 'Content-Type': 'application/json','x-csrf-token':csrf},
                                }).then(res=>{
                                    let response = res
                                    if(response.status == 200)
                                    {
                                        document.getElementsByClassName("prompt-text")[0].innerText = text + "\n免验证Cookie获取成功，请重新点击验证框";
                                    }else if(response.status == 401)
                                    {
                                        document.getElementsByClassName("prompt-text")[0].innerText = text + "\n当前账号或IP的免验证Cookie获取次数已达上限，请更换hcaptcha账号或IP";
                                        // setTimeout(()=>{window.open("https://dashboard.hcaptcha.com/welcome_accessibility")}, 3000);
                                    }else if(response.status == 500)
                                    {
                                        document.getElementsByClassName("prompt-text")[0].innerText = text + "\n未登录hCaptcha";
                                        // setTimeout(()=>{window.open("https://dashboard.hcaptcha.com/welcome_accessibility")}, 3000);
                                    }else{
                                        console.error(response);
                                        document.getElementsByClassName("prompt-text")[0].innerText = text + "\n发生未知错误,已将数据记录至控制台";
                                    }
                                }).catch(err=>{
                                    log.error(err)
                                })
                            });
                        }).catch((err)=>{
                            if(err.status == 401)
                            {
                                document.getElementsByClassName("prompt-text")[0].innerText = text + "\n未登录hCaptcha";
                                // setTimeout(()=>{window.open("https://dashboard.hcaptcha.com/welcome_accessibility")}, 3000);
                            }else{
                                document.getElementsByClassName("prompt-text")[0].innerText = text + "\n未知错误";
                            }
                            console.error(err);
                        });
                    }
                },1000);
            },
            // OK
            redeemAuto: function(redirect_url){
                if(0 != jq('a[href="' + redirect_url + '"]').length)jq('a[href="' + redirect_url + '"]').next().click();
            },
            reLoadTaskList: function(r){
                // 重载任务列表
                if(2 == document.getElementsByClassName('row').length)
                {
                    jq('.row')[1].remove();
                    jq('.layout-container').append('<entries-component></entries-component>');
                    if(true == GM_getValue("offlineMode") && typeof offlineData === "object")
                    {
                        offlineData["app.js"]();
                        r();
                    }else{
                        jq.getScript("/js/app.js", (rep,status)=>{
                            if("success" == status)r();
                            else console.error(status, rep);
                        });
                    }
                }else
                {
                    r();
                }
            },
            reset: function (){
                if(!confirm("你确定要执行重置操作？"))return;
                noticeFrame.addNotice({type:"msg",msg:"正在重置设置"})
                const listValues = GM_listValues()
                for (const value of listValues) {
                    if(value == "currentVer")continue;
                    noticeFrame.addNotice({type:"msg",msg:"<font class=\"error\">正在删除：" + value + "</font>"})
                    GM_deleteValue(value)
                }
                noticeFrame.addNotice({type:"msg",msg:"设置重置完毕"})
            },

            runDirectUrl:function(direct_url){
                GM_log("====访问跳转链接====")
                HTTP.GET(direct_url, null, {
                    headers: {'x-csrf-token': jq('meta[name="csrf-token"]').attr('content')},
                })
            },
            test: function(){
                // GM_openInTab("https://discord.com/channels/@me?keyjokertask=storageAuth", true);
                DISCORD.JoinServer(log.info, 'QbYvb2qwDT')
            }
        }
        // ============Start===========
        if(location.pathname == "/entries"){
            window.onload=()=>{
                log.info("KJ main")
                if(document.getElementsByClassName("nav-item active").length != 0 && document.getElementsByClassName("nav-item active")[0].innerText == "Earn Credits" && document.getElementById("logout-form")){
                    noticeFrame.loadFrame();
                    // 事件绑定
                    eventBind();
                    //let isStart=setInterval(()=>{
                    if(GM_getValue("start")==1){
                        //clearInterval(isStart);
                        checkTask.next();
                    }
                    //},1000);
                    checkUpdate();
                }else{
                    if(jq('.container').length > 0)
                    {
                        let i = 0;
                        let check = setInterval(()=>{
                            i++;
                            if(jq('.container')[0].innerText == "Whoops, looks like something went wrong.")location.href = location.pathname
                            if(i >= 10)clearInterval(check)
                        }, 1000);
                    }
                }
            }
        }else{
            func.appHandle();
        }
        function checkUpdate(){
            // 隔一段时间检测新版本
            if(new Date().getTime() - (GM_getValue("lastCheckUpdate") || 0) > 6 * 60 * 60 * 1000)
            {
                func.checkUpdate();
                GM_setValue("lastCheckUpdate", new Date().getTime())
            }
        }
        function eventBind(){
            jq('button#checkUpdate').click(()=>{func.checkUpdate()})
            jq('button#fuck').click(function(){
                checkTask.start(()=>{jq('.card').remove();})
            })
            jq('button#clearNotice').click(function(){
                noticeFrame.clearNotice()
            })
            jq('button#changeLog').click(function(){
                noticeFrame.addNotice({type:"msg", msg:"获取日志中..."})
                HTTP.GET( 'https://task.jysafe.cn/keyjoker/script/update.php?type=changelog&ver=' + GM_info.script.version, null, {
                    headers:{action: "keyjoker"},
                }).then(res=>{
                    let ret = JSON.parse(res.response)
                    if(ret.status != 200)
                    {
                        noticeFrame.addNotice({type:"msg", msg:"异常！<font class=\"error\">" + ret.msg + "</font>"})
                    }else
                    {
                        noticeFrame.addNotice({type:"msg", msg:"<font class=\"success\">" + ret.msg + "</font>"})
                    }
                }).catch(err=>{
                    log.error(err);
                    noticeFrame.addNotice({type:"msg", msg:"<font class=\"error\">请求异常！请至控制台查看详情！</font>"})
                })
            })
            jq('button#report').click(function(){
                noticeFrame.addNotice({type:"msg",msg:"目前提供以下反馈渠道："})
                noticeFrame.addNotice({type:"msg",msg:"<a href=\"https://www.jysafe.cn/4332.air\" target=\"_blank\">博客页面</a>"})
                noticeFrame.addNotice({type:"msg",msg:"<a href=\"https://github.com/jiyeme/keyjokerScript/issues/new/choose\" target=\"_blank\">GitHub</a>"})
                noticeFrame.addNotice({type:"msg",msg:"<a href=\"https://keylol.com/t660181-1-1\" target=\"_blank\">其乐社区</a>"})
            })
            // 版本升级后显示一次更新日志
            if(GM_getValue("currentVer") != GM_info.script.version)
            {
                HTTP.GET('https://task.jysafe.cn/keyjoker/script/update.php?type=changelog&ver=' + GM_info.script.version, null, {
                    headers:{action: "keyjoker"},
                    anonymous:true
                }).then(res=>{
                    let ret = JSON.parse(res.response)
                    if(ret.status != 200)
                    {
                        noticeFrame.addNotice({type:"msg", msg:"异常！<font class=\"error\">" + ret.msg + "</font>"})
                    }else
                    {
                        noticeFrame.addNotice({type:"msg", msg:"<font class=\"success\">" + ret.msg + "</font>"})
                    }
                }).catch(err=>{
                    log.error(err);
                    noticeFrame.addNotice({type:"msg", msg:"更新日志获取异常！请至控制台查看详情！"})
                })
                GM_setValue("currentVer", GM_info.script.version)
            }
        }
        GM_registerMenuCommand("设置时间间隔", checkTask.setTime);
        GM_registerMenuCommand("重置设置", func.reset);
        GM_registerMenuCommand("凭证检测",()=>{
            func.authVerify();
        });
        function offlineSwitch(id){
            GM_unregisterMenuCommand(id);
            if(true == GM_getValue("offlineMode")){
                let id = GM_registerMenuCommand("进入稳定模式",()=>{
                    GM_setValue("offlineMode", false);
                    offlineSwitch(id);
                });
            }else{
                let id = GM_registerMenuCommand("进入极速模式",()=>{
                    GM_setValue("offlineMode", true);
                    offlineSwitch(id);
                });
            }
        }
        function checkSwitch(){
            GM_unregisterMenuCommand(checkSwitchId);
            if(1 == GM_getValue("start")){
                checkSwitchId = GM_registerMenuCommand("停止检测",()=>{
                    let date=new Date();
                    let hour=date.getHours();
                    let min=date.getMinutes()<10?("0"+date.getMinutes()):date.getMinutes();
                    GM_setValue("start",0);
                    jq(".border-bottom").text(hour + ":" + min + " 停止执行新任务检测");
                    checkSwitch();
                });
            }else{
                checkSwitchId = GM_registerMenuCommand("开始检测",()=>{
                    checkTask.start();
                    checkSwitch();
                });
            }
        }
        checkSwitch(null);
        offlineSwitch(null);
        if(debug)
        {
            GM_registerMenuCommand("Test",()=>{
                func.test();
            });
        }
    } catch (e) {
        setTimeout(() => {
            noticeFrame.addNotice({ type: 'msg', msg:"<font class\"error\">任务脚本执行期间发生预期之外的错误，详情见控制台</font>" })
        }, 500)
        console.log('%c%s', 'color:white;background:red', e.stack)
    }
})();