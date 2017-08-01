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
  page.includeJs 'https://code.jquery.com/jquery-3.2.1.min.js', ->
    func = ->
      res = page.evaluate ->
        comments = []
        console.log location.href
        #$('.style-scope.yt-live-chat-text-message-renderer#message').each ->
        #  #comments.push $(@).text()
        #  console.log $(@).html()
        comments
      console.log res[10]
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
