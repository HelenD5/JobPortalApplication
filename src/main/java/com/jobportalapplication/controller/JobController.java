package com.jobportalapplication.controller;

import com.jobportalapplication.dto.JobRequestDTO;
import com.jobportalapplication.dto.JobResponseDTO;
import com.jobportalapplication.entity.EmploymentTypeEnum;
import com.jobportalapplication.security.CustomUserDetails;
import com.jobportalapplication.service.JobService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @GetMapping
    public ResponseEntity<List<JobResponseDTO>> searchJobs(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) EmploymentTypeEnum employmentType,
            @RequestParam(required = false) String experience) {
        return ResponseEntity.ok(jobService.searchPublishedJobs(search, location, employmentType, experience));
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobResponseDTO> getJobById(@PathVariable Long id) {
        return ResponseEntity.ok(jobService.getJobById(id));
    }

    @GetMapping("/company/{companyId}")
    public ResponseEntity<List<JobResponseDTO>> getCompanyJobs(
            @PathVariable Long companyId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(jobService.getCompanyJobs(companyId, userDetails.getUser()));
    }

    @PostMapping
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<JobResponseDTO> createJob(@Valid @RequestBody JobRequestDTO dto,
                                                   @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(jobService.createJob(dto, userDetails.getUser()));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('RECRUITER') or hasRole('ADMIN')")
    public ResponseEntity<JobResponseDTO> updateJob(@PathVariable Long id,
                                                   @Valid @RequestBody JobRequestDTO dto,
                                                   @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(jobService.updateJob(id, dto, userDetails.getUser()));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('RECRUITER') or hasRole('ADMIN')")
    public ResponseEntity<Void> deleteJob(@PathVariable Long id,
                                          @AuthenticationPrincipal CustomUserDetails userDetails) {
        jobService.deleteJob(id, userDetails.getUser());
        return ResponseEntity.noContent().build();
    }
}
