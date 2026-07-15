package com.hrms.dto;

import com.hrms.entity.enums.LeaveStatus;
import com.hrms.entity.enums.LeaveType;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeaveResponse {
    private Long id;
    private Long employeeId;
    private String employeeName;
    private LeaveType leaveType;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer totalDays;
    private String reason;
    private LeaveStatus status;
    private String approvedByName;
    private LocalDateTime approvedAt;
    private String rejectionReason;
    private LocalDateTime createdAt;
}
