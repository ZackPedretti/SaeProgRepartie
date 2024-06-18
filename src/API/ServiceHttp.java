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
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Set;

public class ServiceHttp {
    public static void main(String[] args) throws IOException {
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
    static class MyHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            // Réponse simple en texte brut
            String response = "";
            if ("GET".equalsIgnoreCase(exchange.getRequestMethod())) {
                String path = exchange.getRequestURI().getPath();
                switch (path) {
                    case "/favicon.ico":
                        return;
                    case "/restaurant":
                        response = getRestaurant();
                        System.out.println(response);
                        break;
                    case "/travaux":
                        response = getTravaux();
                        System.out.println(response);
                        break;
                    case "/enseignement":
                        response = getEnseignement();
                        System.out.println(response);
                        break;
                    case "/reservation":
                        String query = exchange.getRequestURI().getQuery();
                        HashMap<String, String> arguments = new HashMap<>();
                        boolean correct = true;
                        for (String param : query.split("&")) {
                            String[] entry = param.split("=");
                            if (entry.length <= 1) correct = false;
                            else arguments.put(entry[0], entry[1]);
                        }
                        Set<String> args = arguments.keySet();
                        if (!args.containsAll(new ArrayList<String>(List.of(new String[]{"id", "date", "pers"}))))
                            correct = false;
                        if (!correct) {
                            response = "Erreur, des arguments sont non-conformes";
                            exchange.sendResponseHeaders(400, response.getBytes(StandardCharsets.UTF_8).length);
                            OutputStream os = exchange.getResponseBody();
                            os.write(response.getBytes(StandardCharsets.UTF_8));
                            os.close();
                            return;
                        } else {
                            response = reserverTable(Integer.parseInt(arguments.get("id")), arguments.get("date"), Integer.parseInt(arguments.get("pers")));
                        }
                        break;

                    default:
                        System.out.println("uri : " + exchange.getRequestURI());
                        System.out.println("query : " + exchange.getRequestURI().getQuery());
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

        public String getRestaurant() {
            try {
                Registry re = LocateRegistry.getRegistry("localhost", 3505);
                ServiceRestaurant sr = (ServiceRestaurant) re.lookup("restaurant");
                return sr.getRestaurants();
            } catch (RemoteException e) {
                System.out.println("Impossible de trouver la machine à cette adresse.");
                e.printStackTrace();
            } catch (NotBoundException e) {
                System.out.println("Le service n'existe pas.");
                e.printStackTrace();
            }
            return "Erreur";
        }

        public String reserverTable(int idRest, String date, int nbPlace) {
            try {
                Registry re = LocateRegistry.getRegistry("localhost", 3505);
                ServiceRestaurant sr = (ServiceRestaurant) re.lookup("restaurant");
                return sr.reserverRestaurant(idRest, date, nbPlace);
            } catch (RemoteException e) {
                System.out.println("Impossible de trouver la machine à cette adresse.");
                e.printStackTrace();
            } catch (NotBoundException e) {
                System.out.println("Le service n'existe pas.");
                e.printStackTrace();
            }
            return "Erreur";
        }

        public String getTravaux() {
            try {
                Registry re = LocateRegistry.getRegistry("localhost", 3005);
                ServiceProxy sp = (ServiceProxy) re.lookup("travaux");
                return sp.getTravaux();
            } catch (RemoteException e) {
                System.out.println("Impossible de trouver la machine à cette adresse.");
                e.printStackTrace();
            } catch (NotBoundException e) {
                System.out.println("Le service n'existe pas.");
                e.printStackTrace();
            }
            return "Erreur";
        }

        public String getEnseignement() {
            try {
                Registry re = LocateRegistry.getRegistry("localhost", 3005);
                ServiceProxy sp = (ServiceProxy) re.lookup("travaux");
                return sp.getEnseignements();
            } catch (RemoteException e) {
                System.out.println("Impossible de trouver la machine à cette adresse.");
                e.printStackTrace();
            } catch (NotBoundException e) {
                System.out.println("Le service n'existe pas.");
                e.printStackTrace();
            }
            return "Erreur";
        }
    }
}

