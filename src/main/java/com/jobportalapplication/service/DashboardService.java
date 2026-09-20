package com.jobportalapplication.service;

import com.jobportalapplication.dto.*;
import com.jobportalapplication.entity.*;
import com.jobportalapplication.repository.ApplicationRepository;
import com.jobportalapplication.repository.JobRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final ApplicationService applicationService;
    private final JobService jobService;

    public DashboardService(ApplicationRepository applicationRepository,
                            JobRepository jobRepository,
                            ApplicationService applicationService,
                            JobService jobService) {
        this.applicationRepository = applicationRepository;
        this.jobRepository = jobRepository;
        this.applicationService = applicationService;
        this.jobService = jobService;
    }

    public ApplicantDashboardDTO getApplicantDashboard(User applicant) {
        Long userId = applicant.getId();
        List<ApplicationApplicantResponseDTO> recentApplications = applicationRepository
                .findByApplicantIdOrderByAppliedAtDesc(userId)
                .stream()
                .limit(5)
                .map(applicationService::mapToApplicantDTO)
                .collect(Collectors.toList());

        return ApplicantDashboardDTO.builder()
                .totalApplications(applicationRepository.findByApplicantIdOrderByAppliedAtDesc(userId).size())
                .underReviewCount(applicationRepository.countByApplicantIdAndStatus(userId, ApplicationStatusEnum.UNDER_REVIEW))
                .shortlistedCount(applicationRepository.countByApplicantIdAndStatus(userId, ApplicationStatusEnum.SHORTLISTED))
                .interviewCount(applicationRepository.countByApplicantIdAndStatus(userId, ApplicationStatusEnum.INTERVIEW))
                .selectedCount(applicationRepository.countByApplicantIdAndStatus(userId, ApplicationStatusEnum.SELECTED))
                .recentApplications(recentApplications)
                .build();
    }

    public RecruiterDashboardDTO getRecruiterDashboard(User recruiter) {
        Long companyId = recruiter.getCompany() != null ? recruiter.getCompany().getId() : 0L;

        List<JobResponseDTO> recentJobs = jobRepository.findByCompanyId(companyId)
                .stream()
                .limit(5)
                .map(jobService::mapToDTO)
                .collect(Collectors.toList());

        List<ApplicationRecruiterResponseDTO> recentApplications = applicationRepository
                .findByJobCompanyIdOrderByAppliedAtDesc(companyId)
                .stream()
                .limit(10)
                .map(applicationService::mapToRecruiterDTO)
                .collect(Collectors.toList());

        long activeJobsCount = jobRepository.findByCompanyId(companyId).stream()
                .filter(j -> j.getStatus() == JobStatusEnum.PUBLISHED)
                .count();

        return RecruiterDashboardDTO.builder()
                .activeJobs(activeJobsCount)
                .totalApplications(applicationRepository.findByJobCompanyIdOrderByAppliedAtDesc(companyId).size())
                .shortlistedCount(applicationRepository.countByJobCompanyIdAndStatus(companyId, ApplicationStatusEnum.SHORTLISTED))
                .interviewCount(applicationRepository.countByJobCompanyIdAndStatus(companyId, ApplicationStatusEnum.INTERVIEW))
                .selectedCount(applicationRepository.countByJobCompanyIdAndStatus(companyId, ApplicationStatusEnum.SELECTED))
                .rejectedCount(applicationRepository.countByJobCompanyIdAndStatus(companyId, ApplicationStatusEnum.REJECTED))
                .recentJobs(recentJobs)
                .recentApplications(recentApplications)
                .build();
    }
}
