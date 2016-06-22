using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Plugin;
using System.Windows.Forms;


namespace NCVoutput
{
    public class Class1 : IPlugin
    {
        Queue<string> messages = new Queue<string>(510);

        private IPluginHost _host = null;
        private Form1 _form = null;

        #region IPlugin メンバ

        /// <summary>
        /// IsAutoRunがtrueの場合、アプリケーション起動時に自動実行される
        /// </summary>
        public void AutoRun()
        {
            //throw new NotImplementedException();
            Run();
        }
 
        /// <summary>
        /// プラグインの説明
        /// </summary>
        public string Description
        {
            //get { throw new NotImplementedException(); }
            get { return "コメントを書き出します（500件まで）";}
        }

        /// <summary>
        /// プラグインのホスト
        /// </summary>
        public IPluginHost Host
        {
            get
            {
                //throw new NotImplementedException();
                return this._host;
            }
            set
            {
                //throw new NotImplementedException();
                this._host = value;
            }
        }
 
        /// <summary>
        /// アプリケーション起動時にプラグインを自動実行するかどうか
        /// </summary>
        public bool IsAutoRun
        {
            //get { throw new NotImplementedException(); }
            get { return true; }
        }
 
        /// <summary>
        /// プラグインの名前
        /// </summary>
        public string Name
        {
            //get { throw new NotImplementedException(); }
            get { return "NCVログ書き出しプラグイン"; }
        }
 
        /// <summary>
        /// プログインを実行する
        /// </summary>
        public void Run()
        {
            //放送接続イベントハンドラ追加
            _host.BroadcastConnected += new BroadcastConnectedEventHandler(_host_BroadcastConnected);
            //放送切断イベントハンドラ追加
            _host.BroadcastDisConnected += new BroadcastDisConnectedEventHandler(_host_BroadcastDisConnected);
            //コメント受信時のイベントハンドラ追加
            _host.ReceivedComment += new ReceivedCommentEventHandler(_host_ReceivedComment);
            //throw new NotImplementedException();
        }
        //放送接続時イベントハンドラ
        void _host_BroadcastConnected(object sender, EventArgs e)
        {
            Output("ncv" + "\t" + "放送に接続しました");
        }

        //放送切断時イベントハンドラ
        void _host_BroadcastDisConnected(object sender, EventArgs e)
        {
            Output("ncv" + "\t" + "放送が切断しました");
        }

        //コメント受信時イベントハンドラ
        void _host_ReceivedComment(object sender, ReceivedCommentEventArgs e)
        {
            //受信したコメント数を取り出す
            int count = e.CommentDataList.Count;
            if (count == 0)
            {
                return;
            }
            //最新のコメントデータを取り出す
            NicoLibrary.NicoLiveData.LiveCommentData commentData = e.CommentDataList[count - 1];
            //コメント文字列を取り出す
            string comment = commentData.Comment;
            string UserId = commentData.UserId;
            string resMsg = UserId + "\t" + comment;
            Output(resMsg);
        }
        void Output(string resMsg)
        {
            messages.Enqueue(resMsg);
            if (messages.Count > 500)
            {
                messages.Dequeue();
            }
            try
            {
                System.IO.StreamWriter sw = new System.IO.StreamWriter(@"nico.log", false);
                sw.Write(string.Join("\n", messages.ToArray()));
                sw.Close();
            }
            catch            { }

        }
        /// <summary>
        /// プラグインのバージョン
        /// </summary>
        public string Version
        {
            //get { throw new NotImplementedException(); }
            get { return "1.0"; }
        }
        #endregion
    }
}
