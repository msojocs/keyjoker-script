
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