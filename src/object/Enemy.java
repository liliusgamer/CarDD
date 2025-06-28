package com.example.servingwebcontent.object;

public class Enemy {
    private int id;
    private String name;
    private int level;
    private int hp;
    private int maxHp;
    private int attack;
    private int defense;
    private boolean isAlive;

    public Enemy(int id, String name, int hp) {
        this.id = id;
        this.name = name;
        this.hp = hp;
        this.maxHp = hp;
        this.level = 1;
        this.attack = 8;
        this.defense = 3;
        this.isAlive = true;
    }
    
    public Enemy() {
        this.id = 0;
        this.name = "Unknown";
        this.hp = 50;
        this.maxHp = 50;
        this.level = 1;
        this.attack = 8;
        this.defense = 3;
        this.isAlive = true;
    }
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public int getLevel() { return level; }
    public void setLevel(int level) { this.level = level; }
    public int getMaxHp() { return maxHp; }
    public void setMaxHp(int maxHp) { this.maxHp = maxHp; }
    public int getAttack() { return attack; }
    public void setAttack(int attack) { this.attack = attack; }
    public int getDefense() { return defense; }
    public void setDefense(int defense) { this.defense = defense; }
    public boolean isAlive() { return isAlive; }
    public void setAlive(boolean alive) { this.isAlive = alive; }
    public int getHp() { return hp; }
    public void setHp(int hp) { this.hp = hp; }

    public void takeDamage(int damage) {
        if (!isAlive) {
            System.out.println(getName() + " đã bị tiêu diệt. Không thể nhận sát thương thêm.");
            return;
        }
        this.hp = Math.max(0, this.hp - damage);
        System.out.println(getName() + " nhận " + damage + " sát thương. HP còn lại: " + hp);
        if (hp <= 0) {
            this.isAlive = false;
            System.out.println(getName() + " đã bị đánh bại!");
        }
    }
    // Method tấn công Player
    public int attack(Player player) {
        if (!this.isAlive || !player.isAlive()) {
            return 0;
        }
        int damage = Math.max(1, this.attack - player.getDefense());
        player.takeDamage(damage);
        return damage;
    }
    @Override
    public String toString() {
        return "Enemy{" +
               "id=" + getId() +
               ", name='" + getName() + '\'' +
               ", level=" + level +
               ", hp=" + hp + "/" + maxHp +
               ", attack=" + attack +
               ", defense=" + defense +
               ", isAlive=" + isAlive +
               '}';
    }
}
