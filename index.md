<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
<title>COMP3121 RONNX.W PAGE</title>
<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=UA-137394104-1"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'UA-137394104-1');
</script>

<script>
	var queryString = window.location.search.slice(1);
	if(queryString){
	qString = queryString.split('q=')[1].split('&')[0];
	console.log(qString);
	}
</script>
	
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
<!-- <script src="./Scripts/lib/underscore-min_1.9.1.js"></script> -->
<!-- <script async defer src="https://connect.facebook.net/en_US/sdk.js"></script> -->

<script>
    function loopFBposts(page_id, access_token){
        FB.api(
            "/" + page_id + "/feed"
            ,'get',
		  {
        fields:"permalink_url",
			  access_token : access_token
		  },
            function (response) {
              console.log(response);
                $.each(response.data,function(seq, value){
                  var div = $("<div/>").attr({"data-href": value.permalink_url, "data-width": 180, "data-height":150})
                  .addClass("fb-post");
                  console.log(div);
                  $("#fb-postfarm").append(div);
                })		
                if (response && !response.error) {
                    /* handle the result */
                }
                
            }
        );
    }    
</script>
<style>

</style>
</head>
<body>
<div id="fb-postfarm"></div>
<!-- <div class="TEST"><div>
  <img src="https://upload.wikimedia.org/wikipedia/zh/thumb/1/11/Hong_Kong_Polytechnic_University.svg/160px-Hong_Kong_Polytechnic_University.svg.png"/>
<div>TEST</div></div></div> -->
<div class="fb-page" data-href="https://www.facebook.com/facebook" data-tabs="timeline" data-small-header="false" data-adapt-container-width="true" data-hide-cover="false" data-show-facepile="true"><blockquote cite="https://www.facebook.com/facebook" class="fb-xfbml-parse-ignore"><a href="https://www.facebook.com/facebook">Facebook</a></blockquote></div>
</body>
<div id="fb-root"></div>
<script async defer crossorigin="anonymous" src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v3.2&appId=333396590622882&autoLogAppEvents=1"></script>
<script>
function FBInit(){
    window.fbAsyncInit = function() {
      FB.init({
        appId      : '333396590622882',
        xfbml      : true,
        version    : 'v3.2'
      });
      FB.AppEvents.logPageView();
      loopFBposts.call(this,"121839578966030", "333396590622882|zEw0UcZtz6nbkDKNV02VqGfQzS0");
    };

    (function(d, s, id){
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {return;}
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
}
FBInit();
</script>

</html>