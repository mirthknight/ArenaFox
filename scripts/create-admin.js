import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read .env file manually since we don't have dotenv installed
const envPath = path.resolve(__dirname, '../.env');
let envContent = '';

try {
    envContent = fs.readFileSync(envPath, 'utf-8');
    // Strip BOM if present
    if (envContent.charCodeAt(0) === 0xFEFF) {
        envContent = envContent.slice(1);
    }
} catch (e) {
    console.error('Could not find .env file at:', envPath);
    process.exit(1);
}

const envVars = {};
envContent.replace(/\r\n/g, '\n').split('\n').forEach(line => {
    const match = line.trim().match(/^([^=]+)=(.*)$/);
    if (match) {
        let value = match[2].trim();
        // Remove quotes if present
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
        }
        envVars[match[1].trim()] = value;
    }
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env');
    console.error('Parsed keys:', Object.keys(envVars));
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const ADMIN_EMAIL = envVars.SUPER_ADMIN_EMAIL || process.env.SUPER_ADMIN_EMAIL;
const ADMIN_PASSWORD = envVars.SUPER_ADMIN_PASSWORD || process.env.SUPER_ADMIN_PASSWORD;

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error('Missing SUPER_ADMIN_EMAIL or SUPER_ADMIN_PASSWORD in your environment.');
    process.exit(1);
}

async function createAdmin() {
    console.log(`Attempting to create admin user: ${ADMIN_EMAIL}...`);

    const { data, error } = await supabase.auth.signUp({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        options: {
            data: {
                display_name: 'MirthKnight',
                role: 'super_admin',
                status_label: 'vip'
            }
        }
    });

    if (error) {
        console.error('Error creating user:', error.message);
        return;
    }

    if (data.user) {
        console.log('User created successfully!');
        console.log('User ID:', data.user.id);
        console.log('NOTE: If email confirmation is enabled in Supabase, you need to verify the email link sent to ' + ADMIN_EMAIL);
        console.log('      Or manually confirm the user in the Supabase Dashboard > Authentication > Users.');
    } else {
        console.log('User creation request sent but no user object returned. See dashboard for details.');
    }
}

createAdmin();
