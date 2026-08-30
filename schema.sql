-- Create database if not exists
CREATE DATABASE IF NOT EXISTS `velocity_shoes_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `velocity_shoes_db`;

-- 1. Table structure for table `products`
DROP TABLE IF EXISTS `order_items`;
DROP TABLE IF EXISTS `product_variants`;
DROP TABLE IF EXISTS `products`;

CREATE TABLE `products` (
  `id` varchar(100) NOT NULL PRIMARY KEY,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `brand` varchar(100) NOT NULL DEFAULT 'VELOCITY',
  `price` decimal(10,2) NOT NULL,
  `original_price` decimal(10,2) DEFAULT NULL,
  `description` text NOT NULL,
  `category` varchar(100) NOT NULL,
  `gender` varchar(50) NOT NULL,
  `images` json NOT NULL,
  `is_featured` boolean NOT NULL DEFAULT FALSE,
  `badge` varchar(100) DEFAULT NULL,
  `rating` decimal(3,2) NOT NULL DEFAULT 5.00,
  `reviews_count` int(11) NOT NULL DEFAULT 0,
  `specs` json DEFAULT NULL,
  `materials` json DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Table structure for table `product_variants`
CREATE TABLE `product_variants` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `product_id` varchar(100) NOT NULL,
  `size` int(11) NOT NULL,
  `stock_quantity` int(11) NOT NULL DEFAULT 0,
  FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Table structure for table `orders`
DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
  `id` varchar(100) NOT NULL PRIMARY KEY,
  `customer_name` varchar(255) NOT NULL,
  `customer_email` varchar(255) NOT NULL,
  `customer_phone` varchar(50) NOT NULL DEFAULT '',
  `shipping_address` text NOT NULL,
  `city` varchar(100) NOT NULL,
  `postal_code` varchar(20) NOT NULL DEFAULT '',
  `payment_method` varchar(50) NOT NULL DEFAULT 'cod',
  `order_status` varchar(50) NOT NULL DEFAULT 'Pending',
  `total_amount` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Table structure for table `order_items`
CREATE TABLE `order_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `order_id` varchar(100) NOT NULL,
  `product_id` varchar(100) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `size` int(11) NOT NULL,
  `color` varchar(100) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `quantity` int(11) NOT NULL,
  FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Seeding products
-- --------------------------------------------------------

INSERT INTO `products` (`id`, `name`, `slug`, `price`, `original_price`, `description`, `category`, `gender`, `images`, `is_featured`, `badge`, `rating`, `reviews_count`, `specs`, `materials`) VALUES
('velocity-stratus-v1', 'Velocity Stratus V1', 'velocity-stratus-v1', 160.00, NULL, 'Engineered for ultimate cloud-like comfort, the Stratus features a highly responsive foam midsole and a breathable engineered mesh upper. Ideal for daily runners seeking supreme cushioning and high energy return.', 'running', 'unisex', '["https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop", "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=800&auto=format&fit=crop", "https://images.unsplash.com/photo-1508184964240-ee96bb96778f?q=80&w=800&auto=format&fit=crop"]', TRUE, 'Best Seller', 4.80, 142, '["Heel-to-toe drop: 8mm", "Weight: 265g (US size 9)", "Midsole: Responsive HyperFoam technology", "Outsole: Multi-surface high-traction rubber"]', '["Upper: 100% Recycled polyester engineered mesh", "Lining: Soft breathable microfiber", "Insole: Molded Ortholite comfort bed"]'),

('velocity-aeromax-blue', 'Velocity Aeromax', 'velocity-aeromax-blue', 145.00, 180.00, 'A fusion of athletic performance and sleek street style. The Aeromax offers lightweight support with a form-fitting knit collar and dual-density cushioning that moves naturally with your foot.', 'running', 'unisex', '["https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=800&auto=format&fit=crop", "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=800&auto=format&fit=crop", "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?q=80&w=800&auto=format&fit=crop"]', FALSE, 'Sale', 4.60, 98, '["Heel-to-toe drop: 6mm", "Weight: 240g (US size 9)", "Support: Neutral stability framework", "Flexibility: Deep flex-groove tread"]', '["Upper: Dynamic AeroKnit weave", "Midsole: Ultra-light EVA blend", "Sustainability: Contains 40% ocean plastic yarn"]'),

