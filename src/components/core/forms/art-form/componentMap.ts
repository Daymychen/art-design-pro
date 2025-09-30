import {
  ElInput,
  ElInputNumber,
  ElSelect,
  ElSwitch,
  ElCheckbox,
  ElCheckboxGroup,
  ElRadioGroup,
  ElDatePicker,
  ElRate,
  ElSlider,
  ElCascader,
  ElTimePicker,
  ElTimeSelect,
  ElTreeSelect
} from 'element-plus'

/**
 * 表单组件映射表
 * 用于将字符串类型映射到具体的 Element Plus 组件
 */
export const componentMap = {
  input: ElInput, // 输入框
  number: ElInputNumber, // 数字输入框
  select: ElSelect, // 选择器
  switch: ElSwitch, // 开关
  checkbox: ElCheckbox, // 复选框
  checkboxgroup: ElCheckboxGroup, // 复选框组
  radiogroup: ElRadioGroup, // 单选框组
  date: ElDatePicker, // 日期选择器
  daterange: ElDatePicker, // 日期范围选择器
  datetime: ElDatePicker, // 日期时间选择器
  datetimerange: ElDatePicker, // 日期时间范围选择器
  rate: ElRate, // 评分
  slider: ElSlider, // 滑块
  cascader: ElCascader, // 级联选择器
  timepicker: ElTimePicker, // 时间选择器
  timeselect: ElTimeSelect, // 时间选择
  treeselect: ElTreeSelect // 树选择器
}

export type ComponentMapKeys = keyof typeof componentMap
