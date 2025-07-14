const fs = require('fs');

console.log("Analiza începe...");

let data;
try {
  data = JSON.parse(fs.readFileSync('note.json', 'utf8'));
} catch (err) {
  console.error("Eroare la citirea fișierului note.json:", err.message);
  process.exit(1);
}

// Variabile generale
let totalContestate = 0;
let totalCrescute = 0;
let totalScazute = 0;
let totalNeschimbate = 0;

let sumaCrestere = 0;
let sumaScadere = 0;
let sumaDiferente = 0;

let maxCrestere = { diferenta: 0, elev: null };
let maxScadere = { diferenta: 0, elev: null };

// Pentru elevii cu ri între 8 și 9
let intervalCount = 0;
let intervalCrescute = 0;
let intervalScazute = 0;
let intervalNeschimbate = 0;
let intervalSumaDelta = 0;
let intervalSumaCrestere = 0;
let intervalSumaScadere = 0;

for (const elev of data) {
  const { ri, ra } = elev;

  if (ra !== null) {
    totalContestate++;
    const diferenta = ra - ri;
    sumaDiferente += diferenta;

    if (diferenta > 0) {
      totalCrescute++;
      sumaCrestere += diferenta;
      if (diferenta > maxCrestere.diferenta) {
        maxCrestere = { diferenta, elev };
      }
    } else if (diferenta < 0) {
      totalScazute++;
      sumaScadere += Math.abs(diferenta);
      if (Math.abs(diferenta) > maxScadere.diferenta) {
        maxScadere = { diferenta: Math.abs(diferenta), elev };
      }
    } else {
      totalNeschimbate++;
    }

    // Dacă ri e între 8 și 9
    if (ri >= 8 && ri < 9) {
      intervalCount++;
      intervalSumaDelta += diferenta;

      if (diferenta > 0) {
        intervalCrescute++;
        intervalSumaCrestere += diferenta;
      } else if (diferenta < 0) {
        intervalScazute++;
        intervalSumaScadere += Math.abs(diferenta);
      } else {
        intervalNeschimbate++;
      }
    }
  }
}

// Afișare generală
console.log(`\n📊 Rezultate generale la contestații română:`);
console.log(` - Total contestații: ${totalContestate}`);
console.log(` - Note crescute: ${totalCrescute} (medie +${totalCrescute ? (sumaCrestere / totalCrescute).toFixed(2) : "0"})`);
console.log(` - Note scăzute: ${totalScazute} (medie -${totalScazute ? (sumaScadere / totalScazute).toFixed(2) : "0"})`);
console.log(` - Fără modificare: ${totalNeschimbate}`);
console.log(` - Diferență medie generală: ${(totalContestate ? (sumaDiferente / totalContestate).toFixed(3) : "0")} puncte`);

if (maxCrestere.elev) {
  console.log(`\n⬆️ Cea mai mare creștere: +${maxCrestere.diferenta.toFixed(2)} pentru ${maxCrestere.elev.name} (${maxCrestere.elev.school})`);
  console.log(`   Inițial: ${maxCrestere.elev.ri} → După contestație: ${maxCrestere.elev.ra}`);
}

if (maxScadere.elev) {
  console.log(`\n⬇️ Cea mai mare scădere: -${maxScadere.diferenta.toFixed(2)} pentru ${maxScadere.elev.name} (${maxScadere.elev.school})`);
  console.log(`   Inițial: ${maxScadere.elev.ri} → După contestație: ${maxScadere.elev.ra}`);
}

// Afișare pentru interval 8 <= ri < 9
console.log(`\n📉 Analiză pentru note inițiale între 8 și 9:`);
console.log(` - Total contestații în acest interval: ${intervalCount}`);
console.log(` - Note crescute: ${intervalCrescute} (medie +${intervalCrescute ? (intervalSumaCrestere / intervalCrescute).toFixed(2) : "0"})`);
console.log(` - Note scăzute: ${intervalScazute} (medie -${intervalScazute ? (intervalSumaScadere / intervalScazute).toFixed(2) : "0"})`);
console.log(` - Fără modificare: ${intervalNeschimbate}`);
console.log(` - Diferență medie în acest interval: ${(intervalCount ? (intervalSumaDelta / intervalCount).toFixed(3) : "0")} puncte`);

console.log("\nAnaliza completă.");
