import React, { useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  Modal,
  FlatList,
  Pressable,
  View,
} from 'react-native';
import { useLanguage } from '@/context/LanguageContext';
import { useColorScheme } from '@/components/useColorScheme';
import { Palette } from '@/constants/Colors';
import Ionicons from '@react-native-vector-icons/ionicons';

export interface LanguageItem {
  code: string;
  flag: string;
  label: string;
  name: string;
}

export const LANGUAGES: LanguageItem[] = [
  { code: 'en', flag: '🇬🇧', label: 'EN', name: 'English' },
  { code: 'vi', flag: '🇻🇳', label: 'VN', name: 'Tiếng Việt' },
  { code: 'ja', flag: '🇯🇵', label: 'JA', name: '日本語' },
  { code: 'fr', flag: '🇫🇷', label: 'FR', name: 'Français' },
];

export default function LanguageToggle() {
  const { locale, setLocale } = useLanguage();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Palette[colorScheme];
  const [modalVisible, setModalVisible] = useState(false);

  const currentLang = LANGUAGES.find((item) => item.code === locale) || LANGUAGES[0];

  const handleSelectLanguage = (code: string) => {
    setLocale(code);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Nút bấm Trigger mở Dropdown */}
      <TouchableOpacity
        style={[
          styles.triggerBtn,
          {
            backgroundColor: colors.surface2,
            borderColor: colors.border,
          },
        ]}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        <Text style={styles.flagText}>{currentLang.flag}</Text>
        <Text style={[styles.labelBtnText, { color: colors.ink }]}>
          {currentLang.label}
        </Text>
        <Ionicons
          name="chevron-down-outline"
          size={14}
          color={colors.inkMuted}
          style={{ marginLeft: 4 }}
        />
      </TouchableOpacity>

      {/* Modal danh sách Dropdown */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <View
            style={[
              styles.dropdownCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <FlatList
              data={LANGUAGES}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => {
                const isSelected = item.code === locale;
                return (
                  <TouchableOpacity
                    style={[
                      styles.optionRow,
                      isSelected && {
                        backgroundColor: colors.surface2,
                      },
                    ]}
                    onPress={() => handleSelectLanguage(item.code)}
                    activeOpacity={0.6}
                  >
                    <View style={styles.optionLeft}>
                      <Text style={styles.optionFlag}>{item.flag}</Text>
                      <Text
                        style={[
                          styles.optionName,
                          { color: colors.ink },
                          isSelected && { fontWeight: '700', color: colors.accent },
                        ]}
                      >
                        {item.name}
                      </Text>
                    </View>

                    {isSelected && (
                      <Ionicons
                        name="checkmark"
                        size={18}
                        color={colors.accent}
                      />
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginRight: 10,
  },
  triggerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  flagText: {
    fontSize: 14,
    marginRight: 6,
  },
  labelBtnText: {
    fontSize: 13,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 60,
    paddingRight: 16,
  },
  dropdownCard: {
    width: 170,
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginHorizontal: 4,
    marginVertical: 2,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionFlag: {
    fontSize: 16,
    marginRight: 10,
  },
  optionName: {
    fontSize: 14,
  },
});