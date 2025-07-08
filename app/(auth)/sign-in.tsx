import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Link, useRouter } from 'expo-router';
import { ImageBackground, StatusBar, Text, TouchableOpacity, View } from 'react-native';

export default function SignIn() {
    const router = useRouter();

    return (
        <View className="flex-1">
            <StatusBar barStyle="light-content" />
            
            {/* Background Image Section - Top Half */}
            <ImageBackground 
                source={require('../../assets/images/restaurant2.jpg')}
                className="flex-1"
                resizeMode="cover"
            >
                <BlurView intensity={80} className="flex-1">
                    <View className="flex-1 px-8 pt-16 pb-12 justify-center items-center">
                        {/* Back Button */}
                        <TouchableOpacity 
                            className="absolute top-16 left-8 bg-white/20 rounded-full p-3"
                            onPress={() => router.back()}
                        >
                            <Ionicons name="arrow-back" size={24} color="white" />
                        </TouchableOpacity>

                        <Text 
                            className="text-4xl font-quicksand-bold text-white text-center mb-6"
                            style={{ 
                                textShadowColor: 'rgba(0, 0, 0, 0.8)',
                                textShadowOffset: { width: 2, height: 2 },
                                textShadowRadius: 4
                            }}
                        >
                            Welcome Back
                        </Text>
                        <Text 
                            className="text-lg font-quicksand-regular text-white/95 text-center px-4"
                            style={{ 
                                textShadowColor: 'rgba(0, 0, 0, 0.6)',
                                textShadowOffset: { width: 1, height: 1 },
                                textShadowRadius: 3
                            }}
                        >
                            Sign in to continue your food journey
                        </Text>
                    </View>
                </BlurView>
            </ImageBackground>

            {/* White Background Section - Bottom Half */}
            <View className="bg-white px-8 pt-8 pb-12">
                {/* Buttons Section */}
                <View className="mb-10">
                    {/* Continue with Google */}
                    <TouchableOpacity className="bg-white rounded-full py-4 px-4 flex-row items-center justify-center mb-4 border border-gray-200">
                        <Ionicons name="logo-google" size={20} color="#DB4437" />
                        <Text className="text-gray-800 text-lg font-quicksand-medium ml-3">
                            Continue with Google
                        </Text>
                    </TouchableOpacity>

                    {/* Continue with Apple */}
                    <TouchableOpacity className="bg-white rounded-full py-4 px-4 flex-row items-center justify-center mb-4 border border-gray-200">
                        <Ionicons name="logo-apple" size={20} color="#000" />
                        <Text className="text-gray-800 text-lg font-quicksand-medium ml-3">
                            Continue with Apple
                        </Text>
                    </TouchableOpacity>

                    {/* Continue with Email */}
                    <TouchableOpacity className="bg-white rounded-full py-4 px-4 flex-row items-center justify-center mb-4 border border-gray-200">
                        <Ionicons name="mail" size={20} color="#6B7280" />
                        <Text className="text-gray-800 text-lg font-quicksand-medium ml-3">
                            Continue with Email
                        </Text>
                    </TouchableOpacity>

                    {/* Sign In Button - Primary */}
                    <TouchableOpacity 
                        className="bg-rose-400 rounded-full py-4 px-4 mt-2"
                        onPress={() => router.push('/(tabs)')}
                    >
                        <Text className="text-white text-lg font-quicksand-semibold text-center">
                            Sign In
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Sign Up Link */}
                <View className="items-center">
                    <Text className="text-gray-600 font-quicksand-regular text-center">
                        Don't have an account?{' '}
                        <Link href="/sign-up" asChild>
                            <Text className="text-rose-400 font-quicksand-semibold underline">
                                Sign up
                            </Text>
                        </Link>
                    </Text>
                </View>
            </View>
        </View>
    );
}