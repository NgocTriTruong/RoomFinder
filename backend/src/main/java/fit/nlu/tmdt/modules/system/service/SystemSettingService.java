package fit.nlu.tmdt.modules.system.service;

import fit.nlu.tmdt.modules.system.entity.SystemSetting;
import java.util.List;
import java.util.Map;

public interface SystemSettingService {
    List<SystemSetting> getAllSettings();
    Map<String, String> getSettingsMap();
    void updateSettings(Map<String, String> settings);
    String getSettingValue(String key, String defaultValue);
    void initDefaultSettings();
}
