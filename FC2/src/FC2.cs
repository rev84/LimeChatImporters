using System;
using System.IO;
using System.Net;
using System.Net.Sockets;
using System.Collections.Generic;
using Newtonsoft.Json;

public class Fc2Getter
{
    public static void Main()
    {
        IPAddress myIP = IPAddress.Parse("127.0.0.1");
        IPEndPoint myIpEndPoint = new IPEndPoint(myIP, 8888);
        IPEndPoint myIpEndPoint0 = new IPEndPoint(myIP, 843);

        System.Text.Encoding enc = System.Text.Encoding.UTF8;
        int resSize = 0;
        byte[] resBytes = new byte[2048];
        string resMsg;

        int commentNo = 0;
        Queue<string> messages = new Queue<string>(510);

        System.Net.Sockets.TcpListener listener0 = new System.Net.Sockets.TcpListener(myIpEndPoint0);
        try
        {
            listener0.Start();
            Console.WriteLine(
                "Listenを開始しました({0}:{1})。",
                ((IPEndPoint)listener0.LocalEndpoint).Address,
                ((IPEndPoint)listener0.LocalEndpoint).Port
            );
            System.Net.Sockets.TcpClient client0 = listener0.AcceptTcpClient();
            Console.WriteLine(
                "クライアント({0}:{1})と接続しました。",
                ((IPEndPoint)client0.Client.RemoteEndPoint).Address,
                ((IPEndPoint)client0.Client.RemoteEndPoint).Port
            );
            System.Net.Sockets.NetworkStream ns0 = client0.GetStream();

            while (ns0.CanRead)
            {
                resSize = ns0.Read(resBytes, 0, resBytes.Length);
                if (resSize != 0)
                {
                    System.IO.MemoryStream ms0 = new System.IO.MemoryStream();
                    ms0.Write(resBytes, 0, resSize);
                    resMsg = enc.GetString(ms0.GetBuffer(), 0, (int)ms0.Length);
                    ms0.Close();
                    bool policyFileNeeded = false;
                    if (resMsg.Substring(0, 22) == "<policy-file-request/>")
                    {
                        System.Diagnostics.Debug.WriteLine("Policy File Sent");
                        Console.WriteLine("Policy File Sent");
                        //<?xml version=\"1.0\"?><!DOCTYPE cross-domain-policy SYSTEM \"http://www.adobe.com/xml/dtds/cross-domain-policy.dtd\">
                        string sendMsg = "<cross-domain-policy><allow-access-from domain=\"*\"to-ports=\"8888\"/></cross-domain-policy>";
                        //文字列をByte型配列に変換
                        byte[] sendBytes = enc.GetBytes(sendMsg + '\n');
                        //データを送信する
                        ns0.Write(sendBytes, 0, sendBytes.Length);
                        Console.WriteLine(sendMsg);
                        policyFileNeeded = true;
                        break;
                    }
                    if (!policyFileNeeded)
                    {
                        Console.WriteLine("Data Received: " + resMsg);
                    }
                }
            }
            ns0.Close();
            client0.Close();
            listener0.Stop();
        }
        catch
        {
            Console.WriteLine("ポートは既に開いています");
        }

        System.Net.Sockets.TcpListener listener = new System.Net.Sockets.TcpListener(myIpEndPoint);
        listener.Start();
        Console.WriteLine(
            "Listenを開始しました({0}:{1})。",
            ((IPEndPoint)listener.LocalEndpoint).Address,
            ((IPEndPoint)listener.LocalEndpoint).Port
        );

        System.Net.Sockets.TcpClient client = listener.AcceptTcpClient();
        Console.WriteLine(
            "クライアント({0}:{1})と接続しました。",
            ((IPEndPoint)client.Client.RemoteEndPoint).Address,
            ((IPEndPoint)client.Client.RemoteEndPoint).Port
        );

        System.Net.Sockets.NetworkStream ns = client.GetStream();
        resMsg = "[";//複数チャットに対応
        do
        {
            resSize = ns.Read(resBytes, 0, resBytes.Length);
            if (resSize != 0) {
                System.IO.MemoryStream ms = new System.IO.MemoryStream();
                ms.Write(resBytes, 0, resSize);
                resMsg += enc.GetString(ms.GetBuffer(), 0, (int)ms.Length);
                ms.Close();

                Console.WriteLine("{0}", resMsg);
                resMsg = resMsg.Replace("\n","");//\nを排除
                resMsg = resMsg.Replace("\t","");//\tを排除
                resMsg = resMsg.Replace("}{", "},{");//複数チャットに対応
                try
                {
                    List<items> list = JsonConvert.DeserializeObject<List<items>>(resMsg + "]");
                    foreach (var item in list)
                    {
                        commentNo++;
                        string v;
                        if (item.tip_point != "")
                        {
                            v = commentNo.ToString() + "\t" + item.time + "\t" + item.username + "\t" + item.comment + "\t" + item.tip_point;
                        }
                        else
                        {
                            v = commentNo.ToString() + "\t" + item.time + "\t" + item.username + "\t" + item.comment;
                        }
                        messages.Enqueue(v);
                        if (messages.Count > 500)
                        {
                            messages.Dequeue();
                        }
                    }
                    resMsg = "[";//複数チャットに対応
                    try
                    {
                        System.IO.StreamWriter sw = new System.IO.StreamWriter(@"FC2.log", false, System.Text.Encoding.GetEncoding("utf-8"));
                        sw.Write(string.Join("\n", messages.ToArray()));
                        sw.Close();
                    }
                    catch (Exception e)
                    {
                        Console.WriteLine("System.IO.StreamWriter: " + e.ToString());
                    }
                }
                catch
                {
                    Console.WriteLine("{0}", "次を読み込みます");
                }
            }
        } while(true);
    }
    public class items
    {
        public string time { get; set; }
        public string username { get; set; }
        public string comment { get; set; }
        public string tip_point { get; set; }
    }
}



