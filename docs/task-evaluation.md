# Evaluacio global
| Criteri d'avaluació | Puntuació |
|---------------------|-----------|
| Estructura i interfície (Front-end) | /2 |
| Entorn Node.js i creació de l'API (Back-end simulat) | /4 |
| Comunicació asíncrona | /4 |

## Estat actual del projecte (actualitzat)

| Criteri | Estat actual | Autoavaluació orientativa |
|---|---|---|
| Estructura i interfície (Front-end) | 10+ pàgines amb navbar dinàmica, includes reutilitzables, interacció DOM i formularis amb validacions millorades | 2/2 |
| Entorn Node.js i API REST simulada | Servidor Express operatiu amb rutes REST per auth, usuaris, ORGs, events i relacions sobre `data/db.json` | 4/4 |
| Comunicació asíncrona | Consum API amb `fetch` + `async/await` en pàgines de login, registre, perfil, events, ORGs i panells admin/ORG | 4/4 |



### Estructura i interfície (Front-end) - /2

| Nivell | Explicacio | Puntuació |
|--------|------------|-----------|
| Expert | Desenvolupa el mínim de 10 pàgines exigides connectades per una barra de navegació (navbar) totalment funcional. La interacció amb el DOM és dinàmica i extensa mitjançant l'ús d'esdeveniments (listeners). Els formularis inclouen el màxim de validacions possibles des del client per garantir la integritat de les dades. Es gestiona tot un CRUD complet a través de la interfície aplicant criteris d'usabilitat clars (UI/UX) | 2 pts |
| Avançat | Compleix la majoria de pàgines sol·licitades o la navbar té petits defectes. Fa un bon ús del DOM i dels esdeveniments per fer la web dinàmica. S'implementen formularis i validacions, tot i que se'n podria escapar alguna de secundària. La usabilitat i la gestió visual del CRUD són bones generalment | 1,5 pts |
| Intermedi | Falten pàgines o la navegació té errors evidents que dificulten moure's per l'aplicació. La interacció amb el DOM és bàsica. S'han inclòs els formularis però pràcticament no s'han programat validacions de dades des del client. El suport pel CRUD a la interfície està a mitges | 1 pt |
| Novell | Les pàgines són del tot insuficients i la barra de navegació no funciona o no existeix. Poca o nul·la interacció dinàmica. Formularis defectuosos sense restriccions ni validacions per a l'usuari. Sense usabilitat evident. | 0,5 pts |
| No avaluat | No presenta la interfície Front-end, no s'usen les tecnologies requerides (HTML5, CSS, JS), o la feina presentada no permet fer cap avaluació. | 0 pts |


### Entorn Node.js i creació de l'API (Back-end simulat) - /4
| Nivell | Explicacio | Puntuació |
|--------|------------|-----------|
| Expert | Genera el projecte immillorablement amb npm init i l'arxiu package.json. Configura perfectament el servidor Node.js i Express.js amb totes les dependències necessàries. S'han desenvolupat la totalitat dels endpoints per gestionar el CRUD complert (GET, POST, PUT, DELETE) sobre un arxiu db.json local. Totes les operacions retornen eficaçment la informació en format JSON sota arquitectura REST | 4 pts |
| Avançat | Configura de forma adequada el projecte, Node.js i Express.js. Construeix i fa funcionar la majoria dels endpoints per a les rutes de l'arxiu db.json. Gairebé tot el format és REST en JSON, tot i poder presentar algun petit desajust en una ruta o mètode específic. | 3 pts |
| Intermedi | Aconsegueix configurar l'entorn , però el disseny dels endpoints és incomplet (ex: només programa rutes GET i POST) dificultant les operacions sobre db.json. El compliment de l'arquitectura REST és parcial. | 2 pts |
| Novell | Hi ha intents d'inicialitzar l'API, però hi ha errades a les dependències de Node/Express. Els endpoints presenten fallades greus d'execució i no aconsegueixen gestionar cap operació efectiva d'escriptura o esborrat al db.json. | 1 pt |
| No avaluat | L'alumne/a no ha configurat cap entorn Node.js, no hi ha endpoints, o el codi de la part servidor està totalment buit. | 0 pts |

### Comunicació asíncrona - /4

| Nivell | Explicacio | Puntuació |
|--------|------------|-----------|
| Expert | El Front-end consumeix la pròpia API utilitzant el mètode fetch() de manera excel·lent. Les operacions es fan sense bloquejar l'Event Loop utilitzant el tractament de promeses avançat (.then i .catch o Async/Await de forma pulcra). Integra l'asincronia per a cada operació CRUD de forma natural. | 4 pts |
| Avançat | El mètode fetch() està ben utilitzat per al consum de la gran majoria de dades. El tractament de promeses permet continuar amb l'execució del programa correctament, encara que la gestió d'errors (ex. .catch) o algun mètode podria ser optimitzat per a una major fluïdesa. | 3 pts |
| Intermedi | L'aplicació aconsegueix connectar-se a l'API amb fetch() per a funcions bàsiques (ex: només per a llegir dades d'inici) però no per a la resta. L'ús de les promeses o d'Async/Await inclou pràctiques o bloquejos estructurals no aconsellables. | 2 pts |
| Novell | El codi inclou el mètode fetch() però de manera molt pobra, evitant l'obtenció d'informació constant. Mostra incomprensió sobre l'ús d'operacions asíncrones i promeses, generant errors al client o aturades a la pàgina. | 1 pt |
| No avaluat | No fa ús del mètode fetch(), no s'estableix consum de l'API i no existeix gestió asíncrona de dades. | 0 pts |

