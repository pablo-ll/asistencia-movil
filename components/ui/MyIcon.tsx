import { Icon, useTheme } from "@ui-kitten/components";
import { StyleSheet } from "react-native";




interface Props {
    name: string;
    color?: string;
    white?: boolean;
}

export default function MyIcon({ name, color, white=false }: Props) {

    const theme = useTheme();

    if (white) {
        color = theme['color-primary-100'];
    }else if(!color){
        color = theme['text-basic-color'];
    }else{
        color = theme[color];
    }
    return (
        <Icon
            name={name}
            style={styles.icon}
            fill={color}
        />
    )
}

const styles = StyleSheet.create({
    icon:{
        width: 30,
        height:30,
    }
  }
   );