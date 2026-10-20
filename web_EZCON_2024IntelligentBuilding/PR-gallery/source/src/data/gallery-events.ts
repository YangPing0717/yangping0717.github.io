import { eventReports } from './event-reports'
import { localAsset } from '../site-paths'
import { schneiderEvent, type GalleryEvent } from './schneider-event'

// Each item represents one real activity. Photos and provenance are stored in public/events/.
// Years are only shown when explicitly present in the source heading.
const catalogEvents = [
  {
    "id": "active-aging-2026",
    "title": "2026 高齡化產業博覽會",
    "shortTitle": "高齡化產業博覽會",
    "category": "智慧生活",
    "year": "2026",
    "sourceUrl": "https://www.ezcontw.com/gao-ling-hua-chan-ye-bo-lan-hui/",
    "paragraphs": [
      "易控參與高齡健康產業博覽會，展示智慧建築環境監控與 AI 智慧養生社區解決方案，結合 AI、IoT 與智慧建築技術，介紹安全監測、社區管理及智慧居家的應用。"
    ],
    "photos": [
      {
        "id": "active-aging-2026-photo-04",
        "title": "現場紀錄 04",
        "subtitle": "ACTIVE AGING EXPO",
        "alt": "2026 高齡化產業博覽會活動現場照片 04。",
        "imageUrl": "/events/catalog/active-aging-2026/display/photo-04.webp",
        "thumbnailUrl": "/events/catalog/active-aging-2026/thumb/photo-04.webp",
        "originalUrl": "/events/catalog/active-aging-2026/original/photo-04.jpg",
        "width": 1280,
        "height": 720
      },
      {
        "id": "active-aging-2026-photo-02",
        "title": "現場紀錄 02",
        "subtitle": "ACTIVE AGING EXPO",
        "alt": "2026 高齡化產業博覽會活動現場照片 02。",
        "imageUrl": "/events/catalog/active-aging-2026/display/photo-02.webp",
        "thumbnailUrl": "/events/catalog/active-aging-2026/thumb/photo-02.webp",
        "originalUrl": "/events/catalog/active-aging-2026/original/photo-02.jpg",
        "width": 1706,
        "height": 960
      },
      {
        "id": "active-aging-2026-photo-01",
        "title": "現場紀錄 01",
        "subtitle": "ACTIVE AGING EXPO",
        "alt": "2026 高齡化產業博覽會活動現場照片 01。",
        "imageUrl": "/events/catalog/active-aging-2026/display/photo-01.webp",
        "thumbnailUrl": "/events/catalog/active-aging-2026/thumb/photo-01.webp",
        "originalUrl": "/events/catalog/active-aging-2026/original/photo-01.jpg",
        "width": 960,
        "height": 1706
      },
      {
        "id": "active-aging-2026-photo-03",
        "title": "現場紀錄 03",
        "subtitle": "ACTIVE AGING EXPO",
        "alt": "2026 高齡化產業博覽會活動現場照片 03。",
        "imageUrl": "/events/catalog/active-aging-2026/display/photo-03.webp",
        "thumbnailUrl": "/events/catalog/active-aging-2026/thumb/photo-03.webp",
        "originalUrl": "/events/catalog/active-aging-2026/original/photo-03.jpg",
        "width": 720,
        "height": 1280
      }
    ]
  },
  {
    "id": "computex-2026",
    "title": "2026 COMPUTEX",
    "shortTitle": "COMPUTEX",
    "category": "展覽紀錄",
    "year": "2026",
    "sourceUrl": "https://www.ezcontw.com/pr_activities/#2026-computex",
    "paragraphs": [
      "2026 COMPUTEX 展場紀錄，透過展位展示與現場交流影像，回顧展會中的活動片段。"
    ],
    "photos": [
      {
        "id": "computex-2026-photo-01",
        "title": "現場紀錄 01",
        "subtitle": "COMPUTEX 2026",
        "alt": "2026 COMPUTEX活動現場照片 01。",
        "imageUrl": "/events/catalog/computex-2026/display/photo-01.webp",
        "thumbnailUrl": "/events/catalog/computex-2026/thumb/photo-01.webp",
        "originalUrl": "/events/catalog/computex-2026/original/photo-01.jpg",
        "width": 1706,
        "height": 960
      },
      {
        "id": "computex-2026-photo-02",
        "title": "現場紀錄 02",
        "subtitle": "COMPUTEX 2026",
        "alt": "2026 COMPUTEX活動現場照片 02。",
        "imageUrl": "/events/catalog/computex-2026/display/photo-02.webp",
        "thumbnailUrl": "/events/catalog/computex-2026/thumb/photo-02.webp",
        "originalUrl": "/events/catalog/computex-2026/original/photo-02.jpg",
        "width": 2000,
        "height": 1500
      },
      {
        "id": "computex-2026-photo-03",
        "title": "現場紀錄 03",
        "subtitle": "COMPUTEX 2026",
        "alt": "2026 COMPUTEX活動現場照片 03。",
        "imageUrl": "/events/catalog/computex-2026/display/photo-03.webp",
        "thumbnailUrl": "/events/catalog/computex-2026/thumb/photo-03.webp",
        "originalUrl": "/events/catalog/computex-2026/original/photo-03.jpg",
        "width": 1706,
        "height": 960
      },
      {
        "id": "computex-2026-photo-04",
        "title": "現場紀錄 04",
        "subtitle": "COMPUTEX 2026",
        "alt": "2026 COMPUTEX活動現場照片 04。",
        "imageUrl": "/events/catalog/computex-2026/display/photo-04.webp",
        "thumbnailUrl": "/events/catalog/computex-2026/thumb/photo-04.webp",
        "originalUrl": "/events/catalog/computex-2026/original/photo-04.jpg",
        "width": 1706,
        "height": 960
      },
      {
        "id": "computex-2026-photo-05",
        "title": "現場紀錄 05",
        "subtitle": "COMPUTEX 2026",
        "alt": "2026 COMPUTEX活動現場照片 05。",
        "imageUrl": "/events/catalog/computex-2026/display/photo-05.webp",
        "thumbnailUrl": "/events/catalog/computex-2026/thumb/photo-05.webp",
        "originalUrl": "/events/catalog/computex-2026/original/photo-05.jpg",
        "width": 1706,
        "height": 960
      },
      {
        "id": "computex-2026-photo-06",
        "title": "現場紀錄 06",
        "subtitle": "COMPUTEX 2026",
        "alt": "2026 COMPUTEX活動現場照片 06。",
        "imageUrl": "/events/catalog/computex-2026/display/photo-06.webp",
        "thumbnailUrl": "/events/catalog/computex-2026/thumb/photo-06.webp",
        "originalUrl": "/events/catalog/computex-2026/original/photo-06.jpg",
        "width": 1706,
        "height": 960
      },
      {
        "id": "computex-2026-photo-07",
        "title": "現場紀錄 07",
        "subtitle": "COMPUTEX 2026",
        "alt": "2026 COMPUTEX活動現場照片 07。",
        "imageUrl": "/events/catalog/computex-2026/display/photo-07.webp",
        "thumbnailUrl": "/events/catalog/computex-2026/thumb/photo-07.webp",
        "originalUrl": "/events/catalog/computex-2026/original/photo-07.jpg",
        "width": 1706,
        "height": 960
      },
      {
        "id": "computex-2026-photo-08",
        "title": "現場紀錄 08",
        "subtitle": "COMPUTEX 2026",
        "alt": "2026 COMPUTEX活動現場照片 08。",
        "imageUrl": "/events/catalog/computex-2026/display/photo-08.webp",
        "thumbnailUrl": "/events/catalog/computex-2026/thumb/photo-08.webp",
        "originalUrl": "/events/catalog/computex-2026/original/photo-08.jpg",
        "width": 2000,
        "height": 1500
      },
      {
        "id": "computex-2026-photo-09",
        "title": "現場紀錄 09",
        "subtitle": "COMPUTEX 2026",
        "alt": "2026 COMPUTEX活動現場照片 09。",
        "imageUrl": "/events/catalog/computex-2026/display/photo-09.webp",
        "thumbnailUrl": "/events/catalog/computex-2026/thumb/photo-09.webp",
        "originalUrl": "/events/catalog/computex-2026/original/photo-09.jpg",
        "width": 1706,
        "height": 960
      },
      {
        "id": "computex-2026-photo-10",
        "title": "現場紀錄 10",
        "subtitle": "COMPUTEX 2026",
        "alt": "2026 COMPUTEX活動現場照片 10。",
        "imageUrl": "/events/catalog/computex-2026/display/photo-10.webp",
        "thumbnailUrl": "/events/catalog/computex-2026/thumb/photo-10.webp",
        "originalUrl": "/events/catalog/computex-2026/original/photo-10.jpg",
        "width": 1280,
        "height": 720
      },
      {
        "id": "computex-2026-photo-11",
        "title": "現場紀錄 11",
        "subtitle": "COMPUTEX 2026",
        "alt": "2026 COMPUTEX活動現場照片 11。",
        "imageUrl": "/events/catalog/computex-2026/display/photo-11.webp",
        "thumbnailUrl": "/events/catalog/computex-2026/thumb/photo-11.webp",
        "originalUrl": "/events/catalog/computex-2026/original/photo-11.jpg",
        "width": 1477,
        "height": 1108
      },
      {
        "id": "computex-2026-photo-12",
        "title": "現場紀錄 12",
        "subtitle": "COMPUTEX 2026",
        "alt": "2026 COMPUTEX活動現場照片 12。",
        "imageUrl": "/events/catalog/computex-2026/display/photo-12.webp",
        "thumbnailUrl": "/events/catalog/computex-2026/thumb/photo-12.webp",
        "originalUrl": "/events/catalog/computex-2026/original/photo-12.jpg",
        "width": 1477,
        "height": 1108
      },
      {
        "id": "computex-2026-photo-13",
        "title": "現場紀錄 13",
        "subtitle": "COMPUTEX 2026",
        "alt": "2026 COMPUTEX活動現場照片 13。",
        "imageUrl": "/events/catalog/computex-2026/display/photo-13.webp",
        "thumbnailUrl": "/events/catalog/computex-2026/thumb/photo-13.webp",
        "originalUrl": "/events/catalog/computex-2026/original/photo-13.jpg",
        "width": 1108,
        "height": 1477
      },
      {
        "id": "computex-2026-photo-14",
        "title": "現場紀錄 14",
        "subtitle": "COMPUTEX 2026",
        "alt": "2026 COMPUTEX活動現場照片 14。",
        "imageUrl": "/events/catalog/computex-2026/display/photo-14.webp",
        "thumbnailUrl": "/events/catalog/computex-2026/thumb/photo-14.webp",
        "originalUrl": "/events/catalog/computex-2026/original/photo-14.jpg",
        "width": 1108,
        "height": 1477
      },
      {
        "id": "computex-2026-photo-15",
        "title": "現場紀錄 15",
        "subtitle": "COMPUTEX 2026",
        "alt": "2026 COMPUTEX活動現場照片 15。",
        "imageUrl": "/events/catalog/computex-2026/display/photo-15.webp",
        "thumbnailUrl": "/events/catalog/computex-2026/thumb/photo-15.webp",
        "originalUrl": "/events/catalog/computex-2026/original/photo-15.jpg",
        "width": 1108,
        "height": 1477
      }
    ]
  },
  {
    "id": "fire-safety-2026",
    "title": "2026台北國際防火防災應用展",
    "shortTitle": "台北防火防災應用展",
    "category": "專業展會",
    "year": "2026",
    "sourceUrl": "https://www.ezcontw.com/pr_activities/#2026%25E5%258F%25B0%25E5%258C%2597%25E5%259C%258B%25E9%259A%259B%25E9%2598%25B2%25E7%2581%25AB%25E9%2598%25B2%25E7%2581%25BD%25E6%2587%2589%25E7%2594%25A8%25E5%25B1%2595",
    "paragraphs": [
      "2026 台北國際防火防災應用展的現場紀錄，收錄講者分享、簡報與與會交流畫面。"
    ],
    "photos": [
      {
        "id": "fire-safety-2026-photo-01",
        "title": "現場紀錄 01",
        "subtitle": "FIRE SAFETY EXHIBITION",
        "alt": "2026台北國際防火防災應用展活動現場照片 01。",
        "imageUrl": "/events/catalog/fire-safety-2026/display/photo-01.webp",
        "thumbnailUrl": "/events/catalog/fire-safety-2026/thumb/photo-01.webp",
        "originalUrl": "/events/catalog/fire-safety-2026/original/photo-01.jpg",
        "width": 1706,
        "height": 960
      },
      {
        "id": "fire-safety-2026-photo-02",
        "title": "現場紀錄 02",
        "subtitle": "FIRE SAFETY EXHIBITION",
        "alt": "2026台北國際防火防災應用展活動現場照片 02。",
        "imageUrl": "/events/catalog/fire-safety-2026/display/photo-02.webp",
        "thumbnailUrl": "/events/catalog/fire-safety-2026/thumb/photo-02.webp",
        "originalUrl": "/events/catalog/fire-safety-2026/original/photo-02.jpg",
        "width": 2000,
        "height": 1126
      },
      {
        "id": "fire-safety-2026-photo-03",
        "title": "現場紀錄 03",
        "subtitle": "FIRE SAFETY EXHIBITION",
        "alt": "2026台北國際防火防災應用展活動現場照片 03。",
        "imageUrl": "/events/catalog/fire-safety-2026/display/photo-03.webp",
        "thumbnailUrl": "/events/catalog/fire-safety-2026/thumb/photo-03.webp",
        "originalUrl": "/events/catalog/fire-safety-2026/original/photo-03.jpg",
        "width": 2000,
        "height": 1126
      },
      {
        "id": "fire-safety-2026-photo-04",
        "title": "現場紀錄 04",
        "subtitle": "FIRE SAFETY EXHIBITION",
        "alt": "2026台北國際防火防災應用展活動現場照片 04。",
        "imageUrl": "/events/catalog/fire-safety-2026/display/photo-04.webp",
        "thumbnailUrl": "/events/catalog/fire-safety-2026/thumb/photo-04.webp",
        "originalUrl": "/events/catalog/fire-safety-2026/original/photo-04.jpg",
        "width": 2000,
        "height": 1126
      },
      {
        "id": "fire-safety-2026-photo-05",
        "title": "現場紀錄 05",
        "subtitle": "FIRE SAFETY EXHIBITION",
        "alt": "2026台北國際防火防災應用展活動現場照片 05。",
        "imageUrl": "/events/catalog/fire-safety-2026/display/photo-05.webp",
        "thumbnailUrl": "/events/catalog/fire-safety-2026/thumb/photo-05.webp",
        "originalUrl": "/events/catalog/fire-safety-2026/original/photo-05.jpg",
        "width": 2000,
        "height": 1126
      },
      {
        "id": "fire-safety-2026-photo-06",
        "title": "現場紀錄 06",
        "subtitle": "FIRE SAFETY EXHIBITION",
        "alt": "2026台北國際防火防災應用展活動現場照片 06。",
        "imageUrl": "/events/catalog/fire-safety-2026/display/photo-06.webp",
        "thumbnailUrl": "/events/catalog/fire-safety-2026/thumb/photo-06.webp",
        "originalUrl": "/events/catalog/fire-safety-2026/original/photo-06.jpg",
        "width": 2000,
        "height": 1126
      },
      {
        "id": "fire-safety-2026-photo-07",
        "title": "現場紀錄 07",
        "subtitle": "FIRE SAFETY EXHIBITION",
        "alt": "2026台北國際防火防災應用展活動現場照片 07。",
        "imageUrl": "/events/catalog/fire-safety-2026/display/photo-07.webp",
        "thumbnailUrl": "/events/catalog/fire-safety-2026/thumb/photo-07.webp",
        "originalUrl": "/events/catalog/fire-safety-2026/original/photo-07.jpg",
        "width": 2000,
        "height": 1126
      },
      {
        "id": "fire-safety-2026-photo-08",
        "title": "現場紀錄 08",
        "subtitle": "FIRE SAFETY EXHIBITION",
        "alt": "2026台北國際防火防災應用展活動現場照片 08。",
        "imageUrl": "/events/catalog/fire-safety-2026/display/photo-08.webp",
        "thumbnailUrl": "/events/catalog/fire-safety-2026/thumb/photo-08.webp",
        "originalUrl": "/events/catalog/fire-safety-2026/original/photo-08.jpg",
        "width": 2000,
        "height": 1126
      }
    ]
  },
  {
    "id": "smart-building-forum-2026",
    "title": "2026智慧建築產業交流會",
    "shortTitle": "2026智慧建築產業交流會",
    "category": "產業交流",
    "year": "2026",
    "sourceUrl": "https://www.ezcontw.com/pr_activities/#2026%25E6%2599%25BA%25E6%2585%25A7%25E5%25BB%25BA%25E7%25AF%2589%25E7%2594%25A2%25E6%25A5%25AD%25E4%25BA%25A4%25E6%25B5%2581%25E6%259C%2583",
    "paragraphs": [
      "2026 智慧建築產業交流會的活動紀錄，回顧現場講者簡報與產業交流片段。"
    ],
    "photos": [
      {
        "id": "smart-building-forum-2026-photo-03",
        "title": "現場紀錄 03",
        "subtitle": "SMART BUILDING FORUM",
        "alt": "2026智慧建築產業交流會活動現場照片 03。",
        "imageUrl": "/events/catalog/smart-building-forum-2026/display/photo-03.webp",
        "thumbnailUrl": "/events/catalog/smart-building-forum-2026/thumb/photo-03.webp",
        "originalUrl": "/events/catalog/smart-building-forum-2026/original/photo-03.jpg",
        "width": 1280,
        "height": 721
      },
      {
        "id": "smart-building-forum-2026-photo-02",
        "title": "現場紀錄 02",
        "subtitle": "SMART BUILDING FORUM",
        "alt": "2026智慧建築產業交流會活動現場照片 02。",
        "imageUrl": "/events/catalog/smart-building-forum-2026/display/photo-02.webp",
        "thumbnailUrl": "/events/catalog/smart-building-forum-2026/thumb/photo-02.webp",
        "originalUrl": "/events/catalog/smart-building-forum-2026/original/photo-02.jpg",
        "width": 1280,
        "height": 721
      },
      {
        "id": "smart-building-forum-2026-photo-01",
        "title": "現場紀錄 01",
        "subtitle": "SMART BUILDING FORUM",
        "alt": "2026智慧建築產業交流會活動現場照片 01。",
        "imageUrl": "/events/catalog/smart-building-forum-2026/display/photo-01.webp",
        "thumbnailUrl": "/events/catalog/smart-building-forum-2026/thumb/photo-01.webp",
        "originalUrl": "/events/catalog/smart-building-forum-2026/original/photo-01.jpg",
        "width": 1280,
        "height": 721
      },
      {
        "id": "smart-building-forum-2026-photo-04",
        "title": "現場紀錄 04",
        "subtitle": "SMART BUILDING FORUM",
        "alt": "2026智慧建築產業交流會活動現場照片 04。",
        "imageUrl": "/events/catalog/smart-building-forum-2026/display/photo-04.webp",
        "thumbnailUrl": "/events/catalog/smart-building-forum-2026/thumb/photo-04.webp",
        "originalUrl": "/events/catalog/smart-building-forum-2026/original/photo-04.jpg",
        "width": 1280,
        "height": 721
      }
    ]
  },
  {
    "id": "ise-barcelona-2026",
    "title": "2026 ISE Barcelona 海外參展 - Aopen",
    "shortTitle": "ISE Barcelona",
    "category": "海外參展",
    "year": "2026",
    "sourceUrl": "https://www.ezcontw.com/pr_activities/#2026-ise-barcelona-%25E6%25B5%25B7%25E5%25A4%2596%25E5%258F%2583%25E5%25B1%2595aopen",
    "paragraphs": [
      "2026 ISE Barcelona 海外參展紀錄，收錄 AOPEN 展位展示、現場交流與合影影像。"
    ],
    "photos": [
      {
        "id": "ise-barcelona-2026-photo-01",
        "title": "現場紀錄 01",
        "subtitle": "ISE BARCELONA · AOPEN",
        "alt": "2026 ISE Barcelona 海外參展 - Aopen活動現場照片 01。",
        "imageUrl": "/events/catalog/ise-barcelona-2026/display/photo-01.webp",
        "thumbnailUrl": "/events/catalog/ise-barcelona-2026/thumb/photo-01.webp",
        "originalUrl": "/events/catalog/ise-barcelona-2026/original/photo-01.jpg",
        "width": 1477,
        "height": 1108
      },
      {
        "id": "ise-barcelona-2026-photo-02",
        "title": "現場紀錄 02",
        "subtitle": "ISE BARCELONA · AOPEN",
        "alt": "2026 ISE Barcelona 海外參展 - Aopen活動現場照片 02。",
        "imageUrl": "/events/catalog/ise-barcelona-2026/display/photo-02.webp",
        "thumbnailUrl": "/events/catalog/ise-barcelona-2026/thumb/photo-02.webp",
        "originalUrl": "/events/catalog/ise-barcelona-2026/original/photo-02.jpg",
        "width": 1774,
        "height": 2364
      },
      {
        "id": "ise-barcelona-2026-photo-03",
        "title": "現場紀錄 03",
        "subtitle": "ISE BARCELONA · AOPEN",
        "alt": "2026 ISE Barcelona 海外參展 - Aopen活動現場照片 03。",
        "imageUrl": "/events/catalog/ise-barcelona-2026/display/photo-03.webp",
        "thumbnailUrl": "/events/catalog/ise-barcelona-2026/thumb/photo-03.webp",
        "originalUrl": "/events/catalog/ise-barcelona-2026/original/photo-03.jpg",
        "width": 1774,
        "height": 2364
      },
      {
        "id": "ise-barcelona-2026-photo-04",
        "title": "現場紀錄 04",
        "subtitle": "ISE BARCELONA · AOPEN",
        "alt": "2026 ISE Barcelona 海外參展 - Aopen活動現場照片 04。",
        "imageUrl": "/events/catalog/ise-barcelona-2026/display/photo-04.webp",
        "thumbnailUrl": "/events/catalog/ise-barcelona-2026/thumb/photo-04.webp",
        "originalUrl": "/events/catalog/ise-barcelona-2026/original/photo-04.jpg",
        "width": 2000,
        "height": 1501
      },
      {
        "id": "ise-barcelona-2026-photo-05",
        "title": "現場紀錄 05",
        "subtitle": "ISE BARCELONA · AOPEN",
        "alt": "2026 ISE Barcelona 海外參展 - Aopen活動現場照片 05。",
        "imageUrl": "/events/catalog/ise-barcelona-2026/display/photo-05.webp",
        "thumbnailUrl": "/events/catalog/ise-barcelona-2026/thumb/photo-05.webp",
        "originalUrl": "/events/catalog/ise-barcelona-2026/original/photo-05.jpg",
        "width": 1774,
        "height": 2364
      },
      {
        "id": "ise-barcelona-2026-photo-06",
        "title": "現場紀錄 06",
        "subtitle": "ISE BARCELONA · AOPEN",
        "alt": "2026 ISE Barcelona 海外參展 - Aopen活動現場照片 06。",
        "imageUrl": "/events/catalog/ise-barcelona-2026/display/photo-06.webp",
        "thumbnailUrl": "/events/catalog/ise-barcelona-2026/thumb/photo-06.webp",
        "originalUrl": "/events/catalog/ise-barcelona-2026/original/photo-06.jpg",
        "width": 2000,
        "height": 1501
      },
      {
        "id": "ise-barcelona-2026-photo-07",
        "title": "現場紀錄 07",
        "subtitle": "ISE BARCELONA · AOPEN",
        "alt": "2026 ISE Barcelona 海外參展 - Aopen活動現場照片 07。",
        "imageUrl": "/events/catalog/ise-barcelona-2026/display/photo-07.webp",
        "thumbnailUrl": "/events/catalog/ise-barcelona-2026/thumb/photo-07.webp",
        "originalUrl": "/events/catalog/ise-barcelona-2026/original/photo-07.jpg",
        "width": 960,
        "height": 1706
      },
      {
        "id": "ise-barcelona-2026-photo-08",
        "title": "現場紀錄 08",
        "subtitle": "ISE BARCELONA · AOPEN",
        "alt": "2026 ISE Barcelona 海外參展 - Aopen活動現場照片 08。",
        "imageUrl": "/events/catalog/ise-barcelona-2026/display/photo-08.webp",
        "thumbnailUrl": "/events/catalog/ise-barcelona-2026/thumb/photo-08.webp",
        "originalUrl": "/events/catalog/ise-barcelona-2026/original/photo-08.jpg",
        "width": 960,
        "height": 1706
      }
    ]
  },
  {
    "id": "building-show-2025",
    "title": "2025 台北國際建築建材暨產品展",
    "shortTitle": "台北國際建築建材展",
    "category": "展覽紀錄",
    "year": "2025",
    "sourceUrl": "https://www.ezcontw.com/pr_activities/#2025%25E5%25BB%25BA%25E6%259D%2590%25E5%25B1%2595%25E8%25A8%2598%25E8%2580%2585%25E9%2596%258B%25E5%25B1%2595%25E5%2584%2580%25E5%25BC%258F",
    "paragraphs": [
      "2025 台北國際建築建材暨產品展活動紀錄，收錄建材展記者開展儀式與展位交流照片。",
      "易控原始活動頁亦收錄相關媒體報導，可透過來源連結繼續瀏覽。"
    ],
    "photos": [
      {
        "id": "building-show-2025-photo-02",
        "title": "現場紀錄 02",
        "subtitle": "TAIPEI BUILDING SHOW 2025",
        "alt": "2025 台北國際建築建材暨產品展活動現場照片 02。",
        "imageUrl": "/events/catalog/building-show-2025/display/photo-02.webp",
        "thumbnailUrl": "/events/catalog/building-show-2025/thumb/photo-02.webp",
        "originalUrl": "/events/catalog/building-show-2025/original/photo-02.jpg",
        "width": 1477,
        "height": 1108
      },
      {
        "id": "building-show-2025-photo-01",
        "title": "現場紀錄 01",
        "subtitle": "TAIPEI BUILDING SHOW 2025",
        "alt": "2025 台北國際建築建材暨產品展活動現場照片 01。",
        "imageUrl": "/events/catalog/building-show-2025/display/photo-01.webp",
        "thumbnailUrl": "/events/catalog/building-show-2025/thumb/photo-01.webp",
        "originalUrl": "/events/catalog/building-show-2025/original/photo-01.jpg",
        "width": 2000,
        "height": 1500
      },
      {
        "id": "building-show-2025-photo-03",
        "title": "現場紀錄 03",
        "subtitle": "TAIPEI BUILDING SHOW 2025",
        "alt": "2025 台北國際建築建材暨產品展活動現場照片 03。",
        "imageUrl": "/events/catalog/building-show-2025/display/photo-03.webp",
        "thumbnailUrl": "/events/catalog/building-show-2025/thumb/photo-03.webp",
        "originalUrl": "/events/catalog/building-show-2025/original/photo-03.jpg",
        "width": 2000,
        "height": 1125
      },
      {
        "id": "building-show-2025-photo-04",
        "title": "現場紀錄 04",
        "subtitle": "TAIPEI BUILDING SHOW 2025",
        "alt": "2025 台北國際建築建材暨產品展活動現場照片 04。",
        "imageUrl": "/events/catalog/building-show-2025/display/photo-04.webp",
        "thumbnailUrl": "/events/catalog/building-show-2025/thumb/photo-04.webp",
        "originalUrl": "/events/catalog/building-show-2025/original/photo-04.jpg",
        "width": 2000,
        "height": 1500
      },
      {
        "id": "building-show-2025-photo-05",
        "title": "現場紀錄 05",
        "subtitle": "TAIPEI BUILDING SHOW 2025",
        "alt": "2025 台北國際建築建材暨產品展活動現場照片 05。",
        "imageUrl": "/events/catalog/building-show-2025/display/photo-05.webp",
        "thumbnailUrl": "/events/catalog/building-show-2025/thumb/photo-05.webp",
        "originalUrl": "/events/catalog/building-show-2025/original/photo-05.jpg",
        "width": 1705,
        "height": 960
      },
      {
        "id": "building-show-2025-photo-06",
        "title": "現場紀錄 06",
        "subtitle": "TAIPEI BUILDING SHOW 2025",
        "alt": "2025 台北國際建築建材暨產品展活動現場照片 06。",
        "imageUrl": "/events/catalog/building-show-2025/display/photo-06.webp",
        "thumbnailUrl": "/events/catalog/building-show-2025/thumb/photo-06.webp",
        "originalUrl": "/events/catalog/building-show-2025/original/photo-06.jpg",
        "width": 2000,
        "height": 1500
      },
      {
        "id": "building-show-2025-photo-07",
        "title": "現場紀錄 07",
        "subtitle": "TAIPEI BUILDING SHOW 2025",
        "alt": "2025 台北國際建築建材暨產品展活動現場照片 07。",
        "imageUrl": "/events/catalog/building-show-2025/display/photo-07.webp",
        "thumbnailUrl": "/events/catalog/building-show-2025/thumb/photo-07.webp",
        "originalUrl": "/events/catalog/building-show-2025/original/photo-07.jpg",
        "width": 1705,
        "height": 960
      }
    ]
  },
  {
    "id": "tiba-2025",
    "title": "【TIBA】 2025 成果發表會",
    "shortTitle": "TIBA 成果發表會",
    "category": "成果發表",
    "year": "2025",
    "sourceUrl": "https://www.ezcontw.com/pr_activities/#%25E3%2580%2590tiba%25E3%2580%2591-2025-%25E6%2588%2590%25E6%259E%259C%25E7%2599%25BC%25E8%25A1%25A8%25E6%259C%2583",
    "paragraphs": [
      "2025 年 TIBA 成果發表會的現場紀錄，收錄成果分享、講者簡報與活動合影。"
    ],
    "photos": [
      {
        "id": "tiba-2025-photo-01",
        "title": "現場紀錄 01",
        "subtitle": "TIBA 2025",
        "alt": "【TIBA】 2025 成果發表會活動現場照片 01。",
        "imageUrl": "/events/catalog/tiba-2025/display/photo-01.webp",
        "thumbnailUrl": "/events/catalog/tiba-2025/thumb/photo-01.webp",
        "originalUrl": "/events/catalog/tiba-2025/original/photo-01.jpg",
        "width": 1477,
        "height": 1108
      },
      {
        "id": "tiba-2025-photo-02",
        "title": "現場紀錄 02",
        "subtitle": "TIBA 2025",
        "alt": "【TIBA】 2025 成果發表會活動現場照片 02。",
        "imageUrl": "/events/catalog/tiba-2025/display/photo-02.webp",
        "thumbnailUrl": "/events/catalog/tiba-2025/thumb/photo-02.webp",
        "originalUrl": "/events/catalog/tiba-2025/original/photo-02.jpg",
        "width": 1706,
        "height": 960
      },
      {
        "id": "tiba-2025-photo-03",
        "title": "現場紀錄 03",
        "subtitle": "TIBA 2025",
        "alt": "【TIBA】 2025 成果發表會活動現場照片 03。",
        "imageUrl": "/events/catalog/tiba-2025/display/photo-03.webp",
        "thumbnailUrl": "/events/catalog/tiba-2025/thumb/photo-03.webp",
        "originalUrl": "/events/catalog/tiba-2025/original/photo-03.jpg",
        "width": 1706,
        "height": 960
      },
      {
        "id": "tiba-2025-photo-04",
        "title": "現場紀錄 04",
        "subtitle": "TIBA 2025",
        "alt": "【TIBA】 2025 成果發表會活動現場照片 04。",
        "imageUrl": "/events/catalog/tiba-2025/display/photo-04.webp",
        "thumbnailUrl": "/events/catalog/tiba-2025/thumb/photo-04.webp",
        "originalUrl": "/events/catalog/tiba-2025/original/photo-04.jpg",
        "width": 1706,
        "height": 960
      },
      {
        "id": "tiba-2025-photo-05",
        "title": "現場紀錄 05",
        "subtitle": "TIBA 2025",
        "alt": "【TIBA】 2025 成果發表會活動現場照片 05。",
        "imageUrl": "/events/catalog/tiba-2025/display/photo-05.webp",
        "thumbnailUrl": "/events/catalog/tiba-2025/thumb/photo-05.webp",
        "originalUrl": "/events/catalog/tiba-2025/original/photo-05.jpg",
        "width": 1477,
        "height": 1108
      },
      {
        "id": "tiba-2025-photo-06",
        "title": "現場紀錄 06",
        "subtitle": "TIBA 2025",
        "alt": "【TIBA】 2025 成果發表會活動現場照片 06。",
        "imageUrl": "/events/catalog/tiba-2025/display/photo-06.webp",
        "thumbnailUrl": "/events/catalog/tiba-2025/thumb/photo-06.webp",
        "originalUrl": "/events/catalog/tiba-2025/original/photo-06.jpg",
        "width": 1477,
        "height": 1108
      },
      {
        "id": "tiba-2025-photo-07",
        "title": "現場紀錄 07",
        "subtitle": "TIBA 2025",
        "alt": "【TIBA】 2025 成果發表會活動現場照片 07。",
        "imageUrl": "/events/catalog/tiba-2025/display/photo-07.webp",
        "thumbnailUrl": "/events/catalog/tiba-2025/thumb/photo-07.webp",
        "originalUrl": "/events/catalog/tiba-2025/original/photo-07.jpg",
        "width": 1745,
        "height": 937
      }
    ]
  },
  {
    "id": "schneider-leaders-dinner",
    "title": "【施耐德】建築開發商領袖晚宴",
    "shortTitle": "施耐德領袖晚宴",
    "category": "產業交流",
    "year": "",
    "sourceUrl": "https://www.ezcontw.com/pr_activities/#%25E3%2580%2590%25E6%2596%25BD%25E8%2580%2590%25E5%25BE%25B7%25E3%2580%2591%25E5%25BB%25BA%25E7%25AF%2589%25E9%2596%258B%25E7%2599%25BC%25E5%2595%2586%25E9%25A0%2598%25E8%25A2%2596%25E6%2599%259A%25E5%25AE%25B4",
    "paragraphs": [
      "施耐德建築開發商領袖晚宴的活動紀錄，透過晚宴、設備展示與交流影像，回顧建築產業夥伴的相聚時刻。"
    ],
    "photos": [
      {
        "id": "schneider-leaders-dinner-photo-02",
        "title": "現場紀錄 02",
        "subtitle": "SCHNEIDER LEADERS DINNER",
        "alt": "【施耐德】建築開發商領袖晚宴活動現場照片 02。",
        "imageUrl": "/events/catalog/schneider-leaders-dinner/display/photo-02.webp",
        "thumbnailUrl": "/events/catalog/schneider-leaders-dinner/thumb/photo-02.webp",
        "originalUrl": "/events/catalog/schneider-leaders-dinner/original/photo-02.jpg",
        "width": 2000,
        "height": 1334
      },
      {
        "id": "schneider-leaders-dinner-photo-01",
        "title": "現場紀錄 01",
        "subtitle": "SCHNEIDER LEADERS DINNER",
        "alt": "【施耐德】建築開發商領袖晚宴活動現場照片 01。",
        "imageUrl": "/events/catalog/schneider-leaders-dinner/display/photo-01.webp",
        "thumbnailUrl": "/events/catalog/schneider-leaders-dinner/thumb/photo-01.webp",
        "originalUrl": "/events/catalog/schneider-leaders-dinner/original/photo-01.jpg",
        "width": 2000,
        "height": 1500
      },
      {
        "id": "schneider-leaders-dinner-photo-03",
        "title": "現場紀錄 03",
        "subtitle": "SCHNEIDER LEADERS DINNER",
        "alt": "【施耐德】建築開發商領袖晚宴活動現場照片 03。",
        "imageUrl": "/events/catalog/schneider-leaders-dinner/display/photo-03.webp",
        "thumbnailUrl": "/events/catalog/schneider-leaders-dinner/thumb/photo-03.webp",
        "originalUrl": "/events/catalog/schneider-leaders-dinner/original/photo-03.jpg",
        "width": 2000,
        "height": 1334
      },
      {
        "id": "schneider-leaders-dinner-photo-04",
        "title": "現場紀錄 04",
        "subtitle": "SCHNEIDER LEADERS DINNER",
        "alt": "【施耐德】建築開發商領袖晚宴活動現場照片 04。",
        "imageUrl": "/events/catalog/schneider-leaders-dinner/display/photo-04.webp",
        "thumbnailUrl": "/events/catalog/schneider-leaders-dinner/thumb/photo-04.webp",
        "originalUrl": "/events/catalog/schneider-leaders-dinner/original/photo-04.jpg",
        "width": 2000,
        "height": 1334
      },
      {
        "id": "schneider-leaders-dinner-photo-05",
        "title": "現場紀錄 05",
        "subtitle": "SCHNEIDER LEADERS DINNER",
        "alt": "【施耐德】建築開發商領袖晚宴活動現場照片 05。",
        "imageUrl": "/events/catalog/schneider-leaders-dinner/display/photo-05.webp",
        "thumbnailUrl": "/events/catalog/schneider-leaders-dinner/thumb/photo-05.webp",
        "originalUrl": "/events/catalog/schneider-leaders-dinner/original/photo-05.jpg",
        "width": 2000,
        "height": 1334
      },
      {
        "id": "schneider-leaders-dinner-photo-06",
        "title": "現場紀錄 06",
        "subtitle": "SCHNEIDER LEADERS DINNER",
        "alt": "【施耐德】建築開發商領袖晚宴活動現場照片 06。",
        "imageUrl": "/events/catalog/schneider-leaders-dinner/display/photo-06.webp",
        "thumbnailUrl": "/events/catalog/schneider-leaders-dinner/thumb/photo-06.webp",
        "originalUrl": "/events/catalog/schneider-leaders-dinner/original/photo-06.jpg",
        "width": 2000,
        "height": 1125
      },
      {
        "id": "schneider-leaders-dinner-photo-07",
        "title": "現場紀錄 07",
        "subtitle": "SCHNEIDER LEADERS DINNER",
        "alt": "【施耐德】建築開發商領袖晚宴活動現場照片 07。",
        "imageUrl": "/events/catalog/schneider-leaders-dinner/display/photo-07.webp",
        "thumbnailUrl": "/events/catalog/schneider-leaders-dinner/thumb/photo-07.webp",
        "originalUrl": "/events/catalog/schneider-leaders-dinner/original/photo-07.jpg",
        "width": 2000,
        "height": 1334
      },
      {
        "id": "schneider-leaders-dinner-photo-08",
        "title": "現場紀錄 08",
        "subtitle": "SCHNEIDER LEADERS DINNER",
        "alt": "【施耐德】建築開發商領袖晚宴活動現場照片 08。",
        "imageUrl": "/events/catalog/schneider-leaders-dinner/display/photo-08.webp",
        "thumbnailUrl": "/events/catalog/schneider-leaders-dinner/thumb/photo-08.webp",
        "originalUrl": "/events/catalog/schneider-leaders-dinner/original/photo-08.jpg",
        "width": 2000,
        "height": 1125
      }
    ]
  },
  {
    "id": "tainan-showroom-visit",
    "title": "吳武易建築師與潤鴻建設參訪易控台南展間",
    "shortTitle": "台南展間參訪",
    "category": "展間參訪",
    "year": "",
    "sourceUrl": "https://www.ezcontw.com/pr_activities/#%25E5%2590%25B3%25E6%25AD%25A6%25E6%2598%2593%25E5%25BB%25BA%25E7%25AF%2589%25E5%25B8%25AB%25E8%2588%2587%25E6%25BD%25A4%25E9%25B4%25BB%25E5%25BB%25BA%25E8%25A8%25AD%25E5%258F%2583%25E8%25A8%25AA%25E6%2598%2593%25E6%258E%25A7%25E5%258F%25B0%25E5%258D%2597%25E5%25B1%2595%25E9%2596%2593",
    "paragraphs": [
      "吳武易建築師與潤鴻建設參訪易控台南展間，透過現場簡報、設備展示與互動，留下展間交流的活動紀錄。"
    ],
    "photos": [
      {
        "id": "tainan-showroom-visit-photo-02",
        "title": "現場紀錄 02",
        "subtitle": "TAINAN SHOWROOM VISIT",
        "alt": "吳武易建築師與潤鴻建設參訪易控台南展間活動現場照片 02。",
        "imageUrl": "/events/catalog/tainan-showroom-visit/display/photo-02.webp",
        "thumbnailUrl": "/events/catalog/tainan-showroom-visit/thumb/photo-02.webp",
        "originalUrl": "/events/catalog/tainan-showroom-visit/original/photo-02.jpg",
        "width": 2000,
        "height": 1125
      },
      {
        "id": "tainan-showroom-visit-photo-04",
        "title": "現場紀錄 04",
        "subtitle": "TAINAN SHOWROOM VISIT",
        "alt": "吳武易建築師與潤鴻建設參訪易控台南展間活動現場照片 04。",
        "imageUrl": "/events/catalog/tainan-showroom-visit/display/photo-04.webp",
        "thumbnailUrl": "/events/catalog/tainan-showroom-visit/thumb/photo-04.webp",
        "originalUrl": "/events/catalog/tainan-showroom-visit/original/photo-04.jpg",
        "width": 2000,
        "height": 1125
      },
      {
        "id": "tainan-showroom-visit-photo-01",
        "title": "現場紀錄 01",
        "subtitle": "TAINAN SHOWROOM VISIT",
        "alt": "吳武易建築師與潤鴻建設參訪易控台南展間活動現場照片 01。",
        "imageUrl": "/events/catalog/tainan-showroom-visit/display/photo-01.webp",
        "thumbnailUrl": "/events/catalog/tainan-showroom-visit/thumb/photo-01.webp",
        "originalUrl": "/events/catalog/tainan-showroom-visit/original/photo-01.jpg",
        "width": 2000,
        "height": 1125
      },
      {
        "id": "tainan-showroom-visit-photo-03",
        "title": "現場紀錄 03",
        "subtitle": "TAINAN SHOWROOM VISIT",
        "alt": "吳武易建築師與潤鴻建設參訪易控台南展間活動現場照片 03。",
        "imageUrl": "/events/catalog/tainan-showroom-visit/display/photo-03.webp",
        "thumbnailUrl": "/events/catalog/tainan-showroom-visit/thumb/photo-03.webp",
        "originalUrl": "/events/catalog/tainan-showroom-visit/original/photo-03.jpg",
        "width": 2000,
        "height": 1125
      },
      {
        "id": "tainan-showroom-visit-photo-05",
        "title": "現場紀錄 05",
        "subtitle": "TAINAN SHOWROOM VISIT",
        "alt": "吳武易建築師與潤鴻建設參訪易控台南展間活動現場照片 05。",
        "imageUrl": "/events/catalog/tainan-showroom-visit/display/photo-05.webp",
        "thumbnailUrl": "/events/catalog/tainan-showroom-visit/thumb/photo-05.webp",
        "originalUrl": "/events/catalog/tainan-showroom-visit/original/photo-05.jpg",
        "width": 2000,
        "height": 1125
      },
      {
        "id": "tainan-showroom-visit-photo-06",
        "title": "現場紀錄 06",
        "subtitle": "TAINAN SHOWROOM VISIT",
        "alt": "吳武易建築師與潤鴻建設參訪易控台南展間活動現場照片 06。",
        "imageUrl": "/events/catalog/tainan-showroom-visit/display/photo-06.webp",
        "thumbnailUrl": "/events/catalog/tainan-showroom-visit/thumb/photo-06.webp",
        "originalUrl": "/events/catalog/tainan-showroom-visit/original/photo-06.jpg",
        "width": 2000,
        "height": 1125
      },
      {
        "id": "tainan-showroom-visit-photo-07",
        "title": "現場紀錄 07",
        "subtitle": "TAINAN SHOWROOM VISIT",
        "alt": "吳武易建築師與潤鴻建設參訪易控台南展間活動現場照片 07。",
        "imageUrl": "/events/catalog/tainan-showroom-visit/display/photo-07.webp",
        "thumbnailUrl": "/events/catalog/tainan-showroom-visit/thumb/photo-07.webp",
        "originalUrl": "/events/catalog/tainan-showroom-visit/original/photo-07.jpg",
        "width": 2000,
        "height": 1125
      }
    ]
  }
] satisfies GalleryEvent[]

export const galleryEvents: GalleryEvent[] = [
  { ...schneiderEvent, shortTitle: '2026 施耐德晚宴', category: '產業交流' },
  ...catalogEvents,
].map(event => ({
  ...event,
  reports: eventReports[event.id] ?? [],
  photos: event.photos.map(photo => ({
    ...photo,
    imageUrl: localAsset(photo.imageUrl),
    thumbnailUrl: localAsset(photo.thumbnailUrl),
    originalUrl: localAsset(photo.originalUrl),
  })),
}))
