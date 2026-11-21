package com.smartcanteen.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record MenuItemRequest(
    @NotBlank(message = "Item name is required")
    @Size(min = 2, max = 100, message = "Item name must be between 2 and 100 characters")
    String name,

    @NotBlank(message = "Category is required")
    String category,

    @Size(max = 300, message = "Description cannot exceed 300 characters")
    String description,

    String emoji,

    @NotNull(message = "Price is required")
    @Min(value = 1, message = "Price must be at least ₹1")
    Integer price,

    Boolean available,

    String dietaryTag,

    Integer prepTimeMinutes
) {}
