package fit.nlu.tmdt.modules.post;

import fit.nlu.tmdt.modules.post.dto.request.PostSearchParams;
import fit.nlu.tmdt.modules.post.entity.Post;
import fit.nlu.tmdt.modules.post.repository.PostRepository;
import fit.nlu.tmdt.modules.post.repository.PostSpecifications;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class PostSpecificationsTest {

    @Autowired
    private PostRepository postRepository;

    @Test
    public void testUniversityAliasNongLamMapping() {
        PostSearchParams params = new PostSearchParams();
        params.setKeyword("trọ gần nông lâm");

        Specification<Post> spec = PostSpecifications.withSearchParams(params);
        List<Post> results = postRepository.findAll(spec);

        // Nông lâm alias should map to nearbyUniversityId 1
        // Let's verify that all returned posts have nearbyUniversityId = 1
        assertFalse(results.isEmpty(), "Should find posts near Nông Lâm university");
        for (Post post : results) {
            assertEquals(1L, post.getRoom().getNearbyUniversityId(), 
                "Room should be associated with Nông Lâm university (ID 1)");
        }
    }

    @Test
    public void testUniversityAliasNluMapping() {
        PostSearchParams params = new PostSearchParams();
        params.setKeyword("nlu");

        Specification<Post> spec = PostSpecifications.withSearchParams(params);
        List<Post> results = postRepository.findAll(spec);

        assertFalse(results.isEmpty(), "Should find posts near NLU");
        for (Post post : results) {
            assertEquals(1L, post.getRoom().getNearbyUniversityId());
        }
    }

    @Test
    public void testUniversityAliasHcmuteMapping() {
        PostSearchParams params = new PostSearchParams();
        params.setKeyword("phòng trọ gần hcmute giá rẻ");

        Specification<Post> spec = PostSpecifications.withSearchParams(params);
        List<Post> results = postRepository.findAll(spec);

        assertFalse(results.isEmpty(), "Should find posts near HCMUTE");
        for (Post post : results) {
            assertEquals(2L, post.getRoom().getNearbyUniversityId());
        }
    }
}
