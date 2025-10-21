import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import "react-native-gesture-handler";
import { ComponentList } from "./src/ComponentList";
import { ComponentScreenList } from "./src/constants";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export type RootStackParams = {
  [key in keyof typeof ComponentScreenList]: undefined;
} & {
  ComponentList: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParams>();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <RootStack.Navigator
          initialRouteName="ComponentList"
          screenOptions={{ headerShown: false }}
        >
          <RootStack.Screen name="ComponentList" component={ComponentList} />
          {Object.entries(ComponentScreenList).map(([name, component]) => (
            <RootStack.Screen
              key={name}
              name={name as keyof RootStackParams}
              component={component}
            />
          ))}
        </RootStack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
