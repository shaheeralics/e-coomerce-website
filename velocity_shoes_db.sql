-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Aug 30, 2026 at 10:39 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `velocity_shoes_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `category_settings`
--

CREATE TABLE `category_settings` (
  `category_name` varchar(100) NOT NULL,
  `is_visible` tinyint(1) NOT NULL DEFAULT 1,
  `sort_order` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `category_settings`
--

INSERT INTO `category_settings` (`category_name`, `is_visible`, `sort_order`) VALUES
('Casual', 1, 3),
('Kids', 1, 2),
('Limited Drops', 1, 5),
('Men', 1, 0),
('Running', 1, 4),
('Women', 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `custom_pages`
--

CREATE TABLE `custom_pages` (
  `id` varchar(100) NOT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `is_published` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `sort_order` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `custom_pages`
--

INSERT INTO `custom_pages` (`id`, `title`, `slug`, `content`, `is_published`, `created_at`, `sort_order`) VALUES
('\0', 'about-us', 'about-velocity', 'about-us', 1, '2026-08-27 08:20:01', 0);

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` varchar(100) NOT NULL,
  `customer_name` varchar(255) NOT NULL,
  `customer_email` varchar(255) NOT NULL,
  `customer_phone` varchar(50) NOT NULL DEFAULT '',
  `shipping_address` text NOT NULL,
  `city` varchar(100) NOT NULL,
  `postal_code` varchar(20) NOT NULL DEFAULT '',
  `payment_method` varchar(50) NOT NULL DEFAULT 'cod',
  `order_status` varchar(50) NOT NULL DEFAULT 'Pending',
  `total_amount` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `user_id` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `customer_name`, `customer_email`, `customer_phone`, `shipping_address`, `city`, `postal_code`, `payment_method`, `order_status`, `total_amount`, `created_at`, `user_id`) VALUES
('order_1', 'Jane Doe', 'jane@example.com', '+1 (555) 123-4567', '456 Fashion Ave', 'New York', '10001', 'cod', 'Cancelled', 345.60, '2026-08-20 09:59:46', NULL),
('order_2', 'Alex Runner', 'alex@example.com', '+1 (555) 987-6543', '789 Trail Road', 'Denver', '80201', 'card', 'Completed', 160.00, '2026-08-20 09:59:46', NULL),
('order_nybxywff0', 'Mehirban Ali', 'mehirbanali139@gmail.com', '', 'Mohala Haji Abad shinkiari tahsil baffa district Mansehra', 'shinkiari/Mansehra', '21140', 'cod', 'Shipped', 119.00, '2026-08-20 10:22:21', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` varchar(100) NOT NULL,
  `product_id` varchar(100) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `size` int(11) NOT NULL,
  `color` varchar(100) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `quantity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `product_name`, `size`, `color`, `price`, `quantity`) VALUES
(1, 'order_1', 'velocity-stratus-v1', 'Velocity Stratus V1', 40, 'Infrared Red', 160.00, 1),
(2, 'order_1', 'velocity-aeromax-blue', 'Velocity Aeromax', 41, 'Deep Ocean Blue', 145.00, 1),
(3, 'order_2', 'velocity-stratus-v1', 'Velocity Stratus V1', 42, 'Infrared Red', 160.00, 1),
(4, 'order_nybxywff0', 'velocity-origin-classic', 'Velocity Origin Gum', 38, 'Desert Sand / Gum', 110.00, 1);

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` varchar(100) NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `brand` varchar(100) NOT NULL DEFAULT 'VELOCITY',
  `price` decimal(10,2) NOT NULL,
  `original_price` decimal(10,2) DEFAULT NULL,
  `description` text NOT NULL,
  `category` varchar(100) NOT NULL,
  `gender` varchar(50) NOT NULL,
  `images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`images`)),
  `is_featured` tinyint(1) NOT NULL DEFAULT 0,
  `badge` varchar(100) DEFAULT NULL,
  `rating` decimal(3,2) NOT NULL DEFAULT 5.00,
  `reviews_count` int(11) NOT NULL DEFAULT 0,
  `specs` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`specs`)),
  `materials` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`materials`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `slug`, `brand`, `price`, `original_price`, `description`, `category`, `gender`, `images`, `is_featured`, `badge`, `rating`, `reviews_count`, `specs`, `materials`, `created_at`, `is_deleted`) VALUES
