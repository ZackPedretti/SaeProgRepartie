import java.rmi.Remote;
import java.rmi.RemoteException;

public interface ServiceTravaux extends Remote
{
    public String getTravaux() throws RemoteException;
}
