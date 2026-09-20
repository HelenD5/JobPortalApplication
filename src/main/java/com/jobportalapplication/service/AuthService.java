package com.jobportalapplication.service;

import com.jobportalapplication.dto.AuthRequest;
import com.jobportalapplication.dto.AuthResponse;
import com.jobportalapplication.dto.RegisterRequest;
import com.jobportalapplication.entity.*;
import com.jobportalapplication.exception.BadRequestException;
import com.jobportalapplication.repository.CompanyRepository;
import com.jobportalapplication.repository.UserRepository;
import com.jobportalapplication.security.CustomUserDetails;
import com.jobportalapplication.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository,
                       CompanyRepository companyRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService,
                       AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.companyRepository = companyRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered!");
        }

        if (request.getRole() == RoleEnum.ADMIN) {
            throw new BadRequestException("Public admin registration is not allowed.");
        }

        Company company = null;
        if (request.getRole() == RoleEnum.RECRUITER) {
            if (request.getCompanyId() != null) {
                company = companyRepository.findById(request.getCompanyId())
                        .orElseThrow(() -> new BadRequestException("Selected company not found"));
            } else if (request.getCompanyName() != null && !request.getCompanyName().trim().isEmpty()) {
                company = companyRepository.findByName(request.getCompanyName().trim())
                        .orElseGet(() -> companyRepository.save(Company.builder()
                                .name(request.getCompanyName().trim())
                                .email(request.getCompanyEmail())
                                .description(request.getCompanyDescription())
                                .website(request.getCompanyWebsite())
                                .location(request.getCompanyLocation())
                                .status(CompanyStatusEnum.ACTIVE)
                                .build()));
            } else {
                throw new BadRequestException("Recruiter must provide company details or select an existing company.");
            }
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .company(company)
                .phone(request.getPhone())
                .location(request.getLocation())
                .skills(request.getSkills())
                .education(request.getEducation())
                .experience(request.getExperience())
                .build();

        user = userRepository.save(user);

        CustomUserDetails userDetails = new CustomUserDetails(user);
        String token = jwtService.generateToken(userDetails);

        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .companyId(user.getCompany() != null ? user.getCompany().getId() : null)
                .companyName(user.getCompany() != null ? user.getCompany().getName() : null)
                .build();
    }

    public AuthResponse login(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("Invalid email or password"));

        CustomUserDetails userDetails = new CustomUserDetails(user);
        String token = jwtService.generateToken(userDetails);

        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .companyId(user.getCompany() != null ? user.getCompany().getId() : null)
                .companyName(user.getCompany() != null ? user.getCompany().getName() : null)
                .build();
    }
}
