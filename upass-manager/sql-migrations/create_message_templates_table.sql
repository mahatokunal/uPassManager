-- SQL migration to create message_templates table

CREATE TABLE IF NOT EXISTS message_templates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default templates
INSERT INTO message_templates (title, message) VALUES 
('Request to Sign Disclaimer', 'Please DocuSign this disclaimer as soon as possible. It will need to be signed prior to picking up your U-Pass card.'),
('U-Pass Card Distribution', 'Good Morning,\n\nThank you for your patience while we have been getting everything prepared. U-Pass cards are now ready to be picked up! Information on when and where is listed below. As a reminder, if you drop below full-time status your card will be deactivated, and you will no longer be able to participate in the program.\n\nLocation: Northern Virginia Resource Center\n7054 Haycock Rd.\nFalls Church, VA 22043\n\nDates and Times:\nFriday, August 18 from 12-8pm\nSaturday, August 19 from 10am to 4pm\nAugust 21-24 from 12-8pm\nFriday, August 25 from 12-4pm\n\nRegards,\nVT Sustainable Transportation');
