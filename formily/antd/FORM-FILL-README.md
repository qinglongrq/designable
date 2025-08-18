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

## 📋 预设数据功能

### 什么是预设数据？
预设数据功能允许你在表单配置中使用预设类型字符串替代大量的枚举数据，避免配置文件过大。

### 可用的预设数据类型：
- `preset:china-regions` - 中国省市县三级联动数据
- `preset:gender` - 性别选项
- `preset:education` - 教育程度选项  
- `preset:occupation` - 职业分类二级选项
- `preset:interests` - 兴趣爱好选项

### 使用方法：

#### 方法一：在设计器中使用（推荐）
1. 在表单设计器中添加组件（Select、Cascader、TreeSelect等）
2. 在右侧属性面板中找到"预设数据"配置项
3. 点击"选择预设数据类型"按钮
4. 选择合适的预设数据类型
5. 导出配置时会自动生成 `x-preset-data` 字段

#### 方法二：直接在JSON配置中使用
可以通过两种方式在JSON配置中使用预设数据：

**使用 `enum` 字段：**
```json
{
  "gender": {
    "type": "string",
    "title": "性别",
    "x-decorator": "FormItem",
    "x-component": "Select",
    "enum": "preset:gender"
  }
}
```

**使用 `x-preset-data` 字段（设计器生成）：**
```json
{
  "region": {
    "type": "array", 
    "title": "所在地区",
    "x-decorator": "FormItem",
    "x-component": "Cascader",
    "x-preset-data": "preset:china-regions"
  }
}
```

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

项目中包含了多个示例配置文件：
- `simple-form-config.json` - 基础表单配置示例
- `preset-form-config.json` - 使用预设数据的表单配置示例
- `designer-preset-config.json` - 设计器生成的预设数据配置示例
- `sample-form-config.json` - 完整功能演示配置

你可以下载这些文件来测试不同的表单填写功能。

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
