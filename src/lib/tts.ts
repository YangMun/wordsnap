import * as Speech from 'expo-speech';

export const tts = {
  speak(text: string) {
    Speech.stop();
    Speech.speak(text, { language: 'en-US', pitch: 1.0, rate: 0.85 });
  },
  stop() {
    Speech.stop();
  },
};
