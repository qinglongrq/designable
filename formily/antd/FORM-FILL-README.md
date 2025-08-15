# 表单填写页面使用指南

## 🚀 快速启动

### 方式一：通过路由访问（推荐）

1. **启动开发服务器**
   ```bash
   cd formily/antd
   npm start
   ```

2. **访问页面**
   - 表单设计器：`http://localhost:5173/` 
   - 表单填写页面：`http://localhost:5173/form-fill`

3. **页面导航**
   - 在任何页面顶部都有导航栏，可以在设计器和填写页面之间切换

### 方式二：独立启动表单填写页面

```bash
cd formily/antd
npm run start:form-fill
```

这将直接打开表单填写页面：`http://localhost:5173/form-fill.html`

## 📋 功能说明

### 1. 上传JSON配置
- 点击"选择JSON配置文件"按钮
- 选择符合Formily Schema格式的JSON文件
- 系统自动解析并生成对应表单

### 2. 填写表单
- 根据配置自动生成的表单字段
- 支持实时验证和数据预览
- 所有Formily组件都支持

### 3. 提交数据
- 点击"提交表单"按钮
- 数据会发送到配置的后端API
- 显示详细的提交结果

## 📄 JSON配置格式示例

```json
{
  "form": {
    "labelCol": 6,
    "wrapperCol": 18,
    "layout": "horizontal"
  },
  "schema": {
    "type": "object",
    "properties": {
      "name": {
        "type": "string",
        "title": "姓名",
        "required": true,
        "x-decorator": "FormItem",
        "x-component": "Input",
        "x-component-props": {
          "placeholder": "请输入姓名"
        }
      },
      "email": {
        "type": "string",
        "title": "邮箱",
        "required": true,
        "x-decorator": "FormItem",
        "x-component": "Input",
        "x-component-props": {
          "placeholder": "请输入邮箱"
        },
        "x-validator": [
          {
            "format": "email",
            "message": "邮箱格式不正确"
          }
        ]
      }
    }
  }
}
```

## 🔗 URL访问方式

### 开发环境
- 设计器：`http://localhost:5173/`
- 表单填写：`http://localhost:5173/form-fill`
- 独立填写页面：`http://localhost:5173/form-fill.html`

### 生产环境
构建后可以通过以下方式访问：
- `https://your-domain.com/`
- `https://your-domain.com/form-fill`  
- `https://your-domain.com/form-fill.html`

## 📁 示例文件

项目中包含了一个示例配置文件：
- `formily/antd/public/sample-form-config.json`

你可以下载这个文件来测试表单填写功能。

## 🛠️ 技术栈

- **React Router** - 路由管理
- **Formily** - 表单引擎
- **Ant Design** - UI组件库
- **Vite** - 构建工具

## 🎯 主要特性

- ✅ 支持URL路由访问
- ✅ 动态JSON配置加载
- ✅ 实时表单生成
- ✅ 完整的表单验证
- ✅ 数据提交和结果展示
- ✅ 响应式设计
- ✅ 错误处理和用户友好提示

## 🚀 部署说明

构建生产版本：
```bash
npm run build:playground
```

构建后的文件在 `build/` 目录中，包含：
- `index.html` - 设计器页面
- `form-fill.html` - 独立表单填写页面
- 其他静态资源

可以直接部署到任何静态文件服务器。
