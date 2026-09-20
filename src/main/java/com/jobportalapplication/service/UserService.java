package com.jobportalapplication.service;

import com.jobportalapplication.dto.UserProfileDTO;
import com.jobportalapplication.entity.User;
import com.jobportalapplication.exception.ResourceNotFoundException;
import com.jobportalapplication.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserProfileDTO getProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        return mapToDTO(user);
    }

    @Transactional
    public UserProfileDTO updateProfile(Long userId, UserProfileDTO updateDTO) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (updateDTO.getName() != null) user.setName(updateDTO.getName());
        if (updateDTO.getPhone() != null) user.setPhone(updateDTO.getPhone());
        if (updateDTO.getLocation() != null) user.setLocation(updateDTO.getLocation());
        if (updateDTO.getSkills() != null) user.setSkills(updateDTO.getSkills());
        if (updateDTO.getEducation() != null) user.setEducation(updateDTO.getEducation());
        if (updateDTO.getExperience() != null) user.setExperience(updateDTO.getExperience());

        User updatedUser = userRepository.save(user);
        return mapToDTO(updatedUser);
    }

    public UserProfileDTO mapToDTO(User user) {
        return UserProfileDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .companyId(user.getCompany() != null ? user.getCompany().getId() : null)
                .companyName(user.getCompany() != null ? user.getCompany().getName() : null)
                .phone(user.getPhone())
                .location(user.getLocation())
                .skills(user.getSkills())
                .education(user.getEducation())
                .experience(user.getExperience())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
