package general;
import java.util.ArrayList;

import object.Player;

public class ObjectList<T extends ObjectGeneral> {
    private ArrayList<T> list = new ArrayList<>();

    // CREATE
    public void add(T obj) {
        try {
            list.add(obj);
        } catch (Exception e) {
            System.out.println("Lỗi khi thêm đối tượng: " + e.getMessage());
        }
    }

    // READ
    public void readAll() {
        try {
            for (T obj : list) {
                System.out.println(obj);
            }
        } catch (Exception e) {
            System.out.println("Lỗi khi đọc danh sách: " + e.getMessage());
        }
    }

    // UPDATE
    public void update(int id, String newName) {
        try {
            for (T obj : list) {
                if (obj.getId() == id) {
                    obj.setName(newName);
                    System.out.println("Đã cập nhật tên.");
                    return;
                }
            }
            System.out.println("Không tìm thấy ID.");
        } catch (Exception e) {
            System.out.println("Lỗi khi cập nhật: " + e.getMessage());
        }
    }

    // DELETE
    public void delete(int id) {
        try {
            for (int i = 0; i < list.size(); i++) {
                if (list.get(i).getId() == id) {
                    list.remove(i);
                    System.out.println("Đã xóa.");
                    return;
                }
            }
            System.out.println("Không tìm thấy ID.");
        } catch (Exception e) {
            System.out.println("Lỗi khi xóa: " + e.getMessage());
        }
    }

    public void showHighLevelPlayers(int levelThreshold) {
    for (ObjectGeneral obj : list) {
        if (obj instanceof Player) {
            Player p = (Player) obj;
            if (p.getLevel() >= levelThreshold) {
                System.out.println(p);
                }
            }
        }
    }

}
