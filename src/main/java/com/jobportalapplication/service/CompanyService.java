package com.jobportalapplication.service;

import com.jobportalapplication.dto.CompanyDTO;
import com.jobportalapplication.entity.Company;
import com.jobportalapplication.entity.CompanyStatusEnum;
import com.jobportalapplication.entity.User;
import com.jobportalapplication.exception.ForbiddenException;
import com.jobportalapplication.exception.ResourceNotFoundException;
import com.jobportalapplication.repository.CompanyRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CompanyService {

    private final CompanyRepository companyRepository;

    public CompanyService(CompanyRepository companyRepository) {
        this.companyRepository = companyRepository;
    }

    public CompanyDTO getCompanyById(Long companyId) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with id: " + companyId));
        return mapToDTO(company);
    }

    public List<CompanyDTO> getAllCompanies() {
        return companyRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public CompanyDTO updateCompany(Long companyId, CompanyDTO dto, User currentUser) {
        if (currentUser.getCompany() == null || !currentUser.getCompany().getId().equals(companyId)) {
            throw new ForbiddenException("You are not authorized to update this company's profile.");
        }

        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with id: " + companyId));

        if (dto.getName() != null) company.setName(dto.getName());
        if (dto.getEmail() != null) company.setEmail(dto.getEmail());
        if (dto.getDescription() != null) company.setDescription(dto.getDescription());
        if (dto.getWebsite() != null) company.setWebsite(dto.getWebsite());
        if (dto.getLocation() != null) company.setLocation(dto.getLocation());
        if (dto.getLogo() != null) company.setLogo(dto.getLogo());

        Company savedCompany = companyRepository.save(company);
        return mapToDTO(savedCompany);
    }

    @Transactional
    public CompanyDTO updateCompanyStatus(Long companyId, CompanyStatusEnum status) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with id: " + companyId));
        company.setStatus(status);
        Company savedCompany = companyRepository.save(company);
        return mapToDTO(savedCompany);
    }

    public CompanyDTO mapToDTO(Company company) {
        return CompanyDTO.builder()
                .id(company.getId())
                .name(company.getName())
                .email(company.getEmail())
                .description(company.getDescription())
                .website(company.getWebsite())
                .location(company.getLocation())
                .logo(company.getLogo())
                .status(company.getStatus())
                .createdAt(company.getCreatedAt())
                .build();
    }
}
