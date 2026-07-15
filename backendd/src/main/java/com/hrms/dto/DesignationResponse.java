package com.hrms.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DesignationResponse {
    private Long id;
    private String title;
    private String description;
    private Long companyId;
    private String companyName;
    private Boolean active;
    private LocalDateTime createdAt;
}
