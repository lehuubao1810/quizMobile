import {RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
  HomeNavigatorParamList,
  StackRoutesType,
} from '../../navigation/routeConfig';

// Declare type of root navigation props with generic
export type HomeStackNavigationScreenProps<
  T extends keyof HomeNavigatorParamList,
> = NativeStackNavigationProp<HomeNavigatorParamList, T>;

// Declare type of root route props with generic
export type HomeStackRouteScreenProps<T extends keyof HomeNavigatorParamList> =
  RouteProp<HomeNavigatorParamList, T>;

export type HomeStackRoutesType = StackRoutesType<HomeNavigatorParamList>;
