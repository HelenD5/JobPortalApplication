package com.jobportalapplication.dto;

import com.jobportalapplication.entity.ApplicationStatusEnum;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

/**
 * DTO for Recruiter views.
 * Recruiters can see applicant resume matching score.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicationRecruiterResponseDTO {
    private Long id;
    private Long jobId;
    private String jobTitle;
    private Long applicantId;
    private String applicantName;
    private String applicantEmail;
    private String applicantPhone;
    private String applicantLocation;
    private String applicantSkills;
    private String applicantEducation;
    private String applicantExperience;
    private Long resumeId;
    private String resumeFileName;
    private Double score;
    private ApplicationStatusEnum status;
    private LocalDateTime appliedAt;
    private LocalDateTime updatedAt;
}
