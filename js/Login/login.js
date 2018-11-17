


$(document).ready(function() {


$(document).on("pageInit", function(e, pageId, $page) {
    
    //使用正则检测用户的合法
    $(function() {
        $("#login_page").find(".username").bind('blur',() => {
            alert(this)
        })
    })


});




$.init();
});