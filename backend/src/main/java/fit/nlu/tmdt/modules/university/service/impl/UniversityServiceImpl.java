package fit.nlu.tmdt.modules.university.service.impl;

import fit.nlu.tmdt.modules.university.dto.response.UniversityResponse;
import fit.nlu.tmdt.modules.university.entity.University;
import fit.nlu.tmdt.modules.university.repository.UniversityRepository;
import fit.nlu.tmdt.modules.university.service.UniversityService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UniversityServiceImpl implements UniversityService {

    private final UniversityRepository universityRepository;

    @Override
    public List<UniversityResponse> getAllActive() {
        return universityRepository.findByIsActiveTrue().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<UniversityResponse> getByProvince(String province) {
        return universityRepository.findByProvinceAndIsActiveTrue(province).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<UniversityResponse> search(String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return getAllActive();
        }
        return universityRepository.searchUniversities(keyword).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public UniversityResponse getById(Long id) {
        return universityRepository.findById(id)
                .map(this::mapToResponse)
                .orElse(null);
    }

    private UniversityResponse mapToResponse(University university) {
        return UniversityResponse.builder()
                .id(university.getId())
                .name(university.getName())
                .abbreviation(university.getAbbreviation())
                .address(university.getAddress())
                .province(university.getProvince())
                .district(university.getDistrict())
                .latitude(university.getLatitude())
                .longitude(university.getLongitude())
                .logoUrl(university.getLogoUrl())
                .build();
    }
}
