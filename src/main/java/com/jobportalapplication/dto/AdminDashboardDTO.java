package com.jobportalapplication.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminDashboardDTO {
    private long totalUsers;
    private long totalCompanies;
    private long totalJobs;
    private long totalApplications;
    private long activeJobs;
}
