package com.hrms.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PayslipResponse {
    private Long id;
    private Long payrollId;
    private Long employeeId;
    private String employeeName;
    private String payslipNumber;
    private Integer month;
    private Integer year;
    private String pdfUrl;
    private LocalDateTime generatedAt;
}
