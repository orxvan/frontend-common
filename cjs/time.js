'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var moment = _interopDefault(require('moment'));
var ramdaExtra_js = require('./ramda-extra.js');

var momentLocale = {
  months: '一月,二月,三月,四月,五月,六月,七月,八月,九月,十月,十一月,十二月'.split(','),

  monthsShort: '1 月,2 月,3 月,4 月,5 月,6 月,7 月,8 月,9 月,10 月,11 月,12 月'.split(','),

  weekdays: '星期日,星期一,星期二,星期三,星期四,星期五,星期六'.split(','),
  weekdaysShort: '周日,周一,周二,周三,周四,周五,周六'.split(','),
  weekdaysMin: '日,一,二,三,四,五,六'.split(','),

  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'YYYY 年 MMM D 日',
    LL: 'YYYY 年 MMM D 日',
    LLL: 'YYYY 年 MMM D 日 HH:mm',
    LLLL: 'YYYY 年 MMM D 日 dddd HH:mm',
    l: 'YYYY 年 MMM D 日',
    ll: 'YYYY 年 MMM D 日',
    lll: 'YYYY 年 MMM D 日 HH:mm',
    llll: 'YYYY 年 MMM D 日 dddd HH:mm'
  },

  calendar: {
    sameDay: '[今天] LT',
    nextDay: '[明天] LT',
    nextWeek: '[下]dddd LT',
    lastDay: '[昨天] LT',
    lastWeek: '[上]dddd LT',
    sameElse: 'L'
  },

  dayOfMonthOrdinalParse: /\d{1,2} ?(日|月|周)/,

  relativeTime: {
    future: '%s内',
    past: '%s前',

    s: '几秒',
    m: '1 分钟',
    mm: '%d 分钟',
    h: '1 小时',
    hh: '%d 小时',
    d: '1 天',
    dd: '%d 天',
    M: '1 个月',
    MM: '%d 个月',
    y: '1 年',
    yy: '%d 年'
  },

  week: {
    dow: 0,
    doy: 4 }
};

var FORMAT_DATETIME_MEDIUM = 'YYYY-MM-DD HH:mm';
var LOCALE = 'zh-cn';

var setupLocale = function setupLocale() {
  if (moment.locales().indexOf(LOCALE) !== -1) {
    moment.locale(LOCALE, null);
  }

  moment.locale('zh-cn', momentLocale);
  moment.locale('en');
};

var formatTime = function formatTime(time) {
  var format = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : FORMAT_DATETIME_MEDIUM;
  return ramdaExtra_js.isNotNilOrEmpty(time) ? moment(time).locale('zh-cn').format(format) : '';
};

exports.FORMAT_DATETIME_MEDIUM = FORMAT_DATETIME_MEDIUM;
exports.formatTime = formatTime;
exports.setupLocale = setupLocale;
//# sourceMappingURL=time.js.map
