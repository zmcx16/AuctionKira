var ruten_helper = (function () {

  var style = 'image'
  var now_page = -1;
  var end_page = -1;
  var pop_setting = {};

  var init = function () {
    // search_form s_grid / search_form s_list
    loadStyle();

    $('body').append('<iframe id="ak-ruten-show" width="600px" height="600px" style="display:none;" src=""></iframe>');
    $('#ak-ruten-show').on('load', () => {
      let find_class = style === 'image' ? '.search_form.s_grid' : '.search_form.s_list';
      let iframe_content = $($('#ak-ruten-show').contents()[0]).find(find_class);
      
      if (iframe_content.length > 0){
        $(find_class + ' .content')[0].innerHTML += ($(iframe_content).children('.content')[0].innerHTML);
        if (now_page < end_page){
          now_page += 1;
          g_helper.setProgressBar(now_page * 100 / end_page, true);
          doShowAll();
        } else {
          g_helper.setProgressBar(100, false);
          console.log('show all completed, do filter');
          doFilter();
        }
      }else{
        g_helper.setProgressBar(0, false);
        console.log('no need add item.');
        doFilter();
      }
    });
  }

  var doAdvSearch = function (setting) {

    loadStyle();
    pop_setting = setting;

    if (pop_setting['show-all']) {
      console.log('run doShowAll');
      doShowAll();
    }
    else {
      console.log('run doFilter');
      doFilter();
    }
  }

  // local function
  function loadStyle(){
    // search_form s_grid / search_form s_list
    if ($('.search_form.s_grid')[0].innerText.trim() !== "") {
      style = 'image';
    } else {
      style = 'list';
    }
  }

  function doFilter() {

    var keywords = { title: [], seller: [], ads: false };
    if (pop_setting['filter-title']) {
      keywords.title = pop_setting['filter-title'].split(';');
    }
    if (pop_setting['filter-seller']) {
      keywords.seller = pop_setting['filter-seller'].split(';');
    }
    if (pop_setting['filter-ads']) {
      keywords.ads = pop_setting['filter-ads'];
    }

    let find_class = style === 'image' ? '.search_form.s_grid .content' : '.search_form.s_list .content';

    $(find_class).children().each((index, item) => {

      if ($(item).hasClass('carousel')) {
        if (keywords.ads) {
          $(item).css('display', 'none');
        } else {
          $(item).css('display', 'block');
        }
        return; // bypass oversea ads
      }

      let items_arr = [];
      if (style === 'image'){
        $(item).children().each((index2, item2) => {
          items_arr.push(item2);
        });
      }else{
        items_arr.push(item);
      }

      $(items_arr).each((index3, good_item) => {
        let title_hidden = false;
        let seller_hidden = false;
        let ads_hidden = false;

        let title = style === 'image' ? good_item.children[1].children[0].children[2].innerText : good_item.children[1].children[0].children[0].children[2].innerText;
        let seller = style === 'image' ? null : $(good_item.children[2].children[0].children[1].children[0]).attr('href'); // image mode no seller info
        if (seller) { // https://www.ruten.com.tw/user/index00.php?s=XXX
          seller = seller.substr(seller.indexOf('=') + 1);
        }
        let is_ads = $(good_item).find('.ads_tag.unblock').length === 0;

        if (keywords.title && title && keywords.title.find(key => title.includes(key))) {
          title_hidden = true;
        } else {
          title_hidden = false;
        }
        if (keywords.seller && seller && keywords.seller.find(key => seller.includes(key))) {
          seller_hidden = true;
        } else {
          seller_hidden = false;
        }
        if (keywords.ads && is_ads) {
          ads_hidden = true;
        } else {
          ads_hidden = false;
        }

        if (title_hidden || seller_hidden || ads_hidden) {
          $(good_item).css('display', 'none');
        } else {
          if (style === 'image'){
            $(good_item).css('display', 'block');
          }else{
            $(good_item).css('display', 'flex');
          }
        }
      }); 
    });
  }

  function doShowAll() {

    if (now_page === -1 || end_page === -1){
      let page_info = $('#ProdTopPgContainer')[0].innerText.split('\n');
      now_page = parseInt(page_info[0]) + 1;  // load next page
      end_page = parseInt(page_info[1]);
      g_helper.setProgressBar(0, true);
    }

    var url = location.href.replace(/&?p=([^&]$|[^&]*)/i, "");
    url += "&p=" + now_page;
    $('#ak-ruten-show').attr('src', url);   
  }

  return {
    init,
    doAdvSearch
  }
})()


