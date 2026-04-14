import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import * as Sentry from '@sentry/react-native';

import StartScreen from './src/features/start/StartScreen';
import CategoriesScreen from './src/features/categories/CategoriesScreen';
import GratisScreen from './src/features/gratis/GratisScreen';
import StudioScreen from './src/features/studio/StudioScreen';
import MeinsScreen from './src/features/meins/MeinsScreen';
import ProductDetailScreen from './src/features/start/ProductDetailScreen';
import {
  StartIcon,
  CategoriesIcon,
  GratisIcon,
  StudioIcon,
  MeinsIcon,
} from './src/shared/icons';
import {Colors} from './src/shared/tokens';
import type {RootStackParamList, TabParamList} from './src/navigation/types';

Sentry.init({
  dsn: 'https://1abe202381b4b690829396148a3b897c@o4511209238102016.ingest.de.sentry.io/4511209239674960',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  enableLogs: true,

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

const RootStack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.deepRed,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarStyle: {
          height: 73,
          backgroundColor: Colors.backgroundCard,
          borderTopWidth: 1,
          borderTopColor: Colors.borderLight,
        },
      }}>
      <Tab.Screen
        name="Start"
        component={StartScreen}
        options={{
          tabBarIcon: ({color, size}) => <StartIcon color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Kategorien"
        component={CategoriesScreen}
        options={{
          tabBarIcon: ({color, size}) => <CategoriesIcon color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Gratis"
        component={GratisScreen}
        options={{
          tabBarIcon: ({color, size}) => <GratisIcon color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Studio"
        component={StudioScreen}
        options={{
          tabBarIcon: ({color, size}) => <StudioIcon color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Meins"
        component={MeinsScreen}
        options={{
          tabBarIcon: ({color, size}) => <MeinsIcon color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}

export default Sentry.wrap(function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <RootStack.Navigator screenOptions={{headerShown: false}}>
          <RootStack.Screen name="MainTabs" component={TabNavigator} />
          <RootStack.Screen name="ProductDetail" component={ProductDetailScreen} />
        </RootStack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
});
