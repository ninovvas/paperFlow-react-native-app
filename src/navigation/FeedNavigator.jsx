import { createNativeStackNavigator } from "@react-navigation/native-stack";
import FeedScreen from "../screens/feed/FeedScreen.jsx";
import PaperDetailsScreen from "../screens/feed/PaperDetailsScreen.jsx";

export default function FeedNavigator() {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator>
            <Stack.Screen name="Feed" component={FeedScreen} options={{ title: 'PaperFlow' }} />
            <Stack.Screen name="PaperDetails" component={PaperDetailsScreen} options={{ title: 'Paper Details' }} />
        </Stack.Navigator>
    );
}