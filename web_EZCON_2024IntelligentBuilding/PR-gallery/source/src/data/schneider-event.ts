export type EventPhoto = {
  id: string
  title: string
  subtitle: string
  alt: string
  imageUrl: string
  thumbnailUrl: string
  originalUrl: string
  width: number
  height: number
}

export type GalleryEvent = {
  id: string
  title: string
  shortTitle?: string
  category?: string
  year: string
  sourceUrl: string
  overviewOnly?: boolean
  reports?: { media: string; url: string }[]
  paragraphs: string[]
  photos: EventPhoto[]
}

export const schneiderEvent = {
  "id": "schneider-2026",
  "title": "2026 施耐德建築開發商領袖晚宴",
  "shortTitle": "施耐德領袖晚宴",
  "category": "產業交流",
  "year": "2026",
  "sourceUrl": "https://www.ezcontw.com/2026-shi-nai-de-jian-zhu-kai-fa-shang-ling-xiu-wan-yan/",
  "paragraphs": [
    "易控參與施耐德電機主辦的建築開發商領袖晚宴，與產業夥伴交流住宅永續發展、建築供電設施及相關設備的應用。",
    "現場設有實體設備展示，讓參與者了解低壓配電與用電安全等解決方案，並與專業團隊交換技術經驗。",
    "這次交流也延續易控對智慧建築的關注：結合系統整合經驗，持續探索兼顧節能、安全與永續管理的建築應用。"
  ],
  "photos": [
    {
      "id": "schneider-2026-photo-07",
      "title": "技術交流",
      "subtitle": "2026 SCHNEIDER DINNER",
      "alt": "展示人員在產品看板與設備展台旁，與三位參與者進行交流。",
      "imageUrl": "/events/schneider-2026/display/photo-07.webp",
      "thumbnailUrl": "/events/schneider-2026/thumb/photo-07.webp",
      "originalUrl": "/events/schneider-2026/original/photo-07.jpg",
      "width": 1477,
      "height": 1108
    },
    {
      "id": "schneider-2026-photo-01",
      "title": "晚宴舞台",
      "subtitle": "2026 SCHNEIDER DINNER",
      "alt": "晚宴舞台上的講者，背後螢幕顯示「綠建未來 永續共築」活動主題。",
      "imageUrl": "/events/schneider-2026/display/photo-01.webp",
      "thumbnailUrl": "/events/schneider-2026/thumb/photo-01.webp",
      "originalUrl": "/events/schneider-2026/original/photo-01.jpg",
      "width": 2000,
      "height": 1501
    },
    {
      "id": "schneider-2026-photo-02",
      "title": "現場交流",
      "subtitle": "2026 SCHNEIDER DINNER",
      "alt": "參與者在施耐德電機展示區聆聽設備與產品介紹。",
      "imageUrl": "/events/schneider-2026/display/photo-02.webp",
      "thumbnailUrl": "/events/schneider-2026/thumb/photo-02.webp",
      "originalUrl": "/events/schneider-2026/original/photo-02.jpg",
      "width": 2000,
      "height": 1500
    },
    {
      "id": "schneider-2026-photo-03",
      "title": "展台介紹",
      "subtitle": "2026 SCHNEIDER DINNER",
      "alt": "展示人員在設備展台前與參與者交流，旁邊設有產品介紹看板。",
      "imageUrl": "/events/schneider-2026/display/photo-03.webp",
      "thumbnailUrl": "/events/schneider-2026/thumb/photo-03.webp",
      "originalUrl": "/events/schneider-2026/original/photo-03.jpg",
      "width": 2000,
      "height": 1500
    },
    {
      "id": "schneider-2026-photo-04",
      "title": "設備展示",
      "subtitle": "2026 SCHNEIDER DINNER",
      "alt": "參與者圍繞設備展台，聆聽現場展示與說明。",
      "imageUrl": "/events/schneider-2026/display/photo-04.webp",
      "thumbnailUrl": "/events/schneider-2026/thumb/photo-04.webp",
      "originalUrl": "/events/schneider-2026/original/photo-04.jpg",
      "width": 1477,
      "height": 1108
    },
    {
      "id": "schneider-2026-photo-05",
      "title": "近距離解說",
      "subtitle": "2026 SCHNEIDER DINNER",
      "alt": "展示人員近距離解說展台上的電力設備，參與者在旁觀看。",
      "imageUrl": "/events/schneider-2026/display/photo-05.webp",
      "thumbnailUrl": "/events/schneider-2026/thumb/photo-05.webp",
      "originalUrl": "/events/schneider-2026/original/photo-05.jpg",
      "width": 1108,
      "height": 1477
    },
    {
      "id": "schneider-2026-photo-06",
      "title": "活動合影",
      "subtitle": "2026 SCHNEIDER DINNER",
      "alt": "兩位參與者在「綠建未來 永續共築」活動背板前合影並比出讚的手勢。",
      "imageUrl": "/events/schneider-2026/display/photo-06.webp",
      "thumbnailUrl": "/events/schneider-2026/thumb/photo-06.webp",
      "originalUrl": "/events/schneider-2026/original/photo-06.jpg",
      "width": 1477,
      "height": 1108
    },
    {
      "id": "schneider-2026-photo-08",
      "title": "展示現場",
      "subtitle": "2026 SCHNEIDER DINNER",
      "alt": "參與者在一排施耐德電機產品展台前觀看展示。",
      "imageUrl": "/events/schneider-2026/display/photo-08.webp",
      "thumbnailUrl": "/events/schneider-2026/thumb/photo-08.webp",
      "originalUrl": "/events/schneider-2026/original/photo-08.jpg",
      "width": 2000,
      "height": 1500
    },
    {
      "id": "schneider-2026-photo-09",
      "title": "合影留念",
      "subtitle": "2026 SCHNEIDER DINNER",
      "alt": "兩位參與者在施耐德電機晚宴活動背板前合影。",
      "imageUrl": "/events/schneider-2026/display/photo-09.webp",
      "thumbnailUrl": "/events/schneider-2026/thumb/photo-09.webp",
      "originalUrl": "/events/schneider-2026/original/photo-09.jpg",
      "width": 1477,
      "height": 1108
    }
  ]
} satisfies GalleryEvent
