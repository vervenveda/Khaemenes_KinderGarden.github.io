# Kinder Garden → STOS Bridge v1

## Same-origin service routes

- `GET /stos/kindergarten/v1/bootstrap`
- `POST /stos/kindergarten/v1/sync`
- `POST /stos/mentor/v1/request`
- `POST /stos/beta/v1/report`
- `GET /stos/kindergarten/v1/weather/geocode`
- `GET /stos/kindergarten/v1/weather/reverse`
- `GET /stos/kindergarten/v1/weather`
- `GET /stos/kindergarten/v1/astronomy`

Academy navigation:
- `/stos/khaemenes/`
- `/stos/khaemenes/family/`
- `/stos/khaemenes/family/enroll/`
- `/stos/khaemenes/student/`
- `/stos/khaemenes/teacher-admin/`
- `/stos/khaemenes/kindergarten/`

## Authority boundaries

The bridge does not:
- authenticate a user;
- authorize a resource;
- award mastery;
- change grades or placement;
- reveal answer keys;
- approve mentor/Beta evidence;
- contact external data providers directly.

It transports bounded browser evidence to the protected STOS service spine.
