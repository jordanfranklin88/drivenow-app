import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/colors';

export default function CategoryPill({ category, isSelected, onSelect }) {
  return (
    <TouchableOpacity
      style={[styles.pill, isSelected ? styles.pillSelected : styles.pillUnselected]}
      onPress={() => onSelect(category)}
      activeOpacity={0.8}
    >
      <Text style={[styles.text, isSelected ? styles.textSelected : styles.textUnselected]}>
        {category}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  pillSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  pillUnselected: {
    backgroundColor: Colors.card,
    borderColor: Colors.border,
  },
  text: {
    fontSize: 13,
    fontWeight: '600',
  },
  textSelected: {
    color: Colors.textOnPrimary,
  },
  textUnselected: {
    color: Colors.textSecondary,
  },
});
