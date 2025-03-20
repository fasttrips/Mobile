import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList, TextInput } from 'react-native';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS, FONT_FAMILIES, COMPONENT_STYLES } from '../lib/constants';
import Ionicons from 'react-native-vector-icons/Ionicons';

const DropdownSearchComponent = ({ label, items, value, onValueChange, placeholder, iconName, iconNameDes, style, ...props }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSelectItem = (item) => {
    onValueChange(item.value);
    setModalVisible(false);
  };

  const filteredItems = items.filter(item => item.label.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity style={styles.dropdown} onPress={() => setModalVisible(true)}>
        {iconNameDes && (
          <Ionicons name={iconNameDes} size={24} color={COLORS.text} />
        )}
        <View style={COMPONENT_STYLES.spacer} />
        <Text style={styles.dropdownText}>
          {value ? items.find(item => item.value === value)?.label : placeholder?.label}
        </Text>
        <View style={{ flex: 1 }}></View>
        {iconName && (
          <Ionicons name={iconName} size={24} color={COLORS.text} />
        )}
      </TouchableOpacity>
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <FlatList
              data={filteredItems}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.item} onPress={() => handleSelectItem(item)}>
                  <Text style={styles.itemText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
  },
  label: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.text,
    fontFamily: FONT_FAMILIES.regular,
    marginBottom: SPACING.small,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.medium,
    padding: SPACING.small,
  },
  dropdownText: {
    fontSize: FONT_SIZES.small,
    color: COLORS.text,
    fontFamily: FONT_FAMILIES.regular,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    height: 50,
    justifyContent: 'center',
    padding: 20
  },
  modalContent: {
    width: '100%',
    height: '50%',
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.medium,
    padding: SPACING.medium,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.small,
    padding: SPACING.small,
    marginBottom: SPACING.small,
    fontSize: FONT_SIZES.medium,
    color: COLORS.text,
    fontFamily: FONT_FAMILIES.regular,
  },
  item: {
    padding: SPACING.medium,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primary,
  },
  itemText: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.text,
    fontFamily: FONT_FAMILIES.regular,
  },
});

export default DropdownSearchComponent;