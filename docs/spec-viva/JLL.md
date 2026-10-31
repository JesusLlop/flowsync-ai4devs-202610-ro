# Spec viva: cuentas y acceso

## Purpose

Define cómo una persona crea su cuenta en FlowSync, inicia y cierra sesión, mantiene la sesión entre visitas y accede a las zonas protegidas y a su perfil. Todas las personas registradas tienen los mismos permisos.

## Requirements

### Requirement: Registro de cuenta
El sistema SHALL permitir crear una cuenta con email, contraseña y confirmación de contraseña. Tras registrarse, la persona SHALL quedar con la sesión iniciada sin pasar por el login.

#### Scenario: Registro correcto
- **WHEN** una persona sin sesión envía un email no registrado, una contraseña válida y una confirmación que coincide
- **THEN** se crea la cuenta
- **AND** la persona queda con la sesión iniciada

#### Scenario: Email ya registrado
- **WHEN** una persona intenta registrarse con un email que ya pertenece a otra cuenta
- **THEN** el registro se rechaza
- **AND** junto al campo email se muestra en castellano que ese email ya está en uso

#### Scenario: Contraseña fuera de longitud
- **WHEN** una persona intenta registrarse con una contraseña de menos de 8 o de más de 32 caracteres
- **THEN** el registro se rechaza
- **AND** junto al campo contraseña se muestra un error en castellano

#### Scenario: Confirmación que no coincide
- **WHEN** una persona intenta registrarse con una confirmación distinta de la contraseña
- **THEN** el formulario no se envía
- **AND** se informa de que las contraseñas no coinciden

### Requirement: Inicio de sesión
El sistema SHALL permitir iniciar sesión con email y contraseña. Ante credenciales incorrectas SHALL dar un único mensaje genérico, sin indicar cuál de los dos datos falla.

#### Scenario: Credenciales correctas
- **WHEN** una persona sin sesión envía el email y la contraseña de una cuenta existente
- **THEN** queda con la sesión iniciada
- **AND** llega a su perfil

#### Scenario: Credenciales incorrectas
- **WHEN** una persona envía un email no registrado o una contraseña incorrecta
- **THEN** no se inicia sesión
- **AND** se muestra el mensaje "El email o la contraseña no son correctos"

#### Scenario: Sesiones simultáneas
- **WHEN** una persona con sesión abierta en un dispositivo inicia sesión en otro
- **THEN** las dos sesiones siguen activas

### Requirement: Pantallas públicas solo para personas sin sesión
El sistema SHALL NOT mostrar las pantallas de login y registro a una persona con sesión iniciada.

#### Scenario: Persona con sesión entra en el login o el registro
- **WHEN** una persona con sesión iniciada navega a `/login` o a `/register`
- **THEN** se la lleva a su perfil

### Requirement: Permanencia de la sesión
El sistema SHALL mantener la sesión entre recargas y cierres del navegador, y SHALL comprobarla con el servidor al arrancar.

#### Scenario: Recarga o reapertura
- **WHEN** una persona con sesión recarga la página o cierra y vuelve a abrir el navegador
- **THEN** sigue con la sesión iniciada

#### Scenario: Comprobación en curso
- **WHEN** la aplicación arranca y la comprobación de la sesión aún no ha terminado
- **THEN** se muestra una pantalla de carga en lugar del contenido protegido

#### Scenario: Sesión rechazada por el servidor
- **WHEN** la aplicación arranca y el servidor rechaza la sesión guardada
- **THEN** la persona queda sin sesión

#### Scenario: Servidor no disponible al arrancar
- **WHEN** la aplicación arranca y la sesión no se puede comprobar por un fallo ajeno a la autenticación
- **THEN** la persona aparece sin sesión
- **AND** se muestra un aviso con el error
- **AND** la sesión guardada se conserva para reintentar al recargar

### Requirement: Cierre de sesión
El sistema SHALL permitir cerrar sesión desde el perfil. El cierre SHALL afectar solo al dispositivo actual.

#### Scenario: Cierre de sesión
- **WHEN** una persona con sesión pulsa "Cerrar sesión" en su perfil
- **THEN** la interfaz pasa a anónima al momento
- **AND** la sesión de ese dispositivo deja de ser válida

#### Scenario: Fallo del servidor al cerrar sesión
- **WHEN** una persona cierra sesión y la llamada al servidor falla
- **THEN** la interfaz pasa igualmente a anónima

#### Scenario: Otras sesiones abiertas
- **WHEN** una persona cierra sesión en un dispositivo y tiene otra sesión abierta en otro
- **THEN** la sesión del otro dispositivo sigue activa

### Requirement: Protección de zonas privadas
El sistema SHALL impedir el acceso a pantallas y operaciones protegidas sin una sesión válida.

#### Scenario: Pantalla protegida sin sesión
- **WHEN** una persona sin sesión navega a una pantalla protegida
- **THEN** se la lleva al login

#### Scenario: Operación protegida sin sesión válida
- **WHEN** se llama a una operación protegida de la API sin una sesión válida
- **THEN** la API la rechaza como no autenticada

#### Scenario: Destino tras iniciar sesión
- **WHEN** una persona inicia sesión después de haber sido llevada al login desde una pantalla protegida
- **THEN** llega a su perfil, no a la pantalla que intentaba abrir

#### Scenario: Dirección desconocida
- **WHEN** una persona navega a una dirección que no existe
- **THEN** se la lleva a su perfil si tiene sesión
- **AND** al login si no la tiene

### Requirement: Permisos iguales para todas las cuentas
El sistema SHALL dar a todas las personas registradas los mismos permisos, sin roles.

#### Scenario: Sin roles
- **WHEN** dos personas registradas cualesquiera inician sesión
- **THEN** ambas tienen acceso a las mismas pantallas y operaciones

### Requirement: Consulta del perfil
El sistema SHALL mostrar a la persona con sesión sus datos de cuenta y SHALL NOT mostrar ni devolver nunca su contraseña.

#### Scenario: Perfil con nombre
- **WHEN** una persona con sesión y con nombre registrado abre su perfil
- **THEN** ve sus iniciales, su nombre, su email y la fecha de alta ("Miembro desde")

#### Scenario: Perfil sin nombre
- **WHEN** una persona con sesión y sin nombre registrado abre su perfil
- **THEN** ve "Sin nombre" en lugar del nombre
- **AND** las iniciales salen de su email

#### Scenario: La contraseña no se expone
- **WHEN** el sistema devuelve los datos de una cuenta en el registro, el login o el perfil
- **THEN** la respuesta no incluye la contraseña

### Requirement: Mensajes de error comprensibles
El sistema SHALL mostrar los errores de validación en castellano junto al campo afectado y SHALL informar cuando no hay conexión con el servidor.

#### Scenario: Error de validación
- **WHEN** el servidor rechaza un formulario de cuenta por un dato no válido
- **THEN** el error aparece en castellano junto al campo correspondiente

#### Scenario: Sin conexión
- **WHEN** no se puede contactar con el servidor
- **THEN** se informa de un error de red
