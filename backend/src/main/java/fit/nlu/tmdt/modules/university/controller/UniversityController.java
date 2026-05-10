package fit.nlu.tmdt.modules.university.controller;

import fit.nlu.tmdt.common.utils.ApiResponse;
import fit.nlu.tmdt.modules.university.dto.response.UniversityResponse;
import fit.nlu.tmdt.modules.university.service.UniversityService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/universities")
@RequiredArgsConstructor
public class UniversityController {

    private final UniversityService universityService;

    @GetMapping
    public ApiResponse<List<UniversityResponse>> getAll(
            @RequestParam(required = false) String province,
            @RequestParam(required = false) String district,
            @RequestParam(required = false) String keyword) {
        
        List<UniversityResponse> universities;
        if (keyword != null && !keyword.isBlank()) {
            universities = universityService.search(keyword);
        } else if (district != null && !district.isBlank()) {
            // Simplify: for now, search district in the address or district field
            universities = universityService.search(district); 
        } else if (province != null && !province.isBlank()) {
            universities = universityService.getByProvince(province);
        } else {
            universities = universityService.getAllActive();
        }
        
        return ApiResponse.success(universities);
    }

    @GetMapping("/{id}")
    public ApiResponse<UniversityResponse> getById(@PathVariable Long id) {
        return ApiResponse.success(universityService.getById(id));
    }
}
