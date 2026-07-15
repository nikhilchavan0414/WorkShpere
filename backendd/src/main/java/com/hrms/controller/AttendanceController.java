package com.hrms.controller;

import com.hrms.dto.ApiResponse;
import com.hrms.dto.AttendanceResponse;
import com.hrms.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    @PostMapping("/check-in/{employeeId}")
    public ResponseEntity<ApiResponse<AttendanceResponse>> checkIn(@PathVariable Long employeeId) {
        return ResponseEntity.ok(ApiResponse.success("Checked in", attendanceService.checkIn(employeeId)));
    }

    @PostMapping("/check-out/{employeeId}")
    public ResponseEntity<ApiResponse<AttendanceResponse>> checkOut(@PathVariable Long employeeId) {
        return ResponseEntity.ok(ApiResponse.success("Checked out", attendanceService.checkOut(employeeId)));
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<ApiResponse<List<AttendanceResponse>>> getByEmployee(
            @PathVariable Long employeeId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {
        return ResponseEntity.ok(ApiResponse.success(attendanceService.getByEmployee(employeeId, start, end)));
    }

    @GetMapping("/company/{companyId}")
    public ResponseEntity<ApiResponse<List<AttendanceResponse>>> getByCompany(
            @PathVariable Long companyId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(ApiResponse.success(attendanceService.getByCompanyAndDate(companyId, date)));
    }
}
