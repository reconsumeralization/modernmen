-- Modern Men Salon - Real Products Data for Regina, SK
-- Professional men's grooming products sold at the salon

-- Clear existing data
DELETE FROM "products";

-- Insert real products with realistic pricing
INSERT INTO "products" (id, name, brand, description, price, cost, category, "inStock", "minStock", sku, barcode, "imageUrls", "isActive", "isFeatured", "createdAt", "updatedAt") VALUES

-- POMADES & STYLING
('prod_reuzel_blue', 'Blue Pomade', 'Reuzel', 'Strong hold water-based pomade with high shine. Perfect for classic styles.', 24.99, 14.50, 'Styling', 12, 3, 'REU-BLUE-113G', '8719327076095', '["images/products/reuzel-blue.jpg"]', true, true, NOW(), NOW()),

('prod_reuzel_red', 'Red Pomade', 'Reuzel', 'Medium hold oil-based pomade with subtle shine. Great for all-day hold.', 24.99, 14.50, 'Styling', 8, 3, 'REU-RED-113G', '8719327076088', '["images/products/reuzel-red.jpg"]', true, false, NOW(), NOW()),

('prod_american_crew_fiber', 'Fiber', 'American Crew', 'High hold, low shine cream. Adds texture and thickness to hair.', 22.99, 13.75, 'Styling', 15, 5, 'AC-FIBER-85G', '738678003510', '["images/products/ac-fiber.jpg"]', true, true, NOW(), NOW()),

('prod_layrite_cement', 'Cement Clay', 'Layrite', 'Matte finish clay with strong hold. Perfect for textured, modern styles.', 26.99, 16.20, 'Styling', 6, 2, 'LAY-CEMENT-120G', '850008605093', '["images/products/layrite-cement.jpg"]', true, false, NOW(), NOW()),

-- BEARD CARE
('prod_honest_amish_balm', 'Beard Balm', 'Honest Amish', 'All-natural beard balm for conditioning and light hold. Made with organic ingredients.', 19.99, 11.25, 'Beard Care', 10, 3, 'HA-BALM-60ML', '854509005007', '["images/products/honest-amish-balm.jpg"]', true, true, NOW(), NOW()),

('prod_beard_oil_cedar', 'Cedar Beard Oil', 'Modern Men', 'Premium beard oil with cedarwood scent. Softens and conditions facial hair.', 16.99, 8.50, 'Beard Care', 18, 5, 'MM-OIL-CEDAR-30ML', 'MM001CEDAR30', '["images/products/cedar-beard-oil.jpg"]', true, true, NOW(), NOW()),

('prod_mustache_wax', 'Mustache Wax', 'Fisticuffs', 'Strong hold mustache wax for styling and shaping. Long-lasting formula.', 14.99, 7.75, 'Beard Care', 8, 2, 'FIST-WAX-15G', '854509005014', '["images/products/mustache-wax.jpg"]', true, false, NOW(), NOW()),

-- SHAMPOO & CARE
('prod_daily_shampoo', 'Daily Shampoo', 'American Crew', 'Cleansing shampoo for normal to oily hair and scalp. Removes buildup.', 18.99, 11.40, 'Hair Care', 12, 4, 'AC-SHAMP-250ML', '738678002513', '["images/products/ac-daily-shampoo.jpg"]', true, false, NOW(), NOW()),

('prod_daily_conditioner', 'Daily Conditioner', 'American Crew', 'Moisturizing conditioner for all hair types. Detangles and softens.', 18.99, 11.40, 'Hair Care', 10, 4, 'AC-COND-250ML', '738678002520', '["images/products/ac-daily-conditioner.jpg"]', true, false, NOW(), NOW()),

('prod_tea_tree_shampoo', 'Tea Tree Shampoo', 'Paul Mitchell', 'Invigorating shampoo with tea tree oil. Cleanses and refreshes scalp.', 24.99, 15.00, 'Hair Care', 8, 2, 'PM-TEATREE-300ML', '009531114934', '["images/products/tea-tree-shampoo.jpg"]', true, false, NOW(), NOW()),

-- AFTERSHAVE & SKINCARE
('prod_aftershave_balm', 'Aftershave Balm', 'Proraso', 'Soothing aftershave balm with eucalyptus and menthol. Prevents irritation.', 16.99, 9.50, 'Skincare', 14, 3, 'PRO-BALM-100ML', '8004395001385', '["images/products/proraso-balm.jpg"]', true, true, NOW(), NOW()),

('prod_face_moisturizer', 'Face Moisturizer', 'Bulldog', 'Lightweight daily moisturizer for men. Non-greasy formula with natural ingredients.', 12.99, 7.80, 'Skincare', 16, 4, 'BULL-MOIST-100ML', '5060144647065', '["images/products/bulldog-moisturizer.jpg"]', true, false, NOW(), NOW()),

-- TOOLS & ACCESSORIES
('prod_beard_comb', 'Wooden Beard Comb', 'Modern Men', 'Handcrafted wooden comb for beard grooming. Anti-static and smooth.', 12.99, 5.25, 'Tools', 20, 5, 'MM-COMB-WOOD', 'MM002COMBWOOD', '["images/products/wooden-comb.jpg"]', true, false, NOW(), NOW()),

('prod_boar_brush', 'Boar Bristle Brush', 'Kent', 'Natural boar bristle brush for hair styling. Distributes natural oils.', 34.99, 21.00, 'Tools', 6, 2, 'KENT-BRUSH-G13', '5011637000313', '["images/products/boar-brush.jpg"]', true, false, NOW(), NOW()),

-- GIFT SETS
('prod_starter_kit', 'Grooming Starter Kit', 'Modern Men', 'Complete grooming kit: pomade, beard oil, aftershave balm, and comb.', 59.99, 32.00, 'Gift Sets', 8, 2, 'MM-KIT-STARTER', 'MM003KITSTART', '["images/products/starter-kit.jpg"]', true, true, NOW(), NOW()),

('prod_beard_kit', 'Ultimate Beard Kit', 'Modern Men', 'Everything for beard care: oil, balm, wax, wooden comb, and boar brush.', 79.99, 42.50, 'Gift Sets', 5, 1, 'MM-KIT-BEARD', 'MM004KITBEARD', '["images/products/beard-kit.jpg"]', true, true, NOW(), NOW());