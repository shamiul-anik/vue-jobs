# Technology Stack

## Core
- **Frontend Framework**: Vue.js 3.5.25 (Composition API)
- **Build Tool**: Vite 7.2.7
- **Backend Framework**: Express.js 5.2.1
- **Runtime**: Node.js v22+
- **Database**: SQLite3 5.1.7

## Key Libraries & Tools
### Frontend
- **Routing**: Vue Router 4
- **State Management**: Vue Reactivity API (ref, reactive) - *No Pinia/Vuex*
- **Styling**: Tailwind CSS 4.1.18
- **HTTP Client**: Custom fetch wrapper with interceptors (src/services/httpClient.js)
- **Icons**: FontAwesome

### Backend
- **Security**: helmet, cors, bcryptjs (hashing), express-rate-limit
- **Validation**: express-validator
- **Auth**: jsonwebtoken (JWT), cookie-parser

### DevOps & Testing
- **Containerization**: Docker, Docker Compose
- **Web Server**: Nginx (Alpine)
- **Testing**: Vitest 4.0.16, @vue/test-utils
- **Monitoring**: PostHog-js

## Versions
- **Node**: >= 22
- **NPM**: Managed via package.json
