package com.hrms.dto;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HolidayResponse {
    private Long id;
    private String name;
    private LocalDate holidayDate;
    private String description;
    private Long companyId;
    private String companyName;
    private LocalDateTime createdAt;
}
