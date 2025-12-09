# Game Lịch Sử Việt Nam 1936-1939

Một web game trắc nghiệm lịch sử đơn giản, sử dụng Next.js (hoặc React), Tailwind CSS và Supabase Realtime để xếp hạng người chơi.

## 1. Cài đặt Supabase

1. Tạo project mới tại [Supabase](https://supabase.com).
2. Vào **SQL Editor**, chạy lệnh sau để tạo bảng:

```sql
create table players (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  score integer not null,
  time_seconds integer not null
);

-- Enable Realtime
alter publication supabase_realtime add table players;
```

3. Vào **Settings > API**, copy `URL` và `anon public` key.

## 2. Cài đặt biến môi trường

Tạo file `.env.local` (nếu dùng Next.js) hoặc cấu hình trực tiếp trong `supabaseClient.ts`:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## 3. Chạy dự án

Cài đặt dependencies và chạy:

```bash
npm install
npm run dev
```

## 4. Deploy Vercel

1. Push code lên GitHub.
2. Vào Vercel > New Project > Import repo.
3. Trong phần **Environment Variables** trên Vercel, thêm 2 biến `NEXT_PUBLIC_SUPABASE_URL` và `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Deploy!
