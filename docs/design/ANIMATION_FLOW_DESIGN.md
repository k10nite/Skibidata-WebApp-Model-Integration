# Fertilizer App Animation Flow & UX Transitions
### Peak-End Rule Implementation for Demo-Ready Experience

---

## 🎯 Overview

This document outlines the complete animation strategy for the fertilizer recommendation app, designed around the **Peak-End Rule** to create memorable, delightful user experiences during demos and daily use.

**Screen Flow:**
```
Location Selection → Plant Selection → Processing → Soil Status →
Plant Requirements → Fertilizer Recommendations → End Actions
```

---

## 📚 Animation Library Recommendation

### **Primary Choice: React Native Animated API (Already in use)**

**Why stick with React Native Animated:**
- ✅ Already implemented in your codebase (`C:\Users\Neil\Documents\thesis\AgriCapture\src\utils\animations.js`)
- ✅ Native driver support (60 FPS performance)
- ✅ No additional dependencies
- ✅ Works seamlessly with existing `AnimatedButton` component
- ✅ Lightweight and battle-tested

**Alternative (if you want more declarative syntax):**
- **Reanimated 2/3**: For complex gesture-based animations (overkill for this use case)
- **Moti**: Declarative wrapper around Reanimated (adds dependency weight)

**Recommendation:** Stick with your existing `Animated` setup and enhance it.

---

## ⏱️ Animation Timing Standards

```javascript
// Standard timing values (already partially defined in animations.js)
export const TIMING = {
  instant: 100,    // Immediate feedback (button press)
  fast: 150,       // Quick transitions
  normal: 300,     // Standard page transitions
  slow: 500,       // Emphasized animations
  loading: 2000,   // Processing sequences
};

// Easing functions
export const EASINGS = {
  // Entry animations - smooth deceleration
  enter: Easing.out(Easing.cubic),

  // Exit animations - smooth acceleration
  exit: Easing.in(Easing.cubic),

  // Through animations - balanced
  through: Easing.inOut(Easing.cubic),

  // Bounce (use sparingly - only for success states)
  bounce: Easing.elastic(1.2),

  // Smooth sine wave (for pulsing indicators)
  smooth: Easing.inOut(Easing.sin),
};
```

---

## 🎬 Screen-by-Screen Animation Flow

### **PEAK 1: Location Selection Screen** (GPS Lock Animation)
**Goal:** Create excitement when location is detected

#### Animations:
1. **GPS Search State** (while searching)
```javascript
// Pulsing GPS icon animation
const gpsPulse = useRef(new Animated.Value(1)).current;

useEffect(() => {
  if (isSearching) {
    Animated.loop(
      Animated.sequence([
        Animated.timing(gpsPulse, {
          toValue: 1.2,
          duration: 1000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(gpsPulse, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }
}, [isSearching]);
```

2. **GPS Lock Success** (when location found)
```javascript
const lockSuccess = () => {
  // Haptic feedback
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

  // Visual celebration
  Animated.sequence([
    // Quick scale down
    Animated.timing(scaleAnim, {
      toValue: 0.8,
      duration: 100,
      useNativeDriver: true,
    }),
    // Bounce back larger
    Animated.spring(scaleAnim, {
      toValue: 1.1,
      friction: 4,
      tension: 40,
      useNativeDriver: true,
    }),
    // Settle
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }),
  ]).start();

  // Checkmark fade in
  Animated.timing(checkmarkOpacity, {
    toValue: 1,
    duration: 300,
    easing: Easing.out(Easing.ease),
    useNativeDriver: true,
  }).start();
};
```

3. **Location Card Reveal**
```javascript
// Stagger animation for municipality and barangay cards
const revealLocationCard = () => {
  Animated.stagger(150, [
    Animated.parallel([
      fadeIn(municipalityOpacity, 300),
      slideUp(municipalitySlide, 300),
    ]),
    Animated.parallel([
      fadeIn(barangayOpacity, 300),
      slideUp(barangaySlide, 300),
    ]),
  ]).start();
};
```

