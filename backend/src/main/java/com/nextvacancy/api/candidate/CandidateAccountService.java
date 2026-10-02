package com.nextvacancy.api.candidate;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import com.nextvacancy.api.auth.UserEntity;
import com.nextvacancy.api.auth.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CandidateAccountService {
    private final UserRepository users;
    private final CandidateProfileRepository profiles;
    private final CandidateNotificationRepository notifications;
    private final CandidateNotificationPreferenceRepository preferences;

    public CandidateAccountService(
            UserRepository users,
            CandidateProfileRepository profiles,
            CandidateNotificationRepository notifications,
            CandidateNotificationPreferenceRepository preferences) {
        this.users = users;
        this.profiles = profiles;
        this.notifications = notifications;
        this.preferences = preferences;
    }

    @Transactional(readOnly = true)
    public CandidateProfileResponse profile(String userId) {
        UserEntity user = users.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Candidate not found."));
        CandidateProfileEntity profile = profiles.findByUser_Id(userId)
                .orElseGet(() -> createProfile(user));
        return new CandidateProfileResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getMobile(),
                profile.getAvatarUrl(),
                profile.getPreferredState(),
                profile.getPreferredCategory(),
                profile.getQualification(),
                profile.isProfileVisible(),
                profile.isShowMobile(),
                user.getRole() == null || user.getRole().isBlank() ? "ACTIVE" : user.getRole(),
                profile.getUpdatedAt());
    }

    @Transactional
    public CandidateProfileResponse updateProfile(String userId, CandidateProfileRequest request) {
        UserEntity user = users.findByIdForUpdate(userId)
                .orElseThrow(() -> new EntityNotFoundException("Candidate not found."));
        if (request.fullName() != null) user.setFullName(request.fullName());
        if (request.email() != null) user.setEmail(request.email());
        if (request.mobile() != null) user.setMobile(request.mobile());
        CandidateProfileEntity profile = profiles.findByUser_Id(userId)
                .orElseGet(() -> createProfile(user));
        if (request.avatarUrl() != null) profile.setAvatarUrl(request.avatarUrl());
        if (request.preferredState() != null) profile.setPreferredState(request.preferredState());
        if (request.preferredCategory() != null) profile.setPreferredCategory(request.preferredCategory());
        if (request.qualification() != null) profile.setQualification(request.qualification());
        if (request.profileVisible() != null) profile.setProfileVisible(request.profileVisible());
        if (request.showMobile() != null) profile.setShowMobile(request.showMobile());
        profile.setUpdatedAt(OffsetDateTime.now());
        users.save(user);
        profiles.save(profile);
        return profile(userId);
    }

    @Transactional(readOnly = true)
    public List<CandidateNotificationResponse> listNotifications(String userId) {
        UserEntity user = users.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Candidate not found."));
        return notifications.findAllByUser_IdOrderByCreatedAtDesc(userId).stream()
                .map(notification -> new CandidateNotificationResponse(
                        notification.getId(),
                        notification.getCategory(),
                        notification.getTitle(),
                        notification.getMessage(),
                        notification.getLinkUrl(),
                        notification.isRead(),
                        notification.getCreatedAt(),
                        notification.getReadAt()))
                .toList();
    }

    @Transactional
    public CandidateNotificationResponse markNotificationRead(String userId, String notificationId) {
        CandidateNotificationEntity notification = notifications.findByIdAndUser_Id(notificationId, userId)
                .orElseThrow(() -> new EntityNotFoundException("Notification not found."));
        notification.markRead();
        notifications.save(notification);
        return new CandidateNotificationResponse(
                notification.getId(),
                notification.getCategory(),
                notification.getTitle(),
                notification.getMessage(),
                notification.getLinkUrl(),
                notification.isRead(),
                notification.getCreatedAt(),
                notification.getReadAt());
    }

    @Transactional(readOnly = true)
    public List<CandidateNotificationPreferenceResponse> listNotificationPreferences(String userId) {
        UserEntity user = users.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Candidate not found."));
        List<CandidateNotificationPreferenceEntity> current = preferences.findAllByUser_IdOrderByCategoryAsc(userId);
        Map<String, CandidateNotificationPreferenceEntity> byCategory = new LinkedHashMap<>();
        for (CandidateNotificationPreferenceEntity preference : current) {
            byCategory.put(preference.getCategory(), preference);
        }

        List<String> categories = List.of("govt_jobs", "private_jobs", "results", "admit_cards", "scholarships");
        List<CandidateNotificationPreferenceEntity> seeded = new ArrayList<>();
        for (String category : categories) {
            CandidateNotificationPreferenceEntity created = byCategory.get(category);
            if (created == null) {
                created = new CandidateNotificationPreferenceEntity(
                        UUID.randomUUID().toString(),
                        user,
                        category,
                        switch (category) {
                            case "govt_jobs" -> "Government jobs";
                            case "private_jobs" -> "Private jobs";
                            case "results" -> "Results";
                            case "admit_cards" -> "Admit cards";
                            default -> "Scholarships";
                        },
                        category.equals("govt_jobs") || category.equals("admit_cards") || category.equals("results"),
                        category.equals("govt_jobs") || category.equals("admit_cards"),
                        true);
                seeded.add(created);
            }
        }
        if (!seeded.isEmpty()) {
            preferences.saveAll(seeded);
            current = preferences.findAllByUser_IdOrderByCategoryAsc(userId);
        }

        return current.stream()
                .map(preference -> new CandidateNotificationPreferenceResponse(
                        preference.getId(),
                        preference.getCategory(),
                        preference.getLabel(),
                        preference.isEmailEnabled(),
                        preference.isWhatsappEnabled(),
                        preference.isPushEnabled(),
                        preference.getUpdatedAt()))
                .toList();
    }

    @Transactional
    public List<CandidateNotificationPreferenceResponse> updateNotificationPreferences(String userId,
            List<CandidateNotificationPreferenceRequest> request) {
        UserEntity user = users.findByIdForUpdate(userId)
                .orElseThrow(() -> new EntityNotFoundException("Candidate not found."));
        for (CandidateNotificationPreferenceRequest preferenceRequest : request) {
            CandidateNotificationPreferenceEntity preference = preferences.findByUser_IdAndCategory(userId, preferenceRequest.category())
                    .orElseGet(() -> new CandidateNotificationPreferenceEntity(
                            UUID.randomUUID().toString(),
                            user,
                            preferenceRequest.category(),
                            preferenceRequest.label() == null ? preferenceRequest.category() : preferenceRequest.label(),
                            false,
                            false,
                            true));
            if (preferenceRequest.label() != null) preference.setLabel(preferenceRequest.label());
            if (preferenceRequest.emailEnabled() != null) preference.setEmailEnabled(preferenceRequest.emailEnabled());
            if (preferenceRequest.whatsappEnabled() != null) preference.setWhatsappEnabled(preferenceRequest.whatsappEnabled());
            if (preferenceRequest.pushEnabled() != null) preference.setPushEnabled(preferenceRequest.pushEnabled());
            preference.setUpdatedAt(OffsetDateTime.now());
            preferences.save(preference);
        }
        return listNotificationPreferences(userId);
    }

    private CandidateProfileEntity createProfile(UserEntity user) {
        CandidateProfileEntity profile = new CandidateProfileEntity(UUID.randomUUID().toString(), user);
        profile.setProfileVisible(true);
        profile.setShowMobile(false);
        return profiles.save(profile);
    }
}
