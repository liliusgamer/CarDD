package object;

import java.util.ArrayList;

import Enemy;

public class EnemyList {
    ArrayList<Enemy> list = new ArrayList<>();

    public ArrayList<Enemy> addEnemy(Enemy e) {
        list.add(e);
        return list;
    }

    public ArrayList<Enemy> editEnemy(String type, int id) {
        for (Enemy e : list) {
            if (e.enemyId == id) {
                e.type = type;
            }
        }
        return list;
    }

    public ArrayList<Enemy> deleteEnemy(int id) {
        list.removeIf(e -> e.enemyId == id);
        return list;
    }

    public void printEnemies() {
        for (Enemy e : list) {
            System.out.println("Enemy ID: " + e.enemyId + " Type: " + e.type);
        }
    }
}
