import { createClient } from '@supabase/supabase-js';

import 'dotenv/config';

export const SUPABASE_CONFIG_ERROR_MESSAGE =
    'Supabase não configurado. Defina SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env.';

const supabaseUrl = process.env.SUPABASE_URL?.trim();
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

const criarStubSupabase = () => ({
    storage: {
        from: () => ({
            upload: async () => {
                throw new Error(SUPABASE_CONFIG_ERROR_MESSAGE);
            },
            remove: async () => {
                throw new Error(SUPABASE_CONFIG_ERROR_MESSAGE);
            },
            getPublicUrl: () => ({ data: { publicUrl: '' } }),
        }),
    },
});

// Fallback para evitar que a API quebre quando as credenciais do Storage nao estiverem no .env.
const supabase =
    supabaseUrl && supabaseServiceRoleKey
        ? createClient(supabaseUrl, supabaseServiceRoleKey)
        : criarStubSupabase();

export default supabase;
