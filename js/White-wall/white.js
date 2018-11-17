$.config = {
    autoInit : true,
    showPageLoadingIndicator : true, 
}

var b = $("#searchbar").find(".searchbar-cancel")[0];
$(document).ready(function () {
    $(document).on('pageInit','#indexRouter',function (e) {
        console.log(e);
            if (e.target.id == 'indexRouter') {
                $(this).show();
            }else{
                $(this).hide();
            }
        });
    $(document).on('click','.searchbar-cancel',function () {
        $.alert('这是发布按钮');
        
    });

    $.init();
});