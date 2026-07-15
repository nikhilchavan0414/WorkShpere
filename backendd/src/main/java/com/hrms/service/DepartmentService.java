package com.hrms.service;

import com.hrms.dto.DepartmentRequest;
import com.hrms.dto.DepartmentResponse;
import com.hrms.entity.Company;
import com.hrms.entity.Department;
import com.hrms.exception.ResourceNotFoundException;
import com.hrms.repository.CompanyRepository;
import com.hrms.repository.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final CompanyRepository companyRepository;

    @Transactional
    public DepartmentResponse create(DepartmentRequest request) {
        Company company = companyRepository.findById(request.getCompanyId())
                .orElseThrow(() -> new ResourceNotFoundException("Company not found"));

        Department department = Department.builder()
                .name(request.getName())
                .description(request.getDescription())
                .company(company)
                .active(true)
                .build();

        departmentRepository.save(department);
        return mapToResponse(department);
    }

    public List<DepartmentResponse> getByCompany(Long companyId) {
        return departmentRepository.findByCompanyId(companyId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public DepartmentResponse getById(Long id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));
        return mapToResponse(department);
    }

    @Transactional
    public DepartmentResponse update(Long id, DepartmentRequest request) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));

        department.setName(request.getName());
        department.setDescription(request.getDescription());
        departmentRepository.save(department);
        return mapToResponse(department);
    }

    @Transactional
    public void delete(Long id) {
        if (!departmentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Department not found");
        }
        departmentRepository.deleteById(id);
    }

    private DepartmentResponse mapToResponse(Department department) {
        return DepartmentResponse.builder()
                .id(department.getId())
                .name(department.getName())
                .description(department.getDescription())
                .companyId(department.getCompany().getId())
                .companyName(department.getCompany().getName())
                .active(department.getActive())
                .createdAt(department.getCreatedAt())
                .build();
    }
}
