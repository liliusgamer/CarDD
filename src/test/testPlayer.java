package test;

import java.util.Scanner;
import java.util.ArrayList;
import java.util.List;
import object.Player;
import object.PlayerList;
import general.ObjectGeneral;

public class testPlayer {
    public void testEditDelete() {
        // Player p1 = new Player(101, "Knight", 0);
        // Player p2 = new Player(102, "Mage", 0);
        // Player p3 = new Player(103, "Archer", 0);

        // PlayerList pl = new PlayerList();
        // pl.addPlayer(p1);
        // pl.addPlayer(p2);
        // pl.addPlayer(p3);

        // Scanner sc = new Scanner(System.in);
        // System.out.println("Enter Player ID to edit:");
        // int id = sc.nextInt();
        // sc.nextLine(); // consume newline

        // System.out.println("Enter new name:");
        // String newName = sc.nextLine();
        // pl.editPlayer(newName, id);
        // pl.printPlayers();

        // System.out.println("Enter Player ID to delete:");
        // int delId = sc.nextInt();
        // pl.deletePlayer(delId);
        // System.out.println("After deletion:");
        // pl.printPlayers();
    }

    public void testShowHighLevelPlayers() {
        System.out.println("\n=== Testing showHighLevelPlayers ===");
        
        // Create test players with different levels
        Player p1 = new Player(101, "Knight", 15);
        Player p2 = new Player(102, "Mage", 8);
        Player p3 = new Player(103, "Archer", 20);
        Player p4 = new Player(104, "Warrior", 5);
        Player p5 = new Player(105, "Priest", 12);

        // Create a list to store players
        List<ObjectGeneral> playerList = new ArrayList<>();
        playerList.add(p1);
        playerList.add(p2);
        playerList.add(p3);
        playerList.add(p4);
        playerList.add(p5);

        // Test with different level thresholds
        System.out.println("\nPlayers with level >= 10:");
        p1.showHighLevelPlayers(playerList, 10);

        System.out.println("\nPlayers with level >= 15:");
        p1.showHighLevelPlayers(playerList, 15);

        System.out.println("\nPlayers with level >= 20:");
        p1.showHighLevelPlayers(playerList, 20);
    }
}
