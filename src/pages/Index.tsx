import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, MapPin, Clock, Bird, Camera, Filter, X, ArrowRight, CheckCircle, Circle, Star, MessageSquare, Feather, Send, Sparkles, BotMessageSquare, Loader2, Trees, Building, Droplet, School, Sun, Leaf, Landmark, Microscope, Flower, Paw, Play, Pause, StopCircle, Copy, ListChecks, Wind, CalendarDays, Mountain, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";


// !! IMPORTANT SECURITY WARNING !!
// Do NOT use API keys directly in frontend code for production applications.
// This is for demonstration purposes ONLY.
// In a real application, this key should be kept on a secure backend server,
// and your frontend should make requests to your backend, which then calls the Gemini API.
const GEMINI_API_KEY = "AIzaSyAhgRnn_yJhbuiaQcoZMppaY8LnpItmdgI"; // User-provided API key

interface Tour {
  id: number;
  title: string;
  subtitle: string;
  time: string; // General time like "8:00 AM"
  duration: string;
  difficulty: string;
  speciesFocus: string[];
  image: string;
  category: string; // 'arboretum', 'campus'
  color: string;
  description: string;
  details: {
    meetingPoint: string;
    guide: string;
    focus: string;
    whatToBring: string[];
    keyFeatures?: string[];
    birdlifePotential?: string;
  };
  // New fields for interactive tour finder & guided experience
  seasonality: string[]; // e.g., ["Spring", "Summer", "Fall", "Winter", "All Year"]
  timeOfDayPreference: string[]; // e.g., ["Morning", "Afternoon", "Evening"]
  environmentType: string; // e.g., "Nature", "Urban", "Semi-Urban"
  route?: Array<{ name: string; instructions: string; birdsToSpot?: string[] }>; // Simplified route
  frequentBirds: string[]; // Subset of birdSpecies for this tour's checklist
}

interface BirdSpecies {
    name: string;
    scientificName: string;
    image: string;
    description: string;
    funFact: string;
    habitat: string;
}


