import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { getVehicleGallery, getVehicleImage } from '../constants/carImages';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CAROUSEL_WIDTH = SCREEN_WIDTH - 40;
const CAROUSEL_HEIGHT = Math.round(CAROUSEL_WIDTH * 0.62);

export default function VehicleCarousel({ vehicle }) {
  const flatListRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const rawGallery = vehicle?.images?.length
    ? vehicle.images
    : getVehicleGallery(vehicle);

  const gallery = rawGallery.length > 0
    ? rawGallery
    : [
        {
          id: 'single-1',
          title: 'Visão Geral 2026',
          source: vehicle?.image || getVehicleImage(vehicle),
        },
      ];

  const handleScroll = (event) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const offset = event.nativeEvent.contentOffset.x;
    const index = Math.round(offset / slideSize);
    if (index >= 0 && index < gallery.length && index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  const scrollTo = (index) => {
    if (index >= 0 && index < gallery.length) {
      flatListRef.current?.scrollToIndex({ index, animated: true });
      setActiveIndex(index);
    }
  };

  const currentItem = gallery[activeIndex] || gallery[0];

  return (
    <View style={styles.container}>
      {}
      <View style={styles.carouselWrapper}>
        <FlatList
          ref={flatListRef}
          data={gallery}
          keyExtractor={(item, index) => item.id || `photo-${index}`}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScroll}
          getItemLayout={(_, index) => ({
            length: CAROUSEL_WIDTH,
            offset: CAROUSEL_WIDTH * index,
            index,
          })}
          renderItem={({ item }) => (
            <View style={styles.slide}>
              {item.source ? (
                <Image
                  source={item.source}
                  style={styles.image}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.fallbackContainer}>
                  <Text style={styles.fallbackEmoji}>{vehicle?.emoji || '🚗'}</Text>
                </View>
              )}
            </View>
          )}
        />

        {}
        <View style={styles.badge2026}>
          <Ionicons name="sparkles" size={12} color="#FFFFFF" />
          <Text style={styles.badgeText}>MODELO 2026 • 0 KM</Text>
        </View>

        {}
        <View style={styles.counterBadge}>
          <Ionicons name="images-outline" size={12} color="#FFFFFF" />
          <Text style={styles.counterText}>
            {activeIndex + 1}/{gallery.length}
          </Text>
        </View>

        {}
        {currentItem?.title && (
          <View style={styles.photoCaptionBadge}>
            <Text style={styles.photoCaptionText}>{currentItem.title}</Text>
          </View>
        )}

        {}
        {gallery.length > 1 && activeIndex > 0 && (
          <TouchableOpacity
            style={[styles.arrowButton, styles.arrowLeft]}
            onPress={() => scrollTo(activeIndex - 1)}
            activeOpacity={0.8}
          >
            <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        )}

        {gallery.length > 1 && activeIndex < gallery.length - 1 && (
          <TouchableOpacity
            style={[styles.arrowButton, styles.arrowRight]}
            onPress={() => scrollTo(activeIndex + 1)}
            activeOpacity={0.8}
          >
            <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        )}

        {}
        {gallery.length > 1 && (
          <View style={styles.dotsContainer}>
            {gallery.map((_, idx) => (
              <TouchableOpacity
                key={`dot-${idx}`}
                onPress={() => scrollTo(idx)}
                style={[
                  styles.dot,
                  idx === activeIndex ? styles.dotActive : styles.dotInactive,
                ]}
              />
            ))}
          </View>
        )}
      </View>

      {}
      {gallery.length > 1 && (
        <View style={styles.thumbnailsRow}>
          {gallery.map((item, idx) => {
            const isSelected = idx === activeIndex;
            return (
              <TouchableOpacity
                key={`thumb-${idx}`}
                onPress={() => scrollTo(idx)}
                style={[
                  styles.thumbnailCard,
                  isSelected && styles.thumbnailCardActive,
                ]}
                activeOpacity={0.85}
              >
                {item.source ? (
                  <Image
                    source={item.source}
                    style={styles.thumbnailImage}
                    resizeMode="cover"
                  />
                ) : (
                  <Text style={{ fontSize: 16 }}>🚗</Text>
                )}
                {isSelected && <View style={styles.thumbnailOverlay} />}
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  carouselWrapper: {
    width: CAROUSEL_WIDTH,
    height: CAROUSEL_HEIGHT,
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: '#0F172A',
    position: 'relative',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  slide: {
    width: CAROUSEL_WIDTH,
    height: CAROUSEL_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E293B',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  fallbackContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    width: '100%',
    height: '100%',
  },
  fallbackEmoji: {
    fontSize: 70,
  },
  badge2026: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 130, 72, 0.92)',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 4,
    elevation: 3,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  counterBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 5,
  },
  counterText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  photoCaptionBadge: {
    position: 'absolute',
    bottom: 24,
    left: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  photoCaptionText: {
    color: '#F8FAFC',
    fontSize: 11,
    fontWeight: '600',
  },
  arrowButton: {
    position: 'absolute',
    top: '44%',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowLeft: {
    left: 8,
  },
  arrowRight: {
    right: 8,
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 8,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  dotActive: {
    width: 18,
    backgroundColor: Colors.primary,
  },
  dotInactive: {
    width: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  thumbnailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
    paddingHorizontal: 2,
  },
  thumbnailCard: {
    flex: 1,
    height: 52,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#E2E8F0',
    borderWidth: 1.5,
    borderColor: 'transparent',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnailCardActive: {
    borderColor: Colors.primary,
    elevation: 2,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  thumbnailOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 130, 72, 0.15)',
  },
});
