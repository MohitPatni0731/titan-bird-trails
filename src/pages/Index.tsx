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
      {/* Enhanced Floating Background Elements with Mouse Tracking */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div 
          className="absolute w-3 h-3 bg-gradient-to-r from-green-300 to-emerald-400 rounded-full animate-float opacity-70 transition-all duration-1000"
          style={{
            top: `${20 + mousePosition.y * 0.02}%`,
            left: `${10 + mousePosition.x * 0.01}%`,
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
          }}
        ></div>
        <div 
          className="absolute w-4 h-4 bg-gradient-to-r from-blue-300 to-cyan-400 rounded-full animate-float opacity-50"
          style={{
            animationDelay: '1s',
            top: `${40 + mousePosition.y * -0.01}%`,
            right: `${20 + mousePosition.x * 0.015}%`,
            transform: `translate(${mousePosition.x * -0.01}px, ${mousePosition.y * 0.01}px)`
          }}
        ></div>
        <div 
          className="absolute w-2 h-2 bg-gradient-to-r from-amber-300 to-yellow-400 rounded-full animate-float opacity-60"
          style={{
            animationDelay: '2s',
            bottom: `${40 + mousePosition.y * 0.01}%`,
            left: `${25 + mousePosition.x * -0.02}%`,
            transform: `translate(${mousePosition.x * 0.015}px, ${mousePosition.y * -0.015}px)`
          }}
        ></div>
        
        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-gradient-to-r from-green-200/20 to-blue-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-40 h-40 bg-gradient-to-r from-purple-200/20 to-pink-200/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Enhanced Navigation with Glass Effect */}
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
              {['Tours', 'Species', 'Quiz', 'Checklist', 'Contact'].map((item, index) => (
                <button 
                  key={item}
                  onClick={() => item === 'Quiz' ? setShowQuiz(true) : item === 'Checklist' ? setShowChecklist(true) : scrollToSection(item.toLowerCase())}
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
              {['Tours', 'Species', 'Quiz', 'Checklist', 'Contact'].map((item) => (
                <button 
                  key={item}
                  onClick={() => item === 'Quiz' ? setShowQuiz(true) : item === 'Checklist' ? setShowChecklist(true) : scrollToSection(item.toLowerCase())}
                  className="block w-full text-left text-gray-600 hover:text-gray-900 py-3 px-4 rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all duration-500"
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Enhanced Hero Section with Parallax */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-green-50 via-blue-50 via-purple-50 to-white"
          style={{transform: `translateY(${scrollY * 0.4}px) scale(${1 + scrollY * 0.0002})`}}
        ></div>
        
        {/* Animated background shapes */}
        <div 
          className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-green-200/30 to-emerald-300/30 rounded-full blur-3xl animate-pulse"
          style={{transform: `translateY(${scrollY * -0.2}px) rotate(${scrollY * 0.1}deg)`}}
        ></div>
        <div 
          className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-blue-200/30 to-cyan-300/30 rounded-full blur-3xl animate-pulse"
          style={{animationDelay: '2s', transform: `translateY(${scrollY * -0.3}px) rotate(${scrollY * -0.1}deg)`}}
        ></div>
        
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <div className="space-y-12 animate-fade-in">
            <div className="space-y-6">
              <h1 className="text-7xl md:text-9xl font-extralight text-gray-800 leading-none tracking-tighter">
                <span className="inline-block animate-fade-in stagger-1">Discover</span>
                <span className="block text-transparent bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text font-light animate-fade-in stagger-2">Birds</span>
              </h1>
              <p className="text-2xl md:text-3xl text-gray-500 font-extralight max-w-3xl mx-auto leading-relaxed animate-fade-in stagger-3">
                Guided campus tours through Cal State Fullerton's natural habitats
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
                onClick={() => setShowQuiz(true)}
                variant="outline"
                className="group border-2 border-gray-300 hover:border-green-500 px-12 py-6 rounded-full transition-all duration-700 transform hover:scale-110 hover:shadow-xl bg-white/80 backdrop-blur-sm"
              >
                <Trophy className="mr-3 h-5 w-5 transition-transform duration-500 group-hover:rotate-12" />
                Take Quiz
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

      {/* Enhanced Tours Section */}
      <section id="tours" className="py-40 px-6 relative" data-animate>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-7xl font-extralight text-gray-800 mb-8 tracking-tighter">Tours</h2>
            <div className="w-32 h-1 bg-gradient-to-r from-green-500 to-blue-500 mx-auto rounded-full"></div>
          </div>

          {/* Enhanced Filter with Animation */}
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

          {/* Enhanced Tour Cards */}
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

      {/* Enhanced Species Gallery */}
      <section id="species" className="py-40 px-6 bg-gradient-to-br from-gray-50 via-green-50/30 to-blue-50/30 relative" data-animate>
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

      {/* Enhanced Footer */}
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

      {/* New Feature: Bird Quiz Modal */}
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

      {/* New Feature: Birding Checklist Modal */}
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
