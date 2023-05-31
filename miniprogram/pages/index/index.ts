// audioPage.ts

import { getAudioUrl, search } from "../../utils/util";

// index.ts

interface SearchResult {
  notFound?: boolean;
  entries?: Entry[];
  pronunciations?: string[];
}

interface Entry {
  annotation: string;
  category: string;
  definitions: Definition[];
  id: number;
  phoneticCharacters: boolean;
  pinyin: string;
  word: string;
}

interface Definition {
  definition: string;
  examples: string[];
}

type Category = {
  name: string;
  subcategories: string[];
};

interface IData {
  searchResult: SearchResult | null;
  keyword: string;
  audioUrls: Record<number, string>;
  categories: Category[];
}

interface IAppOption {
  globalData: {
    searchResult: SearchResult | null;
  };
  searchEntry: (keyword: string, callback: (result: SearchResult) => void) => void;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

Page<IData, {}>({
  data: {
    searchResult: null,
    keyword: '',
    audioUrls: {},
    categories: [
      {
        "name": "自然科学",
        "subcategories": [
          "天文",
          "气象",
          "地理",
          "农业",
          "植物",
          "动物"
        ]
      },
      {
        "name": "风俗习惯",
        "subcategories": [
          "时间、节令",
          "人品",
          "亲属称谓",
          "婚育",
          "丧葬"
        ]
      },
      {
        "name": "人体与健康",
        "subcategories": [
          "人体",
          "人体动作",
          "疾病、医药"
        ]
      },
      {
        "name": "生活方式与文化",
        "subcategories": [
          "器具",
          "饮食",
          "房舍",
          "服饰",
          "交通、邮电",
          "商业",
          "学校教育",
          "祭祀",
          "文体娱乐"
        ]
      },
      {
        "name": "语言与交流",
        "subcategories": [
          "交际",
          "一般动作",
          "一般名物",
          "性质、感觉、状态、颜色",
          "方位",
          "指代",
          "量词",
          "副词",
          "介词",
          "连词、助词",
          "熟语"
        ]
      }
    ]
  },

  onLoad() {
    wx.cloud.init({
      env: 'test-x1dzi',
      traceUser: true,
    });    
  },
  
  onKeywordInput(event: any): void {
    if (event.detail.value !== this.data.keyword) {
      this.setData({
        searchResult: null,
        keyword: event.detail.value
      });
    }
  },

  onPlay(event: WechatMiniprogram.TouchEvent): void {
    let id = parseInt(event.currentTarget.id.replace("player-", ""));
    // Create an inner audio context
    const audioContext = wx.createInnerAudioContext({
      useWebAudioImplement: true,
    });

    // Set the audio URL
    console.log("id: " + id);
    console.log(this.data.audioUrls[id]);
    audioContext.src = this.data.audioUrls[id];

    // Start playing the audio
    audioContext.play();

    // Save the audio context in the page data
    this.setData({
      audioContext: audioContext,
    });
  },
  
  onSearch(): void {
    const keyword = this.data.keyword.trim();
    
    if (keyword === '') {
      wx.showToast({
        title: '请输入汉字或拼音',
        icon: 'none'
      });
      return;
    }
    
    wx.showLoading({
      title: '搜索中...'
    });
  
    console.log("Searching keyword: " + keyword);
    search(keyword, (result: SearchResult): void => {
      wx.hideLoading();
      if (result.entries) {
        let audioUrls: Record<number, string> = {};
        result.entries.forEach(async entry => {
          // Make a request to the server to fetch the m4a audio
          getAudioUrl(entry.id)
          .then((res: { audioUrl: string }) => {
            console.log("audioUrl:", res.audioUrl);
            audioUrls[entry.id] = res.audioUrl;
          })
          .catch((err: any) => {
            console.error('Failed to fetch audio:', err);
          });
          await sleep(10); 
        });
        // Save the audio URL in the page data
        this.setData({
          audioUrls: audioUrls,
        });
      }
      this.setData({
        searchResult: result
      });
    });
  }
});

/*

  onUnload() {
    const audioContext = this.data.audioContext;

    // Stop playing the audio and release the audio context
    if (audioContext) {
      audioContext.stop();
      audioContext.destroy();
    }
  },
});
*/