#### Visual Effects:
- GPS icon: Pulsing glow (opacity 0.4 → 1.0)
- Success: Green ripple effect from center
- Location text: Type-in effect (optional, for premium feel)

---

### **Plant Selection Screen**
**Goal:** Make selection feel tactile and responsive

#### Animations:
1. **Grid Entry Animation**
```javascript
// Stagger each crop card entrance
const revealCrops = (crops) => {
  const animations = crops.map((_, index) =>
    Animated.parallel([
      Animated.timing(fadeAnims[index], {
        toValue: 1,
        duration: 300,
        delay: index * 50, // 50ms stagger
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnims[index], {
        toValue: 0,
        duration: 300,
        delay: index * 50,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ])
  );

  Animated.parallel(animations).start();
};
```

2. **Crop Selection Interaction** (enhance existing)
```javascript
// Use your existing AnimatedButton, but add selection state
const CropCard = ({ crop, isSelected, onPress }) => {
  const selectedScale = useRef(new Animated.Value(isSelected ? 1 : 0.95)).current;
  const selectedGlow = useRef(new Animated.Value(isSelected ? 1 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(selectedScale, {
        toValue: isSelected ? 1.05 : 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(selectedGlow, {
        toValue: isSelected ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isSelected]);

  return (
    <AnimatedButton
      onPress={onPress}
      haptic={isSelected ? "success" : "light"}
      scaleValue={0.98}
    >
      <Animated.View
        style={[
          styles.cropCard,
          {
            transform: [{ scale: selectedScale }],
            shadowOpacity: selectedGlow.interpolate({
              inputRange: [0, 1],
              outputRange: [0.1, 0.3],
            }),
          }
        ]}
      >
        {/* Card content */}
      </Animated.View>
    </AnimatedButton>
  );
};
```

3. **Selection Counter Animation**
```javascript
// Animate count badge when selection changes
const animateCount = (newCount) => {
  Animated.sequence([
    Animated.timing(countScale, {
      toValue: 1.3,
      duration: 150,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }),
    Animated.spring(countScale, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }),
  ]).start();
};
```

---

### **PEAK 2: Processing Screen** (Engaging Loading Animation)
**Goal:** Keep users engaged during the wait with dynamic, informative animations

#### Multi-Step Loading Sequence:
```javascript
const ProcessingScreen = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const stepOpacity = useRef(new Animated.Value(1)).current;

  const STEPS = [
    { text: "Analyzing soil composition...", duration: 2000, icon: "flask" },
    { text: "Calculating nutrient levels...", duration: 2500, icon: "calculator" },
    { text: "Matching crop requirements...", duration: 2000, icon: "leaf" },
    { text: "Generating recommendations...", duration: 1500, icon: "lightbulb" },
  ];

  useEffect(() => {
    animateStep(0);
  }, []);

  const animateStep = (index) => {
    if (index >= STEPS.length) {
      // Navigate to results
      return;
    }

    setCurrentStep(index);

    // Fade in step text
    Animated.timing(stepOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Animate progress bar
    Animated.timing(progressAnim, {
      toValue: (index + 1) / STEPS.length,
      duration: STEPS[index].duration,
      easing: Easing.linear,
      useNativeDriver: false, // width animation
    }).start(() => {
      // Fade out before next step
      Animated.timing(stepOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        animateStep(index + 1);
      });
    });
  };

  return (
    <View style={styles.processingContainer}>
      {/* Spinning loader */}
      <SpinningLoader />

      {/* Step indicator */}
      <Animated.View style={{ opacity: stepOpacity }}>
        <Icon name={STEPS[currentStep].icon} size={32} />
        <Text style={styles.stepText}>
          {STEPS[currentStep].text}
        </Text>
      </Animated.View>

      {/* Progress bar */}
      <View style={styles.progressBar}>
        <Animated.View
          style={[
            styles.progressFill,
            {
              width: progressAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            }
          ]}
        />
      </View>

      {/* Step dots */}
      <View style={styles.stepDots}>
        {STEPS.map((_, i) => (
          <StepDot key={i} active={i <= currentStep} />
        ))}
      </View>
    </View>
  );
};
```

