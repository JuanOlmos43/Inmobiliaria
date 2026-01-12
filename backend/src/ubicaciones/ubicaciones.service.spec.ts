import { Test, TestingModule } from '@nestjs/testing';
import { UbicacionesService } from './ubicaciones.service';

describe('UbicacionesService', () => {
  let service: UbicacionesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UbicacionesService],
    }).compile();

    service = module.get<UbicacionesService>(UbicacionesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
