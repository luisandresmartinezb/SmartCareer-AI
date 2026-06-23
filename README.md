# 🚀 SmartCareer AI

## 📌 Descripción

**SmartCareer AI** es una plataforma inteligente desarrollada para ayudar a los candidatos a mejorar sus oportunidades laborales mediante el análisis automático de currículums.

La aplicación permite seleccionar una oferta de empleo, subir un CV en formato PDF y obtener:

- Análisis ATS (Applicant Tracking System).
- Puntuación de compatibilidad con la oferta.
- Detección de fortalezas.
- Identificación de puntos de mejora.
- Generación automática de un CV adaptado.
- Generación de una carta de presentación personalizada.
- Simulación del proceso de candidatura.
- Historial de análisis realizados.

El objetivo del proyecto es demostrar el uso conjunto de tecnologías modernas de desarrollo web, arquitectura por capas y bases de datos para construir una solución real orientada al mercado laboral.

---

# Objetivos

- Analizar currículums automáticamente.
- Adaptar el CV a una oferta de empleo concreta.
- Generar documentación profesional para la candidatura.
- Simular procesos reales de selección.
- Mejorar la compatibilidad ATS.
- Aplicar arquitectura profesional Full Stack.
- Utilizar Angular, .NET y SQL Server en una aplicación real.

---

# Arquitectura

El proyecto sigue una arquitectura por capas basada en Clean Architecture.

```text
SmartCareer-AI
│
├── frontend
│   └── Angular
│
├── backend
│   ├── SmartCareer.API
│   ├── SmartCareer.Application
│   ├── SmartCareer.Domain
│   └── SmartCareer.Infrastructure
│
├── database
├── docs
└── deployment
```

---

# Frontend

### Tecnologías utilizadas

- Angular
- TypeScript
- HTML5
- SCSS
- RxJS
- HttpClient

### Funcionalidades

- Selección de ofertas de empleo.
- Subida de CV PDF.
- Análisis ATS.
- Adaptación automática del currículum.
- Generación de carta de presentación.
- Simulación de candidatura.
- Historial de análisis.

---

# ⚙️ Backend

### Tecnologías utilizadas

- .NET 10
- ASP.NET Core Web API
- Entity Framework Core
- SQL Server
- Swagger

### Endpoints principales

#### Obtener historial de análisis

```http
GET /api/CvAnalysis/history
```

#### Guardar análisis ATS

```http
POST /api/CvAnalysis
```

---

# Base de Datos

El proyecto utiliza SQL Server junto con Entity Framework Core.

### Entidades principales

- User
- Curriculum
- CvAnalysis
- JobOffer
- Skill
- Certification

---

# Flujo de Trabajo

1. Seleccionar una oferta de empleo.
2. Subir currículum en PDF.
3. Analizar candidatura.
4. Obtener puntuación ATS.
5. Generar CV adaptado.
6. Generar carta de presentación.
7. Simular candidatura.
8. Guardar análisis en SQL Server.
9. Consultar historial de análisis.

---

# Tecnologías Utilizadas

## Frontend

- Angular
- TypeScript
- HTML5
- SCSS

## Backend

- ASP.NET Core
- Entity Framework Core
- Swagger

## Base de Datos

- SQL Server

## Herramientas

- Visual Studio Code
- Visual Studio
- Git
- GitHub
- Postman
- SQL Server Management Studio

---

# Capturas del Proyecto

## Página principal

_Añadir captura de la pantalla principal._

## Selección de ofertas

_Añadir captura del sistema de ofertas._

## Resultado ATS

_Añadir captura del resultado del análisis._

## Historial

_Añadir captura del historial de análisis._

---

# Instalación

## Clonar repositorio

```bash
git clone https://github.com/TU-USUARIO/SmartCareer-AI.git
```

---

## Frontend

```bash
cd frontend/smartcareer-web

npm install

ng serve
```

Aplicación disponible en:

```text
http://localhost:4200
```

---

## Backend

```bash
cd backend

dotnet restore

dotnet build

dotnet run --project SmartCareer.API
```

API disponible en:

```text
http://localhost:5017
```

Swagger:

```text
http://localhost:5017/swagger
```

---

# Pruebas

### Comprobar API

```text
http://localhost:5017/api/CvAnalysis/history
```

### Comprobar Swagger

```text
http://localhost:5017/swagger
```

### Comprobar Frontend

```text
http://localhost:4200
```

---

# 🔮 Mejoras Futuras

- Integración con LinkedIn.
- Integración con InfoJobs.
- Lectura automática de ofertas reales.
- IA generativa para optimización avanzada de CV.
- Recomendación de certificaciones.
- Exportación profesional de CV en PDF.
- Dashboard de empleabilidad.
- Estadísticas avanzadas ATS.

---

# 👨‍💻 Autor

## Luis Andrés Martínez Berraquero

**Técnico Programador · Full Stack Developer**

### Tecnologías principales

- C#
- ASP.NET Core
- Angular
- TypeScript
- SQL Server
- Java
- Python

### Experiencia

- Desarrollo de software.
- Testing y QA.
- Automatización de procesos.
- Bases de datos.
- Soporte técnico.
- Administración pública.
- Banca.
- Sector asegurador.
- Retail.

---

# 📄 Licencia

Proyecto desarrollado con fines educativos, formativos y de portfolio profesional.

© 2026 Luis Andrés Martínez Berraquero
