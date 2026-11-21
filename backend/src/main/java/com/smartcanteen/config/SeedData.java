package com.smartcanteen.config;

import com.smartcanteen.domain.MenuItem;
import com.smartcanteen.domain.Order;
import com.smartcanteen.domain.User;
import com.smartcanteen.repo.MenuRepository;
import com.smartcanteen.repo.OrderRepository;
import com.smartcanteen.repo.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.Instant;
import java.util.List;

@Configuration
public class SeedData {

    @Bean
    public CommandLineRunner initDatabase(
            UserRepository userRepository,
            MenuRepository menuRepository,
            OrderRepository orderRepository,
            PasswordEncoder passwordEncoder) {

        return args -> {
            // Seed Demo Users if empty
            if (userRepository.count() == 0) {
                userRepository.save(new User(
                    "student@campus.test",
                    "Aarav Sharma",
                    passwordEncoder.encode("password"),
                    User.Role.STUDENT
                ));

                userRepository.save(new User(
                    "staff@campus.test",
                    "Kitchen Master Chef",
                    passwordEncoder.encode("password"),
                    User.Role.STAFF
                ));

                userRepository.save(new User(
                    "admin@campus.test",
                    "Canteen Admin",
                    passwordEncoder.encode("password"),
                    User.Role.ADMIN
                ));
            }

            // Seed Comprehensive Menu Items if empty
            if (menuRepository.count() == 0) {
                List<MenuItem> items = List.of(
                    new MenuItem(
                        "Campus Masala Bowl",
                        "MEALS",
                        "Steamed basmati, slow-simmered dal makhani, roasted spiced veggies and fresh mint chutney.",
                        "🍛",
                        85,
                        "VEG",
                        12
                    ),
                    new MenuItem(
                        "Paneer Kathi Roll",
                        "SNACKS",
                        "Char-grilled cottage cheese cubes, crisp bell peppers, and tangy mint mayo rolled in a flaky paratha.",
                        "🌯",
                        70,
                        "VEG",
                        8
                    ),
                    new MenuItem(
                        "Chilli Garlic Hakka Noodles",
                        "MEALS",
                        "Wok-tossed noodles with crunchy scallions, bell peppers, garlic crisps, and toasted sesame oil.",
                        "🍜",
                        90,
                        "VEGAN",
                        10
                    ),
                    new MenuItem(
                        "Artisan Cold Brew Coffee",
                        "BEVERAGES",
                        "14-hour slow steeped Arabica coffee poured over ice with velvety milk and dark chocolate shavings.",
                        "🧋",
                        55,
                        "VEG",
                        3
                    ),
                    new MenuItem(
                        "Fresh Alphonso Mango Cheesecake",
                        "DESSERTS",
                        "Creamy Philadelphia cheese mousse with real Ratnagiri mango compote on a buttery graham crust.",
                        "🍰",
                        95,
                        "VEG",
                        2
                    ),
                    new MenuItem(
                        "Spiced Lemon Mint Spritzer",
                        "BEVERAGES",
                        "Chilled sparkling soda with freshly squeezed lime, crushed mint leaves, and roasted black cumin salt.",
                        "🍋",
                        35,
                        "VEGAN",
                        3
                    ),
                    new MenuItem(
                        "Crispy Peri-Peri Fries Basket",
                        "SNACKS",
                        "Hand-cut golden potato fries tossed in fiery African peri-peri dust, served with garlic herb aioli.",
                        "🍟",
                        65,
                        "VEG",
                        6
                    ),
                    new MenuItem(
                        "Classic Grilled Cheese Melt",
                        "SNACKS",
                        "Triple cheddar and mozzarella blend melted between golden-buttered toasted sourdough slices.",
                        "🥪",
                        75,
                        "VEG",
                        7
                    ),
                    new MenuItem(
                        "Warm Double Fudge Brownie",
                        "DESSERTS",
                        "Dense dark chocolate brownie with melting fudge center, topped with toasted walnuts.",
                        "🍫",
                        80,
                        "VEG",
                        4
                    )
                );
                menuRepository.saveAll(items);
            }

            // Seed sample orders for live Kitchen and Admin demo if empty
            if (orderRepository.count() == 0) {
                Order order1 = new Order();
                order1.orderNumber = "BP-1041";
                order1.pickupSlot = "12:30 PM";
                order1.status = Order.Status.ON_STOVE;
                order1.total = 155;
                order1.itemSummary = "Campus Masala Bowl x1, Artisan Cold Brew Coffee x1";
                order1.customerEmail = "student@campus.test";
                order1.createdAt = Instant.now().minusSeconds(600);

                Order order2 = new Order();
                order2.orderNumber = "BP-1042";
                order2.pickupSlot = "1:00 PM";
                order2.status = Order.Status.NEW;
                order2.total = 135;
                order2.itemSummary = "Paneer Kathi Roll x1, Crispy Peri-Peri Fries Basket x1";
                order2.customerEmail = "student@campus.test";
                order2.createdAt = Instant.now().minusSeconds(180);

                Order order3 = new Order();
                order3.orderNumber = "BP-1043";
                order3.pickupSlot = "1:15 PM";
                order3.status = Order.Status.READY;
                order3.total = 175;
                order3.itemSummary = "Chilli Garlic Hakka Noodles x1, Warm Double Fudge Brownie x1";
                order3.customerEmail = "student@campus.test";
                order3.createdAt = Instant.now().minusSeconds(1200);

                orderRepository.saveAll(List.of(order1, order2, order3));
            }
        };
    }
}
