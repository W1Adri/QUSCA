/* =====================================================================
   ACSAR — internationalisation (CA · EN · ES)
   Single source of truth for all copy. HTML is seeded in Catalan for
   no-JS / first paint; this dictionary drives every language switch.
   ===================================================================== */
(function () {
  "use strict";

  var I18N = {
    /* =================================================== CATALÀ */
    ca: {
      "meta.title": "ACSAR · Associació de Comunicacions Satel·litals Avançades i Resilients",
      "meta.desc": "Fundem una associació a la UPC per dissenyar un CubeSat de distribució quàntica de claus —BB84 amb decoy states— i fer-lo volar amb l'Agència Espacial Europea.",

      "nav.skip": "Salta al contingut",
      "nav.mission": "Missió",
      "nav.tech": "Tecnologia",
      "nav.why": "Per què ara",
      "nav.roadmap": "Full de ruta",
      "nav.join": "Uneix-t'hi",
      "nav.cta": "Uneix-t'hi",

      "hero.eyebrow": "UPC · EETAC — Comunicacions espacials quàntiques",
      "hero.title": "Comunicacions <span class=\"grad\">impossibles d'espiar</span>, des de l'espai.",
      "hero.sub": "Fundem una associació de comunicacions per satèl·lit a la UPC per dissenyar un CubeSat que distribueix claus de xifratge sobre fotons individuals —BB84 amb decoy states— i fer-lo volar amb l'Agència Espacial Europea.",
      "hero.cta1": "Explora la missió",
      "hero.cta2": "Uneix-te a l'equip →",
      "hero.clockLabel": "Termini ESA Design Booster 3",
      "hero.clockTarget": "2 oct 2026 · 13:00 CEST",
      "hero.gsTag": "Estació òptica · Barcelona",
      "hero.basesLabel": "Bases de polarització BB84",
      "hero.scroll": "Desplaça",

      "plan.eyebrow": "El pla",
      "plan.title": "Tres moviments, un sol objectiu",
      "plan.c1t": "Fundar l'associació",
      "plan.c1b": "Una associació d'estudiants a la UPC centrada en comunicacions per satèl·lit: ens dóna identitat legal, accés a laboratoris, finançament i un nom sota el qual reclutar.",
      "plan.c2t": "Dissenyar un CubeSat quàntic",
      "plan.c2b": "Un CubeSat 6U que fa distribució quàntica de claus —BB84 amb decoy states—. Adoptem la classe 6U, el mínim viable ja provat internacionalment, i aspirem a ser el primer CubeSat QKD acadèmic de l'Estat espanyol.",
      "plan.c3t": "Portar-lo a l'ESA",
      "plan.c3b": "Presentar-lo al Fly Your Satellite! Design Booster de l'ESA: 1,5 anys de mentoria experta, instal·lacions de prova i la rampa cap a un llançament patrocinat.",

      "mission.eyebrow": "La missió",
      "mission.title": "Una clau secreta, escrita amb fotons",
      "mission.p1": "La distribució quàntica de claus (QKD) envia una clau de xifratge codificada en fotons individuals. Les lleis de la física garanteixen que qualsevol espia és detectat: la seguretat no depèn d'un problema matemàtic difícil, així que cap ordinador quàntic futur la podrà trencar.",
      "mission.protoK": "Protocol",
      "mission.protoV": "BB84 (Bennett & Brassard) + mètode decoy-state — el cavall de batalla de la QKD pràctica al món real.",
      "mission.statesCap": "Quatre estats de polarització · dues bases. Cada fotó porta un bit; mesurar amb la base equivocada el destrueix.",
      "mission.f1t": "La QKD més fàcil de construir",
      "mission.f1b": "Fa servir un làser de polsos coherents febles (WCP), no una fràgil font de fotons entrellaçats.",
      "mission.f2t": "Els decoy states tanquen l'escletxa",
      "mission.f2b": "Neutralitzen els atacs de divisió del nombre de fotons (PNS) i restauren la seguretat completa amb un làser senzill.",
      "mission.f3t": "Cap en un CubeSat 6U",
      "mission.f3b": "Càrrega quàntica + terminal òptic en ~1–2U; la resta és plataforma — la classe 6U que busquem per al Design Booster.",
      "mission.f4t": "Components ja volats en òrbita",
      "mission.f4b": "Els components clau de la QKD ja han volat en CubeSats (QUBE-I, 2024). Adaptem una recepta en desenvolupament, no en partim de zero.",

      "feas.eyebrow": "Viabilitat",
      "feas.title": "Risc d'enginyeria, no de física",
      "feas.intro": "QUBE-I, un CubeSat 3U alemany, es va llançar en un Falcon 9 l'agost de 2024 i va demostrar en òrbita els components clau de la QKD —un generador quàntic de nombres aleatoris i fonts BB84—, tot i que la seva petita obertura no li permet tancar clau segura. El seu successor, QUBE-II (8U), va volar el maig de 2026. El britànic ROKS aposta, com nosaltres, per la classe 6U.",
      "feas.s1": "La classe que adoptem — el mínim viable ja provat internacionalment (ROKS)",
      "feas.s2": "Òrbita LEO objectiu — enllaç descendent (downlink) satèl·lit→Terra",
      "feas.s3": "QUBE-I en òrbita — primer pathfinder de components QKD en un CubeSat",
      "feas.s4": "CubeSats que han tancat clau QKD segura en òrbita — a data de juliol de 2026. El repte segueix obert.",
      "feas.note": "Pot un equip universitari dissenyar un CubeSat de QKD? Els precedents diuen que la classe 6U és viable, i la UPC ja ha dissenyat i volat plataformes 6U amb el seu NanoSat Lab (³Cat-2). El nostre risc és d'enginyeria, no de física — i cap CubeSat ha tancat encara clau segura en òrbita.",

      "contrib.eyebrow": "La nostra aportació",
      "contrib.title": "No copiem QUBE — l'anem més enllà",
      "contrib.intro": "L'ESA puntua els «objectius de missió» i la «novetat». Una simple repetició no guanya; aquí és on viuen la recerca real i els treballs de fi de grau.",
      "contrib.c1t": "Millor enllaç òptic",
      "contrib.c1b": "Un telescopi / obertura més gran per millorar el balanç de l'enllaç descendent i la taxa de clau.",
      "contrib.c2t": "Sistema PAT",
      "contrib.c2b": "Apuntament, adquisició i seguiment més precisos — el subsistema decisiu de qualsevol CubeSat de QKD.",
      "contrib.c3t": "Òptica i components millorats",
      "contrib.c3b": "Substituir, provar i caracteritzar components òptics alternatius i la font de decoy states.",
      "contrib.c4t": "Miniaturització",
      "contrib.c4b": "Reduir la càrrega quàntica — cap a unitats més petites, barates i replicables.",
      "contrib.c5t": "Optimització de decoy states",
      "contrib.c5b": "Ajustar intensitats i paràmetres del protocol al canal LEO per maximitzar la clau segura.",
      "contrib.c6t": "Espai per a idees noves",
      "contrib.c6b": "Cada fase obre subproblemes nous: imatge, deixalla espacial, comunicacions òptiques clàssiques, RF.",

      "why.eyebrow": "Per què ara",
      "why.title": "Europa està invertint exactament en això",
      "why.intro": "La comunicació quàntica segura és una prioritat estratègica de la UE. El vent bufa a favor: finançadors, professors i l'ESA volen estar associats a aquest camp ara mateix.",
      "why.c1b": "La UE i l'ESA construeixen una xarxa quàntica segura als 27 estats membres — un segment terrestre i un de satèl·lit.",
      "why.c2b": "Eagle-1 (SES/ESA) —que no és un CubeSat— serà el primer sistema QKD europeu end-to-end operatiu, amb llançament previst per a finals de 2027 / principis de 2028; sota IRIS² i EuroQCI es preparen més missions QKD.",
      "why.c3k": "Estació òptica a Barcelona",
      "why.c3b": "IberianQCI munta estacions òptiques a Madrid, Barcelona i el sud de Portugal — un possible objectiu d'enllaç a tocar de casa.",
      "why.c4k": "Catalunya, hub quàntic",
      "why.c4b": "La «Vall Mediterrània Quàntica» + l'Acadèmia Quàntica de Catalunya (ICFO, UPC, CTTC, UAB, UB…) — els nostres aliats són aquí mateix.",

      "prog.eyebrow": "El programa",
      "prog.title": "ESA Fly Your Satellite! Design Booster 3",
      "prog.intro": "Un programa de l'ESA Education per a equips universitaris amb un disseny preliminar de CubeSat. Calendari fix d'1,5 anys: experts de l'ESA revisen el teu disseny, n'implementes el feedback i el consolides. Pensat per a equips amb poca experiència — exactament el nostre perfil. «No cal cap compromís de finançament per entrar al programa.»",
      "prog.t1t": "Ara — construir l'equip",
      "prog.t1b": "Convocatòria oberta. Formem l'equip i redactem la proposta.",
      "prog.t2t": "Termini de proposta",
      "prog.t2b": "Proposta de satèl·lit + carta d'aval. 13:00 CEST — cada setmana compta.",
      "prog.t3t": "Setmana de formació",
      "prog.t3b": "Presencial a l'ESTEC per als equips preseleccionats.",
      "prog.t4t": "Taller de selecció",
      "prog.t4b": "Defensem el disseny; els equips escollits entren al programa.",
      "prog.t5t": "Baseline Design Review",
      "prog.t5b": "Implementem el feedback i consolidem el disseny.",
      "prog.t6t": "Revisió final",
      "prog.t6b": "Disseny madur i consolidat (maig–juny 2028) — i la rampa cap a un llançament patrocinat.",

      "score.eyebrow": "Per què ens poden seleccionar",
      "score.title": "Les nostres forces, sobre la rúbrica de l'ESA",
      "score.b1n": "Qualitat & Missió",
      "score.b1d": "Una missió quàntica de viabilitat provada, amb novetat clara i l'angle de ser el primer CubeSat QKD acadèmic de l'Estat espanyol.",
      "score.b2n": "Retorn educatiu",
      "score.b2d": "TFGs, articles i un equip multidisciplinari aprenent enginyeria espacial real.",
      "score.b3n": "Equip & Organització",
      "score.b3d": "UPC + l'herència del NanoSat Lab + els experts quàntics del CTTC al darrere.",
      "score.tie": "Avantatge de desempat: els equips nous tenen prioritat sobre els que ja participen en un programa de l'ESA — això som nosaltres.",

      "allies.eyebrow": "Aliats i equip",
      "allies.title": "La credibilitat guanya seleccions",
      "allies.intro": "El tracte que oferim als experts: coautoria dels articles que publiquem a canvi d'accés a laboratoris, mentoria i, quan sigui possible, una part del pressupost.",
      "allies.a1": "Llar institucional, laboratoris, finançament i el professor avalador. Propietària del satèl·lit.",
      "allies.a2": "Herència CubeSat real de la UPC, inclosa la plataforma 6U ³Cat-2. Mentors ideals — coordinar, no xocar.",
      "allies.a3": "Experts en QKD a Castelldefels (projectes Telefónica, LuxQuanta) + Acadèmia Quàntica.",
      "allies.a4": "Fotònica i òptica quàntica de primer nivell mundial; coordina l'Acadèmia Quàntica de Catalunya.",
      "allies.a5": "Modelització, simulació i múscul de computació quàntica per a la feina d'anàlisi.",

      "join.eyebrow": "Uneix-t'hi",
      "join.title": "Construeix un satèl·lit que vola en un coet europeu — mentre encara ets estudiant.",
      "join.sub": "Busquem 6+ membres de totes les disciplines: ADCS, òptica, potència, programari, estructures, i també gestió i dret. Hi ha un TFG real i volable esperant-te.",
      "join.cta1": "Escriu-nos",
      "join.cta2": "Torna a la missió",
      "join.contactLabel": "Contacte",

      "foot.tagline": "Associació de Comunicacions Satel·litals Avançades i Resilients · UPC EETAC",
      "foot.deadline": "Termini ESA DB3",
      "foot.made": "Fet a Castelldefels · UPC EETAC"
    },

    /* =================================================== ENGLISH */
    en: {
      "meta.title": "ACSAR · Advanced and Resilient Satellite Communications Association",
      "meta.desc": "We're founding an association at UPC to design a quantum-key-distribution CubeSat —BB84 with decoy states— and fly it with the European Space Agency.",

      "nav.skip": "Skip to content",
      "nav.mission": "Mission",
      "nav.tech": "Technology",
      "nav.why": "Why now",
      "nav.roadmap": "Roadmap",
      "nav.join": "Join us",
      "nav.cta": "Join us",

      "hero.eyebrow": "UPC · EETAC — Quantum Space Communications",
      "hero.title": "Communications <span class=\"grad\">impossible to wiretap</span>, from space.",
      "hero.sub": "We're founding a satellite-communications association at UPC to design a CubeSat that distributes encryption keys on single photons —BB84 with decoy states— and fly it with the European Space Agency.",
      "hero.cta1": "Explore the mission",
      "hero.cta2": "Join the team →",
      "hero.clockLabel": "ESA Design Booster 3 deadline",
      "hero.clockTarget": "2 Oct 2026 · 13:00 CEST",
      "hero.gsTag": "Optical ground station · Barcelona",
      "hero.basesLabel": "BB84 polarisation bases",
      "hero.scroll": "Scroll",

      "plan.eyebrow": "The plan",
      "plan.title": "Three moves, one goal",
      "plan.c1t": "Found the association",
      "plan.c1b": "A UPC student association focused on satellite communications: it gives us legal identity, access to labs, funding and a banner to recruit under.",
      "plan.c2t": "Design a quantum CubeSat",
      "plan.c2b": "A 6U CubeSat doing quantum key distribution —BB84 with decoy states—. We adopt the 6U class, the minimum viable size already proven internationally, aiming to be Spain's first academic QKD CubeSat.",
      "plan.c3t": "Take it to ESA",
      "plan.c3b": "Submit it to ESA's Fly Your Satellite! Design Booster: 1.5 years of expert mentoring, test facilities, and the on-ramp to a sponsored launch.",

      "mission.eyebrow": "The mission",
      "mission.title": "A secret key, written in photons",
      "mission.p1": "Quantum key distribution (QKD) sends an encryption key encoded on single photons. The laws of physics guarantee that any eavesdropper is detected: security doesn't depend on a hard maths problem, so no future quantum computer can break it.",
      "mission.protoK": "Protocol",
      "mission.protoV": "BB84 (Bennett & Brassard) + decoy-state method — the workhorse of practical, real-world QKD.",
      "mission.statesCap": "Four polarisation states · two bases. Each photon carries one bit; measuring in the wrong basis destroys it.",
      "mission.f1t": "The easiest QKD to build",
      "mission.f1b": "It uses a weak-coherent-pulse (WCP) laser, not a fragile entangled-photon source.",
      "mission.f2t": "Decoy states close the loophole",
      "mission.f2b": "They defeat photon-number-splitting (PNS) attacks and restore full security with a simple laser.",
      "mission.f3t": "Fits a 6U CubeSat",
      "mission.f3b": "Quantum payload + optical terminal in ~1–2U; the rest is platform — the 6U class we target for the Design Booster.",
      "mission.f4t": "Components already flown",
      "mission.f4b": "The key QKD components have already flown on CubeSats (QUBE-I, 2024). We adapt a recipe in development rather than starting from scratch.",

      "feas.eyebrow": "Feasibility",
      "feas.title": "Engineering risk, not physics",
      "feas.intro": "QUBE-I, a German 3U CubeSat, launched on a Falcon 9 in August 2024 and demonstrated the key QKD components in orbit —a quantum random number generator and BB84 sources—, though its small aperture can't close a secure key. Its successor, QUBE-II (8U), flew in May 2026. The UK's ROKS backs the 6U class, just like us.",
      "feas.s1": "The class we adopt — the minimum viable size already proven internationally (ROKS)",
      "feas.s2": "Target LEO orbit — satellite→ground downlink",
      "feas.s3": "QUBE-I in orbit — the first QKD-component pathfinder on a CubeSat",
      "feas.s4": "CubeSats that have closed a secure QKD key in orbit — as of July 2026. The milestone is still open.",
      "feas.note": "Can a university team design a QKD CubeSat? Precedent says the 6U class is viable, and UPC has already designed and flown 6U platforms with its NanoSat Lab (³Cat-2). Our risk is engineering, not physics — and no CubeSat has yet closed a secure key in orbit.",

      "contrib.eyebrow": "Our contribution",
      "contrib.title": "We don't copy QUBE — we push it further",
      "contrib.intro": "ESA scores “mission objectives” and “novelty”. A pure repeat won't win; this is where real research and final-year theses live.",
      "contrib.c1t": "Better optical link",
      "contrib.c1b": "A larger telescope / aperture to improve the downlink budget and the key rate.",
      "contrib.c2t": "PAT system",
      "contrib.c2b": "Sharper pointing, acquisition and tracking — the make-or-break subsystem of any QKD CubeSat.",
      "contrib.c3t": "Improved optics & components",
      "contrib.c3b": "Swap, test and characterise alternative optical components and the decoy-state source.",
      "contrib.c4t": "Miniaturisation",
      "contrib.c4b": "Shrink the quantum payload — toward smaller, cheaper, replicable units.",
      "contrib.c5t": "Decoy-state optimisation",
      "contrib.c5b": "Tune intensities and protocol parameters for the LEO channel to maximise the secure key.",
      "contrib.c6t": "Room for new ideas",
      "contrib.c6b": "Each phase opens fresh sub-problems: imaging, space debris, classical optical comms, RF.",

      "why.eyebrow": "Why now",
      "why.title": "Europe is investing in exactly this",
      "why.intro": "Quantum-secure communication is a top EU strategic priority. The wind is at our backs: funders, professors and ESA all want to be associated with this field right now.",
      "why.c1b": "The EU and ESA are building a quantum-secure network across all 27 member states — a terrestrial segment and a satellite segment.",
      "why.c2b": "Eagle-1 (SES/ESA) —not a CubeSat— will be Europe's first end-to-end operational QKD system, now slated for late 2027 / early 2028; more QKD missions are being prepared under IRIS² and EuroQCI.",
      "why.c3k": "Optical ground station in Barcelona",
      "why.c3b": "IberianQCI is setting up optical stations in Madrid, Barcelona and southern Portugal — a potential downlink target on our doorstep.",
      "why.c4k": "Catalonia, a quantum hub",
      "why.c4b": "The “Quantum Mediterranean Valley” + the Catalonia Quantum Academy (ICFO, UPC, CTTC, UAB, UB…) — our partners are right here.",

      "prog.eyebrow": "The programme",
      "prog.title": "ESA Fly Your Satellite! Design Booster 3",
      "prog.intro": "An ESA Education programme for university teams with a preliminary CubeSat design. A fixed 1.5-year schedule: ESA experts review your design, you implement their feedback and consolidate it. Built for less-experienced teams — exactly our profile. “No funding commitment is required to enter the programme.”",
      "prog.t1t": "Now — build the team",
      "prog.t1b": "Call open. We build the team and draft the proposal.",
      "prog.t2t": "Proposal deadline",
      "prog.t2b": "Satellite proposal + endorsement letter. 13:00 CEST — every week counts.",
      "prog.t3t": "Training week",
      "prog.t3b": "On-site at ESTEC for shortlisted teams.",
      "prog.t4t": "Selection workshop",
      "prog.t4b": "We defend the design; selected teams enter the programme.",
      "prog.t5t": "Baseline Design Review",
      "prog.t5b": "We implement the feedback and consolidate the design.",
      "prog.t6t": "Final review",
      "prog.t6b": "A mature, consolidated design (May–Jun 2028) — and the on-ramp to a sponsored launch.",

      "score.eyebrow": "Why we can get selected",
      "score.title": "Our strengths, mapped to ESA's scorecard",
      "score.b1n": "Quality & Mission",
      "score.b1d": "A proven-feasible quantum mission with clear novelty and the first-academic-QKD-CubeSat-in-Spain angle.",
      "score.b2n": "Educational return",
      "score.b2d": "Theses, papers and a multidisciplinary team learning real space engineering.",
      "score.b3n": "Team & Organisation",
      "score.b3d": "UPC + NanoSat Lab heritage + CTTC quantum experts behind us.",
      "score.tie": "Tie-break edge: new teams get priority over those already in an ESA programme — that's us.",

      "allies.eyebrow": "Allies & team",
      "allies.title": "Credibility wins selections",
      "allies.intro": "The deal we offer experts: co-authorship on the papers we publish in exchange for lab access, mentoring and, where possible, a slice of the budget.",
      "allies.a1": "Institutional home, labs, funding and the endorsing professor. Owner of the satellite.",
      "allies.a2": "Real UPC CubeSat heritage, including the 6U ³Cat-2 platform. Ideal mentors — coordinate, don't collide.",
      "allies.a3": "QKD experts in Castelldefels (Telefónica, LuxQuanta projects) + the Quantum Academy.",
      "allies.a4": "World-class photonics and quantum optics; coordinates the Catalonia Quantum Academy.",
      "allies.a5": "Modelling, simulation and quantum-compute muscle for the analysis work.",

      "join.eyebrow": "Join us",
      "join.title": "Build a satellite that flies on a European rocket — while you're still a student.",
      "join.sub": "We're looking for 6+ members across every discipline: ADCS, optics, power, software, structures, and business & law too. There's a real, fly-able thesis waiting for you.",
      "join.cta1": "Get in touch",
      "join.cta2": "Back to the mission",
      "join.contactLabel": "Contact",

      "foot.tagline": "Advanced and Resilient Satellite Communications Association · UPC EETAC",
      "foot.deadline": "ESA DB3 deadline",
      "foot.made": "Made in Castelldefels · UPC EETAC"
    },

    /* =================================================== CASTELLANO */
    es: {
      "meta.title": "ACSAR · Asociación de Comunicaciones Satelitales Avanzadas y Resilientes",
      "meta.desc": "Fundamos una asociación en la UPC para diseñar un CubeSat de distribución cuántica de claves —BB84 con decoy states— y hacerlo volar con la Agencia Espacial Europea.",

      "nav.skip": "Saltar al contenido",
      "nav.mission": "Misión",
      "nav.tech": "Tecnología",
      "nav.why": "Por qué ahora",
      "nav.roadmap": "Hoja de ruta",
      "nav.join": "Únete",
      "nav.cta": "Únete",

      "hero.eyebrow": "UPC · EETAC — Comunicaciones espaciales cuánticas",
      "hero.title": "Comunicaciones <span class=\"grad\">imposibles de espiar</span>, desde el espacio.",
      "hero.sub": "Fundamos una asociación de comunicaciones por satélite en la UPC para diseñar un CubeSat que distribuye claves de cifrado sobre fotones individuales —BB84 con decoy states— y hacerlo volar con la Agencia Espacial Europea.",
      "hero.cta1": "Explora la misión",
      "hero.cta2": "Únete al equipo →",
      "hero.clockLabel": "Plazo ESA Design Booster 3",
      "hero.clockTarget": "2 oct 2026 · 13:00 CEST",
      "hero.gsTag": "Estación óptica · Barcelona",
      "hero.basesLabel": "Bases de polarización BB84",
      "hero.scroll": "Desplaza",

      "plan.eyebrow": "El plan",
      "plan.title": "Tres movimientos, un solo objetivo",
      "plan.c1t": "Fundar la asociación",
      "plan.c1b": "Una asociación de estudiantes en la UPC centrada en comunicaciones por satélite: nos da identidad legal, acceso a laboratorios, financiación y un nombre bajo el que reclutar.",
      "plan.c2t": "Diseñar un CubeSat cuántico",
      "plan.c2b": "Un CubeSat 6U que hace distribución cuántica de claves —BB84 con decoy states—. Adoptamos la clase 6U, el mínimo viable ya probado internacionalmente, y aspiramos a ser el primer CubeSat QKD académico de España.",
      "plan.c3t": "Llevarlo a la ESA",
      "plan.c3b": "Presentarlo al Fly Your Satellite! Design Booster de la ESA: 1,5 años de mentoría experta, instalaciones de prueba y la rampa hacia un lanzamiento patrocinado.",

      "mission.eyebrow": "La misión",
      "mission.title": "Una clave secreta, escrita con fotones",
      "mission.p1": "La distribución cuántica de claves (QKD) envía una clave de cifrado codificada en fotones individuales. Las leyes de la física garantizan que cualquier espía es detectado: la seguridad no depende de un problema matemático difícil, así que ningún ordenador cuántico futuro podrá romperla.",
      "mission.protoK": "Protocolo",
      "mission.protoV": "BB84 (Bennett & Brassard) + método decoy-state — el caballo de batalla de la QKD práctica en el mundo real.",
      "mission.statesCap": "Cuatro estados de polarización · dos bases. Cada fotón lleva un bit; medir con la base equivocada lo destruye.",
      "mission.f1t": "La QKD más fácil de construir",
      "mission.f1b": "Usa un láser de pulsos coherentes débiles (WCP), no una frágil fuente de fotones entrelazados.",
      "mission.f2t": "Los decoy states cierran la brecha",
      "mission.f2b": "Neutralizan los ataques de división del número de fotones (PNS) y restauran la seguridad completa con un láser sencillo.",
      "mission.f3t": "Cabe en un CubeSat 6U",
      "mission.f3b": "Carga cuántica + terminal óptico en ~1–2U; el resto es plataforma — la clase 6U que buscamos para el Design Booster.",
      "mission.f4t": "Componentes ya volados en órbita",
      "mission.f4b": "Los componentes clave de la QKD ya han volado en CubeSats (QUBE-I, 2024). Adaptamos una receta en desarrollo, no partimos de cero.",

      "feas.eyebrow": "Viabilidad",
      "feas.title": "Riesgo de ingeniería, no de física",
      "feas.intro": "QUBE-I, un CubeSat 3U alemán, se lanzó en un Falcon 9 en agosto de 2024 y demostró en órbita los componentes clave de la QKD —un generador cuántico de números aleatorios y fuentes BB84—, aunque su pequeña apertura no le permite cerrar clave segura. Su sucesor, QUBE-II (8U), voló en mayo de 2026. El británico ROKS apuesta, como nosotros, por la clase 6U.",
      "feas.s1": "La clase que adoptamos — el mínimo viable ya probado internacionalmente (ROKS)",
      "feas.s2": "Órbita LEO objetivo — enlace descendente (downlink) satélite→Tierra",
      "feas.s3": "QUBE-I en órbita — primer pathfinder de componentes QKD en un CubeSat",
      "feas.s4": "CubeSats que han cerrado clave QKD segura en órbita — a fecha de julio de 2026. El reto sigue abierto.",
      "feas.note": "¿Puede un equipo universitario diseñar un CubeSat de QKD? Los precedentes dicen que la clase 6U es viable, y la UPC ya ha diseñado y volado plataformas 6U con su NanoSat Lab (³Cat-2). Nuestro riesgo es de ingeniería, no de física — y ningún CubeSat ha cerrado todavía clave segura en órbita.",

      "contrib.eyebrow": "Nuestra aportación",
      "contrib.title": "No copiamos QUBE — lo llevamos más lejos",
      "contrib.intro": "La ESA puntúa los «objetivos de misión» y la «novedad». Una simple repetición no gana; aquí es donde viven la investigación real y los trabajos de fin de grado.",
      "contrib.c1t": "Mejor enlace óptico",
      "contrib.c1b": "Un telescopio / apertura mayor para mejorar el balance del enlace descendente y la tasa de clave.",
      "contrib.c2t": "Sistema PAT",
      "contrib.c2b": "Apuntamiento, adquisición y seguimiento más precisos — el subsistema decisivo de cualquier CubeSat de QKD.",
      "contrib.c3t": "Óptica y componentes mejorados",
      "contrib.c3b": "Sustituir, probar y caracterizar componentes ópticos alternativos y la fuente de decoy states.",
      "contrib.c4t": "Miniaturización",
      "contrib.c4b": "Reducir la carga cuántica — hacia unidades más pequeñas, baratas y replicables.",
      "contrib.c5t": "Optimización de decoy states",
      "contrib.c5b": "Ajustar intensidades y parámetros del protocolo al canal LEO para maximizar la clave segura.",
      "contrib.c6t": "Espacio para ideas nuevas",
      "contrib.c6b": "Cada fase abre nuevos subproblemas: imagen, basura espacial, comunicaciones ópticas clásicas, RF.",

      "why.eyebrow": "Por qué ahora",
      "why.title": "Europa está invirtiendo exactamente en esto",
      "why.intro": "La comunicación cuántica segura es una prioridad estratégica de la UE. El viento sopla a favor: financiadores, profesores y la ESA quieren estar asociados a este campo ahora mismo.",
      "why.c1b": "La UE y la ESA construyen una red cuántica segura en los 27 estados miembros — un segmento terrestre y uno de satélite.",
      "why.c2b": "Eagle-1 (SES/ESA) —que no es un CubeSat— será el primer sistema QKD europeo end-to-end operativo, con lanzamiento previsto para finales de 2027 / principios de 2028; bajo IRIS² y EuroQCI se preparan más misiones QKD.",
      "why.c3k": "Estación óptica en Barcelona",
      "why.c3b": "IberianQCI monta estaciones ópticas en Madrid, Barcelona y el sur de Portugal — un posible objetivo de enlace a un paso de casa.",
      "why.c4k": "Cataluña, hub cuántico",
      "why.c4b": "El «Valle Mediterráneo Cuántico» + la Academia Cuántica de Cataluña (ICFO, UPC, CTTC, UAB, UB…) — nuestros aliados están aquí mismo.",

      "prog.eyebrow": "El programa",
      "prog.title": "ESA Fly Your Satellite! Design Booster 3",
      "prog.intro": "Un programa de la ESA Education para equipos universitarios con un diseño preliminar de CubeSat. Calendario fijo de 1,5 años: expertos de la ESA revisan tu diseño, implementas su feedback y lo consolidas. Pensado para equipos con poca experiencia — exactamente nuestro perfil. «No se requiere ningún compromiso de financiación para entrar en el programa.»",
      "prog.t1t": "Ahora — construir el equipo",
      "prog.t1b": "Convocatoria abierta. Formamos el equipo y redactamos la propuesta.",
      "prog.t2t": "Plazo de propuesta",
      "prog.t2b": "Propuesta de satélite + carta de aval. 13:00 CEST — cada semana cuenta.",
      "prog.t3t": "Semana de formación",
      "prog.t3b": "Presencial en el ESTEC para los equipos preseleccionados.",
      "prog.t4t": "Taller de selección",
      "prog.t4b": "Defendemos el diseño; los equipos elegidos entran en el programa.",
      "prog.t5t": "Baseline Design Review",
      "prog.t5b": "Implementamos el feedback y consolidamos el diseño.",
      "prog.t6t": "Revisión final",
      "prog.t6b": "Un diseño maduro y consolidado (may–jun 2028) — y la rampa hacia un lanzamiento patrocinado.",

      "score.eyebrow": "Por qué nos pueden seleccionar",
      "score.title": "Nuestras fortalezas, sobre la rúbrica de la ESA",
      "score.b1n": "Calidad & Misión",
      "score.b1d": "Una misión cuántica de viabilidad probada, con novedad clara y el ángulo de ser el primer CubeSat QKD académico de España.",
      "score.b2n": "Retorno educativo",
      "score.b2d": "TFGs, artículos y un equipo multidisciplinar aprendiendo ingeniería espacial real.",
      "score.b3n": "Equipo & Organización",
      "score.b3d": "UPC + la herencia del NanoSat Lab + los expertos cuánticos del CTTC detrás.",
      "score.tie": "Ventaja de desempate: los equipos nuevos tienen prioridad sobre los que ya participan en un programa de la ESA — eso somos nosotros.",

      "allies.eyebrow": "Aliados y equipo",
      "allies.title": "La credibilidad gana selecciones",
      "allies.intro": "El trato que ofrecemos a los expertos: coautoría de los artículos que publiquemos a cambio de acceso a laboratorios, mentoría y, cuando sea posible, una parte del presupuesto.",
      "allies.a1": "Hogar institucional, laboratorios, financiación y el profesor avalador. Propietaria del satélite.",
      "allies.a2": "Herencia CubeSat real de la UPC, incluida la plataforma 6U ³Cat-2. Mentores ideales — coordinar, no chocar.",
      "allies.a3": "Expertos en QKD en Castelldefels (proyectos Telefónica, LuxQuanta) + Academia Cuántica.",
      "allies.a4": "Fotónica y óptica cuántica de primer nivel mundial; coordina la Academia Cuántica de Cataluña.",
      "allies.a5": "Modelización, simulación y músculo de computación cuántica para el trabajo de análisis.",

      "join.eyebrow": "Únete",
      "join.title": "Construye un satélite que vuela en un cohete europeo — mientras aún eres estudiante.",
      "join.sub": "Buscamos 6+ miembros de todas las disciplinas: ADCS, óptica, potencia, software, estructuras, y también gestión y derecho. Hay un TFG real y volable esperándote.",
      "join.cta1": "Escríbenos",
      "join.cta2": "Vuelve a la misión",
      "join.contactLabel": "Contacto",

      "foot.tagline": "Asociación de Comunicaciones Satelitales Avanzadas y Resilientes · UPC EETAC",
      "foot.deadline": "Plazo ESA DB3",
      "foot.made": "Hecho en Castelldefels · UPC EETAC"
    }
  };

  var SUPPORTED = ["ca", "en", "es"];
  var STORE_KEY = "acsar-lang";

  function pickInitial() {
    var saved;
    try { saved = localStorage.getItem(STORE_KEY); } catch (e) { saved = null; }
    if (saved && SUPPORTED.indexOf(saved) !== -1) return saved;
    var nav = (navigator.language || "ca").slice(0, 2).toLowerCase();
    if (SUPPORTED.indexOf(nav) !== -1) return nav;
    return "ca";
  }

  function apply(lang) {
    if (SUPPORTED.indexOf(lang) === -1) lang = "ca";
    var dict = I18N[lang];

    document.documentElement.lang = lang;

    var nodes = document.querySelectorAll("[data-i18n]");
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var key = el.getAttribute("data-i18n");
      var val = dict[key];
      if (val == null) continue;

      var attr = el.getAttribute("data-i18n-attr");
      if (attr) { el.setAttribute(attr, val); continue; }
      if (el.hasAttribute("data-i18n-html")) { el.innerHTML = val; continue; }
      el.textContent = val;
    }

    // sync the language switch buttons
    var btns = document.querySelectorAll(".langswitch button");
    for (var k = 0; k < btns.length; k++) {
      var on = btns[k].getAttribute("data-lang") === lang;
      btns[k].classList.toggle("is-active", on);
      btns[k].setAttribute("aria-pressed", on ? "true" : "false");
    }

    try { localStorage.setItem(STORE_KEY, lang); } catch (e) {}

    document.dispatchEvent(new CustomEvent("acsar:lang", { detail: { lang: lang } }));
  }

  // expose
  window.ACSAR_I18N = { apply: apply, pickInitial: pickInitial, supported: SUPPORTED };

  // wire the switch + apply initial as early as possible
  function init() {
    var btns = document.querySelectorAll(".langswitch button");
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener("click", function () {
        apply(this.getAttribute("data-lang"));
      });
    }
    apply(pickInitial());
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
