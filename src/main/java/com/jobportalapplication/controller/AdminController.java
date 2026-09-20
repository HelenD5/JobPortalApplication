package com.jobportalapplication.controller;

import com.jobportalapplication.dto.AdminDashboardDTO;
import com.jobportalapplication.dto.CompanyDTO;
import com.jobportalapplication.dto.JobResponseDTO;
import com.jobportalapplication.dto.UserProfileDTO;
import com.jobportalapplication.entity.CompanyStatusEnum;
import com.jobportalapplication.service.AdminService;
import com.jobportalapplication.service.CompanyService;
import com.jobportalapplication.service.JobService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;
    private final CompanyService companyService;
    private final JobService jobService;

    public AdminController(AdminService adminService,
                           CompanyService companyService,
                           JobService jobService) {
        this.adminService = adminService;
        this.companyService = companyService;
        this.jobService = jobService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboardDTO> getDashboardStats() {
        return ResponseEntity.ok(adminService.getAdminDashboardStats());
    }

    @GetMapping("/companies")
    public ResponseEntity<List<CompanyDTO>> getAllCompanies() {
        return ResponseEntity.ok(companyService.getAllCompanies());
    }

    @PutMapping("/companies/{id}/status")
    public ResponseEntity<CompanyDTO> updateCompanyStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String statusStr = body.get("status");
        CompanyStatusEnum status = CompanyStatusEnum.valueOf(statusStr);
        return ResponseEntity.ok(companyService.updateCompanyStatus(id, status));
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserProfileDTO>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @GetMapping("/jobs")
    public ResponseEntity<List<JobResponseDTO>> getAllJobs() {
        return ResponseEntity.ok(jobService.getAllJobsForAdmin());
    }
}
