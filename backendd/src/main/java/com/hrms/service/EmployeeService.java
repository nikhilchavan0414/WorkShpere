package com.hrms.service;

import com.hrms.dto.EmployeeRequest;
import com.hrms.dto.EmployeeResponse;
import com.hrms.dto.PageResponse;
import com.hrms.entity.*;
import com.hrms.entity.enums.LeaveType;
import com.hrms.entity.enums.RoleName;
import com.hrms.exception.BadRequestException;
import com.hrms.exception.ResourceNotFoundException;
import com.hrms.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Year;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final CompanyRepository companyRepository;
    private final DepartmentRepository departmentRepository;
    private final DesignationRepository designationRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final LeaveBalanceRepository leaveBalanceRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public EmployeeResponse create(EmployeeRequest request) {
        if (employeeRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new BadRequestException("Employee email already exists");
        }

        Company company = companyRepository.findById(request.getCompanyId())
                .orElseThrow(() -> new ResourceNotFoundException("Company not found"));

        Department department = null;
        if (request.getDepartmentId() != null) {
            department = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department not found"));
        }

        Designation designation = null;
        if (request.getDesignationId() != null) {
            designation = designationRepository.findById(request.getDesignationId())
                    .orElseThrow(() -> new ResourceNotFoundException("Designation not found"));
        }

        Role employeeRole = roleRepository.findByName(RoleName.EMPLOYEE)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found"));

        String password = request.getPassword() != null ? request.getPassword() : "employee123";
        User user = User.builder()
                .username(request.getEmail())
                .email(request.getEmail())
                .password(passwordEncoder.encode(password))
                .role(employeeRole)
                .enabled(true)
                .build();
        userRepository.save(user);

        String empId = request.getEmployeeId() != null ? request.getEmployeeId()
                : "EMP-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        Employee employee = Employee.builder()
                .employeeId(empId)
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .gender(request.getGender())
                .dateOfBirth(request.getDateOfBirth())
                .address(request.getAddress())
                .department(department)
                .designation(designation)
                .company(company)
                .salary(request.getSalary())
                .joiningDate(request.getJoiningDate())
                .experience(request.getExperience())
                .qualification(request.getQualification())
                .bankName(request.getBankName())
                .bankAccountNumber(request.getBankAccountNumber())
                .bankIfsc(request.getBankIfsc())
                .emergencyContactName(request.getEmergencyContactName())
                .emergencyContactPhone(request.getEmergencyContactPhone())
                .user(user)
                .active(true)
                .build();

        employeeRepository.save(employee);
        initializeLeaveBalances(employee);
        return mapToResponse(employee);
    }

    private void initializeLeaveBalances(Employee employee) {
        int year = Year.now().getValue();
        for (LeaveType type : LeaveType.values()) {
            int total = switch (type) {
                case CASUAL -> 12;
                case SICK -> 10;
                case EARNED -> 15;
                case MATERNITY -> 90;
                case PATERNITY -> 15;
            };
            leaveBalanceRepository.save(LeaveBalance.builder()
                    .employee(employee)
                    .leaveType(type)
                    .totalDays(total)
                    .usedDays(0)
                    .remainingDays(total)
                    .year(year)
                    .build());
        }
    }

    public PageResponse<EmployeeResponse> getByCompany(Long companyId, int page, int size, String search, Long departmentId) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Employee> employeePage;

        if (search != null && !search.isBlank()) {
            employeePage = employeeRepository.searchByCompany(companyId, search, pageRequest);
        } else if (departmentId != null) {
            employeePage = employeeRepository.findByCompanyAndDepartment(companyId, departmentId, pageRequest);
        } else {
            employeePage = employeeRepository.findByCompanyId(companyId, pageRequest);
        }

        return PageResponse.<EmployeeResponse>builder()
                .content(employeePage.getContent().stream().map(this::mapToResponse).collect(Collectors.toList()))
                .page(employeePage.getNumber())
                .size(employeePage.getSize())
                .totalElements(employeePage.getTotalElements())
                .totalPages(employeePage.getTotalPages())
                .last(employeePage.isLast())
                .build();
    }

    public EmployeeResponse getById(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));
        return mapToResponse(employee);
    }

    public EmployeeResponse getByUserId(Long userId) {
        Employee employee = employeeRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));
        return mapToResponse(employee);
    }

    @Transactional
    public EmployeeResponse update(Long id, EmployeeRequest request) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        employee.setFirstName(request.getFirstName());
        employee.setLastName(request.getLastName());
        employee.setPhone(request.getPhone());
        employee.setGender(request.getGender());
        employee.setDateOfBirth(request.getDateOfBirth());
        employee.setAddress(request.getAddress());
        employee.setExperience(request.getExperience());
        employee.setQualification(request.getQualification());
        employee.setBankName(request.getBankName());
        employee.setBankAccountNumber(request.getBankAccountNumber());
        employee.setBankIfsc(request.getBankIfsc());
        employee.setEmergencyContactName(request.getEmergencyContactName());
        employee.setEmergencyContactPhone(request.getEmergencyContactPhone());

        if (request.getSalary() != null) {
            employee.setSalary(request.getSalary());
        }
        if (request.getDepartmentId() != null) {
            employee.setDepartment(departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department not found")));
        }
        if (request.getDesignationId() != null) {
            employee.setDesignation(designationRepository.findById(request.getDesignationId())
                    .orElseThrow(() -> new ResourceNotFoundException("Designation not found")));
        }

        employeeRepository.save(employee);
        return mapToResponse(employee);
    }

    @Transactional
    public void delete(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));
        employee.setActive(false);
        employeeRepository.save(employee);
    }

    public List<EmployeeResponse> getAll() {
        return employeeRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private EmployeeResponse mapToResponse(Employee employee) {
        return EmployeeResponse.builder()
                .id(employee.getId())
                .employeeId(employee.getEmployeeId())
                .firstName(employee.getFirstName())
                .lastName(employee.getLastName())
                .email(employee.getEmail())
                .phone(employee.getPhone())
                .gender(employee.getGender())
                .dateOfBirth(employee.getDateOfBirth())
                .address(employee.getAddress())
                .departmentId(employee.getDepartment() != null ? employee.getDepartment().getId() : null)
                .departmentName(employee.getDepartment() != null ? employee.getDepartment().getName() : null)
                .designationId(employee.getDesignation() != null ? employee.getDesignation().getId() : null)
                .designationTitle(employee.getDesignation() != null ? employee.getDesignation().getTitle() : null)
                .companyId(employee.getCompany().getId())
                .companyName(employee.getCompany().getName())
                .salary(employee.getSalary())
                .joiningDate(employee.getJoiningDate())
                .experience(employee.getExperience())
                .qualification(employee.getQualification())
                .bankName(employee.getBankName())
                .bankAccountNumber(employee.getBankAccountNumber())
                .bankIfsc(employee.getBankIfsc())
                .emergencyContactName(employee.getEmergencyContactName())
                .emergencyContactPhone(employee.getEmergencyContactPhone())
                .profilePicture(employee.getProfilePicture())
                .active(employee.getActive())
                .createdAt(employee.getCreatedAt())
                .build();
    }
}
