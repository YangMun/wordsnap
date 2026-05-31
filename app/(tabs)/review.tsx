import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { useWordStore } from '../../src/store/useWordStore';
import { Badge } from '../../src/components/ui/Badge';
import { tts } from '../../src/lib/tts';
import type { Word, WordCategory } from '../../src/types';

const FILTERS = ['전체', '학습완료', '미학습'] as const;
type Filter = typeof FILTERS[number];

function WordItem({ word, isLearned }: { word: Word; isLearned: boolean }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <TouchableOpacity onPress={() => setExpanded(v => !v)} activeOpacity={0.85}>
      <View className="bg-white mx-4 mb-2 rounded-2xl p-4 border border-gray-100">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <Text className="text-xl mr-2">{word.imageEmoji}</Text>
            <View className="flex-1">
              <Text className="font-bold text-textMain text-base">{word.english}</Text>
              <Text className="text-xs text-textSub">{word.pronunciation}</Text>
            </View>
          </View>
          <View className="flex-row items-center gap-2">
            <Badge category={word.category} />
            <Text>{isLearned ? '✅' : '⬜'}</Text>
            <TouchableOpacity onPress={() => tts.speak(word.english)} hitSlop={8}>
              <Text>🔊</Text>
            </TouchableOpacity>
          </View>
        </View>
        {expanded && (
          <View className="mt-3 pt-3 border-t border-gray-100">
            <Text className="text-base font-semibold text-primary">{word.korean}</Text>
            <Text className="text-sm text-textSub italic mt-1">"{word.exampleEn}"</Text>
            <Text className="text-sm text-textSub mt-0.5">"{word.exampleKo}"</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

export default function ReviewScreen() {
  const allWords = useWordStore(s => s.allWords);
  const learnedEntries = useWordStore(s => s.learnedEntries);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('전체');

  const learnedIds = useMemo(() => new Set(learnedEntries.map(e => e.wordId)), [learnedEntries]);

  const filtered = useMemo(() => {
    let words = allWords;
    if (filter === '학습완료') words = words.filter(w => learnedIds.has(w.id));
    else if (filter === '미학습') words = words.filter(w => !learnedIds.has(w.id));
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      words = words.filter(w => w.english.toLowerCase().includes(q) || w.korean.includes(q));
    }
    return words;
  }, [allWords, learnedIds, filter, search]);

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="px-4 pt-4 pb-2">
        <Text className="text-2xl font-bold text-textMain">단어장 📚</Text>
        <Text className="text-textSub text-sm">{allWords.length}개 단어 | {learnedIds.size}개 학습완료</Text>
      </View>

      <View className="px-4 mb-3">
        <View className="bg-white rounded-xl px-3 py-2 flex-row items-center border border-gray-200">
          <Text className="mr-2">🔍</Text>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="영어 또는 한국어로 검색..."
            className="flex-1 text-textMain"
            placeholderTextColor="#78716C"
          />
        </View>
      </View>

      <View className="flex-row px-4 mb-3 gap-2">
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f}
            onPress={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full ${filter === f ? 'bg-primary' : 'bg-white border border-gray-200'}`}
          >
            <Text className={`text-sm font-medium ${filter === f ? 'text-white' : 'text-textSub'}`}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={w => w.id}
        renderItem={({ item }) => <WordItem word={item} isLearned={learnedIds.has(item.id)} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
        ListEmptyComponent={
          <View className="items-center py-12">
            <Text className="text-4xl mb-2">🔍</Text>
            <Text className="text-textSub">검색 결과가 없어요</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
