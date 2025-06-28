package com.example.servingwebcontent.object;

import java.util.ArrayList;

public class Account {
    private int username;
    private String email;

    public Account(String username, String email) {
        this.username = username;
        this.email = email;
    }

    public int getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public void hienThiThongTin() {
        System.out.println("Username: " + username + ", Email: " + email);
    }

    public void DanhSachTaiKhoanDangKy(ArrayList<Account> listAccount) {
        System.out.println(" Danh sách tài khoản đã đăng ký:");
        for (Account acc : listAccount) {
            System.out.println("Username: " + acc.getUsername() + ", Email: " + acc.getEmail());
        }
    }
}
