package com.hrms.config;

import com.hrms.entity.Role;
import com.hrms.entity.User;
import com.hrms.entity.enums.RoleName;
import com.hrms.repository.RoleRepository;
import com.hrms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        for (RoleName roleName : RoleName.values()) {
            roleRepository.findByName(roleName).orElseGet(() ->
                    roleRepository.save(Role.builder()
                            .name(roleName)
                            .description(roleName.name() + " role")
                            .build()));
        }

        if (!userRepository.existsByUsername("admin")) {
            Role adminRole = roleRepository.findByName(RoleName.ADMIN).orElseThrow();
            userRepository.save(User.builder()
                    .username("admin")
                    .email("admin@hrms.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(adminRole)
                    .enabled(true)
                    .build());
        }
    }
}
