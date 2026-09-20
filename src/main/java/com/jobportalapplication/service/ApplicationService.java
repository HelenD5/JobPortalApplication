package com.jobportalapplication.service;

import com.jobportalapplication.dto.ApplicationApplicantResponseDTO;
import com.jobportalapplication.dto.ApplicationRecruiterResponseDTO;
import com.jobportalapplication.dto.ApplicationRequestDTO;
import com.jobportalapplication.entity.*;
import com.jobportalapplication.exception.BadRequestException;
import com.jobportalapplication.exception.ForbiddenException;
import com.jobportalapplication.exception.ResourceNotFoundException;
import com.jobportalapplication.repository.ApplicationRepository;
import com.jobportalapplication.repository.JobRepository;
import com.jobportalapplication.repository.ResumeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final ResumeRepository resumeRepository;
    private final ResumeMatchingService resumeMatchingService;

    public ApplicationService(ApplicationRepository applicationRepository,
                              JobRepository jobRepository,
                              ResumeRepository resumeRepository,
                              ResumeMatchingService resumeMatchingService) {
        this.applicationRepository = applicationRepository;
        this.jobRepository = jobRepository;
        this.resumeRepository = resumeRepository;
        this.resumeMatchingService = resumeMatchingService;
    }

    @Transactional
    public ApplicationApplicantResponseDTO applyToJob(ApplicationRequestDTO dto, User applicant) {
        if (applicant.getRole() != RoleEnum.APPLICANT) {
            throw new ForbiddenException("Only applicants can apply for jobs.");
        }

        Job job = jobRepository.findById(dto.getJobId())
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + dto.getJobId()));

        if (job.getStatus() != JobStatusEnum.PUBLISHED) {
            throw new BadRequestException("You can only apply to published jobs.");
        }

        if (job.getDeadline() != null && job.getDeadline().isBefore(LocalDate.now())) {
            throw new BadRequestException("Job application deadline has passed.");
        }

        if (applicationRepository.findByJobIdAndApplicantId(job.getId(), applicant.getId()).isPresent()) {
            throw new BadRequestException("You have already applied for this job.");
        }

        Resume resume = resumeRepository.findById(dto.getResumeId())
                .orElseThrow(() -> new ResourceNotFoundException("Resume not found with id: " + dto.getResumeId()));

        if (!resume.getApplicant().getId().equals(applicant.getId())) {
            throw new ForbiddenException("You can only use your own uploaded resume.");
        }

        double score = resumeMatchingService.calculateMatchingScore(job.getRequiredSkills(), applicant.getSkills());

        Application application = Application.builder()
                .job(job)
                .applicant(applicant)
                .resume(resume)
                .score(score)
                .status(ApplicationStatusEnum.APPLIED)
                .build();

        Application savedApplication = applicationRepository.save(application);
        return mapToApplicantDTO(savedApplication);
    }

    public List<ApplicationApplicantResponseDTO> getMyApplications(User applicant) {
        return applicationRepository.findByApplicantIdOrderByAppliedAtDesc(applicant.getId())
                .stream()
                .map(this::mapToApplicantDTO)
                .collect(Collectors.toList());
    }

    public List<ApplicationRecruiterResponseDTO> getJobApplicationsForRecruiter(Long jobId, User recruiter) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + jobId));

        if (recruiter.getCompany() == null || !job.getCompany().getId().equals(recruiter.getCompany().getId())) {
            throw new ForbiddenException("Company recruiters can only view applicants for their own company's jobs.");
        }

        return applicationRepository.findByJobIdOrderByScoreDesc(jobId)
                .stream()
                .map(this::mapToRecruiterDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public ApplicationRecruiterResponseDTO updateApplicationStatus(Long applicationId, ApplicationStatusEnum status, User recruiter) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + applicationId));

        if (recruiter.getCompany() == null || !application.getJob().getCompany().getId().equals(recruiter.getCompany().getId())) {
            throw new ForbiddenException("Company recruiters can only update application status for their own company's jobs.");
        }

        application.setStatus(status);
        Application updatedApplication = applicationRepository.save(application);
        return mapToRecruiterDTO(updatedApplication);
    }

    public ApplicationApplicantResponseDTO mapToApplicantDTO(Application application) {
        return ApplicationApplicantResponseDTO.builder()
                .id(application.getId())
                .jobId(application.getJob().getId())
                .jobTitle(application.getJob().getTitle())
                .companyId(application.getJob().getCompany().getId())
                .companyName(application.getJob().getCompany().getName())
                .location(application.getJob().getLocation())
                .employmentType(application.getJob().getEmploymentType())
                .resumeId(application.getResume().getId())
                .resumeFileName(application.getResume().getFileName())
                .status(application.getStatus())
                .appliedAt(application.getAppliedAt())
                .updatedAt(application.getUpdatedAt())
                .build();
    }

    public ApplicationRecruiterResponseDTO mapToRecruiterDTO(Application application) {
        return ApplicationRecruiterResponseDTO.builder()
                .id(application.getId())
                .jobId(application.getJob().getId())
                .jobTitle(application.getJob().getTitle())
                .applicantId(application.getApplicant().getId())
                .applicantName(application.getApplicant().getName())
                .applicantEmail(application.getApplicant().getEmail())
                .applicantPhone(application.getApplicant().getPhone())
                .applicantLocation(application.getApplicant().getLocation())
                .applicantSkills(application.getApplicant().getSkills())
                .applicantEducation(application.getApplicant().getEducation())
                .applicantExperience(application.getApplicant().getExperience())
                .resumeId(application.getResume().getId())
                .resumeFileName(application.getResume().getFileName())
                .score(application.getScore())
                .status(application.getStatus())
                .appliedAt(application.getAppliedAt())
                .updatedAt(application.getUpdatedAt())
                .build();
    }
}
