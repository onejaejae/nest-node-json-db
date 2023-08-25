import { Test } from '@nestjs/testing';
import { DatabaseModule } from 'src/core/database/database.module';
import { Post } from 'src/api/post/entity/post.entity';
import {
  PostRepositoryKey,
  UserRepositoryKey,
} from 'src/core/constant/repository.key.constant';
import { PostRepository } from 'src/api/post/repository/post.repository';
import { UserModule } from 'src/api/user/user.module';
import { PostService } from '../post.service';
import { UserRepository } from 'src/api/user/repository/user.repository';
import { User } from 'src/api/user/entity/user.entity';
import { CreatePostDto } from '../dto/create.post.dto';

describe('post service test', () => {
  let service: PostService;
  let userRepository: UserRepository;
  let postRepository: PostRepository;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        DatabaseModule.forRoot({ path: './data/test' }),
        DatabaseModule.forFeature([User, Post]),
        UserModule,
      ],
      providers: [
        PostService,
        { provide: PostRepositoryKey, useClass: PostRepository },
      ],
    }).compile();

    service = moduleRef.get<PostService>(PostService);
    userRepository = moduleRef.get<UserRepository>(UserRepositoryKey);
    postRepository = moduleRef.get<PostRepository>(PostRepositoryKey);
  });

  afterAll(async () => {
    // todo
  });

  it('Should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createPost & getPost', () => {
    it('게시글 생성 - 성공', async () => {
      // givne
      const user = new User('test@email.com', '1234');
      await userRepository.create(user);

      const createPostDto = new CreatePostDto(user.id, 'test', 'test');

      // when
      // then
      await expect(
        service.createPost(createPostDto),
      ).resolves.not.toThrowError();
    });

    it('게시글 조회 - 성공', async () => {
      // givne
      const user = new User('test@email.com', '1234');
      await userRepository.create(user);

      const post = new Post(user.id, 'test', 'test');
      await postRepository.create(post);

      // when
      const result = await service.getPost(post.id);

      // then
      expect(result.authorId).toBe(user.id);
      expect(result.title).toBe(post.title);
      expect(result.content).toBe(post.content);
      expect(result.author.id).toBe(user.id);
      expect(result.author.email).toBe(user.email);
      expect(result.author.password).toBeUndefined();
    });
  });
});
