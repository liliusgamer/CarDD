package object;

import java.util.ArrayList;

public class HienThiTaiKhoan {

    Account acc;

    public void DanhSachTaiKhoanDangKy(ArrayList<Account> listAccount) {
        System.out.println(" Danh sách tài khoản đã đăng ký:");
        for (Account acc : listAccount) {
            System.out.println("Username: " + acc.getUsername() + ", Email: " + acc.getEmail());
        }
    }
}
