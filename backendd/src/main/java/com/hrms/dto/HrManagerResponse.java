package com.hrms.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HrManagerResponse {
    private Long id;
    private String employeeCode;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private Long companyId;
    private String companyName;
    private Boolean active;
    private LocalDateTime createdAt;
}
