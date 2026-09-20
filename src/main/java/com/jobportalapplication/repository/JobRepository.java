package com.jobportalapplication.repository;

import com.jobportalapplication.entity.EmploymentTypeEnum;
import com.jobportalapplication.entity.Job;
import com.jobportalapplication.entity.JobStatusEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByCompanyId(Long companyId);
    List<Job> findByStatus(JobStatusEnum status);
    Long countByStatus(JobStatusEnum status);

    @Query("SELECT j FROM Job j WHERE j.status = :status AND " +
           "(:search IS NULL OR LOWER(j.title) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(j.requiredSkills) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(j.description) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:location IS NULL OR LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
           "(:employmentType IS NULL OR j.employmentType = :employmentType) AND " +
           "(:experience IS NULL OR LOWER(j.experience) LIKE LOWER(CONCAT('%', :experience, '%')))")
    List<Job> searchJobs(@Param("status") JobStatusEnum status,
                         @Param("search") String search,
                         @Param("location") String location,
                         @Param("employmentType") EmploymentTypeEnum employmentType,
                         @Param("experience") String experience);
}
