package com.hrms.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChartData {
    private String label;
    private Number value;
}
