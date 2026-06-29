/* ═══════════════════════════════════════════════════════════════════
   FIFA WORLD CUP 2026 — PREDICTION WIZARD MODULE
   SMYM Chemmalamattom | prediction.js
═══════════════════════════════════════════════════════════════════ */

// ── DATA: 48 FIFA WORLD CUP 2026 TEAMS ──────────────────────────────
const TEAMS = [
  { name: 'Algeria',      flag: '🇩🇿', conf: 'CAF' },
  { name: 'Argentina',    flag: '🇦🇷', conf: 'CONMEBOL' },
  { name: 'Australia',    flag: '🇦🇺', conf: 'AFC' },
  { name: 'Austria',      flag: '🇦🇹', conf: 'UEFA' },
  { name: 'Belgium',      flag: '🇧🇪', conf: 'UEFA' },
  { name: 'Bosnia',       flag: '🇧🇦', conf: 'UEFA' },
  { name: 'Brazil',       flag: '🇧🇷', conf: 'CONMEBOL' },
  { name: 'Canada',       flag: '🇨🇦', conf: 'CONCACAF', host: true },
  { name: 'Cape Verde',   flag: '🇨🇻', conf: 'CAF' },
  { name: 'Colombia',     flag: '🇨🇴', conf: 'CONMEBOL' },
  { name: 'DR Congo',       flag: '🇨🇩', conf: 'CAF' },
  { name: 'Croatia',      flag: '🇭🇷', conf: 'UEFA' },
  { name: 'Ecuador',      flag: '🇪🇨', conf: 'CONMEBOL' },
  { name: 'Egypt',        flag: '🇪🇬', conf: 'CAF' },
  { name: 'England',      flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', conf: 'UEFA' },
  { name: 'France',       flag: '🇫🇷', conf: 'UEFA' },
  { name: 'Germany',      flag: '🇩🇪', conf: 'UEFA' },
  { name: 'Ghana',        flag: '🇬🇭', conf: 'CAF' },
  { name: 'Ivory Coast',  flag: '🇨🇮', conf: 'CAF' },
  { name: 'Japan',        flag: '🇯🇵', conf: 'AFC' },
  { name: 'Mexico',       flag: '🇲🇽', conf: 'CONCACAF', host: true },
  { name: 'Morocco',      flag: '🇲🇦', conf: 'CAF' },
  { name: 'Netherlands',  flag: '🇳🇱', conf: 'UEFA' },
  { name: 'Norway',       flag: '🇳🇴', conf: 'UEFA' },
  { name: 'Paraguay',     flag: '🇵🇾', conf: 'CONMEBOL' },
  { name: 'Portugal',     flag: '🇵🇹', conf: 'UEFA' },
  { name: 'Senegal',      flag: '🇸🇳', conf: 'CAF' },
  { name: 'South Africa', flag: '🇿🇦', conf: 'CAF' },
  { name: 'Spain',        flag: '🇪🇸', conf: 'UEFA' },
  { name: 'Sweden',       flag: '🇸🇪', conf: 'UEFA' },
  { name: 'Switzerland',  flag: '🇨🇭', conf: 'UEFA' },
  { name: 'United States',flag: '🇺🇸', conf: 'CONCACAF', host: true }
];

// ── DATA: PLAYERS (for award dropdowns) ──────────────────────────────
const PLAYERS = [
  'Aaron Wan-Bissaka (DR Congo)',
  'Abdallah Sima (Senegal)',
  'Abdoulaye Seck (Senegal)',
  'Abdul Fatawu Issahaku (Ghana)',
  'Abdul Mumin (Ghana)',
  'Achraf Hakimi (Morocco)',
  'Adrien Rabiot (France)',
  'Afimico Pululu (DR Congo)',
  'Ahmed Atef (Egypt)',
  'Ahmed Hegazy (Egypt)',
  'Ahmed Nabil Koka (Egypt)',
  'Ahmed Ramadan Beckham (Egypt)',
  'Ahmed Sayed Zizo (Egypt)',
  'Aiden O'Neill (Australia)',
  'Ajdin Hrustic (Australia)',
  'Alan Franco (Ecuador)',
  'Alan Minda (Ecuador)',
  'Alejandro Balde (Spain)',
  'Aleksandar Pavlović (Germany)',
  'Alessandro Circati (Australia)',
  'Alex Arce (Paraguay)',
  'Alex Freeman (United States)',
  'Alex Sandro (Brazil)',
  'Alexander Isak (Sweden)',
  'Alexander Sørloth (Norway)',
  'Alexis Mac Allister (Argentina)',
  'Alexis Saelemaekers (Belgium)',
  'Alexis Vega (Mexico)',
  'Alfie Jones (Canada)',
  'Ali Ahmed (Canada)',
  'Alidu Seidu (Ghana)',
  'Alistair Johnston (Canada)',
  'Allen Obando (Ecuador)',
  'Alphonso Davies (Canada)',
  'Amad Diallo (Ivory Coast)',
  'Amadou Onana (Belgium)',
  'Amar Dedić (Bosnia)',
  'Amine Adli (Morocco)',
  'Amine Gouiri (Algeria)',
  'Amine Sbai (Morocco)',
  'Amir Hadžiahmetović (Bosnia)',
  'Amir Richardson (Morocco)',
  'Anass Salah-Eddine (Morocco)',
  'Andreas Schjelderup (Norway)',
  'Andrej Kramarić (Croatia)',
  'Andrés Cubas (Paraguay)',
  'Ange-Yoan Bonny (Ivory Coast)',
  'Angelo Stiller (Germany)',
  'Anis Hadj Moussa (Algeria)',
  'Ante Budimir (Croatia)',
  'Anthony Elanga (Sweden)',
  'Anthony Gordon (England)',
  'Anthony Valencia (Ecuador)',
  'Antoine Mendy (Senegal)',
  'Antoine Semenyo (Ghana)',
  'Anton Salétros (Sweden)',
  'Antonee Robinson (United States)',
  'Antonio Nusa (Norway)',
  'Antonio Rüdiger (Germany)',
  'Antonio Sanabria (Paraguay)',
  'António Silva (Portugal)',
  'Ao Tanaka (Japan)',
  'Ardon Jashari (Switzerland)',
  'Armando González (Mexico)',
  'Armin Gigović (Bosnia)',
  'Aron Dønnum (Norway)',
  'Arthur Masuaku (DR Congo)',
  'Arthur Theate (Belgium)',
  'Assane Diao (Senegal)',
  'Aubrey Modiba (South Africa)',
  'Augustine Boakye (Ghana)',
  'Aurèle Amenda (Switzerland)',
  'Aurélien Tchouaméni (France)',
  'Auston Trusty (United States)',
  'Awer Mabil (Australia)',
  'Axel Tuanzebe (DR Congo)',
  'Axel Witsel (Belgium)',
  'Ayase Ueda (Japan)',
  'Aymeric Laporte (Spain)',
  'Ayoub El Kaabi (Morocco)',
  'Ayoze Pérez (Spain)',
  'Ayumu Seko (Japan)',
  'Ayyoub Bouaddi (Morocco)',
  'Aziz Behich (Australia)',
  'Azzedine Ounahi (Morocco)',
  'Aïssa Mandi (Algeria)',
  'Baba Abdul Rahman (Ghana)',
  'Badredine Bouanani (Algeria)',
  'Bara Ndiaye (Senegal)',
  'Bathusi Aubaas (South Africa)',
  'Benchimol (Cape Verde)',
  'Benjamin Nygren (Sweden)',
  'Benjamin Pavard (France)',
  'Benjamin Tahirović (Bosnia)',
  'Bernardo Silva (Portugal)',
  'Besfort Zeneli (Sweden)',
  'Bilal El Khannouss (Morocco)',
  'Borna Sosa (Croatia)',
  'Boulaye Dia (Senegal)',
  'Bradley Barcola (France)',
  'Bradley Cross (South Africa)',
  'Brahim Díaz (Morocco)',
  'Brandon Mechele (Belgium)',
  'Brandon Thomas-Asante (Ghana)',
  'Breel Embolo (Switzerland)',
  'Bremer (Brazil)',
  'Brenden Aaronson (United States)',
  'Brian Brobbey (Netherlands)',
  'Brian Gutiérrez (Mexico)',
  'Bruno Fernandes (Portugal)',
  'Bruno Guimarães (Brazil)',
  'Bukayo Saka (England)',
  'Caleb Yirenkyi (Ghana)',
  'Cameron Burgess (Australia)',
  'Cameron Devlin (Australia)',
  'Carl Starfelt (Sweden)',
  'Carlos Andrés Gómez (Colombia)',
  'Carlos Cuesta (Colombia)',
  'Carlos Gruezo (Ecuador)',
  'Carney Chukwuemeka (Austria)',
  'Casemiro (Brazil)',
  'Cedric Itten (Switzerland)',
  'Chadi Riad (Morocco)',
  'Chancel Mbemba (DR Congo)',
  'Charles De Ketelaere (Belgium)',
  'Charles Pickel (DR Congo)',
  'Cheikh Niasse (Senegal)',
  'Chris Richards (United States)',
  'Christ Inao Oulaï (Ivory Coast)',
  'Christian Fassnacht (Switzerland)',
  'Christian Pulisic (United States)',
  'Christoph Lang (Austria)',
  'Christopher Bonsu Baah (Ghana)',
  'Christopher Operi (Ivory Coast)',
  'Chérif Ndiaye (Senegal)',
  'Clément Akpa (Ivory Coast)',
  'Cody Gakpo (Netherlands)',
  'Connor Metcalfe (Australia)',
  'Cristian Borja (Colombia)',
  'Cristian Romero (Argentina)',
  'Cristian Volpato (Australia)',
  'Cristiano Ronaldo (Portugal)',
  'Cuca (Cape Verde)',
  'Cucho Hernández (Colombia)',
  'Cédric Bakambu (DR Congo)',
  'César Huerta (Mexico)',
  'César Montes (Mexico)',
  'Daichi Kamada (Japan)',
  'Dailon Livramento (Cape Verde)',
  'Daizen Maeda (Japan)',
  'Damián Bobadilla (Paraguay)',
  'Dan Burn (England)',
  'Dan Ndoye (Switzerland)',
  'Dani Carvajal (Spain)',
  'Dani Olmo (Spain)',
  'Dani Vivian (Spain)',
  'Daniel Jebbison (Canada)',
  'Daniel Muñoz (Colombia)',
  'Daniel Svensson (Sweden)',
  'Danilo (Brazil)',
  'Danilo Santos (Brazil)',
  'Dario Šarić (Bosnia)',
  'David Affengruber (Austria)',
  'David Alaba (Austria)',
  'David Møller Wolfe (Norway)',
  'David Raum (Germany)',
  'Davinson Sánchez (Colombia)',
  'Dayot Upamecano (France)',
  'Declan Rice (England)',
  'Deiver Machado (Colombia)',
  'Dejan Ljubičić (Austria)',
  'Denis Zakaria (Switzerland)',
  'Deniz Undav (Germany)',
  'Dennis Hadžikadunić (Bosnia)',
  'Denzel Dumfries (Netherlands)',
  'Derek Cornelius (Canada)',
  'Deroy Duarte (Cape Verde)',
  'Derrick Luckassen (Ghana)',
  'Diego Gómez (Paraguay)',
  'Diney Borges (Cape Verde)',
  'Diogo Dalot (Portugal)',
  'Djed Spence (England)',
  'Djibril Sow (Switzerland)',
  'Dodi Lukebakio (Belgium)',
  'Donyell Malen (Netherlands)',
  'Douglas Santos (Brazil)',
  'Duje Ćaleta-Car (Croatia)',
  'Dylan Batubinsika (DR Congo)',
  'Dylan Tavares (Cape Verde)',
  'Désiré Doué (France)',
  'Eberechi Eze (England)',
  'Ederson Silva (Brazil)',
  'Edin Džeko (Bosnia)',
  'Edo Kayembe (DR Congo)',
  'Edson Álvarez (Mexico)',
  'Eduardo Camavinga (France)',
  'El Hadji Malick Diouf (Senegal)',
  'Elias Mokwana (South Africa)',
  'Eliesse Ben Seghir (Morocco)',
  'Elliot Anderson (England)',
  'Elye Wahi (Ivory Coast)',
  'Emam Ashour (Egypt)',
  'Emanuel Aiwu (Austria)',
  'Emil Holm (Sweden)',
  'Endrick (Brazil)',
  'Enner Valencia (Ecuador)',
  'Enzo Fernández (Argentina)',
  'Eray Cömert (Switzerland)',
  'Eric Smith (Sweden)',
  'Erik Lira (Mexico)',
  'Erling Haaland (Norway)',
  'Ermedin Demirović (Bosnia)',
  'Ermin Mahmić (Bosnia)',
  'Ernest Nuamah (Ghana)',
  'Esmir Bajraktarević (Bosnia)',
  'Evan Ndicka (Ivory Coast)',
  'Evann Guessand (Ivory Coast)',
  'Evidence Makgopa (South Africa)',
  'Exequiel Palacios (Argentina)',
  'Ezri Konsa (England)',
  'Fabian Rieder (Switzerland)',
  'Fabinho (Brazil)',
  'Fabián Balbuena (Paraguay)',
  'Fabián Ruiz (Spain)',
  'Fabrizio Peralta (Paraguay)',
  'Facundo Medina (Argentina)',
  'Farès Chaïbi (Algeria)',
  'Fawaaz Basadien (South Africa)',
  'Felix Nmecha (Germany)',
  'Ferland Mendy (France)',
  'Ferran Torres (Spain)',
  'Fiston Mayele (DR Congo)',
  'Florian Wirtz (Germany)',
  'Folarin Balogun (United States)',
  'Francisco Conceição (Portugal)',
  'Francisco Trincão (Portugal)',
  'Franck Kessié (Ivory Coast)',
  'Fredrik André Bjørkan (Norway)',
  'Fredrik Aursnes (Norway)',
  'Frenkie de Jong (Netherlands)',
  'Félix Torres (Ecuador)',
  'Gabriel Gudmundsson (Sweden)',
  'Gabriel Magalhães (Brazil)',
  'Gabriel Martinelli (Brazil)',
  'Gabriel Ávalos (Paraguay)',
  'Garry Rodrigues (Cape Verde)',
  'Gavi (Spain)',
  'Gaël Kakuta (DR Congo)',
  'Gedeon Kalulu (DR Congo)',
  'Gernot Trauner (Austria)',
  'Ghislain Konan (Ivory Coast)',
  'Gideon Mensah (Ghana)',
  'Gilberto Mora (Mexico)',
  'Gilson Tavares (Cape Verde)',
  'Giovani Lo Celso (Argentina)',
  'Giovanni Reyna (United States)',
  'Giuliano Simeone (Argentina)',
  'Gonzalo Montiel (Argentina)',
  'Gonzalo Plata (Ecuador)',
  'Gonçalo Guedes (Portugal)',
  'Gonçalo Inácio (Portugal)',
  'Gonçalo Ramos (Portugal)',
  'Granit Xhaka (Switzerland)',
  'Grant Kekana (South Africa)',
  'Guillermo Martínez (Mexico)',
  'Gustaf Nilsson (Sweden)',
  'Gustavo Gómez (Paraguay)',
  'Gustavo Velázquez (Paraguay)',
  'Guus Til (Netherlands)',
  'Guéla Doué (Ivory Coast)',
  'Habib Diarra (Senegal)',
  'Haitham Hassan (Egypt)',
  'Haji Wright (United States)',
  'Hamed Traorè (Ivory Coast)',
  'Hamza Abdel Karim (Egypt)',
  'Hamza Igamane (Morocco)',
  'Hans Vanaken (Belgium)',
  'Haris Tabaković (Bosnia)',
  'Harry Kane (England)',
  'Harry Souttar (Australia)',
  'Hicham Boudaoui (Algeria)',
  'Himad Abdelli (Algeria)',
  'Hiroki Ito (Japan)',
  'Hjalmar Ekdal (Sweden)',
  'Houssem Aouar (Algeria)',
  'Hugo Larsson (Sweden)',
  'Héldon Ramos (Cape Verde)',
  'Ibrahim Adel (Egypt)',
  'Ibrahim Diabaté (Sweden)',
  'Ibrahim Maza (Algeria)',
  'Ibrahim Osman (Ghana)',
  'Ibrahim Sangaré (Ivory Coast)',
  'Ibrahima Konaté (France)',
  'Ibáñez (Brazil)',
  'Idrissa Gana Gueye (Senegal)',
  'Iliman Ndiaye (Senegal)',
  'Iqraam Rayners (South Africa)',
  'Isak Hien (Sweden)',
  'Isidro Pitta (Paraguay)',
  'Ismael Saibari (Morocco)',
  'Ismail Jakobs (Senegal)',
  'Ismaël Bennacer (Algeria)',
  'Ismaël Koné (Canada)',
  'Ismaïla Sarr (Senegal)',
  'Israel Reyes (Mexico)',
  'Issa Diop (Morocco)',
  'Ivan Bašić (Bosnia)',
  'Ivan Perišić (Croatia)',
  'Ivan Toney (England)',
  'Iñaki Williams (Ghana)',
  'Jackson Irvine (Australia)',
  'Jackson Porozo (Ecuador)',
  'Jacob Shaffelburg (Canada)',
  'Jamal Musiala (Germany)',
  'James Rodríguez (Colombia)',
  'Jamie Leweling (Germany)',
  'Jamiro Monteiro (Cape Verde)',
  'Jan Paul van Hecke (Netherlands)',
  'Jaouen Hadjam (Algeria)',
  'Jarell Quansah (England)',
  'Jason Geria (Australia)',
  'Jayden Adams (South Africa)',
  'Jean Michaël Seri (Ivory Coast)',
  'Jean-Philippe Mateta (France)',
  'Jefferson Lerma (Colombia)',
  'Jens Cajuste (Sweden)',
  'Jens Petter Hauge (Norway)',
  'Jerome Opoku (Ghana)',
  'Jerry Afriyie (Ghana)',
  'Jesús Gallardo (Mexico)',
  'Jhegson Méndez (Ecuador)',
  'Jhon Arias (Colombia)',
  'Jhon Córdoba (Colombia)',
  'Jhon Lucumí (Colombia)',
  'Joaquin Seys (Belgium)',
  'Joe Scally (United States)',
  'Joel Ordóñez (Ecuador)',
  'Joel Waterman (Canada)',
  'Johan Manzambi (Switzerland)',
  'Johan Vásquez (Mexico)',
  'John Mercado (Ecuador)',
  'John Stones (England)',
  'John Yeboah (Ecuador)',
  'Johnny Cardoso (United States)',
  'Jonathan Clauss (France)',
  'Jonathan David (Canada)',
  'Jonathan Osorio (Canada)',
  'Jonathan Tah (Germany)',
  'Jordan Ayew (Ghana)',
  'Jordan Bos (Australia)',
  'Jordan Henderson (England)',
  'Jorge Carrascal (Colombia)',
  'Jorge Sánchez (Mexico)',
  'Joris Kayembe (DR Congo)',
  'Jorrel Hato (Netherlands)',
  'Joshua Kimmich (Germany)',
  'Josip Juranović (Croatia)',
  'Josip Stanišić (Croatia)',
  'Josip Šutalo (Croatia)',
  'José Manuel López (Argentina)',
  'Jovo Lukić (Bosnia)',
  'João Cancelo (Portugal)',
  'João Félix (Portugal)',
  'João Neves (Portugal)',
  'João Paulo (Cape Verde)',
  'Joško Gvardiol (Croatia)',
  'Juan Fernando Quintero (Colombia)',
  'Juan José Cáceres (Paraguay)',
  'Juan Portilla (Colombia)',
  'Jude Bellingham (England)',
  'Jude Soonsup-Bell (England)',
  'Jules Koundé (France)',
  'Julian Ryerson (Norway)',
  'Julio Enciso (Paraguay)',
  'Julián Quiñones (Mexico)',
  'Julián Álvarez (Argentina)',
  'Junnosuke Suzuki (Japan)',
  'Junya Ito (Japan)',
  'Jurrien Timber (Netherlands)',
  'Justin Kluivert (Netherlands)',
  'Jáminton Campaz (Colombia)',
  'Jérémy Doku (Belgium)',
  'Jørgen Strand Larsen (Norway)',
  'Júlio Tavares (Cape Verde)',
  'Júnior Alonso (Paraguay)',
  'Kai Havertz (Germany)',
  'Kai Trewin (Australia)',
  'Kaishu Sano (Japan)',
  'Kaku (Paraguay)',
  'Kalidou Koulibaly (Senegal)',
  'Kamaldeen Sulemana (Ghana)',
  'Keisuke Goto (Japan)',
  'Keito Nakamura (Japan)',
  'Kendry Páez (Ecuador)',
  'Kenny Rocha Santos (Cape Verde)',
  'Kento Shiogai (Japan)',
  'Kerim Alajbegović (Bosnia)',
  'Kevin Castaño (Colombia)',
  'Kevin Danso (Austria)',
  'Kevin De Bruyne (Belgium)',
  'Kevin Pina (Cape Verde)',
  'Kevin Rodríguez (Ecuador)',
  'Khuliso Mudau (South Africa)',
  'Ko Itakura (Japan)',
  'Kobbie Mainoo (England)',
  'Kojo Oppong Peprah (Ghana)',
  'Koki Ogawa (Japan)',
  'Koni De Winter (Belgium)',
  'Konrad Laimer (Austria)',
  'Kristijan Jakić (Croatia)',
  'Kristoffer Ajer (Norway)',
  'Krépin Diatta (Senegal)',
  'Kusini Yengi (Australia)',
  'Kwasi Sibo (Ghana)',
  'Kylian Mbappé (France)',
  'Lamine Camara (Senegal)',
  'Lamine Yamal (Spain)',
  'Laros Duarte (Cape Verde)',
  'Lautaro Martínez (Argentina)',
  'Leandro Paredes (Argentina)',
  'Leandro Trossard (Belgium)',
  'Lennart Kar (Germany)',
  'Leo Østigård (Norway)',
  'Leon Goretzka (Germany)',
  'Leroy Sané (Germany)',
  'Liam Millar (Canada)',
  'Lionel Messi (Argentina)',
  'Lisandro Martínez (Argentina)',
  'Logan Costa (Cape Verde)',
  'Loïs Openda (Belgium)',
  'Luc de Fougerolles (Canada)',
  'Luca de la Torre (United States)',
  'Lucas Herrington (Australia)',
  'Lucas Jaquez (Switzerland)',
  'Lucas Paquetá (Brazil)',
  'Luis Chávez (Mexico)',
  'Luis Díaz (Colombia)',
  'Luis Romo (Mexico)',
  'Luis Suárez (Colombia)',
  'Luiz Henrique (Brazil)',
  'Luka Kulenović (Bosnia)',
  'Luka Modrić (Croatia)',
  'Luka Sučić (Croatia)',
  'Luka Vušković (Croatia)',
  'Lutsharel Geertruida (Netherlands)',
  'Lyle Foster (South Africa)',
  'Léo Pereira (Brazil)',
  'Mahmoud Hassan Trezeguet (Egypt)',
  'Mahmoud Saber (Egypt)',
  'Malick Thiaw (Germany)',
  'Malik Tillman (United States)',
  'Mamadou Sarr (Senegal)',
  'Manu Koné (France)',
  'Manuel Akanji (Switzerland)',
  'Marc Cucurella (Spain)',
  'Marc Guéhi (England)',
  'Marcel Sabitzer (Austria)',
  'Marco Pašalić (Croatia)',
  'Marcos Senesi (Argentina)',
  'Marcus Holmgren Pedersen (Norway)',
  'Marcus Rashford (England)',
  'Marcus Thuram (France)',
  'Marin Pongračić (Croatia)',
  'Marino Hinestroza (Colombia)',
  'Mario Pašalić (Croatia)',
  'Mark McKenzie (United States)',
  'Marko Arnautović (Austria)',
  'Marquinhos (Brazil)',
  'Marten de Roon (Netherlands)',
  'Martin Baturina (Croatia)',
  'Martin Ødegaard (Norway)',
  'Martín Zubimendi (Spain)',
  'Marwan Attia (Egypt)',
  'Marwane Saâdane (Morocco)',
  'Mateo Chávez (Mexico)',
  'Mateo Kovačić (Croatia)',
  'Matheus Cunha (Brazil)',
  'Matheus Nunes (Portugal)',
  'Mathew Leckie (Australia)',
  'Mathieu Choinière (Canada)',
  'Mathías Villasanti (Paraguay)',
  'Mats Wieffer (Netherlands)',
  'Matthias Seidl (Austria)',
  'Mattias Svanberg (Sweden)',
  'Matías Fernández-Pardo (Belgium)',
  'Matías Galarza (Paraguay)',
  'Mauricio Espínola (Paraguay)',
  'Max Arfsten (United States)',
  'Maxim De Cuyper (Belgium)',
  'Maximilian Beier (Germany)',
  'Mehdi Dorval (Algeria)',
  'Memphis Depay (Netherlands)',
  'Merveille Bokadi (DR Congo)',
  'Meschack Elia (DR Congo)',
  'Michael Gregoritsch (Austria)',
  'Michael Olise (France)',
  'Michel Aebischer (Switzerland)',
  'Micky van de Ven (Netherlands)',
  'Miguel Almirón (Paraguay)',
  'Mikel Merino (Spain)',
  'Mikel Oyarzabal (Spain)',
  'Miles Robinson (United States)',
  'Milos Degenek (Australia)',
  'Miro Muheim (Switzerland)',
  'Mohamed Abdelmonem (Egypt)',
  'Mohamed Amine Tougaï (Algeria)',
  'Mohamed Amoura (Algeria)',
  'Mohamed Hany (Egypt)',
  'Mohamed Salah (Egypt)',
  'Mohamed Touré (Australia)',
  'Mohannad Lasheen (Egypt)',
  'Moisés Caicedo (Ecuador)',
  'Moncef Bakrar (Algeria)',
  'Morgan Rogers (England)',
  'Morten Thorsby (Norway)',
  'Mostafa Abdel Raouf (Egypt)',
  'Mostafa Fathi (Egypt)',
  'Moussa Niakhaté (Senegal)',
  'Moïse Bombito (Canada)',
  'Muhammed Cham (Austria)',
  'N'Golo Kanté (France)',
  'Nabil Bentaleb (Algeria)',
  'Nadhir Benbouali (Algeria)',
  'Nadiem Amiri (Germany)',
  'Nahuel Molina (Argentina)',
  'Nardin Mulahusejnović (Bosnia)',
  'Nathan Aké (Netherlands)',
  'Nathan Ngoy (Belgium)',
  'Nathan Saliba (Canada)',
  'Nestory Irankunda (Australia)',
  'Neymar (Brazil)',
  'Ngal'ayel Mukau (DR Congo)',
  'Nick Woltemade (Germany)',
  'Niclas Eliasson (Sweden)',
  'Nico Elvedi (Switzerland)',
  'Nico O'Reilly (England)',
  'Nico Williams (Spain)',
  'Nicolas Jackson (Senegal)',
  'Nicolas Kühn (Austria)',
  'Nicolas Pépé (Ivory Coast)',
  'Nicolas Raskin (Belgium)',
  'Nicolas Seiwald (Austria)',
  'Nicolás González (Argentina)',
  'Nicolás Otamendi (Argentina)',
  'Nicolás Paz (Argentina)',
  'Nicolás Tagliafico (Argentina)',
  'Nidal Čelik (Bosnia)',
  'Nihad Mujakić (Bosnia)',
  'Niko Sigur (Canada)',
  'Nikola Katić (Bosnia)',
  'Nikola Moro (Croatia)',
  'Nikola Vlašić (Croatia)',
  'Nilson Angulo (Ecuador)',
  'Nishan Velupillay (Australia)',
  'Nkosinathi Sibisi (South Africa)',
  'Noa Lang (Netherlands)',
  'Noah Okafor (Switzerland)',
  'Noah Sadiki (DR Congo)',
  'Noni Madueke (England)',
  'Noussair Mazraoui (Morocco)',
  'Nuno Mendes (Portugal)',
  'Nélson Semedo (Portugal)',
  'Obed Vargas (Mexico)',
  'Odilon Kossounou (Ivory Coast)',
  'Odin Bjørtuft (Norway)',
  'Ollie Watkins (England)',
  'Olwethu Makhanya (South Africa)',
  'Omar Alderete (Paraguay)',
  'Omar Kamal Abdelwahed (Egypt)',
  'Omar Marmoush (Egypt)',
  'Orbelín Pineda (Mexico)',
  'Osama Faisal (Egypt)',
  'Osame Sahraoui (Morocco)',
  'Oscar Bobb (Norway)',
  'Oswin Appollis (South Africa)',
  'Ousmane Dembélé (France)',
  'Ousmane Diomande (Ivory Coast)',
  'Oussama Targhalline (Morocco)',
  'Pape Gueye (Senegal)',
  'Pape Matar Sarr (Senegal)',
  'Parfait Guiagon (Ivory Coast)',
  'Pascal Groß (Germany)',
  'Patrick Berg (Norway)',
  'Patrick Maswanganyi (South Africa)',
  'Patrick Wimmer (Austria)',
  'Pau Cubarsí (Spain)',
  'Paul Okon-Engstler (Australia)',
  'Paul Wanner (Austria)',
  'Pedri (Spain)',
  'Pedro Neto (Portugal)',
  'Pedro Porro (Spain)',
  'Pedro Vite (Ecuador)',
  'Percy Tau (South Africa)',
  'Pervis Estupiñán (Ecuador)',
  'Petar Musa (Croatia)',
  'Petar Sučić (Croatia)',
  'Philipp Lienhart (Austria)',
  'Piero Hincapié (Ecuador)',
  'Prince Kwabena Adu (Ghana)',
  'Promise David (Canada)',
  'Quinten Timber (Netherlands)',
  'Rafael Leão (Portugal)',
  'Rami Rabia (Egypt)',
  'Ramy Bensebaïni (Algeria)',
  'Ramón Sosa (Paraguay)',
  'Ransford-Yeboah Königsdörffer (Ghana)',
  'Raphinha (Brazil)',
  'Rayan (Brazil)',
  'Rayan Aït-Nouri (Algeria)',
  'Rayan Cherk (France)',
  'Raúl Jiménez (Mexico)',
  'Reece James (England)',
  'Relebohile Mofokeng (South Africa)',
  'Remo Freuler (Switzerland)',
  'Renato Veiga (Portugal)',
  'Ricardo Pepi (United States)',
  'Ricardo Rodríguez (Switzerland)',
  'Richard Ríos (Colombia)',
  'Richie Laryea (Canada)',
  'Ritsu Doan (Japan)',
  'Riyad Mahrez (Algeria)',
  'Roberto Alvarado (Mexico)',
  'Roberto Lopes (Cape Verde)',
  'Robin Koch (Germany)',
  'Robin Le Normand (Spain)',
  'Rodri (Spain)',
  'Rodrigo De Paul (Argentina)',
  'Romano Schmid (Austria)',
  'Romelu Lukaku (Belgium)',
  'Ronaldo Dejesús (Paraguay)',
  'Ruben Vargas (Switzerland)',
  'Ryan Gravenberch (Netherlands)',
  'Ryan Mendes (Cape Verde)',
  'Rúben Dias (Portugal)',
  'Rúben Neves (Portugal)',
  'Sadio Mané (Senegal)',
  'Samed Baždar (Bosnia)',
  'Samu Costa (Portugal)',
  'Samuel Dahl (Sweden)',
  'Samuel Moutoussamy (DR Congo)',
  'Sander Berge (Norway)',
  'Santiago Arias (Colombia)',
  'Santiago Giménez (Mexico)',
  'Saïd Benrahma (Algeria)',
  'Saša Kalajdžić (Austria)',
  'Sead Kolašinac (Bosnia)',
  'Sebastian Berhalter (United States)',
  'Sebastian Nanasi (Sweden)',
  'Seko Fofana (Ivory Coast)',
  'Sergiño Dest (United States)',
  'Shogo Taniguchi (Japan)',
  'Sidny Lopes Cabral (Cape Verde)',
  'Silas Katompa Mvumpa (DR Congo)',
  'Silvan Widmer (Switzerland)',
  'Simon Adingra (Ivory Coast)',
  'Simon Banza (DR Congo)',
  'Sinoxolo Kwayiba (South Africa)',
  'Siyabonga Ngezana (South Africa)',
  'Sofyan Amrabat (Morocco)',
  'Soufiane Rahimi (Morocco)',
  'Stefan Posch (Austria)',
  'Stephen Eustáquio (Canada)',
  'Steve Kapuadi (DR Congo)',
  'Steven Moreira (Cape Verde)',
  'Stian Gregersen (Norway)',
  'Stjepan Radeljić (Bosnia)',
  'Stopira (Cape Verde)',
  'Sébastien Haller (Ivory Coast)',
  'Tajon Buchanan (Canada)',
  'Takefusa Kubo (Japan)',
  'Takehiro Tomiyasu (Japan)',
  'Tani Oluwaseyi (Canada)',
  'Tarik Muharemović (Bosnia)',
  'Teboho Mokoena (South Africa)',
  'Tete Yengi (Australia)',
  'Teun Koopmeiners (Netherlands)',
  'Thalente Mbatha (South Africa)',
  'Thelo Aasgaard (Norway)',
  'Themba Zwane (South Africa)',
  'Theo Bair (Canada)',
  'Theo Hernández (France)',
  'Thiago Almada (Argentina)',
  'Thomas Meunier (Belgium)',
  'Thomas Partey (Ghana)',
  'Théo Bongonda (DR Congo)',
  'Tiago Djaló (Portugal)',
  'Tijjani Reijnders (Netherlands)',
  'Tim Ream (United States)',
  'Tim Weah (United States)',
  'Timothy Castagne (Belgium)',
  'Toni Fruk (Croatia)',
  'Torbjørn Heggem (Norway)',
  'Tshepang Moremi (South Africa)',
  'Tsuyoshi Watanabe (Japan)',
  'Tyler Adams (United States)',
  'Valentín Barco (Argentina)',
  'Victor Lindelöf (Sweden)',
  'Viktor Gyökeres (Sweden)',
  'Vinícius Júnior (Brazil)',
  'Virgil van Dijk (Netherlands)',
  'Vitinha (Portugal)',
  'Wagner Pina (Cape Verde)',
  'Waldemar Anton (Germany)',
  'Warren Zaïre-Emery (France)',
  'Wataru Endo (Japan)',
  'Wesley (Brazil)',
  'Weston McKennie (United States)',
  'Wilfried Singo (Ivory Coast)',
  'William Saliba (France)',
  'Willian Pacho (Ecuador)',
  'Wout Weghorst (Netherlands)',
  'Xaver Schlager (Austria)',
  'Xavier Arreaga (Ecuador)',
  'Yan Diomande (Ivory Coast)',
  'Yann Aurel Bisseck (Germany)',
  'Yannick Semedo (Cape Verde)',
  'Yasin Ayari (Sweden)',
  'Yasser Ibrahim (Egypt)',
  'Yeremy Pino (Spain)',
  'Yerry Mina (Colombia)',
  'Yoane Wissa (DR Congo)',
  'Youcef Atal (Algeria)',
  'Youri Tielemans (Belgium)',
  'Youssef Belammari (Morocco)',
  'Youssouf Fofana (France)',
  'Yuito Suzuki (Japan)',
  'Yukinari Sugawara (Japan)',
  'Yuto Nagatomo (Japan)',
  'Zakaria El Ouahdi (Morocco)',
  'Zeki Amdouni (Switzerland)',
  'Zeno Debast (Belgium)',
  'Zineddine Belaïd (Algeria)',
  'Álex Baena (Spain)',
  'Álvaro Fidalgo (Mexico)',
  'Álvaro Morata (Spain)',
  'Ángelo Preciado (Ecuador)'
].sort();

// ── DATA: GOALKEEPERS (for Golden Glove) ────────────────────────────
const GOALKEEPERS = [
  'Ahmed Reda Tagnaouti (Morocco)',
  'Alban Lafont (Ivory Coast)',
  'Alexander Nübel (Germany)',
  'Alexander Schlager (Austria)',
  'Alisson Becker (Brazil)',
  'Anthony Mandrea (Algeria)',
  'Bart Verbruggen (Netherlands)',
  'Benjamin Asare (Ghana)',
  'Brice Samba (France)',
  'CJ dos Santos (Cape Verde)',
  'Camilo Vargas (Colombia)',
  'Carlos Acevedo (Mexico)',
  'Chris Brady (United States)',
  'David Ospina (Colombia)',
  'David Raya (Spain)',
  'Dayne St. Clair (Canada)',
  'Dean Henderson (England)',
  'Diogo Costa (Portugal)',
  'Dominik Kotarski (Croatia)',
  'Dominik Livaković (Croatia)',
  'Ederson (Brazil)',
  'Edouard Mendy (Senegal)',
  'Egil Selvik (Norway)',
  'El Mahdy Soliman (Egypt)',
  'Emiliano Martínez (Argentina)',
  'Florian Wiegele (Austria)',
  'Gastón Olveira (Paraguay)',
  'Gatito Fernández (Paraguay)',
  'Gerónimo Rulli (Argentina)',
  'Gonzalo Valle (Ecuador)',
  'Gregor Kobel (Switzerland)',
  'Guillermo Ochoa (Mexico)',
  'Hernán Galíndez (Ecuador)',
  'Ivor Pandur (Croatia)',
  'Jacob Widell Zetterström (Sweden)',
  'James Trafford (England)',
  'Jordan Pickford (England)',
  'Joseph Anang (Ghana)',
  'José Sá (Portugal)',
  'Juan Musso (Argentina)',
  'Keisuke Osako (Japan)',
  'Kristoffer Nordfeldt (Sweden)',
  'Lawrence Ati-Zigi (Ghana)',
  'Lionel Mpasi (DR Congo)',
  'Luca Zidane (Algeria)',
  'Manuel Neuer (Germany)',
  'Mark Flekken (Netherlands)',
  'Martin Zlomislić (Bosnia)',
  'Marvin Keller (Switzerland)',
  'Mathew Ryan (Australia)',
  'Matt Freese (United States)',
  'Matt Turner (United States)',
  'Matthieu Epolo (DR Congo)',
  'Maxime Crépeau (Canada)',
  'Mike Maignan (France)',
  'Mike Penders (Belgium)',
  'Mohamed El Shenawy (Egypt)',
  'Mohamed Koné (Ivory Coast)',
  'Moisés Ramírez (Ecuador)',
  'Mory Diaw (Senegal)',
  'Mostafa Shobeir (Egypt)',
  'Munir El Kajoui (Morocco)',
  'Márcio Rosa (Cape Verde)',
  'Nikola Vasilj (Bosnia)',
  'Oliver Baumann (Germany)',
  'Orlando Gill (Paraguay)',
  'Osman Hadžikić (Bosnia)',
  'Oussama Benbot (Algeria)',
  'Owen Goodman (Canada)',
  'Patrick Beach (Australia)',
  'Patrick Pentz (Austria)',
  'Paul Izzo (Australia)',
  'Raúl Rangel (Mexico)',
  'Ricardo Goss (South Africa)',
  'Robin Risser (France)',
  'Robin Roefs (Netherlands)',
  'Ronwen Williams (South Africa)',
  'Rui Silva (Portugal)',
  'Sander Tangvik (Norway)',
  'Senne Lammens (Belgium)',
  'Sipho Chaine (South Africa)',
  'Thibaut Courtois (Belgium)',
  'Timothy Fayulu (DR Congo)',
  'Tomoki Hayakawa (Japan)',
  'Unai Simón (Spain)',
  'Viktor Johansson (Sweden)',
  'Vozinha (Cape Verde)',
  'Weverton (Brazil)',
  'Yahia Fofana (Ivory Coast)',
  'Yassine Bounou (Morocco)',
  'Yehvann Diouf (Senegal)',
  'Yvon Mvogo (Switzerland)',
  'Zion Suzuki (Japan)',
  'Álex Remiro (Spain)',
  'Álvaro Montero (Colombia)',
  'Ørjan Håskjold Nyland (Norway)'
].sort();

// ── STATE ────────────────────────────────────────────────────────────
const PredState = {
  currentStep: 1,
  selections: {
    semifinalists: [],   // 4 team names
    finalists:     [],   // 2 team names
    champion:      null, // 1 team name
    runnerUp:      null, // 1 team name
    thirdPlace:    null, // 1 team name
  },
  form: {
    fullName: '', age: '', houseName: '', ward: '', phone: '', email: ''
  },
  awards: {
    goldenBoot: '', goldenBall: '', goldenGlove: '',
    tbGoals: '', tbFirstScorer: '', tbFirstMinute: ''
  },
  choicesInstances: {},
  isSubmitting: false
};

// ── DEADLINE ───────────────────────────────────────────────────────────
const PREDICTION_DEADLINE = new Date('2026-07-12T18:29:59Z').getTime();

// ── INIT ─────────────────────────────────────────────────────────────
function initPrediction() {
  if (Date.now() > PREDICTION_DEADLINE) {
    showPredictionClosed();
    return;
  }
  renderTeamGrids();
  initChoicesDropdowns();
}

function showPredictionClosed() {
  const container = document.querySelector('#section-predict .container-xl');
  if (container) {
    container.innerHTML = `
      <div class="lb-locked" style="text-align:center; padding: 100px 20px; width: 100%;">
        <div style="font-size: 4rem; margin-bottom: 16px;">🔒</div>
        <div style="font-family: var(--font-heading); font-size: clamp(1.8rem,4vw,3rem); letter-spacing: 4px; color: var(--gold); margin-bottom: 8px;">
          PREDICTIONS CLOSED
        </div>
        <p style="color: var(--text-secondary); font-size: 1.1rem; margin-bottom: 32px; max-width: 460px; margin-left: auto; margin-right: auto;">
          The entry deadline for the FIFA World Cup 2026 Prediction Contest has passed. No more entries are being accepted.
        </p>
        <button class="btn-primary-gold" onclick="navigateTo('leaderboard')">
          <i class="fas fa-chart-bar me-2"></i> View Leaderboard
        </button>
      </div>
    `;
  }
}

// ── RENDER TEAM GRIDS ────────────────────────────────────────────────
function renderTeamGrids() {
  const grids = ['SF', 'Fin', 'Champ', 'RU', 'Third'];
  const domIds = {
    SF:    'teamsGridSF',
    Fin:   'teamsGridFin',
    Champ: 'teamsGridChamp',
    RU:    'teamsGridRU',
    Third: 'teamsGridThird'
  };

  grids.forEach(type => {
    const el = document.getElementById(domIds[type]);
    if (!el) return;
    el.innerHTML = TEAMS.map(team => `
      <div class="team-card"
           data-team="${team.name}"
           data-type="${type}"
           onclick="toggleTeamSelection('${team.name}', '${type}', this)"
           role="button"
           tabindex="0"
           aria-label="${team.name}"
           title="${team.name}${team.host ? ' (Host)' : ''}">
        <span class="team-flag">${team.flag}</span>
        <span class="team-name">${team.name}${team.host ? ' ★' : ''}</span>
      </div>
    `).join('');
  });
  if (typeof updateDependentGrids === 'function') updateDependentGrids();
}

// ── TEAM SELECTION TOGGLE ────────────────────────────────────────────
function toggleTeamSelection(teamName, type, cardEl) {
  const maxMap = { SF: 4, Fin: 2, Champ: 1, RU: 1, Third: 1 };
  const selectionKey = {
    SF:    'semifinalists',
    Fin:   'finalists',
    Champ: 'champion',
    RU:    'runnerUp',
    Third: 'thirdPlace'
  }[type];

  const max = maxMap[type];
  const isSingle = max === 1;

  if (isSingle) {
    // Deselect previous
    const prevGrid = document.getElementById(`teamsGrid${type}`);
    if (prevGrid) {
      prevGrid.querySelectorAll('.team-card.selected').forEach(c => c.classList.remove('selected'));
    }
    PredState.selections[selectionKey] = teamName;
    cardEl.classList.add('selected', 'just-selected');
    setTimeout(() => cardEl.classList.remove('just-selected'), 400);
  } else {
    const arr = PredState.selections[selectionKey];
    const idx = arr.indexOf(teamName);
    if (idx > -1) {
      arr.splice(idx, 1);
      cardEl.classList.remove('selected');
    } else {
      if (arr.length >= max) {
        showMaxWarning(type, max);
        cardEl.classList.add('shake');
        setTimeout(() => cardEl.classList.remove('shake'), 400);
        return;
      }
      arr.push(teamName);
      cardEl.classList.add('selected', 'just-selected');
      setTimeout(() => cardEl.classList.remove('just-selected'), 400);
    }
    PredState.selections[selectionKey] = arr;
  }

  updateCounters();
  hideError(`${type.toLowerCase()}Err`);
  if (typeof updateDependentGrids === 'function') updateDependentGrids();
}

function showMaxWarning(type, max) {
  const labels = { SF: 'semi-finalists', Fin: 'finalists', Champ: 'champion', RU: 'runner-up', Third: 'third place' };
  Swal.fire({
    toast: true,
    position: 'top',
    icon: 'warning',
    title: `You can only pick ${max} ${labels[type] || 'team'}!`,
    showConfirmButton: false,
    timer: 2000,
    background: 'rgba(13,27,42,0.98)',
    color: '#F0F4FF',
    iconColor: '#D4AF37'
  });
}

// ── UPDATE COUNTERS ──────────────────────────────────────────────────
function updateCounters() {
  const s = PredState.selections;
  const setCount = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };
  setCount('sfCount', s.semifinalists.length);
  setCount('finCount', s.finalists.length);
  setCount('champCount', s.champion ? 1 : 0);
  setCount('ruCount', s.runnerUp ? 1 : 0);
  setCount('thirdCount', s.thirdPlace ? 1 : 0);
}

