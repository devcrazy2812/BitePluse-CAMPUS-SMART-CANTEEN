package com.smartcanteen.api;

import com.smartcanteen.domain.MenuItem;
import com.smartcanteen.dto.MenuItemRequest;
import com.smartcanteen.service.MenuService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu")
public class MenuController {

    private final MenuService menuService;

    public MenuController(MenuService menuService) {
        this.menuService = menuService;
    }

    @GetMapping
    public ResponseEntity<List<MenuItem>> getAllItems() {
        return ResponseEntity.ok(menuService.all());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MenuItem> getItemById(@PathVariable Long id) {
        return menuService.findById(id)
            .map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MenuItem> createItem(@Valid @RequestBody MenuItemRequest request) {
        MenuItem created = menuService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MenuItem> updateItem(
            @PathVariable Long id,
            @Valid @RequestBody MenuItemRequest request) {
        MenuItem updated = menuService.update(id, request);
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/{id}/toggle")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MenuItem> toggleAvailability(@PathVariable Long id) {
        MenuItem updated = menuService.toggleAvailability(id);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        menuService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
