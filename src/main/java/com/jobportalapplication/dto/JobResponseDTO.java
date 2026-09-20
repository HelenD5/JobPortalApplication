package com.jobportalapplication.dto;

import com.jobportalapplication.entity.EmploymentTypeEnum;
import com.jobportalapplication.entity.JobStatusEnum;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobResponseDTO {
    private Long id;
    private Long companyId;
    private String companyName;
    private String companyLogo;
    private Long createdById;
    private String createdByName;
    private String title;
    private String description;
    private String requiredSkills;
    private String location;
    private String experience;
    private String salary;
    private EmploymentTypeEnum employmentType;
    private LocalDate deadline;
    private JobStatusEnum status;
    private LocalDateTime createdAt;
}
