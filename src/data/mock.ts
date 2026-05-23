export interface Creator {
  id: string;
  name: string;
  category: string;
  followers: string;
  engagement: string;
  location: string;
  priceRange: string;
  image: string;
  verified: boolean;
}

export const mockCreators: Creator[] = [
  {
    id: "1",
    name: "Priya Sharma",
    category: "Fashion & Lifestyle",
    followers: "125K",
    engagement: "4.2%",
    location: "Benz Circle, Vijayawada",
    priceRange: "₹5K - ₹15K",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80",
    verified: true,
  },
  {
    id: "2",
    name: "Rahul Tech",
    category: "Tech & Gadgets",
    followers: "89K",
    engagement: "5.1%",
    location: "Autonagar, Vijayawada",
    priceRange: "₹8K - ₹20K",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
    verified: true,
  },
  {
    id: "3",
    name: "Foodie VJA",
    category: "Food Blog",
    followers: "210K",
    engagement: "6.8%",
    location: "Labbipet, Vijayawada",
    priceRange: "₹3K - ₹10K",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&q=80",
    verified: true,
  },
  {
    id: "4",
    name: "Anita Styles",
    category: "Beauty & Makeup",
    followers: "45K",
    engagement: "3.5%",
    location: "MGS, Vijayawada",
    priceRange: "₹2K - ₹8K",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80",
    verified: false,
  },
  {
    id: "5",
    name: "VJA Explorer",
    category: "Travel",
    followers: "150K",
    engagement: "5.5%",
    location: "Bhavanipuram, Vijayawada",
    priceRange: "₹10K - ₹25K",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80",
    verified: true,
  },
  {
    id: "6",
    name: "Fit with Karthik",
    category: "Fitness & Health",
    followers: "75K",
    engagement: "4.8%",
    location: "Patamata, Vijayawada",
    priceRange: "₹4K - ₹12K",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80",
    verified: false,
  },
  {
    id: "7",
    name: "Telugu Tech Pro",
    category: "Tech",
    followers: "320K",
    engagement: "7.2%",
    location: "Gollapudi, Vijayawada",
    priceRange: "₹15K - ₹40K",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&q=80",
    verified: true,
  },
  {
    id: "8",
    name: "Siri's Kitchen",
    category: "Food & Recipes",
    followers: "95K",
    engagement: "6.1%",
    location: "One Town, Vijayawada",
    priceRange: "₹3K - ₹8K",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80",
    verified: true,
  }
];

export const mockCategories = [
  { id: "1", name: "Food & Dining", count: 124, icon: "utensils" },
  { id: "2", name: "Fashion & Beauty", count: 86, icon: "shirt" },
  { id: "3", name: "Tech & Gadgets", count: 45, icon: "smartphone" },
  { id: "4", name: "Travel & Local", count: 62, icon: "map-pin" },
  { id: "5", name: "Fitness & Health", count: 38, icon: "activity" },
  { id: "6", name: "Events & Entertainment", count: 53, icon: "music" }
];

export const mockTestimonials = [
  {
    id: "1",
    text: "InfluenceHub helped us find the perfect food vloggers for our new restaurant launch in Labbipet. Our footfall doubled in the first weekend!",
    name: "Ramesh Reddy",
    role: "Owner, Spice Route VJA",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80"
  },
  {
    id: "2",
    text: "As a creator, I used to struggle finding local brand deals. Since joining this platform, I've consistently booked 4-5 local gigs every month.",
    name: "Priya Sharma",
    role: "Lifestyle Influencer",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&q=80"
  }
];
