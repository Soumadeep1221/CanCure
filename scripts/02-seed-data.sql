-- Insert sample doctors
INSERT INTO users (name, email, password, user_type, specialization, medical_license, is_verified) VALUES
('Dr. Sarah Mitchell', 'sarah.mitchell@cancercareai.com', 'doctor123', 'doctor', 'Oncology', 'MD12345', true),
('Dr. James Chen', 'james.chen@cancercareai.com', 'doctor123', 'doctor', 'Radiology', 'MD12346', true),
('Dr. Maria Rodriguez', 'maria.rodriguez@cancercareai.com', 'doctor123', 'doctor', 'Internal Medicine', 'MD12347', true),
('Dr. David Kim', 'david.kim@cancercareai.com', 'doctor123', 'doctor', 'Preventive Medicine', 'MD12348', true);

-- Insert sample patients
INSERT INTO users (name, email, password, user_type, is_verified) VALUES
('John Smith', 'john.smith@email.com', 'patient123', 'patient', true),
('Emily Johnson', 'emily.johnson@email.com', 'patient123', 'patient', true),
('Michael Brown', 'michael.brown@email.com', 'patient123', 'patient', true),
('Sarah Davis', 'sarah.davis@email.com', 'patient123', 'patient', true),
('Robert Wilson', 'robert.wilson@email.com', 'patient123', 'patient', true);

-- Insert sample assessments
INSERT INTO assessments (user_id, age, risk_score, risk_level, symptoms, lifestyle, assessment_data) 
SELECT 
    u.id,
    CASE 
        WHEN u.name = 'John Smith' THEN 45
        WHEN u.name = 'Emily Johnson' THEN 38
        WHEN u.name = 'Michael Brown' THEN 52
        WHEN u.name = 'Sarah Davis' THEN 41
        WHEN u.name = 'Robert Wilson' THEN 48
    END,
    CASE 
        WHEN u.name = 'John Smith' THEN 12
        WHEN u.name = 'Emily Johnson' THEN 8
        WHEN u.name = 'Michael Brown' THEN 15
        WHEN u.name = 'Sarah Davis' THEN 10
        WHEN u.name = 'Robert Wilson' THEN 13
    END,
    CASE 
        WHEN u.name = 'John Smith' THEN 'Moderate'
        WHEN u.name = 'Emily Johnson' THEN 'Low'
        WHEN u.name = 'Michael Brown' THEN 'High'
        WHEN u.name = 'Sarah Davis' THEN 'Low-Moderate'
        WHEN u.name = 'Robert Wilson' THEN 'Moderate'
    END,
    CASE 
        WHEN u.name = 'John Smith' THEN '["Fatigue", "Weight Loss"]'::jsonb
        WHEN u.name = 'Emily Johnson' THEN '["None"]'::jsonb
        WHEN u.name = 'Michael Brown' THEN '["Persistent Cough", "Chest Pain"]'::jsonb
        WHEN u.name = 'Sarah Davis' THEN '["Fatigue"]'::jsonb
        WHEN u.name = 'Robert Wilson' THEN '["Weight Loss", "Night Sweats"]'::jsonb
    END,
    CASE 
        WHEN u.name = 'John Smith' THEN 'Sedentary lifestyle, occasional smoking'
        WHEN u.name = 'Emily Johnson' THEN 'Active lifestyle, healthy diet'
        WHEN u.name = 'Michael Brown' THEN 'Former smoker, high stress job'
        WHEN u.name = 'Sarah Davis' THEN 'Moderately active, balanced diet'
        WHEN u.name = 'Robert Wilson' THEN 'Sedentary, family history of cancer'
    END,
    '{}'::jsonb
FROM users u 
WHERE u.user_type = 'patient';

-- Insert sample emotional goals
INSERT INTO emotional_goals (user_id, goal, target_date, progress, status)
SELECT 
    u.id,
    goals.goal,
    goals.target_date,
    goals.progress,
    goals.status
