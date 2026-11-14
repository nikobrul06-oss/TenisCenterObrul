# ŠRD Straža – Tenis center Obrul

Spletna stran za rezervacijo teniških igrišč.

- index.html, app.js – javna stran z rezervacijami
- admin.html – pregled in brisanje rezervacij (samo za skrbnika)
- config.js – podatki za povezavo s Supabase
- supabase.sql – baza (zaženi enkrat v Supabase SQL Editor)

## Namestitev Supabase

1. Na https://supabase.com naredi projekt (regija: Frankfurt).
2. **SQL Editor** → prilepi vsebino supabase.sql → **Run**.
3. **Authentication → Sign In / Providers → Email**: izklopi **Allow new users to sign up**.
4. **Authentication → Users → Add user**: dodaj svojo e-pošto in geslo (s tem se prijaviš v admin.html).
5. **Project Settings → API**: kopiraj *Project URL* in *anon public key* v config.js.

## Lastna domena (GitHub Pages)

1. Repozitorij → **Settings → Pages** → *Custom domain*: vpiši domeno.
2. Pri ponudniku domene v DNS dodaj:
   - A za @: 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153
   - CNAME za www → nikobrul06-oss.github.io
3. Ko DNS deluje, obkljukaj **Enforce HTTPS**.
