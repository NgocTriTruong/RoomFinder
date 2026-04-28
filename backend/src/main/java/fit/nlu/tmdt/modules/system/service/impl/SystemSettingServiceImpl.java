package fit.nlu.tmdt.modules.system.service.impl;

import fit.nlu.tmdt.modules.system.entity.SystemSetting;
import fit.nlu.tmdt.modules.system.repository.SystemSettingRepository;
import fit.nlu.tmdt.modules.system.service.SystemSettingService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class SystemSettingServiceImpl implements SystemSettingService {

    private final SystemSettingRepository repository;

    @Override
    public List<SystemSetting> getAllSettings() {
        return repository.findAll();
    }

    @Override
    public Map<String, String> getSettingsMap() {
        return repository.findAll().stream()
                .collect(Collectors.toMap(SystemSetting::getKey, SystemSetting::getValue));
    }

    @Override
    @Transactional
    public void updateSettings(Map<String, String> settings) {
        for (Map.Entry<String, String> entry : settings.entrySet()) {
            repository.findByKey(entry.getKey()).ifPresent(setting -> {
                setting.setValue(entry.getValue());
                repository.save(setting);
                log.info("Updated system setting: {} = {}", entry.getKey(), entry.getValue());
            });
        }
    }

    @Override
    public String getSettingValue(String key, String defaultValue) {
        return repository.findByKey(key)
                .map(SystemSetting::getValue)
                .orElse(defaultValue);
    }

    @Override
    @Transactional
    @PostConstruct
    public void initDefaultSettings() {
        if (repository.count() > 0) {
            return;
        }

        log.info("Initializing default system settings...");
        List<SystemSetting> defaults = Arrays.asList(
            // General
            SystemSetting.builder().key("site_name").value("RoomFinder.vn").group("general").type("text").description("Tên website").build(),
            SystemSetting.builder().key("support_email").value("support@roomfinder.vn").group("general").type("email").description("Email hỗ trợ").build(),
            SystemSetting.builder().key("hotline").value("1900 1234").group("general").type("text").description("Số điện thoại hotline").build(),
            
            // Security
            SystemSetting.builder().key("token_expiration").value("24").group("security").type("number").description("Thời hạn Token (giờ)").build(),
            SystemSetting.builder().key("max_login_attempts").value("5").group("security").type("number").description("Số lần đăng nhập sai tối đa").build(),
            SystemSetting.builder().key("require_strong_password").value("true").group("security").type("checkbox").description("Yêu cầu mật khẩu mạnh").build(),
            
            // Notifications
            SystemSetting.builder().key("notify_new_post").value("true").group("notifications").type("checkbox").description("Gửi email khi có tin đăng mới").build(),
            SystemSetting.builder().key("notify_report").value("true").group("notifications").type("checkbox").description("Gửi email khi có báo cáo vi phạm").build(),
            SystemSetting.builder().key("auto_approve_post").value("false").group("notifications").type("checkbox").description("Tự động duyệt tin").build()
        );

        repository.saveAll(defaults);
        log.info("Default system settings initialized.");
    }
}
