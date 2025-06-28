package com.example.servingwebcontent.model;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PlayerRepository extends JpaRepository<Player, Long> {
    // Có thể thêm các phương thức tìm kiếm nếu cần
    List<Player> findByAccount_Username(String username);
    
    // Lấy nhân vật cấp cao (level >= 50)
    @Query("SELECT p FROM Player p WHERE p.level >= :minLevel ORDER BY p.level DESC")
    List<Player> findHighLevelPlayers(@Param("minLevel") int minLevel);
} 