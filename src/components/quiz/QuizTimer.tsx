import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedProps, withTiming, Easing } from 'react-native-reanimated';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const SIZE = 80;
const STROKE = 6;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface Props {
  duration: number;
  onTimeout: () => void;
}

export function QuizTimer({ duration, onTimeout }: Props) {
  const [remaining, setRemaining] = React.useState(duration);
  const progress = useSharedValue(1);

  React.useEffect(() => {
    progress.value = withTiming(0, { duration: duration * 1000, easing: Easing.linear });
    const interval = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCUMFERENCE * (1 - progress.value),
  }));

  const color = remaining > 20 ? '#F97316' : remaining > 10 ? '#FBBF24' : '#EF4444';

  return (
    <View className="items-center">
      <Svg width={SIZE} height={SIZE}>
        <Circle
          cx={SIZE / 2} cy={SIZE / 2} r={RADIUS}
          stroke="#FEF3C7" strokeWidth={STROKE} fill="none"
        />
        <AnimatedCircle
          cx={SIZE / 2} cy={SIZE / 2} r={RADIUS}
          stroke={color} strokeWidth={STROKE} fill="none"
          strokeDasharray={CIRCUMFERENCE}
          animatedProps={animatedProps}
          strokeLinecap="round"
          rotation="-90"
          origin={`${SIZE / 2}, ${SIZE / 2}`}
        />
      </Svg>
      <View className="absolute inset-0 items-center justify-center">
        <Text className="text-xl font-bold" style={{ color }}>{remaining}</Text>
      </View>
    </View>
  );
}
