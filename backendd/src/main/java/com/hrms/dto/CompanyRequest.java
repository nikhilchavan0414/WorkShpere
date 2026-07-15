package com.hrms.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompanyRequest {
    @NotBlank(message = "Company name is required")
    private String name;

    @NotBlank(message = "Email is required")
    @Email
    private String email;

    private String phone;
    private String address;
    private String city;
    private String state;
    private String country;
    private String pincode;
    private String website;
    private String password;
    private String username;
}