const Index = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedTourModal, setSelectedTourModal] = useState<Tour | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  // --- Interactive Tour Finder State ---
  const [showTourFinder, setShowTourFinder] = useState(false);
  const [finderStep, setFinderStep] = useState(1);
  const [selectedSeason, setSelectedSeason] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedEnvironment, setSelectedEnvironment] = useState('');
  const [recommendedTours, setRecommendedTours] = useState<Tour[]>([]);

  // --- Active Tour State ---
  const [activeTour, setActiveTour] = useState<Tour | null>(null);
  const [showActiveTourView, setShowActiveTourView] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [currentTourStepIndex, setCurrentTourStepIndex] = useState(0);
  const [activeTourChecklist, setActiveTourChecklist] = useState<Set<string>>(new Set());

  // --- Post-Tour Summary State ---
  const [fieldNotes, setFieldNotes] = useState('');
  const [showFieldNotesModal, setShowFieldNotesModal] = useState(false);

  // --- General Checklist State ---
  const [showChecklistModal, setShowChecklistModal] = useState(false);
  const [globalCheckedBirds, setGlobalCheckedBirds] = useState(new Set());

  // --- AI Feature States ---
  const [selectedBirdForChat, setSelectedBirdForChat] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; text: string }>>([]);
  const [currentUserMessage, setCurrentUserMessage] = useState("");
  const [isAiRespondingChat, setIsAiRespondingChat] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const [selectedBirdForPoem, setSelectedBirdForPoem] = useState<string | null>(null);
  const [generatedPoem, setGeneratedPoem] = useState("");
  const [isAiGeneratingPoem, setIsAiGeneratingPoem] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);


  const tours: Tour[] = [
    {
      id: 1,
      title: "Arboretum's Natural Treasures",
      subtitle: "A Deep Dive into CSUF's Premier Birding Hotspot",
      time: "8:00 AM - 11:00 AM",
      duration: "3h",
      difficulty: "Moderate",
      speciesFocus: ["Hawks", "Owls", "Woodpeckers", "Waterfowl", "Native Songbirds"],
      image: "https://images.unsplash.com/photo-1531397959773-55159390990f?w=800",
      category: "arboretum", // Maps to "Nature"
      color: "from-green-500 to-teal-600",
      description: "Explore the 26-acre Fullerton Arboretum. Discover diverse plant collections and spot varied birdlife.",
      details: {
        meetingPoint: "Fullerton Arboretum Entrance (near Heritage House)",
        guide: "Arboretum Staff Biologist / Trained Docent",
        focus: "Identifying birds across diverse global plant collections, understanding plant-bird co-evolution.",
        whatToBring: ["Binoculars (essential)", "Field guide/app", "Water", "Comfortable shoes", "Sun hat"],
        keyFeatures: ["Woodlands", "Desert Collection", "Mediterranean Collection", "Native Meadow", "Lake & Ponds"],
      },
      seasonality: ["Spring", "Fall", "All Year"],
      timeOfDayPreference: ["Morning"],
      environmentType: "Nature",
      route: [
        { name: "Arboretum Entrance", instructions: "Meet near Heritage House. Overview of the Arboretum.", birdsToSpot: ["House Finch", "Mourning Dove"] },
        { name: "Woodlands Collection", instructions: "Explore the shaded paths. Listen for woodpeckers and songbirds.", birdsToSpot: ["Nuttall's Woodpecker", "Bewick's Wren", "Oak Titmouse"] },
        { name: "Desert Collection", instructions: "Look for hummingbirds among the cacti and agaves.", birdsToSpot: ["Anna's Hummingbird", "Costa's Hummingbird", "Verdin"] },
        { name: "Lake & Ponds", instructions: "Observe waterfowl and wading birds. Scan the edges for herons.", birdsToSpot: ["Mallard", "American Coot", "Great Blue Heron", "Snowy Egret"] },
        { name: "Native Meadow & Chaparral Hill", instructions: "Spot native sparrows and towhees in the scrub.", birdsToSpot: ["California Towhee", "Spotted Towhee", "Song Sparrow", "Wrentit"] }
      ],
      frequentBirds: ["Anna's Hummingbird", "California Scrub-Jay", "California Towhee", "House Finch", "Mourning Dove", "Mallard", "American Coot", "Red-shouldered Hawk"]
    },
    {
      id: 2,
      title: "Campus Core & Urban Adapters",
      subtitle: "Birding Amongst CSUF's Iconic Buildings",
      time: "10:00 AM / 2:00 PM",
      duration: "1.5h",
      difficulty: "Easy",
      speciesFocus: ["Mourning Doves", "Northern Mockingbirds", "House Finches", "Black Phoebes"],
      image: "https://images.unsplash.com/photo-1560439514-e960a3ef50d9?w=800",
      category: "campus", // Maps to "Urban" or "Semi-Urban"
      color: "from-sky-400 to-blue-600",
      description: "Discover avian inhabitants around CSUF landmarks like Pollak Library, Mihaylo Hall, and the TSU.",
      details: {
        meetingPoint: "Pollak Library South Entrance",
        guide: "Student Naturalist",
        focus: "Observing common campus birds and their adaptation to urban environments.",
        whatToBring: ["Binoculars", "Water", "Comfortable shoes"],
        keyFeatures: ["Pollak Library", "Mihaylo Hall (cactus garden, orange trees)", "TSU (garden amphitheater)", "Campus Quads"],
      },
      seasonality: ["All Year"],
      timeOfDayPreference: ["Morning", "Afternoon"],
      environmentType: "Urban",
      route: [
        { name: "Pollak Library", instructions: "Start at the south entrance. Observe trees and open areas nearby.", birdsToSpot: ["Mourning Dove", "House Sparrow"] },
        { name: "Mihaylo Hall", instructions: "Check the native landscaping, cactus garden, and any orange trees for activity.", birdsToSpot: ["Black Phoebe", "Lesser Goldfinch", "Anna's Hummingbird"] },
        { name: "Titan Student Union", instructions: "Explore the garden amphitheater and surrounding green spaces.", birdsToSpot: ["Northern Mockingbird", "House Finch"] },
        { name: "Central Quad", instructions: "Scan the lawns and mature trees for foraging birds.", birdsToSpot: ["American Robin", "European Starling", "Brewer's Blackbird"] }
      ],
      frequentBirds: ["Mourning Dove", "Northern Mockingbird", "House Finch", "Black Phoebe", "American Crow", "European Starling"]
    },
    {
      id: 3,
      title: "Evening Chorus at the Arboretum",
      subtitle: "Sunset Birdsong and Roosting Behaviors",
      time: "5:30 PM (Seasonal)",
      duration: "2h",
      difficulty: "Easy",
      speciesFocus: ["Owls (potential)", "Robins", "Blackbirds", "Roosting species"],
      image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800",
      category: "arboretum",
      color: "from-purple-400 to-pink-500",
      description: "Witness the beauty of birds preparing for night and possibly spot some crepuscular species as sunset approaches in the Arboretum.",
      details: {
        meetingPoint: "Arboretum Pavilion",
        guide: "Arboretum Docent",
        focus: "Identifying birds active at dusk, learning about roosting behaviors, and listening for evening calls.",
        whatToBring: ["Binoculars", "Light jacket", "Insect repellent (seasonal)"],
         keyFeatures: ["Woodlands Collection", "Open areas for sunset views", "Near water features"],
      },
      seasonality: ["Spring", "Summer", "Fall"],
      timeOfDayPreference: ["Evening"],
      environmentType: "Nature",
       route: [
        { name: "Arboretum Pavilion", instructions: "Gather as the sun begins to set. Discuss crepuscular bird activity.", birdsToSpot: ["American Robin", "Northern Mockingbird"] },
        { name: "Edge of Woodlands", instructions: "Listen for owls calling and observe birds settling in for the night.", birdsToSpot: ["Great Horned Owl (listen)", "Black-crowned Night-Heron (near water)"] },
        { name: "Open Meadow Viewpoint", instructions: "Watch for late insectivores and any aerial displays.", birdsToSpot: ["Swallows (seasonal)", "Bats (non-avian!)"] },
        { name: "Quiet Pond Stroll", instructions: "Observe any remaining waterfowl activity as light fades.", birdsToSpot: ["Mallard", "American Coot"] }
      ],
      frequentBirds: ["American Robin", "Northern Mockingbird", "Black Phoebe", "Mourning Dove", "Great Horned Owl (by sound)"]
    },
     {
      id: 4,
      title: "Sustainable Landscapes Birding",
      subtitle: "Birds Thriving in CSUF's Eco-Friendly Zones",
      time: "Afternoon (Check Schedule)",
      duration: "1.5h",
      difficulty: "Easy",
      speciesFocus: ["Native Sparrows", "Lesser Goldfinch", "Bushtit", "Pollinator-attracted birds"],
      image: "https://images.unsplash.com/photo-1615419758004-a4f335626d41?w=800",
      category: "campus",
      color: "from-lime-500 to-emerald-600",
      description: "Explore how CSUF's drought-tolerant and native plant landscaping choices benefit local bird populations around newer campus developments.",
      details: {
        meetingPoint: "Front of Visual Arts Complex",
        guide: "Campus Sustainability Intern",
        focus: "Identifying birds in native & drought-tolerant landscapes, understanding plant-insect-bird relationships.",
        whatToBring: ["Binoculars", "Notebook", "Water"],
        keyFeatures: ["Visual Arts Complex landscaping", "Mihaylo Hall native plants", "Other bioswales or eco-zones"],
      },
      seasonality: ["All Year", "Spring (for flowering/nesting)"],
      timeOfDayPreference: ["Afternoon", "Morning"],
      environmentType: "Semi-Urban",
      route: [
        { name: "Visual Arts Complex", instructions: "Examine the new drought-resistant plantings and slender trees.", birdsToSpot: ["Lesser Goldfinch", "House Finch", "Bushtit"] },
        { name: "Mihaylo Hall Eco-zones", instructions: "Observe native plant sections and any bioswales.", birdsToSpot: ["Song Sparrow", "Anna's Hummingbird"] },
        { name: "ECS Lawn & Surroundings", instructions: "Check edges and nearby trees for activity.", birdsToSpot: ["Black Phoebe", "Mourning Dove"] }
      ],
      frequentBirds: ["Lesser Goldfinch", "Anna's Hummingbird", "Bushtit", "Song Sparrow", "Black Phoebe"]
    }
  ];

  const birdSpecies: BirdSpecies[] = [
    { name: "Red-tailed Hawk", scientificName: "Buteo jamaicensis", image: "https://images.unsplash.com/photo-1530689300999-e09e32919d70?w=400", description: "Large raptor with a broad, reddish tail, often seen soaring or perched high.", funFact: "Red-tailed Hawks have incredible eyesight, about 8 times sharper than humans!", habitat: "Open country, woodlands, often seen soaring over campus or perched on tall structures." },
    { name: "Anna's Hummingbird", scientificName: "Calypte anna", image: "https://images.unsplash.com/photo-1595460004628-24f63786700e?w=400", description: "Medium-sized hummingbird with iridescent rose-pink feathers on the male's head and throat.", funFact: "Anna's Hummingbirds are the only North American hummingbird species that regularly overwinters in northern latitudes.", habitat: "Gardens, parks, and anywhere with nectar-producing flowers." },
    { name: "American Robin", scientificName: "Turdus migratorius", image: "https://images.unsplash.com/photo-1552533700-8889fcc9829b?w=400", description: "Familiar songbird with a gray back, rusty orange breast, and a cheerful song.", funFact: "While often seen on lawns tugging at earthworms, American Robins also eat a lot of fruit, especially in winter.", habitat: "Lawns, open woodlands, gardens." },
    { name: "Cooper's Hawk", scientificName: "Accipiter cooperii", image: "https://images.unsplash.com/photo-1609852649986-c5a3c1aa62f2?w=400", description: "Medium-sized hawk with a long, banded tail and relatively short, rounded wings.", funFact: "Cooper's Hawks primarily hunt other birds, ambushing them with swift, agile flight.", habitat: "Wooded areas, suburban parks." },
    { name: "Mourning Dove", scientificName: "Zenaida macroura", image: "https://images.unsplash.com/photo-1599142315884-f6f1308030e3?w=400", description: "Slender, grayish-brown dove with black spots on its wings and a long, pointed tail.", funFact: "Mourning Doves can drink brackish water, which helps them survive in arid environments.", habitat: "Open country, parks, suburban areas; very common throughout campus." },
    { name: "California Scrub-Jay", scientificName: "Aphelocoma californica", image: "https://images.unsplash.com/photo-1604828033713-94a000a7d401?w=400", description: "Blue bird with a gray back/belly and a whitish throat, known for its intelligence.", funFact: "California Scrub-Jays are known to cache thousands of acorns each fall!", habitat: "Oak woodlands, chaparral, suburban gardens; common in the Arboretum." },
    { name: "California Towhee", scientificName: "Melozone crissalis", image: "https://images.unsplash.com/photo-1628052701689-a386d6434595?w=400", description: "Plain brown, sparrow-like bird with a rusty patch under its tail.", funFact: "Masters of the 'double-scratch' feeding technique to uncover seeds and insects.", habitat: "Chaparral, dense shrubs, undergrowth in gardens." },
    { name: "House Finch", scientificName: "Haemorhous mexicanus", image: "https://images.unsplash.com/photo-1506220926022-cc5c4892f411?w=400", description: "Small finch; males have rosy red on the head and breast.", funFact: "The red coloration of male House Finches comes from pigments in their food.", habitat: "Ubiquitous in urban and suburban areas, parks, and open woods." },
    { name: "Lesser Goldfinch", scientificName: "Spinus psaltria", image: "https://images.unsplash.com/photo-1597739254919-a3c7dc0c400a?w=400", description: "Tiny finch with a bright yellow underside; males have a black cap.", funFact: "Lesser Goldfinches often feed acrobatically, hanging upside down to reach seeds.", habitat: "Open woodlands, weedy fields, gardens with seed-bearing plants." },
    { name: "Black Phoebe", scientificName: "Sayornis nigricans", image: "https://images.unsplash.com/photo-1601275205711-a2901a576270?w=400", description: "Small, dark flycatcher with a contrasting white belly; often wags its tail.", funFact: "Frequently builds mud nests under the eaves of buildings or bridges.", habitat: "Near water sources, open areas with low perches for catching insects." },
    { name: "Yellow-rumped Warbler", scientificName: "Setophaga coronata", image: "https://images.unsplash.com/photo-1518490390990-b1911a97d1d7?w=400", description: "Common winter warbler, gray or brownish with distinctive yellow patches on its rump.", funFact: "Nicknamed 'butter-butt' for their yellow rump patch.", habitat: "Abundant in winter in various habitats with trees and shrubs." },
    { name: "Song Sparrow", scientificName: "Melospiza melodia", image: "https://images.unsplash.com/photo-1517984410560-1a739b0eba26?w=400", description: "Streaked brown sparrow with a central dark spot on its breast; sings a varied, musical song.", funFact: "Song Sparrows have many regional variations in their songs, almost like local dialects.", habitat: "Dense shrubs, often near water or damp areas; found in the Arboretum and wetter landscaped parts of campus." },
    { name: "Bushtit", scientificName: "Psaltriparus minimus", image: "https://images.unsplash.com/photo-1549063296-488f767e9911?w=400", description: "Tiny, gray-brown bird with a long tail, almost always seen in active, chattering flocks.", funFact: "Bushtits build impressive hanging sock-like nests woven from spiderwebs, moss, and lichens.", habitat: "Trees and shrubs throughout campus and the Arboretum; listen for their constant high-pitched contact calls." },
    { name: "Wrentit", scientificName: "Chamaea fasciata", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Wrentit.jpg/800px-Wrentit.jpg", description: "Small, plain grayish-brown bird with a long tail often cocked upwards; more often heard than seen.", funFact: "The Wrentit's song is a series of sharp notes that accelerate into a trill, often described as a 'bouncing ball'.", habitat: "Dense chaparral and coastal scrub; found in the Arboretum's native plant areas." }
  ];

  // --- Timer Logic ---
  useEffect(() => {
    if (isTimerRunning) {
      timerIntervalRef.current = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [isTimerRunning]);

  const formatTime = (timeInSeconds: number) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;
    return `${hours > 0 ? String(hours).padStart(2, '0') + ':' : ''}${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  // --- Interactive Tour Finder Logic ---
  const handleNextFinderStep = () => {
    if (finderStep === 1 && !selectedSeason) { alert("Please select a season."); return; }
    if (finderStep === 2 && !selectedTime) { alert("Please select a time."); return; }
    if (finderStep === 3 && !selectedEnvironment) { alert("Please select an environment."); return; }
    
    if (finderStep < 3) {
      setFinderStep(finderStep + 1);
    } else {
      // Filter tours
      const filtered = tours.filter(tour =>
        tour.seasonality.includes(selectedSeason) &&
        tour.timeOfDayPreference.includes(selectedTime) &&
        tour.environmentType.toLowerCase().includes(selectedEnvironment.toLowerCase())
      );
      setRecommendedTours(filtered);
      setShowTourFinder(false); // Hide finder, show recommendations
      // setShowRecommendations(true); // You'll need a way to display these
      // For now, we'll just update activeFilter to 'recommended' if we add such a filter
      // Or display them in a dedicated section.
      // For simplicity, we can directly set the main tour list to these recommendations.
      // Or add a new filter category for "Recommended"
      // This part needs more UI thought. For now, let's log them.
      console.log("Recommended Tours:", filtered);
      if(filtered.length === 0) {
        alert("No tours match your criteria. Try broadening your search or explore all tours!");
      }
    }
  };
  
  const resetTourFinder = () => {
    setFinderStep(1);
    setSelectedSeason('');
    setSelectedTime('');
    setSelectedEnvironment('');
    setRecommendedTours([]);
    setShowTourFinder(true);
  }

  // --- Active Tour Logic ---
  const startTour = (tour: Tour) => {
    setActiveTour(tour);
    setCurrentTourStepIndex(0);
    setTimer(0);
    setIsTimerRunning(true);
    setActiveTourChecklist(new Set()); // Reset checklist for the new tour
    setShowActiveTourView(true);
    setSelectedTourModal(null); // Close the info modal
  };

  const handleActiveTourChecklistToggle = (birdName: string) => {
    setActiveTourChecklist(prev => {
      const newSet = new Set(prev);
      if (newSet.has(birdName)) {
        newSet.delete(birdName);
      } else {
        newSet.add(birdName);
      }
      return newSet;
    });
  };
  
  const generateFieldNotes = () => {
    if (!activeTour) return;
    const date = new Date().toLocaleDateString();
    const duration = formatTime(timer);
    const birdsSeen = Array.from(activeTourChecklist).join(', ') || 'None marked';

    const notes = `
CSUF Birding Field Notes
-------------------------
Date: ${date}
Tour: ${activeTour.title}
Selected Preferences:
  - Season: ${selectedSeason || 'N/A'}
  - Time: ${selectedTime || 'N/A'}
  - Environment: ${selectedEnvironment || 'N/A'}
Duration of Tour: ${duration}
Location: ${activeTour.details.meetingPoint} (and surrounding areas)
Birds Spotted: ${birdsSeen}
General Observations:
  (Add your personal notes here)

Weather Conditions: (Describe weather)
Other Wildlife Seen: (e.g., squirrels, butterflies)
-------------------------
    `;
    setFieldNotes(notes.trim());
    setShowFieldNotesModal(true);
  };

  const endTour = () => {
    setIsTimerRunning(false);
    generateFieldNotes();
    // Keep activeTour data for field notes, then clear
    // setActiveTour(null);
    // setShowActiveTourView(false); // Or keep it open to show summary before closing
  };

  const closeActiveTour = () => {
    setActiveTour(null);
    setShowActiveTourView(false);
    setTimer(0);
    setIsTimerRunning(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => alert("Field notes copied to clipboard!"))
      .catch(err => console.error("Failed to copy text: ", err));
  };


  // --- Global Checklist Logic ---
  const toggleGlobalBirdCheck = (birdName: string) => {
    setGlobalCheckedBirds(prev => {
      const newChecked = new Set(prev);
      if (newChecked.has(birdName)) {
        newChecked.delete(birdName);
      } else {
        newChecked.add(birdName);
      }
      return newChecked;
    });
  };
  
  // --- AI Call and other existing useEffects and functions ---
  const callGeminiAPI = async (promptText: string) => {
    setAiError(null);
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptText }] }],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Gemini API Error:", errorData);
        setAiError(errorData.error?.message || `API request failed with status ${response.status}`);
        return null;
      }

      const data = await response.json();
      if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]) {
        return data.candidates[0].content.parts[0].text;
      } else {
        console.error("Unexpected API response structure:", data);
        setAiError("Could not extract text from API response.");
        return null;
      }
    } catch (error: any) {
      console.error("Error calling Gemini API:", error);
      setAiError(error.message || "An unknown error occurred while contacting the AI.");
      return null;
    }
  };

  const handleSendMessage = async () => {
    if (!currentUserMessage.trim() || !selectedBirdForChat) return;

    const userMsg = { sender: 'user', text: currentUserMessage };
    setChatMessages(prev => [...prev, userMsg]);
    setCurrentUserMessage("");
    setIsAiRespondingChat(true);

    const bird = birdSpecies.find(b => b.name === selectedBirdForChat);
    if (!bird) {
        setChatMessages(prev => [...prev, { sender: 'ai', text: "Hmm, I can't seem to find that bird. Maybe try another one?" }]);
        setIsAiRespondingChat(false);
        return;
    }

    const prompt = `You are a ${bird.name} (${bird.scientificName}), a bird known for being a ${bird.description}. Your fun fact is: "${bird.funFact}". You are often found in ${bird.habitat}. A user is talking to you. Respond to their message: "${userMsg.text}". Stay in character as the bird. Be friendly, a little witty, and incorporate facts about your species (like your diet, habitat, sounds, or behavior from your description, fun fact, or habitat info) naturally into the conversation. Keep your responses relatively short, like a chat. If the user asks something you wouldn't know (like complex human affairs or things outside a bird's typical knowledge), politely say you're just a bird and don't know much about that, perhaps making a bird-related joke.`;

    const aiResponseText = await callGeminiAPI(prompt);

    if (aiResponseText) {
      setChatMessages(prev => [...prev, { sender: 'ai', text: aiResponseText }]);
    } else {
      setChatMessages(prev => [...prev, { sender: 'ai', text: "Chirp... I seem to be having trouble thinking right now. My apologies!" }]);
    }
    setIsAiRespondingChat(false);
  };

  const handleGeneratePoem = async () => {
    if (!selectedBirdForPoem) return;
    setIsAiGeneratingPoem(true);
    setGeneratedPoem("");

    const bird = birdSpecies.find(b => b.name === selectedBirdForPoem);
    if (!bird) {
        setGeneratedPoem("Could not find that bird to write a poem about. Please select one!");
        setIsAiGeneratingPoem(false);
        return;
    }
    const prompt = `Create a short, evocative, and delightful 4 to 8 line poem about the ${bird.name} (${bird.scientificName}). It is known as a ${bird.description} and a fun fact about it is: "${bird.funFact}". It lives in ${bird.habitat}. Capture its spirit and beauty in the poem.`;

    const poemText = await callGeminiAPI(prompt);

    if (poemText) {
      setGeneratedPoem(poemText);
    } else {
      setGeneratedPoem("My muse seems to have flown off... Please try again! (Perhaps there was an issue with the AI?)");
    }
    setIsAiGeneratingPoem(false);
  };
  
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);


  const filterTours = (category: string) => {
    if (category === 'all' && recommendedTours.length === 0) return tours;
    if (recommendedTours.length > 0 && category === 'all') return recommendedTours; // Show recommendations if available and 'all' is clicked
    if (recommendedTours.length > 0 && category !== 'all') return recommendedTours.filter(tour => tour.category === category);
    return tours.filter(tour => tour.category === category);
  };

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      const sections = document.querySelectorAll('[data-animate]');
      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.8) {
          section.classList.add('animate-fade-in');
        }
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  const tourCategories = [
    {id: 'all', name: 'All Tours', icon: Filter},
    {id: 'arboretum', name: 'Arboretum', icon: Trees},
    {id: 'campus', name: 'Campus Core', icon: Building},
  ];

  const seasonOptions = ["Spring", "Summer", "Fall", "Winter", "All Year"];
  const timeOptions = ["Morning", "Afternoon", "Evening"];
  const environmentOptions = ["Nature", "Semi-Urban", "Urban"];


  return (
    <div className="min-h-screen bg-white overflow-x-hidden relative">
      {/* Navigation and Hero Section (mostly unchanged from previous version) */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-xl z-50 border-b border-gray-200/80 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3 group">
              <div className="relative">
                <Bird className="h-9 w-9 text-green-600 transition-all duration-700 group-hover:scale-125 group-hover:rotate-12" />
                <div className="absolute -inset-2.5 bg-gradient-to-r from-green-100 to-blue-100 rounded-full opacity-0 group-hover:opacity-50 transition-all duration-500 blur-sm"></div>
              </div>
              <span className="text-3xl font-extralight text-gray-800 tracking-wide">Titan Bird Trails</span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              {['Finder', 'Tours', 'Species', 'AI Magic', 'Checklist', 'Contact'].map((item, index) => (
                <button
                  key={item}
                  onClick={() => {
                    if (item === 'Checklist') setShowChecklistModal(true);
                    else if (item === 'Finder') { setShowTourFinder(true); setFinderStep(1); setRecommendedTours([]);}
                    else scrollToSection(item.toLowerCase().replace(/\s+/g, '-'));
                  }}
                  className="relative text-gray-600 hover:text-green-700 transition-all duration-300 group py-2 px-1 text-base font-light"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {item}
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-green-500 to-blue-500 group-hover:w-full transition-all duration-300"></div>
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2.5 rounded-lg hover:bg-gray-100 transition-all duration-300"
            >
              <div className="space-y-1.5">
                <div className={`w-6 h-0.5 bg-gray-700 transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-[3px]' : ''}`}></div>
                <div className={`w-6 h-0.5 bg-gray-700 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></div>
                <div className={`w-6 h-0.5 bg-gray-700 transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-[3px]' : ''}`}></div>
              </div>
            </button>
          </div>

          {isMenuOpen && (
            <div className="md:hidden pt-4 pb-3 space-y-1 animate-fade-in border-t border-gray-200">
              {['Finder', 'Tours', 'Species', 'AI Magic', 'Checklist', 'Contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => {
                     if (item === 'Checklist') setShowChecklistModal(true);
                    else if (item === 'Finder') { setShowTourFinder(true); setFinderStep(1); setRecommendedTours([]); setIsMenuOpen(false);}
                    else {scrollToSection(item.toLowerCase().replace(/\s+/g, '-')); setIsMenuOpen(false);}
                  }}
                  className="block w-full text-left text-gray-700 hover:text-green-700 hover:bg-gray-50 py-2.5 px-3 rounded-md transition-all duration-300 font-light"
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div
          className="absolute inset-0 bg-gradient-to-br from-green-50/70 via-sky-50/70 to-purple-50/70"
          style={{ transform: `translateY(${scrollY * 0.3}px) scale(${1 + scrollY * 0.00015})` }}
        ></div>
        <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto">
          <div className="space-y-10 animate-fade-in">
            <div className="space-y-4">
              <h1 className="text-6xl sm:text-7xl md:text-8xl font-extralight text-gray-800 leading-tight tracking-tighter">
                <span className="inline-block animate-fade-in stagger-1">Explore CSUF's</span>
                <span className="mt-2 block text-transparent bg-gradient-to-r from-green-600 via-sky-500 to-purple-600 bg-clip-text font-light animate-fade-in stagger-2">Avian Wonders</span>
              </h1>
              <p className="text-xl sm:text-2xl text-gray-600 font-extralight max-w-2xl mx-auto leading-relaxed animate-fade-in stagger-3">
                Join guided campus birding tours & interact with nature through AI at Cal State Fullerton.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center pt-8 animate-fade-in stagger-4">
               <Button
                onClick={() => {setShowTourFinder(true); setFinderStep(1); setRecommendedTours([]);}}
                className="group bg-gradient-to-r from-green-600 to-sky-500 hover:from-green-700 hover:to-sky-600 text-white px-10 py-5 rounded-full text-lg font-light transition-all duration-500 transform hover:scale-105 hover:shadow-xl shadow-lg"
              >
                Find Your Perfect Tour <Compass className="ml-2.5 h-5 w-5" />
              </Button>
              <Button
                onClick={() => scrollToSection('tours')}
                variant="outline"
                className="group border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 hover:text-gray-800 px-10 py-5 rounded-full text-lg font-light transition-all duration-500 transform hover:scale-105 hover:shadow-lg bg-white/70 backdrop-blur-sm"
              >
                Browse All Tours
                <ArrowRight className="ml-2.5 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 animate-bounce opacity-70">
          <ChevronDown className="h-7 w-7 text-gray-500" />
        </div>
      </section>

      {/* --- Interactive Tour Finder Modal --- */}
      {showTourFinder && (
        <Dialog open={showTourFinder} onOpenChange={(isOpen) => { if(!isOpen) { setShowTourFinder(false); resetTourFinder(); }}}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-2xl font-light text-gray-800">Find Your Ideal Birding Tour</DialogTitle>
              <DialogDescription className="text-sm text-gray-500">Answer a few questions to help us suggest the best tours for you.</DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-6">
              {finderStep === 1 && (
                <div className="space-y-2">
                  <label htmlFor="season" className="text-sm font-medium text-gray-700">What season is it currently (or when do you plan to visit)?</label>
                  <Select value={selectedSeason} onValueChange={setSelectedSeason}>
                    <SelectTrigger id="season"><SelectValue placeholder="Select a season..." /></SelectTrigger>
                    <SelectContent>
                      {seasonOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              )}
              {finderStep === 2 && (
                <div className="space-y-2">
                  <label htmlFor="timeOfDay" className="text-sm font-medium text-gray-700">What time of day do you prefer for birding?</label>
                   <Select value={selectedTime} onValueChange={setSelectedTime}>
                    <SelectTrigger id="timeOfDay"><SelectValue placeholder="Select time of day..." /></SelectTrigger>
                    <SelectContent>
                       {timeOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              )}
              {finderStep === 3 && (
                 <div className="space-y-2">
                  <label htmlFor="environment" className="text-sm font-medium text-gray-700">What kind of environment are you interested in?</label>
                   <Select value={selectedEnvironment} onValueChange={setSelectedEnvironment}>
                    <SelectTrigger id="environment"><SelectValue placeholder="Select environment type..." /></SelectTrigger>
                    <SelectContent>
                      {environmentOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            <DialogFooter className="sm:justify-between">
               <Button variant="outline" onClick={() => {setShowTourFinder(false); resetTourFinder();}}>Cancel</Button>
              <Button onClick={handleNextFinderStep} className="bg-green-600 hover:bg-green-700">
                {finderStep < 3 ? "Next" : "Find Tours"} <ArrowRight className="ml-2 h-4 w-4"/>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* --- Display Recommended Tours --- */}
      {recommendedTours.length > 0 && !showTourFinder && (
        <section id="recommended-tours" className="py-20 bg-sky-50/50 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-extralight text-gray-800 mb-3">Our Recommendations For You</h2>
              <p className="text-gray-600">Based on your preferences for {selectedSeason}, {selectedTime} birding in a {selectedEnvironment.toLowerCase()} setting:</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recommendedTours.map((tour, index) => (
                 <div key={tour.id} className="group cursor-pointer" onClick={() => setSelectedTourModal(tour)} style={{ animationDelay: `${index * 100}ms` }}>
                    <Card className="overflow-hidden border-gray-200/80 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 bg-white rounded-2xl">
                        <div className="relative h-60 overflow-hidden"> <img src={tour.image} alt={tour.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" /> <div className={`absolute inset-0 bg-gradient-to-t ${tour.color} opacity-10 group-hover:opacity-20 transition-opacity duration-500`}></div> <div className="absolute top-4 right-4"> <Badge className="bg-white/80 backdrop-blur-sm text-gray-700 font-medium border-0 px-3 py-1.5 rounded-full shadow">{tour.difficulty}</Badge> </div> </div>
                        <CardContent className="p-6 space-y-3"> <div> <h3 className="text-2xl font-light text-gray-800 mb-1 group-hover:text-green-700 transition-colors duration-300">{tour.title}</h3> <p className="text-gray-500 font-light text-base">{tour.subtitle}</p> </div> <div className="flex items-center justify-between text-xs text-gray-500 pt-2"> <div className="flex items-center gap-1.5"> <Clock className="h-3.5 w-3.5" /> {tour.duration} </div> <div className="flex items-center gap-1.5"> <Bird className="h-3.5 w-3.5" /> {tour.speciesFocus.slice(0,2).join(', ')}... </div> </div> <div className="pt-3"> <Button variant="link" className="p-0 text-green-700 font-light group-hover:underline"> View Details <ArrowRight className="ml-1.5 h-4 w-4" /> </Button> </div> </CardContent>
                    </Card>
                 </div>
              ))}
            </div>
            <div className="text-center mt-12">
                <Button variant="outline" onClick={resetTourFinder}>Search Again</Button>
                <Button className="ml-4" onClick={() => {setRecommendedTours([]); scrollToSection('tours');}}>View All Tours</Button>
            </div>
          </div>
        </section>
      )}


      {/* Tours Section (conditionally render if no recommendations or finder is active) */}
      {(!showTourFinder && recommendedTours.length === 0) && (
        <section id="tours" className="py-28 sm:py-36 px-4 sm:px-6 lg:px-8 relative bg-gray-50/50" data-animate>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 sm:mb-20">
              <h2 className="text-5xl sm:text-6xl font-extralight text-gray-800 mb-5 tracking-tighter">Our Birding Tours</h2>
              <p className="text-lg text-gray-500 font-light max-w-xl mx-auto">Choose an adventure that suits your interest and schedule.</p>
              <div className="w-28 h-1 bg-gradient-to-r from-green-500 to-sky-500 mx-auto rounded-full mt-5"></div>
            </div>
            <div className="flex justify-center mb-12 sm:mb-16">
              <div className="flex bg-white p-1.5 rounded-full shadow-lg border border-gray-200/80">
                {tourCategories.map((filterCat) => (
                  <button
                    key={filterCat.id}
                    onClick={() => setActiveFilter(filterCat.id)}
                    className={`px-5 sm:px-7 py-2.5 rounded-full transition-all duration-300 text-sm font-light relative flex items-center gap-2 ${activeFilter === filterCat.id
                        ? 'bg-gray-800 text-white shadow-md transform scale-105'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                      }`}
                  >
                    <filterCat.icon className={`h-4 w-4 ${activeFilter === filterCat.id ? 'text-green-400' : 'text-gray-400'}`} />
                    {filterCat.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
              {filterTours(activeFilter).map((tour, index) => (
                <div key={tour.id} className="group cursor-pointer" onClick={() => setSelectedTourModal(tour)} style={{ animationDelay: `${index * 100}ms` }}>
                    <Card className="overflow-hidden border-gray-200/80 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 bg-white rounded-2xl">
                        <div className="relative h-60 overflow-hidden"> <img src={tour.image} alt={tour.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" /> <div className={`absolute inset-0 bg-gradient-to-t ${tour.color} opacity-10 group-hover:opacity-20 transition-opacity duration-500`}></div> <div className="absolute top-4 right-4"> <Badge className="bg-white/80 backdrop-blur-sm text-gray-700 font-medium border-0 px-3 py-1.5 rounded-full shadow">{tour.difficulty}</Badge> </div> </div>
                        <CardContent className="p-6 space-y-3"> <div> <h3 className="text-2xl font-light text-gray-800 mb-1 group-hover:text-green-700 transition-colors duration-300">{tour.title}</h3> <p className="text-gray-500 font-light text-base">{tour.subtitle}</p> </div> <div className="flex items-center justify-between text-xs text-gray-500 pt-2"> <div className="flex items-center gap-1.5"> <Clock className="h-3.5 w-3.5" /> {tour.duration} </div> <div className="flex items-center gap-1.5"> <Bird className="h-3.5 w-3.5" /> {tour.speciesFocus.slice(0,2).join(', ')}... </div> </div> <div className="pt-3"> <Button variant="link" className="p-0 text-green-700 font-light group-hover:underline"> View Details <ArrowRight className="ml-1.5 h-4 w-4" /> </Button> </div> </CardContent>
                    </Card>
                 </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Species Section (unchanged) */}
      <section id="species" className="py-28 sm:py-36 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-sky-50/50 via-green-50/30 to-yellow-50/30 relative" data-animate>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 sm:mb-20">
            <h2 className="text-5xl sm:text-6xl font-extralight text-gray-800 mb-5 tracking-tighter">Featured Species</h2>
             <p className="text-lg text-gray-500 font-light max-w-xl mx-auto">Get to know some of the fascinating birds you might encounter.</p>
            <div className="w-28 h-1 bg-gradient-to-r from-sky-500 to-green-500 mx-auto rounded-full mt-5"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
            {birdSpecies.slice(0, 8).map((bird, index) => ( 
              <div
                key={index}
                className="group relative overflow-hidden rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1.5"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <img
                  src={bird.image}
                  alt={bird.name}
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="p-5">
                  <h3 className="text-xl font-light text-gray-800 mb-1">{bird.name}</h3>
                  <p className="text-xs text-gray-400 font-light italic mb-2">{bird.scientificName}</p>
                  <p className="text-sm text-gray-600 font-light mb-3 h-16 overflow-hidden">{bird.description}</p>
                  <Button variant="link" className="p-0 text-xs text-sky-600 hover:text-sky-700 font-light" onClick={() => { setSelectedBirdForChat(bird.name); setSelectedBirdForPoem(bird.name); scrollToSection('ai-magic'); }}>
                    AI Magic <Sparkles className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
           <div className="text-center mt-16">
             <Button onClick={() => setShowChecklistModal(true)} variant="outline" className="border-gray-300 hover:border-green-500 hover:bg-green-50 text-gray-700 hover:text-green-600 px-8 py-4 rounded-full text-base font-light transition-all duration-300 transform hover:scale-105">
                View Full Bird Checklist <Bird className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
      
      {/* AI Magic Section (unchanged) */}
       <section id="ai-magic" className="py-28 sm:py-36 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50/60 via-pink-50/60 to-rose-50/60 relative" data-animate>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 sm:mb-20">
            <h2 className="text-5xl sm:text-6xl font-extralight text-gray-800 mb-4 tracking-tighter">
              AI Bird <span className="text-transparent bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500 bg-clip-text">Magic</span>
            </h2>
            <p className="text-lg text-gray-500 font-light max-w-2xl mx-auto">
              Interact with our feathered friends like never before through the power of AI!
            </p>
            <div className="w-40 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full mt-5"></div>
            {aiError && (
              <div className="mt-8 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg shadow-sm">
                <p className="font-medium text-sm">AI Assistant Error:</p>
                <p className="text-xs">{aiError} Please check your API key or network connection and try again.</p>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-8 sm:gap-12">
            <Card className="overflow-hidden border-gray-200/70 shadow-xl bg-white/90 backdrop-blur-md p-6 group hover:shadow-2xl transition-shadow duration-500 rounded-2xl">
              <CardHeader className="p-0 mb-5">
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 bg-gradient-to-tr from-sky-500 to-blue-600 rounded-lg shadow-md">
                    <MessageSquare className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-light text-gray-800">Chat with a Bird!</CardTitle>
                    <CardDescription className="text-gray-500 font-light text-sm">Select a bird and ask it anything.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="mb-4">
                  <Select onValueChange={(value) => { setSelectedBirdForChat(value); setChatMessages([]); }} value={selectedBirdForChat || ""}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a bird to chat with..." />
                    </SelectTrigger>
                    <SelectContent>
                      {birdSpecies.map(bird => (
                        <SelectItem key={bird.name} value={bird.name}>{bird.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedBirdForChat && (
                  <>
                    <ScrollArea className="h-56 w-full rounded-lg border border-gray-200 p-3 mb-3 bg-gray-50/70" ref={chatContainerRef}>
                      {chatMessages.length === 0 && (
                        <p className="text-center text-sm text-gray-500 py-4">Say hi to the {selectedBirdForChat}!</p>
                      )}
                      {chatMessages.map((msg, index) => (
                        <div key={index} className={`flex mb-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[75%] py-2 px-3.5 rounded-xl text-sm ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
                            {msg.sender === 'ai' && <BotMessageSquare className="inline-block h-3.5 w-3.5 mr-1 mb-0.5 text-sky-700" />} {msg.text}
                          </div>
                        </div>
                      ))}
                      {isAiRespondingChat && (
                        <div className="flex justify-start mb-2.5">
                          <div className="max-w-[75%] py-2 px-3.5 rounded-xl bg-gray-200 text-gray-800 rounded-bl-none flex items-center text-sm">
                            <Loader2 className="h-4 w-4 animate-spin mr-1.5 text-sky-700" /> Typing...
                          </div>
                        </div>
                      )}
                    </ScrollArea>
                    <div className="flex gap-2">
                      <Textarea
                        placeholder={`Message the ${selectedBirdForChat}...`}
                        value={currentUserMessage}
                        onChange={(e) => setCurrentUserMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                        className="flex-1 resize-none text-sm p-2.5"
                        rows={1}
                      />
                      <Button onClick={handleSendMessage} disabled={isAiRespondingChat || !currentUserMessage.trim()} className="bg-sky-600 hover:bg-sky-700 h-auto px-3.5">
                        <Send className="h-4.5 w-4.5" />
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-gray-200/70 shadow-xl bg-white/90 backdrop-blur-md p-6 group hover:shadow-2xl transition-shadow duration-500 rounded-2xl">
              <CardHeader className="p-0 mb-5">
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 bg-gradient-to-tr from-pink-500 to-rose-600 rounded-lg shadow-md">
                    <Feather className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-light text-gray-800">AI Bird Poems</CardTitle>
                    <CardDescription className="text-gray-500 font-light text-sm">Let AI craft a unique poem for your chosen bird.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row gap-3 mb-5">
                  <Select onValueChange={setSelectedBirdForPoem} value={selectedBirdForPoem || ""}>
                    <SelectTrigger className="w-full sm:flex-1">
                      <SelectValue placeholder="Select a bird for a poem..." />
                    </SelectTrigger>
                    <SelectContent>
                      {birdSpecies.map(bird => (
                        <SelectItem key={bird.name} value={bird.name}>{bird.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={handleGeneratePoem} disabled={isAiGeneratingPoem || !selectedBirdForPoem} className="w-full sm:w-auto bg-rose-500 hover:bg-rose-600 h-10 px-5">
                    {isAiGeneratingPoem ? <Loader2 className="h-5 w-5 animate-spin mr-1.5" /> : <Sparkles className="mr-1.5 h-5 w-5" />}
                    Generate Poem
                  </Button>
                </div>
                {isAiGeneratingPoem && (
                  <div className="text-center p-8 rounded-lg bg-rose-50/70 border border-rose-100">
                    <Loader2 className="h-10 w-10 animate-spin text-rose-500 mx-auto" />
                    <p className="text-gray-500 mt-2 text-sm">Crafting your poetic verse...</p>
                  </div>
                )}
                {generatedPoem && !isAiGeneratingPoem && (
                  <ScrollArea className="h-40">
                    <div className="mt-3 p-5 bg-rose-50/70 border border-rose-200 rounded-lg whitespace-pre-line font-serif text-sm text-gray-700 leading-relaxed">
                      {generatedPoem}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section (unchanged) */}
      <section id="contact" className="py-28 sm:py-36 px-4 sm:px-6 lg:px-8 bg-gray-800 text-white" data-animate>
         <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-extralight mb-5 tracking-tight">Get Involved</h2>
          <p className="text-lg text-gray-300 font-light leading-relaxed mb-10 max-w-xl mx-auto">
            Ready to explore the avian wonders of CSUF? Book a tour or reach out with your questions.
          </p>
          <div className="w-24 h-px bg-green-400 mx-auto mb-12"></div>
          <div className="space-y-8">
            <Button
              onClick={() => {
                alert("Tour booking system coming soon! Please contact us via email for now.");
                scrollToSection('contact'); 
              }}
              className="bg-gradient-to-r from-green-500 to-sky-600 hover:from-green-600 hover:to-sky-700 text-white px-10 py-5 rounded-full text-lg font-light transition-all duration-500 transform hover:scale-105 hover:shadow-xl shadow-lg"
            >
              Book a Campus Tour
            </Button>
            <div className="pt-6 space-y-1 text-gray-400 font-light">
              <p>Email: <a href="mailto:birdtours@fullerton.edu" className="hover:text-green-400 underline">birdtours@fullerton.edu</a></p>
              <p>Phone: <a href="tel:+16572782011" className="hover:text-green-400 underline">(657) 278-2011</a> (Campus Info)</p>
              <p className="text-xs mt-2">Please specify "Bird Tour Inquiry" in your communication.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer (unchanged) */}
      <footer className="py-16 px-4 sm:px-6 lg:px-8 border-t border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-6 group">
            <Bird className="h-7 w-7 text-gray-400 transition-all duration-500 group-hover:text-green-600" />
            <span className="text-gray-500 font-light text-base">CSUF Titan Bird Trails</span>
          </div>
          <p className="text-gray-400 text-xs font-light">
            © {new Date().getFullYear()} California State University, Fullerton. All Rights Reserved. <br />
            Landscape and bird information based on public CSUF resources and general ornithological knowledge. <br />
            <span className="text-red-500">GEMINI_API_KEY is for demonstration purposes only. Not for production.</span>
          </p>
        </div>
      </footer>
      

      {/* Tour Modal (for displaying tour info before starting) */}
      {selectedTourModal && (
        <Dialog open={!!selectedTourModal} onOpenChange={() => setSelectedTourModal(null)}>
          <DialogContent className="sm:max-w-2xl p-0">
             <div className="relative h-56 sm:h-64 overflow-hidden rounded-t-lg"> {/* Adjusted rounding */}
              <img
                src={selectedTourModal.image}
                alt={selectedTourModal.title}
                className="w-full h-full object-cover"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${selectedTourModal.color} opacity-25`}></div>
               <Button
                variant="ghost" size="icon"
                onClick={() => setSelectedTourModal(null)}
                className="absolute top-3 right-3 bg-white/70 hover:bg-white rounded-full text-gray-700"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
             <ScrollArea className="max-h-[60vh]"> {/* Max height for scrollable content */}
              <div className="p-6 sm:p-8 space-y-6">
                <div>
                  <h3 className="text-3xl sm:text-4xl font-light text-gray-800 mb-1.5">{selectedTourModal.title}</h3>
                  <p className="text-gray-500 font-light text-lg">{selectedTourModal.subtitle}</p>
                </div>

                <p className="text-gray-600 font-light leading-relaxed text-base">{selectedTourModal.description}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 border-t border-b border-gray-100 py-5 text-sm">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-1.5">Details</h4>
                    <ul className="space-y-1 text-gray-500 font-light">
                      <li><MapPin className="inline h-3.5 w-3.5 mr-1.5 text-gray-400" /><strong>Meet:</strong> {selectedTourModal.details.meetingPoint}</li>
                      <li><Clock className="inline h-3.5 w-3.5 mr-1.5 text-gray-400" /><strong>Time:</strong> {selectedTourModal.time} ({selectedTourModal.duration})</li>
                      <li><Star className="inline h-3.5 w-3.5 mr-1.5 text-gray-400" /><strong>Difficulty:</strong> {selectedTourModal.difficulty}</li>
                      <li><Users className="inline h-3.5 w-3.5 mr-1.5 text-gray-400" /><strong>Guide:</strong> {selectedTourModal.details.guide}</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700 mb-1.5">Focus</h4>
                    <p className="text-gray-500 font-light">{selectedTourModal.details.focus}</p>
                  </div>
                </div>
                
                {selectedTourModal.details.keyFeatures && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Key Features / Stops</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedTourModal.details.keyFeatures.map((feature: string) => (
                        <Badge key={feature} variant="secondary" className="font-light px-2.5 py-1">{feature}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Potential Species</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedTourModal.speciesFocus.map((species: string) => (
                      <Badge key={species} className="bg-green-100 text-green-800 font-light border-0 px-2.5 py-1">
                        {species}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-2">What to Bring</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-500 font-light text-sm">
                    {selectedTourModal.details.whatToBring.map((item: string) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
            </div>
            </ScrollArea>
            <DialogFooter className="p-6 border-t border-gray-100">
                <Button
                  onClick={() => startTour(selectedTourModal)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg py-3 text-base font-light transition-all duration-300"
                >
                  <Play className="mr-2 h-5 w-5" /> Start Guided Tour
                </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Active Tour View Modal */}
        {showActiveTourView && activeTour && (
            <Dialog open={showActiveTourView} onOpenChange={() => {/* Don't close on overlay click for now, use explicit close */}}>
            <DialogContent className="sm:max-w-2xl p-0 flex flex-col h-[90vh] sm:h-[85vh]">
                <DialogHeader className="p-6 border-b">
                <DialogTitle className="text-2xl font-light text-gray-800">{activeTour.title} - In Progress</DialogTitle>
                <div className="flex justify-between items-center mt-1">
                    <p className="text-lg font-semibold text-green-600">{formatTime(timer)}</p>
                    <div className="flex gap-2">
                    {!isTimerRunning ? (
                        <Button onClick={() => setIsTimerRunning(true)} size="sm" variant="outline" className="text-green-600 border-green-600 hover:bg-green-50">
                            <Play className="mr-1.5 h-4 w-4"/> Resume
                        </Button>
                    ) : (
                        <Button onClick={() => setIsTimerRunning(false)} size="sm" variant="outline" className="text-yellow-600 border-yellow-600 hover:bg-yellow-50">
                            <Pause className="mr-1.5 h-4 w-4"/> Pause
                        </Button>
                    )}
                    <Button onClick={endTour} size="sm" variant="destructive">
                        <StopCircle className="mr-1.5 h-4 w-4"/> End Tour
                    </Button>
                    </div>
                </div>
                </DialogHeader>

                <ScrollArea className="flex-1 p-6">
                <div className="space-y-6">
                    {/* Route Guidance */}
                    {activeTour.route && activeTour.route.length > 0 && (
                    <div>
                        <h4 className="text-lg font-medium text-gray-700 mb-2">
                        Current Stop ({currentTourStepIndex + 1}/{activeTour.route.length}): {activeTour.route[currentTourStepIndex].name}
                        </h4>
                        <p className="text-gray-600 text-sm leading-relaxed bg-gray-50 p-3 rounded-md border">
                        {activeTour.route[currentTourStepIndex].instructions}
                        </p>
                        {activeTour.route[currentTourStepIndex].birdsToSpot && (
                            <div className="mt-2">
                                <p className="text-xs text-gray-500 mb-1">Look out for:</p>
                                <div className="flex flex-wrap gap-1">
                                {activeTour.route[currentTourStepIndex].birdsToSpot?.map(bird => (
                                    <Badge key={bird} variant="outline" className="text-xs font-light">{bird}</Badge>
                                ))}
                                </div>
                            </div>
                        )}
                        <div className="flex justify-between mt-4">
                        <Button 
                            onClick={() => setCurrentTourStepIndex(prev => Math.max(0, prev - 1))} 
                            disabled={currentTourStepIndex === 0}
                            variant="outline" size="sm"
                        >
                            Previous Stop
                        </Button>
                        <Button 
                            onClick={() => setCurrentTourStepIndex(prev => Math.min(activeTour.route!.length - 1, prev + 1))} 
                            disabled={currentTourStepIndex === activeTour.route.length - 1}
                             size="sm" className="bg-gray-700 hover:bg-gray-800"
                        >
                            Next Stop
                        </Button>
                        </div>
                    </div>
                    )}

                    {/* In-Tour Checklist */}
                    <div>
                    <h4 className="text-lg font-medium text-gray-700 mb-2">Birds on this Tour</h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                        {activeTour.frequentBirds.map(birdName => {
                        const birdDetail = birdSpecies.find(b => b.name === birdName);
                        return (
                            <div key={birdName} 
                                className={`flex items-center justify-between p-2.5 rounded-lg transition-colors duration-200 cursor-pointer ${activeTourChecklist.has(birdName) ? 'bg-green-50 hover:bg-green-100' : 'bg-gray-50 hover:bg-gray-100'}`}
                                onClick={() => handleActiveTourChecklistToggle(birdName)}
                            >
                            <div className="flex items-center space-x-3">
                                <img src={birdDetail?.image || '/placeholder.svg'} alt={birdName} className="w-8 h-8 rounded-md object-cover"/>
                                <span className={`text-sm ${activeTourChecklist.has(birdName) ? 'text-green-700 font-medium' : 'text-gray-700'}`}>{birdName}</span>
                            </div>
                            {activeTourChecklist.has(birdName) ? <CheckCircle className="h-5 w-5 text-green-600" /> : <Circle className="h-5 w-5 text-gray-300"/>}
                            </div>
                        );
                        })}
                    </div>
                    </div>
                </div>
                </ScrollArea>
            </DialogContent>
            </Dialog>
        )}

      {/* Field Notes Modal */}
      {showFieldNotesModal && (
        <Dialog open={showFieldNotesModal} onOpenChange={(isOpen) => {
            if(!isOpen) {
                setShowFieldNotesModal(false);
                // Optionally reset active tour here if not already done
                closeActiveTour();
            }
        }}>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-light">Your Birding Field Notes</DialogTitle>
              <DialogDescription>A summary of your tour. You can copy this for your records.</DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh] my-4">
                <pre className="bg-gray-50 p-4 rounded-md text-xs leading-relaxed whitespace-pre-wrap border font-mono">
                {fieldNotes}
                </pre>
            </ScrollArea>
            <DialogFooter className="sm:justify-between">
                <Button variant="outline" onClick={() => {setShowFieldNotesModal(false); closeActiveTour();}}>Close</Button>
                <Button onClick={() => copyToClipboard(fieldNotes)} className="bg-green-600 hover:bg-green-700">
                    <Copy className="mr-2 h-4 w-4"/> Copy Notes
                </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Global Checklist Modal */}
      {showChecklistModal && (
        <Dialog open={showChecklistModal} onOpenChange={setShowChecklistModal}>
            <DialogContent className="sm:max-w-2xl p-0 flex flex-col h-[90vh] sm:h-[85vh]">
                <DialogHeader className="p-6 border-b">
                    <DialogTitle className="text-2xl sm:text-3xl font-light text-gray-800">My Birding Checklist</DialogTitle>
                    <DialogDescription className="text-gray-500 font-light mt-1 text-sm">Track your campus bird sightings</DialogDescription>
                </DialogHeader>
                 <ScrollArea className="flex-1">
                    <div className="p-6 space-y-3">
                        {birdSpecies.map((bird, index) => (
                        <div
                            key={index}
                            className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50/70 transition-all duration-200 group cursor-pointer"
                            onClick={() => toggleGlobalBirdCheck(bird.name)}
                        >
                            <button
                            className={`text-green-600 hover:scale-110 transition-transform duration-200 p-1 rounded-full ${globalCheckedBirds.has(bird.name) ? 'bg-green-100' : 'bg-gray-100 group-hover:bg-green-50'}`}
                            >
                            {globalCheckedBirds.has(bird.name) ? 
                                <CheckCircle className="h-5 w-5" /> : 
                                <Circle className="h-5 w-5 text-gray-400 group-hover:text-green-500" />
                            }
                            </button>
                            <img 
                            src={bird.image} 
                            alt={bird.name}
                            className="w-10 h-10 rounded-md object-cover shadow-sm"
                            />
                            <div className="flex-1">
                            <h4 className={`font-medium text-sm ${globalCheckedBirds.has(bird.name) ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                                {bird.name}
                            </h4>
                            <p className={`text-xs ${globalCheckedBirds.has(bird.name) ? 'text-gray-400' :'text-gray-500'}`}>{bird.scientificName}</p>
                            </div>
                            {globalCheckedBirds.has(bird.name) && <Check className="h-5 w-5 text-green-500" />}
                        </div>
                        ))}
                    </div>
                </ScrollArea>

                <div className="p-6 border-t border-gray-100 bg-gray-50/50 rounded-b-lg">
                    <div className="flex items-center space-x-3">
                        <Star className="h-5 w-5 text-yellow-500" />
                        <div>
                        <h4 className="font-medium text-gray-700 text-sm">Progress</h4>
                        <p className="text-xs text-gray-500">
                            {globalCheckedBirds.size} of {birdSpecies.length} birds spotted
                        </p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

// Placeholder for Compass icon
const Compass = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
  </svg>
);
// Placeholder for User icon if not already imported or available
const User = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  </svg>
);


export default Index;
