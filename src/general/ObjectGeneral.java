package general;

public class ObjectGeneral {
    protected int id;
    public String name;

    public ObjectGeneral(int id, String name) {
        this.id = id;
        this.name = name;
    }

    public int getId() { return id; }
    public String getName() { return name; }

    public void setId(int id) { this.id = id; }
    public void setName(String name) { this.name = name; }

    @Override
    public String toString() {
        return "ID: " + id + ", Name: " + name;
    }
}
