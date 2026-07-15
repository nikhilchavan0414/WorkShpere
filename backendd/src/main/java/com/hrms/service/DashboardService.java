package com.hrms.service;

import com.hrms.dto.*;
import com.hrms.entity.User;
import com.hrms.entity.enums.AttendanceStatus;
import com.hrms.entity.enums.LeaveStatus;
import com.hrms.entity.enums.RoleName;
import com.hrms.repository.*;
import com.hrms.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final CompanyRepository companyRepository;
    private final HrManagerRepository hrManagerRepository;
    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final AttendanceRepository attendanceRepository;
    private final LeaveRequestRepository leaveRequestRepository;
    private final PayrollRepository payrollRepository;
    private final HolidayRepository holidayRepository;
    private final NotificationRepository notificationRepository;
    private final SecurityUtils securityUtils;

    public DashboardResponse getAdminDashboard() {
        LocalDate today = LocalDate.now();
        int month = today.getMonthValue();
        int year = today.getYear();

        BigDecimal monthlyPayroll = payrollRepository.getTotalPayrollForMonth(month, year);
        if (monthlyPayroll == null) monthlyPayroll = BigDecimal.ZERO;

        return DashboardResponse.builder()
                .totalCompanies(companyRepository.countByActiveTrue())
                .totalHr(hrManagerRepository.countByActiveTrue())
                .totalEmployees(employeeRepository.countByActiveTrue())
                .totalDepartments(departmentRepository.count())
                .todayAttendance(attendanceRepository.countByAttendanceDateAndStatus(today, AttendanceStatus.PRESENT)
                        + attendanceRepository.countByAttendanceDateAndStatus(today, AttendanceStatus.LATE))
                .pendingLeaveRequests(leaveRequestRepository.countByStatus(LeaveStatus.PENDING))
                .monthlyPayroll(monthlyPayroll)
                .attendanceChart(buildAttendanceChart(null))
                .leaveChart(buildLeaveChart())
                .build();
    }

    public DashboardResponse getCompanyDashboard(Long companyId) {
        LocalDate today = LocalDate.now();

        return DashboardResponse.builder()
                .totalEmployees(employeeRepository.countByCompanyId(companyId))
                .totalHr(hrManagerRepository.countByCompanyId(companyId))
                .totalDepartments(departmentRepository.countByCompanyId(companyId))
                .todayAttendance(attendanceRepository.countByCompanyAndDate(companyId, today))
                .pendingLeaveRequests(leaveRequestRepository.findByCompanyIdAndStatus(companyId, LeaveStatus.PENDING).size())
                .monthlyPayroll(payrollRepository.getTotalPayrollForCompanyAndMonth(companyId, today.getMonthValue(), today.getYear()))
                .upcomingHolidays(holidayRepository.findByCompanyIdAndHolidayDateBetween(
                        companyId, today, today.plusMonths(3)).stream()
                        .map(h -> HolidayResponse.builder()
                                .id(h.getId())
                                .name(h.getName())
                                .holidayDate(h.getHolidayDate())
                                .description(h.getDescription())
                                .build())
                        .toList())
                .build();
    }

    public DashboardResponse getEmployeeDashboard(Long employeeId, Long companyId) {
        User user = securityUtils.getCurrentUser();
        LocalDate today = LocalDate.now();

        return DashboardResponse.builder()
                .upcomingHolidays(holidayRepository.findByCompanyIdAndHolidayDateBetween(
                        companyId, today, today.plusMonths(3)).stream()
                        .map(h -> HolidayResponse.builder()
                                .id(h.getId())
                                .name(h.getName())
                                .holidayDate(h.getHolidayDate())
                                .build())
                        .toList())
                .recentNotifications(notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                        .stream().limit(5)
                        .map(n -> NotificationResponse.builder()
                                .id(n.getId())
                                .title(n.getTitle())
                                .message(n.getMessage())
                                .type(n.getType())
                                .readStatus(n.getReadStatus())
                                .createdAt(n.getCreatedAt())
                                .build())
                        .toList())
                .build();
    }

    public DashboardResponse getDashboard() {
        User user = securityUtils.getCurrentUser();
        RoleName role = user.getRole().getName();

        return switch (role) {
            case ADMIN -> getAdminDashboard();
            case COMPANY -> {
                Long companyId = companyRepository.findByUserId(user.getId())
                        .map(c -> c.getId()).orElse(null);
                yield companyId != null ? getCompanyDashboard(companyId) : getAdminDashboard();
            }
            case HR -> {
                Long companyId = hrManagerRepository.findByUserId(user.getId())
                        .map(h -> h.getCompany().getId()).orElse(null);
                yield companyId != null ? getCompanyDashboard(companyId) : DashboardResponse.builder().build();
            }
            case EMPLOYEE -> {
                var emp = employeeRepository.findByUserId(user.getId()).orElse(null);
                if (emp != null) {
                    yield getEmployeeDashboard(emp.getId(), emp.getCompany().getId());
                }
                yield DashboardResponse.builder().build();
            }
        };
    }

    private List<ChartData> buildAttendanceChart(Long companyId) {
        List<ChartData> chart = new ArrayList<>();
        LocalDate today = LocalDate.now();
        for (int i = 6; i >= 0; i--) {
            LocalDate date = today.minusDays(i);
            long count = companyId != null
                    ? attendanceRepository.countByCompanyAndDate(companyId, date)
                    : attendanceRepository.countByAttendanceDateAndStatus(date, AttendanceStatus.PRESENT)
                    + attendanceRepository.countByAttendanceDateAndStatus(date, AttendanceStatus.LATE);
            chart.add(ChartData.builder().label(date.toString()).value(count).build());
        }
        return chart;
    }

    private List<ChartData> buildLeaveChart() {
        List<ChartData> chart = new ArrayList<>();
        chart.add(ChartData.builder().label("Pending").value(leaveRequestRepository.countByStatus(LeaveStatus.PENDING)).build());
        chart.add(ChartData.builder().label("Approved").value(leaveRequestRepository.countByStatus(LeaveStatus.APPROVED)).build());
        chart.add(ChartData.builder().label("Rejected").value(leaveRequestRepository.countByStatus(LeaveStatus.REJECTED)).build());
        return chart;
    }
}
