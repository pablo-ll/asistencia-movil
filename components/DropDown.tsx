import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Modal,
    TouchableWithoutFeedback,
    Dimensions,
  } from "react-native";
  import React, { useCallback, useRef, useState } from "react";
  import { AntDesign } from "@expo/vector-icons";
  
  type OptionItem = {
    value: string;
    label: string;
  };
  
  interface DropDownProps {
    data: OptionItem[];
    onChange: (item: OptionItem) => void;
    placeholder: string;
  }
  
  export default function Dropdown({
    data,
    onChange,
    placeholder,
  }: DropDownProps) {
    const [expanded, setExpanded] = useState(false);
    const [value, setValue] = useState("");
    const [top, setTop] = useState(0);
    const [bottomSpace, setBottomSpace] = useState(0);
  
    const buttonRef = useRef<View>(null);
  
    const toggleExpanded = useCallback(() => {
      if (buttonRef.current) {
        buttonRef.current.measure((_x, _y, _width, height, pageX, pageY) => {
          const windowHeight = Dimensions.get("window").height;
          const dropdownHeight = 250; // Tamaño máximo del dropdown
  
          const spaceBelow = windowHeight - pageY - height;
          if (spaceBelow < dropdownHeight) {
            // No hay suficiente espacio abajo, así que expande hacia arriba
            setBottomSpace(spaceBelow);
          } else {
            setTop(pageY + height);
            setBottomSpace(0); // Reiniciar el espacio inferior si no es necesario
          }
        });
      }
      setExpanded(!expanded);
    }, [expanded]);
  
    const onSelect = useCallback((item: OptionItem) => {
      onChange(item);
      setValue(item.label);
      setExpanded(false);
    }, []);
  
    return (
      <View ref={buttonRef}>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          onPress={toggleExpanded}
        >
          <Text style={styles.text}>{value || placeholder}</Text>
          <AntDesign name={expanded ? "caretup" : "caretdown"} />
        </TouchableOpacity>
        {expanded ? (
          <Modal visible={expanded} transparent>
            <TouchableWithoutFeedback onPress={() => setExpanded(false)}>
              <View style={styles.modalContainer}>
                <View
                  style={[
                    styles.options,
                    {
                      top: bottomSpace === 0 ? top : undefined,
                      bottom: bottomSpace > 0 ? bottomSpace : undefined,
                    },
                  ]}
                >
                  <FlatList
                    keyExtractor={(item) => item.value}
                    data={data}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        activeOpacity={0.8}
                        style={styles.optionItem}
                        onPress={() => onSelect(item)}
                      >
                        <Text>{item.label}</Text>
                      </TouchableOpacity>
                    )}
                    ItemSeparatorComponent={() => (
                      <View style={styles.separator} />
                    )}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        ) : null}
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: "flex-start", // Asegura que el dropdown se superponga correctamente
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.3)", // Un fondo semitransparente para enfocar el dropdown
    },
    optionItem: {
      height: 40,
      justifyContent: "center",
    },
    separator: {
      height: 4,
    },
    options: {
      position: "absolute",
      backgroundColor: "white",
      width: "80%",
      padding: 16,
      borderRadius: 6,
      maxHeight: 250,
      elevation: 10, // Para añadir sombra y elevar el dropdown por encima de otros elementos
      zIndex: 10, // Asegura que esté por encima de otros componentes
    },
    text: {
      fontSize: 15,
      opacity: 0.8,
    },
    button: {
      height: 50,
      justifyContent: "space-between",
      backgroundColor: "#fff",
      flexDirection: "row",
      width: "100%",
      alignItems: "center",
      paddingHorizontal: 15,
      borderRadius: 8,
    },
  });
  