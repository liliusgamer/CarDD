package com.example.servingwebcontent.object;

import java.util.List;

public class Player {
    private int id;
    private String name;
    private int level;
    private int hp;
    private int maxHp;
    private int attack;
    private int defense;
    private boolean isAlive;

    public Player(int id, String name, int level) {
        this.id = id;
        this.name = name;
        this.level = level;
        this.hp = 100;
        this.maxHp = 100;
        this.attack = 10;
        this.defense = 5;
        this.isAlive = true;
    }
    
    public Player() {
        this.id = 0;
        this.name = "Unknown";
        this.level = 1;
        this.hp = 100;
        this.maxHp = 100;
        this.attack = 10;
        this.defense = 5;
        this.isAlive = true;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public int getLevel() { return level; }
    public void setLevel(int level) { this.level = level; }
    public int getHp() { return hp; }
    public void setHp(int hp) { this.hp = hp; }
    public int getMaxHp() { return maxHp; }
    public void setMaxHp(int maxHp) { this.maxHp = maxHp; }
    public int getAttack() { return attack; }
    public void setAttack(int attack) { this.attack = attack; }
    public int getDefense() { return defense; }
    public void setDefense(int defense) { this.defense = defense; }
    public boolean isAlive() { return isAlive; }
    public void setAlive(boolean alive) { this.isAlive = alive; }

    // Method tấn công mới
    public int attack(Enemy enemy) {
        if (!this.isAlive || !enemy.isAlive()) {
            return 0;
        }
        int damage = Math.max(1, this.attack - enemy.getDefense());
        enemy.takeDamage(damage);
        return damage;
    }
    public void takeDamage(int damage) {
        this.hp = Math.max(0, this.hp - damage);
        if (this.hp <= 0) {
            this.isAlive = false;
        }
    }
    public void heal(int amount) {
        this.hp = Math.min(this.maxHp, this.hp + amount);
    }
    public void levelUp() {
        this.level++;
        this.maxHp += 20;
        this.hp = this.maxHp;
        this.attack += 5;
        this.defense += 2;
    }
    public void attack(Enemy enemy, int damage) {
        System.out.println(getName() + " tấn công " + enemy.getName() + " với " + damage + " sát thương.");
        enemy.takeDamage(damage);
    }
    public void showHighLevelPlayers(List<Player> list, int levelThreshold) {
        try {
            for (Player p : list) {
                if (p.getLevel() >= levelThreshold) {
                    System.out.println(p);
                }
            }
        } catch (Exception e) {
            System.out.println("Có lỗi xảy ra khi hiển thị người chơi cấp cao: " + e.getMessage());
        }
    }
    @Override
    public String toString() {
        return "Player{" +
               "id=" + getId() +
               ", name='" + getName() + '\'' +
               ", level=" + level +
               ", hp=" + hp + "/" + maxHp +
               ", attack=" + attack +
               ", defense=" + defense +
               ", alive=" + isAlive +
               '}';
    }
}
