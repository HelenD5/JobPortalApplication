package com.jobportalapplication.config;

import com.jobportalapplication.entity.*;
import com.jobportalapplication.repository.CompanyRepository;
import com.jobportalapplication.repository.JobRepository;
import com.jobportalapplication.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final JobRepository jobRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${admin.username:admin}")
    private String adminUsername;

    @Value("${admin.email:admin@jobportal.com}")
    private String adminEmail;

    @Value("${admin.password:helanadmin@24}")
    private String adminPassword;

    public DataInitializer(UserRepository userRepository,
                           CompanyRepository companyRepository,
                           JobRepository jobRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.companyRepository = companyRepository;
        this.jobRepository = jobRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // Seed Admin user
        if (userRepository.findByEmail(adminEmail).isEmpty()) {
            User admin = User.builder()
                    .name(adminUsername)
                    .email(adminEmail)
                    .password(passwordEncoder.encode(adminPassword))
                    .role(RoleEnum.ADMIN)
                    .build();
            userRepository.save(admin);
            System.out.println(">>> Admin account seeded successfully: " + adminEmail);
        }

        // Seed Demo Recruiter & Company if empty
        if (companyRepository.findByName("TechCorp Solutions").isEmpty()) {
            Company company = Company.builder()
                    .name("TechCorp Solutions")
                    .email("contact@techcorp.com")
                    .description("Leading innovative software engineering firm.")
                    .website("https://techcorp.example.com")
                    .location("San Francisco, CA")
                    .status(CompanyStatusEnum.ACTIVE)
                    .build();
            company = companyRepository.save(company);

            User recruiter = User.builder()
                    .name("Sarah Recruiter")
                    .email("recruiter@techcorp.com")
                    .password(passwordEncoder.encode("recruiter123"))
                    .role(RoleEnum.RECRUITER)
                    .company(company)
                    .phone("+1 555-0199")
                    .location("San Francisco, CA")
                    .build();
            recruiter = userRepository.save(recruiter);

            // Seed sample jobs
            Job job1 = Job.builder()
                    .company(company)
                    .createdBy(recruiter)
                    .title("Senior Backend Engineer (Java & Spring Boot)")
                    .description("We are seeking an experienced Java & Spring Boot engineer to join our cloud platform backend team.")
                    .requiredSkills("Java, Spring Boot, MySQL, REST API, Docker")
                    .location("Remote / San Francisco")
                    .experience("3-5 Years")
                    .salary("$120,000 - $150,000")
                    .employmentType(EmploymentTypeEnum.FULL_TIME)
                    .deadline(LocalDate.now().plusDays(30))
                    .status(JobStatusEnum.PUBLISHED)
                    .build();

            Job job2 = Job.builder()
                    .company(company)
                    .createdBy(recruiter)
                    .title("Full Stack Web Developer (Java + React)")
                    .description("Build modern web interfaces with React and Java Spring Boot backend services.")
                    .requiredSkills("Java, Spring Boot, MySQL, React, JavaScript, CSS")
                    .location("San Francisco, CA")
                    .experience("2-4 Years")
                    .salary("$100,000 - $130,000")
                    .employmentType(EmploymentTypeEnum.FULL_TIME)
                    .deadline(LocalDate.now().plusDays(45))
                    .status(JobStatusEnum.PUBLISHED)
                    .build();

            jobRepository.save(job1);
            jobRepository.save(job2);
            System.out.println(">>> Demo company, recruiter, and jobs seeded successfully.");
        }

        // Seed Demo Applicant if empty
        if (userRepository.findByEmail("applicant@example.com").isEmpty()) {
            User applicant = User.builder()
                    .name("Alex Applicant")
                    .email("applicant@example.com")
                    .password(passwordEncoder.encode("applicant123"))
                    .role(RoleEnum.APPLICANT)
                    .phone("+1 555-0122")
                    .location("Austin, TX")
                    .skills("Java, Spring Boot, MySQL, React, JavaScript")
                    .education("B.S. in Computer Science - UT Austin")
                    .experience("3 years as Software Developer")
                    .build();
            userRepository.save(applicant);
            System.out.println(">>> Demo applicant seeded successfully.");
        }
    }
}
