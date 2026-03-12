// nav导航栏配置
import { TeekIcon, VdoingIcon, SSLIcon, BlogIcon } from "./icon/NavIcon";
export const Nav = [
    { text: "🏡首页", link: "/" },
    {
      text: '📚公益',
      items:[
        {text: '公益',link: '/welfare/index'},
        {text: '游戏群组',link: '/welfare/minigame-group'},
        {text: '活动记录',link: '/welfare/g77fe'},
      ]
    },
    {
      text: '我的世界',
      items: [
        { text: '地图相关', link: '/minecraft/map' },
        { text: '资源相关', link: '/'}
      ]
    },    
    {
      text: 'Steam', link:"/steam/index"
    },
    // 索引
    {
      text: '👏索引',
      items: [
        { text: '📃分类页', link: '/categories' },
        { text: '🔖标签页', link: '/tags' },
        {
          text: `
            <div style="display: flex; align-items: center; gap: 4px;">
              <img src="/img/nav/归档.svg" alt="" style="width: 16px; height: 16px;">
              <span>归档页(少点，你们会炸)</span>
            </div>
            `,
          link: '/archives',
        },
        {
          text: `
            <div style="display: flex; align-items: center; gap: 4px;">
              <img src="/img/nav/清单.svg" alt="" style="width: 16px; height: 16px;">
              <span>清单页</span>
            </div>
            `,
          link: '/articleOverview',
        },
      ],
    },  

    // 关于
    {
      text: '🍷关于',
      items: [
        { text: '🌐网站导航', link: '/about/websites' },          
        {
          text: `
            <div style="display: flex; align-items: center; gap: 4px;">
              <img src="/img/nav/时间轴.svg" alt="" style="width: 16px; height: 16px;">
              <span>时间轴</span>
            </div>
            `,
          link: '/about/time-line',
        }
      ],
    },       
  ]
