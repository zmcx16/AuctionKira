var g_helper = (function () {

  var init = function(){
    var loadingHtml = 
      '<div class="ak-loadingBlock" style="display:none">' +
        '<div class="ak-loadingAnimation"></div>' +
        '<div class="ak-loadingBackground"></div>' +
      '</div>';

    if(!$("body").hasClass("ak-loadingBlock")){
      $('body').append(loadingHtml);
    }
  }

  var enableLoadingAnimate = function() {
    $('.ak-loadingBlock').show();
  }

  var disableLoadingAnimate = function () {
    $('.ak-loadingBlock').hide();
  }

  return {
    init,
    enableLoadingAnimate,
    disableLoadingAnimate
  }
})()


