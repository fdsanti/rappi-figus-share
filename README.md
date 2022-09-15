# RappiFiguritas

Ir a src/app/app.component.ts y editar las siguientes class variables con la información necesaria:

- telegramTokenFigus
- groupChatIDFigus

en la función ngOnInit(), editar:
- var url (agregar acá la url para el post request. Ej. "https://services.rappi.com.ar/api/cpgs/search/v2/store/184221/products")
- en esta linea cambiar los "---" por el nombre que le quieras dar a donde estas (ej. "casa"):
    source.subscribe(val => this.loadAvailabilityForAll("---", url))
    
  
## Correr el script

Instalar angular, npm, y correrlo con 'ng serve'
