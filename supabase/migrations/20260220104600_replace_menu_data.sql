-- Replace Menu Data Migration
-- Completely replaces existing menu with comprehensive 9-category structure (151 items)

-- 1. Clear existing menu data
DO $$
BEGIN
    -- Delete all existing menu items first (due to foreign key constraints)
    DELETE FROM public.menu_items;
    
    -- Delete all existing categories
    DELETE FROM public.menu_categories;
    
    RAISE NOTICE 'Existing menu data cleared successfully';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error clearing existing data: %', SQLERRM;
END $$;

-- 2. Insert new categories
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
        (gen_random_uuid(), 'Sushi Boxes', 'Curated sushi box selections for every appetite', 1, true),
        (gen_random_uuid(), 'Starters', 'Appetizers, soups, and light bites to begin your meal', 2, true),
        (gen_random_uuid(), 'Sushi & Rolls', 'Classic sushi, maki, nigiri, and sashimi selections', 3, true),
        (gen_random_uuid(), 'Signature Rolls', 'Chef special signature creations and premium rolls', 4, true),
        (gen_random_uuid(), 'Mains', 'Hot kitchen mains, grilled dishes, and teppanyaki', 5, true),
        (gen_random_uuid(), 'Rice & Noodles', 'Donburi, ramen, yakisoba, fried rice, and curry dishes', 6, true),
        (gen_random_uuid(), 'Combos & Sharing', 'Platters, combinations, and set menus for sharing', 7, true),
        (gen_random_uuid(), 'Desserts', 'Sweet endings to complete your dining experience', 8, true),
        (gen_random_uuid(), 'Drinks', 'Beverages, fresh juices, coffee, tea, and soft drinks', 9, true)
    ON CONFLICT (name) DO UPDATE SET
        description = EXCLUDED.description,
        display_order = EXCLUDED.display_order,
        is_active = EXCLUDED.is_active;

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

    -- 3. Insert all menu items
    
    -- SUSHI BOXES (4 items)
    IF cat_sushi_boxes IS NOT NULL THEN
        INSERT INTO public.menu_items (category_id, name, description, price, image_url, image_alt, tag, is_available, display_order) VALUES
            (cat_sushi_boxes, 'All You Can Eat', 'Unlimited sushi, sashimi, and rolls. Indulge in our finest selections with no limits. Perfect for sushi lovers who want to explore our entire menu.', 179, 'https://images.unsplash.com/photo-1725611756448-213b2db6339a', 'All you can eat sushi buffet spread with various rolls and nigiri', 'Unlimited', true, 1),
            (cat_sushi_boxes, 'Mizu Sushi Box 12', 'Curated selection of 12 premium sushi pieces featuring fresh salmon, tuna, and seasonal fish. Perfect for individual dining.', 99, 'https://images.unsplash.com/photo-1607246749144-7bc0e401623c', 'Elegant sushi box with 12 assorted nigiri pieces', NULL, true, 2),
            (cat_sushi_boxes, 'Mizu Sushi Box 16', 'Generous assortment of 16 pieces including nigiri, sashimi, and maki rolls. Ideal for sharing or a hearty meal.', 139, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', 'Large sushi box with 16 mixed pieces of sushi and rolls', NULL, true, 3),
            (cat_sushi_boxes, 'Mizu Sushi Box 24', 'Ultimate sushi experience with 24 pieces of our chef''s finest selections. A complete journey through Japanese flavors.', 239, 'https://images.unsplash.com/photo-1583623025817-d180a2221d0a', 'Premium sushi box with 24 assorted pieces beautifully arranged', 'Premium', true, 4)
        ON CONFLICT (id) DO NOTHING;
    END IF;

    -- STARTERS (18 items)
    IF cat_starters IS NOT NULL THEN
        INSERT INTO public.menu_items (category_id, name, description, price, image_url, image_alt, is_available, display_order) VALUES
            -- Soups
            (cat_starters, 'Miso Soup', 'Traditional Japanese soup with tofu, wakame seaweed, and spring onions in savory miso broth.', 38, 'https://images.unsplash.com/photo-1684866907269-2248f7334a09', 'Bowl of miso soup with tofu and seaweed', true, 1),
            (cat_starters, 'Corn Soup', 'Creamy sweet corn soup with a hint of butter, garnished with crispy corn kernels.', 40, 'https://images.unsplash.com/photo-1547592166-23ac45744acd', 'Bowl of creamy corn soup', true, 2),
            (cat_starters, 'Tom Yam Soup', 'Spicy and sour Thai soup with lemongrass, galangal, kaffir lime leaves, and fresh seafood.', 75, 'https://images.unsplash.com/photo-1625944525533-473f1a3d54e7', 'Bowl of tom yam soup with shrimp and herbs', true, 3),
            -- Cold Starters
            (cat_starters, 'Carpaccio Trio', 'Three varieties of thinly sliced raw fish: tuna, salmon, and yellowtail with citrus ponzu and microgreens.', 98, 'https://images.unsplash.com/photo-1611143669185-af224c5e3252', 'Platter of three fish carpaccio varieties', true, 4),
            (cat_starters, 'Tuna Tartar', 'Finely diced fresh tuna mixed with sesame oil, soy, and avocado, served with crispy wonton chips.', 92, 'https://images.unsplash.com/photo-1546833998-877b37c2e5c6', 'Tuna tartar with avocado and wonton chips', true, 5),
            (cat_starters, 'Yellowtail Carpaccio', 'Paper-thin slices of yellowtail with jalapeño, cilantro, and yuzu soy dressing.', 88, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', 'Yellowtail carpaccio with jalapeño slices', true, 6),
            (cat_starters, 'Salmon Avocado Carpaccio', 'Fresh salmon carpaccio topped with creamy avocado, microgreens, and truffle oil.', 71, 'https://images.unsplash.com/photo-1611143669185-af224c5e3252', 'Salmon carpaccio with avocado and truffle oil', true, 7),
            -- Hot Starters
            (cat_starters, 'Shrimp Popcorn', 'Crispy fried shrimp bites with spicy mayo dipping sauce. Perfectly crunchy and addictive.', 60, 'https://images.unsplash.com/photo-1565557623262-b51c2513a641', 'Crispy shrimp popcorn with dipping sauce', true, 8),
            (cat_starters, 'Chicken Popcorn', 'Bite-sized crispy chicken pieces seasoned with Japanese spices and served with sweet chili sauce.', 55, 'https://images.unsplash.com/photo-1562967914-608f82629710', 'Crispy chicken popcorn bites', true, 9),
            (cat_starters, 'Fried Squid', 'Tender squid rings lightly battered and fried until golden, served with tangy lemon aioli.', 55, 'https://images.unsplash.com/photo-1604908815461-7a8f4f6d6d8f', 'Golden fried squid rings', true, 10),
            (cat_starters, 'Gyoza', 'Pan-fried Japanese dumplings filled with pork and vegetables, served with soy-vinegar dipping sauce.', 45, 'https://images.unsplash.com/photo-1718282005920-1de79a26794f', 'Pan-fried gyoza dumplings', true, 11),
            (cat_starters, 'Vegetable Spring Rolls', 'Crispy spring rolls filled with fresh vegetables and glass noodles, served with sweet chili sauce.', 42, 'https://images.unsplash.com/photo-1541529086526-db283c563270', 'Crispy vegetable spring rolls', true, 12),
            (cat_starters, 'Chicken Yakitori', 'Grilled chicken skewers glazed with teriyaki sauce and sprinkled with sesame seeds.', 53, 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143', 'Grilled chicken yakitori skewers', true, 13),
            (cat_starters, 'Spicy Chicken Wings', 'Crispy chicken wings tossed in spicy Korean gochujang sauce with spring onions.', 55, 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7', 'Spicy chicken wings with sauce', true, 14),
            -- Light Bites
            (cat_starters, 'Edamame', 'Steamed young soybeans lightly salted. A healthy and delicious snack.', 35, 'https://images.unsplash.com/photo-1583663848850-46af132dc08e', 'Bowl of steamed edamame', true, 15),
            (cat_starters, 'Beef Asparagus Roll', 'Tender beef wrapped around crisp asparagus spears, grilled and glazed with teriyaki sauce.', 65, 'https://images.unsplash.com/photo-1544025162-d76694265947', 'Beef asparagus rolls with teriyaki glaze', true, 16),
            (cat_starters, 'Wasabi Prawn', 'Crispy prawns with a spicy wasabi mayo coating. Bold flavors for adventurous palates.', 72, 'https://images.unsplash.com/photo-1565557623262-b51c2513a641', 'Wasabi prawns with spicy coating', true, 17),
            (cat_starters, 'Beef Broccoli', 'Tender beef slices stir-fried with fresh broccoli in savory oyster sauce.', 65, 'https://images.unsplash.com/photo-1544025162-d76694265947', 'Beef and broccoli stir-fry', true, 18)
        ON CONFLICT (id) DO NOTHING;
    END IF;

    -- SUSHI & ROLLS (23 items)
    IF cat_sushi_rolls IS NOT NULL THEN
        INSERT INTO public.menu_items (category_id, name, description, price, image_url, image_alt, is_available, display_order) VALUES
            -- Classic Rolls
            (cat_sushi_rolls, 'California Roll', 'Classic roll with crab stick, avocado, and cucumber topped with sesame seeds.', 44, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', 'California roll with sesame seeds', true, 1),
            (cat_sushi_rolls, 'Philadelphia Roll', 'Smoked salmon, cream cheese, and cucumber. A creamy and savory combination.', 61, 'https://images.unsplash.com/photo-1617196034183-421b4917c92d', 'Philadelphia roll with salmon and cream cheese', true, 2),
            (cat_sushi_rolls, 'Tempura Shrimp Roll', 'Crispy tempura shrimp with avocado, cucumber, and spicy mayo.', 52, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', 'Tempura shrimp roll with spicy mayo', true, 3),
            (cat_sushi_rolls, 'Crunchy Roll', 'Tempura flakes, cucumber, and avocado with sweet eel sauce.', 48, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', 'Crunchy roll with tempura flakes', true, 4),
            (cat_sushi_rolls, 'Spicy Tuna Roll', 'Fresh tuna mixed with spicy mayo, cucumber, and scallions.', 50, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', 'Spicy tuna roll with scallions', true, 5),
            (cat_sushi_rolls, 'Spicy Salmon Roll', 'Fresh salmon with spicy mayo, avocado, and cucumber.', 50, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', 'Spicy salmon roll with avocado', true, 6),
            (cat_sushi_rolls, 'Alaska Roll', 'Fresh salmon, avocado, and cucumber with a touch of lemon zest.', 56, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', 'Alaska roll with salmon and avocado', true, 7),
            (cat_sushi_rolls, 'Fried Chicken Roll', 'Crispy chicken katsu with lettuce, cucumber, and teriyaki mayo.', 46, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', 'Fried chicken roll with teriyaki sauce', true, 8),
            -- Maki Rolls (6 pcs)
            (cat_sushi_rolls, 'Kanikama Maki', 'Simple crab stick maki roll. Six pieces of classic Japanese simplicity.', 38, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', 'Kanikama maki roll six pieces', true, 9),
            (cat_sushi_rolls, 'Tekka Maki (Tuna)', 'Fresh tuna maki roll. Six pieces of pure tuna flavor.', 38, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', 'Tekka tuna maki roll six pieces', true, 10),
            (cat_sushi_rolls, 'Sake Maki (Salmon)', 'Fresh salmon maki roll. Six pieces of premium salmon.', 38, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', 'Sake salmon maki roll six pieces', true, 11),
            (cat_sushi_rolls, 'Kappa Maki (Cucumber)', 'Refreshing cucumber maki roll. Six pieces of crisp cucumber.', 32, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', 'Kappa cucumber maki roll six pieces', true, 12),
            (cat_sushi_rolls, 'Avocado Maki', 'Creamy avocado maki roll. Six pieces of smooth avocado.', 32, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', 'Avocado maki roll six pieces', true, 13),
            (cat_sushi_rolls, 'Tuna Mayo Maki', 'Tuna mixed with Japanese mayo. Six pieces of creamy tuna.', 38, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', 'Tuna mayo maki roll six pieces', true, 14),
            -- Nigiri (2 pcs)
            (cat_sushi_rolls, 'Sake (Salmon)', 'Two pieces of fresh salmon nigiri over seasoned rice.', 36, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', 'Salmon nigiri two pieces', true, 15),
            (cat_sushi_rolls, 'Ebi (Shrimp)', 'Two pieces of cooked shrimp nigiri over seasoned rice.', 36, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', 'Shrimp nigiri two pieces', true, 16),
            (cat_sushi_rolls, 'Maguro (Tuna)', 'Two pieces of fresh tuna nigiri over seasoned rice.', 36, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', 'Tuna nigiri two pieces', true, 17),
            (cat_sushi_rolls, 'Hamachi', 'Two pieces of yellowtail nigiri over seasoned rice.', 36, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', 'Yellowtail hamachi nigiri two pieces', true, 18),
            (cat_sushi_rolls, 'Unagi (Eel)', 'Two pieces of grilled eel nigiri with sweet eel sauce.', 39, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', 'Unagi eel nigiri two pieces', true, 19),
            (cat_sushi_rolls, 'Kanikama', 'Two pieces of crab stick nigiri over seasoned rice.', 36, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', 'Kanikama crab stick nigiri two pieces', true, 20),
            -- Sashimi (3 pcs)
            (cat_sushi_rolls, 'Hamachi Sashimi', 'Three pieces of fresh yellowtail sashimi, thinly sliced.', 45, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', 'Yellowtail hamachi sashimi three pieces', true, 21),
            (cat_sushi_rolls, 'Sake (Salmon) Sashimi', 'Three pieces of fresh salmon sashimi, thinly sliced.', 45, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', 'Salmon sashimi three pieces', true, 22),
            (cat_sushi_rolls, 'Maguro (Tuna) Sashimi', 'Three pieces of fresh tuna sashimi, thinly sliced.', 45, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', 'Tuna sashimi three pieces', true, 23)
        ON CONFLICT (id) DO NOTHING;
    END IF;

    -- SIGNATURE ROLLS (22 items)
    IF cat_signature IS NOT NULL THEN
        INSERT INTO public.menu_items (category_id, name, description, price, image_url, image_alt, tag, is_available, display_order) VALUES
            (cat_signature, 'Rainbow Roll', 'California roll topped with assorted sashimi: tuna, salmon, yellowtail, and avocado.', 125, 'https://images.unsplash.com/photo-1593352995140-38a011bf2cc0', 'Rainbow roll with colorful fish topping', 'Signature', true, 1),
            (cat_signature, 'Shrimpino Roll', 'Tempura shrimp, avocado, topped with seared shrimp and spicy mayo.', 105, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', 'Shrimpino roll with seared shrimp', 'Signature', true, 2),
            (cat_signature, 'Crispy N Spicy Roll', 'Spicy tuna, cucumber, topped with crispy tempura flakes and sriracha.', 58, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', 'Crispy spicy roll with tempura flakes', NULL, true, 3),
            (cat_signature, 'Hot Lava Roll', 'Spicy tuna and cucumber topped with seared salmon and jalapeño.', 71, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', 'Hot lava roll with seared salmon', NULL, true, 4),
            (cat_signature, 'Desert Safari Roll', 'Tempura shrimp, cream cheese, topped with crab stick and mango sauce.', 95, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', 'Desert safari roll with mango sauce', 'Signature', true, 5),
            (cat_signature, 'Rocky Road Roll', 'Eel, cucumber, topped with avocado, tempura flakes, and eel sauce.', 98, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', 'Rocky road roll with eel and avocado', 'Signature', true, 6),
            (cat_signature, 'Dragon Roll', 'Tempura shrimp, avocado, topped with eel and avocado in dragon pattern.', 104, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', 'Dragon roll with avocado scales', 'Signature', true, 7),
            (cat_signature, 'Osaka Roll', 'Salmon, cream cheese, cucumber, topped with torched salmon and teriyaki.', 85, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', 'Osaka roll with torched salmon', 'Signature', true, 8),
            (cat_signature, 'Godzilla Roll', 'Spicy tuna, tempura shrimp, topped with seared tuna, jalapeño, and spicy mayo.', 106, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', 'Godzilla roll with seared tuna', 'Signature', true, 9),
            (cat_signature, 'Mountain Roll', 'Crab stick, avocado, cucumber, topped with baked crab mix and tobiko.', 103, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', 'Mountain roll with baked crab', 'Signature', true, 10),
            (cat_signature, 'Crazy Crunchy Roll', 'Tempura shrimp, cucumber, topped with crab stick, tempura flakes, and spicy mayo.', 66, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', 'Crazy crunchy roll with tempura flakes', NULL, true, 11),
            (cat_signature, 'Sakura Roll', 'Tuna, salmon, yellowtail, avocado, wrapped in pink soy paper with ponzu.', 102, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', 'Sakura roll in pink soy paper', 'Signature', true, 12),
            (cat_signature, 'Seared Salmon Roll', 'California roll topped with torched salmon, garlic mayo, and spring onions.', 92, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', 'Seared salmon roll with garlic mayo', 'Signature', true, 13),
            (cat_signature, 'Dynamite Roll', 'Tempura shrimp, avocado, topped with spicy tuna and dynamite sauce.', 78, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', 'Dynamite roll with spicy tuna', NULL, true, 14),
            (cat_signature, 'Cheetos Roll', 'Spicy crab, cucumber, topped with salmon and crushed Cheetos.', 92, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', 'Cheetos roll with crushed Cheetos topping', 'Signature', true, 15),
            (cat_signature, 'Crispy Tempura Roll', 'Entire roll deep-fried: salmon, crab, avocado, cream cheese with eel sauce.', 95, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', 'Crispy tempura roll deep fried', 'Signature', true, 16),
            (cat_signature, 'Mizu Volcano Roll', 'Spicy tuna, cucumber, topped with baked crab and volcano sauce.', 56, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', 'Mizu volcano roll with baked crab', NULL, true, 17),
            (cat_signature, 'Mizu Shrimp Popcorn Roll', 'Tempura shrimp, avocado, topped with crispy shrimp popcorn and spicy mayo.', 74, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', 'Mizu shrimp popcorn roll with crispy shrimp', NULL, true, 18),
            (cat_signature, 'Seared Hamachi Roll', 'California roll topped with torched yellowtail, jalapeño, and ponzu.', 85, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', 'Seared hamachi roll with jalapeño', 'Signature', true, 19),
            (cat_signature, 'Avocado Tempura Roll', 'Crab, cucumber, topped with tempura-fried avocado and sweet chili sauce.', 101, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', 'Avocado tempura roll with fried avocado', 'Signature', true, 20),
            (cat_signature, 'Crunchy Potato Roll', 'Spicy tuna, cucumber, topped with crispy potato strings and teriyaki.', 68, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', 'Crunchy potato roll with potato strings', NULL, true, 21),
            (cat_signature, 'Mango Crab Roll', 'Crab stick, avocado, cucumber, topped with fresh mango and mango sauce.', 91, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', 'Mango crab roll with fresh mango', 'Signature', true, 22)
        ON CONFLICT (id) DO NOTHING;
    END IF;

    -- MAINS (8 items)
    IF cat_mains IS NOT NULL THEN
        INSERT INTO public.menu_items (category_id, name, description, price, image_url, image_alt, is_available, display_order) VALUES
            (cat_mains, 'Grilled Salmon', 'Fresh salmon fillet grilled to perfection with teriyaki glaze, served with steamed vegetables.', 105, 'https://images.unsplash.com/photo-1467003909585-2f8a72700288', 'Grilled salmon with teriyaki glaze', true, 1),
            (cat_mains, 'Miso Black Cod', 'Premium black cod marinated in sweet miso paste, grilled until caramelized.', 110, 'https://images.unsplash.com/photo-1467003909585-2f8a72700288', 'Miso black cod grilled', true, 2),
            (cat_mains, 'Seafood Tobanyaki', 'Assorted seafood grilled on a hot stone plate with vegetables and garlic butter.', 100, 'https://images.unsplash.com/photo-1467003909585-2f8a72700288', 'Seafood tobanyaki on hot stone', true, 3),
            (cat_mains, 'Beef Tobanyaki', 'Premium beef slices grilled on hot stone with mushrooms and teriyaki sauce.', 96, 'https://images.unsplash.com/photo-1544025162-d76694265947', 'Beef tobanyaki on hot stone', true, 4),
            (cat_mains, 'Chicken Tobanyaki', 'Tender chicken pieces grilled on hot stone with vegetables and soy glaze.', 78, 'https://images.unsplash.com/photo-1562967914-608f82629710', 'Chicken tobanyaki on hot stone', true, 5),
            (cat_mains, 'Shrimp Teppanyaki', 'Jumbo shrimp grilled teppanyaki-style with garlic butter and seasonal vegetables.', 96, 'https://images.unsplash.com/photo-1565557623262-b51c2513a641', 'Shrimp teppanyaki with vegetables', true, 6),
            (cat_mains, 'Chicken Teppanyaki', 'Chicken breast grilled teppanyaki-style with teriyaki sauce and mixed vegetables.', 75, 'https://images.unsplash.com/photo-1562967914-608f82629710', 'Chicken teppanyaki with vegetables', true, 7),
            (cat_mains, 'Beef Sirloin Teppanyaki', 'Premium beef sirloin grilled teppanyaki-style with garlic chips and vegetables.', 99, 'https://images.unsplash.com/photo-1544025162-d76694265947', 'Beef sirloin teppanyaki with garlic', true, 8)
        ON CONFLICT (id) DO NOTHING;
    END IF;

    -- RICE & NOODLES (16 items)
    IF cat_rice_noodles IS NOT NULL THEN
        INSERT INTO public.menu_items (category_id, name, description, price, image_url, image_alt, is_available, display_order) VALUES
            -- Donburi
            (cat_rice_noodles, 'Chicken Teriyaki Don', 'Grilled chicken with teriyaki sauce over steamed rice, topped with sesame seeds.', 54, 'https://images.unsplash.com/photo-1562967914-608f82629710', 'Chicken teriyaki don rice bowl', true, 1),
            (cat_rice_noodles, 'Gyu Don', 'Sliced beef simmered in sweet soy sauce over rice with onions and soft-boiled egg.', 75, 'https://images.unsplash.com/photo-1544025162-d76694265947', 'Gyu don beef rice bowl', true, 2),
            (cat_rice_noodles, 'Ten Don', 'Assorted tempura (shrimp and vegetables) over rice with tempura sauce.', 72, 'https://images.unsplash.com/photo-1565557623262-b51c2513a641', 'Ten don tempura rice bowl', true, 3),
            -- Ramen
            (cat_rice_noodles, 'Dan Dan Ramen', 'Spicy Sichuan-style ramen with minced pork, sesame paste, and chili oil.', 60, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624', 'Dan dan ramen with spicy broth', true, 4),
            (cat_rice_noodles, 'Miso Ramen', 'Rich miso broth ramen with chashu pork, soft-boiled egg, and bamboo shoots.', 78, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624', 'Miso ramen with pork and egg', true, 5),
            -- Yakisoba
            (cat_rice_noodles, 'Vegetable Yakisoba', 'Stir-fried noodles with mixed vegetables and yakisoba sauce.', 56, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624', 'Vegetable yakisoba noodles', true, 6),
            (cat_rice_noodles, 'Chicken Yakisoba', 'Stir-fried noodles with chicken and vegetables in savory yakisoba sauce.', 58, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624', 'Chicken yakisoba noodles', true, 7),
            (cat_rice_noodles, 'Shrimp Yakisoba', 'Stir-fried noodles with shrimp and vegetables in yakisoba sauce.', 66, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624', 'Shrimp yakisoba noodles', true, 8),
            -- Fried Rice
            (cat_rice_noodles, 'Chicken & Vegetable', 'Japanese fried rice with chicken, mixed vegetables, and egg.', 49, 'https://images.unsplash.com/photo-1603133872878-684f208fb84b', 'Chicken vegetable fried rice', true, 9),
            (cat_rice_noodles, 'Prawn & Vegetable', 'Japanese fried rice with prawns, mixed vegetables, and egg.', 54, 'https://images.unsplash.com/photo-1603133872878-684f208fb84b', 'Prawn vegetable fried rice', true, 10),
            (cat_rice_noodles, 'Vegetable', 'Japanese fried rice with assorted vegetables and egg.', 46, 'https://images.unsplash.com/photo-1603133872878-684f208fb84b', 'Vegetable fried rice', true, 11),
            -- Curry
            (cat_rice_noodles, 'Beef Curry', 'Japanese curry with tender beef chunks, carrots, and potatoes over rice.', 77, 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd', 'Beef curry with rice', true, 12),
            (cat_rice_noodles, 'Chicken Curry', 'Japanese curry with chicken, vegetables, and aromatic spices over rice.', 64, 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd', 'Chicken curry with rice', true, 13),
            (cat_rice_noodles, 'Vegetable Curry', 'Japanese curry with assorted vegetables and tofu over rice.', 54, 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd', 'Vegetable curry with rice', true, 14),
            (cat_rice_noodles, 'Shrimp Curry', 'Japanese curry with succulent shrimp and vegetables over rice.', 79, 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd', 'Shrimp curry with rice', true, 15),
            (cat_rice_noodles, 'Katsu Curry', 'Japanese curry with crispy chicken katsu cutlet over rice.', 67, 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd', 'Katsu curry with rice', true, 16)
        ON CONFLICT (id) DO NOTHING;
    END IF;

    -- COMBOS & SHARING (9 items)
    IF cat_combos IS NOT NULL THEN
        INSERT INTO public.menu_items (category_id, name, description, price, image_url, image_alt, tag, is_available, display_order) VALUES
            (cat_combos, 'Maki Matsu Boat (30 pcs)', 'Assorted maki rolls platter with 30 pieces. Perfect for sharing.', 238, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', 'Maki matsu boat with 30 pieces', 'Sharing', true, 1),
            (cat_combos, 'Sashimi Matsu', 'Premium sashimi platter with tuna, salmon, yellowtail, and seasonal fish.', 99, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', 'Sashimi matsu platter', NULL, true, 2),
            (cat_combos, 'Maki Taki', 'Combination of maki rolls and nigiri sushi. A complete sushi experience.', 145, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', 'Maki taki combination platter', NULL, true, 3),
            (cat_combos, 'Mizu Nigiri Combination', 'Assorted nigiri selection featuring our chef''s daily picks.', 125, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', 'Mizu nigiri combination platter', NULL, true, 4),
            (cat_combos, 'Salmon Combination', 'All salmon platter: nigiri, sashimi, and salmon rolls.', 142, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', 'Salmon combination platter', NULL, true, 5),
            (cat_combos, 'Combo Set Menu 1', 'Complete meal set with appetizer, sushi, main course, and dessert.', 350, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', 'Combo set menu one', 'Set Menu', true, 6),
            (cat_combos, 'Combo Set Menu 2', 'Deluxe meal set with premium selections and chef specials.', 350, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', 'Combo set menu two', 'Set Menu', true, 7),
            (cat_combos, 'Combo Set Special 1', 'Premium set with signature rolls, grilled mains, and exclusive desserts.', 400, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', 'Combo set special one', 'Set Menu', true, 8),
            (cat_combos, 'Combo Set Special 2', 'Ultimate dining experience with chef''s finest selections.', 400, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', 'Combo set special two', 'Set Menu', true, 9)
        ON CONFLICT (id) DO NOTHING;
    END IF;

    -- DESSERTS (7 items)
    IF cat_desserts IS NOT NULL THEN
        INSERT INTO public.menu_items (category_id, name, description, price, image_url, image_alt, is_available, display_order) VALUES
            (cat_desserts, 'Kunafa Brest', 'Middle Eastern kunafa pastry filled with cream and topped with pistachios.', 68, 'https://images.unsplash.com/photo-1563805042-7684c019e1cb', 'Kunafa brest with pistachios', true, 1),
            (cat_desserts, 'Mizu Cheesecake', 'Japanese-style light and fluffy cheesecake with berry compote.', 65, 'https://images.unsplash.com/photo-1524351199678-941a58a3df50', 'Mizu cheesecake with berries', true, 2),
            (cat_desserts, 'Fondant Chocolate Cake', 'Warm chocolate lava cake with molten center, served with vanilla ice cream.', 59, 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c', 'Fondant chocolate cake with ice cream', true, 3),
            (cat_desserts, 'Coco Mango', 'Coconut panna cotta with fresh mango and passion fruit coulis.', 65, 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716', 'Coco mango dessert with passion fruit', true, 4),
            (cat_desserts, 'Mochi Ice Cream', 'Japanese mochi filled with ice cream. Choice of flavors: matcha, mango, or strawberry.', 55, 'https://images.unsplash.com/photo-1563805042-7684c019e1cb', 'Mochi ice cream assorted flavors', true, 5),
            (cat_desserts, 'Ice Cream', 'Premium ice cream. Choice of vanilla, chocolate, or green tea.', 40, 'https://images.unsplash.com/photo-1563805042-7684c019e1cb', 'Premium ice cream scoop', true, 6),
            (cat_desserts, 'Mizu Banana Ice Cream', 'Caramelized banana with vanilla ice cream, chocolate sauce, and crushed nuts.', 69, 'https://images.unsplash.com/photo-1563805042-7684c019e1cb', 'Mizu banana ice cream with chocolate', true, 7)
        ON CONFLICT (id) DO NOTHING;
    END IF;

    -- DRINKS (44 items)
    IF cat_drinks IS NOT NULL THEN
        INSERT INTO public.menu_items (category_id, name, description, price, image_url, image_alt, is_available, display_order) VALUES
            -- Fresh Juices & Mocktails
            (cat_drinks, 'Virgin Mojito', 'Refreshing mint and lime mocktail with soda water.', 42, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc', 'Virgin mojito with mint', true, 1),
            (cat_drinks, 'Strawberry Mojito', 'Fresh strawberry mojito with mint and lime.', 42, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc', 'Strawberry mojito with fresh berries', true, 2),
            (cat_drinks, 'Passion Fruit Mojito', 'Tropical passion fruit mojito with mint and lime.', 42, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc', 'Passion fruit mojito', true, 3),
            (cat_drinks, 'Mizu Mocktail', 'House special mocktail with mixed fruits and herbs.', 35, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc', 'Mizu signature mocktail', true, 4),
            (cat_drinks, 'Fruit Punch Mojito (Big)', 'Large fruit punch mojito perfect for sharing.', 65, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc', 'Big fruit punch mojito', true, 5),
            (cat_drinks, 'Fruit Punch Mojito (Small)', 'Individual serving of fruit punch mojito.', 42, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc', 'Small fruit punch mojito', true, 6),
            (cat_drinks, 'Cool Lychee', 'Refreshing lychee juice with ice.', 32, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc', 'Cool lychee juice', true, 7),
            (cat_drinks, 'Fresh Orange Juice', 'Freshly squeezed orange juice.', 34, 'https://images.unsplash.com/photo-1600271886742-f049cd451bba', 'Fresh orange juice', true, 8),
            (cat_drinks, 'Fresh Mint Lemon', 'Refreshing mint lemonade.', 34, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc', 'Fresh mint lemon drink', true, 9),
            (cat_drinks, 'Fresh Pineapple Juice', 'Freshly squeezed pineapple juice.', 34, 'https://images.unsplash.com/photo-1600271886742-f049cd451bba', 'Fresh pineapple juice', true, 10),
            (cat_drinks, 'Fresh Watermelon Juice', 'Freshly squeezed watermelon juice.', 34, 'https://images.unsplash.com/photo-1600271886742-f049cd451bba', 'Fresh watermelon juice', true, 11),
            -- Coffee
            (cat_drinks, 'Espresso', 'Single shot of rich Italian espresso.', 19, 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04', 'Espresso shot', true, 12),
            (cat_drinks, 'Double Espresso', 'Double shot of rich Italian espresso.', 21, 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04', 'Double espresso shot', true, 13),
            (cat_drinks, 'Americano', 'Espresso with hot water.', 21, 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04', 'Americano coffee', true, 14),
            (cat_drinks, 'Latte', 'Espresso with steamed milk and foam.', 25, 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735', 'Latte with foam art', true, 15),
            (cat_drinks, 'Matcha Latte', 'Japanese green tea latte with steamed milk.', 26, 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735', 'Matcha latte with foam', true, 16),
            (cat_drinks, 'Cappuccino', 'Espresso with equal parts steamed milk and foam.', 25, 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735', 'Cappuccino with foam', true, 17),
            (cat_drinks, 'Gibraltar', 'Espresso with steamed milk in a Gibraltar glass.', 26, 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735', 'Gibraltar coffee', true, 18),
            (cat_drinks, 'Flat White', 'Espresso with velvety microfoam milk.', 26, 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735', 'Flat white coffee', true, 19),
            (cat_drinks, 'Affogato', 'Vanilla ice cream drowned in hot espresso.', 29, 'https://images.unsplash.com/photo-1563805042-7684c019e1cb', 'Affogato with ice cream', true, 20),
            -- Tea
            (cat_drinks, 'Lemon Honey Ginger', 'Soothing tea with lemon, honey, and fresh ginger.', 45, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc', 'Lemon honey ginger tea', true, 21),
            (cat_drinks, 'Immuni-Tea', 'Immunity-boosting herbal tea blend.', 45, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc', 'Immuni-tea herbal blend', true, 22),
            (cat_drinks, 'Green Tea', 'Traditional Japanese green tea.', 45, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc', 'Green tea in cup', true, 23),
            (cat_drinks, 'Good Morning Tea', 'Energizing breakfast tea blend.', 45, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc', 'Good morning tea', true, 24),
            (cat_drinks, 'Darjeeling Masala', 'Indian spiced tea with aromatic masala.', 45, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc', 'Darjeeling masala tea', true, 25),
            (cat_drinks, 'Lemonade Twist', 'Refreshing lemonade with a twist of herbs.', 45, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc', 'Lemonade twist drink', true, 26),
            (cat_drinks, 'Sleeping Beauty', 'Calming herbal tea for relaxation.', 45, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc', 'Sleeping beauty tea', true, 27),
            (cat_drinks, 'Mizu Karak Tea', 'Strong spiced tea with milk.', 35, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc', 'Mizu karak tea', true, 28),
            (cat_drinks, 'Sencha Tea', 'Premium Japanese sencha green tea.', 35, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc', 'Sencha green tea', true, 29),
            (cat_drinks, 'Jasmine Tea', 'Fragrant jasmine-scented green tea.', 35, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc', 'Jasmine tea', true, 30),
            -- Soft Drinks
            (cat_drinks, 'Coca Cola', 'Classic Coca Cola.', 15, 'https://images.unsplash.com/photo-1554866585-cd94860890b7', 'Coca Cola bottle', true, 31),
            (cat_drinks, 'Coca Cola Light', 'Diet Coca Cola.', 15, 'https://images.unsplash.com/photo-1554866585-cd94860890b7', 'Coca Cola Light bottle', true, 32),
            (cat_drinks, 'Coca Cola Zero', 'Zero sugar Coca Cola.', 15, 'https://images.unsplash.com/photo-1554866585-cd94860890b7', 'Coca Cola Zero bottle', true, 33),
            (cat_drinks, 'Fanta', 'Orange flavored Fanta.', 15, 'https://images.unsplash.com/photo-1554866585-cd94860890b7', 'Fanta bottle', true, 34),
            (cat_drinks, 'Sprite', 'Lemon-lime Sprite.', 15, 'https://images.unsplash.com/photo-1554866585-cd94860890b7', 'Sprite bottle', true, 35),
            (cat_drinks, 'Schweppes Ginger Ale', 'Refreshing ginger ale.', 15, 'https://images.unsplash.com/photo-1554866585-cd94860890b7', 'Schweppes ginger ale bottle', true, 36),
            (cat_drinks, 'Red Bull', 'Energy drink.', 35, 'https://images.unsplash.com/photo-1554866585-cd94860890b7', 'Red Bull can', true, 37),
            (cat_drinks, 'Red Bull Sugarfree', 'Sugar-free energy drink.', 35, 'https://images.unsplash.com/photo-1554866585-cd94860890b7', 'Red Bull sugarfree can', true, 38),
            (cat_drinks, 'Still Water Small', 'Small bottle of still water.', 17, 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d', 'Small still water bottle', true, 39),
            (cat_drinks, 'Still Water Big', 'Large bottle of still water.', 23, 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d', 'Large still water bottle', true, 40),
            (cat_drinks, 'Sparkling Water Small', 'Small bottle of sparkling water.', 19, 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d', 'Small sparkling water bottle', true, 41),
            (cat_drinks, 'Sparkling Water Big', 'Large bottle of sparkling water.', 29, 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d', 'Large sparkling water bottle', true, 42)
        ON CONFLICT (id) DO NOTHING;
    END IF;

    RAISE NOTICE 'Menu data replacement completed successfully. Total items: 151';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error inserting menu data: %', SQLERRM;
END $$;
