package com.hrms.repository;

import com.hrms.entity.HrManager;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HrManagerRepository extends JpaRepository<HrManager, Long> {
    List<HrManager> findByCompanyId(Long companyId);
    Optional<HrManager> findByUserId(Long userId);
    Optional<HrManager> findByEmail(String email);
    long countByCompanyId(Long companyId);
    long countByActiveTrue();
}
