package com.jobportalapplication.controller;

import com.jobportalapplication.dto.ApplicationApplicantResponseDTO;
import com.jobportalapplication.dto.ApplicationRecruiterResponseDTO;
import com.jobportalapplication.dto.ApplicationRequestDTO;
import com.jobportalapplication.entity.ApplicationStatusEnum;
import com.jobportalapplication.security.CustomUserDetails;
import com.jobportalapplication.service.ApplicationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping("/applications")
    @PreAuthorize("hasRole('APPLICANT')")
    public ResponseEntity<ApplicationApplicantResponseDTO> applyToJob(@Valid @RequestBody ApplicationRequestDTO dto,
                                                                      @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(applicationService.applyToJob(dto, userDetails.getUser()));
    }

    @GetMapping("/applications/my")
    @PreAuthorize("hasRole('APPLICANT')")
    public ResponseEntity<List<ApplicationApplicantResponseDTO>> getMyApplications(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(applicationService.getMyApplications(userDetails.getUser()));
    }

    @GetMapping("/jobs/{jobId}/applications")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<List<ApplicationRecruiterResponseDTO>> getJobApplications(@PathVariable Long jobId,
                                                                                    @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(applicationService.getJobApplicationsForRecruiter(jobId, userDetails.getUser()));
    }

    @PutMapping("/applications/{id}/status")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<ApplicationRecruiterResponseDTO> updateStatus(@PathVariable Long id,
                                                                        @RequestBody Map<String, String> body,
                                                                        @AuthenticationPrincipal CustomUserDetails userDetails) {
        String statusStr = body.get("status");
        ApplicationStatusEnum status = ApplicationStatusEnum.valueOf(statusStr);
        return ResponseEntity.ok(applicationService.updateApplicationStatus(id, status, userDetails.getUser()));
    }
}
