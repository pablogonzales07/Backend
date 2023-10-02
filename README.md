# PROYECTO BACKEND CODERHOUSE

Bienvenidos al proyecto final que realice para el curso de backend de coderhouse en donde se nos pidio desarrollar un servidor de un e-commerce. Al ser un curso de backend el foco esta puesto en el back, por lo que el codigo hecho de front tiene muchos detalles para corregir en cuanto a optimizacion y escabilidad.

## OBJETIVOS:

- Mi objetivo principal fue poder comprender cada tema visto a lo largo del curso por lo que trate de incluir la mayoria de los mismos en el proyecto
 
## HERRAMIENTAS QUE UTILICE:

- bcrypt V: 5.1.0 : Importantisimo para el proceso de autenticacion del usuario ya que nos permite poder hacer un encriptado de password mas rapido y posteriormente hacer una comparacion de la password hasheada con la ingresada por el user

- express V: 4.18.2 : Corazon del proyecto ya que el servidor esta desarrollado a partir del mismo

- express-handlebars V: 7.0.7: Al ser un curso de backend decidi aprovechar que se nos enseño handlebars para renderizar mis vistas a partir de este motor de plantilla.

- jsonwebtoken V: 9.0.0: En el curso se nos enseñaron dos formas de mantener el ciclo de vida de un usuario en el sitio. Yo decidi utilizar esta herramienta ya que me parecio la mas segura y de mejor performance para mi servidor

- mongoose V:7.1.1: Al usar mongoDB como base de datos para mi proyecto, necesite mongoose para poder conectarme con la misma

- mongoose-paginate-v2: V: 1.7.1: Cuando se nos enseño mongoose se nos enseñaron muchas funcionalidades que ofrece el mismo, entre ellas la PAGINACION, la cual me parecion muy util por lo que la incui en mi ruta de productos

- multer: V: 1.4.5-lts.1: La utilice para poder manejar archivos en las peticiones

- nodemailer: V: 6.9.4: La utilice para el sistema de mailing en mi server

- passport: V: 0.6.0: Se nos enseño el mismo para tener un codigo mas limpio en los procesos de autenticacion

- passport-github2: V:0.1.12: Se nos enseño la autenticacion por terceros a traves de github

- passport-local: V:1.0.0 : Fundamental para trabajar con passport, ya que nos permite trabajar con "estrategias" de autenticacion

- passport-jwt: V: 4.0.1: Como decidi tranbajar con JWT, utilice esta estrategia de passport para trabajar con el mismo


#### ACLARACION: 
A lo largo del curso se nos enseñaron muchas herrmientas mas, como herramientas de testing, logueo, documentacion, manejo de sessions, etc.

## ENDPOINTS
A continuacion dejo una breve descripcion de cada ruta que inclui en el proyecto con el fin de hacer sencilla su revisión:

### PRODUCTS:
En el curso se nos enseño a crear un middleware para el manejo de errores, no era obligacion integrarlo pero decidi implementarlo en estos endpoints con el fin de ponerlo en practica y ya que tambien me parecio una forma de mejorar la performance de mi sitio por lo que mi idea es poder incluirlas en todo el proyecto a fututp

```http
  GET /api/products
```
| Parametro | Description                       |
| :-------- | :-------------------------------- |
| -      | Envia todos los productos existentes|

#### ACLARACIONES:
- Como nombre anteriormente utilice en esta ruta la paginacion de mongoose por lo que envio ademos de los productos, el resto de las propiedades que brinda esta funcionalidad
- Al hacer la peticion el usuario puede hacer uso de las funcionalidades de la paginacion a traves de query params:
    - limit: Limite de productos a entregar
    - page: Numero de pagina a entregar
    - order: Orden de los productos acorde al precio("asc" o "desc")
- El usuario puede eligir un tipo de filtro al hacer la peticion a traves del body:
    - status: disponibilidad(true o false)
    - category: categoria en especial
    - El cliente puede elegir tambien un filtro en especial(el filtro tiene que ser de un campo pertenciente a los productos)
```http
  POST /api/products
```
| Parametro | Description                       |
| :-------- | :-------------------------------- |
| -         | Agrega un producto                |

#### VALIDACIONES:
- El producto debe contar con todos los campos obligatorios(title, description, code, price, status, stock, category, img)
- El campo "stock" no debe ser menor a 0
- El campo "code" del producto no debe coincidir con ningun otro existente
- Usuarios de rol "user" no pueden crear productos
- Usuarios de rol "premium" deben colocar obligatoriamente su email(no otro) al crear el producto en el campo "owner"
- El email de campo "owner" debe ser obligatoriamente un email de un usuario existente

```http
  PUT /api/products/:pid
```

| Parametro | Description                       |
| :-------- | :-------------------------------- |
| -pid: ID del producto(obligatorio)          | Actuliza el producto seleccionado |

