package fit.nlu.tmdt.modules.room.service.impl;

import fit.nlu.tmdt.common.exceptions.BusinessException;
import fit.nlu.tmdt.common.utils.ErrorCode;
import fit.nlu.tmdt.modules.auth.entity.User;
import fit.nlu.tmdt.modules.auth.repository.UserRepository;
import fit.nlu.tmdt.modules.room.dto.request.CreateRoomRequest;
import fit.nlu.tmdt.modules.room.dto.request.UpdateRoomRequest;
import fit.nlu.tmdt.modules.room.dto.response.RoomResponse;
import fit.nlu.tmdt.modules.room.entity.Amenity;
import fit.nlu.tmdt.modules.room.entity.Room;
import fit.nlu.tmdt.modules.room.entity.enums.RoomDirection;
import fit.nlu.tmdt.modules.room.repository.AmenityRepository;
import fit.nlu.tmdt.modules.room.repository.RoomRepository;
import fit.nlu.tmdt.modules.room.service.RoomService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Room Service Implementation
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class RoomServiceImpl implements RoomService {

    private final RoomRepository roomRepository;
    private final AmenityRepository amenityRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public RoomResponse createRoom(CreateRoomRequest request, Long landlordId) {
        log.info("Creating room for landlord: {}", landlordId);

        User landlord = userRepository.findByIdAndDeletedAtIsNull(landlordId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_001, "User not found"));

        Room room = Room.builder()
                .landlord(landlord)
                .address(request.getAddress())
                .roomNumber(request.getRoomNumber())
                .province(request.getProvince())
                .district(request.getDistrict())
                .ward(request.getWard())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .area(request.getArea())
                .floor(request.getFloor())
                .maxOccupancy(request.getMaxOccupancy())
                .hasWindows(request.getHasWindows() != null ? request.getHasWindows() : true)
                .hasBalcony(request.getHasBalcony() != null ? request.getHasBalcony() : false)
                .thumbnailUrl(request.getThumbnailUrl())
                .images(request.getImages() != null ? request.getImages() : new ArrayList<>())
                .nearbyUniversityId(request.getNearbyUniversityId())
                .nearbyUniversityName(request.getNearbyUniversityName())
                .distanceToUniversity(request.getDistanceToUniversity())
                .nearestBusStation(request.getNearestBusStation())
                .isPetFriendly(request.getIsPetFriendly() != null ? request.getIsPetFriendly() : false)
                .isParkingAvailable(request.getIsParkingAvailable() != null ? request.getIsParkingAvailable() : false)
                .curfew(request.getCurfew())
                .rules(request.getRules())
                .viewCount(0)
                .favoriteCount(0)
                .build();

        if (request.getDirection() != null) {
            try {
                room.setDirection(RoomDirection.valueOf(request.getDirection()));
            } catch (IllegalArgumentException ignored) {
            }
        }

        if (request.getAmenityIds() != null && !request.getAmenityIds().isEmpty()) {
            List<Amenity> amenities = amenityRepository.findByIdIn(request.getAmenityIds());
            room.setAmenities(amenities);
        }

        room = roomRepository.save(room);
        log.info("Room created with ID: {}", room.getId());

        return toRoomResponse(room);
    }

    @Override
    @Transactional
    public RoomResponse updateRoom(Long roomId, UpdateRoomRequest request, Long landlordId) {
        log.info("Updating room: {} by landlord: {}", roomId, landlordId);

        Room room = roomRepository.findByIdAndDeletedAtIsNull(roomId)
                .orElseThrow(() -> new BusinessException("ROOM_001", "Room not found"));

        if (!room.getLandlord().getId().equals(landlordId)) {
            throw new BusinessException("ROOM_002", "You don't own this room");
        }

        if (request.getAddress() != null) room.setAddress(request.getAddress());
        if (request.getRoomNumber() != null) room.setRoomNumber(request.getRoomNumber());
        if (request.getProvince() != null) room.setProvince(request.getProvince());
        if (request.getDistrict() != null) room.setDistrict(request.getDistrict());
        if (request.getWard() != null) room.setWard(request.getWard());
        if (request.getLatitude() != null) room.setLatitude(request.getLatitude());
        if (request.getLongitude() != null) room.setLongitude(request.getLongitude());
        if (request.getArea() != null) room.setArea(request.getArea());
        if (request.getFloor() != null) room.setFloor(request.getFloor());
        if (request.getMaxOccupancy() != null) room.setMaxOccupancy(request.getMaxOccupancy());
        if (request.getHasWindows() != null) room.setHasWindows(request.getHasWindows());
        if (request.getHasBalcony() != null) room.setHasBalcony(request.getHasBalcony());
        if (request.getThumbnailUrl() != null) room.setThumbnailUrl(request.getThumbnailUrl());
        if (request.getImages() != null) room.setImages(request.getImages());
        if (request.getNearbyUniversityId() != null) room.setNearbyUniversityId(request.getNearbyUniversityId());
        if (request.getNearbyUniversityName() != null) room.setNearbyUniversityName(request.getNearbyUniversityName());
        if (request.getDistanceToUniversity() != null) room.setDistanceToUniversity(request.getDistanceToUniversity());
        if (request.getNearestBusStation() != null) room.setNearestBusStation(request.getNearestBusStation());
        if (request.getIsPetFriendly() != null) room.setIsPetFriendly(request.getIsPetFriendly());
        if (request.getIsParkingAvailable() != null) room.setIsParkingAvailable(request.getIsParkingAvailable());
        if (request.getCurfew() != null) room.setCurfew(request.getCurfew());
        if (request.getRules() != null) room.setRules(request.getRules());

        if (request.getDirection() != null) {
            try {
                room.setDirection(RoomDirection.valueOf(request.getDirection()));
            } catch (IllegalArgumentException ignored) {
            }
        }

        if (request.getAmenityIds() != null) {
            List<Amenity> amenities = amenityRepository.findByIdIn(request.getAmenityIds());
            room.setAmenities(amenities);
        }

        room = roomRepository.save(room);
        log.info("Room updated: {}", room.getId());

        return toRoomResponse(room);
    }

    @Override
    @Transactional
    public void deleteRoom(Long roomId, Long landlordId) {
        log.info("Deleting room: {} by landlord: {}", roomId, landlordId);

        Room room = roomRepository.findByIdAndDeletedAtIsNull(roomId)
                .orElseThrow(() -> new BusinessException("ROOM_001", "Room not found"));

        if (!room.getLandlord().getId().equals(landlordId)) {
            throw new BusinessException("ROOM_002", "You don't own this room");
        }

        room.softDelete();
        roomRepository.save(room);

        log.info("Room deleted: {}", roomId);
    }

    @Override
    public RoomResponse getRoomById(Long roomId) {
        Room room = roomRepository.findByIdAndDeletedAtIsNull(roomId)
                .orElseThrow(() -> new BusinessException("ROOM_001", "Room not found"));
        return toRoomResponse(room);
    }

    @Override
    public List<RoomResponse> getMyRooms(Long landlordId) {
        return roomRepository.findByLandlordIdAndDeletedAtIsNull(landlordId).stream()
                .map(this::toRoomResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public RoomResponse addAmenity(Long roomId, Long amenityId, Long landlordId) {
        Room room = roomRepository.findByIdAndDeletedAtIsNull(roomId)
                .orElseThrow(() -> new BusinessException("ROOM_001", "Room not found"));

        if (!room.getLandlord().getId().equals(landlordId)) {
            throw new BusinessException("ROOM_002", "You don't own this room");
        }

        Amenity amenity = amenityRepository.findById(amenityId)
                .orElseThrow(() -> new BusinessException("Room amenity not found"));

        room.addAmenity(amenity);
        room = roomRepository.save(room);

        return toRoomResponse(room);
    }

    @Override
    @Transactional
    public RoomResponse removeAmenity(Long roomId, Long amenityId, Long landlordId) {
        Room room = roomRepository.findByIdAndDeletedAtIsNull(roomId)
                .orElseThrow(() -> new BusinessException("ROOM_001", "Room not found"));

        if (!room.getLandlord().getId().equals(landlordId)) {
            throw new BusinessException("ROOM_002", "You don't own this room");
        }

        Amenity amenity = amenityRepository.findById(amenityId)
                .orElseThrow(() -> new BusinessException("Room amenity not found"));

        room.removeAmenity(amenity);
        room = roomRepository.save(room);

        return toRoomResponse(room);
    }

    @Override
    public List<Amenity> getAllAmenities() {
        return amenityRepository.findAll();
    }

    @Override
    public List<Amenity> getAmenitiesByCategory(String category) {
        return amenityRepository.findByCategory(category);
    }

    private RoomResponse toRoomResponse(Room room) {
        User landlord = room.getLandlord();

        List<RoomResponse.AmenityResponse> amenities = room.getAmenities().stream()
                .map(a -> RoomResponse.AmenityResponse.builder()
                        .id(a.getId())
                        .name(a.getName())
                        .icon(a.getIcon())
                        .category(a.getCategory())
                        .build())
                .collect(Collectors.toList());

        RoomResponse.LandlordSummary landlordSummary = RoomResponse.LandlordSummary.builder()
                .id(landlord.getId())
                .fullName(landlord.getFullName())
                .avatar(landlord.getAvatarUrl())
                .phone(landlord.getPhone())
                .build();

        return RoomResponse.builder()
                .id(room.getId())
                .roomNumber(room.getRoomNumber())
                .address(room.getAddress())
                .province(room.getProvince())
                .district(room.getDistrict())
                .ward(room.getWard())
                .latitude(room.getLatitude())
                .longitude(room.getLongitude())
                .area(room.getArea())
                .floor(room.getFloor())
                .maxOccupancy(room.getMaxOccupancy())
                .direction(room.getDirection() != null ? room.getDirection().name() : null)
                .hasWindows(room.getHasWindows())
                .hasBalcony(room.getHasBalcony())
                .thumbnailUrl(room.getThumbnailUrl())
                .images(room.getImages())
                .nearbyUniversityId(room.getNearbyUniversityId() != null ? room.getNearbyUniversityId().toString() : null)
                .nearbyUniversityName(room.getNearbyUniversityName())
                .distanceToUniversity(room.getDistanceToUniversity())
                .nearestBusStation(room.getNearestBusStation())
                .isPetFriendly(room.getIsPetFriendly())
                .isParkingAvailable(room.getIsParkingAvailable())
                .curfew(room.getCurfew())
                .rules(room.getRules())
                .viewCount(room.getViewCount())
                .favoriteCount(room.getFavoriteCount())
                .amenities(amenities)
                .landlord(landlordSummary)
                .createdAt(room.getCreatedAt())
                .updatedAt(room.getUpdatedAt())
                .build();
    }
}
