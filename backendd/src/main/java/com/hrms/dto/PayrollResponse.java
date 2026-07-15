package com.hrms.dto;

import com.hrms.entity.enums.PayrollStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PayrollResponse {
    private Long id;
    private Long employeeId;
    private String employeeName;
    private Integer month;
    private Integer year;
    private BigDecimal basicSalary;
    private BigDecimal hra;
    private BigDecimal da;
    private BigDecimal bonus;
    private BigDecimal allowances;
    private BigDecimal pf;
    private BigDecimal tax;
    private BigDecimal otherDeductions;
    private BigDecimal grossSalary;
    private BigDecimal netSalary;
    private PayrollStatus status;
    private LocalDateTime createdAt;
}
