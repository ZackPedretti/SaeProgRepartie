import java.net.HttpURLConnection;
import java.net.SocketTimeoutException;
import java.net.URL;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.rmi.RemoteException;
import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;
import java.rmi.server.UnicastRemoteObject;

public class LancerTravaux implements ServiceTravaux
{
    public String getTravaux() throws RemoteException
    {
        try {
            URL url = new URL("https://carto.g-ny.org/data/cifs/cifs_waze_v2.json");
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setConnectTimeout(5000);
            conn.connect();
            System.out.println("Connexion établie");

            int responsecode = conn.getResponseCode();
            if (responsecode != 200) {
                throw new RuntimeException("HttpResponseCode: " + responsecode);
            } else {
                BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
                String inputLine;
                StringBuffer content = new StringBuffer();
                while ((inputLine = in.readLine()) != null) {
                    content.append(inputLine);
                }
                in.close();
                conn.disconnect();
                return content.toString();
            }
        } catch (SocketTimeoutException e) {
            throw new RemoteException("L'url ne répond pas");
        } catch (Exception e) {
            throw new RemoteException("Erreur lors de la récupération des travaux", e);
        }
    }

    public static void main(String[] args)
    {
        try
        {
            Registry re = LocateRegistry.createRegistry(3005);
            ServiceTravaux st = new LancerTravaux();
            st = (ServiceTravaux) UnicastRemoteObject.exportObject(st, 0);
            re.rebind("travaux", st);
            System.out.println("Service lancé");
            System.out.println(st.getTravaux());
        } catch (RemoteException e)
        {
            e.printStackTrace();
        }

    }
}