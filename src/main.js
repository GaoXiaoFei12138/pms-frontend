import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import './index.css'; // Tailwind CSS
import '@/styles/index.scss'
import * as ELIcons from '@element-plus/icons-vue'

createApp(App)
    .use(router)
    .use(ElementPlus)
    .use(ELIcons)
    .use()
    .mount('#app');