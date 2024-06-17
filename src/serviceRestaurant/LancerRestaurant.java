import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;
import java.rmi.server.UnicastRemoteObject;
import java.sql.*;
import java.util.HashMap;
import java.rmi.RemoteException;

public class LancerRestaurant implements ServiceRestaurant
{

    Connection c = this.connecterBD();
    public  String getRestaurants() throws RemoteException
    {
        StringBuilder sb = new StringBuilder("{\n\t\"Restaurants\": \n\t[\n");
        try
        {
            PreparedStatement st = c.prepareStatement("SELECT * FROM RESTAURANT");
            ResultSet rs = st.executeQuery();
            while (rs.next())
            {
                sb.append("\t\t{\n");
                sb.append("\t\t\t\"id\": "+rs.getInt(1)+",\n");
                sb.append("\t\t\t\"nom\": \""+rs.getString(2)+"\",\n");
                sb.append("\t\t\t\"adresse\": \""+rs.getString(3)+"\",\n");
                sb.append("\t\t\t\"code postal\": "+rs.getInt(4)+",\n");
                sb.append("\t\t\t\"lon\": "+rs.getDouble(5)+",\n");
                sb.append("\t\t\t\"lat\": "+rs.getDouble(6)+"\n");
                if (!rs.isLast()) sb.append("\t\t},\n");
                else sb.append("\t\t}\n");
            }
            sb.append("\t]\n}");
        } catch (SQLException e)
        {
            throw new RuntimeException(e);
        }

        return sb.toString();
    }

    public String reserverRestaurant(int id, String date, int nbPers) throws RemoteException
    {
        return "";
    }

    private Connection connecterBD()
    {
        Connection connection;
        try (BufferedReader bf = new BufferedReader(new FileReader("../../documents/logins.txt")))
        {
            String user = bf.readLine();
            String password = bf.readLine();
            Class.forName("com.mysql.cj.jdbc.Driver");
            System.out.println("Driver loaded");
            String url = "jdbc:mysql://webetu.iutnc.univ-lorraine.fr/laheurt31u";
            connection = DriverManager.getConnection(url, user, password);
            System.out.println("Connexion réussie");
            connection.setAutoCommit(false);

        } catch (SQLException e)
        {
            System.out.println(e.getMessage());
            throw new Error("un probeme est arrive lors de la connexion");
        } catch (ClassNotFoundException e)
        {
            e.printStackTrace();
            throw new Error("un probeme est arrive lors de la connexion");
        } catch (IOException e)
        {
            e.printStackTrace();
            throw new Error("un probeme est arrive lors de la connexion");
        }
        return connection;
    }

    public static void main(String[] args)
    {
        try
        {
            Registry re = LocateRegistry.createRegistry(3505);
            ServiceRestaurant sr = new LancerRestaurant();
            sr = (ServiceRestaurant) UnicastRemoteObject.exportObject(sr, 0);
            re.rebind("restaurant", sr);
            System.out.println("Service lancé");
        } catch (RemoteException e)
        {
            e.printStackTrace();
        }
    }
}
