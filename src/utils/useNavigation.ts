import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParams } from "../../App";

export type AppNavigationProp = NativeStackNavigationProp<RootStackParams>;

export const useAppNavigation = () => {
  return useNavigation<AppNavigationProp>();
};