('velocity-aeromax-blue', 'Velocity Aeromax', 'velocity-aeromax-blue', 'VELOCITY', 145.00, 180.00, 'A fusion of athletic performance and sleek street style. The Aeromax offers lightweight support with a form-fitting knit collar and dual-density cushioning that moves naturally with your foot.', 'running', 'unisex', '[\"https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=800&auto=format&fit=crop\", \"https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=800&auto=format&fit=crop\", \"https://images.unsplash.com/photo-1460353581641-37baddab0fa2?q=80&w=800&auto=format&fit=crop\"]', 0, 'Sale', 4.60, 98, '[\"Heel-to-toe drop: 6mm\", \"Weight: 240g (US size 9)\", \"Support: Neutral stability framework\", \"Flexibility: Deep flex-groove tread\"]', '[\"Upper: Dynamic AeroKnit weave\", \"Midsole: Ultra-light EVA blend\", \"Sustainability: Contains 40% ocean plastic yarn\"]', '2026-08-20 09:59:46', 0),
('velocity-apex-trainer', 'Velocity Apex Trainer', 'velocity-apex-trainer', 'VELOCITY', 130.00, NULL, 'A versatile cross-training shoe designed for high-intensity gym workouts, lifting, and short sprints. Features a wide, stable flat base and a protective TPU cage for side-to-side stabilization.', 'men', 'men', '[\"https://images.unsplash.com/photo-1506076962349-337ee3387d62?q=80&w=800&auto=format&fit=crop\", \"https://images.unsplash.com/photo-1460353581641-37baddab0fa2?q=80&w=800&auto=format&fit=crop\"]', 0, NULL, 4.40, 83, '[\"Drop: 4mm low drop for lifting stability\", \"Base: Wide heel footprint for squatting support\", \"Outsole: Gripper rubber wrap-ups for rope climbs\"]', '[\"Upper: Abrasion-resistant honeycomb weave mesh\", \"Cage: Reinforced TPU wrap-around stability cage\", \"Midsole: Medium-density supportive compound\"]', '2026-08-20 09:59:46', 0),
('velocity-luna-knit-women', 'Velocity Luna Knit', 'velocity-luna-knit-women', 'VELOCITY', 135.00, NULL, 'Designed around the unique geometry of a woman\'s foot. The Luna Knit offers a contouring sock-like collar, customized midfoot support, and a featherweight stride that feels like a natural extension of your body.', 'women', 'women', '[\"https://images.unsplash.com/photo-1512374382149-233c42b6a83b?q=80&w=800&auto=format&fit=crop\", \"https://images.unsplash.com/photo-1514989940723-e8e51635b782?q=80&w=800&auto=format&fit=crop\"]', 0, NULL, 4.70, 112, '[\"Gender: Female specific last shape\", \"Heel-to-toe drop: 7mm\", \"Weight: 195g (US women size 7)\", \"Sole: Lightweight responsive cushion\"]', '[\"Upper: Form-fitting FlyWeave yarn knit\", \"Midsole: Bio-based sugarcane SweetFoam\", \"Insole: Odor-resistant merino wool lining\"]', '2026-08-20 09:59:46', 0),
('velocity-onyx-minimalist', 'Velocity Onyx Minimalist', 'velocity-onyx-minimalist', 'VELOCITY', 130.00, NULL, 'Stripped back to the absolute essentials, the Onyx is a masterclass in modern footwear design. Featuring a premium leather lining and a seamless mesh construct, it is the perfect daily driver.', 'casual', 'unisex', '[\"https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop\", \"https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=800&auto=format&fit=crop\"]', 1, 'New', 4.90, 215, '[\"Profile: Low-cut lifestyle sneaker\", \"Weight: 220g (US size 9)\", \"Sole height: 25mm flat cushion\", \"Closure: Premium waxed cotton laces\"]', '[\"Upper: Double-layer breathable jacquard\", \"Lining: Premium full-grain Nappa leather\", \"Outsole: Vulcanized natural rubber\"]', '2026-08-20 09:59:46', 0),
('velocity-origin-classic', 'Velocity Origin Gum', 'velocity-origin-classic', 'VELOCITY', 110.00, NULL, 'An archival design reimagined for today. The Origin pairs textured canvas and soft suede detailing with a retro gum sole, bringing nostalgic athletic aesthetics to your modern wardrobe.', 'casual', 'unisex', '[\"https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop\", \"https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=800&auto=format&fit=crop\"]', 0, NULL, 4.50, 76, '[\"Style: Retro heritage sneakers\", \"Footbed: Cushioned cork-topped EVA foam\", \"Arch support: Moderate structured arch support\"]', '[\"Upper: High-density organic cotton canvas & Suede trim\", \"Outsole: 100% Natural Forest Stewardship Council (FSC) rubber gum\"]', '2026-08-20 09:59:46', 0),
('velocity-phantom-pro', 'Velocity Phantom Pro', 'velocity-phantom-pro', 'VELOCITY', 250.00, NULL, 'An elite racing shoe built to crush personal records. Featuring a stiff carbon fiber plate and our thickest stack of resilient nitrogen-infused foam, the Phantom Pro propels you forward with every stride.', 'running', 'unisex', '[\"https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?q=80&w=800&auto=format&fit=crop\", \"https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=800&auto=format&fit=crop\"]', 0, 'New', 4.90, 57, '[\"Midsole: Nitrogen-injected MaxSpeed foam stack\", \"Plate: Full-length curve-profile carbon fiber plate\", \"Weight: 185g (featherlight weight)\", \"Stack height: 39.5mm heel / 31.5mm forefoot\"]', '[\"Upper: Hyper-breathable engineered monofilament mesh\", \"Laces: Non-slip ribbed racing laces\", \"Outsole: Aerated lightweight traction rubber\"]', '2026-08-20 09:59:46', 0),
('velocity-stratus-v1', 'Velocity Stratus V1', 'velocity-stratus-v1', 'VELOCITY', 160.00, NULL, 'Engineered for ultimate cloud-like comfort, the Stratus features a highly responsive foam midsole and a breathable engineered mesh upper. Ideal for daily runners seeking supreme cushioning and high energy return.', 'running', 'unisex', '[\"https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop\", \"https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=800&auto=format&fit=crop\", \"https://images.unsplash.com/photo-1508184964240-ee96bb96778f?q=80&w=800&auto=format&fit=crop\"]', 1, 'Best Seller', 4.80, 142, '[\"Heel-to-toe drop: 8mm\", \"Weight: 265g (US size 9)\", \"Midsole: Responsive HyperFoam technology\", \"Outsole: Multi-surface high-traction rubber\"]', '[\"Upper: 100% Recycled polyester engineered mesh\", \"Lining: Soft breathable microfiber\", \"Insole: Molded Ortholite comfort bed\"]', '2026-08-20 09:59:46', 0),
('velocity-trailblazer-rugged', 'Velocity Trailblazer', 'velocity-trailblazer-rugged', 'VELOCITY', 175.00, NULL, 'Engineered for off-road discovery. The Trailblazer combines a waterproof ripstop upper with high-traction, deep-lugged rubber to conquer muddy paths, rocky trails, and mountain peaks.', 'running', 'unisex', '[\"https://images.unsplash.com/photo-1607522370275-f14206abe5d3?q=80&w=800&auto=format&fit=crop\", \"https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=800&auto=format&fit=crop\"]', 0, 'New', 4.70, 64, '[\"Heel-to-toe drop: 10mm\", \"Lugs: 5mm directional traction lugs\", \"Waterproofing: HydroShield breathable membrane\", \"Toe cap: Reinforced TPU stone guard\"]', '[\"Upper: Ripstop ballistic nylon & Kevlar reinforcement overlays\", \"Midsole: Dual-density compression-molded EVA\", \"Outsole: High-friction MaxGrip rubber\"]', '2026-08-20 09:59:46', 0),
('velocity-zenith-limited', 'Velocity Zenith Chromatic', 'velocity-zenith-limited', 'VELOCITY', 240.00, NULL, 'Strictly limited. The Zenith features a futuristic chromatic design with light-reflective overlays that shift colorway in motion. Includes custom numbered branding details.', 'limited', 'unisex', '[\"https://images.unsplash.com/photo-1579338559194-a162d19de842?q=80&w=800&auto=format&fit=crop\", \"https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=800&auto=format&fit=crop\"]', 1, 'Limited Drop', 4.95, 38, '[\"Series: Limited to 500 individually numbered pairs\", \"Reflectivity: 360-degree high-intensity 3M reflective finish\", \"Carbon Plate: Full-length propulsion carbon fiber shank\"]', '[\"Upper: Translucent mono-mesh composite structure\", \"Lining: Seamless spandex-sleeve comfort lining\", \"Insole: Premium cork cushioning\"]', '2026-08-20 09:59:46', 0);

