import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get(PrismaService);
    await app.init();
  });

  beforeEach(async () => {
    await prisma.asignacionLaboratorio.deleteMany();
    await prisma.laboratorio.deleteMany();
    await prisma.matricula.deleteMany();
    await prisma.materia.deleteMany();
    await prisma.estudiante.deleteMany();
    await prisma.ciclo.deleteMany();
    await prisma.carrera.deleteMany();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('/carreras (POST) crea una carrera con sus materias', async () => {
    const response = await request(app.getHttpServer()).post('/carreras').send({
      nombre: 'Desarrollo de software',
      materias: [
        { nombre: 'Programacion 1' },
        { nombre: 'Programacion 2' },
        { nombre: 'Base de datos' },
      ],
    });

    expect(response.status).toBe(201);
    expect(response.body.nombre).toBe('Desarrollo de software');
    expect(response.body.materias).toHaveLength(3);
  });

  it('/materias (POST) falla si la carrera no existe', async () => {
    const response = await request(app.getHttpServer()).post('/materias').send({
      nombre: 'Redes',
      carreraId: 999,
    });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('La carrera indicada no existe.');
  });

  it('/matriculas (POST) crea matriculas activas para estudiantes existentes', async () => {
    const carrera = await prisma.carrera.create({
      data: {
        nombre: 'Desarrollo de software',
      },
    });

    const ciclo = await prisma.ciclo.create({
      data: {
        nombre: '2026-2027',
        activo: true,
      },
    });

    const estudiante1 = await prisma.estudiante.create({
      data: {
        nombre: 'Ana Perez',
        email: 'ana@universidad.test',
      },
    });

    const estudiante2 = await prisma.estudiante.create({
      data: {
        nombre: 'Luis Gomez',
        email: 'luis@universidad.test',
      },
    });

    const response = await request(app.getHttpServer())
      .post('/matriculas')
      .send({
        carreraId: carrera.id,
        cicloId: ciclo.id,
        estudianteIds: [estudiante1.id, estudiante2.id],
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveLength(2);
    expect(response.body[0].activa).toBe(true);
    expect(response.body[0].ciclo.nombre).toBe('2026-2027');
  });

  it('/matriculas (POST) falla si el ciclo no esta activo', async () => {
    const carrera = await prisma.carrera.create({
      data: {
        nombre: 'Desarrollo de software',
      },
    });

    const ciclo = await prisma.ciclo.create({
      data: {
        nombre: '2026-2027',
        activo: false,
      },
    });

    const estudiante = await prisma.estudiante.create({
      data: {
        nombre: 'Ana Perez',
        email: 'ana@universidad.test',
      },
    });

    const response = await request(app.getHttpServer())
      .post('/matriculas')
      .send({
        carreraId: carrera.id,
        cicloId: ciclo.id,
        estudianteIds: [estudiante.id],
      });

    expect(response.status).toBe(409);
    expect(response.body.message).toBe('El ciclo indicado no esta activo.');
  });

  it('/asignaciones-laboratorio (POST) asigna laboratorio si ciclo y matricula estan activos y la materia existe', async () => {
    const carrera = await prisma.carrera.create({
      data: {
        nombre: 'Desarrollo de software',
      },
    });

    const materia = await prisma.materia.create({
      data: {
        nombre: 'Base de datos',
        carreraId: carrera.id,
      },
    });

    const ciclo = await prisma.ciclo.create({
      data: {
        nombre: '2026-2027',
        activo: true,
      },
    });

    const estudiante = await prisma.estudiante.create({
      data: {
        nombre: 'Ana Perez',
        email: 'ana@universidad.test',
      },
    });

    const matricula = await prisma.matricula.create({
      data: {
        activa: true,
        carreraId: carrera.id,
        cicloId: ciclo.id,
        estudianteId: estudiante.id,
      },
    });

    const laboratorio = await prisma.laboratorio.create({
      data: {
        nombre: 'Lab A',
        capacidad: 30,
      },
    });

    const response = await request(app.getHttpServer())
      .post('/asignaciones-laboratorio')
      .send({
        laboratorioId: laboratorio.id,
        matriculaId: matricula.id,
        materiaId: materia.id,
        cicloId: ciclo.id,
      });

    expect(response.status).toBe(201);
    expect(response.body.laboratorio.nombre).toBe('Lab A');
    expect(response.body.materia.nombre).toBe('Base de datos');
    expect(response.body.matricula.estudiante.nombre).toBe('Ana Perez');
  });

  it('/asignaciones-laboratorio (POST) falla si la matricula no esta activa', async () => {
    const carrera = await prisma.carrera.create({
      data: {
        nombre: 'Desarrollo de software',
      },
    });

    const materia = await prisma.materia.create({
      data: {
        nombre: 'Base de datos',
        carreraId: carrera.id,
      },
    });

    const ciclo = await prisma.ciclo.create({
      data: {
        nombre: '2026-2027',
        activo: true,
      },
    });

    const estudiante = await prisma.estudiante.create({
      data: {
        nombre: 'Ana Perez',
        email: 'ana@universidad.test',
      },
    });

    const matricula = await prisma.matricula.create({
      data: {
        activa: false,
        carreraId: carrera.id,
        cicloId: ciclo.id,
        estudianteId: estudiante.id,
      },
    });

    const laboratorio = await prisma.laboratorio.create({
      data: {
        nombre: 'Lab A',
        capacidad: 30,
      },
    });

    const response = await request(app.getHttpServer())
      .post('/asignaciones-laboratorio')
      .send({
        laboratorioId: laboratorio.id,
        matriculaId: matricula.id,
        materiaId: materia.id,
        cicloId: ciclo.id,
      });

    expect(response.status).toBe(409);
    expect(response.body.message).toBe('La matricula indicada no esta activa.');
  });
});
