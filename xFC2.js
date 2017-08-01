var mychan;
var name_color;
var text_color;
var which='Revin製';
var kakko=1;
var number;

var space=1;
var unko=1;
var be_dat='0000';
var color=new Array('無','黒','赤','黄緑','青緑','水色','緑','青','白','紫','茶','橙','黄','桃','薄灰','濃灰');
var conum=new Array(''  ,'01','04','09'  ,'10'  ,'11'  ,'03','12','00','06','05','07','08','13','15',  '14');
var ko=new Array('','\(','（','\[','' ,''  );
var kc=new Array('','\)','）','\]',':','：');
var fc2s=new Array(ko[kakko],kc[kakko]);
var textspace='';
function event::onLoad(){
	loadconfig();
	oShell = new ActiveXObject("Wscript.Shell");
	oWmi   = GetObject("winmgmts:\\\\.\\root\\cimv2"); 
  if (which.match(/Revin製/)) {
    shellOpen(userScriptPath+ "\\FC2\\FC2_revin.exe","");
  }
  else {
    shellOpen(userScriptPath+ "\\FC2\\FC2_soysource.exe","");
  }
}
function loadconfig(){
        var file = openFile(userScriptPath+"\\xSetting.txt",true);
        if (file) {
          var s = file.readALL();
          file.close();
        }
        if(s){
          var ss = new Array;
          ss.length = 0;
          ss = s.replace(/[\r\n|\r]/g,"\n").split("\n");
          for(a=0;a<ss.length-1;a++){
           if(ss[a].match(/\[chat\]\:/)) mychan=RegExp.rightContext;
           if(ss[a].match(/\[kakko\]\:/)) kakko=RegExp.rightContext;
           if(ss[a].match(/\[Fwhich\]\:/)) which=RegExp.rightContext;
           if(ss[a].match(/\[Fcolor\]\:/)) name_color=RegExp.rightContext;
           if(ss[a].match(/\[color\]\:/)) text_color=RegExp.rightContext;
           if(ss[a].match(/\[Fnumber\]\:/)){
              if(RegExp.rightContext=="消す") number=true;
              else number=false;
           }
           if(ss[a].match(/\[bouyomichan\]\:/)){
             if(RegExp.rightContext=="使う") bouyomichan=true;
             else bouyomichan=false;
           }
           if(ss[a].match(/\[bouyomiNick\]\:/)){
              if(RegExp.rightContext=="読む") bNick=true;
              else bNick=false;
           }
           if(ss[a].match(/\[Ytokumei\]\:/)){
              if(RegExp.rightContext=="なし") tokumei=true;
              else tokumei=false;
           }
           if(ss[a].match(/\[Yname\]\:/)) Yname=RegExp.rightContext;
           if(ss[a].match(/\[Ynumber\]\:/)){
              if(RegExp.rightContext=="消す") number=true;
              else number=false;
           }
           if(ss[a].match(/\[Finterval\]\:/)) interval=RegExp.rightContext;
         }
         fc2s[0] = ko[kakko];
         fc2s[1] = kc[kakko];
         text_color=text_color.replace(/太字/,'');
         name_color=name_color.replace(/太字/,'');
         for(i=0;i<color.length;i++){
           text_color=text_color.replace(color[i],''+conum[i]);
           name_color=name_color.replace(color[i],''+conum[i]);
         }
         for(i=0;i<space;i++){
           textspace=textspace+' ';
         }
         datloadF() ;
       }
}
var beme;
var datpath=userScriptPath+ "\\FC2\\FC2.log";
function datloadF() {
        var file = openFile(datpath,true);
        if (file) {
          var s = file.readALL();
          file.close();
        }
        if(s){
          var ss = new Array;
          ss.length = 0;
          ss = s.split("\n");
          beme=ss[ss.length-1];
          log("FC2最新取得："+beme);
        }
        if (which.match(/Revin製/)) {
          initRevin();
          var dat=setInterval(datloadRevin,interval);
        }
        else {
          var dat=setInterval(datload,interval);
        }
}

