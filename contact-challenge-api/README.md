# Emergencias Challenge - Full Stack

Este proyecto fue desarrollado como solución al challenge Full Stack de [Emergencias](https://www.emergencias.com.ar/). Consta de una API RESTful desarrollada en Node.js con TypeScript y Express, y una aplicación frontend en React que consume dicha API.

## Autor

Javier Cañas

## Challenge Full Stack Emergencias

Se requiere construir una aplicación completa para la gestión de una agenda de contactos, donde cada contacto puede tener múltiples teléfonos y direcciones, además de actividades asociadas como llamadas, reuniones o correos electrónicos.

### Objetivo

El objetivo del proyecto es implementar una solución full stack que permita:

- Crear, editar, eliminar y visualizar contactos.
- Buscar contactos por email, nombre/apellido o número y tipo de teléfono.
- Asociar múltiples teléfonos y direcciones a un contacto.
- Registrar actividades (llamadas, reuniones, emails) para cada contacto.
- Filtrar actividades por contacto y tipo de actividad.

La base de datos utilizada es SQLite (o Postgres, según la preferencia), y el backend expone una API RESTful que es consumida por el frontend desarrollado en React con TypeScript.

## Backend

El backend está construido con Node.js, Express y TypeScript. Se utiliza SQLite como base de datos y se sigue una arquitectura limpia con separación de responsabilidades.

## Endpoint de métricas

Las métricas se encuentran disponibles en:

http://localhost:8080/metrics

Este endpoint expone datos en formato compatible con Prometheus.

### Endpoints principales

| Método | Ruta                                          | Descripción                            |
| ------ | --------------------------------------------- | -------------------------------------- |
| POST   | `/api/contacts`                               | Crear un nuevo contacto                |
| GET    | `/api/contacts?email=...`                     | Buscar contacto por email              |
| GET    | `/api/contacts?firstName=...&lastName=...`    | Buscar por datos personales            |
| GET    | `/api/contacts?phoneNumber=...&phoneType=...` | Buscar por número y tipo de teléfono   |
| PUT    | `/api/contacts/:id`                           | Editar datos personales de un contacto |
| DELETE | `/api/contacts/:id`                           | Eliminar un contacto                   |
| POST   | `/api/activities`                             | Crear una nueva actividad              |
| GET    | `/api/activities?contactId=...&type=...`      | Buscar actividades por contacto y tipo |

### Instalación y ejecución

```bash
cd contact-challenge-api
npm install
npm run dev
```
