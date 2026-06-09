import React, { useMemo, useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useHealthRead } from '../../context/HealthReadContext';
import { useHealthDispatch } from '../../context/HealthDispatchContext';
import { 
  Info, 
  Flame, 
  AlertCircle, 
  Clock, 
  Trophy, 
  Play, 
  Pause, 
  RotateCcw, 
  X, 
  Search, 
  Sparkles, 
  ChevronRight, 
  Check,
  CheckCircle,
  Activity,
  Heart
} from 'lucide-react';
import { showToast } from '../../utils/toast';

interface Exercise {
  id: string;
  name: string;
  category: 'yoga' | 'cardio' | 'strength' | 'stretch' | 'breathing';
  emoji: string;
  duration: number; // in mins
  calories: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  steps: string[];
}

const exercisesDatabase: Exercise[] = [
  // === YOGA (20) ===
  {
    id: 'y1',
    name: "Child's Pose (Balasana)",
    category: 'yoga',
    emoji: '🧘',
    duration: 5,
    calories: 15,
    difficulty: 'Beginner',
    steps: [
      "Kneel on the floor with toes touching and sit back on your heels.",
      "Separate your knees about hip-width apart.",
      "Extend your torso forward between your thighs and touch the floor with your forehead.",
      "Lay your arms forward on the floor, palms down. Breathe deeply."
    ]
  },
  {
    id: 'y2',
    name: 'Cobra Pose (Bhujangasana)',
    category: 'yoga',
    emoji: '🐍',
    duration: 6,
    calories: 20,
    difficulty: 'Beginner',
    steps: [
      "Lie face down on the floor, legs extended behind you.",
      "Place your hands on the floor under your shoulders, elbows close to your body.",
      "Press the tops of your feet and thighs firmly into the floor.",
      "Inhale and lift your chest off the floor, keeping your lower ribs down.",
      "Keep your shoulders relaxed away from your ears."
    ]
  },
  {
    id: 'y3',
    name: 'Downward-Facing Dog',
    category: 'yoga',
    emoji: '🐶',
    duration: 5,
    calories: 25,
    difficulty: 'Beginner',
    steps: [
      "Start on your hands and knees in a tabletop position.",
      "Tuck your toes under and lift your knees off the floor, raising your hips toward the ceiling.",
      "Straighten your legs and press your heels down toward the mat.",
      "Keep hands flat, fingers spread, and push the floor away to extend your spine.",
      "Relax your neck and gaze between your knees."
    ]
  },
  {
    id: 'y4',
    name: 'Warrior I (Virabhadrasana I)',
    category: 'yoga',
    emoji: '⚔️',
    duration: 8,
    calories: 35,
    difficulty: 'Intermediate',
    steps: [
      "Stand tall, then step your right foot back about 3-4 feet.",
      "Turn your right heel down to the floor at a 45-degree angle.",
      "Bend your left knee over your left ankle, keeping the thigh parallel to the floor.",
      "Reach your arms straight up toward the ceiling, palms facing each other.",
      "Engage your core and gaze upward toward your hands."
    ]
  },
  {
    id: 'y5',
    name: 'Warrior II (Virabhadrasana II)',
    category: 'yoga',
    emoji: '🛡️',
    duration: 8,
    calories: 35,
    difficulty: 'Beginner',
    steps: [
      "Stand with feet 3-4 feet apart, hands on hips.",
      "Turn your left foot out 90 degrees and your right foot slightly in.",
      "Extend your arms out to the sides, parallel to the floor, palms facing down.",
      "Bend your left knee over your left ankle, keeping the right leg straight.",
      "Gaze out over the fingers of your left hand."
    ]
  },
  {
    id: 'y6',
    name: 'Tree Pose (Vrksasana)',
    category: 'yoga',
    emoji: '🌳',
    duration: 5,
    calories: 12,
    difficulty: 'Beginner',
    steps: [
      "Stand straight with feet together, weight distributed evenly.",
      "Shift your weight onto your left leg.",
      "Bend your right knee, bringing the sole of your right foot to your left inner calf or thigh (avoid the knee).",
      "Bring your hands together in front of your chest in prayer position.",
      "Focus your gaze on a single steady point in front of you."
    ]
  },
  {
    id: 'y7',
    name: 'Triangle Pose (Trikonasana)',
    category: 'yoga',
    emoji: '📐',
    duration: 6,
    calories: 22,
    difficulty: 'Beginner',
    steps: [
      "Stand with feet wide apart. Turn your right foot out 90 degrees.",
      "Extend your arms to the sides at shoulder height, palms facing down.",
      "Reach your right arm forward, hinge at the hip, and bring your right hand to your shin, ankle, or floor.",
      "Extend your left arm straight up toward the ceiling, in line with your shoulders.",
      "Turn your head to look up at your left thumb."
    ]
  },
  {
    id: 'y8',
    name: 'Bridge Pose (Setu Bandha Sarvangasana)',
    category: 'yoga',
    emoji: '🌉',
    duration: 6,
    calories: 24,
    difficulty: 'Beginner',
    steps: [
      "Lie on your back with knees bent, feet flat on the floor hip-width apart.",
      "Place your arms by your sides, palms facing down.",
      "Exhale and press your feet and arms into the floor to lift your hips toward the ceiling.",
      "Clasp your hands under your lower back and roll your shoulders inward.",
      "Keep your thighs and feet parallel, holding for several breaths."
    ]
  },
  {
    id: 'y9',
    name: 'Chair Pose (Utkatasana)',
    category: 'yoga',
    emoji: '🪑',
    duration: 5,
    calories: 30,
    difficulty: 'Intermediate',
    steps: [
      "Stand tall, inhale, and raise your arms straight overhead.",
      "Exhale and bend your knees, lowering your hips as if sitting back in a chair.",
      "Keep your thighs as parallel to the floor as possible.",
      "Keep your weight in your heels and lift your chest.",
      "Hold the posture while keeping your tailbone tucked slightly."
    ]
  },
  {
    id: 'y10',
    name: 'Camel Pose (Ustrasana)',
    category: 'yoga',
    emoji: '🐫',
    duration: 5,
    calories: 20,
    difficulty: 'Intermediate',
    steps: [
      "Kneel on the floor with your knees hip-width apart, thighs perpendicular to the floor.",
      "Place your hands on your lower back, fingers pointing down.",
      "Inhale, lift your chest, and slowly arch your spine backward.",
      "If comfortable, reach back to place your hands on your heels.",
      "Keep your neck neutral or gently release your head back."
    ]
  },
  {
    id: 'y11',
    name: 'Boat Pose (Navasana)',
    category: 'yoga',
    emoji: '⛵',
    duration: 4,
    calories: 28,
    difficulty: 'Advanced',
    steps: [
      "Sit on the floor with knees bent and feet flat.",
      "Lean back slightly, keeping your spine straight and chest lifted.",
      "Lift your feet off the floor, bringing your shins parallel to the ground (or straighten legs to form a V).",
      "Extend your arms forward, parallel to the floor, palms facing inward.",
      "Engage your abdominal core and hold."
    ]
  },
  {
    id: 'y12',
    name: 'Crow Pose (Bakasana)',
    category: 'yoga',
    emoji: '🐦',
    duration: 3,
    calories: 30,
    difficulty: 'Advanced',
    steps: [
      "Squat down and place your hands flat on the floor shoulder-width apart.",
      "Place your knees against the backs of your upper arms, close to your armpits.",
      "Lean forward, shifting your weight onto your hands.",
      "Slowly lift one foot off the ground, then the other, balancing on your hands.",
      "Keep your core tightly engaged and gaze slightly forward."
    ]
  },
  {
    id: 'y13',
    name: 'Half Pigeon Pose (Ardha Kapotasana)',
    category: 'yoga',
    emoji: '🕊️',
    duration: 8,
    calories: 18,
    difficulty: 'Intermediate',
    steps: [
      "From Downward Dog, bring your right knee forward behind your right wrist.",
      "Place your right ankle somewhere in front of your left hip.",
      "Slide your left leg straight back behind you, lowering your hips toward the floor.",
      "Inhale to elongate the spine, then exhale and fold forward over your front leg."
    ]
  },
  {
    id: 'y14',
    name: 'Headstand (Sirsasana)',
    category: 'yoga',
    emoji: '🙃',
    duration: 3,
    calories: 40,
    difficulty: 'Advanced',
    steps: [
      "Kneel and interlock your fingers, placing your forearms on the floor.",
      "Place the crown of your head on the floor, nestled against the insides of your hands.",
      "Straighten your legs and walk your feet closer to your head.",
      "Slowly draw your knees into your chest, then extend your legs straight up to a vertical position."
    ]
  },
  {
    id: 'y15',
    name: 'Shoulderstand (Sarvangasana)',
    category: 'yoga',
    emoji: '🤸',
    duration: 5,
    calories: 26,
    difficulty: 'Advanced',
    steps: [
      "Lie on your back, legs extended and arms by your sides.",
      "Inhale, bend your knees, and lift your legs and hips off the floor, bringing knees to forehead.",
      "Place your hands on your lower back for support, keeping elbows close together.",
      "Extend your legs straight up to the ceiling, aligning your chest, hips, and legs vertically."
    ]
  },
  {
    id: 'y16',
    name: 'Plank Pose (Phalakasana)',
    category: 'yoga',
    emoji: '🪵',
    duration: 5,
    calories: 25,
    difficulty: 'Intermediate',
    steps: [
      "Start in a tabletop position on your hands and knees.",
      "Extend your legs straight back, tucking your toes under.",
      "Align your shoulders directly over your wrists, keeping your body in a straight line.",
      "Engage your abdominal core, thighs, and glutes. Gaze down between your hands."
    ]
  },
  {
    id: 'y17',
    name: 'Corpse Pose (Savasana)',
    category: 'yoga',
    emoji: '💤',
    duration: 5,
    calories: 5,
    difficulty: 'Beginner',
    steps: [
      "Lie flat on your back, letting your feet drop open to the sides.",
      "Place your arms slightly away from your torso, palms facing up.",
      "Close your eyes and breathe naturally.",
      "Slowly relax every muscle in your body, from your toes to your forehead, letting go of all mental tension."
    ]
  },
  {
    id: 'y18',
    name: 'Cat-Cow Pose',
    category: 'yoga',
    emoji: '🐱',
    duration: 5,
    calories: 15,
    difficulty: 'Beginner',
    steps: [
      "Start on your hands and knees in tabletop position.",
      "Inhale, drop your belly toward the floor, and lift your chest and chin (Cow Pose).",
      "Exhale, arch your spine upward toward the ceiling, pulling your chin to your chest (Cat Pose).",
      "Flow rhythmically between these two positions, syncing with your breath."
    ]
  },
  {
    id: 'y19',
    name: 'Sphinx Pose',
    category: 'yoga',
    emoji: '🦁',
    duration: 6,
    calories: 14,
    difficulty: 'Beginner',
    steps: [
      "Lie flat on your stomach, forehead resting on the floor.",
      "Bring your elbows under your shoulders, forearms flat on the floor, pointing forward.",
      "Inhale and lift your chest off the mat, pressing your pubic bone firmly down.",
      "Pull your chest forward through your arms, keeping your neck neutral."
    ]
  },
  {
    id: 'y20',
    name: 'Lotus Pose (Padmasana)',
    category: 'yoga',
    emoji: '🌸',
    duration: 7,
    calories: 10,
    difficulty: 'Intermediate',
    steps: [
      "Sit on the floor with your legs extended in front of you.",
      "Bend your right knee, grasp your right foot, and place it on top of your left thigh.",
      "Bend your left knee, grasp your left foot, and carefully place it on top of your right thigh.",
      "Keep your spine tall, rest your hands on your knees, and breathe deeply."
    ]
  },

  // === CARDIO (20) ===
  {
    id: 'c1',
    name: 'Jogging in Place',
    category: 'cardio',
    emoji: '👟',
    duration: 15,
    calories: 110,
    difficulty: 'Beginner',
    steps: [
      "Stand tall with feet hip-width apart and arms at your sides.",
      "Begin lifting your knees and jogging on the balls of your feet in one spot.",
      "Pump your arms forward and backward in sync with your legs.",
      "Keep your chest upright and breathe steadily."
    ]
  },
  {
    id: 'c2',
    name: 'Skipping Rope',
    category: 'cardio',
    emoji: '🪢',
    duration: 10,
    calories: 130,
    difficulty: 'Intermediate',
    steps: [
      "Hold jump rope handles in each hand, resting the rope behind your heels.",
      "Rotate your wrists to swing the rope over your head.",
      "Jump lightly on the balls of your feet just high enough to let the rope pass under.",
      "Keep your elbows tucked close to your waist and shoulders relaxed."
    ]
  },
  {
    id: 'c3',
    name: 'Shadow Boxing',
    category: 'cardio',
    emoji: '🥊',
    duration: 10,
    calories: 85,
    difficulty: 'Beginner',
    steps: [
      "Stand with feet shoulder-width, right foot slightly back, fists protecting your face.",
      "Throw jabs, crosses, hooks, and uppercuts into the air in front of you.",
      "Bounce lightly on your feet, shifting your weight dynamically.",
      "Exhale sharply with each punch and keep your guard up."
    ]
  },
  {
    id: 'c4',
    name: 'Stair Climbing',
    category: 'cardio',
    emoji: '🪜',
    duration: 10,
    calories: 95,
    difficulty: 'Intermediate',
    steps: [
      "Locate a flight of stairs or a sturdy stepping block.",
      "Ascend and descend the steps at a rapid, consistent pace.",
      "Engage your glutes and push through the heels of your feet on each step up.",
      "Pump your arms naturally to build momentum and maintain balance."
    ]
  },
  {
    id: 'c5',
    name: 'Dance Workout',
    category: 'cardio',
    emoji: '💃',
    duration: 15,
    calories: 100,
    difficulty: 'Beginner',
    steps: [
      "Play rhythmic, high-energy music.",
      "Follow broad, dance-inspired routines, shaking hips and moving feet.",
      "Incorporate arm reaches and overhead waves to engage your upper body.",
      "Keep moving continuously, maintaining an elevated heart rate."
    ]
  },
  {
    id: 'c6',
    name: 'Brisk Walking',
    category: 'cardio',
    emoji: '🚶',
    duration: 20,
    calories: 100,
    difficulty: 'Beginner',
    steps: [
      "Walk at a rapid, brisk pace, faster than a casual stroll.",
      "Swing your arms bent at 90 degrees to increase calorie burn.",
      "Keep your chest upright, shoulders relaxed, and abdominal muscles engaged.",
      "Land on your heels and roll forward onto your toes."
    ]
  },
  {
    id: 'c7',
    name: 'Mountain Climbers',
    category: 'cardio',
    emoji: '⛰️',
    duration: 5,
    calories: 60,
    difficulty: 'Intermediate',
    steps: [
      "Start in a high plank position with shoulders aligned over wrists.",
      "Drive your right knee toward your chest, keeping your hips low.",
      "Quickly swap legs, extending the right leg back and driving the left knee forward.",
      "Alternate at a rapid running pace while maintaining a flat back."
    ]
  },
  {
    id: 'c8',
    name: 'Burpees',
    category: 'cardio',
    emoji: '💥',
    duration: 8,
    calories: 90,
    difficulty: 'Advanced',
    steps: [
      "Stand with feet shoulder-width, then drop into a deep squat and place hands on floor.",
      "Jump your feet back to land in a push-up/plank position.",
      "Perform a push-up, touching your chest to the floor.",
      "Jump your feet back forward toward your hands, returning to a squat.",
      "Jump explosively into the air, reaching hands overhead."
    ]
  },
  {
    id: 'c9',
    name: 'High Knees',
    category: 'cardio',
    emoji: '🦵',
    duration: 5,
    calories: 65,
    difficulty: 'Intermediate',
    steps: [
      "Run in place, lifting your knees up toward your chest as high as possible.",
      "Aim to bring your thighs parallel to the floor.",
      "Stay on the balls of your feet and pump your arms dynamically.",
      "Engage your core to help lift your legs."
    ]
  },
  {
    id: 'c10',
    name: 'Jumping Jacks',
    category: 'cardio',
    emoji: '🌟',
    duration: 10,
    calories: 80,
    difficulty: 'Beginner',
    steps: [
      "Stand straight with feet together, arms at your sides.",
      "Jump your feet out wide while swinging your arms overhead.",
      "Immediately jump back to the starting position, lowering your arms.",
      "Repeat in a fast, fluid, and rhythmic motion."
    ]
  },
  {
    id: 'c11',
    name: 'Butt Kicks',
    category: 'cardio',
    emoji: '🍑',
    duration: 5,
    calories: 45,
    difficulty: 'Beginner',
    steps: [
      "Jog in place, but focus on kicking your heels backward to touch your glutes.",
      "Keep your torso upright and shoulders back.",
      "Move your arms in a jogging motion.",
      "Land softly on the balls of your feet."
    ]
  },
  {
    id: 'c12',
    name: 'Skater Hops',
    category: 'cardio',
    emoji: '⛸️',
    duration: 8,
    calories: 75,
    difficulty: 'Intermediate',
    steps: [
      "Jump sideways to the right, landing softly on your right foot.",
      "Sweep your left foot behind your right ankle without letting it touch the ground.",
      "Quickly jump to the left, landing on your left foot, sweeping the right foot behind.",
      "Swing your arms side-to-side like a speed skater."
    ]
  },
  {
    id: 'c13',
    name: 'Bicycle Crunches',
    category: 'cardio',
    emoji: '🚲',
    duration: 10,
    calories: 70,
    difficulty: 'Beginner',
    steps: [
      "Lie flat on your back, hands placed behind your head.",
      "Lift your knees and shoulders slightly off the ground.",
      "Twist your torso to bring your right elbow toward your left knee while extending your right leg straight out.",
      "Alternate sides in a fluid, continuous cycling motion."
    ]
  },
  {
    id: 'c14',
    name: 'Sprints',
    category: 'cardio',
    emoji: '⚡',
    duration: 5,
    calories: 80,
    difficulty: 'Advanced',
    steps: [
      "Find a flat open space or treadmill.",
      "Run at maximum explosive speed for 30 seconds.",
      "Slow down and walk or jog slowly for 60 seconds to recover.",
      "Repeat this high-intensity interval format for the entire duration."
    ]
  },
  {
    id: 'c15',
    name: 'Plank Jacks',
    category: 'cardio',
    emoji: '🪵',
    duration: 6,
    calories: 55,
    difficulty: 'Intermediate',
    steps: [
      "Start in a forearm or high push-up plank position, feet together.",
      "Keeping your upper body stable, jump your feet out wide to the sides.",
      "Jump your feet back together.",
      "Keep your core locked and hips from bouncing too high."
    ]
  },
  {
    id: 'c16',
    name: 'Tuck Jumps',
    category: 'cardio',
    emoji: '🦘',
    duration: 5,
    calories: 75,
    difficulty: 'Advanced',
    steps: [
      "Stand with feet hip-width apart, knees slightly bent.",
      "Lower into a quarter squat, then jump upward as high as possible.",
      "Pull your knees up toward your chest in mid-air.",
      "Extend your legs back down and land softly, absorbing the impact."
    ]
  },
  {
    id: 'c17',
    name: 'Frog Jumps',
    category: 'cardio',
    emoji: '🐸',
    duration: 5,
    calories: 60,
    difficulty: 'Intermediate',
    steps: [
      "Squat deeply with feet wide, placing hands on the floor between them.",
      "Push off the ground and jump forward and upward explosively.",
      "Land softly back in a deep squat position.",
      "Immediately leap forward again, repeating the cycle."
    ]
  },
  {
    id: 'c18',
    name: 'Crab Walk',
    category: 'cardio',
    emoji: '🦀',
    duration: 5,
    calories: 40,
    difficulty: 'Beginner',
    steps: [
      "Sit on the floor with knees bent and feet flat, placing hands behind your hips.",
      "Press into your hands and feet to lift your hips a few inches off the floor.",
      "Walk backward and forward using your hands and feet to navigate.",
      "Keep your core engaged and hips elevated throughout."
    ]
  },
  {
    id: 'c19',
    name: 'Bear Crawl',
    category: 'cardio',
    emoji: '🐻',
    duration: 5,
    calories: 55,
    difficulty: 'Advanced',
    steps: [
      "Get on all fours, then lift your knees so they hover just an inch off the floor.",
      "Move your right hand and left foot forward simultaneously.",
      "Follow with your left hand and right foot, crawling forward.",
      "Keep your back flat, hips low, and knees close to the ground."
    ]
  },
  {
    id: 'c20',
    name: 'Lateral Shuffles',
    category: 'cardio',
    emoji: '↔️',
    duration: 8,
    calories: 70,
    difficulty: 'Beginner',
    steps: [
      "Stand with feet wider than shoulder-width, knees slightly bent in a half-squat.",
      "Shuffle rapidly to the right by stepping right and bringing your left foot to meet it.",
      "Touch the ground with your hand at the end of your shuttle range.",
      "Quickly shuffle back to the left, repeating dynamically."
    ]
  },

  // === STRENGTH (20) ===
  {
    id: 's1',
    name: 'Calf Raises',
    category: 'strength',
    emoji: '🦶',
    duration: 6,
    calories: 30,
    difficulty: 'Beginner',
    steps: [
      "Stand straight with feet hip-width apart near a wall or chair for balance.",
      "Slowly raise your heels off the floor, balancing on the balls of your feet.",
      "Squeeze your calf muscles at the peak of the lift.",
      "Lower your heels back to the floor with slow control."
    ]
  },
  {
    id: 's2',
    name: 'Wall Sit',
    category: 'strength',
    emoji: '🧱',
    duration: 5,
    calories: 35,
    difficulty: 'Intermediate',
    steps: [
      "Stand with your back against a flat wall, feet about 2 feet forward.",
      "Slide your back down the wall until your knees are bent at a 90-degree angle.",
      "Keep your thighs parallel to the floor, heels flat.",
      "Hold this sitting position, keeping your head and spine flat against the wall."
    ]
  },
  {
    id: 's3',
    name: 'Superman Hold',
    category: 'strength',
    emoji: '🦸',
    duration: 5,
    calories: 25,
    difficulty: 'Beginner',
    steps: [
      "Lie face down on the floor with your legs straight and arms extended forward.",
      "Lift your arms, chest, and legs off the floor simultaneously.",
      "Squeeze your lower back and glutes at the top.",
      "Hold the elevated position for 2-3 seconds, then gently lower down."
    ]
  },
  {
    id: 's4',
    name: 'Tricep Dips',
    category: 'strength',
    emoji: '🪑',
    duration: 8,
    calories: 55,
    difficulty: 'Intermediate',
    steps: [
      "Sit on the edge of a sturdy chair or bench, hands gripping the edge beside hips.",
      "Slide your hips forward off the chair, supporting your weight with your arms.",
      "Bend your elbows to lower your body until your arms form a 90-degree angle.",
      "Push through your palms to return to the starting position."
    ]
  },
  {
    id: 's5',
    name: 'Sit-ups',
    category: 'strength',
    emoji: '🏋️',
    duration: 8,
    calories: 50,
    difficulty: 'Beginner',
    steps: [
      "Lie on your back, bend your knees, and place your feet flat on the floor.",
      "Place your hands lightly behind your head or cross them over your chest.",
      "Engage your abdominal muscles to lift your torso up toward your knees.",
      "Lower your back down to the floor in a slow, controlled motion."
    ]
  },
  {
    id: 's6',
    name: 'Glute Bridges',
    category: 'strength',
    emoji: '🍑',
    duration: 8,
    calories: 40,
    difficulty: 'Beginner',
    steps: [
      "Lie on your back, knees bent, and feet flat on the floor hip-width apart.",
      "Squeeze your glutes and press your heels down to lift your hips toward the ceiling.",
      "Form a straight diagonal line from your shoulders to your knees.",
      "Lower your hips back down to touch the floor gently, then repeat."
    ]
  },
  {
    id: 's7',
    name: 'Lunges',
    category: 'strength',
    emoji: '🤺',
    duration: 10,
    calories: 60,
    difficulty: 'Beginner',
    steps: [
      "Stand tall, hands on hips. Step forward with your right foot.",
      "Lower your hips until both knees are bent at a 90-degree angle.",
      "Ensure your front knee is directly above your ankle, not passing toes.",
      "Push off your front heel to return to the starting position, and alternate."
    ]
  },
  {
    id: 's8',
    name: 'Bodyweight Squats',
    category: 'strength',
    emoji: '🦵',
    duration: 10,
    calories: 65,
    difficulty: 'Beginner',
    steps: [
      "Stand with feet shoulder-width apart, toes pointing slightly outward.",
      "Hinge at your hips and bend your knees to lower your body as if sitting in a chair.",
      "Keep your chest lifted, spine neutral, and knees behind your toes.",
      "Drive through your heels to return to a standing position."
    ]
  },
  {
    id: 's9',
    name: 'Plank Hold',
    category: 'strength',
    emoji: '🪵',
    duration: 5,
    calories: 25,
    difficulty: 'Intermediate',
    steps: [
      "Place your forearms on the floor, elbows aligned directly under your shoulders.",
      "Extend your legs straight back, balancing on your toes.",
      "Keep your body in a straight line from head to heels.",
      "Engage your abdominal core, squeeze your glutes, and hold."
    ]
  },
  {
    id: 's10',
    name: 'Push-ups',
    category: 'strength',
    emoji: '💪',
    duration: 10,
    calories: 70,
    difficulty: 'Intermediate',
    steps: [
      "Start in a high plank position with hands slightly wider than shoulders.",
      "Lower your body until your chest almost touches the floor, keeping elbows at 45 degrees.",
      "Keep your torso rigid and core engaged.",
      "Push through your palms to return to the starting position."
    ]
  },
  {
    id: 's11',
    name: 'Pull-ups',
    category: 'strength',
    emoji: '🧗',
    duration: 5,
    calories: 50,
    difficulty: 'Advanced',
    steps: [
      "Hang from an overhead pull-up bar with an overhand grip, hands slightly wider than shoulders.",
      "Engage your back muscles and pull your body up until your chin clears the bar.",
      "Keep your elbows pointed down and your body stable.",
      "Lower yourself down slowly to a full hang."
    ]
  },
  {
    id: 's12',
    name: 'Diamond Push-ups',
    category: 'strength',
    emoji: '💎',
    duration: 8,
    calories: 65,
    difficulty: 'Advanced',
    steps: [
      "Assume a push-up position, but place your index fingers and thumbs together to form a diamond shape.",
      "Lower your chest down to touch the back of your hands, keeping elbows close to your torso.",
      "Push back up to extension, focusing the work on your triceps.",
      "Maintain a straight body line throughout."
    ]
  },
  {
    id: 's13',
    name: 'Russian Twists',
    category: 'strength',
    emoji: '🌪️',
    duration: 8,
    calories: 45,
    difficulty: 'Beginner',
    steps: [
      "Sit on the floor, knees bent, leaning your torso back at a 45-degree angle.",
      "Lift your feet slightly off the floor, balancing on your tailbone.",
      "Clasp your hands in front of you and twist your torso to the right, touching the floor.",
      "Twist to the left, repeating in a controlled side-to-side rotation."
    ]
  },
  {
    id: 's14',
    name: 'Flutter Kicks',
    category: 'strength',
    emoji: '🌊',
    duration: 5,
    calories: 30,
    difficulty: 'Beginner',
    steps: [
      "Lie on your back, hands tucked under your hips for tailbone support.",
      "Lift both legs 2-3 inches off the ground, keeping them straight.",
      "Alternate kicking your legs up and down rapidly in a small range.",
      "Press your lower back flat into the floor throughout the exercise."
    ]
  },
  {
    id: 's15',
    name: 'Leg Raises',
    category: 'strength',
    emoji: '🆙',
    duration: 8,
    calories: 40,
    difficulty: 'Beginner',
    steps: [
      "Lie flat on your back, legs straight and hands under your hips or by your sides.",
      "Keeping your legs straight, lift them up until they form a 90-degree angle with your body.",
      "Slowly lower your legs back toward the floor, stopping an inch before they touch.",
      "Engage your lower abs to prevent your lower back from arching."
    ]
  },
  {
    id: 's16',
    name: 'Side Plank Hold',
    category: 'strength',
    emoji: '⏸️',
    duration: 5,
    calories: 30,
    difficulty: 'Intermediate',
    steps: [
      "Lie on your side, propping your upper body up on your forearm.",
      "Stack your feet and lift your hips off the floor, creating a straight diagonal line.",
      "Extend your top arm toward the ceiling.",
      "Keep your core locked and hips elevated, and repeat on the other side."
    ]
  },
  {
    id: 's17',
    name: 'Donkey Kicks',
    category: 'strength',
    emoji: '🫏',
    duration: 8,
    calories: 35,
    difficulty: 'Beginner',
    steps: [
      "Start on your hands and knees in tabletop position.",
      "Keep one knee bent at 90 degrees and lift that leg back and upward.",
      "Press the sole of your foot toward the ceiling, squeezing your glute.",
      "Return the knee toward the floor without touching it, and repeat."
    ]
  },
  {
    id: 's18',
    name: 'Pike Push-ups',
    category: 'strength',
    emoji: '📐',
    duration: 8,
    calories: 55,
    difficulty: 'Advanced',
    steps: [
      "Start in a high push-up position, then walk your feet forward and lift hips into an A-frame.",
      "Keep your legs straight and look toward your feet.",
      "Bend your elbows to lower the crown of your head toward the floor between your hands.",
      "Press through your shoulders to return to the starting position."
    ]
  },
  {
    id: 's19',
    name: 'Inverted Rows',
    category: 'strength',
    emoji: '🚣',
    duration: 8,
    calories: 50,
    difficulty: 'Intermediate',
    steps: [
      "Lie flat under a low bar, table edge, or suspension straps.",
      "Grip the bar with hands shoulder-width apart, body straight, heels resting on the floor.",
      "Pull your chest up to meet the bar by squeezing your shoulder blades together.",
      "Lower back down to the floor in a slow, controlled motion."
    ]
  },
  {
    id: 's20',
    name: 'Single-leg Deadlift',
    category: 'strength',
    emoji: '⚖️',
    duration: 8,
    calories: 45,
    difficulty: 'Intermediate',
    steps: [
      "Stand straight on one leg, with a slight bend in that knee.",
      "Hinge forward at the hips, extending your opposite leg straight back behind you.",
      "Lower your torso until it is parallel to the floor.",
      "Squeeze your glutes and hamstrings to return to the standing position."
    ]
  },

  // === STRETCHING (20) ===
  {
    id: 'st1',
    name: 'Neck & Shoulder Stretch',
    category: 'stretch',
    emoji: '💆',
    duration: 5,
    calories: 15,
    difficulty: 'Beginner',
    steps: [
      "Sit or stand tall, keeping your shoulders relaxed downward.",
      "Gently tilt your right ear toward your right shoulder.",
      "For a deeper stretch, place your right hand on your head and apply light pressure.",
      "Hold for 30 seconds, then repeat on the left side."
    ]
  },
  {
    id: 'st2',
    name: 'Cat-Cow Stretch',
    category: 'stretch',
    emoji: '🐈',
    duration: 5,
    calories: 20,
    difficulty: 'Beginner',
    steps: [
      "Get on your hands and knees in a tabletop position.",
      "Arch your back upward toward the ceiling, tucking your chin to your chest (Cat).",
      "Let your belly sink toward the floor while lifting your chin and tailbone (Cow).",
      "Flow slowly and gently between these poses, focusing on spinal mobility."
    ]
  },
  {
    id: 'st3',
    name: 'Seated Forward Fold',
    category: 'stretch',
    emoji: '🧘',
    duration: 6,
    calories: 18,
    difficulty: 'Beginner',
    steps: [
      "Sit on the floor with your legs straight out in front of you.",
      "Inhale, extending your arms straight overhead.",
      "Exhale and hinge forward from your hips, reaching for your ankles, shins, or toes.",
      "Keep your back long and relax your neck, breathing into your hamstrings."
    ]
  },
  {
    id: 'st4',
    name: 'Cobra Stretch',
    category: 'stretch',
    emoji: '🐍',
    duration: 5,
    calories: 22,
    difficulty: 'Beginner',
    steps: [
      "Lie face down, palms flat on the floor beneath your shoulders.",
      "Gently press into your hands, lifting your head, shoulders, and chest up.",
      "Keep your elbows slightly bent and tucked close to your ribs.",
      "Roll your shoulders back, keeping your gaze forward or slightly upward."
    ]
  },
  {
    id: 'st5',
    name: "Child's Pose Stretch",
    category: 'stretch',
    emoji: '👶',
    duration: 5,
    calories: 12,
    difficulty: 'Beginner',
    steps: [
      "Kneel and sit back on your heels, bringing your knees wide apart.",
      "Fold forward, resting your chest between your thighs and forehead on the floor.",
      "Extend your arms straight out ahead on the mat, stretching your upper back.",
      "Breathe deeply, relaxing your hips and spine."
    ]
  },
  {
    id: 'st6',
    name: 'Hamstring Stretch',
    category: 'stretch',
    emoji: '🦵',
    duration: 5,
    calories: 15,
    difficulty: 'Beginner',
    steps: [
      "Lie on your back, bend one knee and place the foot flat on the floor.",
      "Extend your opposite leg straight up toward the ceiling.",
      "Hold the back of your thigh or calf, gently drawing the leg toward your chest.",
      "Keep your foot flexed and repeat on the other side."
    ]
  },
  {
    id: 'st7',
    name: 'Quad Stretch',
    category: 'stretch',
    emoji: '🦿',
    duration: 5,
    calories: 15,
    difficulty: 'Beginner',
    steps: [
      "Stand tall, holding a wall or chair for balance.",
      "Bend one knee and lift your foot behind you, catching it with your hand.",
      "Gently pull your heel toward your glutes until you feel a stretch in your thigh.",
      "Keep your knees aligned and torso straight, and switch sides."
    ]
  },
  {
    id: 'st8',
    name: 'Butterfly Stretch',
    category: 'stretch',
    emoji: '🦋',
    duration: 6,
    calories: 15,
    difficulty: 'Beginner',
    steps: [
      "Sit on the floor, bend your knees, and bring the soles of your feet together.",
      "Grasp your ankles or feet and let your knees relax down toward the floor.",
      "Inhale to lengthen your spine, then gently fold forward, leading with your chest.",
      "Press down slightly on your thighs with your elbows for a deeper stretch."
    ]
  },
  {
    id: 'st9',
    name: 'Shoulder Opener',
    category: 'stretch',
    emoji: '👐',
    duration: 5,
    calories: 15,
    difficulty: 'Beginner',
    steps: [
      "Stand straight and interlock your fingers behind your lower back.",
      "Straighten your arms and lift your hands away from your hips.",
      "Roll your shoulders back and open your chest.",
      "Keep your neck relaxed and hold for 30 seconds."
    ]
  },
  {
    id: 'st10',
    name: 'Side Bend Stretch',
    category: 'stretch',
    emoji: '🏹',
    duration: 5,
    calories: 18,
    difficulty: 'Beginner',
    steps: [
      "Stand with feet shoulder-width apart, raise your arms straight overhead, and clasp hands.",
      "Inhale, then exhale and bend your torso to the right, pushing hips to the left.",
      "Feel the stretch along your left rib cage and waist.",
      "Hold, return to center, and repeat to the left."
    ]
  },
  {
    id: 'st11',
    name: 'Spinal Twist',
    category: 'stretch',
    emoji: '🌀',
    duration: 6,
    calories: 20,
    difficulty: 'Beginner',
    steps: [
      "Lie on your back, legs extended. Bend your right knee into your chest.",
      "Guide your right knee across your torso to touch the floor on your left side.",
      "Extend your right arm straight to the right, looking toward your hand.",
      "Relax into the twist for 30 seconds, then repeat on the opposite side."
    ]
  },
  {
    id: 'st12',
    name: 'Chest Opener',
    category: 'stretch',
    emoji: '🔓',
    duration: 5,
    calories: 15,
    difficulty: 'Beginner',
    steps: [
      "Stand inside an open doorway.",
      "Place your forearms flat against the door frame, elbows bent at a 90-degree angle.",
      "Step one foot forward and lean your body weight forward gently.",
      "Feel the stretch across your chest and shoulders, hold, and breathe."
    ]
  },
  {
    id: 'st13',
    name: 'Calf Stretch',
    category: 'stretch',
    emoji: '🦵',
    duration: 5,
    calories: 12,
    difficulty: 'Beginner',
    steps: [
      "Stand facing a wall, hands flat on the wall at shoulder height.",
      "Step your right foot back about 2 feet, keeping the leg straight and heel flat.",
      "Bend your left knee and lean forward into the wall.",
      "Keep your back heel pressed down firmly to stretch the calf, then switch."
    ]
  },
  {
    id: 'st14',
    name: 'Hip Flexor Stretch',
    category: 'stretch',
    emoji: '🏃',
    duration: 6,
    calories: 20,
    difficulty: 'Beginner',
    steps: [
      "Kneel on your left knee, stepping your right foot forward flat on the floor.",
      "Gently push your hips forward, keeping your torso tall and upright.",
      "Feel the stretch in the front of your left hip and thigh.",
      "Hold, then reverse the posture to stretch the other side."
    ]
  },
  {
    id: 'st15',
    name: 'Wrist & Forearm Stretch',
    category: 'stretch',
    emoji: '✍️',
    duration: 4,
    calories: 10,
    difficulty: 'Beginner',
    steps: [
      "Extend your right arm straight forward, palm facing out, fingers pointing up.",
      "Use your left hand to pull your right fingers back toward your body.",
      "Next, point your right fingers down and pull them back toward you.",
      "Repeat on the left hand."
    ]
  },
  {
    id: 'st16',
    name: 'Knee-to-Chest Stretch',
    category: 'stretch',
    emoji: '🦵',
    duration: 5,
    calories: 15,
    difficulty: 'Beginner',
    steps: [
      "Lie on your back, legs straight.",
      "Pull your right knee into your chest, grasping your shin with both hands.",
      "Keep your left leg flat on the floor and relax your shoulders.",
      "Hold for 30 seconds, then switch legs."
    ]
  },
  {
    id: 'st17',
    name: 'Standing Forward Bend',
    category: 'stretch',
    emoji: '🧍',
    duration: 5,
    calories: 20,
    difficulty: 'Beginner',
    steps: [
      "Stand straight, then hinge forward from your hips.",
      "Let your torso hang heavy, reaching toward the floor.",
      "Keep a slight, soft bend in your knees to protect your lower back.",
      "Let your arms and head dangle freely, shaking out tension."
    ]
  },
  {
    id: 'st18',
    name: 'Sphinx Pose Stretch',
    category: 'stretch',
    emoji: '🦁',
    duration: 5,
    calories: 15,
    difficulty: 'Beginner',
    steps: [
      "Lie face down, forearms flat on the floor, elbows beneath shoulders.",
      "Press your forearms down to lift your chest off the floor.",
      "Keep your gaze forward, shoulders rolled down away from your neck.",
      "Breathe deeply to stretch your abdominal wall."
    ]
  },
  {
    id: 'st19',
    name: 'Cow Face Arms',
    category: 'stretch',
    emoji: '🐄',
    duration: 4,
    calories: 12,
    difficulty: 'Beginner',
    steps: [
      "Reach your right arm straight up, bend the elbow, and drop your hand behind your neck.",
      "Reach your left arm down, bend the elbow, and bring your hand up your back.",
      "Try to clasp your fingers together behind your shoulder blades.",
      "Hold, keeping your chest open, and repeat on the other side."
    ]
  },
  {
    id: 'st20',
    name: 'Deep Squat Stretch',
    category: 'stretch',
    emoji: '🧘',
    duration: 5,
    calories: 22,
    difficulty: 'Intermediate',
    steps: [
      "Stand with feet wider than shoulder-width, toes pointing slightly outward.",
      "Lower your hips all the way down into a deep squat.",
      "Press your elbows against the insides of your knees, hands together in prayer.",
      "Keep your spine straight and chest lifted, allowing your hips to sink."
    ]
  },

  // === BREATHING (10) ===
  {
    id: 'b1',
    name: 'Box Breathing',
    category: 'breathing',
    emoji: '📦',
    duration: 4,
    calories: 10,
    difficulty: 'Beginner',
    steps: [
      "Inhale slowly through your nose for 4 seconds.",
      "Hold your breath for 4 seconds.",
      "Exhale slowly through your mouth for 4 seconds.",
      "Hold your lungs empty for 4 seconds. Repeat the box cycle."
    ]
  },
  {
    id: 'b2',
    name: '4-7-8 Breathing Technique',
    category: 'breathing',
    emoji: '🌬️',
    duration: 5,
    calories: 12,
    difficulty: 'Beginner',
    steps: [
      "Exhale completely through your mouth, making a whoosh sound.",
      "Close your mouth and inhale quietly through your nose for 4 seconds.",
      "Hold your breath for a count of 7 seconds.",
      "Exhale completely through your mouth for a count of 8 seconds."
    ]
  },
  {
    id: 'b3',
    name: 'Alternate Nostril Breathing',
    category: 'breathing',
    emoji: '👃',
    duration: 5,
    calories: 15,
    difficulty: 'Beginner',
    steps: [
      "Sit in a comfortable position, placing your right thumb on your right nostril.",
      "Inhale deeply through your left nostril.",
      "Close your left nostril with your ring finger, release the right, and exhale.",
      "Inhale through the right, close it, and exhale through the left."
    ]
  },
  {
    id: 'b4',
    name: 'Deep Belly Breathing',
    category: 'breathing',
    emoji: '🎈',
    duration: 5,
    calories: 10,
    difficulty: 'Beginner',
    steps: [
      "Place one hand on your chest and the other on your belly.",
      "Inhale deeply through your nose, expanding your belly out while keeping chest still.",
      "Exhale slowly through pursed lips, feeling your belly contract.",
      "Keep your breathing slow, deep, and rhythmic."
    ]
  },
  {
    id: 'b5',
    name: 'Kapalbhati Pranayama',
    category: 'breathing',
    emoji: '🔥',
    duration: 5,
    calories: 25,
    difficulty: 'Intermediate',
    steps: [
      "Sit comfortably with your spine straight.",
      "Take a deep breath in, then exhale forcefully through your nose by contracting abs.",
      "Allow the inhalation to happen passively as your belly relaxes.",
      "Repeat the sharp, rhythmic exhalations at a comfortable pace."
    ]
  },
  {
    id: 'b6',
    name: 'Bhramari (Bee Breath)',
    category: 'breathing',
    emoji: '🐝',
    duration: 5,
    calories: 12,
    difficulty: 'Beginner',
    steps: [
      "Sit straight and close your eyes. Place index fingers on your ears.",
      "Inhale deeply through your nose.",
      "Exhale slowly, making a steady, high-pitched humming sound like a bee.",
      "Feel the soothing vibration in your face and head."
    ]
  },
  {
    id: 'b7',
    name: 'Ujjayi (Ocean Breathing)',
    category: 'breathing',
    emoji: '🌊',
    duration: 5,
    calories: 15,
    difficulty: 'Intermediate',
    steps: [
      "Inhale through your nose, constricting the back of your throat slightly.",
      "Exhale slowly through your nose with the same constriction, creating a whispering ocean sound.",
      "Ensure the breath is long, smooth, and steady.",
      "Feel the calming heat and focus it brings."
    ]
  },
  {
    id: 'b8',
    name: 'Sheetali Pranayama',
    category: 'breathing',
    emoji: '❄️',
    duration: 4,
    calories: 10,
    difficulty: 'Beginner',
    steps: [
      "Sit comfortably, stick out your tongue and roll it into a tube shape.",
      "Inhale deeply through the rolled tongue, feeling a cold sensation.",
      "Withdraw your tongue, close your mouth, and exhale slowly through your nostrils."
    ]
  },
  {
    id: 'b9',
    name: 'Equal Breathing (Sama Vritti)',
    category: 'breathing',
    emoji: '⚖️',
    duration: 5,
    calories: 10,
    difficulty: 'Beginner',
    steps: [
      "Inhale through your nose for a count of 4 seconds.",
      "Exhale through your nose for the exact same count of 4 seconds.",
      "As you get comfortable, increase the count to 5 or 6 seconds, keeping inhale and exhale equal."
    ]
  },
  {
    id: 'b10',
    name: 'Resonance Breathing',
    category: 'breathing',
    emoji: '🔔',
    duration: 5,
    calories: 12,
    difficulty: 'Beginner',
    steps: [
      "Inhale quietly through your nose for 5 seconds.",
      "Exhale smoothly through your nose for 5 seconds.",
      "Maintain this cycle of 6 breaths per minute continuously.",
      "Allows heart rate variability (HRV) to align and calm the nervous system."
    ]
  }
];

