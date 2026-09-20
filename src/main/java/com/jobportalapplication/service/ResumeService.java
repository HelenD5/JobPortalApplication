package com.jobportalapplication.service;

import com.jobportalapplication.dto.ResumeDTO;
import com.jobportalapplication.entity.*;
import com.jobportalapplication.exception.ForbiddenException;
import com.jobportalapplication.exception.ResourceNotFoundException;
import com.jobportalapplication.repository.ApplicationRepository;
import com.jobportalapplication.repository.ResumeRepository;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ResumeService {

    private final ResumeRepository resumeRepository;
    private final ApplicationRepository applicationRepository;
    private final FileStorageService fileStorageService;

    public ResumeService(ResumeRepository resumeRepository,
                         ApplicationRepository applicationRepository,
                         FileStorageService fileStorageService) {
        this.resumeRepository = resumeRepository;
        this.applicationRepository = applicationRepository;
        this.fileStorageService = fileStorageService;
    }

    @Transactional
    public ResumeDTO uploadResume(MultipartFile file, User applicant) {
        if (applicant.getRole() != RoleEnum.APPLICANT) {
            throw new ForbiddenException("Only applicants can upload resumes.");
        }

        String storedFileName = fileStorageService.storeFile(file);

        Resume resume = Resume.builder()
                .applicant(applicant)
                .fileName(file.getOriginalFilename() != null ? file.getOriginalFilename() : storedFileName)
                .filePath(storedFileName)
                .build();

        Resume savedResume = resumeRepository.save(resume);
        return mapToDTO(savedResume);
    }

    public List<ResumeDTO> getMyResumes(User applicant) {
        return resumeRepository.findByApplicantIdOrderByUploadedAtDesc(applicant.getId())
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public Resource downloadResume(Long resumeId, User currentUser) {
        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new ResourceNotFoundException("Resume not found with id: " + resumeId));

        if (currentUser.getRole() == RoleEnum.APPLICANT) {
            if (!resume.getApplicant().getId().equals(currentUser.getId())) {
                throw new ForbiddenException("You can only access your own resumes.");
            }
        } else if (currentUser.getRole() == RoleEnum.RECRUITER) {
            if (currentUser.getCompany() == null) {
                throw new ForbiddenException("Recruiter must belong to a company to access resumes.");
            }
            // Check if applicant applied to a job in recruiter's company with this resume
            boolean hasAppliedToCompany = applicationRepository.findByApplicantIdOrderByAppliedAtDesc(resume.getApplicant().getId())
                    .stream()
                    .anyMatch(app -> app.getJob().getCompany().getId().equals(currentUser.getCompany().getId()));

            if (!hasAppliedToCompany) {
                throw new ForbiddenException("You can only download resumes of applicants who applied to your company's jobs.");
            }
        } else if (currentUser.getRole() != RoleEnum.ADMIN) {
            throw new ForbiddenException("Unauthorized access to resume.");
        }

        return fileStorageService.loadFileAsResource(resume.getFilePath());
    }

    public ResumeDTO mapToDTO(Resume resume) {
        return ResumeDTO.builder()
                .id(resume.getId())
                .applicantId(resume.getApplicant().getId())
                .fileName(resume.getFileName())
                .uploadedAt(resume.getUploadedAt())
                .build();
    }
}
