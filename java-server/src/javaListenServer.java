import java.io.*;
import java.net.*;

class javaListenServer
{
    public static void main(String args[]) throws Exception
    {
        String clientSentence;
        ServerSocket welcomeSocket = new ServerSocket(6789);
        System.out.println("listening to 6789");

        while(true)
        {
            Socket connectionSocket = welcomeSocket.accept();
            BufferedReader inFromClient =
                    new BufferedReader(new InputStreamReader(connectionSocket.getInputStream()));
            clientSentence = inFromClient.readLine();
            if(clientSentence != null) {
                System.out.println("Received: " + clientSentence);
            }

//            DataOutputStream outToClient = new DataOutputStream(connectionSocket.getOutputStream());
//            outToClient.writeBytes(capitalizedSentence);
        }
    }
}