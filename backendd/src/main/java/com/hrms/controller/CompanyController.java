package com.hrms.controller;

import com.hrms.dto.ApiResponse;
import com.hrms.dto.CompanyRequest;
import com.hrms.dto.CompanyResponse;
import com.hrms.service.CompanyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/companies")
@RequiredArgsConstructor
public class CompanyController {

    private final CompanyService companyService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<CompanyResponse>> register(@Valid @RequestBody CompanyRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Company registered", companyService.register(request)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CompanyResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(companyService.getAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CompanyResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(companyService.getById(id)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CompanyResponse>> update(@PathVariable Long id,
                                                               @Valid @RequestBody CompanyRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Company updated", companyService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        companyService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Company deleted", null));
    }
}
