# El odio en francés

Web local con cuatro secciones en la landing: inicio, la bronca se comparte, cómo te ves y Tus ediciones. Merch y entradas tienen su página independiente.

Con Node.js instalado, ejecutar `node server.cjs` desde esta carpeta y abrir http://localhost:3000.

Sin dependencias de instalación. Las fuentes de Google son opcionales y cuentan con alternativas locales. La gráfica está construida con Canvas y SVG. Los textos son una propuesta editorial para revisar.

La red de modales incluye introducción, escritura, voces, confirmación, retrato y contexto. Los textos se guardan únicamente en localStorage del navegador (hasta 20). El retrato se puede descargar como PNG. No hay publicación ni backend compartido.

## Cámara en vivo

Hacer mi retrato abre una pantalla con visor 16:9, vista original pequeña, modos Ceniza y Bronca, contraste y grano. Prender cámara solicita acceso únicamente a video. El procesamiento sucede en Canvas dentro del navegador; las imágenes no se suben. Se puede congelar y guardar un PNG. Cerrar la pantalla, cambiar de modal o dejar la pestaña apaga la cámara. Se muestra una composición tipográfica mientras está apagada. El Modo bronca suma una malla de deformación y grafismos originales en blanco, negro y rojo; el efecto se ubica al centrar el rostro o mover el cursor/tocar el visor. No realiza seguimiento facial automático.



## Grafismos y deformación

Los grafismos de handmarks.js usan los doodles originales provistos en “Material/texturas para web”, copiados sin modificaciones a dist/assets/doodles/. Se aplican sobre las fotos y en el puente entre secciones. Los trazos negros se muestran en claro mediante CSS sobre el fondo oscuro. La carpeta conserva los 14 PNG originales para futuras composiciones.

La cámara usa displacement.js para deformar los píxeles con ondas, refracción acanalada y un desgarro móvil. El control Deformación regula la amplitud; cursor y toque desplazan el centro del campo. Ceniza es el tratamiento inicial y Modo bronca usa una malla de deformación localizada y los doodles originales. Probar con una foto usa la imagen de retrato del proyecto, sin acceder a la webcam. Congelar detiene también la deformación y el PNG conserva el tratamiento.


## Red nodal local

Explorar la red abre un mapa de pantalla completa que se recorre arrastrando con mouse o dedo. Se pueden seleccionar registros, filtrar por tópico, acercar/alejar y consultar una lista accesible. La ficha explica cada vínculo por tópico o palabras compartidas.

Crear mi nodo permite escribir una descarga, recibir una sugerencia de tópico y ver las palabras normalizadas antes de guardar. Los términos se agrupan por raíces y sinónimos definidos en network-core.js: por ejemplo cansancio, agotamiento y desgaste se vinculan como desgaste. Las conexiones tienen una regla explícita y no implican análisis semántico por IA.

Se retiró el constructor de pensamientos y sus accesos desde el mapa. Mis pensamientos permite consultar los textos guardados previamente en este navegador; no se borraron los datos existentes.

Hay 14 registros de ejemplo claramente identificados. Los nodos propios y pensamientos se almacenan en este navegador, con topes de 60 y 30 respectivamente; no se comparten entre dispositivos ni personas. La comunidad en línea necesita almacenamiento compartido al publicar.


## Tus ediciones

Nuevo apartado #ediciones en la landing, accesible desde el header y desde el final del retrato. Catálogo editorial inspirado en Figma 156:174, con los 20 PNG originales de la carpeta stencils de Drive. Filtros Palabras/Símbolos y páginas de nueve plantillas.

Aplicar abre el editor A4: hasta 12 piezas, arrastre con mouse/táctil, ajuste con flechas, tamaño y giro, posición, duplicación, orden de capas y deshacer/rehacer. Los límites mantienen las piezas dentro de un margen de 10 mm. Se guarda automáticamente un borrador y se pueden nombrar y guardar hasta ocho ediciones en este navegador, recuperables desde el catálogo. No se publican ni se sincronizan entre dispositivos.

Descarga PDF A4 de una página o PNG de 2480 × 3508 px en negro sobre blanco, sin interfaz ni selecciones. El PDF debe imprimirse al 100%. Se usan los PNG suministrados: ampliar no agrega detalle y no se generan puentes de recorte automáticamente. Los originales permanecen intactos; canvas encuadra la transparencia para editar y exportar.

## CD con tapa

A romperla toda incluye dos previews mediante un selector lateral: CD (con giro) y Tapa. Se conserva la imagen original de la caja mediante un encuadre SVG de sus márgenes transparentes.
