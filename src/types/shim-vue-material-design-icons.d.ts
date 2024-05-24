declare module 'vue-material-design-icons/*.vue' {
  import type { DefineComponent } from 'vue';

  const IconVue: DefineComponent<{
    size?: number;
    fillColor?: string;
    title?: string;
  }>;
  export default IconVue;
}
