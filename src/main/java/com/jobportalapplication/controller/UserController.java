package com.jobportalapplication.controller;

import com.jobportalapplication.dto.UserProfileDTO;
import com.jobportalapplication.security.CustomUserDetails;
import com.jobportalapplication.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/profile")
    public ResponseEntity<UserProfileDTO> getProfile(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(userService.getProfile(userDetails.getUser().getId()));
    }

    @PutMapping("/profile")
    public ResponseEntity<UserProfileDTO> updateProfile(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                        @RequestBody UserProfileDTO updateDTO) {
        return ResponseEntity.ok(userService.updateProfile(userDetails.getUser().getId(), updateDTO));
    }
}
