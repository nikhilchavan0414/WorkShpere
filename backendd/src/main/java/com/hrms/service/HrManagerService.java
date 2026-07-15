package com.hrms.service;

import com.hrms.dto.HrManagerRequest;
import com.hrms.dto.HrManagerResponse;
import com.hrms.entity.Company;
import com.hrms.entity.HrManager;
import com.hrms.entity.Role;
import com.hrms.entity.User;
import com.hrms.entity.enums.RoleName;
import com.hrms.exception.BadRequestException;
import com.hrms.exception.ResourceNotFoundException;
import com.hrms.repository.CompanyRepository;
import com.hrms.repository.HrManagerRepository;
import com.hrms.repository.RoleRepository;
import com.hrms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HrManagerService {

    private final HrManagerRepository hrManagerRepository;
    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public HrManagerResponse create(HrManagerRequest request) {
        if (hrManagerRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new BadRequestException("HR email already exists");
        }

        Company company = companyRepository.findById(request.getCompanyId())
                .orElseThrow(() -> new ResourceNotFoundException("Company not found"));

        Role hrRole = roleRepository.findByName(RoleName.HR)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found"));

        String username = request.getUsername() != null ? request.getUsername() : request.getEmail();
        String password = request.getPassword() != null ? request.getPassword() : "hr123456";

        User user = User.builder()
                .username(username)
                .email(request.getEmail())
                .password(passwordEncoder.encode(password))
                .role(hrRole)
                .enabled(true)
                .build();
        userRepository.save(user);

        HrManager hr = HrManager.builder()
                .employeeCode(request.getEmployeeCode())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .company(company)
                .user(user)
                .active(true)
                .build();

        hrManagerRepository.save(hr);
        return mapToResponse(hr);
    }

    public List<HrManagerResponse> getByCompany(Long companyId) {
        return hrManagerRepository.findByCompanyId(companyId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<HrManagerResponse> getAll() {
        return hrManagerRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void delete(Long id) {
        if (!hrManagerRepository.existsById(id)) {
            throw new ResourceNotFoundException("HR Manager not found");
        }
        hrManagerRepository.deleteById(id);
    }

    private HrManagerResponse mapToResponse(HrManager hr) {
        return HrManagerResponse.builder()
                .id(hr.getId())
                .employeeCode(hr.getEmployeeCode())
                .firstName(hr.getFirstName())
                .lastName(hr.getLastName())
                .email(hr.getEmail())
                .phone(hr.getPhone())
                .companyId(hr.getCompany().getId())
                .companyName(hr.getCompany().getName())
                .active(hr.getActive())
                .createdAt(hr.getCreatedAt())
                .build();
    }
}
