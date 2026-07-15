package com.hrms.dto;

import com.hrms.entity.enums.AttendanceStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttendanceResponse {
    private Long id;
    private Long employeeId;
    private String employeeName;
    private LocalDate attendanceDate;
    private LocalTime checkIn;
    private LocalTime checkOut;
    private BigDecimal workingHours;
    private AttendanceStatus status;
    private Boolean lateEntry;
    private String remarks;
}
