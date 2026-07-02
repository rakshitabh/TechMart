import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Product from './models/Product.js';
import Order from './models/Order.js';
import Cart from './models/Cart.js';
import connectDB from './config/db.js';

dotenv.config();

const sampleProducts = [
  {
    name: 'AeroBook Pro 14" Laptop',
    description: 'Thin and light ultraportable laptop built with an aerospace-grade aluminum chassis. Packed with an 8-core CPU, 16GB unified memory, 512GB NVMe SSD, and a bright 3K screen that provides color accuracy for visual editors.',
    category: 'Laptops',
    brand: 'Apex',
    price: 41999,
    stock: 12,
    image: 'https://images.unsplash.com/photo-1496181130204-755241544e35?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    reviews: []
  },
  {
    name: 'Zenith Creator 16" Laptop',
    description: 'Powerful mobile workstation featuring a 16-core CPU, RTX 4070 GPU, 32GB RAM, and a 2TB NVMe SSD. Dynamic liquid metal thermal systems and a 165Hz mini-LED display make it the developer’s ultimate powerhouse.',
    category: 'Laptops',
    brand: 'Apex',
    price: 79999,
    stock: 8,
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    reviews: []
  },
  {
    name: 'Titan Gaming Rig Pro',
    description: 'High-performance desktop tower configured with an AMD Ryzen 9 9900X, 64GB DDR5 RAM, and an RTX 4090 GPU. Encased in a tempered-glass panoramic chassis with programmable custom liquid cooling loops.',
    category: 'Laptops',
    brand: 'CyberGear',
    price: 119999,
    stock: 5,
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80',
    rating: 4.7,
    reviews: []
  },
  {
    name: 'Quantum X1 Smartphone',
    description: 'Next-generation flagship smartphone with a 6.9-inch 120Hz OLED screen, a Snapdragon 8 Gen 4 equivalent processor, 12GB of RAM, and a revolutionary 200MP sensor array. Perfect for creators, developers, and tech enthusiasts.',
    category: 'Smartphones',
    brand: 'QuantumTech',
    price: 31999,
    stock: 25,
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    reviews: []
  },
  {
    name: 'Quantum Fold Lite',
    description: 'Sleek, dual-display folding smartphone featuring an ultra-thin flexible glass screen, continuous hinge adjustments, 16GB RAM, and custom multitasking software integrations for mobile programmers.',
    category: 'Smartphones',
    brand: 'QuantumTech',
    price: 51999,
    stock: 10,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
    rating: 4.6,
    reviews: []
  },
  {
    name: 'SonarANC Wireless Headphones',
    description: 'Premium active noise-cancelling over-ear headphones with custom-tuned 40mm dynamic drivers. Features a massive 45-hour battery life, high-res audio streaming codecs, and soft memory foam earcups for long coding sessions.',
    category: 'Audio',
    brand: 'Acoustics',
    price: 7999,
    stock: 30,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    rating: 4.6,
    reviews: []
  },
  {
    name: 'AeroBuds Pro Earbuds',
    description: 'True wireless high-fidelity earbuds with hybrid active noise cancellation, triple-microphone wind resistance, adaptive spatial audio algorithms, and an ergonomic splashproof casing.',
    category: 'Audio',
    brand: 'Acoustics',
    price: 5799,
    stock: 45,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80',
    rating: 4.4,
    reviews: []
  },
  {
    name: 'Nero Pro DAC/Amp',
    description: 'Audiophile-grade external USB-C Digital-to-Analog converter and amplifier. Encased in a solid CNC-milled aluminum housing, driving high-impedance headphones with reference-quality audio fidelity.',
    category: 'Audio',
    brand: 'Acoustics',
    price: 9599,
    stock: 15,
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    reviews: []
  },
  {
    name: 'VaporPro Mechanical Keyboard',
    description: 'Sleek hot-swappable 75% mechanical keyboard featuring silent linear switches, PBT double-shot keycaps, vibrant per-key RGB backlighting, and a multi-function metallic rotary knob for volume and media controls.',
    category: 'Peripherals',
    brand: 'CyberGear',
    price: 4799,
    stock: 40,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80',
    rating: 4.5,
    reviews: []
  },
  {
    name: 'OmniPoint Wireless Mouse',
    description: 'Ultra-lightweight ergonomic wireless mouse featuring an 30K optical sensor, optical switches rated for 90 million clicks, and zero-latency wireless connectivity. Complete with custom PTFE glider feet.',
    category: 'Peripherals',
    brand: 'CyberGear',
    price: 3199,
    stock: 50,
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80',
    rating: 4.5,
    reviews: []
  },
  {
    name: 'StreamerPro 4K Webcam',
    description: 'Ultra-HD webcam with dynamic HDR correction, wide-angle lens, intelligent autofocus, and dual noise-reducing stereo microphones. Fits on any monitor with its adjustable rubber clamp mount.',
    category: 'Peripherals',
    brand: 'CyberGear',
    price: 5999,
    stock: 20,
    image: 'https://images.unsplash.com/photo-1603481588273-2f908a9a7a1b?auto=format&fit=crop&w=600&q=80',
    rating: 4.3,
    reviews: []
  },
  {
    name: 'AuraRGB Desk Mat XL',
    description: 'Extra-large premium microfiber desk pad with spill-resistant weave coating, dense non-slip rubber base, and perimeter-wrapped customizable RGB lighting strip.',
    category: 'Peripherals',
    brand: 'CyberGear',
    price: 1299,
    stock: 80,
    image: 'https://images.unsplash.com/photo-1616440347437-b1c73416efc2?auto=format&fit=crop&w=600&q=80',
    rating: 4.6,
    reviews: []
  },
  {
    name: 'Iris 4K Curved Monitor',
    description: 'Immersive 34-inch curved ultra-wide monitor with 4K resolution, 144Hz refresh rate, and HDR400. Includes integrated USB-C docking with 90W power delivery, perfect for simplifying your workspace cables.',
    category: 'Monitors',
    brand: 'Apex',
    price: 18999,
    stock: 8,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80',
    rating: 4.7,
    reviews: []
  },
  {
    name: 'Horizon UltraWide 49"',
    description: 'Massive 49-inch super ultra-wide 32:9 curved monitor with Dual QHD resolution, 240Hz refresh rate, QLED panel technology, and dual video input PIP multi-tasking modules.',
    category: 'Monitors',
    brand: 'Apex',
    price: 37999,
    stock: 6,
    image: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    reviews: []
  },
  {
    name: 'Cortex Smart Watch v4',
    description: 'An advanced health-oriented smartwatch equipped with continuous heart-rate tracking, blood oxygen monitors, GPS, and custom coding stats. Features 7-day battery life and water resistance up to 50 meters.',
    category: 'Smartwatches',
    brand: 'QuantumTech',
    price: 6399,
    stock: 18,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
    rating: 4.3,
    reviews: []
  },
  {
    name: 'Carbon Book Ultra 13"',
    description: 'Super-thin developer laptop featuring Intel Core Ultra 9, 32GB RAM, 1TB NVMe SSD, and a gorgeous 120Hz OLED touchscreen. Engineered for ultimate mobility without compromising compiling speed.',
    category: 'Laptops',
    brand: 'Apex',
    price: 47999,
    stock: 15,
    image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    reviews: []
  },
  {
    name: 'Nebula Studio Pro 16"',
    description: 'Designed for machine learning and heavy engineering workloads. Features a next-generation neural processing engine, 48GB unified RAM, 2TB SSD, and liquid-metal cooling systems for sustained peak performance.',
    category: 'Laptops',
    brand: 'Apex',
    price: 92999,
    stock: 7,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    reviews: []
  },
  {
    name: 'Spectra OLED 27" Pro',
    description: 'Ultimate color-accurate 27-inch monitor with a 240Hz refresh rate, true 10-bit color, 99% DCI-P3 workspace gamut, and an adjustable ergonomic stand with vertical coding mode support.',
    category: 'Monitors',
    brand: 'Apex',
    price: 25599,
    stock: 10,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80',
    rating: 4.7,
    reviews: []
  },
  {
    name: 'VaporKey Split Ergonomic',
    description: 'Split mechanical keyboard featuring silent tactile switches, double-shot PBT keycaps, and magnetic wooden wrist rests. Promotes healthy typing posture for long hours of coding.',
    category: 'Peripherals',
    brand: 'CyberGear',
    price: 6999,
    stock: 25,
    image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=600&q=80',
    rating: 4.6,
    reviews: []
  },
  {
    name: 'ErgoComfort Standing Desk',
    description: 'Dual-motor electric standing desk with a solid walnut tabletop. Features anti-collision sensors, a cable management tray, and programmable controller with 4 height presets.',
    category: 'Peripherals',
    brand: 'CyberGear',
    price: 15999,
    stock: 12,
    image: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    reviews: []
  },
  {
    name: 'Sonar Podcast Mic',
    description: 'Professional USB/XLR hybrid microphone with a cardiod polar pattern, built-in pop filter, and desktop stand. Ideal for voiceovers, meetings, and remote developer standups.',
    category: 'Audio',
    brand: 'Acoustics',
    price: 4799,
    stock: 35,
    image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=600&q=80',
    rating: 4.5,
    reviews: []
  },
  {
    name: 'StudioMonitor X5 Speakers',
    description: 'Active studio monitor speakers designed for clear reference audio reproduction. Bi-amplified 100W design delivers precise mids and deep, natural bass lines.',
    category: 'Audio',
    brand: 'Acoustics',
    price: 12799,
    stock: 18,
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=600&q=80',
    rating: 4.7,
    reviews: []
  },
  {
    name: 'Quantum Lite 5G',
    description: 'Affordable smartphone featuring a 6.5-inch 90Hz display, clean stock Android OS, octa-core processor, and a large 5000mAh battery for all-day usage.',
    category: 'Smartphones',
    brand: 'QuantumTech',
    price: 13999,
    stock: 40,
    image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=600&q=80',
    rating: 4.4,
    reviews: []
  },
  {
    name: 'Cortex Fit Band',
    description: 'Lightweight, water-resistant fitness tracker with 24/7 heart-rate monitoring, activity tracking, sleep analysis, and up to 14 days of battery life on a single charge.',
    category: 'Smartwatches',
    brand: 'QuantumTech',
    price: 2499,
    stock: 55,
    image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=600&q=80',
    rating: 4.3,
    reviews: []
  },
  {
    name: 'Aegis GPS Explorer',
    description: 'Rugged multi-sport smartwatch with sapphire glass lens, solar charging capabilities, offline navigation, and a titanium bezel. Perfect for outdoorsmen and adventurers.',
    category: 'Smartwatches',
    brand: 'QuantumTech',
    price: 12799,
    stock: 14,
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    reviews: []
  },
  {
    name: 'Apex Developer Workstation Tower',
    description: 'Ultimate developer workstation featuring 128GB DDR5 RAM, 64-core Threadripper CPU, Dual RTX 4090 GPUs, and 8TB PCIe Gen5 storage. Built to compile massive projects in seconds.',
    category: 'Laptops',
    brand: 'Apex',
    price: 139999,
    stock: 4,
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80',
    rating: 5.0,
    reviews: []
  },
  {
    name: 'Quantum Pad Pro 12" Tablet',
    description: '12-inch high refresh-rate tablet with active stylus support. Perfect for system design sketching, note-taking, and mobile application testing on the go.',
    category: 'Smartphones',
    brand: 'QuantumTech',
    price: 27999,
    stock: 15,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=600&q=80',
    rating: 4.6,
    reviews: []
  },
  {
    name: 'Nero Studio Soundbar',
    description: 'Sleek, high-fidelity soundbar designed to sit perfectly under monitors. Connects via USB-C or Optical to deliver crystal-clear audio during developer calls and music playback.',
    category: 'Audio',
    brand: 'Acoustics',
    price: 9999,
    stock: 22,
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=600&q=80',
    rating: 4.5,
    reviews: []
  },
  {
    name: 'Aura Ergonomic Office Chair',
    description: 'State-of-the-art office chair with dynamic lumbar support, highly adjustable armrests, and premium breathable mesh back. Designed to minimize fatigue during long debugging marathons.',
    category: 'Peripherals',
    brand: 'CyberGear',
    price: 11999,
    stock: 10,
    image: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    reviews: []
  },
  {
    name: 'Cortex Smart Ring',
    description: 'Ultra-lightweight titanium ring that tracks sleep, heart rate, and steps. Syncs seamlessly with developer dashboards to monitor stress and energy levels during shipping cycles.',
    category: 'Smartwatches',
    brand: 'QuantumTech',
    price: 5199,
    stock: 30,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
    rating: 4.4,
    reviews: []
  },
  {
    name: 'AeroPort USB-C Hub 8-in-1',
    description: 'Alloy 8-in-1 multi-port adapter featuring 4K HDMI, Gigabit Ethernet, 100W PD charging, and multiple high-speed USB 3.2 ports. Simplifies single-cable desk connections.',
    category: 'Peripherals',
    brand: 'Apex',
    price: 1999,
    stock: 50,
    image: 'https://images.unsplash.com/photo-1616440347437-b1c73416efc2?auto=format&fit=crop&w=600&q=80',
    rating: 4.7,
    reviews: []
  },
  {
    name: 'VaporMouse Ergo Vertical',
    description: 'Vertical ergonomic mouse featuring a unique 57-degree vertical angle that reduces muscular strain and forearm pressure by up to 10% compared to standard mice.',
    category: 'Peripherals',
    brand: 'CyberGear',
    price: 2499,
    stock: 25,
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    reviews: []
  },
  {
    name: 'CyberGear 4K Capture Card',
    description: 'USB 3.0 external video capture card supporting 4K60 HDR passthrough and recording. Essential tool for streaming coding tutorials and recording console development kits.',
    category: 'Peripherals',
    brand: 'CyberGear',
    price: 5999,
    stock: 18,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80',
    rating: 4.5,
    reviews: []
  },
  {
    name: 'Apex Backpack Pro',
    description: 'Waterproof, heavy-duty utility backpack with dedicated compartments for 16-inch laptops, mechanical keyboards, chargers, and headphones. Includes a hidden passport pocket.',
    category: 'Peripherals',
    brand: 'Apex',
    price: 2399,
    stock: 40,
    image: 'https://images.unsplash.com/photo-1616440347437-b1c73416efc2?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    reviews: []
  },
  {
    name: 'Iris Smart Desk Lamp',
    description: 'Monitor screen light bar featuring custom counterweight design, asymmetrical optical layout to prevent screen glare, and auto-dimming touch controls.',
    category: 'Peripherals',
    brand: 'Apex',
    price: 1599,
    stock: 35,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80',
    rating: 4.6,
    reviews: []
  }
];

const importData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Order.deleteMany();
    await Product.deleteMany();
    await Cart.deleteMany();
    
    // Seed new products
    await Product.insertMany(sampleProducts);

    console.log('Sample data imported successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error importing sample data: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();

    await Order.deleteMany();
    await Product.deleteMany();
    await Cart.deleteMany();
    await User.deleteMany();

    console.log('All database data deleted successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error deleting database data: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
