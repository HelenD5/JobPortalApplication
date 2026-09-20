package com.jobportalapplication.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecruiterDashboardDTO {
    private long activeJobs;
    private long totalApplications;
    private long shortlistedCount;
    private long interviewCount;
    private long selectedCount;
    private long rejectedCount;
    private List<JobResponseDTO> recentJobs;
    private List<ApplicationRecruiterResponseDTO> recentApplications;
}