#### Advanced Loading Components:

**Spinning Loader with Particle Effect:**
```javascript
const SpinningLoader = () => {
  const rotation = useRef(new Animated.Value(0)).current;
  const particles = useRef(
    [...Array(8)].map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    // Continuous rotation
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Particle pulse
    const particleAnims = particles.map((particle, index) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(index * 100),
          Animated.timing(particle, {
            toValue: 1,
            duration: 800,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(particle, {
            toValue: 0,
            duration: 800,
            easing: Easing.in(Easing.quad),
            useNativeDriver: true,
          }),
        ])
      )
    );

    Animated.parallel(particleAnims).start();
  }, []);

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.loaderContainer}>
      {/* Rotating circle */}
      <Animated.View
        style={[
          styles.loader,
          { transform: [{ rotate: spin }] }
        ]}
      >
        <LinearGradient
          colors={['#22C55E', '#10B981', '#22C55E']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.loaderGradient}
        />
      </Animated.View>

      {/* Particle effects */}
      {particles.map((particle, index) => {
        const angle = (index / particles.length) * Math.PI * 2;
        return (
          <Animated.View
            key={index}
            style={[
              styles.particle,
              {
                opacity: particle,
                transform: [
                  {
                    translateX: particle.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, Math.cos(angle) * 40],
                    }),
                  },
                  {
                    translateY: particle.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, Math.sin(angle) * 40],
                    }),
                  },
                ],
              },
            ]}
          />
        );
      })}
    </View>
  );
};
```

---

### **PEAK 3: Results Reveal** (Soil Status & Fertilizer Cards)
**Goal:** Create a "wow" moment when results appear

#### 1. **Page Transition Animation**
```javascript
const ResultsScreen = ({ navigation }) => {
  const containerOpacity = useRef(new Animated.Value(0)).current;
  const containerSlide = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Smooth entry
    Animated.parallel([
      Animated.timing(containerOpacity, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(containerSlide, {
        toValue: 0,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Start card reveal after page loads
      revealCards();
    });
  }, []);

  return (
    <Animated.View
      style={{
        opacity: containerOpacity,
        transform: [{ translateY: containerSlide }],
      }}
    >
      {/* Content */}
    </Animated.View>
  );
};
```

#### 2. **Staggered Card Reveal** (The Money Shot)
```javascript
const revealCards = () => {
  const cards = [
    { name: 'soilStatus', delay: 0 },
    { name: 'nitrogen', delay: 100 },
    { name: 'phosphorus', delay: 200 },
    { name: 'potassium', delay: 300 },
    { name: 'recommendation', delay: 500 }, // Extra delay for emphasis
  ];

  // Haptic feedback on first card
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

  const animations = cards.map((card) =>
    Animated.parallel([
      // Fade in
      Animated.timing(cardAnims[card.name].opacity, {
        toValue: 1,
        duration: 400,
        delay: card.delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      // Slide up
      Animated.timing(cardAnims[card.name].translateY, {
        toValue: 0,
        duration: 400,
        delay: card.delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      // Scale (subtle)
      Animated.timing(cardAnims[card.name].scale, {
        toValue: 1,
        duration: 400,
        delay: card.delay,
        easing: Easing.out(Easing.back(1.1)), // Slight overshoot
        useNativeDriver: true,
      }),
    ])
  );

  Animated.stagger(0, animations).start(() => {
    // Success haptic after all cards appear
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  });
};
```

