package fit.nlu.tmdt.modules.post.repository;

import fit.nlu.tmdt.modules.post.entity.Post;
import fit.nlu.tmdt.modules.post.entity.enums.PostStatus;
import fit.nlu.tmdt.modules.post.dto.request.PostSearchParams;
import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;

/**
 * Post Specifications for dynamic queries
 */
public class PostSpecifications {

    public static Specification<Post> withSearchParams(PostSearchParams params) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Status filter
            if (params.getStatus() != null) {
                predicates.add(cb.equal(root.get("status"), params.getStatus()));
            }

            // Price range
            if (params.getMinPrice() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("price"), params.getMinPrice()));
            }
            if (params.getMaxPrice() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("price"), params.getMaxPrice()));
            }

            // Area range
            if (params.getMinArea() != null || params.getMaxArea() != null) {
                Join<Post, fit.nlu.tmdt.modules.room.entity.Room> room = root.join("room");
                if (params.getMinArea() != null) {
                    predicates.add(cb.greaterThanOrEqualTo(room.get("area"), params.getMinArea()));
                }
                if (params.getMaxArea() != null) {
                    predicates.add(cb.lessThanOrEqualTo(room.get("area"), params.getMaxArea()));
                }
            }

            // District filter
            if (params.getDistrict() != null && !params.getDistrict().isBlank()) {
                Join<Post, fit.nlu.tmdt.modules.room.entity.Room> room = root.join("room");
                predicates.add(cb.like(cb.lower(room.get("district")), 
                        "%" + params.getDistrict().toLowerCase() + "%"));
            }

            // Province filter
            if (params.getProvince() != null && !params.getProvince().isBlank()) {
                Join<Post, fit.nlu.tmdt.modules.room.entity.Room> room = root.join("room");
                predicates.add(cb.like(cb.lower(room.get("province")), 
                        "%" + params.getProvince().toLowerCase() + "%"));
            }

            // Boosted filter
            if (params.getIsBoosted() != null && params.getIsBoosted()) {
                predicates.add(cb.equal(root.get("isBoosted"), true));
                predicates.add(cb.greaterThan(root.get("boostedUntil"), java.time.LocalDateTime.now()));
            }

            // Keyword search
            if (params.getKeyword() != null && !params.getKeyword().isBlank()) {
                String keyword = "%" + params.getKeyword().toLowerCase() + "%";
                Predicate titleMatch = cb.like(cb.lower(root.get("title")), keyword);
                Predicate descMatch = cb.like(cb.lower(root.get("description")), keyword);
                predicates.add(cb.or(titleMatch, descMatch));
            }

            // Boosted posts should be sorted first
            query.orderBy(
                    cb.desc(root.get("isBoosted")),
                    cb.desc(root.get("createdAt"))
            );

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    public static Specification<Post> hasStatus(PostStatus status) {
        return (root, query, cb) -> status == null ? null : cb.equal(root.get("status"), status);
    }

    public static Specification<Post> isApproved() {
        return hasStatus(PostStatus.APPROVED);
    }
}
