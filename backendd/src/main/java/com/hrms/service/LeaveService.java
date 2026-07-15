package com.hrms.service;

import com.hrms.dto.LeaveBalanceResponse;
import com.hrms.dto.LeaveRequestDto;
import com.hrms.dto.LeaveResponse;
import com.hrms.entity.Employee;
import com.hrms.entity.LeaveBalance;
import com.hrms.entity.LeaveRequest;
import com.hrms.entity.User;
import com.hrms.entity.enums.LeaveStatus;
import com.hrms.exception.BadRequestException;
import com.hrms.exception.ResourceNotFoundException;
import com.hrms.repository.EmployeeRepository;
import com.hrms.repository.LeaveBalanceRepository;
import com.hrms.repository.LeaveRequestRepository;
import com.hrms.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LeaveService {

    private final LeaveRequestRepository leaveRequestRepository;
    private final LeaveBalanceRepository leaveBalanceRepository;
    private final EmployeeRepository employeeRepository;
    private final SecurityUtils securityUtils;

    @Transactional
    public LeaveResponse applyLeave(LeaveRequestDto dto) {
        Employee employee = employeeRepository.findById(dto.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        if (dto.getEndDate().isBefore(dto.getStartDate())) {
            throw new BadRequestException("End date must be after start date");
        }

        int totalDays = (int) ChronoUnit.DAYS.between(dto.getStartDate(), dto.getEndDate()) + 1;

        LeaveBalance balance = leaveBalanceRepository
                .findByEmployeeIdAndLeaveTypeAndYear(dto.getEmployeeId(), dto.getLeaveType(),
                        dto.getStartDate().getYear())
                .orElseThrow(() -> new BadRequestException("Leave balance not found"));

        if (balance.getRemainingDays() < totalDays) {
            throw new BadRequestException("Insufficient leave balance");
        }

        LeaveRequest leave = LeaveRequest.builder()
                .employee(employee)
                .leaveType(dto.getLeaveType())
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .totalDays(totalDays)
                .reason(dto.getReason())
                .status(LeaveStatus.PENDING)
                .build();

        leaveRequestRepository.save(leave);
        return mapToResponse(leave);
    }

    @Transactional
    public LeaveResponse approveLeave(Long leaveId) {
        LeaveRequest leave = leaveRequestRepository.findById(leaveId)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found"));

        if (leave.getStatus() != LeaveStatus.PENDING) {
            throw new BadRequestException("Leave request is not pending");
        }

        User approver = securityUtils.getCurrentUser();
        leave.setStatus(LeaveStatus.APPROVED);
        leave.setApprovedBy(approver);
        leave.setApprovedAt(LocalDateTime.now());

        LeaveBalance balance = leaveBalanceRepository
                .findByEmployeeIdAndLeaveTypeAndYear(leave.getEmployee().getId(),
                        leave.getLeaveType(), leave.getStartDate().getYear())
                .orElseThrow(() -> new BadRequestException("Leave balance not found"));

        balance.setUsedDays(balance.getUsedDays() + leave.getTotalDays());
        balance.setRemainingDays(balance.getRemainingDays() - leave.getTotalDays());
        leaveBalanceRepository.save(balance);
        leaveRequestRepository.save(leave);

        return mapToResponse(leave);
    }

    @Transactional
    public LeaveResponse rejectLeave(Long leaveId, String reason) {
        LeaveRequest leave = leaveRequestRepository.findById(leaveId)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found"));

        User approver = securityUtils.getCurrentUser();
        leave.setStatus(LeaveStatus.REJECTED);
        leave.setApprovedBy(approver);
        leave.setApprovedAt(LocalDateTime.now());
        leave.setRejectionReason(reason);
        leaveRequestRepository.save(leave);

        return mapToResponse(leave);
    }

    public List<LeaveResponse> getByEmployee(Long employeeId) {
        return leaveRequestRepository.findByEmployeeId(employeeId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<LeaveResponse> getByCompany(Long companyId) {
        return leaveRequestRepository.findByCompanyId(companyId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<LeaveResponse> getPending() {
        return leaveRequestRepository.findByStatus(LeaveStatus.PENDING).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<LeaveBalanceResponse> getLeaveBalances(Long employeeId, Integer year) {
        if (year == null) year = java.time.Year.now().getValue();
        return leaveBalanceRepository.findByEmployeeIdAndYear(employeeId, year).stream()
                .map(b -> LeaveBalanceResponse.builder()
                        .id(b.getId())
                        .employeeId(b.getEmployee().getId())
                        .leaveType(b.getLeaveType())
                        .totalDays(b.getTotalDays())
                        .usedDays(b.getUsedDays())
                        .remainingDays(b.getRemainingDays())
                        .year(b.getYear())
                        .build())
                .collect(Collectors.toList());
    }

    private LeaveResponse mapToResponse(LeaveRequest leave) {
        return LeaveResponse.builder()
                .id(leave.getId())
                .employeeId(leave.getEmployee().getId())
                .employeeName(leave.getEmployee().getFirstName() + " " + leave.getEmployee().getLastName())
                .leaveType(leave.getLeaveType())
                .startDate(leave.getStartDate())
                .endDate(leave.getEndDate())
                .totalDays(leave.getTotalDays())
                .reason(leave.getReason())
                .status(leave.getStatus())
                .approvedByName(leave.getApprovedBy() != null ? leave.getApprovedBy().getUsername() : null)
                .approvedAt(leave.getApprovedAt())
                .rejectionReason(leave.getRejectionReason())
                .createdAt(leave.getCreatedAt())
                .build();
    }
}
