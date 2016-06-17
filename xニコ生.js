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
           if(ss[a].match(/\[Ncolor\]\:/)) name_color=RegExp.rightContext;
           if(ss[a].match(/\[color\]\:/)) text_color=RegExp.rightContext;
           if(ss[a].match(/\[Nlog\]\:/)) datpath=RegExp.rightContext;
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
         var dat=setInterval(datload,interval);
       }
}

function datload() {
        var file = openFile(datpath);
        var ss = file.ReadAll();
        file.close();
        var lines = ss.split(/\n/);
        for(var i = 0; i < lines.length; i++){
            var line = lines[i];
            if(i==0) var s1=line;
            if(i==1) var s2=line;
            if(i==2) var s3=line;
        }
        if(s2){
          if(s2.match(/COMMENT=\//)){
            if(s2.match(/COMMENT=\/info 2/)){
              s1="ニコ生運営";
              s2=s2.replace(/\/info 2/,'');
              s2=s2.replace(/\"/g,'');
            }
            else if(s2.match(/COMMENT=\/koukoku show2/)){
              s1="ニコ生運営"
              s2=s2.replace(/\/koukoku show2/,'');
              s2=s2.replace(/\"/g,'');
            }
            else{
              s2=be_dat;
            }
          }
          if(s2!=be_dat){
            dattext=s2.replace(/COMMENT=/,'');
            dattext=dattext.replace(/_EndComment/,'');
            var ggg=0;
            for(i=0;i<bb.length;i++){
              if(bb[i]==s3){
               datname=i;
               ggg=1;
              }
            }
            if(ggg==0){
              datname=bb.length;
              bb[bb.length]=s3;
            }
            if(s1=="ニコ生運営"){
              datname=fc2s[0]+s1+fc2s[1];
            }
            else{
              if(number) datname=fc2s[0]+Nname+fc2s[1];
              else datname=fc2s[0]+Nname+"("+datname+")"+fc2s[1];
            }
            var channelObject = findChannel(mychan);
            channelObject.print (name_color+datname+''+textspace+text_color+dattext+'');
          }
          be_dat=s2;
        }
}