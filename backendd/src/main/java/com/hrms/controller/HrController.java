package com.hrms.controller;

import com.hrms.dto.*;
import com.hrms.service.DepartmentService;
import com.hrms.service.DesignationService;
import com.hrms.service.HrManagerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hr")
@RequiredArgsConstructor
public class HrController {

    private final HrManagerService hrManagerService;
    private final DepartmentService departmentService;
    private final DesignationService designationService;

    @PostMapping("/managers")
    public ResponseEntity<ApiResponse<HrManagerResponse>> createHr(@Valid @RequestBody HrManagerRequest request) {
        return ResponseEntity.ok(ApiResponse.success("HR Manager created", hrManagerService.create(request)));
    }

    @GetMapping("/managers")
    public ResponseEntity<ApiResponse<List<HrManagerResponse>>> getAllHr() {
        return ResponseEntity.ok(ApiResponse.success(hrManagerService.getAll()));
    }

    @GetMapping("/managers/company/{companyId}")
    public ResponseEntity<ApiResponse<List<HrManagerResponse>>> getHrByCompany(@PathVariable Long companyId) {
        return ResponseEntity.ok(ApiResponse.success(hrManagerService.getByCompany(companyId)));
    }

    @DeleteMapping("/managers/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteHr(@PathVariable Long id) {
        hrManagerService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("HR Manager deleted", null));
    }

    @PostMapping("/departments")
    public ResponseEntity<ApiResponse<DepartmentResponse>> createDepartment(@Valid @RequestBody DepartmentRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Department created", departmentService.create(request)));
    }

    @GetMapping("/departments/company/{companyId}")
    public ResponseEntity<ApiResponse<List<DepartmentResponse>>> getDepartments(@PathVariable Long companyId) {
        return ResponseEntity.ok(ApiResponse.success(departmentService.getByCompany(companyId)));
    }

    @PutMapping("/departments/{id}")
    public ResponseEntity<ApiResponse<DepartmentResponse>> updateDepartment(@PathVariable Long id,
                                                                              @Valid @RequestBody DepartmentRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Department updated", departmentService.update(id, request)));
    }

    @DeleteMapping("/departments/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteDepartment(@PathVariable Long id) {
        departmentService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Department deleted", null));
    }

    @PostMapping("/designations")
    public ResponseEntity<ApiResponse<DesignationResponse>> createDesignation(@Valid @RequestBody DesignationRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Designation created", designationService.create(request)));
    }

    @GetMapping("/designations/company/{companyId}")
    public ResponseEntity<ApiResponse<List<DesignationResponse>>> getDesignations(@PathVariable Long companyId) {
        return ResponseEntity.ok(ApiResponse.success(designationService.getByCompany(companyId)));
    }

    @PutMapping("/designations/{id}")
    public ResponseEntity<ApiResponse<DesignationResponse>> updateDesignation(@PathVariable Long id,
                                                                                @Valid @RequestBody DesignationRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Designation updated", designationService.update(id, request)));
    }

    @DeleteMapping("/designations/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteDesignation(@PathVariable Long id) {
        designationService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Designation deleted", null));
    }
}
