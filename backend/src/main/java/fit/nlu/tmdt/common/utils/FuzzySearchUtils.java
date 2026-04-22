package fit.nlu.tmdt.common.utils;

import java.text.Normalizer;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

/**
 * Fuzzy Search Utilities
 * Hỗ trợ tìm kiếm gần đúng cho tiếng Việt
 */
public class FuzzySearchUtils {

    private static final Pattern DIACRITICS_PATTERN = 
            Pattern.compile("\\p{InCombiningDiacriticalMarks}+");

    private static final Pattern VIETNAMESE_CHAR_PATTERN = 
            Pattern.compile("[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]");

    /**
     * Loại bỏ dấu tiếng Việt
     */
    public static String removeDiacritics(String text) {
        if (text == null || text.isEmpty()) {
            return text;
        }
        
        String normalized = Normalizer.normalize(text, Normalizer.Form.NFD);
        String removed = DIACRITICS_PATTERN.matcher(normalized).replaceAll("");
        
        return removed.toLowerCase();
    }

    /**
     * Kiểm tra xem text có chứa keyword không (không phân biệt dấu)
     */
    public static boolean containsIgnoreAccent(String text, String keyword) {
        if (text == null || keyword == null) {
            return false;
        }
        return removeDiacritics(text).contains(removeDiacritics(keyword).toLowerCase());
    }

    /**
     * Kiểm tra xem text có match với keyword gần đúng không
     * Sử dụng Levenshtein distance
     */
    public static boolean fuzzyMatch(String text, String keyword, int maxDistance) {
        if (text == null || keyword == null) {
            return false;
        }
        
        String normalizedText = removeDiacritics(text).toLowerCase().trim();
        String normalizedKeyword = removeDiacritics(keyword).toLowerCase().trim();
        
        // Exact match
        if (normalizedText.contains(normalizedKeyword)) {
            return true;
        }
        
        // Word-by-word fuzzy match
        List<String> textWords = splitWords(normalizedText);
        List<String> keywordWords = splitWords(normalizedKeyword);
        
        for (String kw : keywordWords) {
            boolean wordMatched = false;
            for (String tw : textWords) {
                if (fuzzyMatchWords(tw, kw, maxDistance)) {
                    wordMatched = true;
                    break;
                }
            }
            if (!wordMatched) {
                return false;
            }
        }
        
        return true;
    }

    /**
     * Fuzzy match giữa 2 từ
     */
    public static boolean fuzzyMatchWords(String word1, String word2, int maxDistance) {
        if (word1 == null || word2 == null) {
            return false;
        }
        
        // Exact match
        if (word1.equals(word2)) {
            return true;
        }
        
        // Length difference too large
        if (Math.abs(word1.length() - word2.length()) > maxDistance) {
            return false;
        }
        
        // Levenshtein distance
        int distance = levenshteinDistance(word1, word2);
        return distance <= maxDistance;
    }

    /**
     * Tính Levenshtein distance giữa 2 chuỗi
     */
    public static int levenshteinDistance(String s1, String s2) {
        if (s1 == null || s2 == null) {
            return Integer.MAX_VALUE;
        }
        
        int len1 = s1.length();
        int len2 = s2.length();
        
        if (len1 == 0) return len2;
        if (len2 == 0) return len1;
        
        int[][] dp = new int[len1 + 1][len2 + 1];
        
        for (int i = 0; i <= len1; i++) {
            dp[i][0] = i;
        }
        for (int j = 0; j <= len2; j++) {
            dp[0][j] = j;
        }
        
        for (int i = 1; i <= len1; i++) {
            for (int j = 1; j <= len2; j++) {
                int cost = (s1.charAt(i - 1) == s2.charAt(j - 1)) ? 0 : 1;
                dp[i][j] = Math.min(
                        Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1),
                        dp[i - 1][j - 1] + cost
                );
            }
        }
        
        return dp[len1][len2];
    }

    /**
     * Tính độ tương đồng (0.0 - 1.0)
     */
    public static double similarity(String s1, String s2) {
        if (s1 == null || s2 == null) {
            return 0.0;
        }
        
        if (s1.isEmpty() && s2.isEmpty()) {
            return 1.0;
        }
        
        int distance = levenshteinDistance(s1, s2);
        int maxLen = Math.max(s1.length(), s2.length());
        
        return 1.0 - ((double) distance / maxLen);
    }

    /**
     * Tách từ từ chuỗi
     */
    public static List<String> splitWords(String text) {
        if (text == null || text.isEmpty()) {
            return List.of();
        }
        
        return Arrays.stream(text.split("\\s+"))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());
    }

    /**
     * Tạo pattern cho regex tìm kiếm gần đúng
     * Ví dụ: "phong tro" -> "(phong.*tro|tro.*phong)"
     */
    public static String buildFuzzyPattern(String keyword) {
        List<String> words = splitWords(keyword);
        if (words.isEmpty()) {
            return keyword;
        }
        
        if (words.size() == 1) {
            return words.get(0);
        }
        
        // Build pattern: allows any order of words
        String pattern = String.join(".*", words);
        return pattern;
    }

    /**
     * Chuẩn hóa text cho search
     */
    public static String normalizeForSearch(String text) {
        if (text == null) {
            return null;
        }
        return removeDiacritics(text).toLowerCase().trim();
    }

    /**
     * Tạo search tokens từ keyword
     */
    public static List<String> generateSearchTokens(String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return List.of();
        }
        
        String normalized = normalizeForSearch(keyword);
        List<String> tokens = splitWords(normalized);
        
        return tokens;
    }

    /**
     * Kiểm tra có match với prefix không
     * Ví dụ: "phong" match với "phong tro"
     */
    public static boolean prefixMatch(String text, String prefix) {
        if (text == null || prefix == null) {
            return false;
        }
        
        String normalizedText = normalizeForSearch(text);
        String normalizedPrefix = normalizeForSearch(prefix);
        
        return normalizedText.startsWith(normalizedPrefix) || 
               normalizedText.contains(" " + normalizedPrefix);
    }

    /**
     * Tạo trigram pattern cho PostgreSQL pg_trgm
     */
    public static String toTrigramPattern(String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return "%";
        }
        
        String normalized = normalizeForSearch(keyword);
        // Add % at start and end, and between words
        String withWildcards = normalized.replaceAll("\\s+", "%");
        return "%" + withWildcards + "%";
    }
}
