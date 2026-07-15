package com.hrms.entity;

import com.hrms.entity.enums.LeaveType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "leave_balances", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"employee_id", "leave_type", "year"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeaveBalance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Enumerated(EnumType.STRING)
    @Column(name = "leave_type", nullable = false)
    private LeaveType leaveType;

    @Column(name = "total_days")
    @Builder.Default
    private Integer totalDays = 0;

    @Column(name = "used_days")
    @Builder.Default
    private Integer usedDays = 0;

    @Column(name = "remaining_days")
    @Builder.Default
    private Integer remainingDays = 0;

    @Column(nullable = false)
    private Integer year;
}
