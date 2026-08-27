import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// 讓少數還在用 Vuetify 元件（例如任務紀錄頁的月曆）的地方，
// 主色也能跟上像素風的粉紅／黃配色，不要留著 Vuetify 預設的藍色
const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'pixelTheme',
    themes: {
      pixelTheme: {
        dark: false,
        colors: {
          primary: '#ec1e6f',
          secondary: '#7fd8e8',
        }
      }
    }
  }
})

export default vuetify
