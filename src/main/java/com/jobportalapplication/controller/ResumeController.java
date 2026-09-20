package com.jobportalapplication.controller;

import com.jobportalapplication.dto.ResumeDTO;
import com.jobportalapplication.security.CustomUserDetails;
import com.jobportalapplication.service.ResumeService;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/resumes")
public class ResumeController {

    private final ResumeService resumeService;

    public ResumeController(ResumeService resumeService) {
        this.resumeService = resumeService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('APPLICANT')")
    public ResponseEntity<ResumeDTO> uploadResume(@RequestParam("file") MultipartFile file,
                                                  @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(resumeService.uploadResume(file, userDetails.getUser()));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('APPLICANT')")
    public ResponseEntity<List<ResumeDTO>> getMyResumes(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(resumeService.getMyResumes(userDetails.getUser()));
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> downloadResume(@PathVariable Long id,
                                                   @AuthenticationPrincipal CustomUserDetails userDetails) {
        Resource resource = resumeService.downloadResume(id, userDetails.getUser());
        String filename = resource.getFilename() != null ? resource.getFilename() : "resume.pdf";

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .body(resource);
    }
}
