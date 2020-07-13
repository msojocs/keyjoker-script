// ==UserScript==
// @name         keyjoker自动任务
// @namespace    https://greasyfork.org/zh-CN/scripts/406476
// @version      0.6.1
// @description  keyjoker自动任务,修改自https://greasyfork.org/zh-CN/scripts/383411,部分操作需手动辅助
// @author       祭夜
// @include      *://www.keyjoker.com/entries*
// @include      *.hcaptcha.com/*
// @include      *://steamcommunity.com/profiles/*?type=keyjoker
// @include      *://steamcommunity.com/groups/*
// @include      *://discord.com/invite/*
// @include      *://discord.com/channels/@me?keyjokertask=storageAuth
// @include      *://www.twitch.tv/settings/profile?keyjokertask=storageAuth
// @include      *://twitter.com/*
// @include      *://open.spotify.com/album/*
// @include      *?type=keyjoker
// @updateURL    https://github.com/jiyeme/keyjokerScript/raw/master/keyjoker.user.js
// @downloadURL  https://github.com/jiyeme/keyjokerScript/raw/master/keyjoker.user.js
// @supportURL   https://www.jysafe.cn/
// @homepage     https://www.jysafe.cn/
// @run-at       document-start
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
// @connect      discord.com
// @connect      twitch.tv
// @connect      *.spotify.com
// @connect      *
// @require      https://greasyfork.org/scripts/379868-jquery-not/code/jQuery%20not%20$.js?version=700787
// @require      https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// ==/UserScript==

