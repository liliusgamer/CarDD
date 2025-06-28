package com.example.servingwebcontent;

import com.example.servingwebcontent.model.Player;
import com.example.servingwebcontent.model.PlayerRepository;
import com.example.servingwebcontent.model.Enemy;
import com.example.servingwebcontent.model.EnemyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PathVariable;
import java.util.List;
import java.util.Optional;

@Controller
public class GameController {
    @Autowired
    private PlayerRepository playerRepository;
    
    @Autowired
    private EnemyRepository enemyRepository;

    @GetMapping("/choose-character")
    public String chooseCharacterPage(@RequestParam("username") String username, Model model) {
        List<Player> players = playerRepository.findAll();
        model.addAttribute("players", players);
        model.addAttribute("username", username);
        return "choose-character";
    }
    
    @GetMapping("/attack/{playerId}")
    public String attackPage(@PathVariable Long playerId, Model model) {
        Optional<Player> playerOpt = playerRepository.findById(playerId);
        if (!playerOpt.isPresent()) {
            model.addAttribute("error", "Không tìm thấy Player!");
            return "error";
        }
        
        Player player = playerOpt.get();
        List<Enemy> enemies = enemyRepository.findAll();
        
        if (enemies.isEmpty()) {
            model.addAttribute("error", "Không có Enemy nào để tấn công!");
            return "error";
        }
        
        // Chọn enemy đầu tiên làm mặc định
        Enemy enemy = enemies.get(0);
        
        model.addAttribute("player", player);
        model.addAttribute("enemy", enemy);
        return "attack";
    }
    
    @PostMapping("/attack/{playerId}/{enemyId}")
    public String performAttack(@PathVariable Long playerId, 
                               @PathVariable Long enemyId, 
                               Model model) {
        Optional<Player> playerOpt = playerRepository.findById(playerId);
        Optional<Enemy> enemyOpt = enemyRepository.findById(enemyId);
        
        if (!playerOpt.isPresent() || !enemyOpt.isPresent()) {
            model.addAttribute("error", "Không tìm thấy Player hoặc Enemy!");
            return "error";
        }
        
        Player player = playerOpt.get();
        Enemy enemy = enemyOpt.get();
        
        // Thực hiện tấn công
        int damage = player.attack(enemy);
        
        // Lưu trạng thái mới
        playerRepository.save(player);
        enemyRepository.save(enemy);
        
        model.addAttribute("player", player);
        model.addAttribute("enemy", enemy);
        model.addAttribute("damage", damage);
        
        return "attack";
    }
} 