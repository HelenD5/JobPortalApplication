package com.jobportalapplication.service;

import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ResumeMatchingService {

    /**
     * Calculates skill matching percentage between job required skills and applicant profile skills.
     * Case-insensitive exact/substring skill matching.
     *
     * @param requiredSkillsStr comma-separated required skills from job
     * @param applicantSkillsStr comma-separated applicant skills from user profile
     * @return percentage matching score (0.0 to 100.0)
     */
    public double calculateMatchingScore(String requiredSkillsStr, String applicantSkillsStr) {
        if (requiredSkillsStr == null || requiredSkillsStr.trim().isEmpty()) {
            return 100.0;
        }
        if (applicantSkillsStr == null || applicantSkillsStr.trim().isEmpty()) {
            return 0.0;
        }

        Set<String> requiredSkills = Arrays.stream(requiredSkillsStr.split(","))
                .map(String::trim)
                .map(String::toLowerCase)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toSet());

        if (requiredSkills.isEmpty()) {
            return 100.0;
        }

        Set<String> applicantSkills = Arrays.stream(applicantSkillsStr.split(","))
                .map(String::trim)
                .map(String::toLowerCase)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toSet());

        long matchCount = requiredSkills.stream()
                .filter(reqSkill -> applicantSkills.stream().anyMatch(appSkill -> 
                    appSkill.equals(reqSkill) || appSkill.contains(reqSkill) || reqSkill.contains(appSkill)
                ))
                .count();

        double score = ((double) matchCount / (double) requiredSkills.size()) * 100.0;
        return Math.round(score * 10.0) / 10.0; // Round to 1 decimal place
    }
}
