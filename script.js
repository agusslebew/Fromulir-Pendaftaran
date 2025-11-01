// ini buat nyambungin ke database
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://gjkriltrssjglxqvhauj.supabase.co"; 
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdqa3JpbHRyc3NqZ2x4cXZoYXVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyODE2NjcsImV4cCI6MjA3NTg1NzY2N30.8ixU45P5K-u3bjOPUycf6F3Har17hUzJM46jhgMGYeU";        
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


// di bawah ini untuk harga harga paketnya
const prices = {
    'Paket Reguler': {  
        '10Mbps': null, '20Mbps': null, '35Mbps': 265290, '50Mbps': 331890, '100Mbps': 442890  
    },
    'Iconnet Hebat 3 Bulan': {  
        '10Mbps': null, '20Mbps': null, '35Mbps': 962370, '50Mbps': 1162170, '100Mbps': 1495170  
    },
    'Iconnet Hebat 6 Bulan': {  
        '10Mbps': null, '20Mbps': null, '35Mbps': 1437450, '50Mbps': 1770450, '100Mbps': 2325450  
    },
    'Iconnet Hebat 12 Bulan': {  
        '10Mbps': null, '20Mbps': null, '35Mbps': 2387610, '50Mbps': 2987010, '100Mbps': 3986010  
    },
    'Iconnet Hebat 24 Bulan': {  
        '10Mbps': null, '20Mbps': null, '35Mbps': 5305800, '50Mbps': 6637800, '100Mbps': 8857800  
    },
    // Paket Iconnet Seru (1 bulan, Instalasi 250k)
    'Iconnet Seru 10Mbps': { '10Mbps': 187590 },
    'Iconnet Seru 20Mbps': { '20Mbps': 198690 },
    'Iconnet Seru 35Mbps': { '35Mbps': 220890 },
    'Iconnet Seru 50Mbps': { '50Mbps': 276390 },
    'Iconnet Seru 100Mbps': { '100Mbps': 365190 },
    // Paket Iconnet Seru-3 (3 bulan, Free Instalasi)
    'Iconnet Seru-3 10Mbps': { '10Mbps': 553890 },
    'Iconnet Seru-3 20Mbps': { '20Mbps': 587190 },
    'Iconnet Seru-3 35Mbps': { '35Mbps': 642690 },
    'Iconnet Seru-3 50Mbps': { '50Mbps': 809190 },
    'Iconnet Seru-3 100Mbps': { '100Mbps': 1086690 }
};

// agar harganya bisa berfungsi
function getPrice(jenisPaket, kecepatan) {
    if (!jenisPaket) return null;
    
    if (jenisPaket.includes('Iconnet Seru')) {
        const priceData = prices[jenisPaket];
        if (!priceData) return null;
        
        const speedKey = Object.keys(priceData)[0];
        const total = priceData[speedKey];
        if (!total) return null;
        
        let durasi = jenisPaket.includes('Seru-3') ? 3 : 1;
        
        return {  
            total,  
            perBulan: Math.round(total / durasi),  
            durasi,
            installation: jenisPaket.includes('Seru-3') ? 0 : 250000  
        };
    }
    
    if (!kecepatan) return null; 

    if (!prices[jenisPaket]?.[kecepatan]) return null;
    const total = prices[jenisPaket][kecepatan];
    const match = jenisPaket.match(/(\d+) Bulan/);
    const durasi = match ? parseInt(match[1]) : 1;
    return {  
        total,  
        perBulan: Math.round(total / durasi),  
        durasi,
        installation: 0
    };
}

