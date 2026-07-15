package com.hrms.dto;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardResponse {
    private long totalCompanies;
    private long totalHr;
    private long totalEmployees;
    private long totalDepartments;
    private long todayAttendance;
    private long pendingLeaveRequests;
    private BigDecimal monthlyPayroll;
    private List<ChartData> attendanceChart;
    private List<ChartData> leaveChart;
    private List<HolidayResponse> upcomingHolidays;
    private List<NotificationResponse> recentNotifications;
}
