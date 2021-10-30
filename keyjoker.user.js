// ==UserScript==
// @name         KeyJoker Auto Task
// @namespace    KeyJokerAutoTask
// @version      0.9.1
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
    const debug = false;
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
font.success{color:green}
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
        updateNotice: function(id, status){
            jq('font#' + id).removeClass()
            jq('font#' + id).addClass(status)
            jq('font#' + id).text(status)
        },
        updateNotice1: function(data){
            jq('font#' + data.id).removeClass()
            jq('font#' + data.id).addClass(data.class)
            jq('font#' + data.id).text(data.text || data.class)
        }
    }
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
            const AuthUpdate = (r, update)=>{
                if (new Date().getTime() - discordAuth.updateTime > 30 * 60 * 1000 || discordAuth.status != 200 || update) {
                    r(603)
                    new Promise((resolve, reject)=>{
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
                    }).then((ret)=>{
                        r(ret)
                    }).catch((err)=>{
                        r(err)
                    })
                }else{
                    r(200)
                }
            }
            const JoinServer = (r, server)=>{
                AuthUpdate((ret)=>{
                    if(ret != 200)
                    {
                        r(ret);
                        return;
                    }
                    // https://discord.com/api/v9/invites/EVgxm7TTvD
                    func.httpRequest({
                        url: 'https://discord.com/api/v9/invites/' + server,
                        headers: {
                            referer: 'https://discord.com/invite/' + server
                        },
                        method: 'POST',
                        data: {},
                        headers: { authorization: discordAuth.authorization, "content-type": "application/json"},
                        onload: (response) => {
                            if (response.status === 200) {
                                if(debug)console.log({ result: 'success', statusText: response.statusText, status: response.status })
                                r(200);
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
            const GetUserInfo = (r)=>{
                r(603)
                GetAccessToken(
                    (status, accessToken)=>{
                        if(status != 200)
                        {
                            r(status);
                            return;
                        }
                        func.httpRequest({
                            url: 'https://api.spotify.com/v1/me',
                            method: 'GET',
                            headers:{authorization: "Bearer " + accessToken},
                            onload: (response) => {
                                if (response.status === 200) {
                                    r(200, accessToken, JSON.parse(response.responseText).id);
                                } else {
                                    console.error(response)
                                    r(401);
                                }
                            },
                            error:(res)=>{
                                console.error("error");
                                r(604);
                            },
                            anonymous:true
                        })
                    }
                )
            }
            const GetAccessToken = function(r){
                r(603);
                func.httpRequest({
                    url: 'https://open.spotify.com/get_access_token?reason=transport&productType=web_player',
                    method: 'GET',
                    onload: (response) => {
                        if (response.status === 200) {
                            r(200, JSON.parse(response.responseText).accessToken);
                        } else {
                            console.log(response);
                            r(401);
                        }
                    },
                    error:(res)=>{
                        if(debug)console.log(res);
                        r(604);
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
                                func.httpRequest({
                                    url: 'https://api.spotify.com/v1/tracks?ids=' + data.id + '&market=from_token',
                                    method: 'GET',
                                    headers:{authorization: "Bearer " + accessToken},
                                    onload: (response) => {
                                        if(response.status == 200)
                                        {
                                            let temp = JSON.parse(response.response);
                                            putUrl = "https://spclient.wg.spotify.com/collection-view/v1/collection/albums/" + userId + "?base62ids=" + temp.tracks[0].album.id + "&model=bookmark";
                                            resolve(putUrl);
                                        }else
                                        {
                                            console.error(response);
                                            reject(601);
                                        }
                                    },
                                    error:(res)=>{
                                        console.error(res);
                                        reject(601);
                                    },
                                    anonymous:true
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
            const InfoUpdate = (r, type = 'all', update = false)=> {
                r(603);
                if (type === 'community' || type === 'all') {
                    if (new Date().getTime() - steamInfo.comUpdateTime > 10 * 60 * 1000 || update) {
                        if(603 == getAuthStatus.steamCom)
                        {
                            let i = 0;
                            let steamCheck = setInterval(()=>{
                                i++;
                                if(603 != getAuthStatus.steamCom)
                                {
                                    clearInterval(steamCheck);
                                    r(getAuthStatus.steamCom);
                                }
                                if(i >= 10)
                                {
                                    clearInterval(steamCheck);
                                    r(408);
                                }
                            }, 1000)
                            return;
                        }
                        getAuthStatus.steamCom = 603;
                        new Promise((resolve, reject) => {
                            func.httpRequest({
                                url: 'https://steamcommunity.com/my',
                                method: 'GET',
                                onload: (response) => {
                                    if (response.status === 200) {
                                        if (jq(response.responseText).find('a[href*="/login/home"]').length > 0) {
                                            getAuthStatus.steamCom = 401;
                                            reject(401);
                                        } else {
                                            const steam64Id = response.responseText.match(/g_steamID = "(.+?)";/);
                                            const communitySessionID = response.responseText.match(/g_sessionID = "(.+?)";/);
                                            const userName = response.responseText.match(/steamcommunity.com\/id\/(.+?)\/friends\//);
                                            if (steam64Id) steamInfo.steam64Id = steam64Id[1];
                                            if (communitySessionID) steamInfo.communitySessionID = communitySessionID[1];
                                            if (userName) steamInfo.userName = userName[1];
                                            getAuthStatus.steamCom = 200;
                                            resolve(200);
                                        }
                                    } else {
                                        console.error(response);
                                        getAuthStatus.steamCom = 601;
                                        reject(601);
                                    }
                                },
                                r: resolve
                            })
                        }).then((ret) => {
                            if(ret == 200)
                            {
                                steamInfo.comUpdateTime = new Date().getTime();
                                GM_setValue('steamInfo', steamInfo);
                            }
                            r(ret);
                        }).catch(err => {
                            console.error(err);
                            r(err);
                        })
                    } else {
                        r(200);
                    }
                }
                if (type === 'store' || type === 'all') {
                    if (new Date().getTime() - steamInfo.storeUpdateTime > 10 * 60 * 1000 || update) {
                        if(603 == getAuthStatus.steamStore)
                        {
                            let i = 0;
                            let steamCheck = setInterval(()=>{
                                i++;
                                if(603 != getAuthStatus.steamStore)
                                {
                                    clearInterval(steamCheck);
                                    r(getAuthStatus.steamStore);
                                }
                                if(i >= 10)
                                {
                                    clearInterval(steamCheck);
                                    r(408);
                                }
                            }, 1000)
                            return;
                        }
                        getAuthStatus.steamStore = 603;
                        new Promise((resolve, reject) => {
                            func.httpRequest({
                                url: 'https://store.steampowered.com/stats/',
                                method: 'GET',
                                onload: (response) => {
                                    if (response.status === 200) {
                                        if (jq(response.responseText).find('a[href*="/login/"]').length > 0) {
                                            if (debug) console.log(response)
                                            getAuthStatus.steamStore = 401;
                                            reject(401)
                                        } else {
                                            const storeSessionID = response.responseText.match(/g_sessionID = "(.+?)";/)
                                            if (storeSessionID) steamInfo.storeSessionID = storeSessionID[1]
                                            getAuthStatus.steamStore = 200;
                                            resolve(200);
                                        }
                                    } else {
                                        console.error(response);
                                        getAuthStatus.steamStore = 601;
                                        reject(601);
                                    }
                                },
                                r: resolve
                            })
                        }).then((ret) => {
                            if(ret == 200)
                            {
                                steamInfo.storeUpdateTime = new Date().getTime();
                                GM_setValue('steamInfo', steamInfo);
                            }
                            r(ret)
                        }).catch(err => {
                            console.error(err);
                            r(err);
                        })
                    } else {
                        r(200)
                    }
                }
            }
            const Rep = (r, id)=>{
                RepHisCheck((status, ret = null) => {
                    if(status != 200)
                    {
                        r(status);
                        return;
                    }
                    if(!ret){
                        func.httpRequest({
                            url: 'https://steamcommunity.com/comment/Profile/post/' + id + '/-1/',
                            method: 'POST',
                            data: jq.param({comment:'+rep',count:6,sessionid:steamInfo.communitySessionID,feature2:-1}),
                            headers:{'content-type': 'application/x-www-form-urlencoded'},
                            onload: (response) => {
                                if(response.status == 200)
                                {
                                    let ret = JSON.parse(response.response)
                                    if(ret.success == true)r(200);
                                    else{
                                        console.error("发送评论失败", response);
                                        r(601);
                                    }
                                }else{
                                    console.error("评论返回值异常", response);
                                    r(601);
                                }
                            },
                            error: (err)=>{
                                console.error("请求发送异常", err);
                                r(601);
                            }
                        })
                    }else{
                        r(200);
                    }
                },id)
            }
            const RepHisCheck = function (r, id){
                InfoUpdate((ret) => {
                    if(ret != 200)
                    {
                        r(ret);
                        return;
                    }
                    func.httpRequest({
                        url: "https://steamcommunity.com/profiles/" + id,
                        method: 'GET',
                        onload: (response) => {
                            if(response.status == 200)
                            {
                                let comments = response.responseText.match(/commentthread_comments([\s\S]*)commentthread_footer/);
                                if(debug)console.log(comments);
                                if(comments != null)
                                {
                                    if(comments[1].includes(steamInfo.steam64Id) || steamInfo.userName?comments[1].includes(steamInfo.userName):false)
                                    {
                                        r(200, true);
                                    }
                                    else if(!response.responseText.includes("commentthread_textarea"))
                                    {
                                        r(605)
                                    }else{
                                        r(200, false);
                                    }
                                }
                                else r(605);
                            }else{
                                console.error("检查评论记录返回异常", response);
                                r(601);
                            }
                        }
                        //,anonymous:true
                    });
                }, "community")
            }
            const JoinGroupAuto = function (r, url) {
                InfoUpdate((ret) => {
                    if(ret != 200)
                    {
                        r(ret);
                        return;
                    }
                    func.httpRequest({
                        url: url,
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                        data: jq.param({ action: 'join', sessionID: steamInfo.communitySessionID }),
                        onload: (response) => {
                            if (response.status === 200 && !response.responseText.includes('grouppage_join_area')) {
                                if(response.responseText.match(/<h3>(.+?)<\/h3>/) && response.responseText.match(/<h3>(.+?)<\/h3>/)[1] != "您已经是该组的成员了。")
                                {
                                    console.error(response);
                                    r(601);
                                }else r(200);
                            } else {
                                console.error(response);
                                r(601);
                            }
                        }
                    })
                }, 'community');
            }
            const LeaveGroup = function (r, url) {
                let groupName = url.split('s/')[1];
                GetGroupID(groupName, (groupName, groupId) => {
                    var postUrl = "";
                    postUrl = (steamInfo.userName) ? 'https://steamcommunity.com/id/' + steamInfo.userName + '/home_process' : 'https://steamcommunity.com/profiles/' + steamInfo.steam64Id + '/home_process'
                    func.httpRequest({
                        url: postUrl,
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                        data: jq.param({ sessionID: steamInfo.communitySessionID, action: 'leaveGroup', groupId: groupId }),
                        onload: (response) => {
                            if (response.status === 200 && response.finalUrl.includes('groups') && jq(response.responseText.toLowerCase()).find(`a[href='https://steamcommunity.com/groups/${groupName.toLowerCase()}']`).length === 0) {
                                r(200);
                            } else {
                                console.error(response);
                                r(601);
                            }
                        },
                        r
                    })
                })
            }
            const GetGroupID = function (groupName, callback) {
                InfoUpdate((ret) => {
                    if(ret != 200)
                    {
                        callback(ret);
                        return;
                    }
                    new Promise(resolve => {
                        func.httpRequest({
                            url: 'https://steamcommunity.com/groups/' + groupName,
                            method: 'GET',
                            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                            onload: function (response) {
                                if (debug) console.log(response)
                                if (response.status === 200) {
                                    const groupId = response.responseText.match(/OpenGroupChat\( '([0-9]+)'/)
                                    if (groupId === null) {
                                        console.error(response)
                                        resolve(false)
                                    } else {
                                        resolve(groupId[1])
                                    }
                                } else {
                                    console.error(response)
                                    resolve(false)
                                }
                            },
                            r: () => {
                                resolve(false)
                            }
                        })
                    }).then(groupId => {
                        if (groupId !== false && callback) callback(groupName, groupId);
                    }).catch(err => {
                        console.error(err);
                    })
                })
            }
            const AddWishlistAuto = function (r, gameId) {
                InfoUpdate((ret) => {
                    if(ret != 200)
                    {
                        r(ret);
                        return;
                    }
                    new Promise(resolve => {
                        func.httpRequest({
                            url: 'https://store.steampowered.com/api/addtowishlist',
                            method: 'POST',
                            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                            data: jq.param({ sessionid: steamInfo.storeSessionID, appid: gameId }),
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
                            r(200)
                        } else {
                            func.httpRequest({
                                url: 'https://store.steampowered.com/app/' + gameId,
                                method: 'GET',
                                onload: function (response) {
                                    if (debug) console.log(response)
                                    if (response.status === 200) {
                                        if (response.responseText.includes('class="queue_actions_ctn"') && response.responseText.includes('已在库中')) {
                                            r(200)
                                        } else if ((response.responseText.includes('class="queue_actions_ctn"') && !response.responseText.includes('add_to_wishlist_area" style="display: none;"')) || !response.responseText.includes('class="queue_actions_ctn"')) {
                                            console.error(response);
                                            r(601);
                                        } else {
                                            r(200);
                                        }
                                    } else {
                                        console.error(response);
                                        r(601);
                                    }
                                },
                                r
                            })
                        }
                    }).catch(err => {
                        console.error(err);
                        r(601);
                    })
                },'store')
            }
            const RemoveWishlistAuto = function (r, gameId) {
                this.steamInfoUpdate(() => {
                    new Promise(resolve => {
                        func.httpRequest({
                            url: 'https://store.steampowered.com/api/removefromwishlist',
                            method: 'POST',
                            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                            data: jq.param({ sessionid: steamInfo.storeSessionID, appid: gameId }),
                            dataType: 'json',
                            onload: function (response) {
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
                            r(200);
                        } else {
                            func.httpRequest({
                                url: 'https://store.steampowered.com/app/' + gameId,
                                method: 'GET',
                                onload: function (response) {
                                    if (response.status === 200) {
                                        if (response.responseText.includes('class="queue_actions_ctn"') && (response.responseText.includes('已在库中') || response.responseText.includes('添加至您的愿望单'))) {
                                            r(200);
                                        } else {
                                            console.error(response);
                                            r(601);
                                        }
                                    } else {
                                        console.error(response);
                                        r(601);
                                    }
                                },
                                r
                            })
                        }
                    }).catch(err => {
                        console.error(err);
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
            const FollowAuto = function(r, name){
                AuthUpdate((status, key = false)=>{
                    if(status != 200)
                    {
                        r(status);
                        return;
                    }
                    if(false != key){
                        func.httpRequest({
                            url: 'https://www.tumblr.com/svc/follow',
                            method: 'POST',
                            headers: {"x-tumblr-form-key": key, "Content-Type": "application/x-www-form-urlencoded"},
                            data: jq.param({'data[tumblelog]': name}),
                            onload: (response) => {
                                if(response.status == 200)
                                {
                                    r(200);
                                }else
                                {
                                    console.error(response);
                                    r(601);
                                }
                            }
                        })
                    }else{
                        console.error("tumblrFollowAuto->key值错误");
                        r(601);
                    }
                })
            }
            const UnfollowAuto = function(r, name){
                AuthUpdate((status, key = false)=>{
                    if(status != 200)
                    {
                        r(status);
                        return;
                    }
                    if(false != key){
                        func.httpRequest({
                            url: 'https://www.tumblr.com/svc/unfollow',
                            method: 'POST',
                            headers: {"x-tumblr-form-key": key, "Content-Type": "application/x-www-form-urlencoded"},
                            data: jq.param({'data[tumblelog]': name}),
                            onload: (response) => {
                                if(response.status == 200)
                                {
                                    r(200);
                                }else{
                                    console.error(response);
                                    r(601);
                                }
                            }
                        })
                    }else{
                        r(601);
                    }
                })
            }
            const AuthUpdate = function(r, update = false){
                r(603)
                func.httpRequest({
                    url: 'https://www.tumblr.com/dashboard/iframe',
                    method: 'GET',
                    onload: (response) => {
                        if(response.status == 200)
                        {
                            let key = response.responseText.match(/id="tumblr_form_key" content="(.+?)">/)
                            if(key){
                                if(-1 != key.indexOf("!123") && -1 !=key.indexOf("|") )
                                {
                                    r(401);
                                    return;
                                }else r(200, key);
                            }
                            else{
                                console.error("tumblrGetKey->get key failed.", response);
                                r(601);
                            }
                        }else{
                            console.error(response);
                            r(601);
                        }
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
            const FollowAuto = function(r, channelId){
                AuthUpdate((status)=>{
                    if(status != 200)
                    {
                        r(status);
                        return;
                    }
                    func.httpRequest({
                        url: 'https://gql.twitch.tv/gql',
                        method: 'POST',
                        headers: { Authorization: "OAuth " + twitchAuth["auth-token"]},
                        data: '[{"operationName":"FollowButton_FollowUser","variables":{"input":{"disableNotifications":false,"targetID":"' + channelId + '"}},"extensions":{"persistedQuery":{"version":1,"sha256Hash":"3efee1acda90efdff9fef6e6b4a29213be3ee490781c5b54469717b6131ffdfe"}}}]',
                        onload: (response) => {
                            if (response.status === 200) {
                                r(200);
                            } else if(response.status === 401){
                                twitchAuth.updateTime = 0;
                                GM_setValue("twitchAuth", null);
                                r(401);
                            }else{
                                console.error(response);
                                r(601);
                            }
                        }
                    })
                })
            }
            const UnfollowAuto = function(r, channelId){
                AuthUpdate((status)=>{
                    if(status != 200)
                    {
                        r(status);
                        return;
                    }
                    func.httpRequest({
                        url: 'https://gql.twitch.tv/gql',
                        method: 'POST',
                        headers: { Authorization: "OAuth " + twitchAuth["auth-token"]},
                        data: '[{"operationName":"FollowButton_UnfollowUser","variables":{"input":{"targetID":"' + channelId + '"}},"extensions":{"persistedQuery":{"version":1,"sha256Hash":"d7fbdb4e9780dcdc0cc1618ec783309471cd05a59584fc3c56ea1c52bb632d41"}}}]',
                        onload: (response) => {
                            if (response.status === 200) {
                                r(200);
                            } else if(response.status === 401){
                                twitchAuth.updateTime = 0;
                                GM_setValue("twitchAuth", null);
                                r(401);
                            }else{
                                console.error(response);
                                r(601);
                            }
                        }
                    })
                })
            }
            // 弃用
            const twitchGetId = function(r, channels){
                func.httpRequest({
                    url: 'https://api.twitch.tv/api/channels/' + channels + '/access_token?oauth_token=' + GM_getValue("twitchAuth").match(/auth-token=(.+?); /)[1] + '&need_https=true&platform=web&player_type=site&player_backend=mediaplayer',
                    method: 'GET',
                    onload: (response) => {
                        if (response.status === 200) {
                            let rep = JSON.parse(JSON.parse(response.responseText).token);
                            r(rep.channel_id);
                        } else {
                            console.error(response);
                            r('error')
                        }
                    },
                    error:(res)=>{
                        console.error(res);
                    },
                    anonymous:true
                })
            }
            const AuthUpdate = function(r, update = false){
                if (new Date().getTime() - twitchAuth.updateTime > 30 * 60 * 1000 || twitchAuth.status != 200 || update) {
                    r(603)
                    new Promise((resolve, reject)=>{
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
                    }).then((ret)=>{
                        r(ret);
                    }).catch((err)=>{
                        r(err);
                    })
                }else{
                    r(200)
                }
            }
            return {
                AuthUpdate: AuthUpdate,
                FollowAuto: FollowAuto,
                UnfollowAuto: UnfollowAuto
            }
        })();
        const TWITTER = (()=>{
            const FollowAuto = function(r, data){
                AuthUpdate((status)=>{
                    if(status != 200)
                    {
                        r(status);
                        return;
                    }
                    GetUserInfo((status, userId = null)=>{
                        if(200 != status)
                        {
                            r(601);
                            return;
                        }
                        func.httpRequest({
                            url: 'https://api.twitter.com/1.1/friendships/create.json',
                            method: 'POST',
                            headers: { authorization: "Bearer " + twitterAuth.authorization, 'Content-Type': 'application/x-www-form-urlencoded', 'x-csrf-token':twitterAuth.ct0},
                            data: jq.param({ include_profile_interstitial_type: 1,include_blocking: 1,include_blocked_by: 1,include_followed_by: 1,include_want_retweets: 1,include_mute_edge: 1,include_can_dm: 1,include_can_media_tag: 1,skip_status: 1,id: userId}),
                            onload: (response) => {
                                if (response.status === 200) {
                                    r(200);
                                } else {
                                    console.error(response);
                                    twitterAuth.updateTime = 0;
                                    GM_setValue("twitterAuth", twitterAuth);
                                    r(601);
                                }
                            }
                        })
                    },data.username)
                })
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
                        func.httpRequest({
                            url: 'https://api.twitter.com/1.1/friendships/destroy.json',
                            method: 'POST',
                            headers: { authorization: "Bearer " + twitterAuth.authorization, 'Content-Type': 'application/x-www-form-urlencoded', 'x-csrf-token':twitterAuth.ct0},
                            data: jq.param({ include_profile_interstitial_type: 1,include_blocking: 1,include_blocked_by: 1,include_followed_by: 1,include_want_retweets: 1,include_mute_edge: 1,include_can_dm: 1,include_can_media_tag: 1,skip_status: 1,id: userId}),
                            onload: (response) => {
                                if (response.status === 200) {
                                    r(200);
                                } else {
                                    console.error(response);
                                    twitterAuth.updateTime = 0;
                                    GM_setValue("twitterAuth", twitterAuth);
                                    r(601);
                                }
                            }
                        })
                    },data.username)
                })
            }
            const RetweetAuto = function(r, url){
                let retweetId = url.split("status/")[1];
                AuthUpdate((status)=>{
                    if(status != 200)
                    {
                        r(status);
                        return;
                    }
                    func.httpRequest({
                        url: 'https://api.twitter.com/1.1/statuses/retweet.json',
                        method: 'POST',
                        headers: { authorization: "Bearer " + twitterAuth.authorization, 'Content-Type': 'application/x-www-form-urlencoded', 'x-csrf-token':twitterAuth.ct0},
                        data: jq.param({ tweet_mode: "extended",id: retweetId}),
                        onload: (response) => {
                            if (response.status === 200 || (response.status === 403 && response.responseText == '{"errors":[{"code":327,"message":"You have already retweeted this Tweet."}]}')) {
                                r(200);
                            } else {
                                console.error(response);
                                twitterAuth.updateTime = 0;
                                GM_setValue("twitterAuth", twitterAuth);
                                r(601);
                            }
                        }
                    })
                })
            }
            const GetUserInfo = function(r, userName){
                if(debug)console.log("====twitterGetUserInfo====");
                func.httpRequest({
                    url: 'https://api.twitter.com/graphql/-xfUfZsnR_zqjFd-IfrN5A/UserByScreenName?variables=%7B%22screen_name%22%3A%22' + userName + '%22%2C%22withHighlightedLabel%22%3Atrue%7D',
                    method: 'GET',
                    headers: { authorization: "Bearer " + twitterAuth.authorization, "content-type": "application/json"},
                    onload: (response) => {
                        if (response.status === 200) {
                            r(200, JSON.parse(response.responseText).data.user.rest_id);
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
            }
            const AuthUpdate = function(r, update = false){
                if(new Date().getTime() - twitterAuth.updateTime > 30 * 60 * 1000 || update){
                    r(603);
                    new Promise((resolve, reject)=>{
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
                    }).then((ret)=>{
                        r(ret)
                    }).catch((err)=>{
                        r(err)
                    })
                }else{
                    r(200);
                }
            }
            // 推特取得用户页面响应头（OK）
            /*twitterAP:function(r){
                func.httpRequest({
                    url: 'https://twitter.com/settings/account?k',
                    method: 'GET',
                    onload: (response) => {
                        if (response.status === 200) {
                            if(debug)console.log(response)
                            r(200, response.responseHeaders)
                        } else {
                            console.error(response);
                            r(601);
                        }
                    },
                    error:(res)=>{
                        console.error(res);
                        r(601);
                    }
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
                            console.log(twitchAuth)
                            window.close();
                        }
                        window.close();
                        break;
                    case "discord.com":
                        if(location.search == "?keyjokertask=storageAuth")
                        {
                            discordAuth.authorization = JSON.parse(localStorage.getItem("token"));
                            if(discordAuth.authorization == null)discordAuth.status = 401;
                            else discordAuth.status = 200;
                            discordAuth.updateTime = new Date().getTime();
                            GM_setValue("discordAuth", discordAuth);
                            console.log(discordAuth)
                            window.close();
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
                            window.close();
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
                DISCORD.AuthUpdate((status)=>{
                    this.statusReact(status, "discord");
                }, true);
                SPOTIFY.GetAccessToken((status, ret = null)=>{
                    this.statusReact(status, "spotify");
                });
                STEAM.InfoUpdate((status)=>{
                    this.statusReact(status, "steam");
                }, "all", true);
                TUMBLR.AuthUpdate((status, key = null)=>{
                    this.statusReact(status, "tumblr");
                }, true);
                TWITCH.AuthUpdate((status)=>{
                    this.statusReact(status, "twitch");
                }, true);
                TWITTER.AuthUpdate((status)=>{
                    this.statusReact(status, "twitter");
                }, true);
            },
            statusReact: (code, id)=>{
                switch(code)
                {
                    case 200:
                        noticeFrame.updateNotice(id, 'success');
                        break;
                    case 601:
                        noticeFrame.updateNotice(id, 'error')
                        break;
                    case 401:
                        noticeFrame.updateNotice1({id:id, class:"error", text:"Not Login"})
                        break;
                    case 408:
                        noticeFrame.updateNotice1({id:id, class:"error", text:"Time Out"})
                        break;
                    case 603:
                        noticeFrame.updateNotice1({id:id, class:"wait", text:"Getting Auth"})
                        break;
                    case 604:
                        noticeFrame.updateNotice1({id:id, class:"error", text:"Network Error"})
                        break;
                    case 605:
                        noticeFrame.updateNotice1({id:id, class:"error", text:"评论区未找到"})
                        break;
                    default:
                        noticeFrame.updateNotice1({id:id, class:"error", text:"Unknown Error"})
                        console.error("React Unknown Error--->", code)
                        break;
                }
            },
            checkUpdate: function(){
                noticeFrame.addNotice({type:"msg",msg:"正在检查版本信息...(当前版本：" + GM_info.script.version + ")"})
                func.httpRequest({
                    url: 'https://task.jysafe.cn/keyjoker/script/update.php?type=ver',
                    method: 'GET',
                    headers:{action: "keyjoker"},
                    onload: (response) => {
                        let ret = JSON.parse(response.response)
                        if(ret.status != 200)
                        {
                            noticeFrame.addNotice({type:"msg", msg:"异常！<font class=\"error\">" + ret.msg + "</font>"})
                            return;
                        }
                        if(this.checkVersion(ret.ver))
                        {
                            noticeFrame.addNotice({type:"msg", msg:"发现新版本！<font class=\"success\">" + ret.ver + "=>" + ret.msg + "</font>"})
                        }else{
                            noticeFrame.addNotice({type:"msg",msg:"当前已是最新版本！"})
                        }
                    },
                    error:(ret)=>{
                        console.log(ret);
                        noticeFrame.addNotice({type:"msg", msg:"请求异常！请至控制台查看详情！"})
                    },
                    anonymous:true
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
                                noticeFrame.updateNotice(task.id, 'success')
                                this.redeemAuto(task.redirect_url);
                                break;
                            case 601:
                                noticeFrame.updateNotice(task.id, 'error')
                                break;
                            case 401:
                                noticeFrame.updateNotice1({id:task.id, class:"error", text:"Not Login"})
                                break;
                            case 408:
                                noticeFrame.updateNotice1({id:task.id, class:"error", text:"Time Out"})
                                break;
                            case 603:
                                noticeFrame.updateNotice1({id:task.id, class:"wait", text:"Getting Auth"})
                                break;
                            case 604:
                                noticeFrame.updateNotice1({id:task.id, class:"error", text:"Network Error"})
                                break;
                            case 605:
                                noticeFrame.updateNotice1({id:task.id, class:"error", text:"评论区未找到"})
                                break;
                            default:
                                noticeFrame.updateNotice1({id:task.id, class:"error", text:"Unknown Error"})
                                console.error("React Unknown Error--->" + code)
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
                            noticeFrame.updateNotice1({id:task.id, class:"error", text:"Unknow Type:" + task.task.name})
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
                    //if(i >= 5)clearInterval(completeCheck);
                    // click reedem
                    jq('button[class="btn btn-primary"]').click();
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
                GM_xmlhttpRequest(requestObj);
            },
            // 人机验证出现图片时的处理
            hC_get_c:function(r){
                new Promise((resolve, reject)=>{
                    this.httpRequest({
                        url: 'https://hcaptcha.com/checksiteconfig?host=dashboard.hcaptcha.com&sitekey=e4b28873-6852-49c0-9784-7231f004b96b&sc=1&swa=1',
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json; charset=utf-8'},
                        onload: (response) => {
                            let ret = JSON.parse(response.response);
                            if(ret.pass){
                                GM_log(ret);
                                resolve(ret.c);
                            }else{
                                reject();
                            }
                        },
                        error: () =>{
                            if(debug)console.error("error");
                        }
                    })
                }).then((c)=>{
                    r(c);
                }).catch((err)=>{
                    console.error(err);
                    //let text = document.getElementsByClassName("prompt-text")[0].innerText;
                    //document.getElementsByClassName("prompt-text")[0].innerText = text + "\n免验证Cookie获取异常，请手动进行验证";
                });

            },
            hC_getcaptcha: function(r){
                this.hC_get_c((c)=>{
                    new Promise((resolve, reject)=>{
                        this.httpRequest({
                            url: 'https://hcaptcha.com/getcaptcha',
                            method: 'POST',
                            headers: { 'Content-Type': 'application/x-www-form-urlencoded'},
                            data: jq.param({
                                sitekey:'e4b28873-6852-49c0-9784-7231f004b96b',
                                host:'dashboard.hcaptcha.com',
                                n:'暂未实现获取方案',
                                c:JSON.stringify(c)
                            }),
                            onload: (response) => {
                                let rep = JSON.parse(response.response);
                                if(rep.pass)resolve(rep.generated_pass_UUID);
                                else {
                                    console.error("getcaptcha ERROR")
                                    reject(rep);
                                }
                            },
                            error: () =>{
                                if(debug)console.error("error");
                            }
                        })
                    }).then((c)=>{
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

                        new Promise((resolve, reject)=>{
                            // csrf token
                            this.httpRequest({
                                url: 'https://accounts.hcaptcha.com/user',
                                method: 'GET',
                                headers: { 'Content-Type': 'application/json'},
                                onload: (response) => {
                                    GM_log(response);
                                    let rep = JSON.parse(response.response);
                                    if(response.status == 200)
                                    {
                                        resolve(rep.csrf_token);
                                    }else{
                                        reject(response);
                                    }
                                },
                                error: (err) =>{
                                    if(debug)console.error(err);
                                }
                            })
                        }).then((csrf)=>{
                            this.hC_getcaptcha((token)=>{
                                if(token == false)
                                {
                                    document.getElementsByClassName("prompt-text")[0].innerText = text + "\ntoken 获取失败";
                                    return ;
                                }
                                this.httpRequest({
                                    url: 'https://accounts.hcaptcha.com/accessibility/get_cookie',
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json','x-csrf-token':csrf},
                                    data:JSON.stringify({token:token}),
                                    onload: (response) => {
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
                                    },
                                    error: (err) =>{
                                        console.error(err);
                                    }
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
                this.httpRequest({
                    url: direct_url,
                    method: 'GET',
                    headers: {'x-csrf-token': jq('meta[name="csrf-token"]').attr('content')},
                    onload: (response) => {
                    },
                    error:(res)=>{
                    }
                })
            },
            test: function(){
                // GM_openInTab("https://discord.com/channels/@me?keyjokertask=storageAuth", true);
            }
        }
        // ============Start===========
        if(location.pathname == "/entries")
        {
            window.onload=()=>{
                GM_log("main")
                if(document.getElementsByClassName("nav-item active").length != 0 && document.getElementsByClassName("nav-item active")[0].innerText == "Earn Credits" && document.getElementById("logout-form"))
                {
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
                func.httpRequest({
                    url: 'https://task.jysafe.cn/keyjoker/script/update.php?type=changelog&ver=' + GM_info.script.version,
                    method: 'GET',
                    headers:{action: "keyjoker"},
                    onload: (response) => {
                        let ret = JSON.parse(response.response)
                        if(ret.status != 200)
                        {
                            noticeFrame.addNotice({type:"msg", msg:"异常！<font class=\"error\">" + ret.msg + "</font>"})
                        }else
                        {
                            noticeFrame.addNotice({type:"msg", msg:"<font class=\"success\">" + ret.msg + "</font>"})
                        }
                    },
                    error:(ret)=>{
                        console.log(ret);
                        noticeFrame.addNotice({type:"msg", msg:"<font class=\"error\">请求异常！请至控制台查看详情！</font>"})
                    },
                    anonymous:true
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
                func.httpRequest({
                    url: 'https://task.jysafe.cn/keyjoker/script/update.php?type=changelog&ver=' + GM_info.script.version,
                    method: 'GET',
                    headers:{action: "keyjoker"},
                    onload: (response) => {
                        let ret = JSON.parse(response.response)
                        if(ret.status != 200)
                        {
                            noticeFrame.addNotice({type:"msg", msg:"异常！<font class=\"error\">" + ret.msg + "</font>"})
                        }else
                        {
                            noticeFrame.addNotice({type:"msg", msg:"<font class=\"success\">" + ret.msg + "</font>"})
                        }
                    },
                    error:(ret)=>{
                        console.log(ret);
                        noticeFrame.addNotice({type:"msg", msg:"更新日志获取异常！请至控制台查看详情！"})
                    },
                    anonymous:true
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