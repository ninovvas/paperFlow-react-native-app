import { createNativeStackNavigator } from "@react-navigation/native-stack";
import FavoritesScreen from "../screens/favorites/FavoritesScreen.jsx";
import PaperDetailsScreen from "../screens/feed/PaperDetailsScreen.jsx";

export default function FavoritesNavigator() {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator>
            <Stack.Screen name="Favorites" component={FavoritesScreen} options={{ title: 'Saved Papers' }} />
            <Stack.Screen name="PaperDetails" component={PaperDetailsScreen} options={{ title: 'Paper Details' }} />
        </Stack.Navigator>
    );
}