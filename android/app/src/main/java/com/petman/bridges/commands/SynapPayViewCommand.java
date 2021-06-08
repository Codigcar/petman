package com.petman.bridges.commands;

public enum SynapPayViewCommand {

    CREATE(1, "create"),
    CREATE_WITH_BANKS(2, "createWithBanks"),
    CONFIGURE(3, "configure"),
    PAY(4, "pay");

    private int id;
    private String name;

    SynapPayViewCommand(int id, String name) {
        this.id = id;
        this.name = name;
    }

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

}