// ── TEAM SEARCH FILTER ───────────────────────────────────────────────
function filterTeams() {
  const query = document.getElementById('teamSearch')?.value.toLowerCase().trim() || '';
  const grid  = document.getElementById('teamsGridSF');
  if (!grid) return;
  grid.querySelectorAll('.team-card').forEach(card => {
    const teamName = card.dataset.team.toLowerCase();
    card.classList.toggle('hidden', !teamName.includes(query));
  });
}

// ── CHOICES.JS INIT ──────────────────────────────────────────────────
function initChoicesDropdowns() {
  const bootEl  = document.getElementById('goldenBoot');
  const ballEl  = document.getElementById('goldenBall');
  const gloveEl = document.getElementById('goldenGlove');
  const tbEl    = document.getElementById('tbFirstScorer');

  const choicesConfig = {
    searchEnabled: true,
    searchPlaceholderValue: 'Type player name...',
    itemSelectText: '',
    shouldSort: false,
    position: 'bottom',
    classNames: { containerOuter: 'choices' }
  };

  
  if (tbEl && !PredState.choicesInstances.tbScorer) {
    populateSelect(tbEl, PLAYERS);
    PredState.choicesInstances.tbScorer = new Choices(tbEl, choicesConfig);
  }
}

function populateSelect(el, items) {
  items.forEach(item => {
    const opt = document.createElement('option');
    opt.value = item;
    opt.textContent = item;
    el.appendChild(opt);
  });
}

