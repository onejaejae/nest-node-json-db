import { User } from '../entity/user.entity';
import { UserService } from '../user.service';
import { Test } from '@nestjs/testing';
import { DatabaseModule } from 'src/core/database/database.module';
import { Post } from 'src/api/post/entity/post.entity';
import { UserRepository } from '../repository/user.repository';
import {
  PostRepositoryKey,
  UserRepositoryKey,
} from 'src/core/constant/repository.key.constant';
import { PostModule } from 'src/api/post/post.module';
import { PostRepository } from 'src/api/post/repository/post.repository';

describe('user service test', () => {
  let service: UserService;
  let userRepository: UserRepository;
  let postRepository: PostRepository;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        DatabaseModule.forRoot({ path: './data/test' }),
        DatabaseModule.forFeature([User, Post]),
        PostModule,
      ],
      providers: [
        UserService,
        { provide: UserRepositoryKey, useClass: UserRepository },
      ],
    }).compile();

    service = moduleRef.get<UserService>(UserService);
    userRepository = moduleRef.get<UserRepository>(UserRepositoryKey);
    postRepository = moduleRef.get<PostRepository>(PostRepositoryKey);
  });

  beforeEach(() => {});

  afterAll(async () => {
    // todo
  });

  it('Should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findUserById Test', () => {
    it('findUserById - 유저 존재 + 유저가 작성한 게시글 없는 경우', async () => {
      // givne
      const user = new User('test@email.com', '1234');
      await userRepository.create(user);

      // when
      const result = await service.findUserById(user.id);

      // then
      expect(result.email).toBe(user.email);
      expect(result.password).toBeUndefined();
      expect(result.posts.length).toBe(0);
    });

    it('findUserById - 유저 존재 + 유저가 작성한 게시글 있는 경우', async () => {
      // givne
      const user = new User('test@email.com', '1234');
      await userRepository.create(user);

      const post = new Post(user.id, 'test', 'test');
      await postRepository.create(post);

      // when
      const result = await service.findUserById(user.id);

      // then
      expect(result.email).toBe(user.email);
      expect(result.password).toBeUndefined();
      expect(result.posts.length).not.toBe(0);
      expect(result.posts[0].authorId).toBe(user.id);
      expect(result.posts[0].title).toBe(post.title);
      expect(result.posts[0].content).toBe(post.content);
      expect(result.posts.length).not.toBe(0);
    });
  });
});
