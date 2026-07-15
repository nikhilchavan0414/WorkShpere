package com.hrms.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DepartmentResponse {
    private Long id;
    private String name;
    private String description;
    private Long companyId;
    private String companyName;
    private Boolean active;
    private LocalDateTime createdAt;
}
