# Guidelines

> [!TIP] Revisa "Projecte_Fase7_Comunicacio_asincrona.pdf" per totes les indicacions i requisits tècnics detallats. Aquest document és la guia principal per a la realització del projecte.


## Requisits tècnics
>[!INFO] Aquesta part avalua RA7: Desenvolupa aplicacions web dinàmiques, reconeixent i aplicant mecanismes de comunicació asíncrona entre client i servidor.

### Estructura i interfície (Front-end)

- **Tecnologies:**  HTML5, CSS i JavaScript.

- **Pàgines i navegació:** L'aplicació ha de tenir un mínim de 10 pàgines connectades mitjançant una barra de navegació (navbar) totalment funcional.

- **Interacció amb el DOM:** Ús extensiu d'esdeveniments (events i listeners) per modificar l'estructura del DOM dinàmicament.

- **Formularis i validacions:** S'han d'incloure formularis per a la introducció de dades. Cal programar el màxim de validacions possibles des de client (camps buits, formats de correu, longitud, etc.) per garantir la integritat de les dades.

- **Usabilitat:** S'han d'aplicar criteris d'usabilitat clars (UI/UX) perquè la navegació sigui intuïtiva.

- **Operacions CRUD:** Heu de tenir en compte que la vostra pàgina ha de gestionar un CRUD sencer. Entorn Node.js i creació de l'API (Back-end simulat)

- **Inicialització:** Cal utilitzar npm init per crear el projecte i generar l'arxiu package.json de cara a una correcta detecció i gestió de dependències.

- **Framework:** Configuració d'un servidor utilitzant Node.js i Express.js per construir una API REST. Instal·lació de les dependències necessàries.

- **Endpoints:** Cal dissenyar i desenvolupar els endpoints que gestionin les rutes HTTP per a les operacions CRUD (GET, POST, PUT, DELETE) sobre un arxiu local tipus db.json. Aquests endpoints han de treballar sota l'arquitectura REST retornant la informació en format JSON.

### Comunicació asíncrona
- **Consum de l'API:** El vostre Front-end s'ha de connectar a la vostra pròpia API utilitzant el mètode fetch().

- **Tractament de promeses:** S'han d'efectuar operacions asíncrones per no bloquejar el fil d'execució (Event Loop), utilitzant correctament les promeses amb mètodes clàssics (.then, .catch) o bé amb la sintaxi moderna Async/Await.

### Estructura proyecte 
- **Organització de fitxers:** Es **obligatori** una estructura clara i organitzada per al projecte, amb carpetes separades per a components, estils, scripts, dades etc...

### Requisits de sostenibilitat
El disseny, propòsit i funcionament de la vostra aplicació web ha d'estar estretament vinculat a un ODS (Objectiu de Desenvolupament Sostenible) de la vostra elecció. 
- #### RA1 (Identificació ASG i marcs internacionals) 
    - **Què vol dir:** Tota acció té un impacte en tres nivells: ambiental (natura), social (persones) i governança (com s'organitzen les entitats).Això es coneix com a ASG. A més, hi ha els Objectius de Desenvolupament Sostenible (ODS) de l'ONU per guiar-nos.
    - **Què has de fer:** Has de triar un ODS per al teu projecte. A la teva aplicació web hi ha d'haver una pàgina o secció que expliqui clarament quin ODS has escollit, en què consisteix i de quina manera la teva aplicació té un impacte positiu a nivell ambiental, social i/o de governança.

- #### RA2 (Caracterització de reptes i accions)
    - **Què vol dir:** La tecnologia serveix per resoldre problemes reals. Cal saber identificar què està fallant en el nostre entorn per poder aportar una solució.
    - **Què has de fer:** A la teva web has de descriure un problema concret relacionat amb l'ODS que has triat (per exemple: la contaminació dels cotxes, l'excés de plàstic, la bretxa digital...). Tot seguit, has d'explicar com les funcionalitats de la teva aplicació web ajuden a minimitzar aquest problema.

- #### RA3 (Criteris en l'acompliment professional)
    - **Què vol dir:** No només importa que la teva aplicació sigui sostenible, sinó com tu, com a desenvolupador/a web, treballes en el teu dia a dia per minimitzar el teu impacte.
    - **Què has de fer:** En una secció de la web, has d'enumerar quines pràctiques sostenibles has aplicat durant la creació d'aquest projecte. Per exemple: ús d'eines col·laboratives al núvol per evitar desplaçaments, apagar els ordinadors en lloc de deixar-los en suspensió, no imprimir codi ni apunts en paper, etc.

- #### RA4 (Productes i economia circular)
    - **Què vol dir:** L'economia circular es basa en compartir, llogar, reutilitzar, reparar o reciclar materials per estendre el seu cicle de vida.
    - **Què has de fer:** El teu sistema de gestió de dades (el CRUD que faràs amb l'API REST) ha de servir per gestionar un servei que allargui la vida d'alguna cosa o eviti el consum innecessari. No facis una botiga per "comprar coses noves"; fes una plataforma d'intercanvi, lloguer o reciclatge.
- #### RA5 (Activitats sostenibles i impacte mediambiental)
    - **Què vol dir:** La tecnologia també contamina. Els servidors consumeixen energia i les webs pesades fan gastar més bateria i dades.
    - **Què has de fer:** Has d'aplicar tècniques de programació web eficient. Has d'incloure (i explicar a la web) accions com: optimitzar el pes de les imatges, fer un codi net sense peticions innecessàries a l'API per estalviar trànsit de xarxa, o implementar un "Mode Fosc" (Dark Mode) que estalvia energia en pantalles OLED.
    
- #### RA6 (Pla de sostenibilitat empresarial)
    - **Què vol dir:** Fixar-se en com ho fan les empreses tecnològiques del món real per ser més ecològiques i ètiques.
    - **Què has de fer:** Has de destinar una de les 10 pàgines de la teva web a analitzar una empresa real del sector tecnològic. Hauràs de buscar el seu informe de sostenibilitat a internet i resumir quines accions fan pel medi ambient, quins són els seus grups d'interès (treballadors, clients, comunitat local) i com mesuren el seu impacte.