#### VALIDACIONES:
- El ID del producto enviado debe coincidir con un producto existente
- No se puede modificar el campo stock a un numero menor que 0
- Los usuarios de rol "premium" solo pueden modificar sus productos pero no el campo "owner"
- Usuarios de rol "user" no pueden modificar productos

```http
  DELETE /api/products/:pid
```
| Parametro | Description                       |
| :-------- | :-------------------------------- |
| -pid: ID del producto(obligatorio)         | Elimina el producto seleccionado           |

#### VALIDACIONES:
- El ID del producto enviado debe coincidir con un producto existente
- Usuarios de rol "premium" solo pueden eliminar productos que le pertencen
- Usuarios de rol "user" no pueden eliminar productos

### CARTS:

```http
  POST /api/carts
```
| Parametro | Description                       |
| :-------- | :-------------------------------- |
| -       | Crea un nuevo carrito             |

```http
  GET /api/carts/:cid
```

| Parametro | Description                       |
| :-------- | :-------------------------------- |
| -   cid: ID del carrito(obligatorio)    | Devuelve los productos del carrito seleccionado  |

#### VALIDACIONES:
- El ID del carrito debe coincidir con un carrito existente

```http
  POST /api/carts/:cid/product/:pid
```

| Parametro | Description                       |
| :-------- | :-------------------------------- |
| -   cid: ID del carrito(obligatorio) pid: ID del producto(obligatorio)    | Agrega productos al carrito seleccionado             |

#### VALIDACIONES:
- El ID del carrito debe coincidir con un carrito existente
- El ID del producto debe coincidir con un producto existente 
- Usuarios de rol "premium" o "admin" no pueden agregar productos que le pertenezcan

```http
  DELETE /api/carts/:cid/product/:pid
```

| Parametro | Description                       |
| :-------- | :-------------------------------- |
| -   cid: ID del carrito(obligatorio) pid: ID del producto(obligatorio)    | Elimina productos del carrito seleccionado             |

#### VALIDACIONES:
- El ID del carrito debe coincidir con un carrito existente
- El ID del producto debe coincidir con un producto existente en el carrito

```http
  PUT /api/carts/:cid
```

| Parametro | Description                       |
| :-------- | :-------------------------------- |
| -   cid: ID del carrito(obligatorio) | Actualiza los productos del carrito|

#### VALIDACIONES:
- El ID del carrito debe coincidir con un carrito existente

```http
  PUT /api/carts/:cid/products/:pid
```

| Parametro | Description                       |
| :-------- | :-------------------------------- |
| -   cid: ID del carrito(obligatorio) pid: ID del producto(obligatorio) | Actualiza la cantidad del producto seleccionado|

#### VALIDACIONES:
- El ID del carrito debe coincidir con un carrito existente
- El ID del producto debe coincidir con un producto existente en el carrito
- Debe enviarse el campo "quantity"
- El valor enviado en el campo "quantity" no debe coincir con el el valor actual

```http
  DELETE /api/carts/:cid
```

| Parametro | Description                       |
| :-------- | :-------------------------------- |
| -   cid: id del carrito(obligatorio)  | Elimina todos los productos del carrito seleccionado|

#### VALIDACIONES:
- El ID del carrito debe coincidir con un carrito existente

```http
  GET /api/carts/propertiesProducts/:cid
```

| Parametro | Description                       |
| :-------- | :-------------------------------- |
| -   cid: id del carrito(obligatorio)  | Trae todos los productos del carrito seleccionado con TODAS sus propiedades|

#### VALIDACIONES:
- El ID del carrito debe coincidir con un carrito existente

```http
  PUT /api/carts/:cid/purchase
```

| Parametro | Description                       |
| :-------- | :-------------------------------- |
| -   cid: ID del carrito(obligatorio)  | Devuelve los productos que no estan en stock, los que si estan(actualiza el stock) y el precio total del carrito(de los que si estaban en stock)|

#### VALIDACIONES:
- El ID del carrito debe coincidir con un carrito existente

### USERS:

```http
  GET /api/users
```

| Parametro | Description                       |
| :-------- | :-------------------------------- |
| -     | Devuelve la informacion principal de los usuarios|

#### VALIDACIONES:
- Solo puede acceder a dicha informacion el usuario con rol "admin"


```http
  GET /api/users/userProfile
```

| Parametro | Description                       |
| :-------- | :-------------------------------- |
| -     | Devuelve la informacion del usuario DE LA SESION ACTUAL|

```http
  GET /api/users/:uid
```

| Parametro | Description                       |
| :-------- | :-------------------------------- |
| - uid: ID del usuario(obligatorio)  | Devuelve los datos del usuario seleccionado por el id|

#### VALIDACIONES:
- El ID del usuario ingresado debe coincidir con el de un usuario existente
- Solo puede acceder a dicha informacion el usuario con rol "admin"

```http
  PUT /api/users/premium/:uid
```

| Parametro | Description                       |
| :-------- | :-------------------------------- |
| - uid: ID del usuario(obligatorio)  | Actualiza el rol del usuario a "premium"|

