package com.smartcanteen.dto;

import com.smartcanteen.domain.Order;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public class OrderRequests {

    public record OrderItemRequest(
        @NotNull(message = "Menu item ID is required")
        Long menuItemId,

        @NotNull(message = "Quantity is required")
        @Min(value = 1, message = "Quantity must be at least 1")
        @Max(value = 20, message = "Quantity cannot exceed 20")
        Integer quantity
    ) {}

    public record CreateOrderRequest(
        @NotBlank(message = "Pickup slot is required")
        String pickupSlot,

        @NotEmpty(message = "Order must contain at least one item")
        List<OrderItemRequest> items
    ) {}

    public record StatusChangeRequest(
        @NotNull(message = "Status is required")
        Order.Status status
    ) {}
}
