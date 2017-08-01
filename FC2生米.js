//★[設定１]自分のチャットを入力
var mychan='#revot';

//★[設定２]名前欄の色を変える（フォントの大きさはreadmeを参照）
/*名前の色*/var name_color='水色';
/*本文の色*/var text_color='白';
//例）赤太字の場合は'赤太字'
//対応色は'無','黒','赤','黄緑','青緑','水色','緑','青','白','紫','茶','橙','黄','桃','薄灰','濃灰'
//対応フォントは太字のみ

//★[設定３]名前欄の表示
/*括弧の種類　デフォルトでは(fc2live)のように半角括弧表示されます*/
var kakko=1;
//0：括弧無　匿名
//1：半角括弧(匿名)
//2：全角括弧（匿名）
//3：半角大括弧[匿名]
//4：半角コロン　匿名:
//5：全角コロン　匿名：

/*匿名(数字)　trueで数字を消す*/
var number=false;
/*チャットと本文の間にスペースを入れてチャット位置調整する（スペースの数を入力）*/
var space=1;

//変更はここまで。
//ここから動作部分
/*************************************************************/
/*************************************************************/
/*********************　dat　*********************************/
/*************************************************************/
/*************************************************************/

var unko=1;
var datpath = "F:\\tools\\FC2come0-5-5-0\\FC2log.txt";
var be_dat='0000';
var color=new Array('無','黒','赤','黄緑','青緑','水色','緑','青','白','紫','茶','橙','黄','桃','薄灰','濃灰');
var conum=new Array(''  ,'01','04','09'  ,'10'  ,'11'  ,'03','12','00','06','05','07','08','13','15',  '14');
var ko=new Array('','\(','（','\[','' ,''  );
var kc=new Array('','\)','）','\]',':','：');
var fc2s=new Array(ko[kakko],kc[kakko]);
var textspace='';
function event::onLoad(){
    var dat=setInterval(datload,200);
    text_color=text_color.replace(/太字/,'');
    name_color=name_color.replace(/太字/,'');
    for(i=0;i<color.length;i++){
      text_color=text_color.replace(color[i],''+conum[i]);
      name_color=name_color.replace(color[i],''+conum[i]);
    }
    for(i=0;i<space;i++){
        textspace=textspace+' ';
    }
}
function datload() {
  var file = openFile(datpath,true);
  if (file) {
    var s = deleteTag(file.readLine());
    file.close();
  }
  if(s!=be_dat){
    var ss=s.split("\"");
    for(a=0;a<ss.length;a++){
       if(ss[a]=="username")  var datname=ss[a+2];
       if(ss[a]=="comment")	var dattext  = ss[a+2];
    }
    if(number){
      if(datname.match(/匿名\((\d+)?\)/)){
        datname="匿名";
      }
    }
    if(datname.length > 10) {
      datname = datname.substr(0, 10);
    }
    datname = datname.replace('匿名', '匿名 ');
    datname=fc2s[0]+datname+fc2s[1];
    var channelObject = findChannel(mychan);
    channelObject.print(name_color+datname+''+textspace+text_color+dattext+'');
    // URLチェック
    var match = dattext.match(/(https?|ftp)(:\/\/[-_.!~*¥'\(\)a-zA-Z0-9;\/?:¥@&=+¥$,%#]+)/);
    if (match) {
      var url = match[0];
      execHide('php "'+userScriptPath+'\\hidecon\\GetFc2CushionUrl.php" "'+url+'"', function(stdout){
        channelObject.print(name_color+'【URL】'+''+textspace+text_color+stdout+'');
      });
    }
  }
  be_dat=s;
}


function execHide(command, callback)
{
  var hideConPath = userScriptPath+'\\hidecon\\hidecon.exe'; // ツールのパス
   
  // 実行コマンドを生成
  var hideCommand = '"' + hideConPath + '" ' + command;
  // WScript.Shellオブジェクトを得る
  var WScriptShell = new ActiveXObject("WScript.Shell");
  // 非同期実行を開始してWshExecオブジェクトを得る
  var wshExec = WScriptShell.Exec(hideCommand);

  (function commandWaitLoop() {
    switch(wshExec.Status) {
      case 0: // WshRunning - 未だ実行中
        // 100ミリ秒後にもう一度statusを見ることにする
        setTimeout(commandWaitLoop, 100);
        break;
      case 1: // WshFinished - コマンドの実行が完了した
        // 標準出力の内容を全て読み取ってコールバック関数に渡す
        callback(wshExec.StdOut.ReadAll());
        break;
      case 2: // WshFailed - コマンドの実行に失敗した
        // 例外を投げる
        throw new Error("asyncExecuteCommand failed");
    }
  })();
}

function deleteTag(str) {
  return str.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g,'');
}