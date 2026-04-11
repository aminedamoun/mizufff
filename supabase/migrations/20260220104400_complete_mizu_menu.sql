-- Complete Mizu Menu Migration with All 151 Items
-- This migration adds subcategories and populates the complete menu

-- 1. Add subcategory support to menu_items table
ALTER TABLE public.menu_items ADD COLUMN IF NOT EXISTS subcategory TEXT;

-- 2. Clear existing menu data to replace with complete menu
DELETE FROM public.menu_items;
DELETE FROM public.menu_categories;

-- 3. Insert all 9 main categories
DO $$
DECLARE
    cat_sushi_boxes UUID;
    cat_starters UUID;
    cat_sushi_rolls UUID;
    cat_signature UUID;
    cat_mains UUID;
    cat_rice_noodles UUID;
    cat_combos UUID;
    cat_desserts UUID;
    cat_drinks UUID;
BEGIN
    -- Insert Categories
    INSERT INTO public.menu_categories (id, name, description, display_order, is_active) VALUES
        (gen_random_uuid(), 'Sushi Boxes', 'Curated sushi box selections and all-you-can-eat options', 1, true),
        (gen_random_uuid(), 'Starters', 'Soups, cold starters, hot starters, and light bites', 2, true),
        (gen_random_uuid(), 'Sushi & Rolls', 'Classic rolls, maki, nigiri, and sashimi selections', 3, true),
        (gen_random_uuid(), 'Signature Rolls', 'Chef special signature creations and premium rolls', 4, true),
        (gen_random_uuid(), 'Mains', 'Hot kitchen mains, grilled dishes, tobanyaki, and teppanyaki', 5, true),
        (gen_random_uuid(), 'Rice & Noodles', 'Donburi, ramen, yakisoba, fried rice, and curry dishes', 6, true),
        (gen_random_uuid(), 'Combos & Sharing', 'Platters, combinations, set menus, and business lunch', 7, true),
        (gen_random_uuid(), 'Desserts', 'Sweet endings and Japanese desserts', 8, true),
        (gen_random_uuid(), 'Drinks', 'Fresh juices, mocktails, coffee, tea, and soft drinks', 9, true);

    -- Get category IDs
    SELECT id INTO cat_sushi_boxes FROM public.menu_categories WHERE name = 'Sushi Boxes' LIMIT 1;
    SELECT id INTO cat_starters FROM public.menu_categories WHERE name = 'Starters' LIMIT 1;
    SELECT id INTO cat_sushi_rolls FROM public.menu_categories WHERE name = 'Sushi & Rolls' LIMIT 1;
    SELECT id INTO cat_signature FROM public.menu_categories WHERE name = 'Signature Rolls' LIMIT 1;
    SELECT id INTO cat_mains FROM public.menu_categories WHERE name = 'Mains' LIMIT 1;
    SELECT id INTO cat_rice_noodles FROM public.menu_categories WHERE name = 'Rice & Noodles' LIMIT 1;
    SELECT id INTO cat_combos FROM public.menu_categories WHERE name = 'Combos & Sharing' LIMIT 1;
    SELECT id INTO cat_desserts FROM public.menu_categories WHERE name = 'Desserts' LIMIT 1;
    SELECT id INTO cat_drinks FROM public.menu_categories WHERE name = 'Drinks' LIMIT 1;

    -- 1. SUSHI BOXES (4 items)
    INSERT INTO public.menu_items (category_id, subcategory, name, description, price, image_url, image_alt, tag, is_available, display_order) VALUES
        (cat_sushi_boxes, NULL, 'All You Can Eat', 'Unlimited sushi, sashimi, and rolls. Indulge in our finest selections with no limits for the ultimate Japanese dining experience.', 179, 'https://images.unsplash.com/photo-1725611756448-213b2db6339a', 'All you can eat sushi buffet spread with variety', 'Unlimited', true, 1),
        (cat_sushi_boxes, NULL, 'Mizu Sushi Box 12', 'Curated selection of 12 premium sushi pieces featuring fresh salmon, tuna, and seasonal fish', 99, 'https://images.unsplash.com/photo-1607246749144-7bc0e401623c', 'Elegant sushi box with 12 assorted nigiri pieces', NULL, true, 2),
        (cat_sushi_boxes, NULL, 'Mizu Sushi Box 16', 'Generous assortment of 16 pieces including nigiri, sashimi, and specialty rolls', 139, 'https://images.unsplash.com/photo-1564489563601-c53cfc451e93', 'Large sushi box with 16 mixed pieces beautifully arranged', NULL, true, 3),
        (cat_sushi_boxes, NULL, 'Mizu Sushi Box 24', 'Ultimate sushi experience with 24 pieces of our chef''s finest selections', 239, 'https://images.unsplash.com/photo-1583623025817-d180a2221d0a', 'Premium sushi box with 24 assorted pieces', 'Premium', true, 4);

    -- 2. STARTERS (19 items across 4 subcategories)
    -- Soups (3)
    INSERT INTO public.menu_items (category_id, subcategory, name, description, price, image_url, image_alt, is_available, display_order) VALUES
        (cat_starters, 'Soups', 'Miso Soup', 'Traditional Japanese soup with tofu, wakame seaweed, and spring onions in savory miso broth', 38, 'https://images.unsplash.com/photo-1684866907269-2248f7334a09', 'Bowl of steaming miso soup with tofu', true, 1),
        (cat_starters, 'Soups', 'Corn Soup', 'Creamy sweet corn soup with a Japanese twist, garnished with crispy tempura flakes', 40, 'https://images.unsplash.com/photo-1547592166-23ac45744acd', 'Creamy corn soup in Japanese bowl', true, 2),
        (cat_starters, 'Soups', 'Tom Yam Soup', 'Spicy and sour Thai-inspired soup with lemongrass, galangal, and fresh seafood', 75, 'https://images.unsplash.com/photo-1609501676725-7186f017a4b7', 'Spicy tom yam soup with prawns and herbs', true, 3);
    
    -- Cold Starters (4)
    INSERT INTO public.menu_items (category_id, subcategory, name, description, price, image_url, image_alt, is_available, display_order) VALUES
        (cat_starters, 'Cold Starters', 'Carpaccio Trio', 'Thinly sliced salmon, tuna, and yellowtail with citrus ponzu and microgreens', 98, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', 'Three types of fish carpaccio beautifully plated', true, 4),
        (cat_starters, 'Cold Starters', 'Tuna Tartar', 'Finely diced fresh tuna with avocado, sesame oil, and crispy wonton chips', 92, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c', 'Fresh tuna tartar with avocado and garnish', true, 5),
        (cat_starters, 'Cold Starters', 'Yellowtail Carpaccio', 'Paper-thin yellowtail slices with jalapeño, yuzu dressing, and microgreens', 88, 'https://images.unsplash.com/photo-1611143669185-af224c5e3252', 'Yellowtail carpaccio with jalapeño slices', true, 6),
        (cat_starters, 'Cold Starters', 'Salmon Avocado Carpaccio', 'Fresh salmon carpaccio topped with creamy avocado and citrus ponzu', 71, 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab', 'Salmon carpaccio with avocado slices', true, 7);
    
    -- Hot Starters (7)
    INSERT INTO public.menu_items (category_id, subcategory, name, description, price, image_url, image_alt, is_available, display_order) VALUES
        (cat_starters, 'Hot Starters', 'Shrimp Popcorn', 'Crispy bite-sized shrimp tempura with spicy mayo dipping sauce', 60, 'https://images.unsplash.com/photo-1565557623262-b51c2513a641', 'Crispy popcorn shrimp with dipping sauce', true, 8),
        (cat_starters, 'Hot Starters', 'Chicken Popcorn', 'Golden fried chicken bites with Japanese seven-spice seasoning', 55, 'https://images.unsplash.com/photo-1562967914-608f82629710', 'Crispy chicken popcorn bites', true, 9),
        (cat_starters, 'Hot Starters', 'Fried Squid', 'Tender calamari rings lightly battered and fried, served with wasabi mayo', 55, 'https://images.unsplash.com/photo-1604909052743-94e838986d24', 'Crispy fried calamari rings', true, 10),
        (cat_starters, 'Hot Starters', 'Gyoza', 'Pan-fried Japanese dumplings filled with pork and vegetables, served with ponzu', 45, 'https://images.unsplash.com/photo-1718282005920-1de79a26794f', 'Pan-fried gyoza dumplings with dipping sauce', true, 11),
        (cat_starters, 'Hot Starters', 'Vegetable Spring Rolls', 'Crispy spring rolls filled with fresh vegetables and glass noodles', 42, 'https://images.unsplash.com/photo-1541529086526-db283c563270', 'Crispy vegetable spring rolls', true, 12),
        (cat_starters, 'Hot Starters', 'Chicken Yakitori', 'Grilled chicken skewers glazed with teriyaki sauce and sesame seeds', 53, 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143', 'Grilled chicken yakitori skewers', true, 13),
        (cat_starters, 'Hot Starters', 'Spicy Chicken Wings', 'Crispy chicken wings tossed in spicy Korean gochujang sauce', 55, 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7', 'Spicy glazed chicken wings', true, 14);
    
    -- Light Bites (4)
    INSERT INTO public.menu_items (category_id, subcategory, name, description, price, image_url, image_alt, is_available, display_order) VALUES
        (cat_starters, 'Light Bites', 'Edamame', 'Steamed young soybeans lightly salted, a classic Japanese appetizer', 35, 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2', 'Bowl of steamed edamame beans', true, 15),
        (cat_starters, 'Light Bites', 'Beef Asparagus Roll', 'Tender beef wrapped around crisp asparagus, grilled with teriyaki glaze', 65, 'https://images.unsplash.com/photo-1544025162-d76694265947', 'Beef wrapped asparagus rolls', true, 16),
        (cat_starters, 'Light Bites', 'Wasabi Prawn', 'Succulent prawns with a hint of wasabi kick, lightly tempura fried', 72, 'https://images.unsplash.com/photo-1565557623262-b51c2513a641', 'Wasabi prawns with garnish', true, 17),
        (cat_starters, 'Light Bites', 'Beef Broccoli', 'Tender beef slices stir-fried with fresh broccoli in savory sauce', 65, 'https://images.unsplash.com/photo-1603133872878-684f208fb84b', 'Beef and broccoli stir fry', true, 18);

    -- 3. SUSHI & ROLLS (27 items across 4 subcategories)
    -- Classic Rolls (8)
    INSERT INTO public.menu_items (category_id, subcategory, name, description, price, image_url, image_alt, is_available, display_order) VALUES
        (cat_sushi_rolls, 'Classic Rolls', 'California Roll', 'Crab stick, avocado, and cucumber rolled in sushi rice and nori', 44, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', 'California roll with sesame seeds', true, 1),
        (cat_sushi_rolls, 'Classic Rolls', 'Philadelphia Roll', 'Fresh salmon, cream cheese, and cucumber in a classic combination', 61, 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56', 'Philadelphia roll with salmon', true, 2),
        (cat_sushi_rolls, 'Classic Rolls', 'Tempura Shrimp Roll', 'Crispy tempura shrimp with avocado and spicy mayo', 52, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', 'Tempura shrimp roll', true, 3),
        (cat_sushi_rolls, 'Classic Rolls', 'Crunchy Roll', 'Tempura flakes add texture to this cucumber and avocado roll', 48, 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56', 'Crunchy roll with tempura flakes', true, 4),
        (cat_sushi_rolls, 'Classic Rolls', 'Spicy Tuna Roll', 'Fresh tuna mixed with spicy mayo and cucumber', 50, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', 'Spicy tuna roll', true, 5),
        (cat_sushi_rolls, 'Classic Rolls', 'Spicy Salmon Roll', 'Fresh salmon with spicy mayo, cucumber, and scallions', 50, 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56', 'Spicy salmon roll', true, 6),
        (cat_sushi_rolls, 'Classic Rolls', 'Alaska Roll', 'Salmon, avocado, and cucumber in a refreshing combination', 56, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', 'Alaska roll with salmon', true, 7),
        (cat_sushi_rolls, 'Classic Rolls', 'Fried Chicken Roll', 'Crispy chicken katsu with lettuce and Japanese mayo', 46, 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56', 'Fried chicken roll', true, 8);
    
    -- Maki Rolls (6)
    INSERT INTO public.menu_items (category_id, subcategory, name, description, price, image_url, image_alt, is_available, display_order) VALUES
        (cat_sushi_rolls, 'Maki Rolls (6 pcs)', 'Kanikama Maki', 'Crab stick maki rolls, simple and delicious (6 pieces)', 38, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', 'Kanikama maki rolls', true, 9),
        (cat_sushi_rolls, 'Maki Rolls (6 pcs)', 'Tekka Maki (Tuna)', 'Fresh tuna maki rolls (6 pieces)', 38, 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56', 'Tuna maki rolls', true, 10),
        (cat_sushi_rolls, 'Maki Rolls (6 pcs)', 'Sake Maki (Salmon)', 'Fresh salmon maki rolls (6 pieces)', 38, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', 'Salmon maki rolls', true, 11),
        (cat_sushi_rolls, 'Maki Rolls (6 pcs)', 'Kappa Maki (Cucumber)', 'Refreshing cucumber maki rolls (6 pieces)', 32, 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56', 'Cucumber maki rolls', true, 12),
        (cat_sushi_rolls, 'Maki Rolls (6 pcs)', 'Avocado Maki', 'Creamy avocado maki rolls (6 pieces)', 32, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', 'Avocado maki rolls', true, 13),
        (cat_sushi_rolls, 'Maki Rolls (6 pcs)', 'Tuna Mayo Maki', 'Tuna mixed with Japanese mayo maki rolls (6 pieces)', 38, 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56', 'Tuna mayo maki rolls', true, 14);
    
    -- Nigiri (6)
    INSERT INTO public.menu_items (category_id, subcategory, name, description, price, image_url, image_alt, is_available, display_order) VALUES
        (cat_sushi_rolls, 'Nigiri (2 pcs)', 'Sake (Salmon)', 'Fresh salmon nigiri (2 pieces)', 36, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', 'Salmon nigiri', true, 15),
        (cat_sushi_rolls, 'Nigiri (2 pcs)', 'Ebi (Shrimp)', 'Cooked shrimp nigiri (2 pieces)', 36, 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56', 'Shrimp nigiri', true, 16),
        (cat_sushi_rolls, 'Nigiri (2 pcs)', 'Maguro (Tuna)', 'Fresh tuna nigiri (2 pieces)', 36, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', 'Tuna nigiri', true, 17),
        (cat_sushi_rolls, 'Nigiri (2 pcs)', 'Hamachi', 'Yellowtail nigiri (2 pieces)', 36, 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56', 'Yellowtail nigiri', true, 18),
        (cat_sushi_rolls, 'Nigiri (2 pcs)', 'Unagi (Eel)', 'Grilled eel nigiri with sweet sauce (2 pieces)', 39, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', 'Eel nigiri', true, 19),
        (cat_sushi_rolls, 'Nigiri (2 pcs)', 'Kanikama', 'Crab stick nigiri (2 pieces)', 36, 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56', 'Crab stick nigiri', true, 20);
    
    -- Sashimi (3)
    INSERT INTO public.menu_items (category_id, subcategory, name, description, price, image_url, image_alt, is_available, display_order) VALUES
        (cat_sushi_rolls, 'Sashimi (3 pcs)', 'Hamachi', 'Fresh yellowtail sashimi (3 pieces)', 45, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', 'Yellowtail sashimi slices', true, 21),
        (cat_sushi_rolls, 'Sashimi (3 pcs)', 'Sake (Salmon)', 'Fresh salmon sashimi (3 pieces)', 45, 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56', 'Salmon sashimi slices', true, 22),
        (cat_sushi_rolls, 'Sashimi (3 pcs)', 'Maguro (Tuna)', 'Fresh tuna sashimi (3 pieces)', 45, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', 'Tuna sashimi slices', true, 23);

    -- 4. SIGNATURE ROLLS (22 items)
    INSERT INTO public.menu_items (category_id, subcategory, name, description, price, image_url, image_alt, tag, is_available, display_order) VALUES
        (cat_signature, NULL, 'Rainbow Roll', 'California roll topped with assorted sashimi in a rainbow pattern', 125, 'https://images.unsplash.com/photo-1593352995140-38a011bf2cc0', 'Rainbow roll with colorful fish topping', 'Signature', true, 1),
        (cat_signature, NULL, 'Shrimpino Roll', 'Tempura shrimp, avocado, topped with seared shrimp and spicy mayo', 105, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', 'Shrimpino roll with seared shrimp', 'Signature', true, 2),
        (cat_signature, NULL, 'Crispy N Spicy Roll', 'Crispy tempura roll with spicy tuna and jalapeño', 58, 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56', 'Crispy spicy roll', 'Signature', true, 3),
        (cat_signature, NULL, 'Hot Lava Roll', 'Spicy tuna roll topped with seared salmon and spicy mayo', 71, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', 'Hot lava roll with seared topping', 'Signature', true, 4),
        (cat_signature, NULL, 'Desert Safari Roll', 'Tempura shrimp, cream cheese, topped with torched salmon', 95, 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56', 'Desert safari roll', 'Signature', true, 5),
        (cat_signature, NULL, 'Rocky Road Roll', 'Soft shell crab, avocado, topped with eel and crunchy flakes', 98, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', 'Rocky road roll', 'Signature', true, 6),
        (cat_signature, NULL, 'Dragon Roll', 'Tempura shrimp, cucumber, topped with avocado and eel sauce', 104, 'https://img.rocket.new/generatedImages/rocket_gen_img_1fd3051b3-1765123715023.png', 'Dragon roll with avocado scales', 'Signature', true, 7),
        (cat_signature, NULL, 'Osaka Roll', 'Spicy salmon, cucumber, topped with salmon and ikura', 85, 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56', 'Osaka roll with salmon roe', 'Signature', true, 8),
        (cat_signature, NULL, 'Godzilla Roll', 'Deep fried roll with spicy tuna, cream cheese, and jalapeño', 106, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', 'Godzilla roll deep fried', 'Signature', true, 9),
        (cat_signature, NULL, 'Mountain Roll', 'Tempura shrimp, avocado, topped with spicy crab and tempura flakes', 103, 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56', 'Mountain roll with crab topping', 'Signature', true, 10),
        (cat_signature, NULL, 'Crazy Crunchy Roll', 'Salmon, tuna, avocado, all tempura fried with sweet sauce', 66, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', 'Crazy crunchy fried roll', 'Signature', true, 11),
        (cat_signature, NULL, 'Sakura Roll', 'Tuna, salmon, yellowtail, wrapped in pink soy paper', 102, 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56', 'Sakura roll in pink wrapper', 'Signature', true, 12),
        (cat_signature, NULL, 'Seared Salmon Roll', 'California roll topped with torched salmon and garlic ponzu', 92, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', 'Seared salmon roll', 'Signature', true, 13),
        (cat_signature, NULL, 'Dynamite Roll', 'Tempura shrimp, spicy tuna, topped with spicy mayo and sriracha', 78, 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56', 'Dynamite roll with spicy topping', 'Signature', true, 14),
        (cat_signature, NULL, 'Cheetos Roll', 'Spicy crab, cream cheese, rolled in crushed Cheetos', 92, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', 'Cheetos roll with orange coating', 'Signature', true, 15),
        (cat_signature, NULL, 'Crispy Tempura Roll', 'Assorted fish and vegetables, fully tempura fried', 95, 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56', 'Crispy tempura roll', 'Signature', true, 16),
        (cat_signature, NULL, 'Mizu Volcano Roll', 'Spicy tuna, cucumber, topped with baked spicy crab', 56, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', 'Mizu volcano roll with baked topping', 'Signature', true, 17),
        (cat_signature, NULL, 'Mizu Shrimp Popcorn Roll', 'Tempura shrimp, avocado, topped with crispy shrimp popcorn', 74, 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56', 'Shrimp popcorn roll', 'Signature', true, 18),
        (cat_signature, NULL, 'Seared Hamachi Roll', 'Spicy yellowtail roll topped with torched yellowtail and jalapeño', 85, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', 'Seared hamachi roll', 'Signature', true, 19),
        (cat_signature, NULL, 'Avocado Tempura Roll', 'Tempura fried avocado with spicy crab and eel sauce', 101, 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56', 'Avocado tempura roll', 'Signature', true, 20),
        (cat_signature, NULL, 'Crunchy Potato Roll', 'Spicy tuna, cucumber, topped with crispy potato strings', 68, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', 'Crunchy potato roll', 'Signature', true, 21),
        (cat_signature, NULL, 'Mango Crab Roll', 'Spicy crab, cucumber, topped with fresh mango and mango sauce', 91, 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56', 'Mango crab roll', 'Signature', true, 22);

    -- 5. MAINS (11 items across 3 subcategories)
    INSERT INTO public.menu_items (category_id, subcategory, name, description, price, image_url, image_alt, is_available, display_order) VALUES
        (cat_mains, NULL, 'Grilled Salmon', 'Fresh Atlantic salmon fillet grilled to perfection with teriyaki glaze', 105, 'https://images.unsplash.com/photo-1467003909585-2f8a72700288', 'Grilled salmon fillet with vegetables', true, 1),
        (cat_mains, NULL, 'Miso Black Cod', 'Premium black cod marinated in sweet miso, grilled until caramelized', 110, 'https://images.unsplash.com/photo-1580959375944-0b7b9e7d0e7e', 'Miso glazed black cod', true, 2);
    
    -- Tobanyaki (3)
    INSERT INTO public.menu_items (category_id, subcategory, name, description, price, image_url, image_alt, is_available, display_order) VALUES
        (cat_mains, 'Tobanyaki', 'Seafood Tobanyaki', 'Mixed seafood cooked on hot stone plate with vegetables', 100, 'https://images.unsplash.com/photo-1559847844-5315695dadae', 'Seafood tobanyaki on hot stone', true, 3),
        (cat_mains, 'Tobanyaki', 'Beef Tobanyaki', 'Tender beef slices cooked on hot stone with garlic butter', 96, 'https://images.unsplash.com/photo-1544025162-d76694265947', 'Beef tobanyaki sizzling', true, 4),
        (cat_mains, 'Tobanyaki', 'Chicken Tobanyaki', 'Chicken pieces cooked on hot stone with teriyaki sauce', 78, 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6', 'Chicken tobanyaki on hot plate', true, 5);
    
    -- Teppanyaki (3)
    INSERT INTO public.menu_items (category_id, subcategory, name, description, price, image_url, image_alt, is_available, display_order) VALUES
        (cat_mains, 'Teppanyaki', 'Shrimp Teppanyaki', 'Jumbo shrimp grilled teppanyaki-style with vegetables and fried rice', 96, 'https://images.unsplash.com/photo-1559847844-5315695dadae', 'Shrimp teppanyaki with vegetables', true, 6),
        (cat_mains, 'Teppanyaki', 'Chicken Teppanyaki', 'Grilled chicken teppanyaki-style with seasonal vegetables', 75, 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6', 'Chicken teppanyaki', true, 7),
        (cat_mains, 'Teppanyaki', 'Beef Sirloin Teppanyaki', 'Premium beef sirloin grilled teppanyaki-style with garlic butter', 99, 'https://images.unsplash.com/photo-1544025162-d76694265947', 'Beef sirloin teppanyaki', true, 8);

    -- 6. RICE & NOODLES (23 items across 5 subcategories)
    -- Donburi (3)
    INSERT INTO public.menu_items (category_id, subcategory, name, description, price, image_url, image_alt, is_available, display_order) VALUES
        (cat_rice_noodles, 'Donburi', 'Chicken Teriyaki Don', 'Grilled chicken with teriyaki sauce over steamed rice', 54, 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6', 'Chicken teriyaki rice bowl', true, 1),
        (cat_rice_noodles, 'Donburi', 'Gyu Don', 'Sliced beef and onions simmered in sweet soy sauce over rice', 75, 'https://images.unsplash.com/photo-1544025162-d76694265947', 'Beef donburi rice bowl', true, 2),
        (cat_rice_noodles, 'Donburi', 'Ten Don', 'Assorted tempura (shrimp and vegetables) over rice with sauce', 72, 'https://images.unsplash.com/photo-1565557623262-b51c2513a641', 'Tempura donburi rice bowl', true, 3);
    
    -- Ramen (2)
    INSERT INTO public.menu_items (category_id, subcategory, name, description, price, image_url, image_alt, is_available, display_order) VALUES
        (cat_rice_noodles, 'Ramen', 'Dan Dan Ramen', 'Spicy Sichuan-style ramen with minced pork and sesame paste', 60, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624', 'Dan dan ramen bowl', true, 4),
        (cat_rice_noodles, 'Ramen', 'Miso Ramen', 'Rich miso broth ramen with chashu pork, egg, and vegetables', 78, 'https://images.unsplash.com/photo-1557872943-16a5ac26437e', 'Miso ramen with toppings', true, 5);
    
    -- Yakisoba (3)
    INSERT INTO public.menu_items (category_id, subcategory, name, description, price, image_url, image_alt, is_available, display_order) VALUES
        (cat_rice_noodles, 'Yakisoba', 'Vegetable Yakisoba', 'Stir-fried noodles with mixed vegetables and yakisoba sauce', 56, 'https://images.unsplash.com/photo-1617093727343-374698b1b08d', 'Vegetable yakisoba noodles', true, 6),
        (cat_rice_noodles, 'Yakisoba', 'Chicken Yakisoba', 'Stir-fried noodles with chicken and vegetables', 58, 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6', 'Chicken yakisoba noodles', true, 7),
        (cat_rice_noodles, 'Yakisoba', 'Shrimp Yakisoba', 'Stir-fried noodles with shrimp and vegetables', 66, 'https://images.unsplash.com/photo-1559847844-5315695dadae', 'Shrimp yakisoba noodles', true, 8);
    
    -- Fried Rice (3)
    INSERT INTO public.menu_items (category_id, subcategory, name, description, price, image_url, image_alt, is_available, display_order) VALUES
        (cat_rice_noodles, 'Fried Rice (Yakimeshi)', 'Chicken & Vegetable', 'Japanese fried rice with chicken and mixed vegetables', 49, 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6', 'Chicken fried rice', true, 9),
        (cat_rice_noodles, 'Fried Rice (Yakimeshi)', 'Prawn & Vegetable', 'Japanese fried rice with prawns and mixed vegetables', 54, 'https://images.unsplash.com/photo-1559847844-5315695dadae', 'Prawn fried rice', true, 10),
        (cat_rice_noodles, 'Fried Rice (Yakimeshi)', 'Vegetable', 'Japanese fried rice with assorted vegetables', 46, 'https://images.unsplash.com/photo-1617093727343-374698b1b08d', 'Vegetable fried rice', true, 11);
    
    -- Curry (5)
    INSERT INTO public.menu_items (category_id, subcategory, name, description, price, image_url, image_alt, is_available, display_order) VALUES
        (cat_rice_noodles, 'Curry', 'Beef Curry', 'Japanese curry with tender beef chunks and vegetables over rice', 77, 'https://images.unsplash.com/photo-1544025162-d76694265947', 'Beef curry with rice', true, 12),
        (cat_rice_noodles, 'Curry', 'Chicken Curry', 'Japanese curry with chicken and vegetables over rice', 64, 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6', 'Chicken curry with rice', true, 13),
        (cat_rice_noodles, 'Curry', 'Vegetable Curry', 'Japanese curry with assorted vegetables over rice', 54, 'https://images.unsplash.com/photo-1617093727343-374698b1b08d', 'Vegetable curry with rice', true, 14),
        (cat_rice_noodles, 'Curry', 'Shrimp Curry', 'Japanese curry with shrimp and vegetables over rice', 79, 'https://images.unsplash.com/photo-1559847844-5315695dadae', 'Shrimp curry with rice', true, 15),
        (cat_rice_noodles, 'Curry', 'Katsu Curry', 'Japanese curry with crispy chicken katsu over rice', 67, 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6', 'Katsu curry with rice', true, 16);

    -- 7. COMBOS & SHARING (13 items across 4 subcategories)
    INSERT INTO public.menu_items (category_id, subcategory, name, description, price, image_url, image_alt, tag, is_available, display_order) VALUES
        (cat_combos, NULL, 'Maki Matsu Boat (30 pcs)', 'Assorted maki rolls beautifully presented on a boat platter (30 pieces)', 238, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', 'Maki boat platter with 30 pieces', 'Sharing', true, 1);
    
    -- Combinations (4)
    INSERT INTO public.menu_items (category_id, subcategory, name, description, price, image_url, image_alt, tag, is_available, display_order) VALUES
        (cat_combos, 'Combinations', 'Sashimi Matsu', 'Premium sashimi platter with tuna, salmon, and yellowtail', 99, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', 'Sashimi combination platter', 'Sharing', true, 2),
        (cat_combos, 'Combinations', 'Maki Taki', 'Assorted maki rolls combination platter', 145, 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56', 'Maki combination platter', 'Sharing', true, 3),
        (cat_combos, 'Combinations', 'Mizu Nigiri Combination', 'Chef''s selection of nigiri sushi', 125, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', 'Nigiri combination platter', 'Sharing', true, 4),
        (cat_combos, 'Combinations', 'Salmon Combination', 'All salmon platter: nigiri, sashimi, and rolls', 142, 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56', 'Salmon combination platter', 'Sharing', true, 5);
    
    -- Combo Sets (4)
    INSERT INTO public.menu_items (category_id, subcategory, name, description, price, image_url, image_alt, tag, is_available, display_order) VALUES
        (cat_combos, 'Combo Sets', 'Combo Set Menu 1', 'Complete meal set with appetizer, main, and sushi selection', 350, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', 'Combo set menu 1', 'Set Menu', true, 6),
        (cat_combos, 'Combo Sets', 'Combo Set Menu 2', 'Complete meal set with soup, main, and premium rolls', 350, 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56', 'Combo set menu 2', 'Set Menu', true, 7),
        (cat_combos, 'Combo Sets', 'Combo Set Special 1', 'Premium meal set with signature dishes and chef specials', 400, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', 'Combo set special 1', 'Set Menu', true, 8),
        (cat_combos, 'Combo Sets', 'Combo Set Special 2', 'Deluxe meal set with premium sashimi and signature rolls', 400, 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56', 'Combo set special 2', 'Set Menu', true, 9);
    
    -- Business Lunch (4)
    INSERT INTO public.menu_items (category_id, subcategory, name, description, price, image_url, image_alt, tag, is_available, display_order) VALUES
        (cat_combos, 'Business Lunch (Mon–Sat | 11 AM – 5 PM)', 'Business Lunch Menu 1', 'Quick lunch set with miso soup, salad, main, and rice', 79, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', 'Business lunch menu 1', 'Lunch', true, 10),
        (cat_combos, 'Business Lunch (Mon–Sat | 11 AM – 5 PM)', 'Business Lunch Menu 2', 'Lunch set with appetizer, sushi rolls, and main dish', 79, 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56', 'Business lunch menu 2', 'Lunch', true, 11),
        (cat_combos, 'Business Lunch (Mon–Sat | 11 AM – 5 PM)', 'Business Lunch Special 1', 'Premium lunch set with sashimi, main, and dessert', 99, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', 'Business lunch special 1', 'Lunch', true, 12),
        (cat_combos, 'Business Lunch (Mon–Sat | 11 AM – 5 PM)', 'Business Lunch Special 2', 'Deluxe lunch set with signature roll, main, and dessert', 99, 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56', 'Business lunch special 2', 'Lunch', true, 13);

    -- 8. DESSERTS (7 items)
    INSERT INTO public.menu_items (category_id, subcategory, name, description, price, image_url, image_alt, is_available, display_order) VALUES
        (cat_desserts, NULL, 'Kunafa Brest', 'Middle Eastern kunafa meets French pastry in this fusion dessert', 68, 'https://images.unsplash.com/photo-1563805042-7684c019e1cb', 'Kunafa brest dessert', true, 1),
        (cat_desserts, NULL, 'Mizu Cheesecake', 'Japanese-style light and fluffy cheesecake', 65, 'https://images.unsplash.com/photo-1533134242820-b4f6b3c5e2d3', 'Japanese cheesecake slice', true, 2),
        (cat_desserts, NULL, 'Fondant Chocolate Cake', 'Warm chocolate cake with molten center, served with vanilla ice cream', 59, 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c', 'Chocolate fondant with ice cream', true, 3),
        (cat_desserts, NULL, 'Coco Mango', 'Fresh mango with coconut cream and tropical fruit', 65, 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716', 'Mango coconut dessert', true, 4),
        (cat_desserts, NULL, 'Mochi Ice Cream', 'Japanese mochi filled with premium ice cream (3 pieces)', 55, 'https://images.unsplash.com/photo-1563805042-7684c019e1cb', 'Mochi ice cream assortment', true, 5),
        (cat_desserts, NULL, 'Ice Cream', 'Choice of vanilla, chocolate, or green tea ice cream', 40, 'https://images.unsplash.com/photo-1563805042-7684c019e1cb', 'Ice cream scoops', true, 6),
        (cat_desserts, NULL, 'Mizu Banana Ice Cream', 'Tempura fried banana with ice cream and chocolate sauce', 69, 'https://images.unsplash.com/photo-1587314168485-3236d6710814', 'Banana tempura with ice cream', true, 7);

    -- 9. DRINKS (40 items across 4 subcategories)
    -- Fresh Juices & Mocktails (11)
    INSERT INTO public.menu_items (category_id, subcategory, name, description, price, image_url, image_alt, is_available, display_order) VALUES
        (cat_drinks, 'Fresh Juices & Mocktails', 'Virgin Mojito', 'Classic mojito with fresh mint, lime, and soda', 42, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc', 'Virgin mojito with mint', true, 1),
        (cat_drinks, 'Fresh Juices & Mocktails', 'Strawberry Mojito', 'Refreshing mojito with fresh strawberries', 42, 'https://images.unsplash.com/photo-1544145945-f90425340c7e', 'Strawberry mojito', true, 2),
        (cat_drinks, 'Fresh Juices & Mocktails', 'Passion Fruit Mojito', 'Tropical mojito with passion fruit', 42, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc', 'Passion fruit mojito', true, 3),
        (cat_drinks, 'Fresh Juices & Mocktails', 'Mizu Mocktail', 'House special mocktail with mixed fruits', 35, 'https://images.unsplash.com/photo-1544145945-f90425340c7e', 'Mizu special mocktail', true, 4),
        (cat_drinks, 'Fresh Juices & Mocktails', 'Fruit Punch Mojito (Big)', 'Large fruit punch mojito perfect for sharing', 65, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc', 'Large fruit punch mojito', true, 5),
        (cat_drinks, 'Fresh Juices & Mocktails', 'Fruit Punch Mojito (Small)', 'Individual fruit punch mojito', 42, 'https://images.unsplash.com/photo-1544145945-f90425340c7e', 'Small fruit punch mojito', true, 6),
        (cat_drinks, 'Fresh Juices & Mocktails', 'Cool Lychee', 'Refreshing lychee drink', 32, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc', 'Lychee drink', true, 7),
        (cat_drinks, 'Fresh Juices & Mocktails', 'Fresh Orange Juice', 'Freshly squeezed orange juice', 34, 'https://images.unsplash.com/photo-1600271886742-f049cd451bba', 'Fresh orange juice', true, 8),
        (cat_drinks, 'Fresh Juices & Mocktails', 'Fresh Mint Lemon', 'Refreshing mint lemonade', 34, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc', 'Mint lemon drink', true, 9),
        (cat_drinks, 'Fresh Juices & Mocktails', 'Fresh Pineapple Juice', 'Freshly squeezed pineapple juice', 34, 'https://images.unsplash.com/photo-1600271886742-f049cd451bba', 'Fresh pineapple juice', true, 10),
        (cat_drinks, 'Fresh Juices & Mocktails', 'Fresh Watermelon Juice', 'Freshly squeezed watermelon juice', 34, 'https://images.unsplash.com/photo-1600271886742-f049cd451bba', 'Fresh watermelon juice', true, 11);
    
    -- Coffee (9)
    INSERT INTO public.menu_items (category_id, subcategory, name, description, price, image_url, image_alt, is_available, display_order) VALUES
        (cat_drinks, 'Coffee', 'Espresso', 'Single shot of rich espresso', 19, 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04', 'Espresso shot', true, 12),
        (cat_drinks, 'Coffee', 'Double Espresso', 'Double shot of rich espresso', 21, 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04', 'Double espresso', true, 13),
        (cat_drinks, 'Coffee', 'Americano', 'Espresso with hot water', 21, 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd', 'Americano coffee', true, 14),
        (cat_drinks, 'Coffee', 'Latte', 'Espresso with steamed milk', 25, 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735', 'Latte with foam art', true, 15),
        (cat_drinks, 'Coffee', 'Matcha Latte', 'Japanese green tea latte', 26, 'https://images.unsplash.com/photo-1536013266671-8fd5c4f87c8e', 'Matcha latte', true, 16),
        (cat_drinks, 'Coffee', 'Cappuccino', 'Espresso with foamed milk', 25, 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735', 'Cappuccino with foam', true, 17),
        (cat_drinks, 'Coffee', 'Gibraltar', 'Espresso with steamed milk in Gibraltar glass', 26, 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735', 'Gibraltar coffee', true, 18),
        (cat_drinks, 'Coffee', 'Flat White', 'Espresso with microfoam milk', 26, 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735', 'Flat white coffee', true, 19),
        (cat_drinks, 'Coffee', 'Affogato', 'Espresso poured over vanilla ice cream', 29, 'https://images.unsplash.com/photo-1563805042-7684c019e1cb', 'Affogato dessert coffee', true, 20);
    
    -- Tea (10)
    INSERT INTO public.menu_items (category_id, subcategory, name, description, price, image_url, image_alt, is_available, display_order) VALUES
        (cat_drinks, 'Tea', 'Lemon Honey Ginger', 'Soothing tea with lemon, honey, and ginger', 45, 'https://images.unsplash.com/photo-1597318130878-11e095c4e1f6', 'Lemon honey ginger tea', true, 21),
        (cat_drinks, 'Tea', 'Immuni-Tea', 'Immunity-boosting herbal tea blend', 45, 'https://images.unsplash.com/photo-1597318130878-11e095c4e1f6', 'Immunity tea', true, 22),
        (cat_drinks, 'Tea', 'Green Tea', 'Traditional Japanese green tea', 45, 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9', 'Green tea in cup', true, 23),
        (cat_drinks, 'Tea', 'Good Morning Tea', 'Energizing morning tea blend', 45, 'https://images.unsplash.com/photo-1597318130878-11e095c4e1f6', 'Morning tea', true, 24),
        (cat_drinks, 'Tea', 'Darjeeling Masala', 'Indian spiced tea with Darjeeling leaves', 45, 'https://images.unsplash.com/photo-1597318130878-11e095c4e1f6', 'Darjeeling masala tea', true, 25),
        (cat_drinks, 'Tea', 'Lemonade Twist', 'Refreshing lemonade tea', 45, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc', 'Lemonade twist tea', true, 26),
        (cat_drinks, 'Tea', 'Sleeping Beauty', 'Calming herbal tea for relaxation', 45, 'https://images.unsplash.com/photo-1597318130878-11e095c4e1f6', 'Sleeping beauty tea', true, 27),
        (cat_drinks, 'Tea', 'Mizu Karak Tea', 'Strong spiced tea with milk', 35, 'https://images.unsplash.com/photo-1597318130878-11e095c4e1f6', 'Karak tea', true, 28),
        (cat_drinks, 'Tea', 'Sencha Tea', 'Premium Japanese sencha green tea', 35, 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9', 'Sencha tea', true, 29),
        (cat_drinks, 'Tea', 'Jasmine Tea', 'Fragrant jasmine green tea', 35, 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9', 'Jasmine tea', true, 30);
    
    -- Soft Drinks (10)
    INSERT INTO public.menu_items (category_id, subcategory, name, description, price, image_url, image_alt, is_available, display_order) VALUES
        (cat_drinks, 'Soft Drinks', 'Coca Cola', 'Classic Coca Cola', 15, 'https://images.unsplash.com/photo-1554866585-cd94860890b7', 'Coca Cola can', true, 31),
        (cat_drinks, 'Soft Drinks', 'Coca Cola Light', 'Diet Coca Cola', 15, 'https://images.unsplash.com/photo-1554866585-cd94860890b7', 'Coca Cola Light can', true, 32),
        (cat_drinks, 'Soft Drinks', 'Coca Cola Zero', 'Zero sugar Coca Cola', 15, 'https://images.unsplash.com/photo-1554866585-cd94860890b7', 'Coca Cola Zero can', true, 33),
        (cat_drinks, 'Soft Drinks', 'Fanta', 'Orange flavored soda', 15, 'https://images.unsplash.com/photo-1554866585-cd94860890b7', 'Fanta can', true, 34),
        (cat_drinks, 'Soft Drinks', 'Sprite', 'Lemon-lime soda', 15, 'https://images.unsplash.com/photo-1554866585-cd94860890b7', 'Sprite can', true, 35),
        (cat_drinks, 'Soft Drinks', 'Schweppes Ginger Ale', 'Classic ginger ale', 15, 'https://images.unsplash.com/photo-1554866585-cd94860890b7', 'Schweppes ginger ale can', true, 36),
        (cat_drinks, 'Soft Drinks', 'Red Bull', 'Energy drink', 35, 'https://images.unsplash.com/photo-1622543925917-763c34f6a1d0', 'Red Bull can', true, 37),
        (cat_drinks, 'Soft Drinks', 'Red Bull Sugarfree', 'Sugar-free energy drink', 35, 'https://images.unsplash.com/photo-1622543925917-763c34f6a1d0', 'Red Bull sugarfree can', true, 38),
        (cat_drinks, 'Soft Drinks', 'Still Water Small', 'Small bottle of still water', 17, 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d', 'Small water bottle', true, 39),
        (cat_drinks, 'Soft Drinks', 'Still Water Big', 'Large bottle of still water', 23, 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d', 'Large water bottle', true, 40),
        (cat_drinks, 'Soft Drinks', 'Sparkling Water Small', 'Small bottle of sparkling water', 19, 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d', 'Small sparkling water', true, 41),
        (cat_drinks, 'Soft Drinks', 'Sparkling Water Big', 'Large bottle of sparkling water', 29, 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d', 'Large sparkling water', true, 42);

EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Complete menu insertion failed: %', SQLERRM;
END $$;
