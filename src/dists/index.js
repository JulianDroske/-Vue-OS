import Vue from 'vue'

import DragResize from './vue-drag-resize'
import Menujs from './menujs'
import Term from './term'

Vue.use(Menujs)

Vue.component('DragResize', DragResize)
Vue.component('JsTerminal', Term)
