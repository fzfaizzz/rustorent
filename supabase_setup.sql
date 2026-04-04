-- FULL SQL Migration Script for D VEG WOK
-- Run this in the Supabase SQL Editor

-- 0. Schema Reset (Guarantees clean tables for perfect matches)
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.reservations CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.reviews CASCADE;
DROP TABLE IF EXISTS public.messages CASCADE;

-- 1. Create Tables
CREATE TABLE public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    message TEXT NOT NULL,
    user_email TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    status TEXT DEFAULT 'unread'
);

CREATE TABLE public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    short_id TEXT NOT NULL,
    items JSONB DEFAULT '[]'::jsonb,
    total DECIMAL(10, 2) NOT NULL,
    address JSONB DEFAULT '{}'::jsonb,
    status TEXT DEFAULT 'Placed',
    payment_method TEXT DEFAULT 'cod',
    user_id TEXT,
    customer_email TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- reservations table
CREATE TABLE public.reservations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    date DATE NOT NULL,
    time_from TIME NOT NULL,
    time_to TIME NOT NULL,
    table_number INTEGER NOT NULL,
    guests INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    description TEXT,
    image TEXT,
    ingredients JSONB DEFAULT '[]'::jsonb,
    category TEXT NOT NULL,
    is_veg BOOLEAN DEFAULT true,
    in_stock BOOLEAN DEFAULT true,
    prep_time INTEGER DEFAULT 15,
    rating DECIMAL(2, 1) DEFAULT 4.5,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Products
CREATE POLICY "Allow public read access to products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow admin to manage products" ON public.products FOR ALL USING (true);

-- Reviews
CREATE POLICY "Allow public read access to reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Allow public to insert reviews" ON public.reviews FOR INSERT WITH CHECK (true);

-- Orders
CREATE POLICY "Anyone can create orders" ON public.orders FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Anyone can read orders" ON public.orders FOR SELECT TO public USING (true);
CREATE POLICY "Allow admin to manage orders" ON public.orders FOR ALL USING (true);

-- Reservations
CREATE POLICY "Anyone can create reservations" ON public.reservations FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Anyone can read reservations" ON public.reservations FOR SELECT TO public USING (true);
CREATE POLICY "Admins can manage reservations" ON public.reservations FOR ALL TO public USING (true) WITH CHECK (true);

-- Messages
CREATE POLICY "Anyone can submit messages" ON public.messages FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Admins can manage messages" ON public.messages FOR ALL TO public USING (true) WITH CHECK (true);

