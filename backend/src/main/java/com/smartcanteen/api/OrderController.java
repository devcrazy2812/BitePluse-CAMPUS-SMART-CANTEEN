package com.smartcanteen.api;

import com.smartcanteen.domain.Order;
import com.smartcanteen.dto.OrderRequests;
import com.smartcanteen.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<Order> createOrder(@Valid @RequestBody OrderRequests.CreateOrderRequest request) {
        String email = getAuthenticatedEmail();
        Order created = orderService.createOrder(email, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/my")
    public ResponseEntity<List<Order>> getMyOrders() {
        String email = getAuthenticatedEmail();
        List<Order> myOrders = orderService.getCustomerOrders(email);
        return ResponseEntity.ok(myOrders);
    }

    @GetMapping("/kitchen")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<List<Order>> getKitchenQueue() {
        List<Order> queue = orderService.getKitchenQueue();
        return ResponseEntity.ok(queue);
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<Order> updateOrderStatus(
            @PathVariable Long id,
            @Valid @RequestBody OrderRequests.StatusChangeRequest request) {
        Order updated = orderService.updateStatus(id, request.status());
        return ResponseEntity.ok(updated);
    }

    private String getAuthenticatedEmail() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }
}
