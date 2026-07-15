package com.hrms.service;

import com.hrms.dto.CompanyRequest;
import com.hrms.dto.CompanyResponse;
import com.hrms.entity.Company;
import com.hrms.entity.Role;
import com.hrms.entity.User;
import com.hrms.entity.enums.RoleName;
import com.hrms.exception.BadRequestException;
import com.hrms.exception.ResourceNotFoundException;
import com.hrms.repository.CompanyRepository;
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
public class CompanyService {

    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public CompanyResponse register(CompanyRequest request) {
        if (companyRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Company email already registered");
        }

        Role companyRole = roleRepository.findByName(RoleName.COMPANY)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found"));

        String username = request.getUsername() != null ? request.getUsername() : request.getEmail();
        String password = request.getPassword() != null ? request.getPassword() : "company123";

        User user = User.builder()
                .username(username)
                .email(request.getEmail())
                .password(passwordEncoder.encode(password))
                .role(companyRole)
                .enabled(true)
                .build();
        userRepository.save(user);

        Company company = Company.builder()
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .address(request.getAddress())
                .city(request.getCity())
                .state(request.getState())
                .country(request.getCountry())
                .pincode(request.getPincode())
                .website(request.getWebsite())
                .user(user)
                .active(true)
                .build();

        companyRepository.save(company);
        return mapToResponse(company);
    }

    public List<CompanyResponse> getAll() {
        return companyRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public CompanyResponse getById(Long id) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found"));
        return mapToResponse(company);
    }

    @Transactional
    public CompanyResponse update(Long id, CompanyRequest request) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found"));

        company.setName(request.getName());
        company.setPhone(request.getPhone());
        company.setAddress(request.getAddress());
        company.setCity(request.getCity());
        company.setState(request.getState());
        company.setCountry(request.getCountry());
        company.setPincode(request.getPincode());
        company.setWebsite(request.getWebsite());

        companyRepository.save(company);
        return mapToResponse(company);
    }

    @Transactional
    public void delete(Long id) {
        if (!companyRepository.existsById(id)) {
            throw new ResourceNotFoundException("Company not found");
        }
        companyRepository.deleteById(id);
    }

    private CompanyResponse mapToResponse(Company company) {
        return CompanyResponse.builder()
                .id(company.getId())
                .name(company.getName())
                .email(company.getEmail())
                .phone(company.getPhone())
                .address(company.getAddress())
                .city(company.getCity())
                .state(company.getState())
                .country(company.getCountry())
                .pincode(company.getPincode())
                .website(company.getWebsite())
                .logoUrl(company.getLogoUrl())
                .active(company.getActive())
                .createdAt(company.getCreatedAt())
                .build();
    }
}
