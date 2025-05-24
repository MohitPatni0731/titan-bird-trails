
import React, { useState, useEffect } from 'react';
import { ChevronDown, MapPin, Clock, Bird, Camera, Filter, X, ArrowRight, CheckCircle, Circle, Star, Trophy, BookOpen, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Index = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedTour, setSelectedTour] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [showChecklist, setShowChecklist] = useState(false);
  const [checkedBirds, setCheckedBirds] = useState(new Set());
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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
      color: "from-amber-400 to-orange-500"
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
      color: "from-blue-400 to-indigo-500"
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
      color: "from-purple-400 to-pink-500"
    }
  ];

  const birdSpecies = [
    { name: "Red-tailed Hawk", image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=400", description: "Large raptor with distinctive red tail" },
    { name: "Anna's Hummingbird", image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=400", description: "Iridescent green bird with rapid wing beats" },
    { name: "American Robin", image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400", description: "Orange-breasted songbird, common year-round" },
    { name: "Cooper's Hawk", image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=400", description: "Medium-sized hawk with rounded wings" },
    { name: "Mourning Dove", image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=400", description: "Gentle gray dove with soft cooing call" },
    { name: "Western Bluebird", image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400", description: "Brilliant blue bird with orange breast" }
  ];

  const quizQuestions = [
    {
      question: "Which bird is known for its distinctive red tail?",
      options: ["Red-tailed Hawk", "Cooper's Hawk", "American Robin", "Mourning Dove"],
      correct: 0,
      image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=400"
    },
    {
      question: "What color is the Anna's Hummingbird primarily?",
      options: ["Red", "Blue", "Iridescent Green", "Gray"],
      correct: 2,
      image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=400"
    },
    {
      question: "Which bird has an orange breast?",
      options: ["Mourning Dove", "American Robin", "Cooper's Hawk", "Red-tailed Hawk"],
      correct: 1,
      image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400"
    }
  ];

  const filterTours = (category) => {
    if (category === 'all') return tours;
    return tours.filter(tour => tour.category === category);
  };

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const handleQuizAnswer = (selectedAnswer) => {
    if (selectedAnswer === quizQuestions[currentQuiz].correct) {
      setQuizScore(quizScore + 1);
    }
    
    if (currentQuiz < quizQuestions.length - 1) {
      setCurrentQuiz(currentQuiz + 1);
    } else {
      setTimeout(() => {
        setShowQuiz(false);
        setCurrentQuiz(0);
      }, 2000);
    }
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
      {/* Ultra-Enhanced Floating Background Elements with Advanced Tracking */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Floating animated birds */}
        <div 
          className="absolute w-8 h-8 opacity-30 transition-all duration-2000"
          style={{
            top: `${15 + mousePosition.y * 0.03}%`,
            left: `${8 + mousePosition.x * 0.02}%`,
            transform: `translate(${mousePosition.x * 0.04}px, ${mousePosition.y * 0.03}px) rotate(${mousePosition.x * 0.05}deg)`,
            animation: 'float 12s ease-in-out infinite'
          }}
        >
          <Bird className="w-full h-full text-emerald-400 animate-pulse" />
        </div>
        
        <div 
          className="absolute w-6 h-6 opacity-40 transition-all duration-1500"
          style={{
            top: `${60 + mousePosition.y * -0.02}%`,
            right: `${15 + mousePosition.x * 0.025}%`,
            transform: `translate(${mousePosition.x * -0.03}px, ${mousePosition.y * 0.02}px) rotate(${mousePosition.x * -0.03}deg)`,
            animation: 'float 10s ease-in-out infinite',
            animationDelay: '3s'
          }}
        >
          <Bird className="w-full h-full text-blue-400 animate-pulse" />
        </div>

        <div 
          className="absolute w-5 h-5 opacity-50 transition-all duration-1800"
          style={{
            bottom: `${25 + mousePosition.y * 0.025}%`,
            left: `${30 + mousePosition.x * -0.03}%`,
            transform: `translate(${mousePosition.x * 0.025}px, ${mousePosition.y * -0.02}px) rotate(${mousePosition.x * 0.04}deg)`,
            animation: 'float 14s ease-in-out infinite',
            animationDelay: '6s'
          }}
        >
          <Bird className="w-full h-full text-amber-400 animate-pulse" />
        </div>

        {/* Enhanced gradient orbs with pulsing */}
        <div 
          className="absolute top-1/4 right-1/4 w-40 h-40 bg-gradient-to-r from-emerald-200/30 to-cyan-300/30 rounded-full blur-3xl animate-pulse transition-all duration-3000"
          style={{
            transform: `scale(${1 + Math.sin(Date.now() * 0.001) * 0.1}) rotate(${scrollY * 0.05}deg)`
          }}
        ></div>
        <div 
          className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-gradient-to-r from-purple-200/25 to-pink-300/25 rounded-full blur-3xl animate-pulse transition-all duration-4000"
          style={{
            animationDelay: '2s',
            transform: `scale(${1 + Math.cos(Date.now() * 0.0008) * 0.15}) rotate(${scrollY * -0.03}deg)`
          }}
        ></div>
        
        {/* Morphing geometric shapes */}
        <div 
          className="absolute top-1/3 left-1/5 w-20 h-20 bg-gradient-to-br from-green-300/20 to-transparent rounded-full transition-all duration-5000"
          style={{
            transform: `translateY(${scrollY * -0.1}px) scale(${1 + Math.sin(scrollY * 0.01) * 0.3})`,
            borderRadius: `${50 + Math.sin(Date.now() * 0.002) * 20}%`
          }}
        ></div>
      </div>

      {/* Ultra-Enhanced Navigation with Advanced Glass Effect */}
      <nav className="fixed top-0 w-full bg-white/60 backdrop-blur-3xl z-50 border-b border-white/30 shadow-2xl shadow-black/10">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-5 group">
              <div className="relative">
                <Bird className="h-9 w-9 text-gray-800 transition-all duration-1000 group-hover:scale-150 group-hover:rotate-45" />
                <div className="absolute -inset-4 bg-gradient-to-r from-emerald-100/50 to-cyan-100/50 rounded-full opacity-0 group-hover:opacity-60 transition-all duration-700 blur-lg animate-pulse"></div>
                <div className="absolute -inset-2 bg-gradient-to-r from-emerald-200/30 to-cyan-200/30 rounded-full opacity-0 group-hover:opacity-40 transition-all duration-500 blur-sm"></div>
              </div>
              <span className="text-2xl font-extralight text-gray-800 tracking-[0.2em] group-hover:tracking-[0.3em] transition-all duration-700">CSUF Birds</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-12">
              {['Tours', 'Species', 'Quiz', 'Checklist', 'Contact'].map((item, index) => (
                <button 
                  key={item}
                  onClick={() => item === 'Quiz' ? setShowQuiz(true) : item === 'Checklist' ? setShowChecklist(true) : scrollToSection(item.toLowerCase())}
                  className="relative text-gray-600 hover:text-gray-900 transition-all duration-700 group py-3 px-2"
                  style={{animationDelay: `${index * 150}ms`}}
                >
                  <span className="relative z-10">{item}</span>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 group-hover:w-full transition-all duration-700"></div>
                  <div className="absolute -inset-3 bg-gradient-to-r from-emerald-50/50 to-cyan-50/50 rounded-xl opacity-0 group-hover:opacity-50 transition-all duration-500 blur-sm"></div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-emerald-100/20 to-cyan-100/20 rounded-lg opacity-0 group-hover:opacity-30 transition-all duration-300"></div>
                </button>
              ))}
            </div>

            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-4 rounded-2xl hover:bg-gradient-to-r hover:from-gray-50/80 hover:to-gray-100/80 transition-all duration-700 backdrop-blur-sm"
            >
              <div className="space-y-2">
                <div className={`w-7 h-0.5 bg-gray-600 transition-all duration-700 ${isMenuOpen ? 'rotate-45 translate-y-2.5' : ''}`}></div>
                <div className={`w-7 h-0.5 bg-gray-600 transition-all duration-700 ${isMenuOpen ? 'opacity-0 scale-0' : ''}`}></div>
                <div className={`w-7 h-0.5 bg-gray-600 transition-all duration-700 ${isMenuOpen ? '-rotate-45 -translate-y-2.5' : ''}`}></div>
              </div>
            </button>
          </div>

          {isMenuOpen && (
            <div className="md:hidden pt-8 pb-6 space-y-6 animate-fade-in">
              {['Tours', 'Species', 'Quiz', 'Checklist', 'Contact'].map((item, index) => (
                <button 
                  key={item}
                  onClick={() => item === 'Quiz' ? setShowQuiz(true) : item === 'Checklist' ? setShowChecklist(true) : scrollToSection(item.toLowerCase())}
                  className="block w-full text-left text-gray-600 hover:text-gray-900 py-4 px-6 rounded-2xl hover:bg-gradient-to-r hover:from-gray-50/80 hover:to-gray-100/80 transition-all duration-700 backdrop-blur-sm"
                  style={{animationDelay: `${index * 100}ms`}}
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Revolutionary Hero Section with Bird Background */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Aesthetic Bird Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1472396961693-142e6e269027?w=1920')`,
            transform: `translateY(${scrollY * 0.3}px) scale(${1 + scrollY * 0.0001})`,
            filter: 'blur(1px) brightness(1.2) contrast(1.1)'
          }}
        ></div>
        
        {/* Enhanced Gradient Overlay */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-emerald-50/90 via-cyan-50/80 via-blue-50/85 to-white/95"
          style={{transform: `translateY(${scrollY * 0.4}px) scale(${1 + scrollY * 0.0002})`}}
        ></div>
        
        {/* Ultra-Advanced Animated Background Shapes */}
        <div 
          className="absolute top-16 left-16 w-80 h-80 bg-gradient-to-r from-emerald-200/40 to-cyan-300/40 rounded-full blur-3xl animate-pulse"
          style={{
            transform: `translateY(${scrollY * -0.2}px) rotate(${scrollY * 0.1}deg) scale(${1 + Math.sin(Date.now() * 0.001) * 0.2})`,
            animation: 'float 15s ease-in-out infinite'
          }}
        ></div>
        <div 
          className="absolute bottom-16 right-16 w-96 h-96 bg-gradient-to-r from-blue-200/35 to-purple-300/35 rounded-full blur-3xl animate-pulse"
          style={{
            animationDelay: '3s',
            transform: `translateY(${scrollY * -0.3}px) rotate(${scrollY * -0.1}deg) scale(${1 + Math.cos(Date.now() * 0.0008) * 0.25})`,
            animation: 'float 18s ease-in-out infinite'
          }}
        ></div>
        
        {/* Additional Morphing Elements */}
        <div 
          className="absolute top-1/2 left-8 w-32 h-32 bg-gradient-to-br from-amber-200/30 to-orange-300/30 blur-2xl transition-all duration-3000"
          style={{
            transform: `translateY(${scrollY * -0.15}px) rotate(${Date.now() * 0.0001}deg)`,
            borderRadius: `${40 + Math.sin(Date.now() * 0.003) * 30}%`,
            animation: 'float 20s ease-in-out infinite'
          }}
        ></div>
        
        <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
          <div className="space-y-16 animate-fade-in">
            <div className="space-y-8">
              <h1 className="text-8xl md:text-[12rem] font-extralight text-gray-800 leading-none tracking-[-0.02em]">
                <span className="inline-block animate-fade-in stagger-1 hover:scale-110 transition-transform duration-1000">Discover</span>
                <span className="block text-transparent bg-gradient-to-r from-emerald-600 via-cyan-600 via-blue-600 to-purple-600 bg-clip-text font-light animate-fade-in stagger-2 hover:scale-105 transition-transform duration-1000 bg-[length:200%_200%] animate-gradient">Birds</span>
              </h1>
              <p className="text-3xl md:text-4xl text-gray-500 font-extralight max-w-4xl mx-auto leading-relaxed animate-fade-in stagger-3 hover:text-gray-600 transition-colors duration-700">
                Guided campus tours through Cal State Fullerton's natural habitats
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-8 justify-center pt-16 animate-fade-in stagger-4">
              <Button 
                onClick={() => scrollToSection('tours')}
                className="group bg-gradient-to-r from-gray-900 to-gray-800 hover:from-emerald-800 hover:to-cyan-800 text-white px-16 py-8 rounded-full transition-all duration-1000 transform hover:scale-125 hover:shadow-3xl shadow-2xl hover:rotate-1"
              >
                <span className="relative z-10">Explore Tours</span>
                <ArrowRight className="ml-4 h-6 w-6 transition-transform duration-700 group-hover:translate-x-3 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-700"></div>
              </Button>
              
              <Button 
                onClick={() => setShowQuiz(true)}
                variant="outline"
                className="group border-3 border-gray-300 hover:border-emerald-500 px-16 py-8 rounded-full transition-all duration-1000 transform hover:scale-125 hover:shadow-2xl bg-white/90 backdrop-blur-lg hover:bg-emerald-50/90 hover:-rotate-1"
              >
                <Trophy className="mr-4 h-6 w-6 transition-transform duration-700 group-hover:rotate-45 group-hover:scale-110 text-amber-500" />
                <span className="relative z-10">Take Quiz</span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-100 to-cyan-100 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-700"></div>
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Scroll Indicator */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="animate-pulse">
            <ChevronDown className="h-10 w-10 text-gray-400 hover:text-emerald-500 transition-colors duration-500 hover:scale-125 transform" />
          </div>
          <div className="absolute -inset-2 bg-gradient-to-r from-emerald-100 to-cyan-100 rounded-full opacity-0 hover:opacity-20 transition-opacity duration-500 blur-sm"></div>
        </div>
      </section>

      {/* Ultra-Enhanced Tours Section */}
      <section id="tours" className="py-48 px-6 relative" data-animate>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-32">
            <h2 className="text-6xl md:text-8xl font-extralight text-gray-800 mb-12 tracking-[-0.02em] hover:scale-105 transition-transform duration-1000">Tours</h2>
            <div className="w-40 h-1.5 bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 mx-auto rounded-full shadow-lg"></div>
          </div>

          {/* Revolutionary Filter with Advanced Animation */}
          <div className="flex justify-center mb-28">
            <div className="flex bg-gradient-to-r from-gray-50/90 to-gray-100/90 p-3 rounded-full shadow-2xl backdrop-blur-xl border border-white/50">
              {['all', 'morning', 'afternoon', 'evening'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-10 py-4 rounded-full transition-all duration-700 text-base font-light relative overflow-hidden ${
                    activeFilter === filter 
                      ? 'bg-gradient-to-r from-white to-gray-50 text-gray-900 shadow-2xl transform scale-110 rotate-1' 
                      : 'text-gray-500 hover:text-gray-700 hover:bg-white/70 hover:scale-105'
                  }`}
                >
                  {filter === 'all' ? 'All' : filter.charAt(0).toUpperCase() + filter.slice(1)}
                  {activeFilter === filter && (
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-100/60 to-cyan-100/60 rounded-full animate-pulse"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Revolutionary Tour Cards */}
          <div className="grid md:grid-cols-3 gap-12">
            {filterTours(activeFilter).map((tour, index) => (
              <div 
                key={tour.id} 
                className="group cursor-pointer"
                onClick={() => setSelectedTour(tour)}
                style={{animationDelay: `${index * 300}ms`}}
              >
                <Card className="overflow-hidden border-0 shadow-2xl hover:shadow-4xl transition-all duration-1500 transform hover:-translate-y-12 hover:rotate-2 hover:scale-105 bg-white/95 backdrop-blur-xl">
                  <div className="relative h-80 overflow-hidden">
                    <img 
                      src={tour.image} 
                      alt={tour.title}
                      className="w-full h-full object-cover transition-transform duration-1500 group-hover:scale-140 group-hover:rotate-3"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${tour.color} opacity-0 group-hover:opacity-40 transition-opacity duration-1000`}></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                    <div className="absolute top-8 right-8">
                      <Badge className="bg-white/95 backdrop-blur-xl text-gray-700 font-light border-0 px-6 py-3 rounded-full shadow-lg hover:scale-110 transition-transform duration-500">
                        {tour.difficulty}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-12 space-y-8">
                    <div>
                      <h3 className="text-4xl font-light text-gray-800 mb-3 group-hover:text-emerald-700 transition-colors duration-700">{tour.title}</h3>
                      <p className="text-gray-500 font-light text-xl">{tour.subtitle}</p>
                    </div>
                    
                    <div className="flex items-center justify-between text-base text-gray-400">
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 group-hover:rotate-180 transition-transform duration-700" />
                        {tour.duration}
                      </div>
                      <div className="flex items-center gap-3">
                        <Camera className="h-5 w-5 group-hover:scale-125 transition-transform duration-700" />
                        {tour.species.length} species
                      </div>
                    </div>
                    
                    <div className="pt-8">
                      <div className="flex items-center justify-between group-hover:translate-x-6 transition-transform duration-700">
                        <span className="text-gray-600 font-light text-xl">View Details</span>
                        <ArrowRight className="h-6 w-6 text-gray-400 group-hover:text-emerald-600 transition-all duration-700 group-hover:scale-125" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ultra-Enhanced Species Gallery */}
      <section id="species" className="py-48 px-6 bg-gradient-to-br from-gray-50/80 via-emerald-50/40 to-cyan-50/40 relative" data-animate>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-32">
            <h2 className="text-6xl md:text-8xl font-extralight text-gray-800 mb-12 tracking-[-0.02em] hover:scale-105 transition-transform duration-1000">Species</h2>
            <div className="w-40 h-1.5 bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 mx-auto rounded-full shadow-lg"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
            {birdSpecies.map((bird, index) => (
              <div 
                key={index} 
                className="group aspect-square relative overflow-hidden rounded-3xl bg-white shadow-2xl hover:shadow-4xl transition-all duration-1000 transform hover:-translate-y-8 hover:rotate-3 hover:scale-110"
                style={{animationDelay: `${index * 200}ms`}}
              >
                <img 
                  src={bird.image} 
                  alt={bird.name}
                  className="w-full h-full object-cover transition-transform duration-1500 group-hover:scale-125 group-hover:rotate-6"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="absolute bottom-8 left-8 right-8 transform translate-y-12 group-hover:translate-y-0 transition-transform duration-700">
                  <h3 className="text-white font-light text-xl mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                    {bird.name}
                  </h3>
                  <p className="text-white/90 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                    {bird.description}
                  </p>
                </div>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <Bird className="h-6 w-6 text-white animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section - keep existing code */}
      <section id="contact" className="py-40 px-6" data-animate>
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

      {/* Enhanced Modal - keep existing tour modal code */}
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
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-800">Duration</p>
                      <p className="text-gray-500 font-light">{selectedTour.duration}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-800">Difficulty</p>
                      <p className="text-gray-500 font-light">{selectedTour.difficulty}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-800 mb-4">Species You'll See</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedTour.species.map((species) => (
                    <Badge key={species} className="bg-gray-100 text-gray-700 font-light border-0 px-3 py-1">
                      {species}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-4 pt-4">
                <Button 
                  onClick={() => scrollToSection('contact')}
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

      {showQuiz && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-lg z-50 flex items-center justify-center p-6 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in shadow-2xl">
            <div className="relative h-64 overflow-hidden rounded-t-3xl">
              <img 
                src={quizQuestions[currentQuiz].image} 
                alt="Quiz bird"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <button 
                onClick={() => setShowQuiz(false)}
                className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm rounded-full p-3 hover:bg-white transition-all duration-300 transform hover:scale-110"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="absolute bottom-6 left-6">
                <Badge className="bg-white/90 text-gray-800 font-light border-0 px-4 py-2">
                  Question {currentQuiz + 1} of {quizQuestions.length}
                </Badge>
              </div>
            </div>
            
            <div className="p-10 space-y-8">
              <div>
                <h3 className="text-2xl font-light text-gray-800 mb-4">{quizQuestions[currentQuiz].question}</h3>
                <div className="text-green-600 font-light">Score: {quizScore}/{quizQuestions.length}</div>
              </div>
              
              <div className="space-y-4">
                {quizQuestions[currentQuiz].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuizAnswer(index)}
                    className="w-full p-4 text-left rounded-xl border-2 border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all duration-300 transform hover:scale-105"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

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
