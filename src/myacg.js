var myacg_helper = (function () {

  var show = 'image';
  var type = '0';
  var sort = '1';
  var seller = '';
  var gnum = '';
  var ctid = '';
  var ctname = '';
  var ct18 = '';
  var has_amount = '';
  var demo = '';
  var is_run = true;

  var pop_setting = {};

  var init = function () {
    // &show=list&type=0&sort=1
    let searchParams = new URLSearchParams(window.location.search)
    if (searchParams.has('show')){
      show = searchParams.get('show')
    }
    if (searchParams.has('type')){
      type = searchParams.get('type')
    }
    if (searchParams.has('sort')) {
      sort = searchParams.get('sort')
    }
  }

  var doAdvSearch = function (setting) {

    pop_setting = setting;

    if (pop_setting['show-all']) {
      console.log('run doShowAll');
      doShowAll(doFilter);
    }
    else{
      console.log('run doFilter');
      doFilter();
    }
  }

  // local function
  function doFilter(){

    var keywords = {title: [], seller: []};
    if (pop_setting['filter-title']) {
      keywords.title = pop_setting['filter-title'].split(';');
    }
    if (pop_setting['filter-seller']) {
      keywords.seller = pop_setting['filter-seller'].split(';');
    }

    $('#Goods_list_block').children().each((index, item)=> {
      let title_hidden = false;
      let seller_hidden = false;
      let title = show === 'image' ? item.children[1].innerText : item.children[1].children[0].innerText;
      let seller = show === 'image' ? null : item.children[1].children[1].innerText; // image mode no seller info
      if (keywords.title && title && keywords.title.find(key => title.includes(key))){
        title_hidden = true;
      } else{
        title_hidden = false;
      }
      if (keywords.seller && seller && keywords.seller.find(key => seller.includes(key))) {
        seller_hidden = true;
      } else {
        seller_hidden = false;
      }

      if (title_hidden || seller_hidden){
        $(item).css('display', 'none');
      } else {
        $(item).css('display', 'block');
      }
    });

  }

  function doShowAll(callback) {
    if (!is_run) {
      callback();
      return false;
    }

    var keyword_body = $.trim($('#keyword_body').val());
    var search_ctid = $.trim($('#search_ctid').val());
    var start_date = $('#start_date').val();
    var end_date = $('#end_date').val();
    var low_price = $.trim($('input[name="low_price"]').val());
    var high_price = $.trim($('input[name="high_price"]').val());

    if (low_price != '' && (isNaN(low_price) || Number(low_price) <= 0)) {
      low_price = '';
    }
    if (high_price != '' && (isNaN(high_price) || Number(high_price) <= 0)) {
      high_price = '';
    }

    var now_count = $('#Goods_list_block li').length;
    g_helper.enableLoadingAnimate();

    $.ajax({
      url: 'goods_list_load_html_api.php',
      dataType: 'html',
      type: 'POST',
      data: {
        'start_date': start_date,
        'end_date': end_date,
        'keyword': keyword_body,
        'search_ctid': search_ctid,
        'low_price': low_price,
        'high_price': high_price,
        'show': show,
        'type': type,
        'sort': sort,
        'seller': seller,
        'gnum': gnum,
        'ctid': ctid,
        'ctid': ctname,
        'ct18': ct18,
        'has_amount': has_amount,
        'demo': demo,
        'now_count': now_count
      }
    })
      .done(function (res) {
        if (res && res != '') {
          $('.search_no_data').hide();
          var content = $(res);
          if (show == 'list') {
            if (!$('#Goods_list_div').hasClass('gs_list')) {
              $('#Goods_list_div').removeClass('gs_img').addClass('gs_list');
            }

            if (now_count == 0) {
              var list_head_html = '<div class="header clearfix">' +
                '<div class="col" style="width:680px;">商品內容</div>' +
                '<div class="col" style="width:200px;">價格</div></div>';
              $('#Goods_list_div').prepend(list_head_html)
            }
          }
          else {
            if (!$('#Goods_list_div').hasClass('gs_img')) {
              $('#Goods_list_div').removeClass('gs_list').addClass('gs_img');
            }
          }
          $('#Goods_list_block').append(content);

          doShowAll(callback);
        }
        else {
          is_run = false;
          if ($('#Goods_list_block li').length == 0) {
            $('.search_no_data').show();
          }

          if (callback)
            callback();

          g_helper.disableLoadingAnimate();
        }
      })
  }

  return {
    init,
    doAdvSearch
  }
})()


