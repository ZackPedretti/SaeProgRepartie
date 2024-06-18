import java.rmi.Remote;
import java.rmi.RemoteException;

public interface ServiceProxy extends Remote
{
    public String getTravaux() throws RemoteException;
    public String getEnseignements() throws RemoteException;
}
