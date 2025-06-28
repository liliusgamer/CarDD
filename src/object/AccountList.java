package object;

import java.util.ArrayList;

public class AccountList {
    private ArrayList<Account> danhSachTaiKhoan;

    public AccountList() {
        danhSachTaiKhoan = new ArrayList<>();
    }

    public void themTaiKhoan(Account acc) {
        danhSachTaiKhoan.add(acc);
    }
    public void hienThiDanhSachTaiKhoan() {
        System.out.println(" Danh sách tài khoản đã đăng ký: ");
        for (Account acc : danhSachTaiKhoan) {
            acc.hienThiThongTin();
        }
    }

    public ArrayList<Account> getDanhSachTaiKhoan() {
        return danhSachTaiKhoan;
    }
}
