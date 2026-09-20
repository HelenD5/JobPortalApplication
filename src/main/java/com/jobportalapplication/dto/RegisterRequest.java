package com.jobportalapplication.dto;

import com.jobportalapplication.entity.RoleEnum;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;

    @NotNull(message = "Role is required")
    private RoleEnum role;

    // Optional Recruiter company fields
    private Long companyId;
    private String companyName;
    private String companyEmail;
    private String companyDescription;
    private String companyWebsite;
    private String companyLocation;

    // Optional Applicant fields
    private String phone;
    private String location;
    private String skills;
    private String education;
    private String experience;
}
