package fit.nlu.tmdt.modules.room.service;

import fit.nlu.tmdt.modules.room.dto.request.CreateRoomRequest;
import fit.nlu.tmdt.modules.room.dto.request.UpdateRoomRequest;
import fit.nlu.tmdt.modules.room.dto.response.RoomResponse;
import fit.nlu.tmdt.modules.room.entity.Amenity;
import fit.nlu.tmdt.modules.room.entity.Room;

import java.util.List;

/**
 * Room Service Interface
 */
public interface RoomService {

    RoomResponse createRoom(CreateRoomRequest request, Long landlordId);

    RoomResponse updateRoom(Long roomId, UpdateRoomRequest request, Long landlordId);

    void deleteRoom(Long roomId, Long landlordId);

    RoomResponse getRoomById(Long roomId);

    List<RoomResponse> getMyRooms(Long landlordId);

    RoomResponse addAmenity(Long roomId, Long amenityId, Long landlordId);

    RoomResponse removeAmenity(Long roomId, Long amenityId, Long landlordId);

    List<Amenity> getAllAmenities();

    List<Amenity> getAmenitiesByCategory(String category);
}
