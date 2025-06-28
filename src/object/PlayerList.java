package object;

import java.util.ArrayList;

public class PlayerList {
    ArrayList<Player> list = new ArrayList<>();

    public ArrayList<Player> addPlayer(Player p) {
        list.add(p);
        return list;
    }

    public ArrayList<Player> editPlayer(String name, int id) {
        for (Player p : list) {
            if (p.playerId == id) {
                p.name = name;
            }
        }
        return list;
    }

    public ArrayList<Player> deletePlayer(int id) {
        list.removeIf(p -> p.playerId == id);
        return list;
    }

    public void printPlayers() {
        for (Player p : list) {
            System.out.println("Player ID: " + p.playerId + " Name: " + p.name);
        }
    }
}
