package com.example.servingwebcontent;

import com.example.servingwebcontent.model.Enemy;
import com.example.servingwebcontent.model.EnemyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/admin/enemies")
public class EnemyController {
    @Autowired
    private EnemyRepository enemyRepository;

    @GetMapping
    public String listEnemies(Model model) {
        model.addAttribute("enemies", enemyRepository.findAll());
        return "enemies";
    }

    @GetMapping("/add")
    public String addEnemyPage() {
        return "add-enemy";
    }

    @PostMapping("/add")
    public String addEnemy(@RequestParam("name") String name, @RequestParam("level") int level, @RequestParam("damage") int damage) {
        Enemy enemy = new Enemy();
        enemy.setName(name);
        enemy.setLevel(level);
        enemy.setDamage(damage);
        enemyRepository.save(enemy);
        return "redirect:/admin/enemies";
    }

    @GetMapping("/edit")
    public String editEnemyPage(@RequestParam("id") Long id, Model model) {
        Enemy enemy = enemyRepository.findById(id).orElse(null);
        model.addAttribute("enemy", enemy);
        return "edit-enemy";
    }

    @PostMapping("/edit")
    public String editEnemy(@RequestParam("id") Long id, @RequestParam("name") String name, @RequestParam("level") int level, @RequestParam("damage") int damage) {
        Enemy enemy = enemyRepository.findById(id).orElse(null);
        if (enemy != null) {
            enemy.setName(name);
            enemy.setLevel(level);
            enemy.setDamage(damage);
            enemyRepository.save(enemy);
        }
        return "redirect:/admin/enemies";
    }

    @PostMapping("/delete")
    public String deleteEnemy(@RequestParam("id") Long id) {
        enemyRepository.deleteById(id);
        return "redirect:/admin/enemies";
    }
} 