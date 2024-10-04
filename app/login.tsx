import {
  Alert,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    useWindowDimensions,
    View,
  } 
  from "react-native";
  import React, { useState } from "react";
  import { colors } from "@/utills/colors";
  import { fonts } from "@/utills/fonts";
  
  import { Ionicons } from "@expo/vector-icons"; 
  import { SimpleLineIcons, FontAwesome6 } from "@expo/vector-icons"; 
  import { useNavigation } from "@react-navigation/native";

  import Svg, { Path } from "react-native-svg"

import { ScrollView } from "react-native-gesture-handler";

import { useAuthStore } from "@/store/auth/useAuthStore";

import { router } from "expo-router";



  
  const LoginScreen = () => {

    const [form, setForm] = useState({ username: "", password: "" });
    const [posting, setPosting] = useState(false);

    const {height,width} = useWindowDimensions();
    const navigation = useNavigation();
    const [secureEntery, setSecureEntery] = useState(true);

    const { login } = useAuthStore();
    



    

    
   
    const handleLogin = async () => {
      
        
        if (form.username === "" || form.password === "") {
            return;
        }
        setPosting(true);

        const resp = await login(form.username, form.password);
        setPosting(false);

        if(resp){
          console.log({resp}, 'resp');
          Alert.alert("Exito");
        }
        console.log({resp}, 'resp'); 

        if (!resp) {
          console.log({resp}, 'resp2'); 
          Alert.alert("Error", "Invalid username or password");
            return;
        }

      
       
    };

    function SvgTop(){
        return (
            <Svg  viewBox="0 0 218 280" width={200} height={250}>
    <Path d="M74.1 37.6c-13.8 3.7-25.4 13.5-31.9 27.1-3.6 7.5-3.7 8.2-3.7 18.8 0 9.2.4 12.4 2.7 19.5 1.5 4.7 3.6 11.6 4.7 15.5 5.5 19.1 22.9 35.8 42.8 41 8.3 2.2 24.2 2 32.5-.4 16.4-4.7 30.4-16.3 37.5-31.1 4.1-8.5 6.9-18 6.2-21.3-.4-1.6-.7-1.6-4.4.4-6 3.2-10.9 4.8-16.4 5.1-4.6.3-4.8.4-4 2.6 1.3 3.3 1.1 7.6-.3 9-1.7 1.7-19.2 1.6-20.6-.1-1.5-1.9.2-10.4 2.6-13 1.4-1.5 2.2-3.6 2.2-5.8 0-4.5 1.5-5.9 6.1-5.9 3.3 0 3.7-.3 4.3-3.1.3-1.7.6-6.6.6-10.8 0-13.3-4.6-24.6-13.9-34.4l-5.6-5.9 2.3-1.8c1.2-1 1.9-2.1 1.4-2.4-.5-.3-5.1-.9-10.3-1.5-5.2-.6-11-1.5-12.9-2.1-4.8-1.4-15.5-1.1-21.9.6zM114 63.2c5.3 3.7 7 6.7 7.7 14 .5 5.7.3 7.3-1.7 10.9-1.5 3-2 5.3-1.7 7.6.5 2.9.3 3.3-1.7 3.3-1.8 0-2.5.7-3 3.1-.6 3-.6 3-6.3 2.7-5.5-.3-5.8-.4-6.1-3.1-.3-2.1-.9-2.7-2.7-2.7-2.2 0-2.4-.3-1.8-3.1.4-2.2 0-3.8-1.4-5.8-1.4-1.8-2.2-4.6-2.3-8.2-.5-9.4-.1-11.6 2.7-15 5.1-6 12.6-7.5 18.3-3.7zm-26.4 5.2c1 .8 1.6 1.8 1.2 2.2-1 .9-5.8-1.2-5.8-2.6 0-1.4 2.3-1.2 4.6.4zM131 68c0 1.4-4.8 3.5-5.8 2.6-.8-.9 2.6-3.6 4.5-3.6.7 0 1.3.5 1.3 1zm-43.5 9c.4.6-.8 1-2.9 1-2 0-3.6-.5-3.6-1 0-.6 1.3-1 2.9-1 1.7 0 3.3.4 3.6 1zm45.5 0c0 .5-1.6 1-3.6 1-2.1 0-3.3-.4-2.9-1 .3-.6 1.9-1 3.6-1 1.6 0 2.9.4 2.9 1zm-44 7c0 1.3-4.8 3.5-5.7 2.7-.8-.8 2.6-3.6 4.5-3.7.6 0 1.2.5 1.2 1zm40.3.4c1.6 1.2 2.4 3.6 1.2 3.6s-5.5-3.3-5.5-4.1c0-1.3 2.2-1 4.3.5zm-40.5 15.8c.7.7 1.2 3.1 1.2 5.5s.4 4.3 1 4.3c1.9 0 4.1 6.1 3.8 10.3l-.3 4.2h-20l-.3-5.2c-.3-4.6.1-5.6 2.2-7.8 1.9-1.9 2.6-3.7 2.6-6.3 0-4.6 1.4-6.2 5.5-6.2 1.7 0 3.6.5 4.3 1.2zm13.2 19.4c0 1-.7 1.4-2.2 1.2-3.2-.5-3.5-2.8-.4-2.8 1.7 0 2.6.5 2.6 1.6zm7.5-.6c.8 1.3-2 2.4-4.1 1.6-2-.8-.9-2.6 1.6-2.6 1 0 2.2.5 2.5 1zm7.3.2c-.7 2-4.8 2.3-4.8.4 0-1.1.9-1.6 2.6-1.6 1.6 0 2.4.5 2.2 1.2zm27 10c1.7 1.7 1.5 6.5-.4 7.2-.9.3-17.4.6-36.8.6-26 0-35.5-.3-36.4-1.2-1.8-1.8-1.5-5.5.6-6.7 2.6-1.6 71.4-1.5 73 .1z" />
    <Path d="M100.8 65.6C96.8 67.7 95 72 95 79c0 4.7.5 6.9 2.1 9.1 2 2.8 2.4 2.9 9.9 2.9s7.9-.1 9.9-2.9c2.6-3.6 2.9-13.7.6-18.1-2.8-5.5-10.9-7.6-16.7-4.4zm13 4.8c1.2 1.2 2.5 3.9 2.9 5.9.5 3.2.1 4.1-3 7.2-4.3 4.3-8.2 4.6-12.5 1-3.9-3.3-4.8-7.4-2.7-11.5 3-5.9 10.5-7.1 15.3-2.6z" />
    <Path d="M102.6 72.1c-5 4-2.1 11.9 4.4 11.9s9.4-7.9 4.4-11.9c-1.5-1.2-3.4-2.1-4.4-2.1-1 0-2.9.9-4.4 2.1zm8.4 3.2c0 .8-1.1 2.4-2.5 3.7-2 1.9-2.7 2.1-4 1-2.2-1.8-1.9-4.3.4-3.5 1 .3 2.4-.1 3.1-1 1.5-1.9 3-1.9 3-.2zM100 94.5c0 1.2 1.4 1.5 7 1.5s7-.3 7-1.5-1.4-1.5-7-1.5-7 .3-7 1.5zM103 100.5c0 1.1 1.1 1.5 4 1.5s4-.4 4-1.5-1.1-1.5-4-1.5-4 .4-4 1.5zM82.3 101.7c-1.7.6-1.6 6.8.1 8.2 1.9 1.6 4.5.3 5.3-2.7 1-4.1-1.9-7-5.4-5.5zM77.4 114.4c-1.5 2.2-1.9 7.6-.5 7.6.5 0 1.1-.9 1.4-2.1.6-2.3 2.7-1.7 2.7.7 0 .9 1.1 1.4 3.4 1.4 2.6 0 3.5-.5 3.9-2.1.6-2.3 2.7-1.7 2.7.7 0 .8.5 1.4 1 1.4 1.4 0 1.2-4-.3-7-1.1-2.2-1.9-2.5-7-2.5-4.8-.1-6.1.2-7.3 1.9zM72 132.5c0 1.3 4.6 1.5 35 1.5s35-.2 35-1.5-4.6-1.5-35-1.5-35 .2-35 1.5zM196.4 84.9c-3.2 1.4-6.4 6-6.4 9.3 0 4.1 5.7 9.8 9.8 9.8 3.5 0 8-3.3 9.3-6.8 1.1-3-.3-8.2-3-10.6-2.2-2-7-2.8-9.7-1.7zM23.2 97.2c-2.5 2.5-.6 6.8 3 6.8.9 0 2.2-.9 2.8-1.9 1.3-2.5 1.3-2.7-.6-4.5-1.9-1.9-3.6-2-5.2-.4zM127 106c0 2.2.3 4 .8 4 1.4 0 2.9-1.5 2.9-3 0-.8.4-2.3.8-3.3.6-1.4.2-1.7-1.9-1.7-2.4 0-2.6.4-2.6 4zM123.6 113.9c-.9 1-1.5 3.3-1.5 5.2.1 2.3.3 2.7.6 1.1.5-2.7 3.3-2.9 3.3-.2 0 1.6.7 2 3.5 2s3.5-.4 3.5-2c0-1.1.7-2 1.5-2 .9 0 1.5.9 1.5 2.2 0 1.5.3 1.9 1 1.2 1.2-1.2-.4-7.4-2.1-8.5-.7-.4-2.2-.3-3.4.3-1.5.7-2.9.7-4.2-.1-1.6-.8-2.4-.7-3.7.8zM48.5 189.7C38.4 192 31 196 31 199.1c0 1.6 4.6 6.1 14.8 14.7 2.9 2.4 5.2 5.1 5.2 6.2 0 4-7.5 5.3-13.7 2.3-3.4-1.6-3.6-1.6-5 .3-3.2 4.4.9 7.4 10.2 7.4 7.3 0 12-2.5 14.1-7.5 2.2-5.3.2-9-8.4-15.3-10.3-7.7-10.4-9.2-.2-11.2 8.9-1.8 10.5-2.5 10.5-4.6 0-1.5-.8-1.9-4-2.1-2.2 0-4.9.1-6 .4zM110.6 189.8c-.5.9-2.8 9.1-7.3 25.9-2.6 9.9-2.7 10.1-4.4 8-1.7-2.1-1.8-2.1-5.3-.4-4.4 2.1-6.8 2.1-10.5.3-5.2-2.7-6.8-11.2-3-16 1.8-2.3 2.8-2.6 8-2.6 4.6 0 6.1-.4 6.6-1.6 1.1-2.9-2.6-4.6-9.1-4.2-5.2.4-6.2.8-9.2 4-6.2 6.8-6.8 16.7-1.4 21.8 5.1 4.7 16.2 6.5 22 3.5 2.5-1.3 2.9-1.3 3.4 0 .3.8 1.4 1.5 2.6 1.5 1.5 0 2.2-1 3.1-4.5 1.3-5.1 3.4-6.8 8.2-6.3 2.9.3 3.4.8 4.8 5.3 2.3 7.4 7.9 7.5 5.8.1-.5-1.7-.9-4.8-.9-6.8 0-2.1-.4-3.8-.9-3.8s-1.9-4-3-9c-2.8-12-4.5-16-7-16-1.1 0-2.2.4-2.5.8zm4.3 16c1.8 5.4 1.2 8.6-1.8 9-3.8.6-4.4-1-2.6-7.2.9-3.1 2-5.6 2.4-5.6.4 0 1.3 1.7 2 3.8zM153.9 191c-2.2 1.9-2.3 2.1-.7 3.3 1.6 1.2 1.6 2.3.8 9.8-.5 4.6-1 9-1 9.7 0 .9-.6.9-2.3-.3-1.9-1.2-3-1.3-5.5-.4-3.6 1.2-3.9 2.4-1.5 5.1 1.3 1.5 1.4 2.3.5 4.3-2 4.4-7.3 2.7-9.2-2.9-1.9-5.8 1.8-17.8 5.9-19.1 1.1-.3 3.5-.3 5.3 0 1.8.3 4 .1 4.8-.5 1.3-.9 1.2-1.3-.9-3-5-4.2-13.8-1.5-18.7 5.8-4.7 6.8-4.2 19.5.8 24.5 2.7 2.8 3.3 2.9 8.4 2.4 6.7-.7 8-1.7 9.6-7.1 1.6-5.8 2.8-6.7 2.9-2.1.1 5.8 1.2 8.9 3.2 9.3 3.4.7 4.8-1.8 4.6-7.6l-.3-5.5 6.5-2.4c8.4-3.1 13.5-7.3 15-12.4 1.1-3.4 1-4.1-.7-6-5.6-6.4-22.3-9.3-27.5-4.9zm15.9 5.6c6 3 6.5 4.8 2.5 8.6-3.4 3.3-7.9 5.1-10.5 4.2-1.7-.5-1.8-1.1-1.1-5.2.4-2.6.7-5.9.7-7.5-.1-3.5 1.6-3.5 8.4-.1zM62.9 193.7c-1 1.1-1.5 5.7-1.7 16.3-.3 12.8-.1 14.9 1.4 16.4.9.9 2.4 1.6 3.3 1.4 1.4-.3 1.6-1.8 1.3-10.3-.1-5.5.2-13.1.9-16.9.9-5.6.9-7-.2-7.7-2.1-1.3-3.5-1.1-5 .8zM67.5 246c-.8 1.3-.8 16.1.1 18.3.3.9 1.4 1.7 2.3 1.7 2.2 0 8-3.7 8.8-5.6 1-2.7-1.4-6.3-4.9-7.2-2.9-.7-3.3-1.3-3.6-4.5-.3-3.6-1.4-4.7-2.7-2.7zm6.6 10c2.5 1.4 2.4 3.5-.3 5.4-2.8 2-3.8 1.2-3.8-3 0-3.6.9-4.1 4.1-2.4zM93 248c-1.2.7-1.2 1.2-.2 2.2.9.9 1.5.9 2.4 0 1.6-1.6-.2-3.4-2.2-2.2zM100.4 252.4C96.5 256.3 96 260 99 263c2.4 2.4 7.2 2.6 9 .5 1.6-2 .7-3-1.6-1.7-2.6 1.4-5.3.3-6.1-2.6-.5-2.1 0-3.1 3.1-5.7 3.3-2.8 3.8-4.5 1.3-4.5-.5 0-2.4 1.5-4.3 3.4zM127 251.1c0 .6.5 1.9 1.1 3.1.8 1.4.7 2.8-.1 4.9-1.6 3.7-4 3.8-4.1.1-.2-6.8-.5-7.7-1.9-7.7-2.8 0-2.4 9 .6 12 2.1 2.1 3.1 1.9 5.9-1 2.5-2.4 3.3-7.3 1.9-10.9-.7-1.8-3.4-2.2-3.4-.5zM82.1 252.6c-2.6 1.8-2.8 6.9-.5 10.2 1.2 1.7 2.4 2.2 4.7 2 1.7-.2 3.2-.9 3.5-1.6.2-.7-.2-1-1.2-.6-.9.3-2.4.3-3.3 0-1.5-.6-1.2-1 1.5-2.8 3.3-2.1 4.1-4.8 2-6.5-2.5-1.9-4.6-2.1-6.7-.7zm4.4 3.4c0 .8-.8 1.6-1.7 1.8-1.3.2-1.8-.3-1.8-1.8s.5-2 1.8-1.8c.9.2 1.7 1 1.7 1.8zM109.4 253.2c.3 1.3.9 4.7 1.2 7.6.8 6.1 2.7 6.5 3.2.6.2-2.5 1.2-4.9 2.9-6.6 3-3.1 2.3-4.9-1-2.9-1.5 1-2.2 1-2.5.2-.2-.6-1.3-1.1-2.4-1.1-1.6 0-1.9.5-1.4 2.2zM132.8 251.6c-1.7 1.6-.6 2.4 3.2 2.4 2.2 0 4 .3 4 .7 0 .4-1.7 2.4-3.7 4.5-4.5 4.6-3.8 5.7 4 6.1 5.7.2 8.2-1.5 3-2.1-5.7-.6-5.8-1.1-1.9-5.1 3.2-3.3 3.5-3.9 2.1-5.1-1.8-1.5-9.7-2.5-10.7-1.4zM92.6 254.2c-1.7 5.6-1.1 10.9 1.1 9.5 1.2-.8 1.5-10.7.3-10.7-.6 0-1.2.6-1.4 1.2z" />
  </Svg>
        )     
    }
  
    return (
   
        <ScrollView>

        <View style={styles.logo}>
           <SvgTop />
        </View>
        
        {/* form  */}
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
          <SimpleLineIcons name="user" size={30} color={colors.secondary} />
            <TextInput
              style={styles.textInput}
              placeholder="Ingresa tu usuario"
              value={form.username}
              onChangeText={(username) => setForm({ ...form, username})}
              placeholderTextColor={colors.secondary}
              autoCapitalize="none"
            />
          </View>
          <View style={styles.inputContainer}>
          <SimpleLineIcons name={"lock"} size={30} color={colors.secondary} />
            <TextInput
              style={styles.textInput}
              placeholder="Ingresa tu contraseña"
              value={form.password}
              onChangeText={(password) => setForm({ ...form, password})}
              placeholderTextColor={colors.secondary}
              secureTextEntry={secureEntery}
            />
            <TouchableOpacity
              onPress={() => {
                setSecureEntery((prev) => !prev);
              }}
            >
           <SimpleLineIcons name={"eye"} size={20} color={colors.secondary} />
            </TouchableOpacity>
          </View>

         
         
          <TouchableOpacity style={styles.loginButtonWrapper}  onPress={handleLogin} disabled={posting}>
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>
          <Text style={styles.continueText}>O</Text>
          <TouchableOpacity style={styles.googleButtonContainer}>
            <Image
              source={require("../assets/images/google.png")}
              style={styles.googleImage}
            />
            <Text style={styles.googleText}>Google</Text>
          </TouchableOpacity>
          
        </View>
        </ScrollView>
      
    );
  };
  
  export default LoginScreen;
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
      padding: 20,
      
    },
    backButtonWrapper: {
      height: 40,
      width: 40,
      backgroundColor: colors.gray,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
    },
    textContainer: {
      marginVertical: 20,
    },
    headingText: {
      fontSize: 32,
      color: colors.primary,
      fontFamily: fonts.SemiBold,
    },
    formContainer: {
      marginTop: 20,
    },
    inputContainer: {
      borderWidth: 1,
      borderColor: colors.secondary,
      borderRadius: 100,
      paddingHorizontal: 20,
      flexDirection: "row",
      alignItems: "center",
      padding: 2,
      marginVertical: 10,
    },
    textInput: {
      flex: 1,
      paddingHorizontal: 10,
      fontFamily: fonts.Light,
    },
    forgotPasswordText: {
      textAlign: "right",
      color: colors.primary,
      fontFamily: fonts.SemiBold,
      marginVertical: 10,
    },
    loginButtonWrapper: {
      backgroundColor: colors.primary,
      borderRadius: 100,
      marginTop: 20,
    },
    loginText: {
      color: colors.white,
      fontSize: 20,
      fontFamily: fonts.SemiBold,
      textAlign: "center",
      padding: 10,
    },
    continueText: {
      textAlign: "center",
      marginVertical: 20,
      fontSize: 14,
      fontFamily: fonts.Regular,
      color: colors.primary,
    },
    googleButtonContainer: {
      flexDirection: "row",
      borderWidth: 2,
      borderColor: colors.primary,
      borderRadius: 100,
      justifyContent: "center",
      alignItems: "center",
      padding: 10,
      gap: 10,
    },
    googleImage: {
      height: 20,
      width: 20,
    },
    googleText: {
      fontSize: 20,
      fontFamily: fonts.SemiBold,
    },
    footerContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginVertical: 20,
      gap: 5,
    },
    accountText: {
      color: colors.primary,
      fontFamily: fonts.Regular,
    },
    logo:{
       alignItems: 'center',
    }

   
  });