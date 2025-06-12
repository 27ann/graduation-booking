-- INSERT User Data (25 rows) - Mahasiswa ITS + Fotografer
INSERT INTO "User" (U_ID, U_Username, U_Password, U_Email, U_FullName, U_PhoneNumber, U_UserType, U_Created_at, U_IsActive) VALUES
-- Mahasiswa ITS
(1, 'ahmad_rizky', 'hashed_password_1', 'ahmad.rizky.2021@student.its.ac.id', 'Ahmad Rizky Pratama', '081234567890', 'student', '2024-01-15 10:00:00', TRUE),
(2, 'sari_indah', 'hashed_password_2', 'sari.indah.2021@student.its.ac.id', 'Sari Indah Permata', '081234567891', 'student', '2024-01-16 10:30:00', TRUE),
(3, 'budi_santoso', 'hashed_password_3', 'budi.santoso.2021@student.its.ac.id', 'Budi Santoso', '081234567892', 'student', '2024-01-17 11:00:00', TRUE),
(4, 'maya_putri', 'hashed_password_4', 'maya.putri.2021@student.its.ac.id', 'Maya Putri Sari', '081234567893', 'student', '2024-01-18 11:30:00', TRUE),
(5, 'doni_kurniawan', 'hashed_password_5', 'doni.kurniawan.2021@student.its.ac.id', 'Doni Kurniawan', '081234567894', 'student', '2024-01-19 12:00:00', TRUE),
(6, 'rina_maharani', 'hashed_password_6', 'rina.maharani.2021@student.its.ac.id', 'Rina Maharani', '081234567895', 'student', '2024-01-20 12:30:00', TRUE),
(7, 'eko_prasetyo', 'hashed_password_7', 'eko.prasetyo.2021@student.its.ac.id', 'Eko Prasetyo', '081234567896', 'student', '2024-01-21 13:00:00', TRUE),
(8, 'dewi_lestari', 'hashed_password_8', 'dewi.lestari.2021@student.its.ac.id', 'Dewi Lestari', '081234567897', 'student', '2024-01-22 13:30:00', TRUE),
(9, 'andi_wijaya', 'hashed_password_9', 'andi.wijaya.2021@student.its.ac.id', 'Andi Wijaya', '081234567898', 'student', '2024-01-23 14:00:00', TRUE),
(10, 'fitri_ayu', 'hashed_password_10', 'fitri.ayu.2021@student.its.ac.id', 'Fitri Ayu Ningrum', '081234567899', 'student', '2024-01-24 14:30:00', TRUE),
(11, 'reza_maulana', 'hashed_password_11', 'reza.maulana.2021@student.its.ac.id', 'Reza Maulana', '081234567900', 'student', '2024-01-25 15:00:00', TRUE),
(12, 'linda_sari', 'hashed_password_12', 'linda.sari.2021@student.its.ac.id', 'Linda Sari', '081234567901', 'student', '2024-01-26 15:30:00', TRUE),
(13, 'hendra_gunawan', 'hashed_password_13', 'hendra.gunawan.2021@student.its.ac.id', 'Hendra Gunawan', '081234567902', 'student', '2024-01-27 16:00:00', TRUE),
(14, 'nur_fadila', 'hashed_password_14', 'nur.fadila.2021@student.its.ac.id', 'Nur Fadila Rahman', '081234567903', 'student', '2024-01-28 16:30:00', TRUE),
(15, 'agus_setiawan', 'hashed_password_15', 'agus.setiawan.2021@student.its.ac.id', 'Agus Setiawan', '081234567904', 'student', '2024-01-29 17:00:00', TRUE),
(16, 'novi_handayani', 'hashed_password_16', 'novi.handayani.2021@student.its.ac.id', 'Novi Handayani', '081234567905', 'student', '2024-01-30 17:30:00', TRUE),
(17, 'bayu_pratama', 'hashed_password_17', 'bayu.pratama.2021@student.its.ac.id', 'Bayu Pratama', '081234567906', 'student', '2024-02-01 18:00:00', TRUE),
(18, 'sinta_dewi', 'hashed_password_18', 'sinta.dewi.2021@student.its.ac.id', 'Sinta Dewi', '081234567907', 'student', '2024-02-02 18:30:00', TRUE),

-- Fotografer
(19, 'photographer_1', 'hashed_password_19', 'foto.studio1@its.ac.id', 'Studio Foto Kenzie', '082111222333', 'photographer', '2024-01-10 09:00:00', TRUE),
(20, 'photographer_2', 'hashed_password_20', 'foto.studio2@its.ac.id', 'Visual Art Studio', '082111222334', 'photographer', '2024-01-11 09:30:00', TRUE),
(21, 'photographer_3', 'hashed_password_21', 'foto.studio3@its.ac.id', 'Moment Capture', '082111222335', 'photographer', '2024-01-12 10:00:00', TRUE),
(22, 'photographer_4', 'hashed_password_22', 'foto.studio4@its.ac.id', 'ITS Photo Pro', '082111222336', 'photographer', '2024-01-13 10:30:00', TRUE),
(23, 'photographer_5', 'hashed_password_23', 'foto.studio5@its.ac.id', 'Campus Memory', '082111222337', 'photographer', '2024-01-14 11:00:00', TRUE),

-- Admin
(24, 'admin_its', 'hashed_password_24', 'admin.foto@its.ac.id', 'Admin Sistem Foto', '082111222338', 'admin', '2024-01-01 08:00:00', TRUE),
(25, 'supervisor_foto', 'hashed_password_25', 'supervisor.foto@its.ac.id', 'Supervisor Foto ITS', '082111222339', 'admin', '2024-01-02 08:30:00', TRUE);

-- INSERT Photographer Data (5 fotografer)
INSERT INTO Photographer (P_ID, P_PortfolioUrl, P_ExperienceYears, P_Specialty, P_Rating, P_Price_per_hour, P_IsAvailable, P_Created_at, User_U_ID) VALUES
(1, 'https://portfolio.kenzie-studio.com', 5, 'Graduation & Portrait', 4.8, 150000.00, TRUE, '2024-01-10 09:00:00', 19),
(2, 'https://portfolio.visualart.com', 7, 'Wedding & Graduation', 4.9, 200000.00, TRUE, '2024-01-11 09:30:00', 20),
(3, 'https://portfolio.momentcapture.com', 3, 'Event & Portrait', 4.5, 120000.00, TRUE, '2024-01-12 10:00:00', 21),
(4, 'https://portfolio.itsphoto.com', 8, 'Professional Portrait', 4.7, 180000.00, TRUE, '2024-01-13 10:30:00', 22),
(5, 'https://portfolio.campusmemory.com', 4, 'Graduation & Campus Life', 4.6, 130000.00, TRUE, '2024-01-14 11:00:00', 23);
