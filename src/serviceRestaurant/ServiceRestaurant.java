import java.rmi.Remote;
import java.rmi.RemoteException;
import java.util.HashMap;

public interface ServiceRestaurant extends Remote
{
    public String getRestaurants() throws RemoteException;
    public String reserverRestaurant(int id, String date, int nbPers) throws RemoteException;
}
