import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import FeedNavigator from "./FeedNavigator.jsx";
import SearchNavigator from "./SearchNavigator.jsx";

export default function TabNavigator() {
    const Tabs = createBottomTabNavigator();

    return (
        <Tabs.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#1B4F72',
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
                component={()=> {}}
                options={{
                    title: "Filters",
                    tabBarIcon: ({ color, size }) => <Ionicons name="filter" size={size} color={color} />,
                }}
            />

            <Tabs.Screen
                name="FavoritesTab"
                component={()=> {}}
                options={{
                    title: "Favorites",
                    tabBarIcon: ({ color, size }) => <Ionicons name="heart" size={size} color={color} />,
                }}
            />

            <Tabs.Screen
                name="ProfileTab"
                component={()=> {}}
                options={{
                    title: "Profile",
                    tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />,
                }}
            />
        </Tabs.Navigator>
    );
}
