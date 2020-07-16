// ==UserScript==
// @name         keyjoker自动任务
// @namespace    https://greasyfork.org/zh-CN/scripts/406476
// @version      0.6.9
// @description  keyjoker自动任务,修改自https://greasyfork.org/zh-CN/scripts/383411
// @author       祭夜
// @include      *://www.keyjoker.com/entries*
// @include      *://assets.hcaptcha.com/*
// @include      *://discord.com/channels/@me?keyjokertask=storageAuth
// @include      *://www.twitch.tv/settings/profile?keyjokertask=storageAuth
// @updateURL    https://github.com/jiyeme/keyjokerScript/raw/master/keyjoker.user.js
// @downloadURL  https://github.com/jiyeme/keyjokerScript/raw/master/keyjoker.user.js
// @supportURL   https://www.jysafe.cn/4332.air
// @homepage     https://www.jysafe.cn/
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
// @connect      accounts.hcaptcha.com
// @connect      store.steampowered.com
// @connect      steamcommunity.com
// @connect      twitter.com
// @connect      facebook.com
// @connect      discord.com
// @connect      twitch.tv
// @connect      tumblr.com
// @connect      spotify.com
// @connect      jysafe.cn
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
        status:0,
        updateTime: 0
    }
    const twitchAuth = GM_getValue('twitchAuth') || {
        "auth-token": "",
        status:0,
        updateTime: 0
    }
    try{
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
<!--<li>正在更新Steam社区SessionID(用于加组退组)...<font class="success">Success</font>-->
</li>
</div>
</div>
</div>`)
                $('button#checkUpdate').click(
                    function(){
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
                                if(ret.ver > GM_info.script.version)
                                {
                                    noticeFrame.addNotice({type:"msg", msg:"发现新版本！<font class=\"success\">" + ret.ver + "=>" + ret.msg + "</font>"})
                                }else if(ret.ver < GM_info.script.version){
                                    noticeFrame.addNotice({type:"msg", msg:"震惊(○´･д･)ﾉ！<font class=\"success\">你的版本比最新版本还要新！</font>"})
                                }else if(ret.ver == GM_info.script.version){
                                    noticeFrame.addNotice({type:"msg",msg:"当前已是最新版本！"})
                                }else{
                                    noticeFrame.addNotice({type:"msg",msg:"<font class=\"error\">发生了未知异常！！</font>"})
                                }
                            },
                            error:(ret)=>{
                                console.log(ret);
                                noticeFrame.addNotice({type:"msg", msg:"请求异常！请至控制台查看详情！"})
                            },
                            anonymous:true
                        })
                    })
                $('button#fuck').click(function(){
                    $('.card').remove();
                    start()
                })
                $('button#clearNotice').click(function(){
                    noticeFrame.clearNotice()
                })
                $('button#changeLog').click(function(){
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
                $('button#report').click(function(){
                    noticeFrame.addNotice({type:"msg",msg:"目前提供以下反馈渠道："})
                    noticeFrame.addNotice({type:"msg",msg:"<a href=\"https://www.jysafe.cn/4332.air\" target=\"_blank\">博客页面</a>"})
                    noticeFrame.addNotice({type:"msg",msg:"<a href=\"https://github.com/jiyeme/keyjokerScript/issues/new/choose\" target=\"_blank\">GitHub</a>"})
                    noticeFrame.addNotice({type:"msg",msg:"<a href=\"https://keylol.com/t620181-1-1\" target=\"_blank\">其乐社区</a>"})
                })
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
                            noticeFrame.addNotice({type:"msg", msg:"请求异常！请至控制台查看详情！"})
                        },
                        anonymous:true
                    })
                    GM_setValue("currentVer", GM_info.script.version)
                }
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
            },
            updateNotice1: function(data){
                $('font#' + data.id).removeClass()
                $('font#' + data.id).addClass(data.class)
                $('font#' + data.id).text(data.text || data.class)
            }
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
                    success:(data,status,xhr)=>{
                        if(data && (data.actions && (data.actions.length > sum) )){
                            if(debug)console.log(data);
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
                                    //location.reload(true);
                                }
                            });
                            // 重载列表
                            noticeFrame.clearNotice();
                            func.reLoadTaskList(()=>{
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
            let time = GM_getValue("time");
            if(!time){
                time=60;
            }
            if(confirm("是否以时间间隔" + time + "秒进行任务检测？")){
                GM_setValue("start",1);
                next();
            }
        }
        function next(){
            let time = GM_getValue("time");
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
                                twitchAuth.status = 1;
                            }else twitchAuth.status = 0;
                            GM_setValue("twitchAuth", twitchAuth)
                            window.close();
                        }
                        break;
                    case "discord.com":
                        if(location.search == "?keyjokertask=storageAuth")
                        {
                            discordAuth.authorization = JSON.parse(localStorage.getItem("token"));
                            if(discordAuth.authorization != null)discordAuth.status = 0;
                            else discordAuth.status = 1;
                            discordAuth.updateTime = new Date().getTime();
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
            // discord自动加入服务器（OK）
            discordJoinServerAuto: function(r, server){
                this.discordAuthUpdate((ret)=>{
                    if(ret != 200)
                    {
                        r(ret);
                        return;
                    }
                    this.httpRequest({
                        url: 'https://discord.com/api/v6/invites/' + server,
                        method: 'POST',
                        headers: { authorization: discordAuth.authorization, "content-type": "application/json"},
                        onload: (response) => {
                            if(debug)console.log(response)
                            if (response.status === 200) {
                                if(debug)console.log({ result: 'success', statusText: response.statusText, status: response.status })
                                r(200);
                            } else {
                                console.log('Error:' + response.statusText + '(' + response.status + ')')
                                console.log({ result: 'error', statusText: response.statusText, status: response.status })
                                r(201);
                            }
                        },
                        error:(res)=>{
                            console.error(res);
                            r(201);
                        },
                        anonymous:true
                    })
                })
            },
            // discord凭证更新（OK）
            discordAuthUpdate:function(r, update = false){
                if (new Date().getTime() - discordAuth.updateTime > 30 * 60 * 1000 || discordAuth.status == 0 || update) {
                    r(203)
                    new Promise((resolve)=>{
                        GM_openInTab("https://discord.com/channels/@me?keyjokertask=storageAuth", true);
                        let i = 0;
                        let check = setInterval(()=>{
                            i++;
                            if(GM_getValue("discordAuth") && new Date().getTime() - GM_getValue("discordAuth").updateTime <= 2 * 1000)
                            {
                                if(GM_getValue("discordAuth").status == 0)
                                {
                                    clearInterval(check);
                                    resolve(202)
                                    return;
                                }
                                noticeFrame.addNotice({type:"msg", msg:"<font class=\"success\">discordAuth updated!</font>"})
                                discordAuth.authorization = GM_getValue("discordAuth").authorization
                                discordAuth.updateTime = GM_getValue("discordAuth").updateTime
                                discordAuth.status = GM_getValue("discordAuth").status;
                                clearInterval(check);
                                resolve("success")
                            }
                            if(i >= 10)
                            {
                                noticeFrame.addNotice({type:"msg", msg:"<font class=\"error\">discordAuth获取超时</font>"})
                                clearInterval(check);
                                resolve("error")
                            }
                        }, 1000)
                    }).then((ret)=>{
                        if(ret == "success"){
                            r(200)
                        }else r(ret)
                    })
                }else{
                    r(200)
                }
            },
            // 做任务
            do_task: function(data){
                for(const task of data.actions)
                {
                    noticeFrame.addNotice({type: "taskStatus", task:task, status:'start'});
                    this.runDirectUrl(task.redirect_url)
                    let react = (code)=>{
                        switch(code)
                        {
                            case 200:
                                this.redeemAuto(task.redirect_url);
                                noticeFrame.updateNotice(task.id, 'success')
                                break;
                            case 201:
                                noticeFrame.updateNotice(task.id, 'error')
                                break;
                            case 202:
                                noticeFrame.updateNotice1({id:task.id, class:"error", text:"Not Login"})
                                break;
                            case 203:
                                noticeFrame.updateNotice1({id:task.id, class:"wait", text:"Getting Auth"})
                                break;
                            case 204:
                                noticeFrame.updateNotice1({id:task.id, class:"error", text:"Network Error"})
                                break;
                            default:
                                noticeFrame.updateNotice(task.id, 'Unknown Error')
                                break;
                        }
                    }
                    switch(task.task.name)
                    {
                        case "Join Steam Group":
                            this.steamJoinGroupAuto(react, task.data.url);
                            break;
                        case "Rep Steam Account":
                            this.steamRepAuto(react, task.data.id);
                            break;
                        case "Wishlist Steam Game":
                            this.steamAddWishlistAuto(react, task.data.id);
                            break;
                        case "Follow Twitter Account":
                            this.twitterFollowAuto(react, task.data);
                            break;
                        case "Join Discord Server":
                            var server = task.data.url.split(".gg/")[1];
                            this.discordJoinServerAuto(react, server)
                            break;
                        case "Retweet Twitter Tweet":
                            this.twitterRetweetAuto(react, task.data.url);
                            break;
                        case "Save Spotify Album":
                            this.spotifySaveAuto(react, task.data);
                            break;
                        case "Follow Spotify Account":
                            this.spotifyFollowAuto(react, task.data);
                            break;
                        case "Follow Twitch Channel":
                            this.twitchFollowAuto(react, task.data.id);
                            break;
                        case "Follow Tumblr Blog":
                            this.tumblrFollowAuto(react, task.data.name);
                            break;
                        default:
                            noticeFrame.updateNotice1({id:task.id, class:"error", text:"Unknow Type:" + task.task.name})
                            console.error("未指定操作" + task.task.name)
                            break;
                    }
                }
                let completeCheck = setInterval(()=>{
                    if($(".list-complete-item").length == 0)
                    {
                        noticeFrame.addNotice({type:"msg", msg:"任务似乎已完成，恢复监测!"});
                        next();
                        clearInterval(completeCheck);
                    }
                }, 10 * 1000)
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
                        clearInterval(hcaptcha2Click);
                        console.log("open hcaptcha");
                        let text = document.getElementsByClassName("prompt-text")[0].innerText;
                        document.getElementsByClassName("prompt-text")[0].innerText = text + "\n正在自动获取免验证Cookie";
                        //$(".task-grid").remove();
                        //$(".challenge-example").remove();
                        this.httpRequest({
                            url: 'https://accounts.hcaptcha.com/accessibility/get_cookie',
                            method: 'GET',
                            headers: { 'Content-Type': 'application/json'},
                            onload: (response) => {
                                GM_log(response)
                                if(response.status == 200)
                                {
                                    document.getElementsByClassName("prompt-text")[0].innerText = text + "\n免验证Cookie获取成功，请重新点击验证框";
                                }else if(response.status == 401)
                                {
                                    document.getElementsByClassName("prompt-text")[0].innerText = text + "\n当前账号或IP的免验证Cookie获取次数已达上限，请更换hcaptcha账号或IP";
                                    // setTimeout(()=>{window.open("https://dashboard.hcaptcha.com/welcome_accessibility")}, 3000);
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
                                if(debug)console.error("error")
                            }
                        })
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
            // OK
            spotifySaveAuto: function(r, data){
                this.spotifyGetUserInfo((status, accessToken = null, userId = null)=>{
                    if(status != 200)
                    {
                        r(status);
                        return;
                    }
                    let putUrl = ""
                    switch(data.type)
                    {
                        case "album":
                            putUrl = "https://spclient.wg.spotify.com/collection-view/v1/collection/albums/" + userId + "?base62ids=" + data.id + "&model=bookmark";
                            break;
                        default:
                            GM_log(data)
                            r(201)
                            return;
                            break;
                    }
                    $.ajax({
                        type: 'PUT',
                        url: putUrl,
                        headers: {authorization: "Bearer " + accessToken},
                        success: function(data){
                            console.log(data);
                            r(200);
                        },
                        error: function(data){
                            console.error(data);
                            r(201)
                        },
                        anonymous:true
                    });
                });
            },
            // OK
            spotifyFollowAuto: function(r, data){
                this.spotifyGetUserInfo((status, accessToken = null)=>{
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
                            if(debug)GM_log(data)
                            r(201)
                            return;
                            break;
                    }
                    $.ajax({
                        type: 'PUT',
                        url: putUrl,
                        headers: {authorization: "Bearer " + accessToken},
                        success: function(data){
                            if(debug)console.log(data);
                            r(200);
                        },
                        error: function(data){
                            console.error(data);
                            r(201)
                        },
                        anonymous:true
                    });
                });
            },
            // OK
            spotifyGetUserInfo: function(r){
                r(203)
                this.spotifyGetAccessToken(
                    (status, accessToken)=>{
                        if(status != 200)
                        {
                            r(status);
                            return;
                        }
                        this.httpRequest({
                            url: 'https://api.spotify.com/v1/me',
                            method: 'GET',
                            headers:{authorization: "Bearer " + accessToken},
                            onload: (response) => {
                                if (response.status === 200) {
                                    if(debug)console.log(response)
                                    r(200, accessToken, JSON.parse(response.responseText).id);
                                } else {
                                    console.log('Error:' + response.statusText + '(' + response.status + ')')
                                    r(202)
                                }
                            },
                            error:(res)=>{
                                console.log("error");
                                r(202)
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
                            r(200, JSON.parse(response.responseText).accessToken);
                        } else {
                            console.log(response)
                            r(202);
                        }
                    },
                    error:(res)=>{
                        if(debug)console.log(res);
                        r(202);
                    }
                })
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
                                            if(debug)console.log(Error('Not Login'))
                                        } else {
                                            const steam64Id = response.responseText.match(/g_steamID = "(.+?)";/)
                                            const communitySessionID = response.responseText.match(/g_sessionID = "(.+?)";/)
                                            const userName = response.responseText.match(/steamcommunity.com\/id\/(.+?)\/friends\//)
                                            if (steam64Id) steamInfo.steam64Id = steam64Id[1]
                                            if (communitySessionID) steamInfo.communitySessionID = communitySessionID[1]
                                            if (userName) steamInfo.userName = userName[1]
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
                                            console.log('Error:store not Login', true)
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
            // steam个人资料回复"+rep"（OK）
            steamRepAuto: function(r, id){
                this.steamRepHisCheck((ret) => {
                    if(!ret){
                        this.httpRequest({
                            url: 'https://steamcommunity.com/comment/Profile/post/' + id + '/-1/',
                            method: 'POST',
                            data: $.param({comment:'+rep',count:6,sessionid:steamInfo.communitySessionID,feature2:-1}),
                            headers:{'content-type': 'application/x-www-form-urlencoded'},
                            onload: (response) => {
                                console.log(response);
                                if(response.status == 200)
                                {
                                    let ret = JSON.parse(response.response)
                                    if(ret.success == true)GM_log(200);else GM_log(201);
                                }else r(201)
                            }
                        })
                    }else{
                        r(200);
                    }
                },id)
            },
            steamRepHisCheck: function (r, id){
                this.steamInfoUpdate(() => {
                    this.httpRequest({
                        url: "https://steamcommunity.com/profiles/" + id,
                        method: 'GET',
                        onload: (response) => {
                            if(response.status == 200)
                            {
                                let comments = response.responseText.match(/commentthread_comments([\s\S]*)commentthread_footer/);
                                console.log(comments)
                                if(comments != null)r(comments[1].includes(steamInfo.steam64Id));
                                else noticeFrame.addNotice({type:"msg", msg:"<font class=\"error\">steam评论区未找到</font>"})
                            }else{
                                console.log(response)
                                noticeFrame.addNotice({type:"msg", msg:"<font class=\"error\">出现异常</font>"})
                            }
                        }
                        //,anonymous:true
                    });
                })
            },
            // steam加组（OK）[修改自https://greasyfork.org/zh-CN/scripts/370650]
            steamJoinGroupAuto: function (r, url) {
                this.steamInfoUpdate(() => {
                    if(debug)console.log("====steamJoinGroupAuto====");
                    this.httpRequest({
                        url: url,
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                        data: $.param({ action: 'join', sessionID: steamInfo.communitySessionID }),
                        onload: (response) => {
                            if (debug) console.log(response)
                            if (response.status === 200 && !response.responseText.includes('grouppage_join_area') && !response.responseText.includes('error_ctn')) {
                                console.log("steamJoinGroupAuto")
                                console.log({ result: 'success', statusText: response.statusText, status: response.status })
                                r(200);
                            } else {
                                console.error('Error:' + response.statusText + '(' + response.status + ')')
                                console.log({ result: 'error', statusText: response.statusText, status: response.status })
                                r(201);
                            }
                        }
                    })
                });
            },
            // steam加愿望单（In Progress）[修改自https://greasyfork.org/zh-CN/scripts/370650]
            steamAddWishlistAuto: function (r, gameId) {
                this.steamInfoUpdate(() => {
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
                            r(200)
                        } else {
                            this.httpRequest({
                                url: 'https://store.steampowered.com/app/' + gameId,
                                method: 'GET',
                                onload: function (response) {
                                    if (debug) console.log(response)
                                    if (response.status === 200) {
                                        if (response.responseText.includes('class="queue_actions_ctn"') && response.responseText.includes('已在库中')) {
                                            GM_log({ result: 'success', statusText: response.statusText, status: response.status, own: true })
                                            r(200)
                                        } else if ((response.responseText.includes('class="queue_actions_ctn"') && response.responseText.includes('添加至您的愿望单')) || !response.responseText.includes('class="queue_actions_ctn"')) {
                                            console.error('Error:' + result.statusText + '(' + result.status + ')')
                                            GM_log({ result: 'error', statusText: response.statusText, status: response.status })
                                            r(201)
                                        } else {
                                            GM_log({ result: 'success', statusText: response.statusText, status: response.status })
                                            r(200)
                                        }
                                    } else {
                                        console.error('Error:' + result.statusText + '(' + result.status + ')')
                                        GM_log({ result: 'error', statusText: response.statusText, status: response.status })
                                        r(201)
                                    }
                                },
                                r
                            })
                        }
                    }).catch(err => {
                        console.error(err)
                        r(201)
                    })
                })
            },
            // tumblr关注博客（OK）
            tumblrFollowAuto: function(r, name){
                this.tumblrGetKey((status, key = false)=>{
                    if(status != 200)
                    {
                        r(status);
                        return;
                    }
                    if(false != key){
                        if(-1 != key.indexOf("!123") && -1 !=key.indexOf("|") )
                        {
                            r(202)
                            return;
                        }
                        this.httpRequest({
                            url: 'https://www.tumblr.com/svc/follow',
                            method: 'POST',
                            headers: {"x-tumblr-form-key": key, "Content-Type": "application/x-www-form-urlencoded"},
                            data: $.param({'data[tumblelog]': name}),
                            onload: (response) => {
                                if(debug)console.log(response);
                                if(response.status == 200)
                                {
                                    r(200);
                                }else r(201)
                            }
                        })
                    }else{
                        r(201)
                    }
                })
            },
            // tumblr获取请求头key（OK）
            tumblrGetKey:function(r){
                r(203)
                this.httpRequest({
                    url: 'https://www.tumblr.com/dashboard/iframe',
                    method: 'GET',
                    onload: (response) => {
                        if(debug)console.log(response);
                        if(response.status == 200)
                        {
                            let key = response.responseText.match(/id="tumblr_form_key" content="(.+?)">/)
                            GM_log(key)
                            if(key)r(200, key[1]);
                            else r(666)
                        }else r(201)
                    }
                })
            },
            // twitch关注（OK）
            twitchFollowAuto: function(r, channelId){
                this.twitchAuthUpdate((status)=>{
                    if(status != 200)
                    {
                        r(status);
                        return;
                    }
                    this.httpRequest({
                        url: 'https://gql.twitch.tv/gql',
                        method: 'POST',
                        headers: { Authorization: "OAuth " + twitchAuth["auth-token"]},
                        data: '[{"operationName":"FollowButton_FollowUser","variables":{"input":{"disableNotifications":false,"targetID":"' + channelId + '"}},"extensions":{"persistedQuery":{"version":1,"sha256Hash":"3efee1acda90efdff9fef6e6b4a29213be3ee490781c5b54469717b6131ffdfe"}}}]',
                        onload: (response) => {
                            if (debug)console.log(response)
                            if (response.status === 200) {
                                if(debug)console.log({ result: 'success', statusText: response.statusText, status: response.status })
                                r(200)
                            } else if(response.status === 401){
                                twitchAuth.updateTime = 0;
                                GM_setValue("twitchAuth", null);
                                r(202)
                            }else{
                                console.log('Error:' + response.statusText + '(' + response.status + ')')
                                r(201)
                            }
                        }
                    })
                })
            },
            // 弃用
            twitchGetId: function(r, channels){
                this.httpRequest({
                    url: 'https://api.twitch.tv/api/channels/' + channels + '/access_token?oauth_token=' + GM_getValue("twitchAuth").match(/auth-token=(.+?); /)[1] + '&need_https=true&platform=web&player_type=site&player_backend=mediaplayer',
                    method: 'GET',
                    onload: (response) => {
                        if (response.status === 200) {
                            if(debug)console.log({ result: 'success', statusText: response.statusText, status: response.status })
                            let rep = JSON.parse(JSON.parse(response.responseText).token);
                            r(rep.channel_id);
                        } else {
                            console.log('Error:' + response.statusText + '(' + response.status + ')')
                            r('error')
                        }
                    },
                    error:(res)=>{
                        console.log("error");
                        console.log(res);
                    },
                    anonymous:true
                })
            },
            // twitch凭证更新（OK）
            twitchAuthUpdate:function(r, update = false){
                if (new Date().getTime() - twitchAuth.updateTime > 30 * 60 * 1000 || update) {
                    r(203)
                    new Promise((resolve)=>{
                        GM_openInTab("https://www.twitch.tv/settings/profile?keyjokertask=storageAuth", true);
                        let i = 0;
                        let check = setInterval(()=>{
                            i++;
                            if(GM_getValue("twitchAuth") && new Date().getTime() - GM_getValue("twitchAuth").updateTime <= 2 * 1000)
                            {
                                if(GM_getValue("twitchAuth").status == 0)
                                {
                                    clearInterval(check);
                                    resolve(202)
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
                                noticeFrame.addNotice({type:"msg", msg:"<font class=\"error\">twitchAuth获取超时</font>"})
                                clearInterval(check);
                                resolve(201)
                            }
                        }, 1000)
                    }).then((ret)=>{
                        r(ret);
                    })
                }else{
                    r(200)
                }
            },
            // ==========Twitter Start========
            // 推特关注用户（OK）
            twitterFollowAuto: function(r, data){
                this.twitterAuthUpdate(()=>{
                    this.twitterGetUserInfo((userId)=>{
                        if(debug)console.log(userId)
                        if("error" == userId)
                        {
                            r(201);
                            return;
                        }
                        this.httpRequest({
                            url: 'https://api.twitter.com/1.1/friendships/create.json',
                            method: 'POST',
                            headers: { authorization: "Bearer " + twitterAuth.authorization, 'Content-Type': 'application/x-www-form-urlencoded', 'x-csrf-token':twitterAuth.ct0},
                            data: $.param({ include_profile_interstitial_type: 1,include_blocking: 1,include_blocked_by: 1,include_followed_by: 1,include_want_retweets: 1,include_mute_edge: 1,include_can_dm: 1,include_can_media_tag: 1,skip_status: 1,id: userId}),
                            onload: (response) => {
                                if (debug)console.log(response)
                                if (response.status === 200) {
                                    r(200);
                                } else {
                                    console.log('Error:' + response.statusText + '(' + response.status + ')')
                                    console.log({ result: 'error', statusText: response.statusText, status: response.status })
                                    r(201);
                                }
                            }
                        })
                    },data.username)
                })
            },
            // 推特转推（OK）
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
                            if (debug)console.log(response)
                            if (response.status === 200 || (response.status === 403 && response.responseText == '{"errors":[{"code":327,"message":"You have already retweeted this Tweet."}]}')) {
                                if(debug)console.log("success");
                                if(debug)console.log({ result: 'success', statusText: response.statusText, status: response.status });
                                r(200);
                            } else {
                                console.log('Error:' + response.statusText + '(' + response.status + ')')
                                r(201);
                            }
                        }
                    })
                })
            },
            // 推特根据用户名获取用户id（OK）
            twitterGetUserInfo: function(r, userName){
                if(debug)console.log("====twitterGetUserInfo====");
                this.httpRequest({
                    url: 'https://api.twitter.com/graphql/-xfUfZsnR_zqjFd-IfrN5A/UserByScreenName?variables=%7B%22screen_name%22%3A%22' + userName + '%22%2C%22withHighlightedLabel%22%3Atrue%7D',
                    method: 'GET',
                    headers: { authorization: "Bearer " + twitterAuth.authorization, "content-type": "application/json"},
                    onload: (response) => {
                        if (response.status === 200) {
                            if(debug)console.log(response)
                            r(JSON.parse(response.responseText).data.user.rest_id);
                        } else {
                            console.log('Error:' + response.statusText + '(' + response.status + ')')
                            r('error')
                        }
                    },
                    error:(res)=>{
                        console.log(res);
                        r('error')
                    },
                    anonymous:true
                })
            },
            // 推特取得用户页面响应头（OK）
            twitterAP:function(r){
                this.httpRequest({
                    url: 'https://twitter.com/settings/account?k',
                    method: 'GET',
                    onload: (response) => {
                        if (response.status === 200) {
                            if(debug)console.log(response)
                            if(debug)console.log({ result: 'success', statusText: response.statusText, status: response.status })
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
            // 推特凭证更新（OK）
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
                                    if(debug)console.log(response)
                                    if (response.status === 200) {
                                        if(debug)console.log({ result: 'success', statusText: response.statusText, status: response.status })
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
                        if(debug)console.log(ret);
                        if(ret.status == "success")
                        {
                            twitterAuth.updateTime = new Date().getTime()
                            GM_setValue("twitterAuth", twitterAuth)
                            r(1);
                        }else{
                            noticeFrame.addNotice({type:"msg", msg:"<font class=\"error\">twitter token获取失败</font>"})
                        }
                    })
                }else{
                    r(1)
                }
            },
            // ==========Twitter End========
            runDirectUrl:function(direct_url){
                GM_log("====访问跳转链接====")
                this.httpRequest({
                    url: direct_url,
                    method: 'GET',
                    headers: {'x-csrf-token': $('meta[name="csrf-token"]').attr('content')},
                    onload: (response) => {
                        console.log(response)
                    },
                    error:(res)=>{
                        console.log(res);
                    }
                })
            },
            test: function(){
                //$('.card').remove();
                //start()
                this.runDirectUrl("https://www.keyjoker.com/entries/open/1")
            }
        }

        if((document.getElementById("logout-form") && location.search !== "") || ($('.container').innerText == "Whoops, looks like something went wrong."))
        {
            GM_log("跳转")
            location.href = location.pathname;
        }else if(location.href == "https://www.keyjoker.com/entries")
        {
            window.onload=()=>{
                if(document.getElementsByClassName("nav-item active").length != 0 && document.getElementsByClassName("nav-item active")[0].innerText == "Earn Credits")
                {
                    noticeFrame.loadFrame();
                    //let isStart=setInterval(()=>{
                        if(GM_getValue("start")==1){
                            //clearInterval(isStart);
                            next();
                        }
                    //},1000);
                }
            }
        }else{
            func.appHandle();
        }
        GM_registerMenuCommand("设置时间间隔", setTime);
        GM_registerMenuCommand("重置设置", func.reset);
        function checkSwitch(id){
            GM_unregisterMenuCommand(id);
            if(1 == GM_getValue("start")){
                let id = GM_registerMenuCommand("停止检测",()=>{
                    let date=new Date();
                    let hour=date.getHours();
                    let min=date.getMinutes()<10?("0"+date.getMinutes()):date.getMinutes();
                    GM_setValue("start",0);
                    $(".border-bottom").text(hour+":"+min+" 停止执行新任务检测");
                    checkSwitch(id);
                });
            }else{
                let id = GM_registerMenuCommand("开始检测",()=>{
                    start();
                    checkSwitch(id);
                });
            }
        }
        checkSwitch(null);
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