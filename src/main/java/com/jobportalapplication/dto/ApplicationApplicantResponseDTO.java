package com.jobportalapplication.dto;

import com.jobportalapplication.entity.ApplicationStatusEnum;
import com.jobportalapplication.entity.EmploymentTypeEnum;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

/**
 * DTO for Applicant views.
 * IMPORTANT: Applicants MUST NEVER see their resume/application matching score.
 * This DTO deliberately omits the score field.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicationApplicantResponseDTO {
    private Long id;
    private Long jobId;
    private String jobTitle;
    private Long companyId;
    private String companyName;
    private String location;
    private EmploymentTypeEnum employmentType;
    private Long resumeId;
    private String resumeFileName;
    private ApplicationStatusEnum status;
    private LocalDateTime appliedAt;
    private LocalDateTime updatedAt;
}