// ── WIZARD NAVIGATION ────────────────────────────────────────────────
function wizardNext(currentStep) {
  if (!validateStep(currentStep)) return;
  goToStep(currentStep + 1);
}

function wizardPrev(currentStep) {
  goToStep(currentStep - 1);
}

function goToStep(targetStep) {
  const current = document.getElementById(`wizardStep${PredState.currentStep}`);
  const target  = document.getElementById(`wizardStep${targetStep}`);
  if (!target) return;

  if (current) {
    current.classList.remove('active-step');
    current.style.animation = 'fadeInDown 0.3s ease reverse forwards';
    setTimeout(() => { current.style.animation = ''; }, 300);
  }

  PredState.currentStep = targetStep;
  target.classList.add('active-step');
  target.style.animation = 'fadeInUp 0.4s ease forwards';

  updateProgressBar(targetStep);
  window.scrollTo({ top: document.getElementById('section-predict')?.offsetTop - 80 || 0, behavior: 'smooth' });

  // If going to review step, build the review
  if (targetStep === 4) buildReview();
}

// ── PROGRESS BAR ─────────────────────────────────────────────────────
function updateProgressBar(step) {
  const pct   = Math.round(((step - 1) / 4) * 100);
  const fill  = document.getElementById('progressBarFill');
  const text  = document.getElementById('progressText');
  const labels = ['', 'Your Details', 'Tournament Predictions', 'Individual Awards', 'Review & Submit'];
  const steps  = document.querySelectorAll('.prog-step');
  const lines  = document.querySelectorAll('.prog-line');

  if (fill) fill.style.width = pct + '%';
  if (text) text.textContent = `STEP ${step} OF 4 — ${labels[step]}`;

  steps.forEach((s, i) => {
    s.classList.remove('active', 'completed');
    if (i + 1 === step)    s.classList.add('active');
    if (i + 1 < step)      s.classList.add('completed');
  });
  lines.forEach((l, i) => {
    l.classList.toggle('completed', i < step - 1);
  });
}