const ExercisePage: React.FC = () => {
  const { t, formatNumber } = useLanguage();
  const { logs } = useHealthRead();
  const { logExercise } = useHealthDispatch();

  // Navigation / Tabs state
  const [activeTab, setActiveTab] = useState<'All' | 'Yoga' | 'Cardio' | 'Strength' | 'Breathing' | 'Stretching'>('All');
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Active workout timer modal state
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [activeStepIdx, setActiveStepIdx] = useState(0);

  // AI Recommender states
  const [aiInput, setAiInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<{
    text: string;
    exercises: Exercise[];
  } | null>(null);

  // Dynamic Routine Recommendation Alert (HPA Axis Support)
  const lastStress = useMemo(() => logs.find(l => l.type === 'stress'), [logs]);
  const lastMood = useMemo(() => logs.find(l => l.type === 'mood'), [logs]);
  const stressScore = lastStress ? Number(lastStress.value.score || 0) : 15;
  const moodState = lastMood ? String(lastMood.value.mood || '') : 'calm';

  const isHighStressOrLowMood = stressScore > 26 || moodState === 'anxious' || moodState === 'angry' || moodState === 'sad';

  // Stats calculation based on today's logs
  const stats = useMemo(() => {
    const todayStr = new Date().toDateString();
    let workoutsToday = 0;
    let minutesToday = 0;
    let caloriesToday = 0;

    logs.forEach(log => {
      if (log.type === 'exercise') {
        const logDate = new Date(log.created_at).toDateString();
        if (logDate === todayStr) {
          workoutsToday += 1;
          const duration = Number(log.value.duration || 0);
          minutesToday += duration;

          // Lookup calories in database, fallback to 7 cal/min
          const matchedEx = exercisesDatabase.find(
            ex => ex.name.toLowerCase() === String(log.value.routine || '').toLowerCase()
          );
          if (matchedEx) {
            caloriesToday += matchedEx.calories;
          } else {
            caloriesToday += duration * 7;
          }
        }
      }
    });

    return { workoutsToday, minutesToday, caloriesToday };
  }, [logs]);

  // Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            showToast("Workout time completed! Good job!", "success");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerSeconds]);

  // Start a workout
  const handleStartExercise = (exercise: Exercise) => {
    setActiveExercise(exercise);
    setTimerSeconds(exercise.duration * 60);
    setIsTimerRunning(true);
    setActiveStepIdx(0);
    showToast(`Started exercise: ${exercise.name}`, "info");
  };

  // Close workout wizard
  const handleCloseWorkout = () => {
    setActiveExercise(null);
    setIsTimerRunning(false);
  };

  // Log completion of the workout
  const handleLogWorkout = () => {
    if (!activeExercise) return;
    
    logExercise({
      routine: activeExercise.name,
      duration: activeExercise.duration
    });

    showToast(
      navigator.onLine
        ? `Logged workout: ${activeExercise.name} (${activeExercise.duration} mins) successfully!`
        : `Logged workout locally. Will sync online soon!`,
      'success'
    );

    setActiveExercise(null);
    setIsTimerRunning(false);
  };

  // Filter exercises
  const filteredExercises = useMemo(() => {
    return exercisesDatabase.filter(ex => {
      // Category filter
      let matchesCategory = true;
      if (activeTab !== 'All') {
        const catMap: Record<string, string> = {
          'Yoga': 'yoga',
          'Cardio': 'cardio',
          'Strength': 'strength',
          'Breathing': 'breathing',
          'Stretching': 'stretch'
        };
        matchesCategory = ex.category === catMap[activeTab];
      }

      // Search filter
      const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            ex.difficulty.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [activeTab, searchQuery]);

  // AI Recommender action
  const handleAskAi = () => {
    if (!aiInput.trim()) {
      showToast("Please describe your problem or goal first!", "warning");
      return;
    }

    setIsAiLoading(true);
    setAiResult(null);

    // Simulate localized intelligent parsing
    setTimeout(() => {
      const input = aiInput.toLowerCase();
      let selectedIds: string[] = [];
      let explanation = "";

      if (input.includes('back') || input.includes('spine') || input.includes('sciatica') || input.includes('posture')) {
        selectedIds = ['st2', 'st5', 'st11']; // Cat-Cow stretch, Child's pose stretch, Spinal twist
        explanation = "We recommend gentle stretching and decompression exercises. These movements mobilize the spinal column, relieve intervertebral pressure, and stretch tight lower back muscles without adding loading stress.";
      } else if (input.includes('neck') || input.includes('shoulder') || input.includes('headache') || input.includes('sitting')) {
        selectedIds = ['st1', 'st9', 'st12']; // Neck/Shoulder, Shoulder opener, Chest opener
        explanation = "Long sitting hours often cause thoracic kyphosis and forward head posture. These stretching exercises open your thoracic chest wall, relax tense upper trapezius muscles, and release shoulder joint stress.";
      } else if (input.includes('knee') || input.includes('leg') || input.includes('calf') || input.includes('hamstring') || input.includes('foot')) {
        selectedIds = ['st6', 'st13', 's1']; // Hamstring, Calf stretch, Calf raises
        explanation = "To alleviate lower limb stiffness or knee stress, it is vital to stretch the posterior chain (calves and hamstrings) while gently strengthening ankles and calf muscle groups to support your joints.";
      } else if (input.includes('stress') || input.includes('anxiety') || input.includes('calm') || input.includes('mind') || input.includes('relax') || input.includes('sleep') || input.includes('head')) {
        selectedIds = ['b1', 'y17', 'b2']; // Box breathing, Corpse pose, 4-7-8 Breathing
        explanation = "Elevated cortisol triggers your sympathetic nervous system. Box breathing and deep restorative poses activate your parasympathetic vagus nerve, lowering blood pressure and centering your mind.";
      } else if (input.includes('weight') || input.includes('fat') || input.includes('burn') || input.includes('cardio') || input.includes('sweat') || input.includes('stamina') || input.includes('lose')) {
        selectedIds = ['c2', 'c8', 'c14']; // Skipping, Burpees, Sprints
        explanation = "For high caloric expenditure and metabolic speed, high-intensity intervals and full-body cardio are ideal. These exercises elevate your heart rate rapidly, inducing a strong post-exercise oxygen consumption (EPOC) effect.";
      } else if (input.includes('strength') || input.includes('muscle') || input.includes('abs') || input.includes('chest') || input.includes('core') || input.includes('pushup') || input.includes('power')) {
        selectedIds = ['s10', 's8', 's9']; // Pushups, Squats, Plank hold
        explanation = "Building functional strength requires targeting major compound body movements. Squats engage your lower body, push-ups build chest and upper limb stability, and planks solidify core abdominal structure.";
      } else if (input.includes('flexibility') || input.includes('stiff') || input.includes('stretch')) {
        selectedIds = ['st3', 'st8', 'st17']; // Seated forward fold, Butterfly, Standing bend
        explanation = "Improving general flexibility requires static holds of high muscle group attachments. Butterfly stretch releases tight hip flexors, while forward folds elongate back and hamstring fibers.";
      } else {
        // Fallback default
        selectedIds = ['y6', 'c10', 's2']; // Tree pose, Jumping jacks, Wall sit
        explanation = "Based on your general fitness goal, we recommend a balanced circuit: Tree Pose for deep focus and balance, Jumping Jacks to warm up your cardio system, and a Wall Sit to build lower body isometric strength.";
      }

      const recExercises = exercisesDatabase.filter(ex => selectedIds.includes(ex.id));

      setAiResult({
        text: explanation,
        exercises: recExercises
      });
      setIsAiLoading(false);
      showToast("AI Recommendations generated!", "success");
    }, 1500);
  };

  // Helper to get category classes for neon colors
  const getCategoryStyles = (category: string) => {
    switch(category) {
      case 'yoga':
        return {
          bg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
          border: 'border-purple-500/20',
          hover: 'hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.35)]',
          badge: 'bg-purple-500/15 text-purple-700 dark:text-purple-300'
        };
      case 'cardio':
        return {
          bg: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
          border: 'border-orange-500/20',
          hover: 'hover:border-orange-500/50 hover:shadow-[0_0_20px_rgba(249,115,22,0.35)]',
          badge: 'bg-orange-500/15 text-orange-700 dark:text-orange-300'
        };
      case 'strength':
        return {
          bg: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
          border: 'border-cyan-500/20',
          hover: 'hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.35)]',
          badge: 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300'
        };
      case 'stretch':
        return {
          bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
          border: 'border-emerald-500/20',
          hover: 'hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.35)]',
          badge: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
        };
      case 'breathing':
        return {
          bg: 'bg-pink-500/10 text-pink-600 dark:text-pink-400',
          border: 'border-pink-500/20',
          hover: 'hover:border-pink-500/50 hover:shadow-[0_0_20px_rgba(236,72,153,0.35)]',
          badge: 'bg-pink-500/15 text-pink-700 dark:text-pink-300'
        };
      default:
        return {
          bg: 'bg-slate-500/10 text-slate-600 dark:text-slate-400',
          border: 'border-slate-500/20',
          hover: 'hover:border-slate-500/50 hover:shadow-[0_0_20px_rgba(100,116,139,0.2)]',
          badge: 'bg-slate-500/15 text-slate-700 dark:text-slate-300'
        };
    }
  };

  // Format Timer text MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fade-up-staggered relative pb-10">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-orange-500/10 rounded-2xl text-orange-500 border border-orange-500/20">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold font-heading text-foreground tracking-tight">
              {t('tracker.exercise.title') || 'Exercise Recommendations'}
            </h1>
            <p className="text-muted-foreground text-sm font-medium">
              Stay active, stay healthy.
            </p>
          </div>
        </div>
      </div>

      {/* STATISTICS HEADER PANELS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Calories Card */}
        <div className="bg-card/45 backdrop-blur-lg border border-border/50 rounded-2xl p-5 shadow-sm flex items-center gap-4 hover:shadow-[0_0_15px_rgba(249,115,22,0.15)] transition-all duration-300">
          <div className="p-3.5 bg-orange-500/10 text-orange-500 border border-orange-500/20 rounded-2xl">
            <Flame className="w-6 h-6 fill-current animate-pulse" />
          </div>
          <div>
            <div className="text-3xl font-extrabold font-number text-foreground tracking-tight">
              {formatNumber(stats.caloriesToday)}
            </div>
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Calories today
            </span>
          </div>
        </div>

        {/* Minutes Card */}
        <div className="bg-card/45 backdrop-blur-lg border border-border/50 rounded-2xl p-5 shadow-sm flex items-center gap-4 hover:shadow-[0_0_15px_rgba(6,182,212,0.15)] transition-all duration-300">
          <div className="p-3.5 bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 rounded-2xl">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-3xl font-extrabold font-number text-foreground tracking-tight">
              {formatNumber(stats.minutesToday)}
            </div>
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Minutes today
            </span>
          </div>
        </div>

        {/* Workouts Card */}
        <div className="bg-card/45 backdrop-blur-lg border border-border/50 rounded-2xl p-5 shadow-sm flex items-center gap-4 hover:shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all duration-300">
          <div className="p-3.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-2xl">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <div className="text-3xl font-extrabold font-number text-foreground tracking-tight">
              {formatNumber(stats.workoutsToday)}
            </div>
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Workouts today
            </span>
          </div>
        </div>
      </div>

      {/* TODAY'S RECOMMANDATION DYNAMIC ALERTS */}
      <div className={`p-4 border-2 rounded-2xl flex items-start gap-4 glass animate-float ${
        isHighStressOrLowMood 
          ? 'bg-purple-500/5 border-purple-500/20 text-purple-700 dark:text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.1)]' 
          : 'bg-emerald-500/5 border-emerald-500/20 text-emerald-700 dark:text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
      }`}>
        <div className="p-2 bg-background/80 rounded-xl border border-border/40 shrink-0">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        <div>
          <span className="font-extrabold text-sm block mb-1">
            {isHighStressOrLowMood ? '🧘 Dynamic recommendation: Soothing & Restorative' : "⚡ Today's Recommendation"}
          </span>
          <p className="text-xs opacity-90 leading-relaxed font-semibold">
            {isHighStressOrLowMood 
              ? `Your stress markers are elevated (${formatNumber(stressScore)}/40) or mood feels low. We recommend gentle Breathing exercises or stretching to reduce sympathetic system tone.` 
              : "You're doing well! Try some general fitness, active cardio, or lower limb strength workouts today."
            }
          </p>
        </div>
      </div>

      {/* AI COMPANION FITNESS RECOMMENDER */}
      <div className="bg-card/40 backdrop-blur-md border border-border/50 rounded-2xl p-6 shadow-sm glass relative overflow-hidden">
        <div className="noise-overlay" />
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border/30">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            <h3 className="font-heading font-extrabold text-lg text-foreground">
              AI Exercise Recommender
            </h3>
          </div>
          
          <p className="text-xs text-muted-foreground font-medium">
            Describe any physical discomfort, localized stiffness, energy level, or workout goal, and the AI will analyze and build an optimized session.
          </p>

          <div className="flex flex-col md:flex-row gap-3">
            <textarea
              className="flex-1 p-3 text-xs rounded-xl border border-border bg-background/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all input-accent-glow font-medium resize-none h-20"
              placeholder="e.g. My lower back is stiff from sitting at my computer all day, what stretches do you recommend?"
              value={aiInput}
              onChange={e => setAiInput(e.target.value)}
            />
            <button
              onClick={handleAskAi}
              disabled={isAiLoading}
              className="px-6 py-3 bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 btn-elastic h-12 md:h-auto shrink-0 touch-target"
            >
              {isAiLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze & Recommend</span>
                </>
              )}
            </button>
          </div>

          {/* AI Output Section */}
          {aiResult && (
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl space-y-4 animate-slide-up">
              <div className="flex items-start gap-2.5">
                <div className="p-1.5 bg-primary/10 text-primary rounded-lg shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold text-foreground">AI Companion Assessment:</span>
                  <p className="text-xs leading-relaxed text-muted-foreground font-medium">
                    {aiResult.text}
                  </p>
                </div>
              </div>

              {/* Recommended Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                {aiResult.exercises.map(ex => {
                  const style = getCategoryStyles(ex.category);
                  return (
                    <div 
                      key={ex.id} 
                      className={`bg-card border ${style.border} rounded-xl p-4 flex flex-col justify-between transition-all duration-300 relative overflow-hidden glass ${style.hover}`}
                    >
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <span className="text-2xl">{ex.emoji}</span>
                          <span className={`text-[9px] uppercase font-extrabold px-2 py-0.5 rounded ${style.badge}`}>
                            {ex.category}
                          </span>
                        </div>
                        <h4 className="font-bold text-xs text-foreground leading-snug">{ex.name}</h4>
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-medium">
                          <span className="bg-muted px-1.5 py-0.5 rounded">{ex.difficulty}</span>
                          <span>•</span>
                          <span>{ex.duration} min</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleStartExercise(ex)}
                        className="w-full mt-4 bg-primary text-white font-bold py-2 rounded-lg text-[10px] flex items-center justify-center gap-1 hover:bg-primary/95 btn-elastic touch-target"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Start Exercise</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FILTER TABS & SEARCH */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 sm:pb-0 scrollbar-none">
            {(['All', 'Yoga', 'Cardio', 'Strength', 'Breathing', 'Stretching'] as const).map(tab => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-xs font-bold rounded-full transition-all shrink-0 touch-target ${
                    isActive 
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-card border border-border/50 text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:max-w-xs shrink-0">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search exercise..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-full border border-border bg-card focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all input-accent-glow font-medium"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* EXERCISES GRID CATALOG */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExercises.map(ex => {
            const style = getCategoryStyles(ex.category);
            return (
              <div
                key={ex.id}
                className={`bg-card/70 backdrop-blur-md border ${style.border} rounded-2xl p-5 shadow-sm flex flex-col justify-between transition-all duration-300 relative overflow-hidden glass ${style.hover}`}
              >
                <div>
                  <div className="flex justify-between items-start gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-muted/60 dark:bg-muted/30 border border-border/40 rounded-xl flex items-center justify-center text-2xl shrink-0">
                        {ex.emoji}
                      </div>
                      <div>
                        <h3 className="font-heading font-extrabold text-sm text-foreground leading-snug">
                          {ex.name}
                        </h3>
                        <div className="flex gap-1.5 mt-1 flex-wrap">
                          <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase ${style.badge}`}>
                            {ex.category === 'stretch' ? 'Stretch' : ex.category}
                          </span>
                          <span className="text-[9px] bg-muted/80 text-muted-foreground font-extrabold px-1.5 py-0.5 rounded uppercase">
                            {ex.difficulty}
                          </span>
                        </div>
                      </div>
                    </div>

                    <span className="text-[9px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold px-2 py-0.5 rounded shrink-0 uppercase tracking-wide border border-emerald-500/20">
                      Recommended
                    </span>
                  </div>

                  <div className="flex items-center gap-6 py-2.5 border-t border-b border-border/40 my-4 text-xs font-semibold text-muted-foreground font-number">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-cyan-500" />
                      <span>{ex.duration} min</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-orange-500" />
                      <span>{ex.calories} cal</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleStartExercise(ex)}
                  className="w-full bg-primary/10 hover:bg-primary text-primary hover:text-white border border-primary/20 font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all duration-300 touch-target btn-elastic"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Start Exercise</span>
                </button>
              </div>
            );
          })}
        </div>

        {filteredExercises.length === 0 && (
          <div className="text-center py-12 border border-dashed border-border rounded-2xl bg-card/20 glass">
            <p className="text-sm text-muted-foreground font-semibold">
              No exercises match your filters. Try search terms or check category pills!
            </p>
          </div>
        )}
      </div>

      {/* BENIFITS INFORMATIONAL BAR */}
      <div className="p-4 bg-muted/40 border border-border rounded-xl flex gap-3 text-xs leading-relaxed text-muted-foreground">
        <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-foreground block mb-1">Cardiorespiratory & Autonomic Benefits:</span>
          Regular physical exercise lowers resting heart rate, improves insulin sensitivity, and regulates blood pressure index levels. Choosing exercises dynamically matching your psychological metrics avoids sympathetic overload, protecting the HPA axis from chronic burnout.
        </div>
      </div>

      {/* ACTIVE WORKOUT WIZARD MODAL POPUP */}
      {activeExercise && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-fade-in">
          <div className="bg-card border border-border rounded-2xl w-full max-w-lg p-6 shadow-2xl relative overflow-hidden glass max-h-[90vh] flex flex-col justify-between">
            <button
              onClick={handleCloseWorkout}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-all touch-target"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-4 flex-1 overflow-y-auto pr-1">
              <div className="flex items-center gap-3 pb-3 border-b border-border/40">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-xl shrink-0">
                  {activeExercise.emoji}
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-base text-foreground">
                    {activeExercise.name}
                  </h3>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                    Category: {activeExercise.category} • {activeExercise.difficulty}
                  </span>
                </div>
              </div>

              {/* TIMER RADIAL / BLOCK DISPLAY */}
              <div className="flex flex-col items-center justify-center p-4 border border-border/30 bg-muted/20 rounded-2xl gap-3">
                
                {/* Visual Timer Progress Circle */}
                {(() => {
                  const totalSecs = activeExercise.duration * 60;
                  const ratio = totalSecs > 0 ? timerSeconds / totalSecs : 0;
                  const radius = 50;
                  const circumference = 2 * Math.PI * radius;
                  const offset = circumference - ratio * circumference;
                  return (
                    <div className="relative w-32 h-32 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="64" cy="64" r={radius} stroke="currentColor" strokeWidth="4.5" className="text-muted/10 dark:text-muted/20" fill="none" />
                        <circle 
                          cx="64" 
                          cy="64" 
                          r={radius} 
                          stroke="hsl(var(--primary))" 
                          strokeWidth="4.5" 
                          className="transition-all duration-300 drop-shadow-[0_0_6px_rgba(139,92,246,0.3)]" 
                          fill="none" 
                          strokeDasharray={circumference}
                          strokeDashoffset={offset}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute flex flex-col items-center">
                        <span className="text-2xl font-extrabold font-number text-foreground tracking-tight">
                          {formatTime(timerSeconds)}
                        </span>
                        <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-widest mt-0.5">
                          Remaining
                        </span>
                      </div>
                    </div>
                  );
                })()}

                {/* Play/Pause/Reset Row */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    className="p-2.5 bg-primary text-white rounded-full hover:bg-primary/95 transition-all shadow-md touch-target btn-elastic"
                  >
                    {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                  </button>
                  <button
                    onClick={() => {
                      setIsTimerRunning(false);
                      setTimerSeconds(activeExercise.duration * 60);
                      showToast("Timer reset", "info");
                    }}
                    className="p-2.5 bg-card border border-border text-muted-foreground hover:text-foreground rounded-full hover:bg-muted/50 transition-all touch-target"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* STEPS PREVIEW IN MODAL */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-foreground block">
                  Instruction Guide ({activeStepIdx + 1}/{activeExercise.steps.length}):
                </span>
                <div className="p-4 border border-primary/20 bg-primary/5 rounded-xl flex items-start gap-3 min-h-[90px] animate-slide-in-question">
                  <div className="p-1 bg-primary text-white rounded-full mt-0.5 shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <p className="text-xs text-foreground font-medium leading-relaxed">
                    {activeExercise.steps[activeStepIdx]}
                  </p>
                </div>

                {/* Steps Navigator */}
                <div className="flex justify-between items-center pt-2">
                  <button
                    disabled={activeStepIdx === 0}
                    onClick={() => setActiveStepIdx(prev => prev - 1)}
                    className="px-3.5 py-1.5 text-[10px] font-bold border border-border rounded-lg bg-card text-muted-foreground hover:text-foreground hover:bg-muted/30 disabled:opacity-30 transition-all touch-target"
                  >
                    Prev Step
                  </button>

                  <div className="flex gap-1">
                    {activeExercise.steps.map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-1.5 h-1.5 rounded-full transition-all ${
                          i === activeStepIdx ? 'bg-primary w-4' : 'bg-muted-foreground/30'
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    disabled={activeStepIdx === activeExercise.steps.length - 1}
                    onClick={() => setActiveStepIdx(prev => prev + 1)}
                    className="px-3.5 py-1.5 text-[10px] font-bold border border-border rounded-lg bg-card text-muted-foreground hover:text-foreground hover:bg-muted/30 disabled:opacity-30 transition-all touch-target"
                  >
                    Next Step
                  </button>
                </div>
              </div>
            </div>

            {/* LOG WORKOUT COMPLETE BUTTON */}
            <div className="pt-4 border-t border-border/40 mt-4">
              <button
                onClick={handleLogWorkout}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/10 touch-target btn-elastic btn-pulse-glow"
                style={{ '--btn-glow-color': '16, 185, 129' } as React.CSSProperties}
              >
                <CheckCircle className="w-4 h-4" />
                <span>Complete & Log Workout ({activeExercise.calories} cal)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExercisePage;
