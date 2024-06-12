import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {TabNavigatorParamList, TabRoutesType} from '../../navigation/routeConfig';
import {RouteProp} from '@react-navigation/native';
import { ParamListBase } from '@react-navigation/native';

// Declare type of root navigation props with generic
export type TabNavigationScreenProps<T extends keyof TabNavigatorParamList> =
  BottomTabNavigationProp<TabNavigatorParamList, T>;

// Declare type of root route props with generic
export type TabRouteScreenProps<T extends keyof TabNavigatorParamList> =
  RouteProp<TabNavigatorParamList, T>;

export type TabStackRoutesType = TabRoutesType<TabNavigatorParamList>;
