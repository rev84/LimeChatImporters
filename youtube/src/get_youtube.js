// Generated by CoffeeScript 1.12.6
var CHAT_FILE_PATH, INTERVAL_SEC, LOG_NUM, VIDEO_ID, args, dateStr, datetimeStr, page, repeat, system, zerofill;

VIDEO_ID = null;

LOG_NUM = 500;

INTERVAL_SEC = 1;

CHAT_FILE_PATH = 'youtube/chat.log';

system = require('system');

args = system.args;

if (args.length >= 2) {
  VIDEO_ID = args[1];
}

if (args.length >= 3) {
  LOG_NUM = args[2];
}

if (args.length >= 4) {
  INTERVAL_SEC = args[3];
}

VIDEO_ID = VIDEO_ID.replace(/^https\:\/\/www\.youtube\.com\/watch\?v\=/, '');

page = require('webpage').create();

page.open('https://www.youtube.com/live_chat?is_popout=1&v=' + VIDEO_ID, function() {
  return page.includeJs('https://code.jquery.com/jquery-3.2.1.min.js', function() {
    var func;
    func = function() {
      var fileBuf, fs, i, len, r, res;
      res = page.evaluate(function() {
        var comments;
        comments = [];
        console.log(location.href);
        return comments;
      });
      console.log(res[10]);
      res = res.slice(LOG_NUM * (-1));
      fileBuf = '';
      for (i = 0, len = res.length; i < len; i++) {
        r = res[i];
        fileBuf += r.date + "\t" + r.name + "\t" + r.comment + "\n";
      }
      fs = require('fs');
      try {
        fs.write(CHAT_FILE_PATH, fileBuf, 'w');
        console.log('wrote:' + datetimeStr());
      } catch (error) {
        console.log('wrote fail:' + datetimeStr());
      }
      return setTimeout(func, INTERVAL_SEC * 1000);
    };
    return func();
  });
});

dateStr = function(date, dateSep) {
  if (date == null) {
    date = null;
  }
  if (dateSep == null) {
    dateSep = '-';
  }
  if (date === null) {
    date = new Date();
  }
  return '' + zerofill(date.getFullYear(), 4) + dateSep + zerofill(date.getMonth() + 1, 2) + dateSep + zerofill(date.getDate(), 2);
};

datetimeStr = function(date, dateSep, timeSep, betweenSep) {
  if (date == null) {
    date = null;
  }
  if (dateSep == null) {
    dateSep = '-';
  }
  if (timeSep == null) {
    timeSep = ':';
  }
  if (betweenSep == null) {
    betweenSep = ' ';
  }
  if (date === null) {
    date = new Date();
  }
  return dateStr(date, dateSep) + betweenSep + zerofill(date.getHours(), 2) + timeSep + zerofill(date.getMinutes(), 2) + timeSep + zerofill(date.getSeconds(), 2);
};

zerofill = function(num, digit) {
  return ('' + repeat('0', digit) + num).slice(-digit);
};

repeat = function(str, times) {
  return Array(1 + times).join(str);
};
