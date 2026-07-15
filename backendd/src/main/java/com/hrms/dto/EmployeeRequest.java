package com.hrms.dto;

import com.hrms.entity.enums.Gender;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeeRequest {
    private String employeeId;

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email
    private String email;

    private String phone;
    private Gender gender;
    private LocalDate dateOfBirth;
    private String address;
    private Long departmentId;
    private Long designationId;
    private Long companyId;
    private BigDecimal salary;
    private LocalDate joiningDate;
    private String experience;
    private String qualification;
    private String bankName;
    private String bankAccountNumber;
    private String bankIfsc;
    private String emergencyContactName;
    private String emergencyContactPhone;
    private String password;
}
