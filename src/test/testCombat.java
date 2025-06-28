package test;

import object.Player;
import object.Enemy;

public class testCombat {
    public static void testCombat() {
        Player player = new Player(1, "Chiến Binh", 5);
        Enemy enemy = new Enemy(101, "Quái Vật", 40);

        System.out.println("Trận chiến bắt đầu!");

        int turn = 1;
        while (enemy.isAlive()) {
            System.out.println("Lượt " + turn + ":");
            player.attack(enemy, 12); // Mỗi lượt gây 12 sát thương
            turn++;
        }

        System.out.println("Trận chiến kết thúc!");
    }

    public static void main(String[] args) {
        testCombat();
    }
}
