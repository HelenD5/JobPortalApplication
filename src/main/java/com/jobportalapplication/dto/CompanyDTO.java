package com.jobportalapplication.dto;

import com.jobportalapplication.entity.CompanyStatusEnum;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompanyDTO {
    private Long id;
    private String name;
    private String email;
    private String description;
    private String website;
    private String location;
    private String logo;
    private CompanyStatusEnum status;
    private LocalDateTime createdAt;
}
