package com.hrms.controller;

import com.hrms.dto.ApiResponse;
import com.hrms.dto.EmployeeRequest;
import com.hrms.dto.EmployeeResponse;
import com.hrms.dto.PageResponse;
import com.hrms.service.EmployeeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService employeeService;

    @PostMapping
    public ResponseEntity<ApiResponse<EmployeeResponse>> create(@Valid @RequestBody EmployeeRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Employee created", employeeService.create(request)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<EmployeeResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(employeeService.getAll()));
    }

    @GetMapping("/company/{companyId}")
    public ResponseEntity<ApiResponse<PageResponse<EmployeeResponse>>> getByCompany(
            @PathVariable Long companyId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long departmentId) {
        return ResponseEntity.ok(ApiResponse.success(
                employeeService.getByCompany(companyId, page, size, search, departmentId)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<EmployeeResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(employeeService.getById(id)));
    }

    @GetMapping("/profile/me")
    public ResponseEntity<ApiResponse<EmployeeResponse>> getMyProfile(@RequestParam Long userId) {
        return ResponseEntity.ok(ApiResponse.success(employeeService.getByUserId(userId)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<EmployeeResponse>> update(@PathVariable Long id,
                                                                @Valid @RequestBody EmployeeRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Employee updated", employeeService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        employeeService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Employee deactivated", null));
    }
}
