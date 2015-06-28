$(function(){
  socialFunc = [];
  socialFunc.hatebu = function(socialData, url){
    if('https:' == document.location.protocol){
      socialData.url = "//query.yahooapis.com/v1/public/yql";
      socialData.data.q = "SELECT content FROM data.headers WHERE url='http://api.b.st-hatena.com/entry.count?url=" + url + "'";
      socialData.data.format = "json";
      socialData.data.env = "http://datatables.org/alltables.env";
      socialData.success = function (data) {
        $('.hatebuCount[data-share-url="'+url+'"]').text(data.query.results.resources.content||0);
        $('.hatebuCount[data-share-url="'+url+'"]').data("count",data.query.results.resources.content||0);
      };
    }else{
      socialData.url = 'http://api.b.st-hatena.com/entry.count';
      socialData.data.url = url;
      socialData.success = function(data){
        $('.hatebuCount[data-share-url="'+url+'"]').text(data||0);
        $('.hatebuCount[data-share-url="'+url+'"]').data("count",data||0);
      };
    }
  };
  socialFunc.twitter = function(socialData, url){
    socialData.url = '//urls.api.twitter.com/1/urls/count.json';
    socialData.data.url = url;
    socialData.success = function(data){
      $('.twitterCount[data-share-url="'+url+'"]').text(data.count||0);
      $('.twitterCount[data-share-url="'+url+'"]').data("count",data.count||0);
    };
  };
  socialFunc.googleplus = function(socialData, url){
    socialData.url = "//query.yahooapis.com/v1/public/yql";
    socialData.data.q = "SELECT content FROM data.headers WHERE url='https://plusone.google.com/_/+1/fastbutton?url=" + url + "'";
    socialData.data.format = "json";
    socialData.data.env = "http://datatables.org/alltables.env";
    socialData.success = function (data) {
      var m = data.query.results.resources.content.match(/window\.__SSR = {c: ([\d]+)/);
      $('.googleplusCount[data-share-url="'+url+'"]').text((m != null)? m[1] : 0);
      $('.googleplusCount[data-share-url="'+url+'"]').data("count",(m != null)? m[1] : 0);
    };
  };
  socialFunc.facebook = function(socialData, url){
    socialData.url = '//graph.facebook.com/';
    socialData.data.id = url;
    socialData.success = function(data){
      if('likes' in data){
        var n = data.likes;
        var fdata = {
          type: 'GET',
          dataType: 'jsonp',
          url: '//graph.facebook.com/fql',
          data: {
            noncache: new Date().getTime(),
            q: "SELECT total_count FROM link_stat WHERE url='" + url + "'"
          },
          success: function(data) {
            n += data.data[0].total_count;
            $('.facebookCount[data-share-url="'+url+'"]').text(n);
            $('.facebookCount[data-share-url="'+url+'"]').data("count",n);
          },
          error: function(data){
            console.log('Error to get facebook count by fql');
          }
        };
        $.ajax(fdata);
      }else{
        $('.facebookCount[data-share-url="'+url+'"]').text(data.shares||0);
        $('.facebookCount[data-share-url="'+url+'"]').data("count",data.shares||0);
      }
    };
  };
  socialFunc.pocket = function(socialData, url){
    socialData.url = "//query.yahooapis.com/v1/public/yql";
    socialData.data.q = "SELECT content FROM data.headers WHERE url='https://widgets.getpocket.com/v1/button?label=pocket&count=vertical&v=1&url=" + url + "'";
    socialData.data.format = "json";
    socialData.data.env = "http://datatables.org/alltables.env";
    socialData.success = function (data) {
      //$('.pocketCount[data-share-url="'+url+'"]').text(data.toSource());
      //$('.pocketCount[data-share-url="'+url+'"]').data("count",data.toSource());
      $('.pocketCount[data-share-url="'+url+'"]').text(data.query.results.resources.content.match(/<em id="cnt">(\d+)<\/em>/)[1]||0);
      $('.pocketCount[data-share-url="'+url+'"]').data("count",data.query.results.resources.content.match(/<em id="cnt">(\d+)<\/em>/)[1]||0);
    };
  };
  socialFunc.linkedin = function(socialData, url){
    socialData.url = '//www.linkedin.com/countserv/count/share';
    socialData.data.url = url;
    socialData.success = function(data){
      $('.linkedinCount[data-share-url="'+url+'"]').text(data.count||0);
      $('.linkedinCount[data-share-url="'+url+'"]').data("count",data.count||0);
    };
  };
  socialFunc.stumble = function(socialData, url){
    socialData.url = "//query.yahooapis.com/v1/public/yql";
    socialData.data.q = "SELECT content FROM data.headers WHERE url='http://www.stumbleupon.com/services/1.01/badge.getinfo?url=" + url + "'";
    socialData.data.format = "json";
    socialData.data.env = "http://datatables.org/alltables.env";
    socialData.success = function (data) {
      var j = JSON.parse(data.query.results.resources.content);
      $('.stumbleCount[data-share-url="'+url+'"]').text(j.result.views||0);
      $('.stumbleCount[data-share-url="'+url+'"]').data("count",j.result.views||0);
    };
  };
  socialFunc.pinterest = function(socialData, url){
    socialData.url = '//api.pinterest.com/v1/urls/count.json';
    socialData.data.url = url;
    socialData.success = function(data){
      $('.pinterestCount[data-share-url="'+url+'"]').text(data.count||0);
      $('.pinterestCount[data-share-url="'+url+'"]').data("count",data.count||0);
    };
  };
  socialFunc.buffer = function(socialData, url){
    socialData.url = "//query.yahooapis.com/v1/public/yql";
    socialData.data.q = "SELECT content FROM data.headers WHERE url='https://api.bufferapp.com/1/links/shares.json?url=" + url + "'";
    socialData.data.format = "json";
    socialData.data.env = "http://datatables.org/alltables.env";
    socialData.success = function (data) {
      var j = data.query.results.resources.content;
      $('.bufferCount[data-share-url="'+url+'"]').text(j.shares||0);
      $('.bufferCount[data-share-url="'+url+'"]').data("count",j.shares||0);
    };
  };
  socialFunc.delicious = function(socialData, url){
    socialData.url = '//feeds.delicious.com/v2/json/urlinfo/data';
    socialData.data.url = url;
    socialData.success = function(data){
      $('.deliciousCount[data-share-url="'+url+'"]').text((data.length>0)? data[0].total_posts : 0);
      $('.deliciousCount[data-share-url="'+url+'"]').data("count",(data.length>0)? data[0].total_posts : 0);
    };
  };
});

var socialCount = function (socials) {
  socials.forEach(function(s){
    var urls = [];
    var n = 0;
    $("."+s+"Count").each(function(){
      var url = $(this).attr("data-share-url");
      if ($.inArray(url, urls) == -1){
        urls.push(url);
        socialData = {
          type: 'GET',
          dataType: 'jsonp',
          data: {noncache: new Date().getTime()},
          error: function(data){
            console.log('Error to get ' + s);
          }
        };
        socialFunc[s](socialData, url);
        $.ajax(socialData);
      }
      var pos = n;
      if(n==0){
        pos = "above";
      }else if(n==1){
        pos = "bottom";
      }
      $(this).parent().on('click', function() {
        ga('send', 'event', s, pos, url);
      });
      n++;
    });
  });
};

$(function(){
  if(! "jekyll_var" in window)return;
  var socials=[];
  var smarks = ["hatebu", "twitter", "googleplus",
               "facebook", "pocket", "linkedin",
               "stumble", "pinterest", "buffer", "delicious"]
  for(var i=0;i<smarks.length;i++){
    if(jekyll_var("share_check_all")||jekyll_var(smarks[i]+'_button'))socials.push(smarks[i]);
  }
  socialCount(socials);
});
