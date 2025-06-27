"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Navigation from "@/components/navigation"
import {
  Apple,
  Clock,
  ChefHat,
  Utensils,
  Coffee,
  Salad,
  TrendingUp,
  Heart,
  Shield,
  Zap,
  CheckCircle,
} from "lucide-react"
import { updateUserData } from "@/lib/local-storage"

interface User {
  id: string
  name: string
  email: string
  age: number
  dietPlanGenerated: boolean
  userType: string
  user_type: string
}

interface Meal {
  name: string
  time: string
  calories: number
  prepTime: string
  ingredients: string[]
  instructions: string[]
  nutrition: {
    protein: number
    carbs: number
    fat: number
    fiber: number
  }
}

interface DayPlan {
  day: string
  date: string
  totalCalories: number
  meals: {
    breakfast: Meal
    lunch: Meal
    dinner: Meal
    snacks: Meal[]
  }
  healthBenefits: string[]
  tips: string[]
}

export default function DietPlanPage() {
  const [user, setUser] = useState<User | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [dietPlan, setDietPlan] = useState<DayPlan[]>([])
  const [selectedDay, setSelectedDay] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("currentUser")
    if (!userData) {
      router.push("/")
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.userType !== "patient" && parsedUser.user_type !== "patient") {
      router.push("/")
      return
    }

    setUser(parsedUser)

    // Load existing diet plan
    const existingPlan = localStorage.getItem(`dietPlan_${parsedUser.id}`)
    if (existingPlan) {
      setDietPlan(JSON.parse(existingPlan))
    }
  }, [router])

  const generateDietPlan = async () => {
    setIsGenerating(true)

    // Simulate AI generation delay
    await new Promise((resolve) => setTimeout(resolve, 3000))

    const weeklyPlan: DayPlan[] = [
      {
        day: "Monday",
        date: new Date(Date.now() + 0 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        totalCalories: 1850,
        meals: {
          breakfast: {
            name: "Antioxidant Berry Bowl",
            time: "8:00 AM",
            calories: 420,
            prepTime: "10 minutes",
            ingredients: [
              "1 cup Greek yogurt (plain)",
              "1/2 cup mixed berries (blueberries, strawberries)",
              "2 tbsp chia seeds",
              "1 tbsp honey",
              "1/4 cup granola",
              "1 tbsp almond butter",
            ],
            instructions: [
              "Add Greek yogurt to a bowl",
              "Top with mixed berries and chia seeds",
              "Drizzle with honey and almond butter",
              "Sprinkle granola on top",
              "Let sit for 5 minutes to allow chia seeds to expand",
            ],
            nutrition: { protein: 25, carbs: 45, fat: 18, fiber: 12 },
          },
          lunch: {
            name: "Mediterranean Quinoa Salad",
            time: "12:30 PM",
            calories: 520,
            prepTime: "15 minutes",
            ingredients: [
              "1 cup cooked quinoa",
              "1/2 cup cherry tomatoes, halved",
              "1/2 cucumber, diced",
              "1/4 cup red onion, diced",
              "1/4 cup kalamata olives",
              "2 oz feta cheese, crumbled",
              "2 tbsp olive oil",
              "1 tbsp lemon juice",
              "Fresh herbs (parsley, mint)",
            ],
            instructions: [
              "Cook quinoa according to package directions and cool",
              "Dice all vegetables and combine in large bowl",
              "Add cooled quinoa and olives",
              "Whisk olive oil and lemon juice together",
              "Toss salad with dressing and top with feta",
              "Garnish with fresh herbs",
            ],
            nutrition: { protein: 18, carbs: 52, fat: 22, fiber: 8 },
          },
          dinner: {
            name: "Baked Salmon with Sweet Potato",
            time: "7:00 PM",
            calories: 650,
            prepTime: "25 minutes",
            ingredients: [
              "6 oz salmon fillet",
              "1 medium sweet potato",
              "2 cups broccoli florets",
              "2 tbsp olive oil",
              "1 lemon, sliced",
              "2 cloves garlic, minced",
              "1 tsp dried herbs (thyme, rosemary)",
              "Salt and pepper to taste",
            ],
            instructions: [
              "Preheat oven to 400°F (200°C)",
              "Cut sweet potato into cubes and toss with 1 tbsp olive oil",
              "Place salmon on baking sheet with lemon slices",
              "Season salmon with herbs, garlic, salt, and pepper",
              "Roast sweet potato for 20 minutes, add broccoli for last 10 minutes",
              "Bake salmon for 12-15 minutes until flaky",
            ],
            nutrition: { protein: 42, carbs: 35, fat: 28, fiber: 8 },
          },
          snacks: [
            {
              name: "Green Tea & Almonds",
              time: "3:00 PM",
              calories: 160,
              prepTime: "2 minutes",
              ingredients: ["1 cup green tea", "1 oz raw almonds (about 23 almonds)"],
              instructions: ["Brew green tea for 3-5 minutes", "Enjoy with a handful of almonds"],
              nutrition: { protein: 6, carbs: 6, fat: 14, fiber: 4 },
            },
            {
              name: "Apple with Peanut Butter",
              time: "9:30 PM",
              calories: 190,
              prepTime: "2 minutes",
              ingredients: ["1 medium apple, sliced", "2 tbsp natural peanut butter"],
              instructions: ["Slice apple into wedges", "Serve with peanut butter for dipping"],
              nutrition: { protein: 8, carbs: 25, fat: 16, fiber: 6 },
            },
          ],
        },
        healthBenefits: [
          "High in omega-3 fatty acids for brain health",
          "Rich in antioxidants to fight inflammation",
          "Excellent source of fiber for digestive health",
          "Balanced macronutrients for sustained energy",
        ],
        tips: [
          "Drink plenty of water throughout the day",
          "Take a 10-minute walk after lunch",
          "Prepare quinoa in batches for the week",
        ],
      },
      {
        day: "Tuesday",
        date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        totalCalories: 1780,
        meals: {
          breakfast: {
            name: "Veggie Scramble with Avocado Toast",
            time: "8:00 AM",
            calories: 450,
            prepTime: "12 minutes",
            ingredients: [
              "2 large eggs",
              "1/4 cup bell peppers, diced",
              "1/4 cup spinach",
              "2 tbsp onion, diced",
              "1 slice whole grain bread",
              "1/2 avocado",
              "1 tbsp olive oil",
              "Salt, pepper, paprika",
            ],
            instructions: [
              "Heat olive oil in non-stick pan",
              "Sauté onions and peppers for 3 minutes",
              "Add spinach and cook until wilted",
              "Scramble eggs with vegetables",
              "Toast bread and mash avocado on top",
              "Season with salt, pepper, and paprika",
            ],
            nutrition: { protein: 20, carbs: 28, fat: 26, fiber: 12 },
          },
          lunch: {
            name: "Lentil and Vegetable Soup",
            time: "1:00 PM",
            calories: 380,
            prepTime: "30 minutes",
            ingredients: [
              "1 cup red lentils",
              "2 cups vegetable broth",
              "1 carrot, diced",
              "1 celery stalk, diced",
              "1/2 onion, diced",
              "2 cloves garlic, minced",
              "1 can diced tomatoes",
              "1 tsp cumin",
              "1 tsp turmeric",
              "2 tbsp olive oil",
            ],
            instructions: [
              "Heat olive oil in large pot",
              "Sauté onion, carrot, and celery for 5 minutes",
              "Add garlic and spices, cook for 1 minute",
              "Add lentils, tomatoes, and broth",
              "Simmer for 20-25 minutes until lentils are tender",
              "Season with salt and pepper to taste",
            ],
            nutrition: { protein: 18, carbs: 48, fat: 12, fiber: 16 },
          },
          dinner: {
            name: "Grilled Chicken with Roasted Vegetables",
            time: "7:30 PM",
            calories: 580,
            prepTime: "20 minutes",
            ingredients: [
              "5 oz chicken breast",
              "1 zucchini, sliced",
              "1 bell pepper, strips",
              "1 cup cherry tomatoes",
              "1/2 red onion, sliced",
              "3 tbsp olive oil",
              "2 tbsp balsamic vinegar",
              "Italian herbs",
              "Salt and pepper",
            ],
            instructions: [
              "Preheat grill or grill pan to medium-high",
              "Marinate chicken in 1 tbsp olive oil and herbs",
              "Toss vegetables with remaining oil and balsamic",
              "Grill chicken for 6-7 minutes per side",
              "Roast vegetables at 425°F for 15-20 minutes",
              "Let chicken rest before slicing",
            ],
            nutrition: { protein: 38, carbs: 22, fat: 20, fiber: 6 },
          },
          snacks: [
            {
              name: "Greek Yogurt with Berries",
              time: "10:00 AM",
              calories: 150,
              prepTime: "2 minutes",
              ingredients: ["3/4 cup Greek yogurt", "1/2 cup mixed berries"],
              instructions: ["Combine yogurt and berries in bowl", "Enjoy immediately"],
              nutrition: { protein: 15, carbs: 18, fat: 2, fiber: 4 },
            },
            {
              name: "Herbal Tea with Dark Chocolate",
              time: "8:00 PM",
              calories: 120,
              prepTime: "3 minutes",
              ingredients: ["1 cup chamomile tea", "1 oz dark chocolate (70% cacao)"],
              instructions: ["Brew tea for 5 minutes", "Enjoy with small piece of dark chocolate"],
              nutrition: { protein: 2, carbs: 12, fat: 8, fiber: 3 },
            },
          ],
        },
        healthBenefits: [
          "High protein content supports muscle maintenance",
          "Lentils provide plant-based protein and fiber",
          "Colorful vegetables offer diverse vitamins and minerals",
          "Dark chocolate provides antioxidants and mood benefits",
        ],
        tips: [
          "Meal prep vegetables at the beginning of the week",
          "Keep herbal teas on hand for evening relaxation",
          "Choose dark chocolate with at least 70% cacao",
        ],
      },
      {
        day: "Wednesday",
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        totalCalories: 1820,
        meals: {
          breakfast: {
            name: "Overnight Oats with Nuts and Seeds",
            time: "7:45 AM",
            calories: 410,
            prepTime: "5 minutes (prep night before)",
            ingredients: [
              "1/2 cup rolled oats",
              "1/2 cup almond milk",
              "1 tbsp chia seeds",
              "1 tbsp ground flaxseed",
              "1 tbsp maple syrup",
              "1/4 cup walnuts, chopped",
              "1/2 banana, sliced",
              "1 tsp vanilla extract",
            ],
            instructions: [
              "Mix oats, almond milk, chia seeds, and flaxseed in jar",
              "Add maple syrup and vanilla extract",
              "Refrigerate overnight",
              "In morning, top with banana and walnuts",
              "Stir well before eating",
            ],
            nutrition: { protein: 14, carbs: 52, fat: 18, fiber: 14 },
          },
          lunch: {
            name: "Turkey and Hummus Wrap",
            time: "12:45 PM",
            calories: 480,
            prepTime: "8 minutes",
            ingredients: [
              "1 large whole wheat tortilla",
              "4 oz sliced turkey breast",
              "3 tbsp hummus",
              "1/4 cup shredded carrots",
              "1/4 cup cucumber, sliced",
              "2 tbsp red cabbage, shredded",
              "2 leaves lettuce",
              "1 tbsp sunflower seeds",
            ],
            instructions: [
              "Spread hummus evenly on tortilla",
              "Layer turkey, lettuce, and vegetables",
              "Sprinkle with sunflower seeds",
              "Roll tightly, tucking in sides",
              "Cut in half diagonally to serve",
            ],
            nutrition: { protein: 32, carbs: 38, fat: 16, fiber: 8 },
          },
          dinner: {
            name: "Baked Cod with Quinoa Pilaf",
            time: "7:15 PM",
            calories: 590,
            prepTime: "25 minutes",
            ingredients: [
              "6 oz cod fillet",
              "3/4 cup quinoa",
              "1.5 cups vegetable broth",
              "1/4 cup dried cranberries",
              "1/4 cup pine nuts",
              "2 tbsp fresh parsley",
              "1 lemon (juice and zest)",
              "2 tbsp olive oil",
              "1 tsp dried dill",
            ],
            instructions: [
              "Cook quinoa in vegetable broth until fluffy",
              "Season cod with dill, salt, and pepper",
              "Bake cod at 400°F for 12-15 minutes",
              "Fluff quinoa and mix in cranberries, pine nuts, parsley",
              "Add lemon juice and zest to quinoa",
              "Serve cod over quinoa pilaf",
            ],
            nutrition: { protein: 36, carbs: 48, fat: 20, fiber: 6 },
          },
          snacks: [
            {
              name: "Celery with Almond Butter",
              time: "3:30 PM",
              calories: 180,
              prepTime: "3 minutes",
              ingredients: ["3 celery stalks", "2 tbsp almond butter", "1 tbsp raisins"],
              instructions: ["Cut celery into sticks", "Fill with almond butter", "Top with raisins"],
              nutrition: { protein: 7, carbs: 12, fat: 16, fiber: 5 },
            },
            {
              name: "Herbal Tea with Honey",
              time: "9:00 PM",
              calories: 60,
              prepTime: "3 minutes",
              ingredients: ["1 cup peppermint tea", "1 tsp raw honey"],
              instructions: ["Brew tea for 5 minutes", "Stir in honey while warm"],
              nutrition: { protein: 0, carbs: 16, fat: 0, fiber: 0 },
            },
          ],
        },
        healthBenefits: [
          "Omega-3 rich fish supports heart and brain health",
          "Quinoa provides complete protein with all amino acids",
          "Nuts and seeds offer healthy fats and vitamin E",
          "High fiber content promotes digestive health",
        ],
        tips: [
          "Prepare overnight oats in batches for busy mornings",
          "Keep cut vegetables ready for quick snacks",
          "Use herbs and spices to add flavor without calories",
        ],
      },
      {
        day: "Thursday",
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        totalCalories: 1760,
        meals: {
          breakfast: {
            name: "Green Smoothie Bowl",
            time: "8:15 AM",
            calories: 390,
            prepTime: "8 minutes",
            ingredients: [
              "1 cup spinach",
              "1/2 frozen banana",
              "1/2 cup mango chunks",
              "1/2 cup coconut milk",
              "1 tbsp almond butter",
              "1 tsp spirulina powder",
              "Toppings: coconut flakes, pumpkin seeds, kiwi slices",
            ],
            instructions: [
              "Blend spinach, banana, mango, and coconut milk",
              "Add almond butter and spirulina",
              "Blend until smooth and creamy",
              "Pour into bowl",
              "Top with coconut flakes, seeds, and kiwi",
            ],
            nutrition: { protein: 12, carbs: 45, fat: 20, fiber: 10 },
          },
          lunch: {
            name: "Buddha Bowl with Tahini Dressing",
            time: "1:15 PM",
            calories: 520,
            prepTime: "20 minutes",
            ingredients: [
              "1/2 cup brown rice",
              "1/2 cup chickpeas, roasted",
              "1/4 cup shredded purple cabbage",
              "1/4 cup grated carrots",
              "1/2 avocado, sliced",
              "2 tbsp tahini",
              "1 tbsp lemon juice",
              "1 tsp maple syrup",
              "1 clove garlic, minced",
            ],
            instructions: [
              "Cook brown rice according to package directions",
              "Roast chickpeas with spices at 400°F for 15 minutes",
              "Prepare vegetables and arrange in bowl over rice",
              "Whisk tahini, lemon juice, maple syrup, and garlic",
              "Drizzle dressing over bowl",
              "Top with avocado slices",
            ],
            nutrition: { protein: 16, carbs: 58, fat: 22, fiber: 14 },
          },
          dinner: {
            name: "Lean Beef Stir-fry with Brown Rice",
            time: "7:00 PM",
            calories: 550,
            prepTime: "15 minutes",
            ingredients: [
              "4 oz lean beef sirloin, sliced thin",
              "2/3 cup cooked brown rice",
              "1 cup broccoli florets",
              "1/2 bell pepper, sliced",
              "1/4 cup snap peas",
              "2 tbsp low-sodium soy sauce",
              "1 tbsp sesame oil",
              "1 tsp fresh ginger, grated",
              "2 cloves garlic, minced",
            ],
            instructions: [
              "Heat sesame oil in wok or large pan",
              "Stir-fry beef for 2-3 minutes until browned",
              "Add garlic and ginger, cook 30 seconds",
              "Add vegetables, stir-fry for 3-4 minutes",
              "Add soy sauce and toss to combine",
              "Serve over brown rice",
            ],
            nutrition: { protein: 32, carbs: 42, fat: 16, fiber: 6 },
          },
          snacks: [
            {
              name: "Mixed Nuts and Dried Fruit",
              time: "10:30 AM",
              calories: 170,
              prepTime: "1 minute",
              ingredients: ["1 oz mixed nuts", "2 tbsp dried fruit (no sugar added)"],
              instructions: ["Combine nuts and dried fruit", "Portion into small container"],
              nutrition: { protein: 5, carbs: 16, fat: 14, fiber: 3 },
            },
            {
              name: "Cucumber Water with Mint",
              time: "4:00 PM",
              calories: 30,
              prepTime: "2 minutes",
              ingredients: ["1 cup water", "1/4 cucumber, sliced", "Fresh mint leaves"],
              instructions: ["Add cucumber and mint to water", "Let infuse for 10 minutes"],
              nutrition: { protein: 1, carbs: 7, fat: 0, fiber: 1 },
            },
          ],
        },
        healthBenefits: [
          "Leafy greens provide folate and iron",
          "Lean protein supports muscle maintenance",
          "Colorful vegetables offer antioxidants",
          "Healthy fats from nuts and seeds",
        ],
        tips: [
          "Prep smoothie ingredients in freezer bags",
          "Cook grains in batches for the week",
          "Stay hydrated with infused waters",
        ],
      },
      {
        day: "Friday",
        date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        totalCalories: 1890,
        meals: {
          breakfast: {
            name: "Protein Pancakes with Berry Compote",
            time: "8:30 AM",
            calories: 460,
            prepTime: "15 minutes",
            ingredients: [
              "2 large eggs",
              "1/2 cup oats",
              "1 scoop protein powder (vanilla)",
              "1/4 cup Greek yogurt",
              "1/2 tsp baking powder",
              "1 cup mixed berries",
              "1 tbsp maple syrup",
              "1 tsp vanilla extract",
            ],
            instructions: [
              "Blend eggs, oats, protein powder, and baking powder",
              "Cook pancakes in non-stick pan over medium heat",
              "Simmer berries with maple syrup for compote",
              "Stack pancakes and top with compote",
              "Serve with a dollop of Greek yogurt",
            ],
            nutrition: { protein: 35, carbs: 42, fat: 12, fiber: 8 },
          },
          lunch: {
            name: "Grilled Portobello and Goat Cheese Salad",
            time: "12:30 PM",
            calories: 420,
            prepTime: "12 minutes",
            ingredients: [
              "2 large portobello mushroom caps",
              "4 cups mixed greens",
              "2 oz goat cheese, crumbled",
              "1/4 cup walnuts, chopped",
              "2 tbsp balsamic vinegar",
              "2 tbsp olive oil",
              "1 tsp Dijon mustard",
              "1 pear, sliced",
            ],
            instructions: [
              "Grill portobello caps for 4-5 minutes per side",
              "Whisk balsamic, olive oil, and Dijon for dressing",
              "Slice grilled mushrooms",
              "Toss greens with dressing",
              "Top with mushrooms, goat cheese, walnuts, and pear",
            ],
            nutrition: { protein: 16, carbs: 28, fat: 28, fiber: 8 },
          },
          dinner: {
            name: "Herb-Crusted Pork Tenderloin with Sweet Potato Mash",
            time: "7:30 PM",
            calories: 640,
            prepTime: "30 minutes",
            ingredients: [
              "5 oz pork tenderloin",
              "1 large sweet potato",
              "2 tbsp fresh herbs (rosemary, thyme)",
              "2 tbsp olive oil",
              "2 tbsp almond milk",
              "1 tbsp Dijon mustard",
              "2 cups green beans",
              "Salt and pepper",
            ],
            instructions: [
              "Rub pork with herbs, mustard, salt, and pepper",
              "Sear pork in oven-safe pan, then bake at 400°F for 15 minutes",
              "Roast sweet potato until tender, then mash with almond milk",
              "Steam green beans until crisp-tender",
              "Let pork rest 5 minutes before slicing",
              "Serve with sweet potato mash and green beans",
            ],
            nutrition: { protein: 40, carbs: 35, fat: 18, fiber: 8 },
          },
          snacks: [
            {
              name: "Avocado Toast Points",
              time: "3:45 PM",
              calories: 220,
              prepTime: "5 minutes",
              ingredients: ["1 slice whole grain bread", "1/2 avocado", "1 tsp lime juice", "Red pepper flakes"],
              instructions: [
                "Toast bread and cut into triangles",
                "Mash avocado with lime",
                "Spread on toast, sprinkle with pepper flakes",
              ],
              nutrition: { protein: 6, carbs: 20, fat: 15, fiber: 8 },
            },
            {
              name: "Golden Milk Latte",
              time: "8:30 PM",
              calories: 150,
              prepTime: "5 minutes",
              ingredients: [
                "1 cup almond milk",
                "1/2 tsp turmeric",
                "1/4 tsp cinnamon",
                "1 tsp honey",
                "Pinch of black pepper",
              ],
              instructions: ["Heat almond milk with spices", "Whisk until frothy", "Sweeten with honey"],
              nutrition: { protein: 2, carbs: 20, fat: 6, fiber: 1 },
            },
          ],
        },
        healthBenefits: [
          "High protein breakfast supports metabolism",
          "Mushrooms provide B vitamins and selenium",
          "Sweet potatoes offer beta-carotene",
          "Anti-inflammatory spices in golden milk",
        ],
        tips: [
          "Make pancake batter the night before",
          "Grill extra mushrooms for meal prep",
          "Try golden milk as a relaxing evening ritual",
        ],
      },
      {
        day: "Saturday",
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        totalCalories: 1950,
        meals: {
          breakfast: {
            name: "Weekend Veggie Frittata",
            time: "9:00 AM",
            calories: 480,
            prepTime: "20 minutes",
            ingredients: [
              "6 large eggs",
              "1/4 cup milk",
              "1/2 cup cherry tomatoes, halved",
              "1/4 cup bell peppers, diced",
              "1/4 cup mushrooms, sliced",
              "2 oz feta cheese",
              "2 tbsp olive oil",
              "Fresh basil leaves",
              "Salt and pepper",
            ],
            instructions: [
              "Preheat oven to 375°F",
              "Sauté vegetables in oven-safe pan with olive oil",
              "Beat eggs with milk, salt, and pepper",
              "Pour eggs over vegetables",
              "Add feta cheese and cook on stovetop for 3 minutes",
              "Transfer to oven for 10-12 minutes until set",
              "Garnish with fresh basil",
            ],
            nutrition: { protein: 28, carbs: 12, fat: 32, fiber: 4 },
          },
          lunch: {
            name: "Asian-Style Lettuce Wraps",
            time: "1:30 PM",
            calories: 450,
            prepTime: "15 minutes",
            ingredients: [
              "4 oz ground turkey (93% lean)",
              "8 butter lettuce leaves",
              "1/4 cup water chestnuts, diced",
              "2 green onions, sliced",
              "1 tbsp sesame oil",
              "2 tbsp low-sodium soy sauce",
              "1 tbsp rice vinegar",
              "1 tsp fresh ginger, grated",
              "1 tsp sriracha sauce",
            ],
            instructions: [
              "Cook ground turkey in sesame oil until browned",
              "Add water chestnuts, ginger, and green onions",
              "Mix soy sauce, rice vinegar, and sriracha",
              "Add sauce to turkey mixture",
              "Serve in lettuce cups",
              "Garnish with additional green onions",
            ],
            nutrition: { protein: 28, carbs: 18, fat: 16, fiber: 4 },
          },
          dinner: {
            name: "Mediterranean Stuffed Bell Peppers",
            time: "7:00 PM",
            calories: 580,
            prepTime: "35 minutes",
            ingredients: [
              "2 large bell peppers, tops cut and seeded",
              "1/2 cup quinoa",
              "4 oz ground lamb (or turkey)",
              "1/4 cup pine nuts",
              "1/4 cup sun-dried tomatoes, chopped",
              "2 tbsp fresh mint",
              "2 tbsp olive oil",
              "1/4 cup feta cheese",
              "1 cup vegetable broth",
            ],
            instructions: [
              "Cook quinoa in vegetable broth",
              "Brown ground lamb in olive oil",
              "Mix cooked quinoa with lamb, pine nuts, tomatoes, mint",
              "Stuff peppers with mixture",
              "Top with feta cheese",
              "Bake at 375°F for 25-30 minutes",
              "Let rest 5 minutes before serving",
            ],
            nutrition: { protein: 32, carbs: 38, fat: 24, fiber: 8 },
          },
          snacks: [
            {
              name: "Homemade Trail Mix",
              time: "11:00 AM",
              calories: 200,
              prepTime: "2 minutes",
              ingredients: ["1 oz mixed nuts", "1 tbsp dark chocolate chips", "1 tbsp dried cranberries"],
              instructions: ["Combine all ingredients", "Store in airtight container"],
              nutrition: { protein: 6, carbs: 18, fat: 16, fiber: 4 },
            },
            {
              name: "Coconut Water with Lime",
              time: "4:30 PM",
              calories: 240,
              prepTime: "2 minutes",
              ingredients: ["1 cup coconut water", "1 tbsp lime juice", "Fresh mint"],
              instructions: ["Mix coconut water with lime juice", "Garnish with mint"],
              nutrition: { protein: 2, carbs: 12, fat: 0, fiber: 0 },
            },
          ],
        },
        healthBenefits: [
          "Eggs provide complete protein and choline",
          "Lean ground turkey is low in saturated fat",
          "Bell peppers are rich in vitamin C",
          "Coconut water provides natural electrolytes",
        ],
        tips: [
          "Make frittata ahead for easy weekend meals",
          "Prep lettuce wraps for quick lunches",
          "Stuff peppers can be made in advance and frozen",
        ],
      },
      {
        day: "Sunday",
        date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        totalCalories: 1820,
        meals: {
          breakfast: {
            name: "Chia Pudding Parfait",
            time: "8:45 AM",
            calories: 420,
            prepTime: "5 minutes (prep night before)",
            ingredients: [
              "3 tbsp chia seeds",
              "1 cup almond milk",
              "2 tbsp maple syrup",
              "1/2 tsp vanilla extract",
              "1/2 cup Greek yogurt",
              "1/4 cup granola",
              "1/2 cup mixed berries",
              "1 tbsp sliced almonds",
            ],
            instructions: [
              "Mix chia seeds, almond milk, maple syrup, and vanilla",
              "Refrigerate overnight until thick",
              "Layer chia pudding with yogurt in glass",
              "Top with granola, berries, and almonds",
              "Serve immediately",
            ],
            nutrition: { protein: 18, carbs: 48, fat: 18, fiber: 16 },
          },
          lunch: {
            name: "Roasted Vegetable and Hummus Bowl",
            time: "1:00 PM",
            calories: 460,
            prepTime: "25 minutes",
            ingredients: [
              "1 cup mixed vegetables (zucchini, eggplant, peppers)",
              "1/2 cup cooked farro",
              "1/4 cup hummus",
              "2 tbsp tahini",
              "1 tbsp lemon juice",
              "2 tbsp olive oil",
              "1/4 cup pomegranate seeds",
              "2 tbsp fresh parsley",
              "Za'atar seasoning",
            ],
            instructions: [
              "Toss vegetables with olive oil and za'atar",
              "Roast at 425°F for 20 minutes until tender",
              "Cook farro according to package directions",
              "Mix tahini with lemon juice for dressing",
              "Arrange farro and vegetables in bowl",
              "Top with hummus, pomegranate seeds, and parsley",
            ],
            nutrition: { protein: 14, carbs: 52, fat: 20, fiber: 12 },
          },
          dinner: {
            name: "Herb-Baked Chicken Thighs with Roasted Root Vegetables",
            time: "6:45 PM",
            calories: 620,
            prepTime: "40 minutes",
            ingredients: [
              "2 bone-in chicken thighs (skin removed)",
              "1 medium sweet potato, cubed",
              "2 carrots, sliced",
              "1 parsnip, sliced",
              "2 tbsp olive oil",
              "2 tbsp fresh herbs (rosemary, thyme)",
              "1 lemon, sliced",
              "2 cloves garlic, minced",
              "Salt and pepper",
            ],
            instructions: [
              "Preheat oven to 400°F",
              "Season chicken with herbs, garlic, salt, and pepper",
              "Toss vegetables with olive oil",
              "Arrange chicken and vegetables on baking sheet",
              "Top with lemon slices",
              "Bake for 35-40 minutes until chicken is cooked through",
              "Let rest 5 minutes before serving",
            ],
            nutrition: { protein: 38, carbs: 32, fat: 22, fiber: 8 },
          },
          snacks: [
            {
              name: "Matcha Latte with Oat Milk",
              time: "10:15 AM",
              calories: 120,
              prepTime: "5 minutes",
              ingredients: ["1 tsp matcha powder", "1 cup oat milk", "1 tsp honey"],
              instructions: [
                "Whisk matcha with small amount of hot water",
                "Heat oat milk and combine",
                "Sweeten with honey",
              ],
              nutrition: { protein: 3, carbs: 20, fat: 3, fiber: 2 },
            },
            {
              name: "Dark Chocolate and Almonds",
              time: "8:00 PM",
              calories: 200,
              prepTime: "1 minute",
              ingredients: ["1 oz dark chocolate (70% cacao)", "10 almonds"],
              instructions: ["Enjoy chocolate with almonds", "Savor slowly"],
              nutrition: { protein: 5, carbs: 12, fat: 16, fiber: 4 },
            },
          ],
        },
        healthBenefits: [
          "Chia seeds provide omega-3 fatty acids",
          "Colorful vegetables offer diverse antioxidants",
          "Lean protein supports muscle maintenance",
          "Dark chocolate provides flavonoids for heart health",
        ],
        tips: [
          "Prep chia pudding for the week ahead",
          "Roast vegetables in large batches",
          "End the week with a relaxing herbal tea",
        ],
      },
    ]

    setDietPlan(weeklyPlan)

    // Save to localStorage
    localStorage.setItem(`dietPlan_${user!.id}`, JSON.stringify(weeklyPlan))

    // Update user's diet plan status using persistent function
    const updatedUser = updateUserData(user!.id, {
      dietPlanGenerated: true
    })
    
    if (updatedUser) {
      setUser(updatedUser)
      localStorage.setItem("currentUser", JSON.stringify(updatedUser))
    }

    setIsGenerating(false)
  }

  const getMealIcon = (mealType: string) => {
    switch (mealType) {
      case "breakfast":
        return <Coffee className="h-5 w-5 text-orange-400" />
      case "lunch":
        return <Utensils className="h-5 w-5 text-green-400" />
      case "dinner":
        return <ChefHat className="h-5 w-5 text-purple-400" />
      default:
        return <Apple className="h-5 w-5 text-blue-400" />
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Personalized Diet Plan</h1>
            <p className="text-gray-400">AI-generated 7-day nutrition plan tailored for your health goals</p>
          </div>

          {dietPlan.length === 0 ? (
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="text-center py-12">
                <div className="mb-6">
                  <div className="p-4 bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <Salad className="h-10 w-10 text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Generate Your Diet Plan</h3>
                  <p className="text-gray-400 mb-6 max-w-md mx-auto">
                    Get a personalized 7-day meal plan with detailed recipes, ingredients, and nutritional information
                    designed specifically for your health needs.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto">
                  <div className="text-center">
                    <div className="p-3 bg-blue-600/20 rounded-lg w-fit mx-auto mb-2">
                      <Heart className="h-6 w-6 text-blue-400" />
                    </div>
                    <h4 className="font-medium text-white">Heart Healthy</h4>
                    <p className="text-gray-400 text-sm">Low sodium, omega-3 rich</p>
                  </div>
                  <div className="text-center">
                    <div className="p-3 bg-green-600/20 rounded-lg w-fit mx-auto mb-2">
                      <Shield className="h-6 w-6 text-green-400" />
                    </div>
                    <h4 className="font-medium text-white">Anti-Inflammatory</h4>
                    <p className="text-gray-400 text-sm">Antioxidant-rich foods</p>
                  </div>
                  <div className="text-center">
                    <div className="p-3 bg-purple-600/20 rounded-lg w-fit mx-auto mb-2">
                      <Zap className="h-6 w-6 text-purple-400" />
                    </div>
                    <h4 className="font-medium text-white">Energy Boosting</h4>
                    <p className="text-gray-400 text-sm">Balanced macronutrients</p>
                  </div>
                </div>

                <Button
                  onClick={generateDietPlan}
                  disabled={isGenerating}
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-lg px-8 py-3 h-auto"
                >
                  {isGenerating ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Generating Your Plan...
                    </div>
                  ) : (
                    <>
                      <ChefHat className="h-5 w-5 mr-2" />
                      Generate My Diet Plan
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Week Overview */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-400" />
                    Weekly Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">
                        {Math.round(dietPlan.reduce((sum, day) => sum + day.totalCalories, 0) / 7)}
                      </div>
                      <div className="text-gray-400 text-sm">Avg Daily Calories</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">7</div>
                      <div className="text-gray-400 text-sm">Days Planned</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">21</div>
                      <div className="text-gray-400 text-sm">Main Meals</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">14</div>
                      <div className="text-gray-400 text-sm">Healthy Snacks</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Day Selector */}
              <div className="flex flex-wrap gap-2 justify-center">
                {dietPlan.map((day, index) => (
                  <Button
                    key={index}
                    variant={selectedDay === index ? "default" : "outline"}
                    onClick={() => setSelectedDay(index)}
                    className={`${
                      selectedDay === index
                        ? "bg-blue-600 text-white"
                        : "border-gray-600 text-gray-300 hover:bg-gray-800"
                    }`}
                  >
                    {day.day}
                  </Button>
                ))}
              </div>

              {/* Selected Day Details */}
              {dietPlan[selectedDay] && (
                <div className="space-y-6">
                  {/* Day Header */}
                  <Card className="bg-gray-900 border-gray-800">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-white text-2xl">{dietPlan[selectedDay].day}</CardTitle>
                          <CardDescription className="text-lg">{dietPlan[selectedDay].date}</CardDescription>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-white">{dietPlan[selectedDay].totalCalories}</div>
                          <div className="text-gray-400 text-sm">Total Calories</div>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>

                  {/* Meals */}
                  <Tabs defaultValue="meals" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 bg-gray-800">
                      <TabsTrigger value="meals" className="text-white">
                        Meals
                      </TabsTrigger>
                      <TabsTrigger value="benefits" className="text-white">
                        Health Benefits
                      </TabsTrigger>
                      <TabsTrigger value="tips" className="text-white">
                        Daily Tips
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="meals" className="space-y-6">
                      {/* Breakfast */}
                      <Card className="bg-gray-900 border-gray-800">
                        <CardHeader>
                          <CardTitle className="text-white flex items-center gap-2">
                            {getMealIcon("breakfast")}
                            Breakfast - {dietPlan[selectedDay].meals.breakfast.name}
                          </CardTitle>
                          <div className="flex gap-4 text-sm text-gray-400">
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {dietPlan[selectedDay].meals.breakfast.time}
                            </span>
                            <span>{dietPlan[selectedDay].meals.breakfast.calories} cal</span>
                            <span>{dietPlan[selectedDay].meals.breakfast.prepTime}</span>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <h4 className="font-medium text-white mb-2">Ingredients:</h4>
                            <ul className="text-gray-300 text-sm space-y-1">
                              {dietPlan[selectedDay].meals.breakfast.ingredients.map((ingredient, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="text-green-400 mt-1">•</span>
                                  {ingredient}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-medium text-white mb-2">Instructions:</h4>
                            <ol className="text-gray-300 text-sm space-y-1">
                              {dietPlan[selectedDay].meals.breakfast.instructions.map((step, i) => (
                                <li key={i} className="flex gap-2">
                                  <span className="text-blue-400 font-medium">{i + 1}.</span>
                                  {step}
                                </li>
                              ))}
                            </ol>
                          </div>
                          <div className="grid grid-cols-4 gap-4 pt-4 border-t border-gray-800">
                            <div className="text-center">
                              <div className="text-white font-medium">
                                {dietPlan[selectedDay].meals.breakfast.nutrition.protein}g
                              </div>
                              <div className="text-gray-400 text-xs">Protein</div>
                            </div>
                            <div className="text-center">
                              <div className="text-white font-medium">
                                {dietPlan[selectedDay].meals.breakfast.nutrition.carbs}g
                              </div>
                              <div className="text-gray-400 text-xs">Carbs</div>
                            </div>
                            <div className="text-center">
                              <div className="text-white font-medium">
                                {dietPlan[selectedDay].meals.breakfast.nutrition.fat}g
                              </div>
                              <div className="text-gray-400 text-xs">Fat</div>
                            </div>
                            <div className="text-center">
                              <div className="text-white font-medium">
                                {dietPlan[selectedDay].meals.breakfast.nutrition.fiber}g
                              </div>
                              <div className="text-gray-400 text-xs">Fiber</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Lunch */}
                      <Card className="bg-gray-900 border-gray-800">
                        <CardHeader>
                          <CardTitle className="text-white flex items-center gap-2">
                            {getMealIcon("lunch")}
                            Lunch - {dietPlan[selectedDay].meals.lunch.name}
                          </CardTitle>
                          <div className="flex gap-4 text-sm text-gray-400">
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {dietPlan[selectedDay].meals.lunch.time}
                            </span>
                            <span>{dietPlan[selectedDay].meals.lunch.calories} cal</span>
                            <span>{dietPlan[selectedDay].meals.lunch.prepTime}</span>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <h4 className="font-medium text-white mb-2">Ingredients:</h4>
                            <ul className="text-gray-300 text-sm space-y-1">
                              {dietPlan[selectedDay].meals.lunch.ingredients.map((ingredient, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="text-green-400 mt-1">•</span>
                                  {ingredient}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-medium text-white mb-2">Instructions:</h4>
                            <ol className="text-gray-300 text-sm space-y-1">
                              {dietPlan[selectedDay].meals.lunch.instructions.map((step, i) => (
                                <li key={i} className="flex gap-2">
                                  <span className="text-blue-400 font-medium">{i + 1}.</span>
                                  {step}
                                </li>
                              ))}
                            </ol>
                          </div>
                          <div className="grid grid-cols-4 gap-4 pt-4 border-t border-gray-800">
                            <div className="text-center">
                              <div className="text-white font-medium">
                                {dietPlan[selectedDay].meals.lunch.nutrition.protein}g
                              </div>
                              <div className="text-gray-400 text-xs">Protein</div>
                            </div>
                            <div className="text-center">
                              <div className="text-white font-medium">
                                {dietPlan[selectedDay].meals.lunch.nutrition.carbs}g
                              </div>
                              <div className="text-gray-400 text-xs">Carbs</div>
                            </div>
                            <div className="text-center">
                              <div className="text-white font-medium">
                                {dietPlan[selectedDay].meals.lunch.nutrition.fat}g
                              </div>
                              <div className="text-gray-400 text-xs">Fat</div>
                            </div>
                            <div className="text-center">
                              <div className="text-white font-medium">
                                {dietPlan[selectedDay].meals.lunch.nutrition.fiber}g
                              </div>
                              <div className="text-gray-400 text-xs">Fiber</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Dinner */}
                      <Card className="bg-gray-900 border-gray-800">
                        <CardHeader>
                          <CardTitle className="text-white flex items-center gap-2">
                            {getMealIcon("dinner")}
                            Dinner - {dietPlan[selectedDay].meals.dinner.name}
                          </CardTitle>
                          <div className="flex gap-4 text-sm text-gray-400">
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {dietPlan[selectedDay].meals.dinner.time}
                            </span>
                            <span>{dietPlan[selectedDay].meals.dinner.calories} cal</span>
                            <span>{dietPlan[selectedDay].meals.dinner.prepTime}</span>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <h4 className="font-medium text-white mb-2">Ingredients:</h4>
                            <ul className="text-gray-300 text-sm space-y-1">
                              {dietPlan[selectedDay].meals.dinner.ingredients.map((ingredient, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="text-green-400 mt-1">•</span>
                                  {ingredient}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-medium text-white mb-2">Instructions:</h4>
                            <ol className="text-gray-300 text-sm space-y-1">
                              {dietPlan[selectedDay].meals.dinner.instructions.map((step, i) => (
                                <li key={i} className="flex gap-2">
                                  <span className="text-blue-400 font-medium">{i + 1}.</span>
                                  {step}
                                </li>
                              ))}
                            </ol>
                          </div>
                          <div className="grid grid-cols-4 gap-4 pt-4 border-t border-gray-800">
                            <div className="text-center">
                              <div className="text-white font-medium">
                                {dietPlan[selectedDay].meals.dinner.nutrition.protein}g
                              </div>
                              <div className="text-gray-400 text-xs">Protein</div>
                            </div>
                            <div className="text-center">
                              <div className="text-white font-medium">
                                {dietPlan[selectedDay].meals.dinner.nutrition.carbs}g
                              </div>
                              <div className="text-gray-400 text-xs">Carbs</div>
                            </div>
                            <div className="text-center">
                              <div className="text-white font-medium">
                                {dietPlan[selectedDay].meals.dinner.nutrition.fat}g
                              </div>
                              <div className="text-gray-400 text-xs">Fat</div>
                            </div>
                            <div className="text-center">
                              <div className="text-white font-medium">
                                {dietPlan[selectedDay].meals.dinner.nutrition.fiber}g
                              </div>
                              <div className="text-gray-400 text-xs">Fiber</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Snacks */}
                      <Card className="bg-gray-900 border-gray-800">
                        <CardHeader>
                          <CardTitle className="text-white flex items-center gap-2">
                            {getMealIcon("snacks")}
                            Healthy Snacks
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {dietPlan[selectedDay].meals.snacks.map((snack, index) => (
                            <div key={index} className="border border-gray-800 rounded-lg p-4">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-medium text-white">{snack.name}</h4>
                                <div className="text-sm text-gray-400">
                                  {snack.time} • {snack.calories} cal
                                </div>
                              </div>
                              <div className="text-gray-300 text-sm mb-2">
                                <strong>Ingredients:</strong> {snack.ingredients.join(", ")}
                              </div>
                              <div className="text-gray-300 text-sm">
                                <strong>Instructions:</strong> {snack.instructions.join(". ")}
                              </div>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="benefits" className="space-y-4">
                      <Card className="bg-gray-900 border-gray-800">
                        <CardHeader>
                          <CardTitle className="text-white flex items-center gap-2">
                            <Heart className="h-5 w-5 text-red-400" />
                            Health Benefits
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-3">
                            {dietPlan[selectedDay].healthBenefits.map((benefit, index) => (
                              <li key={index} className="flex items-start gap-3">
                                <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-300">{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="tips" className="space-y-4">
                      <Card className="bg-gray-900 border-gray-800">
                        <CardHeader>
                          <CardTitle className="text-white flex items-center gap-2">
                            <Zap className="h-5 w-5 text-yellow-400" />
                            Daily Tips
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-3">
                            {dietPlan[selectedDay].tips.map((tip, index) => (
                              <li key={index} className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                                <span className="text-gray-300">{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
