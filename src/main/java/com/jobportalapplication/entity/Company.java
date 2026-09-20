package com.jobportalapplication.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "companies")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String email;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String website;

    private String location;

    private String logo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CompanyStatusEnum status;

    private LocalDateTime createdAt;

    @PrePersist
    public void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (status == null) {
            status = CompanyStatusEnum.ACTIVE;
        }
    }
}
