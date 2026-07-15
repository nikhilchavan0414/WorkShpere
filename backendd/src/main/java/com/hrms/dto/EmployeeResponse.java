package com.hrms.dto;

import com.hrms.entity.enums.Gender;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeeResponse {
    private Long id;
    private String employeeId;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private Gender gender;
    private LocalDate dateOfBirth;
    private String address;
    private Long departmentId;
    private String departmentName;
    private Long designationId;
    private String designationTitle;
    private Long companyId;
    private String companyName;
    private BigDecimal salary;
    private LocalDate joiningDate;
    private String experience;
    private String qualification;
    private String bankName;
    private String bankAccountNumber;
    private String bankIfsc;
    private String emergencyContactName;
    private String emergencyContactPhone;
    private String profilePicture;
    private Boolean active;
    private LocalDateTime createdAt;
}