('velocity-onyx-minimalist', 'Velocity Onyx Minimalist', 'velocity-onyx-minimalist', 130.00, NULL, 'Stripped back to the absolute essentials, the Onyx is a masterclass in modern footwear design. Featuring a premium leather lining and a seamless mesh construct, it is the perfect daily driver.', 'casual', 'unisex', '["https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop", "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=800&auto=format&fit=crop"]', TRUE, 'New', 4.90, 215, '["Profile: Low-cut lifestyle sneaker", "Weight: 220g (US size 9)", "Sole height: 25mm flat cushion", "Closure: Premium waxed cotton laces"]', '["Upper: Double-layer breathable jacquard", "Lining: Premium full-grain Nappa leather", "Outsole: Vulcanized natural rubber"]'),

('velocity-origin-classic', 'Velocity Origin Gum', 'velocity-origin-classic', 110.00, NULL, 'An archival design reimagined for today. The Origin pairs textured canvas and soft suede detailing with a retro gum sole, bringing nostalgic athletic aesthetics to your modern wardrobe.', 'casual', 'unisex', '["https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop", "https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=800&auto=format&fit=crop"]', FALSE, NULL, 4.50, 76, '["Style: Retro heritage sneakers", "Footbed: Cushioned cork-topped EVA foam", "Arch support: Moderate structured arch support"]', '["Upper: High-density organic cotton canvas & Suede trim", "Outsole: 100% Natural Forest Stewardship Council (FSC) rubber gum"]'),

('velocity-trailblazer-rugged', 'Velocity Trailblazer', 'velocity-trailblazer-rugged', 175.00, NULL, 'Engineered for off-road discovery. The Trailblazer combines a waterproof ripstop upper with high-traction, deep-lugged rubber to conquer muddy paths, rocky trails, and mountain peaks.', 'running', 'unisex', '["https://images.unsplash.com/photo-1607522370275-f14206abe5d3?q=80&w=800&auto=format&fit=crop", "https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=800&auto=format&fit=crop"]', FALSE, 'New', 4.70, 64, '["Heel-to-toe drop: 10mm", "Lugs: 5mm directional traction lugs", "Waterproofing: HydroShield breathable membrane", "Toe cap: Reinforced TPU stone guard"]', '["Upper: Ripstop ballistic nylon & Kevlar reinforcement overlays", "Midsole: Dual-density compression-molded EVA", "Outsole: High-friction MaxGrip rubber"]'),

('velocity-zenith-limited', 'Velocity Zenith Chromatic', 'velocity-zenith-limited', 240.00, NULL, 'Strictly limited. The Zenith features a futuristic chromatic design with light-reflective overlays that shift colorway in motion. Includes custom numbered branding details.', 'limited', 'unisex', '["https://images.unsplash.com/photo-1579338559194-a162d19de842?q=80&w=800&auto=format&fit=crop", "https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=800&auto=format&fit=crop"]', TRUE, 'Limited Drop', 4.95, 38, '["Series: Limited to 500 individually numbered pairs", "Reflectivity: 360-degree high-intensity 3M reflective finish", "Carbon Plate: Full-length propulsion carbon fiber shank"]', '["Upper: Translucent mono-mesh composite structure", "Lining: Seamless spandex-sleeve comfort lining", "Insole: Premium cork cushioning"]'),

('velocity-luna-knit-women', 'Velocity Luna Knit', 'velocity-luna-knit-women', 135.00, NULL, 'Designed around the unique geometry of a woman\'s foot. The Luna Knit offers a contouring sock-like collar, customized midfoot support, and a featherweight stride that feels like a natural extension of your body.', 'women', 'women', '["https://images.unsplash.com/photo-1512374382149-233c42b6a83b?q=80&w=800&auto=format&fit=crop", "https://images.unsplash.com/photo-1514989940723-e8e51635b782?q=80&w=800&auto=format&fit=crop"]', FALSE, NULL, 4.70, 112, '["Gender: Female specific last shape", "Heel-to-toe drop: 7mm", "Weight: 195g (US women size 7)", "Sole: Lightweight responsive cushion"]', '["Upper: Form-fitting FlyWeave yarn knit", "Midsole: Bio-based sugarcane SweetFoam", "Insole: Odor-resistant merino wool lining"]'),

