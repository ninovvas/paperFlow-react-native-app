import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";

import FeedNavigator from "./FeedNavigator.jsx";
import SearchNavigator from "./SearchNavigator.jsx";
import FiltersNavigator from "./FiltersNavigator.jsx";
import FavoritesNavigator from "./FavoritesNavigator.jsx";
import ProfileNavigator from "./ProfileNavigator.jsx";

export default function TabNavigator() {
    const Tabs = createBottomTabNavigator();
    const { colors } = useTheme();

    return (
        <Tabs.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.text,
                tabBarStyle: { backgroundColor: colors.card, borderTopColor: colors.border },
            }}
        >
            <Tabs.Screen
                name="FeedTab"
                component={FeedNavigator}
                options={{
                    title: "Feed",
                    tabBarIcon: ({ color, size }) => <Ionicons name="newspaper" size={size} color={color} />,
                }}
            />

            <Tabs.Screen
                name="SearchTab"
                component={SearchNavigator}
                options={{
                    title: "Search",
                    tabBarIcon: ({ color, size }) => <Ionicons name="search" size={size} color={color} />,
                }}
            />

            <Tabs.Screen
                name="FiltersTab"
                component={FiltersNavigator}
                options={{
                    title: "Filters",
                    tabBarIcon: ({ color, size }) => <Ionicons name="filter" size={size} color={color} />,
                }}
            />

            <Tabs.Screen
                name="FavoritesTab"
                component={FavoritesNavigator}
                options={{
                    title: "Favorites",
                    tabBarIcon: ({ color, size }) => <Ionicons name="heart" size={size} color={color} />,
                }}
            />

            <Tabs.Screen
                name="ProfileTab"
                component={ProfileNavigator}
                options={{
                    title: "Profile",
                    tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />,
                }}
            />
        </Tabs.Navigator>
    );
}
