import { Text, View, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <ScrollView contentContainerClassName="p-6">
        {/* Header Section */}
        <View className="mb-10 mt-8">
          <Text className="text-4xl font-bold text-white mb-2">
            Uni Event <Text className="text-indigo-500">Hub</Text>
          </Text>
          <Text className="text-slate-400 text-lg">
            Discover and manage campus events with ease.
          </Text>
        </View>

        {/* Feature Cards */}
        <View className="space-y-4">
          <TouchableOpacity 
            className="bg-slate-900 p-5 rounded-3xl border border-slate-800 shadow-xl"
            activeOpacity={0.7}
          >
            <View className="bg-indigo-500/10 w-12 h-12 rounded-2xl items-center justify-center mb-4">
              <Text className="text-2xl">📅</Text>
            </View>
            <Text className="text-white text-xl font-semibold mb-1">Explore Events</Text>
            <Text className="text-slate-500">Find the latest workshops, hackathons, and social gatherings.</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            className="bg-slate-900 p-5 rounded-3xl border border-slate-800 shadow-xl mt-4"
            activeOpacity={0.7}
          >
            <View className="bg-emerald-500/10 w-12 h-12 rounded-2xl items-center justify-center mb-4">
              <Text className="text-2xl">🎟️</Text>
            </View>
            <Text className="text-white text-xl font-semibold mb-1">My Tickets</Text>
            <Text className="text-slate-500">Keep track of all your event registrations in one place.</Text>
          </TouchableOpacity>
        </View>

        {/* CTA Button */}
        <TouchableOpacity 
          className="bg-indigo-600 h-16 rounded-2xl items-center justify-center mt-12 shadow-lg shadow-indigo-500/20"
          activeOpacity={0.8}
        >
          <Text className="text-white text-lg font-bold">Get Started</Text>
        </TouchableOpacity>

        <Text className="text-center text-slate-600 mt-8">
          v1.0.0 • Built with Expo & NativeWind
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
