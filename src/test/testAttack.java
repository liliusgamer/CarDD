package com.example.servingwebcontent;
import com.example.servingwebcontent.object.Player;
import com.example.servingwebcontent.object.Enemy;

public class testAttack {
    public static void main(String[] args) {
        System.out.println("=== KIỂM TRA CHỨC NĂNG TẤN CÔNG ===\n");
        
        // Tạo Player và Enemy
        Player player = new Player();
        player.setName("Knight");
        player.setLevel(10);
        player.setAttack(15);
        player.setDefense(8);
        player.setHp(100);
        player.setMaxHp(100);
        
        Enemy enemy = new Enemy();
        enemy.setName("Goblin");
        enemy.setLevel(5);
        enemy.setAttack(12);
        enemy.setDefense(3);
        enemy.setHp(50);
        enemy.setMaxHp(50);
        
        // Hiển thị thông tin ban đầu
        System.out.println("=== THÔNG TIN BAN ĐẦU ===");
        System.out.println("Player: " + player.getName() + " (Level " + player.getLevel() + ")");
        System.out.println("  HP: " + player.getHp() + "/" + player.getMaxHp());
        System.out.println("  Attack: " + player.getAttack() + ", Defense: " + player.getDefense());
        System.out.println();
        
        System.out.println("Enemy: " + enemy.getName() + " (Level " + enemy.getLevel() + ")");
        System.out.println("  HP: " + enemy.getHp() + "/" + enemy.getMaxHp());
        System.out.println("  Attack: " + enemy.getAttack() + ", Defense: " + enemy.getDefense());
        System.out.println();
        
        // Thực hiện tấn công
        System.out.println("=== BẮT ĐẦU CHIẾN ĐẤU ===");
        int round = 1;
        
        while (player.isAlive() && enemy.isAlive()) {
            System.out.println("--- Vòng " + round + " ---");
            
            // Player tấn công Enemy
            int damage = player.attack(enemy);
            System.out.println(player.getName() + " tấn công " + enemy.getName() + " với " + damage + " sát thương!");
            System.out.println(enemy.getName() + " còn lại " + enemy.getHp() + "/" + enemy.getMaxHp() + " HP");
            
            if (!enemy.isAlive()) {
                System.out.println("🎉 " + enemy.getName() + " đã bị đánh bại!");
                break;
            }
            
            // Enemy tấn công Player
            int enemyDamage = enemy.attack(player);
            System.out.println(enemy.getName() + " tấn công " + player.getName() + " với " + enemyDamage + " sát thương!");
            System.out.println(player.getName() + " còn lại " + player.getHp() + "/" + player.getMaxHp() + " HP");
            
            if (!player.isAlive()) {
                System.out.println("💀 " + player.getName() + " đã bị đánh bại!");
                break;
            }
            
            System.out.println();
            round++;
        }
        
        // Kết quả cuối cùng
        System.out.println("=== KẾT QUẢ ===");
        if (player.isAlive()) {
            System.out.println("🏆 " + player.getName() + " chiến thắng!");
        } else {
            System.out.println("💀 " + enemy.getName() + " chiến thắng!");
        }
        
        System.out.println("\n=== THÔNG TIN CUỐI ===");
        System.out.println(player.getName() + ": " + player.getHp() + "/" + player.getMaxHp() + " HP, Alive: " + player.isAlive());
        System.out.println(enemy.getName() + ": " + enemy.getHp() + "/" + enemy.getMaxHp() + " HP, Alive: " + enemy.isAlive());
    }
} 