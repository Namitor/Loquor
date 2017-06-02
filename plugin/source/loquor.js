/**
 * Created by zwang on 6/2/17.
 */
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
  var $container = $('#loquor_container');
  var loquorName = $container.data('loquor-name');
  var pageId = $container.data('loquor-page-id');

  appendInput($container);
  appendList($container);

  //For test
  console.log('Loquor Name: ' + loquorName);
  console.log('Page ID: ' + pageId);
}

function appendInput($container) {
  $input = jQuery('<input/>', {
    class: 'loquor-input'
  });
  $submit = jQuery('<button/>', {
    text: 'Send',
    click: function () {
      console.log($input.val());
    }
  });
  $input.appendTo($container);
  $submit.appendTo($container);
}

function appendList($container) {
  $.getJSON('../asset/test.json', function (json) {
    var $list = jQuery('<ul/>');
    $.each(json.data, function(key, val) {
      var $comment = jQuery('<div/>');
      $.each(val, function (key, val) {
        jQuery('<div/>', {
          text: val
        }).appendTo($comment);
      });
      $comment.appendTo($list);
    });
    $list.appendTo($container);
  });
}
