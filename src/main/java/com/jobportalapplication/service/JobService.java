package com.jobportalapplication.service;

import com.jobportalapplication.dto.JobRequestDTO;
import com.jobportalapplication.dto.JobResponseDTO;
import com.jobportalapplication.entity.*;
import com.jobportalapplication.exception.BadRequestException;
import com.jobportalapplication.exception.ForbiddenException;
import com.jobportalapplication.exception.ResourceNotFoundException;
import com.jobportalapplication.repository.JobRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class JobService {

    private final JobRepository jobRepository;

    public JobService(JobRepository jobRepository) {
        this.jobRepository = jobRepository;
    }

    public List<JobResponseDTO> searchPublishedJobs(String search, String location, EmploymentTypeEnum employmentType, String experience) {
        return jobRepository.searchJobs(JobStatusEnum.PUBLISHED, search, location, employmentType, experience)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public JobResponseDTO getJobById(Long jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + jobId));
        return mapToDTO(job);
    }

    public List<JobResponseDTO> getCompanyJobs(Long companyId, User currentUser) {
        if (currentUser.getRole() == RoleEnum.RECRUITER) {
            if (currentUser.getCompany() == null || !currentUser.getCompany().getId().equals(companyId)) {
                throw new ForbiddenException("You can only access jobs belonging to your company.");
            }
        }
        return jobRepository.findByCompanyId(companyId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<JobResponseDTO> getAllJobsForAdmin() {
        return jobRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public JobResponseDTO createJob(JobRequestDTO dto, User currentUser) {
        if (currentUser.getRole() != RoleEnum.RECRUITER || currentUser.getCompany() == null) {
            throw new ForbiddenException("Only recruiters associated with a company can create jobs.");
        }

        Job job = Job.builder()
                .company(currentUser.getCompany())
                .createdBy(currentUser)
                .title(dto.getTitle())
                .description(dto.getDescription())
                .requiredSkills(dto.getRequiredSkills())
                .location(dto.getLocation())
                .experience(dto.getExperience())
                .salary(dto.getSalary())
                .employmentType(dto.getEmploymentType())
                .deadline(dto.getDeadline())
                .status(dto.getStatus() != null ? dto.getStatus() : JobStatusEnum.PUBLISHED)
                .build();

        Job savedJob = jobRepository.save(job);
        return mapToDTO(savedJob);
    }

    @Transactional
    public JobResponseDTO updateJob(Long jobId, JobRequestDTO dto, User currentUser) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + jobId));

        // Company isolation check
        if (currentUser.getRole() == RoleEnum.RECRUITER) {
            if (currentUser.getCompany() == null || !job.getCompany().getId().equals(currentUser.getCompany().getId())) {
                throw new ForbiddenException("You cannot edit jobs belonging to another company.");
            }
        } else if (currentUser.getRole() != RoleEnum.ADMIN) {
            throw new ForbiddenException("Unauthorized to edit job.");
        }

        if (dto.getTitle() != null) job.setTitle(dto.getTitle());
        if (dto.getDescription() != null) job.setDescription(dto.getDescription());
        if (dto.getRequiredSkills() != null) job.setRequiredSkills(dto.getRequiredSkills());
        if (dto.getLocation() != null) job.setLocation(dto.getLocation());
        if (dto.getExperience() != null) job.setExperience(dto.getExperience());
        if (dto.getSalary() != null) job.setSalary(dto.getSalary());
        if (dto.getEmploymentType() != null) job.setEmploymentType(dto.getEmploymentType());
        if (dto.getDeadline() != null) job.setDeadline(dto.getDeadline());
        if (dto.getStatus() != null) job.setStatus(dto.getStatus());

        Job updatedJob = jobRepository.save(job);
        return mapToDTO(updatedJob);
    }

    @Transactional
    public void deleteJob(Long jobId, User currentUser) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + jobId));

        if (currentUser.getRole() == RoleEnum.RECRUITER) {
            if (currentUser.getCompany() == null || !job.getCompany().getId().equals(currentUser.getCompany().getId())) {
                throw new ForbiddenException("You cannot delete jobs belonging to another company.");
            }
        } else if (currentUser.getRole() != RoleEnum.ADMIN) {
            throw new ForbiddenException("Unauthorized to delete job.");
        }

        jobRepository.delete(job);
    }

    public JobResponseDTO mapToDTO(Job job) {
        return JobResponseDTO.builder()
                .id(job.getId())
                .companyId(job.getCompany().getId())
                .companyName(job.getCompany().getName())
                .companyLogo(job.getCompany().getLogo())
                .createdById(job.getCreatedBy().getId())
                .createdByName(job.getCreatedBy().getName())
                .title(job.getTitle())
                .description(job.getDescription())
                .requiredSkills(job.getRequiredSkills())
                .location(job.getLocation())
                .experience(job.getExperience())
                .salary(job.getSalary())
                .employmentType(job.getEmploymentType())
                .deadline(job.getDeadline())
                .status(job.getStatus())
                .createdAt(job.getCreatedAt())
                .build();
    }
}
