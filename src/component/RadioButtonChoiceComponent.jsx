import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { COMPONENT_STYLES } from '../lib/constants';

const RadioButtonChoiceGroup = ({ options, selectedValue, onSelect }) => {
  return (
    <View style={styles.radioGroup}>
      {options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.radioButton,{
            backgroundColor: selectedValue === option.value ? "#37AFE110" : "#FFFFFF",
            borderWidth:1,
            borderRadius:10,
            borderColor: selectedValue === option.value ? "#37AFE1" : "#00000020",
            padding:20,
          }]}
          onPress={() => onSelect(option)}
        >
          <View style={{ flex: 1, flexDirection: 'row',alignItems:'center' }}>
            <View style={{width:50,height:40}}>
              <Image source={option.icon} style={[styles.icon, { width: '100%', height: '100%' }]} />
            </View>
            <View style={COMPONENT_STYLES.spacer} />
            <View>
              <Text style={[COMPONENT_STYLES.textMedium, { fontWeight: '700' }]}>{option.label}</Text>
              <Text style={[COMPONENT_STYLES.textSmall]}>{option.time}</Text>
              <Text style={[COMPONENT_STYLES.textSmall, {fontSize:10}]}>{option.desc}</Text>

            </View>
          </View>
          <View>
            {option.discount !== 0 &&
            <Text style={[COMPONENT_STYLES.textMedium, { textAlign:'right' }]}>Rp {(option.price - option.discount).toLocaleString('id')}</Text>
            }
            <Text style={[COMPONENT_STYLES.textSmall, { textDecorationLine: option.discount === 0 ? '' : 'line-through', textAlign:'right' }]}>Rp {(option.price).toLocaleString('id')}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  radioGroup: {
    flexDirection: 'column',
    marginVertical: 10,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  outerCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  selectedOuterCircle: {
    borderColor: '#007BFF',
  },
  innerCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#007BFF',
  },
  optionText: {
    fontSize: 16,
  },
  icon:{
    resizeMode: 'stretch'
  }
});

export default RadioButtonChoiceGroup;
