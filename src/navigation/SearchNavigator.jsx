import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SearchScreen from "../screens/search/SearchScreen.jsx";
import PaperDetailsScreen from "../screens/feed/PaperDetailsScreen.jsx";

export default function SearchNavigator() {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator>
            <Stack.Screen name="Search" component={SearchScreen} options={{ title: 'Search Papers' }} />
            <Stack.Screen name="PaperDetails" component={PaperDetailsScreen} options={{ title: 'Paper Details' }} />
        </Stack.Navigator>
    );
}