// ── VALIDATION ───────────────────────────────────────────────────────
function validateStep(step) {
  clearAllErrors();
  let valid = true;

  if (step === 1) {
    const name  = document.getElementById('fullName')?.value.trim()  || '';
    const age   = parseInt(document.getElementById('age')?.value)     || 0;
    const house = document.getElementById('houseName')?.value.trim()  || '';
    const ward  = document.getElementById('ward')?.value              || '';
    const phone = document.getElementById('phone')?.value.trim()      || '';

    if (!name)              { showError('fullNameErr', 'Please enter your full name.'); valid = false; }
    if (!age || age < 5 || age > 100) { showError('ageErr', 'Please enter a valid age (5–100).'); valid = false; }
    if (!house)             { showError('houseNameErr', 'Please enter your house name.'); valid = false; }
    if (!ward)              { showError('wardErr', 'Please select your ward.'); valid = false; }
    if (!phone || !/^[0-9]{10}$/.test(phone)) { showError('phoneErr', 'Please enter a valid 10-digit phone number.'); valid = false; }

    if (valid) {
      PredState.form = {
        fullName: name, age, houseName: house, ward,
        phone, email: document.getElementById('email')?.value.trim() || ''
      };
    }
  }

  if (step === 2) {
    const s = PredState.selections;
    if (s.semifinalists.length < 4) { showError('sfErr', 'Please pick exactly 4 semi-finalists.'); valid = false; }
    if (s.finalists.length < 2)     { showError('finErr', 'Please pick exactly 2 finalists.'); valid = false; }
    if (!s.champion)                 { showError('champErr', 'Please pick the champion.'); valid = false; }
    if (!s.runnerUp)                 { showError('ruErr', 'Please pick the runner-up.'); valid = false; }
    if (!s.thirdPlace)               { showError('thirdErr', 'Please pick the 3rd place team.'); valid = false; }
  }

  if (step === 3) {
    const boot  = document.getElementById('goldenBoot')?.value  || '';
    const ball  = document.getElementById('goldenBall')?.value  || '';
    const glove = document.getElementById('goldenGlove')?.value || '';
    const goals = document.getElementById('tbGoals')?.value     || '';

    if (!boot)  { showError('goldenBootErr',  'Please select the Golden Boot winner.'); valid = false; }
    if (!ball)  { showError('goldenBallErr',  'Please select the Golden Ball winner.'); valid = false; }
    if (!glove) { showError('goldenGloveErr', 'Please select the Golden Glove winner.'); valid = false; }
    if (!goals || isNaN(parseInt(goals))) { showError('tbGoalsErr', 'Please enter a number for goals (tie-breaker).'); valid = false; }

    if (valid) {
      PredState.awards = {
        goldenBoot:      boot,
        goldenBall:      ball,
        goldenGlove:     glove,
        tbGoals:         parseInt(goals),
        tbFirstScorer:   document.getElementById('tbFirstScorer')?.value    || '',
        tbFirstMinute:   document.getElementById('tbFirstMinute')?.value    || ''
      };
    }
  }

  if (!valid) {
    // Scroll to first error
    const firstErr = document.querySelector('.field-error.show');
    if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  return valid;
}

function showError(id, msg) {
  const el = document.getElementById(id);
  if (el) { el.textContent = msg; el.classList.add('show'); }
}
function hideError(id) {
  const el = document.getElementById(id);
  if (el) { el.textContent = ''; el.classList.remove('show'); }
}
function clearAllErrors() {
  document.querySelectorAll('.field-error').forEach(el => {
    el.textContent = '';
    el.classList.remove('show');
  });
}

// ── BUILD REVIEW SCREEN ──────────────────────────────────────────────
function buildReview() {
  const s = PredState.selections;
  const f = PredState.form;
  const a = PredState.awards;

  const reviewData = [
    { label: '👤 Full Name',         value: f.fullName },
    { label: '🎂 Age',               value: f.age },
    { label: '🏠 House Name',        value: f.houseName },
    { label: '📍 Ward',              value: f.ward },
    { label: '📞 Phone',             value: f.phone },
    { label: '📧 Email',             value: f.email || '—' },
    { label: '🏆 Champion',          value: teamWithFlag(s.champion) },
    { label: '🥈 Runner-Up',         value: teamWithFlag(s.runnerUp) },
    { label: '🥉 3rd Place',         value: teamWithFlag(s.thirdPlace) },
    { label: '⭐ Finalists',         value: s.finalists.map(teamWithFlag).join(', ') || '—' },
    { label: '🏟️ Semi-finalists',   value: s.semifinalists.map(teamWithFlag).join(', ') || '—' },
    { label: '👟 Golden Boot',       value: a.goldenBoot   || '—' },
    { label: '⚽ Golden Ball',       value: a.goldenBall   || '—' },
    { label: '🧤 Golden Glove',      value: a.goldenGlove  || '—' },
    { label: '🔢 Goals (TB)',        value: a.tbGoals      || '—' },
    { label: '🎯 Who will score the first goal in the final match (TB)', value: a.tbFirstScorer || '—' },
    { label: '⏱️ In final match in which minute the first goal will occure (TB)', value: a.tbFirstMinute || '—' },
  ];

  const el = document.getElementById('reviewContent');
  if (!el) return;
  el.innerHTML = reviewData.map(item => `
    <div class="review-item">
      <div class="review-item-label">${item.label}</div>
      <div class="review-item-value">${item.value}</div>
    </div>
  `).join('');
}

function teamWithFlag(teamName) {
  if (!teamName) return '—';
  const team = TEAMS.find(t => t.name === teamName);
  return team ? `${team.flag} ${team.name}` : teamName;
}

// ── SUBMIT PREDICTION ────────────────────────────────────────────────
async function submitPrediction() {
  if (PredState.isSubmitting) return;

  if (Date.now() > PREDICTION_DEADLINE) {
    Swal.fire({
      icon: 'error',
      title: 'Contest Closed',
      text: 'The entry deadline has passed. No more predictions can be submitted.',
      confirmButtonText: 'OK'
    });
    showPredictionClosed();
    return;
  }

  // Validate declaration
  const declared = document.getElementById('declarationCheck')?.checked;
  if (!declared) {
    showError('declarationErr', 'Please confirm the declaration to proceed.');
    return;
  }

  PredState.isSubmitting = true;
  const btn = document.getElementById('submitBtn');
  if (btn) btn.classList.add('loading');

  const payload = {
    ...PredState.form,
    ...PredState.selections,
    ...PredState.awards,
    semifinalists: PredState.selections.semifinalists.join(', '),
    finalists:     PredState.selections.finalists.join(', '),
    submittedAt:   new Date().toISOString(),
    timezone:      Intl.DateTimeFormat().resolvedOptions().timeZone
  };

  try {
    const result = await FIFA_API.submitPrediction(payload);

    if (result.success) {
      showSuccessScreen(result.entryId);
    } else if (result.error === 'duplicate') {
      Swal.fire({
        icon: 'error',
        title: 'Already Submitted!',
        html: 'A prediction with this phone number already exists.<br>Only one entry per participant is allowed.',
        confirmButtonText: 'OK',
      });
    } else {
      throw new Error(result.message || 'Submission failed. Please try again.');
    }
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Submission Failed',
      html: `<p>${err.message || 'Unable to connect. Please check your connection and try again.'}</p>`,
      confirmButtonText: 'Try Again',
    });
  } finally {
    PredState.isSubmitting = false;
    if (btn) btn.classList.remove('loading');
  }
}

