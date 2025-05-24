
import React, { useState, useEffect } from 'react';
import { ChevronDown, MapPin, Clock, Users, Bird, Camera, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Index = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedTour, setSelectedTour] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const tours = [
    {
      id: 1,
      title: "Morning Birds at Arboretum",
      description: "Discover the diverse bird species that call our beautiful arboretum home during the golden morning hours.",
      time: "7:00 AM - 9:00 AM",
      duration: "2 hours",
      difficulty: "Easy",
      distance: "1.2 miles",
      species: ["Red-tailed Hawk", "Anna's Hummingbird", "American Robin", "House Finch"],
      startPoint: "Arboretum Entrance",
      price: "Free",
      image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=800",
      category: "morning"
    },
    {
      id: 2,
      title: "Campus Central Bird Walk",
      description: "Explore the heart of campus where urban and nature birds coexist in perfect harmony.",
      time: "2:00 PM - 4:00 PM",
      duration: "2 hours",
      difficulty: "Moderate",
      distance: "1.8 miles",
      species: ["Cooper's Hawk", "Mourning Dove", "Western Bluebird", "California Towhee"],
      startPoint: "Titan Student Union",
      price: "Free",
      image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800",
      category: "afternoon"
    },
    {
      id: 3,
      title: "Evening Migration Route",
      description: "Witness the spectacular evening migration patterns along our campus corridors.",
      time: "5:30 PM - 7:30 PM",
      duration: "2 hours",
      difficulty: "Easy",
      distance: "1.5 miles",
      species: ["Great Blue Heron", "Red-winged Blackbird", "White-crowned Sparrow"],
      startPoint: "Campus Pond",
      price: "Free",
      image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800",
      category: "evening"
    }
  ];

  const birdSpecies = [
    { name: "Red-tailed Hawk", image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=400", description: "Majestic raptor commonly seen soaring over campus" },
    { name: "Anna's Hummingbird", image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=400", description: "Tiny iridescent jewels of the garden areas" },
    { name: "American Robin", image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400", description: "Cheerful songbird found throughout campus lawns" },
    { name: "Cooper's Hawk", image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=400", description: "Agile hunter of the wooded campus areas" }
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
      const sections = document.querySelectorAll('section');
      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.75) {
          section.classList.add('animate-fade-in');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-amber-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md shadow-sm z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Bird className="h-8 w-8 text-green-600" />
              <span className="text-xl font-bold text-gray-800">CSUF Bird Tours</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => scrollToSection('home')} className="text-gray-700 hover:text-green-600 transition-colors">Home</button>
              <button onClick={() => scrollToSection('tours')} className="text-gray-700 hover:text-green-600 transition-colors">Tours</button>
              <button onClick={() => scrollToSection('species')} className="text-gray-700 hover:text-green-600 transition-colors">Species</button>
              <button onClick={() => scrollToSection('contact')} className="text-gray-700 hover:text-green-600 transition-colors">Contact</button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className={`w-6 h-0.5 bg-gray-600 transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
              <div className={`w-6 h-0.5 bg-gray-600 mt-1.5 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></div>
              <div className={`w-6 h-0.5 bg-gray-600 mt-1.5 transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4 space-y-4">
              <button onClick={() => scrollToSection('home')} className="block w-full text-left text-gray-700 hover:text-green-600 transition-colors">Home</button>
              <button onClick={() => scrollToSection('tours')} className="block w-full text-left text-gray-700 hover:text-green-600 transition-colors">Tours</button>
              <button onClick={() => scrollToSection('species')} className="block w-full text-left text-gray-700 hover:text-green-600 transition-colors">Species</button>
              <button onClick={() => scrollToSection('contact')} className="block w-full text-left text-gray-700 hover:text-green-600 transition-colors">Contact</button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-600/20 via-blue-600/20 to-amber-600/20"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1472396961693-142e6e269027?w=1920')`,
            transform: 'translateY(var(--scroll, 0) * 0.5)'
          }}
        ></div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-2xl">
              Discover Campus
              <span className="block text-green-300">Wildlife</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto drop-shadow-lg">
              Join our guided birdwatching tours and explore the incredible avian diversity right here at Cal State Fullerton
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => scrollToSection('tours')}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg rounded-full transition-all duration-300 transform hover:scale-105"
              >
                Explore Tours
              </Button>
              <Button 
                variant="outline"
                onClick={() => scrollToSection('species')}
                className="bg-white/10 backdrop-blur-sm border-white/30 text-white px-8 py-4 text-lg rounded-full hover:bg-white/20 transition-all duration-300"
              >
                View Species
              </Button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-8 w-8 text-white/80" />
        </div>
      </section>

      {/* Tours Section */}
      <section id="tours" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">Walking Tours</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose from our carefully curated birdwatching experiences, each designed to showcase different aspects of campus wildlife
            </p>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {['all', 'morning', 'afternoon', 'evening'].map((filter) => (
              <Button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                variant={activeFilter === filter ? "default" : "outline"}
                className={`px-6 py-2 rounded-full transition-all duration-300 ${
                  activeFilter === filter 
                    ? 'bg-green-600 text-white' 
                    : 'border-green-600 text-green-600 hover:bg-green-50'
                }`}
              >
                <Filter className="h-4 w-4 mr-2" />
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Button>
            ))}
          </div>

          {/* Tours Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filterTours(activeFilter).map((tour) => (
              <Card key={tour.id} className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white/80 backdrop-blur-sm">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img 
                    src={tour.image} 
                    alt={tour.title}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-green-600 text-white">{tour.difficulty}</Badge>
                  </div>
                </div>
                
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-800">{tour.title}</CardTitle>
                  <CardDescription className="text-gray-600">{tour.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {tour.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {tour.distance}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Species You'll See:</p>
                    <div className="flex flex-wrap gap-1">
                      {tour.species.slice(0, 2).map((species) => (
                        <Badge key={species} variant="secondary" className="text-xs">
                          {species}
                        </Badge>
                      ))}
                      {tour.species.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{tour.species.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => setSelectedTour(tour)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white rounded-full transition-all duration-300"
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Species Gallery */}
      <section id="species" className="py-20 px-4 bg-gradient-to-br from-blue-50 to-green-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">Campus Bird Species</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Meet the feathered residents and visitors that make our campus their home
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {birdSpecies.map((bird, index) => (
              <div key={index} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3">
                <div className="relative overflow-hidden rounded-t-2xl">
                  <img 
                    src={bird.image} 
                    alt={bird.name}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{bird.name}</h3>
                  <p className="text-gray-600 text-sm">{bird.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">Join a Tour</h2>
            <p className="text-xl text-gray-600">
              Ready to explore? Contact us to reserve your spot on our next birdwatching adventure
            </p>
          </div>

          <Card className="bg-white/80 backdrop-blur-sm shadow-2xl">
            <CardContent className="p-8">
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all duration-300"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input 
                      type="email" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all duration-300"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Tour</label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all duration-300">
                    <option>Select a tour...</option>
                    {tours.map((tour) => (
                      <option key={tour.id} value={tour.id}>{tour.title}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea 
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all duration-300"
                    placeholder="Tell us about your birdwatching experience or any special requests..."
                  ></textarea>
                </div>
                
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-4 text-lg rounded-full transition-all duration-300 transform hover:scale-105">
                  Reserve Your Spot
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Bird className="h-8 w-8 text-green-400" />
                <span className="text-xl font-bold">CSUF Bird Tours</span>
              </div>
              <p className="text-gray-300">
                Connecting students and community with the natural world through guided birdwatching experiences on our beautiful campus.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <div className="space-y-2 text-gray-300">
                <button onClick={() => scrollToSection('tours')} className="block hover:text-green-400 transition-colors">Tours</button>
                <button onClick={() => scrollToSection('species')} className="block hover:text-green-400 transition-colors">Species</button>
                <button onClick={() => scrollToSection('contact')} className="block hover:text-green-400 transition-colors">Contact</button>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
              <div className="space-y-2 text-gray-300">
                <p>📍 California State University, Fullerton</p>
                <p>📧 birdtours@fullerton.edu</p>
                <p>📞 (657) 278-2011</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 CSUF Bird Tours. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Tour Detail Modal */}
      {selectedTour && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <img 
                src={selectedTour.image} 
                alt={selectedTour.title}
                className="w-full h-48 object-cover rounded-t-2xl"
              />
              <button 
                onClick={() => setSelectedTour(null)}
                className="absolute top-4 right-4 bg-white/90 rounded-full p-2 hover:bg-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{selectedTour.title}</h3>
                <p className="text-gray-600">{selectedTour.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">Duration</p>
                      <p className="text-sm text-gray-600">{selectedTour.duration}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">Distance</p>
                      <p className="text-sm text-gray-600">{selectedTour.distance}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">Difficulty</p>
                      <p className="text-sm text-gray-600">{selectedTour.difficulty}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Camera className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">Start Point</p>
                      <p className="text-sm text-gray-600">{selectedTour.startPoint}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-3">Bird Species You'll Encounter:</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedTour.species.map((species) => (
                    <Badge key={species} className="bg-green-100 text-green-800">
                      {species}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-4">
                <Button 
                  onClick={() => scrollToSection('contact')}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-full"
                >
                  Book This Tour
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setSelectedTour(null)}
                  className="px-8 rounded-full"
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
