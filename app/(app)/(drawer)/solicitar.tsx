import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Pressable,
  Platform,
  useColorScheme,
  Alert,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { EvilIcons, MaterialCommunityIcons, Entypo } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { se } from "date-fns/locale";
import Dropdown from "@/components/DropDown";
import { ScrollView } from "react-native-gesture-handler";
import { Stack, useRouter } from "expo-router";
import { useLocalSearchParams, useNavigation } from "expo-router";
import ImageUploader from "@/components/ImgeUploader";
import { getEmpleadoByUsuario } from "@/actions/gestion/empleado";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { saveSolicitud } from "@/actions/gestion/solicitud";
import { useAuthStore } from "@/store/auth/useAuthStore";
import { Solicitud } from "@/domain/entities/Solicitud";
import { ActivityIndicator, Button, Card, Modal } from "react-native-paper";
import { Link } from "expo-router";
import { Tabs } from "expo-router";

const validationSchema = Yup.object().shape({
  tipo: Yup.string().required("El tipo de ausencia es obligatorio"),
  fechaInicio: Yup.date().required("La fecha de inicio es obligatoria"),
  fechaFin: Yup.date()
    .required("La fecha de fin es obligatoria")
    .min(
      Yup.ref("fechaInicio"),
      "La fecha de fin debe ser igual o mayor a la fecha de inicio"
    ),
  descripcion: Yup.string().max(
    250,
    "La descripción debe tener menos de 250 caracteres"
  ),
  comprobanteBajaMedica: Yup.mixed().when("tipo", {
    is: "BAJA_MEDICA",
    then: () =>
      Yup.mixed().required("El comprobante de baja médica es obligatorio"),
    otherwise: () => Yup.mixed().nullable(),
  }),
});

const initialValues: Solicitud = {
  empleadoId: 0, // Asumimos que este valor viene de algún contexto o prop
  tipo: "",
  fechaInicio: "",
  fechaFin: "",
  estado: "PENDIENTE", // Asumimos que el estado inicial es PENDIENTE
  comprobanteBajaMedica: "",
  descripcion: "",
};

