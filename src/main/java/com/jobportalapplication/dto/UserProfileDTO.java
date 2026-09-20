package com.jobportalapplication.dto;

import com.jobportalapplication.entity.RoleEnum;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfileDTO {
    private Long id;
    private String name;
    private String email;
    private RoleEnum role;
    private Long companyId;
    private String companyName;
    private String phone;
    private String location;
    private String skills;
    private String education;
    private String experience;
    private LocalDateTime createdAt;
}
