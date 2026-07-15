package com.hrms.repository;

import com.hrms.entity.Payroll;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface PayrollRepository extends JpaRepository<Payroll, Long> {
    Optional<Payroll> findByEmployeeIdAndMonthAndYear(Long employeeId, Integer month, Integer year);
    List<Payroll> findByEmployeeId(Long employeeId);
    List<Payroll> findByMonthAndYear(Integer month, Integer year);

    @Query("SELECT SUM(p.netSalary) FROM Payroll p WHERE p.month = :month AND p.year = :year")
    BigDecimal getTotalPayrollForMonth(@Param("month") Integer month, @Param("year") Integer year);

    @Query("SELECT SUM(p.netSalary) FROM Payroll p WHERE p.employee.company.id = :companyId AND p.month = :month AND p.year = :year")
    BigDecimal getTotalPayrollForCompanyAndMonth(@Param("companyId") Long companyId,
                                                 @Param("month") Integer month,
                                                 @Param("year") Integer year);
}