(function() {
    'use strict';
    const debug = 0;
    // steam信息
    const steamInfo = GM_getValue('steamInfo') || {
        userName: '',
        steam64Id: '',
        communitySessionID: '',
        storeSessionID: '',
        updateTime: 0
    }
    const twitterAuth = GM_getValue('twitterAuth') || {
        authorization: "AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA",
        ct0: '',
        updateTime: 0
    }
    const discordAuth = GM_getValue('discordAuth') || {
        authorization: "",
        updateTime: 0
    }
    const twitchAuth = GM_getValue('twitchAuth') || {
        "auth-token": "",
        updateTime: 0
    }
    const noticeFrame = {
        loadFrame: ()=>{
            if(debug)console.log("loadFrame");
            $('body').append(`<style>
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
[class^=el-icon-]{font-family:element-icons !important;speak:none;font-style:normal;font-weight:400;font-variant:normal;text-transform:none;line-height:1;vertical-align:baseline;display:inline-block;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}
.el-icon-brush:before{content:"\\e76e"}
.el-icon-document:before{content:"\\e785"}
.el-icon-refresh:before{content:"\\e6d0"}
.el-icon-s-promotion:before{content:"\\e7ba"}
.el-icon-setting:before{content:"\\e6ca"}
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
<div class="el-badge item"><button type="button" class="el-button el-button--default is-circle"
title="检查更新">
<i class="el-icon-refresh"></i>
</button><sup class="el-badge__content el-badge__content--undefined is-fixed is-dot"
style="display: none;"></sup></div>
<div class="el-badge item"><button type="button" class="el-button el-button--default is-circle" title="设置">
<i class="el-icon-setting"></i>
</button><sup class="el-badge__content el-badge__content--undefined is-fixed is-dot"></sup>
</div>
<div class="el-badge item"><button type="button" class="el-button el-button--default is-circle"
title="查看更新内容">
<i class="el-icon-document"></i>
</button><sup class="el-badge__content el-badge__content--undefined is-fixed is-dot"
style="display: none;"></sup></div>
<div class="el-badge item"><button type="button" class="el-button el-button--default is-circle"
title="清理缓存">
<i class="el-icon-brush"></i>
</button><sup class="el-badge__content el-badge__content--undefined is-fixed is-dot"
style="display: none;"></sup></div>
<div class="el-badge item"><button type="button" class="el-button el-button--default is-circle"
title="提交建议/BUG">
<i class="el-icon-s-promotion"></i>
</button><sup class="el-badge__content el-badge__content--undefined is-fixed is-dot"
style="display: none;"></sup></div>
</h2>
<h2 class="el-notification__title">任务执行日志</h2>
<div class="el-notification__content" style="">
<p></p>
<!--<li>正在更新Steam社区SessionID(用于加组退组)...<font class="success">Success</font>-->
</li>
</div>
</div>
</div>`)
        },
        addNotice: function(data){
            switch(data.type)
            {
                case "taskStatus":
                    $('.el-notification__content').append('<li>' + data.task.task.name + ' <a href="' + data.task.data.url + '" target="_blank">' + (data.task.data.name||data.task.data.username) + '</a>|<font id="' + data.task.id + '" class="' + data.status +'">' + data.status +'</font></li>');
                    break;
                case "msg":
                    $('.el-notification__content').append("<li>" + data.msg + "</li>");
                    break;
                default:
                    break;
            }
        },
        clearNotice:()=>{
            $('.el-notification__content li').remove();
        },
        updateNotice: function(id, status){
            $('font#' + id).removeClass()
            $('font#' + id).addClass(status)
            $('font#' + id).text(status)
        }
    }
    try{
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
                    success:(data,status,xhr)=>{
                        if(data && (data.actions && (data.actions.length > sum) )){
                            console.log(data);
                            let date=new Date();
                            let hour=date.getHours();
                            let min=date.getMinutes()<10?("0"+date.getMinutes()):date.getMinutes();
                            $(".border-bottom").text(hour+":"+min+" 检测到新任务");
                            /*$show({
                                title:"keyjoker新任务",
                                msg:"keyjoker网站更新"+(data.actions.length-sum)+"个新任务！",
                                icon:"https://www.keyjoker.com/favicon-32x32.png",
                                time:0,
                                onclick:function(){
                                    location.reload(true);
                                }
                            });*/
                            // 重载列表
                            noticeFrame.clearNotice();
                            func.reLoadTaskList(()=>{
                                if(debug)console.log("当前任务模式：高级")
                                func.do_task(data);
                            });
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
            let time = GM_getValue("time");
            if(!time){
                time=60;
            }
            if(confirm("是否以时间间隔" + time + "秒进行任务检测？")){
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
            appHandle: function(){
                switch(location.hostname)
                {
                    case "www.twitch.tv":
                        if(location.search == "?keyjokertask=storageAuth")
                        {
                            let cookie = document.cookie + ";"
                            twitchAuth["auth-token"] = cookie.match(/auth-token=(.+?);/)[1]
                            twitchAuth.updateTime = new Date().getTime()
                            GM_setValue("twitchAuth", twitchAuth)
                            window.close();
                        }
                        break;
                    case "discord.com":
                        if(location.search == "?keyjokertask=storageAuth")
                        {
                            discordAuth.authorization = JSON.parse(localStorage.getItem("token"));
                            discordAuth.updateTime = new Date().getTime()
                            GM_setValue("discordAuth", discordAuth);
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
            // OK
            discordJoinServerAuto: function(r, server){
                this.discordAuthUpdate(()=>{
                    this.httpRequest({
                        url: 'https://discord.com/api/v6/invites/' + server,
                        method: 'POST',
                        headers: { authorization: discordAuth.authorization, "content-type": "application/json"},
                        onload: (response) => {
                            console.log(response)
                            if (response.status === 200) {
                                console.log({ result: 'success', statusText: response.statusText, status: response.status })
                                r('success');
                            } else {
                                console.log('Error:' + response.statusText + '(' + response.status + ')')
                                console.log({ result: 'error', statusText: response.statusText, status: response.status })
                                r('error');
                            }
                        },
                        error:(res)=>{
                            console.error(res);
                        },
                        anonymous:true
                    })
                })
            },
            // OK
            discordAuthUpdate:function(r, update = false){
                if (new Date().getTime() - discordAuth.updateTime > 30 * 60 * 1000 || update) {
                    new Promise((resolve)=>{
                        noticeFrame.addNotice({type:"msg", msg:"将在新窗口自动获取discord凭证"});
                        window.open("https://discord.com/channels/@me?keyjokertask=storageAuth");
                        let i = 0;
                        let check = setInterval(()=>{
                            i++;
                            if(GM_getValue("discordAuth") && new Date().getTime() - GM_getValue("discordAuth").updateTime <= 30 * 60 * 1000)
                            {
                                noticeFrame.addNotice({type:"msg", msg:"<font class=\"success\">discordAuth updated!</font>"})
                                discordAuth.authorization = GM_getValue("discordAuth").authorization
                                discordAuth.updateTime = GM_getValue("discordAuth").updateTime
                                clearInterval(check);
                                resolve("success")
                            }
                            if(i >= 30)
                            {
                                noticeFrame.addNotice({type:"msg", msg:"<font class=\"error\">discordAuth获取超时</font>"})
                                clearInterval(check);
                                resolve("error")
                            }
                        }, 1000)
                    }).then((ret)=>{
                        if(ret == "success"){
                            r(1)
                        }
                    })
                }else{
                    r(1)
                }
            },
            do_task: function(data){
                console.log("do task")
                for(const task of data.actions)
                {
                    switch(task.task.name)
                    {
                        case "Join Steam Group":
                            // this.steamInfoUpdate('all');
                            noticeFrame.addNotice({type: "taskStatus", task:task, status:'start'});
                            this.steamJoinGroupAuto(
                                (ret)=>{
                                    if(ret == "success")
                                    {
                                        this.redeemAuto(task.redirect_url);
                                        noticeFrame.updateNotice(task.id, 'success')
                                    }else{
                                        noticeFrame.updateNotice(task.id, 'error')
                                    }
                                },
                                task.data.name);
                            break;
                        case "Follow Twitter Account":
                            noticeFrame.addNotice({type: "taskStatus", task:task, status:'start'});
                            console.log(task)
                            this.twitterFollowAuto(
                                (ret)=>{
                                    if(ret == "success")
                                    {
                                        this.redeemAuto(task.redirect_url);
                                        noticeFrame.updateNotice(task.id, 'success')
                                    }else{
                                        noticeFrame.updateNotice(task.id, 'error')
                                    }
                                },
                                task.data.username);
                            break;
                        case "Join Discord Server":
                            noticeFrame.addNotice({type: "taskStatus", task:task, status:'start'});
                            var server = task.data.url.split(".gg/")[1];
                            this.discordJoinServerAuto(
                                (ret)=>{
                                    if(ret == "success")
                                    {
                                        this.redeemAuto(task.redirect_url);
                                        noticeFrame.updateNotice(task.id, 'success')
                                    }else{
                                        noticeFrame.updateNotice(task.id, 'error')
                                    }
                                },
                                server)
                            break;
                        case "Retweet Twitter Tweet":
                            noticeFrame.addNotice({type: "taskStatus", task:task, status:'start'});
                            this.twitterRetweetAuto(
                                (ret)=>{
                                    if(ret == "success")
                                    {
                                        this.redeemAuto(task.redirect_url);
                                        noticeFrame.updateNotice(task.id, 'success')
                                    }else{
                                        noticeFrame.updateNotice(task.id, 'error')
                                    }
                                },
                                task.data.url);
                            break;
                        case "Save Spotify Album":
                            noticeFrame.addNotice({type: "taskStatus", task:task, status:'start'});
                            this.spotifyLikeAuto(
                                (ret)=>{
                                    if(ret == "success")
                                    {
                                        this.redeemAuto(task.redirect_url);
                                        noticeFrame.updateNotice(task.id, 'success')
                                    }else{
                                        noticeFrame.updateNotice(task.id, 'error')
                                    }
                                },
                                task.data.id
                            );
                            break;
                        case "Follow Twitch Channel":
                            noticeFrame.addNotice({type: "taskStatus", task:task, status:'start'});
                            this.twitchFollowAuto(
                                (ret)=>{
                                    if(ret == "success")
                                    {
                                        this.redeemAuto(task.redirect_url);
                                        noticeFrame.updateNotice(task.id, 'success')
                                    }else{
                                        noticeFrame.updateNotice(task.id, 'error')
                                    }
                                },
                                task.data.id);
                            break;
                        case "steam rep":
                            noticeFrame.addNotice({type: "taskStatus", task:task, status:'start'});
                            this.steamRepAuto(
                                (ret)=>{
                                    if(ret == "success")
                                    {
                                        this.redeemAuto(task.redirect_url);
                                        noticeFrame.updateNotice(task.id, 'success')
                                    }else{
                                        noticeFrame.updateNotice(task.id, 'error')
                                    }
                                },
                                task.data.url);
                            break;
                        default:
                            noticeFrame.addNotice({type: "taskStatus", task:task, status:'error'});
                            console.log("未指定操作" + task.task.name)
                            break;
                    }
                }
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
                GM_xmlhttpRequest(requestObj)
            },
            // 人机验证出现图片时的处理
            hcaptcha2: function () {
                let hcaptcha2Click=setInterval(()=>{
                    if(document.getElementsByClassName("challenge-container").length != 0 && document.getElementsByClassName("challenge-container")[0].children.length != 0)
                    {
                        console.log("open hcaptcha");
                        let text = document.getElementsByClassName("prompt-text")[0].innerText;
                        document.getElementsByClassName("prompt-text")[0].innerText = text + "\n正在自动获取免验证Cookie";
                        //$(".task-grid").remove();
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
                                    document.getElementsByClassName("prompt-text")[0].innerText = text + "\n当前IP的免验证Cookie获取次数已达上限，请更换hcaptcha账号";
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
            // OK
            redeemAuto: function(redirect_url){
                if(0 != $('a[href="' + redirect_url + '"]').length)$('a[href="' + redirect_url + '"]').next().click();
            },
            reLoadTaskList: function(r){
                // 重载任务列表
                if(2 == document.getElementsByClassName('row').length)
                {
                    $('.row')[1].remove();
                    $('.layout-container').append('<entries-component></entries-component>');
                    $.getScript("/js/app.js", (rep,status)=>{
                        if("success" == status)r();
                        else console.error(status, rep);
                    });
                }
            },
            setAuth: function(type){
                if(debug)console.log("setAuth");
                if(!GM_getValue("discordAuth") || type == "discord")
                {
                    alert("将在新窗口自动获取discord凭证");
                    window.open("https://discord.com/channels/@me?keyjokertask=storageAuth");
                }
                if(!GM_getValue("twitchAuth") || type == "twitch")
                {
                    alert("将在新窗口获取twitch凭证");
                    window.open("https://www.twitch.tv/settings/profile?keyjokertask=storageAuth");
                }
            },
            // steam信息更新（In Progress）[修改自https://greasyfork.org/zh-CN/scripts/370650]
            steamInfoUpdate: function (r, type = 'all', update = false) {
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
            // steam个人资料回复"+rep"（In Progress）
            steamRepAuto: function(r, url){
                let id = url.split("s/")[1];
                this.steamInfoUpdate(() => {
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
                            if(response.status == 200)
                            {
                                r('success');
                            }else r('error')
                        }
                    });
                })
            },
            // steam加组（OK）[修改自https://greasyfork.org/zh-CN/scripts/370650]
            steamJoinGroupAuto: function (r, group) {
                this.steamInfoUpdate(() => {
                    if(debug){console.log("====steamJoinGroupAuto====");}
                    this.httpRequest({
                        url: 'https://steamcommunity.com/groups/' + group,
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                        data: $.param({ action: 'join', sessionID: steamInfo.communitySessionID }),
                        onload: (response) => {
                            if (debug) console.log(response)
                            if (response.status === 200 && !response.responseText.includes('grouppage_join_area') &&  !response.responseText.includes('error_ctn')) {
                                console.log("steamJoinGroupAuto")
                                console.log({ result: 'success', statusText: response.statusText, status: response.status })
                                r('success');
                            } else {
                                status.error('Error:' + response.statusText + '(' + response.status + ')')
                                console.log({ result: 'error', statusText: response.statusText, status: response.status })
                                r('error');
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
            spotifyLikeAuto: function(r, albums){
                this.spotifyGetUserInfo((userId, accessToken)=>{
                    $.ajax({
                        type: 'PUT',
                        url: "https://spclient.wg.spotify.com/collection-view/v1/collection/albums/" + userId + "?base62ids=" + albums + "&model=bookmark",
                        headers: {authorization: "Bearer " + accessToken},
                        success: function(data){
                            console.log(data);
                            r('success');
                        },
                        error: function(data){
                            console.error(data);
                            r('error')
                        },
                        anonymous:true
                    });
                });
            },
            // OK
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
                            onreadystatechange :(r)=>{
                                console.log(r);
                            },
                            anonymous:true
                        })
                    }
                )
            },
            // OK
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
            // OK
            twitchFollowAuto: function(r, channelId){
                this.twitchAuthUpdate(()=>{
                    this.httpRequest({
                        url: 'https://gql.twitch.tv/gql',
                        method: 'POST',
                        headers: { Authorization: "OAuth " + twitchAuth["auth-token"]},
                        data: '[{"operationName":"FollowButton_FollowUser","variables":{"input":{"disableNotifications":false,"targetID":"' + channelId + '"}},"extensions":{"persistedQuery":{"version":1,"sha256Hash":"3efee1acda90efdff9fef6e6b4a29213be3ee490781c5b54469717b6131ffdfe"}}}]',
                        onload: (response) => {
                            if (debug) console.log(response)
                            if (response.status === 200) {
                                r("success")
                                console.log({ result: 'success', statusText: response.statusText, status: response.status })
                            } else {
                                console.log('Error:' + response.statusText + '(' + response.status + ')')
                                console.log({ result: 'error', statusText: response.statusText, status: response.status })
                                r('error')
                            }
                        }
                    })
                })
            },
            // 弃用
            twitchGetIdAuto: function(r, channels){
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
            // OK
            twitchAuthUpdate:function(r, update = false){
                if (new Date().getTime() - twitchAuth.updateTime > 30 * 60 * 1000 || update) {
                    new Promise((resolve)=>{
                        noticeFrame.addNotice({type:"msg", msg:"将在新窗口自动获取twitch凭证"});
                        window.open("https://www.twitch.tv/settings/profile?keyjokertask=storageAuth");
                        let i = 0;
                        let check = setInterval(()=>{
                            i++;
                            if(GM_getValue("twitchAuth") && new Date().getTime() - GM_getValue("twitchAuth").updateTime <= 30 * 60 * 1000)
                            {
                                noticeFrame.addNotice({type:"msg", msg:"<font class=\"success\">twitchAuth updated!</font>"})
                                twitchAuth["auth-token"] = GM_getValue('twitchAuth')["auth-token"];
                                twitchAuth.updateTime = GM_getValue('twitchAuth').updateTime;
                                clearInterval(check);
                                resolve("success")
                            }
                            if(i >= 30)
                            {
                                noticeFrame.addNotice({type:"msg", msg:"<font class=\"error\">twitchAuth获取超时</font>"})
                                clearInterval(check);
                                resolve("error")
                            }
                        }, 1000)
                    }).then((ret)=>{
                        if(ret == "success"){
                            r(1)
                        }
                    })
                }else{
                    r(1)
                }
            },
            // OK
            twitterFollowAuto: function(r, userName){
                this.twitterAuthUpdate(()=>{
                    this.twitterGetUserInfo((userId)=>{
                        console.log(userId)
                        this.httpRequest({
                            url: 'https://api.twitter.com/1.1/friendships/create.json',
                            method: 'POST',
                            headers: { authorization: "Bearer " + twitterAuth.authorization, 'Content-Type': 'application/x-www-form-urlencoded', 'x-csrf-token':twitterAuth.ct0},
                            data: $.param({ include_profile_interstitial_type: 1,include_blocking: 1,include_blocked_by: 1,include_followed_by: 1,include_want_retweets: 1,include_mute_edge: 1,include_can_dm: 1,include_can_media_tag: 1,skip_status: 1,id: userId}),
                            onload: (response) => {
                                if (debug) console.log(response)
                                if (response.status === 200) {
                                    r("success");
                                } else {
                                    console.log('Error:' + response.statusText + '(' + response.status + ')')
                                    console.log({ result: 'error', statusText: response.statusText, status: response.status })
                                    r("error");
                                }
                            }
                        })
                    },userName)
                })
            },
            // OK
            twitterRetweetAuto: function(r, url){
                if(debug)console.log("====twitterRetweetAuto====");
                let retweetId = url.split("status/")[1];
                this.twitterAuthUpdate(()=>{
                    this.httpRequest({
                        url: 'https://api.twitter.com/1.1/statuses/retweet.json',
                        method: 'POST',
                        headers: { authorization: "Bearer " + twitterAuth.authorization, 'Content-Type': 'application/x-www-form-urlencoded', 'x-csrf-token':twitterAuth.ct0},
                        data: $.param({ tweet_mode: "extended",id: retweetId}),
                        onload: (response) => {
                            if (debug) console.log(response)
                            if (response.status === 200 || (response.status === 403 && response.responseText == '{"errors":[{"code":327,"message":"You have already retweeted this Tweet."}]}')) {
                                console.log("success");
                                if(debug)console.log({ result: 'success', statusText: response.statusText, status: response.status });
                                r("success");
                            } else {
                                console.log('Error:' + response.statusText + '(' + response.status + ')')
                                console.log({ result: 'error', statusText: response.statusText, status: response.status })
                                r('error');
                            }
                        }
                    })
                })
            },
            // OK
            twitterGetUserInfo: function(r, userName){
                if(debug)console.log("====twitterGetUserInfo====");
                this.httpRequest({
                    url: 'https://api.twitter.com/graphql/-xfUfZsnR_zqjFd-IfrN5A/UserByScreenName?variables=%7B%22screen_name%22%3A%22' + userName + '%22%2C%22withHighlightedLabel%22%3Atrue%7D',
                    method: 'GET',
                    headers: { authorization: "Bearer " + twitterAuth.authorization, "content-type": "application/json"},
                    onload: (response) => {
                        if (response.status === 200) {
                            console.log(response)
                            r(JSON.parse(response.responseText).data.user.rest_id);
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
            // OK
            twitterAP:function(r){
                this.httpRequest({
                    url: 'https://twitter.com/settings/account?k',
                    method: 'GET',
                    onload: (response) => {
                        if (response.status === 200) {
                            console.log(response)
                            console.log({ result: 'success', statusText: response.statusText, status: response.status })
                            r(response.responseHeaders)
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
            // OK
            twitterAuthUpdate:function(r, update = false){
                if(new Date().getTime() - twitterAuth.updateTime > 30 * 60 * 1000 || update){
                    new Promise((resolve, reject) => {
                        this.twitterAP((ret)=>{
                            let xcf = ret.match(/ct0=(.+?);/)[1]
                            this.httpRequest({
                                url: 'https://api.twitter.com/1.1/jot/client_event.json',
                                method: 'POST',
                                headers: { authorization: "Bearer " + twitterAuth.authorization,"x-csrf-token":xcf , "content-type": "application/json"},
                                data: "category=perftown&log=%5B%7B%22description%22%3A%22rweb%3Aseen_ids%3Apersistence%3Aget%3Asuccess%22%2C%22product%22%3A%22rweb%22%2C%22duration_ms%22%3A568%7D%2C%7B%22description%22%3A%22rweb%3Aseen_ids%3Apersistence%3Aget%3Asuccess%22%2C%22product%22%3A%22rweb%22%2C%22duration_ms%22%3A571%7D%2C%7B%22description%22%3A%22rweb%3Ainit%3AstorePrepare%22%2C%22product%22%3A%22rweb%22%2C%22duration_ms%22%3A581%7D%2C%7B%22description%22%3A%22rweb%3Attft%3AperfSupported%22%2C%22product%22%3A%22rweb%22%2C%22duration_ms%22%3A1%7D%2C%7B%22description%22%3A%22rweb%3Attft%3Aconnect%22%2C%22product%22%3A%22rweb%22%2C%22duration_ms%22%3A22%7D%2C%7B%22description%22%3A%22rweb%3Attft%3Aprocess%22%2C%22product%22%3A%22rweb%22%2C%22duration_ms%22%3A1497%7D%2C%7B%22description%22%3A%22rweb%3Attft%3Aresponse%22%2C%22product%22%3A%22rweb%22%2C%22duration_ms%22%3A425%7D%2C%7B%22description%22%3A%22rweb%3Attft%3Ainteractivity%22%2C%22product%22%3A%22rweb%22%2C%22duration_ms%22%3A2217%7D%5D",
                                onload: (response) => {
                                    console.log(response)
                                    if (response.status === 200) {
                                        console.log({ result: 'success', statusText: response.statusText, status: response.status })
                                        let ct0 = response.responseHeaders.match(/ct0=(.+?);/)[1]
                                        if(ct0)twitterAuth.ct0 = ct0;
                                        resolve({status:"success"})
                                    } else {
                                        console.log('Error:' + response.statusText + '(' + response.status + ')')
                                        console.log({ result: 'error', statusText: response.statusText, status: response.status })
                                        resolve({status:"error"})
                                    }
                                },
                                error:(res)=>{
                                    console.log("error");
                                    console.log(res);
                                    resolve({status:"error"})
                                }
                            })
                        })
                    }).then((ret)=>{
                        console.log(ret);
                        if(ret.status == "success")
                        {
                            twitterAuth.updateTime = new Date().getTime()
                            GM_setValue("twitterAuth", twitterAuth)
                            r(1);
                        }else{
                            noticeFrame.addNotice({type:"msg", msg:"twitter token获取失败"})
                        }
                    })
                }else{
                    r(1)
                }
            },
            test: function(){
                $('.card').remove();
                start()
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
            console.log("keyjoker任务页面！");
            window.onload=()=>{
                if(document.getElementsByClassName("nav-item active").length != 0 && document.getElementsByClassName("nav-item active")[0].innerText == "Earn Credits")
                {
                    noticeFrame.loadFrame();
                    let isStart=setInterval(()=>{
                        if(GM_getValue("start")==1){
                            clearInterval(isStart);
                            next();
                        }
                    },1000);
                }
            }
        }else{
            func.appHandle();
        }
        GM_registerMenuCommand("设置时间间隔",setTime);
        function checkSwitch(id){
            GM_unregisterMenuCommand(id);
            if(0 == GM_getValue("start")){
                let id = GM_registerMenuCommand("开始检测",()=>{
                    start();
                    checkSwitch(id);
                });
            }else{
                let id = GM_registerMenuCommand("停止检测",()=>{
                    let date=new Date();
                    let hour=date.getHours();
                    let min=date.getMinutes()<10?("0"+date.getMinutes()):date.getMinutes();
                    GM_setValue("start",0);
                    $(".border-bottom").text(hour+":"+min+" 停止执行新任务检测");
                    checkSwitch(id);
                });
            }
        }
        checkSwitch(null);
        let id0 = GM_registerMenuCommand("凭证设置",()=>{
            func.setAuth();
        });
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