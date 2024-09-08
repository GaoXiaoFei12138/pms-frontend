import { createRouter, createWebHistory } from 'vue-router';
import Login from '../components/UserLogin.vue';
import Register from '../components/UserRegister.vue';
import ForgotPassword from '../components/ForgotPassword.vue';
import Dashboard from '../components/UserDashboard.vue';
import NotFound from '../views/NotFound.vue';

const routes = [
  { path: '/', component: Login },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/forgot-password', component: ForgotPassword },
  { path: '/dashboard', component: Dashboard },
  { path: '/:catchAll(.*)', component: NotFound }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;