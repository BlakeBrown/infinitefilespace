import java.io.*;
import java.net.*;
import com.dropbox.core.*;
import java.io.*;
import java.util.HashMap;
import java.util.Locale;

class javaListenServer
{
    private static final String APP_KEY = "urwnqx6tzbbcjt2";
    private static final String APP_SECRET = "n58eo3lw6rs0mx9";

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


            // TODO fix this array splitting stuff
//            testClient(clientSentence);
//            testClient(inFromClient.readLine());
            testClient("beautifulcat4@mailinator.com Octoplus2100");
            testClient("browngorilla9@mailinator.com Octoplus2100");
            testClient("redrabbit249@fang.ws Octoplus2100");


//            DataOutputStream outToClient = new DataOutputStream(connectionSocket.getOutputStream());
//            outToClient.writeBytes(capitalizedSentence);

            // now send a message back to the Node server to say that we're ready for another thing

        }
    }

    public static void testClient(String clientSentence) throws Exception {
        if(clientSentence != null) {
                System.out.println("Received: " + clientSentence);
//                System.out.println(inFromClient.readLine());
            int space = clientSentence.indexOf(' ');
            String username = clientSentence.substring(0, space);
            String password = clientSentence.substring(space + 1, clientSentence.length());
            HashMap<DbxClient, String> map = setupAccount(username, password);

            System.out.println("map: "+map);

            Object[] array = map.keySet().toArray();

            System.out.println("array: "+array);

            DbxClient client = (DbxClient)array[0];
            System.out.println("client: "+client);

            DbxEntry.WithChildren listing = client.getMetadataWithChildren("/");
            System.out.println("Files in the root path:");
            for (DbxEntry child : listing.children) {
                System.out.println("	" + child.name + ": " + child.toString());
            }

            String accessToken = map.get(client);

            System.out.println("accessToken: "+accessToken);

            File inputFile = new File("hello-world.txt");
            FileInputStream inputStream = new FileInputStream(inputFile);
            try {
                DbxEntry.File uploadedFile = client.uploadFile("/magnum-opus.txt",
                        DbxWriteMode.add(), inputFile.length(), inputStream);
                System.out.println("Uploaded: " + uploadedFile.toString());
            } finally {
                inputStream.close();
            }

            System.out.print("\n\n\n\n");
        }
    }

    public static HashMap<DbxClient, String> setupAccount(String username, String password) throws IOException, DbxException {
        DbxAppInfo appInfo = new DbxAppInfo(APP_KEY, APP_SECRET);
        DbxRequestConfig config = new DbxRequestConfig(
                "JavaTutorial/1.0", Locale.getDefault().toString());
        DbxWebAuthNoRedirect webAuth = new DbxWebAuthNoRedirect(config, appInfo);

        // Have the user sign in and authorize your app.
        String authorizeUrl = webAuth.start();
        System.out.println("1. Go to: " + authorizeUrl);
        System.out.println("2. Click \"Allow\" (you might have to log in first)");
        // TODO maybe automate stuff with your username and password (Roger?)
        System.out.println("3. Copy the authorization code.");
        // TODO automate getting the authentication code?
        String code = new BufferedReader(new InputStreamReader(System.in)).readLine().trim();

        DbxAuthFinish authFinish = webAuth.finish(code);
        String accessToken = authFinish.accessToken;

        DbxClient client = new DbxClient(config, accessToken);
        System.out.println("Linked account: " + client.getAccountInfo().displayName+ " accessToken: "+accessToken);
        HashMap<DbxClient, String> map = new HashMap<DbxClient,String>();
        map.put(client, accessToken);
        return map;
    }
}