import React from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { Badge } from '../ui/Badge';
import { tts } from '../../lib/tts';
import type { Word } from '../../types';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 48;
const CARD_HEIGHT = 420;

interface Props {
  word: Word;
  isFlipped: boolean;
  onFlip: () => void;
}

export function FlashCard({ word, isFlipped, onFlip }: Props) {
  const rotation = useSharedValue(isFlipped ? 180 : 0);

  React.useEffect(() => {
    rotation.value = withSpring(isFlipped ? 180 : 0, { damping: 15, stiffness: 100 });
  }, [isFlipped]);

  const frontStyle = useAnimatedStyle(() => ({
    transform: [{ rotateY: `${interpolate(rotation.value, [0, 180], [0, 180], Extrapolation.CLAMP)}deg` }],
    backfaceVisibility: 'hidden',
    position: 'absolute',
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
  }));

  const backStyle = useAnimatedStyle(() => ({
    transform: [{ rotateY: `${interpolate(rotation.value, [0, 180], [180, 360], Extrapolation.CLAMP)}deg` }],
    backfaceVisibility: 'hidden',
    position: 'absolute',
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
  }));

  return (
    <TouchableOpacity
      onPress={onFlip}
      activeOpacity={1}
      style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
    >
      <Animated.View style={frontStyle} className="bg-white rounded-3xl shadow-lg p-8 items-center justify-center border border-gray-100">
        <View className="absolute top-4 right-4">
          <Badge category={word.category} />
        </View>
        <Text className="text-6xl mb-6">{word.imageEmoji}</Text>
        <Text className="text-3xl font-bold text-textMain text-center mb-2">{word.english}</Text>
        <Text className="text-lg text-textSub text-center mb-6">{word.pronunciation}</Text>
        <TouchableOpacity
          onPress={() => tts.speak(word.english)}
          className="bg-cream rounded-full px-6 py-2 flex-row items-center"
          hitSlop={8}
        >
          <Text className="text-lg mr-1">🔊</Text>
          <Text className="text-primary font-medium">발음 듣기</Text>
        </TouchableOpacity>
        <Text className="text-textSub text-sm mt-8 opacity-60">탭하여 뒤집기 👆</Text>
      </Animated.View>

      <Animated.View style={[backStyle, { backgroundColor: '#FFFBEB', borderRadius: 24, padding: 32, justifyContent: 'center', borderWidth: 1, borderColor: '#F3F4F6' }]}>
        <Text className="text-sm font-medium text-textSub mb-1">{word.partOfSpeech}</Text>
        <Text className="text-3xl font-bold text-primary mb-4">{word.korean}</Text>

        <View className="bg-white rounded-2xl p-4 mb-4">
          <Text className="text-sm text-textSub font-medium mb-1">예문</Text>
          <Text className="text-base text-textMain italic mb-2">"{word.exampleEn}"</Text>
          <Text className="text-sm text-textSub">"{word.exampleKo}"</Text>
        </View>

        {word.synonyms.length > 0 && (
          <View className="flex-row flex-wrap gap-2">
            {word.synonyms.map(syn => (
              <View key={syn} className="bg-white rounded-full px-3 py-1 border border-gray-200">
                <Text className="text-sm text-textSub">{syn}</Text>
              </View>
            ))}
          </View>
        )}
        <Text className="text-textSub text-sm mt-6 text-center opacity-60">탭하여 앞으로 👆</Text>
      </Animated.View>
    </TouchableOpacity>
  );
}
