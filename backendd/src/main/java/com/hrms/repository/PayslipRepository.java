package com.hrms.repository;

import com.hrms.entity.Payslip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PayslipRepository extends JpaRepository<Payslip, Long> {
    List<Payslip> findByEmployeeId(Long employeeId);
    Optional<Payslip> findByPayrollId(Long payrollId);
}
