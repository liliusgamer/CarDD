package main.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import object.Player;
import general.ObjectGeneral;
import java.util.ArrayList;
import java.util.List;

@Controller
public class PlayerController {
    private List<ObjectGeneral> playerList;

    public PlayerController() {
        // Khởi tạo danh sách người chơi mẫu
        playerList = new ArrayList<>();
        playerList.add(new Player(101, "Hiệp Sĩ", 15));
        playerList.add(new Player(102, "Pháp Sư", 8));
        playerList.add(new Player(103, "Cung Thủ", 20));
        playerList.add(new Player(104, "Chiến Binh", 5));
        playerList.add(new Player(105, "Tu Sĩ", 12));
    }

    @GetMapping("/")
    public String showPlayers(Model model) {
        model.addAttribute("playerList", playerList);
        return "players";
    }

    @PostMapping("/filter")
    public String filterPlayers(@RequestParam int levelThreshold, Model model) {
        List<Player> highLevelPlayers = new ArrayList<>();
        
        for (ObjectGeneral obj : playerList) {
            if (obj instanceof Player) {
                Player p = (Player) obj;
                if (p.getLevel() >= levelThreshold) {
                    highLevelPlayers.add(p);
                }
            }
        }
        
        model.addAttribute("highLevelPlayers", highLevelPlayers);
        model.addAttribute("levelThreshold", levelThreshold);
        model.addAttribute("playerList", playerList);
        return "players";
    }
} 