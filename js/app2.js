$.config = {
  router:true,
  autoInit: false,
  showPageLoadingIndicator:true
}

$(document).ready(function() {
var Post_img_url;
var Post_img_cont;  //发布的内容
var Post_img_len;  //发布的内容图片的长度
var Post_id_assginment;  //帖子ID
var Post_topicDate_assginment;  //发布的日期
var Post_topicContent_assginment; //发布的文字内容
var Post_authorName_assginment;  //发布者
var Post_authorImg_assginment;  //发布者头像
var Post_authorId_assginment;  //发布者id
var Post_imgs;
var Post_id;

//表白墙
$(document).on('pageInit',function(e, pageId, $page) {


 // light7库在每次监听页面的时候不用每次监听进入页面次数,请求一次后,后面自动阻止请求
if (!(pageId == 'white-page')) return;
// 这里fetch请求是表白墙页面渲染
  var opts = {
    method: "GET",
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    credentials: 'include',
    mode: "cors"
  };
  var url = 'http://www.lkweb.top:8080/topics';
  fetch(url,opts)
  .then(response => {  //第一个then执行成功第一步
    return response.json()}).then(json => {  //第二个then执行成功第二步
    var datas = json.data; 
    console.log(datas) 
    $.each(datas,function(index,vals) {
      console.log(vals)
       Post_id = vals.id;  //重要 Post发布 帖子ID
      console.log(Post_id)
      var Post_topicContent = vals.topicContent;  //发布的内容
      var Post_topicDate = vals.topicDate;  //发布的日期
      Post_imgs = vals.images;  //发布图片的数组
      var Post_img = vals.images[0].url;  //发布的图片
      var Post_likeUserArr = vals.likeUser; //点赞数

      Post_img_len = vals.images.length;  //发布图片的长度
      Post_img_url = Post_img;  //赋值发布的图片
      Post_img_cont = Post_topicContent;  //赋值发布内容图片
      Post_id_assginment = Post_id;  //赋值帖子id
      Post_topicDate_assginment = Post_topicDate;  //赋值发布帖子的日期
      Post_topicContent_assginment = Post_topicContent;  //赋值发布文字内容
      

      var Post_like = $(Post_likeUserArr).map(function(i,val) {
        return val.id;;
      });

      var Post_authorName = vals.author.userName;  //发布者昵称
      var Post_authorImg = vals.author.userProfileimg;  //发布者的头像
      var Post_authorId = vals.author.id;  //发布者的ID

       Post_authorName_assginment = Post_authorName;  // 赋值发布者昵称
       Post_authorImg_assginment = Post_authorImg;    // 赋值发布者的头像
       Post_authorId_assginment = Post_authorId;      // 赋值发布者的ID

      var Post_txt = `<li>
      <div class="card facebook-card card-nopadd" id="${Post_id}">
        <div class="card-header no-border">
          <div class="facebook-avatar">
            <img src="${Post_authorImg}" width="34" height="34">
          </div>
          <div class="facebook-name">${Post_authorName}</div>
          <div class="facebook-date">
            <span class="pull-left">${Post_topicDate}</span>
          </div>
        </div>
        <div class="card-content-inner">
          <p>${Post_topicContent}</p>
        </div>
        <div class="card-content-inner">
        <ul class="row no-gutter release_img">
          `+LiNum(Post_imgs)[0]+`
        </ul>
        </div>
        <div class="card-footer no-border">
          <a href="" class="comment_fabulous">
            <span class="icon icon-message iwt"></span>${Post_like[0]}
          </a>
          <a href="comment-childpage.html" class="comment_details">
            <span class="icon icon-message iwt"></span>${Post_like[0]}
          </a>
          <a href="#" class="link">
            <span class="icon icon-message iwt"></span>${Post_like[0]}
          </a>
        </div>
      </div>
    </li>`;
    $("#white-page").find(".cont-nopadd .white_ul").prepend(Post_txt);
    });
  }).catch(err =>{  //中途出现错误在这显示
    console.log(err)
  })
 


  //  创建图片li的个数
function LiNum(Post_img_arr) {
  //console.log(Post_img_arr)
    var liImg;
    if (Post_img_arr.length == 1) {
    return  liImg = $(Post_img_arr).map(function(index,val) {
      //console.log(val.url);
        return `<li class="col-100 right_nopadding">
        <div class="card-content">
          <img src="${val.url}" class="pb-standalone-captions" width="100%">
        </div>
      </li>`
      });

    } else if(Post_img_arr.length == 2) {
    return  liImg = $(Post_img_arr).map(function(index,val) {
        return `<li class="col-33 right_nopadding">
        <div class="card-content">
          <img src="${val[index]}" class="pb-standalone-captions" width="100%">
        </div>
      </li>`
      });
    } else if(Post_img_arr.length <= 4) {
    return  liImg = $(Post_img_arr).map(function(index,val) {
        return `<li class="col-50 right_nopadding">
        <div class="card-content">
          <img src="${val[index]}" class="pb-standalone-captions" width="100%">
        </div>
      </li>`
      });
    }
    
  }   //  创建图片li的个数结束
  

});




  //  监听是否点击评论详情按钮

  $("#white-page").on("touchend",".card-footer .comment_details",function(event,Post_imgs) { 
    //给.card-footer .comment_details的父元素white-page事件委托
    var ths = $(this);
    
    var current_reales_id = $(ths).parent().parent().attr("id"); //当前发帖的id
    var releaseId = current_reales_id;
    // 这里fetch请求是单个帖子页面渲染
    var opts = {
      method: "GET",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      credentials: 'include',
      mode: "cors"
    };
    var url = `http://www.lkweb.top:8080/topic/${current_reales_id}`;
    fetch(url,opts)
    .then(response => {  //第一个then执行成功第一步
      return response.json()}).then(json => {  //第二个then执行成功第二步
      var datas = json.data; 
      $.each(datas,function(index,vals) {
        console.log(vals)
        var curr_thisreles_img = vals.images;  //根据接口获取点击帖子用户的发布图片
        var curr_thisauthor_img = vals.author.userProfileimg;  //根据接口获取点击帖子用户的头像图片
        var curr_thisauthor_Name = vals.author.userName;  //根据接口获取点击帖子用户昵称
        var curr_thisauthor_Date = vals.topicDate;    //接口获取点击帖子发帖日期
        var curr_thisauthor_Comtent = vals.topicContent;  //接口获取点击帖子发帖内容
        var curr_thisauthorLike = vals.likeUser;  //点击的帖子的喜欢详情

        var Post_like = $(curr_thisauthorLike).map(function(i,val) {
          return val.id;;
        });

        var comment_Childpage_txtLi = `<li>
          <div class="card facebook-card card-nopadd">
            <div class="card-header no-border"> 
              <div class="facebook-avatar">
                <img src="${curr_thisauthor_img}" width="34" height="34">
              </div>
              <div class="facebook-name">${curr_thisauthor_Name}</div>
              <div class="facebook-date">
                <span class="pull-left">${curr_thisauthor_Date}</span>
              </div>
            </div>
              <div class="card-content-inner">
              <p>${curr_thisauthor_Comtent}</p>
              </div>
              <div class="card-content-inner">
                  <ul class="row no-gutter release_img">
                    `+currLiNum(curr_thisreles_img)[0]+`
                  </ul>
                  </div>
              <div class="card-footer no-border">
                <a href="" class="link">
                  <span class="icon icon-message iwt"></span>${Post_like[0]}
                </a>
                <a href="" class="link">
                  <span class="icon icon-message iwt"></span>${Post_like[0]}
                </a>
                <a href="#" class="link">
                  <span class="icon icon-message iwt"></span>${Post_like[0]}
                </a>
              </div>
          </div>
          </li>`;
       
       $("#comment-page").find(".cont-nopadd .child_ul").html(comment_Childpage_txtLi);

      });
    }).catch(err =>{  //中途出现错误在这显示
      console.log(err)
    })

      //  创建图片li的个数
function currLiNum(Post_img_arr) {
    var liImg;
    if (Post_img_arr.length == 1) {
    return  liImg = $(Post_img_arr).map(function(index,val) {
      //console.log(val.url);
        return `<li class="col-100 right_nopadding">
        <div class="card-content">
          <img src="${val.url}" class="pb-standalone-captions" width="100%">
        </div>
      </li>`
      });

    } else if(Post_img_arr.length == 2) {
    return  liImg = $(Post_img_arr).map(function(index,val) {
        return `<li class="col-33 right_nopadding">
        <div class="card-content">
          <img src="${val[index]}" class="pb-standalone-captions" width="100%">
        </div>
      </li>`
      });
    } else if(Post_img_arr.length <= 4) {
    return  liImg = $(Post_img_arr).map(function(index,val) {
        return `<li class="col-50 right_nopadding">
        <div class="card-content">
          <img src="${val[index]}" class="pb-standalone-captions" width="100%">
        </div>
      </li>`
      });
    }
    
  } 



  $(document).on("pageInit", function(e, pageId, $page) {
     
    if (pageId == 'comment-page') {
      //发送请求
      var opts = {
        method : 'GET',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        credentials: 'include',
        mode: "cors",
      }
      var url = `http://www.lkweb.top:8080/topic/comments/${current_reales_id}`;
      // 请求评论
      fetch(url,opts)
      .then(response => {
        return response.json()}).then(json => {
          var author_datas = json.data;
          console.log(author_datas)
          $.each(author_datas,function(index,vals) {
              console.log(vals)
          var comuser_information_id = vals.comuser.id;  //使用者id
          var comuser_information_Name = vals.comuser.userName; //使用者昵称
          var comuser_information_img = vals.comuser.userProfileimg;  //使用者头像
          var commentId_information = vals.commentId;  //评论id
          var commentDate_information = vals.commentDate;  //评论时间 
          var commentContent_information = vals.commentContent;  //评论内容   

          var comments_information = `<li class="libotm">
          <a href="#" class="item-link item-content" style="position:relative;">
          <div class="item-media widimg" id="${comuser_information_id}" style="position:absolute;top:0;left:10px;">
          <img src="${comuser_information_img}" style='width: 2rem;'></div>
          <div class="item-inner" style="background-image:none;padding-left:30px;">
              <div class="item-title-row">
                  <div class="item-title">${comuser_information_Name}</div>
                  <div class="item-after">${commentDate_information}</div>
              </div>
              <div class="item-text txtconts" style="height:auto;line-height:auto;display:inline-block">
                ${commentContent_information}
              </div>
          </div>
          </a>
          </li>`;

          $("#comment-page").find(".cont-top .comment_replay").prepend(comments_information);

          })
        }).catch(err => {
          console.log(err)
        });

    }

  //console.log(ths)
  // 查找底面评论DOM元素

  var comment_user_content;

 if ( pageId == 'comment-page' ) {
  
   var comments_input = $("#comment-page").find("#search")[0];  //发表评论input
   var comments_btn = $("#comment-page").find("#search").parent().prev()[0];  //发表评论提交
   
   $("#comment-page").on("touchend",".comment_replay .item-inner",function(event) {
     
    var comment_uesr_id = $(this).prev().attr("id");  //评论区用户id
    var comment_user_name = $(this).children().children().eq(0).text();  //评论区用户昵称
    comment_user_content = $(this).children().eq(1).text();  //评论区用户评论内容部分
    
    $(comments_input).attr("placeholder",`回复:${comment_user_name}`); //设置placeholder回复每个人

    event.stopPropagation(); 

   })

 }







// 提交暂时还没写
function Submi() {
  // $(comments_btn).on('touchend',function(ev) {
     
  //   var comments_input_value = $(comments_input).value;
  //   alert($(comments_input_value))
  //    //$(comment_user_content).text(`回复 :${comments_input_value}`);
    
  //   // var params = {
  //   //   method: "GET",
  //   //   headers: {
  //   //     'Content-Type': 'application/x-www-form-urlencoded'
  //   //   },
  //   //   credentials: 'include',
  //   //   mode: "cors"
  //   // }
    
    
    
  //   ev.stopPropagation();
  //   });
}



});
  });



    




//表白墙图片浏览
var myPhotoBrowserCaptions = $.photoBrowser({
  photos : [
      {
        url: `${Post_img_url}`,
        caption:  ''
      }
      
  ],
  theme: 'dark',
  type: 'standalone'
});
$(document).on('click','.pb-standalone-captions',function () {
myPhotoBrowserCaptions.open();
});




//情书
$(function() {
$(document).on('pageAnimationStart', '#letter-page', function (e, pageId, $page) {
  //console.log($page)
  var opts = {
    credentials: 'include',
    method: "GET",
    mode: "cors"
  };
  // fetch('http://www.lkweb.top:8080/wall2/topics', opts)
    // .then(function (response) {
    //   return response.json().then(function (json) {
    //     var datas = json.data;
    //     console.log(datas)
    //     $.each(datas, function (index,val) {
    //       var topicContent = val.topicContent;
    //       var topicDate = val.topicDate;
    //       var likecount = val.likecount;
    //       console.log(topicContent);
    //       var cardLiHTML = '<li>' +
    //         '<div class="card facebook-card card-nopadd">' +
    //         '<div class="card-content-inner">' +
    //         '<p>' + topicContent + '</p>' +
    //         '</div>' +
    //         '<div class="card-content-inner">' +
    //         '<p class="color-gray">' + topicDate + '</p>' +
    //         '</div>' +
    //         '<div class="card-footer no-border">' +
    //         '<a href="" class="link">' +
    //         '<span class="icon icon-message iwt"></span>' + likecount +
    //         '</a>' +
    //         '<a href="#" class="link">' +
    //         '<span class="icon icon-message iwt"></span>' + likecount +
    //         '</a>' +
    //         '</div>' +
    //         '</div>' +
    //         '</li>';

    //       $(".list-container").before(cardLiHTML);
    //     })
    //   });
    // });

  $(document).on('refresh', '.pull-to-refresh-content', function (e) {

    //   setTimeout(function() {

    //     // done
    //     $.pullToRefreshDone('.pull-to-refresh-content');
    // }, 2000);

  });  //下拉刷新结束


});   //pageAnimationStart结束

});




//我的部分-编辑个人资料提交
$(function() {
  $(document).on('pageAnimationEnd',function(e,pageId,$page) {
    let subbtn = $("#edit-page").find(".button-danger")[0];
    
  }); //新的页面初始化

});





$.init();

})


