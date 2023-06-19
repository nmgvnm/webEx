/** ==========================================================================
 *  notification
 * ======================================================================== */

$.notification = function(type, data, language) {
  var maxCount = 5;
  var $toastEl = null;
  var $notification = $('#notification-wrap');
  var template = $.notification.getTemplate(type, data, language);

  // 최대 5개
  if ($('.alert').length === maxCount) {
    $.notification.close($notification.find('.alert:nth-child(5)'));
  }

  if(!$notification.length) {
    $('body').append('<div id="notification-wrap"></div>');
    $notification = $('#notification-wrap');
  }

  $toastEl = $(template).prependTo($notification);

  // 나타나는 애니메이션
  setTimeout(function() {
    $('.alert:not(.show)').addClass('show');
  }, 100);

  setTimeout(function() {
    $.notification.close($toastEl);
  }, 30000);
};

/**
 * 알림 템플릿 반환
 * @param type
 * @param data
 * @param language
 * @returns {*}
 */
$.notification.getTemplate = function(type, data, language) {
  console.log('notification.getTemplate', arguments);

  var notificationDate = moment().format('YYYY.MM.DD  HH:mm');
  var template = {
    conferenceInvite: function(data) {
      return [
        '<div class="alert">',
          '<button type="button" class="close">',
            '<i class="rm-icon-popclose" />',
          '</button>',
          '<div class="wrap-alert">',
            '<img src="/public/service/img/conference/bi-round.png" alt="Remotemeeting" />',
            '<div class="wrap-contents">',
              '<p class="title"><a href="/room/'+ data.conferenceID + '">' + data.title +'</a></p>',
              '<p class="message"><a href="/room/'+ data.conferenceID + '">'+ data.message +'</a></p>',
              '<div class="date">' + notificationDate + '</div>',
            '</div>',
          '</div>',
        '</div>'
      ].join('\n');
    },
    reservationRemind: function(data) {
      var linkPath = '/' + language + '/reservation/share/' + data.reservationID;

      return [
        '<div class="alert">',
          '<button type="button" class="close">',
            '<i class="rm-icon-popclose" />',
          '</button>',
          '<div class="wrap-alert">',
            '<img src="/public/service/img/conference/bi-round.png" alt="Remotemeeting" />',
            '<div class="wrap-contents">',
              '<p class="title"><a href="' + linkPath+ '">' + $.i18n.RM00873 +'</a></p>', // 예약 알림
              '<p class="message"><a href="' + linkPath + '">' + data.title + '</a></p>',
              '<p class="message">' + $.i18n.RM00874 + ': ' + data.startDate + '</p>',    // 예약 시간
              '<p class="message">' + $.i18n.RM00875 + ': ' + data.userName + '</p>',     // 예약자
            '</div>',
          '</div>',
        '</div>'
      ].join('\n');
    }
  };

  return template[type](data);
};

/**
 * 알림 닫기 이벤트
 * @param $target
 */
$.notification.close = function($target) {
  $target.removeClass('show');
  setTimeout(function() {
    $target.remove();
  }, 200);
};

$('body').on('click', '#notification-wrap .close', function() {
  var $target = $(this).closest('.alert');
  $.notification.close($target);
});
