package fit.nlu.tmdt.modules.post.repository;

import fit.nlu.tmdt.modules.post.entity.Post;
import fit.nlu.tmdt.modules.post.entity.enums.PostStatus;
import fit.nlu.tmdt.modules.post.dto.request.PostSearchParams;
import fit.nlu.tmdt.common.utils.FuzzySearchUtils;
import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Order;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;
import java.util.ArrayList;
import java.util.List;

/**
 * Post Specifications for dynamic queries with fuzzy search
 */
public class PostSpecifications {

    private static class UniInfo {
        Long id;
        String name;
        double lat;
        double lon;

        UniInfo(Long id, String name, double lat, double lon) {
            this.id = id;
            this.name = name;
            this.lat = lat;
            this.lon = lon;
        }
    }

    private static final java.util.Map<Long, UniInfo> UNIVERSITY_MAP = java.util.Map.of(
        1L, new UniInfo(1L, "Trường Đại học Nông Lâm TP.HCM", 10.87002, 106.787687),
        2L, new UniInfo(2L, "Trường Đại học Sư phạm Kỹ thuật TP.HCM", 10.851419, 106.77197),
        3L, new UniInfo(3L, "Trường Đại học Công nghệ thông tin - ĐHQG TP.HCM", 10.870009, 106.803027),
        4L, new UniInfo(4L, "Trường Đại học Bách Khoa - ĐHQG TP.HCM (Cơ sở Dĩ An)", 10.880312, 106.80666),
        5L, new UniInfo(5L, "Trường Đại học Khoa học Tự nhiên - ĐHQG TP.HCM (Cơ sở Dĩ An)", 10.875647, 106.799732),
        6L, new UniInfo(6L, "Trường Đại học Quốc tế - ĐHQG TP.HCM", 10.877893, 106.801648),
        7L, new UniInfo(7L, "Trường Đại học Kinh tế TP.HCM (Cơ sở A)", 10.782787, 106.69612),
        8L, new UniInfo(8L, "Trường Đại học Ngoại thương - Cơ sở 2", 10.802194, 106.714498)
    );

    private static String cleanKeyword(String keyword, String matchedAlias) {
        if (keyword == null || keyword.isBlank()) {
            return "";
        }
        String clean = keyword.toLowerCase();
        
        // Remove matched alias
        clean = clean.replace(matchedAlias.toLowerCase(), "");
        
        // Remove common university prefixes
        clean = clean.replace("đại học", "")
                     .replace("dai hoc", "")
                     .replace("trường đh", "")
                     .replace("truong dh", "")
                     .replace("trường đại học", "")
                     .replace("truong dai hoc", "")
                     .replace("trường", "")
                     .replace("truong", "")
                     .replace("đh", "")
                     .replace("dh", "");
                     
        // Remove search prefix noise words
        clean = clean.replace("trọ gần", "")
                     .replace("tro gan", "")
                     .replace("phòng gần", "")
                     .replace("phong gan", "")
                     .replace("gần", "")
                     .replace("gan", "")
                     .replace("trọ", "")
                     .replace("tro", "")
                     .replace("phòng trọ", "")
                     .replace("phong tro", "")
                     .replace("phòng", "")
                     .replace("phong", "")
                     .replace("nhà trọ", "")
                     .replace("nha tro", "")
                     .replace("nhà", "")
                     .replace("nha", "")
                     .replace("cho thuê", "")
                     .replace("cho thue", "");
                     
        return clean.trim();
    }

    private static Predicate buildDistancePredicateForUni(jakarta.persistence.criteria.CriteriaBuilder cb,
                                                          Join<Post, fit.nlu.tmdt.modules.room.entity.Room> room,
                                                          double lat,
                                                          double lon,
                                                          double radiusKm) {
        double latDiff = radiusKm / 111.0;
        double lonDiff = radiusKm / (111.0 * Math.cos(Math.toRadians(lat)));
        
        double minLat = lat - latDiff;
        double maxLat = lat + latDiff;
        double minLon = lon - lonDiff;
        double maxLon = lon + lonDiff;
        
        return cb.and(
                cb.greaterThanOrEqualTo(room.get("latitude"), minLat),
                cb.lessThanOrEqualTo(room.get("latitude"), maxLat),
                cb.greaterThanOrEqualTo(room.get("longitude"), minLon),
                cb.lessThanOrEqualTo(room.get("longitude"), maxLon)
        );
    }

