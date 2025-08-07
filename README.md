<!-- docker-compose up -d -->

# Cat Lover App

ระบบเว็บสำหรับคนรักแมว ที่มีหน้าจอสำหรับเข้าสู่ระบบ, แสดงรูปแมวแบบสุ่ม พร้อมระบบคอมเมนต์ใต้รูป

## การติดตั้ง

git clone https://github.com/username/cat-lover-app.git
cd cat-lover-app
npm install
add file .env.local -> JWT_SECRET=cat_super_secret_key_888
docker-compose up -d - >รัน mongodb docker ในเครื่อง 
api register http://localhost:3000/api/auth/register 
#example username user1 password user1
- login 
---

## คุณสมบัติหลัก

- หน้าเข้าสู่ระบบ (Login) ด้วย JWT
- แสดงรูปแมวแบบสุ่มจาก [cataas.com](https://cataas.com/cat)
- ปุ่มเปลี่ยนรูปแมวแบบสุ่ม
- ระบบคอมเมนต์ใต้รูป พร้อมแสดงชื่อผู้ใช้

---

## เทคโนโลยีที่ใช้

- Next.js (App Router)
- MongoDB + Mongoose
- JWT Authentication
- bcrypt สำหรับเข้ารหัสรหัสผ่าน
- Sharp สำหรับแปลงภาพเป็น WebP
- Fetch API สำหรับดึงรูปจาก cataas.com
- Tailwind CSS สำหรับสไตล์

---