('velocity-eco-breeze', 'Velocity Eco Breeze', 'velocity-eco-breeze', 120.00, NULL, 'Our most sustainable shoe yet. Crafted with carbon-neutral materials, the Eco Breeze provides breezy ventilation and soft, natural cushioning that treads lightly on the planet.', 'casual', 'unisex', '["https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?q=80&w=800&auto=format&fit=crop", "https://images.unsplash.com/photo-1560343090-f0409e92791a?q=80&w=800&auto=format&fit=crop"]', FALSE, 'Best Seller', 4.80, 156, '["Carbon footprint: 4.8kg CO2e (industry avg: ~14kg)", "Ventilation: High-breathability open knit structure", "Machine Washable: Yes, on delicate/cold cycle"]', '["Upper: 100% eucalyptus tree fiber weave", "Midsole: SweetFoam sugarcane-based EVA", "Laces: Made from 100% recycled plastic bottles"]'),

('velocity-phantom-pro', 'Velocity Phantom Pro', 'velocity-phantom-pro', 250.00, NULL, 'An elite racing shoe built to crush personal records. Featuring a stiff carbon fiber plate and our thickest stack of resilient nitrogen-infused foam, the Phantom Pro propels you forward with every stride.', 'running', 'unisex', '["https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?q=80&w=800&auto=format&fit=crop", "https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=800&auto=format&fit=crop"]', FALSE, 'New', 4.90, 57, '["Midsole: Nitrogen-injected MaxSpeed foam stack", "Plate: Full-length curve-profile carbon fiber plate", "Weight: 185g (featherlight weight)", "Stack height: 39.5mm heel / 31.5mm forefoot"]', '["Upper: Hyper-breathable engineered monofilament mesh", "Laces: Non-slip ribbed racing laces", "Outsole: Aerated lightweight traction rubber"]'),

('velocity-apex-trainer', 'Velocity Apex Trainer', 'velocity-apex-trainer', 130.00, NULL, 'A versatile cross-training shoe designed for high-intensity gym workouts, lifting, and short sprints. Features a wide, stable flat base and a protective TPU cage for side-to-side stabilization.', 'men', 'men', '["https://images.unsplash.com/photo-1506076962349-337ee3387d62?q=80&w=800&auto=format&fit=crop", "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?q=80&w=800&auto=format&fit=crop"]', FALSE, NULL, 4.40, 83, '["Drop: 4mm low drop for lifting stability", "Base: Wide heel footprint for squatting support", "Outsole: Gripper rubber wrap-ups for rope climbs"]', '["Upper: Abrasion-resistant honeycomb weave mesh", "Cage: Reinforced TPU wrap-around stability cage", "Midsole: Medium-density supportive compound"]');

-- --------------------------------------------------------
-- Seeding product variants (sizes and stock)
-- --------------------------------------------------------

INSERT INTO `product_variants` (`product_id`, `size`, `stock_quantity`) VALUES
-- velocity-stratus-v1
('velocity-stratus-v1', 38, 12),
('velocity-stratus-v1', 39, 15),
('velocity-stratus-v1', 40, 20),
('velocity-stratus-v1', 41, 18),
('velocity-stratus-v1', 42, 22),
('velocity-stratus-v1', 43, 16),
('velocity-stratus-v1', 44, 10),
('velocity-stratus-v1', 45, 8),
('velocity-stratus-v1', 46, 5),

-- velocity-aeromax-blue
('velocity-aeromax-blue', 39, 10),
('velocity-aeromax-blue', 40, 12),
('velocity-aeromax-blue', 41, 15),
('velocity-aeromax-blue', 42, 14),
('velocity-aeromax-blue', 43, 8),
('velocity-aeromax-blue', 44, 6),
('velocity-aeromax-blue', 45, 4),

