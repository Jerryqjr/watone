
### Conversation Web App 模板
这是一个使用[Next.js](https://nextjs.org/)框架创建的应用项目，初始化工具是[`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app)。

#### 配置应用程序
在当前目录下创建一个名为`.env.local`的文件，并从`.env.example`中复制内容。设置以下环境变量：
- `NEXT_PUBLIC_APP_ID`: 应用程序ID
- `NEXT_PUBLIC_APP_KEY`: 应用程序API密钥
- `NEXT_PUBLIC_API_URL`: 应用程序API的URL

更多的配置可以在`config/index.ts`文件中进行：
- `APP_INFO`: 包括应用标题、描述、版权信息、隐私政策以及默认语言（默认为简体中文）。
- `isShowPrompt`: 控制是否显示提示信息，默认为`true`。
- `promptTemplate`: 提示信息的模板字符串，默认为空。

#### 开始使用
首先安装依赖包：
- 使用`npm install`或`yarn`或`pnpm install`命令安装依赖。

然后运行开发服务器：
- 使用`npm run dev`或`yarn dev`或`pnpm dev`启动开发服务器。

在浏览器中访问[http://localhost:3000](http://localhost:3000)查看结果。

#### 使用Docker
构建Docker镜像：
- `docker build . -t <DOCKER_HUB_REPO>/webapp-conversation:latest`，其中`<DOCKER_HUB_REPO>`需要替换为你的Docker Hub仓库名称。

运行Docker容器：
- `docker run -p 3000:3000 <DOCKER_HUB_REPO>/webapp-conversation:latest`。

同样地，在浏览器中访问[http://localhost:3000](http://localhost:3000)查看结果。

#### 学习更多
要了解更多关于Next.js的知识，可以参考以下资源：
- [Next.js文档](https://nextjs.org/docs) - 学习Next.js的功能和API。
- [学习Next.js](https://nextjs.org/learn) - 交互式的Next.js教程。

也可以查看[Next.js的GitHub仓库](https://github.com/vercel/next.js/)，欢迎反馈和贡献代码。

#### 部署到Vercel
> 警告：如果你使用[Vercel Hobby](https://vercel.com/pricing)，由于Vercel的限制，你的消息可能会被截断。

最简单的部署方式是使用由Next.js创建者提供的[Vercel平台](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)。

更详细的部署指南请参阅[Next.js的部署文档](https://nextjs.org/docs/deployment)。



**************


# Conversation Web App Template
This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Config App
Create a file named `.env.local` in the current directory and copy the contents from `.env.example`. Setting the following content:
```
# APP ID
NEXT_PUBLIC_APP_ID=
# APP API key
NEXT_PUBLIC_APP_KEY=
# APP URL
NEXT_PUBLIC_API_URL=
```

Config more in `config/index.ts` file:   
```js
export const APP_INFO: AppInfo = {
  title: 'Chat APP',
  description: '',
  copyright: '',
  privacy_policy: '',
  default_language: 'zh-Hans'
}

export const isShowPrompt = true
export const promptTemplate = ''
```

## Getting Started
First, install dependencies:
```bash
npm install
# or
yarn
# or
pnpm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Using Docker

```
docker build . -t <DOCKER_HUB_REPO>/webapp-conversation:latest
# now you can access it in port 3000
docker run -p 3000:3000 <DOCKER_HUB_REPO>/webapp-conversation:latest
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

> ⚠️ If you are using [Vercel Hobby](https://vercel.com/pricing), your message will be trucated due to the limitation of vercel.


The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
