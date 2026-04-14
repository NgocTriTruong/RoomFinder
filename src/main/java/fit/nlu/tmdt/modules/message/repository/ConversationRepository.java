package fit.nlu.tmdt.modules.message.repository;

import fit.nlu.tmdt.modules.message.entity.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Conversation Repository
 */
@Repository
public interface ConversationRepository extends JpaRepository<Conversation, Long> {

    @Query("""
            SELECT c FROM Conversation c 
            WHERE (c.user1.id = :userId OR c.user2.id = :userId) 
            AND c.deletedAt IS NULL
            ORDER BY c.lastMessageAt DESC
            """)
    List<Conversation> findByUserId(@Param("userId") Long userId);

    @Query("""
            SELECT c FROM Conversation c 
            WHERE ((c.user1.id = :user1Id AND c.user2.id = :user2Id) 
            OR (c.user1.id = :user2Id AND c.user2.id = :user1Id))
            AND c.deletedAt IS NULL
            """)
    Optional<Conversation> findByTwoUsers(@Param("user1Id") Long user1Id, @Param("user2Id") Long user2Id);

    @Query("""
            SELECT c FROM Conversation c 
            WHERE c.postId = :postId 
            AND ((c.user1.id = :userId1 AND c.user2.id = :userId2) 
            OR (c.user1.id = :userId2 AND c.user2.id = :userId1))
            AND c.deletedAt IS NULL
            """)
    Optional<Conversation> findByPostAndUsers(@Param("postId") Long postId, @Param("userId1") Long userId1, @Param("userId2") Long userId2);
}
