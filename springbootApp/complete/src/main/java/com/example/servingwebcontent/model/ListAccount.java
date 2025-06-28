package com.example.servingwebcontent.model;
import java.util.ArrayList;

public class ListAccount {
    public void printListAccount(ArrayList<Account> listAccount){
        for(int i =0; i<listAccount.size(); i++){
            System.out.println("List account:");
            System.out.println(listAccount.get(i).getUsername());
            System.out.println(listAccount.get(i).getPassword());
        }
    }
}