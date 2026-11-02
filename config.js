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
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
  },

  /* Sůl pro otisky kódů. Když ji změníte, musíte přegenerovat všechny otisky níže. */
  salt: "auriga",

  /* Kódy z fyzických šifer jsou uložené jen jako otisky, aby je hráči nevyčetli ze zdrojáku.
     Nový otisk vygenerujete v leaderboard.html → Nástroje organizátora.
     Ke každému milníku můžete zadat více platných otisků (např. varianty odpovědi).
     Zadání se normalizuje: velká/malá písmena, diakritika, mezery a interpunkce nehrají roli. */
  codes: {
    m1: ["d4e1e720607db53f"],   // výchozí kód 1111
    m2: ["d4e1e720607db53f"],
    m3: ["d4e1e720607db53f"],
    m4: ["d4e1e720607db53f"],
    m5: ["d4e1e720607db53f"]
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
    m1: "Kód získáte rozluštěním šifry č. 1.",
    m2: "Kód získáte rozluštěním šifry č. 2.",
    m3: "Kód získáte rozluštěním šifry č. 3.",
    m4: "Kód získáte rozluštěním šifry č. 4.",
    m5: "Kód získáte rozluštěním šifry č. 5."
  },

  /* Ochrana proti hádání: po N chybných pokusech za sebou se terminál na X sekund zamkne. */
  wrongLimit: 3,
  wrongCooldownSec: 20,

  /* VZDÁLENÝ START (funguje jen s Firebase).
     true  = týmy po registraci a úvodním příběhu čekají v lobby, hru spouští organizátor v administraci;
             časy všech týmů se měří od společného startu.
     false = každý tým začíná hned po registraci a čas měří od své registrace. */
  remoteStart: true,
  countdownSec: 10,          // odpočet, který týmy uvidí po stisku START

  /* E-maily organizátorů, kteří smí hru spustit/ukončit (přihlašují se v administraci).
     Skutečnou ochranu zajišťují pravidla Firestore — e-maily musí být uvedené i tam (viz README). */
  adminEmails: []
};
