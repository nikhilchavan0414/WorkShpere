package com.hrms.service;

import com.hrms.dto.DesignationRequest;
import com.hrms.dto.DesignationResponse;
import com.hrms.entity.Company;
import com.hrms.entity.Designation;
import com.hrms.exception.ResourceNotFoundException;
import com.hrms.repository.CompanyRepository;
import com.hrms.repository.DesignationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DesignationService {

    private final DesignationRepository designationRepository;
    private final CompanyRepository companyRepository;

    @Transactional
    public DesignationResponse create(DesignationRequest request) {
        Company company = companyRepository.findById(request.getCompanyId())
                .orElseThrow(() -> new ResourceNotFoundException("Company not found"));

        Designation designation = Designation.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .company(company)
                .active(true)
                .build();

        designationRepository.save(designation);
        return mapToResponse(designation);
    }

    public List<DesignationResponse> getByCompany(Long companyId) {
        return designationRepository.findByCompanyId(companyId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public DesignationResponse getById(Long id) {
        Designation designation = designationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Designation not found"));
        return mapToResponse(designation);
    }

    @Transactional
    public DesignationResponse update(Long id, DesignationRequest request) {
        Designation designation = designationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Designation not found"));

        designation.setTitle(request.getTitle());
        designation.setDescription(request.getDescription());
        designationRepository.save(designation);
        return mapToResponse(designation);
    }

    @Transactional
    public void delete(Long id) {
        if (!designationRepository.existsById(id)) {
            throw new ResourceNotFoundException("Designation not found");
        }
        designationRepository.deleteById(id);
    }

    private DesignationResponse mapToResponse(Designation designation) {
        return DesignationResponse.builder()
                .id(designation.getId())
                .title(designation.getTitle())
                .description(designation.getDescription())
                .companyId(designation.getCompany().getId())
                .companyName(designation.getCompany().getName())
                .active(designation.getActive())
                .createdAt(designation.getCreatedAt())
                .build();
    }
}