var revinCommentNo = 0;
function initRevin() {
  var nowTime = +new Date();
  var file = openFile(datpath,true);
  if (!file) {
    return;
  }
  var buf = file.readAll();
  file.close();
  var fileArray = buf.replace(/[\r\n|\r]/g,"\n").split("\n");
  for (var index = 0; index < fileArray.length; index++) {
    var line = fileArray[index];
    if (line == '') continue;
    var lineArray = line.split("\t");
    var commentNo   = parseInt(lineArray[0]);
    var time        = parseInt(lineArray[1]);
    // 5秒前の発言の最新IDを探る
    if (time <= nowTime - 5*1000) {
      revinCommentNo = commentNo;
    }
  }
}
function datloadRevin() {
  var file = openFile(datpath,true);
  if (!file) {
    return;
  }
  var buf = file.readAll();
  file.close();
  var fileArray = buf.replace(/[\r\n|\r]/g,"\n").split("\n");
  for (var index = 0; index < fileArray.length; index++) {
    var line = fileArray[index];
    if (line == '') continue;
    var lineArray = line.split("\t");
    var commentNo   = parseInt(lineArray[0]);
    var time        = parseInt(lineArray[1]);
    var name        = lineArray[2];
    var commentBody = lineArray[3];
    var isChip      = lineArray[4] == 1;
    if (revinCommentNo < commentNo) {
      revinCommentNo = commentNo;
      writelime(name, commentBody);
    }
  }
}

function datload() {
        var file = openFile(datpath,true);
        if (file) {
          var s = file.readAll();
          file.close();
        }
          var ss = new Array;
          ss.length = 0;
          ss = s.split("\n");
          var sss = new Array;
          sss.length=0;
          var datname = new Array;
          var dattext = new Array;
          for(a=0;a<ss.length;a++){
              if (ss[a] == '') continue;
              sss[a] = ss[a].split("\t");
          }
          var ii=0;
          for(i=0;i<ss.length;i++){
            if(ss[i]==beme) ii=i+1;
          }
          for(i=ii;i<ss.length;i++){
            writelime(sss[i][0],sss[i][1]);
            if(sss[i][2] != ""){
              playSound('tip.wav');
            }
          }
          beme=ss[ss.length-1];
        be_dat=s;
}
function writelime(datname,dattext){
         if (datname === undefined || dattext === undefined) {
         }
         else{
           if(number){
             if(datname.match(/匿名 \((\d+)?\)/)){
               datname="匿名";
             }
           }else{
             var temp = datname.match(/\((\d+)?\)/);
             datname = "匿名 " + temp[0];
           }
           datname=fc2s[0]+datname+fc2s[1];
           var channelObject = findChannel(mychan);
           channelObject.print (name_color+datname+''+textspace+text_color+dattext+'');
           if(bouyomichan) talkChat(datname, dattext);
         }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// BouyomiLimeChat.js ～ 棒読みちゃん・LimeChat連携スクリプト
////////////////////////////////////////////////////////////////////////////////////////////////////
//■導入方法
// 1.当ファイルをLimeChatのscriptsフォルダに配置する
//   例）C:\【LimeChatインストール先】\users\【アカウント名】\scripts
//
// 2.LimeChat側でスクリプトを有効にする
//   ・LimeChatのメニューから「設定→スクリプトの設定」を開く。
//   ・スクリプトの設定画面で、「BouyomiLimeChat.js」の行を右クリックし、○を付ける。
//   ・スクリプトの設定画面の閉じるボタンを押す。
//
////////////////////////////////////////////////////////////////////////////////////////////////////

var sRemoteTalkCmd = null;
var oShell;
var oWmi;

function addTalkTask(text) {
	if(sRemoteTalkCmd == null) {
		findRemoteTalk();
		if(sRemoteTalkCmd == null) {
			return;
		}
	}
	
	oShell.Run(sRemoteTalkCmd + " \"" + text.replace("\"", " ") + "\"", 0, false);
}

function talkChat(nick, text) {
	if (bNick){
		addTalkTask(nick + "。" + text);
	} else {
		addTalkTask(text);
	}
}

function findRemoteTalk() {
	var proc = oWmi.ExecQuery("Select * from Win32_Process Where Name like 'BouyomiChan.exe'");
	var e    = new Enumerator(proc);
	for(; !e.atEnd(); e.moveNext()) {
		var item = e.item();
		
		var path = item.ExecutablePath.replace("\\BouyomiChan.exe", "");
		sRemoteTalkCmd = "\"" + path + "\\RemoteTalk\\RemoteTalk.exe\" /T";
		
		log("棒読みちゃん検出:" + path);
	}
}

////////////////////////////////////////////////////////////////////////////////////////////////////


function event::onUnLoad() {
	oShell = null;
	oWmi   = null;
}