#### 3. **Status Card Component with Color Animation**
```javascript
const StatusCard = ({ label, value, status, delay = 0 }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(30)).current;
  const scale = useRef(new Animated.Value(0.9)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  const statusColors = {
    excellent: '#22C55E',
    good: '#10B981',
    fair: '#F59E0B',
    poor: '#EF4444',
  };

  useEffect(() => {
    // Card reveal
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 400,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 400,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 400,
        delay,
        easing: Easing.out(Easing.back(1.1)),
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Animate progress bar after card appears
      animateProgress();
    });
  }, []);

  const animateProgress = () => {
    Animated.timing(progressAnim, {
      toValue: value / 100, // Assuming value is 0-100
      duration: 800,
      delay: 200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false, // width animation
    }).start();
  };

  return (
    <Animated.View
      style={[
        styles.statusCard,
        {
          opacity,
          transform: [
            { translateY },
            { scale },
          ],
        },
      ]}
    >
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>

      {/* Animated progress bar */}
      <View style={styles.progressBarContainer}>
        <Animated.View
          style={[
            styles.progressBar,
            {
              backgroundColor: statusColors[status],
              width: progressAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>

      {/* Status badge with glow */}
      <View
        style={[
          styles.statusBadge,
          { backgroundColor: statusColors[status] + '20' }
        ]}
      >
        <Text style={[styles.statusText, { color: statusColors[status] }]}>
          {status.toUpperCase()}
        </Text>
      </View>
    </Animated.View>
  );
};
```

#### 4. **Number Counter Animation** (For NPK Values)
```javascript
const AnimatedNumber = ({ value, duration = 1000, suffix = '' }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseFloat(value);
    const increment = end / (duration / 16); // 60 FPS

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <Text style={styles.animatedNumber}>
      {displayValue}{suffix}
    </Text>
  );
};
```

---

### **END: Download/Restart Actions** (Positive Reinforcement)
**Goal:** Leave users with a satisfying sense of completion

#### 1. **Success Celebration Animation**
```javascript
const CompletionScreen = () => {
  const checkmarkScale = useRef(new Animated.Value(0)).current;
  const checkmarkRotate = useRef(new Animated.Value(0)).current;
  const confettiAnims = useRef(
    [...Array(20)].map(() => ({
      x: new Animated.Value(0),
      y: new Animated.Value(0),
      opacity: new Animated.Value(1),
      rotate: new Animated.Value(0),
    }))
  ).current;

  useEffect(() => {
    // Success haptic
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Animated checkmark
    Animated.sequence([
      Animated.timing(checkmarkScale, {
        toValue: 1.2,
        duration: 300,
        easing: Easing.out(Easing.back(2)),
        useNativeDriver: true,
      }),
      Animated.spring(checkmarkScale, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    // Confetti explosion
    const confettiAnimations = confettiAnims.map((anim, index) => {
      const angle = (index / confettiAnims.length) * Math.PI * 2;
      const distance = 100 + Math.random() * 50;

      return Animated.parallel([
        Animated.timing(anim.x, {
          toValue: Math.cos(angle) * distance,
          duration: 1000,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(anim.y, {
          toValue: Math.sin(angle) * distance,
          duration: 1000,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(anim.opacity, {
          toValue: 0,
          duration: 1000,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(anim.rotate, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]);
    });

    Animated.parallel(confettiAnimations).start();
  }, []);

  return (
    <View style={styles.completionContainer}>
      {/* Confetti particles */}
      {confettiAnims.map((anim, index) => (
        <Animated.View
          key={index}
          style={[
            styles.confetti,
            {
              opacity: anim.opacity,
              transform: [
                { translateX: anim.x },
                { translateY: anim.y },
                {
                  rotate: anim.rotate.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '720deg'],
                  }),
                },
              ],
            },
          ]}
        />
      ))}

      {/* Animated checkmark */}
      <Animated.View
        style={{
          transform: [
            { scale: checkmarkScale },
            { rotate: checkmarkRotate },
          ],
        }}
      >
        <Icon name="check-circle" size={80} color="#22C55E" />
      </Animated.View>

      <Text style={styles.successTitle}>Analysis Complete!</Text>
      <Text style={styles.successSubtitle}>
        Your personalized recommendations are ready
      </Text>
    </View>
  );
};
```

