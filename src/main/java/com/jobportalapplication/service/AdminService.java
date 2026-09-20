package com.jobportalapplication.service;

import com.jobportalapplication.dto.AdminDashboardDTO;
import com.jobportalapplication.dto.UserProfileDTO;
import com.jobportalapplication.entity.JobStatusEnum;
import com.jobportalapplication.repository.ApplicationRepository;
import com.jobportalapplication.repository.CompanyRepository;
import com.jobportalapplication.repository.JobRepository;
import com.jobportalapplication.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final UserService userService;

    public AdminService(UserRepository userRepository,
                        CompanyRepository companyRepository,
                        JobRepository jobRepository,
                        ApplicationRepository applicationRepository,
                        UserService userService) {
        this.userRepository = userRepository;
        this.companyRepository = companyRepository;
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
        this.userService = userService;
    }

    public AdminDashboardDTO getAdminDashboardStats() {
        return AdminDashboardDTO.builder()
                .totalUsers(userRepository.count())
                .totalCompanies(companyRepository.count())
                .totalJobs(jobRepository.count())
                .totalApplications(applicationRepository.count())
                .activeJobs(jobRepository.countByStatus(JobStatusEnum.PUBLISHED))
                .build();
    }

    public List<UserProfileDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(userService::mapToDTO)
                .collect(Collectors.toList());
    }
}