// ── SUCCESS SCREEN ───────────────────────────────────────────────────
function showSuccessScreen(entryId) {
  // Hide all wizard steps
  document.querySelectorAll('.wizard-step').forEach(s => s.classList.remove('active-step'));

  // Show success
  const success = document.getElementById('wizardSuccess');
  if (success) {
    success.classList.add('active-step');
    success.style.animation = 'zoomIn 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards';
  }

  // Show entry ID
  const idEl = document.getElementById('successId');
  if (idEl && entryId) idEl.textContent = `Entry ID: ${entryId}`;

  // Trigger confetti
  launchConfetti();

  // Animate success icon
  const icon = document.querySelector('.success-icon');
  if (icon) {
    setTimeout(() => icon.classList.add('animate'), 300);
  }

  // Scroll to top of section
  const section = document.getElementById('section-predict');
  if (section) section.scrollIntoView({ behavior: 'smooth' });
}

function launchConfetti() {
  if (typeof confetti !== 'undefined') {
    // Gold confetti burst
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#D4AF37', '#F0D060', '#A88B1E', '#ffffff', '#FFD700']
    });
    setTimeout(() => confetti({
      particleCount: 80,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.6 },
      colors: ['#D4AF37', '#F0D060', '#ffffff']
    }), 300);
    setTimeout(() => confetti({
      particleCount: 80,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.6 },
      colors: ['#D4AF37', '#F0D060', '#ffffff']
    }), 600);
  }
}