#### 2. **Action Button Animations**
```javascript
const ActionButtons = () => {
  const downloadScale = useRef(new Animated.Value(0)).current;
  const restartScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Stagger button entrance
    Animated.stagger(150, [
      Animated.spring(downloadScale, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.spring(restartScale, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleDownload = () => {
    // Pulse animation on press
    Animated.sequence([
      Animated.timing(downloadScale, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(downloadScale, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();

    // Success haptic
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  return (
    <View style={styles.actionContainer}>
      <AnimatedButton
        onPress={handleDownload}
        haptic="success"
        style={{ transform: [{ scale: downloadScale }] }}
      >
        <LinearGradient
          colors={['#22C55E', '#10B981']}
          style={styles.downloadButton}
        >
          <Icon name="download" size={20} color="white" />
          <Text style={styles.buttonText}>Download Report</Text>
        </LinearGradient>
      </AnimatedButton>

      <AnimatedButton
        onPress={() => {/* restart */}}
        haptic="medium"
        style={{ transform: [{ scale: restartScale }] }}
      >
        <View style={styles.restartButton}>
          <Icon name="refresh" size={20} color="#22C55E" />
          <Text style={styles.buttonTextSecondary}>New Analysis</Text>
        </View>
      </AnimatedButton>
    </View>
  );
};
```

---

## 🎨 Color Indicator Animations

### Progress Bar with Gradient Transition
```javascript
const AnimatedProgressBar = ({ progress, status }) => {
  const progressAnim = useRef(new Animated.Value(0)).current;
  const colorAnim = useRef(new Animated.Value(0)).current;

  const statusColorMap = {
    poor: 0,      // Red
    fair: 0.5,    // Yellow
    good: 0.75,   // Light green
    excellent: 1, // Green
  };

  useEffect(() => {
    Animated.parallel([
      Animated.timing(progressAnim, {
        toValue: progress,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.timing(colorAnim, {
        toValue: statusColorMap[status],
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
    ]).start();
  }, [progress, status]);

  const backgroundColor = colorAnim.interpolate({
    inputRange: [0, 0.5, 0.75, 1],
    outputRange: ['#EF4444', '#F59E0B', '#10B981', '#22C55E'],
  });

  return (
    <View style={styles.progressContainer}>
      <Animated.View
        style={[
          styles.progressBar,
          {
            width: progressAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%'],
            }),
            backgroundColor,
          },
        ]}
      />
    </View>
  );
};
```

### Status Badge with Glow Effect
```javascript
const StatusBadge = ({ status }) => {
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const shadowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.2, 0.6],
  });

  return (
    <Animated.View
      style={[
        styles.badge,
        {
          shadowOpacity,
          shadowRadius: glowAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [4, 12],
          }),
        },
      ]}
    >
      <Text style={styles.badgeText}>{status}</Text>
    </Animated.View>
  );
};
```

---

## 🎯 Micro-Interactions Catalog

### 1. **Button Press** (Already implemented)
```javascript
// Use your existing AnimatedButton component
<AnimatedButton
  onPress={handlePress}
  haptic="medium"
  scaleValue={0.96}
  opacityValue={0.85}
>
  <View style={styles.button}>
    <Text>Press Me</Text>
  </View>
</AnimatedButton>
```

### 2. **Card Tap to Expand**
```javascript
const ExpandableCard = ({ children }) => {
  const [expanded, setExpanded] = useState(false);
  const heightAnim = useRef(new Animated.Value(0)).current;

  const toggleExpand = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    Animated.timing(heightAnim, {
      toValue: expanded ? 0 : 1,
      duration: 300,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();

    setExpanded(!expanded);
  };

  return (
    <TouchableOpacity onPress={toggleExpand} activeOpacity={0.9}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text>Tap to expand</Text>
          <Animated.View
            style={{
              transform: [{
                rotate: heightAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '180deg'],
                }),
              }],
            }}
          >
            <Icon name="chevron-down" />
          </Animated.View>
        </View>

        <Animated.View
          style={{
            height: heightAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 200], // Adjust based on content
            }),
            overflow: 'hidden',
          }}
        >
          {children}
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
};
```

