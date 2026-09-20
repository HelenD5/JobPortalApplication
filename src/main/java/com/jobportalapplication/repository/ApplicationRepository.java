package com.jobportalapplication.repository;

import com.jobportalapplication.entity.Application;
import com.jobportalapplication.entity.ApplicationStatusEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByApplicantIdOrderByAppliedAtDesc(Long applicantId);
    List<Application> findByJobIdOrderByScoreDesc(Long jobId);
    List<Application> findByJobCompanyIdOrderByAppliedAtDesc(Long companyId);
    Optional<Application> findByJobIdAndApplicantId(Long jobId, Long applicantId);

    Long countByApplicantIdAndStatus(Long applicantId, ApplicationStatusEnum status);
    Long countByJobCompanyIdAndStatus(Long companyId, ApplicationStatusEnum status);
    Long countByStatus(ApplicationStatusEnum status);
}
