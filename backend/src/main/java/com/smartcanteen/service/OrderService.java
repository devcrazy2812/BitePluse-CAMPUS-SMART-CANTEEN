package com.smartcanteen.service;

import com.smartcanteen.domain.MenuItem;
import com.smartcanteen.domain.Order;
import com.smartcanteen.dto.OrderRequests;
import com.smartcanteen.repo.MenuRepository;
import com.smartcanteen.repo.OrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class OrderService {

    private final OrderRepository orderRepository;
    private final MenuRepository menuRepository;

    public OrderService(OrderRepository orderRepository, MenuRepository menuRepository) {
        this.orderRepository = orderRepository;
        this.menuRepository = menuRepository;
    }

    public Order createOrder(String customerEmail, OrderRequests.CreateOrderRequest request) {
        if (request.items() == null || request.items().isEmpty()) {
            throw new IllegalArgumentException("Cannot create an empty order");
        }

        Order order = new Order();
        order.pickupSlot = request.pickupSlot();
        order.customerEmail = customerEmail;
        order.status = Order.Status.NEW;
        order.createdAt = Instant.now();

        int runningTotal = 0;
        List<String> summaryParts = new ArrayList<>();

        for (OrderRequests.OrderItemRequest itemReq : request.items()) {
            MenuItem menuItem = menuRepository.findById(itemReq.menuItemId())
                .orElseThrow(() -> new IllegalArgumentException("Item ID " + itemReq.menuItemId() + " not found in menu"));

            if (!menuItem.available) {
                throw new IllegalArgumentException("Item '" + menuItem.name + "' is currently sold out");
            }

            int qty = itemReq.quantity() != null && itemReq.quantity() > 0 ? itemReq.quantity() : 1;
            runningTotal += menuItem.price * qty;
            summaryParts.add(menuItem.name + " x" + qty);
        }

        order.total = runningTotal;
        order.itemSummary = String.join(", ", summaryParts);

        return orderRepository.save(order);
    }

    @Transactional(readOnly = true)
    public List<Order> getCustomerOrders(String customerEmail) {
        return orderRepository.findByCustomerEmailOrderByCreatedAtDesc(customerEmail);
    }

    @Transactional(readOnly = true)
    public List<Order> getKitchenQueue() {
        return orderRepository.findByStatusInOrderByCreatedAtAsc(
            List.of(Order.Status.NEW, Order.Status.ON_STOVE, Order.Status.READY)
        );
    }

    @Transactional(readOnly = true)
    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }

    public Order updateStatus(Long orderId, Order.Status newStatus) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new IllegalArgumentException("Order with ID " + orderId + " not found"));
        order.status = newStatus;
        return orderRepository.save(order);
    }
}
