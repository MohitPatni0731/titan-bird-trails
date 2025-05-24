
import React, { useState, useEffect } from 'react';
import { ChevronDown, MapPin, Clock, Bird, Camera, Filter, X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Index = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedTour, setSelectedTour] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

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
    { name: "Red-tailed Hawk", image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=400" },
    { name: "Anna's Hummingbird", image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=400" },
    { name: "American Robin", image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400" },
    { name: "Cooper's Hawk", image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=400" }
  ];

  const filterTours = (category) => {
    if (category === 'all') return tours;
    return tours.filter(tour => tour.category === category);
  };

  const scrollToSection = (sectionId) => {
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

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-2 h-2 bg-green-300 rounded-full animate-float opacity-60"></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-blue-300 rounded-full animate-float opacity-40" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-40 left-1/4 w-1 h-1 bg-amber-300 rounded-full animate-float opacity-50" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Minimal Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-xl z-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3 group">
              <div className="relative">
                <Bird className="h-7 w-7 text-gray-800 transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute -inset-2 bg-green-100 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              </div>
              <span className="text-xl font-light text-gray-800 tracking-wide">CSUF Birds</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              {['Tours', 'Species', 'Contact'].map((item, index) => (
                <button 
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className="relative text-gray-600 hover:text-gray-900 transition-colors duration-300 group py-2"
                  style={{animationDelay: `${index * 100}ms`}}
                >
                  {item}
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-500 group-hover:w-full transition-all duration-300"></div>
                </button>
              ))}
            </div>

            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-xl hover:bg-gray-50 transition-colors duration-300"
            >
              <div className="space-y-1.5">
                <div className={`w-5 h-0.5 bg-gray-600 transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
                <div className={`w-5 h-0.5 bg-gray-600 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></div>
                <div className={`w-5 h-0.5 bg-gray-600 transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
              </div>
            </button>
          </div>

          {isMenuOpen && (
            <div className="md:hidden pt-4 pb-2 space-y-3 animate-fade-in">
              {['Tours', 'Species', 'Contact'].map((item) => (
                <button 
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className="block w-full text-left text-gray-600 hover:text-gray-900 py-2 transition-colors duration-300"
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section - Ultra Minimal */}
      <section className="relative min-h-screen flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-green-50 via-blue-50 to-white"
          style={{transform: `translateY(${scrollY * 0.3}px)`}}
        ></div>
        
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <h1 className="text-6xl md:text-8xl font-extralight text-gray-800 leading-none tracking-tight">
                Discover
                <span className="block text-green-600 font-light">Birds</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-500 font-light max-w-2xl mx-auto leading-relaxed">
                Guided campus tours through Cal State Fullerton's natural habitats
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Button 
                onClick={() => scrollToSection('tours')}
                className="group bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-full transition-all duration-500 transform hover:scale-105"
              >
                Explore Tours
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2">
          <div className="animate-bounce">
            <ChevronDown className="h-6 w-6 text-gray-400" />
          </div>
        </div>
      </section>

      {/* Tours Section - Minimal Cards */}
      <section id="tours" className="py-32 px-6" data-animate>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-extralight text-gray-800 mb-6 tracking-tight">Tours</h2>
            <div className="w-24 h-px bg-green-500 mx-auto"></div>
          </div>

          {/* Minimal Filter */}
          <div className="flex justify-center mb-16">
            <div className="flex bg-gray-50 p-1 rounded-full">
              {['all', 'morning', 'afternoon', 'evening'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-6 py-2 rounded-full transition-all duration-300 text-sm font-light ${
                    activeFilter === filter 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {filter === 'all' ? 'All' : filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Tour Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {filterTours(activeFilter).map((tour, index) => (
              <div 
                key={tour.id} 
                className="group cursor-pointer"
                onClick={() => setSelectedTour(tour)}
                style={{animationDelay: `${index * 200}ms`}}
              >
                <Card className="overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-700 transform hover:-translate-y-4 bg-white">
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={tour.image} 
                      alt={tour.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${tour.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-white/90 text-gray-700 font-light border-0">
                        {tour.difficulty}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-8 space-y-4">
                    <div>
                      <h3 className="text-2xl font-light text-gray-800 mb-1">{tour.title}</h3>
                      <p className="text-gray-500 font-light">{tour.subtitle}</p>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {tour.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <Camera className="h-4 w-4" />
                        {tour.species.length} species
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <div className="flex items-center justify-between group-hover:translate-x-2 transition-transform duration-300">
                        <span className="text-gray-600 font-light">View Details</span>
                        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors duration-300" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Species Gallery - Minimal Grid */}
      <section id="species" className="py-32 px-6 bg-gray-50" data-animate>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-extralight text-gray-800 mb-6 tracking-tight">Species</h2>
            <div className="w-24 h-px bg-green-500 mx-auto"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {birdSpecies.map((bird, index) => (
              <div 
                key={index} 
                className="group aspect-square relative overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-lg transition-all duration-500"
                style={{animationDelay: `${index * 150}ms`}}
              >
                <img 
                  src={bird.image} 
                  alt={bird.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-white font-light text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {bird.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section - Ultra Minimal */}
      <section id="contact" className="py-32 px-6" data-animate>
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

      {/* Minimal Footer */}
      <footer className="py-16 px-6 border-t border-gray-100">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <Bird className="h-6 w-6 text-gray-400" />
            <span className="text-gray-400 font-light">CSUF Bird Tours</span>
          </div>
          <p className="text-gray-400 text-sm font-light">
            © 2024 California State University, Fullerton
          </p>
        </div>
      </footer>

      {/* Enhanced Modal */}
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
    </div>
  );
};

export default Index;
