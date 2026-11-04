/* ==========================================================================
   GHOSTLINE — konfigurace hry (sdílí ji hra index.html i žebříček leaderboard.html)
   ========================================================================== */
window.GHOSTLINE_CONFIG = {

  /* Identifikátor běhu hry. Pro každou akci / každé kolo zvolte nový,
     výsledky se pak v databázi nemíchají (games/<gameId>/teams/...). */
  gameId: "ghostline-demo",

  /* Konfigurace Firebase (Firebase Console → Project settings → Your apps → Web app).
     Dokud je apiKey prázdný, hra běží v LOKÁLNÍM režimu: časy se ukládají jen do prohlížeče. */
  firebase: {
    apiKey: "AIzaSyDAHt-rP1IBV-3NP4uNYWQaXclNrrLWB98",
    authDomain: "ghostline-ees.firebaseapp.com",
    projectId: "ghostline-ees",
    storageBucket: "ghostline-ees.firebasestorage.app",
    messagingSenderId: "503149270215",
    appId: "1:503149270215:web:7604bed7bccf1cb91cdae2"
  },

  /* Sůl pro otisky kódů. Když ji změníte, musíte přegenerovat všechny otisky níže. */
  salt: "auriga",

  /* Kódy z fyzických šifer jsou uložené jen jako otisky, aby je hráči nevyčetli ze zdrojáku.
     Nový otisk vygenerujete v leaderboard.html → Nástroje organizátora.
     Ke každému milníku můžete zadat více platných otisků (např. varianty odpovědi).
     Zadání se normalizuje: velká/malá písmena, diakritika, mezery a interpunkce nehrají roli. */
  codes: {
    m1: ["0c154674cd4d9950"],   // SOS (z blikání světel vozu)
    m2: ["d4e1e720607db53f"],   // zástupný 1111 — připravuje se Caesarova šifra
    m3: [],                     // dohledové centrum: rychlokvíz (bez kódu, otázky jsou v index.html → STORY → soc → quiz)
    m4: ["d4e1e720607db53f"],
    m5: ["89eb0ee2244220e0"]    // PIN 6547 z logických operací (zadání je přímo v terminálu nouzového vypínače)
  },

  /* Kontrola po znacích (políčka na jednotlivé znaky): otisk každého znaku na jeho pozici.
     Hráč po odeslání vidí, které znaky má správně (zeleně) a které ne (červeně). */
  charCheck: {
    m1: ["ca12aa8c7db1cfd0", "531666d134a45d85", "2a8da6e5ea56af3c"],   // S · O · S
    m5: ["9197764072d69fd7", "5bf7133f45fb3d32", "52d6b1f7d0786bcc", "bb3fea1e9725af90"]   // 6 · 5 · 4 · 7
  },

  /* Názvy milníků (zobrazují se ve hře i na žebříčku). */
  milestones: [
    "Diagnostika odemčena",
    "Infotainment izolován",
    "C2 zablokováno",
    "Certifikát revokován",
    "Flotila zachráněna"
  ],

  /* Text pod terminálem — odkaz na fyzickou šifru, kterou má tým v realitě luštit. */
  physicalHints: {
    m1: "Tento kód nenajdete v žádné šifře. Odpověď se skrývá přímo tady v hale — dívejte se pozorně.",
    m2: "Kód získáte rozluštěním šifry č. 2.",
    m3: "Odpovězte správně na všech 10 otázek dřív, než vyprší čas.",
    m4: "Kód získáte rozluštěním šifry č. 4.",
    m5: "Šifru máte přímo před sebou — vyřešte operace A–D a zadejte čtyřmístný PIN."
  },

  /* Ochrana proti hádání (platí pro každý terminál zvlášť):
     od wrongLimit-tého chybného pokusu se terminál zamkne; první zámek trvá wrongCooldownSec
     a každý další chybný pokus ho zdvojnásobí: 20 s → 40 s → 80 s → 160 s → …
     Počítadlo se po obnovení stránky nenuluje a vynuluje se až po odemčení terminálu. */
  wrongLimit: 2,
  wrongCooldownSec: 20,

  /* Rychlokvíz (dohledové centrum): po vypršení času nebo chybné odpovědi se terminál zamkne na tuto dobu. */
  quizLockSec: 20,

  /* VZDÁLENÝ START (funguje jen s Firebase).
     true  = týmy po registraci a úvodním příběhu čekají v lobby, hru spouští organizátor v administraci;
             časy všech týmů se měří od společného startu.
     false = každý tým začíná hned po registraci a čas měří od své registrace. */
  remoteStart: true,
  countdownSec: 10,          // odpočet, který týmy uvidí po stisku START

  /* E-maily organizátorů, kteří smí hru spustit/ukončit (přihlašují se v administraci).
     Skutečnou ochranu zajišťují pravidla Firestore — e-maily musí být uvedené i tam (viz README). */
  adminEmails: ['lukasbilek98@gmail.com']
};
