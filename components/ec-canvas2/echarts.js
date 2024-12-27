const echarts = require('./echarts/core');
const { LineChart } = require('./echarts/charts');
const {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent
} = require('./echarts/components');
const { LabelLayout, UniversalTransition } = require('./echarts/features');
const { CanvasRenderer } = require('./echarts/renderers');

// 注册必须的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LineChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer
]);

module.exports = echarts; 