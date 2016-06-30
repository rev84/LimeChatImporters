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

        System.Text.Encoding enc = System.Text.Encoding.UTF8;
        
        int commentNo = 0;
        Queue<string> messages = new Queue<string>(510);

        while (ns.CanRead) {
            int resSize = 0;
            byte[] resBytes = new byte[2048];
            System.IO.MemoryStream ms = new System.IO.MemoryStream();

            do {
               resSize = ns.Read(resBytes, 0, resBytes.Length);
               ms.Write(resBytes, 0, resSize);

            } while (ns.DataAvailable);

            string resMsg = enc.GetString(ms.GetBuffer(), 0, (int)ms.Length);
            resMsg = resMsg.TrimEnd('\n');
            Dictionary<string, string> dic = JsonConvert.DeserializeObject<Dictionary<string, string>>(resMsg);
            bool isContainTip = dic.ContainsKey("tip_username");
            commentNo++;
            if (isContainTip) {
                resMsg = commentNo.ToString() + "\t" + dic["username"].Replace("\t", " ") + "\t" + dic["comment"].Replace("\t", " ") + "\t" + "1";
            }
            else {
                resMsg = commentNo.ToString() + "\t" + dic["username"].Replace("\t", " ") + "\t" + dic["comment"].Replace("\t", " ") + "\t" + "0";
            }
            ms.Close();
            messages.Enqueue(resMsg);
            if (messages.Count > 500) {
                messages.Dequeue();
            }
            try {
                System.IO.StreamWriter sw = new System.IO.StreamWriter(@"FC2.log", false, System.Text.Encoding.GetEncoding("utf-8"));
                sw.Write(string.Join("\n", messages.ToArray()));
                sw.Close();
            } catch (Exception e) {
                Console.WriteLine("System.IO.StreamWriter: "+e.ToString());
            }
            Console.WriteLine("{0}", resMsg);
        }
    }
}



