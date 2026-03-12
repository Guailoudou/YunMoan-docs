const description = [
  "欢迎来到这里"
].toString();

// 导出head.ts
export const HeadData = [

  // 添加 51.la 统计脚本
  [
    "script",
    {
      charset: "UTF-8",
      id: "LA_COLLECT",
      src: "//sdk.51.la/js-sdk-pro.min.js",
    },
  ],
  // 初始化统计脚本
  [
    "script",
    {},
    `
        // 等待页面加载完成后初始化
        window.addEventListener('DOMContentLoaded', () => {
          if (typeof LA !== 'undefined') {
            LA.init({
              id: '3LmZHLhDZIDpMaT0', // 您应用的统计掩码
              ck: '3LmZHLhDZIDpMaT0', // 您应用的固定key值
              autoTrack: true, //开启事件分析功能
              hashMode: true, // 开启单页面应用模式
              screenRecord: true, //开启屏幕录制功能,默认为false
            });
          }
        });
      `,
  ],



  
  ["meta", { name: "referrer", content: "no-referrer-when-downgrade" }], //不蒜子统计
  ["meta", { name: "author", content: "Tianke" }],
  ['meta', { property: 'og:description', content: '明心静性，爱自己' }],

  ['meta', { property: 'og:image', content: 'https://onedayxyy.cn/img/xyy.webp' }],


  [
    "meta",
    {
      name: "viewport",
      content:
        "width=device-width,initial-scale=1,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no",
    },
  ],
  [
    "meta",
    {
      name: "description",
      description,
    },
  ],


  ["meta", { name: "keywords", description }],
  ["meta", { name: "baidu-site-verification", content: "codeva-QnY1Xh758j" }], // 百度收录
  [
    "meta",
    { name: "msvalidate.01", content: "48CABE70F538B8D117567176ABF325AF" },
  ], // Bing 收录验证
  ["link", { rel: "icon", href: "/favicon.ico", type: "image/png" }],
  
  
  // 阿里在线矢量库
  [
    "link",
    {
      rel: "stylesheet",
      href: "//at.alicdn.com/t/font_2989306_w303erbip9.css",
    },
  ],
  [
    // 阿里图标库symbol 引用
    "script",
    {
      src: "https://at.alicdn.com/t/c/font_4899452_xj7acblxpxj.js",
      media: "print",
      onload: "this.media='all'",
    },
  ],
  // umami统计
  [
    "script",
    {
      src: "https://umami.onedayxyy.cn/script.js",
      "data-website-id": "0d806f5d-cffa-41ec-98bf-862b2273ce4a",
      defer: "defer",
    },
  ],
  [
    "noscript",
    {},
    '<meta http-equiv="refresh" content="0; url={https://www.baidu.com/}">',
  ], // 禁用js跳转

  // 阿里图标库symbol 引用
  ["script",{src: "https://at.alicdn.com/t/c/font_4686603_33kna2v5qcm.js",defer: "defer",},],  
];
