package com.example.servingwebcontent.model;

import jakarta.persistence.*;

@Entity
@Table(name = "players")
public class Player {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private int level;
    
    private int hp;
    private int maxHp;
    private int attack;
    private int defense;
    private boolean isAlive;

    private String avatar;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = true)
    private Account account;

    // Constructor
    public Player() {
        this.hp = 100;
        this.maxHp = 100;
        this.attack = 10;
        this.defense = 5;
        this.isAlive = true;
        this.level = 1;
    }

    // Method tấn công
    public int attack(Enemy enemy) {
        if (!this.isAlive || !enemy.isAlive()) {
            return 0;
        }
        
        // Tính sát thương = attack - defense của enemy
        int damage = Math.max(1, this.attack - enemy.getDefense());
        
        // Trừ máu enemy
        enemy.takeDamage(damage);
        
        return damage;
    }
    
    // Method nhận sát thương
    public void takeDamage(int damage) {
        this.hp = Math.max(0, this.hp - damage);
        if (this.hp <= 0) {
            this.isAlive = false;
        }
    }
    
    // Method hồi máu
    public void heal(int amount) {
        this.hp = Math.min(this.maxHp, this.hp + amount);
    }
    
    // Method lên cấp
    public void levelUp() {
        this.level++;
        this.maxHp += 20;
        this.hp = this.maxHp; // Hồi đầy máu khi lên cấp
        this.attack += 5;
        this.defense += 2;
    }

    // getters/setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public int getLevel() { return level; }
    public void setLevel(int level) { this.level = level; }
    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }
    public Account getAccount() { return account; }
    public void setAccount(Account account) { this.account = account; }
    
    // Getters/setters cho thuộc tính mới
    public int getHp() { return hp; }
    public void setHp(int hp) { this.hp = hp; }
    public int getMaxHp() { return maxHp; }
    public void setMaxHp(int maxHp) { this.maxHp = maxHp; }
    public int getAttack() { return attack; }
    public void setAttack(int attack) { this.attack = attack; }
    public int getDefense() { return defense; }
    public void setDefense(int defense) { this.defense = defense; }
    public boolean isAlive() { return isAlive; }
    public void setAlive(boolean alive) { isAlive = alive; }
} 