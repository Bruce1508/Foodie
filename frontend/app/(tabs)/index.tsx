import { restaurants } from "@/constants/mockData";
import { Ionicons } from "@expo/vector-icons";
import { Image, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useAuth } from "@/contexts/AuthContext";

export default function Explore() {
	const { user, signOut } = useAuth();

	const handleSignOut = async () => {
		try {
			await signOut();
		} catch (error) {
			console.error('Sign out error:', error);
		}
	};

	return (
		<SafeAreaView className="flex-1 bg-white">
			<ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
				<View className="pt-5 mx-4">
					{/* Header */}
					<View className="flex-row justify-between items-center px-4 mb-4">
						<Text className="text-2xl font-quicksand-bold">FoodYou</Text>
						<TouchableOpacity onPress={handleSignOut}>
							<Ionicons name="log-out-outline" size={32} color="#6B4F4F" />
						</TouchableOpacity>
					</View>

					{/* User Welcome */}
					{user && (
						<View className="px-4 mb-6 bg-gray-50 rounded-lg py-4 mx-4">
							<View className="flex-row items-center">
								{user.picture && (
									<Image 
										source={{ uri: user.picture }} 
										className="w-12 h-12 rounded-full mr-3"
									/>
								)}
								<View>
									<Text className="text-lg font-quicksand-semibold">Welcome back, {user.name}!</Text>
									<Text className="text-sm font-quicksand-regular text-gray-600">{user.email}</Text>
								</View>
							</View>
						</View>
					)}

					{/* Search Bar */}
					<View className="px-4 mb-7">
						<View className="flex-row items-center bg-gray-50 rounded-full px-6 py-4">
							<Ionicons name="search" size={28} color="#B0A8A8" />
							<TextInput
								className="flex-1 ml-4 text-lg font-quicksand-regular"
								placeholder="Restaurants or cuisine"
								placeholderTextColor="#B0A8A8"
							/>
						</View>
					</View>

					{/* Filter Buttons */}
					<View className="flex-row justify-center px-4 mb-8">
						<TouchableOpacity className="bg-gray-100/30 rounded-full px-4 py-2 border border-gray-300 mr-4">
							<Text className="font-quicksand-medium text-base text-gray-600">Nearby</Text>
						</TouchableOpacity>
						<TouchableOpacity className="bg-gray-100/30 rounded-full px-4 py-2 border border-gray-300 mr-4">
							<Text className="font-quicksand-medium text-base text-gray-600">Budget-friendly</Text>
						</TouchableOpacity>
						<TouchableOpacity className="bg-gray-100/30 rounded-full px-4 py-2 border border-gray-300">
							<Text className="font-quicksand-medium text-base text-gray-600">Top-rated</Text>
						</TouchableOpacity>
					</View>

					{/* Restaurant List */}
					{restaurants.map(item => (
						<View key={item.id} className="flex-row items-center px-4 py-5">
							<Image
								source={item.image}
								className="w-16 h-16 rounded-xl mr-6"
								resizeMode="cover"
							/>
							<View className="flex-1">
								<Text className="font-quicksand-semibold text-lg mb-1">{item.name}</Text>
								<Text className="font-quicksand-regular text-sm text-gray-500">
									{item.address} · {item.distance}
								</Text>
							</View>
							<Text className="font-quicksand-medium text-lg mr-3">{item.price}</Text>
							<Text className="font-quicksand-medium text-lg">{item.rating}</Text>
						</View>
					))}
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

