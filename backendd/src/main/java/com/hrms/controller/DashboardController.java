package com.hrms.controller;

import com.hrms.dto.ApiResponse;
import com.hrms.dto.DashboardResponse;
import com.hrms.dto.NotificationResponse;
import com.hrms.service.DashboardService;
import com.hrms.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;
    private final NotificationService notificationService;

    @GetMapping("/api/dashboard")
    public ResponseEntity<ApiResponse<DashboardResponse>> getDashboard() {
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getDashboard()));
    }

    @GetMapping("/api/notifications")
    public ResponseEntity<ApiResponse<List<NotificationResponse>>> getNotifications() {
        return ResponseEntity.ok(ApiResponse.success(notificationService.getMyNotifications()));
    }

    @PutMapping("/api/notifications/{id}/read")
    public ResponseEntity<ApiResponse<Void>> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok(ApiResponse.success("Marked as read", null));
    }
}
