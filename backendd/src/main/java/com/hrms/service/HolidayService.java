package com.hrms.service;

import com.hrms.dto.HolidayRequest;
import com.hrms.dto.HolidayResponse;
import com.hrms.entity.Company;
import com.hrms.entity.Holiday;
import com.hrms.exception.ResourceNotFoundException;
import com.hrms.repository.CompanyRepository;
import com.hrms.repository.HolidayRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HolidayService {

    private final HolidayRepository holidayRepository;
    private final CompanyRepository companyRepository;

    @Transactional
    public HolidayResponse create(HolidayRequest request) {
        Company company = companyRepository.findById(request.getCompanyId())
                .orElseThrow(() -> new ResourceNotFoundException("Company not found"));

        Holiday holiday = Holiday.builder()
                .name(request.getName())
                .holidayDate(request.getHolidayDate())
                .description(request.getDescription())
                .company(company)
                .build();

        holidayRepository.save(holiday);
        return mapToResponse(holiday);
    }

    public List<HolidayResponse> getByCompany(Long companyId) {
        return holidayRepository.findByCompanyId(companyId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<HolidayResponse> getUpcoming(Long companyId) {
        return holidayRepository.findByCompanyIdAndHolidayDateBetween(
                companyId, LocalDate.now(), LocalDate.now().plusMonths(3)).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public HolidayResponse update(Long id, HolidayRequest request) {
        Holiday holiday = holidayRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Holiday not found"));

        holiday.setName(request.getName());
        holiday.setHolidayDate(request.getHolidayDate());
        holiday.setDescription(request.getDescription());
        holidayRepository.save(holiday);
        return mapToResponse(holiday);
    }

    @Transactional
    public void delete(Long id) {
        if (!holidayRepository.existsById(id)) {
            throw new ResourceNotFoundException("Holiday not found");
        }
        holidayRepository.deleteById(id);
    }

    private HolidayResponse mapToResponse(Holiday holiday) {
        return HolidayResponse.builder()
                .id(holiday.getId())
                .name(holiday.getName())
                .holidayDate(holiday.getHolidayDate())
                .description(holiday.getDescription())
                .companyId(holiday.getCompany().getId())
                .companyName(holiday.getCompany().getName())
                .createdAt(holiday.getCreatedAt())
                .build();
    }
}
