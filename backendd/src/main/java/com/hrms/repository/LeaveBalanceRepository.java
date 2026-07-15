package com.hrms.repository;

import com.hrms.entity.LeaveBalance;
import com.hrms.entity.enums.LeaveType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LeaveBalanceRepository extends JpaRepository<LeaveBalance, Long> {
    List<LeaveBalance> findByEmployeeIdAndYear(Long employeeId, Integer year);
    Optional<LeaveBalance> findByEmployeeIdAndLeaveTypeAndYear(Long employeeId, LeaveType leaveType, Integer year);
}
