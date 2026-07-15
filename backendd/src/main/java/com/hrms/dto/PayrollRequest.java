package com.hrms.dto;

import com.hrms.entity.enums.PayrollStatus;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PayrollRequest {
    private Long employeeId;
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
}