#### VALIDACIONES:
- El ID del usuario ingresado debe coincidir con el de un usuario existente
- No pueden acceder aquellos usuarios que ya son "premium"
- El usuario debe contar con los documentos obligatorios(userDni, proofAddress, accountStatus) para poder solicitar el cambio

```http
  PUT /api/users/changeRoleUser/:uid
```

| Parametro | Description                       |
| :-------- | :-------------------------------- |
| - uid: ID del usuario(obligatorio)  | Actualiza el rol del usuario|

#### VALIDACIONES:
- El ID del usuario ingresado debe coincidir con el de un usuario existente
- Solo puede acceder el usuario con rol "admin"
- Solo puede cambiarse a los roles con los que cuenta el sitio("ADMIN", "PREMIUM", "USER")
- El rol del usuario no tiene que coincidir con el enviado

```http
  PUT /api/users/codeUserAplicated
```

| Parametro | Description                       |
| :-------- | :-------------------------------- |
| -  | Consume el codigo de descuento del usuario y lo cambia a uno nuevo|

#### VALIDACIONES:
- El codigo debe coincidir con campo "discountCode" del user

```http
  POST /api/users/:uid/documents
```

| Parametro | Description                       |
| :-------- | :-------------------------------- |
| - uid: ID del usuario(obligatorio)   | Recibe los documentos del usuario y agrega una referencia del mismo en la base de datos |

#### VALIDACIONES:
- El ID del usuario ingresado debe coincidir con el de un usuario existente

```http
  DELETE /api/users/:uid
```

| Parametro | Description                       |
| :-------- | :-------------------------------- |
| - uid: ID del usuario(obligatorio)   | Elimina al usuario seleccionado |

#### VALIDACIONES:
- El ID del usuario ingresado debe coincidir con el de un usuario existente
- Solo puede acceder el usuario con rol "admin"

### SESSIONS:

```http
  POST /api/sessions/register
```

| Parametro | Description                       |
| :-------- | :-------------------------------- |
| -   | Crea un usuario |

#### VALIDACIONES:
- Se deben incluir todos los campos obligatorios(first_name, last_name, email, password, age)
- El usuario debe ser mayor de edad
- El email debe ser un email valido(terminar en hotmail.com, yahoo.com, gmail.com, outlook.com)
- El email no debe coincidir con ningun otro usuario en la base de datos
- La contraseña debe cumplir con los siguientes requisitos: 
  - Contener mas de 8 digitos
  - Contener al menos una mayuscula
  - Contener al menos un caracter especial
  - Contener al menos un numero

```http
  POST /api/sessions/login
```
| Parametro | Description                       |
| :-------- | :-------------------------------- |
| -   | Inicia la sesion del usuario|

```http
  GET /api/sessions/github
```

| Parametro | Description                       |
| :-------- | :-------------------------------- |
| -   | Redirige a la ruta de logueo por github|

```http
  GET /api/sessions/githubCallback
```

| Parametro | Description                       |
| :-------- | :-------------------------------- |
| -   |Inicia la sesion del usuario a traves de github|

```http
  POST /api/sessions/logout
```

| Parametro | Description                       |
| :-------- | :-------------------------------- |
| -   |Finzaliza la sesion del usuario|

```http
  POST /api/sessions/restoreRequest
```

| Parametro | Description                       |
| :-------- | :-------------------------------- |
| -   | Genera un nuevo token del usuario(para tener control de el) y envia un email(al usuario que solicita el cambio) de peticion de cambio de contraseña del mismo|

```http
  POST /api/sessions/restorePassword
```

| Parametro | Description                       |
| :-------- | :-------------------------------- |
| -   | Actualiza la contraseña del usuario|

### TICKETS:

```http
  POST /api/tickets
```

| Parametro | Description                       |
| :-------- | :-------------------------------- |
| -   | Crea un ticket de compra|

#### VALIDACIONES:
- Deben enviarse todos los campos obligatorios(finalPrice, emailUser, code, date)
- El codigo enviado no debe ser igual al de ningun otro ticket existente

```http
  GET /api/tickets/:uid
```
| Parametro | Description                       |
| :-------- | :-------------------------------- |
| - uid: ID del usuario(obligatorio)  | Trae todos los tickets de compra del usuario seleccionado|

## CONCLUSION:
En el curso se nos enseñaron muchas herramientas que llevan a construir una API lo mas solida posible. Este fue mi primer proyecto de backend, por lo que se que aun me queda mucho por aprender. Antes de este curso tenia pensado seguir mi carrear como frontend ya que no tenia conocimiento alguno sobre el back. Gracias a este curso me pude dar cuenta que el backend me llama mucho mas la atencion por lo que este proyecto va a ser el inicio de mi carrera como backend ya que piendo aumentar aun mas mis conociemientos y este proyecto lo voy a usar para poder aplicar todo lo que aprenda. Espero que les guste :)
