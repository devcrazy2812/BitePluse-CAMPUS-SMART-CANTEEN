package com.smartcanteen.domain;

import jakarta.persistence.*;

@Entity
@Table(name = "menu_items")
public class MenuItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @Column(nullable = false, length = 120)
    public String name;

    @Column(nullable = false, length = 50)
    public String category; // MEALS, SNACKS, BEVERAGES, DESSERTS

    @Column(length = 300)
    public String description;

    @Column(length = 20)
    public String emoji;

    @Column(nullable = false)
    public Integer price;

    @Column(nullable = false)
    public boolean available = true;

    @Column(length = 30)
    public String dietaryTag = "VEG"; // VEG, NON_VEG, VEGAN

    public Integer prepTimeMinutes = 10;

    public MenuItem() {}

    public MenuItem(String name, String category, String description, String emoji, Integer price) {
        this.name = name;
        this.category = category;
        this.description = description;
        this.emoji = emoji;
        this.price = price;
        this.available = true;
    }

    public MenuItem(String name, String category, String description, String emoji, Integer price, String dietaryTag, Integer prepTimeMinutes) {
        this(name, category, description, emoji, price);
        this.dietaryTag = dietaryTag;
        this.prepTimeMinutes = prepTimeMinutes;
    }
}
