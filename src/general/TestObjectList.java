package general;
import general.ObjectList;
import object.Account;
import object.Player;

public class TestObjectList {
    /**
     * @param args
     */
    public static void main(String[] args) {
        final ObjectList<Account> accountList = new ObjectList<>();
        ObjectList<Player> playerList = new ObjectList<>();
        ObjectList<Enemy> enemyList = new ObjectList<>();

        accountList.add(new Account(1, "Alice"));
        accountList.add(new Account(2, "Lilius"));
        accountList.add(new Account(3, "Hoiah"));
        playerList.add(new Player(1, "Bob", 5));
        playerList.add(new Player(2, "Lili", 20));
        playerList.add(new Player(3, "Duy", 10));
        enemyList.add(new Enemy(1, "Boss"));
        enemyList.add(new Enemy(2, "Slime"));

        System.out.println("=== Danh sách Account ===");
        accountList.readAll();

        System.out.println("\n=== Danh sách Player ===");
        playerList.readAll();

        System.out.println("\n=== Danh sách Enemy ===");
        enemyList.readAll();

        System.out.println("\n=== Cập nhật tên Player ===");
        playerList.update(2, "BopBop");
        playerList.readAll();

        System.out.println("\n=== Xóa Enemy ===");
        enemyList.delete(1);
        enemyList.readAll();

        int levelThreshold = 10;
        System.out.println("\n=== Hiển thị Player level >= " + levelThreshold + " ===");
        playerList.showHighLevelPlayers(levelThreshold);

    }
}
