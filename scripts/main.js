        var _class_profile_name = "profile_name";
        var _class_profile_picture = "profile_picture";
        var _class_profile_username = "profile_username";
        var _class_profile_info = "profile_info";
        var _class_social_icon = "social_icon";

        function findTag(jobj_caption, caption) {
            caption = caption.trim().replace(/(\r\n|\n|\r)/gm, "");;
            var arrCaption = caption.split("#");
            if (arrCaption.length > 1) {
                arrCaption = arrCaption.filter(function (d) { return d != "" })
                arrCaption = _.map(arrCaption, function (value) {
                    return value.split(" ")[0];
                });
            }
        }
        function render_post_info(profile_picture, profile_name, profile_username, post_url, createdAt, social_type, profile_url = "") {
            var jobj_profile_picture = '';
            var profile_name = $("<div/>").text(profile_name).addClass(_class_profile_name);
            var jobj_profile_username = $("<div/>").text("@" + profile_username).addClass(_class_profile_username);
            var createDatetime = '';//$("<div/>").text("Created At " + new Date(createdAt * 1000));
            var dateago = $("<div/>").text(timeDifference.call(this, createdAt));
            var social_icon = $("<a/>").attr({ "href": post_url, "target": "_blank" });

            switch (social_type) {
                case "Instagram":
                    social_icon.append($("<img/>").attr("src", "./images/instagram.png").addClass(_class_social_icon));
                    jobj_profile_picture = $("<a/>")
                        .attr({ "href": "https://www.instagram.com/" + profile_username, "target": "_blank" })
                        .append($("<img/>").attr("src", profile_picture).addClass(_class_profile_picture));
                    break;
                case "Youtube":
                    social_icon.append($("<img/>").attr("src", "./images/youtube.png").addClass(_class_social_icon));
                    jobj_profile_picture = $("<a/>")
                        .attr({ "href": "https://www.youtube.com/channel/" + profile_username, "target": "_blank" })
                        .append($("<img/>").attr("src", profile_picture).addClass(_class_profile_picture));
                    break;
                case "tumblr":
                    social_icon.append($("<img/>").attr("src", "./images/tumblr-logo.png").addClass(_class_social_icon));
                    jobj_profile_picture = $("<a/>")
                        .attr({ "href": "https://" + profile_username + ".tumblr.com/", "target": "_blank" })
                        .append($("<img/>").attr("src", profile_picture).addClass(_class_profile_picture));
                    break;
                case "flickr":
                    social_icon.append($("<img/>").attr("src", "./images/flickr.png").addClass(_class_social_icon));
                    jobj_profile_picture = $("<a/>")
                        .attr({ "href": "https://www.flickr.com/photos/" + profile_username + "/", "target": "_blank" })
                        .append($("<img/>").attr("src", profile_picture).addClass(_class_profile_picture));
                    break;
                case "facebook":
                    social_icon.append($("<img/>").attr({"src":"./images/facebook.png"}).addClass(_class_social_icon));
                    jobj_profile_picture = $("<a/>")
                        .attr({ "href": profile_url, "target": "_blank" })
                        .append($("<img/>").attr("src", profile_picture).addClass(_class_profile_picture));
                    break;                    
                default: break;
            }

            var profile_info = $("<div/>").append(jobj_profile_username, profile_name, createDatetime, dateago).addClass(_class_profile_info);
            var post_info = $("<div/>").addClass("post_info")
                .append(jobj_profile_picture, profile_info, social_icon);
            return post_info;
        }

        function getIGposts(user_id, access_token) {
            var access_token = access_token || '12480168229.1677ed0.04b2ebbd6f3d4ad19c587046e1cebd79';
            var user_id = user_id || '12480168229';
            $.ajax({
                url: 'https://api.instagram.com/v1/users/' + user_id + '/media/recent/',
                data: { 'access_token': access_token },
                success: function (response) {
                    $.each(response.data, function (seq, value) {
                        var divPostImg = renderPostIMGContainer.call(this, value.images.standard_resolution.url, value.link);
                        var post_info = render_post_info.call(this, value.user.profile_picture, value.user.full_name, value.user.username, value.link, value.created_time * 1000, "Instagram")
                        var caption = $("<div/>").addClass("post-content");
                        if (value.caption) {
                            caption = caption.text(value.caption.text);
                        }
                        var div = $("<div/>").append(divPostImg, post_info, caption).addClass("post-container instagram");
                        $("#content-farm").append(div);
                    })
                },
                dataType: 'json'
            });
        }
        function getflickrPhoto(api_key, user_id) {
            var api_key = api_key || '07f5406aa61661dd1a9fa441aeb74739';
            var user_id = user_id || '170802717@N06';
            $.ajax({
                url: "https://api.flickr.com/services/rest/?method=flickr.people.getPublicPhotos&api_key=" + api_key + "&user_id=" + user_id + "&format=json&nojsoncallback=1",
                dataType: 'json',
                success: function (response) {
                    var userInfo = getflickrUserInfo.call(this, api_key, user_id);
                    if (response && response.stat == 'ok');
                    {
                        $.each(response.photos.photo, function (seq, value) {
                            var photo_id = value.id;
                            var photo_url = "https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=" + api_key + "&photo_id=" + photo_id + "&format=json&nojsoncallback=1";
                            $.ajax({
                                url: photo_url,
                                dataType: 'json',
                                success: function (data) {
                                    if (data && data.stat == 'ok') {
                                        //data.photo.originalsecret  "https://live.staticflickr.com/" + data.photo.server + "/" + photo_id + "_" + data.photo.originalsecret + "_h.jpg";
                                        var img_url = "https://live.staticflickr.com/" + data.photo.server + "/" + photo_id + "_" + data.photo.secret + "_c.jpg";
                                        var divPostImg = renderPostIMGContainer.call(this, img_url, data.photo.urls.url[0]._content);
                                        var post_info = render_post_info.call(this, "https://s.yimg.com/pw/images/buddyicon05_r.png#170802717@N06",
                                            data.photo.owner.realname, data.photo.owner.nsid, data.photo.urls.url[0]._content, data.photo.dateuploaded * 1000, "flickr")
                                        var caption = $("<div/>").text(data.photo.description._content).addClass("post-content");
                                        if (data.photo.description) {
                                            caption = caption.text(data.photo.description._content);
                                        }
                                        var div = $("<div/>").append(divPostImg, post_info, caption).addClass("post-container flickr");
                                        $("#content-farm").append(div);
                                    }
                                }
                            });
                        })
                    }
                }
            });
        }
        function getflickrUserInfo(api_key, user_id) {
            return $.ajax({
                url: "https://api.flickr.com/services/rest/?method=flickr.people.getInfo&api_key=" + api_key + "&user_id=" + user_id + "&format=json&nojsoncallback=1",
                method: "GET",
                dataType: 'jsonp'
            })
        }
        function getYoutubeList(channel_id, key) {
            var channel_id = channel_id || 'UCXer80GTQcPPs4E1HcjFS2g';
            var key = key || 'AIzaSyBO_huHjsv757yzeRa0gdWxHLLejU5Kro0';
            $.when(getYoutubeChannel.call(this, channel_id, key)).done(function (response) {
                $.each(response.items, function (seq, playlist) {
                    $.when(getYoutubePlayListVideos.call(this, playlist.contentDetails.relatedPlaylists.uploads, key)).done(function (videoList) {
                        $.each(videoList.items, function (seq, data) {
                            var url = "https://www.youtube.com/embed/" + data.contentDetails.videoId;
                            var video = $("<embed/>").width(300).height(300).attr({ "src": url });
                            $("#content-farm").append(video);
                            var post_info = render_post_info.call(this, playlist.snippet.thumbnails.medium.url, data.snippet.channelTitle,
                                data.snippet.channelId, url, new Date(data.contentDetails.videoPublishedAt).getTime(), "Youtube");
                            var caption = $("<div/>").addClass("post-content");
                            if (data.snippet.description != '') {
                                caption = caption.text(data.snippet.description);
                            }
                            var div = $("<div/>").append(video, post_info, caption).addClass("post-container youtube");
                            $("#content-farm").append(div);
                        })
                    })
                })
            })
        }
        function getYoutubeChannel(channel_id, key) {
            return $.ajax({
                url: "https://www.googleapis.com/youtube/v3/channels",
                data: {
                    part: "snippet, contentDetails"
                    , id: channel_id
                    , key: key
                },
                dataType: 'json'
            })
        }
        function getYoutubePlayListVideos(playlistId, key) {
            return $.ajax({
                url: "https://www.googleapis.com/youtube/v3/playlistItems",
                data: {
                    part: "snippet, contentDetails"
                    , playlistId: playlistId
                    , key: key
                },
                dataType: 'json'
            })
        }
        function gettumblr(api_key) {//gettumblr.call(this, 'dXwvMlyqgyy000m7vWRXDOQBXDBlhE52aJVgApiUGH4A1bHJkI')
            var api_key = api_key || 'dXwvMlyqgyy000m7vWRXDOQBXDBlhE52aJVgApiUGH4A1bHJkI';
            $.ajax({
                url: "https://api.tumblr.com/v2/blog/black-dd0101.tumblr.com/posts/",
                data: {
                    api_key: api_key
                },
                dataType: 'json',
                success: function (response) {
                    if (response.meta.status == 200) {
                        $.each(response.response.posts, function (seq, post) {
                            var img_post = '', a_img_post = '', divPostImg = $("<div>").addClass("postImg-container");
                            if (post.type == "photo") {
                                divPostImg = renderPostIMGContainer.call(this, post.photos[0].alt_sizes[0].url, post.post_url);
                            }
                            var post_info = render_post_info.call(this, "https://assets.tumblr.com/images/default_avatar/octahedron_open_128.png",
                                post.blog_name, post.blog_name, post.post_url, new Date(post.date).getTime(), "tumblr")
                            var caption = $("<div/>").addClass("post-content");
                            if (post.summary) {
                                caption = caption.text(post.summary);
                            }
                            var div = $("<div/>").append(divPostImg, post_info, caption).addClass("post-container tumblr");
                            $("#content-farm").append(div);
                        })
                    }
                }
            })
        }

        function renderFB(user_id, access_token){
            var user_id = user_id || '121839578966030';
            var access_token = access_token || '333396590622882|zEw0UcZtz6nbkDKNV02VqGfQzS0';
            $.when(getFBProfile.call(this, user_id, access_token), getFBPost.call(this, user_id, access_token)).done(function(profile, posts){
                var profile = profile[0];
                $.each(posts[0].data, function(seq, post){
                    var post_info = render_post_info.call(this, profile.picture.data.url,
                    profile.name, profile.name, post.permalink_url, new Date(post.created_time).getTime(), "facebook", profile.link)

                    var img_post = '', a_img_post = '', divPostImg = $("<div>").addClass("postImg-container");
                    var caption = $("<div/>").addClass("post-content");

                    switch(post.type){
                        case "photo":
                        divPostImg = renderPostIMGContainer.call(this, post.full_picture, post.link); 
                        break;
                        case "link":
                        var revised_message = urlify(post.message);
                        var url_container = renderURLContainer(post.link, post.caption, post.name, post.description);
                        caption.append(revised_message, url_container);
                        break;
                        case "video":
                        var revised_message = urlify(post.message);
                        var url_container = renderURLContainer(post.link, post.caption, post.name, post.description);
                        caption.append(revised_message, url_container);
                        break;                        
                        default:
                        caption = caption.html(urlify(post.message));
                        break;                        
                    }

                    var div = $("<div/>").append(divPostImg, post_info, caption).addClass("post-container facebook");
                            $("#content-farm").append(div);                    
                })
            })
        }

        function renderURLContainer(link, caption, title, desc){
            
            var url_container = $("<div/>").addClass("url_container");
            var url_container_caption = $("<div/>").addClass("url_container_caption").text(caption.toUpperCase());
            var url_container_title = $("<div/>").addClass("url_container_title").text(title);
            var url_container_desc = $("<div/>").addClass("url_container_desc").text(desc);
            url_container.append(url_container_caption, url_container_title, url_container_desc);
            var a_obj = $("<a/>").append(url_container).attr({ "href": link, "target": "_blank" });
            return a_obj.addClass("url_block");
        }

            function urlify(text) {
                var urlRegex = /(https?:\/\/[^\s]+)/g;
                return text.replace(urlRegex, function (url) {
                    return '<a href="' + url + '">' + url + '</a>';
                })
                // or alternatively
                // return text.replace(urlRegex, '<a href="$1">$1</a>')
            }

        function getFBPost(user_id, access_token){//renderFB('121839578966030', '333396590622882|zEw0UcZtz6nbkDKNV02VqGfQzS0')
            return $.ajax({
                url: "https://graph.facebook.com/v3.2/" + user_id + "/feed",
                data: {
                    fields: "caption,link,picture,full_picture,created_time,description,message,type,name,permalink_url"
                    , access_token: access_token
                },
                dataType: 'json'
            })            
        }

        function getFBProfile(user_id, access_token){//renderFB('121839578966030', '333396590622882|zEw0UcZtz6nbkDKNV02VqGfQzS0')
            return $.ajax({
                url: "https://graph.facebook.com/v3.2/" + user_id,
                data: {
                    fields: "id,first_name,last_name,middle_name,name,name_format,picture,short_name,link"
                    , access_token: access_token
                },
                dataType: 'json'
            })            
        }

            function validURL(str) {
                var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
                    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
                    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
                    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
                    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
                    '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
                return !!pattern.test(str);
            }

        function renderPostIMGContainer(photo_url, post_url) {
            var img_post = $("<img/>").attr("src", photo_url).addClass("img_post")
                .on('mouseenter', function () {
                    $(this).animate({ margin: 0, width: "+=30", height: "+=30" });
                })
                .on('mouseleave', function () {
                    $(this).animate({ margin: 0, width: "-=30", height: "-=30" });
                })
                .click(function(){                  
                    $("#myModal").css({"display": "block"});
                    $("#img01").attr({"src": this.src});                 
                    $(".close").click(function(){
                        $("#myModal").css({"display": "none"});
                    });
                })
                .append(img_post)
                ;
            var div = $("<div/>").append(img_post).addClass("postImg-container");
            return div;
        }

        function timeDifference(date) {
            var dateDiff = new Date() - date;
            var weeksDiff = Math.floor(dateDiff / 1000 / 60 / 60 / 24 / 7) || 0;
            var daysDiff = Math.floor(dateDiff / 1000 / 60 / 60 / 24) || 0;
            var hoursDiff = Math.floor(dateDiff / 1000 / 60 / 60) || 0;
            var minsDiff = Math.floor(dateDiff / 1000 / 60) || 0;
            if (weeksDiff != 0) {
                return "Posted " + weeksDiff + " weeks ago";
            }
            else if (daysDiff != 0) {
                return "Posted " + daysDiff + " days ago";
            }
            else if (hoursDiff != 0) {
                return "Posted " + hoursDiff + " hrs ago";
            }
            else {
                return "Posted " + minsDiff + " mins ago";
            }
        }
        $(document).ready(function () {            
            var queryString = window.location.search.slice(1);
            if (queryString) {
                qString = queryString.split('q=')[1].split('&')[0];
                console.log(qString);
            }
            getflickrPhoto.call(this, '07f5406aa61661dd1a9fa441aeb74739', '170802717%40N06');
            getIGposts.call(this, "12480168229", "12480168229.1677ed0.04b2ebbd6f3d4ad19c587046e1cebd79");
            getYoutubeList.call(this, 'UCXer80GTQcPPs4E1HcjFS2g', 'AIzaSyBO_huHjsv757yzeRa0gdWxHLLejU5Kro0');
            gettumblr.call(this, 'dXwvMlyqgyy000m7vWRXDOQBXDBlhE52aJVgApiUGH4A1bHJkI');
            renderFB.call(this,'121839578966030', '333396590622882|zEw0UcZtz6nbkDKNV02VqGfQzS0');  

            $("#Main_Search input").on("keyup", function () {
                var value = $(this).val().toLowerCase();
                if(value.trim() != ''){
                    $.each($(".post-container .post-content"), function(seq, jobj){
                        if($(jobj).text().toLowerCase().trim().indexOf(value) == -1){
                            $(jobj).parent().hide();
                        }
                        else
                            $(jobj).parent().show();
                    })
                }
                else{
                    $.each($(".post-container .post-content"), function(seq, jobj){
                            $(jobj).parent().show();
                    })                    
                }
            });
            $(".menu_icon").click(function(el){
                var category = $(this).attr('id');
                $("#Main_Search input").val("");
                if(_.isUndefined(category)){
                    $(".post-container").show();
                }
                else{
                    $(".post-container").hide();
                    $(".post-container." + category).show();
                }
            })
        });	
        $(document).keyup(function(e) {
            if (e.key === "Escape") { // escape key maps to keycode `27`
                $(".close").trigger( "click" );
            }
        });
