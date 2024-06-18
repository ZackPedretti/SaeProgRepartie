import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;
import java.rmi.server.UnicastRemoteObject;
import java.sql.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
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
            PreparedStatement st = c.prepareStatement("SELECT * FROM RESTAURANTS");
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
        int meilleureTable = 0;
        String[] datesplit = date.split("\\+")[0].split("-");
        LocalDate dateDate = LocalDate.of(Integer.parseInt(datesplit[0]), Integer.parseInt(datesplit[1]), Integer.parseInt(datesplit[2]));
        String[] heuresplit = date.split("\\+")[1].split(":");
        LocalTime heureDate = LocalTime.of(Integer.parseInt(heuresplit[0]), Integer.parseInt(heuresplit[1]));
        LocalDateTime datefinale = LocalDateTime.of(dateDate, heureDate);
        try {
            PreparedStatement recupTables = c.prepareStatement("SELECT tbl_idtbl, tbl_plc FROM TABL NATURAL JOIN RESTAURANTS WHERE tbl_plc >= ? AND rst_idrst = ? AND tbl_idtbl NOT IN (SELECT tbl_idtbl FROM TABL LEFT JOIN RESERVATION ON tbl_idtbl = rsv_idtbl WHERE rsv_dat BETWEEN ? AND ?)");
            recupTables.setInt(1, nbPers);
            recupTables.setInt(2, id);
            recupTables.setTimestamp(3, Timestamp.valueOf(datefinale.minusHours(2)));
            recupTables.setTimestamp(4, Timestamp.valueOf(datefinale.plusHours(2)));
            ResultSet resultRecupTables = recupTables.executeQuery();
            int min = Integer.MAX_VALUE;
            while (resultRecupTables.next()){
                int plc = resultRecupTables.getInt(2);
                if (plc < min){
                    min = plc;
                    meilleureTable = resultRecupTables.getInt(1);
                }
            }
            System.out.println("meilleure table : " + meilleureTable);
            System.out.println("date : " + Timestamp.valueOf(datefinale));
            System.out.println("nbpers : " + nbPers);
            PreparedStatement insererRes = c.prepareStatement("INSERT INTO RESERVATION(rsv_idtbl, rsv_dat, rsv_nbpers) VALUES (?, ?, ?)");
            insererRes.setInt(1, meilleureTable);
            insererRes.setTimestamp(2, Timestamp.valueOf(datefinale));
            insererRes.setInt(3, nbPers);
            insererRes.executeUpdate();
            c.commit();
        } catch (SQLException e) {
            return "Réservation impossible, aucune table disponible";
        }
        return "Réservation effectuée";
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
