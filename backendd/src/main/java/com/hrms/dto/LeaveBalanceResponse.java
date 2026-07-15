package com.hrms.dto;

import com.hrms.entity.enums.LeaveType;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeaveBalanceResponse {
    private Long id;
    private Long employeeId;
    private LeaveType leaveType;
    private Integer totalDays;
    private Integer usedDays;
    private Integer remainingDays;
    private Integer year;
}
