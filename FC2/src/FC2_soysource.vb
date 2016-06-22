Imports System.Text
Imports Newtonsoft.Json


Module FC2_soysource

    Sub Main()
        'ListenするIPアドレス
        Dim ipString As String = "127.0.0.1"
        Dim ipAdd As System.Net.IPAddress = System.Net.IPAddress.Parse(ipString)

        'Listenするポート番号
        Dim port As Integer = 8888
        Dim port0 As Integer = 843

        'TcpListenerオブジェクトを作成する
        Dim listener0 As New System.Net.Sockets.TcpListener(ipAdd, port0)

        Dim listener As New System.Net.Sockets.TcpListener(ipAdd, port)

        'クライアントから送られたデータを受信する
        Dim enc As System.Text.Encoding = System.Text.Encoding.UTF8
        Dim disconnected As Boolean = False
        Dim resBytes As Byte() = New Byte(255) {}
        Dim resSize As Integer = 0
        Dim chatMsg As New Queue(Of String)()

        'Listenを開始する843
        Try
            listener0.Start()

            Console.WriteLine("Listenを開始しました({0}:{1})。",
                DirectCast(listener0.LocalEndpoint, System.Net.IPEndPoint).Address,
                DirectCast(listener0.LocalEndpoint, System.Net.IPEndPoint).Port)
            '接続要求があったら受け入れる
            Dim client0 As System.Net.Sockets.TcpClient = listener0.AcceptTcpClient()
            Console.WriteLine("クライアント({0}:{1})と接続しました。",
                DirectCast(client0.Client.RemoteEndPoint, System.Net.IPEndPoint).Address,
                DirectCast(client0.Client.RemoteEndPoint, System.Net.IPEndPoint).Port)
            'NetworkStreamを取得
            Dim ns0 As System.Net.Sockets.NetworkStream = client0.GetStream()
            Do
                'データの一部を受信する
                resSize = ns0.Read(resBytes, 0, resBytes.Length)

                'Readが0を返した時はクライアントが切断したと判断
                If resSize <> 0 Then
                    '受信したデータを蓄積する
                    Dim ms0 As New System.IO.MemoryStream()
                    ms0.Write(resBytes, 0, resSize)
                    '受信したデータを文字列に変換
                    Dim resMsg As String = enc.GetString(ms0.GetBuffer(), 0, CInt(ms0.Length))
                    ms0.Close()
                    Console.WriteLine(resMsg)

                    'Send the Security Policy Data If Flash 9 Requests it
                    Dim policyFileNeeded As Boolean = False
                    If resMsg.Substring(0, 22) = "<policy-file-request/>" Then
                        Console.WriteLine("Policy File Sent")
                        '<?xml version=" & Chr(34) & "1.0" & Chr(34) & "?><!DOCTYPE cross-domain-policy SYSTEM " & Chr(34) & "http://www.adobe.com/xml/dtds/cross-domain-policy.dtd" & Chr(34) & ">
                        Dim sendMsg As String = "<cross-domain-policy><allow-access-from domain=" & Chr(34) & "*" & Chr(34) & "to-ports=" & Chr(34) & "8888" & Chr(34) & "/></cross-domain-policy>"
                        '文字列をByte型配列に変換
                        Dim sendBytes As Byte() = enc.GetBytes(sendMsg)
                        'データを送信する
                        ns0.Write(sendBytes, 0, sendBytes.Length)
                        Console.WriteLine(sendMsg)
                        policyFileNeeded = True
                        Exit Do
                    End If
                    If Not policyFileNeeded Then
                        Console.WriteLine("Data Received: " & resMsg)
                    End If
                End If
            Loop

            '閉じる
            ns0.Close()
            client0.Close()
            Console.WriteLine("クライアントとの接続を閉じました。")

            'リスナを閉じる
            listener0.Stop()
            Console.WriteLine("Listenerを閉じました。")
        Catch
            Console.WriteLine("既に127.0.0.1:843は使われています。")
        End Try

        'Listenを開始する8888
        Try
            listener.Start()

            Console.WriteLine("Listenを開始しました({0}:{1})。",
            DirectCast(listener.LocalEndpoint, System.Net.IPEndPoint).Address,
            DirectCast(listener.LocalEndpoint, System.Net.IPEndPoint).Port)
            '接続要求があったら受け入れる
            Dim client As System.Net.Sockets.TcpClient = listener.AcceptTcpClient()
            Console.WriteLine("クライアント({0}:{1})と接続しました。",
            DirectCast(client.Client.RemoteEndPoint, System.Net.IPEndPoint).Address,
            DirectCast(client.Client.RemoteEndPoint, System.Net.IPEndPoint).Port)
            'NetworkStreamを取得
            Dim ns As System.Net.Sockets.NetworkStream = client.GetStream()
            'クライアントから送られたデータを受信する
            Dim resMsg As String = ""
            Do
                'データの一部を受信する
                resSize = ns.Read(resBytes, 0, resBytes.Length)

                If resSize <> 0 Then
                    '受信したデータを蓄積する
                    Dim ms As New System.IO.MemoryStream()
                    ms.Write(resBytes, 0, resSize)
                    '受信したデータを文字列に変換
                    resMsg += enc.GetString(ms.GetBuffer(), 0, CInt(ms.Length))
                    ms.Close()
                    Debug.WriteLine(resMsg)
                    If (resMsg.IndexOf("username") > 0) Then
                        Dim jsonObj As Object = JsonConvert.DeserializeObject(resMsg)
                        Dim v As String = jsonObj("username") + vbTab + jsonObj("comment") + vbTab + jsonObj("tip_username")
                        resMsg = ""
                        chatMsg.Enqueue(v)
                        Console.WriteLine(v)
                        If (chatMsg.Count > 500) Then
                            chatMsg.Dequeue()
                        End If

                        Try
                            Dim sw As New System.IO.StreamWriter("FC2.log", False)
                            sw.Write(String.Join(vbLf, chatMsg))
                            sw.Close()
                        Catch ex As System.IO.IOException
                            System.Console.WriteLine(ex.Message)
                        Catch ex As System.UnauthorizedAccessException
                            System.Console.WriteLine(ex.Message)
                        Catch ex As System.Exception
                            '例外の説明を表示する
                            System.Console.WriteLine(ex.Message)
                        End Try
                    End If
                End If
            Loop

            '閉じる
            ns.Close()
            client.Close()
            Console.WriteLine("クライアントとの接続を閉じました。")

            'リスナを閉じる
            listener.Stop()
            Console.WriteLine("Listenerを閉じました。")
        Catch
            Console.WriteLine("既に127.0.0.1:8888は使われています。")
        End Try

    End Sub



End Module