-- --------------------------------------------------------

--
-- Table structure for table `product_variants`
--

CREATE TABLE `product_variants` (
  `id` int(11) NOT NULL,
  `product_id` varchar(100) NOT NULL,
  `size` int(11) NOT NULL,
  `stock_quantity` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_variants`
--

INSERT INTO `product_variants` (`id`, `product_id`, `size`, `stock_quantity`) VALUES
(1, 'velocity-stratus-v1', 38, 12),
(2, 'velocity-stratus-v1', 39, 15),
(3, 'velocity-stratus-v1', 40, 20),
(4, 'velocity-stratus-v1', 41, 18),
(5, 'velocity-stratus-v1', 42, 22),
(6, 'velocity-stratus-v1', 43, 16),
(7, 'velocity-stratus-v1', 44, 10),
(8, 'velocity-stratus-v1', 45, 8),
(9, 'velocity-stratus-v1', 46, 5),
(10, 'velocity-aeromax-blue', 39, 10),
(11, 'velocity-aeromax-blue', 40, 12),
(12, 'velocity-aeromax-blue', 41, 15),
(13, 'velocity-aeromax-blue', 42, 14),
(14, 'velocity-aeromax-blue', 43, 8),
(15, 'velocity-aeromax-blue', 44, 6),
(16, 'velocity-aeromax-blue', 45, 4),
(17, 'velocity-onyx-minimalist', 38, 5),
(18, 'velocity-onyx-minimalist', 39, 8),
(19, 'velocity-onyx-minimalist', 40, 10),
(20, 'velocity-onyx-minimalist', 41, 12),
(21, 'velocity-onyx-minimalist', 42, 15),
(22, 'velocity-onyx-minimalist', 43, 10),
(23, 'velocity-onyx-minimalist', 44, 8),
(24, 'velocity-onyx-minimalist', 45, 6),
(25, 'velocity-onyx-minimalist', 46, 4),
(26, 'velocity-origin-classic', 38, 9),
(27, 'velocity-origin-classic', 39, 12),
(28, 'velocity-origin-classic', 40, 15),
(29, 'velocity-origin-classic', 41, 10),
(30, 'velocity-origin-classic', 42, 12),
(31, 'velocity-origin-classic', 43, 8),
(32, 'velocity-origin-classic', 44, 5),
(33, 'velocity-trailblazer-rugged', 40, 6),
(34, 'velocity-trailblazer-rugged', 41, 8),
(35, 'velocity-trailblazer-rugged', 42, 10),
(36, 'velocity-trailblazer-rugged', 43, 12),
(37, 'velocity-trailblazer-rugged', 44, 8),
(38, 'velocity-trailblazer-rugged', 45, 6),
(39, 'velocity-trailblazer-rugged', 46, 4),
(40, 'velocity-zenith-limited', 41, 3),
(41, 'velocity-zenith-limited', 42, 5),
(42, 'velocity-zenith-limited', 43, 4),
(43, 'velocity-zenith-limited', 44, 2),
(44, 'velocity-zenith-limited', 45, 1),
(45, 'velocity-luna-knit-women', 36, 8),
(46, 'velocity-luna-knit-women', 37, 10),
(47, 'velocity-luna-knit-women', 38, 12),
(48, 'velocity-luna-knit-women', 39, 14),
(49, 'velocity-luna-knit-women', 40, 10),
(50, 'velocity-luna-knit-women', 41, 6),
(59, 'velocity-phantom-pro', 40, 5),
(60, 'velocity-phantom-pro', 41, 6),
(61, 'velocity-phantom-pro', 42, 8),
(62, 'velocity-phantom-pro', 43, 10),
(63, 'velocity-phantom-pro', 44, 5),
(64, 'velocity-phantom-pro', 45, 4),
(65, 'velocity-phantom-pro', 46, 2),
(66, 'velocity-apex-trainer', 39, 0),
(67, 'velocity-apex-trainer', 40, 0),
(68, 'velocity-apex-trainer', 41, 0),
(69, 'velocity-apex-trainer', 42, 0),
(70, 'velocity-apex-trainer', 43, 0),
(71, 'velocity-apex-trainer', 44, 0),
(72, 'velocity-apex-trainer', 45, 0),
(73, 'velocity-apex-trainer', 46, 0);

-- --------------------------------------------------------

--
-- Table structure for table `store_locations`
--

CREATE TABLE `store_locations` (
  `id` varchar(100) NOT NULL,
  `name` varchar(255) NOT NULL,
  `address` text NOT NULL,
  `map_url` text NOT NULL,
  `timings` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `store_locations`
--

INSERT INTO `store_locations` (`id`, `name`, `address`, `map_url`, `timings`, `created_at`) VALUES
('store_lahore_1', 'Velocity Lahore Flagship', 'M.M. Alam Road, Gulberg III, Lahore, Pakistan', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3401.372439265239!2d74.348612!3d31.513904!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3919045bda0a8f85%3A0x67db23af7e0340c2!2sM.M.%20Alam%20Rd%2C%20Lahore!5e0!3m2!1sen!2spk!4v1700000000000', 'Mon - Sat: 11:00 AM - 10:00 PM, Sun: 2:00 PM - 8:00 PM', '2026-08-27 08:20:01');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` varchar(100) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `role` varchar(50) NOT NULL DEFAULT 'customer'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `created_at`, `role`) VALUES
('user_admin_velocity', 'Velocity Admin', 'admin@velocity.com', '8233f09d026482afe9047b02c4a340f9:6db70c62572a8a5230cb6c42f1d6ff99802b1c1c750326311bb2ab909e623f9f893d95c8ce8c26b2050e96eda81dab32e1553c17063f10e11a4f399a96f35cef', '2026-08-26 12:54:20', 'admin');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `category_settings`
--
ALTER TABLE `category_settings`
  ADD PRIMARY KEY (`category_name`);

--
-- Indexes for table `custom_pages`
--
ALTER TABLE `custom_pages`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `product_variants`
--
ALTER TABLE `product_variants`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `store_locations`
--
ALTER TABLE `store_locations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `product_variants`
--
ALTER TABLE `product_variants`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=74;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `product_variants`
--
ALTER TABLE `product_variants`
  ADD CONSTRAINT `product_variants_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
