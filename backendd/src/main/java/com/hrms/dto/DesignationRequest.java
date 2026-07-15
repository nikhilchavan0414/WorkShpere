package com.hrms.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DesignationRequest {
    @NotBlank(message = "Designation title is required")
    private String title;
    private String description;
    private Long companyId;
}
