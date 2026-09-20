package com.jobportalapplication.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResumeDTO {
    private Long id;
    private Long applicantId;
    private String fileName;
    private LocalDateTime uploadedAt;
}
