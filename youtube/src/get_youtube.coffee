VIDEO_ID = null
LOG_NUM = 500
INTERVAL_SEC = 1
CHAT_FILE_PATH = 'youtube/chat.log'

system = require('system')
args = system.args

VIDEO_ID = args[1] if args.length >= 2
LOG_NUM = args[2] if args.length >= 3
INTERVAL_SEC = args[3] if args.length >= 4

VIDEO_ID = VIDEO_ID.replace /^https\:\/\/www\.youtube\.com\/watch\?v\=/, ''


page = require('webpage').create()

page.open 'https://www.youtube.com/live_chat?is_popout=1&v='+VIDEO_ID, ->
  page.includeJs 'http://code.jquery.com/jquery-1.12.4.min.js', ->
    func = ->
      res = page.evaluate ->
        dateStr = (date = null, dateSep = '-')->
          date = new Date() if date is null
          ''+zerofill(date.getFullYear(), 4)+dateSep+zerofill(date.getMonth()+1, 2)+dateSep+zerofill(date.getDate(), 2)

        datetimeStr = (date = null, dateSep = '-', timeSep = ':', betweenSep = ' ')->
          date = new Date() if date is null
          dateStr(date, dateSep)+betweenSep+
          zerofill(date.getHours(), 2)+timeSep+zerofill(date.getMinutes(), 2)+timeSep+zerofill(date.getSeconds(), 2)

        zerofill = (num, digit)->
          (''+repeat('0', digit)+num).slice -digit

        repeat = (str, times)->
          Array(1+times).join str

        comments = []
        for elem in $('#all-comments li')
          nowMs = $(elem).data('timestamp')
          date = datetimeStr(new Date(1000*nowMs))
          
          name = $(elem).find('.yt-user-name').eq(0).html()
          name = name.replace /\t/g,' '
          name = name.replace /<span[^>]*?>.*?<\/span>/g,''
          name = name.replace /[\r\n]/g, ''
          name = name.replace /^\s+/, ''
          name = name.replace /\s+$/, ''

          comment = $(elem).find('.comment-text').eq(0).html()
          comment = comment.replace /\t/g,' '
          comment = comment.replace /<span[^>]*?>.*?<\/span>/g,''
          comment = comment.replace /[\r\n]/g, ''
          comment = comment.replace /^\s+/, ''
          comment = comment.replace /\s+$/, ''

          if comment isnt ''
            hash =
              date : date
              name : name
              comment : comment
            comments.push hash

        comments
      res = res.slice LOG_NUM*(-1)
      fileBuf = ''
      for r in res
        fileBuf += r.date+"\t"+r.name+"\t"+r.comment+"\n"
      fs = require 'fs'
      try
        fs.write CHAT_FILE_PATH, fileBuf, 'w'
        console.log 'wrote:'+datetimeStr()
      catch
        console.log 'wrote fail:'+datetimeStr()
      setTimeout func, INTERVAL_SEC*1000
    func()

dateStr = (date = null, dateSep = '-')->
  date = new Date() if date is null
  ''+zerofill(date.getFullYear(), 4)+dateSep+zerofill(date.getMonth()+1, 2)+dateSep+zerofill(date.getDate(), 2)

datetimeStr = (date = null, dateSep = '-', timeSep = ':', betweenSep = ' ')->
  date = new Date() if date is null
  dateStr(date, dateSep)+betweenSep+
  zerofill(date.getHours(), 2)+timeSep+zerofill(date.getMinutes(), 2)+timeSep+zerofill(date.getSeconds(), 2)

zerofill = (num, digit)->
  (''+repeat('0', digit)+num).slice -digit

repeat = (str, times)->
  Array(1+times).join str
