import { createNativeStackNavigator } from "@react-navigation/native-stack";
import FilterListScreen from "../screens/filters/FilterListScreen.jsx";
import CreateFilterScreen from "../screens/filters/CreateFilterScreen.jsx";
import EditFilterScreen from "../screens/filters/EditFilterScreen.jsx";

export default function FiltersNavigator() {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator>
            <Stack.Screen name="FilterList" component={FilterListScreen} options={{ title: 'My Filters' }} />
            <Stack.Screen name="CreateFilter" component={CreateFilterScreen} options={{ title: 'New Filter' }} />
            <Stack.Screen name="EditFilter" component={EditFilterScreen} options={{ title: 'Edit Filter' }} />
        </Stack.Navigator>
    );
}