# 概要

FC2、ニコ生、YoutubeLiveのチャットの内容を、LimeChatに流せるツール。

# 動作環境

Windows版の[LimeChat](http://limechat.net/)が動作する環境。  
Windows7(64bit)でのみ動作確認済み。

# 使い方

1. ダウンロード後のファイルを、LimeChatのスクリプトフォルダに展開。  
    - （ただし「.gitignore」「README.md」「LICENSE.BSD」はなくてよい）
1. 「xSetting.txt」の内容をうまく設定する。    
1. LimeChatのメニュー「設定」→「スクリプトの設定」を選択、「xNico.js」「xYoutube.js」「xFC2.js」の好きなものを好きなだけ◯入れる。  

# ソイソース醤油からの注意

壊れたぁって場合は設定ファイルを再ダウンロードしてみてください。

# 使用ライブラリの著作権表示

このソフトウェアには[phantomjs](http://phantomjs.org/)を使用しています。  
©Copyright 2010-2016 Ariya Hidayat  

このソフトウェアには[Json.NET](http://www.newtonsoft.com/json)を使用しています。  
Copyright (c) 2007 James Newton-King  

# 開発者

- Revin([@rev84](https://twitter.com/rev84))
   - youtubeディレクトリ以下のスクリプト（phantomjs除く）、FC2_revin.cs、README.md
- ソイソース醤油([@soysource](https://twitter.com/soysource))
   - 上記以外のスクリプト、プログラム

# ライセンス

このソフトウェアは修正BSDライセンスで配布します。

# 連携に用いる他のソフトウェア

- NiconamaCommentViewer
   - http://www.posite-c.com/application/ncv/

- 棒読みちゃん
   - http://chi.usamimi.info/Program/Application/BouyomiChan/