# GetABonus.net - Casino Affiliate Platform

Kompletna casino affiliate platforma sa admin panelom, bez API poziva - sve radi sa direktnim ID vezama.

## Struktura Fajlova

```
backup/
├── index.html              # Glavna stranica sa svim funkcionalnostima
├── database-service.js     # Simulacija baze podataka u memoriji
├── auth-service.js         # Autentifikacija bez API poziva
├── admin-interface.js      # Admin panel funkcionalnosti
├── database-structure.sql  # SQL struktura baze podataka
└── README.md              # Ovaj fajl
```

## Pokretanje

1. **Jednostavan način** - Otvorite `index.html` direktno u browser-u
2. **Sa lokalnim serverom** - Pokrenite bilo koji HTTP server u backup direktorijumu

### Przykład sa Python serverom:
```bash
cd backup
python3 -m http.server 8000
# Idite na http://localhost:8000
```

### Przykład sa Node.js serverom:
```bash
cd backup
npx http-server -p 8000
# Idite na http://localhost:8000
```

## Funkcionalnosti

### Glavna Stranica
- **Hero sekcija** sa pozivom na akciju
- **Preporučeni kazina** - prikazuje featured kazina sa rating-om
- **Ekskluzivni bonusi** - lista featured bonusa sa detaljima
- **Popularne igre** - katalog igara sa RTP i volatilnost
- **Blog sekcija** - mesta za članke i vodiče

### Admin Panel
- **Dashboard** sa statistikama
- **Upravljanje kazinima** - kreiranje, editovanje, brisanje
- **Upravljanje bonusima** - kompletan CRUD
- **Upravljanje igrama** - kompletan CRUD
- **Blog management** - kreiranje i editovanje postova
- **Admin korisnici** - samo owner može upravljati (alkox)

## Admin Pristup

**Korisničko ime:** `alkox`  
**Password:** `bilo_koji_password` (demo verzija)

Kliknite "Admin" u navigaciji da pristupite admin panelu.

## Podaci

Svi podaci se čuvaju u memoriji browser-a tokom sesije. Za perzistentne podatke:

1. **Za MySQL/PostgreSQL bazu:**
   - Koristite `database-structure.sql` fajl
   - Modifikujte `database-service.js` da koristi pravi DB connection

2. **Za lokalno čuvanje:**
   - Dodajte localStorage persistence u `database-service.js`
   - Implementirajte save/load funkcije

## Konfiguracija

### Database Service (`database-service.js`)

Glavne konfiguracije:
```javascript
// Dodaj novi kazino
const casino = db.createCasino({
  name: "Novo Kazino",
  description: "Opis kazina",
  websiteUrl: "https://novo-kazino.com",
  safetyIndex: 8.5,
  establishedYear: 2024,
  license: "Malta Gaming Authority",
  isFeatured: true
});
```

### Auth Service (`auth-service.js`)

Kreiraj novog admin korisnika:
```javascript
// Samo owner (alkox) može kreirati nove admine
const result = auth.createAdmin({
  username: "novi_admin",
  password: "sigurna_lozinka"
});
```

### Dodavanje Sadržaja

Svi sadržaji se dodaju preko admin panela ili direktno u `database-service.js`:

**Kazina:**
- Osnovno info (naziv, URL, opis)
- Safety index (0-10)
- Payment metode, valute, provajderi
- Featured status

**Bonusi:**
- Vezano za kazino (casinoId)
- Tip bonusa (welcome, no-deposit, free-spins)
- Wagering requirements
- Validnost i kodovi

**Igre:**
- Provajder i tip igre
- RTP i volatilnost
- Demo linkovi
- Tagovi

## Prilagođavanje

### Dizajn
Modifikujte CSS u `<style>` sekciji `index.html` fajla:
- Boje: `#16a085` (tirkiz), `#f39c12` (narandžasta)
- Neon efekti sa `box-shadow` i `text-shadow`
- Responsive grid layout

### Funkcionalnosti
Dodajte nove funkcije u:
- `WebsiteApp` klasu za frontend
- `AdminInterface` klasu za admin panel
- `DatabaseService` klasu za podatke

## Production Setup

Za produkciju preporučujemo:

1. **Baza podataka**: Koristite PostgreSQL ili MySQL sa `database-structure.sql`
2. **Autentifikacija**: Implementirajte pravi JWT token sistem
3. **File uploads**: Dodajte file storage za slike
4. **SEO**: Implementirajte server-side rendering
5. **Analytics**: Dodajte Google Analytics ili sličan servis

## Podrška

Stranica je kreirana sa:
- Vanilla JavaScript (bez dependencies)
- CSS Grid i Flexbox za layout
- Local Storage za persistenciju
- Responsive design za mobilne uređaje

Sve funkcionalnosti rade offline nakon prvog učitavanja.