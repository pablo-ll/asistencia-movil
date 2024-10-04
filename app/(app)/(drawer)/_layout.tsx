import { View, Text, StyleSheet, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { Drawer } from "expo-router/drawer";
import { DrawerContentScrollView, DrawerItem, DrawerContentComponentProps } from "@react-navigation/drawer";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import {
  Feather,
  AntDesign,
  MaterialIcons,
  Ionicons,
} from "@expo/vector-icons";
import { usePathname } from "expo-router";
import { useRouter } from 'expo-router';
import { useAuthStore } from "@/store/auth/useAuthStore";


const CustomDrawerContent = (props :  DrawerContentComponentProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAuthStore();
  const [activeItem, setActiveItem] = useState(false);

 const handlePress= ()=>{
  setActiveItem(true);
  logout();
 }

  useEffect(() => {
    console.log(pathname);
  }, [pathname]);

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.userInfoWrapper}>
        <Image
          source={{ uri: "https://randomuser.me/api/portraits/women/26.jpg" }}
          width={80}
          height={80}
          style={styles.userImg}
        />
        <View style={styles.userDetailsWrapper}>
          <Text style={styles.userName}>John Doe</Text>
          <Text style={styles.userEmail}>john@email.com</Text>
        </View>
      </View>
      <DrawerItem
        icon={({ color, size }) => (
          <MaterialCommunityIcons
            name="account-clock-outline"
            size={size}
            color={pathname == "/" ? "#fff" : "#000"}
          />
        )}
        label={"Marcar Asistencia"}
        labelStyle={[
          styles.navItemLabel,
          { color: pathname == "/" ? "#fff" : "#000" },
        ]}
        style={{ backgroundColor: pathname == "/" ? "#333" : "#fff" }}
        onPress={() => {
          router.push("/");
        }}
      />
      <DrawerItem
        icon={({ color, size }) => (
          <FontAwesome6
            name="hospital-user"
            size={size}
            color={pathname == "/solicitud" ? "#fff" : "#000"}
          />
        )}
        label={"Solicitudes"}
        labelStyle={[
          styles.navItemLabel,
          { color: pathname == "/solicitud" ? "#fff" : "#000" },
        ]}
        style={{ backgroundColor: pathname == "/solicitud" ? "#333" : "#fff" }}
        onPress={() => {
          router.push("/solicitud");
        }}
      />
     
      <DrawerItem
        icon={({ color, size }) => (
          <Ionicons
            name="add"
            size={size}
            color={pathname == "/solicitar" ? "#fff" : "#000"}
          />
        )}
        label={"Solicitar ausencia"}
        labelStyle={[
          styles.navItemLabel,
          { color: pathname == "/solicitar" ? "#fff" : "#000" },
        ]}
        style={{ backgroundColor: pathname == "/solicitar" ? "#333" : "#fff" }}
        onPress={() => {
          router.push("/solicitar");
        }}
      />
       <DrawerItem
        icon={({ color, size }) => (
          <MaterialIcons
            name="logout"
            size={size}
            color={activeItem ? "#fff" : "#000"}
          />
        )}
        label={"Cerrar Sesion"}
        labelStyle={[
          styles.navItemLabel,
          { color: activeItem ? "#fff" : "#000" },
        ]}
        style={{ backgroundColor: activeItem ? "#333" : "#fff" }}
        onPress={ handlePress }
      />


    </DrawerContentScrollView>
  );
};

export default function Layout() {
  return (
    <Drawer drawerContent={(props) => <CustomDrawerContent {...props} />} screenOptions={{headerShown: false}}>
      
      <Drawer.Screen name="(tabs)" options={{ headerShown: false }} />
      <Drawer.Screen name="favourites" options={{headerShown: true}} />
      <Drawer.Screen name="solicitar" options={{headerShown: true}} />
     
    </Drawer>
  );
}

const styles = StyleSheet.create({
  navItemLabel: {
    marginLeft: -20,
    fontSize: 18,
  },
  userInfoWrapper: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  userImg: {
    borderRadius: 40,
  },
  userDetailsWrapper: {
    marginTop: 25,
    marginLeft: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize:16,
    fontStyle: 'italic',
    textDecorationLine: 'underline',
  }
});