-- 3. Data Migration (Full Menu)
INSERT INTO public.products (id, name, price, category, is_veg, description, image, ingredients, prep_time, rating) VALUES 
('hot-sour-soup', 'Hot & Sour Soup', 120, 'Veg Soup', true, 'A spicy and tangy Chinese-style soup made with mixed vegetables, soy sauce, and a hint of vinegar.', 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500&h=500&fit=crop', '["Carrots", "Cabbage", "Mushrooms", "Soy Sauce", "Vinegar", "White Pepper", "Spring Onions"]', 15, 4.5),
('manchow-soup', 'Manchow Soup', 130, 'Veg Soup', true, 'A popular Indo-Chinese dark brown soup loaded with finely chopped vegetables and topped with crispy fried noodles.', 'https://images.unsplash.com/photo-1548943487-a2e4b43b4850?w=500&h=500&fit=crop', '["Mixed Veggies", "Garlic", "Ginger", "Soy Sauce", "Crispy Noodles", "Coriander"]', 15, 4.6),
('sweet-corn-soup', 'Sweet Corn Soup', 110, 'Veg Soup', true, 'A comforting, thick and creamy soup made with sweet corn kernels and mild spices.', 'https://images.unsplash.com/photo-1620315809706-e3d1acae87ee?w=500&h=500&fit=crop', '["Sweet Corn", "Carrots", "Vegetable Broth", "Corn Flour", "White Pepper"]', 12, 4.4),
('paneer-tikka', 'Paneer Tikka', 220, 'Veg Starters', true, 'Soft cubes of paneer marinated in a spiced yogurt mixture and grilled to perfection.', 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&h=500&fit=crop', '["Cottage Cheese (Paneer)", "Yogurt", "Gram Flour", "Tandoori Masala", "Bell Peppers", "Onions"]', 25, 4.9),
('veg-manchurian-dry', 'Veg Manchurian Dry', 180, 'Veg Starters', true, 'Deep-fried vegetable dumplings tossed in a savory, sweet, tangy, and spicy Indo-Chinese sauce.', 'https://images.unsplash.com/photo-1555126634-ae3c1ac348a0?w=500&h=500&fit=crop', '["Cabbage", "Carrots", "Capsicum", "Soy Sauce", "Ginger", "Garlic", "Chilli Sauce"]', 20, 4.7),
('crispy-corn', 'Crispy Corn', 160, 'Veg Starters', true, 'Sweet corn kernels coated with a seasoned batter, deep-fried until golden and crispy.', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&h=500&fit=crop', '["Sweet Corn", "Corn Flour", "Rice Flour", "Black Pepper", "Chaat Masala", "Lemon Juice"]', 15, 4.5),
('spring-roll', 'Spring Roll', 150, 'Veg Starters', true, 'Crispy, golden-fried wrappers filled with a savory mixture of stir-fried vegetables and noodles.', 'https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?w=500&h=500&fit=crop', '["Spring Roll Wrappers", "Cabbage", "Carrots", "Noodles", "Soy Sauce", "Black Pepper"]', 20, 4.6),
('veg-manchurian-gravy', 'Veg Manchurian Gravy', 190, 'Chinese', true, 'Vegetable dumplings cooked in a rich, dark, spicy, and tangy soy-based gravy.', 'https://images.unsplash.com/photo-1555507036-ab1e4006aa07?w=500&h=500&fit=crop', '["Mixed Veggies", "Soy Sauce", "Vinegar", "Chilli Sauce", "Corn Starch", "Garlic"]', 25, 4.8),
('chilli-paneer', 'Chilli Paneer', 230, 'Chinese', true, 'Crispy fried paneer cubes tossed in a spicy, sweet, and tangy sauce.', 'https://images.unsplash.com/photo-1631452180519-c014fe946bc0?w=500&h=500&fit=crop', '["Paneer", "Capsicum", "Onions", "Soy Sauce", "Green Chillies", "Tomato Ketchup"]', 20, 4.7),
('veg-schezwan', 'Veg Schezwan', 200, 'Chinese', true, 'Mixed vegetables stir-fried in a fiery and flavorful homemade Schezwan sauce.', 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=500&h=500&fit=crop', '["Mixed Veggies", "Dry Red Chillies", "Garlic", "Sichuan Peppercorns", "Vinegar"]', 20, 4.5),
('honey-chilli-potato', 'Honey Chilli Potato', 180, 'Chinese', true, 'Crispy potato wedges tossed in a sweet, spicy, and sticky honey chilli glaze.', 'https://images.unsplash.com/photo-1541592102781-efbea0db06ce?w=500&h=500&fit=crop', '["Potatoes", "Honey", "Soy Sauce", "Chilli Flakes", "Sesame Seeds", "Garlic"]', 25, 4.6),
('paneer-butter-masala', 'Paneer Butter Masala', 250, 'Paneer Special', true, 'A rich and creamy North Indian curry made with soft paneer cubes.', 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=500&h=500&fit=crop', '["Paneer", "Tomatoes", "Cashews", "Butter", "Cream", "Garam Masala", "Kasuri Methi"]', 30, 4.9),
('shahi-paneer', 'Shahi Paneer', 240, 'Paneer Special', true, 'A royal Mughal dish where paneer is cooked in a rich, white gravy.', 'https://images.unsplash.com/photo-1546833999-b1ff20092ebad?w=500&h=500&fit=crop', '["Paneer", "Cashews", "Almonds", "Cream", "Cardamom", "Saffron", "White Pepper"]', 30, 4.8),
('kadai-paneer', 'Kadai Paneer', 230, 'Paneer Special', true, 'A spicy, flavorful dish made by cooking paneer and bell peppers.', 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&h=500&fit=crop', '["Paneer", "Capsicum", "Onions", "Tomatoes", "Coriander Seeds", "Dry Red Chillies"]', 25, 4.7),
('paneer-do-pyaza', 'Paneer Do Pyaza', 235, 'Paneer Special', true, 'A rich, hearty curry made with paneer and a double amount of onions.', 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=500&h=500&fit=crop', '["Paneer", "Lots of Onions", "Tomatoes", "Ginger", "Garlic", "Indian Spices"]', 25, 4.6),
('dal-tadka', 'Dal Tadka', 160, 'Indian Main Course', true, 'A comforting dish of smoothly cooked yellow lentils tempered with ghee.', 'https://images.unsplash.com/photo-1582515073490-39981397c445?w=500&h=500&fit=crop', '["Toor Dal", "Moong Dal", "Ghee", "Cumin", "Garlic", "Dry Red Chillies", "Tomatoes"]', 20, 4.7),
('dal-makhani', 'Dal Makhani', 190, 'Indian Main Course', true, 'A rich, creamy, and slow-cooked traditional Punjabi dish.', 'https://images.unsplash.com/photo-1546833999-b1ff20092ebad?w=500&h=500&fit=crop', '["Black Urad Dal", "Rajma (Kidney Beans)", "Butter", "Cream", "Tomato Puree", "Garam Masala"]', 40, 4.8),
('mix-veg-curry', 'Mix Veg Curry', 180, 'Indian Main Course', true, 'A medley of seasonal vegetables cooked in a flavorful onion-tomato gravy.', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=500&fit=crop', '["Cauliflower", "Carrots", "Peas", "Beans", "Potatoes", "Onion-Tomato Gravy", "Spices"]', 25, 4.5),
('aloo-gobi', 'Aloo Gobi', 170, 'Indian Main Course', true, 'A classic dry Indian dish made with potatoes and cauliflower.', 'https://images.unsplash.com/photo-1543826173-70651703c5a4?w=500&h=500&fit=crop', '["Potatoes", "Cauliflower", "Turmeric", "Cumin", "Ginger", "Coriander Leaves"]', 25, 4.4),
('veg-biryani', 'Veg Biryani', 200, 'Biryani', true, 'A highly aromatic and delicious dish made with basmati rice and mixed vegetables.', 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&h=500&fit=crop', '["Basmati Rice", "Mixed Vegetables", "Biryani Masala", "Mint Leaves", "Fried Onions", "Saffron", "Ghee"]', 35, 4.8),
('paneer-biryani', 'Paneer Biryani', 240, 'Biryani', true, 'An indulgent, layered dish of fragrant basmati rice and a spicy paneer gravy.', 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=500&h=500&fit=crop', '["Basmati Rice", "Paneer", "Yogurt", "Biryani Spices", "Fried Onions", "Mint", "Rose Water"]', 35, 4.9),
('mushroom-biryani', 'Mushroom Biryani', 220, 'Biryani', true, 'Earthy mushrooms and aromatic basmati rice cooked together with rich spices.', 'https://images.unsplash.com/photo-1603569283847-aa295f0d016a?w=500&h=500&fit=crop', '["Basmati Rice", "Button Mushrooms", "Biryani Spices", "Coriander", "Fried Onions"]', 30, 4.6),
('veg-hakka-noodles', 'Veg Hakka Noodles', 170, 'Noodles', true, 'Classic Indo-Chinese style boiled noodles stir-fried with julienned vegetables.', 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=500&h=500&fit=crop', '["Noodles", "Cabbage", "Carrots", "Capsicum", "Soy Sauce", "Spring Onions", "White Pepper"]', 15, 4.7),
('schezwan-noodles', 'Schezwan Noodles', 180, 'Noodles', true, 'Spicy and tangy noodles stir-fried with vegetables and Schezwan sauce.', 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500&h=500&fit=crop', '["Noodles", "Schezwan Sauce", "Mixed Veggies", "Garlic", "Chilli Flakes", "Spring Onions"]', 15, 4.6),
('singapore-noodles', 'Singapore Noodles', 190, 'Noodles', true, 'Thin vermicelli noodles stir-fried with vegetables and a distinct curry powder flavor.', 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=500&h=500&fit=crop', '["Rice Vermicelli", "Curry Powder", "Mixed Veggies", "Turmeric", "Soy Sauce"]', 20, 4.5),
('veg-fried-rice', 'Veg Fried Rice', 160, 'Fried Rice', true, 'Aromatic basmati rice stir-fried with finely chopped vegetables and soy sauce.', 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&h=500&fit=crop', '["Cooked Rice", "Carrots", "Beans", "Spring Onions", "Soy Sauce", "White Pepper"]', 15, 4.6),
('schezwan-fried-rice', 'Schezwan Fried Rice', 180, 'Fried Rice', true, 'Fiery and flavorful fried rice tossed with vegetables and Schezwan sauce.', 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=500&h=500&fit=crop', '["Cooked Rice", "Schezwan Sauce", "Mixed Veggies", "Garlic", "Dry Red Chilli"]', 15, 4.7),
('manchurian-rice', 'Manchurian Rice', 190, 'Fried Rice', true, 'A combination of vegetable fried rice and veg manchurian gravy.', 'https://images.unsplash.com/photo-1581075678129-9bcbf738e4a7?w=500&h=500&fit=crop', '["Fried Rice", "Veg Manchurian Balls", "Manchurian Sauce", "Spring Onions", "Soy Sauce"]', 20, 4.5),
('butter-naan', 'Butter Naan', 50, 'Indian Bread', true, 'Soft, fluffy, and pillowy Indian flatbread brushed with melted butter.', 'https://images.unsplash.com/photo-1626082895617-2c6bafdf6ff6?w=500&h=500&fit=crop', '["Refined Flour (Maida)", "Yogurt", "Butter", "Baking Powder", "Salt", "Sugar"]', 10, 4.8),
('garlic-naan', 'Garlic Naan', 60, 'Indian Bread', true, 'Tandoor-baked naan infused with minced garlic and fresh coriander.', 'https://images.unsplash.com/photo-1605333396914-256163b84cc6?w=500&h=500&fit=crop', '["Refined Flour", "Minced Garlic", "Coriander Leaves", "Butter", "Yogurt"]', 10, 4.9),
('tandoori-roti', 'Tandoori Roti', 30, 'Indian Bread', true, 'Traditional whole wheat flatbread, baked on the walls of a hot tandoor oven.', 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&h=500&fit=crop', '["Whole Wheat Flour (Atta)", "Water", "Salt"]', 5, 4.5),
('laccha-paratha', 'Laccha Paratha', 55, 'Indian Bread', true, 'A multi-layered, flaky, and buttery whole wheat flatbread.', 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=500&h=500&fit=crop', '["Whole Wheat Flour", "Ghee", "Salt", "Water"]', 15, 4.6),
('gulab-jamun', 'Gulab Jamun', 80, 'Desserts', true, 'Soft, melt-in-the-mouth fried dumplings soaked in fragrant sugar syrup.', 'https://images.unsplash.com/photo-1668233367123-5e921dcdfedb?w=500&h=500&fit=crop', '["Khoya (Milk Solids)", "Maida", "Sugar", "Cardamom", "Rose Water", "Ghee (for frying)"]', 15, 4.9),
('rasmalai', 'Rasmalai', 100, 'Desserts', true, 'Flattened cottage cheese discs soaked in cold, sweet, and thickened milk.', 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=500&h=500&fit=crop', '["Paneer", "Full Cream Milk", "Sugar", "Saffron", "Cardamom", "Pistachios", "Almonds"]', 20, 4.8),
('ice-cream-sundae', 'Ice Cream Sundae', 120, 'Desserts', true, 'Assorted ice cream scoops topped with nuts, syrups, and a cherry.', 'https://images.unsplash.com/photo-1553177595-4de2bb0842b9?w=500&h=500&fit=crop', '["Assorted Ice Creams", "Chocolate Syrup", "Strawberry Syrup", "Chopped Nuts", "Cherry"]', 5, 4.7),
('fresh-lime-soda', 'Fresh Lime Soda', 60, 'Soft Drinks', true, 'A refreshing cooler made with freshly squeezed lemon juice and sparkling water.', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&h=500&fit=crop', '["Fresh Lemon", "Soda Water", "Sugar/Salt", "Ice Cubes", "Mint Leaves"]', 5, 4.5),
('mango-lassi', 'Mango Lassi', 90, 'Soft Drinks', true, 'A thick, sweet, and creamy yogurt-based drink with Alphonso mango pulp.', 'https://images.unsplash.com/photo-1546171753-97d7676e4602?w=500&h=500&fit=crop', '["Yogurt", "Mango Pulp", "Sugar", "Cardamom Powder", "Pistachios"]', 10, 4.8),
('cold-coffee', 'Cold Coffee', 100, 'Soft Drinks', true, 'A classic blended iced coffee drink served with a scoop of vanilla ice cream.', 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500&h=500&fit=crop', '["Milk", "Coffee Powder", "Sugar", "Vanilla Ice Cream", "Chocolate Sauce", "Ice"]', 10, 4.6),
('masala-chai', 'Masala Chai', 30, 'Soft Drinks', true, 'Traditional Indian tea brewed with milk, sugar, and warming spices.', 'https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?w=500&h=500&fit=crop', '["Black Tea Leaves", "Milk", "Sugar", "Ginger", "Cardamom", "Cloves", "Cinnamon"]', 10, 4.7);

-- 4. Initial Reviews
INSERT INTO public.reviews (name, rating, comment) VALUES 
('Tasty & Yummy', 5, 'Tasty & Yummy 😋'),
('Rahul D.', 5, 'Best place for vegetarians who wish to have chinese thai and Indian food..'),
('Priya K.', 5, 'Delicious food with economy rate, bonus good customer service.');

-- 5. Enable Realtime (Required for instant dashboard updates)
-- Remove from publication first (ignore errors if it doesn't exist)
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.reservations;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
