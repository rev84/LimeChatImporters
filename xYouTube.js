var datpath;
var mychan;
var name_color;
var text_color;
var bouyomichan;
var bNick;
var interval;
var kakko;
var tokumei;
var Yname;
var number;

var space=1;
var unko=1;
var be_dat='0000';
var color=new Array('無','黒','赤','黄緑','青緑','水色','緑','青','白','紫','茶','橙','黄','桃','薄灰','濃灰');
var conum=new Array(''  ,'01','04','09'  ,'10'  ,'11'  ,'03','12','00','06','05','07','08','13','15',  '14');
var ko=new Array('','\(','（','\[','' ,''  );
var kc=new Array('','\)','）','\]',':','：');
var fc2s = new Array;
var textspace='';
var tokuNum = new Array("");
function event::onLoad(){
	loadconfig();
	oShell = new ActiveXObject("Wscript.Shell");
	oWmi   = GetObject("winmgmts:\\\\.\\root\\cimv2"); 
}

var Yfile = userScriptPath + "\\youtube\\";
datpath = Yfile + "chat.log";

function loadconfig(){
        var file = openFile(userScriptPath+"\\★配信チャット取得スクリプトの設定.txt",true);
        if (file) {
          var s = file.readALL();
          file.close();
        }
        if(s){
          var ss = new Array;
          ss.length = 0;
          ss = s.split("\r\n");
          for(a=0;a<ss.length-1;a++){
           if(ss[a].match(/\[chat\]\:/)) mychan=RegExp.rightContext;
           if(ss[a].match(/\[kakko\]\:/)) kakko=RegExp.rightContext;
           if(ss[a].match(/\[Ycolor\]\:/)) name_color=RegExp.rightContext;
           if(ss[a].match(/\[color\]\:/)) text_color=RegExp.rightContext;
           if(ss[a].match(/\[Ybouyomichan\]\:/)){
             if(RegExp.rightContext=="使う") bouyomichan=true;
             else bouyomichan=false;
           }
           if(ss[a].match(/\[YbouyomiNick\]\:/)){
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
           if(ss[a].match(/\[Yinterval\]\:/)) interval=RegExp.rightContext;
           if(ss[a].match(/\[Yurl\]\:/)) Yurl=RegExp.rightContext;
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
        var file = openFile(Yfile+"youtube.bat",false);
        var battxt="bin\\phantomjs.exe src\\get_youtube.js "+Yurl+" 500 "+(interval/1000);
        if (file) {
          file.truncate();
          file.write(battxt);
          file.close();
        }
        shellOpen(Yfile+"youtube.bat","");
         datloadF();
       }
}

var beme;
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
          var sss = new Array;
          sss.length=0;
          for(a=0;a<ss.length-1;a++){
             sss[a] = ss[a].split("\t");
          }
          beme=ss[ss.length-2];
        }
        var dat=setInterval(datload,interval);
}
function datload() {
        var file = openFile(datpath,true);
        if (file) {
          var s = file.readALL();
          file.close();
        }
        if(s){
          var ss = new Array;
          ss.length = 0;
          ss = s.split("\n");
          var sss = new Array;
          sss.length=0;
          for(a=0;a<ss.length-1;a++){
             sss[a] = ss[a].split("\t");
          }
          var ii=0;
          for(i=0;i<ss.length-1;i++){
            if(ss[i]==beme) ii=i+1;
          }
          for(i=ii;i<ss.length-1;i++){
            writelime(sss[i][1],sss[i][2]);
          }
          beme=ss[ss.length-2];
        }
}
function writelime(datname,dattext){
        if(tokumei){
          if(number){
            datname=Yname;
          }
          else{
            var n=0;
            for(j=0;j<tokuNum.length;j++){
              if(tokuNum[j]==datname) n=j;
            }
            if(n==0){
              n=tokuNum.length;
              tokuNum[tokuNum.length]=datname;
            }
            datname=Yname+"("+n+")";
          }
        }
        datname=fc2s[0]+datname+fc2s[1];
        var channelObject = findChannel(mychan);
        channelObject.print (name_color+datname+''+textspace+text_color+dattext+'');
        if(bouyomichan) talkChat(datname, dattext);
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
