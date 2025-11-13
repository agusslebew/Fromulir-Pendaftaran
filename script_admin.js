import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
const SUPABASE_URL = "https://gjkriltrssjglxqvhauj.supabase.co";  
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdqa3JpbHRyc3NqZ2x4cXZoYXVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyODE2NjcsImV4cCI6MjA3NTg1NzY2N30.8ixU45P5K-u3bjOPUycf6F3Har17hUzJM46jhgMGYeU";        
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const ADMIN_PASSWORD = "1"; 

const dataBody = document.getElementById('dataBody');
const loading = document.getElementById('loading');
const errorMessage = document.getElementById('errorMessage');
const loginForm = document.getElementById('loginForm');
const adminContent = document.getElementById('adminContent');
const loginCard = document.getElementById('loginCard');
const passwordError = document.getElementById('passwordError');



async function loadRegistrations() {
    dataBody.innerHTML = ''; 
    loading.style.display = 'block';
    errorMessage.style.display = 'none';

    try {
        let { data: registrations, error } = await supabase
            .from('registrations')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        loading.style.display = 'none';

        if (registrations && registrations.length > 0) {
            registrations.forEach((row, index) => {
                const tr = document.createElement('tr');
                
                const date = new Date(row.created_at).toLocaleString('id-ID', {
                    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                });

                tr.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${date}</td>
                    <td>${row.nama || '-'}</td>
                    <td>${row.noKtp || '-'}</td>                           <td>${row.hp || '-'}</td>
                    <td>${row.email || '-'}</td>
                    <td>${row.nomorMeteranPln || '-'}</td>                <td>${row.jenisPaket || '-'}</td>
                    <td>${row.kecepatan || '-'}</td>
                    <td>${row.alamat ? row.alamat.substring(0, 50) + '...' : '-'}</td>
                    <td>${row.hpKeluarga || '-'} (${row.statusKeluarga || ''})</td>
                `;
                dataBody.appendChild(tr);
            });
        } else {
            dataBody.innerHTML = '<tr><td colspan="11" class="text-center text-muted">Belum ada data pendaftaran yang masuk.</td></tr>';
        }

    } catch (err) {
        console.error("Error loading data:", err);
        loading.style.display = 'none';
        errorMessage.style.display = 'block';
        errorMessage.textContent = `Gagal memuat data. Pastikan izin SELECT di Supabase benar (Policy RLS).`;
    }
}



function handleLogin(e) {
    e.preventDefault();
    const input = document.getElementById('adminPass');
    const password = input.value;

    if (password === ADMIN_PASSWORD) {
        input.classList.remove('is-invalid');
        loginCard.style.display = 'none';
        adminContent.style.display = 'block';
        passwordError.style.display = 'none';
        
        loadRegistrations(); 
    } else {
        input.classList.add('is-invalid');
        passwordError.style.display = 'block';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    window.loadRegistrations = loadRegistrations; 
});