var mychan;
var name_color;
var text_color;
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
}
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
           if(ss[a].match(/\[Fcolor\]\:/)) name_color=RegExp.rightContext;
           if(ss[a].match(/\[color\]\:/)) text_color=RegExp.rightContext;
           if(ss[a].match(/\[Flog\]\:/)) datpath=RegExp.rightContext;
           if(ss[a].match(/\[Fnumber\]\:/)){
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
         var dat=setInterval(datload,interval);
       }
}
function datload() {
        var file = openFile(datpath,true);
        if (file) {
          var s = file.readLine();
          file.close();
        }
        if(s!=be_dat){
          var ss=s.split("\"");
          for(a=0;a<ss.length;a++){
             if(ss[a]=="username")  var datname=ss[a+2];
             if(ss[a]=="comment")	var dattext  = ss[a+2];
          }
          datname=fc2s[0]+datname+fc2s[1];
          if(number){
            if(datname.match(/匿名 \((\d+)?\)/)){
              datname="匿名";
            }
          }
          var channelObject = findChannel(mychan);
          channelObject.print (name_color+datname+''+textspace+text_color+dattext+'');
        }
        be_dat=s;
}