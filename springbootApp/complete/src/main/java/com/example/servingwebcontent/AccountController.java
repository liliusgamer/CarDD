package com.example.servingwebcontent;

import com.example.servingwebcontent.model.Account;
import com.example.servingwebcontent.model.AccountRepository;
import com.example.servingwebcontent.model.Player;
import com.example.servingwebcontent.model.PlayerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.ui.Model;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;

@Controller
public class AccountController {
    @Autowired
    private AccountRepository accountRepository;
    
    @Autowired
    private PlayerRepository playerRepository;

    // Trang chủ (index)
    @GetMapping("/")
    public String homePage() {
        return "redirect:/index.html";
    }

    // Trang đăng nhập
    @GetMapping("/login")
    public String loginPage() {
        return "login";
    }

    // Trang đăng ký
    @GetMapping("/register")
    public String registerPage() {
        return "register";
    }

    // Xử lý đăng nhập
    @PostMapping("/login")
    public String login(@RequestParam("username") String username, @RequestParam("password") String password, Model model) {
        if (username.equals("admin") && password.equals("admin123")) {
            return "redirect:/admin/accounts";
        }
        Account acc = accountRepository.findByUsername(username);
        if (acc != null && acc.getPassword().equals(password)) {
            model.addAttribute("username", username);
            return "game";
        }
        model.addAttribute("error", "Sai tên đăng nhập hoặc mật khẩu");
        return "login";
    }

    // Xử lý đăng ký
    @PostMapping("/register")
    public String register(@RequestParam("new-username") String newUsername, @RequestParam("new-password") String newPassword, Model model) {
        if (accountRepository.findByUsername(newUsername) != null) {
            model.addAttribute("error", "Tài khoản đã tồn tại");
            return "register";
        }
        Account newAcc = new Account();
        newAcc.setUsername(newUsername);
        newAcc.setPassword(newPassword);
        accountRepository.save(newAcc);
        model.addAttribute("success", "Đăng ký thành công!");
        return "register";
    }

    // Trang quản lý tài khoản (chỉ cho admin)
    @GetMapping("/admin/accounts")
    public String listAccounts(Model model) {
        try {
            // Lấy danh sách tài khoản
            List<Account> accounts = accountRepository.findAll();
            model.addAttribute("accounts", accounts);
            
            // Lấy danh sách nhân vật cấp cao (level >= 50) sử dụng query tối ưu
            List<Player> highLevelPlayers = playerRepository.findHighLevelPlayers(50);
            model.addAttribute("highLevelPlayers", highLevelPlayers);
            
        } catch (Exception e) {
            e.printStackTrace();
            model.addAttribute("error", "Lỗi khi tải dữ liệu: " + e.getMessage());
        }
        return "accounts";
    }

    // Trang thêm tài khoản mới (admin)
    @GetMapping("/admin/accounts/add")
    public String addAccountPage() {
        return "add-account";
    }

    // Xử lý thêm tài khoản mới (admin)
    @PostMapping("/admin/accounts/add")
    public String addAccount(@RequestParam("username") String username, @RequestParam("password") String password, Model model) {
        if (accountRepository.findByUsername(username) != null) {
            model.addAttribute("error", "Tài khoản đã tồn tại");
            return "add-account";
        }
        Account acc = new Account();
        acc.setUsername(username);
        acc.setPassword(password);
        accountRepository.save(acc);
        return "redirect:/admin/accounts";
    }

    // Trang sửa tài khoản (admin)
    @GetMapping("/admin/accounts/edit")
    public String editAccountPage(@RequestParam("username") String username, Model model) {
        Account acc = accountRepository.findByUsername(username);
        if (acc != null) {
            model.addAttribute("account", acc);
        }
        return "edit-account";
    }

    // Xử lý cập nhật tài khoản (admin)
    @PostMapping("/admin/accounts/edit")
    public String editAccount(@RequestParam("old-username") String oldUsername, @RequestParam("username") String username, @RequestParam("password") String password, Model model) {
        Account acc = accountRepository.findByUsername(oldUsername);
        if (acc != null) {
            acc.setUsername(username);
            acc.setPassword(password);
            accountRepository.save(acc);
        }
        return "redirect:/admin/accounts";
    }

    // Xử lý xóa tài khoản (admin)
    @PostMapping("/admin/accounts/delete")
    public String deleteAccount(@RequestParam("username") String username, RedirectAttributes redirectAttributes) {
        try {
            Account acc = accountRepository.findByUsername(username);
            if (acc != null) {
                accountRepository.delete(acc);
                redirectAttributes.addFlashAttribute("success", "Xoá tài khoản thành công!");
            } else {
                redirectAttributes.addFlashAttribute("error", "Không tìm thấy tài khoản để xoá!");
            }
        } catch (Exception e) {
            e.printStackTrace();
            redirectAttributes.addFlashAttribute("error", "Xoá tài khoản thất bại!");
        }
        return "redirect:/admin/accounts";
    }
}
