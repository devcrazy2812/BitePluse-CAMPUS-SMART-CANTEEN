package com.smartcanteen.service;

import com.smartcanteen.domain.MenuItem;
import com.smartcanteen.dto.MenuItemRequest;
import com.smartcanteen.repo.MenuRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class MenuService {

    private final MenuRepository repository;

    public MenuService(MenuRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<MenuItem> all() {
        return repository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<MenuItem> findById(Long id) {
        return repository.findById(id);
    }

    public MenuItem create(MenuItemRequest req) {
        MenuItem item = new MenuItem(
            req.name(),
            req.category().toUpperCase(),
            req.description(),
            req.emoji() != null && !req.emoji().isBlank() ? req.emoji() : "🍽️",
            req.price(),
            req.dietaryTag() != null ? req.dietaryTag() : "VEG",
            req.prepTimeMinutes() != null ? req.prepTimeMinutes() : 10
        );
        if (req.available() != null) {
            item.available = req.available();
        }
        return repository.save(item);
    }

    public MenuItem update(Long id, MenuItemRequest req) {
        MenuItem item = repository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Menu item with ID " + id + " not found"));

        item.name = req.name();
        item.category = req.category().toUpperCase();
        item.description = req.description();
        if (req.emoji() != null && !req.emoji().isBlank()) {
            item.emoji = req.emoji();
        }
        item.price = req.price();
        if (req.available() != null) {
            item.available = req.available();
        }
        if (req.dietaryTag() != null) {
            item.dietaryTag = req.dietaryTag();
        }
        if (req.prepTimeMinutes() != null) {
            item.prepTimeMinutes = req.prepTimeMinutes();
        }
        return repository.save(item);
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new IllegalArgumentException("Menu item with ID " + id + " does not exist");
        }
        repository.deleteById(id);
    }

    public MenuItem toggleAvailability(Long id) {
        MenuItem item = repository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Menu item with ID " + id + " not found"));
        item.available = !item.available;
        return repository.save(item);
    }
}
