// Prevodi strani: slovenščina (izvirnik), angleščina, nemščina.
// Besedilo na strani ostane v slovenščini; ta skripta ga ob izbiri jezika zamenja s prevodom.
(function () {
  const D = [
    ["Športno-rekreacijsko društvo Straža", "Straža Sports and Recreation Club", "Sport- und Freizeitverein Straža"],
    ["Igrišča", "Courts", "Plätze"], ["Galerija", "Gallery", "Galerie"], ["Novice", "News", "Neuigkeiten"],
    ["Cenik", "Prices", "Preise"], ["Kontakt", "Contact", "Kontakt"], ["Rezerviraj termin", "Book a court", "Platz buchen"],
    ["Rezerviraj", "Book", "Buchen"],
    ["Rezerviraj termin na enem od naših dveh igrišč. Izberi dan, uro in igrišče – brez klicanja, brez čakanja.",
     "Book a slot on one of our two courts. Pick a day, time and court – no calls, no waiting.",
     "Buche einen Termin auf einem unserer zwei Plätze. Tag, Uhrzeit und Platz wählen – ohne Anruf, ohne Warten."],
    ["igrišči", "courts", "Plätze"], ["vsak dan", "every day", "täglich"], ["na uro", "per hour", "pro Stunde"],
    ["Rezervacija", "Booking", "Buchung"], ["Izberi termin", "Choose a time", "Termin wählen"],
    ["Termin lahko rezerviraš na pol ure natančno, od 30 minut do 3 ur, tudi kot ponavljajoč termin vsak teden. Klikni začetek termina, izberi trajanje in vpiši svoje podatke. Če vpišeš e-naslov, dobiš potrditev s povezavo za preklic. Na dan lahko rezerviraš največ 2 termina.",
     "You can book in half-hour steps, from 30 minutes to 3 hours, also as a weekly recurring slot. Click the start time, choose the duration and enter your details. If you enter your e-mail, you get a confirmation with a cancellation link. You can book at most 2 slots per day.",
     "Du kannst halbstundengenau buchen, von 30 Minuten bis 3 Stunden, auch wöchentlich wiederkehrend. Klicke auf die Startzeit, wähle die Dauer und gib deine Daten ein. Mit E-Mail-Adresse bekommst du eine Bestätigung mit Stornierungslink. Pro Tag sind höchstens 2 Termine möglich."],
    ["Rezervacijo lahko v tem brskalniku prekličeš spodaj pod »Moje rezervacije«, sicer pokliči 031 528 978.",
     "You can cancel in this browser under “My bookings” below, or call 031 528 978.",
     "Stornieren kannst du in diesem Browser unten unter „Meine Buchungen“ oder telefonisch unter 031 528 978."],
    ["Tvoja rezervacija", "Your booking", "Deine Buchung"], ["Moje rezervacije", "My bookings", "Meine Buchungen"],
    ["Prosto", "Free", "Frei"], ["Zasedeno", "Booked", "Belegt"], ["Tvoj termin", "Your slot", "Dein Termin"],
    ["z reflektorji", "with floodlights", "mit Flutlicht"], ["Z reflektorji", "With floodlights", "Mit Flutlicht"],
    ["Igrišče", "Court", "Platz"], ["igrišče", "court", "Platz"],
    ["Nalagam termine …", "Loading …", "Wird geladen …"], ["Nalagam …", "Loading …", "Wird geladen …"],
    ["Termini se osvežujejo samodejno.", "Times refresh automatically.", "Termine werden automatisch aktualisiert."],
    ["Terminov ni bilo mogoče naložiti.", "Could not load times.", "Termine konnten nicht geladen werden."],
    ["Prekliči", "Cancel", "Stornieren"], ["ponavljajoča", "recurring", "wiederkehrend"],
    ["Več →", "More →", "Mehr →"],
    ["Turnir", "Tournament", "Turnier"], ["Trening", "Training", "Training"], ["Vzdrževanje igrišča", "Court maintenance", "Platzpflege"],
    ["Vzdrževanje", "Maintenance", "Wartung"], ["Dogodek", "Event", "Veranstaltung"],
    ["Rezervacija termina", "Book a slot", "Termin buchen"], ["Trajanje", "Duration", "Dauer"],
    ["Ime in priimek", "Full name", "Vor- und Nachname"], ["Telefon", "Phone", "Telefon"], ["Igralci", "Players", "Spieler"],
    ["E-pošta (neobvezno – za potrditev in preklic)", "E-mail (optional – for confirmation and cancellation)", "E-Mail (optional – für Bestätigung und Stornierung)"],
    ["Ponavljaj vsak teden ob isti uri", "Repeat every week at the same time", "Jede Woche zur gleichen Zeit wiederholen"],
    ["Koliko tednov? (2–26)", "How many weeks? (2–26)", "Wie viele Wochen? (2–26)"],
    ["Opomba (neobvezno)", "Note (optional)", "Anmerkung (optional)"], ["Zapri", "Close", "Schließen"],
    ["Potrdi rezervacijo", "Confirm booking", "Buchung bestätigen"], ["Prekliči rezervacijo", "Cancel booking", "Buchung stornieren"],
    ["Cena:", "Price:", "Preis:"], ["na termin ×", "per slot ×", "pro Termin ×"], ["tednov", "weeks", "Wochen"],
    ["+ reflektorji (2 €/h), če je temno", "+ floodlights (€2/h) after dark", "+ Flutlicht (2 €/h) bei Dunkelheit"],
    ["Vpiši ime.", "Please enter your name.", "Bitte Namen eingeben."],
    ["Vpiši veljavno telefonsko številko.", "Please enter a valid phone number.", "Bitte eine gültige Telefonnummer eingeben."],
    ["Vpiši veljaven e-naslov ali pusti polje prazno.", "Enter a valid e-mail or leave it empty.", "Gültige E-Mail eingeben oder Feld leer lassen."],
    ["Izberi trajanje.", "Choose a duration.", "Dauer wählen."],
    ["Termin je zaseden", "This slot is already booked", "Dieser Termin ist bereits belegt"],
    ["Termin je rezerviran za turnir ali drug dogodek", "This slot is reserved for a tournament or event", "Dieser Termin ist für ein Turnier oder eine Veranstaltung reserviert"],
    ["Na dan lahko rezerviraš največ 2 termina", "You can book at most 2 slots per day", "Pro Tag sind höchstens 2 Termine möglich"],
    ["Termin je že mimo", "This time has already passed", "Dieser Termin liegt in der Vergangenheit"],
    ["Rezervacija je možna največ 14 dni vnaprej", "Bookings are possible up to 14 days ahead", "Buchungen sind bis zu 14 Tage im Voraus möglich"],
    ["Rezervacija ni uspela. Poskusi znova ali pokliči 031 528 978.", "Booking failed. Try again or call 031 528 978.", "Buchung fehlgeschlagen. Bitte erneut versuchen oder 031 528 978 anrufen."],
    ["Termin je rezerviran ✓", "Slot booked ✓", "Termin gebucht ✓"], ["Rezerviranih terminov:", "Slots booked:", "Gebuchte Termine:"],
    ["Ni bilo mogoče:", "Not possible:", "Nicht möglich:"], ["Potrditev je poslana na", "Confirmation sent to", "Bestätigung gesendet an"],
    ["Rezervacija je preklicana", "Booking cancelled", "Buchung storniert"],
    ["Preklic ni uspel – pokliči 031 528 978", "Cancellation failed – call 031 528 978", "Stornierung fehlgeschlagen – bitte 031 528 978 anrufen"],
    ["Vremenska napoved za Stražo", "Weather forecast for Straža", "Wettervorhersage für Straža"],
    ["možnost padavin", "chance of rain", "Regenwahrscheinlichkeit"], ["Napoved za ta dan še ni na voljo.", "No forecast for this day yet.", "Für diesen Tag gibt es noch keine Vorhersage."],
    ["jasno", "clear", "klar"], ["pretežno jasno", "mostly clear", "überwiegend klar"], ["delno oblačno", "partly cloudy", "teilweise bewölkt"],
    ["oblačno", "cloudy", "bewölkt"], ["megla", "fog", "Nebel"], ["rosenje", "drizzle", "Nieselregen"], ["dež", "rain", "Regen"],
    ["sneg", "snow", "Schnee"], ["plohe", "showers", "Schauer"], ["snežne plohe", "snow showers", "Schneeschauer"], ["nevihta", "thunderstorm", "Gewitter"],
    ["Dve igrišči", "Two courts", "Zwei Plätze"],
    ["Obe igrišči imata reflektorje, zato lahko igraš tudi zvečer. Več slik igrišč, lokala in parkirišča najdeš v",
     "Both courts have floodlights, so you can play in the evening too. More photos of the courts, bar and parking are in the",
     "Beide Plätze haben Flutlicht, du kannst also auch abends spielen. Mehr Fotos von Plätzen, Lokal und Parkplatz findest du in der"],
    ["galeriji", "gallery", "Galerie"], ["Enostavne cene", "Simple prices", "Einfache Preise"],
    ["Cena velja za igrišče na uro, ne glede na število igralcev.", "Price is per court per hour, regardless of the number of players.", "Der Preis gilt pro Platz und Stunde, unabhängig von der Spielerzahl."],
    ["Igrišče 1 in 2", "Courts 1 and 2", "Plätze 1 und 2"], ["Najem igrišča", "Court rental", "Platzmiete"],
    ["Reflektorji (ponoči)", "Floodlights (at night)", "Flutlicht (nachts)"], ["/ uro", "/ hour", "/ Stunde"],
    ["Pridi na igrišče", "Come and play", "Komm vorbei"], ["Naslov", "Address", "Adresse"],
    ["Navodila za pot →", "Directions →", "Route →"], ["Društvo", "Club", "Verein"], ["Delovni čas", "Opening hours", "Öffnungszeiten"],
    ["Vsak dan", "Every day", "Täglich"], ["Za vprašanja pokliči 031 528 978.", "Questions? Call 031 528 978.", "Fragen? Ruf 031 528 978 an."],
    ["Sledi nam na Facebooku", "Follow us on Facebook", "Folge uns auf Facebook"],
    ["Poglej, kje igraš", "See where you play", "Sieh dir an, wo du spielst"],
    ["Igrišča, lokal, parkirišče in okolica Tenis centra Obrul.", "Courts, bar, parking and surroundings of Tenis Center Obrul.", "Plätze, Lokal, Parkplatz und Umgebung des Tenis Center Obrul."],
    ["Vse", "All", "Alle"], ["Lokal", "Bar", "Lokal"], ["Parkirišče", "Parking", "Parkplatz"], ["Okolica", "Surroundings", "Umgebung"],
    ["Slike prihajajo kmalu.", "Photos coming soon.", "Fotos folgen bald."], ["še ni slik.", "no photos yet.", "noch keine Fotos."], ["V kategoriji", "In category", "In der Kategorie"],
    ["Novice, obvestila in turnirji", "News, announcements and tournaments", "Neuigkeiten, Mitteilungen und Turniere"],
    ["Obvestila", "Announcements", "Mitteilungen"], ["Trenutno ni novic.", "No news at the moment.", "Derzeit keine Neuigkeiten."],
    ["Prihajajoči turnirji in dogodki", "Upcoming tournaments and events", "Kommende Turniere und Veranstaltungen"],
    ["Ni napovedanih dogodkov.", "No upcoming events.", "Keine geplanten Veranstaltungen."],
    ["V času turnirjev in drugih dogodkov igrišča niso na voljo za rezervacijo.", "Courts cannot be booked during tournaments and events.", "Während Turnieren und Veranstaltungen sind die Plätze nicht buchbar."],
    ["pomembno", "important", "wichtig"], ["Prijava na turnir", "Tournament sign-up", "Turnieranmeldung"], ["Prijava", "Sign up", "Anmelden"],
    ["Soigralec / partner (za dvojice)", "Partner (for doubles)", "Partner (für Doppel)"],
    ["E-pošta (neobvezno – za potrditev)", "E-mail (optional – for confirmation)", "E-Mail (optional – für die Bestätigung)"],
    ["Pošlji prijavo", "Send sign-up", "Anmeldung senden"],
    ["Prijava je oddana! Ko jo pregledamo, vas obvestimo.", "Sign-up received! We will let you know once we review it.", "Anmeldung erhalten! Wir melden uns, sobald wir sie geprüft haben."],
    ["Prijava ni uspela. Poskusi znova ali pokliči 031 528 978.", "Sign-up failed. Try again or call 031 528 978.", "Anmeldung fehlgeschlagen. Bitte erneut versuchen oder 031 528 978 anrufen."],
    ["S to telefonsko številko je prijava že oddana", "A sign-up with this phone number already exists", "Mit dieser Telefonnummer gibt es bereits eine Anmeldung"],
    ["Turnir ne obstaja ali je že mimo", "This tournament does not exist or is over", "Dieses Turnier existiert nicht oder ist vorbei"],
    ["do", "until", "bis"],
    ["Preklic rezervacije", "Cancel booking", "Buchung stornieren"], ["Pozdravljeni,", "Hello,", "Hallo,"],
    ["Preklicali boste vse prihodnje termine:", "You are about to cancel all upcoming slots:", "Du stornierst alle kommenden Termine:"],
    ["Preklicali boste ta termin:", "You are about to cancel this slot:", "Du stornierst diesen Termin:"],
    ["Prekliči vse termine", "Cancel all slots", "Alle Termine stornieren"],
    ["Rezervacija je preklicana. Hvala, da ste nam sporočili!", "Booking cancelled. Thanks for letting us know!", "Buchung storniert. Danke für die Info!"],
    ["Preklicanih terminov:", "Slots cancelled:", "Stornierte Termine:"], ["Hvala, da ste nam sporočili!", "Thanks for letting us know!", "Danke für die Info!"],
    ["Povezava za preklic ni veljavna.", "This cancellation link is not valid.", "Dieser Stornierungslink ist ungültig."],
    ["Te rezervacije ni več – morda je že preklicana ali je termin že mimo.", "This booking no longer exists – it may already be cancelled or in the past.", "Diese Buchung gibt es nicht mehr – sie wurde evtl. bereits storniert oder ist vorbei."],
    ["Težave? Pokliči 031 528 978.", "Problems? Call 031 528 978.", "Probleme? Ruf 031 528 978 an."], ["Na glavno stran", "Home page", "Zur Startseite"],
    ["Preklic ni uspel. Pokliči 031 528 978.", "Cancellation failed. Call 031 528 978.", "Stornierung fehlgeschlagen. Bitte 031 528 978 anrufen."],
    ["danes", "today", "heute"],
    ["ponedeljek", "Monday", "Montag"], ["torek", "Tuesday", "Dienstag"], ["sreda", "Wednesday", "Mittwoch"], ["četrtek", "Thursday", "Donnerstag"],
    ["petek", "Friday", "Freitag"], ["sobota", "Saturday", "Samstag"], ["nedelja", "Sunday", "Sonntag"],
    ["pon", "Mon", "Mo"], ["tor", "Tue", "Di"], ["sre", "Wed", "Mi"], ["čet", "Thu", "Do"], ["pet", "Fri", "Fr"], ["sob", "Sat", "Sa"], ["ned", "Sun", "So"],
    ["januar", "January", "Januar"], ["februar", "February", "Februar"], ["marec", "March", "März"], ["april", "April", "April"],
    ["maj", "May", "Mai"], ["junij", "June", "Juni"], ["julij", "July", "Juli"], ["avgust", "August", "August"],
    ["september", "September", "September"], ["oktober", "October", "Oktober"], ["november", "November", "November"], ["december", "December", "Dezember"],
    ["avg", "Aug", "Aug"], ["okt", "Oct", "Okt"],
    ["rezervacija tenis igrišč", "tennis court booking", "Tennisplatz-Buchung"],
    ["Novice in turnirji", "News and tournaments", "Neuigkeiten und Turniere"],
    ["Galerija — ŠRD Straža, Tenis center Obrul", "Gallery — ŠRD Straža, Tenis Center Obrul", "Galerie — ŠRD Straža, Tenis Center Obrul"],
    ["Igraj. Ponovi.", "Play. Repeat.", "Spielen. Wiederholen."],
    ["Zimski čas – igrišča so zaprta", "Winter season – the courts are closed", "Winterzeit – die Plätze sind geschlossen"],
    ["Nova sezona se začne", "The new season starts on", "Die neue Saison beginnt am"],
    ["Rezervacije bodo na voljo 14 dni pred začetkom sezone.", "Bookings open 14 days before the season starts.", "Buchungen sind ab 14 Tage vor Saisonbeginn möglich."],
    ["Za informacije pokliči 031 528 978.", "For information call 031 528 978.", "Für Informationen ruf 031 528 978 an."],
    ["Igrišča so pozimi zaprta – rezervacije so mogoče od", "The courts are closed in winter – bookings are possible from", "Die Plätze sind im Winter geschlossen – Buchungen möglich ab"],
    ["zimsko zaprtje", "winter closure", "Winterpause"],
    ["Oceni nas na Googlu", "Rate us on Google", "Bewerte uns auf Google"],
    ["O nas", "About us", "Über uns"],
    ["⚡ Danes še prosto", "⚡ Still free today", "⚡ Heute noch frei"], ["Danes ni več prostih terminov – poglej jutri.", "No more free slots today – check tomorrow.", "Heute keine freien Termine mehr – schau morgen."],
    ["🎫 Kartica za 10 ur", "🎫 10-hour card", "🎫 10-Stunden-Karte"], ["Preveri stanje", "Check balance", "Guthaben prüfen"], ["Številka kartice", "Card number", "Kartennummer"],
    ["Kartica za 10 ur (neobvezno – številka kartice)", "10-hour card (optional – card number)", "10-Stunden-Karte (optional – Kartennummer)"],
    ["Kartica s to številko ne obstaja.", "No card with this number.", "Keine Karte mit dieser Nummer."], ["Vpiši številko kartice.", "Enter the card number.", "Gib die Kartennummer ein."],
    ["ostane še", "remaining", "verbleibend"], ["Plačilo s kartico: odšteje se", "Paid with card: deducted", "Bezahlt mit Karte: abgezogen"], ["Na kartici ostane", "Left on card", "Auf der Karte verbleiben"],
    ["Na kartici ni dovolj ur", "Not enough hours on the card", "Nicht genug Stunden auf der Karte"], ["Kartica s to številko ne obstaja", "No card with this number", "Keine Karte mit dieser Nummer"],
    ["Vprašanja", "Questions", "Fragen"], ["Pogosta vprašanja o tenisu pri nas", "Frequently asked questions", "Häufige Fragen"],
    ["Koliko stane najem tenis igrišča?","How much does it cost to rent a tennis court?","Was kostet die Miete eines Tennisplatzes?"], ["Najem igrišča stane 10 € na uro, ne glede na število igralcev. Če igraš zvečer z reflektorji, se doplača 2 € na uro.","Renting a court costs €10 per hour, regardless of the number of players. Floodlights in the evening cost an extra €2 per hour.","Die Platzmiete kostet 10 € pro Stunde, unabhängig von der Spielerzahl. Für Flutlicht am Abend kommen 2 € pro Stunde dazu."],
    ["Kako rezerviram tenis igrišče?","How do I book a tennis court?","Wie buche ich einen Tennisplatz?"], ["Termin rezerviraš na tej strani: izberi dan, uro in igrišče ter vpiši ime in telefon. Rezerviraš lahko od 30 minut do 3 ur, tudi kot ponavljajoč termin. Lahko pa pokličeš 031 528 978.","Book on this website: choose the day, time and court and enter your name and phone number. You can book from 30 minutes to 3 hours, also as a weekly recurring slot. Or call 031 528 978.","Buche auf dieser Website: Tag, Uhrzeit und Platz wählen, Name und Telefonnummer eingeben. Buchbar sind 30 Minuten bis 3 Stunden, auch wöchentlich wiederkehrend. Oder ruf 031 528 978 an."],
    ["Ali lahko igram tenis zvečer?","Can I play tennis in the evening?","Kann ich abends Tennis spielen?"], ["Da. Obe igrišči imata reflektorje, zato lahko igraš vsak dan do 24. ure.","Yes. Both courts have floodlights, so you can play every day until midnight.","Ja. Beide Plätze haben Flutlicht, du kannst also täglich bis Mitternacht spielen."],
    ["Kakšna je podloga igrišč?","What surface do the courts have?","Welchen Belag haben die Plätze?"], ["Obe igrišči imata podlogo iz tenisita – klasično rdečo podlogo, ki je prijazna do sklepov.","Both courts have a tennisite (red clay) surface, which is easy on the joints.","Beide Plätze haben einen Belag aus Tennisit (roter Sand), der gelenkschonend ist."],
    ["Kje je Tenis center Obrul?","Where is Tenis Center Obrul?","Wo ist das Tenis Center Obrul?"], ["Na naslovu Straža pri Oplotnici 17, 2317 Oplotnica – v naravnem okolju, blizu Slovenske Bistrice, Zreč in Slovenskih Konjic.","At Straža pri Oplotnici 17, 2317 Oplotnica – surrounded by nature, close to Slovenska Bistrica, Zreče and Slovenske Konjice.","Straža pri Oplotnici 17, 2317 Oplotnica – mitten in der Natur, nahe Slovenska Bistrica, Zreče und Slovenske Konjice."],
    ["Kdaj so igrišča odprta?","When are the courts open?","Wann sind die Plätze geöffnet?"], ["V sezoni (od pomladi do jeseni) vsak dan od 7. do 24. ure. Pozimi so igrišča zaprta – datum odprtja sezone je objavljen na tej strani.","During the season (spring to autumn) every day from 7:00 to 24:00. In winter the courts are closed – the opening date is announced on this website.","In der Saison (Frühling bis Herbst) täglich von 7 bis 24 Uhr. Im Winter sind die Plätze geschlossen – der Saisonstart wird auf dieser Website angekündigt."],
    ["Ali organizirate tenis turnirje?","Do you organise tennis tournaments?","Veranstaltet ihr Tennisturniere?"], ["Da. Napovedane turnirje, prijavo in koledar turnirjev najdeš na strani Turnirji.","Yes. Upcoming tournaments, registration and the tournament calendar are on the Tournaments page.","Ja. Kommende Turniere, Anmeldung und den Turnierkalender findest du auf der Seite Turniere."],

    ["Turnirji", "Tournaments", "Turniere"], ["Turnirji v Tenis centru Obrul", "Tournaments at Tenis Center Obrul", "Turniere im Tenis Center Obrul"],
    ["Prihajajoči turnirji in prijava", "Upcoming tournaments & registration", "Kommende Turniere & Anmeldung"],
    ["Ob turnirjih igrišča niso na voljo za rezervacijo.", "Courts cannot be booked during tournaments.", "Während Turnieren können die Plätze nicht gebucht werden."],
    ["Pretekli turnirji", "Past tournaments", "Vergangene Turniere"], ["Koledar turnirjev", "Tournament calendar", "Turnierkalender"],
    ["Koledar turnirjev in pretekli turnirji →", "Tournament calendar and past tournaments →", "Turnierkalender und vergangene Turniere →"],
    ["drug dogodek / zaprto", "other event / closed", "andere Veranstaltung / geschlossen"], ["turnir", "tournament", "Turnier"],
    ["Klikni obarvan dan za podrobnosti.", "Click a coloured day for details.", "Klicke auf einen farbigen Tag für Details."],
    ["Trenutno ni napovedanih turnirjev. Spremljaj nas na Facebooku.", "No tournaments announced yet. Follow us on Facebook.", "Derzeit sind keine Turniere angekündigt. Folge uns auf Facebook."],
    ["Še ni preteklih turnirjev.", "No past tournaments yet.", "Noch keine vergangenen Turniere."],
    ["Turnir – junij 2025", "Tournament – June 2025", "Turnier – Juni 2025"],
    ["Udeleženci turnirja s prejetimi diplomami.", "Tournament players with their certificates.", "Turnierteilnehmer mit ihren Urkunden."],
    ["Turnirji — Tenis center Obrul", "Tournaments — Tenis Center Obrul", "Turniere — Tenis Center Obrul"],
    ["januar", "January", "Januar"], ["februar", "February", "Februar"], ["marec", "March", "März"], ["april", "April", "April"], ["maj", "May", "Mai"], ["junij", "June", "Juni"],
    ["julij", "July", "Juli"], ["avgust", "August", "August"], ["september", "September", "September"], ["oktober", "October", "Oktober"], ["november", "November", "November"], ["december", "December", "Dezember"],
    ["Igrišče v večernem soncu", "Court in the evening sun", "Platz in der Abendsonne"], ["Igra dvojic", "Doubles match", "Doppel"], ["Igrišče ob lokalu", "Court next to the clubhouse", "Platz neben dem Clubhaus"],
    ["Rekreacija na igrišču", "Playing for fun", "Freizeitspiel"], ["Jesen ob igrišču", "Autumn by the court", "Herbst am Platz"], ["Igrišče jeseni", "Court in autumn", "Platz im Herbst"], ["Tenis v Oplotnici – blizu Slovenske Bistrice in Konjic", "Tennis in Oplotnica – near Slovenska Bistrica and Slovenske Konjice", "Tennis in Oplotnica – nahe Slovenska Bistrica und Slovenske Konjice"],
    ["Tenis center Obrul upravlja Športno-rekreacijsko društvo Straža (ŠRD Straža). Igrišči sta v Straži pri Oplotnici, v naravnem okolju in blizu Slovenske Bistrice, Zreč in Slovenskih Konjic. Igrišča lahko najameš za rekreacijo, trening ali tekmo s prijatelji – brez članstva, vsak dan od 7. do 24. ure.",
     "Tenis Center Obrul is run by the Straža Sports and Recreation Club (ŠRD Straža). The courts are in Straža pri Oplotnici, surrounded by nature and close to Slovenska Bistrica, Zreče and Slovenske Konjice. Rent a court for fun, training or a match with friends – no membership needed, every day from 7:00 to 24:00.",
     "Das Tenis Center Obrul wird vom Sport- und Freizeitverein Straža (ŠRD Straža) betrieben. Die Plätze liegen in Straža pri Oplotnici, mitten in der Natur und nahe Slovenska Bistrica, Zreče und Slovenske Konjice. Miete einen Platz für Freizeit, Training oder ein Match mit Freunden – ohne Mitgliedschaft, täglich von 7 bis 24 Uhr."],
    ["ŠRD Straža – Tenis center Obrul | Tenis Oplotnica, Slovenska Bistrica, Konjice", "ŠRD Straža – Tenis Center Obrul | Tennis Oplotnica, Slovenska Bistrica, Konjice", "ŠRD Straža – Tenis Center Obrul | Tennis Oplotnica, Slovenska Bistrica, Konjice"], ["Mnenje", "Review", "Bewertung"],
    ["Piši na WhatsApp", "Message us on WhatsApp", "Schreib uns auf WhatsApp"], ["Pokliči 031 528 978", "Call 031 528 978", "Ruf 031 528 978 an"], ["Zaprto", "Closed", "Geschlossen"]
  ];
  const LANGS = { sl: -1, en: 1, de: 2 };
  const esc = s => s.replace(/[.*+?^(){}$|[\]\\]/g, "\\$&");
  const MAP = new Map(D.map(r => [r[0], { en: r[1], de: r[2] }]));
  const BIG = new RegExp("(?<![\\p{L}])(" + D.map(r => r[0]).sort((a, b) => b.length - a.length).map(esc).join("|") + ")(?![\\p{L}])", "gu");

  let lang = "sl";
  try { lang = new URLSearchParams(location.search).get("lang") || localStorage.getItem("obrul_lang") || "sl"; } catch (e) {}
  if (!(lang in LANGS)) lang = "sl";

  const orig = new WeakMap(), last = new WeakMap();
  const ATTRS = ["placeholder", "title", "alt", "aria-label"];
  function tr(s) {
    if (lang === "sl" || !s || !/\p{L}/u.test(s)) return s;
    BIG.lastIndex = 0;
    return s.replace(BIG, m => { const t = MAP.get(m); return t ? t[lang] : m; });
  }
  function doText(n) {
    if (last.get(n) === n.nodeValue) return;
    orig.set(n, n.nodeValue);
    const v = tr(n.nodeValue);
    last.set(n, v);
    if (v !== n.nodeValue) n.nodeValue = v;
  }
  function doEl(el) {
    if (el.closest && el.closest("[data-noi18n], script, style, textarea")) return;
    for (const a of ATTRS) {
      if (!el.hasAttribute || !el.hasAttribute(a)) continue;
      const k = "data-i18n-" + a;
      if (!el.hasAttribute(k)) el.setAttribute(k, el.getAttribute(a));
      el.setAttribute(a, tr(el.getAttribute(k)));
    }
  }
  function skip(n) { const p = n.nodeType === 3 ? n.parentElement : n; return !p || !!p.closest("[data-noi18n], script, style, textarea"); }
  function walk(root) {
    if (skip(root)) return;
    if (root.nodeType === 3) { doText(root); return; }
    if (root.nodeType !== 1) return;
    doEl(root);
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, {
      acceptNode: n => (n.nodeType === 1 && n.matches("script, style, textarea, [data-noi18n]")) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT
    });
    let n; while ((n = w.nextNode())) { if (n.nodeType === 3) doText(n); else doEl(n); }
  }
  let titleOrig = null;
  function apply() {
    document.documentElement.lang = lang;
    if (titleOrig === null) titleOrig = document.title;
    document.title = tr(titleOrig);
    walk(document.body);
    document.querySelectorAll(".lang-sel").forEach(s => { s.value = lang; });
  }
  window.setLang = function (l) {
    if (!(l in LANGS)) return;
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let n; while ((n = w.nextNode())) { if (orig.has(n) && last.get(n) === n.nodeValue) { n.nodeValue = orig.get(n); last.delete(n); orig.delete(n); } }
    lang = l; try { localStorage.setItem("obrul_lang", l); } catch (e) {}
    apply();
  };
  window.T = tr;

  const mo = new MutationObserver(ms => {
    if (lang === "sl") return;
    for (const m of ms) {
      if (m.type === "characterData") { if (!skip(m.target)) doText(m.target); }
      else m.addedNodes.forEach(walk);
    }
  });
  function start() {
    document.querySelectorAll(".lang-sel").forEach(s => s.addEventListener("change", () => window.setLang(s.value)));
    apply();
    mo.observe(document.body, { childList: true, subtree: true, characterData: true });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
