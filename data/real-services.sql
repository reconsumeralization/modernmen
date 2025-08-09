-- Modern Men Salon - Real Services Data for Regina, SK
-- Based on actual men's salon pricing in Regina (2024-2025)

-- Clear existing data
DELETE FROM "services";

-- Insert real services with Regina-appropriate pricing
INSERT INTO "services" (id, name, description, duration, price, category, "addOns", "isActive", "createdAt", "updatedAt") VALUES

-- HAIRCUTS & STYLING
('srv_haircut_classic', 'Classic Men''s Haircut', 'Traditional scissor cut with styling. Includes wash, cut, and style with premium products.', 45, 45.00, 'Haircuts', '["beard trim", "hot towel", "styling gel"]', true, NOW(), NOW()),

('srv_haircut_premium', 'Premium Cut & Style', 'Precision cut with consultation, wash, cut, style, and finishing. Our signature service.', 60, 65.00, 'Haircuts', '["beard trim", "hot towel", "clay pomade", "texture spray"]', true, NOW(), NOW()),

('srv_haircut_fade', 'Fade Haircut', 'Modern fade cut - high, mid, or low fade. Includes wash and style.', 50, 50.00, 'Haircuts', '["beard trim", "hot towel", "line up"]', true, NOW(), NOW()),

('srv_haircut_buzz', 'Buzz Cut', 'Quick and clean buzz cut. Perfect for low-maintenance style.', 20, 35.00, 'Haircuts', '["beard trim", "hot towel"]', true, NOW(), NOW()),

('srv_haircut_senior', 'Senior Cut (65+)', 'Classic haircut for seniors. Same great service at a special rate.', 45, 40.00, 'Haircuts', '["beard trim", "hot towel"]', true, NOW(), NOW()),

('srv_haircut_youth', 'Youth Cut (Under 16)', 'Stylish cuts for young men. Trendy styles that parents love.', 40, 38.00, 'Haircuts', '["styling gel", "texture spray"]', true, NOW(), NOW()),

-- BEARD SERVICES
('srv_beard_trim', 'Beard Trim & Shape', 'Professional beard trimming and shaping. Includes hot towel treatment.', 25, 25.00, 'Beard Services', '["mustache trim", "hot towel", "beard oil"]', true, NOW(), NOW()),

('srv_beard_full', 'Full Beard Service', 'Complete beard grooming: trim, shape, hot towel, and premium beard products.', 35, 40.00, 'Beard Services', '["mustache trim", "hot towel", "beard oil", "beard balm"]', true, NOW(), NOW()),

('srv_mustache', 'Mustache Trim', 'Precision mustache trimming and styling.', 15, 18.00, 'Beard Services', '["hot towel", "mustache wax"]', true, NOW(), NOW()),

-- SHAVING SERVICES
('srv_shave_traditional', 'Traditional Hot Towel Shave', 'Classic straight razor shave with hot towels, pre-shave oil, and aftershave balm.', 45, 55.00, 'Shaving', '["beard trim", "mustache trim", "face moisturizer"]', true, NOW(), NOW()),

('srv_shave_head', 'Head Shave', 'Professional head shave service with hot towels and premium products.', 30, 45.00, 'Shaving', '["hot towel", "scalp moisturizer"]', true, NOW(), NOW()),

-- SPECIALTY SERVICES
('srv_wash_style', 'Wash & Style Only', 'Professional wash and styling service without a cut.', 20, 25.00, 'Styling', '["styling gel", "pomade", "texture spray"]', true, NOW(), NOW()),

('srv_consultation', 'Style Consultation', 'Personal style consultation with our master stylists. Perfect for major changes.', 30, 35.00, 'Consultation', '["style guide", "product recommendations"]', true, NOW(), NOW()),

('srv_wedding_groom', 'Groom Package', 'Complete grooming for your special day: cut, style, beard trim, and hot towel shave.', 90, 120.00, 'Special Events', '["beard trim", "hot towel shave", "premium styling", "photos"]', true, NOW(), NOW()),

('srv_wedding_party', 'Wedding Party Service', 'Group grooming for groomsmen. Includes cut and style (minimum 3 people).', 60, 85.00, 'Special Events', '["group discount", "timeline coordination"]', true, NOW(), NOW()),

-- TREATMENTS
('srv_scalp_treatment', 'Scalp Treatment', 'Deep cleansing scalp treatment with massage and premium products.', 30, 45.00, 'Treatments', '["scalp massage", "deep conditioning", "essential oils"]', true, NOW(), NOW()),

('srv_grey_blending', 'Grey Blending', 'Natural grey blending service to reduce grey appearance without obvious coloring.', 60, 75.00, 'Treatments', '["color consultation", "toner", "aftercare products"]', true, NOW(), NOW());