### 3. **Checkbox Selection**
```javascript
// Enhanced version of your CropSelector checkbox
const AnimatedCheckbox = ({ checked, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(checked ? 1 : 0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: checked ? 1 : 0,
        friction: 5,
        tension: 100,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: checked ? 1 : 0,
        duration: 200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [checked]);

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        <Animated.View
          style={{
            transform: [
              { scale: scaleAnim },
              {
                rotate: rotateAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '360deg'],
                }),
              },
            ],
          }}
        >
          <Icon name="check" size={16} color="white" />
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
};
```

### 4. **Pull to Refresh**
```javascript
const PullToRefresh = ({ onRefresh, children }) => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await onRefresh();
    setRefreshing(false);
  };

  return (
    <Animated.ScrollView
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: true }
      )}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor="#22C55E"
        />
      }
    >
      {children}
    </Animated.ScrollView>
  );
};
```

### 5. **Toast Notification**
```javascript
const Toast = ({ message, visible, type = 'success' }) => {
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto hide after 3 seconds
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: -100,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      }, 3000);
    }
  }, [visible]);

  const typeColors = {
    success: '#22C55E',
    error: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6',
  };

  return (
    <Animated.View
      style={[
        styles.toast,
        {
          backgroundColor: typeColors[type],
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <Text style={styles.toastText}>{message}</Text>
    </Animated.View>
  );
};
```

---

## 📱 Screen Transition Animations

### Navigation Transitions (React Navigation)
```javascript
// In your navigation configuration
const screenOptions = {
  // Slide from right (default, but customized)
  cardStyleInterpolator: ({ current, next, layouts }) => {
    return {
      cardStyle: {
        transform: [
          {
            translateX: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.width, 0],
            }),
          },
          {
            scale: next
              ? next.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 0.95],
                })
              : 1,
          },
        ],
        opacity: current.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
        }),
      },
      overlayStyle: {
        opacity: current.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 0.5],
        }),
      },
    };
  },
  transitionSpec: {
    open: {
      animation: 'timing',
      config: {
        duration: 300,
        easing: Easing.out(Easing.cubic),
      },
    },
    close: {
      animation: 'timing',
      config: {
        duration: 250,
        easing: Easing.in(Easing.cubic),
      },
    },
  },
};
```

### Modal Transitions
```javascript
const ModalSlideUp = ({ visible, onClose, children }) => {
  const translateY = useRef(new Animated.Value(300)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 300,
          duration: 250,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="none">
      <TouchableOpacity
        style={styles.modalContainer}
        activeOpacity={1}
        onPress={onClose}
      >
        <Animated.View
          style={[styles.backdrop, { opacity: backdropOpacity }]}
        />
        <Animated.View
          style={[
            styles.modalContent,
            { transform: [{ translateY }] },
          ]}
        >
          {children}
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
};
```

---

## 🚀 Enhanced Animations Library

### Add to `C:\Users\Neil\Documents\thesis\AgriCapture\src\utils\animations.js`