const SolicitarAusencia = () => {
  const router = useRouter();
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [inicio, setInicio] = useState("");
  const [fechaInicio, setFechaInicio] = useState(new Date());
  const [fechaFin, setFechaFin] = useState(new Date());
  const [showInicioPicker, setShowInicioPicker] = useState(false);
  const [showFinPicker, setShowFinPicker] = useState(false);
  const { user } = useAuthStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [valorInicial, setValorInicial] = useState(initialValues);
  

  const colorScheme = useColorScheme();
  const queryClient = useQueryClient();

  const {
    isLoading,
    data: empleado,
    error,
  } = useQuery({
    queryKey: ["empleado", user?.id],
    queryFn: () => getEmpleadoByUsuario(user?.id || 0),
    staleTime: 1000 * 60 * 60, // 1 hora
    retry: false,
    meta: {
      timeout: 10000, // 10 segundos
    },
  });

  const mutation = useMutation({
    mutationFn: (data: Solicitud) => saveSolicitud(data),
    onSuccess(data: Solicitud) {
      queryClient.invalidateQueries({ queryKey: ["empleado", user?.id] });
      console.log("Solicitud guardada con éxito:", data);
    },
    onError(error: Error) {
      console.error("Hubo un error al guardar la solicitud:", error.message);
    },
  });

  const toggleDatepicker = () => {
    setShowPicker(!showPicker);
  };
  const toggleInicioPicker = () => setShowInicioPicker(!showInicioPicker);
  const toggleFinPicker = () => setShowFinPicker(!showFinPicker);

  const onChangeInicio = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || fechaInicio;
    setShowInicioPicker(Platform.OS === "ios");
    setFechaInicio(currentDate);
  };

  const onChangeFin = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || fechaFin;
    setShowFinPicker(Platform.OS === "ios");
    setFechaFin(currentDate);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("es-ES", {
      weekday: "short",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const onChange = (event: { type: string }, selectedDate?: Date) => {
    const { type } = event;

    if (type === "set" && selectedDate) {
      setDate(selectedDate); // Si la fecha seleccionada está definida, actualiza la fecha
      if (Platform.OS === "android") {
        toggleDatepicker();
        setInicio(selectedDate.toDateString());
      }
    } else {
      toggleDatepicker(); // Si el tipo no es "set", cierra el selector de fechas
    }
  };

  const formatLocalDate = (dateString: string) => {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Los meses van de 0 a 11, por eso sumamos 1
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const handleSubmit = (
    values: Solicitud,
    formikHelpers: any,
    setModalVisible: (visible: boolean) => void
  ) => {
    const { setSubmitting, resetForm } = formikHelpers;
    const diasDisponibles = empleado?.diasVacacionesDisponibles || 0;

    // Convertir fechas de string a Date
    const inicio = new Date(values.fechaInicio);
    const fin = new Date(values.fechaFin);

    console.log("inicio", inicio, " fin ", fin);

    // Calcular días solicitados
    const diasSolicitados =
      Math.ceil((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    // Validar si los días solicitados superan los disponibles
    if (diasSolicitados >= diasDisponibles && values.tipo === "VACACION") {
      // Mostrar alerta utilizando Kitten UI
      setModalVisible(true);

      // Detener el proceso de envío
      setSubmitting(false);
      return;
    }

    const solicitudesExistentes = empleado?.solicitudes || [];

    // Validar si las fechas se superponen con otras solicitudes
    const isFechaConflicto = solicitudesExistentes.some((solicitud) => {
      const solicitudInicio = new Date(solicitud.fechaInicio);
      const solicitudFin = new Date(solicitud.fechaFin);

      // Comprobar si las fechas se solapan
      return (
        (inicio >= solicitudInicio && inicio <= solicitudFin) ||
        (fin >= solicitudInicio && fin <= solicitudFin) ||
        (inicio <= solicitudInicio && fin >= solicitudFin) // La nueva solicitud abarca por completo otra solicitud
      );
    });

    if (isFechaConflicto) {
      Alert.alert("Ya tiene programada una solicitud para esos dias");
      return;
    }

    // Si la validación pasa, formatear los valores y enviar la solicitud
    const formattedValues = {
      ...values,
    };

    mutation.mutate(formattedValues, {
      onSuccess: () => {
        Alert.alert("Se envió la solicitud con éxito");
        resetForm(); // Limpia el formulario después de enviar
        setValorInicial(initialValues); // Restablece el estado inicial
      },
      onError: (error) => {
        Alert.alert("Error al enviar la solicitud", error.message);
      },
    });
  };
  const confirmIOSDate = () => {
    setInicio(date.toDateString());
    toggleDatepicker();
  };

  const pickImage = async (
    setFieldValue: (field: string, value: any) => void
  ) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setFieldValue("comprobanteBajaMedica", result.assets[0].uri);
    }
  };

  const handleTipoChange = (
    value: string,
    setFieldValue: (field: string, value: any) => void
  ) => {
    setFieldValue("tipo", value);
    if (value !== "BAJA_MEDICA") {
      setFieldValue("comprobanteBajaMedica", "");
    }
  };

  return (
    <>
      <View style={styles.container}>
        <ScrollView>
          <Formik
            initialValues={valorInicial}
            validationSchema={validationSchema}
            onSubmit={(values, formikHelpers) => {
              const formattedValues = {
                ...values,
                fechaInicio: formatLocalDate(values.fechaInicio),
                fechaFin: formatLocalDate(values.fechaFin),
                empleadoId: empleado?.id || 0,
              };

              handleSubmit(formattedValues, formikHelpers, setModalVisible);
            }}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
              setFieldValue,
              resetForm,
            }) => (
              <View style={styles.container}>
                <View style={styles.header}>
                  <Text style={styles.title}>Solicitar ausencia</Text>
                  <EvilIcons name="calendar" size={24} color="#2196f3" />
                </View>

                {/* Rango de fechas */}
                <View>
                  <Text style={styles.label}>Fecha inicio</Text>
                  {showInicioPicker && (
                    <DateTimePicker
                      mode="date"
                      display="spinner"
                      value={fechaInicio}
                      onChange={onChangeInicio}
                      style={styles.datepicker}
                      themeVariant={colorScheme === "dark" ? "light" : "dark"}
                      minimumDate={new Date()}
                    />
                  )}
                  {showInicioPicker && Platform.OS === "ios" && (
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-around",
                      }}
                    >
                      <TouchableOpacity
                        style={[styles.button, styles.pickerButton]}
                        onPress={() => {
                          toggleInicioPicker();

                          setFieldValue(
                            "fechaInicio",
                            fechaInicio.toISOString()
                          );
                        }}
                      >
                        <Text style={styles.buttonText}>Confirmar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.button,
                          styles.pickerButton,
                          { backgroundColor: "#11182711" },
                        ]}
                        onPress={toggleInicioPicker}
                      >
                        <Text style={[styles.buttonText, { color: "#075985" }]}>
                          Cancelar
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                  <View style={styles.inputWithIcon}>
                    <Pressable onPress={toggleInicioPicker}>
                      <TextInput
                        style={styles.input}
                        value={
                          values.fechaInicio
                            ? formatDate(new Date(values.fechaInicio))
                            : ""
                        }
                        placeholder="vier agosto 21 2024"
                        placeholderTextColor="#11182744"
                        editable={false}
                        onPressIn={toggleInicioPicker}
                      />
                    </Pressable>
                    <EvilIcons
                      name="calendar"
                      size={24}
                      color="black"
                      style={styles.inputIcon}
                    />
                  </View>
                  {touched.fechaInicio && errors.fechaInicio && (
                    <Text style={styles.errorText}>{errors.fechaInicio}</Text>
                  )}
                </View>

                <View>
                  <Text style={styles.label}>Fecha fin</Text>
                  {showFinPicker && (
                    <DateTimePicker
                      mode="date"
                      display="spinner"
                      value={fechaFin}
                      onChange={onChangeFin}
                      style={styles.datepicker}
                      themeVariant={colorScheme === "dark" ? "light" : "dark"}
                      minimumDate={new Date()}
                    />
                  )}
                  {showFinPicker && Platform.OS === "ios" && (
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-around",
                      }}
                    >
                      <TouchableOpacity
                        style={[styles.button, styles.pickerButton]}
                        onPress={() => {
                          toggleFinPicker();
                          setFieldValue("fechaFin", fechaFin.toISOString());
                        }}
                      >
                        <Text style={styles.buttonText}>Confirmar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.button,
                          styles.pickerButton,
                          { backgroundColor: "#11182711" },
                        ]}
                        onPress={toggleFinPicker}
                      >
                        <Text style={[styles.buttonText, { color: "#075985" }]}>
                          Cancelar
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                  <View style={styles.inputWithIcon}>
                    <Pressable onPress={toggleFinPicker}>
                      <TextInput
                        style={styles.input}
                        value={
                          values.fechaFin
                            ? formatDate(new Date(values.fechaFin))
                            : ""
                        }
                        placeholder="vier agosto 21 2024"
                        placeholderTextColor="#11182744"
                        editable={false}
                        onPressIn={toggleFinPicker}
                      />
                    </Pressable>
                    <EvilIcons
                      name="calendar"
                      size={24}
                      color="black"
                      style={styles.inputIcon}
                    />
                  </View>
                  {touched.fechaFin && errors.fechaFin && (
                    <Text style={styles.errorText}>{errors.fechaFin}</Text>
                  )}
                </View>

                {/* Tipo de ausencia */}
                <View>
                  <Text style={styles.label}>Tipo de solicitud</Text>

                  <View style={styles.inputWithIcon}>
                    <Dropdown
                      data={[
                        { value: "VACACION", label: "Vacaciones" },
                        { value: "BAJA_MEDICA", label: "Baja médica" },
                      ]}
                      onChange={(item) => handleTipoChange(item.value, setFieldValue)}
                      placeholder="Selecciona tipo de ausencia"
                    />
                  </View>

                  {/* Validación de errores de Formik */}
                  {touched.tipo && errors.tipo && (
                    <Text style={styles.errorText}>{errors.tipo}</Text>
                  )}
                </View>

                {/* Información */}
                {values.tipo === "VACACION" && (
                  <View style={styles.infoBox}>
                    <MaterialCommunityIcons
                      name="information-outline"
                      size={20}
                      color="#2196f3"
                      style={styles.infoIcon}
                    />
                    <Text style={styles.infoText}>
                      Tu tiempo disponible {empleado?.diasVacacionesDisponibles}{" "}
                      días de vacacion.
                    </Text>
                  </View>
                )}
                {values.tipo === "BAJA_MEDICA" && (
                  <View>
                    <Text style={styles.label}>Comprobante de Baja Médica</Text>

                    <ImageUploader
                      onImageUpload={(url) =>
                        setFieldValue("comprobanteBajaMedica", url)
                      }/>
                   
                    {errors.comprobanteBajaMedica &&
                      touched.comprobanteBajaMedica && (
                        <Text style={{ ...styles.errorText, marginTop: 4 }}>
                          {errors.comprobanteBajaMedica}
                        </Text>
                      )}
                  </View>
                )}

                {/* Comentario */}
                <View>
                  <Text style={styles.label}>Comentario</Text>
                  <View style={styles.inputWithIcon}>
                    <TextInput
                      style={[styles.input, styles.textArea]}
                      placeholder="Escribe una pequeña descripción sobre tu ausencia"
                      multiline={true}
                      value={values.descripcion}
                      onChangeText={handleChange("descripcion")}
                      onBlur={handleBlur("descripcion")}
                    />
                  </View>
                  {touched.descripcion && errors.descripcion && (
                    <Text style={styles.errorText}>{errors.descripcion}</Text>
                  )}
                </View>

                {/* Otras personas en las mismas fechas */}
                <View style={styles.overlapList}>
                  <View style={styles.overlapItem}>
                    <View></View>
                    <Entypo
                      name="circle"
                      size={20}
                      color="#ffeb3b"
                      style={styles.overlapIcon}
                    />
                    <Text style={styles.overlapText}>
                      CI: {empleado?.cedula}
                    </Text>
                    <View>
                      <Text style={styles.overlapText}>
                        {empleado?.nombre} {empleado?.apellidoPaterno}{" "}
                        {empleado?.apellidoMaterno}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Botones */}
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={() => handleSubmit()}
                  >
                    <Text style={styles.buttonText}>Solicitar</Text>
                  </TouchableOpacity>

                  <Link href="/solicitud" asChild>
                    <TouchableOpacity style={styles.secondaryButton}>
                      <Text style={styles.secondaryButtonText}>Volver</Text>
                    </TouchableOpacity>
                  </Link>
                </View>
              </View>
            )}
          </Formik>
        </ScrollView>
        <Modal
          visible={modalVisible}
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Card disabled={true} style={styles.modalContent}>
            <Text style={styles.modalTitle}>Días insuficientes</Text>
            <Text style={styles.modalText}>
              Has solicitado más días de los que tienes disponibles.
            </Text>
            <Button
              onPress={() => setModalVisible(false)}
              style={styles.modalButton}
            >
              Cerrar
            </Button>
          </Card>
        </Modal>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginHorizontal: "auto", // Para centrar en pantallas más grandes
    width: "100%", // Ocupa todo el ancho disponible en pantallas pequeñas
    maxWidth: 600, // Limita el ancho máximo en pantallas grandes
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16, // Aumenta el margen para mejor separación en pantallas pequeñas
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  label: {
    fontWeight: "500",
    marginBottom: 8,
    color: "#000",
  },
  inputWithIcon: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 4,
    marginBottom: 8,
    justifyContent: "space-between",
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  inputIcon: {
    padding: 10,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(72, 149, 239, 0.1)",
    borderRadius: 4,
    padding: 16,
    marginBottom: 16,
  },
  overlapList: {
    marginBottom: 16,
  },
  subTitle: {
    fontSize: 18,
    marginBottom: 8,
  },
  overlapItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginBottom: 8,
  },
  overlapIcon: {
    marginRight: 16,
  },
  buttonContainer: {
    flexDirection: "column", // Organiza los botones en fila
    /*   justifyContent: 'space-between', */
    marginTop: 16,
  },
  viewContainer: {
    flexDirection: "row", // Organiza los botones en fila
    justifyContent: "center",
  },
  primaryButton: {
    flex: 1, // Los botones ocupan el mismo ancho
    backgroundColor: "#2196f3",
    padding: 12,
    borderRadius: 4,
    alignItems: "center",
    marginRight: 8,
  },
  secondaryButton: {
    flex: 1, // Los botones ocupan el mismo ancho
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#2196f3",
    alignItems: "center",
    marginRight: 8,
    marginTop: 16,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 14,
  },
  secondaryButtonText: {
    color: "#2196f3",
    fontWeight: "500",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: -12,
    marginBottom: 16,
  },

  overlapText: {
    color: "#495057",
  },
  infoIcon: {
    marginRight: 16,
  },
  infoText: {
    color: "#495057",
    fontSize: 14,
    marginRight: 24,
  },

  uploadButton: {
    backgroundColor: "#e0e0e0",
    padding: 10,
    borderRadius: 4,
    alignItems: "center",
    marginBottom: 10,
  },
  imagePreview: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginBottom: 10,
  },
  datepicker: {
    height: 120,
    marginTop: -10,
    color: "#075985",
  },
  button: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    marginTop: 10,
    marginBottom: 15,
    backgroundColor: "#075985",
  },
  pickerButton: {
    paddingHorizontal: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 4,
    marginBottom: 16,
  },
  containerDropdown: {
    flex: 1,
    backgroundColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    gap: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    // width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    textAlign: "center",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  modalButton: {
    alignSelf: "center",
  },
});

export default SolicitarAusencia;
