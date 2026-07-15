package com.hrms.service;

import com.hrms.dto.AttendanceResponse;
import com.hrms.entity.Attendance;
import com.hrms.entity.Employee;
import com.hrms.entity.enums.AttendanceStatus;
import com.hrms.exception.BadRequestException;
import com.hrms.exception.ResourceNotFoundException;
import com.hrms.repository.AttendanceRepository;
import com.hrms.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private static final LocalTime OFFICE_START = LocalTime.of(9, 0);
    private static final LocalTime LATE_THRESHOLD = LocalTime.of(9, 30);

    private final AttendanceRepository attendanceRepository;
    private final EmployeeRepository employeeRepository;

    @Transactional
    public AttendanceResponse checkIn(Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        LocalDate today = LocalDate.now();
        Attendance attendance = attendanceRepository.findByEmployeeIdAndAttendanceDate(employeeId, today)
                .orElse(Attendance.builder()
                        .employee(employee)
                        .attendanceDate(today)
                        .build());

        if (attendance.getCheckIn() != null) {
            throw new BadRequestException("Already checked in today");
        }

        LocalTime now = LocalTime.now();
        attendance.setCheckIn(now);
        attendance.setStatus(AttendanceStatus.PRESENT);
        attendance.setLateEntry(now.isAfter(LATE_THRESHOLD));
        if (attendance.getLateEntry()) {
            attendance.setStatus(AttendanceStatus.LATE);
        }

        attendanceRepository.save(attendance);
        return mapToResponse(attendance);
    }

    @Transactional
    public AttendanceResponse checkOut(Long employeeId) {
        LocalDate today = LocalDate.now();
        Attendance attendance = attendanceRepository.findByEmployeeIdAndAttendanceDate(employeeId, today)
                .orElseThrow(() -> new BadRequestException("No check-in record found for today"));

        if (attendance.getCheckOut() != null) {
            throw new BadRequestException("Already checked out today");
        }

        LocalTime now = LocalTime.now();
        attendance.setCheckOut(now);

        if (attendance.getCheckIn() != null) {
            Duration duration = Duration.between(attendance.getCheckIn(), now);
            BigDecimal hours = BigDecimal.valueOf(duration.toMinutes())
                    .divide(BigDecimal.valueOf(60), 2, RoundingMode.HALF_UP);
            attendance.setWorkingHours(hours);
        }

        attendanceRepository.save(attendance);
        return mapToResponse(attendance);
    }

    public List<AttendanceResponse> getByEmployee(Long employeeId, LocalDate start, LocalDate end) {
        if (start == null) start = LocalDate.now().withDayOfMonth(1);
        if (end == null) end = LocalDate.now();

        return attendanceRepository.findByEmployeeIdAndAttendanceDateBetween(employeeId, start, end).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<AttendanceResponse> getByCompanyAndDate(Long companyId, LocalDate date) {
        if (date == null) date = LocalDate.now();
        return attendanceRepository.findByCompanyAndDate(companyId, date).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private AttendanceResponse mapToResponse(Attendance attendance) {
        return AttendanceResponse.builder()
                .id(attendance.getId())
                .employeeId(attendance.getEmployee().getId())
                .employeeName(attendance.getEmployee().getFirstName() + " " + attendance.getEmployee().getLastName())
                .attendanceDate(attendance.getAttendanceDate())
                .checkIn(attendance.getCheckIn())
                .checkOut(attendance.getCheckOut())
                .workingHours(attendance.getWorkingHours())
                .status(attendance.getStatus())
                .lateEntry(attendance.getLateEntry())
                .remarks(attendance.getRemarks())
                .build();
    }
}