function calculatePrice() {
    const kecepatan = document.getElementById('kecepatan')?.value;
    const jenisPaketSelect = document.getElementById('jenisPaket');
    const jenisPaket = jenisPaketSelect?.value;
    
    const hargaDisplay = document.getElementById('hargaDisplay'); 
    const totalBiayaDisplay = document.getElementById('totalBiayaDisplay'); 
    const totalBiayaElement = document.getElementById('totalBiaya');

    if (!hargaDisplay || !totalBiayaDisplay || !totalBiayaElement) return;

    // Reset display
    hargaDisplay.innerHTML = '<small class="text-muted">Pilih paket untuk lihat harga.</small>';
    totalBiayaDisplay.style.display = 'none';

    if (!jenisPaket) {
        return;
    }

    let priceInfo;
    if (jenisPaket.includes('Iconnet Seru')) {
        priceInfo = getPrice(jenisPaket, '');
    } else {
        if (!kecepatan) {
            hargaDisplay.innerHTML = '<small class="text-muted">Pilih kecepatan untuk lihat harga.</small>';
            return;
        }
        priceInfo = getPrice(jenisPaket, kecepatan);
    }

    if (!priceInfo) {
        hargaDisplay.innerHTML = '<small class="text-warning">Harga tidak tersedia.</small>';
        return;
    }

    // ini buat format rupiahnya
    const formatter = new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 });
    const formattedTotal = formatter.format(priceInfo.total);
    const formattedPerBulan = formatter.format(priceInfo.perBulan);
    
    const totalBiayaPembayaranPertama = priceInfo.total + priceInfo.installation;
    const formattedTotalPembayaranPertama = formatter.format(totalBiayaPembayaranPertama);
    const formattedInstallation = formatter.format(priceInfo.installation);

    // ini kosong karena semua output akan ke totalBiayaDisplay
    hargaDisplay.innerHTML = ''; 


    if (jenisPaket.includes('Iconnet Seru')) {
        // Tampilan untuk paket Seru: Merinci Harga Paket + Instalasi (Bayar atau Gratis)
        
        let instalasiDetail = priceInfo.installation > 0  
            ? `Biaya Instalasi: Rp ${formattedInstallation}`  
            : 'Gratis Instalasi';
            
        let durasiInfo = priceInfo.durasi > 1  
            ? `(${priceInfo.durasi} bulan)`  
            : `(bulanan)`;
        
        totalBiayaElement.innerHTML = `
            <strong>Rp ${formattedTotalPembayaranPertama}</strong><br>
            <small class="text-muted">
                (Harga Paket: Rp ${formattedTotal} ${durasiInfo} +  
                ${instalasiDetail})
            </small>
        `;
    } else {
        // Tampilan untuk paket Reguler/Hebat: HANYA Total Bayar dan Per Bulan  
        
        let durasiLabel = priceInfo.durasi > 1  
            ? `Total (${priceInfo.durasi} bln)`  
            : `Total (1 bln)`;
        
        let perBulanLabel = priceInfo.durasi > 1  
            ? `<span class="text-muted"></span>`
            : '';
            
        totalBiayaElement.innerHTML = `
            <strong>${durasiLabel}: Rp ${formattedTotal}</strong>
            ${perBulanLabel}
        `;
    }
    
    totalBiayaDisplay.style.display = 'block'; // ini untuk menampilkan totalBiayaDisplay
}

function showToast(type, msg) {
    if (typeof bootstrap === 'undefined' || typeof bootstrap.Toast === 'undefined') {
        console.error("Bootstrap JavaScript tidak terdeteksi. Toast tidak dapat ditampilkan.");
        return;
    }
    
    const id = type === 'success' ? 'successToast' : type === 'error' ? 'errorToast' : 'infoToast';
    const toastEl = document.getElementById(id);
    if (!toastEl) return;
    const body = toastEl.querySelector('.toast-body');
    if (body) body.textContent = msg;
    
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
}

