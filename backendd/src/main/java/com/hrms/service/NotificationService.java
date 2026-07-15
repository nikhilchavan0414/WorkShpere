package com.hrms.service;

import com.hrms.dto.NotificationResponse;
import com.hrms.entity.Notification;
import com.hrms.entity.User;
import com.hrms.exception.ResourceNotFoundException;
import com.hrms.repository.NotificationRepository;
import com.hrms.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final SecurityUtils securityUtils;

    public List<NotificationResponse> getMyNotifications() {
        User user = securityUtils.getCurrentUser();
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void markAsRead(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));
        notification.setReadStatus(true);
        notificationRepository.save(notification);
    }

    @Transactional
    public Notification create(User user, String title, String message, String type) {
        Notification notification = Notification.builder()
                .user(user)
                .title(title)
                .message(message)
                .type(type)
                .readStatus(false)
                .build();
        return notificationRepository.save(notification);
    }

    private NotificationResponse mapToResponse(Notification notification) {
        return NotificationResponse.builder()
                .id(notification.getId())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .type(notification.getType())
                .readStatus(notification.getReadStatus())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}
