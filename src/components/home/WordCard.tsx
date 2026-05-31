import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Badge } from '../ui/Badge';
import { tts } from '../../lib/tts';
import type { Word } from '../../types';

interface Props {
  word: Word;
  index: number;
}

export function WordCard({ word, index }: Props) {
  const [expanded, setExpanded] = useState(false);
  const height = useSharedValue(0);

  const expandStyle = useAnimatedStyle(() => ({
    height: withTiming(expanded ? 120 : 0, { duration: 250 }),
    overflow: 'hidden',
  }));

  function toggle() {
    setExpanded(v => !v);
  }

  return (
    <TouchableOpacity onPress={toggle} activeOpacity={0.85} className="mx-4 mb-3">
      <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <Text className="text-2xl mr-3">{word.imageEmoji}</Text>
            <View className="flex-1">
              <Text className="text-xl font-bold text-textMain">{word.english}</Text>
              <Text className="text-sm text-textSub mt-0.5">{word.pronunciation}</Text>
            </View>
          </View>
          <View className="flex-row items-center gap-2">
            <Badge category={word.category} />
            <TouchableOpacity
              onPress={() => tts.speak(word.english)}
              className="w-8 h-8 rounded-full bg-cream items-center justify-center"
              hitSlop={8}
            >
              <Text>🔊</Text>
            </TouchableOpacity>
            <Text className="text-textSub text-lg">{expanded ? '▲' : '▼'}</Text>
          </View>
        </View>

        <Animated.View style={expandStyle}>
          <View className="mt-3 pt-3 border-t border-gray-100">
            <Text className="text-lg font-semibold text-textMain">{word.korean}</Text>
            <Text className="text-sm text-textSub mt-1 italic">"{word.exampleEn}"</Text>
            <Text className="text-sm text-textSub mt-0.5">"{word.exampleKo}"</Text>
          </View>
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
}
