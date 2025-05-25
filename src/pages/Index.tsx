import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, MapPin, Clock, Bird, Camera, Filter, X, ArrowRight, CheckCircle, Circle, Star, MessageSquare, Feather, Send, Sparkles, BotMessageSquare, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"


// !! IMPORTANT SECURITY WARNING !!
// Do NOT use API keys directly in frontend code for production applications.
// This is for demonstration purposes ONLY.
// In a real application, this key should be kept on a secure backend server,
// and your frontend should make requests to your backend, which then calls the Gemini API.
const GEMINI_API_KEY = "AIzaSyAhgRnn_yJhbuiaQcoZMppaY8LnpItmdgI"; // User-provided API key

const Index = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedTour, setSelectedTour] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [showChecklist, setShowChecklist] = useState(false);
  const [checkedBirds, setCheckedBirds] = useState(new Set());
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // AI Feature States
  const [selectedBirdForChat, setSelectedBirdForChat] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [currentUserMessage, setCurrentUserMessage] = useState("");
  const [isAiRespondingChat, setIsAiRespondingChat] = useState(false);
  const chatContainerRef = useRef(null);

  const [selectedBirdForPoem, setSelectedBirdForPoem] = useState(null);
  const [generatedPoem, setGeneratedPoem] = useState("");
  const [isAiGeneratingPoem, setIsAiGeneratingPoem] = useState(false);
  
  const [aiError, setAiError] = useState(null);


  const tours = [
    {
      id: 1,
      title: "Morning Birds",
      subtitle: "Arboretum Dawn",
      time: "7:00 AM",
      duration: "2h",
      difficulty: "Easy",
      species: ["Red-tailed Hawk", "Anna's Hummingbird", "American Robin"],
      image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=800",
      category: "morning",
      color: "from-amber-400 to-orange-500",
      description: "Experience the tranquility of dawn in the Arboretum and witness the early morning activities of various bird species. Ideal for beginners and early risers.",
      details: {
        meetingPoint: "Arboretum Entrance",
        guide: "Dr. Emily Carter",
        focus: "Identifying common local birds by sight and sound, understanding morning bird behaviors.",
        whatToBring: ["Binoculars", "Water bottle", "Comfortable walking shoes", "Light jacket"]
      }
    },
    {
      id: 2,
      title: "Campus Central",
      subtitle: "Urban Wildlife",
      time: "2:00 PM",
      duration: "2h",
      difficulty: "Moderate",
      species: ["Cooper's Hawk", "Mourning Dove", "Western Bluebird"],
      image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800",
      category: "afternoon",
      color: "from-blue-400 to-indigo-500",
      description: "Explore the surprising biodiversity in the heart of the campus. This tour focuses on birds adapted to urban environments.",
      details: {
        meetingPoint: "University Library Fountain",
        guide: "Prof. Alex Chen",
        focus: "Observing raptors, identifying common campus birds, and learning about urban bird ecology.",
        whatToBring: ["Binoculars", "Sunscreen", "Hat", "Water bottle"]
      }
    },
    {
      id: 3,
      title: "Evening Migration",
      subtitle: "Sunset Flight",
      time: "5:30 PM",
      duration: "2h",
      difficulty: "Easy",
      species: ["Great Blue Heron", "Red-winged Blackbird"],
      image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800",
      category: "evening",
      color: "from-purple-400 to-pink-500",
      description: "Witness the beauty of birds preparing for the night and possibly spot some migratory species during sunset.",
      details: {
        meetingPoint: "Titan Stadium West Entrance",
        guide: "Jessica Miller",
        focus: "Identifying birds active during dusk, learning about roosting behaviors and migratory patterns.",
        whatToBring: ["Binoculars", "Camera", "Warm layer", "Insect repellent"]
      }
    }
  ];

  const birdSpecies = [
    { name: "Red-tailed Hawk", image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=400", description: "Large raptor with distinctive red tail", funFact: "Red-tailed Hawks have incredible eyesight, about 8 times sharper than humans!" },
    { name: "Anna's Hummingbird", image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=400", description: "Iridescent green bird with rapid wing beats", funFact: "Anna's Hummingbirds can fly backwards and even upside down for short periods!" },
    { name: "American Robin", image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400", description: "Orange-breasted songbird, common year-round", funFact: "American Robins are often a sign of spring, but many stay in their northern territories year-round." },
    { name: "Cooper's Hawk", image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=400", description: "Medium-sized hawk with rounded wings", funFact: "Cooper's Hawks are skilled hunters, often ambushing smaller birds in dense vegetation." },
    { name: "Mourning Dove", image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=400", description: "Gentle gray dove with soft cooing call", funFact: "The cooing sound of a Mourning Dove is often mistaken for an owl." },
    { name: "Western Bluebird", image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400", description: "Brilliant blue bird with orange breast", funFact: "Western Bluebirds often nest in tree cavities or birdhouses." }
  ];

  const callGeminiAPI = async (promptText) => {
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
        throw new Error(errorData.error?.message || `API request failed with status ${response.status}`);
      }

      const data = await response.json();
      if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]) {
        return data.candidates[0].content.parts[0].text;
      } else {
        console.error("Unexpected API response structure:", data);
        throw new Error("Could not extract text from API response.");
      }
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      setAiError(error.message);
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
    const prompt = `You are a ${bird.name}, a bird known for being a ${bird.description}. A user is talking to you. Respond to their message: "${userMsg.text}". Stay in character as the bird. Be friendly, a little witty, and incorporate facts about your species (like your diet, habitat, sounds, or behavior) naturally into the conversation. Keep your responses relatively short, like a chat. If the user asks something you wouldn't know (like complex human affairs), politely say you're just a bird and don't know much about that.`;
    
    const aiResponseText = await callGeminiAPI(prompt);

    if (aiResponseText) {
      setChatMessages(prev => [...prev, { sender: 'ai', text: aiResponseText }]);
    } else {
      setChatMessages(prev => [...prev, { sender: 'ai', text: "Chirp... I seem to be having trouble thinking right now. Try again in a moment!" }]);
    }
    setIsAiRespondingChat(false);
  };

  const handleGeneratePoem = async () => {
    if (!selectedBirdForPoem) return;
    setIsAiGeneratingPoem(true);
    setGeneratedPoem("");
    
    const bird = birdSpecies.find(b => b.name === selectedBirdForPoem);
    const prompt = `Create a short, evocative, and delightful 4 to 8 line poem about the ${bird.name}, which is known as a ${bird.description}. Capture its spirit and beauty.`;
    
    const poemText = await callGeminiAPI(prompt);

    if (poemText) {
      setGeneratedPoem(poemText);
    } else {
      setGeneratedPoem("My muse seems to have flown off... Please try again!");
    }
    setIsAiGeneratingPoem(false);
  };
  
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);


  const filterTours = (category) => {
    if (category === 'all') return tours;
    return tours.filter(tour => tour.category === category);
  };

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const toggleBirdCheck = (birdName) => {
    const newChecked = new Set(checkedBirds);
    if (newChecked.has(birdName)) {
      newChecked.delete(birdName);
    } else {
      newChecked.add(birdName);
    }
    setCheckedBirds(newChecked);
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

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-hidden relative">
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Floating elements... */}
      </div>

      <nav className="fixed top-0 w-full bg-white/70 backdrop-blur-2xl z-50 border-b border-white/20 shadow-lg shadow-black/5">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4 group">
              <div className="relative">
                <Bird className="h-8 w-8 text-gray-800 transition-all duration-700 group-hover:scale-125 group-hover:rotate-12" />
                <div className="absolute -inset-3 bg-gradient-to-r from-green-100 to-blue-100 rounded-full opacity-0 group-hover:opacity-40 transition-all duration-500 blur-sm"></div>
              </div>
              <span className="text-2xl font-extralight text-gray-800 tracking-wider">CSUF Birds</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-10">
              {['Tours', 'Species', 'AI Magic', 'Checklist', 'Contact'].map((item, index) => (
                <button 
                  key={item}
                  onClick={() => item === 'Checklist' ? setShowChecklist(true) : scrollToSection(item.toLowerCase().replace(/\s+/g, '-'))}
                  className="relative text-gray-600 hover:text-gray-900 transition-all duration-500 group py-2 px-1"
                  style={{animationDelay: `${index * 100}ms`}}
                >
                  {item}
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-green-500 to-blue-500 group-hover:w-full transition-all duration-500"></div>
                  <div className="absolute -inset-2 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg opacity-0 group-hover:opacity-30 transition-all duration-300"></div>
                </button>
              ))}
            </div>

            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-3 rounded-2xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all duration-500"
            >
              <div className="space-y-2">
                <div className={`w-6 h-0.5 bg-gray-600 transition-all duration-500 ${isMenuOpen ? 'rotate-45 translate-y-2.5' : ''}`}></div>
                <div className={`w-6 h-0.5 bg-gray-600 transition-all duration-500 ${isMenuOpen ? 'opacity-0 scale-0' : ''}`}></div>
                <div className={`w-6 h-0.5 bg-gray-600 transition-all duration-500 ${isMenuOpen ? '-rotate-45 -translate-y-2.5' : ''}`}></div>
              </div>
            </button>
          </div>

          {isMenuOpen && (
            <div className="md:hidden pt-6 pb-4 space-y-4 animate-fade-in">
              {['Tours', 'Species', 'AI Magic', 'Checklist', 'Contact'].map((item) => (
                <button 
                  key={item}
                  onClick={() => item === 'Checklist' ? setShowChecklist(true) : scrollToSection(item.toLowerCase().replace(/\s+/g, '-'))}
                  className="block w-full text-left text-gray-600 hover:text-gray-900 py-3 px-4 rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all duration-500"
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>
      
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Hero content... */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-green-50 via-blue-50 via-purple-50 to-white"
          style={{transform: `translateY(${scrollY * 0.4}px) scale(${1 + scrollY * 0.0002})`}}
        ></div>
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <div className="space-y-12 animate-fade-in">
            <div className="space-y-6">
              <h1 className="text-7xl md:text-9xl font-extralight text-gray-800 leading-none tracking-tighter">
                <span className="inline-block animate-fade-in stagger-1">Discover</span>
                <span className="block text-transparent bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text font-light animate-fade-in stagger-2">Birds</span>
              </h1>
              <p className="text-2xl md:text-3xl text-gray-500 font-extralight max-w-3xl mx-auto leading-relaxed animate-fade-in stagger-3">
                Guided campus tours & AI-powered bird experiences at Cal State Fullerton
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-12 animate-fade-in stagger-4">
              <Button 
                onClick={() => scrollToSection('tours')}
                className="group bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white px-12 py-6 rounded-full transition-all duration-700 transform hover:scale-110 hover:shadow-2xl shadow-lg"
              >
                Explore Tours
                <ArrowRight className="ml-3 h-5 w-5 transition-transform duration-500 group-hover:translate-x-2" />
              </Button>
               <Button 
                onClick={() => scrollToSection('ai-magic')}
                variant="outline"
                className="group border-2 border-gray-300 hover:border-purple-500 px-12 py-6 rounded-full transition-all duration-700 transform hover:scale-110 hover:shadow-xl bg-white/80 backdrop-blur-sm"
              >
                <Sparkles className="mr-3 h-5 w-5 transition-transform duration-500 group-hover:rotate-12 text-purple-500" />
                Try AI Magic
              </Button>
            </div>
          </div>
        </div>
         <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="animate-pulse">
            <ChevronDown className="h-8 w-8 text-gray-400" />
          </div>
        </div>
      </section>

      <section id="tours" className="py-40 px-6 relative" data-animate>
        {/* Tours section ... */}
         <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-7xl font-extralight text-gray-800 mb-8 tracking-tighter">Tours</h2>
            <div className="w-32 h-1 bg-gradient-to-r from-green-500 to-blue-500 mx-auto rounded-full"></div>
          </div>
          <div className="flex justify-center mb-20">
            <div className="flex bg-gradient-to-r from-gray-50 to-gray-100 p-2 rounded-full shadow-lg backdrop-blur-sm">
              {['all', 'morning', 'afternoon', 'evening'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-8 py-3 rounded-full transition-all duration-500 text-sm font-light relative overflow-hidden ${
                    activeFilter === filter 
                      ? 'bg-gradient-to-r from-white to-gray-50 text-gray-900 shadow-lg transform scale-105' 
                      : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                  }`}
                >
                  {filter === 'all' ? 'All' : filter.charAt(0).toUpperCase() + filter.slice(1)}
                  {activeFilter === filter && (
                    <div className="absolute inset-0 bg-gradient-to-r from-green-100/50 to-blue-100/50 rounded-full animate-pulse"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {filterTours(activeFilter).map((tour, index) => (
              <div 
                key={tour.id} 
                className="group cursor-pointer"
                onClick={() => setSelectedTour(tour)}
                style={{animationDelay: `${index * 200}ms`}}
              >
                <Card className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-1000 transform hover:-translate-y-8 hover:rotate-1 bg-white/90 backdrop-blur-sm">
                  <div className="relative h-72 overflow-hidden">
                    <img 
                      src={tour.image} 
                      alt={tour.title}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-125"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${tour.color} opacity-0 group-hover:opacity-30 transition-opacity duration-700`}></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    <div className="absolute top-6 right-6">
                      <Badge className="bg-white/90 backdrop-blur-sm text-gray-700 font-light border-0 px-4 py-2 rounded-full">
                        {tour.difficulty}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-10 space-y-6">
                    <div>
                      <h3 className="text-3xl font-light text-gray-800 mb-2">{tour.title}</h3>
                      <p className="text-gray-500 font-light text-lg">{tour.subtitle}</p>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {tour.duration}
                      </div>
                      <div className="flex items-center gap-2">
                        <Camera className="h-4 w-4" />
                        {tour.species.length} species
                      </div>
                    </div>
                    <div className="pt-6">
                      <div className="flex items-center justify-between group-hover:translate-x-4 transition-transform duration-500">
                        <span className="text-gray-600 font-light text-lg">View Details</span>
                        <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors duration-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="species" className="py-40 px-6 bg-gradient-to-br from-gray-50 via-green-50/30 to-blue-50/30 relative" data-animate>
        {/* Species section ... */}
         <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-7xl font-extralight text-gray-800 mb-8 tracking-tighter">Species</h2>
            <div className="w-32 h-1 bg-gradient-to-r from-green-500 to-blue-500 mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {birdSpecies.map((bird, index) => (
              <div 
                key={index} 
                className="group aspect-square relative overflow-hidden rounded-3xl bg-white shadow-lg hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-4 hover:rotate-2"
                style={{animationDelay: `${index * 150}ms`}}
              >
                <img 
                  src={bird.image} 
                  alt={bird.name}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute bottom-6 left-6 right-6 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-white font-light text-lg mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    {bird.name}
                  </h3>
                  <p className="text-white/80 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                    {bird.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Magic Section */}
      <section id="ai-magic" className="py-40 px-6 bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 relative" data-animate>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-7xl font-extralight text-gray-800 mb-4 tracking-tighter">
              AI Bird <span className="text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 bg-clip-text">Magic</span>
            </h2>
            <p className="text-xl text-gray-500 font-light max-w-2xl mx-auto">
              Interact with our feathered friends like never before through the power of AI!
            </p>
            <div className="w-48 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full mt-6"></div>
             {aiError && (
                <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
                    <p className="font-semibold">AI Error:</p>
                    <p>{aiError} Please check your API key or network and try again.</p>
                </div>
            )}
          </div>

          <div className="space-y-16">
            {/* AI Feature 1: Bird Persona Chat */}
            <Card className="overflow-hidden border-0 shadow-xl bg-white/95 backdrop-blur-md p-6 md:p-8 group hover:shadow-2xl transition-shadow duration-500">
              <CardHeader className="p-0 mb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-tr from-sky-400 to-blue-500 rounded-xl shadow-lg">
                     <MessageSquare className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl md:text-3xl font-light text-gray-800">Chat with a Bird!</CardTitle>
                    <CardDescription className="text-gray-500 font-light">Select a bird and ask it anything.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="mb-4">
                  <Select onValueChange={(value) => { setSelectedBirdForChat(value); setChatMessages([]); }} value={selectedBirdForChat || ""}>
                    <SelectTrigger className="w-full md:w-1/2">
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
                    <ScrollArea className="h-64 w-full rounded-md border p-4 mb-4 bg-gray-50" ref={chatContainerRef}>
                      {chatMessages.length === 0 && (
                        <p className="text-center text-gray-500">Say hi to the {selectedBirdForChat}!</p>
                      )}
                      {chatMessages.map((msg, index) => (
                        <div key={index} className={`flex mb-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[70%] p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
                           {msg.sender === 'ai' && <BotMessageSquare className="inline-block h-4 w-4 mr-1 mb-0.5" />} {msg.text}
                          </div>
                        </div>
                      ))}
                       {isAiRespondingChat && (
                        <div className="flex justify-start mb-3">
                           <div className="max-w-[70%] p-3 rounded-2xl bg-gray-200 text-gray-800 rounded-bl-none flex items-center">
                            <Loader2 className="h-5 w-5 animate-spin mr-2" /> Typing...
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
                        className="flex-1 resize-none"
                        rows={1}
                      />
                      <Button onClick={handleSendMessage} disabled={isAiRespondingChat || !currentUserMessage.trim()} className="bg-blue-500 hover:bg-blue-600 h-auto px-4">
                        <Send className="h-5 w-5" />
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* AI Feature 2: Bird Poem Generator */}
            <Card className="overflow-hidden border-0 shadow-xl bg-white/95 backdrop-blur-md p-6 md:p-8 group hover:shadow-2xl transition-shadow duration-500">
               <CardHeader className="p-0 mb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-tr from-pink-400 to-rose-500 rounded-xl shadow-lg">
                     <Feather className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl md:text-3xl font-light text-gray-800">AI Bird Poems</CardTitle>
                    <CardDescription className="text-gray-500 font-light">Let AI craft a unique poem for your chosen bird.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
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
                  <Button onClick={handleGeneratePoem} disabled={isAiGeneratingPoem || !selectedBirdForPoem} className="w-full sm:w-auto bg-pink-500 hover:bg-pink-600">
                    {isAiGeneratingPoem ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> :  <Sparkles className="mr-2 h-5 w-5" />}
                    Generate Poem
                  </Button>
                </div>
                 {isAiGeneratingPoem && (
                   <div className="text-center p-6">
                     <Loader2 className="h-12 w-12 animate-spin text-pink-500 mx-auto" />
                     <p className="text-gray-500 mt-2">Crafting your poem...</p>
                   </div>
                 )}
                {generatedPoem && !isAiGeneratingPoem && (
                  <div className="mt-4 p-6 bg-rose-50 border border-rose-200 rounded-lg whitespace-pre-line font-serif text-gray-700">
                    {generatedPoem}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>


      <section id="contact" className="py-40 px-6" data-animate>
        {/* Contact section ... */}
         <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-extralight text-gray-800 mb-6 tracking-tight">Contact</h2>
          <div className="w-24 h-px bg-green-500 mx-auto mb-16"></div>
          <div className="space-y-8">
            <p className="text-xl text-gray-500 font-light leading-relaxed">
              Ready to explore campus wildlife?
            </p>
            <Button className="bg-gray-900 hover:bg-gray-800 text-white px-12 py-4 rounded-full transition-all duration-500 transform hover:scale-105">
              Book a Tour
            </Button>
            <div className="pt-8 space-y-2 text-gray-400 font-light">
              <p>birdtours@fullerton.edu</p>
              <p>(657) 278-2011</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-20 px-6 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        {/* Footer ... */}
         <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-4 mb-8 group">
            <Bird className="h-8 w-8 text-gray-400 transition-all duration-700 group-hover:scale-110 group-hover:text-green-500" />
            <span className="text-gray-400 font-light text-lg">CSUF Bird Tours</span>
          </div>
          <p className="text-gray-400 text-sm font-light">
            © 2024 California State University, Fullerton
          </p>
        </div>
      </footer>
      
      {/* Tour Modal */}
      {selectedTour && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto animate-scale-in">
            <div className="relative h-64 overflow-hidden rounded-t-3xl">
              <img 
                src={selectedTour.image} 
                alt={selectedTour.title}
                className="w-full h-full object-cover"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${selectedTour.color} opacity-20`}></div>
              <button 
                onClick={() => setSelectedTour(null)}
                className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm rounded-full p-3 hover:bg-white transition-colors duration-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-8 space-y-8">
              <div>
                <h3 className="text-3xl font-light text-gray-800 mb-2">{selectedTour.title}</h3>
                <p className="text-gray-500 font-light text-lg">{selectedTour.subtitle}</p>
              </div>

              <p className="text-gray-600 font-light leading-relaxed">{selectedTour.description}</p>
              
              <div className="grid grid-cols-2 gap-6 border-t border-b border-gray-100 py-6">
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Details</h4>
                  <ul className="space-y-1 text-gray-500 font-light">
                    <li><span className="font-normal text-gray-700">Time:</span> {selectedTour.time}</li>
                    <li><span className="font-normal text-gray-700">Duration:</span> {selectedTour.duration}</li>
                    <li><span className="font-normal text-gray-700">Difficulty:</span> {selectedTour.difficulty}</li>
                    <li><span className="font-normal text-gray-700">Guide:</span> {selectedTour.details.guide}</li>
                    <li><span className="font-normal text-gray-700">Meeting Point:</span> {selectedTour.details.meetingPoint}</li>
                  </ul>
                </div>
                 <div>
                  <h4 className="font-medium text-gray-800 mb-2">Focus</h4>
                  <p className="text-gray-500 font-light">{selectedTour.details.focus}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-800 mb-3">Species You Might See</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedTour.species.map((species) => (
                    <Badge key={species} className="bg-gray-100 text-gray-700 font-light border-0 px-3 py-1">
                      {species}
                    </Badge>
                  ))}
                </div>
              </div>

               <div>
                <h4 className="font-medium text-gray-800 mb-3">What to Bring</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-500 font-light">
                  {selectedTour.details.whatToBring.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              
              <div className="flex gap-4 pt-4">
                <Button 
                  onClick={() => { setSelectedTour(null); scrollToSection('contact'); }}
                  className="flex-1 bg-gray-900 hover:bg-gray-800 text-white rounded-full py-3 transition-all duration-300"
                >
                  Book This Tour
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setSelectedTour(null)}
                  className="px-8 rounded-full border-gray-200 hover:bg-gray-50 transition-all duration-300"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Checklist Modal */}
      {showChecklist && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-lg z-50 flex items-center justify-center p-6 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in shadow-2xl">
            <div className="p-8 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-3xl font-light text-gray-800">My Birding Checklist</h3>
                  <p className="text-gray-500 font-light mt-2">Track your campus bird sightings</p>
                </div>
                <button 
                  onClick={() => setShowChecklist(false)}
                  className="bg-gray-100 hover:bg-gray-200 rounded-full p-3 transition-all duration-300 transform hover:scale-110"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-8">
              <div className="space-y-4">
                {birdSpecies.map((bird, index) => (
                  <div 
                    key={index}
                    className="flex items-center space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-all duration-300 group"
                  >
                    <button
                      onClick={() => toggleBirdCheck(bird.name)}
                      className="text-green-600 hover:scale-110 transition-transform duration-200"
                    >
                      {checkedBirds.has(bird.name) ? 
                        <CheckCircle className="h-6 w-6" /> : 
                        <Circle className="h-6 w-6" />
                      }
                    </button>
                    <img 
                      src={bird.image} 
                      alt={bird.name}
                      className="w-12 h-12 rounded-lg object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="flex-1">
                      <h4 className={`font-medium ${checkedBirds.has(bird.name) ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                        {bird.name}
                      </h4>
                      <p className="text-sm text-gray-500">{bird.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <Star className="h-6 w-6 text-yellow-500" />
                  <div>
                    <h4 className="font-medium text-gray-800">Progress</h4>
                    <p className="text-sm text-gray-600">
                      {checkedBirds.size} of {birdSpecies.length} birds spotted
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
