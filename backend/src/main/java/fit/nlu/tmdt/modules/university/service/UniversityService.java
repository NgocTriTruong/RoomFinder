package fit.nlu.tmdt.modules.university.service;

import fit.nlu.tmdt.modules.university.dto.response.UniversityResponse;
import java.util.List;

public interface UniversityService {
    List<UniversityResponse> getAllActive();
    List<UniversityResponse> getByProvince(String province);
    List<UniversityResponse> search(String keyword);
    UniversityResponse getById(Long id);
}
