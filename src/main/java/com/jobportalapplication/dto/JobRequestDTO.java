package com.jobportalapplication.dto;

import com.jobportalapplication.entity.EmploymentTypeEnum;
import com.jobportalapplication.entity.JobStatusEnum;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;

@Data
public class JobRequestDTO {

    @NotBlank(message = "Job title is required")
    private String title;

    @NotBlank(message = "Job description is required")
    private String description;

    @NotBlank(message = "Required skills are required")
    private String requiredSkills;

    private String location;
    private String experience;
    private String salary;

    @NotNull(message = "Employment type is required")
    private EmploymentTypeEnum employmentType;

    private LocalDate deadline;

    private JobStatusEnum status; // Defaults to PUBLISHED or DRAFT
}
