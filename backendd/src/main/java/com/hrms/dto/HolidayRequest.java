package com.hrms.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HolidayRequest {
    @NotBlank(message = "Holiday name is required")
    private String name;

    @NotNull(message = "Holiday date is required")
    private LocalDate holidayDate;

    private String description;
    private Long companyId;
}
