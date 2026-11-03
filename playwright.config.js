import {defineConfig,devices} from '@playwright/test';
export default defineConfig({
  testDir:'tests/browser',timeout:90000,fullyParallel:true,workers:2,
  reporter:'list',
  use:{baseURL:'http://127.0.0.1:4173',trace:'retain-on-failure'},
  webServer:{command:'python3 -m http.server 4173 --directory docs',url:'http://127.0.0.1:4173',reuseExistingServer:true},
  projects:[
    {name:'chrome-phone',use:{...devices['iPhone 13'],defaultBrowserType:'chromium',launchOptions:{channel:'chrome'}}},
    ...(process.env.TUNEVILLE_WEBKIT?[{name:'webkit-phone',use:{...devices['iPhone 13'],defaultBrowserType:'webkit'}}]:[]),
  ],
});