```javascript
// Add these new animation functions to your existing file

/**
 * Stagger multiple animations with delay
 */
export const staggerFadeIn = (animValues, duration = 300, stagger = 100) => {
  const animations = animValues.map((anim, index) =>
    Animated.timing(anim, {
      toValue: 1,
      duration,
      delay: index * stagger,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    })
  );
  return Animated.parallel(animations);
};

/**
 * Bounce animation for success states
 */
export const bounce = (animValue, toValue = 1) => {
  return Animated.sequence([
    Animated.timing(animValue, {
      toValue: 0.8,
      duration: 100,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }),
    Animated.spring(animValue, {
      toValue,
      friction: 4,
      tension: 40,
      useNativeDriver: true,
    }),
  ]);
};

/**
 * Shake animation for errors
 */
export const shake = (animValue) => {
  return Animated.sequence([
    Animated.timing(animValue, { toValue: 10, duration: 50, useNativeDriver: true }),
    Animated.timing(animValue, { toValue: -10, duration: 50, useNativeDriver: true }),
    Animated.timing(animValue, { toValue: 10, duration: 50, useNativeDriver: true }),
    Animated.timing(animValue, { toValue: -10, duration: 50, useNativeDriver: true }),
    Animated.timing(animValue, { toValue: 0, duration: 50, useNativeDriver: true }),
  ]);
};

/**
 * Rotate animation (continuous)
 */
export const rotate = (animValue, duration = 2000) => {
  return Animated.loop(
    Animated.timing(animValue, {
      toValue: 1,
      duration,
      easing: Easing.linear,
      useNativeDriver: true,
    })
  );
};

/**
 * Progress bar animation
 */
export const progressBar = (animValue, toValue, duration = 800) => {
  return Animated.timing(animValue, {
    toValue,
    duration,
    easing: Easing.out(Easing.cubic),
    useNativeDriver: false, // Can't use native driver for width
  });
};

/**
 * Gradient shift animation
 */
export const gradientShift = (animValue, duration = 3000) => {
  return Animated.loop(
    Animated.sequence([
      Animated.timing(animValue, {
        toValue: 1,
        duration,
        easing: Easing.inOut(Easing.sin),
        useNativeDriver: true,
      }),
      Animated.timing(animValue, {
        toValue: 0,
        duration,
        easing: Easing.inOut(Easing.sin),
        useNativeDriver: true,
      }),
    ])
  );
};
```

---

## 🎬 Demo-Ready Animation Sequence

### Complete Flow Animation (Auto-play for demos)
```javascript
const DemoMode = () => {
  const [currentScreen, setCurrentScreen] = useState(0);

  const DEMO_FLOW = [
    { screen: 'Location', duration: 3000 },
    { screen: 'PlantSelection', duration: 4000 },
    { screen: 'Processing', duration: 6000 },
    { screen: 'Results', duration: 5000 },
    { screen: 'Completion', duration: 3000 },
  ];

  useEffect(() => {
    const runDemo = async () => {
      for (let i = 0; i < DEMO_FLOW.length; i++) {
        setCurrentScreen(i);
        await new Promise(resolve =>
          setTimeout(resolve, DEMO_FLOW[i].duration)
        );
      }
      // Loop back
      setCurrentScreen(0);
    };

    runDemo();
  }, []);

  return (
    <View>
      {currentScreen === 0 && <LocationScreen autoPlay />}
      {currentScreen === 1 && <PlantSelectionScreen autoPlay />}
      {currentScreen === 2 && <ProcessingScreen autoPlay />}
      {currentScreen === 3 && <ResultsScreen autoPlay />}
      {currentScreen === 4 && <CompletionScreen autoPlay />}
    </View>
  );
};
```

---

## 📊 Performance Optimization Tips

1. **Use `useNativeDriver: true` whenever possible**
   - Works for: opacity, transform (translate, scale, rotate)
   - Doesn't work for: width, height, colors, layout props

2. **Batch animations with `Animated.parallel()`**
   ```javascript
   Animated.parallel([anim1, anim2, anim3]).start();
   ```

3. **Clean up animations in useEffect**
   ```javascript
   useEffect(() => {
     const animation = Animated.timing(...);
     animation.start();
     return () => animation.stop();
   }, []);
   ```

4. **Use `Animated.Value(0)` outside component for constants**
   ```javascript
   const FADE_ANIM = new Animated.Value(0); // Reuse across instances
   ```

5. **Optimize heavy animations with `InteractionManager`**
   ```javascript
   InteractionManager.runAfterInteractions(() => {
     // Start heavy animations after screen loads
     animateCards();
   });
   ```

---

## 🎨 Stylesheet Examples

