var ruten_helper = (function () {

  var style = 'image'
  var start_page = -1;
  var now_page = -1;
  var end_page = -1;
  var preload_page = 0;
  var preload_completed = false;
  var pop_setting = {};
  var bFilterRunning = false;

  // not preload mode used
  var bDomChanged = false;
  var bDomDelay = 1000;


  var init = function () {
    // search_form s_grid / search_form s_list
    getStyle();

    $('body').append('<div id="ak-current-page" style="display:none;"></div><iframe id="ak-ruten-show" width="600px" height="600px" style="display:none;" src=""></iframe>');
    $('#ak-ruten-show').on('load', () => {
      if ($('#ak-ruten-show').src !== ''){
        let find_class = style === 'image' ? '.search_form.s_grid' : '.search_form.s_list';
        let iframe_content = $($('#ak-ruten-show').contents()[0]).find(find_class);

        if (iframe_content.length > 0) {
          $(find_class + ' .content')[0].innerHTML += ($(iframe_content).children('.content')[0].innerHTML);
          if (now_page < end_page) {
            now_page += 1;
            let now_p = now_page - (end_page - preload_page);
            let end_p = preload_page ;
            g_helper.setProgressBar(now_p * 100 / end_p, true);
            doPreloadPage();
          } else {
            g_helper.setProgressBar(100, false);
            // hidden page button
            //$('#ProdTopPgContainer').hide();
            //$('.footer .pagination').hide();
            setCurrentPage();
            console.log(start_page);
            console.log(end_page);
            console.log('doPreloadPage completed, run doFilter()');
            preload_completed = true;
            doFilter();
          }
        } else {
          g_helper.setProgressBar(0, false);
          console.log('no need add item, run doFilter()');
          doFilter();
        }
      }
    });

    // dom changed
    var check_dom = () => {
      doFilter();
      if (bDomChanged) {
        bDomChanged = false;
        setTimeout(check_dom, bDomDelay);
      }
    };

    $('body').on('DOMSubtreeModified', ".search_form", function () {
      // only run if preload page is disabled (=0)
      if (preload_page === 0){
        if (!bFilterRunning){       
          setTimeout(check_dom, bDomDelay);
        }else{
          bDomChanged = true;
        }
      }
    });
  }

  var doAdvSearch = function (setting) {

    getStyle();
    pop_setting = setting;

    if (pop_setting['preload-page'] > 0) {
      preload_page = pop_setting['preload-page'];
      console.log('run doPreloadPage');

      let page_info = $('#ProdTopPgContainer')[0].innerText.split('\n');
      if (now_page === -1) { // start first time
        start_page = parseInt(page_info[0]);
        now_page = start_page + 1; // load next page
      }else{
        now_page = now_page + 1;
      }

      end_page = Math.min(now_page -1 + preload_page, parseInt(page_info[1]));
      if (now_page > end_page || preload_completed) {
        console.log('no need add item, run doFilter().');
        doFilter();
      } else {
        g_helper.setProgressBar(0, true);
        doPreloadPage();
      }
    }
    else {
      console.log('run doFilter');
      doFilter();
    }
  }

  // local function
  function setCurrentPage(){

    let page_info = $('#ProdTopPgContainer')[0].innerText.split('\n');
    let c_page = parseInt(page_info[0]);
    let l_page = parseInt(page_info[1]);

    let url_base = location.href.replace(/&?p=([^&]$|[^&]*)/i, "");
    let previous_page = Math.max(1, start_page - preload_page - 1);
    let previous_url = url_base + "&p=" + previous_page;
    let next_page = now_page + 1;
    let next_url = url_base + "&p=" + next_page;

    $('#ak-current-page')[0].innerHTML = 
      (c_page === 1 ? '': '<a href="' + previous_url + '"><span class="font-small">上一頁(' + previous_page + "~" + (previous_page + preload_page) + ')</span></a>') + 
      '<div class="font-small">目前載入(' + start_page + "~" +  now_page + ')</div>' + 
      (parseInt(now_page) >= l_page ? '' : '<a href="' + next_url + '"><span class="font-small">下一頁(' + next_page + "~" + (next_page + preload_page) + ')</span></a>');
    $('#ak-current-page').show();

  }

  function getStyle(){
    // search_form s_grid / search_form s_list
    if ($('.search_form.s_grid')[0].innerText.trim() !== "") {
      style = 'image';
    } else {
      style = 'list';
    }
  }

  function doFilter() {
    bFilterRunning = true;

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
          if (style === 'image') {
            $(item).css('display', 'block');
          } else {
            $(item).css('display', 'flex');
          }
        }
        return; // bypass carousel ads
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
        try {
          if ($(good_item)[0].innerHTML.indexOf('_oversea')!==-1) {
            if (keywords.ads) {
              $(good_item).css('display', 'none');
            } else {
              if (style === 'image') {
                $(good_item).css('display', 'block');
              } else {
                $(good_item).css('display', 'flex');
              }
            }
            return; // bypass oversea item
          }

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
        } catch (e){
          console.error(e);
          console.log(good_item);
        }

      }); 
    });

    bFilterRunning = false;
  }

  function doPreloadPage() {

    var url = location.href.replace(/&?p=([^&]$|[^&]*)/i, "");
    url += "&p=" + now_page;
    $('#ak-ruten-show').attr('src', url);   
  }

  return {
    init,
    doAdvSearch
  }
})()


