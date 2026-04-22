package fit.nlu.tmdt.modules.auth.repository;

import fit.nlu.tmdt.modules.auth.entity.User;
import fit.nlu.tmdt.modules.auth.entity.enums.UserRole;
import fit.nlu.tmdt.modules.auth.entity.enums.UserStatus;
import org.springframework.data.jpa.domain.Specification;

/**
 * User Specifications
 */
public final class UserSpecifications {

    private UserSpecifications() {
    }

    public static Specification<User> adminSearch(
            String search,
            String role,
            String status,
            String verificationStatus) {

        return (root, query, cb) -> {
            var predicates = cb.conjunction();

            predicates = cb.and(predicates, cb.isNull(root.get("deletedAt")));

            if (search != null && !search.isBlank()) {
                String like = "%" + search.trim().toLowerCase() + "%";
                predicates = cb.and(predicates, cb.or(
                        cb.like(cb.lower(root.get("fullName")), like),
                        cb.like(cb.lower(root.get("email")), like),
                        cb.like(cb.lower(root.get("phone")), like)
                ));
            }

            if (role != null && !role.isBlank()) {
                try {
                    UserRole userRole = UserRole.valueOf(role.trim().toUpperCase());
                    predicates = cb.and(predicates, cb.equal(root.get("role"), userRole));
                } catch (IllegalArgumentException ignored) {
                    // Ignore invalid role filter
                }
            }

            if (status != null && !status.isBlank()) {
                try {
                    UserStatus userStatus = UserStatus.valueOf(status.trim().toUpperCase());
                    predicates = cb.and(predicates, cb.equal(root.get("status"), userStatus));
                } catch (IllegalArgumentException ignored) {
                    // Ignore invalid status filter
                }
            }

            if (verificationStatus != null && !verificationStatus.isBlank()) {
                predicates = cb.and(predicates,
                        cb.equal(cb.upper(root.get("verificationStatus")), verificationStatus.trim().toUpperCase()));
            }

            return predicates;
        };
    }
}
