import { test, expect, Page } from '@playwright/test';

test.describe('RSI Booking Flow E2E', () => {
    const BASE_URL = 'http://localhost:3000'; // Sesuaikan dengan port dev server Anda

    test('should complete a full appointment booking flow', async ({ page }: { page: Page }) => {
        // 1. Home Page
        await page.goto(BASE_URL);
        await expect(page).toHaveTitle(/RSI Siti Hajar/);

        // 2. Navigasi ke Poliklinik
        await page.click('text=Poliklinik');
        await expect(page).toHaveURL(/.*layanan/);

        // 3. Pilih Poliklinik (misal: Mata atau Kandungan)
        // Mencari card poli yang memiliki tombol "Detail" atau "Booking"
        const firstPoli = page.locator('.group').first();
        await firstPoli.click();

        // 4. Pilih Dokter
        const firstDoctor = page.locator('button:has-text("Daftar Sekarang")').first();
        await expect(firstDoctor).toBeVisible();
        await firstDoctor.click();

        // 5. Modal Booking - Pilih Poliklinik (Step 1)
        await expect(page.locator('text=Pilih Poliklinik')).toBeVisible();
        const poliTag = page.locator('button.uppercase.font-bold').first();
        await poliTag.click();
        await page.click('button:has-text("Selanjutnya")');

        // 6. Pilih Jadwal (Step 2)
        await expect(page.locator('text=Pilih Jadwal')).toBeVisible();
        const scheduleSlot = page.locator('.cursor-pointer').first();
        await scheduleSlot.click();
        await page.click('button:has-text("Selanjutnya")');

        // 7. Data Pasien (Step 3)
        await expect(page.locator('text=Data Pasien')).toBeVisible();

        // Test Case: Pasien Baru
        await page.click('text=Pasien Baru');
        await page.fill('input[placeholder*="Nama Lengkap"]', 'Test Patient Playwright');
        await page.fill('input[placeholder*="NIK"]', '1234567890123456');
        await page.fill('input[placeholder*="No. WhatsApp"]', '08123456789');

        // Pergi ke konfirmasi
        await page.click('button:has-text("Lihat Konfirmasi")');

        // 8. Final Step - Verifikasi Data
        await expect(page.locator('text=Konfirmasi Pendaftaran')).toBeVisible();
        await expect(page.locator('text=Test Patient Playwright')).toBeVisible();

        // Tombol Finish (tergantung implementasi terakhir)
        const finishBtn = page.locator('button:has-text("Proses Pendaftaran")');
        await expect(finishBtn).toBeVisible();
    });

    test('should handle invalid NIK gracefully', async ({ page }: { page: Page }) => {
        await page.goto(`${BASE_URL}/layanan`);
        // ... logic navigasi cepat ke modal ...
        // Input NIK < 16 digit dan pastikan ada pesan error
    });
});
