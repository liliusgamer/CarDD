package com.example.servingwebcontent.model;

import java.util.ArrayList;

public class ObjectList<T extends ObjectGeneral> {
    private ArrayList<T> list = new ArrayList<>();

    // CREATE
    public void add(T obj) {
        list.add(obj);
    }

    // READ
    public void printAll() {
        for (T obj : list) {
            System.out.println("ID: " + obj.getId() + ", Name: " + obj.getName());
        }
    }

    // UPDATE
    public boolean update(String id, String newName) {
        for (T obj : list) {
            if (obj.getId().equals(id)) {
                obj.setName(newName);
                return true;
            }
        }
        return false;
    }

    // DELETE
    public boolean delete(String id) {
        return list.removeIf(obj -> obj.getId().equals(id));
    }

    public ArrayList<T> getList() {
        return list;
    }
}
