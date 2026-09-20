package com.jobportalapplication.controller;

import com.jobportalapplication.dto.ApplicantDashboardDTO;
import com.jobportalapplication.dto.RecruiterDashboardDTO;
import com.jobportalapplication.security.CustomUserDetails;
import com.jobportalapplication.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/applicant")
    @PreAuthorize("hasRole('APPLICANT')")
    public ResponseEntity<ApplicantDashboardDTO> getApplicantDashboard(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(dashboardService.getApplicantDashboard(userDetails.getUser()));
    }

    @GetMapping("/recruiter")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<RecruiterDashboardDTO> getRecruiterDashboard(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(dashboardService.getRecruiterDashboard(userDetails.getUser()));
    }
}
