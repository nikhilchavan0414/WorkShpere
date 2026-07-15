package com.hrms.controller;

import com.hrms.dto.*;
import com.hrms.service.LeaveService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/leaves")
@RequiredArgsConstructor
public class LeaveController {

    private final LeaveService leaveService;

    @PostMapping("/apply")
    public ResponseEntity<ApiResponse<LeaveResponse>> apply(@Valid @RequestBody LeaveRequestDto request) {
        return ResponseEntity.ok(ApiResponse.success("Leave applied", leaveService.applyLeave(request)));
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<ApiResponse<LeaveResponse>> approve(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Leave approved", leaveService.approveLeave(id)));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<ApiResponse<LeaveResponse>> reject(@PathVariable Long id,
                                                             @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(ApiResponse.success("Leave rejected",
                leaveService.rejectLeave(id, body.get("reason"))));
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<ApiResponse<List<LeaveResponse>>> getByEmployee(@PathVariable Long employeeId) {
        return ResponseEntity.ok(ApiResponse.success(leaveService.getByEmployee(employeeId)));
    }

    @GetMapping("/company/{companyId}")
    public ResponseEntity<ApiResponse<List<LeaveResponse>>> getByCompany(@PathVariable Long companyId) {
        return ResponseEntity.ok(ApiResponse.success(leaveService.getByCompany(companyId)));
    }

    @GetMapping("/pending")
    public ResponseEntity<ApiResponse<List<LeaveResponse>>> getPending() {
        return ResponseEntity.ok(ApiResponse.success(leaveService.getPending()));
    }

    @GetMapping("/balance/{employeeId}")
    public ResponseEntity<ApiResponse<List<LeaveBalanceResponse>>> getBalance(
            @PathVariable Long employeeId,
            @RequestParam(required = false) Integer year) {
        return ResponseEntity.ok(ApiResponse.success(leaveService.getLeaveBalances(employeeId, year)));
    }
}