// ── EXPOSE ───────────────────────────────────────────────────────────
window.toggleTeamSelection = toggleTeamSelection;
window.filterTeams         = filterTeams;
window.wizardNext          = wizardNext;
window.wizardPrev          = wizardPrev;
window.submitPrediction    = submitPrediction;
window.TEAMS               = TEAMS;
window.PLAYERS             = PLAYERS;
window.GOALKEEPERS         = GOALKEEPERS;
window.PredState           = PredState;

// Cascade visibility logic
function deselectTeam(teamName, type) {
  const selectionKey = {
    SF:    'semifinalists',
    Fin:   'finalists',
    Champ: 'champion',
    RU:    'runnerUp',
    Third: 'thirdPlace'
  }[type];
  
  const isSingle = (type === 'Champ' || type === 'RU' || type === 'Third');
  
  if (isSingle) {
    if (PredState.selections[selectionKey] === teamName) {
      PredState.selections[selectionKey] = null;
    }
  } else {
    const arr = PredState.selections[selectionKey];
    if (arr) {
      const idx = arr.indexOf(teamName);
      if (idx > -1) arr.splice(idx, 1);
    }
  }
  
  const card = document.querySelector('#teamsGrid' + type + ' .team-card[data-team="' + teamName + '"]');
  if (card) card.classList.remove('selected');
  updateCounters();
}

function updateDependentGrids() {
  const s = PredState.selections;

  document.querySelectorAll('#teamsGridFin .team-card, #teamsGridThird .team-card').forEach(card => {
    const team = card.getAttribute('data-team');
    if (s.semifinalists.includes(team)) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
      if (card.classList.contains('selected')) {
        const type = card.getAttribute('data-type');
        deselectTeam(team, type);
      }
    }
  });

  document.querySelectorAll('#teamsGridChamp .team-card, #teamsGridRU .team-card').forEach(card => {
    const team = card.getAttribute('data-team');
    if (s.finalists.includes(team)) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
      if (card.classList.contains('selected')) {
        const type = card.getAttribute('data-type');
        deselectTeam(team, type);
      }
    }
  });
}