```javascript
const styles = StyleSheet.create({
  // Processing Screen
  processingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  stepText: {
    fontFamily: fonts.medium,
    fontSize: fontSizes.md,
    color: colors.text.primary,
    marginTop: 16,
  },
  progressBar: {
    width: '80%',
    height: 6,
    backgroundColor: colors.background.tertiary,
    borderRadius: radius.full,
    marginTop: 24,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: radius.full,
  },
  stepDots: {
    flexDirection: 'row',
    marginTop: 24,
    gap: 8,
  },

  // Loader
  loaderContainer: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
  },
  loaderGradient: {
    width: '100%',
    height: '100%',
  },
  particle: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },

  // Status Cards
  statusCard: {
    backgroundColor: colors.background.primary,
    borderRadius: radius.lg,
    padding: 20,
    marginBottom: 16,
    ...shadows.md,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: colors.background.tertiary,
    borderRadius: radius.full,
    marginTop: 12,
    overflow: 'hidden',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.full,
    marginTop: 8,
  },

  // Completion
  completionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  confetti: {
    position: 'absolute',
    width: 10,
    height: 10,
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  successTitle: {
    ...textStyles.h2,
    marginTop: 24,
  },
  successSubtitle: {
    ...textStyles.bodySmall,
    marginTop: 8,
    textAlign: 'center',
  },

  // Action Buttons
  actionContainer: {
    marginTop: 32,
    gap: 12,
    width: '100%',
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: radius.md,
    gap: 8,
  },
  restartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.primary,
    gap: 8,
  },

  // Toast
  toast: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    padding: 16,
    borderRadius: radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadows.lg,
    zIndex: 1000,
  },
  toastText: {
    color: colors.text.inverse,
    fontFamily: fonts.medium,
    fontSize: fontSizes.sm,
  },
});
```

---

## ✅ Implementation Checklist

### Phase 1: Foundation
- [x] Review existing animation utilities
- [ ] Add new animation functions to `animations.js`
- [ ] Create timing constants file
- [ ] Test haptic feedback on device

### Phase 2: Peak Moments
- [ ] Implement GPS lock animation (Peak 1)
- [ ] Create processing screen loader (Peak 2)
- [ ] Build card reveal sequence (Peak 3)
- [ ] Add completion celebration

### Phase 3: Polish
- [ ] Add all micro-interactions
- [ ] Implement color transitions
- [ ] Create modal animations
- [ ] Add toast notifications

### Phase 4: Testing
- [ ] Test on low-end devices
- [ ] Verify 60 FPS performance
- [ ] Check animation timing feel
- [ ] Get user feedback

### Phase 5: Demo Prep
- [ ] Create demo mode with auto-play
- [ ] Fine-tune all timings
- [ ] Add skip options for fast demos
- [ ] Record demo video

---

## 📝 Quick Reference

### Animation Timing Cheat Sheet
| Use Case | Duration | Easing |
|----------|----------|--------|
| Button press | 100ms | Cubic out |
| Screen transition | 300ms | Cubic out |
| Card reveal | 400ms | Cubic out |
| Loading spinner | 2000ms | Linear (loop) |
| Success celebration | 500ms | Back out |
| Error shake | 250ms | Linear |

### Haptic Feedback Guide
| Action | Haptic Type |
|--------|-------------|
| Button tap | Light |
| Selection | Medium |
| Success | Success notification |
| Error | Error notification |
| Toggle | Light |
| Delete | Heavy |

---

## 🎓 Best Practices

1. **Always provide feedback**: Every user action should have a visual or haptic response
2. **Keep it smooth**: Prefer cubic easing over bounce for professional feel
3. **Stagger wisely**: 100-150ms between items feels natural
4. **Don't overanimate**: Not every element needs to move
5. **Test on device**: Animations feel different on real hardware
6. **Respect reduce motion**: Check `AccessibilityInfo` for user preferences
7. **Use spring sparingly**: Only for success states and special moments

---

**Implementation Priority:** Peak 2 (Processing) > Peak 3 (Results) > Peak 1 (Location) > End > Everything else

This creates the strongest demo impact with the least effort.
