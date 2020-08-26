var g_helper = (function () {

  var init = function(){
    var loadingHtml = 
      '<div class="ak-loadingBlock" style="display:none">' +
        '<div class="ak-loadingAnimation" style="display:none"></div>' +
        '<progress id="ak-progressbar" max="100" value="0" style="display:none"></progress>' + 
        '<div class="ak-loadingBackground"></div>' +
      '</div>';

    if(!$("body").hasClass("ak-loadingBlock")){
      $('body').append(loadingHtml);
    }
  };

  var enableLoadingAnimate = function() {
    $('.ak-loadingAnimation').show();
    $('.ak-loadingBlock').show();
  }

  var disableLoadingAnimate = function () {
    $('.ak-loadingBlock').hide();
    $('.ak-loadingAnimation').hide();
  }

  var setProgressBar = function (val, bShow) {
    $('#ak-progressbar').val(val);
    if (bShow){
      $('#ak-progressbar').show();
      $('.ak-loadingBlock').show();
    }else{
      $('.ak-loadingBlock').hide();
      $('#ak-progressbar').hide();
    }
  }

  return {
    init,
    enableLoadingAnimate,
    disableLoadingAnimate,
    setProgressBar
  }
})();


