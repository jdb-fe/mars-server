# mars-server

mars frontend news server

## 快速入门

```bash
$ npm install
```

### 本地开发

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

### 测试

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

### TODO

- [x] 微信推送抓取文章
- [x] 文章规则添加
- [x] 定时群发
- [ ] 授权登录：微信、github
- [ ] 管理系统：推送统计，阅读统计、文章再次编辑

### API

#### 文章列表

```
url: /api/post
query: {
    page?: 1,
    limit?: 15
}
response: {
    error: {
        returnCode: 0,
        returnMessage: 'success',
        returnUserMessage: msg || '成功'
    },
    data: {
        posts: [{
            id: 62,
            title: '[译] 写给前端开发者的 GraphQL 指南',
            description: '',
            thumb: '',
            url: 'https://zhuanlan.zhihu.com/p/36253316',
            html: '',
            markdown: '',
            user: {
                avatar: '',
                name: ''
            }
        }],
        pages: {
            page: 1, // 当前页
            total: 63, // 总数量
            limit: 15, // 每页多少条
            totalPage: 5 // 总页数
        }
    }
}
```
