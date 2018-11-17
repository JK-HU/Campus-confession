
$.config = {
  autoInit : false,
  showPageLoadingIndicator : true
}

$(function() {
  'use strict';

  var cont = $('.content')[0];
$(document).on('pageInit','#indexRouter',function(e) {
  console.log(e)
  if (e.target.id == 'indexRouter') {
    $(this)[0].show();
  }else{
    $(this)[0].hide();
  }

});
  console.log('先执行自调用函数');
$.init();
})


