(function () {
    'use strict';

    // ── State ──
    const state = {
        entries: [],
        projects: [],
        categories: [],
        triggers: [],
        tips: [],
        reportPeriod: 'day',
        reportOffset: 0,
        reportCustomStart: '',
        reportCustomEnd: '',
    };

    // ── LocalStorage ──
    function save() {
        localStorage.setItem('erf_entries', JSON.stringify(state.entries));
        localStorage.setItem('erf_projects', JSON.stringify(state.projects));
        localStorage.setItem('erf_categories', JSON.stringify(state.categories));
        localStorage.setItem('erf_triggers', JSON.stringify(state.triggers));
        localStorage.setItem('erf_tips', JSON.stringify(state.tips));
    }

    function load() {
        try {
            state.entries = JSON.parse(localStorage.getItem('erf_entries')) || [];
            state.projects = JSON.parse(localStorage.getItem('erf_projects')) || [];
            state.categories = JSON.parse(localStorage.getItem('erf_categories')) || [];
            state.triggers = JSON.parse(localStorage.getItem('erf_triggers')) || [];
            state.tips = JSON.parse(localStorage.getItem('erf_tips')) || [];
        } catch {
            state.entries = [];
            state.projects = [];
            state.categories = [];
            state.triggers = [];
            state.tips = [];
        }
        // Migrate old string[] insights to {text, sortOrder} objects
        state.entries.forEach((entry) => {
            if (Array.isArray(entry.insights)) {
                entry.insights = entry.insights.map((i) =>
                    typeof i === 'string' ? { text: i, sortOrder: null } : i
                );
            }
        });
        if (state.projects.length === 0) {
            state.projects = [
                { id: uid(), name: 'Spinnen', color: '#4a90d9' },
                { id: uid(), name: 'Hohe Bauwerke', color: '#27ae60' },
                { id: uid(), name: 'Menschenmassen', color: '#e67e22' },
                { id: uid(), name: 'Heilung', color: '#1abc9c' },
            ];
        }
        if (state.categories.length === 0) {
            state.categories = [
                { id: uid(), name: 'Angst', color: '#9b59b6' },
                { id: uid(), name: 'Höhenangst', color: '#e74c3c' },
                { id: uid(), name: 'Platzangst', color: '#1abc9c' },
                { id: uid(), name: 'Panik', color: '#e67e22' },
                { id: uid(), name: 'Frustration', color: '#95a5a6' },
            ];
        }
        if (state.triggers.length === 0) {
            state.triggers = [];
        }
        if (state.tips.length === 0) {
            state.tips = [
                {
                    id: uid(),
                    title: "Wof\u00fcr ist die 'Erfahrungen' Web-App",
                    number: 1,
                    text: ">> Worum geht es in diesem Tipp <<\nErfahre, wie die App Dir hilft, das Positive in Deinem Leben sichtbar zu machen und nicht zu vergessen. Und wie Du auch aus schwierigen Erfahrungen mit der Zeit positive Erkenntnisse gewinnen kannst.\n\n\nKennst Du das? \nIm Alltag passieren so viele gute Dinge \u2013 und doch vergessen wir sie viel zu schnell. Besonders in schwierigen oder negativen Momenten f\u00e4llt es uns schwer, das Positive zu sehen, das eigentlich schon da ist.\n\nGenau hier hilft Dir die \"Erfahrungen\" Web-App: Sie macht Dein Positives und Erreichtes sichtbar \u2013 damit es nicht in Vergessenheit ger\u00e4t.\n\nDenn es stimmt: Aus Erfahrungen kann man lernen und Kraft ziehen.\n\nDu kannst die App auf zwei Wege nutzen:\n1) Zum einen, um positive Erfahrungen festzuhalten \u2013 als Motivation und Best\u00e4rkung f\u00fcr Dich selbst.\n2) Zum anderen, um schwierige und negative Erfahrungen zu verarbeiten. Dabei geht es darum, mit etwas zeitlichem Abstand nach positiven Erkenntnissen / Antworten zu suchen. \nFragen, die Dir dabei z.B. helfen k\u00f6nnen, sind: \"Ist es am Ende wirklich so schlimm gekommen, wie ich anfangs dachte?\" oder \"Was ist \u2013 im Nachhinein betrachtet \u2013 das Positive daran?\"\n\n>> Was Dir die \"Erfahrungen App\" erm\u00f6glicht: <<\nDu baust Dir Schritt f\u00fcr Schritt einen pers\u00f6nlichen Schatz an Erkenntnissen und Antworten auf. \nUnd genau diesen Schatz kannst Du nutzen, um f\u00fcr Dich das Erreichte und Positive immer wieder zu reflektieren und so Kraft zu bekommen, auch durch neue Herausforderungen mit Zuversicht zu gehen \u2013 und zu einem guten Ergebnis zu kommen.\nDu lernst ganz automatisch Deine pers\u00f6nlichen Trigger f\u00fcr Schwieriges oder Negatives zu erkennen und diese gut und positiv f\u00fcr Dich zu nutzen. \n\n\ud83d\udca1 Besonderer Tipp\nSchaue Dir von Zeit zu Zeit immer mal wieder in einer ruhigen Situation Deine Erfahrungen mit den positiven Erkenntnissen / Antworten an. Dies hilft Dir sehr Deine positive Kraft zu entwickeln, diese zu behalten und zu einem Teil von Dir zu machen - der Dir in schwierigen und negativen Situationen besonders hilft. \nSehe es so: \"Dauerhafte positive St\u00e4rke erfordert ein bisschen Arbeit - aber eine bessere Arbeit kann es kaum geben.\"\n\n\n\u26a0\ufe0f Wichtiger Hinweis:\nBei starken, dauerhaften negativen Stimmungen, bei Hoffnungslosigkeit und Verzweiflung sowie negativen Gef\u00fchlen w\u00e4hle unbedingt die Hilfe eines Psychotherapeuten, Psychologen oder Arzt.",
                    tags: [],
                    timestamp: new Date().toISOString(),
                },
                {
                    id: uid(),
                    title: "Wie werden Erfahrungen in der Web-App eingegeben",
                    number: 2,
                    text: ">> Worum geht es in diesem Tipp <<\nHier erf\u00e4hrst Du Schritt f\u00fcr Schritt, wie Du Deine Erfahrungen eingibst \u2013 von der Grundkonfiguration \u00fcber Tags und Beschreibungen bis hin zu Erkenntnissen und dem Erfassungsdatum. Einfach und \u00fcbersichtlich erkl\u00e4rt.\n\n\nDas Eingeben Deiner Erfahrungen ist einfach \u2013 und mit ein paar kleinen Vorbereitungen geht es noch leichter. Hier erf\u00e4hrst Du Schritt f\u00fcr Schritt, wie es funktioniert.\n\n1) Bevor es losgeht: Die Grundkonfiguration\nDamit Du Deine Erfahrungen gut strukturiert eingeben kannst, lege zun\u00e4chst im Bereich \"Einstellungen\" Inhalte zu diesen beiden Punkten an:\n- Bezugsperson / Bezugsobjekt \u2013 auf wen oder was bezieht sich Deine Erfahrung?\n- Prim\u00e4rer Ausl\u00f6ser \u2013 was hat die Erfahrung ausgel\u00f6st?\n\nDiese Eintr\u00e4ge stehen Dir dann bei jeder neuen Erfahrung als Auswahl zur Verf\u00fcgung.\nNutzt Du die App zur Unterst\u00fctzung einer Therapie, z. B. bei einem tiefenpsychologischen Verfahren? \nDann ist es sehr empfehlenswert, zus\u00e4tzlich Eintr\u00e4ge zu dem Punkt \"Meine Trigger\" in den Einstellungen anzulegen.\n\n\u279c siehe hierzu auch den Tipp: \"Wie kann eine Erfahrung gut formuliert bzw. erstellt werden?\"\n\n2) Deine Erfahrung eingeben\nIm Bereich \"Eingabe\" findest Du das Eingabeformular. So gehst Du vor:\nDas erste Feld \"Erfahrung \u2026\" ist f\u00fcr die \u00dcberschrift oder den Kurztext Deiner Erfahrung \u2013 das einzige Feld, das ausgef\u00fcllt sein muss. Alle weiteren Felder sind optional, aber sie helfen Dir, Deine Erfahrung besser einzuordnen:\n\n- \"Bezugsperson / Bezugsobjekt w\u00e4hlen\" \u2013 w\u00e4hle hier einen passenden Eintrag aus\n- \"Prim\u00e4rer Ausl\u00f6ser w\u00e4hlen\" \u2013 w\u00e4hle hier den Ausl\u00f6ser aus\n- \"Meine Trigger w\u00e4hlen\" \u2013 besonders hilfreich, wenn Du die App im Rahmen einer Therapie nutzt\n\n3) Tags vergeben\nTags sind frei w\u00e4hlbare Stichworte, die Du jeder Erfahrung hinzuf\u00fcgen kannst. Sie helfen Dir sp\u00e4ter beim Suchen im Bereich \"Suche\".\nKleiner Hinweis: Bezugsperson, prim\u00e4rer Ausl\u00f6ser und Trigger musst Du nicht zus\u00e4tzlich als Tags eingeben \u2013 daf\u00fcr gibt es ja bereits die eigenen Felder. Nutze Tags f\u00fcr weitere, Dir wichtige Stichworte.\n\n4) Deine Erfahrung beschreiben\nIm Beschreibungsfeld hast Du Platz, Deine Erfahrung ausf\u00fchrlicher festzuhalten. Beschreibe sie so, dass Du Dich auch sp\u00e4ter beim Lesen sofort wieder in die Situation zur\u00fcckversetzen kannst.\n\n5) Erkenntnisse und Antworten erg\u00e4nzen\nOft m\u00f6chte man eine wichtige Erfahrung schon fr\u00fch festhalten, auch wenn noch keine Erkenntnisse dazu vorliegen \u2013 und das ist v\u00f6llig in Ordnung! Du kannst Deine Erfahrung jederzeit bearbeiten und Erkenntnisse oder Antworten erg\u00e4nzen.\nNimm Dir immer mal wieder Zeit, eine Erfahrung zu reflektieren, und f\u00fcge dann \u00fcber das Pluszeichen neue Erkenntnisse hinzu. \u00dcber das Nummernfeld kannst Du die Reihenfolge Deiner Erkenntnisse individuell sortieren \u2013 die h\u00f6chste Nummer steht dabei immer oben.\n\n6) Das Erfassungsdatum\nDas Datum wird automatisch auf den heutigen Tag gesetzt \u2013 f\u00fcr neue Erfahrungen kannst Du es einfach so \u00fcbernehmen. Beim sp\u00e4teren Bearbeiten wird das Datum beim Speichern automatisch aktualisiert. Du kannst es aber jederzeit anpassen, z. B. wenn Du die Reihenfolge Deiner Erfahrungen in den Bereichen \"Eintr\u00e4ge\" und \"Suche\" ver\u00e4ndern m\u00f6chtest.\n\n7) Die Buttons \"Hinzuf\u00fcgen\" und \"Reset\"\n- \"Hinzuf\u00fcgen\" \u2013 speichert Deine eingegebene Erfahrung\n- \"Reset\" \u2013 l\u00f6scht alle Eingaben und l\u00e4dt die Seite neu\n\n\n\ud83d\udca1 Besonderer Tipp zum Schluss:\nSchau Dir von Zeit zu Zeit in einer ruhigen Minute Deine Erfahrungen an und erg\u00e4nze neue positive Erkenntnisse. Das hilft Dir, Deine innere St\u00e4rke aufzubauen und sie zu einem festen Teil von Dir zu machen \u2013 gerade dann, wenn es mal schwierig wird.\nOder wie man so sch\u00f6n sagen kann: \"Dauerhafte positive St\u00e4rke erfordert ein bisschen Arbeit \u2013 aber eine bessere Arbeit kann es kaum geben.\"",
                    tags: [],
                    timestamp: new Date().toISOString(),
                },
                {
                    id: uid(),
                    title: "Wie werden gute Eintr\u00e4ge zu den Punkten 'Bezugsperson / Bezugsobjekt', 'prim\u00e4re Ausl\u00f6ser' und 'meine Trigger formuliert",
                    number: 3,
                    text: ">> Worum geht es in diesem Tipp <<\nLerne anhand einfacher Leitfragen und anschaulicher Beispiele, wie Du treffende Eintr\u00e4ge f\u00fcr diese drei wichtigen Punkte findest. Gute Eintr\u00e4ge helfen Dir, Deine Erfahrungen klar einzuordnen und gezielt damit zu arbeiten.\n\n\nErkl\u00e4rung:\nDie drei Punkte \"Bezugsperson / Bezugsobjekt\", \"prim\u00e4rer Ausl\u00f6ser\" und \"meine Trigger\" helfen Dir, Deine Erfahrungen klar einzuordnen. Damit das gut gelingt, findest Du hier einfache Leitfragen und anschauliche Beispiele.\n\n>> Bezugsperson / Bezugsobjekt \u2013 \"Um wen oder was geht es im Wesentlichen?\"\nHier benennst Du die Person, die Gruppe, das Lebewesen oder das Objekt, um das es bei Deiner Erfahrung im Kern geht. Die Antwort ist immer ein Hauptwort \u2013 kein Gef\u00fchl, kein Zustand und keine T\u00e4tigkeit.\nNimm Dir einen Moment Zeit und versuche, einen m\u00f6glichst treffenden und umfassenden Begriff zu finden. Je besser der Begriff gew\u00e4hlt ist, desto hilfreicher wird er f\u00fcr Dich sein.\n\n>> Prim\u00e4rer Ausl\u00f6ser \u2013 \"Was macht das mit mir?\"\nFrage Dich: \"Was l\u00f6st die Bezugsperson oder das Bezugsobjekt in mir aus?\" oder \"Welche Gef\u00fchle habe ich dabei?\"\nDie Antwort ist hier ein Gef\u00fchl, ein Zustand oder eine Eigenschaft \u2013 also das, was die Wirkung auf Dich beschreibt. Es kann auch mehrere Ausl\u00f6ser geben, konzentriere Dich aber auf die wirklich wichtigen und vermeide Doppelungen.\n\n>> Meine Trigger \u2013 \"Was wird in mir unbewusst ausgel\u00f6st?\"\nTrigger sind meist unbewusste Muster in Dir, die durch bestimmte Situationen aktiviert werden. Sie werden h\u00e4ufig im Rahmen einer Therapie gemeinsam mit einem Psychotherapeuten erarbeitet.\nWenn Du die App nicht im Rahmen einer Therapie nutzt, kannst Du diesen Punkt einfach leer lassen.\n\nDrei Beispiele zum besseren Verst\u00e4ndnis:\n*) Beispiel 1:\n\"Ich habe Angst vor Spinnen.\"\n> Leitfrage f\u00fcr das Bezugsobjekt: Um was geht es?\n- Antwort: Spinnen \n\n> Leitfrage f\u00fcr prim\u00e4re Ausl\u00f6ser: Welches Gef\u00fchl habe ich dabei?\n- Antwort: Angst\n\nKurz und klar \u2013 manchmal ist es so einfach.\n\n*) Beispiel 2:\n\"Auf hohen Geb\u00e4uden oder Bauwerken habe ich weiche Knie, f\u00fchle mich unsicher und habe H\u00f6henangst.\"\n\n> Leitfrage f\u00fcr das Bezugsobjekt: Um was geht es?\n- Antwort: Hohe Bauwerke\n\n\ud83d\udca1 Tipp zum Bezugsobjekt: Entscheide Dich f\u00fcr den Begriff, der am umfassendsten passt. \"Hohe Bauwerke\" schlie\u00dft Geb\u00e4ude, T\u00fcrme und Br\u00fccken mit ein \u2013 und ist damit besser als z. B. nur \u201ehohe Geb\u00e4ude\".\n\n> Leitfrage f\u00fcr prim\u00e4re Ausl\u00f6ser: Welches Gef\u00fchl habe ich dabei?\n- Antwort: H\u00f6henangst\n\n\ud83d\udca1 Tipp zum Ausl\u00f6ser: Wenn Du mehrere Ausl\u00f6ser benennen m\u00f6chtest, z. B. H\u00f6henangst und Unsicherheit, pr\u00fcfe vorher, ob die Unterscheidung f\u00fcr Dich wirklich klar und deutlich ist. Vermeide Doppelungen wie \u201eAngst\" und \u201eH\u00f6henangst\" \u2013 w\u00e4hle den Begriff, der besser zu Dir passt.\n\n*) Beispiel 3:\n\"In Bahnen und Bussen oder in gro\u00dfen Menschengruppen werde ich panisch und bekomme Platzangst. Ich habe schon vieles versucht, um das loszuwerden \u2013 online Kurse, Gespr\u00e4che mit Freunden \u2013 nichts hat geholfen. Ich bin total frustriert.\"\n\nDieser Sachverhalt ist umfangreicher und enth\u00e4lt eigentlich zwei Themen. In solchen F\u00e4llen lohnt es sich, den Sachverhalt aufzuteilen:\n\nThema 1 \u2013 Die Platzangst:\n> Leitfrage f\u00fcr das Bezugsobjekt: Um was geht es?\n- Antwort: Menschenmassen\n\n\ud83d\udca1 \u201eMenschenmassen\" ist umfassender als \u201eBusse und Bahnen\", denn es schlie\u00dft auch Konzerte, Wartebereiche und andere Situationen mit ein.\n\n> Leitfrage f\u00fcr prim\u00e4re Ausl\u00f6ser: Welches Gef\u00fchl habe ich dabei?\n- Antwort: Platzangst, Panik (jeweils ein separater Eintrag)\n\nThema 2 \u2013 Die Frustration \u00fcber fehlende Hilfe:\n> Leitfrage f\u00fcr das Bezugsobjekt: Um was geht es?\n- Antwort: Hilfe oder Heilung \u2013 was besser zu Dir passt\n\n> Leitfrage f\u00fcr prim\u00e4re Ausl\u00f6ser: Welches Gef\u00fchl habe ich dabei?\n- Antwort: Frustration\n\n\ud83d\udca1 Pr\u00fcfe bei starken Begriffen wie \u201edeprimiert\" ehrlich, ob es sich um eine medizinische Diagnose handelt oder ob Du damit Deiner Frustration mehr Ausdruck verleihen m\u00f6chtest. Wenn Du nicht an einer diagnostizierten Depression leidest, bleibe bei \"Frustration\" \u2013 das ist ehrlicher und hilft Dir langfristig mehr.\n\n\n\ud83d\udca1 Zusammengefasst: Drei kleine Tipps f\u00fcr gute Eintr\u00e4ge\n1. Nimm Dir einen Moment Zeit, bevor Du einen Begriff w\u00e4hlst \u2013 ein treffender, umfassender Begriff ist wertvoller als ein schneller.\n2. Konzentriere Dich auf das Wesentliche und vermeide Doppelungen.\n3. Wenn ein Sachverhalt komplex ist, teile ihn in einzelne Themen auf \u2013 das schafft Klarheit.",
                    tags: [],
                    timestamp: new Date().toISOString(),
                },
                {
                    id: uid(),
                    title: "Wie werden Erkenntnisse / Antworten in der Web-App eingegeben",
                    number: 4,
                    text: ">> Worum geht es in diesem Tipp <<\nErfahre, wo und wie Du Erkenntnisse und Antworten zu Deinen Erfahrungen eingibst und wie Du sie in einer f\u00fcr Dich passenden Reihenfolge anordnen kannst. Denn in den Erkenntnissen steckt die eigentliche Kraft.\n\n\nDeine Erfahrungen festzuhalten ist wichtig \u2013 aber die eigentliche Kraft steckt in den Erkenntnissen und Antworten, die Du daraus gewinnst. Sie helfen Dir, Deine positive St\u00e4rke aufzubauen und zu einem festen Teil von Dir zu machen.\n\n*) Wo kannst Du Erkenntnisse / Antworten eingeben?\nDaf\u00fcr gibt es zwei Wege:\n1. Im Bereich \u201eEingabe\" \u2013 direkt beim Erstellen einer neuen Erfahrung\n2. Im Bereich \u201eEintr\u00e4ge\" \u2013 indem Du bei einer bestehenden Erfahrung auf \u201eBearbeiten\" klickst\n\n*) So funktioniert die Eingabe\nGib in das Textfeld f\u00fcr Erkenntnisse / Antworten immer nur eine einzelne Erkenntnis oder Antwort ein!\n\nZu den meisten Erfahrungen wirst Du mit der Zeit mehrere Erkenntnisse sammeln \u2013 und genau daf\u00fcr gibt es den \u201e+\" Button unter dem Eingabefeld. Mit einem Klick darauf f\u00fcgst Du ein neues Feld f\u00fcr eine weitere Erkenntnis oder Antwort hinzu.\n\n*) Die Reihenfolge selbst bestimmen\nNeben jedem Eingabefeld findest Du ein kleines Feld \"Nr.\" \u2013 damit kannst Du Deine Erkenntnisse in eine f\u00fcr Dich passende Reihenfolge bringen, z. B. um den Weg Deiner pers\u00f6nlichen Entwicklung abzubilden.\n\nDie Eingabe einer Nummer ist aber nicht erforderlich. Ohne Nummerierung werden Deine Erkenntnisse einfach in der Reihenfolge angezeigt, in der Du sie eingegeben hast.\n\n\n>> Der vielleicht wichtigste Tipp\nNimm Dir von Zeit zu Zeit in einer ruhigen Minute Deine Erfahrungen vor und \u00fcberlege: Was ist seitdem passiert? Wie blickst Du heute auf Deine Situation und Deine Gef\u00fchle zu dieser Erfahrung?\n\nFragen, die Dir dabei helfen k\u00f6nnen:\n- \u201eIst es am Ende wirklich so schlimm gekommen, wie ich anfangs dachte?\"\n- \u201eWas ist \u2013 im Nachhinein betrachtet \u2013 das Positive daran?\"\n\nDieses gelegentliche Reflektieren f\u00fchrt ganz nat\u00fcrlich zu neuen Erkenntnissen und Antworten \u2013 und genau daraus w\u00e4chst Deine innere St\u00e4rke.\n\n\ud83d\udca1 \"Ja, dauerhafte positive St\u00e4rke aufzubauen erfordert ein bisschen Arbeit \u2013 aber eine bessere Arbeit kann es kaum geben.\"",
                    tags: [],
                    timestamp: new Date().toISOString(),
                },
                {
                    id: uid(),
                    title: "Wof\u00fcr ist der Bereich 'Eingabe'",
                    number: 5,
                    text: ">> Worum geht es in diesem Tipp <<\nHier gibst Du Deine Erfahrungen ein \u2013 dies ist der Startpunkt f\u00fcr alles. Dieser Tipp zeigt Dir, welche weiteren Tipps Dir bei der Eingabe helfen.\n\n\nIm Bereich \"Eingabe\" gibst Du Deine Erfahrungen ein \u2013 hier beginnt also alles. \nWenn Du beim Eingeben bereits erste Erkenntnisse oder Antworten zu Deiner Erfahrung hast, kannst Du diese gleich mit erfassen.\n\nDamit Deine Eingaben von Anfang an gut gelingen, schau Dir bitte vorher diese drei Tipps an:\n1. \"Wie werden Erfahrungen in der Web-App eingegeben?\"\n2. \"Wie werden gute Eintr\u00e4ge zu Bezugsperson / Bezugsobjekt, prim\u00e4rer Ausl\u00f6ser und meine Trigger formuliert?\"\n3. \"Wie werden Erkenntnisse / Antworten in der Web-App eingegeben?\"\n\nDie drei Tipps sind leicht und schnell zu lesen \u2013 und Du wirst schnell sehen, dass die Eingabe ganz unkompliziert ist.",
                    tags: [],
                    timestamp: new Date().toISOString(),
                },
                {
                    id: uid(),
                    title: "Wofür ist der Bereich 'Einträge'",
                    number: 6,
                    text: ">> Worum geht es in diesem Tipp <<\nHier verwaltest und bearbeitest Du Deine vorhandenen Erfahrungen – von der Änderung über das Ergänzen von Erkenntnissen bis hin zum Löschen. Außerdem erfährst Du, wie Du Deine Erfahrungen nach Zeit oder Inhalt filtern und exportieren kannst.\n\n\nIm Bereich \"Einträge\" findest Du alle Deine eingegebenen Erfahrungen – hier kannst Du sie verwalten, bearbeiten und weiterentwickeln.\n\n*) Erfahrungen bearbeiten und löschen\nZu jeder Erfahrung stehen Dir zwei Buttons zur Verfügung:\n\n1. \"Bearbeiten\" – öffnet Deine Erfahrung zum Anpassen, z. B. um Erkenntnisse oder Antworten hinzuzufügen, die Beschreibung zu erweitern oder andere Eingaben zu ändern\n2. \"Löschen\" – entfernt die jeweilige Erfahrung\n\n➜ siehe hierzu auch den Tipp: \"Wie werden Erfahrungen in der Web-App eingegeben?\"\n\n*) Erfahrungen gezielt anzeigen lassen\nDamit Du Deine Erfahrungen schnell wiederfindest, stehen Dir zwei Anzeigemöglichkeiten zur Verfügung:\n1. Nach Zeit filtern:\nWähle ein bestimmtes Tagesdatum, eine Woche, einen Monat oder ein Jahr aus – mit den Pfeiltasten kannst Du bequem vor- und zurückblättern. Hier zählt das zu Deiner Erfahrung gespeicherte Datum.\n2. Nach Inhalt filtern:\nNutze die drei Auswahlbuttons zu \"Bezugspersonen / Bezugsobjekte\", \"primäre Auslöser\" oder \"meine Trigger\" und wähle einfach den passenden Eintrag aus. Dir werden dann alle zugehörigen Erfahrungen angezeigt.\n3. Alle Erfahrungen anzeigen:\nMit Klick auf den Button \"Alle anzeigen\" zeigst Du alle vorhandenen Erfahrungen an.\n\nFür eine neue Auswahl der Erfahrungen klicke einfach auf \"Reset\" und starte von neu.\n\n*) Erfahrungen exportieren\nMöchtest Du Deine angezeigten Erfahrungen auch außerhalb der App nutzen? \nMit einem Klick auf den Button \"CSV Export\" kannst Du sie exportieren und lokal auf Deinem Gerät speichern.",
                    tags: [],
                    timestamp: new Date().toISOString(),
                },
            ];
        }
        state.projects.sort((a, b) => a.name.localeCompare(b.name, 'de'));
        state.categories.sort((a, b) => a.name.localeCompare(b.name, 'de'));
        state.triggers.sort((a, b) => a.name.localeCompare(b.name, 'de'));
        save();
    }

    // ── Helpers ──
    function uid() {
        return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
    }

    function todayStr() {
        return new Date().toISOString().slice(0, 10);
    }

    function escHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // ── DOM refs ──
    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => document.querySelectorAll(sel);

    // ── Navigation ──
    $$('.nav-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            $$('.nav-btn').forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');
            $$('.view').forEach((v) => v.classList.remove('active'));
            $(`#${btn.dataset.view}`).classList.add('active');
            if (btn.dataset.view === 'entries') renderEntries();
            if (btn.dataset.view === 'reports') renderReports();
            if (btn.dataset.view === 'search') initSearchMultiSelects();
            if (btn.dataset.view === 'settings') renderSettings();
            if (btn.dataset.view === 'tips') renderTips();
        });
    });

    // ── Populate selects ──
    function populateSelects() {
        const projectSelects = ['#manual-project', '#filter-project'];
        const categorySelects = ['#manual-category', '#filter-category'];

        projectSelects.forEach((sel) => {
            const el = $(sel);
            const val = el.value;
            const isFilter = sel.includes('filter');
            el.innerHTML = `<option value="">${isFilter ? 'Alle Bezugsperson / Bezugsobjekt' : '-- Bezugsperson / Bezugsobjekt wählen --'}</option>`;
            state.projects.forEach((p) => {
                el.innerHTML += `<option value="${p.id}">${escHtml(p.name)}</option>`;
            });
            el.value = val;
        });

        categorySelects.forEach((sel) => {
            const el = $(sel);
            const val = el.value;
            const isFilter = sel.includes('filter');
            el.innerHTML = `<option value="">${isFilter ? 'Alle primäre Auslöser' : '-- primärer Auslöser wählen --'}</option>`;
            state.categories.forEach((c) => {
                el.innerHTML += `<option value="${c.id}">${escHtml(c.name)}</option>`;
            });
            el.value = val;
        });

        // Filter-Trigger bleibt ein normaler Select
        const filterTrigEl = $('#filter-trigger');
        const filterTrigVal = filterTrigEl.value;
        filterTrigEl.innerHTML = '<option value="">Alle Trigger</option>';
        state.triggers.forEach((t) => {
            filterTrigEl.innerHTML += `<option value="${t.id}">${escHtml(t.name)}</option>`;
        });
        filterTrigEl.value = filterTrigVal;

        // Multi-Select Trigger für Eingabe
        populateInlineTriggerSelect('manual-trigger-select', '-- meine Trigger wählen --');
    }

    function populateInlineTriggerSelect(containerId, labelDefault, selectedIds) {
        const container = $(`#${containerId}`);
        const dropdown = container.querySelector('.multi-select-dropdown');
        const toggle = container.querySelector('.multi-select-toggle');
        const selected = selectedIds || [];

        dropdown.innerHTML = state.triggers
            .map((t) => `<label class="multi-select-option">
                <input type="checkbox" value="${t.id}"${selected.includes(t.id) ? ' checked' : ''}>
                <span class="color-dot" style="background:${t.color}"></span>
                ${escHtml(t.name)}
            </label>`)
            .join('');

        dropdown.addEventListener('click', (e) => e.stopPropagation());

        updateInlineTriggerToggle(containerId, labelDefault);

        // Remove old listeners by cloning
        const newToggle = toggle.cloneNode(true);
        toggle.parentNode.replaceChild(newToggle, toggle);

        newToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            $$('.multi-select-dropdown').forEach((d) => {
                if (d !== dropdown) d.classList.remove('open');
            });
            dropdown.classList.toggle('open');
        });

        dropdown.addEventListener('change', () => {
            updateInlineTriggerToggle(containerId, labelDefault);
        });
    }

    function updateInlineTriggerToggle(containerId, labelDefault) {
        const container = $(`#${containerId}`);
        const dropdown = container.querySelector('.multi-select-dropdown');
        const toggle = container.querySelector('.multi-select-toggle');
        const checked = dropdown.querySelectorAll('input:checked');
        if (checked.length === 0) {
            toggle.textContent = labelDefault;
        } else {
            const names = Array.from(checked).map((cb) => {
                const item = state.triggers.find((t) => t.id === cb.value);
                return item ? item.name : '';
            });
            toggle.textContent = names.join(', ');
        }
    }

    function getInlineTriggerValues(containerId) {
        const checkboxes = $(`#${containerId}`).querySelectorAll('.multi-select-dropdown input:checked');
        return Array.from(checkboxes).map((cb) => cb.value);
    }

    function clearInlineTriggerSelect(containerId, labelDefault) {
        const container = $(`#${containerId}`);
        const checkboxes = container.querySelectorAll('.multi-select-dropdown input[type="checkbox"]');
        checkboxes.forEach((cb) => { cb.checked = false; });
        container.querySelector('.multi-select-toggle').textContent = labelDefault;
    }

    // Helper: normalize entry triggers (backward compat: single trigger string → array)
    function getEntryTriggers(entry) {
        if (Array.isArray(entry.triggers)) return entry.triggers;
        if (entry.trigger) return [entry.trigger];
        return [];
    }

    // ── Insights helpers ──
    function addInsightRow(containerId, value, sortOrder) {
        const container = $('#' + containerId);
        const row = document.createElement('div');
        row.className = 'insight-row';
        const ta = document.createElement('textarea');
        ta.placeholder = 'Erkenntnis / Antwort ...';
        ta.rows = 2;
        ta.value = value || '';
        const numInput = document.createElement('input');
        numInput.type = 'number';
        numInput.className = 'insight-number-input';
        numInput.placeholder = 'Nr.';
        numInput.min = '1';
        numInput.step = '1';
        numInput.value = (sortOrder !== null && sortOrder !== undefined && sortOrder !== '') ? sortOrder : '';
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn-remove-insight';
        btn.textContent = '\u00d7';
        btn.addEventListener('click', () => row.remove());
        row.appendChild(ta);
        row.appendChild(numInput);
        row.appendChild(btn);
        container.prepend(row);
    }

    function getInsightValues(containerId) {
        const rows = $('#' + containerId).querySelectorAll('.insight-row');
        return Array.from(rows).map((row) => {
            const text = row.querySelector('textarea').value.trim();
            const numVal = row.querySelector('.insight-number-input').value.trim();
            const sortOrder = numVal !== '' ? parseInt(numVal, 10) : null;
            return { text, sortOrder };
        }).filter((i) => i.text);
    }

    function sortInsights(insights) {
        const arr = (insights || []).map((item, idx) => ({ ...item, _idx: idx }));
        const withNum = arr.filter((i) => i.sortOrder !== null && i.sortOrder !== undefined && i.sortOrder !== '');
        const withoutNum = arr.filter((i) => i.sortOrder === null || i.sortOrder === undefined || i.sortOrder === '');
        withNum.sort((a, b) => {
            const numDiff = Number(b.sortOrder) - Number(a.sortOrder);
            if (numDiff !== 0) return numDiff;
            return a._idx - b._idx;
        });
        return [...withNum, ...withoutNum];
    }

    function clearInsights(containerId) {
        $('#' + containerId).innerHTML = '';
    }

    function renderInsightsHtml(insights) {
        const sorted = sortInsights(insights);
        if (sorted.length === 0) return '';
        const listItems = sorted.map((i) => {
            const numBadge = (i.sortOrder !== null && i.sortOrder !== undefined && i.sortOrder !== '')
                ? `<span class="insight-number">${escHtml(String(i.sortOrder))}</span> ` : '';
            return `<li><strong>${numBadge}${escHtml(i.text)}</strong></li>`;
        }).join('');
        return `<div class="entry-insights"><strong><u>Erkenntnisse / Antworten:</u></strong><ul>${listItems}</ul></div>`;
    }

    // ── Manual Entry (Eingabe) ──
    $('#manual-date').value = todayStr();
    addInsightRow('manual-insights', '', null);

    $('#btn-add-manual-insight').addEventListener('click', () => {
        addInsightRow('manual-insights', '', null);
    });

    $('#btn-manual-add').addEventListener('click', () => {
        const task = $('#manual-task').value.trim();
        if (!task) {
            alert('Bitte eine Erfahrung eingeben.');
            return;
        }

        const date = $('#manual-date').value || todayStr();

        const entry = {
            id: uid(),
            task: task,
            project: $('#manual-project').value,
            category: $('#manual-category').value,
            triggers: getInlineTriggerValues('manual-trigger-select'),
            tags: $('#manual-tags').value.split(',').map((t) => t.trim()).filter(Boolean),
            description: $('#manual-description').value.trim(),
            insights: getInsightValues('manual-insights'),
            date: date,
            timestamp: new Date().toISOString(),
        };
        state.entries.push(entry);
        save();
        $('#manual-task').value = '';
        $('#manual-tags').value = '';
        $('#manual-description').value = '';
        $('#manual-project').value = '';
        $('#manual-category').value = '';
        clearInlineTriggerSelect('manual-trigger-select', '-- meine Trigger wählen --');
        clearInsights('manual-insights');
        addInsightRow('manual-insights', '', null);
        $('#manual-date').value = todayStr();
        alert('Erfahrung erfolgreich erfasst!');
    });

    // ── Entries View ──
    // Period filter state: { mode: 'day'|'week'|'month'|'year', ref: Date }
    const periodFilter = { mode: 'day', ref: new Date() };

    function fmtDate(d) {
        return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    }

    function getDateRange() {
        const ref = periodFilter.ref;
        if (periodFilter.mode === 'day') {
            const ds = $('#filter-date').value || fmtDate(ref);
            return { start: ds, end: ds };
        }
        if (periodFilter.mode === 'week') {
            const d = new Date(ref);
            const day = d.getDay();
            const diffToMon = (day === 0 ? -6 : 1 - day);
            const mon = new Date(d);
            mon.setDate(d.getDate() + diffToMon);
            const sun = new Date(mon);
            sun.setDate(mon.getDate() + 6);
            return { start: fmtDate(mon), end: fmtDate(sun) };
        }
        if (periodFilter.mode === 'month') {
            const first = new Date(ref.getFullYear(), ref.getMonth(), 1);
            const last = new Date(ref.getFullYear(), ref.getMonth() + 1, 0);
            return { start: fmtDate(first), end: fmtDate(last) };
        }
        if (periodFilter.mode === 'year') {
            return { start: ref.getFullYear() + '-01-01', end: ref.getFullYear() + '-12-31' };
        }
        return { start: '', end: '' };
    }

    function updatePeriodButtons() {
        ['week', 'month', 'year'].forEach((m) => {
            const btn = $(`#btn-filter-${m}`);
            btn.classList.toggle('active', periodFilter.mode === m);
        });
    }

    function renderEntries() {
        const filterProject = $('#filter-project').value;
        const filterCategory = $('#filter-category').value;
        const filterTrigger = $('#filter-trigger').value;

        const range = getDateRange();
        let filtered = [...state.entries];
        if (range.start && range.end) {
            filtered = filtered.filter((e) => e.date >= range.start && e.date <= range.end);
        }
        if (filterProject) filtered = filtered.filter((e) => e.project === filterProject);
        if (filterCategory) filtered = filtered.filter((e) => e.category === filterCategory);
        if (filterTrigger) filtered = filtered.filter((e) => getEntryTriggers(e).includes(filterTrigger));

        filtered.sort((a, b) => {
            const cmp = b.date.localeCompare(a.date);
            if (cmp !== 0) return cmp;
            return (b.timestamp || '').localeCompare(a.timestamp || '');
        });

        const list = $('#entries-list');
        if (filtered.length === 0) {
            list.innerHTML = '<div class="no-entries">Keine Einträge gefunden.</div>';
            return;
        }

        list.innerHTML = filtered
            .map((e) => {
                const proj = state.projects.find((p) => p.id === e.project);
                const cat = state.categories.find((c) => c.id === e.category);
                const trigIds = getEntryTriggers(e);
                const tagsHtml = (e.tags || []).map((t) => `<span class="tag">${escHtml(t)}</span>`).join('');
                const projBadge = proj ? `<span class="project-badge" style="background:${proj.color}22;color:${proj.color}">${escHtml(proj.name)}</span>` : '';
                const catBadge = cat ? `<span class="category-badge" style="background:${cat.color}22;color:${cat.color}">${escHtml(cat.name)}</span>` : '';
                const trigBadges = trigIds.map((tid) => {
                    const trig = state.triggers.find((t) => t.id === tid);
                    return trig ? `<span class="trigger-badge" style="background:${trig.color}22;color:${trig.color}">${escHtml(trig.name)}</span>` : '';
                }).join('');
                const descHtml = e.description ? `<div class="entry-description">${escHtml(e.description)}</div>` : '';
                const insightsHtml = renderInsightsHtml(e.insights || []);

                return `<div class="entry-card">
                    <div class="entry-info">
                        <div class="entry-task">${escHtml(e.task)}</div>
                        <div class="entry-meta">
                            <span>${e.date}</span>
                            ${projBadge}${catBadge}${trigBadges}
                        </div>
                        <div style="margin-top:4px">${tagsHtml}</div>
                        ${descHtml}
                        ${insightsHtml}
                    </div>
                    <div class="entry-actions">
                        <button onclick="app.editEntry('${e.id}')">Bearbeiten</button>
                        <button onclick="app.deleteEntry('${e.id}')">Löschen</button>
                    </div>
                </div>`;
            })
            .join('');
    }

    $('#filter-date').addEventListener('change', () => {
        periodFilter.mode = 'day';
        periodFilter.ref = new Date($('#filter-date').value + 'T00:00:00');
        updatePeriodButtons();
        renderEntries();
    });
    $('#filter-project').addEventListener('change', renderEntries);
    $('#filter-category').addEventListener('change', renderEntries);
    $('#filter-trigger').addEventListener('change', renderEntries);

    $('#filter-date-prev').addEventListener('click', () => {
        const el = $('#filter-date');
        const d = el.value ? new Date(el.value + 'T00:00:00') : new Date();
        d.setDate(d.getDate() - 1);
        el.value = fmtDate(d);
        periodFilter.mode = 'day';
        periodFilter.ref = d;
        updatePeriodButtons();
        renderEntries();
    });

    $('#filter-date-next').addEventListener('click', () => {
        const el = $('#filter-date');
        const d = el.value ? new Date(el.value + 'T00:00:00') : new Date();
        d.setDate(d.getDate() + 1);
        el.value = fmtDate(d);
        periodFilter.mode = 'day';
        periodFilter.ref = d;
        updatePeriodButtons();
        renderEntries();
    });

    // Week
    $('#btn-filter-week').addEventListener('click', () => {
        periodFilter.mode = periodFilter.mode === 'week' ? 'day' : 'week';
        periodFilter.ref = new Date();
        updatePeriodButtons();
        renderEntries();
    });
    $('#filter-week-prev').addEventListener('click', () => {
        periodFilter.mode = 'week';
        periodFilter.ref.setDate(periodFilter.ref.getDate() - 7);
        updatePeriodButtons();
        renderEntries();
    });
    $('#filter-week-next').addEventListener('click', () => {
        periodFilter.mode = 'week';
        periodFilter.ref.setDate(periodFilter.ref.getDate() + 7);
        updatePeriodButtons();
        renderEntries();
    });

    // Month
    $('#btn-filter-month').addEventListener('click', () => {
        periodFilter.mode = periodFilter.mode === 'month' ? 'day' : 'month';
        periodFilter.ref = new Date();
        updatePeriodButtons();
        renderEntries();
    });
    $('#filter-month-prev').addEventListener('click', () => {
        periodFilter.mode = 'month';
        periodFilter.ref.setMonth(periodFilter.ref.getMonth() - 1);
        updatePeriodButtons();
        renderEntries();
    });
    $('#filter-month-next').addEventListener('click', () => {
        periodFilter.mode = 'month';
        periodFilter.ref.setMonth(periodFilter.ref.getMonth() + 1);
        updatePeriodButtons();
        renderEntries();
    });

    // Year
    $('#btn-filter-year').addEventListener('click', () => {
        periodFilter.mode = periodFilter.mode === 'year' ? 'day' : 'year';
        periodFilter.ref = new Date();
        updatePeriodButtons();
        renderEntries();
    });
    $('#filter-year-prev').addEventListener('click', () => {
        periodFilter.mode = 'year';
        periodFilter.ref.setFullYear(periodFilter.ref.getFullYear() - 1);
        updatePeriodButtons();
        renderEntries();
    });
    $('#filter-year-next').addEventListener('click', () => {
        periodFilter.mode = 'year';
        periodFilter.ref.setFullYear(periodFilter.ref.getFullYear() + 1);
        updatePeriodButtons();
        renderEntries();
    });

    $('#btn-entries-show-all').addEventListener('click', () => {
        periodFilter.mode = 'all';
        updatePeriodButtons();
        renderEntries();
    });

    $('#btn-entries-reset').addEventListener('click', () => {
        location.hash = 'entries';
        location.reload();
    });

    // ── CSV Export ──
    $('#btn-export').addEventListener('click', () => {
        const filterProject = $('#filter-project').value;
        const filterCategory = $('#filter-category').value;
        const filterTrigger = $('#filter-trigger').value;

        const range = getDateRange();
        let filtered = [...state.entries];
        if (range.start && range.end) {
            filtered = filtered.filter((e) => e.date >= range.start && e.date <= range.end);
        }
        if (filterProject) filtered = filtered.filter((e) => e.project === filterProject);
        if (filterCategory) filtered = filtered.filter((e) => e.category === filterCategory);
        if (filterTrigger) filtered = filtered.filter((e) => getEntryTriggers(e).includes(filterTrigger));

        const sortedInsightsPerEntry = filtered.map((e) => sortInsights(e.insights || []));
        const maxInsights = sortedInsightsPerEntry.reduce((max, ins) => Math.max(max, ins.length), 0);
        const headers = ['Erfassungsdatum', 'Erfahrung', 'Bezugsperson/Bezugsobjekt', 'primärer Auslöser', 'Trigger', 'Tags', 'Beschreibung'];
        for (let i = 1; i <= maxInsights; i++) headers.push(`Erkenntnis ${i}`);
        const rows = filtered.map((e, idx) => {
            const proj = state.projects.find((p) => p.id === e.project);
            const cat = state.categories.find((c) => c.id === e.category);
            const trigNames = getEntryTriggers(e).map((tid) => {
                const t = state.triggers.find((tr) => tr.id === tid);
                return t ? t.name : '';
            }).filter(Boolean).join('; ');
            const row = [e.date, `"${e.task}"`, proj ? proj.name : '', cat ? cat.name : '', trigNames, (e.tags || []).join('; '), `"${(e.description || '').replace(/"/g, '""')}"`];
            const ins = sortedInsightsPerEntry[idx];
            for (let i = 0; i < maxInsights; i++) {
                const text = ins[i] ? ins[i].text : '';
                row.push(`"${text.replace(/"/g, '""')}"`);
            }
            return row;
        });

        const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
        const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const now = new Date();
        const timeStr = String(now.getHours()).padStart(2, '0') + '-' + String(now.getMinutes()).padStart(2, '0') + '-' + String(now.getSeconds()).padStart(2, '0');
        a.download = `erfahrungen_export_${todayStr()}_${timeStr}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    });

    // ── CSV Export Tipps ──
    $('#btn-tips-export').addEventListener('click', () => {
        const sorted = sortTips([...state.tips]);
        if (sorted.length === 0) {
            alert('Keine Tipps zum Exportieren vorhanden.');
            return;
        }
        const headers = ['Nummer', 'Titel', 'Text', 'Tags'];
        const rows = sorted.map((tip) => {
            const num = (tip.number !== null && tip.number !== undefined && tip.number !== '') ? tip.number : '';
            return [num, `"${(tip.title || '').replace(/"/g, '""')}"`, `"${(tip.text || '').replace(/"/g, '""')}"`, (tip.tags || []).join('; ')];
        });
        const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
        const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const now = new Date();
        const timeStr = String(now.getHours()).padStart(2, '0') + '-' + String(now.getMinutes()).padStart(2, '0') + '-' + String(now.getSeconds()).padStart(2, '0');
        a.download = `erfahrungen_tipps_${todayStr()}_${timeStr}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    });

    // ── Reports ──
    let chartProjects = null;
    let chartCategories = null;
    let chartTriggers = null;

    // Set initial report date to today
    $('#report-date').value = todayStr();

    function updateReportTabs() {
        $$('.report-tab').forEach((t) => {
            t.classList.toggle('active', t.dataset.period === state.reportPeriod);
        });
    }

    $$('.report-tab').forEach((tab) => {
        tab.addEventListener('click', () => {
            if (state.reportPeriod === tab.dataset.period) {
                // Toggle off: go back to day mode
                state.reportPeriod = 'day';
                state.reportOffset = 0;
            } else {
                state.reportPeriod = tab.dataset.period;
                state.reportOffset = 0;
            }
            updateReportTabs();
            renderReports();
        });
    });

    $('#report-range-apply').addEventListener('click', () => {
        const startVal = $('#report-range-start').value;
        const endVal = $('#report-range-end').value;
        if (!startVal || !endVal) {
            alert('Bitte Start- und Enddatum angeben.');
            return;
        }
        if (startVal > endVal) {
            alert('Startdatum muss vor dem Enddatum liegen.');
            return;
        }
        state.reportPeriod = 'custom';
        state.reportCustomStart = startVal;
        state.reportCustomEnd = endVal;
        updateReportTabs();
        renderReports();
    });

    $('#report-date').addEventListener('change', () => {
        state.reportPeriod = 'day';
        state.reportOffset = 0;
        updateReportTabs();
        renderReports();
    });

    $('#report-prev').addEventListener('click', () => {
        if (state.reportPeriod === 'day' || state.reportPeriod === 'custom') {
            const el = $('#report-date');
            const d = el.value ? new Date(el.value + 'T00:00:00') : new Date();
            d.setDate(d.getDate() - 1);
            el.value = fmtDate(d);
            state.reportPeriod = 'day';
            updateReportTabs();
        } else {
            state.reportOffset--;
        }
        renderReports();
    });

    $('#report-next').addEventListener('click', () => {
        if (state.reportPeriod === 'day' || state.reportPeriod === 'custom') {
            const el = $('#report-date');
            const d = el.value ? new Date(el.value + 'T00:00:00') : new Date();
            d.setDate(d.getDate() + 1);
            el.value = fmtDate(d);
            state.reportPeriod = 'day';
            updateReportTabs();
        } else {
            state.reportOffset++;
        }
        renderReports();
    });

    // Week arrows
    $('#report-week-prev').addEventListener('click', () => {
        state.reportPeriod = 'week';
        state.reportOffset--;
        updateReportTabs();
        renderReports();
    });
    $('#report-week-next').addEventListener('click', () => {
        state.reportPeriod = 'week';
        state.reportOffset++;
        updateReportTabs();
        renderReports();
    });

    // Month arrows
    $('#report-month-prev').addEventListener('click', () => {
        state.reportPeriod = 'month';
        state.reportOffset--;
        updateReportTabs();
        renderReports();
    });
    $('#report-month-next').addEventListener('click', () => {
        state.reportPeriod = 'month';
        state.reportOffset++;
        updateReportTabs();
        renderReports();
    });

    // Year arrows
    $('#report-year-prev').addEventListener('click', () => {
        state.reportPeriod = 'year';
        state.reportOffset--;
        updateReportTabs();
        renderReports();
    });
    $('#report-year-next').addEventListener('click', () => {
        state.reportPeriod = 'year';
        state.reportOffset++;
        updateReportTabs();
        renderReports();
    });

    function localDateStr(d) {
        return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    }

    function getReportRange() {
        if (state.reportPeriod === 'custom') {
            return { start: state.reportCustomStart, end: state.reportCustomEnd, label: `${state.reportCustomStart} – ${state.reportCustomEnd}` };
        }

        const now = new Date();
        let start, end, label;

        if (state.reportPeriod === 'day') {
            const dateVal = $('#report-date').value || localDateStr(now);
            start = dateVal;
            end = dateVal;
            const d = new Date(dateVal + 'T00:00:00');
            label = d.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
        } else if (state.reportPeriod === 'week') {
            const d = new Date(now);
            d.setDate(d.getDate() + state.reportOffset * 7);
            const day = d.getDay();
            const monday = new Date(d);
            monday.setDate(d.getDate() - ((day + 6) % 7));
            const sunday = new Date(monday);
            sunday.setDate(monday.getDate() + 6);
            start = localDateStr(monday);
            end = localDateStr(sunday);
            label = `KW ${getWeekNumber(monday)} – ${monday.toLocaleDateString('de-DE', { day: 'numeric', month: 'short' })} bis ${sunday.toLocaleDateString('de-DE', { day: 'numeric', month: 'short', year: 'numeric' })}`;
        } else if (state.reportPeriod === 'month') {
            const d = new Date(now.getFullYear(), now.getMonth() + state.reportOffset, 1);
            start = localDateStr(d);
            const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0);
            end = localDateStr(lastDay);
            label = d.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' });
        } else if (state.reportPeriod === 'year') {
            const year = now.getFullYear() + state.reportOffset;
            const d = new Date(year, 0, 1);
            const lastDay = new Date(year, 11, 31);
            start = localDateStr(d);
            end = localDateStr(lastDay);
            label = String(year);
        }
        return { start, end, label };
    }

    function getWeekNumber(d) {
        const date = new Date(d);
        date.setHours(0, 0, 0, 0);
        date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
        const week1 = new Date(date.getFullYear(), 0, 4);
        return 1 + Math.round(((date - week1) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7);
    }

    function renderReports() {
        const { start, end } = getReportRange();

        const entries = state.entries.filter((e) => e.date >= start && e.date <= end);

        $('#report-summary').innerHTML = `
            <div class="summary-card"><div class="label">Einträge</div><div class="value">${entries.length}</div></div>
        `;

        renderCharts(entries);
    }

    function renderCharts(entries) {
        const chartTextColor = '#333';
        const chartGridColor = '#d4c98a';

        // Bezugsperson / Bezugsobjekt chart (count)
        const projectData = {};
        entries.forEach((e) => {
            const proj = state.projects.find((p) => p.id === e.project);
            const name = proj ? proj.name : 'Ohne Bezugsperson';
            const color = proj ? proj.color : '#999';
            if (!projectData[name]) projectData[name] = { count: 0, color };
            projectData[name].count++;
        });

        if (chartProjects) chartProjects.destroy();
        const projLabels = Object.keys(projectData);
        chartProjects = new Chart($('#chart-projects'), {
            type: 'doughnut',
            data: {
                labels: projLabels,
                datasets: [{
                    data: projLabels.map((l) => projectData[l].count),
                    backgroundColor: projLabels.map((l) => projectData[l].color),
                    borderWidth: 0,
                }],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'bottom', labels: { color: chartTextColor, padding: 12 } },
                    tooltip: { callbacks: { label: (ctx) => `${ctx.label}: ${ctx.raw}` } },
                },
            },
        });

        // primärer Auslöser chart (count)
        const catData = {};
        entries.forEach((e) => {
            const cat = state.categories.find((c) => c.id === e.category);
            const name = cat ? cat.name : 'Ohne Auslöser';
            const color = cat ? cat.color : '#999';
            if (!catData[name]) catData[name] = { count: 0, color };
            catData[name].count++;
        });

        if (chartCategories) chartCategories.destroy();
        const catLabels = Object.keys(catData);
        chartCategories = new Chart($('#chart-categories'), {
            type: 'doughnut',
            data: {
                labels: catLabels,
                datasets: [{
                    data: catLabels.map((l) => catData[l].count),
                    backgroundColor: catLabels.map((l) => catData[l].color),
                    borderWidth: 0,
                }],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'bottom', labels: { color: chartTextColor, padding: 12 } },
                    tooltip: { callbacks: { label: (ctx) => `${ctx.label}: ${ctx.raw}` } },
                },
            },
        });

        // Trigger chart (count) – each trigger of an entry counted separately
        const trigData = {};
        entries.forEach((e) => {
            const trigIds = getEntryTriggers(e);
            if (trigIds.length === 0) {
                if (!trigData['Ohne Trigger']) trigData['Ohne Trigger'] = { count: 0, color: '#999' };
                trigData['Ohne Trigger'].count++;
            } else {
                trigIds.forEach((tid) => {
                    const trig = state.triggers.find((t) => t.id === tid);
                    const name = trig ? trig.name : 'Ohne Trigger';
                    const color = trig ? trig.color : '#999';
                    if (!trigData[name]) trigData[name] = { count: 0, color };
                    trigData[name].count++;
                });
            }
        });

        if (chartTriggers) chartTriggers.destroy();
        const trigLabels = Object.keys(trigData);
        chartTriggers = new Chart($('#chart-triggers'), {
            type: 'doughnut',
            data: {
                labels: trigLabels,
                datasets: [{
                    data: trigLabels.map((l) => trigData[l].count),
                    backgroundColor: trigLabels.map((l) => trigData[l].color),
                    borderWidth: 0,
                }],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'bottom', labels: { color: chartTextColor, padding: 12 } },
                    tooltip: { callbacks: { label: (ctx) => `${ctx.label}: ${ctx.raw}` } },
                },
            },
        });
    }

    // ── Search ──
    function populateMultiSelect(containerId, items, labelAll) {
        const container = $(`#${containerId}`);
        const dropdown = container.querySelector('.multi-select-dropdown');
        const toggle = container.querySelector('.multi-select-toggle');
        dropdown.innerHTML = items
            .map((item) => `<label class="multi-select-option">
                <input type="checkbox" value="${item.id}">
                <span class="color-dot" style="background:${item.color}"></span>
                ${escHtml(item.name)}
            </label>`)
            .join('');

        dropdown.addEventListener('click', (e) => e.stopPropagation());

        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            $$('.multi-select-dropdown').forEach((d) => {
                if (d !== dropdown) d.classList.remove('open');
            });
            dropdown.classList.toggle('open');
        });

        dropdown.addEventListener('change', () => {
            const checked = dropdown.querySelectorAll('input:checked');
            if (checked.length === 0) {
                toggle.textContent = labelAll;
            } else {
                const names = Array.from(checked).map((cb) => {
                    const item = items.find((i) => i.id === cb.value);
                    return item ? item.name : '';
                });
                toggle.textContent = names.join(', ');
            }
        });
    }

    function initSearchMultiSelects() {
        populateMultiSelect('search-project-select', state.projects, 'Bezugsperson / Bezugsobjekt');
        populateMultiSelect('search-category-select', state.categories, 'primärer Auslöser');
        populateMultiSelect('search-trigger-select', state.triggers, 'Trigger');
    }

    function getMultiSelectValues(containerId) {
        const checkboxes = $(`#${containerId}`).querySelectorAll('.multi-select-dropdown input:checked');
        return Array.from(checkboxes).map((cb) => cb.value);
    }

    function getSearchFiltered() {
        const query = $('#search-text').value.trim().toLowerCase();
        const selectedProjects = getMultiSelectValues('search-project-select');
        const selectedCategories = getMultiSelectValues('search-category-select');
        const selectedTriggers = getMultiSelectValues('search-trigger-select');

        let filtered = [...state.entries];

        if (query) {
            filtered = filtered.filter((e) => {
                const taskMatch = e.task.toLowerCase().includes(query);
                const tagMatch = (e.tags || []).some((t) => t.toLowerCase().includes(query));
                const descMatch = (e.description || '').toLowerCase().includes(query);
                return taskMatch || tagMatch || descMatch;
            });
        }

        if (selectedProjects.length > 0) {
            filtered = filtered.filter((e) => selectedProjects.includes(e.project));
        }

        if (selectedCategories.length > 0) {
            filtered = filtered.filter((e) => selectedCategories.includes(e.category));
        }

        if (selectedTriggers.length > 0) {
            filtered = filtered.filter((e) => getEntryTriggers(e).some((tid) => selectedTriggers.includes(tid)));
        }

        filtered.sort((a, b) => {
            const cmp = b.date.localeCompare(a.date);
            if (cmp !== 0) return cmp;
            return (b.timestamp || '').localeCompare(a.timestamp || '');
        });

        return { filtered, query, selectedProjects, selectedCategories, selectedTriggers };
    }

    function getSearchFilteredTips(query) {
        if (!query) return [];
        let filtered = [...state.tips];
        filtered = filtered.filter((tip) => {
            const titleMatch = tip.title.toLowerCase().includes(query);
            const tagMatch = (tip.tags || []).some((t) => t.toLowerCase().includes(query));
            const textMatch = (tip.text || '').toLowerCase().includes(query);
            return titleMatch || tagMatch || textMatch;
        });
        return sortTips(filtered);
    }

    function renderTipSearchResults(tips) {
        if (tips.length === 0) return '';
        return tips.map((tip) => {
            const numDisplay = (tip.number !== null && tip.number !== undefined && tip.number !== '')
                ? `<span class="tip-number">${escHtml(String(tip.number))}</span>` : '';
            const tagsHtml = (tip.tags || []).map((t) => `<span class="tag">${escHtml(t)}</span>`).join('');
            return `<div class="tip-card">
                <div class="tip-header">
                    <span class="tip-title">${escHtml(tip.title)}</span>
                    ${numDisplay}
                </div>
                ${tagsHtml ? `<div style="margin-top:4px">${tagsHtml}</div>` : ''}
                <div class="tip-text">${escHtml(tip.text)}</div>
            </div>`;
        }).join('');
    }

    function renderSearch() {
        const { filtered, query, selectedProjects, selectedCategories, selectedTriggers } = getSearchFiltered();

        const countEl = $('#search-result-count');
        const list = $('#search-results');
        const tipsList = $('#search-results-tips');

        const hasFilters = query || selectedProjects.length > 0 || selectedCategories.length > 0 || selectedTriggers.length > 0;

        if (!hasFilters) {
            countEl.textContent = '';
            list.innerHTML = '<div class="no-entries">Bitte Suchbegriff eingeben oder Filter wählen.</div>';
            tipsList.innerHTML = '';
            return;
        }

        // Tips are only searched by the text query
        const filteredTips = getSearchFilteredTips(query);
        const totalResults = filtered.length + filteredTips.length;

        countEl.textContent = `${totalResults} Ergebnis${totalResults !== 1 ? 'se' : ''} gefunden`;

        if (filtered.length === 0) {
            list.innerHTML = '';
        } else {
            list.innerHTML = filtered
                .map((e) => {
                    const proj = state.projects.find((p) => p.id === e.project);
                    const cat = state.categories.find((c) => c.id === e.category);
                    const trigIds = getEntryTriggers(e);
                    const tagsHtml = (e.tags || []).map((t) => `<span class="tag">${escHtml(t)}</span>`).join('');
                    const projBadge = proj ? `<span class="project-badge" style="background:${proj.color}22;color:${proj.color}">${escHtml(proj.name)}</span>` : '';
                    const catBadge = cat ? `<span class="category-badge" style="background:${cat.color}22;color:${cat.color}">${escHtml(cat.name)}</span>` : '';
                    const trigBadges = trigIds.map((tid) => {
                        const trig = state.triggers.find((t) => t.id === tid);
                        return trig ? `<span class="trigger-badge" style="background:${trig.color}22;color:${trig.color}">${escHtml(trig.name)}</span>` : '';
                    }).join('');
                    const descHtml = e.description ? `<div class="entry-description">${escHtml(e.description)}</div>` : '';
                    const insightsHtml = renderInsightsHtml(e.insights || []);

                    return `<div class="entry-card">
                        <div class="entry-info">
                            <div class="entry-task">${escHtml(e.task)}</div>
                            <div class="entry-meta">
                                <span>${e.date}</span>
                                ${projBadge}${catBadge}${trigBadges}
                            </div>
                            <div style="margin-top:4px">${tagsHtml}</div>
                            ${descHtml}
                            ${insightsHtml}
                        </div>
                    </div>`;
                })
                .join('');
        }

        tipsList.innerHTML = renderTipSearchResults(filteredTips);
    }

    $('#btn-search-reset').addEventListener('click', () => {
        location.hash = 'search';
        location.reload();
    });

    $('#btn-eingabe-reset').addEventListener('click', () => {
        location.hash = 'tracker';
        location.reload();
    });

    $('#btn-search-export').addEventListener('click', () => {
        const { filtered } = getSearchFiltered();
        if (filtered.length === 0) {
            alert('Keine Einträge zum Exportieren vorhanden.');
            return;
        }

        const sortedInsightsPerEntry = filtered.map((e) => sortInsights(e.insights || []));
        const maxInsights = sortedInsightsPerEntry.reduce((max, ins) => Math.max(max, ins.length), 0);
        const headers = ['Erfassungsdatum', 'Erfahrung', 'Bezugsperson/Bezugsobjekt', 'primärer Auslöser', 'Trigger', 'Tags', 'Beschreibung'];
        for (let i = 1; i <= maxInsights; i++) headers.push(`Erkenntnis ${i}`);
        const rows = filtered.map((e, idx) => {
            const proj = state.projects.find((p) => p.id === e.project);
            const cat = state.categories.find((c) => c.id === e.category);
            const trigNames = getEntryTriggers(e).map((tid) => {
                const t = state.triggers.find((tr) => tr.id === tid);
                return t ? t.name : '';
            }).filter(Boolean).join('; ');
            const row = [e.date, `"${e.task}"`, proj ? proj.name : '', cat ? cat.name : '', trigNames, (e.tags || []).join('; '), `"${(e.description || '').replace(/"/g, '""')}"`];
            const ins = sortedInsightsPerEntry[idx];
            for (let i = 0; i < maxInsights; i++) {
                const text = ins[i] ? ins[i].text : '';
                row.push(`"${text.replace(/"/g, '""')}"`);
            }
            return row;
        });

        const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
        const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const now = new Date();
        const timeStr = String(now.getHours()).padStart(2, '0') + '-' + String(now.getMinutes()).padStart(2, '0') + '-' + String(now.getSeconds()).padStart(2, '0');
        a.download = `erfahrungen_suche_${todayStr()}_${timeStr}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    });

    $('#btn-show-all').addEventListener('click', () => {
        const filtered = [...state.entries].sort((a, b) => {
            const cmp = b.date.localeCompare(a.date);
            if (cmp !== 0) return cmp;
            return (b.timestamp || '').localeCompare(a.timestamp || '');
        });
        const allTips = sortTips([...state.tips]);

        const countEl = $('#search-result-count');
        const list = $('#search-results');
        const tipsList = $('#search-results-tips');
        const totalCount = filtered.length + allTips.length;

        countEl.textContent = `${totalCount} Eintr${totalCount !== 1 ? 'äge' : 'ag'} gesamt`;

        if (filtered.length === 0) {
            list.innerHTML = '';
        } else {
            list.innerHTML = filtered
                .map((e) => {
                    const proj = state.projects.find((p) => p.id === e.project);
                    const cat = state.categories.find((c) => c.id === e.category);
                    const trigIds = getEntryTriggers(e);
                    const tagsHtml = (e.tags || []).map((t) => `<span class="tag">${escHtml(t)}</span>`).join('');
                    const projBadge = proj ? `<span class="project-badge" style="background:${proj.color}22;color:${proj.color}">${escHtml(proj.name)}</span>` : '';
                    const catBadge = cat ? `<span class="category-badge" style="background:${cat.color}22;color:${cat.color}">${escHtml(cat.name)}</span>` : '';
                    const trigBadges = trigIds.map((tid) => {
                        const trig = state.triggers.find((t) => t.id === tid);
                        return trig ? `<span class="trigger-badge" style="background:${trig.color}22;color:${trig.color}">${escHtml(trig.name)}</span>` : '';
                    }).join('');
                    const descHtml = e.description ? `<div class="entry-description">${escHtml(e.description)}</div>` : '';
                    const insightsHtml = renderInsightsHtml(e.insights || []);

                    return `<div class="entry-card">
                        <div class="entry-info">
                            <div class="entry-task">${escHtml(e.task)}</div>
                            <div class="entry-meta">
                                <span>${e.date}</span>
                                ${projBadge}${catBadge}${trigBadges}
                            </div>
                            <div style="margin-top:4px">${tagsHtml}</div>
                            ${descHtml}
                            ${insightsHtml}
                        </div>
                    </div>`;
                })
                .join('');
        }

        tipsList.innerHTML = renderTipSearchResults(allTips);
    });

    $('#btn-search').addEventListener('click', renderSearch);
    $('#btn-search-top').addEventListener('click', renderSearch);
    $('#btn-search-reset-top').addEventListener('click', () => {
        location.hash = 'search';
        location.reload();
    });
    $('#search-text').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') renderSearch();
    });

    document.addEventListener('click', () => {
        $$('.multi-select-dropdown').forEach((d) => d.classList.remove('open'));
    });

    // ── Settings ──
    function renderSettings() {
        renderSettingsList('project');
        renderSettingsList('category');
        renderSettingsList('trigger');
        renderSettingsTips();
    }

    function renderSettingsList(type) {
        const items = type === 'project' ? state.projects : type === 'category' ? state.categories : state.triggers;
        const listEl = $(`#${type}-list`);
        listEl.innerHTML = items
            .map(
                (item) => `<div class="settings-item" id="item-${item.id}">
                <span class="color-dot" style="background:${item.color}"></span>
                <span class="name">${escHtml(item.name)}</span>
                <div class="settings-item-actions">
                    <button onclick="app.editItem('${type}','${item.id}')">Bearbeiten</button>
                    <button onclick="app.deleteItem('${type}','${item.id}')">Löschen</button>
                </div>
            </div>`
            )
            .join('');
    }

    $('#btn-add-project').addEventListener('click', () => {
        const name = $('#new-project').value.trim();
        if (!name) return;
        state.projects.push({ id: uid(), name, color: $('#new-project-color').value });
        state.projects.sort((a, b) => a.name.localeCompare(b.name, 'de'));
        save();
        $('#new-project').value = '';
        populateSelects();
        renderSettings();
    });

    $('#btn-add-category').addEventListener('click', () => {
        const name = $('#new-category').value.trim();
        if (!name) return;
        state.categories.push({ id: uid(), name, color: $('#new-category-color').value });
        state.categories.sort((a, b) => a.name.localeCompare(b.name, 'de'));
        save();
        $('#new-category').value = '';
        populateSelects();
        renderSettings();
    });

    $('#btn-add-trigger').addEventListener('click', () => {
        const name = $('#new-trigger').value.trim();
        if (!name) return;
        state.triggers.push({ id: uid(), name, color: $('#new-trigger-color').value });
        state.triggers.sort((a, b) => a.name.localeCompare(b.name, 'de'));
        save();
        $('#new-trigger').value = '';
        populateSelects();
        renderSettings();
    });

    // ── Data Management ──
    $('#btn-export-all').addEventListener('click', () => {
        const data = { entries: state.entries, projects: state.projects, categories: state.categories, triggers: state.triggers, tips: state.tips };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const now = new Date();
        const timeStr = String(now.getHours()).padStart(2, '0') + '-' + String(now.getMinutes()).padStart(2, '0') + '-' + String(now.getSeconds()).padStart(2, '0');
        a.download = `erfahrungen_backup_${todayStr()}_${timeStr}.json`;
        a.click();
        URL.revokeObjectURL(url);
    });

    $('#btn-import').addEventListener('click', () => $('#import-file').click());

    $('#import-file').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const data = JSON.parse(ev.target.result);
                if (data.entries) state.entries = data.entries;
                if (data.projects) state.projects = data.projects;
                if (data.categories) state.categories = data.categories;
                if (data.triggers) state.triggers = data.triggers;
                if (data.tips) state.tips = data.tips;
                save();
                populateSelects();
                alert('Daten erfolgreich importiert!');
            } catch {
                alert('Fehler beim Import. Ungültige Datei.');
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    });

    $('#btn-clear-data').addEventListener('click', () => {
        if (confirm('Wirklich ALLE Daten löschen? Dies kann nicht rückgängig gemacht werden!')) {
            state.entries = [];
            save();
            renderEntries();
            alert('Alle Erfahrungen wurden gelöscht.');
        }
    });

    // ── Global API for inline handlers ──
    let editingEntryId = null;

    function openEditModal(entry) {
        editingEntryId = entry.id;
        const modal = $('#edit-modal');

        const projSel = $('#edit-project');
        projSel.innerHTML = '<option value="">-- Bezugsperson / Bezugsobjekt wählen --</option>';
        state.projects.forEach((p) => {
            projSel.innerHTML += `<option value="${p.id}">${escHtml(p.name)}</option>`;
        });

        const catSel = $('#edit-category');
        catSel.innerHTML = '<option value="">-- primärer Auslöser wählen --</option>';
        state.categories.forEach((c) => {
            catSel.innerHTML += `<option value="${c.id}">${escHtml(c.name)}</option>`;
        });

        populateInlineTriggerSelect('edit-trigger-select', '-- meine Trigger wählen --', getEntryTriggers(entry));

        $('#edit-task').value = entry.task;
        projSel.value = entry.project;
        catSel.value = entry.category;
        $('#edit-tags').value = (entry.tags || []).join(', ');
        $('#edit-description').value = entry.description || '';
        clearInsights('edit-insights');
        const ins = entry.insights || [];
        if (ins.length === 0) {
            addInsightRow('edit-insights', '', null);
        } else {
            ins.forEach((i) => {
                const text = typeof i === 'string' ? i : i.text;
                const sortOrder = typeof i === 'string' ? null : i.sortOrder;
                addInsightRow('edit-insights', text, sortOrder);
            });
        }
        $('#edit-date').value = entry.date;

        modal.hidden = false;
    }

    $('#btn-add-edit-insight').addEventListener('click', () => {
        addInsightRow('edit-insights', '', null);
    });

    $('#edit-save').addEventListener('click', () => {
        const task = $('#edit-task').value.trim();
        if (!task) {
            alert('Bitte eine Erfahrung eingeben.');
            return;
        }
        const date = $('#edit-date').value || todayStr();

        const entry = state.entries.find((e) => e.id === editingEntryId);
        if (!entry) return;

        entry.task = task;
        entry.project = $('#edit-project').value;
        entry.category = $('#edit-category').value;
        entry.triggers = getInlineTriggerValues('edit-trigger-select');
        delete entry.trigger;
        entry.tags = $('#edit-tags').value.split(',').map((t) => t.trim()).filter(Boolean);
        entry.description = $('#edit-description').value.trim();
        entry.insights = getInsightValues('edit-insights');
        entry.date = date;
        entry.timestamp = new Date().toISOString();

        save();
        $('#edit-modal').hidden = true;
        editingEntryId = null;
        renderEntries();
    });

    $('#edit-cancel').addEventListener('click', () => {
        $('#edit-modal').hidden = true;
        editingEntryId = null;
    });

    $('#edit-modal').addEventListener('click', (e) => {
        if (e.target === $('#edit-modal')) {
            $('#edit-modal').hidden = true;
            editingEntryId = null;
        }
    });

    window.app = {
        editEntry(id) {
            const entry = state.entries.find((e) => e.id === id);
            if (!entry) return;
            openEditModal(entry);
        },
        deleteEntry(id) {
            if (!confirm('Eintrag löschen?')) return;
            state.entries = state.entries.filter((e) => e.id !== id);
            save();
            renderEntries();
        },
        deleteItem(type, id) {
            if (!confirm('Wirklich löschen?')) return;
            if (type === 'project') {
                state.projects = state.projects.filter((p) => p.id !== id);
            } else if (type === 'category') {
                state.categories = state.categories.filter((c) => c.id !== id);
            } else {
                state.triggers = state.triggers.filter((t) => t.id !== id);
            }
            save();
            populateSelects();
            renderSettings();
        },
        editItem(type, id) {
            const items = type === 'project' ? state.projects : type === 'category' ? state.categories : state.triggers;
            const item = items.find((i) => i.id === id);
            if (!item) return;
            const el = $(`#item-${id}`);
            el.classList.add('editing');
            el.innerHTML = `
                <input type="color" class="edit-color" value="${item.color}">
                <input type="text" class="edit-name" value="${escHtml(item.name)}">
                <div class="settings-item-actions">
                    <button class="btn-save" onclick="app.saveItem('${type}','${id}')">Speichern</button>
                    <button onclick="app.cancelEdit()">Abbrechen</button>
                </div>
            `;
            el.querySelector('.edit-name').focus();
            el.querySelector('.edit-name').addEventListener('keydown', (e) => {
                if (e.key === 'Enter') app.saveItem(type, id);
                if (e.key === 'Escape') app.cancelEdit();
            });
        },
        saveItem(type, id) {
            const el = $(`#item-${id}`);
            const newName = el.querySelector('.edit-name').value.trim();
            if (!newName) return;
            const newColor = el.querySelector('.edit-color').value;
            const items = type === 'project' ? state.projects : type === 'category' ? state.categories : state.triggers;
            const item = items.find((i) => i.id === id);
            if (!item) return;
            item.name = newName;
            item.color = newColor;
            items.sort((a, b) => a.name.localeCompare(b.name, 'de'));
            save();
            populateSelects();
            renderSettings();
        },
        cancelEdit() {
            renderSettings();
        },
        editTip(id) {
            const tip = state.tips.find((t) => t.id === id);
            if (!tip) return;
            const el = $(`#tip-${id}`);
            el.classList.add('editing');
            el.innerHTML = `
                <div class="tip-edit-form">
                    <div class="tip-edit-row">
                        <input type="text" class="edit-tip-title" value="${escHtml(tip.title)}" placeholder="Überschrift...">
                        <input type="number" class="edit-tip-number tip-number-input" value="${tip.number !== null && tip.number !== undefined && tip.number !== '' ? tip.number : ''}" placeholder="Nr." min="1" step="1">
                    </div>
                    <input type="text" class="edit-tip-tags" value="${escHtml((tip.tags || []).join(', '))}" placeholder="Tags (kommagetrennt)">
                    <textarea class="edit-tip-text" rows="3" placeholder="Text...">${escHtml(tip.text)}</textarea>
                    <div class="tip-actions">
                        <button onclick="app.saveTip('${id}')">Speichern</button>
                        <button onclick="app.cancelTipEdit()">Abbrechen</button>
                    </div>
                </div>`;
            el.querySelector('.edit-tip-title').focus();
        },
        saveTip(id) {
            const el = $(`#tip-${id}`);
            const title = el.querySelector('.edit-tip-title').value.trim();
            if (!title) { alert('Bitte eine Überschrift eingeben.'); return; }
            const text = el.querySelector('.edit-tip-text').value.trim();
            const numVal = el.querySelector('.edit-tip-number').value.trim();
            const number = numVal !== '' ? parseInt(numVal, 10) : null;
            if (numVal !== '' && (isNaN(number) || number < 1)) { alert('Bitte eine positive ganze Zahl eingeben.'); return; }
            const tip = state.tips.find((t) => t.id === id);
            if (!tip) return;
            tip.title = title;
            tip.text = text;
            tip.number = number;
            tip.tags = el.querySelector('.edit-tip-tags').value.split(',').map((t) => t.trim()).filter(Boolean);
            save();
            renderTips();
        },
        cancelTipEdit() {
            renderTips();
        },
        deleteTip(id) {
            if (!confirm('Tipp löschen?')) return;
            state.tips = state.tips.filter((t) => t.id !== id);
            save();
            renderTips();
        },
        editSettingsTip(id) {
            const tip = state.tips.find((t) => t.id === id);
            if (!tip) return;
            const el = $(`#settings-tip-${id}`);
            el.classList.add('editing');
            el.innerHTML = `
                <div class="settings-tip-edit-form">
                    <input type="text" class="edit-tip-title" value="${escHtml(tip.title)}" placeholder="Überschrift...">
                    <input type="number" class="edit-tip-number tip-number-input" value="${tip.number !== null && tip.number !== undefined && tip.number !== '' ? tip.number : ''}" placeholder="Nr." min="1" step="1">
                    <input type="text" class="edit-tip-tags" value="${escHtml((tip.tags || []).join(', '))}" placeholder="Tags (kommagetrennt)">
                    <textarea class="edit-tip-text" rows="2" placeholder="Text...">${escHtml(tip.text)}</textarea>
                    <div class="settings-item-actions">
                        <button class="btn-save" onclick="app.saveSettingsTip('${id}')">Speichern</button>
                        <button onclick="app.cancelSettingsTipEdit()">Abbrechen</button>
                    </div>
                </div>`;
            el.querySelector('.edit-tip-title').focus();
        },
        saveSettingsTip(id) {
            const el = $(`#settings-tip-${id}`);
            const title = el.querySelector('.edit-tip-title').value.trim();
            if (!title) return;
            const text = el.querySelector('.edit-tip-text').value.trim();
            const numVal = el.querySelector('.edit-tip-number').value.trim();
            const number = numVal !== '' ? parseInt(numVal, 10) : null;
            if (numVal !== '' && (isNaN(number) || number < 1)) { alert('Bitte eine positive ganze Zahl eingeben.'); return; }
            const tip = state.tips.find((t) => t.id === id);
            if (!tip) return;
            tip.title = title;
            tip.text = text;
            tip.number = number;
            tip.tags = el.querySelector('.edit-tip-tags').value.split(',').map((t) => t.trim()).filter(Boolean);
            save();
            renderSettingsTips();
        },
        cancelSettingsTipEdit() {
            renderSettingsTips();
        },
        deleteSettingsTip(id) {
            if (!confirm('Tipp löschen?')) return;
            state.tips = state.tips.filter((t) => t.id !== id);
            save();
            renderSettingsTips();
        },
    };

    // ── Tipps ──
    function sortTips(tips) {
        const withNum = tips.filter((t) => t.number !== null && t.number !== undefined && t.number !== '');
        const withoutNum = tips.filter((t) => t.number === null || t.number === undefined || t.number === '');
        withNum.sort((a, b) => {
            const numDiff = Number(a.number) - Number(b.number);
            if (numDiff !== 0) return numDiff;
            return (b.timestamp || '').localeCompare(a.timestamp || '');
        });
        withoutNum.sort((a, b) => (b.timestamp || '').localeCompare(a.timestamp || ''));
        return [...withNum, ...withoutNum];
    }

    function renderTips() {
        const sorted = sortTips([...state.tips]);
        const toc = $('#tips-toc');
        const list = $('#tips-list');
        if (sorted.length === 0) {
            toc.innerHTML = '';
            list.innerHTML = '<div class="no-entries">Keine Tipps vorhanden.</div>';
            return;
        }
        toc.innerHTML = '<ul class="tips-toc-list">' + sorted.map((tip) => {
            const numPrefix = (tip.number !== null && tip.number !== undefined && tip.number !== '')
                ? `<span class="tip-toc-number">${escHtml(String(tip.number))}.</span> ` : '';
            return `<li><a href="#tip-${tip.id}" class="tip-toc-link">${numPrefix}${escHtml(tip.title)}</a></li>`;
        }).join('') + '</ul>';
        list.innerHTML = sorted.map((tip) => {
            const numDisplay = (tip.number !== null && tip.number !== undefined && tip.number !== '')
                ? `<span class="tip-number">${escHtml(String(tip.number))}</span>` : '';
            const tagsHtml = (tip.tags || []).map((t) => `<span class="tag">${escHtml(t)}</span>`).join('');
            return `<div class="tip-card" id="tip-${tip.id}">
                <div class="tip-header">
                    <span class="tip-title">${escHtml(tip.title)}</span>
                    ${numDisplay}
                </div>
                ${tagsHtml ? `<div style="margin-top:4px">${tagsHtml}</div>` : ''}
                <div class="tip-text">${escHtml(tip.text)}</div>
                <div class="tip-actions">
                    <button onclick="app.editTip('${tip.id}')">Bearbeiten</button>
                    <button onclick="app.deleteTip('${tip.id}')">Löschen</button>
                </div>
            </div>`;
        }).join('');
    }

    // Settings: Tipps management
    function renderSettingsTips() {
        const sorted = sortTips([...state.tips]);
        const listEl = $('#settings-tips-list');
        listEl.innerHTML = sorted.map((tip) => {
            const numDisplay = (tip.number !== null && tip.number !== undefined && tip.number !== '')
                ? ` [${tip.number}]` : '';
            const tagsHtml = (tip.tags || []).map((t) => `<span class="tag">${escHtml(t)}</span>`).join('');
            return `<div class="settings-item" id="settings-tip-${tip.id}">
                <span class="name">${escHtml(tip.title)}${numDisplay}${tagsHtml ? ' ' + tagsHtml : ''}</span>
                <div class="settings-item-actions">
                    <button onclick="app.editSettingsTip('${tip.id}')">Bearbeiten</button>
                    <button onclick="app.deleteSettingsTip('${tip.id}')">Löschen</button>
                </div>
            </div>`;
        }).join('');
    }

    $('#btn-settings-add-tip').addEventListener('click', () => {
        const title = $('#settings-new-tip-title').value.trim();
        if (!title) return;
        const text = $('#settings-new-tip-text').value.trim();
        const numVal = $('#settings-new-tip-number').value.trim();
        const number = numVal !== '' ? parseInt(numVal, 10) : null;
        if (numVal !== '' && (isNaN(number) || number < 1)) { alert('Bitte eine positive ganze Zahl eingeben.'); return; }
        const tags = $('#settings-new-tip-tags').value.split(',').map((t) => t.trim()).filter(Boolean);
        state.tips.push({ id: uid(), title, number, text: text || '', tags, timestamp: new Date().toISOString() });
        save();
        $('#settings-new-tip-title').value = '';
        $('#settings-new-tip-number').value = '';
        $('#settings-new-tip-tags').value = '';
        $('#settings-new-tip-text').value = '';
        renderSettingsTips();
    });

    // ── Init ──
    load();
    populateSelects();
    $('#filter-date').value = todayStr();

    if (location.hash === '#search') {
        location.hash = '';
        $$('.nav-btn').forEach((b) => b.classList.remove('active'));
        $$('.view').forEach((v) => v.classList.remove('active'));
        $('[data-view="search"]').classList.add('active');
        $('#search').classList.add('active');
        initSearchMultiSelects();
    } else if (location.hash === '#entries') {
        location.hash = '';
        $$('.nav-btn').forEach((b) => b.classList.remove('active'));
        $$('.view').forEach((v) => v.classList.remove('active'));
        $('[data-view="entries"]').classList.add('active');
        $('#entries').classList.add('active');
        renderEntries();
    }
})();
