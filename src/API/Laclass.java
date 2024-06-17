
import java.rmi.NotBoundException;
import java.rmi.RemoteException;
import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;
import java.rmi.server.UnicastRemoteObject;

public class Laclass
{
    public static void main(String[] args)
    {
        try{
            Registry re = LocateRegistry.getRegistry("localhost", 1099);
            ServiceTravaux sr = (ServiceTravaux) re.lookup("travaux");
            System.out.println(sr.getTravaux());
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
        System.out.println("Errer");
    }
}

