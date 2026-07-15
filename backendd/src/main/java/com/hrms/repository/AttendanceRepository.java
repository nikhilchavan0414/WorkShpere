package com.hrms.repository;

import com.hrms.entity.Attendance;
import com.hrms.entity.enums.AttendanceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    Optional<Attendance> findByEmployeeIdAndAttendanceDate(Long employeeId, LocalDate date);
    List<Attendance> findByEmployeeIdAndAttendanceDateBetween(Long employeeId, LocalDate start, LocalDate end);

    @Query("SELECT a FROM Attendance a WHERE a.employee.company.id = :companyId AND a.attendanceDate = :date")
    List<Attendance> findByCompanyAndDate(@Param("companyId") Long companyId, @Param("date") LocalDate date);

    long countByAttendanceDateAndStatus(LocalDate date, AttendanceStatus status);

    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.employee.company.id = :companyId AND a.attendanceDate = :date")
    long countByCompanyAndDate(@Param("companyId") Long companyId, @Param("date") LocalDate date);
}