-- velocity-onyx-minimalist
('velocity-onyx-minimalist', 38, 5),
('velocity-onyx-minimalist', 39, 8),
('velocity-onyx-minimalist', 40, 10),
('velocity-onyx-minimalist', 41, 12),
('velocity-onyx-minimalist', 42, 15),
('velocity-onyx-minimalist', 43, 10),
('velocity-onyx-minimalist', 44, 8),
('velocity-onyx-minimalist', 45, 6),
('velocity-onyx-minimalist', 46, 4),

-- velocity-origin-classic
('velocity-origin-classic', 38, 10),
('velocity-origin-classic', 39, 12),
('velocity-origin-classic', 40, 15),
('velocity-origin-classic', 41, 10),
('velocity-origin-classic', 42, 12),
('velocity-origin-classic', 43, 8),
('velocity-origin-classic', 44, 5),

-- velocity-trailblazer-rugged
('velocity-trailblazer-rugged', 40, 6),
('velocity-trailblazer-rugged', 41, 8),
('velocity-trailblazer-rugged', 42, 10),
('velocity-trailblazer-rugged', 43, 12),
('velocity-trailblazer-rugged', 44, 8),
('velocity-trailblazer-rugged', 45, 6),
('velocity-trailblazer-rugged', 46, 4),

-- velocity-zenith-limited
('velocity-zenith-limited', 41, 3),
('velocity-zenith-limited', 42, 5),
('velocity-zenith-limited', 43, 4),
('velocity-zenith-limited', 44, 2),
('velocity-zenith-limited', 45, 1),

-- velocity-luna-knit-women
('velocity-luna-knit-women', 36, 8),
('velocity-luna-knit-women', 37, 10),
('velocity-luna-knit-women', 38, 12),
('velocity-luna-knit-women', 39, 14),
('velocity-luna-knit-women', 40, 10),
('velocity-luna-knit-women', 41, 6),

-- velocity-eco-breeze
('velocity-eco-breeze', 38, 15),
('velocity-eco-breeze', 39, 18),
('velocity-eco-breeze', 40, 20),
('velocity-eco-breeze', 41, 22),
('velocity-eco-breeze', 42, 25),
('velocity-eco-breeze', 43, 18),
('velocity-eco-breeze', 44, 12),
('velocity-eco-breeze', 45, 10),

-- velocity-phantom-pro
('velocity-phantom-pro', 40, 5),
('velocity-phantom-pro', 41, 6),
('velocity-phantom-pro', 42, 8),
('velocity-phantom-pro', 43, 10),
('velocity-phantom-pro', 44, 5),
('velocity-phantom-pro', 45, 4),
('velocity-phantom-pro', 46, 2),

-- velocity-apex-trainer
('velocity-apex-trainer', 39, 0),
('velocity-apex-trainer', 40, 0),
('velocity-apex-trainer', 41, 0),
('velocity-apex-trainer', 42, 0),
('velocity-apex-trainer', 43, 0),
('velocity-apex-trainer', 44, 0),
('velocity-apex-trainer', 45, 0),
('velocity-apex-trainer', 46, 0);

-- --------------------------------------------------------
-- Seeding standard test orders and order items
-- --------------------------------------------------------

INSERT INTO `orders` (`id`, `customer_name`, `customer_email`, `customer_phone`, `shipping_address`, `city`, `postal_code`, `payment_method`, `order_status`, `total_amount`) VALUES
('order_1', 'Jane Doe', 'jane@example.com', '+1 (555) 123-4567', '456 Fashion Ave', 'New York', '10001', 'cod', 'Pending', 345.60),
('order_2', 'Alex Runner', 'alex@example.com', '+1 (555) 987-6543', '789 Trail Road', 'Denver', '80201', 'card', 'Shipped', 160.00);

INSERT INTO `order_items` (`order_id`, `product_id`, `product_name`, `size`, `color`, `price`, `quantity`) VALUES
('order_1', 'velocity-stratus-v1', 'Velocity Stratus V1', 40, 'Infrared Red', 160.00, 1),
('order_1', 'velocity-aeromax-blue', 'Velocity Aeromax', 41, 'Deep Ocean Blue', 145.00, 1),
('order_2', 'velocity-stratus-v1', 'Velocity Stratus V1', 42, 'Infrared Red', 160.00, 1);
