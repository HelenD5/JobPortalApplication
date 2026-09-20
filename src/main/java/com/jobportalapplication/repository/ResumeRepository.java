package com.jobportalapplication.repository;

import com.jobportalapplication.entity.Resume;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResumeRepository extends JpaRepository<Resume, Long> {
    List<Resume> findByApplicantIdOrderByUploadedAtDesc(Long applicantId);
}