    public static Specification<Post> withSearchParams(PostSearchParams params) {
        return withSearchParams(params, false);
    }

    public static Specification<Post> withSearchParams(PostSearchParams params, boolean adminMode) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Status filter
            if (params.getStatus() != null) {
                predicates.add(cb.equal(root.get("status"), params.getStatus()));
            } else if (!adminMode) {
                predicates.add(cb.equal(root.get("status"), PostStatus.APPROVED));
            }

            // Price range
            if (params.getMinPrice() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("price"), params.getMinPrice()));
            }
            if (params.getMaxPrice() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("price"), params.getMaxPrice()));
            }

            // Area range
            Join<Post, fit.nlu.tmdt.modules.room.entity.Room> room = root.join("room");
            if (params.getMinArea() != null) {
                predicates.add(cb.greaterThanOrEqualTo(room.get("area"), params.getMinArea()));
            }
            if (params.getMaxArea() != null) {
                predicates.add(cb.lessThanOrEqualTo(room.get("area"), params.getMaxArea()));
            }

            // Floor filter
            if (params.getMinFloor() != null) {
                predicates.add(cb.greaterThanOrEqualTo(room.get("floor"), params.getMinFloor()));
            }
            if (params.getMaxFloor() != null) {
                predicates.add(cb.lessThanOrEqualTo(room.get("floor"), params.getMaxFloor()));
            }

            // Occupancy filter
            if (params.getMinOccupancy() != null) {
                predicates.add(cb.greaterThanOrEqualTo(room.get("maxOccupancy"), params.getMinOccupancy()));
            }

            // Location filters - fuzzy match
            if (params.getDistrict() != null && !params.getDistrict().isBlank()) {
                predicates.add(buildFuzzyLikePredicate(cb, room.get("district"), params.getDistrict()));
            }
            if (params.getProvince() != null && !params.getProvince().isBlank()) {
                predicates.add(buildFuzzyLikePredicate(cb, room.get("province"), params.getProvince()));
            }
            if (params.getWard() != null && !params.getWard().isBlank()) {
                predicates.add(buildFuzzyLikePredicate(cb, room.get("ward"), params.getWard()));
            }

            // Address fuzzy search
            if (params.getAddress() != null && !params.getAddress().isBlank()) {
                predicates.add(buildFuzzyLikePredicate(cb, room.get("address"), params.getAddress()));
            }

            // Geo-distance search
            if (params.hasLocationSearch() && params.getRadiusKm() != null) {
                predicates.add(buildDistancePredicate(cb, root, params));
            }

            // Boosted filter
            if (params.getIsBoosted() != null && params.getIsBoosted()) {
                predicates.add(cb.equal(root.get("isBoosted"), true));
                predicates.add(cb.greaterThan(root.get("boostedUntil"), java.time.LocalDateTime.now()));
            }

            // University alias mapping & detection from keyword
            Long detectedUniId = null;
            String cleanedKeyword = params.getKeyword();
            
            if (params.getKeyword() != null && !params.getKeyword().isBlank()) {
                String normalized = FuzzySearchUtils.normalizeForSearch(params.getKeyword());
                String matchedAlias = null;
                
                if (normalized.contains("nong lam") || normalized.contains("nlu")) {
                    detectedUniId = 1L;
                    matchedAlias = normalized.contains("nong lam") ? "nông lâm" : "nlu";
                } else if (normalized.contains("su pham ky thuat") || normalized.contains("spkt") || normalized.contains("hcmute") || normalized.contains("ute")) {
                    detectedUniId = 2L;
                    if (normalized.contains("su pham ky thuat")) matchedAlias = "sư phạm kỹ thuật";
                    else if (normalized.contains("spkt")) matchedAlias = "spkt";
                    else if (normalized.contains("hcmute")) matchedAlias = "hcmute";
                    else matchedAlias = "ute";
                } else if (normalized.contains("cong nghe thong tin") || normalized.contains("uit") || normalized.contains("cntt")) {
                    detectedUniId = 3L;
                    if (normalized.contains("cong nghe thong tin")) matchedAlias = "công nghệ thông tin";
                    else if (normalized.contains("uit")) matchedAlias = "uit";
                    else matchedAlias = "cntt";
                } else if (normalized.contains("bach khoa") || normalized.contains("hcmut")) {
                    detectedUniId = 4L;
                    matchedAlias = normalized.contains("bach khoa") ? "bách khoa" : "hcmut";
                } else if (normalized.contains("khoa hoc tu nhien") || normalized.contains("hcmus") || normalized.contains("khtn") || normalized.contains("tu nhien")) {
                    detectedUniId = 5L;
                    if (normalized.contains("khoa hoc tu nhien")) matchedAlias = "khoa học tự nhiên";
                    else if (normalized.contains("hcmus")) matchedAlias = "hcmus";
                    else if (normalized.contains("khtn")) matchedAlias = "khtn";
                    else matchedAlias = "tự nhiên";
                } else if (normalized.contains("quoc te") || normalized.contains("iu")) {
                    detectedUniId = 6L;
                    matchedAlias = normalized.contains("quoc te") ? "quốc tế" : "iu";
                } else if (normalized.contains("kinh te") || normalized.contains("ueh")) {
                    detectedUniId = 7L;
                    matchedAlias = normalized.contains("kinh te") ? "kinh tế" : "ueh";
                } else if (normalized.contains("ngoai thuong") || normalized.contains("ftu")) {
                    detectedUniId = 8L;
                    matchedAlias = normalized.contains("ngoai thuong") ? "ngoại thương" : "ftu";
                }
                
                if (detectedUniId != null) {
                    cleanedKeyword = cleanKeyword(params.getKeyword(), matchedAlias);
                }
            }

            // Apply Nearby university filter
            Long finalUniId = params.getNearbyUniversityId() != null ? params.getNearbyUniversityId() : detectedUniId;
            if (finalUniId != null) {
                predicates.add(cb.equal(room.get("nearbyUniversityId"), finalUniId));
                
                // Auto-apply geo-spatial filtering if not explicitly specified
                if (!params.hasLocationSearch()) {
                    UniInfo uniInfo = UNIVERSITY_MAP.get(finalUniId);
                    if (uniInfo != null) {
                        double radius = params.getRadiusKm() != null ? params.getRadiusKm() : 5.0;
                        predicates.add(buildDistancePredicateForUni(cb, room, uniInfo.lat, uniInfo.lon, radius));
                    }
                }
            }

            // Fuzzy keyword search
            if (cleanedKeyword != null && !cleanedKeyword.isBlank()) {
                predicates.add(buildFuzzyKeywordPredicate(cb, root, room, cleanedKeyword, params.getFuzzyModeOrDefault()));
            }

            // Amenities filter
            if (params.getAmenityIds() != null && !params.getAmenityIds().isEmpty()) {
                Join<fit.nlu.tmdt.modules.room.entity.Room, fit.nlu.tmdt.modules.room.entity.Amenity> amenities = 
                        room.join("amenities");
                
                if (Boolean.TRUE.equals(params.getMatchAnyAmenity())) {
                    predicates.add(amenities.get("id").in(params.getAmenityIds()));
                } else {
                    Subquery<Long> subquery = query.subquery(Long.class);
                    var subRoot = subquery.from(fit.nlu.tmdt.modules.room.entity.Amenity.class);
                    subquery.select(subRoot.get("id"))
                            .where(subRoot.get("id").in(params.getAmenityIds()));
                    predicates.add(cb.equal(amenities.get("id"), cb.any(subquery)));
                }
            }

            // Pet friendly filter
            if (params.getPetFriendly() != null && params.getPetFriendly()) {
                predicates.add(cb.equal(room.get("isPetFriendly"), true));
            }

            // Parking filter
            if (params.getParkingAvailable() != null && params.getParkingAvailable()) {
                predicates.add(cb.equal(room.get("isParkingAvailable"), true));
            }

            // Balcony filter
            if (params.getHasBalcony() != null && params.getHasBalcony()) {
                predicates.add(cb.equal(room.get("hasBalcony"), true));
            }

            // Windows filter
            if (params.getHasWindows() != null && params.getHasWindows()) {
                predicates.add(cb.equal(room.get("hasWindows"), true));
            }

            // Nearby university filter was handled above during alias checking

            // Rating filter
            if (params.getMinRating() != null) {
                Join<Post, fit.nlu.tmdt.modules.auth.entity.User> landlord = root.join("landlord");
                predicates.add(cb.greaterThanOrEqualTo(landlord.get("landlordRating"), params.getMinRating()));
            }

            // Sorting
            addSortOrder(cb, query, root, room, params);

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    /**
     * Build fuzzy LIKE predicate with accent removal
     */
    private static Predicate buildFuzzyLikePredicate(jakarta.persistence.criteria.CriteriaBuilder cb, 
                                                   jakarta.persistence.criteria.Path<String> path, 
                                                   String value) {
        String normalized = FuzzySearchUtils.normalizeForSearch(value);
        String pattern = "%" + normalized + "%";
        return cb.like(cb.function("unaccent", String.class, cb.lower(path)), pattern);
    }

    /**
     * Build distance-based predicate
     * Using simple bounding box approximation for distance filter
     */
    private static Predicate buildDistancePredicate(jakarta.persistence.criteria.CriteriaBuilder cb,
                                                   jakarta.persistence.criteria.Root<Post> root,
                                                   PostSearchParams params) {
        
        Join<Post, fit.nlu.tmdt.modules.room.entity.Room> room = root.join("room");
        
        double lat = params.getLatitude();
        double lon = params.getLongitude();
        double radiusKm = params.getRadiusKm();
        
        // Approximate 1 degree = 111km
        double latDiff = radiusKm / 111.0;
        double lonDiff = radiusKm / (111.0 * Math.cos(Math.toRadians(lat)));
        
        double minLat = lat - latDiff;
        double maxLat = lat + latDiff;
        double minLon = lon - lonDiff;
        double maxLon = lon + lonDiff;
        
        return cb.and(
                cb.greaterThanOrEqualTo(room.get("latitude"), minLat),
                cb.lessThanOrEqualTo(room.get("latitude"), maxLat),
                cb.greaterThanOrEqualTo(room.get("longitude"), minLon),
                cb.lessThanOrEqualTo(room.get("longitude"), maxLon)
        );
    }

    /**
     * Build fuzzy keyword search predicate
     */
    private static Predicate buildFuzzyKeywordPredicate(jakarta.persistence.criteria.CriteriaBuilder cb,
                                                       jakarta.persistence.criteria.Root<Post> root,
                                                       Join<Post, fit.nlu.tmdt.modules.room.entity.Room> room,
                                                       String keyword,
                                                       String fuzzyMode) {
        
        String normalizedKeyword = FuzzySearchUtils.normalizeForSearch(keyword);
        
        if (normalizedKeyword == null || normalizedKeyword.isBlank()) {
            return cb.conjunction();
        }

        jakarta.persistence.criteria.Path<String> titlePath = root.get("title");
        jakarta.persistence.criteria.Path<String> descPath = root.get("description");
        jakarta.persistence.criteria.Path<String> addressPath = room.get("address");
        jakarta.persistence.criteria.Path<String> uniNamePath = room.get("nearbyUniversityName");

        List<Predicate> keywordPredicates = new ArrayList<>();

        switch (fuzzyMode.toUpperCase()) {
            case "EXACT":
                String exactPattern = "%" + normalizedKeyword + "%";
                keywordPredicates.add(cb.like(cb.function("unaccent", String.class, cb.lower(titlePath)), exactPattern));
                keywordPredicates.add(cb.like(cb.function("unaccent", String.class, cb.lower(descPath)), exactPattern));
                keywordPredicates.add(cb.like(cb.function("unaccent", String.class, cb.lower(uniNamePath)), exactPattern));
                break;

            case "PREFIX":
                String prefixPattern = normalizedKeyword + "%";
                keywordPredicates.add(cb.like(cb.function("unaccent", String.class, cb.lower(titlePath)), prefixPattern));
                keywordPredicates.add(cb.like(cb.function("unaccent", String.class, cb.lower(descPath)), prefixPattern));
                keywordPredicates.add(cb.like(cb.function("unaccent", String.class, cb.lower(addressPath)), prefixPattern));
                keywordPredicates.add(cb.like(cb.function("unaccent", String.class, cb.lower(uniNamePath)), prefixPattern));
                break;

            case "ALL_WORDS":
                List<String> allWords = FuzzySearchUtils.splitWords(normalizedKeyword);
                for (String word : allWords) {
                    String wordPattern = "%" + word + "%";
                    Predicate titleWord = cb.like(cb.function("unaccent", String.class, cb.lower(titlePath)), wordPattern);
                    Predicate descWord = cb.like(cb.function("unaccent", String.class, cb.lower(descPath)), wordPattern);
                    Predicate uniWord = cb.like(cb.function("unaccent", String.class, cb.lower(uniNamePath)), wordPattern);
                    keywordPredicates.add(cb.or(titleWord, descWord, uniWord));
                }
                break;

            case "ANY_WORD":
                List<String> anyWords = FuzzySearchUtils.splitWords(normalizedKeyword);
                List<Predicate> anyWordPredicates = new ArrayList<>();
                for (String word : anyWords) {
                    String wordPattern = "%" + word + "%";
                    Predicate titleWord = cb.like(cb.function("unaccent", String.class, cb.lower(titlePath)), wordPattern);
                    Predicate descWord = cb.like(cb.function("unaccent", String.class, cb.lower(descPath)), wordPattern);
                    Predicate uniWord = cb.like(cb.function("unaccent", String.class, cb.lower(uniNamePath)), wordPattern);
                    anyWordPredicates.add(cb.or(titleWord, descWord, uniWord));
                }
                keywordPredicates.add(cb.or(anyWordPredicates.toArray(new Predicate[0])));
                break;

            case "PHRASE":
                String phrasePattern = "%" + normalizedKeyword.replace(" ", "%") + "%";
                keywordPredicates.add(cb.like(cb.function("unaccent", String.class, cb.lower(titlePath)), phrasePattern));
                keywordPredicates.add(cb.like(cb.function("unaccent", String.class, cb.lower(descPath)), phrasePattern));
                keywordPredicates.add(cb.like(cb.function("unaccent", String.class, cb.lower(uniNamePath)), phrasePattern));
                break;

            case "NORMAL":
            default:
                String normalPattern = "%" + normalizedKeyword + "%";
                keywordPredicates.add(cb.like(cb.function("unaccent", String.class, cb.lower(titlePath)), normalPattern));
                
                List<String> normalWords = FuzzySearchUtils.splitWords(normalizedKeyword);
                for (String word : normalWords) {
                    String wordPattern = "%" + word + "%";
                    keywordPredicates.add(cb.like(cb.function("unaccent", String.class, cb.lower(descPath)), wordPattern));
                }
                keywordPredicates.add(cb.like(cb.function("unaccent", String.class, cb.lower(addressPath)), normalPattern));
                keywordPredicates.add(cb.like(cb.function("unaccent", String.class, cb.lower(uniNamePath)), normalPattern));
                break;
        }

        return cb.or(keywordPredicates.toArray(new Predicate[0]));
    }

    /**
     * Add sort order based on params
     */
    private static void addSortOrder(jakarta.persistence.criteria.CriteriaBuilder cb,
                                    jakarta.persistence.criteria.CriteriaQuery<?> query,
                                    jakarta.persistence.criteria.Root<Post> root,
                                    Join<Post, fit.nlu.tmdt.modules.room.entity.Room> room,
                                    PostSearchParams params) {
        
        boolean ascending = "asc".equalsIgnoreCase(params.getSortDirectionOrDefault());
        String sortBy = params.getSortByOrDefault();
        List<Order> orders = new ArrayList<>();

        // Always boost boosted posts first
        orders.add(cb.desc(root.get("isBoosted")));

        switch (sortBy) {
            case "price":
                orders.add(ascending ? cb.asc(root.get("price")) : cb.desc(root.get("price")));
                break;
            case "viewcount":
            case "views":
                orders.add(ascending ? cb.asc(root.get("viewCount")) : cb.desc(root.get("viewCount")));
                break;
            case "favoritecount":
            case "favorites":
                orders.add(ascending ? cb.asc(root.get("favoriteCount")) : cb.desc(root.get("favoriteCount")));
                break;
            case "area":
                orders.add(ascending ? cb.asc(room.get("area")) : cb.desc(room.get("area")));
                break;
            case "rating":
                Join<Post, fit.nlu.tmdt.modules.auth.entity.User> landlord = root.join("landlord");
                orders.add(ascending ? cb.asc(landlord.get("landlordRating")) : cb.desc(landlord.get("landlordRating")));
                break;
            case "createdat":
            case "created":
            default:
                orders.add(ascending ? cb.asc(root.get("createdAt")) : cb.desc(root.get("createdAt")));
                break;
        }

        query.orderBy(orders);
    }

    public static Specification<Post> hasStatus(PostStatus status) {
        return (root, query, cb) -> status == null ? null : cb.equal(root.get("status"), status);
    }

    public static Specification<Post> isApproved() {
        return hasStatus(PostStatus.APPROVED);
    }
}
