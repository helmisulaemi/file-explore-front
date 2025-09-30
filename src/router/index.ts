import { createRouter, createWebHistory } from "vue-router";
import { isAuthenticated } from "../utils/auth";
import LoginView from "../views/auth/Login.vue";
import RegisterView from "../views/auth/Register.vue";
import DashboardView from "../views/dashboard/Index.vue";

const routes = [
  {
    path: "/",
    redirect: "/login"
  },
  { 
    path: "/login", 
    component: LoginView,
    meta: { guestOnly: true }, 
  },
  { 
    path: "/register", 
    component: RegisterView,
    meta: { guestOnly: true }, 
  },
//   { path: "/login", component: LoginView },
  { path: "/dashboard", 
    component: DashboardView,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Middleware guard
router.beforeEach((to, from, next) => {
  const loggedIn = isAuthenticated();

  if (to.meta.requiresAuth && !loggedIn) {
    return next("/login");
  }

  if (to.meta.guestOnly && loggedIn) {
    return next("/dashboard");
  }

  next();
});


export default router;
