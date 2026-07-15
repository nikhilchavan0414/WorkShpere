package com.hrms.service;

import com.hrms.dto.PayrollRequest;
import com.hrms.dto.PayrollResponse;
import com.hrms.dto.PayslipResponse;
import com.hrms.entity.Employee;
import com.hrms.entity.Payroll;
import com.hrms.entity.Payslip;
import com.hrms.entity.enums.PayrollStatus;
import com.hrms.exception.BadRequestException;
import com.hrms.exception.ResourceNotFoundException;
import com.hrms.repository.EmployeeRepository;
import com.hrms.repository.PayrollRepository;
import com.hrms.repository.PayslipRepository;
import com.hrms.util.PdfGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PayrollService {

    private final PayrollRepository payrollRepository;
    private final PayslipRepository payslipRepository;
    private final EmployeeRepository employeeRepository;
    private final PdfGenerator pdfGenerator;

    @Transactional
    public PayrollResponse create(PayrollRequest request) {
        Employee employee = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        payrollRepository.findByEmployeeIdAndMonthAndYear(
                request.getEmployeeId(), request.getMonth(), request.getYear())
                .ifPresent(p -> {
                    throw new BadRequestException("Payroll already exists for this month");
                });

        BigDecimal basic = request.getBasicSalary() != null ? request.getBasicSalary() : employee.getSalary();
        BigDecimal hra = request.getHra() != null ? request.getHra() : basic.multiply(BigDecimal.valueOf(0.4));
        BigDecimal da = request.getDa() != null ? request.getDa() : basic.multiply(BigDecimal.valueOf(0.1));
        BigDecimal bonus = request.getBonus() != null ? request.getBonus() : BigDecimal.ZERO;
        BigDecimal allowances = request.getAllowances() != null ? request.getAllowances() : BigDecimal.ZERO;
        BigDecimal pf = request.getPf() != null ? request.getPf() : basic.multiply(BigDecimal.valueOf(0.12));
        BigDecimal tax = request.getTax() != null ? request.getTax() : BigDecimal.ZERO;
        BigDecimal otherDeductions = request.getOtherDeductions() != null ? request.getOtherDeductions() : BigDecimal.ZERO;

        BigDecimal gross = basic.add(hra).add(da).add(bonus).add(allowances);
        BigDecimal net = gross.subtract(pf).subtract(tax).subtract(otherDeductions);

        Payroll payroll = Payroll.builder()
                .employee(employee)
                .month(request.getMonth())
                .year(request.getYear())
                .basicSalary(basic)
                .hra(hra)
                .da(da)
                .bonus(bonus)
                .allowances(allowances)
                .pf(pf)
                .tax(tax)
                .otherDeductions(otherDeductions)
                .grossSalary(gross)
                .netSalary(net)
                .status(PayrollStatus.PROCESSED)
                .build();

        payrollRepository.save(payroll);
        return mapToResponse(payroll);
    }

    @Transactional
    public PayslipResponse generatePayslip(Long payrollId) {
        Payroll payroll = payrollRepository.findById(payrollId)
                .orElseThrow(() -> new ResourceNotFoundException("Payroll not found"));

        payslipRepository.findByPayrollId(payrollId).ifPresent(p -> {
            throw new BadRequestException("Payslip already generated");
        });

        String payslipNumber = "PS-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        String pdfPath = pdfGenerator.generatePayslip(payroll, payslipNumber);

        Payslip payslip = Payslip.builder()
                .payroll(payroll)
                .employee(payroll.getEmployee())
                .payslipNumber(payslipNumber)
                .month(payroll.getMonth())
                .year(payroll.getYear())
                .pdfUrl(pdfPath)
                .build();

        payslipRepository.save(payslip);
        payroll.setStatus(PayrollStatus.PAID);
        payrollRepository.save(payroll);

        return mapPayslipToResponse(payslip);
    }

    public List<PayrollResponse> getByEmployee(Long employeeId) {
        return payrollRepository.findByEmployeeId(employeeId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<PayslipResponse> getPayslipsByEmployee(Long employeeId) {
        return payslipRepository.findByEmployeeId(employeeId).stream()
                .map(this::mapPayslipToResponse)
                .collect(Collectors.toList());
    }

    public List<PayrollResponse> getByMonthYear(Integer month, Integer year) {
        return payrollRepository.findByMonthAndYear(month, year).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private PayrollResponse mapToResponse(Payroll payroll) {
        return PayrollResponse.builder()
                .id(payroll.getId())
                .employeeId(payroll.getEmployee().getId())
                .employeeName(payroll.getEmployee().getFirstName() + " " + payroll.getEmployee().getLastName())
                .month(payroll.getMonth())
                .year(payroll.getYear())
                .basicSalary(payroll.getBasicSalary())
                .hra(payroll.getHra())
                .da(payroll.getDa())
                .bonus(payroll.getBonus())
                .allowances(payroll.getAllowances())
                .pf(payroll.getPf())
                .tax(payroll.getTax())
                .otherDeductions(payroll.getOtherDeductions())
                .grossSalary(payroll.getGrossSalary())
                .netSalary(payroll.getNetSalary())
                .status(payroll.getStatus())
                .createdAt(payroll.getCreatedAt())
                .build();
    }

    private PayslipResponse mapPayslipToResponse(Payslip payslip) {
        return PayslipResponse.builder()
                .id(payslip.getId())
                .payrollId(payslip.getPayroll().getId())
                .employeeId(payslip.getEmployee().getId())
                .employeeName(payslip.getEmployee().getFirstName() + " " + payslip.getEmployee().getLastName())
                .payslipNumber(payslip.getPayslipNumber())
                .month(payslip.getMonth())
                .year(payslip.getYear())
                .pdfUrl(payslip.getPdfUrl())
                .generatedAt(payslip.getGeneratedAt())
                .build();
    }
}
