package com.hrms.controller;

import com.hrms.dto.ApiResponse;
import com.hrms.dto.HolidayRequest;
import com.hrms.dto.HolidayResponse;
import com.hrms.service.HolidayService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/holidays")
@RequiredArgsConstructor
public class HolidayController {

    private final HolidayService holidayService;

    @PostMapping
    public ResponseEntity<ApiResponse<HolidayResponse>> create(@Valid @RequestBody HolidayRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Holiday created", holidayService.create(request)));
    }

    @GetMapping("/company/{companyId}")
    public ResponseEntity<ApiResponse<List<HolidayResponse>>> getByCompany(@PathVariable Long companyId) {
        return ResponseEntity.ok(ApiResponse.success(holidayService.getByCompany(companyId)));
    }

    @GetMapping("/company/{companyId}/upcoming")
    public ResponseEntity<ApiResponse<List<HolidayResponse>>> getUpcoming(@PathVariable Long companyId) {
        return ResponseEntity.ok(ApiResponse.success(holidayService.getUpcoming(companyId)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<HolidayResponse>> update(@PathVariable Long id,
                                                               @Valid @RequestBody HolidayRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Holiday updated", holidayService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        holidayService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Holiday deleted", null));
    }
}
