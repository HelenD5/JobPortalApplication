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
public class ApplicantDashboardDTO {
    private long totalApplications;
    private long underReviewCount;
    private long shortlistedCount;
    private long interviewCount;
    private long selectedCount;
    private List<ApplicationApplicantResponseDTO> recentApplications;
}
