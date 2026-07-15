package com.hrms.repository;

import com.hrms.entity.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    Optional<Employee> findByEmployeeId(String employeeId);
    Optional<Employee> findByEmail(String email);
    Optional<Employee> findByUserId(Long userId);
    List<Employee> findByCompanyId(Long companyId);
    List<Employee> findByDepartmentId(Long departmentId);
    Page<Employee> findByCompanyId(Long companyId, Pageable pageable);

    @Query("SELECT e FROM Employee e WHERE e.company.id = :companyId AND " +
           "(LOWER(e.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(e.lastName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(e.email) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(e.employeeId) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Employee> searchByCompany(@Param("companyId") Long companyId,
                                   @Param("search") String search,
                                   Pageable pageable);

    @Query("SELECT e FROM Employee e WHERE e.company.id = :companyId AND e.department.id = :deptId")
    Page<Employee> findByCompanyAndDepartment(@Param("companyId") Long companyId,
                                              @Param("deptId") Long deptId,
                                              Pageable pageable);

    long countByCompanyId(Long companyId);
    long countByActiveTrue();
}
