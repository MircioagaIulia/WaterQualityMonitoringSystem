import { Tabs } from "expo-router";
import LogoutButton from "../../scripts/Logout";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChartLine, faMagic } from "@fortawesome/free-solid-svg-icons";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: true, headerTitleStyle: { fontSize: 20, fontWeight: 'bold' }, headerRight: () => <LogoutButton />, headerStyle: { backgroundColor: '#42c5f5' },
    headerTintColor: 'white', }}>
        
      <Tabs.Screen
        name="LiveDataScreen"
        options={{
          title: "Live Data",
          tabBarIcon: ({ color }: { color: string }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />

      <Tabs.Screen
        name="HistoryScreen"
        options={{
          title: "History",
          tabBarIcon: ({ color }: { color: string }) => <FontAwesomeIcon icon={faChartLine} size={28} color={color} />,
        }}
      />

      <Tabs.Screen
        name="PredictionScreen"
        options={{
          title: "Prediction",
          tabBarIcon: ({ color }: { color: string }) => <FontAwesomeIcon icon={faMagic} size={28} color={color} />,
        }}
      />

        <Tabs.Screen
        name="Charts"
        options={{
          title: "Charts",
          tabBarIcon: ({ color }: { color: string }) => <FontAwesomeIcon icon={faChartLine} size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}
