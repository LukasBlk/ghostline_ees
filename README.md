# GHOSTLINE — point & click příběh k šifrovací hře

Webová adventura s motivem kybernetické bezpečnosti ve Škoda Auto. Týmy v realitě luští fyzické šifry, výsledné kódy zadávají do terminálů ve hře a tím odemykají další kapitoly příběhu. Čas každého milníku se ukládá do Firebase (Firestore) a organizátor ho vidí živě na žebříčku.

## Soubory

| Soubor | K čemu je |
|---|---|
| `index.html` | Samotná hra pro týmy (5 kapitol, animace, terminály na kódy). |
| `leaderboard.html` | Administrace: spuštění/ukončení hry, živý žebříček, nástroje (generátor otisků kódů, export CSV). Na Vercelu i jako `/admin`. |
| `config.js` | Jediné místo, které musíte upravit: Firebase, ID hry, kódy, texty k šifrám, e-maily organizátorů. |
| `vercel.json` | Nastavení pro Vercel (hezká adresa `/admin`). |

## Výchozí kódy (jen pro organizátora — tento soubor hráčům nedávejte)

| Milník | Kapitola | Kód |
|---|---|---|
| m1 | Servisní hala — diagnostická stanice | `1111` |
| m2 | Kokpit — servisní menu infotainmentu | `1111` |
| m3 | Dohledové centrum — blokace C2 | `1111` |
| m4 | Laboratoř podpisů — revokace certifikátu | `1111` |
| m5 | Velín — nouzový vypínač | `1111` |

Zatím je všude testovací kód `1111`. Zadání je tolerantní: nezáleží na velikosti písmen, diakritice, mezerách ani interpunkci.

### Vlastní kódy
1. Otevřete `leaderboard.html` → **Nástroje organizátora** → **Generátor otisku kódu**.
2. Napište řešení své fyzické šifry a otisk vložte do `config.js` → `codes.m1` … `codes.m5`.
3. Jeden milník může mít více platných otisků (např. `["abc…", "def…"]`).

Kódy jsou ve hře uložené jen jako otisky, takže je hráči nevyčtou ze zdrojového kódu. (Není to kryptograficky neprolomitelné, ale na hru to bohatě stačí.)

## Nastavení Firebase (cca 10 minut)

1. **Projekt:** [console.firebase.google.com](https://console.firebase.google.com) → *Add project* (Analytics není potřeba).
2. **Databáze:** *Build → Firestore Database → Create database* → zvolte region `eur3` nebo `europe-west3` → *Start in production mode*.
3. **Přihlášení:** *Build → Authentication → Get started → Sign-in method* → zapněte **Anonymous** (týmy) a **Email/Password** (organizátor). Pak v záložce *Users → Add user* založte účet organizátora (e-mail + heslo). Jeho e-mail napište do `config.js` → `adminEmails` a do pravidel níže.
4. **Webová aplikace:** *Project settings (ozubené kolo) → Your apps → `</>` Web* → zaregistrujte → zkopírujte objekt `firebaseConfig` do `config.js` → `firebase: { … }`.
5. **Pravidla:** *Firestore → Rules* → vložte obsah souboru `firestore.rules` z repozitáře a *Publish*. (Níže pro přehled zjednodušená verze.)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /games/{gameId}/teams/{teamId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null
        && request.resource.data.uid == request.auth.uid
        && request.resource.data.startedAt == request.time
        && request.resource.data.name is string
        && request.resource.data.name.size() <= 40;
      allow update: if request.auth != null
        && resource.data.uid == request.auth.uid
        && request.resource.data.diff(resource.data).affectedKeys()
             .hasOnly(['milestones', 'current', 'lastAt', 'finishedAt', 'wrong', 'ping']);
      allow delete: if false;
    }
    // řízení hry (vzdálený start) — zapisovat smí jen organizátor
    match /games/{gameId}/control/{docId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null
        && request.auth.token.email in ['organizator@firma.cz'];   // ← váš e-mail (lze víc, oddělte čárkou)
    }
  }
}
```

6. **Hosting** (hra musí běžet z webové adresy, aby se k ní týmy dostaly):
   - **Vercel (GitHub):** nahrajte celou složku do repozitáře a v Vercelu ho importujte (Framework preset: *Other*, bez build příkazu). Vercel zveřejní všechny soubory: hra je na `https://<projekt>.vercel.app/`, administrace na `https://<projekt>.vercel.app/admin` (nebo `/leaderboard.html`). Doménu Vercelu přidejte ve Firebase do *Authentication → Settings → Authorized domains*.
   - **Firebase Hosting:** `npm i -g firebase-tools` → `firebase login` → ve složce se hrou `firebase init hosting` (public directory: `.`, single-page app: No) → `firebase deploy`. Dostanete adresu `https://<projekt>.web.app`.
   - **Nebo** jakýkoli statický hosting (Netlify Drop, GitHub Pages, školní/firemní web) — stačí nahrát tři soubory.

