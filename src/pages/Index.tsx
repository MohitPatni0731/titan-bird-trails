// src/pages/Index.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronDown, MapPin, Clock, Bird, Camera, X, ArrowRight, CheckCircle, Circle, Star, MessageSquare, Feather, Send, Sparkles, BotMessageSquare, Loader2, Brain, Info, ShieldQuestion, ListChecks, PlayCircle, PauseCircle, StopCircle, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";

// !! IMPORTANT SECURITY WARNING !!
// Do NOT use API keys directly in frontend code for production applications.
// This is for demonstration purposes ONLY.
const GEMINI_API_KEY = "AIzaSyAhgRnn_yJhbuiaQcoZMppaY8LnpItmdgI"; // User-provided API key

const formatTime = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const Index = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedTourDetails, setSelectedTourDetails] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  
  const [tourSpecificChecklistBirds, setTourSpecificChecklistBirds] = useState([]);
  const [checkedBirds, setCheckedBirds] = useState(new Set());
  const [showActiveTourModal, setShowActiveTourModal] = useState(false);
  const [activeTourModalView, setActiveTourModalView] = useState('checklist'); 
  
  const [currentGuidedTour, setCurrentGuidedTour] = useState(null);
  const [isGuidedTourActive, setIsGuidedTourActive] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [tourStartTime, setTourStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerIntervalIdRef = useRef(null);

  const [selectedBirdForChat, setSelectedBirdForChat] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [currentUserMessage, setCurrentUserMessage] = useState("");
  const [isAiRespondingChat, setIsAiRespondingChat] = useState(false);
  const chatContainerRef = useRef(null);
  
  const [aiError, setAiError] = useState(null);

  const [tourPreferences, setTourPreferences] = useState("");
  const [recommendedTour, setRecommendedTour] = useState(null);
  const [isAiRecommendingTour, setIsAiRecommendingTour] = useState(false);

  const [selectedBirdForFact, setSelectedBirdForFact] = useState(null);
  const [birdFact, setBirdFact] = useState("");
  const [isAiFetchingFact, setIsAiFetchingFact] = useState(false);

  const [ethicsQuery, setEthicsQuery] = useState("");
  const [ethicsAdvice, setEthicsAdvice] = useState("");
  const [isAiAdvisingEthics, setIsAiAdvisingEthics] = useState(false);

  const tours = [
    {
      id: 1,
      title: "Arboretum Dawn Chorus",
      subtitle: "Peaceful morning birding",
      time: "7:00 AM",
      duration: "1.5h",
      difficulty: "Easy",
      species: ["American Robin", "Mourning Dove", "Anna's Hummingbird", "Western Bluebird"],
      image: "https://images.unsplash.com/photo-1530905353130-af967535a19f?w=800&auto=format&fit=crop&q=70",
      category: "morning",
      color: "from-yellow-200 to-orange-300", // Softer morning colors
      description: "Greet the day with the Arboretum's earliest singers. A gentle walk perfect for all levels, focusing on common species and bird song identification.",
      details: {
        meetingPoint: "Arboretum Main Entrance",
        guide: "Dr. Ava Chen",
        focus: "Bird song basics, identifying common garden birds, and enjoying the morning light.",
        whatToBring: ["Binoculars", "Water", "Comfortable shoes", "Notepad (optional)"]
      },
      guidedSteps: [
        { text: "Welcome! We'll start at the Arboretum entrance. Take a moment to listen – many birds are most vocal now.", locationHint: "Arboretum Entrance" },
        { text: "Let's walk towards the botanical gardens. Keep an eye out for American Robins on the lawns and Anna's Hummingbirds near nectar-rich flowers.", locationHint: "Botanical Gardens Path" },
        { text: "The mature trees here often shelter Western Bluebirds. Look for their bright blue plumage.", locationHint: "Oak Grove" },
        { text: "Near the pond, listen for the soft cooing of Mourning Doves. This is a good spot for quiet observation.", locationHint: "Arboretum Pond" },
        { text: "Our guided walk concludes here. Feel free to continue exploring or review your checklist!", locationHint: "Tour End / Pond" }
      ]
    },
    {
      id: 2,
      title: "Campus Quad Raptors",
      subtitle: "Urban hunters overhead",
      time: "2:00 PM",
      duration: "1h",
      difficulty: "Easy",
      species: ["Red-tailed Hawk", "Cooper's Hawk", "American Robin"],
      image: "https://images.unsplash.com/photo-1588392382834-a891154bca4d?w=800&auto=format&fit=crop&q=70",
      category: "afternoon",
      color: "from-sky-200 to-cyan-300",
      description: "Discover the raptors that hunt above the busy campus center. This tour focuses on identifying hawks and understanding their urban adaptations.",
      details: {
        meetingPoint: "Library Front Steps",
        guide: "Prof. Ben Miller",
        focus: "Raptor identification, observing hunting behaviors, urban bird ecology.",
        whatToBring: ["Binoculars", "Sunscreen", "Hat"]
      },
      guidedSteps: [
        { text: "We begin at the Library steps. Scan the sky and the tops of tall buildings for soaring Red-tailed Hawks.", locationHint: "Library Steps" },
        { text: "Walk through the main Quad. Cooper's Hawks are more agile and may be seen darting between trees or buildings.", locationHint: "Campus Quad" },
        { text: "The open lawns can attract American Robins, which in turn can attract hawks. Observe any interactions carefully.", locationHint: "Grassy Areas" },
        { text: "This concludes our raptor watch. Keep your eyes peeled, they can appear anywhere!", locationHint: "Tour End / Quad" }
      ]
    },
     {
      id: 3,
      title: "Sunset Wetlands Stroll",
      subtitle: "Evening bird activity",
      time: "5:30 PM",
      duration: "1.5h",
      difficulty: "Easy",
      species: ["Great Blue Heron", "Red-winged Blackbird", "Mourning Dove"],
      image: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800&auto=format&fit=crop&q=70",
      category: "evening",
      color: "from-indigo-200 to-purple-300",
      description: "A relaxing walk around the campus wetlands area as birds prepare for nightfall. Ideal for spotting herons and blackbirds.",
      details: {
        meetingPoint: "Student Rec Center Entrance",
        guide: "Jessica Lee",
        focus: "Identifying wetland birds, observing roosting behaviors, enjoying the sunset.",
        whatToBring: ["Binoculars", "Light jacket", "Insect repellent (optional)"]
      },
       guidedSteps: [
        { text: "Starting at the Rec Center, we'll head towards the campus wetlands.", locationHint: "Rec Center" },
        { text: "Listen for the calls of Red-winged Blackbirds as they settle in the reeds for the evening.", locationHint: "Wetlands Edge" },
        { text: "Patiently observe the water's edge for a Great Blue Heron, often seen hunting at dusk.", locationHint: "Pond Overlook" },
        { text: "As the sun sets, notice how bird activity changes. Mourning Doves may make their last flights of the day.", locationHint: "Sunset Viewing Spot" },
        { text: "Our evening stroll ends here. Enjoy the peaceful campus sounds.", locationHint: "Tour End / Wetlands Path" }
      ]
    }
  ];
  
  const allCampusBirds = [ 
    { name: "American Robin", image: "https://images.unsplash.com/photo-1544928140-701ef7385f9a?w=400&auto=format&fit=crop&q=60", description: "Orange-breasted songbird, often seen on lawns." },
    { name: "Mourning Dove", image: "https://images.unsplash.com/photo-1550853024-fae8cd405141?w=400&auto=format&fit=crop&q=60", description: "Gentle gray dove with a soft cooing call." },
    { name: "Anna's Hummingbird", image: "https://images.unsplash.com/photo-1518992028580-6d57bd80f2dd?w=400&auto=format&fit=crop&q=60", description: "Tiny, iridescent green bird with rapid wing beats." },
    { name: "Western Bluebird", image: "https://images.unsplash.com/photo-1606567590439-a905409286a8?w=400&auto=format&fit=crop&q=60", description: "Brilliant blue bird with an orange breast." },
    { name: "Red-tailed Hawk", image: "https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=400&auto=format&fit=crop&q=60", description: "Large raptor with a distinctive reddish-brown tail." },
    { name: "Cooper's Hawk", image: "https://images.unsplash.com/photo-1531306728370-e2ebd904bb92?w=400&auto=format&fit=crop&q=60", description: "Medium-sized hawk with rounded wings, agile hunter." },
    { name: "Great Blue Heron", image: "https://images.unsplash.com/photo-1518404869630-0ac09328786c?w=400&auto=format&fit=crop&q=60", description: "Tall, long-legged wading bird, often seen near water." },
    { name: "Red-winged Blackbird", image: "https://images.unsplash.com/photo-1590055008589-a34ba8700919?w=400&auto=format&fit=crop&q=60", description: "Black bird with striking red and yellow shoulder patches." }
  ];

  useEffect(() => {
    if (isGuidedTourActive && tourStartTime) {
      timerIntervalIdRef.current = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - tourStartTime) / 1000));
      }, 1000);
    } else {
      clearInterval(timerIntervalIdRef.current);
    }
    return () => clearInterval(timerIntervalIdRef.current);
  }, [isGuidedTourActive, tourStartTime]);

  const callGeminiAPI = async (promptText) => { /* ... (same as before) ... */ };
  const handleSendMessage = async () => { /* ... (same as before) ... */ };
  const handleRecommendTour = async () => { /* ... (same as before, ensure prompt is updated if tour descriptions change) ... */ };
  const handleFetchBirdFact = async () => { /* ... (same as before) ... */ };
  const handleGetEthicsAdvice = async () => { /* ... (same as before) ... */ };
  
  useEffect(() => {
    if (chatContainerRef.current) chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }, [chatMessages]);

  const filterTours = (category) => {
    if (category === 'all') return tours;
    return tours.filter(tour => tour.category === category);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -70; // Adjusted for nav height
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({top: y, behavior: 'smooth'});
    }
    setIsMenuOpen(false);
  };

  const openActiveTourModalWithChecklist = (tour) => {
    setSelectedTourDetails(null); 
    setCurrentGuidedTour(tour); 
    const checklistBirds = allCampusBirds.filter(bird => tour.species.includes(bird.name));
    setTourSpecificChecklistBirds(checklistBirds);
    setCheckedBirds(new Set()); 
    setActiveTourModalView('checklist');
    setShowActiveTourModal(true);
    setIsGuidedTourActive(false); 
    setElapsedTime(0);
    clearInterval(timerIntervalIdRef.current);
  };

  const startGuidedTour = () => {
    if (!currentGuidedTour) return;
    setActiveTourModalView('guide');
    setIsGuidedTourActive(true);
    setCurrentStepIndex(0);
    setTourStartTime(Date.now());
    setElapsedTime(0);
  };

  const endGuidedTour = () => {
    setIsGuidedTourActive(false);
    clearInterval(timerIntervalIdRef.current);
    setActiveTourModalView('checklist'); 
  };

  const nextStep = () => {
    if (currentGuidedTour && currentStepIndex < currentGuidedTour.guidedSteps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };
  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const toggleBirdCheck = (birdName) => {
    const newChecked = new Set(checkedBirds);
    if (newChecked.has(birdName)) newChecked.delete(birdName);
    else newChecked.add(birdName);
    setCheckedBirds(newChecked);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      const sections = document.querySelectorAll('[data-animate]');
      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.75) { // Trigger animation a bit earlier
          section.classList.add('animate-fade-in-up'); 
        }
      });
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Minimal feathers for subtle effect, if any. Can be removed if still causing lag.
  const feathers = React.useMemo(() => Array.from({ length: 4 }).map((_, i) => ({
    id: i,
    style: {
      left: `${Math.random() * 100}%`,
      animationDuration: `${Math.random() * 10 + 15}s`, 
      animationDelay: `${Math.random() * 10}s`,
      width: `${Math.random() * 5 + 5}px`, 
      height: `${Math.random() * 10 + 10}px`,
      '--direction-x': (Math.random() > 0.5 ? 0.5 : -0.5), // Slower horizontal movement
      '--direction-rot': (Math.random() > 0.5 ? 0.5 : -0.5), // Less rotation
    }
  })), []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden relative selection:bg-primary/20 dark:selection:bg-primary/30">
      {/* Subtle decorative elements - can be removed if performance is still an issue */}
      {/* <div className="aurora-background fixed inset-0 z-[-1]">
        <div></div><div></div><div></div>
      </div> */}
      {/* <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {feathers.map(feather => (
          <Feather key={feather.id} className="floating-feather text-border/30 dark:text-border/20" style={feather.style as React.CSSProperties} />
        ))}
      </div> */}

      <nav className="fixed top-0 w-full bg-background/80 dark:bg-background/80 backdrop-blur-md z-50 border-b border-border/70 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5"> {/* Reduced padding */}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2 group cursor-pointer" onClick={() => scrollToSection('hero')}>
              <div className="p-1.5 rounded-full group-hover:bg-primary/10 transition-colors">
                <Bird className="h-7 w-7 text-primary transition-all duration-300 group-hover:scale-110" />
              </div>
              <span className="text-lg font-medium text-foreground tracking-tight group-hover:text-primary transition-colors">Titan Bird Trails</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-6">
              {['Tours', 'Species', 'AI Insights', 'Contact'].map((item) => (
                <button 
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase().replace(/\s+/g, '-'))}
                  className="nav-link relative text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200 group py-1"
                >
                  {item}
                </button>
              ))}
            </div>

            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-1.5 rounded-md hover:bg-muted focus:outline-none focus:ring-1 focus:ring-primary/50"
            >
              <div className="space-y-1">
                <div className={`w-5 h-0.5 bg-foreground transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-[2.5px]' : ''}`}></div>
                <div className={`w-5 h-0.5 bg-foreground transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></div>
                <div className={`w-5 h-0.5 bg-foreground transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-[2.5px]' : ''}`}></div>
              </div>
            </button>
          </div>

          {isMenuOpen && (
            <div className="md:hidden pt-2.5 pb-1 space-y-0.5 animate-fade-in">
              {['Tours', 'Species', 'AI Insights', 'Contact'].map((item) => (
                <button 
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase().replace(/\s+/g, '-'))}
                  className="block w-full text-left text-sm text-muted-foreground hover:text-primary py-1.5 px-2 rounded-md hover:bg-muted transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>
      
      <section id="hero" className="relative min-h-[calc(100vh-70px)] sm:min-h-screen flex items-center justify-center overflow-hidden pt-[70px] hero-bg-static">
        <div className="absolute inset-0 hero-bg-image-subtle"></div>
         <div 
          className="absolute inset-0 bg-gradient-to-br from-background via-background/80 to-background/50 dark:from-background dark:via-background/90 dark:to-background/70"
        ></div>

        <div className="relative z-10 text-center px-4 sm:px-6 max-w-3xl mx-auto">
          <div className="space-y-6 sm:space-y-8">
            <div className="space-y-3 sm:space-y-4">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground leading-tight tracking-tight hero-text-reveal">
                <span className="hero-text-reveal-item">Explore CSUF's</span>
                <span className="hero-text-reveal-item block text-primary font-semibold">Avian Wonders</span>
              </h1>
              <p className="text-md sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed hero-text-reveal-item hero-text-reveal-delay-1">
                Discover diverse birdlife on campus with guided tours and intelligent AI-powered insights.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-4 sm:pt-6 hero-text-reveal-item hero-text-reveal-delay-2">
              <Button 
                onClick={() => scrollToSection('tours')}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-7 py-3 text-sm rounded-md shadow-sm hover:shadow-md transition-all"
              >
                View Tours
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
               <Button 
                onClick={() => scrollToSection('ai-insights')}
                size="lg"
                variant="outline"
                className="border-border hover:bg-accent hover:text-accent-foreground text-foreground px-7 py-3 text-sm rounded-md shadow-sm hover:shadow-md transition-all"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                AI Insights
              </Button>
            </div>
          </div>
        </div>
         <div className="absolute bottom-8 sm:bottom-10 left-1/2 transform -translate-x-1/2 animate-float-subtle">
          <ChevronDown className="h-7 w-7 text-muted-foreground/50" />
        </div>
      </section>

      <section id="tours" className="py-20 sm:py-28 px-4 sm:px-6" data-animate>
         <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-semibold text-foreground mb-3 tracking-tight">Our Guided Tours</h2>
            <div className="w-24 h-0.5 bg-primary mx-auto rounded-full"></div>
          </div>
          <div className="flex justify-center mb-10 sm:mb-12">
            <div className="flex bg-muted/50 p-1 rounded-lg shadow-xs border border-border/50">
              {['all', 'morning', 'afternoon', 'evening'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-1.5 rounded-md transition-all duration-200 text-xs sm:text-sm font-medium relative focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-primary/70 ${
                    activeFilter === filter 
                      ? 'bg-background text-primary shadow-sm' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-background/70'
                  }`}
                >
                  {filter === 'all' ? 'All Tours' : filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filterTours(activeFilter).map((tour, index) => (
              <div 
                key={tour.id} 
                className="group cursor-pointer"
                onClick={() => setSelectedTourDetails(tour)}
                style={{animationDelay: `${index * 100}ms`}}
              >
                <Card className="overflow-hidden border-border/80 shadow-md hover:shadow-lg transition-all duration-300 bg-card rounded-lg hover:-translate-y-1">
                  <div className="relative h-52 sm:h-56 overflow-hidden">
                    <img 
                      src={tour.image} 
                      alt={tour.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${tour.color} opacity-[0.07] group-hover:opacity-[0.12] transition-opacity duration-400`}></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/15 dark:from-black/25 to-transparent"></div>
                    <div className="absolute top-2.5 right-2.5">
                      <Badge variant="secondary" className="bg-background/80 text-foreground font-medium border-border/50 px-2 py-0.5 rounded text-[10px] shadow-xs">
                        {tour.difficulty}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4 sm:p-5 space-y-2.5">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-0.5 group-hover:text-primary transition-colors">{tour.title}</h3>
                      <p className="text-muted-foreground text-xs sm:text-sm font-light">{tour.subtitle}</p>
                    </div>
                    <div className="flex items-center justify-between text-[10px] sm:text-xs text-muted-foreground pt-1.5 border-t border-border/60">
                      <div className="flex items-center gap-1"> <Clock className="h-3 w-3" /> {tour.duration} </div>
                      <div className="flex items-center gap-1"> <Camera className="h-3 w-3" /> {tour.species.length} species </div>
                    </div>
                     <div className="pt-1.5">
                      <Button variant="link" className="p-0 h-auto text-xs text-primary group-hover:underline font-medium">
                        View Details <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="species" className="py-20 sm:py-28 px-4 sm:px-6 bg-muted/30 dark:bg-background" data-animate>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-semibold text-foreground mb-3 tracking-tight">Meet the Species</h2>
             <div className="w-28 h-0.5 bg-primary mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-5">
            {allCampusBirds.map((bird, index) => (
              <div 
                key={index} 
                className="group aspect-[5/6] relative overflow-hidden rounded-lg bg-card shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 border border-border/70"
                style={{animationDelay: `${index * 70}ms`}}
              >
                <img 
                  src={bird.image} 
                  alt={bird.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/15 to-transparent opacity-95 group-hover:opacity-100 transition-opacity duration-400"></div>
                <div className="absolute bottom-0 left-0 right-0 p-2.5 sm:p-3 transform translate-y-2 group-hover:translate-y-0 transition-all duration-400 opacity-0 group-hover:opacity-100">
                  <h3 className="text-white font-semibold text-xs sm:text-sm mb-0.5 truncate">
                    {bird.name}
                  </h3>
                  <p className="text-white/80 text-[10px] sm:text-xs line-clamp-2 leading-tight">
                    {bird.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="ai-insights" className="py-20 sm:py-28 px-4 sm:px-6 bg-background dark:bg-slate-900/50" data-animate>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-semibold text-foreground dark:text-gray-100 mb-2 tracking-tight">
              AI Bird <span className="text-primary">Insights</span>
            </h2>
            <p className="text-sm sm:text-md text-muted-foreground font-light max-w-md mx-auto">
              Explore birding with intelligent assistance.
            </p>
            <div className="w-28 h-0.5 bg-primary mx-auto rounded-full mt-3"></div>
             {aiError && (
                <div className="mt-5 p-3 bg-destructive/10 border border-destructive/30 text-destructive rounded-md shadow-xs text-xs">
                    <p className="font-medium">AI Feature Error:</p>
                    <p>{aiError} Please check API key/network.</p>
                </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            {[
              { icon: MessageSquare, title: "Chat with a Bird", desc: "Ask a virtual bird anything!", feature: "chat" },
              { icon: Brain, title: "Tour Guide AI", desc: "Find your perfect tour.", feature: "recommend" },
              { icon: Info, title: "Bird Fact Finder", desc: "Get a surprising fact.", feature: "fact" },
              { icon: ShieldQuestion, title: "Birding Ethics AI", desc: "Ask about responsible birding.", feature: "ethics" }
            ].map(item => (
            <Card key={item.feature} className="ai-feature-card overflow-hidden border-border/80 shadow-md bg-card backdrop-blur-md p-4 sm:p-5 group hover:shadow-lg transition-shadow duration-300 rounded-lg">
              <CardHeader className="p-0 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 bg-gradient-to-br ${
                    item.feature === 'chat' ? 'from-sky-400 to-blue-500' :
                    item.feature === 'recommend' ? 'from-orange-400 to-amber-500' :
                    item.feature === 'fact' ? 'from-lime-400 to-green-500' :
                    'from-indigo-400 to-purple-500'
                  } rounded-md shadow-sm`}>
                     <item.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-md font-semibold text-foreground">{item.title}</CardTitle>
                    <CardDescription className="text-muted-foreground font-light text-xs">{item.desc}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {item.feature === 'chat' && (
                  <>
                    <div className="mb-2.5">
                      <Select onValueChange={(value) => { setSelectedBirdForChat(value); setChatMessages([]); }} value={selectedBirdForChat || ""}>
                        <SelectTrigger className="w-full text-xs bg-background border-border/80 hover:border-primary/50 focus:ring-primary/50">
                          <SelectValue placeholder="Select a bird..." />
                        </SelectTrigger>
                        <SelectContent>
                          {allCampusBirds.map(bird => ( <SelectItem key={bird.name} value={bird.name}>{bird.name}</SelectItem> ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {selectedBirdForChat && ( <> {/* Chat UI */} </> )}
                  </>
                )}
                 {/* Simplified UI for other AI features for brevity, showing only main interaction */}
                {item.feature === 'recommend' && (
                  <div className="flex flex-col gap-2">
                    <Input type="text" placeholder="e.g., 'Easy morning walk'" value={tourPreferences} onChange={(e) => setTourPreferences(e.target.value)} className="flex-1 text-xs bg-background border-border/80 focus:border-primary/70 focus:ring-primary/70"/>
                    <Button onClick={handleRecommendTour} disabled={isAiRecommendingTour || !tourPreferences.trim()} size="sm" className="w-full text-xs bg-primary hover:bg-primary/90">
                      {isAiRecommendingTour ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> : <Sparkles className="mr-1.5 h-3.5 w-3.5" />} Find My Tour
                    </Button>
                    {isAiRecommendingTour && ( <div className="text-center p-2 text-xs text-muted-foreground"><Loader2 className="h-6 w-6 animate-spin text-primary mx-auto" /><p className="mt-1">Consulting...</p></div> )}
                    {recommendedTour && !isAiRecommendingTour && ( <div className="mt-2 p-2 bg-accent/50 border border-border/50 rounded-md text-xs text-foreground shadow-xs"> <p>{recommendedTour}</p> </div> )}
                  </div>
                )}
                {item.feature === 'fact' && (
                  <div className="flex flex-col sm:flex-row gap-2">
                     <Select onValueChange={setSelectedBirdForFact} value={selectedBirdForFact || ""}>
                        <SelectTrigger className="w-full sm:flex-1 text-xs bg-background border-border/80 hover:border-primary/50 focus:ring-primary/50">
                          <SelectValue placeholder="Select bird..." />
                        </SelectTrigger>
                        <SelectContent> {allCampusBirds.map(bird => ( <SelectItem key={bird.name} value={bird.name}>{bird.name}</SelectItem> ))} </SelectContent>
                      </Select>
                    <Button onClick={handleFetchBirdFact} disabled={isAiFetchingFact || !selectedBirdForFact} size="sm" className="w-full sm:w-auto text-xs bg-primary hover:bg-primary/90">
                      {isAiFetchingFact ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> :  <Sparkles className="mr-1.5 h-3.5 w-3.5" />} Get Fact
                    </Button>
                     {isAiFetchingFact && ( <div className="w-full text-center p-2 text-xs text-muted-foreground"><Loader2 className="h-6 w-6 animate-spin text-primary mx-auto" /><p className="mt-1">Searching...</p></div> )}
                    {birdFact && !isAiFetchingFact && ( <div className="w-full mt-2 p-2 bg-accent/50 border border-border/50 rounded-md text-xs text-foreground shadow-xs sm:col-span-2"> <p>{birdFact}</p> </div> )}
                  </div>
                )}
                {item.feature === 'ethics' && (
                  <div className="flex flex-col gap-2">
                    <Input type="text" placeholder="e.g., 'Feeding wild birds?'" value={ethicsQuery} onChange={(e) => setEthicsQuery(e.target.value)} className="flex-1 text-xs bg-background border-border/80 focus:border-primary/70 focus:ring-primary/70"/>
                    <Button onClick={handleGetEthicsAdvice} disabled={isAiAdvisingEthics || !ethicsQuery.trim()} size="sm" className="w-full text-xs bg-primary hover:bg-primary/90">
                       {isAiAdvisingEthics ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> : <Sparkles className="mr-1.5 h-3.5 w-3.5" />} Get Advice
                    </Button>
                    {isAiAdvisingEthics && ( <div className="text-center p-2 text-xs text-muted-foreground"><Loader2 className="h-6 w-6 animate-spin text-primary mx-auto" /><p className="mt-1">Consulting...</p></div> )}
                    {ethicsAdvice && !isAiAdvisingEthics && ( <div className="mt-2 p-2 bg-accent/50 border border-border/50 rounded-md text-xs text-foreground shadow-xs"> <p>{ethicsAdvice}</p> </div> )}
                  </div>
                )}
              </CardContent>
            </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="py-20 sm:py-28 px-4 sm:px-6 bg-muted/20 dark:bg-background" data-animate>
         <div className="max-w-md mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold text-foreground mb-3 tracking-tight">Ready to Explore?</h2>
          <div className="w-20 h-0.5 bg-primary mx-auto mb-8"></div>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Join us to witness the vibrant avian life on campus. Select a tour and start your adventure!
            </p>
            <Button 
              onClick={() => scrollToSection('tours')}
               size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2.5 text-sm rounded-md shadow-sm hover:shadow-md transition-all"
            >
              Explore Tours
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
            <div className="pt-4 space-y-0.5 text-muted-foreground text-xs">
              <p>Email: birdtours@fullerton.edu</p>
              <p>Phone: (657) 278-2011</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-10 sm:py-12 px-4 sm:px-6 border-t border-border/70 bg-background">
         <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4 group">
            <Bird className="h-5 w-5 text-muted-foreground/80 transition-all duration-500 group-hover:text-primary" />
            <span className="text-muted-foreground text-xs font-medium">CSUF Titan Bird Trails</span>
          </div>
          <p className="text-muted-foreground/70 text-[10px] font-light">
            © {new Date().getFullYear()} California State University, Fullerton. All Rights Reserved.
            <br />
            Dedicated to exploring and appreciating campus biodiversity.
          </p>
        </div>
      </footer>
      
      {/* Modals - Ensure styling here is also minimal and clean */}
      {selectedTourDetails && ( /* Tour Details Modal */ <></> )}
      {showActiveTourModal && currentGuidedTour && ( /* Active Tour (Checklist/Guide) Modal */ <></> )}
      {/* ... Modal JSX is the same as previous version, but will inherit new base styles ... */}

    </div>
  );
};

export default Index;
