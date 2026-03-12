// FriendLink用于在首页展示一些友链
export const FriendLink = {
  enabled: true, // 是否启用友情链接卡片
  limit: 5, // 一页显示的数量
  // autoScroll: true, // 是否自动滚动
  // scrollSpeed: 2500, // 滚动间隔时间，单位：毫秒。autoScroll 为 true 时生效

  autoPage: true, // 是否自动翻页
  pageSpeed: 4000, // 翻页间隔时间，单位：毫秒。autoPage 为 true 时生效
  titleClick: (router) => router.go("/websites"), // 查看更多友链

  // 友情链接数据列表
  list: [
    {
      avatar: "/img/friend/yuwan.webp",
      name: "鱼丸",
      desc: "一条做视频做语言本地化的鱼丸",
      link: "https://docs.yw-games.top/",
    },
    {
      avatar: "/img/friend/yaoxing.jpg",
      name: "耀星酱",
      desc: "",
      link: "https://scarefree.cn/",
    },
    {
      avatar: "/img/friend/yaoxing.jpg",
      name: "耀星星",
      desc: "",
      link: "https://started.ink/",
    },
        {
      avatar: "/img/friend/yaoxing.jpg",
      name: "超级耀星",
      desc: "可以自助解决报错",
      link: "https://error.started.ink/",
    }
  ],
  // autoScroll: true,
};
