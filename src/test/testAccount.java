package test;

import object.Account;
import object.AccountList;
import object.HienThiTaiKhoan;

public class testAccount {
    public static void main(String[] args) {
        AccountList ql = new AccountList();
        ql.themTaiKhoan(new Account("user1", "user1@example.com"));
        ql.themTaiKhoan(new Account("user2", "user2@example.com"));
        ql.themTaiKhoan(new Account("admin", "admin@example.com"));

        HienThiTaiKhoan hienThi = new HienThiTaiKhoan();
        hienThi.DanhSachTaiKhoanDangKy(ql.getDanhSachTaiKhoan());
    }
}
