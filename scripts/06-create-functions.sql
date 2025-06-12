-- ===== 2 FUNCTION/PROCEDURE =====

-- 1. FUNCTION: Get available time slots for photographer pada tanggal tertentu
CREATE OR REPLACE FUNCTION get_photographer_available_slots(
    p_photographer_id INTEGER,
    p_date DATE
)
RETURNS TABLE (
    available_start_time TIME,
    available_end_time TIME,
    duration_hours INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        avs.S_StartTime as available_start_time,
        avs.S_EndTime as available_end_time,
        EXTRACT(EPOCH FROM (avs.S_EndTime - avs.S_StartTime))::INTEGER / 3600 as duration_hours
    FROM AvailabilitySchedule avs
    WHERE avs.Photographer_P_ID = p_photographer_id
        AND avs.S_Date = p_date
        AND NOT EXISTS (
            SELECT 1 FROM Bookings b
            WHERE b.Photographer_P_ID = p_photographer_id
                AND b.B_Date = p_date
                AND b.B_Status IN ('confirmed', 'pending')
                AND (
                    (b.B_StartTime < avs.S_EndTime AND b.B_EndTime > avs.S_StartTime)
                )
        )
    ORDER BY avs.S_StartTime;
END;
$$ LANGUAGE plpgsql;

-- 2. PROCEDURE: Create booking dengan validasi dan perhitungan otomatis
CREATE OR REPLACE FUNCTION create_booking_with_validation(
    p_user_id INTEGER,
    p_photographer_id INTEGER,
    p_photosession_id INTEGER,
    p_date DATE,
    p_start_time TIME,
    p_end_time TIME,
    p_special_request TEXT DEFAULT NULL,
    p_photo_spots INTEGER[] DEFAULT NULL
)
RETURNS TABLE (
    booking_id INTEGER,
    total_price DECIMAL(12,2),
    status VARCHAR(20),
    message TEXT
) AS $$
DECLARE
    v_booking_id INTEGER;
    v_photographer_available BOOLEAN := FALSE;
    v_session_available BOOLEAN := FALSE;
    v_spots_available BOOLEAN := TRUE;
    v_total_price DECIMAL(12,2) := 0;
    v_photographer_price DECIMAL(10,2);
    v_session_duration INTEGER;
    v_spots_price DECIMAL(10,2) := 0;
    v_spot_id INTEGER;
    v_message TEXT := 'Booking berhasil dibuat';
BEGIN
    -- Validate photographer availability
    SELECT COUNT(*) > 0 INTO v_photographer_available
    FROM AvailabilitySchedule avs
    WHERE avs.Photographer_P_ID = p_photographer_id
        AND avs.S_Date = p_date
        AND p_start_time >= avs.S_StartTime
        AND p_end_time <= avs.S_EndTime
        AND NOT EXISTS (
            SELECT 1 FROM Bookings b
            WHERE b.Photographer_P_ID = p_photographer_id
                AND b.B_Date = p_date
                AND b.B_Status IN ('confirmed', 'pending')
                AND (p_start_time < b.B_EndTime AND p_end_time > b.B_StartTime)
        );
    
    -- Validate photo session availability
    SELECT COUNT(*) > 0 INTO v_session_available
    FROM PhotoSession ps
    WHERE ps.PS_ID = p_photosession_id
        AND ps.PS_Date = p_date
        AND ps.PS_StartTime <= p_start_time
        AND ps.PS_EndTime >= p_end_time
        AND ps.PS_Status = 'available';
    
    -- Validate photo spots availability if provided
    IF p_photo_spots IS NOT NULL THEN
        FOREACH v_spot_id IN ARRAY p_photo_spots
        LOOP
            IF NOT EXISTS (
                SELECT 1 FROM PhotoSpots ps
                WHERE ps.SP_ID = v_spot_id AND ps.SP_IsAvailable = TRUE
            ) THEN
                v_spots_available := FALSE;
                v_message := 'Salah satu photo spot tidak tersedia';
                EXIT;
            END IF;
        END LOOP;
    END IF;
    
    -- If all validations pass, create booking
    IF v_photographer_available AND v_session_available AND v_spots_available THEN
        -- Get photographer price
        SELECT P_Price_per_hour INTO v_photographer_price
        FROM Photographer WHERE P_ID = p_photographer_id;
        
        -- Calculate duration
        v_session_duration := EXTRACT(EPOCH FROM (p_end_time - p_start_time)) / 3600;
        
        -- Calculate spots price
        IF p_photo_spots IS NOT NULL THEN
            SELECT COALESCE(SUM(SP_Price_per_session), 0) INTO v_spots_price
            FROM PhotoSpots 
            WHERE SP_ID = ANY(p_photo_spots);
        END IF;
        
        -- Calculate total price
        v_total_price := (v_photographer_price * v_session_duration) + v_spots_price;
        
        -- Insert booking
        INSERT INTO Bookings (
            B_Date, B_StartTime, B_EndTime, B_Total_Price, B_Status,
            B_SpecialRequest, B_Created_at, B_Updated_at,
            User_U_ID, Photographer_P_ID, PhotoSession_PS_ID
        ) VALUES (
            p_date, p_start_time, p_end_time, v_total_price, 'pending',
            p_special_request, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
            p_user_id, p_photographer_id, p_photosession_id
        ) RETURNING B_ID INTO v_booking_id;
        
        -- Insert photo spots relationships
        IF p_photo_spots IS NOT NULL THEN
            FOREACH v_spot_id IN ARRAY p_photo_spots
            LOOP
                INSERT INTO Bookings_PhotoSpots (Bookings_B_ID, PhotoSpots_SP_ID)
                VALUES (v_booking_id, v_spot_id);
            END LOOP;
        END IF;
        
        RETURN QUERY SELECT v_booking_id, v_total_price, 'pending'::VARCHAR(20), v_message;
    ELSE
        -- Return error message
        IF NOT v_photographer_available THEN
            v_message := 'Fotografer tidak tersedia pada waktu yang dipilih';
        ELSIF NOT v_session_available THEN
            v_message := 'Sesi foto tidak tersedia pada waktu yang dipilih';
        END IF;
        
        RETURN QUERY SELECT NULL::INTEGER, 0::DECIMAL(12,2), 'failed'::VARCHAR(20), v_message;
    END IF;
END;
$$ LANGUAGE plpgsql;
