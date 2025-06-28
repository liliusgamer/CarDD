package com.example.servingwebcontent.model;

import jakarta.persistence.*;

@Entity
@Table(name = "enemies")
public class Enemy {
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

    private int damage;

    // Constructor
    public Enemy() {
        this.hp = 50;
        this.maxHp = 50;
        this.attack = 8;
        this.defense = 3;
        this.isAlive = true;
        this.level = 1;
    }

    // Method nhận sát thương
    public void takeDamage(int damage) {
        this.hp = Math.max(0, this.hp - damage);
        if (this.hp <= 0) {
            this.isAlive = false;
        }
    }
    
    // Method tấn công Player
    public int attack(Player player) {
        if (!this.isAlive || !player.isAlive()) {
            return 0;
        }
        
        // Tính sát thương = attack - defense của player
        int damage = Math.max(1, this.attack - player.getDefense());
        
        // Trừ máu player
        player.takeDamage(damage);
        
        return damage;
    }

    // getters/setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public int getLevel() { return level; }
    public void setLevel(int level) { this.level = level; }
    public int getDamage() { return damage; }
    public void setDamage(int damage) { this.damage = damage; }
    
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