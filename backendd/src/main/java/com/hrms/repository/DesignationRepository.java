package com.hrms.repository;

import com.hrms.entity.Designation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DesignationRepository extends JpaRepository<Designation, Long> {
    List<Designation> findByCompanyId(Long companyId);
    List<Designation> findByCompanyIdAndActiveTrue(Long companyId);
}
