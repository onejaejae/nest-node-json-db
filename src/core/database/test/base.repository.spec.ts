import { BadRequestException, Inject } from '@nestjs/common';
import { BaseRepository } from '../base.repository';
import { JsonDBService } from '../database.service';
import { Test } from '@nestjs/testing';
import { DatabaseModule } from '../database.module';
import { User } from 'src/api/user/entity/user.entity';

class Mock extends User {}

class MockRepository extends BaseRepository<Mock> {
  getPath(): string {
    return Mock.name.toLowerCase().concat('s');
  }

  constructor(
    @Inject(Mock.name)
    protected readonly jsonDBService: JsonDBService<Mock>,
  ) {
    super(Mock);
  }
}

describe('BaseRepository Test', () => {
  let mockRepository: MockRepository;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        DatabaseModule.forRoot({ path: './data/test' }),
        DatabaseModule.forFeature([Mock]),
      ],
      providers: [MockRepository],
    }).compile();

    mockRepository = moduleRef.get<MockRepository>(MockRepository);
  });

  afterAll(async () => {});

  it('Should be defined', () => {
    expect(mockRepository).toBeDefined();
  });

  it('정상적으로 저장 with Save & findOne', async () => {
    //given
    const mockData = {
      email: 'test@email.com',
      password: '1234',
    };
    const m = new Mock(mockData.email, mockData.password);

    // when
    // save
    await mockRepository.create(m);

    // find
    const result = await mockRepository.findOne({ id: m.id });

    // then
    expect(result.email).toBe(m.email);
    expect(result.password).toBe(m.password);
  });

  it('정상적으로 수정 with Save & findByIdAndUpdate & findOne', async () => {
    //given
    const mockData = {
      email: 'test@email.com',
      password: '1234',
    };
    const m = new Mock(mockData.email, mockData.password);

    // when
    // save
    await mockRepository.create(m);

    // update
    m.email = 'updated';
    m.password = 'updated';
    await mockRepository.findByIdAndUpdate(m.id, m);

    // find
    const result = await mockRepository.findOne({ id: m.id });
    // then
    expect(result.email).toBe(m.email);
    expect(result.password).toBe(m.password);
  });

  it('정상적으로 삭제 with Save & findByIdAndDelte & findByIdOrThrow', async () => {
    //given
    const mockData = {
      email: 'test@email.com',
      password: '1234',
    };
    const m = new Mock(mockData.email, mockData.password);

    // when
    // save
    await mockRepository.create(m);

    // delete
    await mockRepository.findByIdAndDelte(m.id);

    // then
    await expect(mockRepository.findByIdOrThrow(m.id)).rejects.toThrowError(
      new BadRequestException(`id: ${m.id} don't exist`),
    );
  });
});
