/**
 * Created by zwang on 6/2/17.
 */
const LOQUOR_ROOT = 'http://api.jayveehe.com/loquor/comment';

window.onload = function () {
    if (!window.jQuery) {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://code.jquery.com/jquery-3.2.1.min.js';
        // var bootstrap_script = document.createElement('script');
        // bootstrap_script.type = 'text/javascript';
        // bootstrap_script.src = 'https://code.jquery.com/jquery-3.2.1.min.js';
        script.onload = function () {
            loquorInit();
        };
        document.getElementsByTagName('head')[0].appendChild(script);
    } else {
        loquorInit();
    }
};

function loquorInit() {
    // $('<link rel="stylesheet" type="text/css" href="https://rawgit.com/Namitor/Loquor/dev/plugin/source/loquor.css" >')
    //     .appendTo("head");
    $('<link rel="stylesheet" type="text/css" href="http://jayveestorage.qiniudn.com/public/css/loquor.css" >')
        .appendTo("head");
    // $('<link rel="stylesheet" type="text/css" href="../source/loquor.css" >')
    //     .appendTo("head");
    var $userContainer = $('#loquor_container');
    var $container = $('<div/>', {
        class: 'loquor-container'
    });
    $container.appendTo($userContainer);
    var loquorId = $userContainer.data('loquor-id');
    var pageId = $userContainer.data('loquor-page-id');
    var pageTitle = $userContainer.data('loquor-pagetitle');
    var pageUrl = $userContainer.data('loquor-pageurl');

    appendInput($container, loquorId, pageId, pageTitle, pageUrl);
    appendList($container, loquorId, pageId);

    //For test
    console.log('Loquor Name: ' + loquorId);
    console.log('Page ID: ' + pageId);
}

function appendInput($container, loquorId, pageId, pageTitle, pageUrl) {
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
    $userinfoArea = $('<div/>', {class: 'container', id: 'userinfo', style: 'padding:14px'});
    $emailArea = $('<input/>', {
        id: 'emailText',
        type: 'text',
        style: "width: 20%",
        placeholder: '请输入E-mail便于联系（选填）'
        // class: 'loquor-userinfo'
    });
    $usernameArea = $("<input>",
        {
            id: 'usernameText',
            type: 'text',
            // class: 'loquor-userinfo',
            style: 'width:30%',
            placeholder: '用户名（选填，不填则匿名）'

        });
    $submitBtn.click(function () {
        var email = $("#emailText").val();
        var username = $("#usernameText").val();
        if (email == '') {
            email = 'anonymous@null.com'
        }
        if (username == '') {
            var r = confirm('将以匿名发送');
            if (r == true) {
                username = 'Anonymous';
            } else {
                return
            }
        }
        var comment_content = $textErea.val();
        if (comment_content == '') {
            alert("请输入评论内容");
            return
        }
        console.log('user:' + username + 'page_title: ' + pageTitle
            + '\turl: ' + pageUrl + '\temail: ' + email + '\tcontent:' + comment_content);
        $.ajax({
            type: 'post',
            url: LOQUOR_ROOT,
            contentType: 'json',
            data: JSON.stringify({
                loquor_id: loquorId,
                page_id: pageId,
                user_name: username,
                extra_info: 'page_title: ' + pageTitle + '\turl: ' + pageUrl + '\temail: ' + email,
                content: comment_content
            }),
            success: function (data) {
                addCommentToList(data.result, true);
            }
        });
    });
    $submitBtn.append('评论');
    $("<a/>", {text: "Email: ", style: 'padding:5px'}).appendTo($userinfoArea);
    $emailArea.appendTo($userinfoArea);
    $("<a/>", {text: "用户名: ", style: 'padding:5px'}).appendTo($userinfoArea);
    $usernameArea.appendTo($userinfoArea);
    $userinfoArea.appendTo($container);

    $("<a/>", {text: "评论内容: ", style: 'padding:5px'}).appendTo($commentEditArea);
    $textErea.appendTo($commentEditArea);
    $submitBtn.appendTo($commentEditArea);
    $commentEditArea.appendTo($container);
}

function appendList($container, loquorId, pageId) {
    $.getJSON(LOQUOR_ROOT + '?loquor_id=' + loquorId + '&page_id=' + pageId, function (json) {
        var $list = $('<div/>', {
            id: 'comment_list'
        });
        $list.appendTo($container);
        $.each(json.result, function (key, val) {
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
