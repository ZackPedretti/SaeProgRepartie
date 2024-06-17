import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;
import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.rmi.NotBoundException;
import java.rmi.RemoteException;
import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;

public class ServiceHttp
{
    public static void main(String[] args) throws IOException
    {
        // Création du serveur HTTP sur le port 8000
        HttpServer server = HttpServer.create(new InetSocketAddress("0.0.0.0", 8000), 0);

        // Définir le contexte pour la route "/"
        server.createContext("/", new MyHandler());

        // Démarrer le serveur
        server.setExecutor(null); // utilise un exécuteur par défaut
        server.start();

        System.out.println("Serveur démarré sur le port 8000");
    }

    // Classe de gestionnaire pour traiter les requêtes
    static class MyHandler implements HttpHandler
    {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            // Réponse simple en texte brut
            String response = "";
            if ("GET".equalsIgnoreCase(exchange.getRequestMethod())) {
                String path = exchange.getRequestURI().getPath();
                switch(path)
                {
                    case "/favicon.ico":
                        return;
                    case "/restaurant" :
                        response = getRestaurant();
                        System.out.println(response);
                        break;
                    case "/travaux" :
                        response = getTravaux();
                        System.out.println(response);
                        break;
                    default:
                        System.out.println("uri : "+exchange.getRequestURI());
                        System.out.println("query : "+exchange.getRequestURI().getQuery());
                        break;
                }
            }
		System.out.println(response);
            exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
            exchange.getResponseHeaders().set("Content-Type", "application/json; charset=UTF-8");
            exchange.sendResponseHeaders(200, response.getBytes(StandardCharsets.UTF_8).length);
            OutputStream os = exchange.getResponseBody();
            os.write(response.getBytes(StandardCharsets.UTF_8));
            os.close();
        }

        public String getRestaurant()
        {
            try{
                Registry re = LocateRegistry.getRegistry("localhost", 3505);
                ServiceRestaurant sr = (ServiceRestaurant) re.lookup("restaurant");
                return sr.getRestaurants();
            }
            catch(RemoteException e)
            {
                System.out.println("Impossible de trouver la machine à cette adresse.");
                e.printStackTrace();
            }
            catch(NotBoundException e){
                System.out.println("Le service n'existe pas.");
                e.printStackTrace();
            }
            return "Erreur";
        }

        public String getTravaux()
        {
            try{
                Registry re = LocateRegistry.getRegistry("localhost", 3005);
                ServiceTravaux sr = (ServiceTravaux) re.lookup("travaux");
                return sr.getTravaux();
            }
            catch(RemoteException e)
            {
                System.out.println("Impossible de trouver la machine à cette adresse.");
                e.printStackTrace();
            }
            catch(NotBoundException e){
                System.out.println("Le service n'existe pas.");
                e.printStackTrace();
            }
            return "Erreur";
        }
    }
}

