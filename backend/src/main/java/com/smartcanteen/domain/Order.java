package com.smartcanteen.domain;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "canteen_orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @Column(nullable = false, length = 50)
    public String orderNumber; // e.g. BP-1042

    @Column(nullable = false, length = 50)
    public String pickupSlot;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    public Status status = Status.NEW;

    @Column(nullable = false)
    public Integer total = 0;

    @Column(nullable = false, length = 1000)
    public String itemSummary;

    @Column(nullable = false, length = 120)
    public String customerEmail;

    @Column(nullable = false)
    public Instant createdAt = Instant.now();

    public Order() {
        this.orderNumber = "BP-" + (1000 + (int)(Math.random() * 9000));
    }

    public enum Status {
        NEW,
        ON_STOVE,
        READY,
        PICKED_UP,
        CANCELLED
    }
}
