import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Link, useRouter } from 'expo-router';
import { ImageBackground, StatusBar, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';

export default function SignUp() {
    const router = useRouter();
    const { signInWithGoogle, loading } = useAuth();

    const handleGoogleSignUp = async () => {
        try {
            await signInWithGoogle();
            // Navigation sẽ được handle tự động bởi tab layout authentication check
        } catch (error) {
            console.error('Sign up error:', error);
        }
    };

    return (
        <View className="flex-1">
            <StatusBar barStyle="light-content" />
            
            {/* Background Image Section - Top Half */}
            <ImageBackground 
                source={require('../../assets/images/restaurant1.webp')}
                className="flex-1"
                resizeMode="cover"
            >
                <BlurView intensity={80} className="flex-1">
                    <View className="flex-1 px-8 pt-20 pb-12 justify-center items-center">
                        <Text 
                            className="text-4xl font-quicksand-bold text-white text-center mb-6"
                            style={{ 
                                textShadowColor: 'rgba(0, 0, 0, 0.8)',
                                textShadowOffset: { width: 2, height: 2 },
                                textShadowRadius: 4
                            }}
                        >
                            Discover Local Flavors
                        </Text>
                        <Text 
                            className="text-lg font-quicksand-regular text-white/95 text-center px-4"
                            style={{ 
                                textShadowColor: 'rgba(0, 0, 0, 0.6)',
                                textShadowOffset: { width: 1, height: 1 },
                                textShadowRadius: 3
                            }}
                        >
                            Find the best restaurants and near you
                        </Text>
                    </View>
                </BlurView>
            </ImageBackground>

            {/* White Background Section - Bottom Half */}
            <View className="bg-white px-8 pt-8 pb-12">
                {/* Buttons Section */}
                <View className="mb-10">
                    {/* Continue with Google - REAL AUTHENTICATION */}
                    <TouchableOpacity 
                        className="bg-white rounded-full py-4 px-4 flex-row items-center justify-center mb-4 border border-gray-200"
                        onPress={handleGoogleSignUp}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="#DB4437" />
                        ) : (
                            <Ionicons name="logo-google" size={20} color="#DB4437" />
                        )}
                        <Text className="text-gray-800 text-lg font-quicksand-medium ml-3">
                            {loading ? 'Signing up...' : 'Continue with Google'}
                        </Text>
                    </TouchableOpacity>

                    {/* Continue with Apple - TODO: Implement Apple Sign-In */}
                    <TouchableOpacity 
                        className="bg-white rounded-full py-4 px-4 flex-row items-center justify-center mb-4 border border-gray-200 opacity-50"
                    >
                        <Ionicons name="logo-apple" size={20} color="#000" />
                        <Text className="text-gray-800 text-lg font-quicksand-medium ml-3">
                            Continue with Apple (Coming Soon)
                        </Text>
                    </TouchableOpacity>

                    {/* Continue with Email - TODO: Implement Email Auth */}
                    <TouchableOpacity 
                        className="bg-white rounded-full py-4 px-4 flex-row items-center justify-center mb-4 border border-gray-200 opacity-50"
                    >
                        <Ionicons name="mail" size={20} color="#6B7280" />
                        <Text className="text-gray-800 text-lg font-quicksand-medium ml-3">
                            Continue with Email (Coming Soon)
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Login Link */}
                <View className="items-center">
                    <Text className="text-gray-600 font-quicksand-regular text-center">
                        Already have an account?{' '}
                        <Link href="/sign-in" asChild>
                            <Text className="text-rose-400 font-quicksand-semibold underline">
                                Log in
                            </Text>
                        </Link>
                    </Text>
                </View>
            </View>
        </View>
    );
}