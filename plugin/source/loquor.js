/**
 * Created by zwang on 6/2/17.
 */
const LOQUOR_ROOT = 'http://www.namitor.com/loquor/comment';

window.onload = function () {
  if(!window.jQuery){
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://code.jquery.com/jquery-3.2.1.min.js';
    script.onload = function () {
      loquorInit();
    };
    document.getElementsByTagName('head')[0].appendChild(script);
  }else {
    loquorInit();
  }
};

function loquorInit() {
  $('<link rel="stylesheet" type="text/css" href="../source/loquor.css" >')
    .appendTo("head");
  var $userContainer = $('#loquor_container');
  var $container = $('<div/>', {
    class: 'loquor-container'
  });
  $container.appendTo($userContainer);
  var loquorId = $userContainer.data('loquor-id');
  var pageId = $userContainer.data('loquor-page-id');

  appendInput($container, loquorId, pageId);
  appendList($container, loquorId, pageId);

  //For test
  console.log('Loquor Name: ' + loquorId);
  console.log('Page ID: ' + pageId);
}

function appendInput($container, loquorId, pageId) {
  $commentEditArea = $('<div/>', {
    class: 'loquor-edit-area'
  });
  $textErea = $('<textarea/>', {
    class: 'loquor-texterea',
    wrap: 'soft',
    rows: 1
  });
  $submitBtn = $('<button/>', {
    class: 'loquor-submit-btn'
  });
  $submitBtn.click(function () {
    $.ajax({
      type: 'post',
      url: LOQUOR_ROOT,
      contentType: 'json',
      data: JSON.stringify({
        loquor_id: loquorId,
        page_id: pageId,
        user_name: 'anonym',
        content: $textErea.val()
      }),
      success: function (data) {
        addCommentToList(data.result, true);
      }
    });
  });
  $submitBtn.append('评论');
  $textErea.appendTo($commentEditArea);
  $submitBtn.appendTo($commentEditArea);
  $commentEditArea.appendTo($container);
}

function appendList($container, loquorId, pageId) {
  $.getJSON(LOQUOR_ROOT+'?loquor_id='+loquorId+'&page_id='+pageId, function (json) {
    var $list = $('<div/>', {
      id: 'comment_list'
    });
    $list.appendTo($container);
    $.each(json.result, function(key, val) {
      addCommentToList(val);
    });
  });
}

function addCommentToList(data, ifInsert) {
  var $commentList = $('#comment_list');
  var $comment = $('<div/>', {
    class: 'loquor_comment_item'
  });
  $('<div/>', {
    class: 'loquor_comment_item_meta'
  }).append($('<span/>', {
    class: 'loquor_comment_item_user',
    text: data.user_name
  })).append($('<span/>', {
    class: 'loquor_comment_item_time',
    text: data.post_time
  })).appendTo($comment);
  $('<div/>', {
    class: 'loquor_comment_item_content',
    text: data.content
  }).appendTo($comment);
  $('<div/>', {
    class: 'loquor_comment_break_line'
  }).appendTo($comment);
  ifInsert ? $comment.prependTo($commentList) : $comment.appendTo($commentList);
}
