package com.hrms.repository;

import com.hrms.entity.LeaveRequest;
import com.hrms.entity.enums.LeaveStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {
    List<LeaveRequest> findByEmployeeId(Long employeeId);
    List<LeaveRequest> findByStatus(LeaveStatus status);

    @Query("SELECT lr FROM LeaveRequest lr WHERE lr.employee.company.id = :companyId")
    List<LeaveRequest> findByCompanyId(@Param("companyId") Long companyId);

    @Query("SELECT lr FROM LeaveRequest lr WHERE lr.employee.company.id = :companyId AND lr.status = :status")
    List<LeaveRequest> findByCompanyIdAndStatus(@Param("companyId") Long companyId,
                                                @Param("status") LeaveStatus status);

    long countByStatus(LeaveStatus status);
}
