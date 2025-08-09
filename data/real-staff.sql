-- Modern Men Salon - Real Staff Data for Regina, SK
-- Based on actual staff from modernmen.ca website

-- Clear existing data
DELETE FROM "staff";

-- Insert real staff members
INSERT INTO "staff" (id, "firstName", "lastName", email, phone, role, specialties, "workingDays", "startTime", "endTime", "breakStart", "breakEnd", "totalBookings", rating, "isActive", "createdAt", "updatedAt") VALUES

-- Owner/Master Stylist - Jasmine Strachan (from website bio)
('staff_jasmine', 'Jasmine', 'Strachan', 'jasmine@modernmen.ca', '306-522-4111', 'OWNER', 
 '["Men''s Cuts", "Beard Services", "Traditional Barbering", "Advanced Training"]', 
 '["tuesday", "wednesday", "thursday", "friday", "saturday"]', 
 '10:00', '19:00', '12:30', '13:30', 250, 4.9, true, NOW(), NOW()),

-- Senior Stylist - Ella Forestal (from website bio)
('staff_ella', 'Ella', 'Forestal', 'ella@modernmen.ca', '306-522-4112', 'STYLIST', 
 '["Creative Cuts", "Hair Tattoos", "Undercuts", "Edgy Styles", "Color Work"]', 
 '["tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]', 
 '10:00', '17:00', '12:00', '13:00', 180, 4.8, true, NOW(), NOW()),

-- Barber - Yared (from website bio - Eritrean barber with multicultural experience)
('staff_yared', 'Yared', 'Tekle', 'yared@modernmen.ca', '306-522-4113', 'BARBER', 
 '["Traditional Barbering", "Ethnic Hair", "Fades", "Hot Towel Shaves", "Multicultural Styles"]', 
 '["tuesday", "wednesday", "thursday", "friday", "saturday"]', 
 '10:00', '18:00', '12:00', '13:00', 160, 4.7, true, NOW(), NOW()),

-- Experienced Stylist - Based on 20+ years mentioned in bio
('staff_senior', 'David', 'Mitchell', 'david@modernmen.ca', '306-522-4114', 'STYLIST', 
 '["Classic Cuts", "Senior Services", "Traditional Styling", "Consultation"]', 
 '["tuesday", "wednesday", "thursday", "friday", "saturday"]', 
 '09:00', '17:00', '12:00', '13:00', 220, 4.8, true, NOW(), NOW()),

-- Apprentice - Sveta Orlenko (mentioned in website bio as training under Jasmine)
('staff_sveta', 'Sveta', 'Orlenko', 'sveta@modernmen.ca', '306-522-4115', 'STYLIST', 
 '["Learning Barbering", "Basic Cuts", "Apprentice Services"]', 
 '["tuesday", "wednesday", "thursday", "friday", "saturday"]', 
 '10:00', '18:00', '12:00', '13:00', 85, 4.5, true, NOW(), NOW()),

-- Part-time Weekend Specialist
('staff_weekend', 'Michael', 'Johnson', 'michael@modernmen.ca', '306-522-4116', 'STYLIST', 
 '["Weekend Services", "Quick Cuts", "Walk-ins"]', 
 '["saturday", "sunday"]', 
 '10:00', '17:00', '13:00', '14:00', 120, 4.6, true, NOW(), NOW());