var mychan;
var name_color;
var text_color;
var kakko=1;
var number;
var Nname;
var bb = new Array("");
var space=1;
var unko=1;
var be_dat='0000';
var color=new Array('無','黒','赤','黄緑','青緑','水色','緑','青','白','紫','茶','橙','黄','桃','薄灰','濃灰');
var conum=new Array(''  ,'01','04','09'  ,'10'  ,'11'  ,'03','12','00','06','05','07','08','13','15',  '14');
var ko=new Array('','\(','（','\[','' ,''  );
var kc=new Array('','\)','）','\]',':','：');
var fc2s=new Array(ko[kakko],kc[kakko]);
var textspace='';
var fs = new ActiveXObject( "Scripting.FileSystemObject" );
var datpath=fs.GetParentFolderName(userRootPath)+"\\posite-c\\NiconamaCommentViewer\\Nico.log";

function event::onLoad(){
	loadconfig();
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
          ss = s.split("\n");
          for(a=0;a<ss.length-1;a++){
           if(ss[a].match(/\[chat\]\:/)) mychan=RegExp.rightContext;
           if(ss[a].match(/\[kakko\]\:/)) kakko=RegExp.rightContext;
           if(ss[a].match(/\[Ncolor\]\:/)) name_color=RegExp.rightContext;
           if(ss[a].match(/\[color\]\:/)) text_color=RegExp.rightContext;
           if(ss[a].match(/\[Nname\]\:/)) Nname=RegExp.rightContext;
           if(ss[a].match(/\[Nnumber\]\:/)){
              if(RegExp.rightContext=="消す") number=true;
              else number=false;
           }
           if(ss[a].match(/\[Ninterval\]\:/)) interval=RegExp.rightContext;
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
          beme=ss[ss.length-1];
        }
        var dat=setInterval(datload,interval);
        log("ニコ生最終取得："+beme);
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
          for(a=0;a<ss.length;a++){
             sss[a] = ss[a].split("\t");
          }
          var ii=0;
          for(i=0;i<ss.length;i++){
            if(ss[i]==beme) ii=i+1;
          }
          for(i=ii;i<ss.length;i++){
            writelime(sss[i][0],sss[i][1]);
          }
          beme=ss[ss.length-1];
        }
}
var tokuNum = new Array("");
var through =false
function writelime(datname,dattext){
        if(datname=="ncv"){
              datname="ニコ生(0)";
              through=false;
        }
        else if(dattext.match(/^\/info 2/)){
              datname="ニコ生運営";
              dattext=dattext.replace(/\/info 2/,'');
              dattext=dattext.replace(/\"/g,'');
              through=false;
        }
        else if(dattext.match(/^\/koukoku show2/)){
              datname="ニコ生運営"
              dattext=s2.replace(/\/koukoku show2/,'');
              dattext=s2.replace(/\"/g,'');
              through=false;
        }
        else if(dattext.match(/^\//)){
              through=true;
        }
        else{
              through=false;
              if(number){
                datname=Nname;
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
                datname=Nname+"("+n+")";
              }
        }
        if(through==true){
            log(name_color+datname+''+textspace+text_color+dattext+'')
        }
        else{
            datname=fc2s[0]+datname+fc2s[1];
            var channelObject = findChannel(mychan);
            channelObject.print (name_color+datname+''+textspace+text_color+dattext+'');
//            if(bouyomichan) talkChat(datname, dattext);
       }
}