function validateField(input) {
    const value = input.value.trim();
    const isRequired = input.hasAttribute('required');
    let valid = true, msg = '';
    const fb = input.nextElementSibling;

    if (isRequired && !value) { valid = false; msg = 'Wajib diisi.'; }
    else if (input.id === 'noKtp' && value && !/^\d{16}$/.test(value)) { valid = false; msg = 'KTP harus 16 digit.'; }
    else if (input.id === 'email' && value) {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(value)) { valid = false; msg = 'Email tidak valid.'; }
    }
    else if ((input.id === 'hp' || input.id === 'hpKeluarga') && value) {
        let clean = value.replace(/[\s\-\+]/g, '');
        if (clean.startsWith('62')) clean = '0' + clean.slice(2);
        if (!/^08[0-9]{8,12}$/.test(clean)) { valid = false; msg = 'HP tidak valid.'; }
    }
    else if (input.id === 'nomorMeteranPln' && value && !/^\d{12}$/.test(value)) { valid = false; msg = 'Nomor Meteran PLN harus 12 digit.'; }
    
    // Validasi Kecepatan (hanya jika elemennya terlihat)
    if (input.id === 'kecepatan' && document.getElementById('kecepatanContainer').style.display !== 'none' && isRequired && !value) {
        valid = false; msg = 'Harap pilih kecepatan internet';
    }


    if (!valid) input.classList.add('is-invalid');
    else input.classList.remove('is-invalid');
    if (fb && fb.classList.contains('invalid-feedback')) fb.textContent = msg;

    return valid;
}

// fungsi utama display dan validasi paket
function handlePackageSelection() {
    const jenisPaketSelect = document.getElementById('jenisPaket');
    const kecepatanSelect = document.getElementById('kecepatan');
    const kecepatanContainer = document.getElementById('kecepatanContainer');
    const selectedOption = jenisPaketSelect?.options[jenisPaketSelect.selectedIndex];
    
    const jenisPaket = jenisPaketSelect?.value;

    // menampilkan/menyembunyikan dropdown kecepatan
    if (jenisPaket?.includes('Iconnet Seru')) {
        kecepatanContainer.style.display = 'none';
        kecepatanSelect.removeAttribute('required');
        
        const speedMatch = jenisPaket.match(/(\d+)Mbps/);
        if (speedMatch) {
            kecepatanSelect.value = speedMatch[0];
        }
    } else {
        kecepatanContainer.style.display = 'block';
        kecepatanSelect.setAttribute('required', 'required');
        
        if (kecepatanSelect.value === '10Mbps' || kecepatanSelect.value === '20Mbps') {
            kecepatanSelect.value = '';
        }
    }
    
    calculatePrice();
}

// =========================================================
// DOM/Document Object Mode READY
// =========================================================
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('regForm');
    const submitBtn = document.getElementById('submitBtn');
    const inputs = form ? form.querySelectorAll('input, select, textarea') : [];

    // EVENT LISTENER UNTUK DROPDOWN <select>
    document.getElementById('kecepatan')?.addEventListener('change', calculatePrice);
    document.getElementById('jenisPaket')?.addEventListener('change', handlePackageSelection); // Listener aktif

    inputs.forEach(inp => {
        inp.addEventListener('blur', () => validateField(inp));
        inp.addEventListener('input', () => {
            if (inp.id === 'noKtp' || inp.id === 'hp' || inp.id === 'nomorMeteranPln' || inp.id === 'hpKeluarga') {
                inp.value = inp.value.replace(/\D/g, '');
            }
            validateField(inp);
        });
    });
    
    form?.addEventListener('submit', async e => {
        e.preventDefault();
        let valid = true;
        inputs.forEach(inp => { if (!validateField(inp)) valid = false; });
        if (!valid) return showToast('error', 'Perbaiki form sebelum submit.');

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menyimpan...';

        const formData = {};
        inputs.forEach(inp => { 
            if (inp.id) {
                if (inp.id === 'kecepatan' && document.getElementById('kecepatanContainer').style.display === 'none') {
                    const jenisPaket = document.getElementById('jenisPaket').value;
                    const speedMatch = jenisPaket.match(/(\d+)Mbps/);
                    if (speedMatch) {
                        formData[inp.id] = speedMatch[0];
                    }
                } else {
                    formData[inp.id] = inp.value.trim();
                }
            }
        });
        
        try {
            const { data, error } = await supabase.from('registrations').insert([formData]);
            if (error) throw error;

            
            // Mengalihkan ke halaman sukses baru setelah data tersimpan
            window.location.href = 'sukses-pendaftaran.html';

        } catch (err) {
            showToast('error', 'Gagal menyimpan: ' + err.message);
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-cloud-upload-alt"></i> Simpan Data & Notifikasi Admin';
        } 
    });

    handlePackageSelection();
});