Indikátor vpravo nahoře ve hře ukazuje stav: `LOKÁLNĚ` (Firebase nenastaven), `SYNC OK`, `PŘIPOJUJI`, `CHYBA SYNC`.

## Jak to běží na akci

- Organizátor otevře administraci (`/admin`) a přihlásí se e-mailem a heslem.
- Každý tým otevře hru, zadá **název týmu** a projde úvodní hlášení Dagmar Párové. Pak čeká v **čekací místnosti** (vidí ostatní přihlášené týmy). Čas zatím neběží.
- Organizátor klikne **▶ SPUSTIT HRU**. Všechny týmy uvidí stejný odpočet (výchozí 10 s, `countdownSec`) a naráz se jim odemkne kapitola 1. Časy se měří od tohoto společného startu.
- Během odpočtu jde start ještě **zrušit**. Tým, který se připojí po startu, jde rovnou do hry, ale jeho čas běží od společného startu.
- **■ UKONČIT HRU** zastaví měření: týmům, které nedokončily, se zamknou terminály a zobrazí „Hra ukončena“.
- Bez vzdáleného startu (`remoteStart: false` nebo bez Firebase) začíná každý tým hned po registraci a čas se měří od ní.
- Kapitola = scéna, ve které tým klikáním zkoumá předměty a poslouchá příběh. Terminál se odemkne až po prozkoumání klíčových míst; pak čeká na kód z fyzické šifry.
- Zadání správného kódu = **milník**: zapíše se čas od startu týmu do Firestore a začne další kapitola.
- Organizátor má otevřený `leaderboard.html` (ideálně na projektoru): pořadí, mezičasy, běžící čas, počet chybných pokusů.
- Po 3 chybných pokusech za sebou se terminál na 20 s zamkne (nastavitelné v `config.js`).

### Užitečné
- **Nový běh hry:** změňte `gameId` v `config.js` (např. `skoleni-2026-11-05`). Výsledky se nemíchají; starší běh zobrazíte přes `leaderboard.html?game=STARE_ID`.
- **Obnovení stránky:** postup se drží v prohlížeči, tým pokračuje tam, kde skončil (na stejném zařízení).
- **Reset zařízení mezi koly:** otevřete `index.html?reset`.
- **Test bez Firebase:** nechte `apiKey` prázdný. Hra i žebříček (ve stejném prohlížeči) fungují lokálně.
- **Klávesy:** `H` zvýrazní klikatelná místa, `Mezerník/Enter` posouvá dialog, `Esc` zavře terminál.
- Hra je stavěná na šířku (notebook, tablet, telefon otočený na šířku).

## Struktura dat ve Firestore

```
games/{gameId}/control/state
  status:       "lobby" | "running" | "ended"
  startAt:      serverový čas stisku START (hra začíná startAt + countdownSec)
  countdownSec: 10
  endedAt:      serverový čas ukončení

games/{gameId}/teams/{teamId}
  name:        "Modrý tým"
  uid:         anonymní uid zařízení
  startedAt:   serverový čas registrace
  clientStart: čas registrace dle zařízení (ms)
  milestones:  { m1: { at: serverový čas, sec: 754 }, m2: {...}, ... }
  wrong:       { m1: 2, m3: 1 }      // chybné pokusy po milnících
  current:     číslo aktuální kapitoly
  finishedAt:  serverový čas dokončení
```

`sec` = sekundy od společného startu (bez vzdáleného startu od registrace týmu); žebříček řadí podle nich; `at` je serverové razítko pro kontrolu.

## Úpravy příběhu

Texty dialogů, názvy předmětů a podmínky odemčení terminálu jsou v `index.html` v poli `STORY` (hledejte `const STORY`). Každá kapitola má:
`intro` (úvodní dialog), `hs` (klikací místa a jejich texty), `req` (místa, která je nutné prozkoumat před terminálem), `term` (texty terminálu) a `done` (dialog po správném kódu).
Repliky jsou ve tvaru `['m', 'text']`, kde `n` = popis, `m` = Dagmar Párová (CPSO), `g` = útočník GHOSTLINE, `s` = systém.
