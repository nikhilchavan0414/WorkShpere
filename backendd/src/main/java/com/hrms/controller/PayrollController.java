package com.hrms.controller;

import com.hrms.dto.*;
import com.hrms.service.PayrollService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payroll")
@RequiredArgsConstructor
public class PayrollController {

    private final PayrollService payrollService;

    @PostMapping
    public ResponseEntity<ApiResponse<PayrollResponse>> create(@Valid @RequestBody PayrollRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Payroll created", payrollService.create(request)));
    }

    @PostMapping("/{payrollId}/payslip")
    public ResponseEntity<ApiResponse<PayslipResponse>> generatePayslip(@PathVariable Long payrollId) {
        return ResponseEntity.ok(ApiResponse.success("Payslip generated", payrollService.generatePayslip(payrollId)));
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<ApiResponse<List<PayrollResponse>>> getByEmployee(@PathVariable Long employeeId) {
        return ResponseEntity.ok(ApiResponse.success(payrollService.getByEmployee(employeeId)));
    }

    @GetMapping("/payslips/employee/{employeeId}")
    public ResponseEntity<ApiResponse<List<PayslipResponse>>> getPayslips(@PathVariable Long employeeId) {
        return ResponseEntity.ok(ApiResponse.success(payrollService.getPayslipsByEmployee(employeeId)));
    }

    @GetMapping("/month/{month}/year/{year}")
    public ResponseEntity<ApiResponse<List<PayrollResponse>>> getByMonthYear(@PathVariable Integer month,
                                                                             @PathVariable Integer year) {
        return ResponseEntity.ok(ApiResponse.success(payrollService.getByMonthYear(month, year)));
    }

    @GetMapping("/payslip/download/{payslipNumber}")
    public ResponseEntity<Resource> downloadPayslip(@PathVariable String payslipNumber) {
        String filePath = "payslips/" + payslipNumber + ".pdf";
        Resource resource = new FileSystemResource(filePath);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + payslipNumber + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(resource);
    }
}
