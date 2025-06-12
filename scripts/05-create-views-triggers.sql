-- ===== 2 QUERY VIEW =====

-- 1. VIEW: Dashboard untuk Graduate (Mahasiswa) - Ringkasan booking mereka
CREATE OR REPLACE VIEW vw_graduate_dashboard AS
SELECT 
    u.U_ID,
    u.U_FullName as graduate_name,
    u.U_Email,
    COUNT(b.B_ID) as total_bookings,
    COUNT(CASE WHEN b.B_Status = 'confirmed' THEN 1 END) as confirmed_bookings,
    COUNT(CASE WHEN b.B_Status = 'pending' THEN 1 END) as pending_bookings,
    COUNT(CASE WHEN b.B_Status = 'cancelled' THEN 1 END) as cancelled_bookings,
    SUM(CASE WHEN b.B_Status = 'confirmed' THEN b.B_Total_Price ELSE 0 END) as total_spent,
    AVG(CASE WHEN b.B_Status = 'confirmed' THEN b.B_Total_Price END) as avg_booking_price,
    MAX(b.B_Date) as latest_booking_date,
    STRING_AGG(DISTINCT ps.Ps_Name, ', ') as booked_sessions
FROM "User" u
LEFT JOIN Bookings b ON u.U_ID = b.User_U_ID
LEFT JOIN PhotoSession ps ON b.PhotoSession_PS_ID = ps.PS_ID
WHERE u.U_UserType = 'student'
GROUP BY u.U_ID, u.U_FullName, u.U_Email
ORDER BY total_bookings DESC, total_spent DESC;

-- 2. VIEW: Dashboard untuk Photographer - Ringkasan bisnis mereka
CREATE OR REPLACE VIEW vw_photographer_dashboard AS
SELECT 
    p.P_ID,
    u.U_FullName as photographer_name,
    u.U_Email,
    u.U_PhoneNumber,
    p.P_Specialty,
    p.P_Rating,
    p.P_Price_per_hour,
    p.P_ExperienceYears,
    COUNT(b.B_ID) as total_bookings,
    COUNT(CASE WHEN b.B_Status = 'confirmed' THEN 1 END) as confirmed_bookings,
    SUM(CASE WHEN b.B_Status = 'confirmed' THEN b.B_Total_Price ELSE 0 END) as total_revenue,
    AVG(CASE WHEN b.B_Status = 'confirmed' THEN b.B_Total_Price END) as avg_booking_value,
    COUNT(DISTINCT b.B_Date) as working_days,
    COUNT(avs.S_ID) as available_schedules,
    ROUND(
        COUNT(CASE WHEN b.B_Status = 'confirmed' THEN 1 END)::numeric / 
        NULLIF(COUNT(avs.S_ID), 0) * 100, 2
    ) as booking_rate_percentage
FROM Photographer p
JOIN "User" u ON p.User_U_ID = u.U_ID
LEFT JOIN Bookings b ON p.P_ID = b.Photographer_P_ID
LEFT JOIN AvailabilitySchedule avs ON p.P_ID = avs.Photographer_P_ID
WHERE u.U_UserType = 'photographer'
GROUP BY p.P_ID, u.U_FullName, u.U_Email, u.U_PhoneNumber, 
         p.P_Specialty, p.P_Rating, p.P_Price_per_hour, p.P_ExperienceYears
ORDER BY total_revenue DESC, booking_rate_percentage DESC;

-- ===== 2 TRIGGER =====

-- 1. TRIGGER: Auto update booking status dan total price
CREATE OR REPLACE FUNCTION update_booking_details()
RETURNS TRIGGER AS $$
DECLARE
    photographer_price DECIMAL(10,2);
    session_duration INTEGER;
    spots_total_price DECIMAL(10,2);
BEGIN
    -- Get photographer price per hour
    SELECT P_Price_per_hour INTO photographer_price
    FROM Photographer 
    WHERE P_ID = NEW.Photographer_P_ID;
    
    -- Calculate session duration in hours
    session_duration := EXTRACT(EPOCH FROM (NEW.B_EndTime - NEW.B_StartTime)) / 3600;
    
    -- Calculate spots total price (will be updated after spots are added)
    SELECT COALESCE(SUM(ps.SP_Price_per_session), 0) INTO spots_total_price
    FROM Bookings_PhotoSpots bps
    JOIN PhotoSpots ps ON bps.PhotoSpots_SP_ID = ps.SP_ID
    WHERE bps.Bookings_B_ID = NEW.B_ID;
    
    -- Update total price
    NEW.B_Total_Price := (photographer_price * session_duration) + spots_total_price;
    
    -- Auto set status to pending if not specified
    IF NEW.B_Status IS NULL THEN
        NEW.B_Status := 'pending';
    END IF;
    
    -- Update timestamp
    NEW.B_Updated_at := CURRENT_TIMESTAMP;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_update_booking_details
    BEFORE INSERT OR UPDATE ON Bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_booking_details();

-- 2. TRIGGER: Update photographer rating berdasarkan feedback booking
CREATE OR REPLACE FUNCTION update_photographer_rating()
RETURNS TRIGGER AS $$
DECLARE
    avg_rating DECIMAL(3,2);
BEGIN
    -- This trigger would be activated when a rating/feedback table is updated
    -- For now, we'll simulate updating based on confirmed bookings success rate
    
    IF NEW.B_Status = 'confirmed' AND OLD.B_Status != 'confirmed' THEN
        -- Calculate new rating based on confirmed bookings ratio
        SELECT 
            LEAST(5.0, 
                GREATEST(3.0, 
                    4.0 + (
                        COUNT(CASE WHEN B_Status = 'confirmed' THEN 1 END)::DECIMAL / 
                        NULLIF(COUNT(*), 0) - 0.7
                    ) * 2
                )
            ) INTO avg_rating
        FROM Bookings 
        WHERE Photographer_P_ID = NEW.Photographer_P_ID;
        
        -- Update photographer rating
        UPDATE Photographer 
        SET P_Rating = avg_rating
        WHERE P_ID = NEW.Photographer_P_ID;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_update_photographer_rating
    AFTER UPDATE ON Bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_photographer_rating();
