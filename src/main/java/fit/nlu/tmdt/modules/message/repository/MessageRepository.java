package fit.nlu.tmdt.modules.message.repository;

import fit.nlu.tmdt.modules.message.entity.Conversation;
import fit.nlu.tmdt.modules.message.entity.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Message Repository
 */
@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    @Query("""
            SELECT m FROM Message m 
            WHERE m.conversation.id = :conversationId 
            AND (m.deletedBySender = false OR m.deletedByReceiver = false)
            ORDER BY m.createdAt DESC
            """)
    Page<Message> findByConversationId(@Param("conversationId") Long conversationId, Pageable pageable);

    @Query("SELECT COUNT(m) FROM Message m WHERE m.conversation.id = :conversationId AND m.isRead = false AND m.sender.id != :userId")
    int countUnreadMessages(@Param("conversationId") Long conversationId, @Param("userId") Long userId);
}
