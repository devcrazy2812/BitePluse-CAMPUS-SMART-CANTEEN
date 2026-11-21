package com.smartcanteen.repo;

import com.smartcanteen.domain.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByCustomerEmailOrderByCreatedAtDesc(String email);

    List<Order> findByStatusInOrderByCreatedAtAsc(Collection<Order.Status> statuses);

    List<Order> findAllByOrderByCreatedAtDesc();

    @Query("SELECT o.status, COUNT(o) FROM Order o GROUP BY o.status")
    List<Object[]> countByStatus();
}