FROM users u
CROSS JOIN (
    VALUES 
        ('Reduce anxiety through daily meditation', '2024-06-01'::date, 65, 'active'),
        ('Maintain positive outlook during treatment', '2024-05-15'::date, 80, 'active'),
        ('Build stronger support network', '2024-07-01'::date, 45, 'active'),
        ('Practice gratitude daily', '2024-04-30'::date, 90, 'completed'),
        ('Improve sleep quality', '2024-08-01'::date, 30, 'active')
) AS goals(goal, target_date, progress, status)
WHERE u.user_type = 'patient'
LIMIT 15;

-- Insert sample appointments
INSERT INTO appointments (patient_id, doctor_id, doctor_name, doctor_specialization, appointment_date, appointment_time, reason, status)
SELECT 
    p.id as patient_id,
    d.id as doctor_id,
    d.name as doctor_name,
    d.specialization as doctor_specialization,
    CASE 
        WHEN ROW_NUMBER() OVER() % 4 = 1 THEN CURRENT_DATE + INTERVAL '1 day'
        WHEN ROW_NUMBER() OVER() % 4 = 2 THEN CURRENT_DATE + INTERVAL '3 days'
        WHEN ROW_NUMBER() OVER() % 4 = 3 THEN CURRENT_DATE + INTERVAL '5 days'
        ELSE CURRENT_DATE + INTERVAL '7 days'
    END as appointment_date,
    CASE 
        WHEN ROW_NUMBER() OVER() % 3 = 1 THEN '09:00'::time
        WHEN ROW_NUMBER() OVER() % 3 = 2 THEN '14:00'::time
        ELSE '16:30'::time
    END as appointment_time,
    CASE 
        WHEN ROW_NUMBER() OVER() % 4 = 1 THEN 'Follow-up consultation for assessment results'
        WHEN ROW_NUMBER() OVER() % 4 = 2 THEN 'Initial consultation and risk evaluation'
        WHEN ROW_NUMBER() OVER() % 4 = 3 THEN 'Discuss treatment options and next steps'
        ELSE 'Routine check-up and monitoring'
    END as reason,
    CASE 
        WHEN ROW_NUMBER() OVER() % 3 = 1 THEN 'scheduled'
        WHEN ROW_NUMBER() OVER() % 3 = 2 THEN 'accepted'
        ELSE 'scheduled'
    END as status
FROM users p
CROSS JOIN users d
WHERE p.user_type = 'patient' AND d.user_type = 'doctor'
LIMIT 12;

-- Insert sample notifications
INSERT INTO notifications (user_id, type, title, message, read)
SELECT 
    u.id,
    CASE 
        WHEN ROW_NUMBER() OVER() % 4 = 1 THEN 'appointment_accepted'
        WHEN ROW_NUMBER() OVER() % 4 = 2 THEN 'prescription_received'
        WHEN ROW_NUMBER() OVER() % 4 = 3 THEN 'appointment_request'
        ELSE 'clinical_report'
    END as type,
    CASE 
        WHEN ROW_NUMBER() OVER() % 4 = 1 THEN 'Appointment Confirmed'
        WHEN ROW_NUMBER() OVER() % 4 = 2 THEN 'New Prescription Available'
        WHEN ROW_NUMBER() OVER() % 4 = 3 THEN 'New Appointment Request'
        ELSE 'Clinical Report Available'
    END as title,
    CASE 
        WHEN ROW_NUMBER() OVER() % 4 = 1 THEN 'Your appointment has been confirmed by the doctor.'
        WHEN ROW_NUMBER() OVER() % 4 = 2 THEN 'A new prescription has been issued for you.'
        WHEN ROW_NUMBER() OVER() % 4 = 3 THEN 'You have a new appointment request to review.'
        ELSE 'Your clinical report is now available for review.'
    END as message,
    CASE WHEN ROW_NUMBER() OVER() % 3 = 1 THEN false ELSE true END as read
FROM users u
WHERE u.user_type IN ('patient', 'doctor')
LIMIT 20;
