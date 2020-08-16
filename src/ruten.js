var ruten_helper = (function () {

  var style = 'image'
  var now_page = -1;
  var end_page = -1;
  var pop_setting = {};

  var init = function () {
    // search_form s_grid / search_form s_list
    if ($('.search_form.s_grid')[0].innerText.trim() !== ""){
      style = 'image';
    }else{
      style = 'list';
    }

    $('body').append('<iframe id="ak-ruten-show" width="600px" height="600px" style="display:none;" src=""></iframe>');
    $('#ak-ruten-show').on('load', () => {
      let find_class = style === 'image' ? '.search_form.s_grid' : '.search_form.s_list';
      let iframe_content = $($('#ak-ruten-show').contents()[0]).find(find_class);
      
      if (iframe_content.length > 0){
        $(find_class + ' .content')[0].innerHTML += ($(iframe_content).children('.content')[0].innerHTML);
        if (now_page < end_page){
          doShowAll();
        } else {
          console.log('show all completed.');
        }
      }else{
        console.log('no need add item.');
      }
    });
  }

  var doAdvSearch = function (setting) {

    pop_setting = setting;

    if (pop_setting['show-all']) {
      doShowAll();
    }
    else {
      doFilter();
    }
  }

  // local function
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
  }

  function doShowAll() {

    if (now_page === -1 || end_page === -1){
      let page_info = $('#ProdTopPgContainer')[0].innerText.split('\n');
      now_page = parseInt(page_info[0]);
      end_page = parseInt(page_info[1]);
    }
    now_page += 1;

    var url = location.href.replace(/&?p=([^&]$|[^&]*)/i, "");
    url += "&p=" + now_page;
    $('#ak-ruten-show').attr('src', url);   
  }

  return {
    init,
    doAdvSearch
  }
})()


