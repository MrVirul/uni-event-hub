import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator, RefreshControl, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import { API_URL } from '../config';

const { width } = Dimensions.get('window');

const CATEGORY_COLORS = {
  Academic: '#4A90E2',
  Sports: '#27AE60',
  Cultural: '#E67E22',
  Social: '#9B59B6',
  Workshop: '#E74C3C',
  Other: '#95A5A6'
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const getStatusColor = (status) => {
  switch (status) {
    case 'Upcoming': return '#3498db';
    case 'Ongoing': return '#2ecc71';
    case 'Completed': return '#95a5a6';
    case 'Cancelled': return '#e74c3c';
    default: return '#7f8c8d';
  }
};

export default function EventListScreen({ navigation }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/events`);
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchEvents();
  };

  const renderUpcomingStory = ({ item }) => (
    <TouchableOpacity 
      style={styles.storyCard}
      onPress={() => navigation.navigate('EventDetail', { eventId: item._id })}
    >
      <View style={styles.storyImageContainer}>
        {item.image ? (
          <Image source={{ uri: `${API_URL}${item.image}` }} style={styles.storyImage} />
        ) : (
          <View style={[styles.storyImage, styles.placeholderImage]}>
            <Text style={styles.emojiText}>📅</Text>
          </View>
        )}
        <View style={styles.storyDateBadge}>
          <Text style={styles.storyDateText}>{new Date(item.date).getDate()}</Text>
          <Text style={styles.storyMonthText}>{new Date(item.date).toLocaleString('default', { month: 'short' })}</Text>
        </View>
      </View>
      <Text style={styles.storyTitle} numberOfLines={2}>{item.title}</Text>
    </TouchableOpacity>
  );

  const renderFeedPost = ({ item }) => {
    const capacityPercentage = item.capacity > 0 ? Math.min((item.registeredCount || 0) / item.capacity, 1) : 0;
    const categoryColor = CATEGORY_COLORS[item.category] || CATEGORY_COLORS.Other;
    
    return (
      <View style={styles.postCard}>
        <TouchableOpacity onPress={() => navigation.navigate('EventDetail', { eventId: item._id })}>
          <View style={styles.postHeader}>
            <View style={styles.postHeaderLeft}>
              <View style={[styles.categoryBadge, { backgroundColor: categoryColor }]}>
                <Text style={styles.categoryBadgeText}>{item.category}</Text>
              </View>
              <Text style={styles.postTitle}>{item.title}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
              <Text style={styles.statusBadgeText}>{item.status}</Text>
            </View>
          </View>

          {item.image ? (
            <Image source={{ uri: `${API_URL}${item.image}` }} style={styles.postImage} />
          ) : (
            <View style={[styles.postImage, styles.placeholderImage]}>
              <Text style={styles.emojiLarge}>📅</Text>
            </View>
          )}

          <View style={styles.postBody}>
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>📅</Text>
              <Text style={styles.infoText}>{formatDate(item.date)}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>⏰</Text>
              <Text style={styles.infoText}>{item.time}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>📍</Text>
              <Text style={styles.infoText}>{item.location}</Text>
            </View>

            <View style={styles.capacityContainer}>
              <View style={styles.capacityHeader}>
                <Text style={styles.capacityLabel}>Capacity</Text>
                <Text style={styles.capacityValue}>{item.registeredCount || 0} / {item.capacity}</Text>
              </View>
              <View style={styles.progressBarBackground}>
                <View style={[styles.progressBarFill, { width: `${capacityPercentage * 100}%`, backgroundColor: capacityPercentage >= 1 ? '#e74c3c' : '#4A90E2' }]} />
              </View>
            </View>

            <View style={styles.actionRow}>
              <View style={styles.viewDetailsBtn}>
                <Text style={styles.viewDetailsText}>View Details</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const upcomingEvents = events.filter(e => e.status === 'Upcoming');

  const listHeader = () => (
    <View>
      <LinearGradient colors={['#1a237e', '#4A90E2']} style={styles.headerGradient}>
        <Text style={styles.headerTitle}>Uni Events</Text>
        <Text style={styles.headerSubtitle}>Discover what's happening on campus</Text>
      </LinearGradient>
      
      {upcomingEvents.length > 0 && (
        <View style={styles.storiesSection}>
          <Text style={styles.sectionTitle}>UPCOMING EVENTS</Text>
          <FlatList
            data={upcomingEvents}
            renderItem={renderUpcomingStory}
            keyExtractor={item => 'story-' + item._id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.storiesList}
          />
        </View>
      )}
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={events}
        renderItem={renderFeedPost}
        keyExtractor={item => item._id}
        ListHeaderComponent={listHeader}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.feedList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#4A90E2"]} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No events found</Text>
            <TouchableOpacity style={styles.createFirstBtn} onPress={() => navigation.navigate('AddEvent')}>
              <Text style={styles.createFirstText}>Create First Event</Text>
            </TouchableOpacity>
          </View>
        }
      />

      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('AddEvent')}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F2F5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F2F5',
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  storiesSection: {
    marginTop: 15,
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#65676B',
    marginLeft: 15,
    marginBottom: 10,
    letterSpacing: 1,
  },
  storiesList: {
    paddingHorizontal: 10,
  },
  storyCard: {
    width: 100,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  storyImageContainer: {
    width: 90,
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 5,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  storyImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  storyDateBadge: {
    position: 'absolute',
    top: 5,
    left: 5,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 6,
    padding: 4,
    alignItems: 'center',
    minWidth: 35,
  },
  storyDateText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1a237e',
  },
  storyMonthText: {
    fontSize: 10,
    color: '#65676B',
    textTransform: 'uppercase',
  },
  storyTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1C1E21',
    textAlign: 'center',
    paddingHorizontal: 2,
  },
  feedList: {
    paddingBottom: 80,
  },
  postCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginHorizontal: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
    overflow: 'hidden',
    marginTop: 10,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 15,
  },
  postHeaderLeft: {
    flex: 1,
    paddingRight: 10,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 8,
  },
  categoryBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1E21',
    lineHeight: 24,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
  },
  postImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  placeholderImage: {
    backgroundColor: '#E4E6EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emojiLarge: {
    fontSize: 50,
  },
  emojiText: {
    fontSize: 30,
  },
  postBody: {
    padding: 15,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoIcon: {
    fontSize: 16,
    marginRight: 10,
    width: 20,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#65676B',
    flex: 1,
  },
  capacityContainer: {
    marginTop: 10,
    marginBottom: 15,
    backgroundColor: '#F0F2F5',
    padding: 10,
    borderRadius: 8,
  },
  capacityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  capacityLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#65676B',
  },
  capacityValue: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1C1E21',
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: '#E4E6EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  actionRow: {
    borderTopWidth: 1,
    borderTopColor: '#E4E6EB',
    paddingTop: 15,
    alignItems: 'center',
  },
  viewDetailsBtn: {
    backgroundColor: '#E7F3FF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    width: '100%',
    alignItems: 'center',
  },
  viewDetailsText: {
    color: '#1877F2',
    fontWeight: 'bold',
    fontSize: 15,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#1877F2',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  fabIcon: {
    fontSize: 30,
    color: 'white',
    marginTop: -2,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#65676B',
    marginBottom: 20,
  },
  createFirstBtn: {
    backgroundColor: '#1877F2',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  createFirstText: {
    color: 'white',
    fontWeight: 'bold',
  }
});
