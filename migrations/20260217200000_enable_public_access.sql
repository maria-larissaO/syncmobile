/*
  # Enable Public Access
  
  This migration enables public (anonymous) access to all tables for development purposes.
  Since the application currently does not implement authentication/login, we need to allow
  anonymous users to read and write data.
*/

-- Patients
CREATE POLICY "Public access for patients" ON patients
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Team Members
CREATE POLICY "Public access for team_members" ON team_members
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Appointments
CREATE POLICY "Public access for appointments" ON appointments
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable update for appointments" ON appointments
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Treatments
CREATE POLICY "Public access for treatments" ON treatments
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- AI Analyses
CREATE POLICY "Public access for ai_analyses" ON ai_analyses
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Financial Records
CREATE POLICY "Public access for financial_records" ON financial_records
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Profiles
CREATE POLICY "Public access for profiles" ON profiles
  FOR ALL
  USING (true)
  WITH CHECK (true);
